<template>
  <input
    class="form-group__text"
    v-bind:class="className"
    v-bind:type="inputType"
    v-bind:id="inputId"
    v-bind:name="inputName"
    v-bind:placeholder="placeholder"
    v-bind:errorMessage="errorMessage"
    v-bind:value="value"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: "",
    },
    inputType: {
      default: "text",
    },
    inputId: {
      type: String,
    },
    className: {
      type: String,
      default: '',
    },
    inputName: {
      type: String,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
  },
  emits: ["input", "blur"],
  setup(props, context) {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      context.emit("input", target.value);
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
  &__text {
    width: 100%;
    height: 4.2rem;
    font-size: 1.4rem;
    border: none;
    background-color: #e4e6eb;
    padding: 0;
    text-indent: 1.2rem;

    &::placeholder {
      color: var(--dark-gray-color);
    }
    @media screen and (min-width: 768px) {
      border: 1px solid #E3E3E3;
    }
  }
}
</style>