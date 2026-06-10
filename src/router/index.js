import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useLoginStore } from "@/stores/loginStore";

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
      meta: { requiresAuth: true }
    },
    {
      path: '/ratta',
      name: 'ratta',
      component: () => import('../views/RattaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/allatips',
      name: 'allatips',
      component: () => import('../views/AllaTipsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('../views/VMGuideView.vue'),
    },
    {
      path: '/deltagare',
      name: 'deltagare',
      component: () => import('../views/DeltagareView.vue'),
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

router.beforeEach((to) => {
  const loginStore = useLoginStore()

  if (to.meta.requiresAuth && !loginStore.isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath }
    }
  }
})

export default router
