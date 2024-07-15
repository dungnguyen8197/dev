<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <PageTitle title="退会の手続き" class="px-16" is-center/>
        <div class="withdrawal">
          <div class="withdrawal__content">
            <p>退会を行うと、支援の履歴を再度確認することができなくなります。</p>
            <div class="flex mt-10">
            <p>※</p> &nbsp;
            <p>ANYTEAMのサイト上から支援者情報は削除されます</p>
            </div>
            <div class="flex">
            <p>※</p> &nbsp;
            <p>学校、部活の累計支援人数、累計支援金額にはカウントされ続けます</p>
            </div>
            <div class="flex">
            <p>※</p> &nbsp;
            <p>学校側が見られる管理ページに支援者情報は残ります</p>
            </div>
          </div>
          <div class="withdrawal__button text-center mt-36 w-full">
            <a>
              <button class="btn btn-secondary btn-wide" @click="handleSubmit">上記に同意して退会する</button>
            </a>
          </div>
        </div>
        <Modal v-if="showModal" class="withdrawal-modal">
          <p>本当に退会してもよろしいですか？</p>
          <SubmitButton :active="showModal" label="退会する" v-bind:handle-click="closeModal" />
          <p class="withdrawal-modal__close" @click="cancel"> キャンセル</p>
        </Modal>
      </div>
    </div>
    <div class="fixed-footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Footer from '../../components/Footer.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';
import Modal from "../../components/Modal.vue";
import SubmitButton from '../../components/form/SubmitButton.vue';
import Menu from '../../components/common/sidebar/Menu.vue';

export default defineComponent({
  components: {
    Footer,
    PageTitle,
    Menu,
    Modal,
    SubmitButton
  },
   setup() {
    const showModal = ref(false);
    const handleSubmit = async () => {
      showModal.value =true;
    }

    const closeModal = async () => {
      window.location.href = '/user/';
    }

    const cancel = async () => {
      showModal.value = false;
    }
    return {
      showModal,
      handleSubmit,
      closeModal,
      cancel,
    }
   }
});
</script>

<style lang="scss" scoped>
.withdrawal {
  font-size: 12px;
  &__content {
    padding: 15px;
    p {
      margin: 0;
    }
  }
  &-modal {
    font-size: 13px;
    text-align: center;
    &__close {
      color: var(--dark-gray-color);
      font-size: 12px;
    }
  }
  @media screen and (min-width: 768px) {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
