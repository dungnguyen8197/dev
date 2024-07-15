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
    <a v-if="link" class="form-group__link">{{ text }}</a>
    <span v-else>{{ text }}</span>
    <slot name="label"></slot>
  </label>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
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
    text: {
      type: String,
    },
    link: {
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
  &__link {
    font-size: 1.2rem;
    color: #0073b1;
    text-decoration: underline;
  }
}
</style>