<template>
  <ul>
    <li v-for="(menu, index) in menus" :class="[menu.active == true ? 'is-active' : '']" :key="index">
      <a :href="menu.url">{{ menu.text }}</a>
      <span v-if="index !== menus.length - 1" class="divider pc-tablet-only"></span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    let menus = [
      { url: '/about', text: 'ANYTEAMとは？', active: false },
      { url: '/about/support', text: '支援の流れ', active: false },
    ];
    menus = menus.map((menu) => {
      menu.active =
        window.location.pathname.slice(-menu.url.length) == menu.url
          ? true
          : false;
      return menu;
    });
    return {
      menus,
    };
  },
});
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--light-color);
  li {
    border-bottom: 1px solid var(--light-color);
    position: relative;
    &.is-active,
    &:hover {
      background-color: var(--light-color);
    }
    &:after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      right: 10px;
      top: 50%;
      transform: translate(0%, -50%);
      position: absolute;
      background: url('/public/images/common/icon-arrow-right.svg') no-repeat
        center center;
    }
  }
  a {
    font-size: 1.2rem;
    text-decoration: none;
    color: var(--primary-color);
    padding: 14px 24px;
    display: block;
  }
}
@media screen and (min-width: 768px) {
  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none;
    .divider {
      width: 1px;
      height: 16px;
      display: block;
      background-color: var(--primary-color);
      margin-left: 2rem;
      margin-right: 2rem;
    }
    li {
      border: none;
      display: flex;
      align-items: center;
      &:after {
        display: none;
      }
      &.is-active,
      &:hover {
        background-color: transparent;
        a {
          color: var(--primary-color);
        }
      }
      a {
        font-size: 16px;
        color: var(--dark-gray-color);
      }
    }
  }
}
</style>
