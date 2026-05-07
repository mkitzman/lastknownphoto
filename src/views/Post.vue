<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  getPostBySlug,
  getDecade,
  getYears,
  getProfession,
  getInterval,
  getWikipediaUrl,
  posts,
  getVerificationEntry,
  verificationLevelsDescending,
} from '../data/posts'
import { methodology } from '../data/methodology'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostBySlug(route.params.slug as string))
const activeImage = ref<string | null>(null)

function toDMS(decimal: number, isLat: boolean): string {
  const abs = Math.abs(decimal)
  const d = Math.floor(abs)
  const mFloat = (abs - d) * 60
  const m = Math.floor(mFloat)
  const s = ((mFloat - m) * 60).toFixed(1)
  const dir = isLat ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W')
  return `${d}\u00B0${m}'${s}"${dir}`
}

function coordsDisplay(lat: number, lng: number): string {
  return `${toDMS(lat, true)} ${toDMS(lng, false)}`
}

const currentImage = computed(() => activeImage.value || post.value?.imageUrl || '')

const allImages = computed(() => {
  if (!post.value) return []
  return [post.value.imageUrl, ...(post.value.additionalImages || [])]
})

const currentPlateIndex = computed(() => {
  const i = allImages.value.indexOf(currentImage.value)
  return i >= 0 ? i + 1 : 1
})

const decade = computed(() => post.value ? getDecade(post.value) : null)
const years = computed(() => post.value ? getYears(post.value) : null)
const profession = computed(() => post.value ? getProfession(post.value) : null)
const interval = computed(() => post.value ? getInterval(post.value) : null)

const recordIndex = computed(() => {
  if (!post.value) return 0
  return posts.findIndex(p => p.slug === post.value!.slug) + 1
})

const sourceIsWikipedia = computed(() => {
  return post.value?.sourceUrl?.includes('wikipedia.org') ?? false
})

const showMethodology = ref(false)

const verificationEntry = computed(() => {
  const lvl = post.value?.level
  if (!lvl) return null
  return getVerificationEntry(lvl)
})

const methodologyPanelId = 'methodology-panel'

function toggleMethodology() {
  showMethodology.value = !showMethodology.value
}
</script>

