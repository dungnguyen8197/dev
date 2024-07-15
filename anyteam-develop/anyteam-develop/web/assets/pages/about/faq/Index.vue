<template>
  <div class="mt-25">
    <div class="section-container">
      <PageTitle title="お問い合わせの前に" is-center></PageTitle>
      <div class="font-15 faq__title">まずは、Q&Aをお読みください</div>
      <div class="text-sm mt-15">
        Q&Aをご確認いただいて解決しない場合は、下部のお問い合わせフォームに必要事項を記入いただきお問い合わせください。
      </div>
      <div class="faq__menu">
        <div class="font-15 mt-30 faq__title">Q&A</div>
        <Menu :menus="faqMenus"></Menu>
      </div>
      <div class="sp-only">
        <div class="font-15 mt-30">読んでも解決しない場合</div>
        <Menu :menus="contactMenus"></Menu>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '../../../components/Footer.vue';
import PageTitle from '../../../components/common/page/PageTitle.vue';
import Menu from '../../../components/common/menu/Menu.vue';

export default defineComponent({
  components: {
    Footer,
    PageTitle,
    Menu,
  },
  setup() {
    const faqMenus = [
      {
        title: '登録関連',
        link: '/about/faq/register/',
      },
      {
        title: 'ログイン関連',
        link: '/about/faq/login/',
      },
      {
        title: '寄付関連',
        link: '/about/faq/donation/',
      },
      {
        title: 'アカウント関連',
        link: '/about/faq/account/',
      },
      {
        title: 'ANYTEAMについて',
        link: '/about/',
      },
      {
        title: '決済関連',
        link: '/about/faq/payment/',
      },
      {
        title: 'キャンセル関連',
        link: '/about/faq/cancel/',
      },
      {
        title: '退会関連',
        link: '/about/faq/withdrawal',
      },
    ];
    const contactMenus = [{ title: 'お問い合わせ', link: '/about/contact' }];
    return {
      faqMenus,
      contactMenus,
    };
  },
});
</script>

<style lang="scss">
@media screen and (min-width: 768px) {
  .faq__title {
    font-size: 20px;
  }
  .faq__menu {
    margin-bottom: 50px;
  }
}
</style>
