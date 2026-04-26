import Link from 'next/link'
import ShogiBoard from './ShogiBoard'
import type { Castle } from '@/app/lib/types'

type Props = { castle: Castle }

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '易しい',
  medium: '普通',
  hard: '難しい',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-green-600 text-white',
  medium: 'bg-orange-500 text-white',
  hard: 'bg-red-600 text-white',
}

const TYPE_COLOR: Record<string, string> = {
  ibisha: 'bg-[#1a2744] text-white',
  furibisha: 'bg-[#4a1a6e] text-white',
  both: 'bg-[#1a4a2e] text-white',
}

const TYPE_LABEL: Record<string, string> = {
  ibisha: '居飛車向き',
  furibisha: '居飛車向き',
  both: '汎用',
}

export default function CastleCard({ castle }: Props) {
  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-3 gap-3">
      {/* Board preview */}
      <div className="w-24 flex-shrink-0">
        <ShogiBoard pieces={castle.pieces} small />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-bold text-base text-gray-900">{castle.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_COLOR[castle.type]}`}>
            {castle.tags[0] ?? TYPE_LABEL[castle.type]}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${DIFFICULTY_COLOR[castle.difficulty]}`}>
            {DIFFICULTY_LABEL[castle.difficulty]}
          </span>
        </div>
        <ul className="text-xs text-gray-600 space-y-0.5 mb-2">
          {castle.description.map((d, i) => (
            <li key={i} className="truncate">・{d}</li>
          ))}
        </ul>
        <Link
          href={`/castles/${castle.id}`}
          className="inline-block bg-[#1a2744] text-white text-xs font-medium px-4 py-1.5 rounded-lg"
        >
          練習する
        </Link>
      </div>
    </div>
  )
}
