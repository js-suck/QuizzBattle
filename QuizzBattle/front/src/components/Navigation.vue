<template>
    <v-card dark>
    <v-layout :style="{
        padding:' 0 2em',
        minHeight: '100vh'
    }">
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
        v-if="user"
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="`${user.firstname}  ${user.lastname}`"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Historique de parties" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="Mon profil" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main >
    <slot></slot>
    </v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
import { inject, ref } from 'vue'

import { theme } from '../constants/theme'
import { userManagerKey } from '../contexts/userManagerKeys'
const {user} = inject(userManagerKey)
const drawer = ref(true)
        const rail = ref(true)

</script>
