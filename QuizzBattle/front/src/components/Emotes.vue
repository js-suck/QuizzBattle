<template>
    <div class="emote-wrapper">
      <div class="text-white flex flex-col">
      
        <div :class="['emotes', { 'emotes-open': isOpen, 'emotes-right': direction === 'right' }]">
          <div v-for="(emote, index) in EMOTES" :key="index" class="emote">
            <img :id="emote.name" :src="emote.src" alt="Adrien le bg" :class="['rounded-full object-cover', {'isOpen': OpenedEmote === emote.name }]" @click="handleOpenEmote(emote.src)">
          </div>
        </div>
      </div>
      <div class="emotes-stick">
          <v-btn @click="handleOpen" class="emotes-btn"  icon="mdi-emoticon-wink-outline">
          </v-btn>
        </div>
    </div>
    <div :class="['opened-emote', {'isOpen': OpenedEmote !== null }]">
        <img id="" :src="OpenedEmote" alt="Adrien le bg" :class="['rounded-full object-cover w-48 ', {'isOpen': true }]">
    </div>
  </template>
  
  <script setup>
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

import socket from '../config/socket'
import { FILE_PATHS } from '../constants/files'
import { userManagerKey } from '../contexts/userManagerKeys'
const route = useRoute();  
const roomId = route.params.id;

const {user} = inject(userManagerKey)

const props = defineProps({
  direction:  {
    type: String,
    default: "right"
 }
})

const EMOTES = ref([
    {
      name: 'Adrien',
      src: `${FILE_PATHS.emotes}Adrien-Morin_png.png`
    },
    {
      name: 'Karl',
      src: `${FILE_PATHS.emotes}karl.png`
    }
  ])
  
  const isOpen = ref(false)
  const OpenedEmote = ref(null)
  
  const handleOpen = () => {
    isOpen.value = !isOpen.value
  }

    const handleOpenEmote = (src) => {
      OpenedEmote.value = src
      isOpen.value = !isOpen.value


      //send event
      socket.emit("send emote", {user, room: roomId, category, emoteSrc})

      // open for 5 secondes and set to null
      setTimeout(() => {
        OpenedEmote.value = null
      }, 1500)
    }

  
</script>
  
  <style scoped>
  .emote-wrapper {
    display: flex;
    align-items: center;
  }
  
  .emotes-stick {
    top: -10%;
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

 
  .opened-emote {
    opacity: 0;
    position: absolute;
    top: 10%;
    left: 10%;
    transition: width 0.5s, height 0.5s, opacity 0.5s;
    
  }

  .opened-emote.isOpen {

    animation: zoomInDown; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
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
  