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
import UserManager from './contexts/UserManager.vue';
import QuizzProvider from './contexts/QuizzProvider.vue'
import ThemeProviderManager from './contexts/ThemeProvider.vue'
</script>
