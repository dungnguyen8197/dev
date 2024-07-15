<template>
  <div class="school-info my-4">
    <div class="school-info__title text-xs">{{ title }}</div>
    <div
      class="school-info__detail text-md"
      v-bind:style="{ 'border-bottom': underline ? '1px solid var(--dark-blue)' : 'none' }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class SchoolInfoItem extends Vue {
  @Prop(String) readonly title!: string;
  @Prop({ type: Boolean, default: false }) readonly underline!: boolean; 
}
</script>

<style lang="scss" scoped>
.school-info {
  max-width: 48rem;
  &__detail {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  &__title {
    color: #8D9DB9;
  }
}
</style>
