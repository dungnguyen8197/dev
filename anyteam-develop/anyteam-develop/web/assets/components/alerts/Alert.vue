<template>
  <div class="com-alert" v-show="states.isShow">
    <slot />
    <span v-if="closeIcon" class="com-alert__close" @click="hide"
      ><img src="/public/images/alert/icon-close.svg"
    /></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  props: {
    closeIcon: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const states = reactive({
      isShow: true,
    });

    const hide = () => {
      states.isShow = false;
    };

    return {
      states,
      hide,
    };
  },
});
</script>

<style lang="scss" scoped>
.com-alert {
  background: var(--light-color);
  padding: 16px 25px 16px 16px;
  font-size: 1.2rem;
  line-height: 1.8rem;
  color: var(--primary-color);
  position: relative;
  border-radius: 2px;
  &__close {
    position: absolute;
    top: 8px;
    right: 10px;
    cursor: pointer;
  }
  @media screen and (min-width: 768px) {
    text-align: center;
  }
}
</style>
