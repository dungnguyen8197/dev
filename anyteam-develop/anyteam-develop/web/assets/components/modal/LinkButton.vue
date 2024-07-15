<template>
  <div class="modal__content-action">
    <a class="btn" v-bind:href="link">{{ label }}</a>
  </div>
</template>


<script lang="ts">
export default {
  props: {
    label: {
      type: String
    },
    link: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.modal__content-action {
  width: 14rem;
  height: 4rem;
  line-height: 4rem;
  font-size: 1.2rem;
  background-color: #FFFFFF;
  display: block;
  margin: 0 auto;
}

.btn {
  text-decoration: none;
  color: #000000;
}
</style>