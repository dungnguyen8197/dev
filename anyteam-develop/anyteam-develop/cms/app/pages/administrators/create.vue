<template>
  <div>
    <h3 class="mb-3">ユーザー新規登録</h3>
    <AdministratorForm
      :administrator="administrator"
      :isLoading="isLoading"
      :typeForm="typeForm"
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
import AdministratorForm from '~/components/administrator/AdministratorForm.vue';
import BaseToaster from '~/components/BaseToaster.vue';
import { AdministratorDetailDTO } from '~/interfaces/admins.interface';
import { createAdministrator } from '~/api/administrator';
import { registerFailureMessage, registerSuccessMessage } from '~/constants/messages';
import BaseModal from '~/components/BaseModal.vue';

export default Vue.extend({
  components: {
    BaseModal,
    BaseToaster,
    AdministratorForm,
  },
  data() {
    return {
      administrator: {
        id: 0,
        name: '',
        email: '',
        password: '',
      } as AdministratorDetailDTO,
      errorToast: 0,
      errorMessage: registerFailureMessage,
      isError: false,
      isLoading: false,
      modal: {
        color: 'success',
        message: registerSuccessMessage,
        isShow: false,
      },
      typeForm: 'create',
    };
  },
  head() {
    return {
      title: 'ユーザー新規登録',
    }
  },
  methods: {
    async handleSubmit(administrator: AdministratorDetailDTO | null): Promise<void> {
      if (!administrator) return;
      this.administrator = administrator;
      this.isLoading = true;
      this.errorMessage = registerFailureMessage;
      this.isError = false;
      if (this.isError) return;
      await this.createAdministrator();
      this.isLoading = false;
      if (!this.isError) this.modal.isShow = true;
    },

    async createAdministrator(): Promise<void> {
      try {
        await createAdministrator(this.administrator);
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
      await this.$router.push({ name: 'administrators-list' });
    },
  },
})
</script>
