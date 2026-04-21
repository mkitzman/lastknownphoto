export interface Post {
  id: string
  slug: string
  name: string
  title: string
  imageUrl: string
  date: string
  deathDate: string
  age: number | null
  tags: string[]
  sourceUrl: string | null
  sourceLabel: string | null
  description: string
  bio?: string | null
  photoCredit?: string | null
  additionalImages?: string[]
  additionalImagesNote?: string | null
  aspectRatio?: 'portrait' | 'landscape' | 'square' | null
  wikipediaUrl?: string | null
  createdAt?: string | null
  focalPoint?: { x: number; y: number } | null
  location?: {
    name: string
    lat: number
    lng: number
    mapsUrl: string
  } | null
}

export function getWikipediaUrl(post: Post): string {
  if (post.wikipediaUrl) return post.wikipediaUrl
  return `https://en.wikipedia.org/wiki/${post.name.replace(/ /g, '_')}`
}

function deathYear(post: Post): number | null {
  const t = Date.parse(post.deathDate.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
  if (isNaN(t)) return null
  return new Date(t).getUTCFullYear()
}

export function getDecade(post: Post): string | null {
  const y = deathYear(post)
  if (!y) return null
  return `${Math.floor(y / 10) * 10}s`
}

export function getYears(post: Post): string | null {
  const death = deathYear(post)
  if (!death) return null
  if (post.age != null) return `${death - post.age}–${death}`
  return `${death}`
}

export function getProfession(post: Post): string | null {
  return post.tags[0] || null
}

/** Interval between photo date and death date, formatted with unit. */
export function getInterval(post: Post): string | null {
  const photo = Date.parse(post.date.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
  const death = Date.parse(post.deathDate.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
  if (isNaN(photo) || isNaN(death)) return null
  const diffMs = Math.max(0, death - photo)
  const hours = diffMs / (1000 * 60 * 60)
  const days = hours / 24
  if (hours < 24) return `${Math.round(hours)}h`
  if (days < 60) return `${Math.round(days)}d`
  const months = days / 30
  if (months < 12) return `${Math.round(months)}mo`
  return `${Math.round(days / 365)}y`
}

const postModules = import.meta.glob<Post>('../../content/posts/*.json', { eager: true, import: 'default' })

function parseDate(d: string): number {
  if (!d) return 0
  // Strip ordinal suffixes (1st, 2nd, 3rd, 4th, etc.)
  const cleaned = d.replace(/(\d+)(st|nd|rd|th)/g, '$1')
  const t = Date.parse(cleaned)
  return isNaN(t) ? 0 : t
}

export const posts: Post[] = Object.values(postModules).sort((a, b) => {
  return parseDate(b.createdAt || '') - parseDate(a.createdAt || '')
})

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter(p => p.tags.includes(tag))
}
