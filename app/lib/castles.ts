import type { BoardHighlight, Castle, GuideStep, PiecePosition } from './types'

const GOTE_STANDARD: PiecePosition[] = [
  { kanji: '香', col: 9, row: 1, isGote: true },
  { kanji: '桂', col: 8, row: 1, isGote: true },
  { kanji: '銀', col: 7, row: 1, isGote: true },
  { kanji: '金', col: 6, row: 1, isGote: true },
  { kanji: '玉', col: 5, row: 1, isGote: true },
  { kanji: '金', col: 4, row: 1, isGote: true },
  { kanji: '銀', col: 3, row: 1, isGote: true },
  { kanji: '桂', col: 2, row: 1, isGote: true },
  { kanji: '香', col: 1, row: 1, isGote: true },
  { kanji: '飛', col: 8, row: 2, isGote: true },
  { kanji: '角', col: 2, row: 2, isGote: true },
  ...Array.from({ length: 9 }, (_, i): PiecePosition => ({
    kanji: '歩', col: 9 - i, row: 3, isGote: true,
  })),
]

const MINO_PIECES: PiecePosition[] = [
  ...GOTE_STANDARD,
  { kanji: '歩', col: 9, row: 7, isGote: false },
  { kanji: '銀', col: 7, row: 7, isGote: false },
  { kanji: '歩', col: 5, row: 7, isGote: false },
  { kanji: '歩', col: 4, row: 7, isGote: false },
  { kanji: '角', col: 3, row: 7, isGote: false },
  { kanji: '歩', col: 2, row: 7, isGote: false },
  { kanji: '歩', col: 1, row: 7, isGote: false },
  { kanji: '飛', col: 9, row: 8, isGote: false },
  { kanji: '玉', col: 8, row: 8, isGote: false },
  { kanji: '金', col: 7, row: 8, isGote: false },
  { kanji: '香', col: 9, row: 9, isGote: false },
  { kanji: '桂', col: 8, row: 9, isGote: false },
  { kanji: '金', col: 6, row: 9, isGote: false },
  { kanji: '金', col: 4, row: 9, isGote: false },
  { kanji: '桂', col: 2, row: 9, isGote: false },
  { kanji: '香', col: 1, row: 9, isGote: false },
]

const MINO_GUIDE_PIECES: PiecePosition[] = [
  ...GOTE_STANDARD,
  { kanji: '歩', col: 9, row: 7, isGote: false },
  { kanji: '歩', col: 5, row: 7, isGote: false },
  { kanji: '歩', col: 4, row: 7, isGote: false },
  { kanji: '角', col: 3, row: 7, isGote: false },
  { kanji: '歩', col: 2, row: 7, isGote: false },
  { kanji: '歩', col: 1, row: 7, isGote: false },
  { kanji: '飛', col: 9, row: 8, isGote: false },
  { kanji: '玉', col: 8, row: 8, isGote: false },
  { kanji: '金', col: 6, row: 8, isGote: false },
  { kanji: '香', col: 9, row: 9, isGote: false },
  { kanji: '桂', col: 8, row: 9, isGote: false },
  { kanji: '銀', col: 7, row: 9, isGote: false },
  { kanji: '金', col: 4, row: 9, isGote: false },
  { kanji: '桂', col: 2, row: 9, isGote: false },
  { kanji: '香', col: 1, row: 9, isGote: false },
]

const MINO_TEST_PIECES: PiecePosition[] = [
  { kanji: '玉', col: 5, row: 1, isGote: true },
  { kanji: '金', col: 4, row: 1, isGote: true },
  { kanji: '金', col: 6, row: 1, isGote: true },
  { kanji: '銀', col: 3, row: 2, isGote: true },
  { kanji: '飛', col: 3, row: 3, isGote: true },
  { kanji: '角', col: 7, row: 4, isGote: true },
  { kanji: '歩', col: 9, row: 3, isGote: true },
  { kanji: '歩', col: 8, row: 3, isGote: true },
  { kanji: '歩', col: 5, row: 3, isGote: true },
  { kanji: '歩', col: 4, row: 4, isGote: true },
  { kanji: '歩', col: 2, row: 3, isGote: true },
  { kanji: '歩', col: 1, row: 3, isGote: true },
  { kanji: '歩', col: 9, row: 7, isGote: false },
  { kanji: '歩', col: 8, row: 6, isGote: false },
  { kanji: '銀', col: 6, row: 7, isGote: false },
  { kanji: '歩', col: 4, row: 7, isGote: false },
  { kanji: '歩', col: 2, row: 7, isGote: false },
  { kanji: '歩', col: 1, row: 7, isGote: false },
  { kanji: '飛', col: 4, row: 8, isGote: false },
  { kanji: '玉', col: 8, row: 8, isGote: false },
  { kanji: '金', col: 7, row: 8, isGote: false },
  { kanji: '金', col: 5, row: 8, isGote: false },
  { kanji: '香', col: 9, row: 9, isGote: false },
  { kanji: '桂', col: 8, row: 9, isGote: false },
  { kanji: '金', col: 6, row: 9, isGote: false },
  { kanji: '桂', col: 2, row: 9, isGote: false },
  { kanji: '香', col: 1, row: 9, isGote: false },
]

