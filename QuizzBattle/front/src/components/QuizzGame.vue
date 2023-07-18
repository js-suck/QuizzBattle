<template>
  <div class="quizz-game">
    <div v-show="isElementsRevealed && !isGameFinished" class="quizz-game-reveal-status" :style="{
      backgroundColor: isWinnerQuestion ? theme.colors.green : theme.colors.red
    }">
      <h2 class="mb-4">{{  isWinnerQuestion ? "Correct!" : "Incorrect!"}}</h2>
      <p v-if="isWinnerQuestion" class="rounded-2xl bg-white p-3 text-green font-extrabold" >+{{ userQuestionPoints }}</p>
      <p v-else class="rounded-2xl bg-white p-3 text-red font-extrabold" >Tu y était presque !</p>
    </div>
    <div v-if="isLoading" class="spinner">
      <img src="@/assets/images/LogoQuizzBattleWithoutBG.png">
      <v-progress-circular 
      :size="250"
      :width="7"
      indeterminate
      color="white"></v-progress-circular>
    </div>
    <div v-if="quizzQuestionList.value && isGameFinished == false">
  <v-progress-linear
      v-model="timeLeftInPercent"
      :active="!isElementsRevealed"
      :color="barColor"
      height="15"
      striped
      :style="{
        marginBottom: '1em'
      }"
    ></v-progress-linear>
  <div class="flex flex-col h-screen">
    <GameHeader :users='players' :gameName="questionLabel" class="game-" :style="'margin-bottom: 2em'"/>
    <div v-for="(answer, index) in answerList" :key="answer">
      <QuestionBlock
        :answer="answer"
        :correctAnswer="quizzQuestionList.value[questionNumber].correctAnswer"
        :isCorrect="isCorrectAnswer(answer)"
        @click="handleRevealCorrectAnswer(answer)"
        :isReveal="isElementsRevealed"
        :index="index"
        :style="'margin-bottom: 2em'"
        :backgroundColor="isElementsRevealed && isCorrectAnswer(answer) ? 'green' : isElementsRevealed && !isCorrectAnswer(answer) ? 'red' : colorVars[index] || 'white'"
      />
    </div>

    <button
      v-if="quizzQuestionList.value[questionNumber + 1] && isElementsRevealed"
      class="hover:text-white-500 text-white bg-violet-500  hover:bg-violet-700 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent bg-red-500 rounded-3xl  h-20"
      @click="handleNextQuestion"
    >
      Question suivante
    </button>
    <button
      v-else-if="!quizzQuestionList.value[questionNumber + 1]"
      class="bg-white hover:bg-white text-black-500 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent  rounded-3xl h-20"
      @click="handleResult"
    >
      Afficher les résulats
    </button>
  </div>
  <div v-if="isGameFinished == true" class="flex flex-col h-screen">
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
   </div>
   <ShowResult v-if="isGameFinished"/>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch, inject, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../constants'
import GameHeader from './GameHeader/GameHeader.vue'
import QuestionBlock from './QuestionBlock.vue'
import ShowResult from "./ShowResults.vue"
import qs from 'qs'
import { useRoute } from 'vue-router';
import { playerManager, questionManager } from '../contexts/quizzKeys'
import { io } from 'socket.io-client'
import { increaseScore } from '../helpers/quizz';
import { userManagerKey } from '../contexts/userManagerKeys'
const {user} = inject(userManagerKey)
const theme = inject("theme")
const {getQuestions,  quizzQuestionList, questionLabel, answerList, questionNumber, isLoading} = inject(questionManager)
const {players, setPlayers, scores} = inject(playerManager)
const socket = io(API_URL)
const route = useRoute();  
const roomId = route.params.id;
const colorVars = [theme.colors.blue, theme.colors.green, theme.colors.orange, theme.colors.red]
const isElementsRevealed = ref(false)
const isWinnerQuestion = ref(false)
const score = ref(0)
const isGameFinished = ref(false)
const timeLeft = ref(10000)
const timer = ref(null)
const transitionEnabled = ref(false)
const barColor = ref(theme.colors.blue);
const timeLeftInPercent = ref(0)
const props = defineProps({
  category: {
    required: false,
    type: String
  }
})
const userQuestionPoints = ref(0)


const isCorrectAnswer = answer => {
  return quizzQuestionList.value[questionNumber.value].correctAnswer === answer
}
watch(timeLeft, (value) => {
  timeLeftInPercent.value = Math.round(value / 1000) * 10
})

const startTimer = () => {
  const startTime = Date.now();
  const totalTime = 10000; 

  const updateTimer = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime < totalTime) {
      timeLeft.value = totalTime - elapsedTime;
    } else {
      timeLeft.value = 0;
      handleRevealCorrectAnswer();
    }
  };

  timer.value = setInterval(updateTimer); 
};

const handleRevealCorrectAnswer = (answer) => {
  clearInterval(timer.value)
  isElementsRevealed.value = true
  if (quizzQuestionList.value[questionNumber.value].correctAnswer === answer) {
    score.value = increaseScore(timeLeft.value);
    scores.player1 = increaseScore(timeLeft.value)
    userQuestionPoints.value = timeLeft.value
    isWinnerQuestion.value = true
  } else {
    isWinnerQuestion.value = false
  }
  timeLeft.value = 10000;
  transitionEnabled.value = false; 


  socket.emit("update score", {
    room: roomId,
    user: user.value,
    score: scores.player1,
  })

}

const handleNextQuestion = () => {
  console.log("handleNextQuestion")
  isElementsRevealed.value = false
  questionNumber.value++
  answerList.value = [
    quizzQuestionList.value[questionNumber.value].correctAnswer,
    ...quizzQuestionList.value[questionNumber.value].incorrectAnswers
  ]
  questionLabel.value = quizzQuestionList.value[questionNumber.value].question.text;
  clearInterval(timer.value); // Arrêter l'intervalle précédent
  timeLeft.value = 10000;
  startTimer()
}

const handleResult = () => {
  isGameFinished.value = true
  isElementsRevealed.value = false;
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
    url: `${API_URL}/api/questions?${queryString}`,
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
      questionLabel.value = response.data[questionNumber.value].question.text;
      isLoading.value = false
      startTimer();
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des quiz', error)
    })
}



onMounted(async () => {

  // Emit an event to tell the socket that the user is connected to the roomID
  socket.emit('fetch room', roomId);

  socket.on('startGame', (room) => {
    setPlayers(room.users );
   
    isLoading.value = false;

  });

  socket.on('update score', (room) => {
    console.log("score updated", room)
  }); 

  await getQuestions();
  startTimer()

 // getQuestionsTrivia(props.category);
});



</script>

<style scoped>


.quizz-game-reveal-status{

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2em;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

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

.spinner {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>







