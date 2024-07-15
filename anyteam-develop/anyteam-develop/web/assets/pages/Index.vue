<template>
  <div>
    <HeroBanner></HeroBanner>
    <div class="section-container mt-36 mb-40">
      <SearchSchoolForm />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import SearchSchoolForm from "../components/common/searchSchool/SearchSchoolForm.vue";
import HeroBanner from "../components/common/top/HeroBanner.vue";
import Footer from "../components/Footer.vue";

export default {
  components: { 
    SearchSchoolForm, 
    HeroBanner,
    Footer,
  },
};
</script>

