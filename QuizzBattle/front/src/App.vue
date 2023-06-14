<template>
  <div>
    <h1>Quiz en temps réel</h1>
    <div v-if="gameStarted">
      <Question :question="currentQuestion" @answer="submitAnswer" />
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
      <button @click="startGame">Commencer le jeu</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

import Question from './components/Question.vue';
import { API_URL } from './constants/index';

export default {
  components: {
    Question
  },
  data() {
    return {
      socket: null,
      gameStarted: false,
      currentQuestion: null,
      playerScores: {},
      showResults: false,
      quizzList: null,
    };
  },
  created() {



    this.socket = io(API_URL); // Remplacez l'URL par celle de votre serveur Socket.IO

    this.socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
    });

    this.socket.on('question', (question) => {
      this.currentQuestion = question;
    });

    this.socket.on('results', (scores) => {
      this.playerScores = scores;
      this.showResults = true;
    });

     axios.get(`${API_URL}/api/quizzes`)  
    .then(response => {
      // La réponse contient les données des quiz
      const quizList = response.data;

      // Faites quelque chose avec les données des quiz, par exemple, affectez-les à une variable dans votre composant
      this.quizList = quizList;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des quiz', error);
    });
  },
  methods: {
    startGame() {
      this.socket.emit('startGame');
      this.gameStarted = true;
    },
    submitAnswer(answer) {
      this.socket.emit('answer', answer);
    }
  }
};
</script>
