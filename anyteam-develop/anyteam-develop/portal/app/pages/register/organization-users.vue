<template>
  <div>
    <Header v-bind:title="organization.name" />
    <StepBar
      v-bind:active-step="1"
      description="こちらのアカウントは今後ログインする時に必要です。以下の情報を入力ください。"
    />
    <OrganizationUserForm
      v-bind:error="error"
      v-bind:emailError="emailError"
      v-bind:errorText="errorText"
      is-initial
      @submit="handleSubmit"
    />
    <Modal
      v-if="showModal" @confirm="closeModal"
      title="登録が完了しました"
      v-bind:description="isGroup ? '' : '引き続き学校情報を登録してください'"
      v-bind:buttonText="isGroup ? 'トップへ' : '続けて学校情報登録へ'"
    />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import Header from '~/components/Header.vue';
import Modal from '~/components/common/Modal.vue';
import OrganizationUserForm from '~/components/organization/OrganizationUserForm.vue';
import StepBar from '~/components/steps/StepBar.vue';
import { registerFailureMessage } from '~/api/messages';
import { OrganizationResponse } from '~/interfaces/response/organization';
import { getOrganizationById } from '~/api/organizations';
import {
  ORGANIZATIONS_STATUS_ACTIVE,
  ORGANIZATIONS_STATUS_INACTIVE
} from '~/constants/organization';
import { OrganizationUserRegisterMixin } from '~/mixins/organization-user-register';

@Component({
  layout: 'auth',
  head() {
    return {
      title: 'アカウント本登録',
    };
  },
  components: {
    OrganizationUserForm,
    Modal,
    Header,
    StepBar,
  },
})
export default class OrganizationUserRegister extends mixins(OrganizationUserRegisterMixin) {
  isGroup = this.$auth.user!.is_group_user as boolean;
  organization = {} as OrganizationResponse;
  errorText = registerFailureMessage;
  showModal = false;

  closeModal(): void {
    if (this.isGroup) {
      this.$router.push({ name: 'index'});
      return;
    }

    this.$router.push({ name: 'register-organizations' });
  }

  async fetchOrganization(): Promise<void> {
    try {
      this.organization = await getOrganizationById(this.organizationId);
    } catch (e) {}
  }

  async created(): Promise<void> {
    await this.fetchOrganization();
  }

  @Watch('registerDone')
  onRegisterDone(): void {
    if (!this.registerDone) return;
    if (this.organization.status === ORGANIZATIONS_STATUS_ACTIVE) {
      this.$router.push({ name: 'index' });
      return;
    }

    if (this.organization.status === ORGANIZATIONS_STATUS_INACTIVE) {
      this.$router.push({ name: 'register-organizations' });
      return;
    }

    this.showModal = true;
  }
}
</script>
