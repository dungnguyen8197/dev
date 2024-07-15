<template>
  <div>

    <pagination
      v-show="total > listQuery.limit"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="onGetList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'InsuranceDebtIndex',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      list: []
    }
  },
  methods: {
    onGetList() {
      this.list = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
