<template>
  <CForm class="needs-validation" novalidate @submit.prevent="handleSubmit">
    <CCardBody class="mt-3">
      <InputText
        label="競技名"
        v-model="competition.name"
        :invalidFeedback="invalidRequired"
        required
      ></InputText>
    </CCardBody>
    <CRow class="mt-3">
      <CCol sm="12">
        <CButton color="primary" square type="submit"> 保存 </CButton>
      </CCol>
    </CRow>
  </CForm>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { invalidRequired } from "~/constants/messages";
import { CompetitionFormInterface } from "../../interfaces/competitions.interface";
import InputText from "../form/InputText.vue";

export default Vue.extend({
  name: "CompetitionForm",
  components: { InputText },
  props: {
    competition: {
      required: true,
      type: Object as PropType<CompetitionFormInterface>,
    },
  },
  data() {
    return {
      formValid: true,
      invalidRequired: invalidRequired,
    };
  },
  methods: {
    validator(val: string) {
      this.formValid = val ? val.length >= 0 : false;
      return this.formValid;
    },
    async handleSubmit(event: Event) {
      const form = event.target as HTMLFormElement;
      form.classList.add("was-validated");
      if (form.checkValidity()) {
        this.$emit("submit", this.competition);
      }
      return false;
    },
  },
});
</script>

<style scoped>
.card-body {
  background: white;
}
</style>
