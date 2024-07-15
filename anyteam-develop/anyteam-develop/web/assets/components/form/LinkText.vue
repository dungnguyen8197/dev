<template>
  <div class="form-link">
    <a v-bind:href="link">{{ label }}</a>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    label: {
      type: String
    },
    link: {}
  }
}
</script>

<style lang="scss" scoped>
.form-link {
  font-size: 1.4rem;
  line-height: 1.4rem;
  margin-bottom: 1.4rem;
  color: var(--secondary-color);
  a:visited {
    color: inherit;
  }
}
</style>