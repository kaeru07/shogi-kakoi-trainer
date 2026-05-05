'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import BottomNav from '../components/BottomNav'
import { getLearningRecords } from '../lib/learningRecords'
import type { LearningRecord } from '../lib/learningRecords'
import { CASTLES } from '../lib/castles'

const TOTAL_CASTLES = CASTLES.length

function subscribeToLearningRecords(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  return () => window.removeEventListener('storage', onStoreChange)
}

function getRecordsSnapshot(): string {
  return JSON.stringify(getLearningRecords())
}

function getServerRecordsSnapshot(): string {
  return '[]'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function RecordsPage() {
  const recordsSnapshot = useSyncExternalStore(
    subscribeToLearningRecords,
    getRecordsSnapshot,
    getServerRecordsSnapshot,
  )
  const records = useMemo(
    () => JSON.parse(recordsSnapshot) as LearningRecord[],
    [recordsSnapshot],
  )

  const learned = records.length
  const percent = TOTAL_CASTLES > 0 ? Math.round((learned / TOTAL_CASTLES) * 100) : 0

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

      <div className="px-4 py-4 space-y-4">
        {/* Stats card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">習得済み囲い</span>
            <span className="text-sm font-bold text-[#7B5E2A]">
              {learned} / {TOTAL_CASTLES}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2E7D32] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">{percent}% 完了</p>
        </div>

        {/* Records list */}
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-4">まだ学習記録がありません。</p>
            <Link
              href="/castles"
              className="inline-block bg-[#1a2744] text-white font-bold py-2.5 px-6 rounded-xl shadow text-sm"
            >
              囲いの練習を始める
            </Link>
          </div>
        ) : (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">習得済み</h2>
            <ul className="space-y-2">
              {records.map((r) => (
                <li key={r.id}>
                  <Link href={`/castles/${r.id}`}>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 hover:border-[#7B5E2A]/30 transition-colors active:scale-[0.99]">
                      <span className="text-[#2E7D32] text-lg flex-shrink-0">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(r.learnedAt)}</p>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-300 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Unlearned castles */}
        {records.length > 0 && (
          <section>
            {(() => {
              const learnedIds = new Set(records.map((r) => r.id))
              const unlearned = CASTLES.filter((c) => !learnedIds.has(c.id))
              if (unlearned.length === 0) return null
              return (
                <>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">未習得 ({unlearned.length})</h2>
                  <ul className="space-y-2">
                    {unlearned.map((c) => (
                      <li key={c.id}>
                        <Link href={`/castles/${c.id}`}>
                          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 hover:border-gray-300 transition-colors active:scale-[0.99] opacity-70">
                            <span className="text-gray-300 text-lg flex-shrink-0">○</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-700">{c.name}</p>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-300 flex-shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )
            })()}
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
