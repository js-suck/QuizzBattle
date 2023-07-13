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
    <div v-else>
      <h1 class="text-3xl font-bold underline">Quizz Battle</h1>
      <button @click="startGame">Commencer le jeu</button>
    </div>
  </div>
</template>

<script setup>
import io from 'socket.io-client';
import axios from 'axios';
import { onMounted, ref } from 'vue';

import Questions from '../components/Questions.vue';
import { API_URL } from '../constants';

const gameStarted = ref(false);
const currentQuestion = ref("test");
const playerScores = ref({});
const showResults = ref(false);
const quizList = ref(null);

const socket = io(API_URL);

import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);


const startGame = () => {
  socket.emit('userJoin', user);
  socket.emit('startGame');
  gameStarted.value = true;
};

const submitAnswer = (answer) => {
  socket.emit('answer', answer);
};

socket.on("join room", (room) => {

  console.log("join roomm")
  // redirect to url generated with the room name
  const url = `http://localhost:5173/game/${room}`
  console.log(url)

  window.location.href = url;
})

onMounted(() => {
  socket.on('connect', () => {
    console.log('Connecté au serveur Socket.IO');
  });

  socket.on('question', (question) => {
    currentQuestion.value = question;
  });

  socket.on('results', (scores) => {
    playerScores.value = scores;
    showResults.value = true;
  });

  axios.get(`${API_URL}/api/quizzes`)
    .then((response) => {
      quizList.value = response.data;
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error);
    });

    if(!user.value.roomID)
    {
      console.log("test", user.value.roomID);
      socket.emit('userJoin', user);
    }

});
</script>
