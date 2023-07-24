import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
  })
  

// Définir une fonction pour changer la classe du body
function changeBodyClass(to) {
  if (to.name !== 'StartQuizz') {
    document.body.classList.add('black-background');
  } else {
    document.body.classList.remove('black-background');
  }
}

// Surveiller les changements de route pour appliquer la classe appropriée
router.afterEach((to) => {
  changeBodyClass(to);
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vuetify).mount('#app')
