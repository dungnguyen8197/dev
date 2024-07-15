<template>
  <el-row class="list-extend-account">
    <el-row class="list-extend-account__search">
      <el-col :sm="8" class="pr-5">
        <!-- <div class="search-golfer">
          <search-golfer @getObjectGolfer="onGetSelected" />
        </div> -->
      </el-col>
      <el-col :sm="8">
        <div class="block">
          <el-date-picker
            v-model="dateRange"
            class="date-rang-history w-100"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            :picker-options="pickerOptions"
          />
        </div>
      </el-col>
      <el-col :sm="8">
        <div class="text-right">
          <el-button icon="el-icon-refresh" @click="onRefreshSearch"> Refresh</el-button>
          <el-button type="primary" icon="el-icon-search" @click="onGetHistoryExtendAccount(1)">Tìm kiếm</el-button>
          <el-button type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="onExportHistory">Xuất excel</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="list-extend-account__table">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="handleIndexMethod"
          label="STT"
          width="50"
        />
        <el-table-column
          prop="golfer.fullname"
          label="Họ và tên"
        />
        <!--                <el-table-column-->
        <!--                    prop="golfer.phone"-->
        <!--                    label="Số điện thoại">-->
        <!--                </el-table-column>-->
        <el-table-column
          prop="option_account.option_name"
          label="Loại gia hạn"
        />
        <el-table-column
          label="Thành tiền"
        >
          <template slot-scope="props">
            <template v-if="props.row.option_account">
              {{ formatNumber(props.row.option_account.amount) }} VNĐ
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="expried_time"
          label="Ngày hết hạn"
        />
        <el-table-column
          label="Người nâng cấp"
        >
          <template v-if="scope.row.admin" slot-scope="scope">
            {{ (scope.row.admin.name) }}
          </template>
        </el-table-column>
        <el-table-column
          label="Trạng thái"
        >
          <template slot-scope="scope">
            <el-tag :type="(scope.row.is_pay === 1) ? 'success' : 'info'">{{ (scope.row.is_pay === 1) ? 'Đã thanh toán' : 'Chưa thanh toán' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="Ghi chú"
        />
      </el-table>
      <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="onGetHistoryExtendAccount" />
    </el-row>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'
import { pickerOptions, selectOptions } from '@/utils/dateRangOptions'
// import SearchGolfer from '@/components/SearchGolfer/index'
import { convertDate, formatNumber } from '@/utils/convert'
const ExtendedAccountResource = new Resource('api/v1/get-extended-accounts')
const ExportExtendedAccountResource = new Resource('api/v1/export-extended-accounts')
const RemoveFileResource = new Resource('api/v1/public-remove-file')
import Pagination from '@/components/Pagination'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'HistoryExtendAccount',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions
      },
      dateRange: [],
      options: selectOptions,
      listQuery: {
        page: 1,
        limit: 10,
        type: 1
      },
      total: 0,
      from: 0,
      loadingSearchUser: false,
      loadingTable: false,
      loadingExportExcel: false,
      golfers: [],
      tableData: []
    }
  },
  watch: {
    dateRange(value) {
      this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD')
      this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD')
    }
  },
  mounted() {
    this.onGetHistoryExtendAccount()
  },
  methods: {
    onGetSelected(object) {
      this.listQuery.user_id = object.value
    },
    onGetHistoryExtendAccount(e) {
      if (e === 1) {
        this.listQuery.page = 1
      }
      this.loadingTable = true
      ExtendedAccountResource.list(this.listQuery).then(response => {
        this.loadingTable = false
        const result = response.data
        this.tableData = result.data
        this.total = result.total
        this.from = result.from
      })
    },
    async onExportHistory() {
      this.loadingExportExcel = true
      await ExportExtendedAccountResource.list(this.listQuery).then(response => {
        if (response.error_code === 0) {
          this.handleDownloadExport(response.data.url_file)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handleDownloadExport(urlFile) {
      const self = this
      axios({
        url: urlFile,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `Basic ${getToken()}`
        }
      }).then(response => {
        self.loadingExportExcel = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const date = new Date()
        const fileName = `${date.getUTCFullYear()}_${date.getUTCMonth() + 1}_${date.getUTCDate()}_${date.getTime()}_lich_su_nang_cap.xlsx`
        link.setAttribute('download', fileName) // or any other extension
        document.body.appendChild(link)
        link.click()
        self.handleRemoveFileExcel(urlFile)
      })
    },
    handleRemoveFileExcel(path) {
      RemoveFileResource.list({ path: path })
    },
    handleIndexMethod(index) {
      return this.from + index
    },
    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.onGetHistoryExtendAccount()
    },
    convertDate,
    formatNumber
  }
}
</script>

<style lang="scss" scoped>
    .list-extend-account {
        .pr-5 {
            padding-right: 5px;
        }
    }
</style>
