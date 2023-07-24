<template>
  <RoundedSquare @click="submitAnswer" :color="questionBlockBackgroundColors" :style="{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    justifyContent: 'center'
  }">
    <h3>{{ answer }}</h3>
    <div v-if="isReveal && isCorrect" class=" ">
      <span class="text-white material-icons material-icons-outlined">
        check_circle
      </span>
    </div>
  </RoundedSquare>
</template>

<script setup>
import RoundedSquare from './RoundedSquare.vue';
import { reactive, ref, onMounted, watch, inject, computed } from 'vue'

const theme = inject("theme")
const colorVars = [theme.colors.blue, theme.colors.green, theme.colors.orange, theme.colors.red]

const props = defineProps({
  answer: {
    required: true,
    type: String,
  },
  isCorrect: {
    required: true,
    type: Boolean,
  },
  isReveal: {
    required: false,
    type: Boolean,
  },
  correctAnswer: {
    required: true,
    type: String,
  },
  backgroundColor: {
    required: false,
    type: String,
  },
  index: {
    required: false,
    type: Number,
  },
  }
);

const questionBlockBackgroundColors = computed(() => {
    if (props.isReveal) {
      return props.isCorrect ? theme.colors.green : theme.colors.red;
    } else {
      const indexColor = colorVars[props.index] || 'white';
      return indexColor;
    }
  });
const submitAnswer = () => {
  console.log("submitAnswer");
};

</script>

<style>
h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.correct-answer {
  color: green;
}
</style>
