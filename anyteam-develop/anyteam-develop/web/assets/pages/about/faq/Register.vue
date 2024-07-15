<template>
  <div>
    <div class="section-container mt-25">
      <PageTitle title="お問い合わせの前に" is-center></PageTitle>
      <div class="mt-52">
        <Accordion :items="items"></Accordion>
      </div>
      <div class="sp-only">
        <div class="font-15 mt-30 mb-15">読んでも解決しない場合</div>
        <Menu :menus="contactMenus"></Menu>
      </div>
      <div class="pc-tablet-only text-center font-15 mt-40 mb-60">
        読んでも解決しない場合は
        <a href="/about/contact" class="text-secondary">こちら</a>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '../../../components/Footer.vue';
import PageTitle from '../../../components/common/page/PageTitle.vue';
import Accordion from '../../../components/accordion/Accordion.vue';
import Menu from '../../../components/common/menu/Menu.vue';

export default defineComponent({
  components: {
    Footer,
    PageTitle,
    Accordion,
    Menu,
  },
  setup() {
    const items = [
      {
        title: 'Question 1?',
        content: 'Content 1?',
      },
      {
        title: 'Question 2?',
        content: 'Content 2?',
      },
      {
        title: 'Question 3?',
        content: 'Content 3?',
      },
      {
        title: 'Question 4?',
        content: 'Content 4?',
      },
    ];
    const contactMenus = [{ title: 'お問い合わせ', link: '/about/contact' }];
    return {
      items,
      contactMenus,
    };
  },
});
</script>
