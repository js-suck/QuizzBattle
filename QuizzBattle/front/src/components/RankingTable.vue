<template>
  <div>
    <v-card
      :style="{
        backgroundColor: theme.colors.violet,
        padding: 0,
        color: 'white',
        display: 'flex',
        justifyContent: 'center'
      }"
      class="bg-violet-500 ranking-table"
    >
    <template v-slot:default>
  <div class="flex flex-col">
    <div
      v-for="(userData, index) in items"
      :key="index"
      :class="`p-4 items-center w-full flex ${userData.userId == user.id ? 'bg-white' : ''}`"
    >
      <p class="mr-5">{{ index + 1 }}</p>

      <div
        :class="`flex items-center w-20 h-20 justify-center rounded-full overflow-hidden p-1 ${
          userData.userId == user.id ? 'bg-cyan-400' : 'bg-white'
        }`"
      >
        <img
          @click="openModal(userData.userId)"
          class="rounded-full h-full object-cover w-full"
          :src="`${API_URL}/uploads/${userData.userProfilePicture}`"
          alt=""
        />
      </div>
      <p class="pr-24 pl-24">{{ userData.nickname }}</p>
      <p class="mr-4">{{ userData.score }}</p>

      <!-- Icône pour ouvrir la modal -->
      <span @click="openModal(userData.userId)" class="material-icons cursor-pointer text-white">open_in_new</span>
    </div>
  </div>
</template>

    </v-card>
    <v-dialog v-model="modalOpen" :style="{borderRadius: '10px'}">
      <v-card>
          <!-- Composant UserStatsView -->
          <UserStats :user="selectedUser" />
       
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { inject, onMounted, ref } from 'vue'

import { API_URL } from '../constants'
import { userManagerKey } from '../contexts/userManagerKeys'
import client from '../helpers/client'

const theme = inject('theme')
const { user } = inject(userManagerKey)
import UserStats from '@/components/UserStats.vue';
const props = defineProps({
  categoryId: {
    type: Number,
    required: true
  }
})
const url = `${API_URL}/api/scoreboard/${props.categoryId}`
const items = ref([])

const modalOpen = ref(false)

const selectedUser = ref(null)

const closeModal = () => {
  modalOpen.value = false
}

const openModal = (user) => {
  selectedUser.value = user
  modalOpen.value = true
}

onMounted(async () => {
  const response = await client.get(url)
  items.value = response.data
  console.log(items)
})
</script>

<style scoped>
.ranking-table {
  background-image: url('@/assets/images/QuizzBattleBackgroundRanking.png');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
