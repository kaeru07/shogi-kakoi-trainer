#!/usr/bin/env node
// レビュー材料づくり：画面撮影。
//
// out/（Next.js 静的エクスポート）をローカルで配信し、review/routes.txt に列挙した
// パスを iPhone の画面幅（440×956、拡大率3）で撮影して review-out/screens/ に保存する。
// /guide/{id} は、囲いデータの手順どおりに盤面をクリックして最終手まで進めた状態も
// 撮影する（ファイル名: guide_{id}_final.png）。
//
// 結果は review-out/screens.json に書く。このスクリプト自体は常に exit 0。
// 前提: playwright がインストールされていること（ワークフロー側で導入する）。
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outWebDir = join(root, 'out')
const shotsDir = join(root, 'review-out', 'screens')
mkdirSync(shotsDir, { recursive: true })

const VIEWPORT = { width: 440, height: 956 }
const DSF = 3
const results = []

function slugify(route) {
  if (route === '/') return 'home'
  return route.replace(/^\//, '').replace(/\//g, '_')
}

/* ---------- 静的配信 ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain',
}
function serveOut() {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
    const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
    const candidates = [
      join(outWebDir, safe, 'index.html'),
      join(outWebDir, `${safe}.html`),
      join(outWebDir, safe),
    ]
    for (const p of candidates) {
      if (existsSync(p) && statSync(p).isFile()) {
        res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' })
        res.end(readFileSync(p))
        return
      }
    }
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('not found')
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

/* ---------- 盤面クリック ---------- */
// ShogiBoard は div.aspect-square を 9x9 で描く。行 ri=row-1、列 ci=9-col。
async function clickCell(page, col, row) {
  const cells = page.locator('div.aspect-square')
  const count = await cells.count()
  if (count !== 81) throw new Error(`盤面セルが 81 個ではありません (${count})`)
  const idx = (row - 1) * 9 + (9 - col)
  await cells.nth(idx).click()
  await page.waitForTimeout(200)
}

async function runGuideToEnd(page, castle) {
  const steps = castle.guideSteps ?? []
  const total = steps.length
  let acted = 0
  for (let i = 0; i < total - 1; i++) {
    const step = steps[i]
    if (step?.from && step?.to) {
      await clickCell(page, step.from.col, step.from.row)
      await clickCell(page, step.to.col, step.to.row)
    } else {
      const nextBtn = page.locator('button', { hasText: '次へ' }).first()
      if (await nextBtn.count()) {
        await nextBtn.click()
        await page.waitForTimeout(200)
      } else {
        throw new Error(`手順 ${i + 1}: from/to がなく「次へ」ボタンも見つかりません`)
      }
    }
    acted++
  }
  await page.waitForTimeout(400)
  const bodyText = await page.locator('body').innerText()
  return { steps: total, actions: acted, reachedFinal: bodyText.includes('囲い完成') }
}

/* ---------- 本体 ---------- */
async function main() {
  const routesFile = join(root, 'review', 'routes.txt')
  const routes = existsSync(routesFile)
    ? readFileSync(routesFile, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'))
    : ['/']

  if (!existsSync(outWebDir)) {
    results.push({ route: '(all)', status: 'error', note: 'out/ がありません（ビルド未実行または失敗）' })
    return
  }

  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch (e) {
    results.push({ route: '(all)', status: 'error', note: `playwright を読み込めません: ${e.message}` })
    return
  }

  // 囲いデータ（誘導モードのクリック用）。読み込めなければ撮影のみ行う。
  let castlesById = null
  try {
    const { CASTLES } = await import('../app/lib/castles.ts')
    castlesById = new Map(CASTLES.map(c => [c.id, c]))
  } catch (e) {
    console.log(`[screenshots] 囲いデータを読み込めません（クリック撮影はスキップ）: ${e.message}`)
  }

  const server = await serveOut()
  const port = server.address().port
  const base = `http://127.0.0.1:${port}`
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DSF,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })

  for (const route of routes) {
    const page = await context.newPage()
    const file = `${slugify(route)}.png`
    try {
      await page.goto(base + route, { waitUntil: 'load', timeout: 30_000 })
      await page.waitForTimeout(700)
      await page.screenshot({ path: join(shotsDir, file), fullPage: true })
      results.push({ route, file: `screens/${file}`, status: 'ok' })
      console.log(`[screenshot] ${route} -> ${file}`)

      const guideMatch = route.match(/^\/guide\/(.+)$/)
      if (guideMatch && castlesById?.has(guideMatch[1])) {
        const castle = castlesById.get(guideMatch[1])
        const finalFile = `guide_${guideMatch[1]}_final.png`
        try {
          const g = await runGuideToEnd(page, castle)
          await page.screenshot({ path: join(shotsDir, finalFile), fullPage: true })
          results.push({
            route: `${route}（最終手）`, file: `screens/${finalFile}`,
            status: g.reachedFinal ? 'ok' : 'error',
            note: g.reachedFinal ? undefined : '最終手まで進めましたが「囲い完成」が表示されませんでした',
            guide: g,
          })
          console.log(`[screenshot] ${route} final -> ${finalFile} (reachedFinal=${g.reachedFinal})`)
        } catch (e) {
          results.push({ route: `${route}（最終手）`, status: 'error', note: String(e.message ?? e) })
          console.log(`[screenshot] ${route} final FAILED: ${e.message}`)
        }
      }
    } catch (e) {
      results.push({ route, status: 'error', note: String(e.message ?? e) })
      console.log(`[screenshot] ${route} FAILED: ${e.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.close()
}

await main()
const out = {
  generatedAt: new Date().toISOString(),
  viewport: { ...VIEWPORT, deviceScaleFactor: DSF },
  results,
}
writeFileSync(join(root, 'review-out', 'screens.json'), JSON.stringify(out, null, 2))
const errs = results.filter(r => r.status === 'error').length
console.log(`\nreview-screenshots: ${results.length} 件中 ${errs} 件エラー -> review-out/screens.json`)
