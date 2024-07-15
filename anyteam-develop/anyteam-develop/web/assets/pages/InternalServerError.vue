<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-40">
      <PageTitle title="一時的なエラーが発生しました" is-center/>
      <div> 
        <div class="page__text">
          <p>サーバーで問題が発生しているためページを表示できません。</p>
          <p>しばらく時間を置いてからやり直してください。</p>
        </div>
        <div @click="redirect" class="text-center mt-40">
          <button class="btn btn-secondary btn-wide">トップページへ</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import Footer from "../components/Footer.vue";
import BreadcrumbMenu from '../components/breadcrumb/BreadcrumbMenu.vue';
import PageTitle from '../components/common/page/PageTitle.vue';

export default defineComponent({
  components: { 
    Footer,
    BreadcrumbMenu,
    PageTitle,
  },
  setup(){
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

   const redirect = () => {
      window.location.href = '/';
    };
    
    return {
      breadcrumbs,
      redirect,
    };
  }
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

