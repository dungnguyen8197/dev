<template>
  <div class="step">
    <h4 class="step__title">STEP<span>{{ order }}</span></h4>
    <p class="step__description">{{ description }}</p>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class StepItem extends Vue {
  @Prop({type: Number}) order!: string;
  @Prop({type: String}) description!: string;
}
</script>

<style lang="scss" scoped>
.step {
  font-size: 1.2rem;
  width: 180px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(157,157,157,0.16);
  position: relative;
  margin: 0 12px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: -20px;
    border-width: 25px 0 25px 20px;
    border-style: solid;
    border-color: transparent transparent transparent rgba(157,157,157,0.16);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: -20px;
    border-width: 25px 0 25px 20px;
    border-style: solid;
    border-color: rgba(157,157,157,0.16) rgba(157,157,157,0.16) rgba(157,157,157,0.16) transparent;
  }

  &__title {
    margin: 0;
    color: var(--dark-blue);
    text-transform: uppercase;
    & > span {
      font-size: 1.4rem;
    }
  }

  &__description {
    margin: 0;
    color: rgba(32,55,95,0.5);
  }

  &.active {
    background-color: var(--dark-blue);
    border-color: var(--dark-blue);
    .step__title,
    .step__description {
      color: var(--white);
    }

    &::after {
      border-color: transparent transparent transparent var(--dark-blue);
    }

    &::before {
      border-color: var(--dark-blue) var(--dark-blue) var(--dark-blue) transparent;
    }
  }

  @media (max-width: 768px) {
    width: 150px;
  }

  @media (max-width: 576px) {
    width: 100%;
    margin: 0.3rem 0;
  }
}
</style>
