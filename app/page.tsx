import Link from 'next/link'
import ShogiBoard from './components/ShogiBoard'
import BottomNav from './components/BottomNav'
import { getCastle } from './lib/castles'

export default function HomePage() {
  const mino = getCastle('mino')!

  return (
    <div className="min-h-screen flex flex-col pb-safe bg-[#F5F0E8]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#7B5E2A] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            囲
          </div>
          <h1 className="text-xl font-bold text-gray-900">囲いトレーナー</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </svg>
        </button>
      </header>

      <p className="text-center text-sm text-gray-600 px-4 pb-4">
        囲い（守りの形）を学んで、<br />実戦で勝ちに近づこう
      </p>

      {/* Board illustration */}
      <div className="px-6 mb-4">
        <div className="bg-[#E8DFC8] rounded-2xl p-4 shadow-inner">
          <ShogiBoard pieces={mino.pieces} />
        </div>
      </div>

      {/* Today's recommended */}
      <div className="mx-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500">★</span>
          <span className="text-sm font-bold text-gray-800">今日のおすすめ練習</span>
        </div>
        <Link href="/guide/mino" className="block bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7B5E2A] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-gray-900">美濃囲いの基本を覚えよう</div>
              <div className="text-xs text-gray-500">誘導モードで基礎手順を確認</div>
            </div>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Main navigation buttons */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        <Link href="/castles" className="flex flex-col items-center justify-center bg-[#1a2744] text-white rounded-xl py-4 gap-1.5 shadow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
          <span className="font-bold text-sm">囲い一覧</span>
          <span className="text-[10px] opacity-80">すべての囲いを見る</span>
        </Link>
        <Link href="/guide/mino" className="flex flex-col items-center justify-center bg-[#7B5E2A] text-white rounded-xl py-4 gap-1.5 shadow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <span className="font-bold text-sm">誘導モード</span>
          <span className="text-[10px] opacity-80">一手ずつ覚える</span>
        </Link>
        <Link href="/test/mino" className="flex flex-col items-center justify-center bg-[#2E7D32] text-white rounded-xl py-4 gap-1.5 shadow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className="font-bold text-sm">テストモード</span>
          <span className="text-[10px] opacity-80">完成度をチェック</span>
        </Link>
        <div className="flex flex-col items-center justify-center bg-gray-300 text-gray-500 rounded-xl py-4 gap-1.5 shadow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <span className="font-bold text-sm">実戦判断モード</span>
          <span className="text-[10px]">Coming Soon</span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