const SIMPLE_CASTLE_PIECES = (kingCol: number, goldCol: number, silverCol: number, rookCol: number): PiecePosition[] => [
  ...GOTE_STANDARD,
  { kanji: '歩', col: 9, row: 7, isGote: false },
  { kanji: '銀', col: silverCol, row: 7, isGote: false },
  { kanji: '歩', col: 5, row: 7, isGote: false },
  { kanji: '歩', col: 4, row: 7, isGote: false },
  { kanji: '歩', col: 2, row: 7, isGote: false },
  { kanji: '歩', col: 1, row: 7, isGote: false },
  { kanji: '飛', col: rookCol, row: 8, isGote: false },
  { kanji: '玉', col: kingCol, row: 8, isGote: false },
  { kanji: '金', col: goldCol, row: 8, isGote: false },
  { kanji: '香', col: 9, row: 9, isGote: false },
  { kanji: '桂', col: 8, row: 9, isGote: false },
  { kanji: '金', col: 6, row: 9, isGote: false },
  { kanji: '桂', col: 2, row: 9, isGote: false },
  { kanji: '香', col: 1, row: 9, isGote: false },
]

// 矢倉 pieces (居飛車, king goes right)
const YAGURA_PIECES: PiecePosition[] = [
  ...GOTE_STANDARD,
  { kanji: '歩', col: 9, row: 7, isGote: false },
  { kanji: '銀', col: 7, row: 7, isGote: false },
  { kanji: '銀', col: 6, row: 7, isGote: false },
  { kanji: '歩', col: 5, row: 7, isGote: false },
  { kanji: '歩', col: 4, row: 7, isGote: false },
  { kanji: '歩', col: 2, row: 7, isGote: false },
  { kanji: '歩', col: 1, row: 7, isGote: false },
  { kanji: '角', col: 8, row: 8, isGote: false },
  { kanji: '玉', col: 6, row: 8, isGote: false },
  { kanji: '金', col: 7, row: 8, isGote: false },
  { kanji: '金', col: 5, row: 8, isGote: false },
  { kanji: '香', col: 9, row: 9, isGote: false },
  { kanji: '桂', col: 8, row: 9, isGote: false },
  { kanji: '飛', col: 2, row: 8, isGote: false },
  { kanji: '桂', col: 2, row: 9, isGote: false },
  { kanji: '香', col: 1, row: 9, isGote: false },
]

// --- Guide step helpers ---

function movePiece(
  pieces: PiecePosition[],
  from: BoardHighlight,
  to: BoardHighlight
): PiecePosition[] {
  const idx = pieces.findIndex(p => p.col === from.col && p.row === from.row)
  if (idx === -1) return pieces
  const moving = pieces[idx]
  return [
    ...pieces.filter((p, i) => i !== idx && !(p.col === to.col && p.row === to.row)),
    { ...moving, col: to.col, row: to.row },
  ]
}

type MoveSpec = {
  move: string
  hint: string
  from: BoardHighlight | null
  to: BoardHighlight | null
}

function buildGuideSteps(initial: PiecePosition[], specs: MoveSpec[]): GuideStep[] {
  const result: GuideStep[] = []
  let board = initial

  for (const s of specs) {
    result.push({
      move: s.move,
      hint: s.hint,
      highlight: s.to ?? undefined,
      from: s.from ?? undefined,
      to: s.to ?? undefined,
      boardPosition: board,
    })
    if (s.from && s.to) {
      board = movePiece(board, s.from, s.to)
    }
  }

  return result
}

