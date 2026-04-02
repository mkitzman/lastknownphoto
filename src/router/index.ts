import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/post/:slug', name: 'post', component: () => import('../views/Post.vue') },
    { path: '/map', name: 'map', component: () => import('../views/Map.vue') },
    { path: '/about', name: 'about', component: () => import('../views/About.vue') },
    { path: '/admin', name: 'admin', component: () => import('../views/Admin.vue') },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
