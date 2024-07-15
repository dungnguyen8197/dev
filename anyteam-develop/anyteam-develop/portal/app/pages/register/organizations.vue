<template>
  <div>
    <Header v-bind:title="organization.name" />
    <StepBar 
      description="こちらの学校情報は控除の手続き等で必要になります。 ※後から編集することもできます" 
      v-bind:activeStep="2"
    />
    <OrganizationForm
      v-bind:organizationId="organization_id" 
      v-bind:error="error"
      v-bind:errorText="errorText"
      buttonText="登録"
      @submit="handleSubmit"
    />
    <Modal
      v-if="submitDone" @confirm="closeModal"
      title="登録が完了しました"
      description="引き続き部活情報を登録してください"
      buttonText="部活情報登録へ"
    />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import Header from '~/components/Header.vue';
import Modal from "~/components/common/Modal.vue";
import StepBar from "~/components/steps/StepBar.vue";
import OrganizationForm from "~/components/organization/OrganizationForm.vue";
import { registerFailureMessage } from "~/api/messages";
import { OrganizationRegisterMixin } from "~/mixins/organization-register";

@Component({
  head() {
    return {
      title: "学校情報登録",
    };
  },
  layout: 'auth',
  components: {
    Header,
    StepBar,
    OrganizationForm,
    Modal,
  },
})
export default class RegisterOrganization extends mixins(OrganizationRegisterMixin) {
  errorText = registerFailureMessage;

  closeModal(): void {
    this.$router.push({ name: 'register-teams' });
  }
}
</script>
