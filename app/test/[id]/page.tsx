'use client'

import { use } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShogiBoard from '../../components/ShogiBoard'
import BottomNav from '../../components/BottomNav'
import { getCastle } from '../../lib/castles'

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const castle = getCastle(id)
  if (!castle) notFound()

  const [scored, setScored] = useState(false)
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href={`/castles/${castle.id}`} className="text-gray-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">テストモード</h1>
        </div>
        <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
          ?
        </button>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* Task instruction */}
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-sm font-bold text-gray-800">
            この局面から{castle.name}を完成させてください
          </p>
        </div>

        {/* Board */}
        <div className="bg-[#E8DFC8] rounded-2xl p-4">
          <ShogiBoard pieces={castle.testPieces} />
        </div>

        {/* Score */}
        {scored && (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-800">完成度</span>
                <span className="text-3xl font-bold text-[#2E7D32]">{castle.testScore}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[#2E7D32] rounded-full"
                  style={{ width: `${castle.testScore}%` }}
                />
              </div>
              <p className="text-sm font-bold text-[#2E7D32] text-center">{castle.testMessage}</p>
            </div>

            {/* Good points */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-bold text-sm text-gray-800">良い点</span>
              </div>
              <ul className="space-y-1">
                {castle.testGoodPoints.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700">・{p}</li>
                ))}
              </ul>
            </div>

            {/* Fix points */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500 font-bold">✕</span>
                <span className="font-bold text-sm text-gray-800">修正点</span>
              </div>
              <ul className="space-y-1">
                {castle.testFixPoints.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700">・{p}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Hint */}
        {showHint && !scored && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span>💡</span>
              <span className="font-bold text-sm text-gray-800">ヒント</span>
            </div>
            <p className="text-sm text-gray-700">
              {castle.name}の基本形を思い出してみましょう。玉・金・銀の正しい位置はどこでしょうか？
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 pb-4">
          <button className="flex flex-col items-center justify-center gap-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl bg-white text-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            やり直し
          </button>
          <button
            onClick={() => setShowHint(true)}
            className="flex flex-col items-center justify-center gap-1 border-2 border-[#7B5E2A] text-[#7B5E2A] font-bold py-3 rounded-xl bg-white text-xs"
          >
            <span>💡</span>
            ヒントを見る
          </button>
          <button
            onClick={() => setScored(true)}
            className="flex flex-col items-center justify-center gap-1 bg-[#2E7D32] text-white font-bold py-3 rounded-xl shadow text-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            採点する
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
