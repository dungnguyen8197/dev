<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <PageTitle title="パスワード変更" class="sp-only px-16" />
        <div class="auth-container">
          <FormContainer class="auth-form-container bg-light mt-90">
            <form>
              <h2 class="text-normal pc-tablet-only text-center">パスワード変更</h2>
              <InputText
                input-type="password"
                @input="(value) => updateField(value, 'currentPassword')"
                :value="value.currentPassword"
                label="パスワード"
                placeholder="現在のパスワードを入力"
                :errorMessage="error.currentPassword"
              />
              <InputText
                input-type="password"
                @input="(value) => updateField(value, 'password1')"
                :value="value.password1"
                label="新パスワード"
                placeholder="半角英数字6文字以上"
                :errorMessage="error.password1"
              />
              <InputText
                input-type="password"
                @input="(value) => updateField(value, 'password2')"
                :value="value.password2"
                label="新パスワード(確認)"
                placeholder="半角英数字6文字以上"
                :errorMessage="error.password2"
              />
              <div class="mt-22"></div>
              <LinkText label="パスワードを忘れた方はこちら" link="#" />
              <div class="mt-37"></div>
              <SubmitButton
                v-bind:active="canSubmit"
                label="パスワードを変更"
                :handleClick="submitForm"
              />
            </form>
            <Modal v-show="showSuccess">
              <div class="text-center font-15">パスワードが変更されました</div>
              <div class="text-center mt-22">
                <button class="btn btn-secondary btn-wide" @click="redirect">
                  戻る
                </button>
              </div>
            </Modal>
          </FormContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { computed, ref, reactive } from '@vue/reactivity';
import { changePassword } from '../../api/users';
import PageTitle from '../../components/common/page/PageTitle.vue';
import InputText from '../../components/form/InputText.vue';
import LinkText from '../../components/form/LinkText.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import {
  invalidRequired,
  invalidPassword,
  unmatchedPassword,
} from '../../constants/messages';
import FormContainer from '../../components/containers/FormContainer.vue';
import Modal from '../../components/Modal.vue';
import Menu from '../../components/common/sidebar/Menu.vue';
export const regex: any = require('../../../constants/regex');

export default defineComponent({
  components: {
    PageTitle,
    SubmitButton,
    FormContainer,
    InputText,
    Menu,
    LinkText,
    Modal,
  },
  setup() {
    const value = reactive({
      currentPassword: '',
      password1: '',
      password2: '',
    });
    const error = reactive({
      currentPassword: '',
      password1: '',
      password2: '',
    });

    const isProcess = ref<boolean>(false);
    const showSuccess = ref<boolean>(false);

    const updateField = (event: string, field: string) => {
      value[field] = event;
      validate(field);
    };

    const validate = (field: string) => {
      if (value[field] === '') {
        error[field] = invalidRequired;
      } else if (!regex.REGEX_PASSWORD.test(value[field])) {
        error[field] = invalidPassword;
      } else {
        error[field] = '';
      }
    } 

    const canSubmit = computed<boolean>((): boolean => {
      return (
        !!value.currentPassword &&
        !!value.password1 &&
        !!value.password2 &&
        !error.currentPassword &&
        !error.password1 &&
        !error.password2
      );
    });

    const submitForm = async () => {
      if (!canSubmit.value) return;
      isProcess.value = true;
      if (value.password1 !== value.password2) {
        error.password2 = unmatchedPassword;
        return;
      }
      try {
        const res = await changePassword({
          current_password: value.currentPassword,
          new_password: value.password1,
        });
        if (res === true) {
          showSuccess.value = true;
        } else {
          error.currentPassword = 'パスワードが違います。';
        }
      } catch (err) {}
      isProcess.value = false;
    };

    const redirect = () => {
      window.location.href = '/user/';
    };

    return {
      value,
      error,
      showSuccess,
      isProcess,
      updateField,
      submitForm,
      canSubmit,
      redirect,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-password {
  background: var(--light-color);
  margin: 0 auto;
  padding: 7rem 5.4rem;
  height: 100vh;
}
</style>
