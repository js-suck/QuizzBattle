<template>
    <div class="p-4 sm:ml-64 flex">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Lastname
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Firstname
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Created At
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Updated At
                    </th>
                    <th scope="col" class="px-6 py-3">
                       Action
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" class="bg-white border-b hover:bg-gray-50">
                    <th v-if="user.lastname" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {{ user.lastname }}
                    </th>
                    <th v-else scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        -
                    </th>
                    <th v-if="user.firstname" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {{ user.firstname }}
                    </th>
                    <th v-else scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        -
                    </th>
                    <td v-if="user.email" class="px-6 py-4">
                        {{ user.email }}
                    </td>
                    <th v-else scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        -
                    </th>
                    <td v-if="user.createdAt" class="px-6 py-4">
                        {{ user.createdAt }}
                    </td>
                    <th v-else scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        -
                    </th>
                    <td v-if="user.updatedAt" class="px-6 py-4">
                        {{ user.updatedAt }}
                    </td>
                    <th v-else scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        -
                    </th>
                    <td class="px-6 py-4 text-right">
                        <router-link :to="`/admin/user/${user.id}/show`" class="font-medium text-blue-600 hover:underline">
                            Visualiser
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>

            <!-- Dynamic pagination -->
            <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
                <span class="px-6 py-4 text-sm font-normal text-gray-500">
                Showing <span class="font-semibold text-gray-900">{{ startIndex }}</span>-
                <span class="font-semibold text-gray-900">{{ endIndex }}</span> of
                <span class="font-semibold text-gray-900">{{ usersList.length }}</span> users
                </span>
                <ul class="px-6 py-4 inline-flex -space-x-px text-sm">
                    <li>
                        <a href="#" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700" @click="goToPage(1)">First</a>
                    </li>
                    <template v-for="pageNumber in visiblePages">
                        <li v-if="pageNumber === currentPage">
                            <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">{{ pageNumber }}</a>
                        </li>
                        <li v-else>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700" @click="goToPage(pageNumber)">{{ pageNumber }}</a>
                        </li>
                    </template>
                    <li>
                        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700" @click="goToPage(pageCount)">Last ({{ pageCount }})</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref , computed} from 'vue';
import {API_URL} from '../constants';
const usersList = ref([]); // Reactive ref to hold the user data

onMounted(() => {
    axios.get(`${API_URL}/api/users`)
        .then((response) => {
            usersList.value = response.data;
            console.log('userlist :',usersList,usersList.value)
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des quiz', error);
        });
});

/*const users = [
    { id: 1, name: "RULHMAN VIVIAN", email: "vivian@gmail.com", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 2, name: "RAMIS Lucas", email: "lucas@gmail.com", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 3, name: "Laïla Anthoine1", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 4, name: "Laïla Anthoine2", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 5, name: "Laïla Anthoine3", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 6, name: "Laïla Anthoine4", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 7, name: "Laïla Anthoine5", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 8, name: "Laïla Anthoine6", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 9, name: "Laïla Anthoine7", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 10, name: "Laïla Anthoine8", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 11, name: "Laïla Anthoine9", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 12, name: "Laïla Anthoine10", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 13, name: "Laïla Anthoine11", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },    { id: 3, name: "Laïla Anthoine1", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 14, name: "Laïla Anthoine2", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 5, name: "Laïla Anthoine3", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 6, name: "Laïla Anthoine4", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 7, name: "Laïla Anthoine5", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 8, name: "Laïla Anthoine6", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 9, name: "Laïla Anthoine7", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 10, name: "Laïla Anthoine8", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 11, name: "Laïla Anthoine9", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 12, name: "Laïla Anthoine10", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 13, name: "Laïla Anthoine11", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },    { id: 3, name: "Laïla Anthoine1", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 4, name: "Laïla Anthoine2", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 5, name: "Laïla Anthoine3", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 6, name: "Laïla Anthoine4", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 7, name: "Laïla Anthoine5", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 8, name: "Laïla Anthoine6", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 9, name: "Laïla Anthoine7", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 10, name: "Laïla Anthoine8", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 11, name: "Laïla Anthoine9", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 12, name: "Laïla Anthoine10", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
    { id: 13, name: "Laïla Anthoine11", email: "Black", created_at: "10/07/2023 13:43", last_connection: "10/07/2023 13:43" },
];*/

const currentPage = ref(1);

const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * 10;
    const endIndex = startIndex + 10;
    return usersList.value.slice(startIndex, endIndex);
});

const itemsPerPage = 10;

const pageCount = computed(() => Math.ceil(usersList.value.length / itemsPerPage));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, usersList.value.length));

// Compute visible pages (current page and two pages before and after it)
const visiblePages = computed(() => {
    const pagesBefore = Math.max(currentPage.value - 2, 1);
    const pagesAfter = Math.min(currentPage.value + 2, pageCount.value);
    const visiblePageNumbers = [];
    for (let i = pagesBefore; i <= pagesAfter; i++) {
        visiblePageNumbers.push(i);
    }
    return visiblePageNumbers;
});

// Function to handle page change event
function goToPage(pageNumber) {
    currentPage.value = pageNumber;
}
</script>
