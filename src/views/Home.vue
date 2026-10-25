<script setup lang="ts">
import { computed } from 'vue'
import { posts } from '../data/posts'
import { useFilter, SORT_LABELS } from '../composables/useFilter'
import PostCard from '../components/PostCard.vue'
import FilterBar from '../components/FilterBar.vue'
import DecadeHistogram from '../components/DecadeHistogram.vue'
import PageTitle from '../components/PageTitle.vue'
import { numberWord } from '../data/stats'

const { filteredPosts, selectedDecade, selectedTag, sortMode } = useFilter()

const liveMessage = computed(() => {
  const count = filteredPosts.value.length
  const noun = count === 1 ? 'record' : 'records'
  let scope = `${count} ${noun}`
  if (selectedDecade.value) scope += ` from the ${selectedDecade.value}`
  if (selectedTag.value) scope += ` tagged ${selectedTag.value}`
  if (!selectedDecade.value && !selectedTag.value) scope = `all ${scope}`
  return `Showing ${scope}, sorted by ${SORT_LABELS[sortMode.value].toLowerCase()}.`
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
    <PageTitle eyebrow="Permanent collection">
      Famous faces. Final frames.
      <template #credit>
        {{ totalRecords }} records <span class="dot">·</span> {{ yearRange }}
        <template v-if="lastAdded"><span class="dot">·</span> Last added {{ lastAdded }}</template>
      </template>
    </PageTitle>

    <section class="hero">
      <div class="hero-text">
        <p class="hero-copy">
          {{ numberWord(totalRecords, true) }} people, photographed for the last time.
          An archive of the last known photographs of public figures, taken
          before anyone knew they were the last.
        </p>
        <div class="hero-links">
          <RouterLink to="/stats" class="hero-link">Explore the numbers</RouterLink>
          <RouterLink to="/map" class="hero-link">See them on a map</RouterLink>
        </div>
      </div>
      <DecadeHistogram />
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
  grid-template-columns: 1fr 440px;
  gap: 96px;
  align-items: stretch;
  padding: 44px 56px 40px;
  border-bottom: 1px solid var(--hairline);
}

.hero-copy {
  font-size: 17px;
  line-height: 1.6;
  color: rgba(232, 225, 212, 0.65);
  max-width: 540px;
  margin: 0;
  font-weight: 400;
}

.hero-links {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  color: var(--link);
}

.hero-link:hover {
  color: var(--fg);
}

/* Trim the chart to the text block's glyph height so both columns read as one band */
.hero :deep(.histogram) {
  padding: 5px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 56px 48px;
  padding: 28px 56px 72px;
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
    padding: 40px 40px 36px;
    grid-template-columns: 1fr 340px;
    gap: 56px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 44px 32px;
    padding: 24px 40px 56px;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
  .hero :deep(.histogram) {
    height: 160px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 36px 24px 32px;
  }
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 20px 24px 48px;
  }
}
</style>
