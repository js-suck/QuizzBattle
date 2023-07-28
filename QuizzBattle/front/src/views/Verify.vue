<script setup>
import { ref, onMounted } from 'vue';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';
import { API_URL } from '@/constants';

const router = useRouter();

const tokenemail = router.currentRoute.value.params.tokenemail;
// console.log(tokenemail);

// Effectuer la vérification de l'e-mail lors du montage de la page
onMounted(() => {
  updateUserVerificationStatus(tokenemail)
    .then(() => {
      if (status.value === 'success'){
      status = 'success';
      }
    })
    .catch(() => {
      status.value = 'error';
    });

});


async function updateUserVerificationStatus(tokenemail) {
  const response = await fetch(`${API_URL}/verify`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ tokenemail })
  });
  if (response.status !== 200) {
    throw new Error('Échec de la mise à jour du statut de vérification de l\'utilisateur');
  }
  const data = await response.json();
  return data;
}
</script>

<template>
  <div class="verification-page">
    <div class="verification-status" v-if="status = 'success'">
      <p class="text-black-200 mb-4 text-center">Votre e-mail a été vérifié avec succès !</p>
    </div>

    <div class="verification-status" v-else>
      <p class="text-red-500 mb-4 text-center">Échec de la vérification de l'e-mail. Le lien est peut-être expiré ou invalide.</p>
      <p class="text-black-200 mb-4 text-center">Veuillez réessayer ou contactez l'assistance.</p>
    </div>
  </div>
</template>

<style>
.verification-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.verification-status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.text-black-200 {
  color: #333333;
}

.text-red-500 {
  color: #FF0000;
}

.font-bold {
  font-weight: bold;
}

.text-center {
  text-align: center;
}
</style>
