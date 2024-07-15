<template>
  <div>
    <BreadcrumbMenu :paths="breadcrumbs" />
    <div class="section-container mt-25">
      <Hero />
      <Service />
      <div class="mt-52 font-20">部活が支援金を受け取る流れ</div>
      <div class="mt-37 font-12">
        ご支援金は
        ANYTEAMを通じて各学校の口座へと支払われ、学校が運動部のための施設費、運営費、遠征費などの資金として分配します。
      </div>
      <div class="mt-48">
        <FlowSupport />
      </div>
    </div>
    <div class="mt-40 mb-40">
      <Navigation />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BreadcrumbMenu from '../../components/breadcrumb/BreadcrumbMenu.vue';
import Hero from '../../components/common/about/Hero.vue';
import Service from '../../components/common/about/Service.vue';
import Footer from '../../components/Footer.vue';
import FlowSupport from '../../components/common/about/FlowSupport.vue';
import Navigation from '../../components/common/about/Navigation.vue';

export default defineComponent({
  components: {
    BreadcrumbMenu,
    Hero,
    Service,
    Footer,
    FlowSupport,
    Navigation,
  },
  setup() {
    const breadcrumbs = [
      {
        url: '/',
        text: 'トップ',
      },
      {
        url: '',
        text: 'ANYTEAMとは',
      },
    ];
    return {
      breadcrumbs,
    };
  },
});
</script>
