<template>
  <div class="register">
    <div class="section-container mt-24">
      <PageTitle v-bind:title="'会員登録'" is-center></PageTitle>
    </div>
    <div class="auth-container">
      <FormContainer title="パスワード設定" class="auth-form-container bg-light">
        <form method="post" action="">
          <div class="register-form__group">パスワード</div>

          <InputPassword
            @input="(value) => changePassword(value)"
            :value="form.password"
            v-bind:inputId="'password'"
            v-bind:inputName="'password'"
            v-bind:inputType="'password'"
            v-bind:label="''"
            v-bind:placeholder="''"
            v-bind:errorMessage="message.error.password"
          />

          <div class="register-form__group">パスワード(確認)</div>

          <InputPassword
            @input="(value) => chanegPasswordConfirm(value)"
            :value="form.password_confirm"
            v-bind:inputId="'password_confirm'"
            v-bind:inputName="'password_confirm'"
            v-bind:inputType="'password'"
            v-bind:label="''"
            v-bind:placeholder="''"
            v-bind:errorMessage="message.error.password_confirm"
          />

          <SubmitButton
            v-bind:active="form.canSubmit"
            v-bind:label="'登録'"
            :handleClick="postRegister"
          />
        </form>
      </FormContainer>
    </div>

    <Modal v-show="modal.show">
      <p class="register__modal">登録が完了しました</p>
      <SubmitButton
        v-bind:active="true"
        v-bind:label="'トップへ'"
        :handleClick="back"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import Modal from '../../../components/Modal.vue';
import LinkButton from '../../../components/modal/LinkButton.vue';
import FormContainer from '../../../components/containers/FormContainer.vue';
import InputText from '../../../components/form/InputText.vue';
import InputPassword from '../../../components/form/InputPassword.vue';
import SubmitButton from '../../../components/form/SubmitButton.vue';
import AgreementText from '../../../components/form/register/AgreementText.vue';
import PageTitle from '../../../components/common/page/PageTitle.vue';
import { defineComponent, reactive } from '@vue/runtime-core';
import { userRegister } from '../../../api/users';
import { invalidPassword } from '../../../constants/messages';

interface State {
  password: string;
  password_confirm: string;
  canSubmit: boolean;
}

interface Message {
  error: {
    password: string;
    password_confirm: string;
  };
}

interface Modal {
  show: boolean;
}

export const regex: any = require('../../../../constants/regex');
export const apiStatus: any = require('../../../../constants/api_status');

export default defineComponent({
  components: {
    Modal,
    LinkButton,
    FormContainer,
    InputText,
    SubmitButton,
    AgreementText,
    PageTitle,
    InputPassword,
  },
  setup() {
    const form: State = reactive<State>({
      password: '',
      password_confirm: '',
      canSubmit: false,
    });

    const message: Message = reactive<Message>({
      error: {
        password: '',
        password_confirm: '',
      },
    });

    const modal: Modal = reactive<Modal>({
      show: false,
    });

    const changePassword: any = (value: string) => {
      form.password = value;
      isActiveSubmitButton();
    };

    const chanegPasswordConfirm: any = (value: string) => {
      form.password_confirm = value;
      isActiveSubmitButton();
    };

    const postRegister: any = async () => {
      let postRegister = await userRegister({
        key: getRegisterKey(),
        password: form.password,
      });
      if (postRegister.status === apiStatus.SUCCESS) {
        modal.show = true;
        form.canSubmit = false;
      } else if (postRegister.status === apiStatus.API_STATUS_CONFLICT) {
        window.location.href = '/user/login';
      } else {
        message.error = postRegister.data.error;
      }
    };

    function isActiveSubmitButton(): void {
      resetErrorMessage();
      if (!regex.REGEX_PASSWORD.test(form.password)) {
        message.error.password = invalidPassword;
        form.canSubmit = false;
        return;
      }
      if (
        form.password.length > 0 &&
        form.password_confirm.length > 0 &&
        form.password !== form.password_confirm
      ) {
        message.error.password_confirm = 'パスワードが一致しません';
        form.canSubmit = false;
        return;
      }

      form.canSubmit =
        form.password.length > 0 &&
        form.password_confirm.length > 0;
    }

    function resetErrorMessage(): void {
      message.error.password = '';
      message.error.password_confirm = '';
    }

    function getRegisterKey(): string {
      const pathnames: string[] = location.pathname.split('/');
      const key: string = pathnames[pathnames.length - 1] || '';
      return key;
    }

    const back: any = () => {
      window.location.href = '/';
    };

    return {
      form,
      message,
      modal,
      changePassword,
      chanegPasswordConfirm,
      postRegister,
      back,
    };
  },
});
</script>

<style lang="scss" scoped>
.register {
  .card {
    height: 120vh;
    .container {
      margin-bottom: 3rem;
      margin-top: 5rem;
    }
  }
  &-form {
    &__group {
      font-size: 1.4rem;
      text-align: left;
      margin-top: 1.5rem;
      margin-left: 10%;
    }
  }
  .form-action {
    margin-top: 2rem;
  }
  &__modal {
    text-align: center;
  }
}
</style>
