<template>
  <div>
    <div class="section-container mt-24 mb-60 maintenance-container">
      <PageTitle title="ただいまメンテナンス中です" is-center class="px-16"/>
      <div class="maintenance">
        <div class="maintenance__time">
          <p>[メンテナンス日時]</p>
          <p>{{ `${dateStart}${timeStart}〜${timeEnd}` }}</p>
        </div>
        <div class="maintenance__message">
          <p>ご不便をおかけして申し訳ございません</p>
          <p>メンテナンス作業が完了するまで今しばらくお待ちください。</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '../components/Footer.vue';
import PageTitle from '../components/common/page/PageTitle.vue';

export default defineComponent({
  components: {
    Footer,
    PageTitle,
  },
  setup() {
    const dateStart = '2022年2月2月';
    const timeStart = '16:00';
    const timeEnd = '20:00';
    return {
      dateStart,
      timeStart,
      timeEnd,
    };
  },
});
</script>

<style lang="scss" scoped>
.maintenance {
  min-height: calc(100vh - 655px);
  text-align: center;
  font-size: 12px;
  margin: 80px 0 170px 0;
    &-container {
    padding-left: 0;
    padding-right: 0;
  }
  &__time {
    background-color: var(--light-color);
    padding: 15px;
    p {
      margin: 0;
    }
  }
  &__message {
    margin-top: 20px;
    p {
      margin: 0;
    }
  }
  @media screen and (min-width: 768px) {
    max-width: 375px;
    margin-left: auto;
    margin-right: auto;
    font-size: 15px;
    min-height: calc(100vh - 646px);
  }
}
</style>
