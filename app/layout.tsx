import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#7B5E2A',
}

export const metadata: Metadata = {
  title: '囲いトレーナー | 将棋の守り形を学ぼう',
  description: '将棋の囲い（守りの形）をステップごとに学べる学習アプリ。美濃囲い・矢倉・穴熊など7種類の囲いを誘導モードで一手ずつ覚え、テストモードで実力を確認しよう。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '囲いトレーナー',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  keywords: ['将棋', '囲い', '学習', '美濃囲い', '矢倉', '穴熊', '囲いトレーナー'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
