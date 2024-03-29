<template>
  <div class="p-4 sm:ml-64 flex flex-col">
    <h2 class="text-2xl font-semibold mb-4">User Sheet</h2>
    <div class="container flex">
      <div class="card flex mr-4">
        <form class="my-4 w-full" @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="mb-6">
            <label for="lastname" class="block mb-2 font-medium text-gray-700">Lastname :</label>
            <input
              v-model.lazy="responseUser.lastname"
              type="text"
              id="lastname"
              name="lastname"
              class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="firstname" class="block mb-2 font-medium text-gray-700">Firstname :</label>
            <input
              v-model.lazy="responseUser.firstname"
              type="text"
              id="firstname"
              name="firstname"
              class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="email" class="block mb-2 font-medium text-gray-700">Email :</label>
            <input
              v-model.lazy="responseUser.email"
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
                  :src="`${API_URL}/uploads/${responseUser.image}`"
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
          <div class="mb-6">
            <label for="createdAt" class="block mb-2 font-medium text-gray-700"
              >Account created at :</label
            >
            <input
              v-model="responseUser.createdAt"
              type="email"
              id="email"
              name="email"
              disabled
              class="disabled mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
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
            <div class="mt-6">
              <button
                v-if="isUserVerified"
                type="button"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
                @click="toggleVerification(false)"
              >
                Delete
              </button>

              <button
                v-else
                type="button"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
                @click="toggleVerification(true)"
              >
                Active
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="card flex mr-4">
        <span>Match History In Coming</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'


import { API_URL } from '@/constants'

import client from '../helpers/client'

const responseUser = ref({})
const fileInputRef = ref(null)
const profilePicture = ref(null)
const beforeChange = ref(false)
const profilePictureSrc = ref('') // To store the profile picture URL

const props = defineProps({
  user: {
    required: true,
    type: String
  }
})

const isUserVerified = ref(false)

onMounted(() => {
  // Fetch the user data
  client
    .get(`${API_URL}/api/users/${props.user}`)
    .then((response) => {
      responseUser.value = response.data
      isUserVerified.value = response.data.isVerified
      console.log(responseUser.value)
    })
    .catch((error) => {
      console.error('Error while fetching user data:', error)
    })
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
const toggleVerification = (newVerificationStatus) => {
  client
    .put(`${API_URL}/api/users/editIsValidate/${props.user}`, { isVerified: newVerificationStatus })
    .then(() => {
      // Mettez à jour la variable de données pour refléter le nouvel état de vérification
      isUserVerified.value = newVerificationStatus
    })
    .catch((error) => {
      console.error('Error while updating user verification status:', error)
    })
}
async function submitForm() {
  try {
    const formData = new FormData()
    formData.append('lastname', responseUser.value.lastname)
    formData.append('firstname', responseUser.value.firstname)
    formData.append('email', responseUser.value.email)
    formData.append('profileImage', fileInputRef.value.files[0])
    if (fileInputRef.value.files[0]) {
      formData.append('image', fileInputRef.value.files[0].name)
    }
    const userUpdateResponse = await client.put(`${API_URL}/api/users/${props.user}`, formData)
    responseUser.value = userUpdateResponse.data
    console.log('Updated user data:', responseUser.value)
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
