<template>
  <div class="profile-badge-wrapper">
    <div class="flex items-center justify-center rounded-full overflow-hidden" :style="{
      backgroundColor: color,
      width: width,
      height: height
    }">
      <img
        :src="image"
        alt="Profil" class="w-full h-full object-cover" />
    </div>
    <h4
    :style="{
      color: textColor
    }"
    >{{ name }}</h4>
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
      default: "User"
    },
    score: {
      type: Number,
      required: false,
      default: null
    },
    image : {
        type: String,
        required: false,
        default: "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
    },
    width: {
      type: String,
      required: false,
      default: "3rem"
    },
    height: {
      type: String,
      required: false,
      default: "3rem"
    },
    textColor: {
      type: String,
      required: false,
      default: "white"
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

</style>