<template>
  <div class="header">
    <h2 class="header__title">{{ title }}</h2>
    <div class="header__title-sub">{{ subTitle }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly subTitle: string | undefined;
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  text-align: center;
  margin: 4rem 0;

  &__title {
    color: var(--dark-blue);
    display: inline-block;
    font-size: 2.4rem;
    line-height: 2.4rem;
    font-weight: normal;

    &-sub {
      font-size: 1.2rem;
      line-height: 1.2rem;
      color: var(--dark-blue);
    }
  }
}
</style>
