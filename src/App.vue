<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { pageAnnouncement } from './composables/usePageMeta'

const route = useRoute()
const isMapPage = computed(() => route.name === 'map')

function focusPageHeading() {
  const h1 = document.querySelector('main h1') as HTMLElement | null
  if (!h1) return
  if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
  h1.focus({ preventScroll: false })
}
</script>

<template>
  <div class="app">
    <header class="site-header">
      <RouterLink to="/" class="site-title-block">
        <span class="eyebrow">LKP — Est. 2024</span>
        <span class="title-line">
          Last Known Photo
          <svg class="shutter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
          </svg>
          <span class="sep">·</span>
          <span class="subtitle">an archive</span>
        </span>
      </RouterLink>
      <nav class="site-nav">
        <RouterLink to="/" class="nav-link" :class="{ active: route.name === 'home' }">Archive</RouterLink>
        <RouterLink to="/map" class="nav-link" :class="{ active: route.name === 'map' }">Map</RouterLink>
        <RouterLink to="/about" class="nav-link" :class="{ active: route.name === 'about' }">About</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in" @after-enter="focusPageHeading">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <div class="visually-hidden" aria-live="polite" aria-atomic="true">{{ pageAnnouncement }}</div>
    <footer v-if="!isMapPage" class="site-footer">
      <span>Last Known Photo &copy; {{ new Date().getFullYear() }}</span>
      <span>A non-commercial archive · Corrections welcome</span>
    </footer>
  </div>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2rem;
  padding: 28px 56px 24px;
  background: linear-gradient(var(--ink-800) 70%, rgba(26, 22, 18, 0));
}

.site-title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--fg);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.title-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: var(--fg);
}

.shutter-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transform: rotate(0deg);
  transition: transform 1.5s cubic-bezier(0.2, 0, 0.1, 1);
}

.site-title-block:hover .shutter-icon {
  transform: rotate(720deg);
  transition: transform 2s cubic-bezier(0.1, 0, 0.3, 1);
}

.title-line .sep {
  opacity: 0.4;
  margin: 0 6px;
}

.title-line .subtitle {
  opacity: 0.5;
}

.site-nav {
  display: flex;
  gap: 36px;
}

.nav-link {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--fg-dim);
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--fg);
}

.nav-link.active {
  border-bottom-color: var(--fg);
}

main {
  min-height: calc(100vh - 180px);
}

.site-footer {
  display: flex;
  justify-content: space-between;
  padding: 40px 56px;
  border-top: 1px solid var(--hairline);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-dim);
}

@media (max-width: 768px) {
  .site-header {
    padding: 20px 24px 18px;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .site-nav {
    gap: 20px;
    width: 100%;
  }
  .site-footer {
    flex-direction: column;
    gap: 8px;
    padding: 28px 24px;
    text-align: left;
  }
}
</style>
