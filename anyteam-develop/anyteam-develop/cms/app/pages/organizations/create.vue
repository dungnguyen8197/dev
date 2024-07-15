<template>
  <div>
    <h3 class="mb-3">組織新規作成</h3>
    <OrganizationForm
      :organization="organization"
      :isLoading="isLoading"
      @submit="handleSubmit"
    />
    <BaseToaster
      :fixed-toasts="errorToast"
      color="danger"
    >
      {{ errorMessage }}
    </BaseToaster>
    <BaseModal
      v-bind="modal"
      :cancelButton="false"
      @update:hide="hideModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import OrganizationForm from '~/components/organization/OrganizationForm.vue';
import BaseToaster from '~/components/BaseToaster.vue';
import { OrganizationDTO } from '~/interfaces/organization.interface';
import { createOrganization, uploadOrganizationIcon } from '~/api/organization';
import { registerFailureMessage, registerSuccessMessage } from '~/constants/messages';
import BaseModal from '~/components/BaseModal.vue';

export default Vue.extend({
  components: {
    BaseModal,
    BaseToaster,
    OrganizationForm,
  },
  data() {
    return {
      organization: {
        region_id: 1,
        name_line_id: 1,
        division_type_id: 1,
        status: 0,
        is_group: false,
      } as OrganizationDTO,
      errorToast: 0,
      errorMessage: registerFailureMessage,
      isError: false,
      isLoading: false,
      modal: {
        color: 'success',
        message: registerSuccessMessage,
        isShow: false,
      }
    };
  },
  head() {
    return {
      title: '組織新規作成',
    }
  },
  methods: {
    async handleSubmit(organization: OrganizationDTO | null): Promise<void> {
      if (!organization) return;
      this.organization = organization;
      this.isLoading = true;
      this.errorMessage = registerFailureMessage;
      this.isError = false;

      if (this.organization.iconBlob) {
        this.organization.icon = await this.uploadIcon(this.organization.iconBlob);
      }
      if (this.isError) return;

      await this.createOrganization();
      this.isLoading = false;
      if (!this.isError) this.modal.isShow = true;
    },
    async uploadIcon(icon: File): Promise<string> {
      try {
        const response = await uploadOrganizationIcon(icon);
        return response.icon;
      } catch (err) {
        this.isError = true;
        this.errorToast++;
        return '';
      }
    },
    async createOrganization(): Promise<void> {
      try {
        await createOrganization(this.organization);
      } catch (err: any) {
        this.isError = true;
        if (err.status === 409) {
          this.errorMessage = err.data.error.email;
        }
        this.errorToast++;
      }
    },
    async hideModal(): Promise<void> {
      this.modal.isShow = false;
      await this.$router.push({ name: 'organizations-list' });
    },
  },
})
</script>
