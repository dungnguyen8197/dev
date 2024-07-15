<template>
  <div>
    <div class="wallet-container mt-40">
      <PageTitle title="支払い方法選択" class="px-16" is-center/>
      <PageSection v-if="active">
        <div class="py-8 text-center text-sm">まだクレジットカード情報が登録されていません。</div>
      </PageSection>
      <PageSection error v-if="errorMessage.common">
        <div class="py-8 text-center text-sm">{{ errorMessage.common }}</div>
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
          <SubmitButton :active="canSubmit && !inProcess" v-bind:handle-click="handleSubmit" label="登録する" />
        </div>
      </form>
    </div>
    <Footer />
    <Modal v-if="showModal">
      <p class="text-center">登録が完了しました</p>
      <SubmitButton label="戻る" active v-bind:handle-click="closeModal" />
    </Modal>
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
import Footer from "../../components/Footer.vue";
import { updateFailureMessage } from '../../constants/messages';
import { Wallet, WalletError } from '../../types/support/wallet';
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
    Modal,
    Footer,
  },
  setup() {
    const active = ref<boolean>(false);
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

    const errorMessage = reactive<WalletError>({
      cardNumber: '',
      expireMonth: '',
      expireYear: '',
      cvv: '',
      common: '',
    });

    onMounted(() => {
      const tokenScriptUrl = process.env.GMO_TOKEN_URL;
      if (!tokenScriptUrl) {
        return;
      }

      let tokenScript = document.createElement('script');
      tokenScript.src = tokenScriptUrl;
      document.body.appendChild(tokenScript);

      const $appData = inject('$appData') as {
        active: boolean,
      };
      active.value = $appData.active;
    })

    const updateField = (event: string, field: string) => {
      inProcess.value = false;
      wallet[field] = event;
      errorMessage[field] = validateCreditCard(wallet, field);
    }

    const clearError = () => {
      errorMessage.cardNumber = '';
      errorMessage.expireMonth = '';
      errorMessage.expireYear = '';
      errorMessage.cvv = '';
      errorMessage.common = '';
    }

    const handleSubmit = async () => {
      try {
        clearError();
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
            errorMessage.common = GMOUpdateResponse.data.Message;
            isError.value = true;
          }
        });
      } catch (err) {
        console.log(err);
        isError.value = true;
      }
    }

    const closeModal = () => {
      window.location.href = '/support/wallet';
    }

    return {
      active,
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
