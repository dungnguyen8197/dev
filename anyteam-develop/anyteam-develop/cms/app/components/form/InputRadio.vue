<template>
  <FormGroup :label="label">
    <CCol sm="12" md="4">
      <CInputRadioGroup
        :options="options"
        :checked="computedValue"
        :invalidFeedback="invalidFeedback"
        @update:checked="input"
        :required="required"
        custom
        inline
      />
    </CCol>
  </FormGroup>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import FormGroup from '~/components/form/FormGroup.vue';
import { SelectOption } from '~/interfaces/select-option';

@Component({
  components: {
    FormGroup,
  }
})
export default class InputRadio extends Vue {
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: Array, default: () => [] }) options!: SelectOption[];
  @Prop({ type: String, default: '' }) invalidFeedback!: string;
  @Prop([String, Number, Boolean]) value!: string | number | boolean;
  @Prop({ type: Boolean, default: false }) required!: boolean;

  get computedValue(): string {
    return `${this.value}`;
  }

  @Emit('input')
  input(value: string) {
    if (typeof this.value === 'boolean') {
      return value === 'true';
    }

    if (typeof this.value === 'number') {
      return Number(value);
    }
  }
}
</script>
