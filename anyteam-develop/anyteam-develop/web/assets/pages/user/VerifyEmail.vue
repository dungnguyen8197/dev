<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu/>
      </div>
      <div class="user-content">
        <PageTitle title="メールアドレス変更" class="px-16 sp-only"/>
        <div class="auth-container">
          <FormContainer class="auth-form-container bg-light mt-90">
            <form method="post" action="">
              <h2 class="text-normal pc-tablet-only text-center">メールアドレス変更</h2>
              <div class="font-18 text-center mt-90">
                新しいメールアドレスに届いた<br />
                6桁のパスコードを入力してください。
              </div>
              <div class="com-user-profile mt-35">
                <div class="com-user-profile__form text-left">
                  <div class="form-row flex justify-center">
                    <div>
                      <div class="font-sm">パスコードを入力</div>
                      <InputCode @blur="checkCode"></InputCode>
                    </div>
                  </div>
                  <div class="mt-15 font-sm text-danger text-center">
                    {{ states.errorMessage }}
                  </div>
                </div>
              </div>
            </form>
          </FormContainer>
          <Modal v-show="states.showConfirm">
            <div class="text-center font-15">メールアドレスが変更されました</div>
            <div class="text-center mt-22">
              <button class="btn btn-secondary btn-wide" @click="closeConfirm">
                戻る
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FormContainer from '../../components/containers/FormContainer.vue';
import PageHeader from '../../components/common/page/PageHeader.vue';
import Item from '../../components/form/Item.vue';
import InputCode from '../../components/form/InputCode.vue';
import { defineComponent } from '@vue/runtime-core';
import PageTitle from '../../components/common/page/PageTitle.vue';
import { emailVerifyCode } from '../../api/users';
import { reactive } from 'vue';
import Modal from '../../components/Modal.vue';
import Menu from '../../components/common/sidebar/Menu.vue';

export default defineComponent({
  components: {
    PageHeader,
    Item,
    InputCode,
    PageTitle,
    FormContainer,
    Modal,
    Menu
},
  setup() {
    const states = reactive({
      errorMessage: '',
      showConfirm: false,
    });
    const showError = () => {
      states.showConfirm = false;
      states.errorMessage = '認証コードが正しくありません。';
    };
    const showConfirm = () => {
      states.showConfirm = true;
      states.errorMessage = '';
    };
    const checkCode = async (value: any) => {
      try {
        const check = await emailVerifyCode({ code: value });
        if (check === true) {
          showConfirm();
        } else {
          throw 'Error';
        }
      } catch (err) {
        showError();
      }
    };

    const closeConfirm = () => {
      window.location.href = '/user';
    };

    return { states, checkCode, closeConfirm };
  },
});
</script>
<style lang="scss" scoped>
.page-email {
  margin: 0 auto;
  padding: 0 3rem;
  height: calc(100vh - 87px);
  display: flex;
  align-items: start;
  .form-container {
    width: 100%;
  }
}
</style>
