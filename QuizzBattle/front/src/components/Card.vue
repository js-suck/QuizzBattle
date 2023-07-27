<template>
  
  <div class="d-flex flex-col items-center justify-center p-5 rounded-xl" :style="{
    backgroundColor: color
  }">
    <div class="flex items-center justify-center  w-10/12 h-56 overflow-hidden">
      <img v-if="image !== null" :src="image" alt="Profil" class="w-full h-full object-cover rounded-xl" />
    </div>
    <h2 class="mt-1">{{ name }}</h2>
    <hr class="w-100 bg-slate-100">
    {{ description }}
  </div>

</template>
<script setup>

// props 
const props = defineProps({
 color : {
    type: String,
    default: "black"
 },
 image : {
    type: String,
    default: null
 },
    name : {
        type: String,
        required: true,
        default: ""
    },
    description: {
        type: String,
        required: true,
        default: ""
    }
})

</script>

<style scoped>

hr {
    height: 1px;
    border: 0;
    background-color: #606163;
    margin: 0.25rem 0;
}

</style>