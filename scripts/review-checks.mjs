#!/usr/bin/env node
// レビュー材料づくり：共通チェック（Next.js + Capacitor 構成の全アプリ共通）。
//
// チェック内容:
//   1. アイコン      : 1024px・カラーモード・アルファの有無、180/60/40/29px の縮小版PNG
//   2. iOS設定       : TARGETED_DEVICE_FAMILY・Bundle ID・最低OS、Info.plist の
//                      UIRequiredDeviceCapabilities・表示名・開発言語、
//                      capacitor.config.ts / codemagic.yaml との Bundle ID 一致、
//                      PrivacyInfo.xcprivacy の有無
//   3. 未完成表示    : 「Coming Soon」「準備中」「TODO」の件数と場所
//   4. ストア掲載文  : store/ja/ の name(30)・subtitle(30)・keywords(100)・
//                      promotional_text(170)・description(4000) の文字数とバイト数、
//                      キーワードと名前・サブタイトルの重複。無ければ「未作成」
//   5. アプリ固有    : scripts/verify-*.mjs があればすべて実行して結果を記録
//                      （追加引数は review/verify-args.json でファイル名ごとに指定可）
//
// 結果は review-out/checks.json に書く。このスクリプト自体は常に exit 0 で、
// 合否は checks.json の overall に持たせる（ワークフローの最終ステップで失敗扱いにする）。
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'review-out')
const iconOutDir = join(outDir, 'icon')
mkdirSync(iconOutDir, { recursive: true })

const checks = {}
const now = new Date().toISOString()

function section(name, fn) {
  try {
    checks[name] = fn()
  } catch (e) {
    checks[name] = { status: 'error', error: String(e && e.message ? e.message : e) }
  }
  const s = checks[name]
  console.log(`[${name}] ${s.status}${s.note ? ` - ${s.note}` : ''}`)
}

/* ---------------- 1. アイコン ---------------- */

function parsePng(buf) {
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error('PNG ではありません')
  const width = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  const bitDepth = buf[24]
  const colorType = buf[25]
  let hasTrns = false
  let off = 8
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString('ascii', off + 4, off + 8)
    if (type === 'tRNS') hasTrns = true
    if (type === 'IEND') break
    off += 12 + len
  }
  const modes = { 0: 'grayscale', 2: 'rgb', 3: 'palette', 4: 'grayscale+alpha', 6: 'rgba' }
  return {
    width,
    height,
    bitDepth,
    colorType,
    colorMode: modes[colorType] ?? `unknown(${colorType})`,
    hasAlpha: colorType === 4 || colorType === 6 || hasTrns,
  }
}

async function resizePng(src, size, dest) {
  try {
    const sharp = (await import('sharp')).default
    await sharp(src).resize(size, size).png().toFile(dest)
    return 'sharp'
  } catch { /* 次の手段へ */ }
  for (const cmd of ['magick', 'convert']) {
    const r = spawnSync(cmd, [src, '-resize', `${size}x${size}`, dest], { encoding: 'utf8' })
    if (r.status === 0 && existsSync(dest)) return 'imagemagick'
  }
  const py = spawnSync('python3', [
    '-c',
    'from PIL import Image; import sys; Image.open(sys.argv[1]).resize((int(sys.argv[2]), int(sys.argv[2]))).save(sys.argv[3])',
    src, String(size), dest,
  ], { encoding: 'utf8' })
  if (py.status === 0 && existsSync(dest)) return 'python-pillow'
  return null
}

function findAppIcon() {
  const setDir = join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset')
  if (!existsSync(setDir)) return null
  const pngs = readdirSync(setDir).filter(f => f.toLowerCase().endsWith('.png'))
  if (pngs.length === 0) return null
  // 最も大きいファイルを原寸アイコンとみなす
  let best = null
  for (const f of pngs) {
    const p = join(setDir, f)
    const size = statSync(p).size
    if (!best || size > best.size) best = { path: p, file: f, size }
  }
  return best
}

