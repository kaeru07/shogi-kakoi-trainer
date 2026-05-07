import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.soneko.shogikakoi',
  appName: '囲いトレーナー',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
  },
}

export default config
