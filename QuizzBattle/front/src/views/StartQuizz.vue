<template>
  <div class="w-full">
    <div v-if="gameStarted" class="w-full">
      <Questions :question="currentQuestion" @answer="submitAnswer" />
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
      <h1 class="text-3xl font-bold underline">Quizz Battle</h1>
      <button @click="startGame">Commencer le jeu avec n'importe quelle catégorie</button>
      <h2 class="text-2xl font-bold">Ou choisissez une catégorie</h2>
      <div class="flex flex-wrap justify-center">
        <div v-for="(category, key) in categories" :key="key" class="w-1/4 p-2">
          <div @click="startGameWithCategory(key)" class="bg-white rounded-lg shadow-lg">
            <div class="p-4">
              <h2 class="text-xl font-bold">{{ category }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import io from 'socket.io-client'
import axios from 'axios'
import { onMounted, ref } from 'vue'

import Questions from '../components/Questions.vue'
import { API_URL } from '../constants'

const gameStarted = ref(false)
const gameStartedWithCategory = ref(false)
const currentQuestion = ref('test')
const playerScores = ref({})
const showResults = ref(false)
const quizList = ref(null)
const categories = ref(null)
const category = ref(null)

const socket = io(API_URL)

import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);


const startGame = () => {
  socket.emit('startGame')
  gameStarted.value = true
  window.location.href = "http://localhost:5173/waiting";

}

const startGameWithCategory = (cat) => {
  socket.emit('startGameWithCategory', cat)
  gameStartedWithCategory.value = true
  category.value = cat
}


const submitAnswer = (answer) => {
  socket.emit('answer', answer)
}

socket.on("disconnect", () =>{
  console.log("disconnected")
})


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

  axios
    .get(`${API_URL}/api/quizzes`)
    .then((response) => {
      quizList.value = response.data
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error)
    })

  axios
    .get(`${API_URL}/api/questions/trivia/categories`)
    .then((response) => {
      categories.value = response.data
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des catégories', error)
    })
})
</script>
