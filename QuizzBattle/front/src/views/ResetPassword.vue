<template>
  <form @submit.prevent="handleReset">
    <h1 class="text-black-200 mb-10 font-bold">Reset Password 👋</h1>
    <h3 class="text-black-200 mb-10 ">Save the new password in a safe place, if you forget it then you have to do a forgot password again.</h3>
    <label for="password">Enter new password:</label>
    <input v-model.trim="formData.password" type="password" id="password" required />
    <p class="error" v-if="errors.password">{{ errors.password }}</p>
        <a class="link" href="/login">
       <h2 class="text-violet-500 font-bold">
        Login
       </h2> 
    </a>
    <button type="submit">Reset Password</button>
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

<script setup>
import { reactive, ref } from 'vue';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';
import { API_URL } from '@/constants';

const router = useRouter();
const errors = ref({});

const res = ref({});
const tokenemail = router.currentRoute.value.params.tokenemail;
// console.log(tokenemail);

const password = ref('');

function validateForm() {
  if (formData.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
  } else {
    errors.value.password = '';
  }

}

const defaultValue = {
  password: '',
  tokenemail: tokenemail
};

const formData = reactive({ ...defaultValue });

async function handleReset() {
   validateForm();
    if (errors.value.password) {
    return; // If there are errors, do not submit the form

  }



  try {
     const response =await fetch(`${API_URL}/reset-password`, { 
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    const data = await response.json();

    res.value.all = data.message;
    console.log("data", data);
  }
  catch (error) {

    console.log(error);
  }

  //  await fetch('http://localhost:3000/reset-password', { 
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json'
  //       },
  //       body: JSON.stringify(formData)
  //   }).then((response) => {

  //      console.log("response", response.json());
  //     Object.assign(formData, defaultValue);
  //     errors.value = {};
  //     res.value.all = response.message;
  //     return response.json();
  //   }).catch((_errors) => (console.log(_errors)));
 
    

}
</script>
