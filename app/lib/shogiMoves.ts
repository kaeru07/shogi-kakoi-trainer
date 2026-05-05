import type { PiecePosition, BoardHighlight } from './types'

function inBounds(col: number, row: number): boolean {
  return col >= 1 && col <= 9 && row >= 1 && row <= 9
}

export function getValidMoves(
  piece: PiecePosition,
  allPieces: PiecePosition[]
): BoardHighlight[] {
  const { col, row, kanji, isGote } = piece
  // forward direction: player (isGote=false) moves up (row-1), opponent (isGote=true) moves down (row+1)
  const fwd = isGote ? 1 : -1

  const isOwn = (c: number, r: number) =>
    allPieces.some(p => p.col === c && p.row === r && p.isGote === isGote)

  const isEnemy = (c: number, r: number) =>
    allPieces.some(p => p.col === c && p.row === r && p.isGote !== isGote)

  const add = (moves: BoardHighlight[], c: number, r: number) => {
    if (inBounds(c, r) && !isOwn(c, r)) moves.push({ col: c, row: r })
  }

  // Sliding piece: keeps going until blocked
  const slide = (moves: BoardHighlight[], dc: number, dr: number) => {
    let c = col + dc
    let r = row + dr
    while (inBounds(c, r)) {
      if (isOwn(c, r)) break
      moves.push({ col: c, row: r })
      if (isEnemy(c, r)) break
      c += dc
      r += dr
    }
  }

  // Gold general movement pattern
  const goldMoves = (moves: BoardHighlight[]) => {
    add(moves, col,     row + fwd)      // forward
    add(moves, col - 1, row + fwd)      // forward-left
    add(moves, col + 1, row + fwd)      // forward-right
    add(moves, col - 1, row)            // left
    add(moves, col + 1, row)            // right
    add(moves, col,     row - fwd)      // backward
  }

  const moves: BoardHighlight[] = []

  switch (kanji) {
    case '歩':
      add(moves, col, row + fwd)
      break

    case '香':
      slide(moves, 0, fwd)
      break

    case '桂':
      add(moves, col - 1, row + fwd * 2)
      add(moves, col + 1, row + fwd * 2)
      break

    case '銀':
      add(moves, col,     row + fwd)
      add(moves, col - 1, row + fwd)
      add(moves, col + 1, row + fwd)
      add(moves, col - 1, row - fwd)
      add(moves, col + 1, row - fwd)
      break

    case '金':
    case 'と':
    case '杏':
    case '圭':
    case '全':
      goldMoves(moves)
      break

    case '王':
    case '玉':
      for (let dc = -1; dc <= 1; dc++) {
        for (let dr = -1; dr <= 1; dr++) {
          if (dc !== 0 || dr !== 0) add(moves, col + dc, row + dr)
        }
      }
      break

    case '飛':
      slide(moves,  0,  1)
      slide(moves,  0, -1)
      slide(moves,  1,  0)
      slide(moves, -1,  0)
      break

    case '角':
      slide(moves,  1,  1)
      slide(moves,  1, -1)
      slide(moves, -1,  1)
      slide(moves, -1, -1)
      break

    case '竜':
    case '龍':
      slide(moves,  0,  1)
      slide(moves,  0, -1)
      slide(moves,  1,  0)
      slide(moves, -1,  0)
      for (let dc = -1; dc <= 1; dc += 2)
        for (let dr = -1; dr <= 1; dr += 2)
          add(moves, col + dc, row + dr)
      break

    case '馬':
      slide(moves,  1,  1)
      slide(moves,  1, -1)
      slide(moves, -1,  1)
      slide(moves, -1, -1)
      add(moves, col,     row + 1)
      add(moves, col,     row - 1)
      add(moves, col + 1, row)
      add(moves, col - 1, row)
      break
  }

  return moves
}
