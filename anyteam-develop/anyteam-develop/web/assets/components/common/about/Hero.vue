<template>
  <div class="hero">
    <PageTitle title="ANYTEAMとは" />
    <div class="text-sm py-12">
      <div>誰でもどこでも</div>
      <div>応援するチームを</div>
      <div>簡単に“支援”できる</div>
      <div>新たなプラットフォーム</div>
    </div>
    <div class="text-normal text-secondary font-15">
      <div>学生スポーツの底上げこそが</div>
      <div>日本のスポーツ界の発展につながる</div>
    </div>
    <p class="text-sm">
      学生スポーツの運営資金難を解決し、未来のスポーツ界の発展に向けた投資を促進するためにも「学生スポーツに新たな財源の創出」が必要である。
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import PageTitle from "../../../components/common/page/PageTitle.vue";

export default defineComponent({
  components: {
    PageTitle,
  },
});
</script>

<style lang="scss" scope>
.hero {
  background-image: url(/public/images/about/background.svg);
  background-size: contain;
  background-position: center right;
  background-repeat: no-repeat;
}
</style>
