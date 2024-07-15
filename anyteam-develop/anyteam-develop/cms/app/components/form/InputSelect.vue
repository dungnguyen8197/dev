<template>
  <FormGroup :label="label">
    <CCol sm="12" md="9" lg="7" xl="5">
      <CSelect
        :options="options"
        :value="value"
        :name="name"
        :required="required"
        @update:value="input"
        :invalidFeedback="invalidFeedback"
      />
    </CCol>
  </FormGroup>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';
import FormGroup from '~/components/form/FormGroup.vue';
import { SelectOption } from '~/interfaces/select-option';

@Component({
  components: {FormGroup}
})
export default class InputSelect extends Vue {
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: Array, default: () => [] }) options!: SelectOption[];
  @Prop([String, Number]) value!: string | number;
  @Prop({ type: String, default: '' }) invalidFeedback!: string;
  @Prop({ type: String, default: '' }) name!: string;
  @Prop({ type: Boolean, default: false }) required!: boolean;

  @Emit('input')
  input(value: string | number) {
    return (value !== '') ? value : null;
  }
}
</script>
