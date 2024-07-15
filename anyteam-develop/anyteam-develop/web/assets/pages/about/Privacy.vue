<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-24 mb-60">
      <PageTitle title="プライバシーポリシー" />
      <div class="text-sm">
        <div>
          この規約(以下「本規約」といいます。)は、〇〇会社(以下「当
          社」といいます。)が提供するすべてのサービス(以下「本サービ
          ス」といいます。)の利用に関する条件を、本サービスを利用す
          るお客様(以下「お客様」といいます。)と当社との間で定める ものです。
        </div>
        <div class="mt-30">
          <div>1.定義</div>
          <div class="mt-10">
            1.1.サンプルテキストが入りますサンプルテキストが入ります<br />
            1.2.サンプルテキストが入りますサンプルテキストが入ります<br />
            1.3.サンプルテキストが入りますサンプルテキストが入ります<br />
            1.4.サンプルテキストが入りますサンプルテキストが入りますサンプルテキストが入りますサンプルテキストが入ります。<br />
          </div>
        </div>

        <div class="mt-30">
          <div>1.定義</div>
          <div class="mt-10">
            1.1.サンプルテキストが入りますサンプルテキストが入ります<br />
            1.2.サンプルテキストが入りますサンプルテキストが入ります<br />
            1.3.サンプルテキストが入りますサンプルテキストが入ります<br />
            1.4.サンプルテキストが入りますサンプルテキストが入りますサンプルテキストが入りますサンプルテキストが入ります。<br />
          </div>
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
  components: { BreadcrumbMenu, Footer, PageTitle },
  setup() {
    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '',
        text: 'プライバシーポリシー',
      },
    ];
    return {
      breadcrumbs,
    };
  },
});
</script>
