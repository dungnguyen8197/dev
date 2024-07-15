<template>
  <CForm class="needs-validation" novalidate @submit.prevent="handleSubmit">
    <CCard>
      <CCardHeader class="pt-4 px-4">
        <InputText
          label="ユーザー名"
          name="name"
          v-model="administrator.name"
          :invalidFeedback="invalidRequired"
          required
        />
        <InputText
          label="メールアドレス"
          name="email"
          :pattern="EMAIL_REGEX"
          v-model="administrator.email"
          :invalidFeedback="invalidFeedbackEmail"
          required
        />
        <InputText
          label="パスワード"
          name="password"
          type="password"
          v-model="administrator.password"
          :pattern="PASSWORD_REGEX"
          :invalidFeedback="invalidFeedbackPassword"
          :isValid="validPassword"
          :required="checkRequirePassword"
        />
      </CCardHeader>
    </CCard>
    <CButton color="primary" type="submit" size="lg" :disabled="isLoading" class="mb-4">
      <CSpinner
        v-if="isLoading"
        size="sm"
        color="white"
      />
      <span v-else>
        保存
      </span>
    </CButton>
  </CForm>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import InputText from '~/components/form/InputText.vue';
import { AdministratorDetailDTO } from '~/interfaces/admins.interface';
import { EMAIL_REGEX, PASSWORD_REGEX } from '~/constants/regex';
import { invalidRequired, invalidEmail, invalidPassword } from '~/constants/messages';
@Component({
  components: {
    InputText,
  }
})
export default class AdministratorForm extends Vue {
  @Prop(Object) administrator!: AdministratorDetailDTO;
  @Prop({ type: Boolean, default: false }) isLoading!: boolean;
  @Prop({ type: String, default: 'edit' }) typeForm!: string;

  readonly EMAIL_REGEX = EMAIL_REGEX;
  readonly PASSWORD_REGEX = PASSWORD_REGEX;

  readonly invalidRequired = invalidRequired;
  readonly invalidEmail = invalidEmail;
  readonly invalidPassword = invalidPassword;

  async created() {

  }

  get validPassword(): boolean {
    if (!this.administrator.password) {
      return true;
    }
    return !!this.administrator.password.match(new RegExp(PASSWORD_REGEX));
  }

  @Emit('submit')
  handleSubmit(event: Event): AdministratorDetailDTO | null {
    const form = event.target as HTMLFormElement;
    form.classList.add('was-validated');

    if (form.checkValidity() && this.validPassword) {
      return this.administrator;
    }

    return null;
  }
  get checkRequirePassword () {
    return this.typeForm === 'create';
  }

  get invalidFeedbackEmail() {
    return this.administrator.email?.length > 0 ? invalidEmail : invalidRequired
  }

  get invalidFeedbackPassword() {
    return this.administrator.password?.length > 0 ? invalidPassword : invalidRequired
  }
}
</script>
