import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { posts, getDecade, type Post } from '../data/posts'

export type FilterMode = 'decade' | 'tag'
export type SortMode = 'added' | 'death-desc' | 'death-asc'

export const SORT_ORDER: SortMode[] = ['added', 'death-desc', 'death-asc']
export const SORT_LABELS: Record<SortMode, string> = {
  'added': 'Recently added',
  'death-desc': 'Chronologically',
  'death-asc': 'Chronologically',
}
export const SORT_ARROWS: Record<SortMode, string> = {
  'added': '↓',
  'death-desc': '↓',
  'death-asc': '↑',
}

function parseDate(d: string | undefined | null): number {
  if (!d) return 0
  const t = Date.parse(d.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
  return isNaN(t) ? 0 : t
}

export function useFilter(options: { applySort?: boolean } = {}) {
  const route = useRoute()
  const router = useRouter()
  const applySort = options.applySort !== false

  const filterMode = computed<FilterMode>(() =>
    (route.query.mode as FilterMode) === 'tag' ? 'tag' : 'decade'
  )
  const selectedDecade = computed(() => (route.query.decade as string) || null)
  const selectedTag = computed(() => (route.query.tag as string) || null)
  const sortMode = computed<SortMode>(() => {
    const q = route.query.sort
    return q === 'death-desc' || q === 'death-asc' ? q : 'added'
  })

  function syncQuery(patch: Partial<{ mode: FilterMode; decade: string | null; tag: string | null; sort: SortMode }>) {
    const next = { ...route.query } as Record<string, string | undefined>
    const mode = patch.mode ?? filterMode.value
    const decade = 'decade' in patch ? patch.decade : selectedDecade.value
    const tag = 'tag' in patch ? patch.tag : selectedTag.value
    const sort = patch.sort ?? sortMode.value

    delete next.mode
    delete next.decade
    delete next.tag
    delete next.sort

    if (mode === 'tag') next.mode = 'tag'
    if (mode === 'decade' && decade) next.decade = decade
    if (mode === 'tag' && tag) next.tag = tag
    if (sort !== 'added') next.sort = sort

    router.replace({ query: next as Record<string, string> })
  }

  function setMode(mode: FilterMode) {
    syncQuery({ mode, decade: null, tag: null })
  }
  function selectDecade(decade: string | null) {
    syncQuery({ decade })
  }
  function selectTag(tag: string | null) {
    syncQuery({ tag })
  }
  function cycleSort() {
    const i = SORT_ORDER.indexOf(sortMode.value)
    syncQuery({ sort: SORT_ORDER[(i + 1) % SORT_ORDER.length] })
  }

  const postsWithDecade = computed(() =>
    posts.map(p => ({ post: p, decade: getDecade(p) }))
  )

  const decadeOptions = computed(() => {
    const counts = new Map<string, number>()
    for (const { decade } of postsWithDecade.value) {
      if (decade) counts.set(decade, (counts.get(decade) || 0) + 1)
    }
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([decade, count]) => ({ decade, count }))
  })

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
    if (filterMode.value === 'decade' && selectedDecade.value) {
      list = postsWithDecade.value
        .filter(x => x.decade === selectedDecade.value)
        .map(x => x.post)
    } else if (filterMode.value === 'tag' && selectedTag.value) {
      list = posts.filter(p => p.tags.includes(selectedTag.value!))
    }
    if (!applySort) return list
    const sorted = [...list]
    if (sortMode.value === 'death-desc') {
      sorted.sort((a, b) => parseDate(b.deathDate) - parseDate(a.deathDate))
    } else if (sortMode.value === 'death-asc') {
      sorted.sort((a, b) => parseDate(a.deathDate) - parseDate(b.deathDate))
    } else {
      sorted.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    }
    return sorted
  })

  return {
    filterMode,
    selectedDecade,
    selectedTag,
    sortMode,
    setMode,
    selectDecade,
    selectTag,
    cycleSort,
    decadeOptions,
    tagOptions,
    filteredPosts,
  }
}
