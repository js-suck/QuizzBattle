<template>
  <div>
  <div class="flex items-center">
    <span class="material-icons material-symbols-outlined" @click="handleGoBackToDashboard()">
arrow_back
</span>
    <h1>Waiting for players</h1>
  
  </div>
  <div class="flex flex-col mt-10">

  <Card :name="categoryName" :image="'https://media.istockphoto.com/id/1316871808/fr/vectoriel/conception-de-fond-vectoriel-de-retour-%C3%A0-l%C3%A9cole-bienvenue-au-texte-de-retour-%C3%A0-l%C3%A9cole.jpg?s=612x612&w=0&k=20&c=CDKZm5C0bwH2IKXL8TzpRtmaWuF529wiU7PZiziQW1M='"/>
  <v-progress-circular class="spinner"
      :size="70"
      :width="7"
      indeterminate
      color="white"
    ></v-progress-circular>
  </div>
</div>
</template> 
<script setup>
import io from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '../constants/index';
import { inject, onMounted, ref } from 'vue';
import jwtDecode from 'jwt-decode';
import { playerManager } from '../contexts/quizzKeys';
import { useRoute } from 'vue-router';
import Card from "./../components/Card.vue"
const route = useRoute();
const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);
const categoryName = ref("")
const socket = io(API_URL);
const categoryId = route.params.categoryId;

const handleGoBackToDashboard = () => {
  window.location.href = "http://localhost:5173"
}

onMounted(() => {
    if(!user.value.roomID)
    {
      socket.emit('search a room', {user:user.value,
      category: categoryId
      });
    }

    socket.on("roomFound", (room) => {
    // redirect to url generated with the room name
    const url = `http://localhost:5173/game/${room.id}`
    window.location.href = url;
    })

    axios.get(`${API_URL}/api/category/${categoryId}`)
    .then((response) => {
      console.log(response.data)
      categoryName.value = response.data.name;
    })
})
</script>

<style scoped>
div {
  color: white;

}
div.waiting-wrapper {
  display: flex;
  align-items: center;
}


span {
  color: white;
  font-size: 2rem;
  margin-right: 0.5rem;
}

h1 {
  color: white;
}

.spinner {
  position: absolute;
  bottom: 20px;
  
  left: 50%;
  transform: translateX(-50%);

}
</style>