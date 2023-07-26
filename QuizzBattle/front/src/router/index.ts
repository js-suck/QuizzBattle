import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Singup from '../views/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Singup
    },
    {
      path: '/verify/:tokenemail',
      name: 'verify',
      component: () => import('../views/Verify.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/reset-password/:tokenemail',
      name: 'reset-password',
      component: () => import('../views/ResetPassword.vue')
    },
    {
      path: '/',
      name: 'StartQuizz',
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
      path: '/game/:categoryId/:id',
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
