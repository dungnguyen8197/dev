<template>
  <div>
    <div class="section-container mt-25">
      <PageTitle v-bind:title="!states.isConfirm ? 'お問い合わせ' : 'お問い合わせ内容の確認'" is-center/>
      <div class="page-contact">
        <FormContainer class="pt-30 pb-40" v-show="states.isConfirm === false">
          <form method="post" action="">
            <ContactForm @update:form="($event) => showConfirmSection($event)"></ContactForm>
          </form>
        </FormContainer>
      </div>
      <ContactConfirm
        v-show="states.isConfirm === true"
        :form="states"
        @event:edit="($event) => showContactForm($event)"
        @event:send="sendMail"
      ></ContactConfirm>
      <Modal v-if="states.showModalSuccess">
        <p class="text-center font-15">お問い合わせを受け付けました</p>
        <p class="text-center text-sm mt-20 mb-20">
          お客様からのお問い合わせは送信されました。
          後日担当者からご連絡させていただきます。
        </p>
        <SubmitButton label="戻る" active :handleClick="redirect" />
      </Modal>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import FormContainer from '../../components/containers/FormContainer.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';
import Item from '../../components/form/Item.vue';
import InputText from '../../components/form/InputText.vue';
import Textarea from '../../components/form/Textarea.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import { reactive } from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';
import Footer from '../../components/Footer.vue';
import Modal from '../../components/Modal.vue';
import { contactSendToDev } from '../../api/contact';
import ContactForm from '../../components/common/about/ContactForm.vue';
import ContactConfirm from '../../components/common/about/ContactConfirm.vue';
export const regex = require('../../../constants/regex');

export default defineComponent({
  components: {
    PageTitle,
    Item,
    InputText,
    Textarea,
    FormContainer,
    SubmitButton,
    Footer,
    Modal,
    ContactForm,
    ContactConfirm,
  },
  setup() {
    const states = reactive({
      showModalSuccess: false,
      isProcess: false,
      email: '',
      title: '',
      message: '',
      isConfirm: false,
    });

    const sendMail = async () => {
      if (states.isProcess) return;
      try {
        states.isProcess = true;
        const response = await contactSendToDev({
          email: states.email,
          title: states.title,
          message: states.message,
        });
        if (response === true) {
          states.showModalSuccess = true;
        }
      } catch (err: any) {}
      states.isProcess = false;
    };

    const redirect = () => {
      window.location.href = '/user/';
    };

    const showConfirmSection = (form: any) => {
      states.email = form.email.value;
      states.title = form.title.value;
      states.message = form.message.value;
      states.isConfirm = true;
    };

    const showContactForm = (form: any) => {
      states.isConfirm = false;
    };

    return {
      states,
      sendMail,
      redirect,
      showConfirmSection,
      showContactForm,
    };
  },
});
</script>
<style lang="scss" scoped>
.page-contact {
  background-color: var(--light-color);
  margin-left: -16px;
  margin-right: -16px;
  .page-wrap {
    padding: 0 5.4rem;
  }
  .form-container {
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    background-color: var(--white-color);
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 60px;
  }
}
</style>
