<template>
  <Item v-bind:label="label" v-bind:errorMessage="errorMessage">
    <input
      class="form-group__text w-full bg-white"
      v-bind:class="[inputClass, { invalid: !!errorMessage }]"
      v-bind:type="inputType"
      v-bind:id="inputId"
      v-bind:name="inputName"
      v-bind:placeholder="placeholder"
      v-bind:value="value"
      @input="handleInput"
      v-bind:disabled="disabled"
    />
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
      target.value = props.numberOnly
        ? target.value.replace(/[^0-9]/g, '')
        : target.value;
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
    height: 4.2rem;
    font-size: 1.4rem;
    border: none;
    padding: 0;
    text-indent: 1.2rem;
    border-radius: 4px;
    &::placeholder {
      color: var(--dark-gray-color);
    }
    @media screen and (min-width: 768px) {
      border: 1px solid #E3E3E3;
    }
  }
}
input:disabled {
  background-color: var(--dark-gray-color);
  color: var(--primary-color);
}
</style>
