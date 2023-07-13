<template>
  <router-view/>
</template>

<script setup>
import { ref } from 'vue';

import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

import io from 'socket.io-client';
import { API_URL } from './constants/index';
const socket = io(API_URL);

console.log("LOG SOCKET")
socket.emit('userJoin', user);



</script>
