<script setup>
import { reactive, ref } from 'vue';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';
import { API_URL } from '@/constants';


const verif = ref(false);
const errors = ref({});

const res = ref({});

const defaultValue = {
  email: '',
};
const formData = reactive({ ...defaultValue });

function forgotpassword(email, token) {
  return fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(email, token)
  }).then((response) => {
    return response.json();
  });
}

async function handleSubmit() {
  await forgotpassword(formData)
    .then((response) => {
      console.log("response", response );
      Object.assign(formData, defaultValue);
      res.value.all = response.message;
      router.push('./login');
    })
    .catch((_errors) => (console.log(_errors)));
}
</script>


<template>
  <form @submit.prevent="handleSubmit">
    <h1 class="text-black-200 mb-10 font-bold">Forgot Password 👋</h1>
    <h3 class="text-black-200 mb-10 ">Enter your email address to get the link for reset your password</h3>
    <label for="email">Enter your email:</label>
    <input v-model.trim="formData.email" type="email" id="email" required />
    <a class="link" href="/login">
       <h2 class="text-violet-500 font-bold">
        Login
       </h2> 
    </a>
    <button type="submit">Send Reset Email</button>
    <br>
    <p class="sent text-center" v-if="res.all">{{ res.all }}</p>

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

.sent {
    color: green;
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


