<template>
  <div>
    <PageHeader background="/public/images/organizations/img-header-supporter.png" title="運動高等学校支援者一覧"></PageHeader>
    <div class="supporter__container">
      <p class="text-xs sp-only px-16">※表示されている金額は前日分までの支援情報です。当日分は含みません</p>
      <SupporterList :supporters="supporters"/>
      <Pagination
        class="mt-30 mb-40"
        :total-items="100"
        :items-per-page="10"
        :active-page="activePage"
        @update:active-page="($event) => { activePage = $event }"
      />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import PageHeader from "../../components/common/page/PageHeader.vue";
import Pagination from '../../components/Pagination.vue';
import SupporterList from '../../components/common/supporter/SupporterList.vue';
import { Supporter } from '../../types/support/supporter';
import Footer from '../../components/Footer.vue';

export default defineComponent({
  components: { PageHeader, Pagination, SupporterList, Footer },
  setup() {
    const activePage = ref<number>(1);
    const supporters: Supporter[] = [
      {
        id: 1,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 10797000,
      },
      {
        id: 2,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 3,
        icon: "",
        name: "長い名前の場合は改行を入れて対応します長い名前の場合",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 4,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 5,
        icon: "",
        name: "長い名前の場合は改行を入れて対応します長い名前の場合",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
    ]

    return {
      supporters,
      activePage,
    }
  }
});
</script>

<style lang="scss" scoped>
.supporter {
  &__container {
    width: 100%;
    margin: 0 auto;
    max-width: 720px;
    background-color: var(--white-color);
  }
  @media screen and (min-width: 768px) {
    &__container {
      margin-top: 40px;
      margin-bottom: 40px;
      padding: 0 20px 40px;
    }
  }
}
</style>
