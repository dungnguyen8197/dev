<template>
  <label class="form-group__radio-wrap" :class="class">
    <input
      class="form-group__radio"
      type="radio"
      v-bind:id="inputId"
      v-bind:name="inputName"
      v-bind:value="value"
      @change="handleInput"
      v-bind:checked="checked()"
    />
    <span class="form-group__radio-icon"></span>
    <span class="form-group__radio-text">{{ text }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
  model: { 
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    class: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    inputId: {
      type: String,
    },
    inputName: {
      type: String,
    },
    label: {
      type: String,
    },
    text: {
      type: String,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
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

    const checked = (): boolean => {
      return props.modelValue === props.value;
    }

    return {
      handleInput,
      handleBlur,
      checked,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-group {
  &__radio-wrap {
    font-size: 1.2rem;
  }
  &__radio {
    display: none;
  }
  &__radio-icon {
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-gray);
    padding: 0;
    background: var(--white-color);
    margin-right: 8px;
    display: inline-block;
    border-radius: 50%;
  }
  &__radio:checked + &__radio-icon {
    border: 3px solid var(--secondary-color);
  }
  &__radio-text {
    vertical-align: text-bottom;
  }
}
</style>