// 美濃囲い: 5手の移動 + 完成確認 = 6ステップ
// boardPosition[i] = ステップiを「次にやること」として見せる盤面（手前の状態）
const MINO_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲7八銀',
    hint: '銀を7八に上げます。玉の横を守る最初の一手です。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 7, row: 9 },
    to: { col: 7, row: 8 },
  },
  {
    move: '▲7七銀',
    hint: '銀をさらに7七へ上げます。玉の斜め前を守る美濃囲いの要の位置です。',
    from: { col: 7, row: 8 },
    to: { col: 7, row: 7 },
  },
  {
    move: '▲7八金右',
    hint: '右の金を7八に上げます。玉の横に金が並び守りが一段と固まります。',
    from: { col: 6, row: 8 },
    to: { col: 7, row: 8 },
  },
  {
    move: '▲6九金左',
    hint: '左の金を6九に寄せます。玉の近くに金を集めて囲いの形を整えます。',
    from: { col: 4, row: 9 },
    to: { col: 6, row: 9 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩を突いて端の守りを固めます。最後の仕上げです！',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '美濃囲い完成！',
    hint: '玉・金・銀が連携した美濃囲いが完成しました！',
    from: null,
    to: null,
  },
]

// Guide piece starting positions
const TAKAMINO_GUIDE_PIECES = SIMPLE_CASTLE_PIECES(8, 6, 7, 9)
const GINKAN_GUIDE_PIECES = SIMPLE_CASTLE_PIECES(7, 7, 6, 9)
const YAGURA_GUIDE_PIECES = SIMPLE_CASTLE_PIECES(6, 7, 7, 2)
const FUNE_GUIDE_PIECES = SIMPLE_CASTLE_PIECES(7, 7, 7, 2)
const IBISHA_ANAGUMA_GUIDE_PIECES = SIMPLE_CASTLE_PIECES(9, 9, 8, 2)
const FURIBISHA_ANAGUMA_GUIDE_PIECES = SIMPLE_CASTLE_PIECES(1, 1, 2, 7)

// 高美濃: 4手 + 完成
const TAKAMINO_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲8七銀',
    hint: '銀を8七に上げます。高美濃特有の銀の位置です。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 7, row: 7 },
    to: { col: 8, row: 7 },
  },
  {
    move: '▲7八金右',
    hint: '右の金を7八に上げます。玉の横に金を配置して守りを厚くします。',
    from: { col: 6, row: 8 },
    to: { col: 7, row: 8 },
  },
  {
    move: '▲7九金左',
    hint: '左の金を7九に引き付けます。金二枚で玉の下を固めます。',
    from: { col: 6, row: 9 },
    to: { col: 7, row: 9 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩を突いて端の守りを固めます。最後の仕上げです！',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '高美濃囲い完成！',
    hint: '銀が8七、金が7八・7九に配置された高美濃囲いが完成しました！',
    from: null,
    to: null,
  },
]

// 銀冠: 3手 + 完成
const GINKAN_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲7七銀',
    hint: '銀を7七に上げます。玉の頭を守る銀冠の核心です。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 6, row: 7 },
    to: { col: 7, row: 7 },
  },
  {
    move: '▲7九金左',
    hint: '左の金を7九に引き付けます。玉の下を金で固めます。',
    from: { col: 6, row: 9 },
    to: { col: 7, row: 9 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩を突いて端の守りを固めます。',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '銀冠完成！',
    hint: '銀が玉の頭を守る銀冠が完成しました！',
    from: null,
    to: null,
  },
]

// 矢倉: 3手 + 完成
const YAGURA_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲6七銀',
    hint: '銀を6七に引き付けます。飛車先を守りながら矢倉の陣形を整えます。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 7, row: 7 },
    to: { col: 6, row: 7 },
  },
  {
    move: '▲7九金左',
    hint: '左の金を7九に引き付けます。玉の下を金で固めます。',
    from: { col: 6, row: 9 },
    to: { col: 7, row: 9 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩を突いて端の守りを固めます。矢倉囲いの完成です！',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '矢倉囲い完成！',
    hint: '金銀4枚の堅固な矢倉囲いが完成しました！',
    from: null,
    to: null,
  },
]

