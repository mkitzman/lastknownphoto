import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { setPageMeta } from '../composables/usePageMeta'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { title: 'Archive' } },
    { path: '/post/:slug', name: 'post', component: () => import('../views/Post.vue') },
    { path: '/map', name: 'map', component: () => import('../views/Map.vue'), meta: { title: 'Map' } },
    { path: '/about', name: 'about', component: () => import('../views/About.vue'), meta: { title: 'About' } },
    { path: '/admin', name: 'admin', component: () => import('../views/Admin.vue'), meta: { title: 'Admin' } },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) setPageMeta(title)
})

export default router
