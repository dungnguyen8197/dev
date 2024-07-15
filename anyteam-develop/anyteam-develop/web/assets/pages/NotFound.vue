<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-40">
      <PageTitle title="お探しのページが" class="mt-36 mb-0" is-center/>
      <PageTitle title="見つかりませんでした" is-center/>
      <div class="px-16 mt-20 mb-60 page__text">
        <div>お探しのページが見つかりませんんでした。</div>
        <div>
          一時的にアクセスできない状況にあるか、移動もしくは削除さ
          <br>
          れた可能性があります。
        </div>
        <div>
          URLをご確認の上再度お試しいただくか、トップページよりお
          <br>
          探しください。
        </div>
        <div class="text-center mt-36">
          <a href="/">
            <button class="btn btn-secondary btn-wide">トップページへ</button>
          </a>
        </div>
      </div>
    </div>
    <Footer class="footer"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import BreadcrumbMenu from '../components/breadcrumb/BreadcrumbMenu.vue';
import PageTitle from '../components/common/page/PageTitle.vue';
import Footer from '../components/Footer.vue';

export default defineComponent({
  components: {
    BreadcrumbMenu,
    PageTitle,
    Footer
},
  setup() {
    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '',
        text: 'お探しのページが見つかりませんでした',
      },
    ];
    return {
      breadcrumbs,
    };
  },
});
</script>

<style lang="scss" scoped>
.page__text {
  font-size: 12px;
  @media screen and (min-width: 768px) {
    text-align: center;
    font-size: 15px;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
