<template>
  <div class="profile-badge-wrapper">
    <div class="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden" :style="{
      backgroundColor: color
    }">
      <img
        src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
        alt="Profil" class="w-full h-full object-cover" />
    </div>
    <h4>{{ name }}</h4>
    {{ score }}
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: "red"
    },
    name: {
      type: String,
      required: true,
      default: ""
    },
    score: {
      type: Number,
      required: false,
      default: 0
    }
  },


}
</script>

<style>
.profile-badge-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h4 {
  margin-top: 0.5rem;
  color: white;
}
</style>