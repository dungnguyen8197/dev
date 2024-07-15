<template>
  <div class="com-accordion__item" :class="{ 'is-open': states.isOpen }">
    <div class="com-accordion__title" @click="toggleContent">
      <div class="flex items-center">
        <div class="pc-tablet-only">
          <span class="com-accordion__badge">Q</span>
        </div>
        <span>{{ item.title }}</span>
      </div>
      <span class="com-accordion__icon-arrow"
        ><img src="/public/images/common/icon-arrow-right.svg"
      /></span>
    </div>
    <div class="com-accordion__content" v-show="states.isOpen">
      {{ item.content }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
interface ItemInterface {
  title: String;
  content: String;
}
export default defineComponent({
  props: {
    item: {
      type: Object as () => ItemInterface,
      default: [],
    },
  },
  setup() {
    const states = reactive({
      isOpen: false,
    });
    const toggleContent = () => {
      states.isOpen = !states.isOpen;
    };
    return { states, toggleContent };
  },
});
</script>

<style lang="scss" scoped>
.com-accordion {
  &__item {
    border: 1px solid var(--light-color);
    margin-top: 8px;
    border-radius: 2px;
    background-color: var(--white-color);
  }
  &__badge {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: var(--secondary-color);
    color: var(--white-color);
    margin-right: 12px;
  }
  &__icon-arrow {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0px, -50%) rotate(90deg);
  }
  &__item.is-open &__icon-arrow {
    transform: translate(0px, -50%) rotate(-90deg);
  }
  &__title {
    position: relative;
    padding: 14px 32px 14px 16px;
    color: var(--primary-color);
    cursor: pointer;
  }
  &__content {
    padding: 14px 32px 14px 16px;
  }
  @media screen and (min-width: 768px) {
    &__item {
      margin: 16px;
      font-size: 15px;
    }
  }
}
</style>
