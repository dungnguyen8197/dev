<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-24">
      <PageTitle title="特定商取引法に基づく表記"/>
      <div class="mb-60 text-sm">
        <div class="mt-25 mb-25">
          ｢特定商取引に関する法律」第11条に基づき、以下のとおり表示いたします。
          <br>
          （なお、当社提供サービスによっては、別途表示を設けている場合がございます。その場合には、当該表示が優先されます。）
        </div>
        <div class="mt-25 mb-25">
          <p class="mt-6 mb-6">販売事業者の名称・所在地</p>
          LINE株式会社
          <br>
          東京都新宿区四谷一丁目6番1号
        </div>
        <div class="mt-25 mb-25">
          <p class="mt-6 mb-6">代表者名</p>
          <p class="mt-6 mb-6">サンプル太郎</p>
        </div>
        <div class="mt-25 mb-25">
          <p class="mt-6 mb-6">お問い合わせ</p>
          <a href="https://contact-sample" class="text-secondary">https://contact-sample.</a>
        </div>
        <div class="mt-25 mb-25">
          <p class="mt-6 mb-6">キャンセル</p>
          <div>
            （1）通常支援の場合
            <br>
            サンプルテキストがはいります。サンプルテキストがはいりま
            す。サンプルテキストがはいります。サンプルテキストがはいり
            ます。サンプルテキストがはいります。
            <br>
            （2）定期支援の場合
            <br>
            サンプルテキストがはいります。サンプルテキストがはいりま
            す。サンプルテキストがはいります。サンプルテキストがはいり
            ます。サンプルテキストがはいります。サンプルテキストがはい
            ります。サンプルテキストがはいります。サンプルテキストがは
            いります。
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BreadcrumbMenu from '../../components/breadcrumb/BreadcrumbMenu.vue';
import Footer from '../../components/Footer.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';

export default defineComponent({
  components: {
    BreadcrumbMenu,
    PageTitle,
    Footer,
  },
  setup() {
    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '',
        text: '特定商取引法に基づく表記',
      },
    ];
    return {
      breadcrumbs,
    };
  },
});
</script>
