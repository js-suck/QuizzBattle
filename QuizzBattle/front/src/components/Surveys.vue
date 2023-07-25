<template>
    <div class="p-4 sm:ml-64 flex">
            <div class="card flex mr-4">
                <div class="w-full flex flex-row justify-between	">
                    <span class="title-stat">34000</span>
                    <svg class="w-6 h-6 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
                    </svg>
                </div>
                <span>User activity this mounth</span>
            </div>
        <!-- Dynamic pagination
            <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
                <span class="px-6 py-4 text-sm font-normal text-gray-500">
                    Showing <span class="font-semibold text-gray-900">{{ startIndex }}-{{ endIndex }}</span> of
                    <span class="font-semibold text-gray-900">{{ users.length }}</span>
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
                        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700" @click="goToPage(pageCount)">Last({{ pageCount }})</a>
                    </li>
                </ul>
            </nav>-->
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';


/*const currentPage = ref(1);

const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * 10;
    const endIndex = startIndex + 10;
    return surveys.slice(startIndex, endIndex);
});

const itemsPerPage = 10;

const pageCount = computed(() => Math.ceil(users.length / itemsPerPage));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, users.length));

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
}*/
</script>