// 舟囲い: 4手 + 完成
const FUNE_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲6七銀',
    hint: '銀を6七に上げます。舟囲いは素早く組める機動性が特長。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 7, row: 7 },
    to: { col: 6, row: 7 },
  },
  {
    move: '▲5九金左',
    hint: '左の金を5九に寄せます。玉の左下を守ります。',
    from: { col: 6, row: 9 },
    to: { col: 5, row: 9 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩を突いて端を固めます。',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '▲4六歩',
    hint: '4筋の歩も突いて中央付近の守りを固めます。',
    from: { col: 4, row: 7 },
    to: { col: 4, row: 6 },
  },
  {
    move: '舟囲い完成！',
    hint: '素早く組める舟囲いが完成しました！速い展開に対応できます。',
    from: null,
    to: null,
  },
]

// 居飛車穴熊: 4手 + 完成
const IBISHA_ANAGUMA_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲8八銀',
    hint: '銀を8八に上げます。玉の斜め前を守る穴熊の急所です。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 8, row: 7 },
    to: { col: 8, row: 8 },
  },
  {
    move: '▲7九金',
    hint: '金を7九に引き付けます。玉の左下を金で固めます。',
    from: { col: 6, row: 9 },
    to: { col: 7, row: 9 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩を突いて端を固めます。',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '▲5六歩',
    hint: '5筋の歩も突いて中央の守りを固めます。',
    from: { col: 5, row: 7 },
    to: { col: 5, row: 6 },
  },
  {
    move: '居飛車穴熊完成！',
    hint: '最堅の守りを誇る居飛車穴熊が完成しました！端の堅さは抜群です。',
    from: null,
    to: null,
  },
]

// 振り飛車穴熊: 4手 + 完成
const FURIBISHA_ANAGUMA_MOVE_SPECS: MoveSpec[] = [
  {
    move: '▲2八銀',
    hint: '銀を2八に上げます。玉の斜め前を守る振り飛車穴熊の要です。🟡の駒を🟢のマスへ動かしてください。',
    from: { col: 2, row: 7 },
    to: { col: 2, row: 8 },
  },
  {
    move: '▲3九金',
    hint: '金を3九に引き付けます。玉の右下から守りを固めます。',
    from: { col: 6, row: 9 },
    to: { col: 3, row: 9 },
  },
  {
    move: '▲1六歩',
    hint: '1筋の歩を突いて端の守りを固めます。',
    from: { col: 1, row: 7 },
    to: { col: 1, row: 6 },
  },
  {
    move: '▲9六歩',
    hint: '9筋の歩も突いて守りを整えます。振り飛車穴熊完成！',
    from: { col: 9, row: 7 },
    to: { col: 9, row: 6 },
  },
  {
    move: '振り飛車穴熊完成！',
    hint: '振り飛車最強の守りを誇る振り飛車穴熊が完成しました！',
    from: null,
    to: null,
  },
]

