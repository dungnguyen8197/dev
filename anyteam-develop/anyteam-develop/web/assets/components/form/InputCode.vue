<template>
  <div class="form-group__input-code">
    <input
      autocomplete="none"
      id="input-code-1"
      name="code1"
      type="number"
      @keypress="keyPress"
      @keydown="checkBack"
      @keyup="jump"
      @input="handleInput"
    />
    <input
      autocomplete="none"
      id="input-code-2"
      name="code2"
      type="number"
      @keypress="keyPress"
      @keydown="checkBack"
      @keyup="jump"
      @input="handleInput"
    />
    <input
      autocomplete="none"
      id="input-code-3"
      name="code3"
      type="number"
      @keypress="keyPress"
      @keydown="checkBack"
      @keyup="jump"
      @input="handleInput"
    />
    <input
      autocomplete="none"
      id="input-code-4"
      type="number"
      min="0"
      step="1"
      @keypress="keyPress"
      @keydown="checkBack"
      @keyup="jump"
      @input="handleInput"
    />
    <input
      autocomplete="none"
      id="input-code-5"
      type="number"
      min="0"
      step="1"
      @keypress="keyPress"
      @keydown="checkBack"
      @keyup="jump"
      @input="handleInput"
    />
    <input
      autocomplete="none"
      id="input-code-6"
      type="number"
      min="0"
      step="1"
      @keypress="keyPress"
      @keydown="checkBack"
      @keyup="jump"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
  setup(_: any, context: any) {
    const handleInput = (e: Event) => {
      const inputs = document.querySelectorAll(
        '.form-group__input-code > input',
      ) as any;

      let value = '';
      for (let i = 0; i < inputs.length; i++) {
        value += inputs[i].value;
      }

      if (value.length == 6) {
        context.emit('blur', value);
      }
    };

    const keyPress = (e: Event) => {
      validate(e);
    };

    const validate = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value.length == 1) {
        e.preventDefault();
        return false;
      }
    };

    const jump = (e: any) => {
      const target = e.target as HTMLInputElement;
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(Number(e.key)) > -1) {
        if (target.value.length == 1) {
          const nextId = Number(target.id.replace('input-code-', '')) + 1;
          const nextInput = document.getElementById(
            'input-code-' + nextId,
          ) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }
      }
    };

    const checkBack = (e: any) => {
      const target = e.target as HTMLInputElement;
      if (e.key == 'Backspace') {
        const backId = Number(target.id.replace('input-code-', '')) - 1;
        const backInput = document.getElementById(
          'input-code-' + backId,
        ) as HTMLInputElement;
        if (backInput && target.value == '') {
          backInput.focus();
        }
      }
    };

    return {
      validate,
      handleInput,
      jump,
      checkBack,
      keyPress,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-group__input-code {
  display: flex;
  input {
    width: 33px;
    height: 40px;
    margin: 4px;
    border-radius: 2px;
    border: none;
    background: #fff;
    outline: none;
    text-align: center;
    &:focus {
      background: rgba(#9d9d9d, 0.16);
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
}
</style>
