<template>
   <div class="w-full player-band" :style="{
    backgroundColor: color
   }">
   <slot></slot>
   </div>
</template>

<script>
export default {
      props: {
    color: {
        type: String,
        required: false,
        default: "black"
    },
      }

}
</script>



<style>

  .rounded-square{
        background-color: violet;
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
       
    }

</style>