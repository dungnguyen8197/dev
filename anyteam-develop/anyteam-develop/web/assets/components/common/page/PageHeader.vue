<template>
  <div
    class="page-header"
    :style="{ backgroundImage: 'url(' + background + ')' }"
  >
    <div class="page-header__center section-container">
      <h2 class="page-header__title" v-html="title"></h2>
      <slot name="icons"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    background: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    return {};
  },
});
</script>
<style lang="scss" scoped>
.page-header {
  position: relative;
  min-height: 120px;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  padding: 39px 0 34px;
  display: flex;
  align-items: center;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
      to right,
      rgba(#20375f, 0.8),
      rgba(#333, 0)
    );
    z-index: 10;
  }

  &__center {
    position: relative;
    z-index: 20;
  }
  &__title {
    color: #fff;
    font-size: 20px;
    font-weight: normal;
    margin: auto;
    line-height: 25px;
  }
  @media screen and (min-width: 768px) {
    height: 280px;
    &__title {
      font-size: 40px;
      line-height: 50px;
    }
  }
}
</style>
