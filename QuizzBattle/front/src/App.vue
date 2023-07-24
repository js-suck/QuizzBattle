<template>
  <ThemeProviderManager>
  <UserManager>
    <QuizzProvider>
    <router-view/>
    </QuizzProvider>
  </UserManager>
</ThemeProviderManager>
</template>

<script setup>
import { ref } from 'vue';
import UserManager from './contexts/UserManager.vue';
import QuizzProvider from './contexts/QuizzProvider.vue'
import ThemeProviderManager from './contexts/ThemeProvider.vue'

import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

import io from 'socket.io-client';
import { API_URL } from './constants/index';
const socket = io(API_URL);


// check if socket is deconnected
socket.on('disconnect', () => {
  console.log('Disconnected from socket');
});

socket.on("userConnected", () => {
  console.log("new user connected")
})

</script>
