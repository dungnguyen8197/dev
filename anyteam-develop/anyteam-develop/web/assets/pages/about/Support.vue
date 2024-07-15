<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-25">
      <PageTitle title="支援の流れ" />
      <template v-for="(step, index) in supportSteps" :key="index">
        <SupportStep
          :icon="step.icon"
          :title="step.title"
          :content="step.content"
          :image="step.image"
          :line="step.line"
        />
      </template>
    </div>
    <div class="mt-40 mb-40">
      <Navigation />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SupportStep from '../../components/common/about/SupportStep.vue';
import { SupportStepInfo } from '../../types/about/support-step';
import Navigation from '../../components/common/about/Navigation.vue';
import Footer from '../../components/Footer.vue';
import BreadcrumbMenu from '../../components/breadcrumb/BreadcrumbMenu.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';

export default defineComponent({
  components: { SupportStep, Navigation, Footer, BreadcrumbMenu, PageTitle },
  setup() {
    const supportSteps: SupportStepInfo[] = [
      {
        icon: '/public/images/about/support/step-zero.svg',
        title: '会員登録',
        content:
          '<a class="text-secondary" href="/user/register/">会員登録</a>に必要な情報はメールアドレスだけです。登録する際に個人会員か法人会員かを選択してご登録いただきます。登録内容はマイページよりご確認・変更することができます。',
        image: '/public/images/about/support/phone-zero.svg',
        line: true,
      },
      {
        icon: '/public/images/about/support/step-one.svg',
        title: '部活を探す',
        content:
          '都道府県、大学・高校・中学の学校区分から学校を検索して、支援したい部活を探してください。部活のページでは各種ランキングや支援者一覧を確認することもできます。<br>※支援者一覧は、その部活に支援している方のみ閲覧可能です。',
        image: '/public/images/about/support/phone-one.svg',
        line: true,
      },
      {
        icon: '/public/images/about/support/step-two.svg',
        title: '支援プランを選択',
        content:
          '1回のみの「通常支援」、毎月1回自動的に支援する「定期支援」（サブスク形式）の、2つのプランから選択できます。通常支援は1,000円から、定期支援は500円から支援可能です。ご希望に合わせて支援プランを選択してください。。',
        image: '/public/images/about/support/phone-two.svg',
        line: true,
      },
      {
        icon: '/public/images/about/support/step-three.svg',
        title: 'ユーザー情報/決済情報を入力',
        content:
          '名前などの必要事項を入力して決済を進めます。決済はクレジットカード払いのみご利用いただけます。名前等の個人情報は寄付控除を申請する際や、学校側への支援者情報提供に利用されますので、正確に登録してください。ANYTEAM内の<br>部活ページにも支援者名は表示されますが、匿名での支援も可能です。',
        image: '/public/images/about/support/phone-three.svg',
        line: true,
      },
      {
        icon: '/public/images/about/support/step-four.svg',
        title: '感謝状を受け取る',
        content:
          '支援が完了すると、支援した部活から感謝状が授与されます。感謝状は画像として保存やTwitterなどのSNSでシェアすることができます。',
        image: '/public/images/about/support/phone-four.svg',
        line: true,
      },
      {
        icon: '/public/images/about/support/step-five.svg',
        title: 'ランキングに反映',
        content:
          '支援金額が支援した部活のランキングデータとして蓄積。<a class="text-secondary" href="/user/ranking">ランキングページ</a>には支援金額を基にした様々なランキングが表示されていますので、ぜひご確認ください。<br>※ランキングデータは毎日0時に更新されます',
        image: '/public/images/about/support/phone-five.svg',
        line: false,
      },
    ];

    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '',
        text: '支援の流れ',
      },
    ];
    return {
      supportSteps,
      breadcrumbs,
    };
  },
});
</script>
