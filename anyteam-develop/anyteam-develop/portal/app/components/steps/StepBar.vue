<template>
  <div class="wrapper">
    <div class="steps">
      <StepItem v-bind:order="1" description="アカウント本登録" v-bind:class="activeStep === 1 && 'active'"/>
      <StepItem v-bind:order="2" description="学校情報登録" v-bind:class="activeStep === 2 && 'active'" />
      <StepItem v-bind:order="3" description="部活情報登録" v-bind:class="activeStep === 3 && 'active'" />
    </div>
    <p class="description">{{ description }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StepItem from "./StepItem.vue";

@Component({
  components: {
    StepItem
  }
})
export default class StepBar extends Vue {
  @Prop({type: String}) description: string | undefined;
  @Prop({type: Number}) activeStep!: number;
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}
.steps {
  display: flex;

  ::v-deep {
    .step:first-child {
      &::before {
        border-color: rgba(157,157,157,0.16);
      }
      &.active {
        &::before {
          border-color: var(--dark-blue);
        }
      }
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;
    width: 80%;
  }
}
.description {
  margin-top: 20px;
  font-size: 1.2rem;
  color: var(--dark-blue);
}
</style>
