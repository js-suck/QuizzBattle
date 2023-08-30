<script setup>
import {
  onMounted,
  provide,
  reactive,
  ref
} from 'vue'

import jwtDecode from 'jwt-decode'
import io from 'socket.io-client'

import { API_URL } from '../constants'
import client from '../helpers/client.js'
import {
  userManagerIsLoadingKey,
  userManagerKey,
  userManagerUsersKey
} from './userManagerKeys.js'

const users = reactive({});
const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);
const isLoading = ref(false);


async function loginUser(_user) {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(_user)
    });

    if (response.status !== 200) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.json();
      const token = data.token;
      user.value = jwtDecode(token);
      localStorage.setItem('token', token);
      return data;
    }
  } catch (error) {

    console.error('Erreur lors de la requête fetch :', error);
    return { message: 'Une erreur s\'est produite lors de la connexion.' };
  }
}

const refreshUserData = () => {

  // check if we have a token
  if(token) {
    client.get(`${API_URL}/api/users/${user.value?.id}`)
        .then((response) => {
            user.value = {
              ...user.value,
              ...response.data
            }
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des quiz', error);
        });
  }


}


function addUser(user) {
  let hasError = false;
  return fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((response) => {
      if (response.status === 422) {
        hasError = true;
      }
      return response.json();
    })
    .then((data) => {
      if (hasError) {
        return Promise.reject(data);
      } else {
        users.push(data);
      }
    });
}

function editUser(user) {
  let hasError = false;
  return fetch(`${API_URL}/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((response) => {
      if (response.status === 422) {
        hasError = true;
      }
      return response.json();
    })
    .then((data) => {
      if (hasError) {
        return Promise.reject(data);
      } else {
        users.push(data);
      }
    });
}

onMounted(() => {
  
refreshUserData()

});

function fetchUsers() {
  fetch(`${API_URL}/api/users`)
    .then((response) => response.json())
    .then((data) => {
      users.push(...data);
      isLoading.value = false;
    })
    .catch((error) => {
      alert(error.message);
      isLoading.value = false;
    });
}

function deleteUser(user) {
  fetch(`${API_URL}/api/users/${user.id}`, {
    method: 'DELETE'
  }).then((response) => {
    if (response.status === 204) users.splice(users.indexOf(user), 1);
    else {
      alert('An error occured');
    }
  });
}

provide(userManagerKey, {
  addUser,
  editUser,
  deleteUser,
  fetchUsers, 
  loginUser,
  user
});

provide(userManagerUsersKey, users);
provide(userManagerIsLoadingKey, isLoading);
</script>

<template>
  <template v-if="!isLoading">
    <slot></slot>
  </template>
  <p v-else>Loading....</p>
</template>

<style scoped>
li {
  color: red;
}
</style>