#!/usr/bin/env node
// 囲いデータ（app/lib/castles.ts）の整合チェック。
//
// 使い方: npm run verify:castles [-- --strict]
//   既定では「エラー」（A/B）があれば exit 1、ガイドと完成盤面の差分（C）は警告として表示する。
//   --strict を付けると C の差分も exit 1 の対象になる。
//
// チェック内容:
//   A. ガイド手順の各手について、移動元（from）のマスに駒が実在すること（空マス指定の検出）
//   B. 完成盤面の妥当性: 同じマスへの駒の重なり、駒種ごとの枚数上限（金・銀などは各2枚まで）
//   C. ガイド手順を初期配置から最後まで適用した到達盤面と、完成盤面（pieces）のマス単位の一致
//
// 実装メモ: castles.ts のデータリテラルを正規表現で読み取る簡易パーサ。
// データの書き方（const 配列 + SIMPLE_CASTLE_PIECES テンプレート）を変えたら、このスクリプトも合わせること。
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const strict = process.argv.includes('--strict')
const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(here, '..', 'app', 'lib', 'castles.ts'), 'utf8')

function parsePieces(block) {
  const out = []
  const re = /\{\s*kanji:\s*'([^']+)',\s*col:\s*(\d+),\s*row:\s*(\d+),\s*isGote:\s*(true|false)\s*\}/g
  let m
  while ((m = re.exec(block)) !== null) {
    out.push({ kanji: m[1], col: Number(m[2]), row: Number(m[3]), isGote: m[4] === 'true' })
  }
  return out
}

function constBlock(name) {
  const re = new RegExp(`const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`)
  const m = src.match(re)
  if (!m) throw new Error(`const ${name} が見つかりません`)
  return m[1]
}

const gote = [
  ...parsePieces(constBlock('GOTE_STANDARD')),
  ...Array.from({ length: 9 }, (_, i) => ({ kanji: '歩', col: 9 - i, row: 3, isGote: true })),
]
const sente = parsePieces(constBlock('SENTE_STANDARD'))
const INITIAL = [...gote, ...sente]

// SIMPLE_CASTLE_PIECES の実物を読み取って評価する。
// 固定リテラルの駒、kingCol/goldCol/silverCol/rookCol の代入、
// 歩の列挙（[9, 5, 4, 2, 1] など）と silverCol 除外フィルタの有無を、ソースの現物から拾う。
function simplePieces(kingCol, goldCol, silverCol, rookCol) {
  const start = src.indexOf('const SIMPLE_CASTLE_PIECES')
  const end = src.indexOf('\n]', start)
  const block = src.slice(start, end)
  const subs = { kingCol, goldCol, silverCol, rookCol }
  const out = [...gote]
  // パラメータ代入つき・固定リテラルの駒
  const re = /\{\s*kanji:\s*'([^']+)',\s*col:\s*(\d+|[a-zA-Z]+),\s*row:\s*(\d+),\s*isGote:\s*false\s*\}/g
  let m
  while ((m = re.exec(block)) !== null) {
    const col = /^\d+$/.test(m[2]) ? Number(m[2]) : subs[m[2]]
    out.push({ kanji: m[1], col, row: Number(m[3]), isGote: false })
  }
  // 歩の列挙（配列リテラル + map）。silverCol 除外フィルタがソースにあれば適用する
  const listMatch = block.match(/\[([0-9,\s]+)\][\s\S]*?\.map\(\(col\)/)
  if (listMatch) {
    let cols = listMatch[1].split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n))
    if (/\.filter\(\(col\) => col !== silverCol\)/.test(block)) {
      cols = cols.filter((c) => c !== silverCol)
    }
    for (const col of cols) out.push({ kanji: '歩', col, row: 7, isGote: false })
  }
  return out
}

function resolvePieces(expr) {
  const simple = expr.match(/SIMPLE_CASTLE_PIECES\(([^)]*)\)/)
  if (simple) {
    const args = simple[1].split(',').map((s) => Number(s.trim()))
    return simplePieces(...args)
  }
  const name = expr.trim()
  return [...gote, ...parsePieces(constBlock(name))]
}

