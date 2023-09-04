<template>
  <div v-if="isLoading" class="spinner">
    <img src="@/assets/images/LogoQuizzBattleWithoutBG.png" />
    <v-progress-circular :size="250" :width="7" indeterminate color="white"></v-progress-circular>
  </div>
  <div v-else class="quizz-game">
    <div
      v-show="isElementsRevealed && !isGameFinished"
      class="quizz-game-reveal-status"
      :style="{
        backgroundColor: isWinnerQuestion ? theme.colors.green : theme.colors.red
      }"
    >
      <h2 class="mb-4">{{ isWinnerQuestion ? 'Correct!' : 'Incorrect!' }}</h2>
      <p v-if="isWinnerQuestion" class="rounded-2xl bg-white p-3 text-green font-extrabold">
        +{{ userQuestionPoints }}
      </p>
      <p v-else class="rounded-2xl bg-white p-3 text-red font-extrabold">Tu y était presque !</p>
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
      <div class="flex flex-col">
        <GameHeader
          :users="players"
          :gameName="questionLabel"
          class="game-"
          :style="'margin-bottom: 2em'"
        />
        <div v-for="(answer, index) in answerList" :key="answer">
          <QuestionBlock
            :answer="answer"
            :correctAnswer="quizzQuestionList.value[questionNumber].correctAnswer"
            :isCorrect="isCorrectAnswer(answer)"
            @click="handleAnswerClick(answer)"
            :isReveal="isElementsRevealed"
            :index="index"
            :style="'margin-bottom: 2em'"
            :backgroundColor="
              isElementsRevealed && isCorrectAnswer(answer)
                ? 'green'
                : isElementsRevealed && !isCorrectAnswer(answer)
                ? 'red'
                : colorVars[index] || 'white'
            "
          />
        </div>

        <button
          v-if="quizzQuestionList.value[questionNumber + 1] && isElementsRevealed"
          class="hover:text-white-500 text-white bg-violet-500 hover:bg-violet-700 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent bg-red-500 rounded-3xl h-20"
          @click="handleNextQuestion"
        >
          Question suivante
        </button>
        <button
          v-else-if="!quizzQuestionList.value[questionNumber + 1]"
          class="bg-white hover:bg-white text-black-500 font-semibold hover:text-black-200 py-2 px-4 border border-white-500 hover:border-transparent rounded-3xl h-20"
          @click="handleResult"
        >
          Afficher les résulats
        </button>
      </div>
      <Emotes />

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
    <ShowResult v-if="isGameFinished" :otherPlayerDisconnect="otherPlayerDisconnect" />
  </div>
  <v-dialog v-model="showModal" max-width="500px">
    <v-card>
      <v-card-title class="headline">Congratulations</v-card-title>
      <v-card-text>You earned the badge : {{ showModal }}</v-card-text>
      <v-img height="200" :src='`/src/assets/badges/${badgeImage}`' class="text-white" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="showModal = false">Cool !</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

import qs from 'qs'
import { useRoute } from 'vue-router'

import socket from '../config/socket'
import { API_URL } from '../constants'
import { playerManager, questionManager } from '../contexts/quizzKeys'
import { userManagerKey } from '../contexts/userManagerKeys'
import client from '../helpers/client'
import { increaseScore } from '../helpers/quizz'
import Emotes from './Emotes.vue'
import GameHeader from './GameHeader/GameHeader.vue'
import QuestionBlock from './QuestionBlock.vue'
import ShowResult from './ShowResults.vue'

const { user } = inject(userManagerKey)
const theme = inject('theme')
const {
  getQuestions,
  quizzQuestionList,
  questionLabel,
  answerList,
  questionNumber,
  isLoading,
  setCategory,
  category,
  categoryId
} = inject(questionManager)
const { players, setPlayers, scores } = inject(playerManager)
const route = useRoute()
const roomId = route.params.id
const colorVars = [theme.colors.blue, theme.colors.green, theme.colors.orange, theme.colors.red]
const isElementsRevealed = ref(false)
const isWinnerQuestion = ref(false)
const score = ref(0)
const isGameFinished = ref(false)
const timeLeft = ref(10000)
const timer = ref(null)
const transitionEnabled = ref(false)
const barColor = ref(theme.colors.blue)
const timeLeftInPercent = ref(0)
const userQuestionPoints = ref(0)
const isAnswerRevealed = ref(false)
const categoryName = route.params.categoryId
const showModal = ref(false)
const otherPlayerDisconnect = ref(false)
const badgeImage = ref('')

// count number of correct suite response
const correctAnswersStrike = ref(0)

const isCorrectAnswer = (answer) => {
  return quizzQuestionList.value[questionNumber.value].correctAnswer === answer
}
watch(timeLeft, (value) => {
  timeLeftInPercent.value = Math.round(value / 1000) * 10
})

const startTimer = () => {
  const startTime = Date.now()
  const totalTime = 10000

  const updateTimer = () => {
    const currentTime = Date.now()
    const elapsedTime = currentTime - startTime

    if (elapsedTime < totalTime) {
      timeLeft.value = totalTime - elapsedTime
    } else {
      timeLeft.value = 0
      handleRevealCorrectAnswer()
    }
  }

  timer.value = setInterval(updateTimer)
}

