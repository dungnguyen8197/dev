<template>
  <Item v-bind:label="label" v-bind:errorMessage="errorMessage">
    <textarea
      rows="10"
      class="form-group__text w-full"
      v-bind:class="[inputClass, { invalid: !!errorMessage }]"
      v-bind:type="inputType"
      v-bind:id="inputId"
      v-bind:name="inputName"
      v-bind:placeholder="placeholder"
      v-bind:value="value"
      @input="handleInput"
      v-bind:disabled="disabled"
    ></textarea>
  </Item>
</template>

<script lang="ts">
import Item from './Item.vue';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: { Item },
  props: {
    value: {
      type: String,
      default: '',
    },
    inputType: {
      default: 'text',
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
    placeholder: {
      type: String,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    numberOnly: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
  setup(props, context) {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      context.emit('input', target.value);
    };

    return {
      handleInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-group {
  &__text {
    font-size: 1.4rem;
    border: none;
    background-color: var(--white-color);
    padding: 1.2rem;
    border-radius: 4px;
    &::placeholder {
      color: var(--dark-gray-color);
    }
  }
}
textarea {
  max-width: 100%;
  font-family: Axis Std, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo,
}
textarea:disabled {
  background-color: var(--dark-gray-color);
  color: var(--primary-color);
}
</style>
