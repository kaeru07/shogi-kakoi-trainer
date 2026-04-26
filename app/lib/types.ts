export type Difficulty = 'easy' | 'medium' | 'hard'
export type CastleType = 'ibisha' | 'furibisha' | 'both'

export type PiecePosition = {
  kanji: string
  col: number   // 1-9: shogi column (1=right, 9=left)
  row: number   // 1-9: shogi row (1=top, 9=bottom)
  isGote: boolean  // true=opponent(top), false=player(bottom)
}

export type BoardHighlight = {
  col: number
  row: number
}

export type GuideStep = {
  move: string
  hint: string
  highlight?: BoardHighlight
  from?: BoardHighlight
  to?: BoardHighlight
  boardPosition?: PiecePosition[]
}

export type Castle = {
  id: string
  name: string
  type: CastleType
  difficulty: Difficulty
  tags: string[]
  description: string[]
  features: string[]
  weaknesses: string[]
  recommendedAgainst: string
  basicSteps: string[]
  pieces: PiecePosition[]
  guidePieces: PiecePosition[]
  guideSteps: GuideStep[]
  // legacy fields kept for compatibility
  guideHighlight?: BoardHighlight
  guideNextMove: string
  guideStep: [number, number]
  guideProgress: number
  testPieces: PiecePosition[]
  testScore: number
  testMessage: string
  testGoodPoints: string[]
  testFixPoints: string[]
}
