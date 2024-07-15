<template>
  <CRow>
    <CCol sm="12" md="2" class="mt-2">
      <label class="form-control-label">{{ label }}</label>
    </CCol>
    <slot/>
  </CRow>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FormGroup extends Vue {
  @Prop({ type: String, default: '' }) label!: string;

}
</script>
