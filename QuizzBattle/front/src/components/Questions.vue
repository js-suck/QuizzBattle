<template>
  <div v-if="quizzAnswerList.value" class="flex flex-col h-screen">
    <GameHeader :gameName="questionLabel" class="game-" :style="'margin-bottom: 2em'"/>
  
    <div  v-for="answer in quizzAnswerList.value.question.answers" :key="answer.id">
      <QuestionBlock :answer="answer.label" :isCorrect="answer.isCorrect" @click="handleRevealCorrectAnswer" :isReveal="isElementsRevealed" :style="'margin-bottom: 2em'"/>
    </div>
    <button v-if="quizzAnswerList.value.nextQuestion" class="bg-transparent hover:bg-white text-white-500 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent rounded" @click="handleNextQuestion">
  Next
</button>


  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { API_URL } from '../constants';
import GameHeader from './GameHeader/GameHeader.vue';
import QuestionBlock from './QuestionBlock.vue';
const quizzAnswerList = reactive([]);
const questionLabel = ref("")
const isElementsRevealed = ref(false);

const handleRevealCorrectAnswer = () => {
  console.log('handleRevealCorrectAnswer');
  isElementsRevealed.value = true;
};


const handleNextQuestion = () => {
  console.log('handleNextQuestion');
  isElementsRevealed.value = false;

  getQuestions(quizzAnswerList.value.nextQuestion.id);
}

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


onMounted(() => {
  getQuestions();
});

// Exécute si quizzAnswerList est mis à jour
watch(() => quizzAnswerList, (newValue, oldValue) => {
  console.log('quizzAnswerList updated', newValue, oldValue);
});
</script>

<style scoped>
.question {
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  color: black;
  margin-top: 20%;
}

.player-band {
  background-color: violet;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
