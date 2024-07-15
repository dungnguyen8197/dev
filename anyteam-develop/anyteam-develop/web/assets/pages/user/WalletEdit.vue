<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <div class="wallet-container">
          <PageTitle title="決済情報" class="px-16" is-center/>
          <PageSection v-if="!walletDetail">
            <div class="py-8 text-center text-sm">まだクレジットカード情報が登録されていません</div>
          </PageSection>
          <form class="form-theme--default">
            <PageSection title="クレジットカード情報">
              <div class="text-sm">以下のマークが付いているクレジットカードでお支払いいただけます。</div>
              <div class="flex wallet__cards mt-16">
                <img src="/public/images/common/icon-mastercard.png" />
                <img src="/public/images/common/icon-visa.png" />
                <img src="/public/images/common/icon-jcb.png" />
                <img src="/public/images/common/icon-american-express.png" />
                <img src="/public/images/common/icon-dinners-club.png" />
              </div>
              <div class="mt-22 mr-30">
                <p v-if="isError" class="text-danger">{{ updateFailureMessage }}</p>
                <Item label="カード番号(半角)">
                  <div class="ml-36">
                    <InputText
                      placeholder="012345678999999"
                      :value="wallet.cardNumber"
                      @input="($event) => { updateField($event, 'cardNumber'); }"
                      :error-message="errorMessage.cardNumber"
                      number-only
                    />
                  </div>
                </Item>
                <Item label="有効期限" :error-class="'ml-36'" :error-message="errorMessage.expireMonth || errorMessage.expireYear">
                  <div class="ml-36 flex items-center">
                    <InputText
                      input-class="w-80px"
                      placeholder="05"
                      :value="wallet.expireMonth"
                      @input="($event) => { updateField($event, 'expireMonth'); }"
                      number-only
                    />
                    <span class="mx-7">/</span>
                    <InputText
                      input-class="w-80px"
                      placeholder="25"
                      :value="wallet.expireYear"
                      @input="($event) => { updateField($event, 'expireYear'); }"
                      number-only
                    />
                  </div>
                </Item>
                <Item label="カード確認番号">
                  <div class="ml-36">
                    <InputText
                      input-class="w-80px"
                      placeholder="123"
                      :value="wallet.cvv"
                      @input="($event) => { updateField($event, 'cvv'); }"
                      :error-message="errorMessage.cvv"
                      number-only
                    />
                  </div>
                </Item>
              </div>
              <div class="text-xs mt-22">
                ※お支払い方法はクレジットカードのみとなっており、デビットカード・チャージ式のプリペイドカードはご利用いただけません。
              </div>
            </PageSection>
            <div class="text-center mt-40 mb-60">
              <SubmitButton :active="canSubmit" v-bind:handle-click="handleSubmit" label="登録する" />
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <Modal v-if="showModal">
      <p class="text-center">登録が完了しました</p>
      <SubmitButton label="戻る" active v-bind:handle-click="closeModal" />
    </Modal>
    <Footer/>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@vue/runtime-core';
import { ref, reactive, computed } from '@vue/reactivity';
import PageTitle from '../../components/common/page/PageTitle.vue';
import PageSection from '../../components/common/page/PageSection.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import InputText from "../../components/form/InputText.vue";
import Item from "../../components/form/Item.vue";
import Modal from "../../components/Modal.vue";
import Footer from '../../components/Footer.vue';
import Menu from '../../components/common/sidebar/Menu.vue';
import { updateFailureMessage } from '../../constants/messages';
import { Wallet } from '../../types/support/wallet';
import { MeWalletRO, WalletEditRO } from '../../types/user/wallet';
import { GMOTokenObject, GMOUpdateRequest } from '../../types/gmo';
import { updateWallet } from '../../api/support';
import { validateCreditCard } from '../../helpers/card-validate';

export default defineComponent({
  components: {
    PageTitle,
    PageSection,
    SubmitButton,
    InputText,
    Item,
    Menu,
    Modal,
    Footer
},
  setup() {
    const inProcess = ref(false);
    const isError = ref(false);
    const showModal = ref(false);
    const canSubmit = computed<boolean>(() => {
      return !errorMessage.cardNumber 
        && !errorMessage.expireMonth 
        && !errorMessage.expireYear 
        && !errorMessage.cvv
        && wallet.cardNumber.length > 0
        && wallet.expireMonth.length > 0
        && wallet.expireYear.length > 0
        && wallet.cvv.length > 0
        && !inProcess.value;
    })
    const wallet = reactive<Wallet>({
      cardNumber: '',
      expireMonth: '',
      expireYear: '',
      cvv: '',
    });
    const errorMessage = reactive<Wallet>({
      cardNumber: '',
      expireMonth: '',
      expireYear: '',
      cvv: '',
    });
    const walletDetail = ref<MeWalletRO>({
      card_no: '',
      payment_method: '',
      expiration_year: '',
      expiration_month: '',
    });

    const appData = inject('$appData') as WalletEditRO;
    walletDetail.value = appData.wallet;

    onMounted(() => {
      const tokenScriptUrl = process.env.GMO_TOKEN_URL;
      if (!tokenScriptUrl) {
        return;
      }
      let tokenScript = document.createElement('script');
      tokenScript.src = tokenScriptUrl;
      document.body.appendChild(tokenScript);
    })

    const updateField = (event: string, field: string) => {
      inProcess.value = false;
      wallet[field] = event;
      errorMessage[field] = validateCreditCard(wallet, field);
    }

    const handleSubmit = async () => {
      try {
        isError.value = false;
        inProcess.value = true;
        const Multipayment = (window as any).Multipayment;
      
        const shopID = process.env.SHOP_ID;
        if (!shopID) {
          return;
        }
        Multipayment.init(shopID);

        const TOKEN_NUMBER = 2; // fixed value
        Multipayment.getToken({
          cardno: wallet.cardNumber,
          expire: wallet.expireYear + wallet.expireMonth,
          securitycode: wallet.cvv,
          tokennumber: TOKEN_NUMBER,
        }, async (response: GMOTokenObject) => {
          const GMOUpdateRequest: GMOUpdateRequest = {
            card_no: response.tokenObject.maskedCardNo,
            expiration_year: wallet.expireYear,
            expiration_month: wallet.expireMonth,
            exec_tran_token: response.tokenObject.token[0],
            save_card_token: response.tokenObject.token[1]
          }
          const GMOUpdateResponse = await updateWallet(GMOUpdateRequest);
          if (GMOUpdateResponse === 'Success') {
            showModal.value = true;
          } else {
            errorMessage.cardNumber = GMOUpdateResponse.data.Message;
            isError.value = true;
          }
        });
      } catch (err) {
        isError.value = true;
      }
    }
    const closeModal = () => {
      window.location.href = '/user/wallet';
    }
    return {
      canSubmit,
      inProcess,
      isError,
      wallet,
      showModal,
      errorMessage,
      updateFailureMessage,
      updateField,
      handleSubmit,
      closeModal,
      walletDetail,
    }
  }
})
</script>

<style lang="scss" scoped>
.wallet {
  &__cards {
    & > img {
      width: 48px;
      height: 33px;
      margin-right: 8px;
    }
  }
}
</style>