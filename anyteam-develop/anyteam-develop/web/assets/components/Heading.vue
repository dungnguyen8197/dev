<template>
  <h2>{{ text }}</h2>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 3.6rem;
  display: flex;
  align-items: center;

  &:after {
    content: '';
    border-top: 1px solid #004BB1;
    flex-grow: 1;
    margin-left: 2rem;
  }
}
</style>>