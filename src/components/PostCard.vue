<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { type Post, getDecade, getYears, getProfession, getInterval } from '../data/posts'

const props = defineProps<{ post: Post }>()

const decade = computed(() => getDecade(props.post))
const years = computed(() => getYears(props.post))
const profession = computed(() => getProfession(props.post))
const interval = computed(() => getInterval(props.post))
const objectPosition = computed(() => {
  const fp = props.post.focalPoint
  return fp ? `${fp.x}% ${fp.y}%` : '50% 50%'
})
</script>

<template>
  <article class="register-card">
    <RouterLink :to="{ name: 'post', params: { slug: post.slug } }" class="card-link" :aria-label="`View record for ${post.name}`">
      <div class="eyebrow-row">
        <span>{{ post.slug.replace(/-/g, ' ') }}</span>
        <span v-if="decade">{{ decade }}</span>
      </div>
      <div class="photo-frame">
        <img
          :src="post.imageUrl"
          :alt="post.name"
          loading="lazy"
          :style="{ objectPosition }"
        />
        <div class="hairline" aria-hidden="true"></div>
      </div>
      <div class="meta-row">
        <div class="identity">
          <div class="name">{{ post.name }}</div>
          <div class="subline" v-if="years || profession">
            <span v-if="years">{{ years }}</span>
            <span v-if="years && profession"> · </span>
            <span v-if="profession">{{ profession }}</span>
          </div>
        </div>
        <div class="interval" v-if="interval">
          −{{ interval }}<br />
          <span class="interval-caption">before</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.register-card {
  display: flex;
  flex-direction: column;
}

.card-link {
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: var(--fg);
  cursor: pointer;
}

.eyebrow-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.eyebrow-row > :first-child {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 60%;
}

.photo-frame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--ink-750);
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.55) contrast(1);
  transform: scale(1);
  transition: transform 900ms cubic-bezier(0.2, 0.7, 0.3, 1), filter 600ms ease;
}

.card-link:hover .photo-frame img,
.card-link:focus-visible .photo-frame img {
  transform: scale(1.02);
  filter: saturate(0.75) contrast(1);
}

.hairline {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  height: 6px;
  background-image:
    linear-gradient(to right, var(--bone-100), var(--bone-100)),
    repeating-linear-gradient(to right, var(--bone-100) 0 1px, transparent 1px 10px);
  background-size: 100% 1px, 100% 4px;
  background-position: 0 100%, 0 0;
  background-repeat: no-repeat, repeat-x;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 900ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: difference;
  opacity: 0.9;
}

.card-link:hover .hairline,
.card-link:focus-visible .hairline {
  transform: scaleX(1);
}

.card-link:focus-visible {
  outline: none;
}

.card-link:focus-visible .photo-frame {
  box-shadow: 0 0 0 2px var(--fg);
}

.meta-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 12px;
}

.name {
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.4px;
  line-height: 1.15;
}

.subline {
  margin-top: 3px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.4px;
  color: var(--fg-muted);
  text-transform: capitalize;
}

.interval {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: right;
  color: var(--fg);
  opacity: 0;
  transition: opacity 400ms ease;
  line-height: 1.4;
}

.card-link:hover .interval,
.card-link:focus-visible .interval {
  opacity: 1;
}

.interval-caption {
  opacity: 0.5;
}
</style>
