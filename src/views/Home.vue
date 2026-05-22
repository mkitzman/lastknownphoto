<script setup lang="ts">
import { computed } from 'vue'
import { posts } from '../data/posts'
import { useFilter } from '../composables/useFilter'
import PostCard from '../components/PostCard.vue'
import FilterBar from '../components/FilterBar.vue'

const { filteredPosts, filterMode, selectedDecade, selectedTag, sortMode } = useFilter()

const liveMessage = computed(() => {
  const count = filteredPosts.value.length
  const noun = count === 1 ? 'record' : 'records'
  let scope: string
  if (filterMode.value === 'decade' && selectedDecade.value) {
    scope = `${count} ${noun} from the ${selectedDecade.value}`
  } else if (filterMode.value === 'tag' && selectedTag.value) {
    scope = `${count} ${noun} tagged ${selectedTag.value}`
  } else {
    scope = `all ${count} ${noun}`
  }
  let sortDesc: string
  if (sortMode.value === 'death-desc') sortDesc = 'sorted by date of death, newest first'
  else if (sortMode.value === 'death-asc') sortDesc = 'sorted by date of death, oldest first'
  else sortDesc = 'sorted by most recently added'
  return `Showing ${scope}, ${sortDesc}.`
})

const totalRecords = computed(() => posts.length)

const yearRange = computed(() => {
  const years = posts
    .map(p => {
      const t = Date.parse(p.deathDate.replace(/(\d+)(st|nd|rd|th)/g, '$1'))
      return isNaN(t) ? null : new Date(t).getUTCFullYear()
    })
    .filter((y): y is number => y != null)
  if (!years.length) return ''
  return `${Math.min(...years)}–${Math.max(...years)}`
})

const lastAdded = computed(() => {
  const dates = posts
    .map(p => p.createdAt)
    .filter((d): d is string => !!d)
    .map(d => Date.parse(d))
    .filter(t => !isNaN(t))
  if (!dates.length) return ''
  const d = new Date(Math.max(...dates))
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const yy = String(d.getUTCFullYear()).slice(-2)
  return `${mm}.${dd}.${yy}`
})
</script>

<template>
  <div class="register">
    <section class="hero">
      <h1 class="hero-title">
        The last frame,<br />
        <em>held still.</em>
      </h1>
      <div class="hero-aside">
        <p class="hero-copy">
          A curated collection of the last known photographs of public figures.
          This working archive draws from a wide range of public records and
          historical archives to serve as a quiet reminder of life's presence.
        </p>
        <div class="hero-stats">
          <div><span class="stat-label">Records </span><span>{{ totalRecords }}</span></div>
          <div><span class="stat-label">Years </span><span>{{ yearRange }}</span></div>
          <div v-if="lastAdded"><span class="stat-label">Last Added </span><span>{{ lastAdded }}</span></div>
        </div>
      </div>
    </section>

    <FilterBar />

    <div class="visually-hidden" aria-live="polite" aria-atomic="true">{{ liveMessage }}</div>

    <section class="grid">
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    </section>
    <p v-if="!filteredPosts.length" class="empty">No records found.</p>
  </div>
</template>

<style scoped>
.register {
  color: var(--fg);
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
  align-items: end;
  padding: 40px 56px 72px;
  border-bottom: 1px solid var(--hairline);
}

.hero-title {
  font-size: 88px;
  line-height: 0.95;
  letter-spacing: -2.4px;
  font-weight: 300;
  margin: 0;
  text-wrap: pretty;
}

.hero-title em {
  font-style: italic;
  opacity: 0.7;
}

.hero-aside {
  padding-bottom: 10px;
}

.hero-copy {
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.65;
  max-width: 380px;
  margin: 0;
  font-weight: 400;
}

.hero-stats {
  margin-top: 28px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.stat-label {
  color: var(--fg-dim);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 56px 48px;
  padding: 56px 56px 72px;
}

.empty {
  text-align: center;
  color: var(--fg-muted);
  padding: 4rem 0 6rem;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

@media (max-width: 1100px) {
  .hero {
    padding: 32px 40px 56px;
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .hero-title {
    font-size: 64px;
    letter-spacing: -1.6px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 44px 32px;
    padding: 40px 40px 56px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 24px 24px 40px;
  }
  .hero-title {
    font-size: 44px;
    letter-spacing: -1px;
  }
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 32px 24px 48px;
  }
}
</style>
