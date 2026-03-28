<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostBySlug } from '../data/posts'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostBySlug(route.params.slug as string))
const activeImage = ref<string | null>(null)

const currentImage = computed(() => activeImage.value || post.value?.imageUrl || '')

const allImages = computed(() => {
  if (!post.value) return []
  return [post.value.imageUrl, ...(post.value.additionalImages || [])]
})
</script>

<template>
  <div class="post-page" v-if="post">
    <button class="back-btn" @click="router.back()">&larr; Back</button>
    <div class="post-layout">
      <div class="post-image">
        <div class="main-image-wrapper">
          <img :src="currentImage" :alt="post.name" class="main-image" />
        </div>
        <div class="image-thumbs" v-if="allImages.length > 1">
          <button
            v-for="(img, i) in allImages"
            :key="img"
            class="thumb"
            :class="{ active: currentImage === img }"
            @click="activeImage = img"
            :aria-label="'View photo ' + (i + 1)"
          >
            <img :src="img" :alt="post.name + ' photo ' + (i + 1)" />
          </button>
        </div>
        <span v-if="post.photoCredit" class="photo-credit">Photo: {{ post.photoCredit }}</span>
      </div>
      <div class="post-info">
        <h1>{{ post.name }}</h1>
        <p class="post-bio" v-if="post.bio">{{ post.bio }}</p>
        <p class="post-title">{{ post.title }}</p>
        <p class="post-description" v-if="post.description && post.description !== post.title">
          {{ post.description }}
        </p>
        <div class="post-meta">
          <div class="meta-item" v-if="post.date">
            <span class="meta-label">Photo Date</span>
            <span class="meta-value">{{ post.date }}</span>
          </div>
          <div class="meta-item" v-if="post.deathDate">
            <span class="meta-label">Death Date</span>
            <span class="meta-value">{{ post.deathDate }}</span>
          </div>
          <div class="meta-item" v-if="post.age">
            <span class="meta-label">Age</span>
            <span class="meta-value">{{ post.age }}</span>
          </div>
        </div>
        <div class="post-tags" v-if="post.tags.length">
          <router-link
            v-for="tag in post.tags"
            :key="tag"
            :to="{ name: 'home', query: { tag } }"
            class="tag"
          >
            {{ tag }}
          </router-link>
        </div>
        <a
          v-if="post.sourceUrl"
          :href="post.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="source-link"
        >
          {{ post.sourceLabel || 'Source' }} &rarr;
        </a>
      </div>
    </div>
  </div>
  <div class="not-found" v-else>
    <h2>Post not found</h2>
    <router-link to="/">Return to archive</router-link>
  </div>
</template>

<style scoped>
.post-page {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font);
  font-size: 0.85rem;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: var(--border-light);
  color: var(--text);
}

.post-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 768px) {
  .post-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .post-page {
    padding: 1rem;
  }
}

.post-image {
  display: flex;
  flex-direction: column;
}

.main-image-wrapper {
  aspect-ratio: 3 / 4;
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.image-thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.thumb {
  width: 64px;
  height: 64px;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  opacity: 0.5;
  transition: all 0.2s;
}

.thumb:hover {
  opacity: 0.8;
}

.thumb.active {
  border-color: var(--accent);
  opacity: 1;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-credit {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 0.5rem;
  display: block;
}

.post-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post-info h1 {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.post-bio {
  font-size: 0.95rem;
  color: var(--accent);
  line-height: 1.7;
  font-style: italic;
}

.post-title {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.post-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.meta-value {
  font-size: 0.9rem;
  color: var(--text);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  background: var(--bg-elevated);
  border-radius: 3px;
  color: var(--accent);
  text-transform: lowercase;
  text-decoration: none;
  transition: background 0.2s;
}

.tag:hover {
  background: var(--border-light);
}

.source-link {
  font-size: 0.85rem;
  color: var(--accent);
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s;
}

.source-link:hover {
  border-color: var(--accent);
}

.not-found {
  text-align: center;
  padding: 6rem 2rem;
}

.not-found h2 {
  margin-bottom: 1rem;
  color: var(--text-muted);
}
</style>
