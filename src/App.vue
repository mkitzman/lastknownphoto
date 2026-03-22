<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="site-header">
      <RouterLink to="/" class="site-title">Last Known Photo</RouterLink>
      <nav class="site-nav">
        <RouterLink to="/">Archive</RouterLink>
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
    <footer class="site-footer">
      <p>&copy; Last Known Photo</p>
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
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text);
  text-decoration: none;
}

.site-nav {
  display: flex;
  gap: 1.5rem;
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
