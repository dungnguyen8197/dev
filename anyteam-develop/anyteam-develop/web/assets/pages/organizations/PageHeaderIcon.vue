<template>
  <div class="page-header__icons">
    <div class="page-header__icon">
      <img src="/public/images/common/icon-header-place.svg" />
      {{ region }}
    </div>
    <div class="page-header__icon">
      <img src="/public/images/common/icon-header-house.svg" />
      {{ type }}
    </div>
    <div class="page-header__icon" v-if="supporterCount">
      <img src="/public/images/common/icon-header-user.svg" />
      {{ supporterCountFormatted }}人
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { formatAmount } from '../../helpers/amount';

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
      default: '',
    },
    type: {
      type: String,
      required: true,
      default: '',
    },
    supporterCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const supporterCountFormatted = formatAmount(props.supporterCount);
    return {
      supporterCountFormatted,
    };
  },
});
</script>
<style lang="scss" scoped>
.page-header {
  &__icons {
  display: flex;
  margin-top: 14px;
  }
  &__icon {
    display: flex;
    color: #fff;
    margin-right: 14px;
    font-size: 1rem;
    img {
      margin-right: 4px;
    }
  }
  @media screen and (min-width: 768px) {
    &__icons {
      margin-top: 24px;
    }
    &__icon {
      font-size: 2rem;
      margin-right: 20px;
      img {
        height: 24px;
      }
    }
  }
}
</style>
