<template>
  <div>
    <div class="wallet-container mt-40">
      <PageTitle title="支払い方法選択" class="px-16" is-center/>
      <form class="form-theme--default">
        <PageSection class="wallet-card" :class="{ active }" @click="changeActive" :error="!enabled">
          <div class="flex">
            <span class="wallet-card__radio mt-10 mr-30"></span>
            <div>
              <img :src="`/public/images/common/${cardImage}`" alt="">
              <div class="text-sm">{{ cardNumber }}</div>
              <div class="text-sm">使用期限 {{ cardExpire }}</div>
            </div>
          </div>
        </PageSection>
        <div class="text-center mt-24">
          <div class="text-message text-sm" v-if="!enabled">
            <div class="w-80">
              <div class="py-4">現在のお支払い用カードはご利用になれません。</div>
              <div class="py-4">他のカードを登録してください。</div>
            </div>
          </div>
          <div class="mb-40 mt-14">
            <a href="/support/wallet/edit" class="text-secondary text-base">他のクレジットカードを使う</a>
          </div>
          <SubmitButton label="確認画面へ" :active="active" :handle-click="onBtnClick" />
        </div>
      </form>
    </div>
    <div class="fixed-footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import PageTitle from '../../components/common/page/PageTitle.vue';
import PageSection from '../../components/common/page/PageSection.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import Footer from '../../components/Footer.vue';

export default defineComponent({
  components: {
    PageTitle,
    PageSection,
    SubmitButton,
    Footer,
  },
  setup() {
    const active = ref<boolean>(false);

    const onBtnClick = () => {
      window.location.href = '/support/confirm';
    }

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

    const changeActive = () => {
      if (enabled) {
        active.value = !active.value;
      }
    }
    return {
      active,
      cardNumber,
      cardExpire,
      enabled,
      cardImage,
      onBtnClick,
      changeActive,
    };
  }
});
</script>

<style lang="scss" scoped>
.wallet-card {
  cursor: pointer;
  &__radio {
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-gray);
    padding: 0;
    background: var(--white-color);
    display: inline-block;
    border-radius: 50%;
  }

  &__holder {
    text-transform: uppercase;
  }
  &.active {
    border-top: 2px solid var(--secondary-color);
    border-bottom: 2px solid var(--secondary-color);
    & .wallet-card__radio {
      border: 3px solid var(--secondary-color);
    }
    @media screen and (min-width: 768px) {
      border: 2px solid var(--secondary-color);
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
