<template>
  <CToaster>
    <template v-for="toast in fixedToasts">
      <CToast
        :key="toast"
        :autohide="3000"
        :show="true"
        :color="color"
      >
        <slot></slot>
      </CToast>
    </template>
  </CToaster>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class BaseToaster extends Vue {
  @Prop({default: 0}) readonly fixedToasts!: number;
  @Prop({default: 'primary'}) readonly color!: string;
}

</script>

<style scoped>

</style>
