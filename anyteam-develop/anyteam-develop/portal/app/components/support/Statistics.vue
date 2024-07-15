<template>
  <div class="statistics flex justify-between align-items-center">
    <div class="statistics__card flex justify-center align-items-center">
      <h3 class="statistics__title">支援金額</h3>
      <h1 class="statistics__amount">ー{{ formatNumber(profit) }}円</h1>
    </div>
    <div class="statistics__card flex justify-center align-items-center">
      <h3 class="statistics__title">支援者</h3>
      <nuxt-link v-if="supportersListRoute" v-bind:to="supportersListRoute">
        <h1 class="statistics__amount statistics__link">ー{{ formatNumber(supporters) }}名</h1>
      </nuxt-link>
      <h1 v-else class="statistics__amount">ー{{ formatNumber(supporters) }}名</h1>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

interface SupportersListRoute {
  name: string;
  params: {
    organization_id: string | number;
  };
}
@Component
export default class MonthSelect extends Vue {
  @Prop(Number) profit!: number;
  @Prop(Number) supporters!: number;
  @Prop(Object) supportersListRoute: SupportersListRoute | undefined;

  formatNumber(number: number) {
    return new Intl.NumberFormat().format(number);
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  margin: 2rem -1rem;

  &__card {
    background-color: var(--light-gray);
    width: 50%;
    margin: 0 1rem;
    border-radius: 4px;
  }

  &__title,
  &__amount {
    font-weight: normal;
  }

  &__link {
    color: var(--primary);
    text-decoration: underline;
    text-decoration-color: var(--primary);
  }

  @media (max-width: 576px) {
    flex-direction: column;
    &__card {
      width: 100%;
      margin: 1rem 0;
    }
  }
}
</style>
