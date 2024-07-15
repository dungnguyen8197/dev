<template>
  <Item
    v-bind:label="label"
    v-bind:errorMessage="errorMessage"
    v-bind:description="description"
    v-bind:labelWidth="labelWidth"
    v-bind:labelBadge="labelBadge"
  >
    <div class="form-group__image">
      <input type="file" accept="image/png, image/jpeg" ref="imageInput" hidden @change="updateImage">
      <div
        class="form-group__input"
        v-bind:class="!tempImage && 'empty'"
        v-bind:style="tempImage && {backgroundImage: `url(${tempImage})`, backgroundSize: 'cover'}"
        @click="triggerImageInput"
      >
        <span v-if="!tempImage"><font-awesome-icon v-bind:icon="['far', 'images']" /></span>
      </div>
      <div class="form-group__title">
        <p><span><font-awesome-icon v-bind:icon="['far', 'images']" /></span>&nbsp;{{ title }}</p>
        <p>{{ subtitle }}</p>
      </div>
    </div>
  </Item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref, Watch } from 'vue-property-decorator';
import Item from './Item.vue';

@Component({ components: { Item } })
export default class InputImage extends Vue {
  @Prop({ type: String, default: '18rem' }) labelWidth: number | undefined;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) labelBadge: string | undefined;
  @Prop({ type: String }) errorMessage!: string;
  @Prop({ type: String }) title: string | undefined;
  @Prop({ type: String }) subtitle: string | undefined;
  @Prop({ type: String }) description: string | undefined;
  @Prop({ type: String }) preview: string | undefined;

  @Ref() imageInput!: HTMLInputElement;

  tempImage: string = '';
  image: File | undefined = undefined;

  @Watch('preview', { immediate: true })
  onPreviewChange(newVal: string) {
    this.tempImage = newVal;
  }

  triggerImageInput() {
    this.imageInput.click();
  }

  updateImage(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.tempImage = URL.createObjectURL(file);
      this.image = file;
    }

    this.handleInput();
    input.value = '';
  }

  @Emit('handleInput')
  handleInput() {
    if (!this.image) return;
    return this.image;
  }
}
</script>


<style lang="scss" scoped>
.form-group {
  span {
    font-size: 1.4rem;
    color: var(--dark-blue);
  }

  &__image {
    display: flex;
    align-items: center;
  }

  &__input {
    width: 8rem;
    height: 8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &.empty {
      background-color: var(--light-gray);
      border: 2px dashed var(--gray);
    }
  }

  &__title {
    color: var(--dark-blue);
    font-size: 1.2rem;
    margin-left: 4rem;
    text-align: center;
  }

  @media screen and (max-width: 576px) {
    &__image {
      flex-direction: column;
    }

    &__title {
      margin-left: 0;
    }
  }
}
</style>
