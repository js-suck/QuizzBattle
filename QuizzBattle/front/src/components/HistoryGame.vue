<template>
  <br><br>
     <h2>Historique des Matchs</h2>
     <br>
     <br>
    <table class="w-full text-sm text-left text-gray-500 border rounded-lg first-letter:">
      <thead class="text-xs text-gray-700 uppercase rounded">
        <tr>
          <th scope="col" class="px-6 py-3 text-center">Résultat</th>
          <th scope="col" class="px-6 py-3 text-center">Score</th>
          <th scope="col" class="px-6 py-3 text-center">Score Adversaire</th>
          <th scope="col" class="px-6 py-3 text-center">Adversaire</th>
          <th scope="col" class="px-6 py-3 text-center">Catégorie</th>
          <th scope="col" class="px-6 py-3 text-center">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(match, index) in paginatedGames" 
          :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'" 
          class="border-b table-row"
        >
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
             <p :class="`p-2 ${match.isWinner ? 'bg-yellow-500' : 'bg-red-500'} rounded-md`">{{match.isWinner ? 'Gagnant' : 'Perdant'}}</p> 
            </td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">{{match.score}}</td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">{{match.userVsScore ?? 0}}</td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">{{match.userVsName ?? match.userVsID}}</td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">{{match.quizzName}}</td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">{{match.date}}</td>
        </tr>
      </tbody>
    </table>
  <!-- Dynamic pagination -->
            <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
                <span class="px-6 py-4 text-sm font-normal text-gray-500">
                Showing <span class="font-semibold text-gray-900">{{ startIndex }}</span>-
                <span class="font-semibold text-gray-900">{{ endIndex }}</span> of
                <span class="font-semibold text-gray-900">{{ history.length }}</span> Games
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
</template>

<style scoped>

th{
    font-weight: bold;
}

</style>

<script setup>
import 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js'

import {
  computed,
  inject,
  onMounted,
  ref
} from 'vue'

import { API_URL } from '../constants'
import { userManagerKey } from '../contexts/userManagerKeys'
import client from '../helpers/client'

const { user } = inject(userManagerKey);

const historique = ref([]);

onMounted(() => {
  client.get(`${API_URL}/api/users/${user.value.id}/games`)
    .then((response) => {
      historique.value = response.data; // Correction : Utiliser response.data au lieu de response
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des games', error)
    });
});

const history = computed(() => {
  return historique.value.slice().sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

const currentPage = ref(1);

const paginatedGames = computed(() => {
  const startIndex = (currentPage.value - 1) * 10;
  const endIndex = startIndex + 10;
  return history.value.slice(startIndex, endIndex); // Correction : Utiliser history.value au lieu de historique.value
});

const itemsPerPage = 10;

const pageCount = computed(() => Math.ceil(history.value.length / itemsPerPage));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, history.value.length));

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
