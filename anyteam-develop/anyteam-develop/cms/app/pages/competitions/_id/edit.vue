<template>
  <div>
    <CRow>
      <CCol sm="12"><h3>競技情報変更</h3></CCol>
    </CRow>
    <CompetitionForm
      :competition="competition"
      @submit="handleSubmit"
    ></CompetitionForm>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CompetitionFormInterface } from "../../../interfaces/competitions.interface";
import CompetitionForm from "~/components/competitions/CompetitionForm.vue";
import { getCompetitionById, updateCompetition } from "~/api/competitions";

export default Vue.extend({
  name: "CompetitionEdit",
  components: { CompetitionForm },
  data() {
    return {
      competition: {} as CompetitionFormInterface,
    };
  },
  head() {
    return {
      title: '競技情報変更',
    }
  },
  async created() {
    await this.getDetail();
  },
  methods: {
    async getDetail(): Promise<void> {
      this.competition = await getCompetitionById(
        parseInt(this.$route.params.id)
      );
    },
    async handleSubmit(dataForm: CompetitionFormInterface) {
      await updateCompetition(parseInt(this.$route.params.id), {
        name: dataForm.name,
      });
      await this.$router.push({ path: "/competitions/list" });
    },
  },
});
</script>
