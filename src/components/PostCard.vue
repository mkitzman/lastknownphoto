<script setup lang="ts">
import { ref } from 'vue'
import { getWikipediaUrl, type Post } from '../data/posts'

defineProps<{ post: Post }>()
const flipped = ref(false)

function handleFlip(e: Event) {
  const target = e.target as HTMLElement
  if (target.closest('a, .tag, .wiki-link, .card-cta')) return
  flipped.value = !flipped.value
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleFlip()
  }
  if (e.key === 'Escape' && flipped.value) {
    flipped.value = false
  }
}

</script>

<template>
  <article
    class="card-container"
    @keydown="handleKeydown"
    :aria-label="post.name + ' — click to reveal details'"
  >
    <div class="card" :class="{ flipped }">
      <button
        class="card-front"
        @click="handleFlip"
        :aria-expanded="flipped"
        :aria-label="'View details for ' + post.name"
        type="button"
      >
        <img :src="post.imageUrl" :alt="post.name" loading="lazy" />
        <div class="card-overlay" aria-hidden="true">
          <span class="card-name">{{ post.name }}</span>
        </div>
      </button>
      <div class="card-back" role="region" :aria-label="post.name + ' details'" :inert="!flipped">
        <button class="flip-back-btn" @click.stop="flipped = false" title="Flip back">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </button>
        <h3>{{ post.name }}</h3>
        <p class="card-bio" v-if="post.bio">{{ post.bio }}</p>
        <p class="card-title">{{ post.title }}</p>
        <p class="card-desc" v-if="post.description && post.description !== post.title">{{ post.description }}</p>
        <div class="card-meta">
          <span v-if="post.age">Age {{ post.age }}</span>
          <span v-if="post.date">{{ post.date }}</span>
        </div>
        <div class="card-tags" v-if="post.tags.length">
          <router-link
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            :to="{ name: 'home', query: { tag } }"
            class="tag"
            @click.stop
          >{{ tag }}</router-link>
        </div>
        <div class="card-bottom">
          <a :href="getWikipediaUrl(post)" target="_blank" rel="noopener noreferrer" class="wiki-link" @click.stop title="Wikipedia">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.991-1.532.016C6.532 16.147 4.34 10.696 3.202 7.87c-.454-1.115-.626-1.216-1.325-1.322-.232-.03-.482-.076-.727-.076-.164 0-.164-.24 0-.24h3.53c.164 0 .164.24 0 .24-.447.016-.907.2-.709.796.653 1.878 2.634 7.16 3.478 9.386.14-.262.986-1.99 1.28-2.588-.344-.73-1.328-3.583-1.666-4.368-.233-.573-.458-.694-1.012-.694-.164 0-.164-.24 0-.24h3.012c.164 0 .164.24 0 .24-.456 0-.77.156-.552.7.607 1.484 1.094 2.78 1.394 3.493l.076-.145c.39-.787.86-1.858 1.158-2.56.228-.538.02-.794-.487-.794-.164 0-.164-.24 0-.24h2.484c.164 0 .164.24 0 .24-.39.03-.726.222-1.01.732-.376.654-1.07 2.032-1.35 2.615.228.47 1.412 3.256 1.794 4.152.294-.554 1.47-3.02 1.994-4.32.34-.85.148-1.095-.388-1.148-.164 0-.164-.24 0-.24h2.484c.164 0 .164.24 0 .24-.476.07-.77.392-1.034.91-.754 1.463-3.18 6.656-3.7 7.788-.322.67-.636.754-.962.056-.452-.966-1.662-3.79-2.088-4.816z"/>
            </svg>
          </a>
          <router-link :to="{ name: 'post', params: { slug: post.slug } }" class="card-cta" @click.stop>Read more &rarr;</router-link>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-container {
  break-inside: avoid;
  margin-bottom: 1rem;
  cursor: pointer;
  perspective: 1000px;
}

.card {
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card.flipped .card-front {
  pointer-events: none;
}

.card-front,
.card-back {
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
}

.card-front {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: none;
  padding: 0;
  background: none;
  width: 100%;
  cursor: pointer;
  outline: none;
}

.card-front:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 8px;
}

.card-front:focus-visible img {
  filter: grayscale(0%) contrast(1);
  transform: scale(1.04);
}

.card-front:focus-visible ~ .card-overlay,
.card-container:focus-within .card-overlay {
  opacity: 1;
  transform: translateY(0);
}

.card-front img {
  width: 100%;
  display: block;
  border-radius: 8px;
  filter: grayscale(100%) contrast(1.05);
  transition: filter 0.6s ease, transform 0.6s ease;
}

.card-container:hover .card-front img {
  filter: grayscale(0%) contrast(1);
  transform: scale(1.04);
}

/* Vignette overlay */
.card-front::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
  z-index: 1;
}

.card-container:hover .card-front::after {
  opacity: 1;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  border-radius: 0 0 8px 8px;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  z-index: 2;
}

.card-container:hover .card-overlay {
  opacity: 1;
  transform: translateY(0);
}

.card-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.02em;
}

.card-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.75rem;
  overflow-y: auto;
}

.flip-back-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.flip-back-btn:hover {
  color: var(--text);
  border-color: var(--text-dim);
}

.card-back h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.card-bio {
  font-size: 0.75rem;
  color: var(--accent);
  line-height: 1.5;
  font-style: italic;
}

.card-title {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-dim);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: var(--bg-elevated);
  border-radius: 3px;
  color: var(--accent);
  text-transform: lowercase;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.wiki-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-elevated);
  color: var(--text-muted);
  transition: all 0.2s;
}

.wiki-link:hover {
  color: var(--text);
  background: var(--border-light);
}

.card-cta {
  font-size: 0.75rem;
  color: var(--accent);
}
</style>
