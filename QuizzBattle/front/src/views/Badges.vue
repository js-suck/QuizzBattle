<template>
    <Navigation v-if="gameStats.totalGamesStatsAndBadge">
      <div class="flex">
         <!-- <div class="badge" v-for="stats in gameStats.categoriesStats" :key="stats.id"  >
       
        <img :src='`/src/assets/badges/${stats.categorie.label}.png`'>
        <h2>{{stats.badges.label}}</h2>
         <v-progress-linear
        :model-value="`${stats.categorie.gamesWon / 10 * 100}`"
      color="indigo"
      height="25"
    ></v-progress-linear>
    {{stats.categorie.gamesWon}} / 10 games played
        <p>{{stats.badges.description ?? "Bravo vous avez eu du succès dans cette catégorie !"}}</p>
      </div> -->
        <div
  class="badge"
  v-for="stats in gameStats.totalGamesStatsAndBadge.badges"
  :key="stats.label"
  :style="{ backgroundColor: stats.userObtain ? 'violet' : '#71717154' }"
>
         <img :src='`/assets/badges/${stats.image}`'>
          <h2>{{stats.label}}</h2>
            <v-progress-linear v-if="stats.gamesNeeds"
       :model-value="`${gameStats.totalGamesPlayed / stats.gamesNeeds * 100}`"
     color="indigo"
     height="25"
   ></v-progress-linear>
   <p v-if="stats.gamesNeeds">   {{gameStats.totalGamesPlayed }} / {{ stats.gamesNeeds }} games played
</p>
       <p>{{ stats.userObtain && stats.description ?  stats.description :  "Vous n'avez pas encore gagné le succès"}}</p> 
     </div> 
      </div>
     
    </Navigation>
  </template>
  
  <script setup>
import {
  inject,
  onMounted,
  ref
} from 'vue'

import Navigation from '@/components/Navigation.vue'

import { API_URL } from '../constants'
import { userManagerKey } from '../contexts/userManagerKeys'
import client from '../helpers/client'

const { user } = inject(userManagerKey)
  const badges = ref([]) 
  const gameStats = ref([])
  onMounted(async () => {
    try {
      const response = await client.get(`${API_URL}/api/badges/${user.value.id}`)
      badges.value = response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des badges :', error)
    }


    try {
      const response = await client.post(`${API_URL}/api/game/stats/${user.value.id}`)
      gameStats.value = response.data
      console.log(response.data.totalGamesStatsAndBadge.badges)
    } catch (error) {
      console.error('Erreur lors de la récupération des stats :', error)
    }
  })
  
</script>



<style scoped>
.badge{
    display: flex;
    background: violet;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;

}

h2 {
    color: white;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

img {
    width: 50%;
    border-radius: 1rem;
    margin-bottom: 1rem;
}

p {
  color: white;
}
</style>  