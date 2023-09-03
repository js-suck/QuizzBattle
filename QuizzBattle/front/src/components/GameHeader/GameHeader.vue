<template>
  <RoundedSquare>
    <ProfileBadge
      color="red"
      :name="users[0].firstname"
      :score="players[0].score"
      :image="`${API_URL}/uploads/${users[0].image}`"
    />
    <h2>{{ gameName }}</h2>
    <ProfileBadge
      color="green"
      :name="users[1].firstname"
      :score="players[1].score"
      :image="`${API_URL}/uploads/${users[1].image}`"
    />
  </RoundedSquare>
</template>

<script setup>
import { defineProps, inject, watch } from 'vue'

import { API_URL } from '../../constants'
import { playerManager } from '../../contexts/quizzKeys'
import ProfileBadge from '../ProfileBadge.vue'
import RoundedSquare from '../RoundedSquare.vue'

const { players } = inject(playerManager)

watch(players, (newValue, oldValue) => {
  console.log('SCORES CHANGED', newValue, oldValue)
})

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: 'black'
  },
  gameName: {
    type: String,
    required: false,
    default: 'QuizzBattle'
  },
  users: {
    type: Array,
    required: false,
    default: []
  }
})
</script>

<style scoped>
.player-band {
  background-color: violet;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

h2 {
  color: white;
}
</style>
