<script setup>
import {
  inject,
  onMounted,
  reactive,
  ref
} from 'vue'
import { useRouter } from 'vue-router';

import { userManagerKey } from '../contexts/userManagerKeys'

const {loginUser, user} = inject(userManagerKey)
const router = useRouter()
const email = ref('');
const password = ref('');

function validateForm() {
  if (formData.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
  } else {
    errors.value.password = '';
  }

  if (!formData.email.includes('@')) {
    errors.value.email = 'Email must be a valid email';
  } else {
    errors.value.email = '';
  }
}

const defaultValue = {
  email: '',
  password: ''
};
const formData = reactive({ ...defaultValue });
const errors = ref({});

function handleSubmit() {
  validateForm();
  if(
    errors.value.email ||
    errors.value.password 
  ) {
    return;
  }

  loginUser(formData)
    .then((response) => {
      errors.value.all = response.errors;
      if(response.errors === undefined) {
        router.push('/')
      }
      Object.assign(formData, defaultValue);
      
    })
    .catch((_errors) => (console.log(_errors)));


    
}

// onMounted(() => {
//   if (user.value !== null) {
//     window.location.href = 'http://localhost:5173';
//   }
// });
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h1 class="text-black-200 mb-10 font-bold">Hello there 👋</h1>
    <label for="email">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" />
    <p class="error" v-if="errors.email">{{ errors.email }}</p>
    <label for="password">Password</label>
    <input v-model="formData.password" type="password" id="password" />
    <p class="error" v-if="errors.password">{{ errors.password}}</p>
    <a class="link" href="/forgot-password">
       <h2 class="text-violet-500 font-bold">
        Forgot Password?
       </h2> 
    </a>
    <a class="link" href="/signup">
       <h2 class="text-violet-500 font-bold">
        Sign Up
       </h2>
    </a>
    <button type="submit">Submit</button>
    <br>
    <p class="error text-center" v-if="errors.all">{{ errors.all }}</p>
  </form>

</template>

<style scoped>

body {
    background-color: #f5f5f5;
}

.link:hover{
    background-color: white;
    cursor: pointer;
}


form {
    display: flex ;
    flex-direction: column;
    min-height: 80vh;
}

h2 {
    cursor: pointer;
    font-size: 1rem!important;
}

.error {
    color: red;
    font-size: 0.8rem;
    margin-bottom: 1rem;
}

button {
    margin-top: auto;
    background-color: #6949FF;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 0.5rem;
}

input {
    padding: 1rem;
    border-bottom: 1px solid #6949FF;
    margin-bottom: 1rem;
}

/**
 * on desktop styles */

@media (min-width: 768px) {
    form {
        width: 50%;
        margin: 0 auto;
    }



    button {
        margin-top: 1rem;
    }

    h2 {
        margin-top: 1rem;
    }

    label {
        font-weight: bold;
    }


}


</style>