<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.css" rel="stylesheet" />

<template>
    <Navigation>
    <h1>Scoreboard</h1>
    <div class="p-4 sm:ml-64 flex">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
            <div class="flex items-center justify-center">

                <v-select
                v_if="categories"
                v-model="selectedCategory"
                label="Select"
                :items="categories"
                item-title="name"
                item-value="id"
                variant="outlined"
                ></v-select>
                <v-btn
                    class="ma-2"
                    @click="resetSelectedCategory"
                >
                    <v-icon
                    start
                    icon="mdi-minus-circle"
                    ></v-icon>
                    Réinitialiser
                </v-btn>
            </div>
        <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3">
                           
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Position
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nickname
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Score
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Games Played
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Average score
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(player) in paginatedPlayers" :key="player.id" class="bg-white border-b hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <img :src="`${API_URL}/uploads/${player.userProfilePicture}`" class="h-8 w-8 rounded-full cursor-pointer" @click="openUserModal(player.id)" alt="User Image">
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ player.position }}</td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ player.nickname }}</td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ player.score }}</td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ player.gamesPlayed }}</td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ calculateAverageScore(player) }}</td>
               
                </tr>
            </tbody>
        </table>
            <!-- Dynamic pagination -->
            <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
                <span class="px-6 py-4 text-sm font-normal text-gray-500">
                Showing <span class="font-semibold text-gray-900">{{ startIndex }}</span>-
                <span class="font-semibold text-gray-900">{{ endIndex }}</span> of
                <span class="font-semibold text-gray-900">{{ players.length }}</span> players
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
</Navigation>
</template>

<script setup>
import 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js'

import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'

import Navigation from '@/components/Navigation.vue'
import client from '@/helpers/client'

import { API_URL } from '../constants'

const players = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);

onMounted(() => {
        client
        .get(`${API_URL}/api/scoreboard`)
        .then((response) => {
        players.value = response.data
        })
        .catch((error) => {
        console.error('Erreur lors de la récupération des scores', error)
        });

        client.get(`${API_URL}/api/category`).then((response) => {
        categories.value = response.data;
        });


    });

    watch(selectedCategory, async (newValue) => {
        if (newValue === null) {
            client.get(`${API_URL}/api/scoreboard`).then((response) => {
                players.value = response.data;
            });
        } else {
            client.get(`${API_URL}/api/scoreboard/${newValue}`).then((response) => {
                players.value = response.data;
            });
        }
    });

    const resetSelectedCategory = () => {
        selectedCategory.value = null;
    };

    const rankedPlayers = computed(() => {
        return players.value.slice().sort((a, b) => b.score - a.score);
        });

        const calculateAverageScore = (player) => {
        if (player.gamesPlayed === 0) {
            return 0;
        } else {
            return (player.score / player.gamesPlayed).toFixed(2);
        }
        };
    const currentPage = ref(1);

    const paginatedPlayers = computed(() => {
        const startIndex = (currentPage.value - 1) * 10;
        const endIndex = startIndex + 10;
        return rankedPlayers.value.slice(startIndex, endIndex);
    });

    const itemsPerPage = 10;

    const pageCount = computed(() => Math.ceil(rankedPlayers.value.length / itemsPerPage));

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, rankedPlayers.value.length));

    const visiblePages = computed(() => {
        const pagesBefore = Math.max(currentPage.value - 2, 1);
        const pagesAfter = Math.min(currentPage.value + 2, pageCount.value);
        const visiblePageNumbers = [];
        for (let i = pagesBefore; i <= pagesAfter; i++) {
            visiblePageNumbers.push(i);
        }
        return visiblePageNumbers;
    });

    function goToPage(pageNumber) {
        currentPage.value = pageNumber;
    }

</script>