<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <PageTitle title="メールアドレス変更" class="px-16 sp-only" is-center/>
        <div class="auth-container">
          <FormContainer class="auth-form-container bg-light mt-90">
            <form method="post" action="">
              <h2 class="text-normal pc-tablet-only text-center">メールアドレス変更</h2>
              <InputText
                :value="states.currentEmail"
                label="登録メールアドレス"
                v-bind:disabled="true"
              />
              <InputText
                @input="checkEmail"
                v-bind:value="states.email"
                inputId="email"
                inputName="email"
                label="変更したいメールアドレス"
                placeholder="入力してください"
                v-bind:errorMessage="states.emailError"
              />
              <div class="mt-52"></div>
              <SubmitButton
                v-bind:active="states.canSubmit"
                label="メールアドレスを変更"
                :handleClick="submitForm"
              />
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FormContainer from '../../components/containers/FormContainer.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';
import Item from '../../components/form/Item.vue';
import InputText from '../../components/form/InputText.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import { reactive } from '@vue/reactivity';
import { defineComponent, inject } from '@vue/runtime-core';
import { emailChangeCode } from '../../api/users';
import Menu from '../../components/common/sidebar/Menu.vue';
export const apiStatus = require('../../../constants/api_status');
export const regex = require('../../../constants/regex');

interface StateInterface {
  currentEmail: string;
  email: string;
  emailStatus: boolean;
  emailError: string;
  canSubmit: boolean;
  isProcess: boolean;
}

export default defineComponent({
  components: {
    PageTitle,
    Item,
    InputText,
    FormContainer,
    SubmitButton,
    Menu
},
  setup() {
    const appData = inject('$appData') as { user: { email: '' } };
    const states: StateInterface = reactive<StateInterface>({
      currentEmail: appData.user.email,
      email: '',
      emailStatus: false,
      emailError: '',
      canSubmit: false,
      isProcess: false,
    });
    const checkEmail: any = (value: string) => {
      states.email = value;
      states.emailStatus = regex.REGEX_EMAIL.test(value) ? true : false;
      states.canSubmit = states.emailStatus;
      states.emailError = !states.emailStatus ? 'メール形式が不正です。' : '';
    };
    const submitForm: any = async () => {
      if (states.isProcess) return;
      try {
        states.isProcess = true;
        await emailChangeCode({ email: states.email });
        window.location.href = '/user/email/verify';
      } catch (err: any) {
        if (err.status === apiStatus.API_STATUS_CONFLICT) {
          states.emailError = '別のメールアドレスをご入力ください。';
        }
      }
      states.isProcess = false;
    };
    return {
      states,
      checkEmail,
      submitForm,
    };
  },
});
</script>
<style lang="scss" scoped>
.page-email {
  margin: 0 auto;
  padding: 0 5.4rem;
  height: calc(100vh - 87px);
  display: flex;
  align-items: center;
  .form-container {
    width: 100%;
  }
}
</style>
