<template>
  <div>
    <PageHeader
      background="/public/images/organizations/img-header-school.png"
      title="運動高等学校"
    ></PageHeader>
    <div class="container">
      <div>
        <div class="section">
          <h3 class="section__title">ランキング</h3>
          <div>
            <RankingGroups></RankingGroups>
          </div>
        </div>

        <div class="section">
          <h3 class="section__title">支援するチームを選択</h3>
          <div>
            <SelectTeam></SelectTeam>
          </div>
        </div>

        <div class="section">
          <h3 class="section__title">支援者一覧</h3>
          <div>− 個人</div>
          <div>
            <ListSupporter :items="invidualSupporters" readmore="#"></ListSupporter>
          </div>
          <div>− 法人</div>
          <div>
            <ListSupporter :items="corporateSupporters" readmore="#"></ListSupporter>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import PageHeader from "../../components/common/page/PageHeader.vue";
import RankingGroups from "../../components/common/organizations/RankingGroups.vue";
import SelectTeam from "../../components/common/organizations/SelectTeam.vue";
import ListSupporter from "../../components/common/organizations/ListSupporter.vue";

export default defineComponent({
  components: { PageHeader, RankingGroups, SelectTeam, ListSupporter },
  setup() {
    const invidualSupporters = [
      {
        avatar: "",
        name: "遠藤啓太",
        location: "東京/30代",
        money: "10,797,000円",
      },
      {
        avatar: "",
        name: "長い名前の場合は改行を入れて対応します",
        location: "東京/30代",
        money: "797,000円",
      },
      {
        avatar: "",
        name: "遠藤啓太",
        location: "東京/30代",
        money: "7,000円",
      },
      {
        avatar: "",
        name: "遠藤啓太",
        location: "東京/30代",
        money: "7,000円",
      },
    ];

    const corporateSupporters = [
      {
        avatar: "",
        name: "遠藤啓太",
        money: "10,797,000円",
      },
      {
        avatar: "",
        name: "長い名前の場合は改行を入れて対応します",
        money: "797,000円",
      },
      {
        avatar: "",
        name: "遠藤啓太",
        money: "7,000円",
      },
      {
        avatar: "",
        name: "遠藤啓太",
        money: "7,000円",
      },
    ];
    return { invidualSupporters, corporateSupporters };
  },
});
</script>

