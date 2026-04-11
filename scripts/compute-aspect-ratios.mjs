import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const postsDir = path.resolve('content/posts')
const publicDir = path.resolve('public')

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'))

for (const file of files) {
  const filePath = path.join(postsDir, file)
  const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const imagePath = path.join(publicDir, post.imageUrl)

  if (!fs.existsSync(imagePath)) {
    console.log(`SKIP ${file} — image not found: ${post.imageUrl}`)
    continue
  }

  try {
    const output = execSync(`magick identify -format "%w %h" "${imagePath}"`, { encoding: 'utf-8' }).trim()
    const [w, h] = output.split(' ').map(Number)
    const ratio = w / h

    let aspectRatio
    if (ratio < 0.8) aspectRatio = 'portrait'
    else if (ratio > 1.25) aspectRatio = 'landscape'
    else aspectRatio = 'square'

    post.aspectRatio = aspectRatio
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2) + '\n')
    console.log(`${file}: ${w}x${h} = ${ratio.toFixed(2)} → ${aspectRatio}`)
  } catch (err) {
    console.log(`ERROR ${file}: ${err.message}`)
  }
}
