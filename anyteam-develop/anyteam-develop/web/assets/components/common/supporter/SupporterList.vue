<template>
  <ul class="supporter__items">
    <SupporterItem 
      v-for="supporter in supporters"
      :supporter="supporter"
      :key="supporter.id"
      :name="supporter.name"
      :icon="supporter.icon"
      :created-at="supporter.createdAt"
      :amount="supporter.amount"
      :region-name="supporter.regionName"
      :active="supporter.active"
    />
  </ul>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import SupporterItem from './SupporterItem.vue';
import { Supporter } from '../../../types/support/supporter';

export default defineComponent({
  components: {
    SupporterItem,
  },
  props: {
    supporters: {
      type: Array as () => Array<Supporter>,
      default: [],
      required: true,
    }
  }
});
</script>

<style lang="scss" scoped>
.supporter__items {
  padding-left: 0;
  margin: 12px 0;
  border-top: 1px solid var(--light-color);
  border-bottom: 1px solid var(--light-color);
  background-color: var(--white-color);
}
</style>