<template>
  <div class="stats" v-if="stats.user">
    <div class="column">
      <div class="entity-title">
        <img :src="`${API_URL}/uploads/${stats?.user?.image}`" alt="stats" class="stats-img" />
      </div>
      <div class="entity">
        <h4>Player Name</h4>
        <p>{{ stats?.user?.firstname }} {{ stats?.user?.lastname }}</p>
      </div>
      <div class="entity">
        <h4>Nickname</h4>
        <p>{{ stats?.user?.nickname }}</p>
      </div>
      <div class="entity">
        <h4>Top category</h4>
        <p>{{ stats?.bestCategory }}</p>
      </div>
      <div class="entity">
        <h4>Badges</h4>
        <div class="flex">
          <div
            class="badge bg-transparent m-2"
            v-for="stats in stats.totalGamesStatsAndBadge.badges"
            v-show="stats.userObtain === true"
            :key="stats.id"
            :style="{ display: stats.userObtain ? 'initial' : 'hidden' }"
          >
            <img :src="`/src/assets/badges/${stats.image}`" class="w-24" />
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="entity-title">
        <h4>Total Score</h4>
        <p>{{ stats?.user?.score }}</p>
      </div>
      <div class="entity">
        <h4>Score Music</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('music').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('music').categorie.gamesWon }}/
            {{ getCategoryScore('music').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Sport&Leisure</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('sport_and_leisure').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('sport_and_leisure').categorie.gamesWon }}/
            {{ getCategoryScore('sport_and_leisure').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Film&TV</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('film_and_tv').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('film_and_tv').categorie.gamesWon }}/
            {{ getCategoryScore('film_and_tv').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Arts&Literature</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('arts_and_literature').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('arts_and_literature').categorie.gamesWon }}/
            {{ getCategoryScore('arts_and_literature').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="entity-title">
        <h4>Games Played</h4>
        <p>{{ stats.totalGamesPlayed }}</p>
      </div>
      <div class="entity">
        <h4>Score History</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('history').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('history').categorie.gamesWon }}/
            {{ getCategoryScore('history').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Scociety&Culture</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('society_and_culture').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('society_and_culture').categorie.gamesWon }}/
            {{ getCategoryScore('society_and_culture').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Science</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('science').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('science').categorie.gamesWon }}/
            {{ getCategoryScore('science').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Geography</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('geography').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('geography').categorie.gamesWon }}/
            {{ getCategoryScore('geography').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="entity-title">
        <h4>Average Score</h4>
        <p>{{ (stats?.user.score / stats.user.gamesPlayed).toFixed(0) }}</p>
      </div>
      <div class="entity">
        <h4>Score General Knowledge</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('general_knowledge').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('general_knowledge').categorie.gamesWon }}/
            {{ getCategoryScore('general_knowledge').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
      <div class="entity">
        <h4>Score Food&Drink</h4>
        <div class="row">
          <div class="scorebar">
            <div
              class="scorerate"
              :style="getScore(getCategoryScore('food_and_drink').categorie.successRate)"
            ></div>
          </div>
          <p>
            {{ getCategoryScore('food_and_drink').categorie.gamesWon }}/
            {{ getCategoryScore('food_and_drink').categorie.gamesPlayed }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(0deg, rgb(108 79 109 / 68%) 0%, rgb(74 34 110 / 49%) 100%);
  border: 1px solid rgb(226 232 240);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0px 2px 13px 0px #cdc2d188;
  background-color: #182437;
}

.column {
  width: 100%;
  height: 100%;
  padding: 0 2rem;
  border-right: 0.5px solid rgb(41 99 177);
}

.column:last-child {
  border-right: none;
}

.entity {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.entity-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 2rem;
  height: 120px;
}

.entity-title h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(107 114 128);
}

.entity-title p {
  font-size: 20px;
  font-weight: 600;
  color: rgb(114 146 198);
  margin-bottom: 1rem;
}

h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(107 114 128);
}

p {
  font-size: 16px;
  font-weight: 600;
  color: rgb(114 146 198);
}

.stats .entity-title img {
  width: 100px;
  height: 100px;
  border-radius: 300px;
  margin-bottom: 1rem;
  object-fit: cover;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.scorebar {
  width: 100px;
  height: 20px;
  background-color: rgb(107 114 128);
  border-radius: 10px;
  margin-right: 1rem;
}

.scorerate {
  height: 100%;
  background-color: rgb(52 211 153);
  border-radius: 10px;
}
</style>

<script setup>
import { onMounted, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import Navigation from '@/components/Navigation.vue'

import { API_URL } from '../constants'
import client from '../helpers/client'

const stats = ref({})
const route = useRoute()

const props = defineProps({
  user: {
    type: Object,
    required: false
  }
})

// Récupérer l'ID de l'utilisateur à partir des paramètres de la route
const userId = props.user ?? route.params.userId

onMounted(async () => {
  try {
    const response = await client.post(`${API_URL}/api/game/stats/${userId}`)
    console.log(response.data)
    stats.value = response.data
  } catch {
    console.error()
  }
})


function getCategoryScore(name) {
  return (
    stats.value?.categoriesStats?.find((c) => c?.categorie.label == name) ?? {
      categorie: {
        label: name,
        gamesPlayed: 0,
        gamesWon: 0,
        successRate: null
      }
    }
  )
}

// get player stats for witdh of scorebar for each category

function getScore($data) {
  const percentage = $data // Assuming score is out of 100
  if (percentage == 0) {
    return {
      width: `100%`,
      background: ` rgb(255 107 107) `
    }
  }

  if (percentage == null) {
    return {
      width: `0%`,
      background: ` rgb(255 107 107) `
    }
  }
  if (percentage < 20) {
    return {
      width: `${percentage}%`,
      background: ` rgb(255 107 107) `
    }
  }
  if (percentage < 50) {
    return {
      width: `${percentage}%`,
      background: ` rgb(252 211 77) `
    }
  }
  if (percentage < 100) {
    return {
      width: `${percentage}%`,
      background: ` rgb(52 211 153) `
    }
  }
}
</script>
