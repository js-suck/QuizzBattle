<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            persistent
            width="1024"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    @click="initQuestion"
                    color="blue"
                    v-bind="props"
                >
                    Add Category
                </v-btn>
            </template>
            <v-card>
                <form class="my-4 w-full" @submit.prevent="submitForm" enctype="multipart/form-data">
                    <v-card-title>
                        <span class="text-h5">New Category</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                >
                                    <v-text-field
                                        v-model.lazy="categories.name"
                                        label="Name"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                >
                                    <v-text-field
                                        label="Description"
                                        v-model.lazy="categories.description"
                                        required
                                    ></v-text-field>
                                </v-col>
                            <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6">
                                    <v-file-input label="File input"
                                          accept="image/*"
                                          id="profilePictures"
                                          name="profilePictures"
                                          ref="fileInputRef"
                                    ></v-file-input>
                                </v-col>
                            </v-row>
                            </v-row>
                            <section v-for="(question, index) in newSection.questions" :key="index" id="addSectionQuestion">
                                <span class="text-h6">Question {{ index + 1 }}</span>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="question.questionText" label="" type="text" required></v-text-field>
                                    </v-col>
                                </v-row>
                                <span class="text-h6">Good answer</span>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="question.goodAnswer" label="" type="text" required></v-text-field>
                                    </v-col>
                                </v-row>
                                <span class="text-h6">Bad answers</span>
                                <v-row>
                                    <v-col cols="12" sm="4" md="4" v-for="(badAnswer, badIndex) in question.badAnswers" :key="badIndex">
                                        <v-text-field v-model="question.badAnswers[badIndex]" label="" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </section>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue-darken-1"
                            variant="text"
                            @click="addSectionQuestion"
                        >
                            Add Question
                        </v-btn>
                        <v-btn
                            color="blue-darken-1"
                            variant="text"
                            @click="dialog = false"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="blue-darken-1"
                            variant="text"
                            type="submit"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </form>

            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import {onMounted, ref} from "vue";
import axios from "axios";
import {API_URL} from "@/constants";
import client from '../helpers/client';
const fileInputRef = ref(null);
const categoryData = ref(null); // Add this line to define categoryData


export default {
    data() {
        return {
            dialog: false,
            categories: {
                name: '',
                description: '',
            },
            newSection: {
                name: '',
                description: '',
                questions: [],
            },
        };
    },
    methods: {
        addSectionQuestion() {
            this.newSection.questions.push({
                questionText: '',
                goodAnswer: '',
                badAnswers: ['', '', ''],
            });
        },
        initQuestion() {
            this.addSectionQuestion();
        },
        saveCategory() {
            this.categories.push(this.newSection);
            this.newSection = {
                name: '',
                description: '',
                questions: [],
            };
            this.dialog = false;
        },
        submitForm() {
            // Log all the questions to the console
            console.log(this.categories, this.$refs.fileInputRef.files[0]);
            const formData = new FormData();
            formData.append('name', this.categories.name);
            formData.append('description', this.categories.description);
            formData.append('profileImage', this.$refs.fileInputRef.files[0]);
            formData.append('image_url', this.$refs.fileInputRef.files[0].name);

            client.post(`${API_URL}/api/category/add`, formData)
                .then((response) => {
                    const categoryId = response.data.id;
                    const questionFormData = new FormData();
                    questionFormData.append("categoryId", categoryId);
                    questionFormData.append("label", question.questionText);
                    console.log(question.questionText)
                    axios.post(`${API_URL}/api/question/add`, questionFormData)
                        .then((questionResponse) => {
                            questionResponse.value = questionResponse.data;

                            console.log("Question added:", questionResponse.value);
                        })
                        .catch((error) => {
                            console.error('Error while fetching user data:', error);
                        });
                    /*axios.post(`${API_URL}/api/question/add`, formData)
                        .then((response) => {

                        })
                        .catch((error) => {
                            console.error('Error while fetching user data:', error);
                        });
                    window.location.reload();*/

                })
                .catch((error) => {
                    console.error('Error while fetching user data:', error);
                });
            this.newSection.questions.forEach((question, index) => {
                console.log(`Question ${index + 1}: ${question.questionText}`);
                console.log(`  Good Answer: ${question.goodAnswer}`);
                console.log(`  Bad Answers: ${question.badAnswers.join(', ')}`);
            });
        }

    },
}

</script>