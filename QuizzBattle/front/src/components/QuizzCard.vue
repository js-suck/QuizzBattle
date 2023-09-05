<template>
    <v-card
    class="card"
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
  
        <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            icon="mdi-trophy-variant-outline"/>
        </template>
        <template v-slot:default="">
          <v-card>
            <RankingTable :categoryId="categoryId"/>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
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
import {
  inject,
  ref
} from 'vue'

import RankingTable from '../components/RankingTable.vue'

const theme = inject("theme")
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
},
categoryId : {
  type: Number, 
  default: 0,
  required: true
}
   
})

</script>

<style scoped>

.card {
  border: 1px solid #ffffff22;
  background: linear-gradient(0deg, rgb(219, 225, 236) 0%, rgba(146, 22, 255, 0.5) 100%);
  box-shadow: 0px 2px 13px 0px #cdc2d188;
   border-radius: .7rem;
  backdrop-filter: blur(-20px);
  -webkit-backdrop-filter: blur(7px);
  overflow: hidden;
  transition: .5s all;
}



</style>