import './assets/main.css'
import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

import jwtDecode from 'jwt-decode'
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

const checkIfUserIsAdmin = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }
  
    try {
      const user = jwtDecode(token);
      return user?.role =='admin' || false;
    } catch (error) {
      return false;
    }
  };

  const checkIfUserIsVerified = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }
  
    try {
      const user = jwtDecode(token);
      return user?.isVerified === true;
    } catch (error) {
      return false;
    }
  };


router.afterEach((to) => {
    changeBodyClass(to);
});

router.beforeEach((to, from, next) => {

    // if(!checkIfUserIsVerified() && to.path === "/" ){
    //     return next({ path: '/login' });
    // }

    if (to.path.startsWith('/admin') && !checkIfUserIsAdmin()) {
       return next({ path: '/404' }); 
    }
    next();
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vuetify).mount('#app')