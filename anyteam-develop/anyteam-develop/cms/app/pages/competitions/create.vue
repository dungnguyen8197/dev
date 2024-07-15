<template>
  <div>
    <CRow>
      <CCol sm="12"><h3>競技新規登録</h3></CCol>
    </CRow>
    <CompetitionForm
      :competition="competition"
      @submit="handleSubmit"
    ></CompetitionForm>
    <BaseToaster :fixedToasts="errorToasts" color="danger">
      {{ errorMessage }}
    </BaseToaster>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createCompetition } from "~/api/competitions";
import { CompetitionFormInterface } from "~/interfaces/competitions.interface";
import CompetitionForm from "../../components/competitions/CompetitionForm.vue";
import BaseToaster from "../../components/BaseToaster.vue";

export default Vue.extend({
  name: "CompetitionCreate",
  components: { CompetitionForm, BaseToaster },
  data() {
    return {
      competition: {} as CompetitionFormInterface,
      errorToasts: 0,
      errorMessage: "",
    };
  },
  head() {
    return {
      title: '競技新規登録',
    }
  },
  methods: {
    async handleSubmit(dataForm: CompetitionFormInterface) {
      try {
        await createCompetition({ name: dataForm.name });
        await this.$router.push("/competitions/list");
      } catch (error: any) {
        if (error.status === 409) {
          this.errorMessage = error.data.error.name;
        }
        this.errorToasts++;
      }
    },
  },
});
</script>
