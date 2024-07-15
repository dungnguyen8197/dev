<template>
  <div class="container">
    <Header title="部活登録" />
    <StepBar
      description="部活を登録を入力してください ※後から追加、編集することもできます"
      v-bind:activeStep="3"
    />
    <TeamsForm
      ref="refTeamsForm"
      buttonText="登録"
      @submit="handleSubmit"
      is-initial
    />
    <Modal
      name="confirmModal"
      cancel
      v-show="showConfirmModal"
      @confirm="confirmRegister"
      @close="
        () => {
          showConfirmModal = false; 
        }
      "
      title="部活登録を完了してもよろしいですか？"
      description="公開設定された部活は<br>ANYTEAMに表示され支援募集が開始されます。"
      buttonText="登録"
    />
    <Modal
      name="successModal"
      v-show="showSuccessModal"
      @confirm="toOrganizationInfoPage"
      title="登録が完了しました"
      buttonText="トップへ"
    />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import StepBar from "~/components/steps/StepBar.vue"; 
import Modal from "~/components/common/Modal.vue";
import SubmitButton from "~/components/form/SubmitButton.vue";
import Table from "~/components/common/Table.vue";
import Button from "~/components/common/Button.vue";
import TeamsForm from "~/components/teams/TeamsForm.vue";
import { TeamsRegisterMixin } from "~/mixins/teams-register";

@Component({
  components: {
    TeamsForm,
    Button,
    Table,
    SubmitButton,
    Modal,
    StepBar
  },
  layout: "auth",
  head() {
    return {
      title: "部活登録",
    };
  },
})
export default class RegisterTeams extends mixins(TeamsRegisterMixin) {
  async toOrganizationInfoPage() {
    await this.$router.push({
      name: 'organizations-organization_id',
      params: { organization_id: `${this.$auth.user?.organization_id}` },
    });
  }
}
</script>
