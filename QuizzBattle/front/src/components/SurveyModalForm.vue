<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn @click="initQuestion" color="blue" v-bind="props"> Add Category </v-btn>
      </template>
      <v-card>
        <form class="my-4 w-full" @submit.prevent="submitForm" enctype="multipart/form-data">
          <v-card-title>
            <span class="text-h5">New Category</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field v-model.lazy="categories.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Description"
                    v-model.lazy="categories.description"
                    required
                  ></v-text-field>
                </v-col>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      label="File input"
                      accept="image/*"
                      id="profilePictures"
                      name="profilePictures"
                      ref="fileInputRef"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-row>
              <section
                v-for="(question, index) in newSection.questions"
                :key="index"
                id="addSectionQuestion"
              >
                <span class="text-h6">Question {{ index + 1 }}</span>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="question.questionText"
                      label=""
                      type="text"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <span class="text-h6">Good answer</span>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="question.goodAnswer"
                      label=""
                      type="text"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <span class="text-h6">Bad answers</span>
                <v-row>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                    v-for="(badAnswer, badIndex) in question.badAnswers"
                    :key="badIndex"
                  >
                    <v-text-field
                      v-model="question.badAnswers[badIndex]"
                      label=""
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </section>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="addSectionQuestion">
              Add Question
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Close </v-btn>
            <v-btn color="blue-darken-1" variant="text" type="submit"> Save </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { onMounted, ref } from 'vue'

import axios from 'axios'

import { API_URL } from '@/constants'

import client from '../helpers/client'

const fileInputRef = ref(null)
const categoryData = ref(null) // Add this line to define categoryData
const question = ref(null) // Add this line to define categoryData

export default {
  data() {
    return {
      dialog: false,
      categories: {
        name: '',
        description: ''
      },
      newSection: {
        name: '',
        description: '',
        questions: []
      }
    }
  },
  methods: {
    addSectionQuestion() {
      this.newSection.questions.push({
        questionText: '',
        goodAnswer: '',
        badAnswers: ['', '', '']
      })
    },
    initQuestion() {
      this.addSectionQuestion()
    },
    saveCategory() {
      this.categories.push(this.newSection)
      this.newSection = {
        name: '',
        description: '',
        questions: []
      }
      this.dialog = false
    },
    submitForm() {
      // Log all the questions to the console
      //console.log(this.categories, this.$refs.fileInputRef.files[0]);
      const formData = new FormData()
      formData.append('name', this.categories.name)
      formData.append('description', this.categories.description)
      formData.append('profileImage', this.$refs.fileInputRef.files[0])
      formData.append('image_url', this.$refs.fileInputRef.files[0].name)
      console.log('tous', formData.entries())

      client
        .post(`${API_URL}/api/category/add`, formData)
        .then((response) => {
          console.log(this.newSection.questions)
          const categoryId = response.data.id
          this.submitQuestion(categoryId)
          window.location.reload()
        })
        .catch((error) => {
          console.error('Error while fetching user data:', error)
        })
    },
    submitQuestion(id) {
      this.newSection.questions.forEach((question, index) => {
        axios
          .post(`${API_URL}/api/questions/add`, {
            categoryId: id,
            label: question.questionText,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then((questionResponse) => {
            console.log('Question added:', questionResponse.data)
            const questionId = questionResponse.data.id
            this.submitAnswer(questionId, question.goodAnswer, question.badAnswers)
          })
          .catch((error) => {
            console.error('Error while adding question data:', error)
          })
      })
    },
    submitAnswer(id, goodAnswer, badAnswers) {
      console.log(id, goodAnswer, badAnswers)
      axios.post(`${API_URL}/api/answers/add`, {
        questionId: id,
        label: goodAnswer,
        isCorrect: true
      })
      badAnswers.forEach((badAnswer) => {
        axios.post(`${API_URL}/api/answers/add`, {
          questionId: id,
          label: badAnswer,
          isCorrect: false
        })
      })
    }
  }
}
</script>
