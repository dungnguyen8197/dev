<template>
  <div>
    <div class="font-18 mt-25">サービスの特徴</div>
    <ServiceItem
      v-for="(item, index) in serviceItems"
      :key="index"
      :image="item.image"
      :title="item.title"
      :description="item.description"
    />
    <div class="flex flex-col items-center">
      <button class="btn btn-secondary btn-wide">部活を探す</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import ServiceItem from './ServiceItem.vue';

export default defineComponent({
  components: { ServiceItem },
  setup() {
    const serviceItems = [
      {
        image: '/public/images/about/icon-phone.svg',
        title:
          '<span class="text-secondary">学生スポーツへの支援</span>が簡単に！',
        description:
          'これまでは難しかった部活への直接支援を簡単に行うことができます。クレジットカードさえあれば500円からお手軽に支援可能です。ANYTEAMは資金難にあえぐ学生スポーツを支え、さらなる飛躍の一助となるべくプラットフォームとして、日本の部活動を応援します。',
      },
      {
        image: '/public/images/about/icon-gift.svg',
        title:
          'スタイルに合わせて選べる<br><span class="text-secondary">2つの支援プラン</span>',
        description:
          '毎月◯日に自動的に支援する「定期プラン」、単発で支援する「通常プラン」の2つのプランをご用意しています。長期的に支援をしたい場合は定期、大会等のハイシーズンで単発で支援する場合は通常、など用途や予算に応じてプランをお選びください。',
      },
      {
        image: '/public/images/about/icon-letter.svg',
        title:
          '支援したチームから<span class="text-secondary">感謝状</span>が届く！',
        description:
          '支援が完了すると支援した部活から感謝状が届きます。感謝状はそのままSNSにシェアすることができるので、部活公認の支援者として支援の“輪”を広げることが可能です。※感謝状は画像データのみとなります。',
      },
      {
        image: '/public/images/about/icon-person.svg',
        title:
          '部活ごとの<span class="text-secondary">支援者を確認</span>できる！',
        description:
          '支援した部活の「支援者一覧」を閲覧できます。同級生やOB会のメンバー、ファンの支援状況を確認し、部活を支える支援者コミュニティの発展にお役立てください。※匿名での支援も可能です。',
      },
      {
        image: '/public/images/about/icon-trophy.svg',
        title:
          '支援状況を<span class="text-secondary">ランキング</span>で掲載！',
        description:
          'ANYTEAM内には地域や、競技、学校等の、支援金 額に応じたランキングを公開しています。支援した部 活が全国で何位にいるのかチェックしてみてください。',
      },
    ];

    return { serviceItems };
  },
});
</script>
