<script setup>
import { inject, reactive, ref, onMounted } from 'vue';
import jwtDecode from 'jwt-decode';
import { userManagerKey } from '../contexts/userManagerKeys';
const {loginUser, user} = inject(userManagerKey)

const defaultValue = {
  email: '',
  password: ''
};
const formData = reactive({ ...defaultValue });
const errors = ref({});

function handleSubmit() {
  loginUser(formData)
    .then(() => {
      Object.assign(formData, defaultValue);
      errors.value = {};
    })
    .catch((_errors) => (console.log(_errors)));
}

onMounted(() => {
  if (user.value !== null) {
    window.location.href = 'http://localhost:5173';
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h1 class="text-black-200 mb-10 font-bold">Hello there 👋</h1>
    <label for="email">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" />
    <p v-if="errors.email">{{ errors.email.join('\n') }}</p>
    <label for="password">Password</label>
    <input v-model="formData.password" type="password" id="password" />
    <p v-if="errors.password">{{ errors.password.join('\n') }}</p>
    <a href="#">
       <h2 class="text-violet-500 font-bold">
        Forgot Password?
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