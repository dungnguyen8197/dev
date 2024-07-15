<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <PageTitle class="px-16" title="支援履歴" is-center/>
        <div v-if="payments.length > 0" class="mb-60">
          <ul class="com-user-supports__items">
            <li
              class="com-user-supports__item"
              v-for="payment in payments"
              :key="payment.id"
            >
              <a :href="`/user/supports/${payment.id}/reward`" class="text-deco-none w-full">
                <div>
                  <span>
                    <span class="com-user-supports__item-badges">
                      <span
                        class="badge"
                        :class="'badge-' + getPurchaseType(payment.type).color"
                      >
                        {{ getPurchaseType(payment.type).displayedLabel }}
                      </span>
                    </span>
                    <span class="com-user-supports__item-date">{{ formatDateWithText(payment.created_at) }}</span>
                  </span>
                  <div class="com-user-supports__item-title text-primary">{{ payment.team_name }}</div>
                  <div class="com-user-supports__item-money text-primary">ご支援金額 - {{ formatAmount(payment.amount) }}円</div>
                </div>
              </a>
            </li>
          </ul>
        </div>
        <div class="px-16 mb-60" v-else>
          {{ noData }}
        </div>
        <Pagination
          v-if="total > PAYMENTS_PER_PAGE"
          class="mt-30 mb-40"
          :total-items="total"
          :items-per-page="PAYMENTS_PER_PAGE"
          :active-page="activePage"
          @update:active-page="updateActivePage"
        />
      </div>
    </div>    
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import { formatDateWithText } from '../../helpers/datetime';
import { getPurchaseType } from '../../helpers/purchase';
import { formatAmount } from '../../helpers/amount';
import Footer from '../../components/Footer.vue';
import Pagination from '../../components/Pagination.vue';
import { PaymentRO, Payment } from '../../types/payment';
import PageTitle from '../../components/common/page/PageTitle.vue';
import Menu from '../../components/common/sidebar/Menu.vue';
import { noData } from '../../constants/messages';
import { PAYMENTS_PER_PAGE } from '../../../constants/pagination';

export default defineComponent({
  components: {
    Footer,
    Pagination,
    PageTitle,
    Menu
},
  setup() {
    const total = ref<number>(0);
    const activePage = ref<number>(1);
    const payments = ref<Payment[]>([]);

    const updateActivePage = (page: number) => {
      window.location.href = '/user/supports?page=' + page;
    };

    onMounted(() => {
      const $appData = inject('$appData') as PaymentRO;

      total.value = $appData.total;
      activePage.value = $appData.page;
      payments.value = $appData.list;
    });

    return {
      noData,
      PAYMENTS_PER_PAGE,
      payments,
      total,
      activePage,
      formatDateWithText,
      getPurchaseType,
      formatAmount,
      updateActivePage,
    }
  },
});
</script>
<style lang="scss" scoped>
.com-user-supports {
  &__items {
    list-style: none;
    margin: auto;
    padding: 0;
    cursor: pointer;
  }
  &__item {
    border-top: 1px solid var(--light-color);
    position: relative;
    padding: 15px 42px 15px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      background: var(--light-color);
    }
    &:last-child {
      border-bottom: 1px solid var(--light-color);
    }
    &:after {
      content: "";
      position: absolute;
      background: url(/public/images/common/icon-arrow-right.svg);
      width: 12px;
      height: 10px;
      right: 16px;
      background-repeat: no-repeat;
    }

    &-title {
      font-size: 1.5rem;
      flex: 0 0 50%;
    }

    &-date {
      font-size: 1rem;
      margin-right: 24px;
      color: var(--dark-gray-color);
    }

    &-money {
      font-size: 1.5rem;
    }

    &-link {
      font-size: 1.2rem;
      color: var(--secondary-color);
    }
    .badge {
      font-size: 1rem;
      margin-right: 8px;
      padding: 2px 5px;
    }
  }
}
</style>