let iconInfo = null
{
  const found = findAppIcon()
  if (!found) {
    checks.icon = { status: 'error', error: 'AppIcon.appiconset に PNG がありません' }
    console.log('[icon] error - アイコンが見つかりません')
  } else {
    try {
      iconInfo = { file: found.file, ...parsePng(readFileSync(found.path)) }
      const resizes = {}
      let resizeMethod = null
      for (const size of [180, 60, 40, 29]) {
        const dest = join(iconOutDir, `icon-${size}.png`)
        const method = await resizePng(found.path, size, dest)
        resizes[String(size)] = method ? `icon/icon-${size}.png` : null
        if (method) resizeMethod = method
      }
      iconInfo.resizes = resizes
      iconInfo.resizeMethod = resizeMethod
      const sizeOk = iconInfo.width === 1024 && iconInfo.height === 1024
      const resizeOk = Object.values(resizes).every(v => v !== null)
      checks.icon = {
        status: sizeOk && resizeOk ? 'pass' : 'fail',
        ...iconInfo,
        note: !sizeOk ? `サイズが 1024x1024 ではありません (${iconInfo.width}x${iconInfo.height})`
          : !resizeOk ? '一部の縮小版PNGを生成できませんでした'
          : undefined,
      }
    } catch (e) {
      checks.icon = { status: 'error', error: String(e && e.message ? e.message : e), file: found.file }
    }
    console.log(`[icon] ${checks.icon.status}`)
  }
}

/* ---------------- 2. iOS設定 ---------------- */

