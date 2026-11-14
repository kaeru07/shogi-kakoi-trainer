#!/usr/bin/env node
// レビュー材料づくり：集約と review-pack ブランチへの保存。
//
// review-out/ に集まった材料（checks.json / screens.json / step-results.json）を
// summary.json と summary.md にまとめ、review-pack ブランチの
// {日付(JST)}_{コミットSHA先頭7桁}/ へ保存する。直近10件だけ残す。
// 不合格項目があれば、保存したうえで exit 1（ワークフローを最後に失敗扱いにする）。
//
// 接続情報:
//   - GitHub Actions 上では GH_PACK_TOKEN（自動発行の GITHUB_TOKEN）と
//     GITHUB_REPOSITORY を使う。リポジトリに登録した Secrets は使わない。
//   - ローカル検証用に REVIEW_PACK_REPO_URL でリモートURLを上書きできる。
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'review-out')

function readJson(name) {
  const p = join(outDir, name)
  if (!existsSync(p)) return null
  try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null }
}

const checks = readJson('checks.json')
const screens = readJson('screens.json')
const steps = readJson('step-results.json') ?? {}

const sha = (process.env.GITHUB_SHA ?? checks?.commit ?? 'unknown').slice(0, 7)
const fullSha = process.env.GITHUB_SHA ?? checks?.commit ?? null
const branch = process.env.GITHUB_REF_NAME ?? checks?.branch ?? null
const dateJst = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())
const folder = `${dateJst}_${sha}`
const runAt = new Date().toISOString()

/* ---------- 総合判定 ---------- */
const problems = []
for (const key of ['deps', 'lint', 'build']) {
  if (steps[key] !== undefined && steps[key] !== 'success') problems.push(`ワークフロー手順 ${key} が ${steps[key]}`)
}
if (!checks) problems.push('checks.json がありません')
else if (checks.overall !== 'pass') {
  for (const [name, sec] of Object.entries(checks.checks ?? {})) {
    if (sec && typeof sec === 'object' && ['fail', 'missing', 'error'].includes(sec.status)) {
      problems.push(`チェック ${name}: ${sec.status}${sec.note ? `（${sec.note}）` : ''}`)
    }
  }
}
if (!screens) problems.push('screens.json がありません')
else {
  for (const r of screens.results ?? []) {
    if (r.status === 'error') problems.push(`画面撮影 ${r.route}: ${r.note ?? 'error'}`)
  }
}
const overall = problems.length === 0 ? 'pass' : 'fail'

/* ---------- summary ---------- */
const summary = {
  folder,
  commit: fullSha,
  branch,
  runAt,
  overall,
  problems,
  steps,
  checks,
  screenshots: screens,
}
const staging = join(root, 'review-pack-staging', folder)
rmSync(join(root, 'review-pack-staging'), { recursive: true, force: true })
mkdirSync(staging, { recursive: true })
writeFileSync(join(staging, 'summary.json'), JSON.stringify(summary, null, 2))

