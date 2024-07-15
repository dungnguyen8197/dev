<template>
  <Item
    v-bind:label="label"
    v-bind:errorMessage="errorMessage || invalidMessage || ''"
    v-bind:description="description"
    v-bind:labelWidth="labelWidth"
    v-bind:labelBadge="labelBadge"
    inputWidth="19rem"
  >
    <div class="form-group__wrap">
      <div v-for="(field, index) in codeFields" v-bind:key="index">
        <span v-if="index !== 0" class="form-group__dash"> - </span>
        <input
          v-bind:class="['form-group__phone', {'valid': isValid, 'invalid': errorMessage || invalidMessage}]"
          v-bind:placeholder="field.maxLength === 3 ? '000' : '0000'"
          v-bind:ref="`input-${index}`"
          v-bind:data-id="index"
          @blur="validate"
          @input="handleFieldInput($event)"
          v-model="field.value"
        />
      </div>
    </div>
  </Item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import Item from './Item.vue';
import { validateLength } from '~/helpers/validate';
import { InputTextEmit } from '~/interfaces/input-emit';

@Component({components: {Item}})
export default class InputPostalCode extends Vue {
  @Prop({type: String, default: '18rem'}) labelWidth: number | undefined;
  @Prop({type: String}) label!: string;
  @Prop({type: String}) labelBadge: string | undefined;
  @Prop({type: String}) errorMessage!: string;
  @Prop({type: String}) description: string | undefined;
  @Prop({type: String}) value!: string;

  codeFields = [
    {value: '', maxLength: 3},
    {value: '', maxLength: 4},
  ];
  invalidMessage = '';
  isValid = false;
  
  get postalCode(): string {
    return this.codeFields.reduce((phone, item, index) => {
      return phone + (index !== 0 ? '-' : '') + item.value
    }, '');
  }

  @Watch('value')
  updateValue() {
    if (this.value) {
      this.value.split('-').map((field, index) => {
        this.codeFields[index].value = field;
      })
      this.validate();
    }
  }

  @Watch('isValid')
  onUpdateIsValid() {
    this.handleInput();
  }

  @Emit('handleInput')
  handleInput(): InputTextEmit {
    this.validate();
    return {
      value: this.postalCode,
      isValid: this.isValid,
    }
  }

  validate() {
    const value = this.postalCode.replace(/\-/g, '');
    this.invalidMessage = validateLength(value, 7);
    this.isValid = !this.invalidMessage;
  }

  handleFieldInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let value = input.value;
    let index = parseInt(input.dataset.id as string);

    this.numberFilter(index);

    const field = this.codeFields[index];
    if (!field) return;

    if (field.value.length >= field.maxLength) {
      e.preventDefault();
      field.value = value.slice(0, field.maxLength);
      this.focusNextInput(index);
    }
    this.handleInput();
  }

  numberFilter(index: number) {
    this.codeFields[index].value = this.codeFields[index].value.replace(/[^0-9]/g, '');
  }

  focusNextInput(currentIndex: number) {
    try {
      const nextField = this.codeFields[currentIndex + 1];
      if (nextField) {
        const nextInput = this.$refs[`input-${currentIndex + 1}`] as HTMLInputElement[];
        nextInput[0].focus();
      }
    } catch (error) {}
  }
}
</script>


<style lang="scss" scoped>
.form-group {
  &__wrap {
    display: flex;
    align-items: center;
  }

  &__phone {
    max-width: 8rem;
    height: 4.2rem;
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
  }

  &__dash {
    margin: 0 0.7rem;
    text-align: center;
  }
}
</style>
