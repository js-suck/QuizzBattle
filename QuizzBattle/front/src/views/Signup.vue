<script setup>
import {
  reactive,
  ref
} from 'vue'
import { API_URL } from '@/constants';

function validateForm() {
  if (!formData.firstname.trim()) {
    errors.value.firstname = 'Firstname is required';
  } else {
    errors.value.firstname = '';
  }

  if (!formData.lastname.trim()) {
    errors.value.lastname = 'Lastname is required';
  } else {
    errors.value.lastname = '';
  }

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
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};
const formData = reactive({ ...defaultValue });
const errors = ref({});
const res = ref({});


async function handleSubmit() {
   validateForm();
    if (
    errors.value.firstname ||
    errors.value.lastname ||
    errors.value.email ||
    errors.value.password
  ) {
    return;
  }

  try {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  const data = await response.json();

  errors.value.all = data.errors;
  res.value.all = data.message;
  console.log("data", data);
  } catch (error) {
    console.log(error);
}
}



</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h1 class="text-black-200 mb-10 font-bold text-center">Create an account ✏️</h1>
    <h3 class="text-black-200 mb-10 text-center">Please complete your profile with your informations</h3>
    <label for="firstname">Firstname</label>
    <input v-model.trim="formData.firstname" type="text" id="firstname" />
    <p class="error" v-if="errors.firstname">{{ errors.firstname }}</p>
    <label for="lastname">Lastname</label>
    <input v-model.trim="formData.lastname" type="text" id="lastname" />
    <p class="error" v-if="errors.lastname">{{ errors.lastname }}</p>
    <label for="email">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" />
    <p class="error" v-if="errors.email">{{ errors.email }}</p>
    <label for="password">Password</label>
    <input v-model="formData.password" type="password" id="password" />
    <p class="error" v-if="errors.password ">{{ errors.password }}</p>
    <a class="link" href="/login">
       <h2 class="text-violet-500 font-bold">
        Login
       </h2> 
    </a>
    <button type="submit">Submit</button>
    <br>
    <p class="error text-center" v-if="errors.all">{{ errors.all }}</p>
    <p class="sent text-center" v-if="res.all">{{ res.all }}</p>
  </form>
</template>

<style scoped>

body {
    background-color: #f5f5f5!important;
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
        padding: 1rem 1rem 1rem 0;
        border-bottom: 1px solid #6949FF;
        margin-bottom: 1rem;
    }

/**
 * on desktop style */

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
