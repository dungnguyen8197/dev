<template>
  <div class="form-container">
    <div class="form-container__title" v-if="title">{{ title }}</div>
    <div class="form-container__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    title: {
      type: String
    }
  }
});
</script>

<style lang="scss" scoped>
.form-container {
  padding: 4rem 4rem;
  border-radius: 1rem;
  min-height: 33.4rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  &__title {
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 3rem;
  }
  @media screen and (max-width: 767px) {
    max-width: 44rem;
  }
}
</style>