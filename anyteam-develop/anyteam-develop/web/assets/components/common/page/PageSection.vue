<template>
  <div class="mb-25">
    <div v-if="title" class="px-16 mb-6 text-base">{{ title }}</div>
    <div class="bg-light px-24 py-12" v-bind:class="{ 'error': error, 'pc-transperant': pcTransperant }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
    pcTransperant: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style lang="scss" scoped>
  .error {
    border: 1px solid #f00;
    background: #FFECEC;
  }
  .pc-transperant {
    @media (min-width: 768px) {
      background-color: transparent;
    }
  }
</style>
