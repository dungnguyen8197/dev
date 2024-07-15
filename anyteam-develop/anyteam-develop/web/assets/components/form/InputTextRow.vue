<template>
  <div class="form-group-row">
    <label class="form-group-row__label"
      >{{ label }}
    </label>
    <div class="form-group-row__input">
      <input class="form-group-row__text"
        v-bind:type="inputType"
        v-bind:id="inputId"
        v-bind:name="inputName"
        v-bind:placeholder="placeholder"
        v-bind:errorMessage="errorMessage"
        v-bind:value="value"
        @input="handleInput"
      />
      <p class="form-group-row__error-notice">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Item from './Item.vue';

export default {
  components: {Item},
  props: {
    value: {
      type: String,
      default: ''
    },
    inputType: {
      default: 'text'
    },
    inputId: {
      type: String,
    },
    inputName: {
      type: String,
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  emits: ['input'],
  setup(_: any, context: any) {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      context.emit('input', target.value);
    }

    return {
      handleInput
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  &__text {
    width: 100%;
    height: 4.2rem;
    font-size: 1.4rem;
    border: none;
    background-color: white;
    padding: 0;
    text-indent: 1.2rem;
    border-radius: 4px;
    &::placeholder {
      color: #9D9D9D;
    }
  }
  &__label {
    width: 10%;
    font-size: 1.4rem;
    text-align: left;
  }
  &__input {
    width: 81%;
  }
  &__error-notice {
    color: #FF5C5C;
    font-size: 1.4rem;
    margin-top: 0.5rem;
    text-align: left;
    margin-bottom: 0;
  }
}
</style>