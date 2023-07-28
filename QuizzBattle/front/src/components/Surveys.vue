<template>
    <SurveyModalForm />
    <div class="p-4 sm:ml-64 flex flex-wrap">
            <div v-for="survey in surveys.value" :key="survey.id" class="card m-2 flex min-w-20 max-w-20 mr-4" @click="$router.push(`/admin/survey/show/${survey.id}`)">
                <img
                    v-if="survey.image_url"
                    :src="`${API_URL}/uploads/${survey.image_url}`"
                    alt="Survey Picture"
                    id="profile-picture-img"
                    class="w-full h-full object-cover"
                    ref="profilePicture"
                />
                <img
                    v-else
                    src="@/assets/images/LogoQuizzBattleWithoutBG.png"
                    alt="Profile Picture"
                    id="profile-picture-img"
                    class="w-full h-full object-cover"
                    ref="profilePicture"
                />
                <div class="w-full flex flex-row justify-between	">
                    <span class="title-stat">{{survey.name}}</span>
                </div>
                <!-- me nique le front si dscp trolong<span>{{survey.description}}</span>-->
            </div>
        </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from 'vue';
import axios from 'axios';
import {API_URL} from "@/constants";
const surveys = reactive([]);
import { RouterLink } from 'vue-router';
import SurveyModalForm from "@/components/SurveyModalForm.vue";

onMounted(() => {
    axios.get(`${API_URL}/api/category/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then((response) => {
            surveys.value = response.data;
            console.log(surveys.value);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des quiz', error);
        });
});
</script>
