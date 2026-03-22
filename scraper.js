import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.join(__dirname, 'content', 'posts')
const IMAGES_DIR = path.join(__dirname, 'public', 'images')
const BASE_URL = 'https://lastknownphoto.com'
const DELAY = 500

fs.mkdirSync(POSTS_DIR, { recursive: true })
fs.mkdirSync(IMAGES_DIR, { recursive: true })

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function sanitizeFilename(url, name) {
  const ext = path.extname(new URL(url).pathname) || '.jpg'
  return slugify(name) + ext
}

async function downloadImage(url, filename) {
  const filepath = path.join(IMAGES_DIR, filename)
  if (fs.existsSync(filepath)) {
    console.log(`  Image already exists: ${filename}`)
    return
  }
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(filepath, buffer)
    console.log(`  Downloaded: ${filename}`)
  } catch (err) {
    console.error(`  Failed to download image: ${url} - ${err.message}`)
  }
}

function extractAge(text) {
  // Look for patterns like "age 46", "aged 46", "at the age of 46", "at 46"
  const patterns = [
    /(?:age|aged)\s+(\d+)/i,
    /at the age of\s+(\d+)/i,
    /(\d+)\s+years?\s+old/i,
  ]
  for (const pat of patterns) {
    const m = text.match(pat)
    if (m) return parseInt(m[1])
  }
  return null
}

function extractName(text) {
  // Try to extract the subject name from the caption
  // Common patterns: "Last known photo of X, ..." or "X taken at..."
  const patterns = [
    /last (?:known )?photo(?:graph)? of\s+(.+?)(?:,|\.|taken|before|who|at the)/i,
    /^(.+?)(?:\s*[-–—]\s*|\s*,\s*(?:taken|last|before|who|died))/i,
  ]
  for (const pat of patterns) {
    const m = text.match(pat)
    if (m) return m[1].trim()
  }
  // Fallback: take first part before comma
  const comma = text.indexOf(',')
  if (comma > 0 && comma < 100) return text.substring(0, comma).trim()
  return text.substring(0, 60).trim()
}

async function fetchTumblrAPI() {
  const allPosts = []
  let start = 0
  const num = 50

  while (true) {
    const url = `${BASE_URL}/api/read/json?num=${num}&start=${start}`
    console.log(`Fetching: ${url}`)

    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`API returned ${res.status}, trying HTML scraping instead`)
        return null
      }

      let text = await res.text()
      // Remove JSONP wrapper: var tumblr_api_read = {...};
      text = text.replace(/^var tumblr_api_read\s*=\s*/, '').replace(/;\s*$/, '')

      const data = JSON.parse(text)
      const posts = data.posts || []

      if (posts.length === 0) {
        console.log(`No more posts found at start=${start}`)
        break
      }

      console.log(`Found ${posts.length} posts (start=${start})`)

      for (const post of posts) {
        let captionText = ''
        let imageUrl = ''
        let $

        if (post.type === 'photo') {
          const caption = post['photo-caption'] || ''
          $ = cheerio.load(caption)
          captionText = $.text().trim()
          imageUrl = post['photo-url-1280'] || post['photo-url-500'] || post['photo-url-400'] || ''
        } else if (post.type === 'regular') {
          // Regular/text posts with images embedded in HTML body
          const body = post['regular-body'] || ''
          const title = post['regular-title'] || ''
          $ = cheerio.load(body)

          // Extract first image from the body HTML
          const img = $('img').first()
          imageUrl = img.attr('src') || img.attr('data-src') || ''

          // Try to get highest-res version of Tumblr images
          if (imageUrl.includes('tumblr.com')) {
            imageUrl = imageUrl.replace(/_\d+\./, '_1280.')
          }

          // Get text content (excluding image alt text noise)
          captionText = (title + ' ' + $.text()).trim()

          if (!imageUrl) {
            console.log(`  Skipping regular post without image: ${post.id}`)
            continue
          }
        } else {
          console.log(`  Skipping post type: ${post.type} (id: ${post.id})`)
          continue
        }

        // Extract tags
        const tags = (post.tags || []).map(t => t.toLowerCase())

        // Extract name
        let name = extractName(captionText)

        // Try to get name from slug
        if (!name || name.length < 2) {
          name = (post.slug || '').replace(/-/g, ' ')
        }

        const slug = post.slug || slugify(name || `post-${post.id}`)
        const age = extractAge(captionText)

        // Extract source
        let sourceUrl = null
        let sourceLabel = null
        if ($) {
          const sourceLink = $('a').last()
          if (sourceLink.length && sourceLink.attr('href')) {
            sourceUrl = sourceLink.attr('href')
            sourceLabel = sourceLink.text().trim() || 'Source'
          }
        }

        const postData = {
          id: String(post.id),
          slug,
          name: name || slug.replace(/-/g, ' '),
          title: captionText.substring(0, 300),
          imageUrl: `/images/${sanitizeFilename(imageUrl, name || slug)}`,
          date: post['date-gmt'] || post.date || '',
          deathDate: '',
          age,
          tags,
          sourceUrl,
          sourceLabel,
          description: captionText,
        }

        allPosts.push({ postData, originalImageUrl: imageUrl })

        if (!name || name.length < 2) {
          console.log(`  ⚠ Missing/ambiguous name for post ${post.id}: "${captionText.substring(0, 80)}"`)
        }
        if (!imageUrl) {
          console.log(`  ⚠ Missing image for post ${post.id}`)
        }
      }

      start += num
      await sleep(DELAY)
    } catch (err) {
      console.error(`Error fetching API at start=${start}: ${err.message}`)
      // If JSON parsing fails, the API might not be available
      if (start === 0) return null
      break
    }
  }

  return allPosts
}

