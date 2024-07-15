<template>
  <div class="com-breadcrumb-menu">
    <div class="section-container">
      <a href="/" class="icon-home">
        <img src="/public/images/breadcrumb/icon-home.svg" />
      </a>
      <ul>
        <li v-for="path in paths" :key="path">
          <a v-if="path.url !== ''" :href="path.url">
            {{ path.text }}
          </a>
          <template v-else>
            {{ path.text }}
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    paths: {
      type: [Object],
      default: [],
    },
  },
});
</script>

<style lang="scss" scoped>
.com-breadcrumb-menu {
  padding-top: 11px;
  padding-bottom: 11px;
  background: var(--light-color);
  .section-container {
    display: flex;
    flex-wrap: wrap;
  }
  .icon-home {
    margin-right: 12px;
    display: flex;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    li {
      position: relative;
      font-size: 1rem;
      text-decoration: underline;
      margin-right: 12px;
      padding-right: 12px;
      &:after {
        content: '';
        background: url('/public/images/common/icon-arrow-right.svg');
        position: absolute;
        right: -6px;
        width: 10px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center;
        top: -3px;
      }
      &:last-child {
        text-decoration: none;
        &:after {
          display: none;
        }
      }
      a {
        color: var(--primary-color);
      }
    }
  }
  @media screen and (min-width: 768px) {
    background-color: #FAFAFA;
  }
}
</style>
