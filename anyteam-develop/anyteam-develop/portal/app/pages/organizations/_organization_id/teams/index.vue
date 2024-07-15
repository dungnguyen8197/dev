<template>
  <div>
    <Header title="部活登録" />
    <TeamsForm
      ref="refTeamsForm"
      buttonText="登録"
      @submit="handleSubmit"
    />
    <Modal
      title="部活登録を完了してもよろしいですか？"
      description="登録を完了すると、ステータスが変更された部活は<br>直ちに変更が適応されます"
      buttonText="登録"
      name="confirmModal"
      cancel
      v-if="showConfirmModal"
      @confirm="confirmRegister"
      @close="showConfirmModal = false"
    />
    <Modal
      title="登録が完了しました"
      buttonText="閉じる"
      name="successModal"
      v-if="showSuccessModal"
      @confirm="showSuccessModal = false"
    />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import Header from "~/components/Header.vue";
import TeamsForm from "~/components/teams/TeamsForm.vue";
import Modal from "~/components/common/Modal.vue";
import { TeamsRegisterMixin } from "~/mixins/teams-register";

@Component({
  head() {
    return {
      title: "部活登録",
    };
  },
  middleware: ['forbidden'],
  components: { TeamsForm, Header, Modal },
})
export default class OrganizationTeamsRegister extends mixins(TeamsRegisterMixin) {}
</script>

