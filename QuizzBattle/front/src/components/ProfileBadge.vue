<template>
   <div class="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden" :style="{
    backgroundColor: color
   }">
  <img src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="Profil" class="w-full h-full object-cover" />
</div>

</template>

<script>
export default {
  props: {
    color: {
        type: String,
        required: false,
        default: "red"
    }
  },


}
</script>

<style>

.player-band {
    color: "black";
    border-radius: 0.5rem;
    padding: 1rem;
}

</style>