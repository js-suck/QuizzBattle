<template>
  <div class="emote-wrapper">
    <div class="text-white flex flex-col">
      <div :class="['emotes', { 'emotes-open': isOpen, 'emotes-right': direction === 'right' }]">
        <div v-for="(emote, index) in emotes.value" :key="index" class="emote">
          <img
            :id="emote.name"
            :src="`${FILE_PATHS.emotes}${emote.src}`"
            alt="Adrien le bg"
            :class="['rounded-full object-cover', { isOpen: OpenedEmote === emote.name }]"
            @click="handleOpenEmote(emote.src)"
          />
        </div>
      </div>
    </div>
    <div class="emotes-stick">
      <v-btn @click="handleOpen" class="emotes-btn" icon="mdi-emoticon-wink-outline"> </v-btn>
    </div>
  </div>
  <div :class="['opened-emote', { isOpen: OpenedEmote !== null }]">
    <img
      :src="`${FILE_PATHS.emotes}${OpenedEmote}`"
      alt="Adrien le bg"
      :class="['rounded-full object-cover w-96 ', { isOpen: true }]"
    />
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import { questionManager } from '@/contexts/quizzKeys'

import socket from '../config/socket'
import { API_URL } from '../constants'
import { FILE_PATHS } from '../constants/files'
import { userManagerKey } from '../contexts/userManagerKeys'
import client from '../helpers/client'

const { category } = inject(questionManager)
const route = useRoute()
const roomId = route.params.id

const { user } = inject(userManagerKey)

const isOpen = ref(false)
const OpenedEmote = ref(null)

const emotes = reactive([])
onMounted(async () => {
  try {
    const response = await client.get(`${API_URL}/api/emotes/${user.value.id}`)
    emotes.value = response.data.emotes.map((emote) => {
      if (response.data?.userEmotes.includes(emote.id)) {
        return {
          ...emote,
          isOwned: true
        }
      }
      return {
        ...emote,
        isOwned: false
      }
    })
    console.log(emotes.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des badges :', error)
  }
})

const handleOpen = () => {
  isOpen.value = !isOpen.value
}

const handleOpenEmote = (src) => {
  OpenedEmote.value = src
  isOpen.value = !isOpen.value

  socket.emit('send emote', { user, room: roomId, categoryName: category.value, emoteSrc: src })

  // Définir une minuterie pour fermer l'émote après 3 secondes (3000 millisecondes)
  setTimeout(() => {
    OpenedEmote.value = null
  }, 3000) // Changer la durée si nécessaire
}

socket.on('receive emote', ({ user, emoteSrc }) => {
  console.log({ user, emoteSrc })
  OpenedEmote.value = emoteSrc
  setTimeout(() => {
    OpenedEmote.value = null
  }, 3000)
})
</script>

<style scoped>
.emote-wrapper {
  display: flex;
  align-items: center;
}

.emotes-stick {
  top: -30%;
  left: 50%;
  margin: 1rem;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1.5rem;
  cursor: pointer;

  border-radius: 10em;
}

.emotes-btn {
  margin-bottom: 3em;
}

.emotes {
  /* Your existing styles */
  display: flex;
  align-items: center;
  width: 0;
  height: 0;
  gap: 0.5rem;
  margin-bottom: 3vw;
  top: 0;
  transform-origin: center;
  opacity: 0;
  overflow: hidden;
  transition: width 0.5s, height 0.5s, opacity 0.5s;
}

.emotes-right {
  transform: scaleX(-1) !important;
}
.emotes-open {
  /* Expanded size and opacity */
  width: 400px;
  height: 200px;
  opacity: 1;

  /* Circular layout using Flexbox */
}
@keyframes rotateThreeTimes {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(1080deg); /* 3 tours complets */
  }
}
.opened-emote {
  opacity: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s, opacity 0.5s;
}

.opened-emote.isOpen {
  animation: zoomInDown 1s, rotateThreeTimes 2s forwards; /* Applique l'animation de rotation et conserve la dernière transformation */
}

.isOpen {
  opacity: 1;
}

/* CSS for fade animations (optional, if you also want fade effects) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
