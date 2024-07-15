<template>
  <div class="flex">
    <input
      type="checkbox"
      v-bind:checked="value"
      v-bind:id="inputId"
      v-bind:name="inputName"
      @input="handleInput"
    />
    <slot name="label" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class InputCheckBox extends Vue {
  @Prop() inputId: any
  @Prop() inputName: string | undefined;
  @Prop({ type: Boolean, default: false }) value!: boolean;

  @Emit('input')
  handleInput(event: Event) {
    return (event.target as HTMLInputElement).checked;
  }
}
</script>
