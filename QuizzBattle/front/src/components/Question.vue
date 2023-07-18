<template >
<div class="flex flex-col h-screen">
<div class="w-full bg-purple-500 player-band">
   <div class="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden">
  <img src="https://picsum.photos/200" alt="Profil" class="w-full h-full object-cover" />
</div>

</div>

    <div class="question">
        <h2>{{ question }}</h2>
        <div class="answers">
        <button v-for="answer in answers" :key="answer" @click="submitAnswer(answer)">{{ answer }}</button>
        </div>
    </div>
    </div>
</template>
<script lang="ts">

export default {
      props: {
    question: {
      type: String,
      required: true,
    },
      }
}
</script>
<style scoped>

    .question {
        background-color: #fff;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
        color: black;
        margin-top: 20%;
    }

    .player-band{
        background-color: violet;
        border-radius: 0.5rem;
        padding: 1rem;
       
    }
</style>