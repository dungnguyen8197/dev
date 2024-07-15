<template>
  <div class="form-group">
    <label v-if="label" class="form-group__label">
      {{ label }}
      <span class="badge badge-secondary" v-if="badge">{{ badge }}</span>
    </label>
    <div class="form-group__input" :class="{ invalid: !!errorMessage }">
      <slot />
      <div v-bind:class="errorClass">
        <p class="form-group__error-notice">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    label: {
      type: String,
    },
    badge: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    errorClass: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin-bottom: 2.4rem;

  &__label {
    display: block;
    font-size: 1.4rem;
    line-height: 1.4rem;
    margin-bottom: 1rem;
  }

  &__error-notice {
    font-size: 1.2rem;
    color: var(--danger-color);
    margin: 0;
  }
  &__input {
    margin-top: 6px;
  }
  &__input.invalid :deep(input),
  &__input.invalid :deep(textarea) {
    border: 1px solid var(--danger-color);
    background-color: rgba(#FF2B52, 0.08);
  }
  @media screen and (min-width: 768px) {
    &__label {
      flex: 0 0 62px !important;
    }
  }
}
</style>
