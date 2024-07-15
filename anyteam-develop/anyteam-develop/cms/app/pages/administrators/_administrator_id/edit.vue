<template>
  <div>
    <h3 class="mb-3">アップデートユーザー</h3>
    <AdministratorForm
      :administrator="administrator"
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
          @click="$router.push({ name: 'administrators-list' })"
        >
          戻る
        </CButton>
      </div>
    </BaseToaster>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AdministratorForm from '~/components/administrator/AdministratorForm.vue';
import { AdministratorDetailDTO } from '~/interfaces/admins.interface';
import { registerFailureMessage, updateFailureMessage, updateSuccessMessage } from '~/constants/messages';
import BaseToaster from '~/components/BaseToaster.vue';
import { getAdministratorDetail, updateAdministrator } from '~/api/administrator';

export default Vue.extend({
  components: {
    BaseToaster,
    AdministratorForm,
  },
  data(){
    return {
      id: Number(this.$route.params.administrator_id),
      administrator: {} as AdministratorDetailDTO,
      errorMessage: updateFailureMessage,
      errorToast: 0,
      successMessage: updateSuccessMessage,
      successToast: 0,
      isError: false,
      isLoading: false,
    }
  },
  async mounted() {
    await this.getAdministrator();
  },
  head() {
    return {
      title: 'アップデートユーザー',
    }
  },
  methods: {
    async getAdministrator(): Promise<void> {
      if (!this.id) return;
      try {
        this.administrator = await getAdministratorDetail(this.id);
      } catch (err) {}
    },
    async handleSubmit(administrator: AdministratorDetailDTO | null): Promise<void> {
      if (!administrator) return;
      this.administrator = administrator;
      this.isLoading = true;
      this.errorMessage = registerFailureMessage;
      this.isError = false;

      if (this.isError) return;

      await this.updateAdministrator();
      this.isLoading = false;
    },
    async updateAdministrator() {
      try {
        await updateAdministrator(this.id, this.administrator);
        this.successToast++;
        await this.getAdministrator();
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
