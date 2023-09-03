<template>
  <Navigation>
    <h1>Emotes</h1>
    <p>Achètes des emotes pour pouvoir faire rager ton adversaire en jeu!</p>
    <div class="emote-pay-wrapper">
      <div v-for="(emote, index) in emotes.value" :key="index" class="emote-pay">
        <img
          :id="emote.name"
          :src="`${FILE_PATHS.emotes}${emote.src}`"
          alt="Adrien le bg"
          class="rounded-full object-cover"
        />
        <v-btn
          :disabled="emote.isOwned"
          class="emotes-btn m-6"
          variant="outlined"
          @click="handlePayEmote(emote.id)"
        >
          <span v-if="!emote.isOwned">
            Pay

            {{ emote.price }} <v-icon>mdi-currency-eur</v-icon>
          </span>
          <span v-else> Owned </span>
        </v-btn>
      </div>
    </div>
  </Navigation>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue'

import Navigation from '@/components/Navigation.vue'

import { API_URL } from '../constants'
import FILE_PATHS from '../constants/files'
import { userManagerKey } from '../contexts/userManagerKeys'
import client from '../helpers/client'

const { user } = inject(userManagerKey)

const emotes = reactive([])
onMounted(async () => {
  try {
    const response = await client.get(`${API_URL}/api/emotes/${user.value.id}`,
    )

    console.log(response.data)

    emotes.value = response.data.emotes.map((emote) => {
      if (response.data?.userEmotes.includes(emote.id)) {
        return {
          ...emote,
          isOwned: true
        }
      }
      return {
        ...emote,
        isOwned: false
      }
    })
    console.log(emotes.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des badges :', error)
  }
})

const handlePayEmote = async (id) => {
  console.log(id)
  try {
    const response = await client.post(`${API_URL}/api/emotes/pay`,
      {
        emote_id: id,
        user_id: user.value.id
      })

    console.log(response)
    // redirect to response url

    //open on another window
    window.open(response.data.url, '_blank')
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.emote-pay-wrapper {
  display: flex;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
 max-width: 1638px;
}

.emote-pay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #8b5cf6;
  background-color: white;
  border-radius: 20px;
  padding: 10px;
  margin: 10px;
  width: 400px;
}

.emote-pay img {
  width: 200px;
  height: 200px;
}

.emotes-btn {
  margin-bottom: 3em;
  border: 1px solid #8b5cf6;
  color: #8b5cf6;
}
</style>
