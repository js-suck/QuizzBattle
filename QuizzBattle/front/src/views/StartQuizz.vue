<template>
  <Navigation>

    <div class="w-full">
      <div v-if="gameStarted" class="w-full">
        <QuizzGame :question="currentQuestion" @answer="submitAnswer" />
        <div v-if="showResults">
          <h2>Résultats</h2>
          <ul>
            <li v-for="(score, playerId) in playerScores" :key="playerId">
              Joueur {{ playerId }} : {{ score }} points
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="gameStartedWithCategory" class="w-full">
        <Questions :question="currentQuestion" @answer="submitAnswer" :category="category" />
        <div v-if="showResults">
          <h2>Résultats</h2>
          <ul>
            <li v-for="(score, playerId) in playerScores" :key="playerId">
              Joueur {{ playerId }} : {{ score }} points
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <img src="@/assets/images/LogoQuizzBattleWithoutBG.png" class="h-1/6  lg:w-36 w-2/6 rounded-md mx-auto">

        <RoundedSquare class="bg-violet-500 p-8 rounded-xl text-white font-weight-bold mb-5">
          <div class="flex items-between justify-between">
            <div class="flex flex-col justify-between items-start">
              <h2> Play Together with your friends now !</h2>

              <button @click="startGameWithCategory(getRandomCategory())"
                class="bg-white rounded-lg  hover:text-white hover:bg-purple-600 text-cyan-400  py-2 px-4 mt-3 rounded">
                Start with a random category
              </button>
            </div>
            <img src="@/assets/images/PlayGame.jpg" class="h-1/6  lg:w-48 w-2/6 rounded-md">

          </div>

        </RoundedSquare>

        <!-- <h1 class="text-3xl font-bold underline">Quizz Battle</h1>
      <button @click="startGame">Commencer le jeu avec n'importe quelle catégorie</button>-->
        <div class="flex flex-wrap justify-center">
          <v-sheet class="mx-auto" max-width="100%" s>
            <v-slide-group>
              <v-slide-group-item v-for="(category, key) in categories" :key="category">
                <QuizzCard @click="startGameWithCategory(category.name)" class="ma-2" :title="category.name"
                  :text="category.description" :image="`${FILE_PATHS.categoryPictures}${category.image_url}`" />
              </v-slide-group-item>
            </v-slide-group>
          </v-sheet>

        </div>

        <h2 class="ml-10 mt-6 mb-6 text-black-400">Last recent winner's</h2>
        <div class="flex flex-wrap justify-center">
          <v-sheet class="mx-auto" max-width="100%" s>
            <v-slide-group>
              <v-slide-group-item v-for="(user, key) in userTop" :key="user">
                <ProfileBadge :name="user.username" :width="'6rem'" :height="'6rem'" :textColor="'black'" :style="{margin: '1em'}"
                  :image="user.userProfilePicture ? `${API_URL}/uploads/${user.userProfilePicture}` : 'https://www.computerhope.com/jargon/g/guest-user.png'" />

              </v-slide-group-item>
            </v-slide-group>
          </v-sheet>

        </div>
      </div>
    </div>
  </Navigation>
</template>
<script setup>
import {
  onMounted,
  reactive,
  ref
} from 'vue'

import axios from 'axios'
import jwtDecode from 'jwt-decode'
import io from 'socket.io-client'

import Navigation from '../components/Navigation.vue'
import ProfileBadge from '../components/ProfileBadge.vue'
import QuizzCard from '../components/QuizzCard.vue'
import QuizzGame from '../components/QuizzGame.vue'
import RoundedSquare from '../components/RoundedSquare.vue'
import { API_URL } from '../constants'
import { FILE_PATHS } from '../constants/files'
import client from '../helpers/client'

const gameStarted = ref(false)
const gameStartedWithCategory = ref(false)
const currentQuestion = ref('test')
const playerScores = ref({})
const showResults = ref(false)
const quizList = ref(null)
const categories = ref(null)
const category = ref(null)
const socket = io(API_URL)
const userTop = ref(null)
const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);


const startGame = () => {
  socket.emit('startGame')
  gameStarted.value = true
  window.location.href = "http://localhost:5173/waiting";
}

const startGameWithCategory = (cat) => {
  socket.emit('startGameWithCategory', cat)
  // gameStartedWithCategory.value = true
  // category.value = cat

  window.location.href = `http://localhost:5173/waiting/${cat}`;
}

const submitAnswer = (answer) => {
  socket.emit('answer', answer)
}

socket.on("disconnect", () => {
  console.log("disconnected")
})

const getRandomCategory = () => {
  return categories.value[1].name
}

onMounted(() => {
  socket.on('connect', () => {
    console.log('Connecté au serveur Socket.IO')
  })

  socket.on('question', (question) => {
    currentQuestion.value = question
  })

  socket.on('results', (scores) => {
    playerScores.value = scores
    showResults.value = true
  })

  client
    .get(`${API_URL}/api/quizzes`)
    .then((response) => {
      quizList.value = response.data
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error)
    })

  client
    .get(`${API_URL}/api/category`)
    .then((response) => {
      categories.value = response.data
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des catégories', error)
    })

  client
    .request({
      method: 'get',
      url: `${API_URL}/api/game/win/1`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })
    .then((response) => {
      userTop.value = response.data
      console.log("Game envoyée", response.data)
      console.log(userTop.value)

    })
    .catch((error) => {
      console.error("Erreur lors de l'envoie de la game", error)
    })


})
</script>
