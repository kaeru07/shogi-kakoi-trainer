'use client'

import { use } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShogiBoard from '../../components/ShogiBoard'
import BottomNav from '../../components/BottomNav'
import { getCastle } from '../../lib/castles'

export default function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const castle = getCastle(id)
  if (!castle) notFound()

  const [showHint, setShowHint] = useState(false)

  const [step, total] = castle.guideStep
  const progress = castle.guideProgress

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
          <h1 className="text-lg font-bold text-gray-900">誘導モード</h1>
        </div>
        <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
          ?
        </button>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* Target castle + progress */}
        <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7B5E2A] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            囲
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">目標の囲い</div>
            <div className="font-bold text-sm text-gray-900">{castle.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">進行状況</div>
            <div className="font-bold text-sm text-[#7B5E2A]">{step}/{total}手</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2E7D32] rounded-full transition-all"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>

        {/* Board */}
        <div className="bg-[#E8DFC8] rounded-2xl p-4">
          <ShogiBoard pieces={castle.guidePieces} highlight={castle.guideHighlight} />
        </div>

        {/* Next move */}
        <div className="bg-[#1a2744] text-white rounded-xl p-4">
          <div className="text-xs opacity-70 mb-1">次の一手</div>
          <div className="text-2xl font-bold">{castle.guideNextMove}</div>
          <div className="text-xs opacity-70 mt-1">手番: ▲（あなた）</div>
        </div>

        {/* Hint */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">💡</span>
            <span className="font-bold text-sm text-gray-800">ヒント</span>
          </div>
          {showHint ? (
            <p className="text-sm text-gray-700">
              金の守りを補強して玉を囲う準備をします。銀を上に上げることで、玉の安全性が高まります。
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">ヒントを見るボタンを押してください</p>
          )}
        </div>

        {/* Achievement */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">達成度</span>
            <span className="text-lg font-bold text-[#2E7D32]">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2E7D32] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <button className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl bg-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            やり直し
          </button>
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center justify-center gap-2 bg-[#7B5E2A] text-white font-bold py-3 rounded-xl shadow"
          >
            <span>💡</span>
            ヒントを見る
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
