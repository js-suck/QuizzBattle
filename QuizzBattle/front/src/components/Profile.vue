<template>
  <div class="p-4 sm:ml-64 flex flex-col">
    <h2 class="text-2xl font-semibold mb-4">User Info</h2>
    <div class="container flex">
      <form class="my-4 w-full" @submit.prevent="submitForm" enctype="multipart/form-data">
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
            class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
        </div>
        <!-- Profile picture card -->
        <div class="mb-6">
          <label class="block mb-2 font-medium text-gray-700">Profile Picture:</label>
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full overflow-hidden">
              <img
                v-if="!beforeChange"
                :src="`${API_URL}/uploads/${user.image}`"
                alt="Profile Picture"
                id="profile-picture-img"
                class="w-full h-full object-cover"
                ref="profilePicture"
              />
              <img
                v-else
                v-bind:src="profilePictureSrc"
                alt="Profile Picture"
                id="profile-picture-img"
                class="w-full h-full object-cover"
                ref="profilePicture"
              />
              <input
                type="file"
                id="profilePictures"
                name="profilePictures"
                class="ml-4 hidden-input"
                accept="image/*"
                multiple
                @change="changeProfilePicture"
                ref="fileInputRef"
              />
            </div>
            <!-- Fake button to replace the file input -->
            <label for="profilePictures" class="ml-4 fake-button">Change Picture</label>
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="mt-6">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { defineProps, inject, onMounted, ref } from 'vue'

import { API_URL } from '@/constants'
import { userManagerKey } from '@/contexts/userManagerKeys'
import client from '@/helpers/client'

const { user } = inject(userManagerKey)
const formDataUser = ref({
  lastname: '',
  firstname: '',
  email: '',
  createdAt: '',
  image: '' // Make sure you have this property in your formDataUser object
})
defineProps({
  user: {
    required: true,
    type: String
  }
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
      .get(`${API_URL}/api/users/show/${formDataUser.value.id}`)
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
      `${API_URL}/api/users/edit/${formDataUser.value.id}`,
      formData
    )
    formDataUser.value = userUpdateResponse.data

    console.log('Updated user data:', formDataUser.value)
  } catch (error) {
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
  background-color: #ccc;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  border-radius: 4px;
}
</style>
