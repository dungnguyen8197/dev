<template>
  <div class="flex items-center">
    <div class="service-item__image">
      <img :src="image" />
    </div>
    <div class="">
      <div class="font-15" v-html="title"></div>
      <div class="text-xs" >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    image: String,
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  }
});
</script>

<style lang="scss" scoped>
.service-item {
  &__image {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100px;
    height: 150px;
  }
}
</style>
