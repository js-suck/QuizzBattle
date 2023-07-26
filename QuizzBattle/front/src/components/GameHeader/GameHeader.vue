<template>
<RoundedSquare>
<ProfileBadge color="red" :name="users[0].firstname" :score="players[0].score"/>
<h2>{{gameName}}</h2>
<ProfileBadge color="green" :name="users[1].firstname" :score="players[1].score"/>
</RoundedSquare>
</template>

<script setup>
import ProfileBadge from './../ProfileBadge.vue';
import RoundedSquare from './../RoundedSquare.vue';
import { defineProps, inject, watch } from 'vue';
import { playerManager } from '../../contexts/quizzKeys';


const {players} = inject(playerManager)

 
watch(players,
    (newValue, oldValue) => {
        console.log("SCORES CHANGED", newValue, oldValue)
    }
)



// watch score 
// if score change, then update the score in the player list
// if score change, then update the score in the player list



const props = defineProps({
    color: {
        type: String,
        required: false,
        default: "black"
    },
    gameName : {
        type: String,
        required: false,
        default: "QuizzBattle"
    },
    users : {
        type: Array,
        required: false,
        default: []
    }
    })
</script>

<style scoped>

    .player-band{
        background-color: violet;
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
       
    }

    h2 {
      color: white;
    }
</style>