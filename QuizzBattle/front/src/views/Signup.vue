<script setup>
import { reactive, ref } from 'vue';
import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

const defaultValue = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};
const formData = reactive({ ...defaultValue });
const errors = ref({});

async function signupUser(_user) {
  const response = await fetch(`http://localhost:3000/signup`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    const data = await response.json();
    const token = data.token;
    user.value = jwtDecode(token)
    localStorage.setItem('token', token);
    return Promise.resolve(data);
  }
  throw new Error('Fetch failed');
}

function handleSubmit() {
  signupUser(formData)
    .then(() => {
      Object.assign(formData, defaultValue);
      errors.value = {};
    })
    .catch((_errors) => (console.log(_errors)));
}

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h1 class="text-black-200 mb-10 font-bold">Hello there 👋</h1>
    <label for="firstname">Firstname</label>
    <input v-model.trim="formData.firstname" type="text" id="firstname" />
    <p v-if="errors.firstname">{{ errors.firstname.join('\n') }}</p>
    <label for="lastname">Lastname</label>
    <input v-model.trim="formData.lastname" type="text" id="lastname" />
    <p v-if="errors.lastname">{{ errors.lastname.join('\n') }}</p>
    <label for="email">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" />
    <p v-if="errors.email">{{ errors.email.join('\n') }}</p>
    <label for="password">Password</label>
    <input v-model="formData.password" type="password" id="password" />
    <p v-if="errors.password">{{ errors.password.join('\n') }}</p>
    <a href="/login">
       <h2 class="text-violet-500 font-bold">
        Login
       </h2> 
    </a>
    <button type="submit">Submit</button>
  </form>

</template>

<style scoped>

body {
    background-color: #f5f5f5;
}


form {
    display: flex ;
    flex-direction: column;
    min-height: 80vh;
}

h2 {
    cursor: pointer;
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
        border-radius: 0.5rem;
        border: 1px solid #6949FF;
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