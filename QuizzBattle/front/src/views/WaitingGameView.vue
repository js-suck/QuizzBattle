<template>
  <div>
  <div class="flex items-center">
    <span class="material-icons material-symbols-outlined" @click="handleGoBackToDashboard()">
arrow_back
</span>
    <h1>Waiting for players</h1>
  
  </div>
  <div class="flex flex-col mt-10">

  <Card v-if="category" :name="category.name" :image="`${FILE_PATHS.categoryPictures}${category.image_url}`"/>
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
import {
  inject,
  onMounted,
  ref
} from 'vue'
import socket from "./../config/socket"

import { useRoute } from 'vue-router'
import client from './../helpers/client'
import Card from '../components/Card.vue'
import { API_URL } from '../constants/index'
import { FILE_PATHS } from '../constants/files'
import { userManagerKey } from '@/contexts/userManagerKeys';

const route = useRoute();
const category = ref("")
const categoryId = route.params.categoryId;
const {user} = inject(userManagerKey)

const handleGoBackToDashboard = () => {
  window.location.href = "/"
}

onMounted(() => {
    if(!user.value.roomID)
    {
      socket.emit('search a room', {
        user:user.value,
      category: categoryId
      });
    }

    socket.on("roomFound", (room) => {
    // redirect to url generated with the room name
    const url = `/game/${categoryId}/${room.id}`
    window.location.href = url;
    })

    client.get(`${API_URL}/api/category/${categoryId}/label`)
    .then((response) => {
      console.log(response.data)
      category.value = response.data;
    }).catch(e =>{
      console.error(e)
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