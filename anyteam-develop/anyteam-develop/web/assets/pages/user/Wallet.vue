<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <div class="wallet-container">
          <PageTitle title="決済情報" class="px-16" is-center/>
          <form class="form-theme--default">
            <PageSection title="クレジットカード情報"
              class="wallet-card" 
              v-if="cardNumber"
              :error="!enabled"
            >
              <div class="wallet-card__content">
                <img :src="`/public/images/common/${cardImage}`" alt="">
                <div>
                  <div class="text-sm">{{ cardNumber }}</div>
                  <div class="text-sm">使用期限 {{ cardExpire }}</div>
                </div>
              </div>
            </PageSection>
            <PageSection v-else>
              <div class="py-8 text-center text-sm">まだクレジットカード情報が登録されていません</div>
            </PageSection>
            <div class="text-center mt-24">
              <div class="text-message text-sm" v-if="cardNumber && !enabled">
                <div class="w-80">
                  <div class="py-4">現在のお支払い用カードはご利用になれません。</div>
                  <div class="py-4">他のカードを登録してください。</div>
                </div>
              </div>
              <div class="mb-40 mt-14">
                <a href="/user/wallet/edit" class="text-secondary text-base">クレジットカード情報を変更する</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="fixed-footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/runtime-core';
import PageTitle from '../../components/common/page/PageTitle.vue';
import PageSection from '../../components/common/page/PageSection.vue';
import Menu from '../../components/common/sidebar/Menu.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import Footer from '../../components/Footer.vue';

export default defineComponent({
  components: {
    PageTitle,
    PageSection,
    Menu,
    SubmitButton,
    Footer
},
  setup() {
    const $appData = inject('$appData') as {
      number: string,
      expire: string,
      enabled: boolean,
      cardType: string,
      cardImage: string,
    };
    const cardNumber = $appData.number;
    const cardExpire = $appData.expire;
    const enabled = $appData.enabled;
    const cardImage = $appData.cardImage;
    return {
      cardNumber,
      cardExpire,
      enabled,
      cardImage,
    };
  }
});
</script>

<style lang="scss" scoped>
.wallet-card {
  cursor: pointer;
  &__content {
    @media screen and (min-width: 768px) {
      display: flex;
      img {
        margin-right: 10px;
      }
    }   
  }
}
.text-message {
  color: var(--danger-color);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
}
</style>
