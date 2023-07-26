
<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.css" rel="stylesheet" />
<template>
    <main>
        <Sidebar />
        <Register :user="userId" />
    </main>
</template>

<script setup lang="ts">
import Sidebar from '../../components/Sidebar.vue'
import Register from "../../components/Register.vue";
import 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const userId = ref(null);
const route = useRoute();
// Récupérer l'ID de l'utilisateur à partir des paramètres de la route
userId.value = route.params.id;
</script>


