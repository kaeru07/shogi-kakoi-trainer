import Link from 'next/link'
import BottomNav from '../components/BottomNav'

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      <header className="flex items-center gap-3 px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900">ブックマーク</h1>
      </header>

      <div className="px-4 py-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#7B5E2A] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">保存した囲い</h2>
          <span className="bg-[#7B5E2A] text-white text-xs px-3 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full max-w-sm">
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            今後、以下の機能を追加予定です
          </p>
          <ul className="mt-4 space-y-2">
            {[
              'よく使う囲いの保存',
              '復習したい囲いの管理',
              '囲いメモの記録',
              '比較・並べ替え機能',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B5E2A] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/castles"
          className="bg-[#1a2744] text-white font-bold py-3 px-8 rounded-xl shadow text-sm"
        >
          囲い一覧を見る
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
