import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { posts, getDecade, type Post } from '../data/posts'

export type SortMode = 'recent' | 'oldest' | 'newest' | 'shortest' | 'longest' | 'az'

export const SORT_ORDER: SortMode[] = ['recent', 'oldest', 'newest', 'shortest', 'longest', 'az']
export const SORT_LABELS: Record<SortMode, string> = {
  'recent': 'Recently added',
  'oldest': 'Oldest photo',
  'newest': 'Newest photo',
  'shortest': 'Shortest interval',
  'longest': 'Longest interval',
  'az': 'A – Z',
}

function parseDate(d: string | undefined | null): number {
  if (!d) return 0
  const t = Date.parse(d.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
  return isNaN(t) ? 0 : t
}

/** Milliseconds between photo and death, or null when either date is too vague to parse. */
function intervalMs(p: Post): number | null {
  const photo = parseDate(p.date)
  const death = parseDate(p.deathDate)
  if (!photo || !death) return null
  return Math.max(0, death - photo)
}

/** Sort ascending by key; posts without a key go last. */
function byKey(list: Post[], key: (p: Post) => number | null, dir: 1 | -1): Post[] {
  return [...list].sort((a, b) => {
    const ka = key(a)
    const kb = key(b)
    if (ka == null) return kb == null ? 0 : 1
    if (kb == null) return -1
    return (ka - kb) * dir
  })
}

/** Every decade from the earliest to the latest in the archive, including empty ones. */
export const decadeCounts = (() => {
  const counts = new Map<number, number>()
  for (const p of posts) {
    const d = getDecade(p)
    if (d) counts.set(parseInt(d), (counts.get(parseInt(d)) || 0) + 1)
  }
  if (!counts.size) return []
  const start = Math.min(...counts.keys())
  const end = Math.max(...counts.keys())
  const out: { decade: string; count: number }[] = []
  for (let y = start; y <= end; y += 10) out.push({ decade: `${y}s`, count: counts.get(y) || 0 })
  return out
})()

export function useFilter(options: { applySort?: boolean } = {}) {
  const route = useRoute()
  const router = useRouter()
  const applySort = options.applySort !== false

  const selectedDecade = computed(() => (route.query.decade as string) || null)
  const selectedTag = computed(() => (route.query.tag as string) || null)
  const sortMode = computed<SortMode>(() => {
    const q = route.query.sort as SortMode
    return SORT_ORDER.includes(q) ? q : 'recent'
  })

  function syncQuery(patch: Partial<{ decade: string | null; tag: string | null; sort: SortMode }>) {
    const next = { ...route.query } as Record<string, string | undefined>
    const decade = 'decade' in patch ? patch.decade : selectedDecade.value
    const tag = 'tag' in patch ? patch.tag : selectedTag.value
    const sort = patch.sort ?? sortMode.value

    delete next.mode
    delete next.decade
    delete next.tag
    delete next.sort

    if (decade) next.decade = decade
    if (tag) next.tag = tag
    if (sort !== 'recent') next.sort = sort

    router.replace({ query: next as Record<string, string> })
  }

  function selectDecade(decade: string | null) {
    syncQuery({ decade })
  }
  function selectTag(tag: string | null) {
    syncQuery({ tag })
  }
  function selectSort(sort: SortMode) {
    syncQuery({ sort })
  }

  const decadeOptions = computed(() => decadeCounts.filter(d => d.count > 0))

  const tagOptions = computed(() => {
    const counts = new Map<string, number>()
    for (const p of posts) {
      for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1)
    }
    return Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  })

  const filteredPosts = computed<Post[]>(() => {
    let list: Post[] = posts
    if (selectedDecade.value) list = list.filter(p => getDecade(p) === selectedDecade.value)
    if (selectedTag.value) list = list.filter(p => p.tags.includes(selectedTag.value!))
    if (!applySort) return list
    switch (sortMode.value) {
      case 'oldest': return byKey(list, p => parseDate(p.date) || null, 1)
      case 'newest': return byKey(list, p => parseDate(p.date) || null, -1)
      case 'shortest': return byKey(list, intervalMs, 1)
      case 'longest': return byKey(list, intervalMs, -1)
      case 'az': return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default: return byKey(list, p => parseDate(p.createdAt), -1)
    }
  })

  return {
    selectedDecade,
    selectedTag,
    sortMode,
    selectDecade,
    selectTag,
    selectSort,
    decadeOptions,
    tagOptions,
    filteredPosts,
  }
}
