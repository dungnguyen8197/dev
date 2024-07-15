<template>
  <Item
    v-bind:label="label"
    v-bind:errorMessage="errorMessage || invalidMessage || ''"
    v-bind:description="description"
    v-bind:labelWidth="labelWidth"
    v-bind:labelBadge="labelBadge"
    v-bind:inputWidth="inputWidth"
    v-bind:is-vertical="isVertical"
  >
    <input
      ref="input"
      v-bind:class="classNames"
      v-bind:value="value"
      @input="emitInput"
      @blur="validate"
      v-bind:type="inputType"
      v-bind:id="inputId"
      v-bind:name="inputName"
      v-bind:placeholder="placeholder"
      v-bind:readonly="readonly"
      autocomplete="off"
    />
  </Item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import Item from './Item.vue'
import { InputTextRule } from '~/interfaces/validate';
import { InputTextEmit } from '~/interfaces/input-emit';
import {
  validateEmail,
  validateLength,
  validateMaxLength,
  validateMinLength,
  validateRequired
} from '~/helpers/validate';

@Component({ components: { Item } })
export default class InputText extends Vue {
  @Prop({ type: String, default: 'text' }) inputType!: string
  @Prop() inputId: any
  @Prop() inputName: string | undefined;
  @Prop({ type: String, default: '18rem' }) labelWidth: string | undefined;
  @Prop({ type: String }) labelBadge: string | undefined;
  @Prop({ type: String, default: '100%' }) inputWidth: string | undefined;
  @Prop({ type: String }) label!: string
  @Prop({ type: String }) placeholder!: string
  @Prop({ type: String }) errorMessage!: string
  @Prop({ type: String }) description: string | undefined;
  @Prop({ type: Object }) validateRule: InputTextRule | undefined;
  @Prop({ type: String, default: '' }) value!: string;
  @Prop({ type: Boolean, default: false }) readonly!: boolean;
  @Prop({ type: Boolean, default: false }) isVertical: boolean | undefined;

  invalidMessage = '';
  isValid = false;
  get classNames() {
    return [
      'form-group__text',
      { 
        'valid': this.isValid, 
        'invalid': this.errorMessage || this.invalidMessage,
        'readonly': this.readonly,
      },
    ] 
  }

  mounted() {
    if (this.value) this.validate();
  }

  createValidateMessage(): string {
    const input = this.$refs.input as HTMLInputElement;
    if (!input) return '';

    const messages = [];

    if (this.validateRule?.required) {
      messages.push(validateRequired(input.value));
    }

    if (this.validateRule?.length) {
      messages.push(validateLength(input.value, this.validateRule.length));
    }

    if (this.validateRule?.minLength) {
      messages.push(validateMinLength(input.value, this.validateRule.minLength));
    }

    if (this.validateRule?.maxLength) {
      messages.push(validateMaxLength(input.value, this.validateRule.maxLength));
    }

    if (this.validateRule?.email) {
      messages.push(validateEmail(input.value));
    }

    return messages.find(message => message !== '') || '';
  }

  validate() {
    this.invalidMessage = this.createValidateMessage();
    this.isValid = this.invalidMessage === '';
  }

  @Emit('handleInput')
  emitInput(): InputTextEmit {
    const input = this.$refs.input as HTMLInputElement;
    if (this.validateRule?.number) {
      input.value = input.value.replace(/[^0-9]/g, '');
    }
    this.validate();

    return {
      value: input.value,
      isValid: this.isValid,
    }
  }

  @Watch('isValid')
  onValidate() {
    this.emitInput();
  }

  @Watch('value')
  onValueChange() {
    setTimeout(() => {
      this.validate();
    }, 100);
  }
}
</script>


<style lang="scss" scoped>
.form-group {
  &__text {
    height: 4.2rem;
    width: 100%;
    font-size: 1.2rem;
    border: none;
    border-radius: 4px;
    background-color: var(--input-bg);
    padding: 0;
    text-indent: 1.2rem;
    color: var(--dark-blue);

    &::placeholder {
      color: var(--dark-blue);
      opacity: 0.5;
    }

    &.valid {
      border: 1px solid var(--green);
    }

    &.invalid {
      border: 1px solid var(--red);
    }

    &.readonly {
      background-color: #EEE;
    }
  }
}
</style>
