import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.join(__dirname, 'icon.svg')
const outDir = path.join(__dirname, '..', 'public', 'icons')

mkdirSync(outDir, { recursive: true })

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'maskable-512.png', size: 512, padding: true },
]

for (const { name, size, padding } of sizes) {
  const img = sharp(svgPath).resize(size, size)
  if (padding) {
    const inner = Math.round(size * 0.7)
    await sharp(svgPath)
      .resize(inner, inner)
      .extend({
        top: Math.round((size - inner) / 2),
        bottom: Math.round((size - inner) / 2),
        left: Math.round((size - inner) / 2),
        right: Math.round((size - inner) / 2),
        background: '#1d6fd8',
      })
      .png()
      .toFile(path.join(outDir, name))
  } else {
    await img.png().toFile(path.join(outDir, name))
  }
  console.log('wrote', name)
}

await sharp(svgPath).resize(48, 48).png().toFile(path.join(__dirname, '..', 'public', 'favicon.png'))
console.log('wrote favicon.png')
