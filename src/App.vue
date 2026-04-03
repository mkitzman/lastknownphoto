<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isMapPage = computed(() => route.name === 'map')
const introDone = ref(false)

function onIntroDone() {
  introDone.value = true
}
</script>

<template>
  <div class="app">
    <header class="site-header">
      <RouterLink to="/" class="site-title">
        <span class="title-text">Last Known Photo</span>
        <svg class="shutter-icon" :class="{ 'intro': !introDone }" @animationend="onIntroDone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
        </svg>
      </RouterLink>
      <nav class="site-nav">
        <RouterLink to="/map">Map</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <footer v-if="!isMapPage" class="site-footer">
      <p>&copy; {{ new Date().getFullYear() }} Last Known Photo</p>
    </footer>
  </div>
</template>

<style scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}

.site-title {
  font-family: 'Faster One', cursive;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.title-text {
  background: linear-gradient(135deg, #888, #d0d0d0, #999);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  clip-path: inset(0 100% 0 0 round 0 50% 50% 0);
  animation: title-reveal 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s forwards;
}

@keyframes title-reveal {
  0% { clip-path: inset(0 100% 0 0 round 0 50% 50% 0); }
  90% { clip-path: inset(0 2% 0 0 round 0 50% 50% 0); }
  100% { clip-path: inset(0 0% 0 0 round 0 0 0 0); }
}

.site-title .shutter-icon {
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.site-title .shutter-icon.intro {
  animation: shutter-intro 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s both;
}

@keyframes shutter-intro {
  0% {
    transform: translateX(-18ch) rotate(0deg);
  }
  100% {
    transform: translateX(0) rotate(720deg);
  }
}

.shutter-icon {
  width: 1.4rem;
  height: 1.4rem;
  stroke: #a8a8a8;
  transform: rotate(0deg);
  transition: transform 1.5s cubic-bezier(0.2, 0, 0.1, 1);
}

.site-title:hover .shutter-icon:not(.intro) {
  transform: rotate(720deg);
  transition: transform 2s cubic-bezier(0.1, 0, 0.3, 1);
}

@media (max-width: 768px) {
  .site-header {
    justify-content: center;
    padding: 1.25rem 1.5rem;
  }
  .site-title {
    font-size: clamp(1.25rem, 5vw, 1.5rem);
    white-space: nowrap;
  }
  .site-title .shutter-icon {
    width: clamp(1.2rem, 4.5vw, 1.4rem);
    height: clamp(1.2rem, 4.5vw, 1.4rem);
  }
}

.site-nav {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .site-nav {
    display: none;
  }
}

.site-nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.site-nav a:hover,
.site-nav a.router-link-active {
  color: var(--text);
}

main {
  min-height: calc(100vh - 140px);
}

.site-footer {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  border-top: 1px solid var(--border);
}
</style>
