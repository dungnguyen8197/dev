<template>
  <CModal
    :title="title"
    :color="color"
    :show.sync="show"
    :size="size"
    @update:show="updateModal"
    centered
    close-on-backdrop
  >
    {{ message }}
    <slot></slot>
    <template #footer v-if="!cancelButton">
      <CButton :color="color" @click="show = false">OK</CButton>
    </template>
  </CModal>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class BaseModal extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly message: string | undefined;
  @Prop({default: 'primary'}) readonly color!: string;
  @Prop({default: 'sm'}) readonly size!: string;
  @Prop() isShow!: boolean;
  @Prop({ type: Boolean, default: true }) readonly cancelButton!: boolean;

  get show() {
    return this.isShow;
  }

  set show(value: boolean) {
    if (!value) {
      this.$emit('update:hide');
    }
  }

  updateModal(show: boolean, event: PointerEvent, confirm: boolean) {
    if (confirm) {
      this.$emit('update:confirm');
    }
  }
}
</script>
