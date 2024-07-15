<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 class="title">Phòng truyền thống</h3>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
// import Pagination from '@/components/Pagination/index'
// import { formatDate, formatNumber } from '@/utils/convert'
// import AdminClubResource from '@/api/club/admin-club'

// const adminClubResource = new AdminClubResource()

export default {
  name: 'ListPartner',
  components: {
    // Pagination
  },

  data() {
    return {}
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700px;
  text-transform: uppercase;
}
</style>

