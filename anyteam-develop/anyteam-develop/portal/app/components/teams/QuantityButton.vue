<template>
  <div class="quantity-button">
    <button
      class="quantity-button__decrease"
      type="button" @click="decrease"
      v-bind:disabled="quantity === 0"
    >
      <img src="/icons/teams/minus.svg" />
    </button>
    <div class="quantity-button__number" v-bind:class="{ 'text-gray': quantity === 0 }">
      {{ quantity }}
    </div>
    <button class="quantity-button__increase" type="button" @click="increase">
      <img src="/icons/teams/plus.svg"/>
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Emit, Component } from 'vue-property-decorator';

@Component
export default class QuantityButton extends Vue {
  @Prop({ type: Number, default: 0 }) quantity!: number;
  
  @Emit('increase') 
  increase() {}

  @Emit('decrease')
  decrease() {}
}
</script>

<style lang="scss">
.quantity-button {
  display: flex;
  height: 2.2rem;
  & > button {
    width: 2.8rem;
    border: 1.5px solid var(--gray);
    background-color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    cursor: pointer;
    &:disabled,
    &[disabled] {
      cursor: default;
      background-color: var(--gray);
    }
  }
  &__number {
    font-size: 1.1rem;
    width: 2.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1.5px solid var(--gray);
    border-bottom: 1.5px solid var(--gray);
  }
  &__decrease {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &__increase {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
.text-gray {
  color: var(--gray);
}
</style>