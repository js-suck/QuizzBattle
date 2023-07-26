<script setup>
import { reactive, ref } from 'vue';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

const tokenreset = token.replaceAll('.','');

const verif = ref(false);
const errors = ref({});

const defaultValue = {
  email: '',
  token: tokenreset
};
const formData = reactive({ ...defaultValue });

async function forgotpassword(email, token) {
  const response = await fetch(`http://localhost:3000/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(email, token)
  });
  if (response.status === 422) {
    const data = await response.json();
    errors.email = data.email;
    return Promise.reject(await response.json());
  } else if (response.ok) {
    const data = await response.json();
    const token = data.token;
    console.log(token);
    user.value = jwtDecode(token)
    localStorage.setItem('token', token);
    return Promise.resolve(data);

  }
  throw new Error('Fetch failed');
}

async function handleSubmit() {
  await forgotpassword(formData)
    .then(() => {
      Object.assign(formData, defaultValue);
      errors.value = {};
      router.push('./login');
      verif.value = true;
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
    <div class="verification-page">
    <div class="verification-status" v-show="verif">
      <p class="text-black-200 mb-4 text-center">Votre e-mail a été vérifié avec succès !</p>
    </div>
    </div>
    <a class="link" href="/login">
       <h2 class="text-violet-500 font-bold">
        Login
       </h2> 
    </a>
    <button type="submit">Send Reset Email</button>

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


