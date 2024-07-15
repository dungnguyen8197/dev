<template>
  <div class="form-group-row">
    <label class="form-group-row__label"
      >{{ label }}
    </label>
    <div class="form-group-row__input">
      <div style="position: relative">
        <input class="form-group-row__text"
          :class="{ 'is-invalid': errorMessage }"
          :type="states.type"
          v-bind:id="inputId"
          v-bind:name="inputName"
          v-bind:placeholder="placeholder"
          v-bind:errorMessage="errorMessage"
          v-bind:value="value"
          @input="handleInput"
        />
        <div class="password" :class="states.isShow ? 'password__hiden' : 'password__show'" @click.native="changePaswordType" />
      </div>
      <p class="form-group-row__error-notice">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from '@vue/runtime-core';
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
  setup(props: any, context: any, ) {
    const states = reactive({
      isShow: false,
      type : 'password',
    });
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      context.emit('input', target.value);
    }

    const changePaswordType = () => {
      states.isShow = !states.isShow;
      states.type = states.isShow ? 'text' : 'password';
    }

    return {
      states,
      handleInput,
      changePaswordType,
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
  &__text.is-invalid {
    border: 1px solid var(--danger-color);
    background-color: rgba(#FF2B52, 0.08);
  }
  &__error-notice {
    color: var(--danger-color);
    font-size: 1.2rem;
    margin-top: 0.5rem;
    text-align: left;
    margin-bottom: 0;
  }

  .password {
    width: 50px;
    height: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    right: 0;
    &__hiden {
      background: url('/public/images/user/icon-awesome-eye.svg') no-repeat center;
    }
    &__show {
      background: url('/public/images/user/icon-awesome-eye-slash.svg') no-repeat center;
    }
  }
}
</style>