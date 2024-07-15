<template>
  <div class="bg-white w-50 px-8 py-8 type-select" :class="{ active }">
    <span class="type-select__radio"></span>
    <div class="type-select__content">
      <div>
        <img :src="image" alt="" class="sp-only mb-6">
        <div class="mb-6">{{ title }}</div>
        <div class="text-xs">{{ description }}</div>
      </div>
      <div class="text-secondary text-normal">
        {{ formatAmount(amount) }}<span class="text-xs">{{ currency }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { formatAmount } from '../../../helpers/amount';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    image: {
      type: String,
      required: true,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: '',
    },
    active: {
      type: Boolean,
    }
  },
  setup() {
    return { 
      formatAmount
    }
  }
})
</script>

<style lang="scss" scoped>
.type-select {
  position: relative;
  border-radius: 4px;
  border: 2px solid var(--border-gray);
  cursor: pointer;
  text-align: center;

  &.active {
    border: 2px solid var(--secondary-color);
    .type-select__radio {
      border: 3px solid var(--secondary-color);
    }
  }
  &__radio {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid var(--dark-gray-color);
  }
  @media screen and (min-width: 768px) {
    text-align: left;
    &__content {
      margin-left: 30px;
    }
  }
}
</style>