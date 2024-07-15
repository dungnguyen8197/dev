<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-24 mb-60 company-container">
      <PageTitle title="運営会社" />
      <div class="text-sm mt-30">
        <div>株式会社運動通信社</div>
        <div class="mt-12">所在地 : 東京都港区西新橋2-19-5 かザマビル2F</div>
        <div class="mt-12">代表者 : 代表取締役社長 黒飛功二郎</div>
        <div class="mt-12">
          事業内容 : インターネットメディア「SPORTS BULL」の運営など
        </div>
        <div class="mt-12">
          URL :
          <a
            href="https://sportsbull.jp/about/company/"
            class="text-red text-deco-none"
            rel="nofollow"
            >https://sportsbull.jp/about/company/</a
          >
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '../../components/Footer.vue';
import BreadcrumbMenu from '../../components/breadcrumb/BreadcrumbMenu.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';

export default defineComponent({
  components: { Footer, BreadcrumbMenu, PageTitle },
  setup() {
    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '',
        text: '運営会社',
      },
    ];
    return {
      breadcrumbs,
    };
  },
});
</script>

<style lang="scss" scope>
.company-container {
  min-height: calc(100vh - 471px);
  @media screen and (min-width: 768px) {
    min-height: calc(100vh - 446px);
  }
}
</style>
