<template>
  <div class="dashboard-container">
    <!--    <component :is="currentRole" />-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    // this.$router.push({ path: '/t99' })
  }
}
</script>
<style scoped>
  .mt-20 {
    margin-top: 20px;
  }

  .h-50 {
    height: 50px;
  }
</style>
