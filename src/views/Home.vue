<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts'
import PostCard from '../components/PostCard.vue'

const route = useRoute()
const selectedTag = ref<string | null>((route.query.tag as string) || null)
const activeCardId = ref<string | null>(null)

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
  if (!selectedTag.value) return posts
  return posts.filter(p => p.tags.includes(selectedTag.value!))
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
      <span class="post-count">{{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'post' : 'posts' }}</span>
      <button v-if="selectedTag" class="clear-btn" @click="clearFilter">&times; Clear</button>
    </div>
    <div class="masonry">
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" :activeCardId="activeCardId" @flip="activeCardId = $event" />
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

.post-count {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.masonry {
  columns: 4;
  column-gap: 1rem;
}

@media (max-width: 1200px) {
  .masonry { columns: 3; }
}

@media (max-width: 768px) {
  .masonry { columns: 2; }
  .home { padding: 1rem; }
}

@media (max-width: 480px) {
  .masonry { columns: 1; }
}

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 4rem 0;
}
</style>
