<template>
  <div
    v-if="isFinished == false"
    class="timer"
    :class="{ 'timer-ended': isTimeUp }"
    :style="{ width: barWidth, background: barColor}"
  >
    {{ Math.round(timeLeft / 1000) }}
  </div>
  <div v-if="quizzQuestionList.value && isFinished == false" class="flex flex-col h-screen">
    <GameHeader
      :gameName="quizzQuestionList.value[questionNumber].question.text"
      class="game-"
      :style="'margin-bottom: 2em'"
    />
    <div v-for="answer in answerList" :key="answer.id">
      <QuestionBlock
        :answer="answer"
        :correctAnswer="quizzQuestionList.value[questionNumber].correctAnswer"
        :isCorrect="quizzQuestionList.value[questionNumber].correctAnswer === answer"
        @click="handleRevealCorrectAnswer(answer)"
        :isReveal="isElementsRevealed"
        :style="'margin-bottom: 2em'"
      />
    </div>

    <button
      v-if="quizzQuestionList.value[questionNumber + 1]"
      class="bg-transparent hover:bg-white text-white-500 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent rounded"
      @click="handleNextQuestion"
    >
      Question suivante
    </button>
    <button
      v-else
      class="bg-transparent hover:bg-white text-white-500 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent rounded"
      @click="handleResult"
    >
      Afficher les résulats
    </button>
  </div>
  <div v-else-if="isFinished == true" class="flex flex-col h-screen">
    <GameHeader
      :gameName="`Votre score est de ${score} / ${quizzQuestionList.value.length}`"
      class="game-"
      :style="'margin-bottom: 2em'"
    />
    <button
      class="bg-transparent hover:bg-white text-white-500 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent rounded"
      @click="$router.push('/categories')"
    >
      Retour aux catégories
    </button>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../constants'
import GameHeader from './GameHeader/GameHeader.vue'
import QuestionBlock from './QuestionBlock.vue'
import qs from 'qs'
const quizzAnswerList = reactive([])
const quizzQuestionList = reactive([])
const answerList = ref([])
const questionLabel = ref('')
const isElementsRevealed = ref(false)
const questionNumber = ref(0)
const score = ref(0)
const isFinished = ref(false)
const isTimeUp = ref(false)
const timeLeft = ref(10000)
const timer = ref(null)
const transitionEnabled = ref(false)
const barWidth = ref('100%')
const barColor = ref('green');

const props = defineProps({
  category: {
    required: false,
    type: String
  }
})

const handleRevealCorrectAnswer = (answer) => {
  isElementsRevealed.value = true
  if (quizzQuestionList.value[questionNumber.value].correctAnswer === answer) {
    score.value++
  }
  clearInterval(timer.value)
  timeLeft.value = 10000
  isTimeUp.value = false
}

const handleNextQuestion = () => {
  isElementsRevealed.value = false
  questionNumber.value++
  answerList.value = [
    quizzQuestionList.value[questionNumber.value].correctAnswer,
    ...quizzQuestionList.value[questionNumber.value].incorrectAnswers
  ]
  clearInterval(timer.value); // Arrêter l'intervalle précédent
  timeLeft.value = 10000;
  isTimeUp.value = false;
  transitionEnabled.value = false; // Réinitialiser la transition
  barColor.value = 'green'; // Réinitialiser la couleur de la barre

  startTimer()
}

const handleResult = () => {
  isFinished.value = true
}

const getQuestions = (id = 1) => {
  axios
    .get(`${API_URL}/api/questions/${id}`)
    .then((response) => {
      quizzAnswerList.value = response.data
      questionLabel.value = response.data.question.label
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error)
    })
}

const getQuestionsTrivia = (category) => {
  let data = qs.stringify({
    limit: '10',
    categories: category,
    difficulties: 'easy',
    region: 'FR',
    types: 'text_choice'
  })
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/api/questions/trivia`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
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
      startTimer();
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error)
    })
}

const startTimer = () => {
  const startTime = Date.now();
  const totalTime = 10000; // Durée totale du timer en millisecondes (10 secondes)
  
  const updateTimer = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime < totalTime) {
      timeLeft.value = totalTime - elapsedTime;
      barWidth.value = (timeLeft.value / totalTime) * 100 + '%';
      barColor.value = `rgb(${255 - (timeLeft.value / totalTime) * 255}, ${(timeLeft.value / totalTime) * 255}, 0)`;
      requestAnimationFrame(updateTimer);
    } else {
      timeLeft.value = 0;
      barWidth.value = '0%';
      barColor.value = 'red';
      isTimeUp.value = true;
      handleRevealCorrectAnswer();
    }
  };

  updateTimer();
};

onMounted(() => {
  getQuestions()
  getQuestionsTrivia(props.category)
})

// Exécute si quizzAnswerList est mis à jour
watch(
  () => quizzAnswerList,
  (newValue, oldValue) => {
    console.log('quizzAnswerList updated', newValue, oldValue)
  }
)
watch(
  () => quizzQuestionList,
  (newValue, oldValue) => {
    console.log('quizzQuestionList updated', newValue, oldValue)
  }
)
watch(
  () => answerList,
  (newValue, oldValue) => {
    console.log('answerList updated', newValue, oldValue)
  }
)
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

.game- {
  background-color: #1a202c;
  color: #fff;
}

.timer {
  height: 20px;
  width: 100%;
  margin-bottom: 10px;
}

.timer-ended {
  background-color: red;
}
</style>
