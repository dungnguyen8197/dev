<template>
  <form class="form-container">
    <div v-if="error" class="form__error">{{ errorText }}</div>
    <Divider/>
    <InputText
      class="px-2 px-md-6"
      v-on:handleInput="setName"
      v-bind:value="name"
      label="名前"
      inputId="name"
      inputName="name"
      placeholder="未入力"
      v-bind:validateRule="{required: true}"
    />
    <Divider/>
    <InputText
      class="px-2 px-md-6"
      v-on:handleInput="setEmail"
      v-bind:value="email"
      v-bind:errorMessage="emailError"
      label="メールアドレス"
      inputId="email"
      inputName="email"
      placeholder="未入力"
      v-bind:validateRule="{required: true, email: true}"
    />
    <Divider/>
    <div v-if="isSelfEdit">
      <InputText
        class="px-2 px-md-6"
        v-on:handleInput="setPassword"
        v-bind:value="password"
        label="パスワード"
        inputId="password"
        inputName="password"
        placeholder="※半角英数字6文字〜50文字で入力"
        inputType="password"
        v-bind:validateRule="{ required:true, minLength: 6, maxLength: 50}"
      />
      <InputText
        class="px-2 px-md-6"
        v-on:handleInput="setPasswordRetype"
        v-bind:value="passwordRetype"
        v-bind:errorMessage="passwordRetypeError"
        label="パスワード(確認用)"
        inputId="passwordRetype"
        inputName="passwordRetype"
        placeholder="※半角英数字6文字〜50文字で入力"
        inputType="password"
        v-bind:validateRule="{ required:true, minLength: 6, maxLength: 50}"
      />
      <Divider/>
    </div>
    <div v-if="!isGroup && !isInitial && !isSelfEdit">
      <RoleInput label="送信" :options="optionsRole" input-name="role" v-model="role" />
      <Divider/>
    </div>
    <div v-if="isInitial" class="flex justify-center mt-2">
      <InputCheckBox @input="setAgreement">
        <template #label>
          <div class="flex form__checkbox-label">
            <a :href="termsUrl" target="_blank" rel="noopener">利用規約</a>
            <span>、</span>
            <a :href="privacyUrl" target="_blank" rel="noopener">プライバシー</a>
            <span>に同意する</span>
          </div>
        </template>
      </InputCheckBox>
    </div>
    <div>
      <SubmitButton
        :class="isInitial ? 'my-6' : 'mt-6 mb-1'"
        label="登録"
        v-bind:handleClick="handleSubmit"
        v-bind:active="canSubmit"
      />
    </div>
    <div v-if="!isInitial" class="mb-2">
      <small class="form__cancel" v-on:click="goBack">キャンセル</small>
    </div>
    <Divider/>
    <div v-if="!isInitial && !isSelfEdit" class='my-2'>
      <small class="form__delete" v-on:click="handleDelete">アカウント削除</small>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import Divider from '~/components/common/Divider.vue';
import InputText from '~/components/form/InputText.vue';
import SubmitButton from '~/components/form/SubmitButton.vue';
import InputCheckBox from '~/components/form/InputCheckBox.vue';
import { unmatchedPassword } from '~/helpers/validate/messages';
import { InputTextEmit } from '~/interfaces/input-emit';
import RoleInput from '~/components/organization/organization-users/RoleInput.vue';
import { findOrganizationUser } from '~/api/organization-user';
import Button from '~/components/common/Button.vue';

const appUrl = process.env.APP_URL;

@Component({
  components: {
    SubmitButton,
    InputText,
    InputCheckBox,
    Divider,
    RoleInput,
    Button
  }
})
export default class OrganizationUserForm extends Vue {
  @Prop(String) errorText: string | undefined;
  @Prop(String) emailError: string | undefined;
  @Prop({ type: Boolean, default: false }) error: boolean | undefined;
  @Prop({ type: Boolean, default: false }) isInitial: boolean | undefined;

  name = '';
  email = '';
  password = '';
  passwordRetype = '';
  agreement = false;
  passwordRetypeError = '';
  canSubmit = false;
  isValid = {
    name: false,
    email: false,
    password: false,
    passwordRetype: false
  }
  role = 1;
  isGroup = this.$auth.user!.is_group_user as boolean;
  optionsRole = [
    {id: 'manager', valueOption: 1, label: '管理者'},
    {id: 'viewer', valueOption: 2, label: '閲覧者'}
  ];
  organizationUserId = +this.$route.params?.organization_user_id as number;
  organizationId = +this.$route.params?.organization_id as number;
  isSelfEdit = true;

  termsUrl = `${appUrl}/about/terms/`;
  privacyUrl = `${appUrl}/about/privacy/`;

  async created(): Promise<void> {
    await this.$auth.fetchUser();
    if (this.organizationUserId && this.$auth.user?.id !== this.organizationUserId) {
      this.isSelfEdit = false;
      const organizationUser = await findOrganizationUser(
        this.organizationId,
        this.organizationUserId
      );
      this.name  = organizationUser.name;
      this.email = organizationUser.email;
      this.role  = organizationUser.role;
    } else {
      this.name  = this.$auth.user?.name as string || '';
      this.email = this.$auth.user?.email as string || '';
      this.role  = this.$auth.user?.role as number || 1;
    }
  }

  @Emit('submit')
  submit() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    }
  }

  setName($event: InputTextEmit): void {
    this.name = $event.value;
    this.isValid.name = $event.isValid;
    this.changeCanSubmit();
  }

  setEmail($event: InputTextEmit): void {
    this.email = $event.value;
    this.isValid.email = $event.isValid;
    this.changeCanSubmit();
  }

  setPassword($event: InputTextEmit): void {
    this.password = $event.value;
    this.isValid.password = $event.isValid;
    this.changeCanSubmit();
  }

  setPasswordRetype($event: InputTextEmit): void {
    this.passwordRetype = $event.value;
    this.isValid.passwordRetype = $event.isValid;
    this.changeCanSubmit();
  }

  setAgreement($event: boolean): void {
    this.agreement = $event;
    this.changeCanSubmit();
  }

  changeCanSubmit(): void {
    if (!this.isInitial) {
      this.canSubmit = this.isValid.name
      && this.isValid.email
      && (!this.isInitial || this.agreement);
    } else {
      this.canSubmit = this.isValid.name
      && this.isValid.email
      && this.isValid.password
      && this.isValid.passwordRetype
      && (!this.isInitial || this.agreement);
    }
  }

  handleSubmit(): void {
    if (this.password !== this.passwordRetype) {
      this.passwordRetypeError = unmatchedPassword;
      return;
    }

    this.passwordRetypeError = '';
    this.submit();
  }

  handleDelete(): void {
    this.$emit('delete', true)
  }

  async goBack(): Promise<void> {
    await this.$router.push({
      name: 'organizations-organization_id-organization-users',
      params: { organization_id: this.organizationId.toString() }
    });
  }
}
</script>

<style lang="scss" scoped>
.form {
  &__error {
    color: var(--red);
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  &__checkbox-label {
    margin-left: 0.5rem;
    font-size: 1.3rem;
    & > a {
      color: var(--dark-blue);
      text-decoration-color: var(--dark-blue);
    }
  }
  &__cancel {
    font-size: 1.2rem;
    cursor: pointer;
  }
  &__delete {
    font-size: 1.2rem;
    cursor: pointer;
    color: red;
  }
}
</style>
