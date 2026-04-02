<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { posts } from '../data/posts'
import PostCard from '../components/PostCard.vue'

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const shuffledPosts = shuffle(posts)

const route = useRoute()
const selectedTag = ref<string | null>((route.query.tag as string) || null)
const activeCardId = ref<string | null>(null)

type LayoutMode = 'masonry' | 'bento'
const layoutMode = ref<LayoutMode>((localStorage.getItem('layoutMode') as LayoutMode) || 'bento')

function toggleLayout() {
  layoutMode.value = layoutMode.value === 'masonry' ? 'bento' : 'masonry'
  localStorage.setItem('layoutMode', layoutMode.value)
}

// Simulate CSS Grid's dense packing to find exactly how many 1x1 fillers are
// needed to eliminate all gaps. We model the grid as a 2D boolean array and
// place items using the same spanning rules as the CSS nth-child selectors.
const fillerCount = computed(() => {
  if (layoutMode.value !== 'bento') return 0
  const count = filteredPosts.value.length
  if (count === 0) return 0
  const cols = 4

  // Determine span for each post based on the CSS nth-child pattern
  function getSpan(index: number): [number, number] {
    const pos = index % 8
    if (pos === 0) return [2, 2] // 2col x 2row
    if (pos === 3) return [1, 2] // 1col x 2row
    if (pos === 5) return [2, 1] // 2col x 1row
    return [1, 1]
  }

  // Grid simulation: track occupied cells
  const grid: boolean[][] = []
  function ensureRows(r: number) {
    while (grid.length <= r) grid.push(new Array(cols).fill(false))
  }
  function canPlace(r: number, c: number, spanC: number, spanR: number): boolean {
    ensureRows(r + spanR - 1)
    for (let dr = 0; dr < spanR; dr++)
      for (let dc = 0; dc < spanC; dc++)
        if (c + dc >= cols || grid[r + dr][c + dc]) return false
    return true
  }
  function place(r: number, c: number, spanC: number, spanR: number) {
    for (let dr = 0; dr < spanR; dr++)
      for (let dc = 0; dc < spanC; dc++)
        grid[r + dr][c + dc] = true
  }
  function placeItem(spanC: number, spanR: number) {
    for (let r = 0; ; r++) {
      ensureRows(r)
      for (let c = 0; c <= cols - spanC; c++) {
        if (canPlace(r, c, spanC, spanR)) {
          place(r, c, spanC, spanR)
          return
        }
      }
    }
  }

  // Place all posts
  for (let i = 0; i < count; i++) {
    const [sc, sr] = getSpan(i)
    placeItem(sc, sr)
  }

  // Count empty cells in occupied rows
  let empties = 0
  for (const row of grid) {
    for (const cell of row) {
      if (!cell) empties++
    }
  }
  return empties
})

watch(() => route.query.tag, (tag) => {
  selectedTag.value = (tag as string) || null
})

// Curate tags: exclude person names (they duplicate posts) and merge near-duplicates
const allTags = computed(() => {
  const tagCount = new Map<string, number>()
  posts.forEach(p => p.tags.forEach(t => {
    tagCount.set(t, (tagCount.get(t) || 0) + 1)
  }))
  // Only show tags that appear on more than 1 post (category tags, not name tags)
  return Array.from(tagCount.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return shuffledPosts
  return shuffledPosts.filter(p => p.tags.includes(selectedTag.value!))
})

function clearFilter() {
  selectedTag.value = null
}
</script>

<template>
  <div class="home">
    <div class="filter-bar">
      <div class="filter-select-wrapper">
        <select v-model="selectedTag" class="filter-select" aria-label="Filter posts by tag">
          <option :value="null">all posts</option>
          <option v-for="{ tag, count } in allTags" :key="tag" :value="tag">
            {{ tag }} ({{ count }})
          </option>
        </select>
        <svg class="filter-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
      <button v-if="selectedTag" class="clear-btn" @click="clearFilter">&times; Clear</button>
      <button class="layout-toggle" @click="toggleLayout" :aria-label="'Switch to ' + (layoutMode === 'bento' ? 'masonry' : 'bento') + ' layout'" :title="layoutMode === 'bento' ? 'Masonry layout' : 'Bento layout'">
        <!-- Masonry icon (columns) -->
        <svg v-if="layoutMode === 'bento'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
        <!-- Bento icon (grid) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="4" rx="1" /><rect x="13" y="9" width="8" height="12" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" />
        </svg>
      </button>
      <RouterLink to="/about" class="mobile-about-link">About</RouterLink>
    </div>
    <div :class="layoutMode === 'bento' ? 'bento' : 'masonry'">
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" :activeCardId="activeCardId" :bento="layoutMode === 'bento'" @flip="activeCardId = $event" />
      <div v-for="n in fillerCount" :key="'filler-' + n" class="bento-filler">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
        </svg>
      </div>
    </div>
    <p v-if="!filteredPosts.length" class="empty">No posts found.</p>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  justify-content: flex-end;
}

.mobile-about-link {
  display: none;
}

.filter-select-wrapper {
  position: relative;
}

.filter-select {
  appearance: none;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 2.25rem 0.5rem 0.85rem;
  border-radius: 6px;
  font-family: var(--font);
  font-size: 0.8rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  text-transform: lowercase;
}

.filter-select:hover,
.filter-select:focus {
  border-color: var(--border-light);
}

.filter-chevron {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
  pointer-events: none;
}

.clear-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-family: var(--font);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  color: var(--text);
  border-color: var(--border-light);
}

.layout-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 34px;
  height: 34px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.layout-toggle:hover {
  color: var(--text);
  border-color: var(--border-light);
}

.masonry {
  columns: 4;
  column-gap: 1rem;
}

/* Bento grid */
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 220px;
  grid-auto-flow: dense;
  gap: 1rem;
}

.bento-filler {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.bento-filler svg {
  width: 48px;
  height: 48px;
  color: var(--border-light);
  opacity: 0.5;
}

/* Repeating bento pattern every 8 items */
.bento > :nth-child(8n + 1) { grid-column: span 2; grid-row: span 2; }
.bento > :nth-child(8n + 4) { grid-row: span 2; }
.bento > :nth-child(8n + 6) { grid-column: span 2; }

@media (max-width: 1200px) {
  .masonry { columns: 3; }
  .bento { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 200px; }
  .bento > :nth-child(8n + 1) { grid-column: span 2; grid-row: span 2; }
  .bento > :nth-child(8n + 6) { grid-column: span 1; }
}

@media (max-width: 768px) {
  .masonry { columns: 2; }
  .bento {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 180px;
  }
  .bento > :nth-child(8n + 1) { grid-column: span 2; grid-row: span 1; }
  .bento > :nth-child(8n + 4) { grid-row: span 1; }
  .bento > :nth-child(8n + 6) { grid-column: span 2; }
  .home { padding: 1rem; }
  .filter-bar {
    justify-content: flex-start;
  }
  .mobile-about-link {
    display: block;
    margin-left: auto;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .mobile-about-link:hover {
    color: var(--text);
  }
}

@media (max-width: 480px) {
  .masonry { columns: 1; }
  .bento {
    grid-template-columns: 1fr;
    grid-auto-rows: 200px;
  }
  .bento > :nth-child(8n + 1),
  .bento > :nth-child(8n + 4),
  .bento > :nth-child(8n + 6) {
    grid-column: span 1;
    grid-row: span 1;
  }
}

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 4rem 0;
}
</style>
