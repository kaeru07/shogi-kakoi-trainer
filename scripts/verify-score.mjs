#!/usr/bin/env node
// テストモード採点関数（app/lib/score.ts の calcScore）の検証。
//
// チェック内容（全囲い共通）:
//   - 初期局面（testPieces）を採点すると 0% になること
//   - 完成図（pieces）同士を採点すると 100% になること
//
// 実行方法: node scripts/verify-score.mjs
//   .ts ファイルを import するため、型ストリップ付きで自分自身を再実行する
//   （Node 22 では --experimental-strip-types が必要。Node 24 では既定で有効だが
//     フラグを渡しても害はない）。
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

if (!process.env.__VERIFY_SCORE_STRIPPED) {
  const r = spawnSync(
    process.execPath,
    ['--experimental-strip-types', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: 'inherit', env: { ...process.env, __VERIFY_SCORE_STRIPPED: '1' } }
  )
  process.exit(r.status ?? 1)
}

const { CASTLES } = await import('../app/lib/castles.ts')
const { calcScore } = await import('../app/lib/score.ts')

let failures = 0
for (const castle of CASTLES) {
  const initial = calcScore(castle.testPieces, castle.pieces)
  const finished = calcScore(castle.pieces, castle.pieces)
  const okInitial = initial === 0
  const okFinished = finished === 100
  if (!okInitial || !okFinished) failures++
  console.log(
    `${okInitial && okFinished ? 'OK  ' : 'FAIL'} ${castle.id} (${castle.name}): 初期局面=${initial}% (期待 0%) / 完成図=${finished}% (期待 100%)`
  )
}

console.log(`\n結果: ${CASTLES.length} 囲い中 ${failures} 件が不合格`)
process.exit(failures > 0 ? 1 : 0)
