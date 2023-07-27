import './assets/main.css'
import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {
  aliases,
  mdi
} from 'vuetify/iconsets/mdi'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  })
  

// Définir une fonction pour changer la classe du body
function changeBodyClass(to) {
  if (to.name === 'game' || to.name === 'waitingRoom') {
    document.body.classList.add('black-background')
  } else {
    document.body.classList.remove('black-background')
  }
}

const checkIfUserIsAuthenticated = () => {
  
  // check si le JWT est encore valide ou sinon renvoie sur login
  return true;
}


// Surveiller les changements de route pour appliquer la classe appropriée
router.afterEach((to) => {
  changeBodyClass(to);
});

// // Middleware de routage pour vérifier l'authentification avant d'accéder aux routes protégées
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = checkIfUserIsAuthenticated(); // Fonction qui vérifie si l'utilisateur est authentifié
//   //const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   const requiresAuth = true;


//   if (requiresAuth && !isAuthenticated) {
//     next('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
//   } else {
//     next();
//   }
// });


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vuetify).mount('#app')