function parseSpecs(name) {
  const block = constBlock(name)
  const specs = []
  const re = /move:\s*'([^']+)'[\s\S]*?from:\s*(\{[^}]*\}|null)[\s\S]*?to:\s*(\{[^}]*\}|null)/g
  let m
  while ((m = re.exec(block)) !== null) {
    const pos = (s) => {
      if (s === 'null') return null
      return {
        col: Number(s.match(/col:\s*(\d+)/)[1]),
        row: Number(s.match(/row:\s*(\d+)/)[1]),
      }
    }
    specs.push({ move: m[1], from: pos(m[2]), to: pos(m[3]) })
  }
  return specs
}

// CASTLES 配列から id / pieces / 手順スペック名 の対応を取り出す
const castlesSection = src.slice(src.indexOf('export const CASTLES'))
const entries = []
{
  const re = /id:\s*'([^']+)'[\s\S]*?pieces:\s*(SIMPLE_CASTLE_PIECES\([^)]*\)|[A-Z_]+)[\s\S]*?buildGuideSteps\(INITIAL_PIECES,\s*([A-Z_]+)\)/g
  let m
  while ((m = re.exec(castlesSection)) !== null) {
    entries.push({ id: m[1], piecesExpr: m[2], specsName: m[3] })
  }
}
if (entries.length === 0) throw new Error('CASTLES の対応表を取り出せませんでした')

function movePiece(pieces, from, to) {
  const idx = pieces.findIndex((p) => p.col === from.col && p.row === from.row)
  if (idx === -1) return null
  const moving = pieces[idx]
  return [
    ...pieces.filter((p, i) => i !== idx && !(p.col === to.col && p.row === to.row)),
    { ...moving, col: to.col, row: to.row },
  ]
}

const LIMITS = { '歩': 9, '香': 2, '桂': 2, '銀': 2, '金': 2, '角': 1, '飛': 1, '玉': 1 }
let errors = 0
let warnings = 0

for (const { id, piecesExpr, specsName } of entries) {
  const specs = parseSpecs(specsName)
  const picture = resolvePieces(piecesExpr)
  console.log(`\n== ${id} ==`)

  // A: 手順の移動元に駒が実在するか
  let board = INITIAL
  for (const s of specs) {
    if (s.from && s.to) {
      const next = movePiece(board, s.from, s.to)
      if (next === null) {
        console.log(`  [A:エラー] ${s.move}: 移動元 (${s.from.col},${s.from.row}) に駒がありません`)
        errors++
      } else {
        board = next
      }
    }
  }

  // B: 完成盤面の妥当性
  for (const isGote of [false, true]) {
    const side = picture.filter((p) => p.isGote === isGote)
    const seen = new Map()
    for (const p of side) {
      const key = `${p.col},${p.row}`
      if (seen.has(key)) {
        console.log(`  [B:エラー] 完成盤面で (${key}) に ${seen.get(key)} と ${p.kanji} が重なっています`)
        errors++
      }
      seen.set(key, p.kanji)
    }
    const counts = {}
    for (const p of side) counts[p.kanji] = (counts[p.kanji] ?? 0) + 1
    for (const [kanji, limit] of Object.entries(LIMITS)) {
      if ((counts[kanji] ?? 0) > limit) {
        console.log(`  [B:エラー] 完成盤面の ${kanji} が ${counts[kanji]} 枚あります（上限 ${limit}）`)
        errors++
      }
    }
  }

  // C: 到達盤面 vs 完成盤面（先手の駒のみ、完成盤面に描かれたマスで比較）
  const at = new Map()
  for (const p of board) if (!p.isGote) at.set(`${p.col},${p.row}`, p.kanji)
  let diffs = 0
  for (const p of picture) {
    if (p.isGote) continue
    const got = at.get(`${p.col},${p.row}`)
    if (got !== p.kanji) {
      console.log(`  [C:警告] 完成盤面 ${p.kanji}@(${p.col},${p.row}) vs 手順到達 ${got ?? '空'}`)
      diffs++
      warnings++
    }
  }
  if (diffs === 0) console.log('  [C] 完成盤面の全マスが手順到達と一致')
}

console.log(`\n結果: エラー ${errors} 件 / 警告 ${warnings} 件（対象 ${entries.length} 囲い）`)
if (errors > 0 || (strict && warnings > 0)) process.exit(1)
