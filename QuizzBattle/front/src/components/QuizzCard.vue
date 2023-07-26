<template>
    <v-card
      max-width="344"
      :style="
      {
        backgroundColor: color,
        color: white
      }
      "

    >
      <v-img
        :src="image"
        height="200px"
        cover
      ></v-img>
  
      <v-card-title>
       {{title}}
      </v-card-title>
  
      <v-card-subtitle>{{text  }} 
      </v-card-subtitle>
  
      <v-card-actions>
        <v-btn
          color="violet-lighten-2"
          variant="text"
        >
         Commencer le quizz !
        </v-btn>
  
        <v-spacer></v-spacer>
  
        <v-btn
          :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="show = !show"
        ></v-btn>
      </v-card-actions>
  
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
  
          <v-card-text :style="{
            color: 'white'
          }">
            {{ text }}
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </template>

  <script setup>
import { ref } from "vue"


const show = ref(false)

// props 
const props = defineProps({
 title : {
    type: String,
    default: "black"
 },
 text : {
    type: String,
    default: null
 },
    image : {
        type: String,
        required: true,
        default: ""
    },

color : {
    type: String,
    default: "white"
}
   
})

</script>