<template>
  <div class="record" v-if="post">
    <div class="record-topbar">
      <button class="topbar-link" @click="router.back()">← Archive</button>
      <span class="topbar-slug">{{ post.slug }}</span>
      <span class="topbar-index">Record {{ String(recordIndex).padStart(3, '0') }} / {{ posts.length }}</span>
    </div>

    <section class="record-layout">
      <div class="record-photo">
        <div class="photo-frame">
          <img :src="currentImage" :alt="post.name" />
        </div>
        <div class="photo-thumbs" v-if="allImages.length > 1">
          <button
            v-for="(img, i) in allImages"
            :key="img"
            class="thumb"
            :class="{ active: currentImage === img }"
            @click="activeImage = img"
            :aria-label="'View photo ' + (i + 1)"
            type="button"
          >
            <img :src="img" :alt="post.name + ' photo ' + (i + 1)" />
          </button>
        </div>
        <div class="photo-caption">
          <span>Plate {{ String(currentPlateIndex).padStart(2, '0') }} of {{ String(allImages.length).padStart(2, '0') }}</span>
          <span v-if="post.photoCredit">{{ post.photoCredit }}</span>
        </div>
        <div v-if="post.additionalImagesNote" class="photo-note">{{ post.additionalImagesNote }}</div>
      </div>

      <div class="record-info">
        <div class="record-eyebrow">Record {{ post.slug }}</div>
        <h1 class="record-title">{{ post.name }}</h1>
        <div class="record-subline" v-if="years || profession">
          <span v-if="years">{{ years }}</span>
          <span v-if="years && profession"> · </span>
          <span v-if="profession">{{ profession }}</span>
        </div>
        <p v-if="post.description || post.title" class="record-note" v-html="post.description || post.title"></p>
        <blockquote v-if="post.lyrics" class="record-lyrics">
          <p class="record-lyrics-text">{{ post.lyrics.text }}</p>
          <cite v-if="post.lyrics.source" class="record-lyrics-source">— {{ post.lyrics.source }}</cite>
        </blockquote>
        <p class="record-bio" v-if="post.bio" v-html="post.bio"></p>

        <dl class="record-meta">
          <template v-if="post.date">
            <dt>Date of record</dt>
            <dd>{{ post.date }}</dd>
          </template>
          <template v-if="post.deathDate">
            <dt>Date of death</dt>
            <dd>{{ post.deathDate }}</dd>
          </template>
          <template v-if="post.age != null">
            <dt>Age</dt>
            <dd>{{ post.age }}</dd>
          </template>
          <template v-if="interval">
            <dt>Interval to death</dt>
            <dd>~{{ interval }}</dd>
          </template>
          <template v-if="post.location">
            <dt>Location</dt>
            <dd>
              <div class="location-name">{{ post.location.name }}</div>
              <a :href="post.location.mapsUrl" target="_blank" rel="noopener noreferrer" class="coords-link">
                {{ coordsDisplay(post.location.lat, post.location.lng) }}
              </a>
            </dd>
          </template>
          <template v-if="post.photoCredit">
            <dt>Photographer</dt>
            <dd>{{ post.photoCredit }}</dd>
          </template>
          <template v-if="decade">
            <dt>Decade</dt>
            <dd>{{ decade }}</dd>
          </template>
          <template v-if="post.level && verificationEntry">
            <dt class="meta-trigger-cell">
              <button
                type="button"
                class="verification-trigger"
                :aria-expanded="showMethodology"
                :aria-controls="methodologyPanelId"
                :aria-label="`Verification level ${post.level} of 5: ${verificationEntry.label}. Open methodology.`"
                @click="toggleMethodology"
              >
                <span>Verification</span>
                <span class="verification-chevron" aria-hidden="true">{{ showMethodology ? '−' : '+' }}</span>
              </button>
            </dt>
            <dd>
              <span class="verification-value" aria-hidden="true">[ {{ verificationEntry.displayLevel }} // {{ verificationEntry.label.toUpperCase() }} ]</span>
            </dd>
          </template>
        </dl>

        <Transition name="methodology">
          <section
            v-if="showMethodology && post.level && verificationEntry"
            :id="methodologyPanelId"
            class="methodology-panel"
            role="region"
            :aria-label="methodology.title"
          >
            <div class="methodology-eyebrow">{{ methodology.title }}</div>
            <p class="methodology-intro">{{ methodology.intro }}</p>
            <div v-for="section in methodology.sections" :key="section.heading" class="methodology-section">
              <div class="methodology-eyebrow methodology-eyebrow--inline">{{ section.heading }}</div>
              <ul class="methodology-list">
                <li v-for="(point, i) in section.points" :key="i">{{ point }}</li>
              </ul>
            </div>
            <div class="methodology-section">
              <div class="methodology-eyebrow methodology-eyebrow--inline">{{ methodology.gradesHeading }}</div>
              <dl class="methodology-grades">
                <template v-for="lvl in verificationLevelsDescending" :key="lvl">
                  <dt :class="{ 'methodology-grade-current': lvl === post.level }">{{ getVerificationEntry(lvl).displayLevel }}</dt>
                  <dd :class="{ 'methodology-grade-current': lvl === post.level }">
                    <span class="methodology-grade-label">{{ getVerificationEntry(lvl).label }}</span>
                    <span class="methodology-grade-desc">{{ getVerificationEntry(lvl).description }}</span>
                  </dd>
                </template>
              </dl>
            </div>
          </section>
        </Transition>

        <div class="record-tags" v-if="post.tags.length">
          <RouterLink
            v-for="tag in post.tags"
            :key="tag"
            :to="{ name: 'home', query: { mode: 'tag', tag } }"
            class="tag"
          >{{ tag }}</RouterLink>
        </div>

        <div class="record-links">
          <a
            v-if="post.sourceUrl"
            :href="post.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="record-link"
          >{{ post.sourceLabel || 'Source' }} →</a>
          <a
            v-if="!sourceIsWikipedia"
            :href="getWikipediaUrl(post)"
            target="_blank"
            rel="noopener noreferrer"
            class="record-link"
          >Wikipedia →</a>
        </div>
      </div>
    </section>
  </div>
  <div class="not-found" v-else>
    <h2>Record not found</h2>
    <RouterLink to="/">Return to archive</RouterLink>
  </div>
</template>

<style scoped>
.record {
  color: var(--fg);
}

.record-topbar {
  padding: 32px 56px 24px;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.topbar-link {
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  padding: 0;
  cursor: pointer;
}

.topbar-link:hover {
  color: var(--fg);
}

.record-layout {
  padding: 48px 56px 72px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: start;
}

.photo-frame {
  aspect-ratio: 4 / 5;
  background: var(--ink-750);
  overflow: hidden;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: saturate(0.6);
}

.photo-thumbs {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.thumb {
  width: 58px;
  height: 58px;
  border: 1px solid transparent;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: var(--ink-750);
  opacity: 0.5;
  transition: opacity 0.2s, border-color 0.2s;
}

.thumb:hover {
  opacity: 0.85;
}

.thumb.active {
  border-color: var(--fg);
  opacity: 1;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-caption {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--hairline-strong);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  opacity: 0.5;
}

.photo-note {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  opacity: 0.4;
}

.record-info {
  padding-top: 12px;
}

.record-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 20px;
}

.record-title {
  font-size: 64px;
  line-height: 1;
  letter-spacing: -1.8px;
  font-weight: 300;
  margin: 0;
}

.record-subline {
  font-size: 16px;
  opacity: 0.55;
  margin-top: 14px;
  letter-spacing: -0.1px;
  text-transform: capitalize;
}

.record-bio {
  font-size: 16px;
  line-height: 1.6;
  margin-top: 32px;
  max-width: 520px;
  opacity: 0.8;
  font-style: italic;
  font-weight: 300;
}

.record-note {
  font-size: 17px;
  line-height: 1.6;
  letter-spacing: -0.05px;
  margin-top: 24px;
  max-width: 520px;
  opacity: 0.9;
  font-weight: 400;
}

.record-note :deep(a) {
  color: #c8a87c;
  text-decoration: none;
  transition: text-decoration 0.2s, color 0.2s;
}

.record-note :deep(a:hover) {
  color: var(--fg);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.record-lyrics {
  margin: 28px 0 0;
  padding: 18px 0 18px 22px;
  border-left: 1px solid var(--hairline-strong);
  max-width: 520px;
}

.record-lyrics-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-line;
  font-style: italic;
  font-weight: 300;
  opacity: 0.85;
  letter-spacing: -0.05px;
}

.record-lyrics-source {
  display: block;
  margin-top: 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-style: normal;
  color: var(--fg-dim);
}

.record-meta {
  margin-top: 44px;
  border-top: 1px solid var(--hairline-strong);
  display: grid;
  grid-template-columns: 160px 1fr;
  column-gap: 32px;
  font-size: 13px;
}

.record-meta dt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  padding: 16px 0;
  border-bottom: 1px solid var(--hairline-soft);
}

.record-meta dd {
  margin: 0;
  padding: 16px 0;
  border-bottom: 1px solid var(--hairline-soft);
  letter-spacing: -0.05px;
  color: var(--fg);
}

.location-name {
  margin-bottom: 4px;
}

.meta-trigger-cell {
  padding: 0 !important;
}

.verification-trigger {
  background: none;
  border: none;
  padding: 16px 0;
  margin: 0;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  cursor: pointer;
  transition: color 0.2s;
}

.verification-trigger:hover,
.verification-trigger:focus-visible {
  color: var(--fg);
  outline: none;
}

.verification-trigger:focus-visible {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}

.verification-chevron {
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}

.verification-trigger:hover .verification-chevron,
.verification-trigger:focus-visible .verification-chevron {
  opacity: 1;
}

.verification-value {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.4px;
  color: var(--fg);
}

.methodology-panel {
  margin-top: 24px;
  padding: 28px 28px 32px;
  border: 1px solid var(--hairline-strong);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.methodology-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.methodology-eyebrow--inline {
  margin-bottom: 12px;
}

.methodology-intro {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.65;
  font-weight: 300;
  color: var(--fg);
  opacity: 0.85;
  max-width: 560px;
  margin: 0;
}

.methodology-section {
  display: flex;
  flex-direction: column;
}

.methodology-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  font-weight: 300;
  color: var(--fg);
  opacity: 0.85;
  max-width: 560px;
}

.methodology-list li {
  position: relative;
  padding-left: 18px;
}

.methodology-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--fg-dim);
}

