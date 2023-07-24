<script setup>
import { reactive, ref } from 'vue';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);


const tokenemail = token.replaceAll('.','');

// console.log(tokenemail);

const startValidation = ref(false);


const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');

const isValidFirstname = computed(() => {
  return firstname.value.length >= 0;  
});

const isValidLastname = computed(() => {
  return lastname.value.length >= 0;  
});

const isValidEmail = computed(() => {
     return startValidation.value ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) : null;
});

const isValidPassword = computed(() => {
  return password.value.length >= 8;  
});


const defaultValue = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  tokenemail: tokenemail 
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
    const data = await response.json();
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

function handleSubmit() {
  
  signupUser(formData)
    .then(() => {
      Object.assign(formData, defaultValue);
      errors.value = {};
      router.push('./login');
    })
     .catch((_errors) => {
      errors.value = _errors; // Stocker les erreurs renvoyées par l'API
      console.log(_errors);
    });
}



</script>

<template>
  <form id="app" @submit.prevent="handleSubmit">
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
    <p class="error" v-if="errors.password">{{ errors.password }}</p>
    <a class="link" href="/login">
       <h2 class="text-violet-500 font-bold">
        Login
       </h2> 
    </a>
    <button type="submit">Submit</button>
  </form>

  <!-- {{ formData }}


  {{ user }} -->


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
