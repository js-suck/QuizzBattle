<script setup>
import { ref, onMounted } from 'vue';
import jwtDecode from 'jwt-decode';

const userId = $route.params.userId;

// Effectuer la vérification de l'e-mail lors du montage de la page
onMounted(() => {
  verifyEmail(userId)
    .then(() => {
      status.value = 'success';
    })
    .catch(() => {
      status.value = 'error';
    });
});

// Vous pouvez remplacer cette fonction par votre propre fonction pour vérifier l'e-mail sur le serveur
async function verifyEmail(userId) {
  // Effectuez une requête HTTP vers votre API pour vérifier l'e-mail
  // Vous pouvez utiliser fetch, axios ou toute autre bibliothèque de requête HTTP
  // Par exemple :
  const response = await fetch(`http://localhost:3000/verify/${userId}`);
  if (response.status !== 200) {
    throw new Error('Échec de la vérification de l\'e-mail');
  }

  // update user on database isverified value to true

}

async function updateUserVerificationStatus(userId) {
  // Effectuez une requête HTTP vers votre API pour mettre à jour le statut de vérification de l'utilisateur
  // Vous pouvez utiliser fetch, axios ou toute autre bibliothèque de requête HTTP
  // Par exemple :
  const response = await fetch(`http://localhost:3000/verify/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ isVerified: true })
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

    <div class="verification-status" v-if="status === 'success'">
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