async function fetchHTMLScrape() {
  const allPosts = []
  let page = 1

  while (true) {
    const url = page === 1 ? BASE_URL : `${BASE_URL}/page/${page}`
    console.log(`Fetching page: ${url}`)

    try {
      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 404) {
          console.log(`Page ${page} returned 404, done.`)
          break
        }
        console.error(`Page ${page} returned ${res.status}`)
        break
      }

      const html = await res.text()
      const $ = cheerio.load(html)

      // Find post elements - Tumblr themes vary, try common selectors
      const postElements = $('article, .post, .entry, [data-post-id]')

      if (postElements.length === 0) {
        console.log(`No posts found on page ${page}, done.`)
        break
      }

      console.log(`Found ${postElements.length} posts on page ${page}`)

      postElements.each((i, el) => {
        const $el = $(el)
        const img = $el.find('img').first()
        const imageUrl = img.attr('src') || img.attr('data-src') || ''
        const captionText = $el.find('.caption, .post-body, .description, p').text().trim()
        const postId = $el.attr('data-post-id') || $el.attr('id') || `html-${page}-${i}`
        const tagsEl = $el.find('.tags a, .tag')
        const tags = []
        tagsEl.each((_, t) => tags.push($(t).text().replace('#', '').trim().toLowerCase()))

        const name = extractName(captionText)
        const slug = slugify(name || `post-${postId}`)

        if (imageUrl) {
          allPosts.push({
            postData: {
              id: String(postId),
              slug,
              name: name || slug.replace(/-/g, ' '),
              title: captionText.substring(0, 300),
              imageUrl: `/images/${sanitizeFilename(imageUrl, name || slug)}`,
              date: '',
              deathDate: '',
              age: extractAge(captionText),
              tags,
              sourceUrl: null,
              sourceLabel: null,
              description: captionText,
            },
            originalImageUrl: imageUrl,
          })
        }
      })

      page++
      await sleep(DELAY)
    } catch (err) {
      console.error(`Error scraping page ${page}: ${err.message}`)
      break
    }
  }

  return allPosts
}

async function main() {
  console.log('=== Last Known Photo Scraper ===\n')

  // Try API first
  console.log('Trying Tumblr API v1...')
  let allPosts = await fetchTumblrAPI()

  // Fall back to HTML scraping
  if (!allPosts || allPosts.length === 0) {
    console.log('\nFalling back to HTML scraping...')
    allPosts = await fetchHTMLScrape()
  }

  if (!allPosts || allPosts.length === 0) {
    console.log('No posts found!')
    process.exit(1)
  }

  console.log(`\n=== Processing ${allPosts.length} posts ===\n`)

  // Download images and save JSON files
  for (const { postData, originalImageUrl } of allPosts) {
    console.log(`Processing: ${postData.name}`)

    if (originalImageUrl) {
      const filename = sanitizeFilename(originalImageUrl, postData.name || postData.slug)
      await downloadImage(originalImageUrl, filename)
      await sleep(DELAY)
    }

    // Save JSON
    const jsonPath = path.join(POSTS_DIR, `${postData.slug}.json`)
    fs.writeFileSync(jsonPath, JSON.stringify(postData, null, 2))
    console.log(`  Saved: ${postData.slug}.json`)
  }

  console.log(`\n=== Done! Processed ${allPosts.length} posts ===`)
  console.log(`Posts saved to: ${POSTS_DIR}`)
  console.log(`Images saved to: ${IMAGES_DIR}`)
}

main().catch(console.error)
