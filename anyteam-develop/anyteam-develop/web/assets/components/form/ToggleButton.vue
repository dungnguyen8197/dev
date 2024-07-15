<template>
  <Item
    v-bind:label="label"
  >
    <div class="form-group__toggle">
      <slot />
      <div class="toggle__button">
        <input id="toggle" class="toggle__input" type="checkbox" v-model="checked" @change="handleToggle" />
        <label for="toggle" class="toggle__label"></label>
      </div>
    </div>
  </Item>
</template>

<script lang="ts">
import Item from './Item.vue';

export default {
  components: {Item},
  props: {
    label: {
      type: String
    },
    checked: {
      type: Boolean
    }
  },
  setup(props: any, context: any) {
    const handleToggle = () => {
      context.emit('update:modelValue', props.checked)
    }

    return {
      handleToggle
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  &__toggle {
    display: flex;
    justify-content: space-between;
    padding: 0 1.2rem;
    height: 4.2rem;
    font-size: 1.4rem;
    background-color: #E4E6EB;
  }
}

.toggle {
  &__button {
    position: relative;
    width: 5rem;
    height: 3rem;
    margin: auto 0;
  }

  &__input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0;
    cursor: pointer;

    &:checked {
      +.toggle__label {
        background: #0085FF;
        &:after {
          left: 2.3rem;
        }
      }
    }
  }

  &__label {
    position: relative;
    width: 5.3rem;
    height: 3rem;
    background: #ccc;
    display: inline-block;
    border-radius: 3rem;
    box-sizing: border-box;
    transition: 0.4s;

    &:after {
      content: '';
      position: absolute;
      width: 3rem;
      height: 3rem;
      border-radius: 100%;
      left: 0;
      top: 0;
      z-index: 2;
      background: #fff;
      transition: 0.4s;
    }
  }
}
</style>