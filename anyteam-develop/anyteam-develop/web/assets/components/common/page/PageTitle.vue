<template>
  <h2 
    class="mt-0 text-secondary text-normal font-20"
    v-bind:class="{'pc-center': isCenter}"
  >{{ title }}</h2>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    isCenter: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    return {};
  },
});
</script>

<style lang="scss">
@media screen and (min-width: 768px) {
  h2.font-20 {
    font-size: 30px;
  }
  .pc-center {
    text-align: center;
  }
}
</style>
