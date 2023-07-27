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
            <img :src="`${FILE_PATHS.profilePictures}${player1.profileFile}`"
              class="rounded-full w-40 h-40 object-cover">
          </div>
          <div class="flex flex-col p-4">
            <p class="text-violet bg-white rounded-md text-center p-1"> {{ player.firstname }} </p>
            <p class="text-violet bg-violet-500 rounded-md text-center  mt-3"> {{ player.score }}
            </p>

          </div>
        </li>

        <li class="text-white p-2 flex flex-col">

          <div :class="`rounded-full p-1 ${winnerPlayer === player2 ? 'border-yellow-500 border-4' : 'border-red-500 border-4'}`">
            <img :src="`${FILE_PATHS.profilePictures}${player1.profileFile}`"
              class="rounded-full w-40 h-40 object-cover">
          </div>
          <div class="flex flex-col p-4">
            <p class="text-violet bg-white rounded-md text-center p-1"> {{ player2.firstname }} </p>
            <p class="text-violet bg-violet-500 rounded-md text-center  mt-3"> {{ player2.score }}
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
import { ref, inject, computed, onMounted } from 'vue';
import { playerManager } from '../contexts/quizzKeys';
import { FILE_PATHS } from '../constants/files';
import Button from "./Button.vue"
import { userManagerKey } from '../contexts/userManagerKeys';
import { useRoute } from 'vue-router';
const route = useRoute()

const {user} = inject(userManagerKey)
const { players, scores } = inject(playerManager, ref([]));
const player = players.value.find((p) => p.id === user.value.id)
const player2 = players.value.find((p) => p.id !== user.value.id)
const isWinner = player.score > player2.score
const player1 = {
  ...players.value[0],
  // profileFile: `@/assets/${FILE_PATHS.profilePictures}/${players.value[0].profilePicturePath}`
  profileFile: `defaultUser.jpeg`
}

const winnerPlayer = player1.score > player2.score ? player1 : player2
</script>
<style scoped></style>