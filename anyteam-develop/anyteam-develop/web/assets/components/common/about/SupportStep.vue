<template>
  <div class="support-step">
    <div class="support-step__icon">
      <div>
        <img :src="icon" alt="step icon" />
      </div>
      <div
        v-if="line == true"
        style="
          width: 50%;
          border-right: 1px dashed;
          height: 100%;
          display: block;
        "
      ></div>
    </div>
    <div class="support-step__content">
      <h4 class="support-step__content__title">{{ title }}</h4>
      <div class="support-step__content__wrap">
        <div class="support-step__content__content" v-html="content"></div>
        <div class="support-step__content__image">
          <img :src="image" alt="step image" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    content: {
      type: String,
      required: true,
      default: '',
    },
    image: {
      type: String,
      required: true,
      default: '',
    },
    line: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
<style lang="scss" scope>
.support-step {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  &__icon {
    margin-top: 20px;
  }
  &__content {
    flex: 1;
    padding-left: 20px;
    padding-bottom: 20px;
    &__title {
      font-size: 20px;
      font-weight: 100;
      margin-bottom: 10px;
    }
    &__content {
      font-size: 12px;
      margin-bottom: 20px;
    }
    &__image {
      width: 100%;
      height: auto;
      text-align: center;
    }
    @media screen and (min-width: 768px) {
      &__wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      &__content {
        font-size: 16px;
      }
      &__image {
        text-align: right;
      }
    }
  }
}
</style>
