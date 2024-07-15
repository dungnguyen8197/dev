<template>
  <FormGroup :label="label">
    <CCol
      sm="12" md="9" lg="7" xl="5"
      class="mb-3"
    >
      <div class="d-flex align-items-center justify-content-between phone__group">
        <input
          class="form-control phone__input"
          ref="input-0"
          data-index="0"
          :pattern="`[0-9]{${fields[0].length}}`"
          @input="handleFieldInput($event)"
          v-model="fields[0].value"
          :required="!isValid"
        />
        <span class="mx-2">-</span>
        <input
          class="form-control phone__input"
          ref="input-1"
          data-index="1"
          :pattern="`[0-9]{${fields[1].length}}`"
          @input="handleFieldInput($event)"
          v-model="fields[1].value"
          :required="!isValid"
        />
        <span class="mx-2">-</span>
        <input
          class="form-control phone__input"
          ref="input-2"
          data-index="2"
          :pattern="`[0-9]{${fields[2].length}}`"
          @input="handleFieldInput($event)"
          v-model="fields[2].value"
          :required="!isValid"
        />
      </div>
      <span v-if="!isValid" class="invalid-feedback d-block">{{ invalidLength(11) }}</span>
    </CCol>
  </FormGroup>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import FormGroup from '~/components/form/FormGroup.vue';
import { invalidLength } from '~/constants/messages';

@Component({
  components: {FormGroup}
})
export default class InputPhone extends Vue {
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: String, default: '' }) value!: string;
  @Prop({ type: Boolean, default: true }) isValid!: boolean;

  fields = [
    { value: '', length: 4 },
    { value: '', length: 4 },
    { value: '', length: 3 },
  ];

  invalidLength = invalidLength;

  handleFieldInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const index = parseInt(input.dataset.index as string);

    const field = this.fields[index];
    if (!field) return;

    if (field.value.length >= field.length) {
      event.preventDefault();
      field.value = value.slice(0, field.length);
      this.focusNextInput(index);
    }

    this.onInput();
  }

  focusNextInput(currentIndex: number) {
    try {
      const nextField = this.fields[currentIndex + 1];
      if (!nextField) return;
      const nextInput = this.$refs[`input-${currentIndex + 1}`] as HTMLInputElement;
      nextInput.focus();
    } catch (err) {}
  }

  get result() {
    if (this.fields.every(field => field.value.length === 0)) {
      return '';
    }
    return this.fields.map(field => field.value).join('-');
  }

  @Emit('input')
  onInput(): string {
    return this.result;
  }

  @Watch('value', { immediate: true })
  onValueChange(newValue: string): void {
    if (!newValue) return;
    this.fields.forEach((field, index) => {
      field.value = this.value.split('-')[index];
    });
  }
}
</script>

<style lang="scss" scoped>
.phone {
  &__input {
    min-width: 5rem;
  }

  &__group {
    @media screen and (max-width: 359px) {
      flex-wrap: wrap;
    }
  }
}
</style>
