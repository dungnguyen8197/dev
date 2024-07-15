<template>
  <div class="register">
    <div class="section-container mt-24">
      <PageTitle v-bind:title="'会員登録'" is-center></PageTitle>
    </div>
    <div class="auth-container">
      <FormContainer title="アカウントを作成" class="auth-form-container bg-light"> 
        <form method="post" action="">
          <InputText
            @input="changeEmail"
            v-bind:value="form.email"
            v-bind:inputId="'email'"
            v-bind:inputName="'email'"
            v-bind:label="'メールアドレス'"
            v-bind:placeholder="''"
            v-bind:errorMessage="message.error"
            inputType="email"
          />
          <InputCheckbox @input="changeAgreement">
            <template #label>
              <div class="flex register__checkbox-label">
                <a href="/about/terms" target="_blank" rel="noopener">利用規約</a>
                <span>、</span>
                <a href="/about/privacy" target="_blank" rel="noopener">プライバシーポリシー</a>
                <span>に同意する</span>
              </div>
            </template>
          </InputCheckbox>
          <SubmitButton
            class="mt-24"
            v-bind:active="canSubmit"
            v-bind:label="'メールの認証へ進む'"
            :handleClick="checkEmail"
          />
        </form>
      </FormContainer>
    </div>
    <Footer class="pc-tablet-only"/>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import FormContainer from '../../../components/containers/FormContainer.vue';
import InputText from '../../../components/form/InputText.vue';
import LinkText from '../../../components/form/LinkText.vue';
import SubmitButton from '../../../components/form/SubmitButton.vue';
import PageTitle from '../../../components/common/page/PageTitle.vue';
import { defineComponent, reactive } from '@vue/runtime-core';
import { userConfirmationEmail } from '../../../api/users';
import InputCheckbox from '../../../components/form/InputCheckbox.vue';
import Footer from '../../../components/Footer.vue';

export const apiStatus: any = require('../../../../constants/api_status');
export const regex: any = require('../../../../constants/regex');

interface State {
  email: string;
  agreement: boolean;
}

interface Message {
  error: any;
}

export default defineComponent({
  components: { FormContainer, InputText, SubmitButton, LinkText, PageTitle, InputCheckbox, Footer },
  setup() {
    const form: State = reactive<State>({
      email: '',
      agreement: false,
    });

    const message: Message = reactive<Message>({
      error: '',
    });

    const canSubmit = computed(() => {
      return form.email.length > 0 && !message.error && form.agreement;
    });

    const changeEmail = (value: string) => {
      form.email = value;
      message.error = '';
      if (!regex.REGEX_EMAIL.test(form.email)) {
        message.error = 'メール形式が不正です。';
        return;
      }
    };

    const changeAgreement = ($event: boolean) => {
      form.agreement = $event;
    }

    const checkEmail = async () => {
      try {
        const res = await userConfirmationEmail({ email: form.email });
        if (res.status === apiStatus.SUCCESS) {
          window.location.href = '/user/register/confirm';
        }
      } catch (err: any) {
        if (err.status === apiStatus.API_STATUS_CONFLICT) {
          message.error = err.data.error;
        }
      }
    };

    return {
      form,
      canSubmit,
      message,
      changeEmail,
      changeAgreement,
      checkEmail,
    };
  },
});
</script>

<style lang="scss" scoped>
.register {
  &__checkbox-label {
    flex-wrap: wrap;
    margin-left: 0.5rem;
    font-size: 1.3rem;
    & > a {
      color: var(--dark-blue);
      text-decoration-color: var(--dark-blue);
    }
  }
}
</style>
