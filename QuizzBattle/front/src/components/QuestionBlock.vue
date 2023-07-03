<template>
  <RoundedSquare @click="submitAnswer" :color='isReveal ? colorBg : "white"'>
    <h3>{{ answer }}</h3>
  </RoundedSquare>
</template>

<script setup>
import { ref } from 'vue';
import RoundedSquare from './RoundedSquare.vue';


const props = defineProps({
  answer: {
    required: true,
    type: String,
  },
  isCorrect: {
    required: true,
    type: Boolean,
  },
  isReveal : {
    required: false,
    type: Boolean,
  }
});

// get my props 
console.log(props);


const colorBg = props.isCorrect ? "green" : "red";


</script>

<style>
h3 {
  color: black;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
