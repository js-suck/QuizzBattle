<template>
    <div>
      <h1>Classement</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Score</th>
            <th>Parties Jouées</th>
            <th>Score Moyen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in rankedPlayers" :key="player.id">
            <td>{{ index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.score }}</td>
            <td>{{ player.gamesPlayed }}</td>
            <td>{{ calculateAverageScore(player) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
      const players = ref([
        { id: 1, name: 'Joueur 1', score: 100, gamesPlayed: 5 },
        { id: 2, name: 'Joueur 2', score: 90, gamesPlayed: 6 },
        { id: 3, name: 'Joueur 3', score: 80, gamesPlayed: 4 },
        { id: 4, name: 'Joueur 4', score: 70, gamesPlayed: 7 },
        { id: 5, name: 'Joueur 5', score: 60, gamesPlayed: 3 },
      ]);
  
      const rankedPlayers = computed(() => {
        return players.value.slice().sort((a, b) => b.score - a.score);
      });
  
      const calculateAverageScore = (player) => {
        if (player.gamesPlayed === 0) {
          return 0;
        } else {
          return (player.score / player.gamesPlayed).toFixed(2);
        }
      };
  
      return {
        players,
        rankedPlayers,
        calculateAverageScore,
      };
    },
  };
  </script>
  
  <style>
  /* Ajoutez ici vos styles CSS si nécessaire */
  </style>
  