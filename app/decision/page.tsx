import Link from 'next/link'
import BottomNav from '../components/BottomNav'

const OPPONENT_TYPES = [
  { label: '振り飛車党', icon: '♟' },
  { label: '居飛車党', icon: '♖' },
  { label: 'バランス型', icon: '⚖' },
  { label: 'わからない', icon: '?' },
]

const MY_STYLES = [
  { label: '守りを重視', icon: '🛡' },
  { label: 'バランス重視', icon: '⚖' },
  { label: '攻めを重視', icon: '✏' },
]

const RECOMMENDED = [
  { id: 'mino', name: '美濃囲い', tag: '居飛車向き', tagColor: 'bg-[#1a2744]', desc: 'バランス良く\n扱いやすい' },
  { id: 'ginkan', name: '銀冠', tag: '居飛車向き', tagColor: 'bg-[#1a2744]', desc: 'コンパクトで\n攻守のバランス' },
  { id: 'ibisha-anaguma', name: '居飛車穴熊', tag: '居飛車向き', tagColor: 'bg-[#1a2744]', desc: '最も堅固な囲いで\n粘りに強い' },
]

export default function DecisionPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-safe">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900 flex-1">実戦判断モード</h1>
        <span className="bg-[#7B5E2A] text-white text-xs px-2 py-0.5 rounded font-medium">
          Coming Soon
        </span>
      </header>

      <div className="px-4 py-4 space-y-4 relative">
        {/* Overlay for Coming Soon */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-10 rounded-xl" />

        {/* Description */}
        <div className="bg-white rounded-xl p-4 shadow-sm text-center relative z-0">
          <p className="text-sm text-gray-700 font-bold">
            対戦相手や状況に合わせて、最適な囲いを選ぼう！
          </p>
          <p className="text-xs text-gray-500 mt-1">
            実装予定の機能です。もうしばらくお待ちください。
          </p>
        </div>

        {/* Opponent type */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-3">相手のタイプを選択</h2>
          <div className="grid grid-cols-2 gap-2">
            {OPPONENT_TYPES.map(t => (
              <button
                key={t.label}
                className="flex items-center gap-2 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 bg-gray-50"
                disabled
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* My style */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-3">自分の方針を選択</h2>
          <div className="grid grid-cols-3 gap-2">
            {MY_STYLES.map(s => (
              <button
                key={s.label}
                className="flex flex-col items-center gap-1 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-700 bg-gray-50"
                disabled
              >
                <span className="text-lg">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended castles */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-3">おすすめの囲い（例）</h2>
          <div className="grid grid-cols-3 gap-2">
            {RECOMMENDED.map(r => (
              <div key={r.id} className="border border-gray-200 rounded-lg p-2 text-center">
                <div className="font-bold text-xs text-gray-900 mb-1">{r.name}</div>
                <span className={`text-[9px] px-1 py-0.5 rounded text-white font-medium ${r.tagColor}`}>
                  {r.tag}
                </span>
                <p className="text-[10px] text-gray-500 mt-1 whitespace-pre-line">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs text-amber-800">
            ⓘ 今後、対局中の手の進行に応じて、この囲いが適しているかをフィードバックで判定する機能を追加予定です。
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
