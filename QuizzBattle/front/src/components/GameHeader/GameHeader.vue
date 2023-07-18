<template>
<RoundedSquare>
<ProfileBadge color="red" :name="users[0].lastname"/>
<h2>{{gameName}}</h2>
<ProfileBadge color="green" :name="users[1].lastname"/>
</RoundedSquare>
</template>

<script>
import ProfileBadge from './../ProfileBadge.vue';
import RoundedSquare from './../RoundedSquare.vue';
export default {
  props: {
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
  },
  components: {
    ProfileBadge,
    RoundedSquare,
  }


}
</script>

<style>

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