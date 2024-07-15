<template>
  <Item
    v-bind:label="label"
    v-bind:errorMessage="errorMessage"
    v-bind:description="description"
    v-bind:labelWidth="labelWidth"
    v-bind:is-vertical="isVertical"
  >
    <select
      class="form-group__select"
      @input="handleInput"
      v-bind:name="inputName"
      v-bind:style="`width: ${inputWidth}`"
      v-bind:id="inputId"
      v-bind:value="value"
      v-on:input="handleInput"
    >
      <option value="" disabled>{{ defaultOption }}</option>
      <slot/>
    </select>
  </Item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import Item from './Item.vue'

@Component({ components: { Item } })
export default class InputSelect extends Vue {
  @Prop() inputId: any
  @Prop() inputName: string | undefined;
  @Prop({type: String, default: '18rem'}) labelWidth: number | undefined;
  @Prop({type: String, default: '100%'}) inputWidth: string | undefined;
  @Prop({ type: String }) label!: string
  @Prop({ type: String }) defaultOption!: string
  @Prop({ type: String }) errorMessage!: string
  @Prop({ type: String }) description: string | undefined;
  @Prop({ type: [String, Number] }) value: string | number | undefined;
  @Prop({ type: Boolean, default: false }) isVertical: boolean | undefined;

  @Emit('handleInput')
  handleInput(event: Event) {
    const input = event.target as HTMLSelectElement;
    return input.value;
  }
}
</script>


<style lang="scss" scoped>
.form-group {
  &__select {
    height: 4.2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 4px;
    background-color: var(--input-bg);
    padding: 0;
    text-indent: 1.2rem;
    color: var(--dark-blue);
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("/icons/arrow-down.svg");
    background-repeat: no-repeat;
    background-position-x: calc(100% - 10px);
    background-position-y: 50%;

    &:invalid {
      color: var(--gray);
    }

    [disabled] {
      color: var(--dark-blue);
      opacity: 0.5;
    }

    option {
      color: var(--dark-blue);
    }
  }
}
</style>
