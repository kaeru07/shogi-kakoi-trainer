import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const iconSvg = readFileSync(join(root, 'public/icon.svg'))

// ── App Icon PNG sizes ──────────────────────────────────────────────
const iconTargets = [
  { path: 'public/icon-192.png', size: 192 },
  { path: 'public/icon-512.png', size: 512 },
  // iOS AppIcon (App Store requires 1024x1024)
  { path: 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png', size: 1024 },
]

for (const { path, size } of iconTargets) {
  await sharp(iconSvg, { density: Math.ceil(size * 72 / 512) })
    .resize(size, size)
    .png()
    .toFile(join(root, path))
  console.log(`✓ ${path} (${size}x${size})`)
}

// ── Splash screen: centered icon on app background ─────────────────
// iOS asset catalog requires 2732x2732
const SPLASH_SIZE = 2732
const SPLASH_BG = { r: 245, g: 240, b: 232, alpha: 1 }  // #F5F0E8
const ICON_SIZE = 512

const iconPngBuffer = await sharp(iconSvg, { density: Math.ceil(ICON_SIZE * 72 / 512) })
  .resize(ICON_SIZE, ICON_SIZE)
  .png()
  .toBuffer()

const splashBuffer = await sharp({
  create: {
    width: SPLASH_SIZE,
    height: SPLASH_SIZE,
    channels: 4,
    background: SPLASH_BG,
  },
})
  .composite([{
    input: iconPngBuffer,
    gravity: 'centre',
  }])
  .png({ compressionLevel: 9 })
  .toBuffer()

const splashDir = join(root, 'ios/App/App/Assets.xcassets/Splash.imageset')
const splashFiles = [
  'splash-2732x2732.png',
  'splash-2732x2732-1.png',
  'splash-2732x2732-2.png',
]

for (const name of splashFiles) {
  await sharp(splashBuffer).toFile(join(splashDir, name))
  console.log(`✓ ios splash/${name}`)
}

// Also write to public/ for PWA splash candidate
await sharp(splashBuffer)
  .resize(2048, 2048)
  .png()
  .toFile(join(root, 'public/splash.png'))
console.log('✓ public/splash.png (2048x2048)')

console.log('\nAll assets generated successfully.')
