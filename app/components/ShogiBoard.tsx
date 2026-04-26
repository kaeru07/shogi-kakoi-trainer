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
                    isHighlight ? 'bg-emerald-300' : 'bg-[#DEB887]',
                  ].join(' ')}
                >
                  {cell && (
                    small ? (
                      // Small mode: simple text for readability
                      <span
                        className={[
                          'text-[7px] font-bold leading-none select-none',
                          cell.isGote ? 'rotate-180 inline-block' : '',
                          'text-[#1a1a1a]',
                        ].join(' ')}
                      >
                        {cell.kanji}
                      </span>
                    ) : (
                      // Normal mode: pentagon piece design
                      <div
                        style={{
                          clipPath: 'polygon(50% 0%, 88% 18%, 100% 100%, 0% 100%, 12% 18%)',
                          background: 'linear-gradient(175deg, #f5e9c8 30%, #c8a050 100%)',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
                          transform: cell.isGote ? 'rotate(180deg)' : 'none',
                          width: '86%',
                          height: '86%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingTop: '10%',
                          boxSizing: 'border-box' as const,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            lineHeight: 1,
                            color: '#1a1a1a',
                            userSelect: 'none',
                          }}
                        >
                          {cell.kanji}
                        </span>
                      </div>
                    )
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