const handleRevealCorrectAnswer = (answer) => {
  clearInterval(timer.value)
  isElementsRevealed.value = true
  if (quizzQuestionList.value[questionNumber.value].correctAnswer === answer) {
    score.value = score.value + increaseScore(timeLeft.value)
    scores.player1 = scores.player1 + increaseScore(timeLeft.value)
    userQuestionPoints.value = increaseScore(timeLeft.value)
    isWinnerQuestion.value = true
    correctAnswersStrike.value++
  } else {
    isWinnerQuestion.value = false
    correctAnswersStrike.value = 0
  }
  timeLeft.value = 10000
  transitionEnabled.value = false

  socket.emit('update score', {
    room: roomId,
    user: user.value,
    category: category.value,
    score: scores.player1
  })
  isAnswerRevealed.value = true
}
const handleNextQuestion = () => {
  console.log('handleNextQuestion')
  isElementsRevealed.value = false
  questionNumber.value++

  const currentQuestion = quizzQuestionList.value[questionNumber.value]
  const answers = [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers]

  // Shuffle the answers using the Fisher-Yates algorithm
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[answers[i], answers[j]] = [answers[j], answers[i]]
  }

  answerList.value = answers
  questionLabel.value = currentQuestion.question.text
  clearInterval(timer.value)
  timeLeft.value = 10000
  isAnswerRevealed.value = false
  startTimer()
}

const handleAnswerClick = (answer) => {
  if (!isAnswerRevealed.value) {
    handleRevealCorrectAnswer(answer)
  }
}
const handleResult = () => {
  isElementsRevealed.value = false
  isLoading.value = true

  socket.emit('user finished', {
    user: user.value,
    room: roomId,
    category: category.value
  })
}

onMounted(async () => {
  setCategory(categoryName)
  socket.emit('fetch room', {
    room: roomId,
    category: category.value,
    user: user.value
  })

  socket.on('startGame', (room) => {
    console.log('setPlayer', room)
    setPlayers(room.users)

    isLoading.value = false
  })
  socket.on('userDisconnected', () => {
    scores.player2 = 0
    isGameFinished.value = true
    clearInterval(timer.value)
    isLoading.value = false
    otherPlayerDisconnect.value = true
  })

  socket.on('update score', (room) => {
    console.log('SCORE UPDATED', room)

    setPlayers(room.users)
  })

  socket.on('game finished', (data) => {
    console.log('GAME FINISHED', data, players)
    isGameFinished.value = true
    clearInterval(timer.value)
    isLoading.value = false

    const player = players.value.find((p) => p.id === user.value.id)
    const player2 = players.value.find((p) => p.id !== user.value.id)

    let gameData = qs.stringify({
      username: user.value.firstname,
      quizzName: category.value,
      userId: user.value.id,
      quizzId: categoryId.value,
      userVsName: player2.firstname,
      userVsScore: player2.score,
      score: player.score,
      isWinner: player.score > player2.score,
      userVsID: player2.id,
      userProfilePicture: user.value?.image
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/api/game`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: gameData
    }

    client
      .request(config)
      .then((response) => {
        console.log('Game envoyée', response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoie de la game", error)
      })

    console.log(correctAnswersStrike)

    const response = client
      .post(`${API_URL}/api/game/stats/${user.value.id}`, {
        correctAnswersStrike: correctAnswersStrike.value
      })
      .then((response) => {
        console.log(response.data.totalGamesStatsAndBadge.badges)

        const newBadges = response.data.totalGamesStatsAndBadge.badges.filter(
          (badge) => badge.isNew === true
        )
        console.log(newBadges)
        if (newBadges.length > 0) {
          showModal.value = newBadges[0].label
          badgeImage.value = newBadges[0].image
        }

        // count the number of games played
        // const gamesPlayed = response.data.length;
        // if (gamesPlayed == 1) {
        //   console.log("Première game jouée", response.data)
        //   showModal.value = "FirstGame";
        // } else if (gamesPlayed == 10) {
        //   console.log("10 games jouées", response.data)
        //   showModal.value = "10Games";
        // } else if (gamesPlayed == 50) {
        //   console.log("50 games jouées", response.data)
        //   showModal.value = "50Games";
        // } else if (gamesPlayed == 100) {
        //   console.log("100 games jouées", response.data)
        //   showModal.value = "100Games";
        // } else {
        //   console.log("Autre nombre de games jouées", response.data.length)
        //   showModal.value = "OtherGames";

        // }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des games', error)
      })

    client.put(`${API_URL}/api/users/updateStats/${user.value.id}`, {
      score: score.value,
      gamesPlayed: 1,
      isIncrement: true
    })

    client.put(`${API_URL}/api/scoreboard/updateStats`, {
      score: score.value,
      gamesPlayed: 1,
      userId: user.value.id,
      categoryId: categoryId.value
    })
  })

  await getQuestions()
  startTimer()

  // getQuestionsTrivia(props.category);
})
</script>

<style scoped>
.quizz-game-reveal-status {
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
