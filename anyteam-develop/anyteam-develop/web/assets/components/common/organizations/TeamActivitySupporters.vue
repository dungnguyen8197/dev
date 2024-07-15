<template>
  <div class="com-list-supporter">
    <p class="px-16 text-sm">※表示されている金額は前日分までの支援情報です。当日分は含みません</p>
    <div class="bg-white pb-40">
      <SupporterList :supporters="supporters" />
      <div class="text-center mt-24">
        <a :href="supportersUrl" class="organization__link">
          <button class="btn btn-wide btn-secondary pc-tablet-only">もっと見る</button>
          <div class="text-secondary text-sm sp-only">もっと見る</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import SupporterList from '../supporter/SupporterList.vue';
import { Supporter } from '../../../types/support/supporter';

export default defineComponent({
  components: { SupporterList },
  props: {
    supportersUrl: {
      type: String,
      required: true,
    },
    supporters: {
      type: Array as () => Supporter[],
      required: true,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
.organization {
  &__link {
    text-decoration-color: var(--secondary-color);
  }
}
</style>