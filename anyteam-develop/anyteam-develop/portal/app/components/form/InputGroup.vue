<template>
  <div class="input-group">
    <label class="input-group__label">
      {{ label }}
      <span v-if="labelBadge" class="input-group__label-badge">{{labelBadge}}</span>
    </label>
    <div class="input-group__control">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'

@Component
export default class InputGroup extends Vue {
  @Prop({type: String}) label!: string;
  @Prop({ type: String }) labelBadge: string | undefined;
}
</script>

<style lang="scss" scoped>
.input-group {
  text-align: left;
  display: flex;
  align-items: flex-start;

  &__label {
    margin-top: 3.5rem;
    min-width: 18rem;
    display: block;
    font-size: 1.2rem;
    line-height: 1.4rem;
    color: var(--dark-blue);
    &-badge {
      background-color: var(--red);
      color: var(--white);
      padding: 0.2rem 0.4rem;
      font-size: 1rem;
      border-radius: 4px;
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
