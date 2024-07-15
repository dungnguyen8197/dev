<template>
  <button
    type="button"
    v-bind:class="[{'outline': outline}, size]"
    v-bind:style="{'--color': `var(--${color})`}"
  >
    <div class="flex align-items-center justify-center">
      <slot/>
    </div>
  </button>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

type ButtonColor = 'primary' | 'gray' | 'red' | 'dark-blue';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component
export default class Button extends Vue {
  @Prop({ type: String, default: 'primary' }) color!: ButtonColor;
  @Prop({ type: String, default: 'md' }) size!: ButtonSize;
  @Prop({ type: Boolean, default: false }) outline!: boolean;

  cssVars() {
    return {
      '--color': `var(--${this.color})`,
      '--color-opacity': `rgba(var(--${this.color}), 0.7)`,
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
  border: 1px solid var(--color);
  outline: none;
  color: var(--white);
  background-color: var(--color);
  border-radius: 4px;
  font-size: 1.2rem;

  &.sm {
    padding: 0.4rem 0.8rem;
    min-width: 3.4rem;
  }

  &.md {
    padding: 0.8rem 1.2rem;
    min-width: 8rem;
  }

  &.lg {
    padding: 1rem 1.6rem;
    min-width: 24rem;
  }

  &.outline {
    background-color: var(--white);
    color: var(--color);
  }

}
</style>
