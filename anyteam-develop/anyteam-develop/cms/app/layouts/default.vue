<template>
  <div class="c-app">
    <Sidebar />
    <CWrapper>
      <Header />
      <div class="c-body">
        <main class="c-main">
          <div class="container-fluid">
            <nuxt />
          </div>
        </main>
        <Footer />
      </div>
    </CWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'

@Component({
  components: {
    Header,
    Sidebar,
    Footer
  }
})
export default class DefaultLayout extends Vue {
  
}
</script>