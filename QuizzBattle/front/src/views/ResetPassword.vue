<template>
  <form @submit.prevent="handleReset">
    <label for="password">Enter new password:</label>
    <input v-model.trim="formData.password" type="password" id="password" required />
    <button type="submit">Reset Password</button>
  </form>
</template>

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

function handleReset() {
  resetpassword(formData)
    .then(() => {
      Object.assign(formData, defaultValue);
      errors.value = {};
      router.push('/login');
    })
    .catch((_errors) => (console.log(_errors)));
}
</script>
