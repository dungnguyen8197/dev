<template>
  <div>
    <Header v-bind:title="organization.name" />
    <OrganizationForm 
      v-bind:organizationId="organization_id"
      v-bind:error="error"
      v-bind:errorText="errorText"
      buttonText="登録"
      @submit="handleSubmit"
    />
    <Modal
      v-if="submitDone" v-on:confirm="closeModal" v-on:close="closeModal"
      closeButton
      title="登録が完了しました"
      buttonText="戻る"
    />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import Header from "~/components/Header.vue";
import OrganizationForm from "~/components/organization/OrganizationForm.vue";
import Modal from "~/components/common/Modal.vue";
import { updateFailureMessage } from '~/api/messages';
import { OrganizationRegisterMixin } from '~/mixins/organization-register';

@Component({
  head() {
    return {
      title: "学校情報変更"
    };
  },
  middleware: ['forbidden'],
  components: {
    Header,
    OrganizationForm,
    Modal,
  },
})
export default class OrganizationEdit extends mixins(OrganizationRegisterMixin) {
  errorText = updateFailureMessage;
  organization_id = +this.$route.params.organization_id;

  closeModal(): void {
    this.$router.push({ 
      name: 'organizations-organization_id', 
      params: { organization_id: this.organization_id.toString() }
    });
  }
}
</script>
