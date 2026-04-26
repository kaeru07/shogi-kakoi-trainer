'use client'

import type { PiecePosition, BoardHighlight } from '@/app/lib/types'

type Props = {
  pieces: PiecePosition[]
  highlight?: BoardHighlight
  small?: boolean
}

const ROW_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']

function piecesToBoard(pieces: PiecePosition[]): (PiecePosition | null)[][] {
  const board: (PiecePosition | null)[][] = Array.from({ length: 9 }, () => Array(9).fill(null))
  for (const p of pieces) {
    const ri = p.row - 1
    const ci = 9 - p.col
    if (ri >= 0 && ri < 9 && ci >= 0 && ci < 9) {
      board[ri][ci] = p
    }
  }
  return board
}

export default function ShogiBoard({ pieces, highlight, small = false }: Props) {
  const board = piecesToBoard(pieces)
  const labelSize = small ? 'text-[6px]' : 'text-[9px]'
  const pieceSize = small ? 'text-[7px]' : 'text-[11px]'
  const labelW = small ? 'w-3' : 'w-4'

  return (
    <div className="inline-flex flex-col w-full">
      {/* Column labels */}
      <div className={`flex ${labelW} ml-auto`} style={{ paddingRight: small ? 12 : 16 }}>
        <div className="flex flex-1">
          {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
            <div key={n} className={`flex-1 text-center ${labelSize} text-gray-500 font-medium`}>
              {n}
            </div>
          ))}
        </div>
        <div className={labelW} />
      </div>

      {/* Board rows */}
      {board.map((row, ri) => (
        <div key={ri} className="flex">
          <div className="flex flex-1">
            {row.map((cell, ci) => {
              const isHighlight = highlight
                ? highlight.row - 1 === ri && 9 - highlight.col === ci
                : false
              return (
                <div
                  key={ci}
                  className={[
                    'flex-1 aspect-square border border-[#A0845C] flex items-center justify-center',
                    'bg-[#DEB887] relative',
                    isHighlight ? 'bg-emerald-300' : '',
                  ].join(' ')}
                >
                  {cell && (
                    <span
                      className={[
                        pieceSize,
                        'font-bold leading-none select-none',
                        cell.isGote ? 'rotate-180 inline-block text-[#1a1a1a]' : 'text-[#1a1a1a]',
                      ].join(' ')}
                    >
                      {cell.kanji}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className={`${labelW} flex items-center justify-center ${labelSize} text-gray-500`}>
            {ROW_LABELS[ri]}
          </div>
        </div>
      ))}
    </div>
  )
}
