<template>
    <div class="p-4 sm:ml-64 flex flex-col">
        <h2 class="text-2xl font-semibold mb-4">User Sheet</h2>
        <div class="container flex">
            <div class="card flex mr-4">
                <form class="ml-4" @submit.prevent="submitForm">
                    <div class="mb-6">
                        <label for="lastname" class="block mb-2 font-medium text-gray-700">Lastname :</label>
                        <input v-model="responseUser.lastname" type="text" id="lastname" name="lastname" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <div class="mb-6">
                        <label for="firstname" class="block mb-2 font-medium text-gray-700">Firstname :</label>
                        <input v-model="responseUser.firstname" type="text" id="firstname" name="firstname" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <div class="mb-6">
                        <label for="email" class="block mb-2 font-medium text-gray-700">Email :</label>
                        <input v-model="responseUser.email" type="email" id="email" name="email" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <div class="mb-6">
                        <label for="createdAt" class="block mb-2 font-medium text-gray-700">Account created at :</label>
                        <input v-model="responseUser.createdAt" type="email" id="email" name="email" disabled class="disabled mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <div class="mt-6">
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Register</button>
                    </div>
                </form>
            </div>
            <div class="card flex mr-4">
                <span>Match History In Coming</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps, ref} from 'vue';
import axios from "axios";
import { API_URL } from "@/constants";

const responseUser = ref([]);
const props = defineProps({
    user: {
        required: true,
        type: String,
    },
});
console.log('props:', props)

onMounted(() => {
    axios.get(`${API_URL}/api/users/show/${props.user}`)
        .then((response) => {
            responseUser.value = response.data;
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des quiz', error);
        });
});
async function submitForm() {
    try {
        // Perform your registration logic here
        //console.log('Registering user:', user.value);

        // Send the modified user data to the server
        console.log('before', responseUser.value)
        const response = await axios.put(`${API_URL}/api/users/edit/${props.user}`, responseUser.value);
        responseUser.value = response.data;

        console.log('Response:', responseUser.value);
        // Optionally, you can perform additional actions based on the response from the server
    } catch (error) {
        console.error('Error while updating user data:', error);
    }
}
</script>

<style>
/* Add any custom styles here if needed */
</style>
