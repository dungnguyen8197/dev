<template>
  <div class="com-user-profile__avatar">
    <div class="com-user-profile__avatar-inner">
      <img
        :src="tempImageUrl ? tempImageUrl : defaultThumbnail"
        alt="user avatar"
      />
    </div>
    <label class="com-user-profile__avatar-plus">
      <p>編集する</p> 
      <input type="file" accept="image/png, image/jpeg" v-on:change="handleChange"/>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import { watch } from 'vue';

export default defineComponent({
  props: {
    thumbnailUrl: {
      type: String,
      default: '',
    },
  },
  emit: ['update:image'],
  setup(props, context) {
  const defaultThumbnail = '/public/images/common/icon-avatar-default.svg';
    const tempImageUrl = ref<string>(props.thumbnailUrl);

    watch(props, (newProps): void => {
      tempImageUrl.value = newProps.thumbnailUrl;
    });

    const handleChange = (event: Event): void => {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        tempImageUrl.value = URL.createObjectURL(file);
        context.emit('update:image', file);
      }
    }

    return {
      tempImageUrl,
      defaultThumbnail,
      handleChange,
    };
  }
})
</script>

<style lang="scss" scoped>
.com-user-profile {
  &__avatar {
    display: inline-block;
    position: relative;
  }
  &__avatar-inner {
    width: 64px;
    height: 64px;
    overflow: hidden;
    border-radius: 100%;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }
  &__avatar-plus {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 999px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      color: var(--white-color);
      font-size: 12px;
    }
    input {
      display: none;
    }
  }
}
</style>