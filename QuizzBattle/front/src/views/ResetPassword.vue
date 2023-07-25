<template>
  <form @submit.prevent="handleReset">
    <h1 class="text-black-200 mb-10 font-bold">Reset Password 👋</h1>
    <h3 class="text-black-200 mb-10 ">Save the new password in a safe place, if you forget it then you have to do a forgot password again.</h3>
    <label for="password">Enter new password:</label>
    <input v-model.trim="formData.password" type="password" id="password" required />
    <button type="submit">Reset Password</button>
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

<script setup>
import { reactive, ref } from 'vue';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';

const router = useRouter();

const tokenemail = router.currentRoute.value.params.tokenemail;
// console.log(tokenemail);

const defaultValue = {
  password: '',
  tokenemail: tokenemail
};

const formData = reactive({ ...defaultValue });

async function resetpassword({tokenemail, password}) {
  console.log(tokenemail, password)
    const response = await fetch('http://localhost:3000/reset-password', { 
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({tokenemail: tokenemail, password: password})
    });
    if (response.status === 200) {
      return response.json();
      router.push('localhost:5173/login');
    }
  throw new Error('Fetch failed');

}

function handleReset() {
  resetpassword(formData)
    .then(() => {
      console.log("ok");
      Object.assign(formData, defaultValue);
      errors.value = {};
      router.push('localhost:5173/login');
    })
    .catch((_errors) => (console.log(_errors)));
}
</script>
