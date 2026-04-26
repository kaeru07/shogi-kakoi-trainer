import Link from 'next/link'
import BottomNav from '../components/BottomNav'

export default function RecordsPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      <header className="flex items-center gap-3 px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900">学習記録</h1>
      </header>

      <div className="px-4 py-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#7B5E2A] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
          </svg>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">学習記録</h2>
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
              '練習回数の記録',
              '囲いごとの正答率',
              '完成度の推移グラフ',
              '連続学習ストリーク',
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
          囲いの練習を始める
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