.methodology-grades {
  display: grid;
  grid-template-columns: 80px 1fr;
  column-gap: 24px;
  font-size: 13px;
}

.methodology-grades dt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--fg-dim);
  padding: 14px 0;
  border-top: 1px solid var(--hairline-soft);
}

.methodology-grades dd {
  margin: 0;
  padding: 14px 0;
  border-top: 1px solid var(--hairline-soft);
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--fg);
  opacity: 0.9;
}

.methodology-grade-label {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.05px;
}

.methodology-grade-desc {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.55;
  font-weight: 300;
  opacity: 0.75;
}

.methodology-grades dt.methodology-grade-current,
.methodology-grades dd.methodology-grade-current {
  color: var(--fg);
  opacity: 1;
}

.methodology-grades dt.methodology-grade-current {
  color: var(--fg);
}

.methodology-enter-active,
.methodology-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.methodology-enter-from,
.methodology-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.coords-link {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.4px;
  color: var(--fg-muted);
}

.coords-link:hover {
  color: var(--fg);
}

.record-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 36px;
}

.tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 5px 10px;
  border: 1px solid var(--hairline-strong);
  color: var(--fg-muted);
}

.tag:hover {
  color: var(--fg);
  border-color: var(--fg);
}

.record-links {
  display: flex;
  gap: 24px;
  margin-top: 36px;
  flex-wrap: wrap;
}

.record-link {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--fg);
  border-bottom: 1px solid var(--hairline-strong);
  padding-bottom: 4px;
}

.record-link:hover {
  border-bottom-color: var(--fg);
}

.not-found {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--fg-muted);
}

.not-found h2 {
  margin-bottom: 1rem;
  font-weight: 300;
}

@media (max-width: 1100px) {
  .record-topbar {
    padding: 24px 40px 20px;
  }
  .record-layout {
    padding: 32px 40px 56px;
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .record-title {
    font-size: 48px;
    letter-spacing: -1.2px;
  }
}

@media (max-width: 640px) {
  .record-topbar {
    padding: 20px 24px 16px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .record-layout {
    padding: 24px 24px 48px;
  }
  .record-title {
    font-size: 40px;
    letter-spacing: -1px;
  }
  .record-meta {
    grid-template-columns: 120px 1fr;
    column-gap: 20px;
  }
}
</style>
