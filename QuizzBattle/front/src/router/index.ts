import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
/*
const isAdmin = true; // Remplacez cette variable par la logique de vérification du rôle d'administrateur

// Middleware pour vérifier le rôle de l'utilisateur
const roleCheckMiddleware = (to: any, from: any, next: any) => {
  if (isAdmin) {
    // L'utilisateur est un administrateur, il peut continuer
    next();
  } else {
    // L'utilisateur n'est pas un administrateur, redirigez-le vers la page de connexion ou la page d'accueil
    next('/login'); // Vous pouvez également rediriger vers la page d'accueil en fonction de vos besoins
  }
};
*/
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
  //BackOffice / Admin
    {
      path: '/admin/dashboard',
      name: 'admin_dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/admin/HomeView.vue')
//      beforeEnter: roleCheckMiddleware // Appliquer le middleware seulement pour la route admin
    },
    {
      path: '/admin/users',
      name: 'admin_users',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/admin/UsersList.vue')
//      beforeEnter: roleCheckMiddleware // Appliquer le middleware seulement pour la route admin
    },
    {
      path: '/admin/user/:id/show',
      name: 'admin_user_show',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/admin/UserShow.vue')
//      beforeEnter: roleCheckMiddleware // Appliquer le middleware seulement pour la route admin
    },
    {
      path: '/admin/surveys',
      name: 'admin_surveys',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/admin/SurveysList.vue')
//      beforeEnter: roleCheckMiddleware // Appliquer le middleware seulement pour la route admin
    }
  ]
})

export default router
