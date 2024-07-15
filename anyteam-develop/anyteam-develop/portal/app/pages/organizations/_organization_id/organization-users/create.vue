<template>
  <div>
    <Header title="新規追加" subTitle="アカウントを作成する方のメールアドレスを入力してください。入力されたメールアドレスに招待用のメールを送信します。" />
    <form class="form-container">
      <Divider />
      <InputText
        class="px-2 px-md-6"
        label="メール"
        placeholder="未記入"
        inputId="email"
        inputName="email"
        v-on:handleInput="setEmail"
        v-bind:value="email"
        v-bind:errorMessage="emailError"
        v-bind:validateRule="{required: true, email: true}"
      />
      <Divider />
      <div v-if="!isGroup">
        <RoleInput label="送信" :options="optionsRole" input-name="role" v-model="role" />
        <Divider />
      </div>
      <SubmitButton
        class="my-6"
        label="送信"
        v-bind:active="isValid === true"
        v-bind:handleClick="createUser"
      />
    </form>
    <Modal
      v-if="createDone" @confirm="closeModal"
      title="登録が完了しました"
      buttonText="戻る"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Divider from '~/components/common/Divider.vue';
import InputText from '~/components/form/InputText.vue';
import SubmitButton from '~/components/form/SubmitButton.vue';
import Modal from '~/components/common/Modal.vue';
import { createOrganizationUser } from '~/api/organization-user';
import { InputTextEmit } from '~/interfaces/input-emit';
import TipsDropdown from '~/components/organization/organization-users/TipsDropdown.vue';
import RoleInput from '~/components/organization/organization-users/RoleInput.vue';
import { ADMIN_ROLE } from '~/constants/organization_user';

export default Vue.extend({
  head() {
    return {
      title: '新規追加'
    };
  },
  middleware: ['forbidden'],
  components: {SubmitButton, InputText, Divider, Modal, TipsDropdown, RoleInput},
  data() {
    return {
      organizationId: +this.$route.params.organization_id as number,
      email: '',
      isValid: false,
      error: false,
      emailError: '',
      createDone: false,
      role: ADMIN_ROLE,
      organization: {},
      optionsRole: [
        {id: 'manager', valueOption: 1, label: '管理者'},
        {id: 'viewer', valueOption: 2, label: '閲覧者'}
      ],
      isGroup: this.$auth.user!.is_group_user as boolean,
    };
  },
  methods: {
    setEmail($event: InputTextEmit): void {
      this.email = $event.value;
      this.isValid = $event.isValid;
    },
    async createUser(): Promise<void> {
      try {
        this.error = false;
        this.emailError = '';

        await createOrganizationUser(this.organizationId, { email: this.email, role: this.role });
        this.createDone = true;
      } catch (e: any) {
        this.error = true;

        if (e.status === 409) {
          this.emailError = e.data.error.email;
        }
      }
    },
    closeModal(): void {
      this.$router.push({ 
        name: 'organizations-organization_id-organization-users', 
        params: { organization_id: this.$route.params.organization_id } 
      });
    }
  },
})
</script>
