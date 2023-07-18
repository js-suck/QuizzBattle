import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'quizz',
      component: () => import('../views/StartQuizz.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/game/:category',
      name: 'game',
      component: () => import('../components/QuizzGame.vue')
    },
    {
      path: '/waiting/:categoryId',
      name: 'waintingRoom',
      component: () => import('../views/WaintingGameView.vue')
    },
  ]
})

export default router
