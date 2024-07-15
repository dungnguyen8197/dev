<template>
  <PageSection title="支援方法" pc-transperant>
    <div>
      <div class="flex">
        <div class="pc-tablet-only text-sm support__input-label support__input-label--1">
          支援方式
          <span class="badge badge-secondary">必須</span>
        </div>
        <TypeSelect
          class="mr-10"
          :title="types[0].displayedLabel"
          :description="types[0].description"
          :image="types[0].image"
          :amount="types[0].minAmount"
          :currency="types[0].currency"
          @click="updateActiveTypeId(types[0].id)"
          :active="activeTypeId === types[0].id"
        />
        <TypeSelect
          :title="types[1].displayedLabel"
          :description="types[1].description"
          :image="types[1].image"
          :amount="types[1].minAmount"
          :currency="types[1].currency"
          @click="updateActiveTypeId(types[1].id)"
          :active="activeTypeId === types[1].id"
        />
      </div>
      <div v-show="activeTypeId" class="flex mt-16">
        <label class="text-sm mt-12 support__input-label support__input-label--1" >
          金額を入力
          <span class="badge badge-secondary">必須</span>
        </label>
        <div style="flex: 1;">
          <div class="flex">
            <InputText 
              class="mr-10 input-amount" id="input-amount"
              :value="formatAmount(amount)"
              :error-message="errorMessage"
              @input="updateAmount"
              number-only
            />
            <span class="text-sm mt-12">円</span>
          </div>
          <Alert :close-icon="false" style="text-align: left;">
            ※{{ formatAmount(minAmount) }}円以上の金額で入力してください。
          </Alert>
        </div>
      </div>
    </div>
  </PageSection>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { computed } from '@vue/reactivity';
import PageSection from '../page/PageSection.vue';
import TypeSelect from './TypeSelect.vue';
import InputText from '../../form/InputText.vue';
import Alert from '../../alerts/Alert.vue';
import { invalidMinVal } from '../../../constants/messages';
import { purchaseTypes as types, PurchaseTypeVO } from '../../../helpers/purchase';
import { formatAmount, amountToNumber } from '../../../helpers/amount';

export default defineComponent({
  components: {
    PageSection,
    TypeSelect,
    InputText,
    Alert,
  },
  props: {
    activeTypeId: {
      type: Number,
      required: true,
      default: 0
    },
    amount: {
      type: Number,
      default: ''
    },
  },
  emits: ['update:type', 'input'],
  setup(props, context) {
    const errorMessage = computed<string>(() => {
      const activeType = new PurchaseTypeVO(props.activeTypeId);
      return activeType.validateMinAmount(props.amount) ? '' : invalidMinVal;
    });
    const minAmount = computed<number>(() => {
      const activeType = new PurchaseTypeVO(props.activeTypeId);
      return activeType.minAmount;
    });

    const focusInput = () => {
      document.getElementById('input-amount')!.querySelector('input')!.focus();
    }
    const updateActiveTypeId = (id: number) => {
      const activeType = new PurchaseTypeVO(id);
      context.emit('update:type', {
        type: id,
        title: activeType.displayedLabel,
        minAmount: minAmount.value,
      });
      focusInput();
    } 

    const updateAmount = (value: string) => {
      const activeType = new PurchaseTypeVO(props.activeTypeId);
      context.emit('input', {
        amount: amountToNumber(value),
        isValid: activeType.validateMinAmount(amountToNumber(value)),
      });
    }

    return {
      types,
      errorMessage,
      minAmount,
      formatAmount,
      updateActiveTypeId,
      updateAmount,
    }
  }
})
</script>

<style lang="scss" scoped>
.input-amount :deep(input) {
  text-align: right;
  padding-right: 12px;
  @media screen and (min-width: 768px) {
    width: 210px;
  }
}
.input-amount {
  @media screen and (max-width: 768px) {
    flex: 1;
  }
}
</style>