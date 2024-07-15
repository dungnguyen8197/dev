<template>
  <div>
    <h3 class="mb-3">学校情報変更</h3>
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
    <BaseToaster
      :fixed-toasts="successToast"
      color="success"
    >
      <div class="d-flex align-items-center justify-content-between">
        {{ successMessage }}
        <CButton
          color="light"
          variant="outline"
          @click="$router.push({ name: 'organizations-list' })"
        >
          戻る
        </CButton>
      </div>
    </BaseToaster>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import OrganizationForm from '~/components/organization/OrganizationForm.vue';
import { OrganizationDTO } from '~/interfaces/organization.interface';
import { registerFailureMessage, updateFailureMessage, updateSuccessMessage } from '~/constants/messages';
import BaseToaster from '~/components/BaseToaster.vue';
import { getOrganizationDetail, updateOrganization, uploadOrganizationIcon } from '~/api/organization';

export default Vue.extend({
  components: {
    BaseToaster,
    OrganizationForm,
  },
  data(){
    return {
      id: Number(this.$route.params.organization_id),
      organization: {} as OrganizationDTO,
      errorMessage: updateFailureMessage,
      errorToast: 0,
      successMessage: updateSuccessMessage,
      successToast: 0,
      isError: false,
      isLoading: false,
    }
  },
  async mounted() {
    await this.getOrganizationDetail();
  },
  head() {
    return {
      title: '学校情報変更',
    }
  },
  methods: {
    async getOrganizationDetail(): Promise<void> {
      if (!this.id) return;
      try {
        const organization = await getOrganizationDetail(this.id);
        this.organization = { ...organization, iconBlob: null };
      } catch (err) {}
    },
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

      await this.updateOrganization();
      this.isLoading = false;
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
    async updateOrganization() {
      try {
        await updateOrganization(this.id, this.organization);
        this.successToast++;
        await this.getOrganizationDetail();
      } catch (err: any) {
        this.isError = true;
        if (err.status === 409) {
          this.errorMessage = err.data.error.email;
        }
        this.errorToast++;
      }
    }
  },
});
</script>
