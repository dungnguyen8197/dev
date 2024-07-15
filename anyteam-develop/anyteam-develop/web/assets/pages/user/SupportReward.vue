<template>
  <div>
    <div class="section-container px-0 support-complete__container">
      <PageTitle class="sp-only px-16" title="支援内容の詳細" />
      <PageSection v-if="support.team_name" pc-transperant>
        <div class="support-complete__title px-24">{{ support.team_name }}への支援ありがとうございました！</div>
        <div class="bg-white px-16 py-8 mt-16">
          <div>
            <span class="badge mr-10" :class="`badge-${purchaseTypeColor}`">{{ purchaseTypeName }}</span>
            <span class="text-xs text-dark-gray">{{ formatDateWithText(support.purchased_at) }}〜</span>
          </div>
          <div class="mt-6 flex items-center justify-between">
            <div class="text-sm">ご支援金額</div>
            <div class="mr-30">{{ formatAmount(support.amount) }}<span class="text-sm">円</span></div>
          </div>
          <div class="ranking__divider"></div>
          <div class="text-xs mt-10">
            ※月額支援プランを選択した場合は毎月00日に引き落とされます。
            <br>
            支援履歴はマイページから確認することができます。
          </div>
        </div>
        <div class="text-center pc-tablet-only mt-25">
          <a v-if="support.type === 2" href="/user/withdrawal">
            <button class="btn btn-wide support-complete__btn-outline">定期支援を停止</button>
          </a>
          <a v-else href="#">
            <button class="btn btn-wide support-complete__btn-outline">受領書を発行</button>
          </a>
        </div>
        <div class="mt-22 flex justify-center support-complete__reward">
          <img :src="support.reward" alt="reward">
          <div class="support-complete__reward-download-wrap">
            <a 
              :href="support.reward" target="_blank" rel="noopener noreferrer"
              class="support-complete__reward-download flex flex-col items-center text-deco-none"
            >
              <img src="/public/images/common/icon-download.svg" alt="download">
              <div>保存</div>
            </a>
          </div>
        </div>
        <div class="mt-22 support-complete__sns">
        <p class="text-sm text-center">ご支援感謝状をSNSでシェアしましょう！</p>
        <div class="flex items-center justify-center mt-16">
          <div class="flex flex-col items-center support-complete__sns-item mr-15">
            <img src="/public/images/sns/facebook.png" alt="">
            <div class="text-xs mt-6">Facebook</div>
          </div>
          <div class="flex flex-col items-center support-complete__sns-item">
            <img src="/public/images/sns/twitter.png" alt="">
            <div class="text-xs mt-6">Twitter</div>
          </div>
        </div>
      </div>
      </PageSection>
      <PageSection v-else>
        {{ noData }}
      </PageSection>
      <div class="mb-25 mt-40">
        <div class="ranking">
          <div class="support-complete__btn-group">
            <div class="support-complete__btn">
              <a :href="`/organizations/${support.organization_id}/teams/${support.team_id}`">
                <button class="btn btn-secondary btn-wide">部活のページを見る</button>
              </a>
            </div>
            <div class="support-complete__btn">
              <a :href="`/organizations/${support.organization_id}`">
                <button class="btn btn-secondary btn-wide">他の部活を支援する</button>
              </a>
            </div>
            <div class="support-complete__btn">
              <a href="/#search">
                <button class="btn btn-secondary btn-wide">他の学校を探す</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject } from '@vue/runtime-core';
import { ref, computed } from '@vue/reactivity';
import PageSection from '../../components/common/page/PageSection.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';
import TeamActivitySupporters from '../../components/common/organizations/TeamActivitySupporters.vue';
import Footer from '../../components/Footer.vue';
import { formatDateWithText } from '../../helpers/datetime';
import { formatAmount } from '../../helpers/amount';
import { Supporter } from '../../types/support/supporter';
import { PurchaseTypeVO } from '../../helpers/purchase';
import { PurchaseResponse } from '../../types/purchase';
import { noData } from '../../constants/messages';

const supporters: Supporter[] = [
  {
    id: 1,
    name: '遠藤啓太',
    amount: 10797000,
    createdAt: '2021.11.30',
    regionName: '東京',
    active: '30代'
  },
  {
    id: 2,
    name: '遠藤啓太',
    amount: 100000,
    createdAt: '2021.11.30',
    regionName: '東京',
    active: '30代'
  },
  {
    id: 3,
    name: '長い名前の場合は改行を入れて対応します長い名前の場合',
    amount: 100000,
    createdAt: '2021.11.30',
    regionName: '東京',
    active: '30代'
  },
  {
    id: 4,
    name: '遠藤啓太',
    amount: 100000,
    createdAt: '2021.11.30',
    regionName: '東京',
    active: '30代'
  },
  {
    id: 5,
    name: '長い名前の場合は改行を入れて対応します長い名前の場合',
    amount: 100000,
    createdAt: '2021.11.30',
    regionName: '東京',
    active: '30代'
  },
]

export default defineComponent({
  components: { PageSection, Footer, TeamActivitySupporters, PageTitle },
  setup() {
    const support = ref({} as PurchaseResponse);

    const purchaseTypeName = computed<string>(() => {
      const purchaseType = new PurchaseTypeVO(support.value.type);
      return purchaseType.displayedLabel || '';
    })

    const purchaseTypeColor = computed<string>(() => {
      const purchaseType = new PurchaseTypeVO(support.value.type);
      return purchaseType.color || 'secondary';
    })

    onMounted(() => {
      const $appData = inject("$appData") as PurchaseResponse;
      support.value = $appData;
    });

    return {
      support,
      purchaseTypeName,
      purchaseTypeColor,
      supporters,
      noData,
      formatDateWithText,
      formatAmount,
    }
  },
});
</script>

<style lang="scss" scoped>
.support-complete {
  &__title {
    line-height: 1.25em;
    font-size: 1.5rem;
  }
  &__reward {
    position: relative;
    & > img {
      width: 100%;
      height: auto;
      max-width: 600px;
    }
    &-download-wrap {
      position: absolute;
      top: 0;
      width: 100%;
      max-width: 600px;
      display: flex;
      justify-content: end;
      padding: 8px;
    }
    &-download {
      background-color: rgba(0, 0, 0, 0.7);
      color: var(--white-color);
      font-size: 8px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      padding: 4px;
      cursor: pointer;
    }
  }
  &__btn-outline {
    border: 1px solid var(--secondary-color);
    color: var(--secondary-color);
    background-color: var(--white-color);
  }
  &__btn-group {
    margin-top: 16px;
    text-align: center;
  }
  &__btn {
    margin-top: 16px;
  }
  @media screen and (min-width: 768px) {
    &__container {
      margin-top: 40px;
    }
    &__btn-group {
      display: flex;
      justify-content: center;
    }
    &__btn {
      margin-right: 16px;
      margin-left: 16px;
      &:last-child {
        button {
          border: 1px solid var(--secondary-color);
          background-color: var(--white-color);
          color: var(--secondary-color);
        }
      }
    }
  }
}
</style>
