<script setup>
import axios from 'axios';
import { reactive, ref, onMounted, provide } from 'vue';
import { API_URL } from '../constants';
import {playerManager, questionManager, quizzList} from "./quizzKeys"
import io from 'socket.io-client';
import qs from 'qs';
const socket = io(API_URL);
const players = ref([
  {
    id: 1,
    firstname: "test",
  },
  {
    id: 2,
    firstname: "test2",
  }
])
const quizzQuestionList = reactive([]);
const questionLabel = ref("")
const answerList = ref([])
const questionNumber = ref(0)
const isLoading = ref(true)

const getQuestions = () => {


  const queryParams = {
    _itemsPerPage: '10',
  };

  // Convertir les paramètres de requête en chaîne de requête
  const queryString = qs.stringify(queryParams);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${API_URL}/api/questions?${queryString}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }


  axios
    .request(config)
    .then((response) => {
      quizzQuestionList.value = response.data
      answerList.value = [
        response.data[questionNumber.value].correctAnswer,
        ...response.data[questionNumber.value].incorrectAnswers
      ]
      answerList.value = answerList.value.sort(() => Math.random() - 0.5)
      questionLabel.value = response.data[questionNumber.value].question.text;
      isLoading.value = false
}).catch((err)=>console.warn(`Error while fetching questions ${err}`))
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error)
    })
}


const scores = reactive({
  player1: 0,
  player2: 0
})

const setPlayers = (users) => {
  console.log("SETTING PLAYERS", users)
  players.value = users;
};

const setScore = (score, player) => {
  scores[player] = score;
};
  


provide(quizzList, {
});

provide(questionManager, {
  getQuestions,
  quizzQuestionList,
  questionLabel,
  answerList,
  questionNumber,
  isLoading
});

provide(playerManager, {
  players,
  setPlayers, 
  scores,
  setScore
});

</script>

<template>
    <slot></slot>
</template>

<style scoped>
li {
  color: red;
}
</style>