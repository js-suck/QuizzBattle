<script setup>
import {
  provide,
  reactive,
  ref
} from 'vue'

import qs from 'qs'

import { API_URL } from '../constants'
import client from '../helpers/client'
import {
  playerManager,
  questionManager,
  quizzList
} from './quizzKeys'

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
const category = ref("music")

const getQuestions = async () => {

  let categoryId = 1;
// request axios get category by 
let params = new URLSearchParams();
params.append('quizzId', category.value);
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${API_URL}/api/category/${category.value}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
}

await client
  .request(config)
  .then((response) => {
    console.log(response)
    categoryId = response?.data?.id
  })



  const queryParams = {
    _itemsPerPage: '10',
    quizzId: categoryId
  };

  // Convertir les paramètres de requête en chaîne de requête
  const queryString = qs.stringify(queryParams);

   config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${API_URL}/api/questions?${queryString}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }


  client
    .request(config)
    .then((response) => {
      quizzQuestionList.value = response.data
      answerList.value = [
        response.data[questionNumber.value].correctAnswer,
        ...response.data[questionNumber.value].incorrectAnswers
      ]
      answerList.value = answerList.value.sort(() => Math.random() - 0.5)
      questionLabel.value = response.data[questionNumber.value].question.text;
     // isLoading.value = false
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

const setCategory = (value) => {
  category.value = value;
}
  


provide(quizzList, {
});

provide(questionManager, {
  getQuestions,
  quizzQuestionList,
  questionLabel,
  answerList,
  questionNumber,
  isLoading,
  setCategory
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