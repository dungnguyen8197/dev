<template>
  <div>
    <Header title="アカウント編集" />
    <OrganizationUserForm
      v-bind:error="error"
      v-bind:emailError="emailError"
      v-bind:errorText="errorText"
      @submit="handleSubmit"
      @delete="onDelete"
    />
    <Modal
      v-if="registerDone" @confirm="closeModal"
      title="登録が完了しました"
      buttonText="戻る"
    />
    <Modal
      v-if="isOpenDeleteModal" @confirm="deleteUser"
      title="アカウントを削除しても よろしいでしょうか?"
      buttonText="削除"
      cancel
      @close="isOpenDeleteModal = false"
    />
    <Modal
      title="アカウントを削除しました"
      buttonText="閉じる"
      v-if="showDeleteSuccessModal"
      @confirm="showDeleteSuccessModal = false"
    />
    <Modal
      title="アカウントを削除することができません"
      description="管理者が一人の場合はアカウント削除することができま せん。他のメンバーを管理者に設定もしくは追加してく<br>ださい。"
      buttonText="閉じる"
      v-if="showDeleteFailModal"
      @confirm="showDeleteFailModal = false"
    />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Header from '~/components/Header.vue';
import Modal from '~/components/common/Modal.vue';
import OrganizationUserForm from '~/components/organization/OrganizationUserForm.vue';
import { updateFailureMessage } from '~/api/messages';
import { OrganizationUserRegisterMixin } from '~/mixins/organization-user-register';
import { deleteOrganizationUser } from '~/api/organization-user';

@Component({
  head() {
    return {
      title: 'アカウント編集'
    }
  },
  middleware: ['organization_user_forbidden'],
  components: {
    Header,
    OrganizationUserForm,
    Modal,
  },
})
export default class OrganizationUserEdit extends mixins(OrganizationUserRegisterMixin) {
  errorText = updateFailureMessage;
  isOpenDeleteModal = false;
  showDeleteSuccessModal = false;
  showDeleteFailModal = false;
  organizationId = +this.$route.params.organization_id as number;
  organizationUserId = +this.$route.params.organization_user_id as number;

  closeModal(): void {
    this.registerDone = false;
  }

  onDelete(): void {
    this.isOpenDeleteModal = true;
  }

  async deleteUser(): Promise<void> {
    try {
      await deleteOrganizationUser(
        this.organizationId,
        this.organizationUserId
      );
      this.isOpenDeleteModal = false;
      this.showDeleteSuccessModal = true;
      await this.$router.push({
        name: 'organizations-organization_id-organization-users',
        params: { organization_id: this.organizationId.toString() }
      });
    } catch {
      this.isOpenDeleteModal = false;
      this.showDeleteFailModal = true;
    }
  }
}
</script>
