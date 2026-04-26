import Link from 'next/link'
import CastleCard from '../components/CastleCard'
import BottomNav from '../components/BottomNav'
import { CASTLES } from '../lib/castles'

export default function CastlesPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">囲い一覧</h1>
        </div>
        <button className="text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </header>

      {/* Castle list */}
      <div className="px-4 py-4 space-y-3">
        {CASTLES.map(castle => (
          <CastleCard key={castle.id} castle={castle} />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
