<template><div></div></template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { API_URL } from '../constants'
import client from '../helpers/client'

onMounted(async () => {
  // recuperer session_id de l'url
  const urlParams = new URLSearchParams(window.location.search)
  const sessionId = urlParams.get('session_id')
  const user_id = urlParams.get('user_id')
  const emote_id = urlParams.get('emote_id')
  console.log(sessionId, urlParams)
  const router = useRouter()

  try {
    const response = await client.get(`${API_URL}/api/emotes/pay/success?session_id=${sessionId}&user_id=${user_id}&emote_id=${emote_id}`)

   if(response.data.success) {
        router.push('/emotes')
   }
    window.open(response.data.url, '_blank')
  } catch (error) {
    console.error(error)
  }
})
</script>

<style></style>
