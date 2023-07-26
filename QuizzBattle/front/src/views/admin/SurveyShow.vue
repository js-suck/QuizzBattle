
<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.css" rel="stylesheet" />
<template>
    <main>toto
        <Sidebar />
        <EditSurvey :survey="surveyId" />
    </main>
</template>

<script setup lang="ts">
import Sidebar from '../../components/Sidebar.vue'
import EditSurvey from "../../components/EditSurvey.vue";
import 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const surveyId = ref(null);
const route = useRoute();
// Récupérer l'ID de l'utilisateur à partir des paramètres de la route
surveyId.value = route.params.id;
</script>


