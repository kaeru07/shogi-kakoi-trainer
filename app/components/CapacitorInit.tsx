'use client'

import { useEffect } from 'react'

export default function CapacitorInit() {
  useEffect(() => {
    async function hideSplash() {
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen')
        await SplashScreen.hide({ fadeOutDuration: 300 })
      } catch {
        // Web 環境では無視（Capacitor 未使用時）
      }
    }
    hideSplash()
  }, [])

  return null
}
