<template>
  <div class="dropdown">
    <div class="dropdown__toggler" ref="toggler">
      <slot name="trigger" />
    </div>
    <div 
      class="dropdown__main" 
      v-bind:class="{ 'is-open': isOpen}"
      v-bind:style="{ width: width + 'px', right: isLeftPosition ? 'unset' : 0 }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";

type Trigger = 'click' | 'hover';

@Component
export default class Dropdown extends Vue {
  @Prop({ type: String, default: 'click'}) trigger!: Trigger;
  @Prop({ type: Number, default: 500 }) width!: number;
  @Prop({ type: Boolean, default: false }) isLeftPosition!: boolean;
  isOpen = false;

  @Ref('toggler') toggler!: HTMLElement;

  mounted() {
    if (this.trigger === 'hover') {
      this.$el.addEventListener('mouseenter', this.open);
      this.$el.addEventListener('mouseleave', this.close);
    }
    if (this.trigger === 'click') {
      window.addEventListener('click', this.handleClick);
    }
  }

  beforeDestroy() {
    if (this.trigger === 'hover') {
      this.$el.removeEventListener('mouseenter', this.open);
      this.$el.removeEventListener('mouseleave', this.close);
    }
    if (this.trigger === 'click') {
      window.removeEventListener('click', this.handleClick);
    }
  }

  handleClick(e: MouseEvent) {
    if (this.toggler.contains(e.target as Node)) {
      this.toggleOpen();
      return;
    }
    if (this.isOpen && !this.$el.contains(e.target as Node)) {
      this.close();
    }
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
</script>

<style lang="scss">
.dropdown {
  position: relative;
  &__toggler {
    cursor: pointer;
    &::before {
      content: "";
      position: absolute;
      bottom: -8px;
      left: -40px;
      right: 0px;
      height: 16px;
      background-color: transparent;
    }
  }
  &__main {
    margin-top: 0.5rem;
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1;
    padding: 12px 16px;
    background-color: var(--white);
    border: 1px solid #D8D8D8;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    text-align: unset;
    display: none;
    transform-origin: calc(100% - 20px) top;
    will-change: opacity, transform;
    overflow: hidden;
    animation: dropdownGrowth ease-in-out 0.2s;
    &.is-open {
      display: block;
    }
  }
}

@keyframes dropdownGrowth {
  from { 
    transform: scale(0);
    opacity: 0;
  } to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>