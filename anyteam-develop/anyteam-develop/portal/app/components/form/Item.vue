<template>
  <div class="form-group" v-bind:class="{ 'flex align-items-start': !isVertical}">
    <label class="form-group__label" v-bind:style="{ minWidth: labelWidth, marginBottom: isVertical ? '5px' : 0 }">
      {{ label }}
      <span v-if="labelBadge" class="form-group__label-badge">{{ labelBadge }}</span>
    </label>
    <div class="form-group__control" v-bind:style="{ width: inputWidth }">
      <slot />
      <p class="form-group__notice" v-if="description">{{ description }}</p>
      <p class="form-group__notice form-group__notice--error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Item extends Vue {
  @Prop({ type: String }) label!: string
  @Prop({ type: String }) labelBadge: string | undefined;
  @Prop({ type: String, default: '' }) errorMessage!: string;
  @Prop({ type: String }) description: string | undefined;
  @Prop({ type: String, default: '18rem' }) labelWidth: string | undefined;
  @Prop({ type: String, default: '100%' }) inputWidth: string | undefined;
  @Prop({ type: Boolean, default: false }) isVertical: boolean | undefined;
}
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin: 1rem 0;

  &__label {
    display: block;
    font-size: 1.2rem;
    line-height: 1.4rem;
    color: var(--dark-blue);
    margin-top: 1.6rem;
    &-badge {
      background-color: var(--red);
      color: var(--white);
      padding: 0.2rem 0.4rem;
      font-size: 1rem;
      border-radius: 4px;
    }
  }

  &__notice {
    font-size: 1.2rem;
    color: var(--dark-blue);
    margin: 0;
    padding-left: 1.2rem;

    &--error {
      color: var(--red);
      margin-top: 0.2rem;
    }
  }

  &__control {
    flex: 1;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;

    &__label {
      width: 100%;
      margin-bottom: 0.8rem;
    }

    &__control {
      width: 100%;
    }
  }
}
</style>