export const CASTLES: Castle[] = [
  {
    id: 'mino',
    name: '美濃囲い',
    type: 'furibisha',
    difficulty: 'easy',
    tags: ['居飛車向き'],
    description: [
      'バランスが良く扱いやすい',
      '受けが強く持久戦に強い',
      '初心者におすすめの基本形',
    ],
    features: [
      'バランスが良く扱いやすい',
      '受けが強く持久戦に強い',
      '初心者におすすめの基本形',
    ],
    weaknesses: [
      '端を攻められると弱い',
      '急戦にはやや弱い',
      '攻めがやや受け身になりやすい',
    ],
    recommendedAgainst: '居飛車党全般に有効\n特に振り飛車に強い',
    basicSteps: [
      '▲7六歩',
      '▲7八飛',
      '▲6八銀',
      '▲4八玉',
      '▲3八玉',
      '▲7八銀',
    ],
    pieces: MINO_PIECES,
    guidePieces: MINO_GUIDE_PIECES,
    guideSteps: buildGuideSteps(MINO_GUIDE_PIECES, MINO_MOVE_SPECS),
    guideHighlight: { col: 7, row: 8 },
    guideNextMove: '▲7八銀',
    guideStep: [6, 10],
    guideProgress: 60,
    testPieces: MINO_TEST_PIECES,
    testScore: 85,
    testMessage: 'あと少しで完成！',
    testGoodPoints: [
      '玉の囲いを完成に近い',
      '金銀の配置が良い',
      '左辺の受けが整っている',
    ],
    testFixPoints: [
      '右銀を六にあがろう',
      '飛車の位置が課題',
      '桂馬の活用を考えよう',
    ],
  },
  {
    id: 'takamino',
    name: '高美濃',
    type: 'furibisha',
    difficulty: 'medium',
    tags: ['居飛車向き'],
    description: [
      '美濃囲いをさらに発展させた形',
      '玉の囲いがより堅固',
      'しっかり捌きたい人に向く',
    ],
    features: ['美濃囲いよりさらに堅い', '端攻めへの耐性が高い', '持久戦に強い'],
    weaknesses: ['組むのに手数がかかる', '急戦に対応しにくい'],
    recommendedAgainst: '持久戦志向の居飛車党',
    basicSteps: ['▲7六歩', '▲6八玉', '▲7八玉', '▲8八玉', '▲7八銀', '▲7七銀'],
    pieces: SIMPLE_CASTLE_PIECES(8, 7, 7, 9),
    guidePieces: TAKAMINO_GUIDE_PIECES,
    guideSteps: buildGuideSteps(TAKAMINO_GUIDE_PIECES, TAKAMINO_MOVE_SPECS),
    guideHighlight: { col: 7, row: 8 },
    guideNextMove: '▲7八銀',
    guideStep: [5, 8],
    guideProgress: 62,
    testPieces: MINO_TEST_PIECES,
    testScore: 80,
    testMessage: 'もう少し！',
    testGoodPoints: ['玉の位置が正しい', '金の配置が良い'],
    testFixPoints: ['銀をもう一段上げよう'],
  },
  {
    id: 'ginkan',
    name: '銀冠',
    type: 'ibisha',
    difficulty: 'medium',
    tags: ['居飛車向き'],
    description: [
      '銀で玉を囲うコンパクトな囲い',
      '攻守のバランスが良い',
      '急戦にも対応しやすい',
    ],
    features: ['攻守バランスが良い', '組みやすい', '相手を選ばない'],
    weaknesses: ['銀が守りに固定される', '端攻めが有効'],
    recommendedAgainst: '居飛車・振り飛車どちらにも',
    basicSteps: ['▲7六歩', '▲6八銀', '▲5七銀', '▲4八玉', '▲3八玉', '▲2八玉'],
    pieces: SIMPLE_CASTLE_PIECES(7, 6, 6, 9),
    guidePieces: GINKAN_GUIDE_PIECES,
    guideSteps: buildGuideSteps(GINKAN_GUIDE_PIECES, GINKAN_MOVE_SPECS),
    guideHighlight: { col: 6, row: 8 },
    guideNextMove: '▲6八銀',
    guideStep: [4, 8],
    guideProgress: 50,
    testPieces: MINO_TEST_PIECES,
    testScore: 75,
    testMessage: 'あともう一息！',
    testGoodPoints: ['銀の位置が合っている'],
    testFixPoints: ['玉をもう少し右に', '金の配置を調整'],
  },
  {
    id: 'yagura',
    name: '矢倉囲い',
    type: 'ibisha',
    difficulty: 'hard',
    tags: ['居飛車向き'],
    description: [
      '居飛車の最も堅い囲いの一つ',
      '高段者で高い採用率',
      '囲いの理解が重要',
    ],
    features: ['非常に堅固', '持久戦に圧倒的に強い', '金銀4枚の強固な守り'],
    weaknesses: ['組むのに多くの手数', '急戦に崩されることも'],
    recommendedAgainst: '相居飛車（矢倉戦）',
    basicSteps: ['▲7六歩', '▲6八銀', '▲7七銀', '▲6九玉', '▲7九玉', '▲6八金'],
    pieces: YAGURA_PIECES,
    guidePieces: YAGURA_GUIDE_PIECES,
    guideSteps: buildGuideSteps(YAGURA_GUIDE_PIECES, YAGURA_MOVE_SPECS),
    guideHighlight: { col: 6, row: 8 },
    guideNextMove: '▲6八玉',
    guideStep: [7, 12],
    guideProgress: 58,
    testPieces: MINO_TEST_PIECES,
    testScore: 70,
    testMessage: 'もう少し頑張ろう！',
    testGoodPoints: ['銀の配置が正しい'],
    testFixPoints: ['玉をさらに移動', '金を上に上げよう', '角の使い方を工夫'],
  },
  {
    id: 'fune',
    name: '舟囲い',
    type: 'ibisha',
    difficulty: 'medium',
    tags: ['居飛車向き'],
    description: [
      '玉を守る囲みのない囲い',
      '相手の攻めに合わせやすい',
      '六角の駒の展開を抑える',
    ],
    features: ['素早く組める', '攻撃的な構え', '柔軟な対応が可能'],
    weaknesses: ['守りが薄い', '持久戦には向かない'],
    recommendedAgainst: '速攻志向の相手',
    basicSteps: ['▲7六歩', '▲6八玉', '▲7八玉', '▲5八金右', '▲4八銀', '▲3八銀'],
    pieces: SIMPLE_CASTLE_PIECES(7, 6, 7, 2),
    guidePieces: FUNE_GUIDE_PIECES,
    guideSteps: buildGuideSteps(FUNE_GUIDE_PIECES, FUNE_MOVE_SPECS),
    guideHighlight: { col: 6, row: 8 },
    guideNextMove: '▲6八金',
    guideStep: [3, 7],
    guideProgress: 43,
    testPieces: MINO_TEST_PIECES,
    testScore: 78,
    testMessage: 'いい感じ！',
    testGoodPoints: ['玉の位置が正しい'],
    testFixPoints: ['金をもう少し上に'],
  },
  {
    id: 'ibisha-anaguma',
    name: '居飛車穴熊',
    type: 'ibisha',
    difficulty: 'hard',
    tags: ['居飛車向き'],
    description: [
      '最も堅固な囲いの一つ',
      '守りを固めて攻撃を狙う',
      '上級者向けの戦法',
    ],
    features: ['圧倒的な堅さ', '持久戦最強クラス', '玉が安全'],
    weaknesses: ['組むのが難しい', '攻めへの転換に手数', '端攻めに注意'],
    recommendedAgainst: '振り飛車党（対振り飛車で多用）',
    basicSteps: ['▲7六歩', '▲6八玉', '▲7八玉', '▲8八玉', '▲9八玉', '▲8八銀'],
    pieces: SIMPLE_CASTLE_PIECES(9, 8, 8, 2),
    guidePieces: IBISHA_ANAGUMA_GUIDE_PIECES,
    guideSteps: buildGuideSteps(IBISHA_ANAGUMA_GUIDE_PIECES, IBISHA_ANAGUMA_MOVE_SPECS),
    guideHighlight: { col: 9, row: 8 },
    guideNextMove: '▲9八玉',
    guideStep: [8, 14],
    guideProgress: 57,
    testPieces: MINO_TEST_PIECES,
    testScore: 72,
    testMessage: 'あともう少し！',
    testGoodPoints: ['金銀の形が良い'],
    testFixPoints: ['玉をもっと端に', '上部補強が必要'],
  },
  {
    id: 'furibisha-anaguma',
    name: '振り飛車穴熊',
    type: 'furibisha',
    difficulty: 'hard',
    tags: ['振り飛車向き'],
    description: [
      '振り飛車の最強囲い',
      '玉を遠く囲って戦う',
      '受けの強さは抜群',
    ],
    features: ['振り飛車最強の守り', '長期戦で力を発揮', '相手に主導権を与えない'],
    weaknesses: ['組むのが長い', '端攻めを食らいやすい', '攻めの駒が使いにくい'],
    recommendedAgainst: '居飛車党（相穴熊も含む）',
    basicSteps: ['▲7六歩', '▲7八飛', '▲6八銀', '▲5八金', '▲4八玉', '▲3八玉'],
    pieces: SIMPLE_CASTLE_PIECES(1, 2, 2, 7),
    guidePieces: FURIBISHA_ANAGUMA_GUIDE_PIECES,
    guideSteps: buildGuideSteps(FURIBISHA_ANAGUMA_GUIDE_PIECES, FURIBISHA_ANAGUMA_MOVE_SPECS),
    guideHighlight: { col: 1, row: 8 },
    guideNextMove: '▲1八玉',
    guideStep: [6, 12],
    guideProgress: 50,
    testPieces: MINO_TEST_PIECES,
    testScore: 68,
    testMessage: 'もう少し頑張ろう！',
    testGoodPoints: ['飛車の位置が良い'],
    testFixPoints: ['玉をもっと端に移動', '銀金の配置を整えよう'],
  },
]

export function getCastle(id: string): Castle | undefined {
  return CASTLES.find(c => c.id === id)
}
