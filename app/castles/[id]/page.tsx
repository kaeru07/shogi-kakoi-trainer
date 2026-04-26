import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShogiBoard from '../../components/ShogiBoard'
import BottomNav from '../../components/BottomNav'
import { getCastle } from '../../lib/castles'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '易しい',
  medium: '普通',
  hard: '難しい',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-green-600',
  medium: 'bg-orange-500',
  hard: 'bg-red-600',
}

export default async function CastleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const castle = getCastle(id)
  if (!castle) notFound()

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/castles" className="text-gray-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{castle.name}</h1>
        </div>
        <button className="text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
        </button>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Board */}
        <div className="bg-[#E8DFC8] rounded-2xl p-4">
          <ShogiBoard pieces={castle.pieces} />
        </div>

        {/* Difficulty & type badges */}
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded font-medium text-white ${DIFFICULTY_COLOR[castle.difficulty]}`}>
            {DIFFICULTY_LABEL[castle.difficulty]}
          </span>
          {castle.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded font-medium bg-[#1a2744] text-white">
              {tag}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-2">特徴</h2>
          <ul className="space-y-1">
            {castle.features.map((f, i) => (
              <li key={i} className="text-sm text-gray-700">・{f}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-2">弱点</h2>
          <ul className="space-y-1">
            {castle.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-gray-700">・{w}</li>
            ))}
          </ul>
        </div>

        {/* Recommended against */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-1">おすすめの対戦相手</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{castle.recommendedAgainst}</p>
        </div>

        {/* Basic steps */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-2">基本手順（例）</h2>
          <div className="flex flex-wrap gap-2">
            {castle.basicSteps.map((step, i) => (
              <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium">
                {i + 1}. {step}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <Link
            href={`/guide/${castle.id}`}
            className="flex items-center justify-center gap-2 bg-[#7B5E2A] text-white font-bold py-3 rounded-xl shadow"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            誘導モード開始
          </Link>
          <Link
            href={`/test/${castle.id}`}
            className="flex items-center justify-center gap-2 bg-[#1a2744] text-white font-bold py-3 rounded-xl shadow"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            テスト開始
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
