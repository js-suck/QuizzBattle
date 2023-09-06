<template>
  <div class="p-4 flex flex-col">
    <h2 class="text-2xl font-semibold mb-4">My profile</h2>
    <div class="container flex">
      <form class="my-4 w-full flex" @submit.prevent="submitForm" enctype="multipart/form-data">
        <!-- Profile picture card -->
        <div>
          <div class="relative w-64 h-64">
            <img
              v-if="!beforeChange"
              :src="`${API_URL}/uploads/${user.image}`"
              alt="Profile Picture"
              id="profile-picture-img"
              class="w-full h-full object-cover rounded-full border-xl"
              ref="profilePicture"
            />
            <img
              v-else
              v-bind:src="profilePictureSrc"
              alt="Profile Picture"
              id="profile-picture-img"
              class="w-full h-full object-cover rounded-full"
              ref="profilePicture"
            />
            <!-- Icône d'appareil photo en position absolue -->
            <label
              for="profilePictures"
              class="absolute bottom-0 right-5 fake-button cursor-pointer bg-purple-500"
            >
              <i class="material-icons text-white">photo_camera</i>
            </label>
          </div>
          <input
            type="file"
            id="profilePictures"
            name="profilePictures"
            class="hidden-input"
            accept="image/*"
            multiple
            @change="changeProfilePicture"
            ref="fileInputRef"
          />
        </div>
        <div class="flex flex-col w-full m-5 ml-10">
          <div class="mb-6">
            <label for="lastname" class="block mb-2 font-medium text-gray-700">Lastname :</label>
            <input
              v-model.lazy="formDataUser.lastname"
              type="text"
              id="lastname"
              name="lastname"
              class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="firstname" class="block mb-2 font-medium text-gray-700">Firstname :</label>
            <input
              v-model.lazy="formDataUser.firstname"
              type="text"
              id="firstname"
              name="firstname"
              class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="email" class="block mb-2 font-medium text-gray-700">Email :</label>
            <input
              v-model.lazy="formDataUser.email"
              type="email"
              id="email"
              name="email"
              disabled
              class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 bg-gray-200"
            />
          </div>

          <div class="flex flex-row justify-between">
            <div class="mt-6">
              <v-btn type="submit" color="purple" variant="tonal" border="puprle">
                Register
              </v-btn>
            </div>
          </div>
        </div>
      </form>
    </div>
    <v-snackbar v-model="notifOpen" :timeout="2000" class="testing">
      {{ notifText }}

      <template v-slot:actions>
        <v-btn color="green" variant="text" @click="notifOpen = false"> X </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script setup>
import { inject, onMounted, ref } from 'vue'

import { API_URL } from '@/constants'
import { userManagerKey } from '@/contexts/userManagerKeys'
import client from '@/helpers/client'

const notifOpen = ref(false)
const notifText = 'Your profile is successfully updated !'

const { user, refreshUserData } = inject(userManagerKey)
const formDataUser = ref({
  lastname: '',
  firstname: '',
  email: '',
  createdAt: '',
  image: '' // Make sure you have this property in your formDataUser object
})

const beforeChange = ref(false)
const profilePictureSrc = ref('') // To store the profile picture URL
const fileInputRef = ref(null)
const profilePicture = ref(null)
onMounted(() => {
  // Fetch the user data
  getUserDataFromToken()
})

const changeProfilePicture = (event) => {
  const fileInput = event.target
  const files = fileInput.files
  if (!files || files.length === 0) {
    console.log('No file selected.')
    return
  }
  const file = files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target && e.target.result) {
      profilePictureSrc.value = e.target.result.toString()
    }
  }
  reader.readAsDataURL(file)
  beforeChange.value = true
}

const getUserDataFromToken = () => {
  const token = localStorage.getItem('token')

  if (token) {
    const tokenParts = token.split('.')
    if (tokenParts.length === 3) {
      const encodedPayload = tokenParts[1]
      const decodedPayload = atob(encodedPayload)
      const userData = JSON.parse(decodedPayload)
      console.log('User data from JWT token:', userData)
      formDataUser.value.id = userData.id
    }
    client
      .get(`${API_URL}/api/users/${formDataUser.value.id}`)
      .then((response) => {
        formDataUser.value = response.data
        console.log(formDataUser.value)
      })
      .catch((error) => {
        console.error('Error while fetching user data:', error)
      })
  } else {
    console.log('No JWT token found in local storage.')
  }
}

const submitForm = async () => {
  try {
    // console.log('toto', fileInputRef.value.files[0], fileInputRef.value.files[0].name)
    const formData = new FormData()
    formData.append('lastname', formDataUser.value.lastname)
    formData.append('firstname', formDataUser.value.firstname)
    formData.append('description', formDataUser.value.lastname)
    formData.append('email', formDataUser.value.email)
    if (fileInputRef.value.files[0]) {
      formData.append('profileImage', fileInputRef.value.files[0])
      formData.append('image', fileInputRef.value.files[0].name)
    }
    const userUpdateResponse = await client.put(
      `${API_URL}/api/users/${formDataUser.value.id}`,
      formData
    )
    formDataUser.value = userUpdateResponse.data

    console.log('Updated user data:', formDataUser.value)
    notifOpen.value = true
    refreshUserData()
  } catch (error) {
    notifText.value = 'Something went wrong'
    notifOpen.value = true

    console.error('Error while updating user data:', error)
  }
}
</script>
<style>
.hidden-input {
  position: absolute;
  left: -9999px;
}

.fake-button {
  padding: 8px 12px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  border-radius: 2000px;
}
</style>
