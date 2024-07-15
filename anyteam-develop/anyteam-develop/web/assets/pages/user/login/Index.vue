<template>
  <div>
    <div class="section-container mt-24">
      <PageTitle title="ログイン" is-center />
    </div>
    <div class="auth-container mb-60">
      <FormContainer title="ANYTEAMにログイン" class="auth-form-container bg-light">
        <form method="post" action="">
          <InputText
            @input="changeEmail"
            v-bind:inputId="'email'"
            v-bind:inputName="'email'"
            v-bind:label="'メールアドレス'"
            v-bind:placeholder="'入力してください'"
          />
          <InputText
            @input="changePassword"
            v-bind:inputId="'password'"
            v-bind:inputName="'password'"
            v-bind:inputType="'password'"
            v-bind:label="'パスワード'"
            v-bind:placeholder="'入力してください'"
          />
          <a href="#" class="text-dark-gray text-sm"
            >パスワードをお忘れの場合</a
          >
          <SubmitButton
            class="mt-24"
            v-bind:active="form.canSubmit"
            v-bind:label="'ログイン'"
            :handleClick="postLogin"
          />
          <LinkText label="会員登録はこちら" link="/user/register" />
        </form>
      </FormContainer>
    </div>
    <Footer class="pc-tablet-only"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import axios from 'axios';

import FormContainer from '../../../components/containers/FormContainer.vue';
import InputText from '../../../components/form/InputText.vue';
import LinkText from '../../../components/form/LinkText.vue';
import SubmitButton from '../../../components/form/SubmitButton.vue';
import PageTitle from '../../../components/common/page/PageTitle.vue';
import Footer from '../../../components/Footer.vue';

interface State {
  email: string;
  password: string;
  canSubmit: boolean;
}

export default defineComponent({
  components: { FormContainer, InputText, SubmitButton, LinkText, PageTitle, Footer },
  setup() {
    axios.defaults.withCredentials = true;
    //axios.defaults.headers = {"Content-type": "application/json"}

    const form: State = reactive<State>({
      email: '',
      password: '',
      canSubmit: false,
    });

    const changeEmail: any = (value: string) => {
      form.email = value;
      isActiveSubmitButton();
    };

    const changePassword: any = (value: string) => {
      form.password = value;
      isActiveSubmitButton();
    };

    const postLogin: any = () => {
      axios
        .post('/api/login', {
          email: form.email,
          password: form.password,
        })
        .then((): void => {
          window.location.href = '/user';
        })
        .catch((error: any): void => {
          console.log(error);
        });
    };

    function isActiveSubmitButton(): void {
      form.canSubmit = form.email.length > 0 && form.password.length > 0;
    }

    return {
      form,
      changeEmail,
      changePassword,
      postLogin,
    };
  },
});
</script>
