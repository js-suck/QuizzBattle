<script setup>
import axios from 'axios';
import { reactive, ref, onMounted, provide } from 'vue';
import { API_URL } from '../constants';
import {playerManager, questionManager, quizzList} from "./quizzKeys"
import io from 'socket.io-client';
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
const quizzAnswerList = reactive([]);
const questionLabel = ref("")

const getQuestions = (id = 1) => {
  axios.get(`${API_URL}/api/questions/${id}`)
    .then(response => {
      quizzAnswerList.value = response.data;
      questionLabel.value = response.data.question.label;
      console.log(response.data)
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des quiz', error);
    });
}

const setPlayers = (users) => {
  console.log("SETTING PLAYERS", users)
  players.value = users;
};

provide(quizzList, {
});

provide(questionManager, {
  getQuestions,
  quizzAnswerList,
  questionLabel
});

provide(playerManager, {
  players,
  setPlayers
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