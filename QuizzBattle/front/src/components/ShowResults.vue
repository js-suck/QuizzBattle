<template>
  <div class="flex flex-col align-center items-center">
    <h2 class="text-gray-500 text-uppercase">Result</h2>
    <div v-if="isWinner">
      <h2 class="text-white text-uppercase">You won !!!</h2>
    </div>
    <div v-else>
      <h2 class="text-white">You lost...</h2>
    </div>
    <div v-if="scores">
      <ul class="flex">
        <li class="text-white p-2 flex flex-col">

          <div :class="`rounded-full p-1 ${winnerPlayer === player1 ? 'border-yellow-500 border-4' : 'border-red-500 border-4'}`">
            <img :src="`${FILE_PATHS.profilePictures}${player1.profileFile}`" alt="Votre image"
              class="rounded-full w-40 h-40 object-cover">
          </div>
          <div class="flex flex-col p-4">
            <p class="text-violet bg-white rounded-md text-center p-1"> {{ player1.lastname }} </p>
            <p class="text-violet bg-violet-500 rounded-md text-center  mt-3"> {{ scores.player1 }}
            </p>

          </div>
        </li>

        <li class="text-white p-2 flex flex-col">

          <div :class="`rounded-full p-1 ${winnerPlayer === player2 ? 'border-yellow-500 border-4' : 'border-red-500 border-4'}`">
            <img :src="`${FILE_PATHS.profilePictures}${player1.profileFile}`" alt="Votre image"
              class="rounded-full w-40 h-40 object-cover">
          </div>
          <div class="flex flex-col p-4">
            <p class="text-violet bg-white rounded-md text-center p-1"> {{ player2.lastname }} </p>
            <p class="text-violet bg-violet-500 rounded-md text-center  mt-3"> {{ scores.player2 }}
            </p>

          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No scores to display.</p>
    </div>
    <Button :style="{
      display: flex,
      width: '90%',
      position: 'absolute',
      bottom: '10%',
      height: '5em'
    }"
     @click="$router.push('/')"
    >Play again</Button>

  </div>
</template>
  
<script setup>
import { ref, inject, computed } from 'vue';
import { playerManager } from '../contexts/quizzKeys';
import { FILE_PATHS } from '../constants/files';
import Button from "./Button.vue"

const { players, scores } = inject(playerManager, ref([]));

const isWinner = scores.player1 > scores.player2
const player1 = {
  ...players.value[0],
  // profileFile: `@/assets/${FILE_PATHS.profilePictures}/${players.value[0].profilePicturePath}`
  profileFile: `defaultUser.jpeg`
}

const usersWithScores = {
  player1: {
    ...player1,
    score: scores.player1
  },
  player2: {
    ...players.value[1],
    score: scores.player2
  }
}
const player2 = players.value[1]

const winnerPlayer = scores.player1 > scores.player2 ? player1 : player2

const handleRedirectToDashboard = () => {
  router.push({ name: 'Dashboard' })
}


// calculate assest source file  for profile

</script>
<style scoped></style>