<template>
  <div class="modal">
    <div class="modal__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    header: {
      type: String
    },
    text: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  background-color: rgba(0,0,0,.7);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow: hidden;

  &__content {
    position: absolute;
    background-color: #fff;
    width: 338px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    padding: 37px 16px;
  }
}
</style>