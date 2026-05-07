'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import BottomNav from '../components/BottomNav'
import { getLearningRecords } from '../lib/learningRecords'
import { CASTLES } from '../lib/castles'

const APP_VERSION = '1.0.0'

function subscribeToStorage(cb: () => void) {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}

function getSnapshot() {
  return JSON.stringify(getLearningRecords())
}

function getServerSnapshot() {
  return '[]'
}

export default function MyPage() {
  const snapshot = useSyncExternalStore(subscribeToStorage, getSnapshot, getServerSnapshot)
  const records = useMemo(() => JSON.parse(snapshot), [snapshot])
  const learned = records.length
  const total = CASTLES.length
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      <header className="flex items-center gap-3 px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900">マイページ</h1>
      </header>

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
        {/* Learning progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-3">学習進捗</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">習得済み囲い</span>
            <span className="text-sm font-bold text-[#7B5E2A]">{learned} / {total}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-[#2E7D32] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-right">{percent}% 完了</p>
          <Link
            href="/records"
            className="mt-3 flex items-center justify-between text-sm text-[#1a2744] font-medium"
          >
            <span>学習記録の詳細を見る</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </Link>
        </div>

        {/* About the app */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-3">アプリについて</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            「囲いトレーナー」は将棋の守りの形（囲い）を効率よく学べる学習アプリです。
            初心者から中級者まで、誘導モードとテストモードで7種類の囲いをマスターできます。
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>バージョン {APP_VERSION}</span>
          </div>
        </div>

        {/* Privacy info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-3">プライバシー</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#2E7D32] mt-0.5 flex-shrink-0">✓</span>
              学習記録はお使いの端末内にのみ保存されます
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2E7D32] mt-0.5 flex-shrink-0">✓</span>
              個人情報・位置情報は一切収集していません
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2E7D32] mt-0.5 flex-shrink-0">✓</span>
              外部サーバーへのデータ送信はありません
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2E7D32] mt-0.5 flex-shrink-0">✓</span>
              インターネット接続なしでもご利用いただけます
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              ※ プライバシーポリシーは近日公開予定です
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-3">免責事項</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本アプリは将棋の囲いを学ぶための教育用アプリです。
            掲載している手順・内容は学習目的で整理したものであり、
            実戦での効果を保証するものではありません。
            将棋の公式ルールは公益社団法人日本将棋連盟の規定に従ってください。
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-3">お問い合わせ</h2>
          <p className="text-sm text-gray-600">
            ご意見・ご要望・不具合のご報告はこちらからお寄せください。
          </p>
          <p className="mt-2 text-xs text-gray-400">
            ※ お問い合わせ先は近日公開予定です
          </p>
        </div>

        {/* Reset data */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-2">データ管理</h2>
          <p className="text-xs text-gray-500 mb-3">
            学習記録をすべて削除します。この操作は元に戻せません。
          </p>
          <button
            onClick={() => {
              if (confirm('学習記録をすべて削除してよろしいですか？')) {
                localStorage.removeItem('shogi-learned-castles')
                window.dispatchEvent(new Event('storage'))
              }
            }}
            className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm bg-white"
          >
            学習記録をリセット
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
