<template>
  <div>
    <Sidebar />
    <div class="main-container">
      <main>
        <div>
          <nuxt class="container"/>
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import Sidebar from '../components/sidebar/Sidebar.vue'
import Footer from '../components/Footer.vue'

@Component({
  components: {
    Sidebar,
    Footer,
  }
})
export default class DefaultLayout extends Vue {

}
</script>

<style lang="scss" scoped>
.main-container {
  width: calc(100% - 24rem);
  margin-left: 24rem;

  @media (max-width: 1008px) {
    margin-left: 0;
    width: 100%;
  }
}
</style>
