<template>
  <el-dialog
    :title="`Chi tiết giao dịch Golfer: ${objData.fullname} (vID${objData.id})`"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="80%"
  >
    <div class="pb-2">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="loadingExportExcel"
        @click="handleDownload"
      >
        Export excel
      </el-button>
    </div>
    <div>
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="STT"
          width="100"
          align="center"
          type="index"
          :index="handleIndexMethod"
        />
        <el-table-column
          prop="provider"
          label="Dịch vụ"
          align="center"
        />
        <el-table-column
          label="Phương thức thanh toán"
          align="center"
          prop="type"
        />

        <el-table-column
          label="Số tiền"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.money) }}
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày thanh toán"
          align="center"
        >
          <template slot-scope="scope">
            {{ convertDateTimeSecond(scope.row.created_at) }}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetListNoteGolfer"
        />
      </el-row>
    </div>

  </el-dialog>
</template>

<script>
// import Vue from 'vue'
import ListGolferResource from '@/api/membership/golfer'
import { convertTypeAccount } from '@/utils/convertNumberToString'
import { convertDateTimeSecond, convertDate, formatNumber } from '@/utils/convert'
import Pagination from '@/components/Pagination/index.vue'

const listGolferResources = new ListGolferResource()
export default {
  name: 'DialogHistoryTransaction',
  components: { Pagination },
  props: {
    objDetail: {
      type: Object,
      default: () => {
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: { page: 1, limit: 10 },
      dialogVisible: false,
      tableData: [],
      from: 1,
      total: 0,
      objData: {},
      dateC: '',
      images: [],
      loadingTable: false,
      loadingExportExcel: false,
      dataUser: []
    }
  },
  watch: {
    objDetail(value) {
      if (value) {
        this.listQuery = { user_id: value.id, limit: 10, page: 1 }
        this.onGetListNoteGolfer()
        this.objData = Object.assign({}, value)
      }
    },
    showDialog(value) {
      this.dialogVisible = value
    }
  },
  methods: {
    formatNumber,
    onGetListNoteGolfer() {
      this.loadingTable = true
      listGolferResources.historyTransactionUser(this.listQuery).then(response => {
        if (response.error_code === 0) {
          this.tableData = response.data.data
          this.dataUser = response.data
          console.log('ssssssssssssss', this.dataUser)
          this.total = response.data.total || 0
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$emit('clickButton', false)
      done()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    indexMethod(index) {
      return index + this.from
    },
    async handleDownload() {
      let stop = false
      const query = {
        page: 1,
        limit: 1000,
        user_id: this.listQuery.user_id
      }
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await listGolferResources.historyTransactionUser(query)
          console.log('res..............', res)
          console.log('this.tableData', res.data.data)
          if (res.data.data.length <= 0) {
            stop = true
          }
          list_all = [...list_all, ...res.data.data]
          console.log('list_all', list_all)
          if (res.error_code === 0) {
            stop = true
          }
        } catch (error) {
          console.error(error)
          stop = true
        }
      }

      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['vID', 'Dịch vụ', 'Phương thức thanh toán', 'Số tiền', 'Ngày thanh toán']
        const filterVal = ['user_id', 'provider', 'type', 'money', 'created_at']
        let data = list_all
        data = this.formatJson(filterVal, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-list'
        })
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'name') {
          return v[j]
        } else if (j === 'user_name') {
          return v[j]
        } else if (j === 'provider') {
          return v[j]
        } else if (j === 'type') {
          return v[j]
        } else if (j === 'money') {
          return formatNumber(v[j])
        } else if (j === 'created_at') {
          return convertDateTimeSecond(v[j])
        } else {
          return v[j]
        }
      }))
    },

    convertTypeAccount,
    convertDateTimeSecond,
    convertDate
  }
}
</script>

<style scoped>
.w-100 {
  width: 80%;
}

.padding-style {
  padding-bottom: 15px;
}
</style>
