<template>
  <li class="supporter__item">
    <div class="flex items-center w-full">
      <div class="supporter__created pc-tablet-only">
        {{ formattedCreated }}
      </div>
      <div class="supporter__icon">
        <img
          :src="icon || '/public/images/organizations/icon-supporter-default.svg'"
          alt="supporter icon"
        />
      </div>
      <div class="supporter__content">
        <div class="supporter__created sp-only">{{ formattedCreated }}</div>
        <div class="supporter__name">
          {{ name }}
          <span class="pc-tablet-only text-xs" v-if="regionName || active">({{ regionName }}/{{ active }})</span>
        </div>
        <div class="supporter__location sp-only" v-if="regionName || active">
          {{ regionName }}/{{ active }}
        </div>
      </div>
    </div>
    <div class="supporter__amount">
      {{ formattedAmount }}円
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { computed } from '@vue/reactivity';
import { formatAmount } from '../../../helpers/amount';
import { toJapaneseDateString } from '../../../helpers/datetime';

export default defineComponent({
  props: {
    regionName: String,
    active: String,
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: [String, Date],
      required: true,
    },
    icon: {
      type: String,
      default: '/public/images/organizations/icon-supporter-default.svg',
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    }
  },
  setup(props) {
    const formattedAmount = computed(() => formatAmount(props.amount));
    const formattedCreated = computed(() => toJapaneseDateString(props.createdAt, '.'));

    return {
      formattedAmount,
      formattedCreated,
    }
  }
});
</script>

<style lang="scss" scoped>
.supporter {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--light-color);
    padding: 6px 16px;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: var(--light-color);
    }
  }
  &__icon {
    width: 32px;
    height: 32px;
    overflow: hidden;
    flex: 0 0 32px;
    margin-right: 10px;
  }
  &__content {
    width: 100%;
    padding-right: 15px;
    max-width: 177px;
  }
  &__created {
    font-size: 9px;
  }
  &__name {
    font-size: 12px;
  }
  &__location {
    font-size: 9px;
  }
  &__amount {
    font-size: 12px;
    flex: 0 0 80px;
    text-align: right;
  }
  @media screen and (min-width: 768px) {
    &__created {
      width: 100px;
      color: var(--dark-gray-color);
    }
    &__item {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
}
</style>