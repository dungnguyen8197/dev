<template>
  <FormGroup :label="label">
    <CCol sm="12" md="9" lg="7" xl="5">
      <CInput
        autocomplete="off"
        :placeholder="placeholder"
        :value="value"
        :name="name"
        :type="type"
        :id="id"
        :pattern="pattern"
        :required="required"
        :invalidFeedback="invalidFeedback"
        @input="input"
      />
    </CCol>
  </FormGroup>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import FormGroup from "~/components/form/FormGroup.vue";

@Component({
  components: {
    FormGroup,
  },
})
export default class InputText extends Vue {
  @Prop({ type: String, default: "" }) label!: string;
  @Prop({ type: String, default: "" }) placeholder!: string;
  @Prop({ type: String, default: "" }) value!: string;
  @Prop({ type: String, default: "" }) invalidFeedback!: string;
  @Prop({ type: String, default: "text" }) type!: string;
  @Prop({ type: Boolean, default: false }) required!: boolean;
  @Prop(String) name: string | undefined;
  @Prop(String) id: string | undefined;
  @Prop(String) pattern: string | undefined;

  @Emit("input")
  input(event: string): string {
    return event;
  }
}
</script>