{
  const md = []
  md.push(`# レビューパック ${folder}`)
  md.push('')
  md.push(`- コミット: ${fullSha ?? '(不明)'}`)
  md.push(`- ブランチ: ${branch ?? '(不明)'}`)
  md.push(`- 実行日時: ${runAt}`)
  md.push(`- 総合判定: ${overall === 'pass' ? '✅ 合格' : '❌ 不合格'}`)
  md.push('')
  if (problems.length) {
    md.push('## 不合格・問題の項目')
    for (const p of problems) md.push(`- ${p}`)
    md.push('')
  }
  md.push('## ワークフロー手順')
  for (const [k, v] of Object.entries(steps)) md.push(`- ${k}: ${v}`)
  md.push('')
  if (checks) {
    md.push('## 共通チェック')
    const c = checks.checks ?? {}
    if (c.icon) md.push(`- アイコン: ${c.icon.status}（${c.icon.width}x${c.icon.height} / ${c.icon.colorMode} / アルファ${c.icon.hasAlpha ? 'あり' : 'なし'}）`)
    if (c.ios) md.push(`- iOS設定: ${c.ios.status}（Bundle ID: ${(c.ios.bundleIdsFound ?? []).join(', ')} / 最低OS: ${(c.ios.minOs ?? []).join(', ')} / 端末: ${(c.ios.targetedDeviceFamily ?? []).join(', ')} / PrivacyInfo: ${c.ios.privacyInfoExists ? 'あり' : 'なし'}）`)
    if (c.unfinished) md.push(`- 未完成表示: ${c.unfinished.status}（合計 ${c.unfinished.total} 件）`)
    if (c.storeCopy) md.push(`- ストア掲載文: ${c.storeCopy.status}${c.storeCopy.note ? `（${c.storeCopy.note}）` : ''}`)
    if (c.appChecks) {
      md.push('')
      md.push('## アプリ固有チェック')
      for (const s of c.appChecks.scripts ?? []) md.push(`- ${s.script} ${s.args.join(' ')}: ${s.status} (exit ${s.exitCode})`)
    }
    md.push('')
  }
  if (screens) {
    md.push('## 画面撮影')
    for (const r of screens.results ?? []) md.push(`- ${r.route}: ${r.status}${r.file ? ` (${r.file})` : ''}${r.note ? ` - ${r.note}` : ''}`)
    md.push('')
  }
  writeFileSync(join(staging, 'summary.md'), md.join('\n'))
}

for (const sub of ['screens', 'icon']) {
  const src = join(outDir, sub)
  if (existsSync(src)) cpSync(src, join(staging, sub), { recursive: true })
}

/* ---------- review-pack ブランチへ保存 ---------- */
function git(args, cwd, { quiet = false } = {}) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' })
  if (r.status !== 0 && !quiet) {
    const msg = (r.stderr || r.stdout || '').replaceAll(process.env.GH_PACK_TOKEN ?? '\0', '***')
    console.error(`git ${args[0]} 失敗: ${msg.slice(-500)}`)
  }
  return r
}

const repoUrl = process.env.REVIEW_PACK_REPO_URL
  ?? `https://x-access-token:${process.env.GH_PACK_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
const tmp = mkdtempSync(join(tmpdir(), 'review-pack-'))
let published = false
try {
  if (git(['clone', '--quiet', '--no-checkout', repoUrl, tmp]).status === 0) {
    git(['config', 'user.name', 'github-actions[bot]'], tmp)
    git(['config', 'user.email', 'github-actions[bot]@users.noreply.github.com'], tmp)
    const fetch = git(['fetch', '--quiet', 'origin', 'review-pack'], tmp, { quiet: true })
    if (fetch.status === 0) {
      git(['checkout', '--quiet', '-b', 'review-pack', 'FETCH_HEAD'], tmp)
    } else {
      git(['checkout', '--quiet', '--orphan', 'review-pack'], tmp)
    }
    cpSync(staging, join(tmp, folder), { recursive: true })
    // 直近10件だけ残す
    const dirs = readdirSync(tmp, { withFileTypes: true })
      .filter(d => d.isDirectory() && /^\d{4}-\d{2}-\d{2}_[0-9a-f]{7}$/.test(d.name))
      .map(d => d.name)
      .sort()
      .reverse()
    for (const old of dirs.slice(10)) rmSync(join(tmp, old), { recursive: true, force: true })
    git(['add', '-A'], tmp)
    const commit = git(['commit', '--quiet', '-m', `review-pack: ${folder}`], tmp)
    if (commit.status === 0) {
      published = git(['push', '--quiet', 'origin', 'review-pack'], tmp).status === 0
    } else {
      console.error('コミットに失敗しました（変更なしの可能性）')
    }
  } else {
    console.error('review-pack 用の clone に失敗しました')
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`review-pack: folder=${folder} overall=${overall} published=${published}`)
if (!published) process.exit(2)
process.exit(overall === 'pass' ? 0 : 1)
