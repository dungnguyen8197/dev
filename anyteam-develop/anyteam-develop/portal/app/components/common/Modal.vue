<template>
  <div class="overlay" @click.self="handleClickOverlay">
    <div class="modal">
      <div v-if="closeButton" class="modal__close flex justify-center align-items-center" @click="close">
        <span class="icon icon-close icon-primary"></span>
      </div>
      <div v-if="title || description" class="modal__description">
        <div v-if="title" class="text-md">{{ title }}</div>
        <br>
        <div v-if="description" class="text-xs" v-html="description"></div>
      </div>
      <slot/>
      <Button size="lg" class="mt-2" v-on:click.native="confirm">
        {{ buttonText }}
      </Button>
      <small v-if="cancel" class="modal__cancel" v-on:click="close">{{ buttonCancelText }}</small>
      <slot name="footer"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Button from "~/components/common/Button.vue";
@Component({
  components: {Button}
})
export default class Modal extends Vue {
  @Prop({ type: Boolean, default: false }) cancel: boolean | undefined;
  @Prop({ type: Boolean, default: false }) closeButton: boolean | undefined;
  @Prop({ type: Boolean, default: false }) closeOnBackdrop: boolean | undefined;
  @Prop({ type: String }) title!: string;
  @Prop({ type: String }) description: string | undefined;
  @Prop({ type: String }) buttonText!: string;
  @Prop({ type: String, default: 'キャンセル' }) buttonCancelText!: string;

  @Emit('close')
  close() {}
  @Emit('confirm')
  confirm() {}

  handleClickOverlay() {
    if (this.cancel || this.closeOnBackdrop) {
      this.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(51, 51, 51, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4.5rem 7rem;
  will-change: opacity;
  animation: fadeIn 0.2s ease-in-out;
  -webkit-animation: fadeIn 0.2s ease-in-out;
}

.modal {
  max-height: 100vh;
  min-width: 40rem;
  background: var(--white);
  border-radius: 4px;
  padding: 3.7rem 3.1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: opacity, transform;
  transform-origin: center center;
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  animation: zoomIn 0.2s ease-in-out;
  -webkit-animation: zoomIn 0.2s ease-in-out;

  &__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.4rem;
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    border-radius: 50%;
    background-color: var(--light-gray);
    color: var(--primary);
    cursor: pointer;
  }

  &__description {
    color: #333;
    margin-top: 0;
    text-align: center;
    line-height: 2;
    max-width: 38rem;
  }

  &__cancel {
    font-size: 1.4rem;
    color: var(--dark-blue);
    margin-top: 1rem;
    cursor: pointer;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
