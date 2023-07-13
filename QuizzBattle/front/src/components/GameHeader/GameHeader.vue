<template>
<RoundedSquare>
<ProfileBadge color="red"/>
<h2>{{gameName}}</h2>
<ProfileBadge color="green"/>
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