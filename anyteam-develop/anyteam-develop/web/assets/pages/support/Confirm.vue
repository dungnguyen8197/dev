<template>
  <div>
    <div class="section-container mt-40">
      <PageTitle title="支援内容の確認" is-center/>
      <div v-if="supportInfo">
        <div class="px-16 mt-22">
          <div class="text-base mb-6">支援内容</div>
          <table>
            <tbody>
              <tr>
                <td>支援先</td>
                <td>{{ supportInfo.team_name }}</td>
              </tr>
              <tr>
                <td>{{ supportInfo.support_type_name }}</td>
                <td>{{ formatAmount(supportInfo.support_amount || 0) }}円</td>
              </tr>
              <tr>
                <td>お名前</td>
                <td>{{ supportInfo.lastname }}{{ supportInfo.firstname }}</td>
              </tr>
              <tr>
                <td>フリガナ</td>
                <td>{{ supportInfo.lastname_kana }}{{ supportInfo.firstname_kana }}</td>
              </tr>
              <tr>
                <td>性別</td>
                <td>{{ supportInfo.gender_type_id === 1 ? '男性' : '女性' }}</td>
              </tr>
              <tr>
                <td>生年月日</td>
                <td>{{ formatDateWithText(supportInfo.birthday) }}</td>
              </tr>
              <tr>
                <td>住所</td>
                <td>
                  <div>{{ supportInfo.postal_code }}</div>
                  <div>
                    {{ supportInfo.region_name }}
                    {{ supportInfo.municipalities }}
                    {{ supportInfo.address }}
                    {{ supportInfo.building_name }}
                  </div>
                </td>
              </tr>
              <tr>
                <td>出身大学</td>
                <td>{{ supportInfo.university_name || '未入力' }}</td>
              </tr>
              <tr>
                <td>部活動(大学)</td>
                <td>{{ supportInfo.university_club || '未入力' }}</td>
              </tr>
              <tr>
                <td>出身高校</td>
                <td>{{ supportInfo.high_school_name || '未入力' }}</td>
              </tr>
              <tr>
                <td>部活動(高校)</td>
                <td>{{ supportInfo.high_school_club || '未入力' }}</td>
              </tr>
              <tr>
                <td>出身中学</td>
                <td>{{ supportInfo.junior_high_school_name || '未入力' }}</td>
              </tr>
              <tr>
                <td>部活動(中学)</td>
                <td>{{ supportInfo.junior_high_school_club || '未入力'  }}</td>
              </tr>
              <tr>
                <td>好きな競技</td>
                <td>
                  <div>{{ supportInfo.favorite_competition1 }}</div>
                  <div>{{ supportInfo.favorite_competition2 }}</div>
                  <div>{{ supportInfo.favorite_competition3 }}</div>
                  <div 
                    v-if="!supportInfo.favorite_competition1 
                        && !supportInfo.favorite_competition2 
                        && !supportInfo.favorite_competition3"
                  >
                    未入力
                  </div>
                </td>
              </tr>
              <tr>
                <td>好きなチーム</td>
                <td>
                  <div>{{ supportInfo.favorite_team1 }}</div>
                  <div>{{ supportInfo.favorite_team2 }}</div>
                  <div>{{ supportInfo.favorite_team3 }}</div>
                  <div 
                    v-if="!supportInfo.favorite_team1 
                        && !supportInfo.favorite_team2 
                        && !supportInfo.favorite_team3"
                  >
                    未入力
                  </div>
                </td>
              </tr>
              <tr>
                <td>支援者名簿への掲載</td>
                <td v-if="supportInfo.is_anonymous">匿名での支援を希望する</td>
                <td v-else>匿名での支援を希望しない</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center mt-16">
            <a class="text-primary" :href="`/support?team_id=${supportInfo.team_id}`">支援情報を変更する</a>
          </div>
        </div>
        <div class="px-16 mt-22">
          <div class="text-base mb-6">支払い情報</div>
          <table>
            <tbody>
              <tr>
                <td>カード番号(半角)</td>
                <td>{{ cardNumber }}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center mt-16">
            <a class="text-primary" href="/support/wallet/edit">支払い方法を変更する</a>
          </div>
        </div>
        <div style="height: 1px"></div>
        </div>
      <div class="px-16" v-else>
        {{ noData }}
      </div>
    </div>
    <div class="text-center mt-40 mb-60">
      <SubmitButton :active="!isLoading" v-bind:handle-click="handleSubmit" label="この内容で支援する" />
    </div>
    <div style="height: 1px"></div>
    <Modal v-show="isError">
      <div class="px-16">
        <p class="text-center">決済処理エラー</p>
        <p class="text-center text-base">決済処理中にエラーが発生しました。時間をおいてもう一度やり直すか、運営事務局にお問い合わせください。</p>
      </div>
      <SubmitButton label="戻る" active v-bind:handle-click="() => { isError = false }" />
    </Modal>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import PageTitle from '../../components/common/page/PageTitle.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import Modal from '../../components/Modal.vue';
import { SupportInfo } from '../../types/support/info';
import { formatDateWithText } from '../../helpers/datetime';
import { formatAmount } from '../../helpers/amount';
import { executeSupport } from '../../api/support';
import { noData } from '../../constants/messages';
import Footer from '../../components/Footer.vue';

export default defineComponent({
  components: {
    PageTitle,
    SubmitButton,
    Footer,
    Modal,
  },
  setup() {
    const supportInfo = ref<SupportInfo>({} as SupportInfo);
    const cardNumber = ref<string>('');
    const isError = ref<boolean>(false);
    const isLoading = ref<boolean>(false);

    const handleSubmit = async () => {
      isError.value = false;
      isLoading.value = true;
      try {
        const response = await executeSupport();
        const purchaseId = response.purchase_id;
        window.location.href = `/support/${purchaseId}/complete`;
      } catch (err) {
        console.log(err);
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    }

    onMounted(async () => {
      const $appData = inject('$appData') as { cardNumber: string, supportInfo: SupportInfo };
      supportInfo.value = $appData.supportInfo;
      cardNumber.value = $appData.cardNumber;
    });

    return {
      supportInfo,
      noData,
      cardNumber,
      isError,
      isLoading,
      formatDateWithText,
      formatAmount,
      handleSubmit,
    }
  }
});
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  & > tbody {
    & > tr {
      border-bottom: 1px solid #D8D8D8;
      &:first-child {
        border-top: 1px solid #D8D8D8;
      }
      & > td {
        vertical-align: top;
        padding: 6px 8px;
        font-size: 1.4rem;
        &:first-child {
          width: 150px;
          background-color: var(--light-color);
        }
      }
    }
  }
}
</style>
