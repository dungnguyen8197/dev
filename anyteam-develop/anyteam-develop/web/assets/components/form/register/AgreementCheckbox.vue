<template>
  <label class="form-group__checkbox-wrap flex items-center">
    <input
      class="form-group__checkbox"
      type="checkbox"
      v-bind:id="inputId"
      v-bind:name="inputName"
      :checked="value"
      v-on:change="handleInput"
    />
    <AgreementText />
  </label>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import AgreementText from './AgreementText.vue';

export default defineComponent({
  components: { AgreementText },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    inputId: {
      type: String,
    },
    inputName: {
      type: String,
    },
  },
  emits: ["input", "blur"],
  setup(_: any, context: any) {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      context.emit("input", target.checked);
    };

    const handleBlur = (e: Event) => {
      context.emit("blur");
    };

    return {
      handleInput,
      handleBlur,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-group {
  &__checkbox-wrap {
    font-size: 1.2rem;
  }
  &__checkbox {
    width: 14px;
    height: 14px;
    border: none;
    background-color: #e4e6eb;
    padding: 0;
    text-indent: 1.2rem;
    margin-right: 8px;
  }
}
</style>