section('ios', () => {
  const data = {}
  const pbxPath = join(root, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj')
  if (existsSync(pbxPath)) {
    const pbx = readFileSync(pbxPath, 'utf8')
    const uniq = (re) => [...new Set([...pbx.matchAll(re)].map(m => m[1]))]
    data.targetedDeviceFamily = uniq(/TARGETED_DEVICE_FAMILY = "?([^";]+)"?;/g)
    data.bundleIdXcode = uniq(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/g).map(s => s.trim())
    data.minOs = uniq(/IPHONEOS_DEPLOYMENT_TARGET = ([^;]+);/g).map(s => s.trim())
  }
  const plistPath = join(root, 'ios', 'App', 'App', 'Info.plist')
  if (existsSync(plistPath)) {
    const plist = readFileSync(plistPath, 'utf8')
    const strVal = (key) => {
      const m = plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`))
      return m ? m[1] : null
    }
    data.displayName = strVal('CFBundleDisplayName')
    data.developmentRegion = strVal('CFBundleDevelopmentRegion')
    const caps = plist.match(/<key>UIRequiredDeviceCapabilities<\/key>\s*<array>([\s\S]*?)<\/array>/)
    data.requiredDeviceCapabilities = caps
      ? [...caps[1].matchAll(/<string>([^<]*)<\/string>/g)].map(m => m[1])
      : null
    data.requiresFullScreen = /<key>UIRequiresFullScreen<\/key>\s*<true\/>/.test(plist)
  }
  const capPath = join(root, 'capacitor.config.ts')
  if (existsSync(capPath)) {
    const m = readFileSync(capPath, 'utf8').match(/appId:\s*'([^']+)'/)
    data.bundleIdCapacitor = m ? m[1] : null
  }
  const cmPath = join(root, 'codemagic.yaml')
  if (existsSync(cmPath)) {
    const ids = [...readFileSync(cmPath, 'utf8').matchAll(/BUNDLE_ID:\s*"?([^"\s]+)"?/g)].map(m => m[1])
    data.bundleIdCodemagic = [...new Set(ids)]
  }
  data.privacyInfoExists = existsSync(join(root, 'ios', 'App', 'App', 'PrivacyInfo.xcprivacy'))

  const ids = new Set([
    ...(data.bundleIdXcode ?? []),
    ...(data.bundleIdCapacitor ? [data.bundleIdCapacitor] : []),
    ...(data.bundleIdCodemagic ?? []),
  ])
  const consistent = ids.size === 1
  return {
    status: consistent ? 'pass' : 'fail',
    ...data,
    bundleIdsFound: [...ids],
    note: consistent ? undefined : `Bundle ID が一致しません: ${[...ids].join(' / ')}`,
  }
})

/* ---------------- 3. 未完成表示 ---------------- */

section('unfinished', () => {
  const patterns = ['Coming Soon', '準備中', 'TODO']
  const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt'])
  const skipDirs = new Set(['node_modules', '.next', 'out', 'review-out', '.git'])
  const results = {}
  let total = 0
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) walk(join(dir, entry.name))
      } else if (exts.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
        const p = join(dir, entry.name)
        const lines = readFileSync(p, 'utf8').split('\n')
        lines.forEach((line, i) => {
          for (const pat of patterns) {
            if (line.includes(pat)) {
              results[pat] ??= { count: 0, locations: [] }
              results[pat].count++
              total++
              if (results[pat].locations.length < 50) {
                results[pat].locations.push(`${relative(root, p)}:${i + 1}`)
              }
            }
          }
        })
      }
    }
  }
  for (const base of ['app', 'public', 'src', 'components']) {
    const d = join(root, base)
    if (existsSync(d)) walk(d)
  }
  for (const pat of patterns) results[pat] ??= { count: 0, locations: [] }
  return { status: total === 0 ? 'pass' : 'fail', total, patterns: results }
})

/* ---------------- 4. ストア掲載文 ---------------- */

section('storeCopy', () => {
  const dir = join(root, 'store', 'ja')
  if (!existsSync(dir)) return { status: 'missing', note: '未作成（store/ja/ がありません）' }
  const fields = { name: 30, subtitle: 30, keywords: 100, promotional_text: 170, description: 4000 }
  const read = (field) => {
    for (const cand of [`${field}.txt`, `${field}.md`, field]) {
      const p = join(dir, cand)
      if (existsSync(p)) return readFileSync(p, 'utf8').trim()
    }
    return null
  }
  const out = {}
  let anyMissing = false
  let anyOver = false
  for (const [field, limit] of Object.entries(fields)) {
    const text = read(field)
    if (text === null) {
      out[field] = { status: 'missing', limit }
      anyMissing = true
      continue
    }
    const chars = [...text].length
    out[field] = {
      status: chars <= limit ? 'ok' : 'over',
      chars,
      bytes: Buffer.byteLength(text, 'utf8'),
      limit,
    }
    if (chars > limit) anyOver = true
  }
  const kw = read('keywords')
  const name = read('name')
  const subtitle = read('subtitle')
  let keywordDuplicates = []
  if (kw) {
    const tokens = kw.split(/[,、\s]+/).filter(Boolean)
    keywordDuplicates = tokens.filter(t => (name && name.includes(t)) || (subtitle && subtitle.includes(t)))
  }
  out.keywordDuplicatesWithNameOrSubtitle = keywordDuplicates
  return {
    status: anyMissing ? 'missing' : anyOver || keywordDuplicates.length > 0 ? 'fail' : 'pass',
    fields: out,
  }
})

/* ---------------- 5. アプリ固有チェック ---------------- */

{
  const scriptsDir = join(root, 'scripts')
  const verifyFiles = existsSync(scriptsDir)
    ? readdirSync(scriptsDir).filter(f => /^verify-.*\.mjs$/.test(f)).sort()
    : []
  let argsMap = {}
  const argsPath = join(root, 'review', 'verify-args.json')
  if (existsSync(argsPath)) {
    try { argsMap = JSON.parse(readFileSync(argsPath, 'utf8')) } catch { /* 引数なしで実行 */ }
  }
  const appChecks = []
  for (const file of verifyFiles) {
    const args = argsMap[file] ?? []
    const r = spawnSync(process.execPath, [join(scriptsDir, file), ...args], {
      cwd: root, encoding: 'utf8', timeout: 180_000, maxBuffer: 16 * 1024 * 1024,
    })
    const output = `${r.stdout ?? ''}${r.stderr ?? ''}`
    appChecks.push({
      script: `scripts/${file}`,
      args,
      status: r.status === 0 ? 'pass' : 'fail',
      exitCode: r.status,
      outputTail: output.split('\n').slice(-40).join('\n').trim(),
    })
    console.log(`[appCheck] scripts/${file} ${args.join(' ')} -> ${r.status === 0 ? 'pass' : 'fail'}`)
  }
  checks.appChecks = {
    status: appChecks.every(c => c.status === 'pass') ? 'pass' : 'fail',
    scripts: appChecks,
  }
}

/* ---------------- 集計 ---------------- */

const sectionFail = ['icon', 'ios', 'unfinished', 'storeCopy', 'appChecks']
  .some(k => ['fail', 'missing', 'error'].includes(checks[k]?.status))

let commit = process.env.GITHUB_SHA ?? null
let branch = process.env.GITHUB_REF_NAME ?? null
if (!commit) {
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })
  if (r.status === 0) commit = r.stdout.trim()
}
if (!branch) {
  const r = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root, encoding: 'utf8' })
  if (r.status === 0) branch = r.stdout.trim()
}

const result = {
  generatedAt: now,
  commit,
  branch,
  overall: sectionFail ? 'fail' : 'pass',
  checks,
}
writeFileSync(join(outDir, 'checks.json'), JSON.stringify(result, null, 2))
console.log(`\nreview-checks: overall=${result.overall} -> review-out/checks.json`)
