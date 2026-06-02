import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tippa',
      name: 'tippa',
      component: () => import('../views/TipsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/reset/:token',
      name: 'reset',
      component: () => import('../views/ResetView.vue'),
    },
    {
      path: '/matcher',
      name: 'matcher',
      component: () => import('../views/MatchView.vue'),
    },
  ],
})

export default router
