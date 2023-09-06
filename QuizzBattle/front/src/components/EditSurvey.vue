<template>
    <div class="p-4 sm:ml-64 flex flex-col">
        <h2 class="text-2xl font-semibold mb-4">User Sheet</h2>
        <div class="container flex">
            <div class="card flex mr-4">
                <form class="my-4 w-full" @submit.prevent="submitForm" enctype="multipart/form-data">
                    <div class="mb-6">
                        <label for="name" class="block mb-2 font-medium text-gray-700">Name Category :</label>
                        <input v-model.lazy="categoryData.name" type="text" id="name" name="name" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <div class="mb-6">
                        <label for="description" class="block mb-2 font-medium text-gray-700">Description Category :</label>
                        <input v-model.lazy="categoryData.description" type="text" id="description" name="description" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <!-- Input for the question -->
                    <span for="question" class="block mb-2 font-medium text-gray-700">Question:</span>
                    <div class="mb-6" v-for="question in questions" :key="question.id">
                        <input v-model.lazy="question.label" type="text" id="question" name="question" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>

                    <!-- Inputs for the answers -->
                    <div v-for="(questionAnswers, index) in answers" :key="index" class="my-4 w-full">
                        <div v-for="answer in questionAnswers" :key="answer.id" class="mb-6">
                            <label v-if="answer.isCorrect" for="lastname" class="block mb-2 font-medium text-gray-700">Good answer</label>
                            <label v-else for="answer" class="block mb-2 font-medium text-gray-700">Bad answer</label>
                            <input v-model.lazy="answer.label" type="text" :id="`answer-${index}`" :name="`answer-${index}`" class="mt-1 px-4 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" />
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Register</button>
                    </div>

                </form>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref
} from 'vue'


import { API_URL } from '@/constants'
import client from '../helpers/client';

const categoryData = ref({});
const questionsData = ref({});
const questions = ref({});
const answers = ref([]);
const fileInputRef = ref(null);
const profilePicture = ref(null);
const beforeChange = ref(false);
const profilePictureSrc = ref(''); // To store the profile picture URL

const props = defineProps({
    survey: {
        required: true,
        type: String,
    },
});

// TODO REFRESH THE JWT
onMounted(() => {
    console.log(props.survey)
    // Fetch the user data
    client.get(`${API_URL}/api/category/${props.survey}`)
        .then((response) => {
            categoryData.value = response.data;
            callQuestion()
        })
        .catch((error) => {
            console.error('Error while fetching user data:', error);
        });
});
async function callQuestion() {
    try {
        const responseQuestion = await client.get(`${API_URL}/api/questions/${props.survey}`);
        questions.value = responseQuestion.data;
        console.log(questions);


        const promises = questions.value.map((question) => callAnswer(question.id));
        const allAnswers = await Promise.all(promises);
        answers.value = allAnswers; // Set the answers ref to the result
        console.log(allAnswers);

        // Maintenant, allAnswers est un tableau contenant les réponses de chaque question
        // Vous pouvez les utiliser comme nécessaire.
    } catch (error) {
        console.error('Error while fetching user data:', error);
    }
}

async function callAnswer(questionId) {
    try {
        const responseAnswers = await client.get(`${API_URL}/api/answers/${questionId}`);
        const answers = responseAnswers.data;
        return answers;
    } catch (error) {
        console.error('Error while fetching user data:', error);
        return []; // Retourne un tableau vide en cas d'erreur pour éviter d'interrompre Promise.all
    }
}


const updateCategory = () => {
    client.put(`${API_URL}/api/category/${categoryData.value.id}`, {
        name: categoryData.value.name,
        description: categoryData.value.description,
    })
        .then((response) => {
            console.log('Category updated successfully:', response.data);
        })
        .catch((error) => {
            console.error('Error while updating Category:', error);
        });
};

// Function to update the Questions
const updateQuestions = () => {
    questions.value.forEach((question) => {
        client.put(`${API_URL}/api/questions/${question.id}`, {
            label: question.label,
        })
            .then((response) => {
                console.log('Question updated successfully:', response.data);
            })
            .catch((error) => {
                console.error('Error while updating Question:', error);
            });
    });
};

// Function to update the Answers
const updateAnswers = () => {
    answers.value.forEach((questionAnswers) => {
        questionAnswers.forEach((answer) => {
            client.put(`${API_URL}/api/answers/${answer.id}`, {
                label: answer.label,
            })
                .then((response) => {
                    console.log('Answer updated successfully:', response.data);
                })
                .catch((error) => {
                    console.error('Error while updating Answer:', error);
                });
        });
    });
};

// Function to handle the form submission and trigger update functions
const submitForm = () => {
    // You can call your validation functions here if needed
    updateCategory();
    updateQuestions();
    updateAnswers();
    // Optionally, you can perform actions after all updates are completed
};

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
