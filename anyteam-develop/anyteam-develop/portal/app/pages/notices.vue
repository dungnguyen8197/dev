<template>
  <div>
    <Header title="お知らせ"/>
    <div class="notices">
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'ANYTEAM内で〇〇ができるようになりました'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'アップデートのお知らせ'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'メンテナンスのお知らせ'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'○月○日の不具合に関するお詫び'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'ANYTEAM内で〇〇ができるようになりました！'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'アップデートのお知らせ'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'メンテナンスのお知らせ'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'○月○日の不具合に関するお詫び'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'メンテナンスのお知らせ'"/>
      <NoticeItem v-bind:date="'2021.10.21'" v-bind:title="'○月○日の不具合に関するお詫び'"/>
    </div>
    <Pagination
      v-bind:totalItems="100"
      v-bind:itemsPerPage="10"
      v-bind:activePage="activePage"
      v-on:updateActivePage="updateActivePage"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Header from '~/components/Header.vue'
  import NoticeItem from "~/components/notices/NoticeItem.vue";
  import Pagination from "~/components/common/Pagination.vue";

  export default Vue.extend({
  name: 'Notices',
  head() {
    return {
      title: 'お知らせ'
    }
  },
  components: {
    Pagination,
    NoticeItem,
    Header,
  },
  data() {
    return {
      activePage: 1,
    }
  },
  methods: {
    updateActivePage(page: number) {
      this.activePage = page;
    }
  }
})
</script>
