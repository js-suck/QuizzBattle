<template>
  <router-view/>
</template>

<script setup>
import { ref } from 'vue';

import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);
console.log(user.value)



</script>
