<template>
  <el-dialog
    :title="`Lịch sử nâng cấp tài khoản: ${objData.fullname} (vID${objData.id})`"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-row class="box-form">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="STT"
          :index="indexMethod"
          width="50"
        />
        <el-table-column
          label="Nội dung"
        >
          <template slot-scope="scope">
            {{ `Nâng cấp tài khoản từ: ${handleConvertType(scope.row.type_before) } -> ${handleConvertType(scope.row.type)}` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="Ghi chú"
        />
      </el-table>
      <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="onGetHistoryUpgradeAccount" />
    </el-row>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
// import ListGolferResource from '@/api/membership/golfer'
// const listGolferResources = new ListGolferResource()
export default {
  name: 'HistoryChangeGolfer',
  components: { Pagination },
  props: {
    objDetail: {
      type: Object,
      default: () => {}
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loadingTable: false,
      tableData: [],
      listQuery: {
        limit: 10,
        page: 1
      },
      from: 1,
      total: 1,
      objData: {}
    }
  },
  watch: {
    objDetail(value) {
      if (value) {
        this.listQuery = { ...this.listQuery, ...{ user_id: value.id }}
        this.onGetHistoryUpgradeAccount()
        this.objData = Object.assign({}, value)
      }
    },
    showDialog(value) {
      this.dialogVisible = value
    }
  },
  methods: {
    onGetHistoryUpgradeAccount() {
      // this.loadingTable = true
      // listGolferResources.historyUpgrade(this.listBody, this.listQuery).then(response => {
      //   if (response.error_code === 0) {
      //     const result = response.data
      //     this.listQuery = { ...this.listQuery, ...{ page: result.current_page }}
      //     this.total = result.total
      //     this.tableData = result.data
      //   }
      //   this.loadingTable = false
      // })
    },
    handleConvertType(type) {
      switch (type) {
        case 0:
          return 'Tài khoản thường'
        case 1:
          return 'Tài khoản VIP'
        case 2:
          return 'Tài khoản Member'
        default:
          return 'Tài khoản Premium'
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$emit('clickButton', false)
      done()
    },
    indexMethod(index) {
      return index + this.from
    }
  }
}
</script>

<style scoped>

</style>
