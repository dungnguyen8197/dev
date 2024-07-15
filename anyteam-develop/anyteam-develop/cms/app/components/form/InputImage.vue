<template>
  <FormGroup :label="label">
    <div
      class="m-3 input-image"
      @click="$refs.inputImage.click()"
    >
      <div v-if="!tempImageUrl"
           class="input-image__placeholder"
      >
        +
      </div>
      <img v-else :src="tempImageUrl" alt="" class="input-image__preview" />
    </div>
    <input type="file" hidden ref="inputImage" @change="onChange" accept="image/png, image/jpeg"/>
  </FormGroup>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import FormGroup from '~/components/form/FormGroup.vue';
@Component({
  components: { FormGroup }
})
export default class InputImage extends Vue {
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: String, default: '' }) imageUrl!: string;

  tempImageUrl: string = '';

  @Watch('imageUrl', { immediate: true })
  onImageUrlChange(newVal: string) {
    this.tempImageUrl = newVal;
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files) return;

    const file = input.files[0];
    this.tempImageUrl = URL.createObjectURL(file);
    input.value = '';

    this.changeImage(file);
  }

  @Emit('change:image')
  changeImage(image: File): File {
    return image;
  }
}
</script>

<style lang="scss" scoped>
.input-image {
  width: 100px;
  height: 100px;
  cursor: pointer;

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    background-color: var(--light);
    border: 2px dashed var(--dark);
  }

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
