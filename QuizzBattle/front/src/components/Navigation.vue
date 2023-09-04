<template>
  <v-card dark>
    <v-layout
      :style="{
        padding: ' 0 2em',
        minHeight: '100vh'
      }"
    >
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list-item
          v-if="user"
          :prepend-avatar="`${API_URL}/uploads/${user.image}`"
          :title="`${user.firstname}  ${user.lastname}`"
          nav
        >
          <template v-slot:append>
            <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            to="/history"
            prepend-icon="mdi-history"
            title="Game history"
            value="history"
          ></v-list-item>
          <v-list-item
            to="/user_profile"
            prepend-icon="mdi-account-outline"
            title="Profile"
            value="account"
          ></v-list-item>
          <v-list-item
            to="/scoreboard"
            prepend-icon="mdi-trophy-variant-outline"
            title="Leaderboard"
            value="classement"
          ></v-list-item>
          <v-list-item
            to="/"
            prepend-icon="mdi-home-variant-outline"
            title="dashboard"
            value="dashboard"
          ></v-list-item>
          <v-list-item
            to="/emotes"
            prepend-icon="mdi-emoticon-wink-outline"
            title="Emotes"
            value="emotes"
          ></v-list-item>
          <v-list-item
            :to="`/user/stats/${user?.id}`"
            prepend-icon="mdi-file-chart-outline"
            title="stats"
            value="stats"
          ></v-list-item>
          <v-list-item
            :to="`/badges`"
            prepend-icon="mdi-shield-star-outline"
            title="badges"
            value="badges"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            value="logout"
            @click="logout"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
import { inject, ref } from 'vue'

import { useRouter } from 'vue-router'

import { API_URL } from '../constants'
import { userManagerKey } from '../contexts/userManagerKeys'

const { user } = inject(userManagerKey)
const drawer = ref(true)
const rail = ref(true)

const router = useRouter()
const logout = () => {
  // Clear the JWT token from local storage
  localStorage.removeItem('token')

  console.log('User logged out')

  router.push('/login')
}
</script>
