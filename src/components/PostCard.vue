<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getWikipediaUrl, type Post } from '../data/posts'

const props = defineProps<{ post: Post, activeCardId: string | null, bento?: boolean }>()
const emit = defineEmits<{ flip: [id: string | null] }>()

const flipped = computed(() => props.activeCardId === props.post.id)
const colorized = ref(false)

function handleFlip() {
  emit('flip', flipped.value ? null : props.post.id)
}

function handleColorize(e: Event) {
  e.stopPropagation()
  colorized.value = !colorized.value
}

watch(() => props.activeCardId, () => {
  if (props.activeCardId !== props.post.id) {
    colorized.value = false
  }
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleFlip()
  }
  if (e.key === 'Escape' && flipped.value) {
    emit('flip', null)
  }
}

</script>

<template>
  <article
    class="card-container"
    :class="{ colorized, 'bento-card': bento }"
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
        <img :src="post.imageUrl" :alt="post.name" loading="lazy" :style="post.focalPoint ? { objectPosition: post.focalPoint.x + '% ' + post.focalPoint.y + '%' } : undefined" />
        <div class="card-overlay" aria-hidden="true">
          <span class="card-name">{{ post.name }}</span>
        </div>
      </button>
      <button
        class="colorize-btn"
        @click="handleColorize"
        type="button"
        aria-label="Show photo in color"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
        </svg>
      </button>
      <div class="card-back" role="region" :aria-label="post.name + ' details'" :inert="!flipped">
        <button class="flip-back-btn" @click.stop="emit('flip', null)" title="Flip back">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </button>
        <h3>{{ post.name }}</h3>
        <p class="card-desc">{{ post.description || post.title }}</p>
        <div class="card-meta" v-if="post.date || post.deathDate || post.age">
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
        <div class="card-bottom">
          <a :href="getWikipediaUrl(post)" target="_blank" rel="noopener noreferrer" class="wiki-link" @click.stop title="Wikipedia">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

.card.flipped .card-overlay {
  display: none;
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

.card-container:hover .card-front img,
.card-container.colorized .card-front img {
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

.card-container:hover .card-front::after,
.card-container.colorized .card-front::after {
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

.card-container:hover .card-overlay,
.card-container.colorized .card-overlay {
  opacity: 1;
  transform: translateY(0);
}

.card-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.02em;
}

/* Mobile colorize button — hidden on desktop */
.colorize-btn {
  display: none;
}

@media (hover: none) and (pointer: coarse) {
  .colorize-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0.6rem;
    right: 0.6rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    z-index: 4;
    padding: 0;
    transition: all 0.3s ease;
  }

  .colorize-btn svg {
    width: 18px;
    height: 18px;
    stroke: rgba(255, 255, 255, 0.7);
    transition: stroke 0.3s ease;
  }

  .card-container.colorized .colorize-btn {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .card-container.colorized .colorize-btn svg {
    stroke: #fff;
  }
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

.card-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.card-meta {
  display: flex;
  gap: 1.25rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.meta-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.meta-value {
  font-size: 0.8rem;
  color: var(--text);
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

/* Bento mode overrides */
.bento-card {
  margin-bottom: 0;
  height: 100%;
}

.bento-card .card {
  height: 100%;
}

.bento-card .card-front {
  height: 100%;
}

.bento-card .card-front img {
  height: 100%;
  object-fit: cover;
}
</style>
