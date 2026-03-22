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
  wikipediaUrl?: string | null
  createdAt?: string | null
}

export function getWikipediaUrl(post: Post): string {
  if (post.wikipediaUrl) return post.wikipediaUrl
  return `https://en.wikipedia.org/wiki/${post.name.replace(/ /g, '_')}`
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
