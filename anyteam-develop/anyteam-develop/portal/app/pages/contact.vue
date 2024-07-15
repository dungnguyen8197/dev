<template>
  <div>
    <Header title="お問い合わせ"/>
    <div class="contact">
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Header from '~/components/Header.vue'

  export default Vue.extend({
  name: 'Contact',
  head() {
    return {
      title: 'お問い合わせ'
    }
  },
  components: {
    Header,
  },
})
</script>
