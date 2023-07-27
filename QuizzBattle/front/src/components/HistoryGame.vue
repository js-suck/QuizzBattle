<template>
     <h2>Historique des Matchs</h2>
    <v-table>
      <thead>
        <tr>
          <th>Résultat</th>
          <th>Score</th>
          <th>Score de l'adversaire</th>
          <th>Nom de l'adversaire</th>
          <th>Catégorie</th>
          <th>Date</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(match, index) in historique" :key="index">
            <td>{{match.result}}</td>
            <td>{{match.score}}</td>
            <td>{{match.scoreAdversaire}}</td>
            <td>{{match.adversaire}}</td>
            <td>{{match.categorie}}</td>
            <td>{{match.date}}</td>
        </tr>
      </tbody>
    </v-table>

</template>
<script setup>
import { ref } from 'vue';
import jwtDecode from 'jwt-decode';

const historique = ref([
  {
    date: '2023-07-26',
    categorie: 'Football',
    nameAdversaire: 'Équipe A',
    score: 2,
    scoreAdversaire: 1,
    resultat: 'Victoire',
  },
  {
    date: '2023-07-20',
    categorie: 'Basketball',
    nameAdversaire: 'Équipe B',
    score: 80,
    scoreAdversaire: 75,
    resultat: 'Victoire',
  },
  // Ajoutez d'autres matchs ici
]);
</script>