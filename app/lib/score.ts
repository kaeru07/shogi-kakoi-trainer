import type { PiecePosition } from './types'

/**
 * テストモードの採点関数。
 * 現在の盤面（current）が完成図（target）の駒配置とどれだけ一致しているかを
 * パーセント（0〜100）で返す。一致の判定は 駒種・列・行・先後 の完全一致。
 *
 * 元は app/test/[id]/TestClient.tsx 内のローカル関数だったものを、
 * レビュー材料づくり（scripts/verify-score.mjs）から検証できるよう切り出した。
 * 計算ロジック自体は変更していない。
 */
export function calcScore(current: PiecePosition[], target: PiecePosition[]): number {
  if (target.length === 0) return 0
  const matched = target.filter(t =>
    current.some(p => p.col === t.col && p.row === t.row && p.kanji === t.kanji && p.isGote === t.isGote)
  ).length
  return Math.round((matched / target.length) * 100)
}
