<template>
<RoundedSquare>
<ProfileBadge color="red" :name="users[0].lastname" :score="scores.player1"/>
<h2>{{gameName}}</h2>
<ProfileBadge color="green" :name="users[1].lastname"/>
</RoundedSquare>
</template>

<script setup>
import ProfileBadge from './../ProfileBadge.vue';
import RoundedSquare from './../RoundedSquare.vue';
import { defineProps, inject, watch } from 'vue';
import { playerManager } from '../../contexts/quizzKeys';


const {scores} = inject(playerManager)

watch(scores,
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