<template>
  <div>
    <div class="com-menu">
      <ul class="com-menu__items">
        <li class="com-menu__item" v-for="(menu, index) in menus" :key="index">
          <a :href="menu.link" class="com-menu__link">
            <span class="com-menu__title">{{ menu.title }}</span>
            <span class="com-menu__arrow"
              ><img src="/public/images/common/icon-arrow-right.svg"
            /></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
interface MenuItemInterface {
  title: string;
  link: string;
}
export default defineComponent({
  props: {
    menus: {
      type: Array as () => MenuItemInterface[],
      default: [],
    },
  },
});
</script>

<style lang="scss" scoped>
.com-menu {
  &__items {
    list-style: none;
    margin: auto;
    padding: 0;
    border-top: 1px solid var(--light-color);
  }
  &__link {
    text-decoration: none;
    color: var(--primary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__item {
    padding: 18px 16px;
    border-bottom: 1px solid var(--light-color);
  }
  &__title {
    font-size: 12px;
    width: 100%;
    margin-left: 0;
  }
  &__arrow {
    flex: 0 0 20px;
    display: flex;
    justify-content: end;
  }
  @media screen and (min-width: 768px) {
    &__items {
      display: flex;
      flex-flow: row wrap;
      margin-left: -16px;
      margin-right: -16px;
      border: none;
    }
    &__item {
      flex-grow: 0;
      width: calc(50% - 16px);
      background-color: var(--white-color);
      border: 1px solid var(--light-color);
      margin: 8px;
    }
  }
}
</style>
