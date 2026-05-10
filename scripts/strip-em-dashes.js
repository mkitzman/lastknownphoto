#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '..', 'content', 'posts')

// Replace " — " with ", "; also handle the no-space variant defensively.
function strip(value) {
  if (typeof value !== 'string') return value
  return value.replace(/ — /g, ', ').replace(/—/g, ', ')
}

// Recursively rewrite strings in an object, but skip lyrics.text (user's verbatim paste).
function transform(node, parentKey) {
  if (Array.isArray(node)) return node.map((item) => transform(item, parentKey))
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) {
      if (parentKey === 'lyrics' && k === 'text') {
        out[k] = v
      } else {
        out[k] = transform(v, k)
      }
    }
    return out
  }
  return strip(node)
}

function main() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'))
  let touched = 0
  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file)
    const original = fs.readFileSync(fullPath, 'utf-8')
    const post = JSON.parse(original)
    const updated = transform(post, null)
    const next = JSON.stringify(updated, null, 2) + '\n'
    if (next !== original) {
      fs.writeFileSync(fullPath, next)
      touched += 1
    }
  }
  console.log(`Touched ${touched} files`)
}

main()
