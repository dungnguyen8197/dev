<template>
  <el-row class="list-history-change-vga" width="80%">
    <el-row>
      <el-row class="box-search">
        <el-col :sm="8">
          <div class="search-golfer">
            <el-select
              v-model="listQuery.vga_old"
              v-loading="loadingSearchUser"
              filterable
              remote
              class="w-100"
              placeholder="Nhập mã vID"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="golfer in golfers"
                :key="golfer.value"
                :label="golfer.label"
                :value="golfer.value"
              />
            </el-select>
          </div>
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
            <el-button type="primary" icon="el-icon-search">Tìm kiếm</el-button>
            <el-button type="primary" icon="el-icon-download" :loading="loadingExportExcel">Xuất excel</el-button>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-col class="history-content">
      <template>
        <el-table
          :data="tableData"
          :loading="loading"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="STT"
            :index="handleIndexMethod"
            width="50"
          />
          <el-table-column
            prop="golfer.fullname"
            label="Họ và tên"
          />
          <el-table-column
            prop="name"
            label="Mã VID mới"
          >
            <template slot-scope="scope">
              {{ `VID${scope.row.vga_change}` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="Giá mua mã mới"
          >
            <template v-if="scope.row.v3_user" slot-scope="scope">
              {{ formatNumber(scope.row.v3_user.amount) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="Mã VID cũ"
          >
            <template slot-scope="scope">
              {{ `VID${scope.row.vga_old}` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="Nguồn thay đổi"
          >
            <template slot-scope="scope">
              <el-tag type="info">{{ (scope.row.type === 0) ? 'Mobile' : 'CMS Business' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="time_change"
            label="Ngày thay đổi"
          />
          <el-table-column
            prop="note"
            label="Ghi chú"
          />
        </el-table>
      </template>
      <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" />
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'
import { pickerOptions, selectOptions } from '@/utils/dateRangOptions'
import { convertDate } from '@/utils/convert'
import Pagination from '@/components/Pagination'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { formatNumber } from '@/utils/convert'
const RemoveFileResource = new Resource('api/v1/public-remove-file')

export default {
  name: 'HistoryChangeVga',
  components: { Pagination },
  data() {
    return {
      activeName: '1',
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
      from: 0,
      total: 0,
      loadingSearchUser: false,
      golfers: [],
      loading: false,
      tableData: [],
      loadingExportExcel: false
    }
  },
  watch: {
    dateRange(value) {
      this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD')
      this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD')
    }
  },
  mounted() {
    // this.onGetHistoryChangeVga()
  },
  methods: {
    // async onGetHistoryChangeVga(e) {
    //   if (e === 1) {
    //     this.listQuery.page = 1
    //   }
    //   this.loading = true
    //   await this.$store.dispatch('getHistoryLogChangeVga', this.listQuery).then(response => {
    //     this.loading = false
    //     if (response.error_code === 0) {
    //       const result = response.data
    //       this.tableData = [...result.data]
    //       this.total = result.total
    //       this.from = result.from
    //     }
    //   })
    // },
    // async onExportHistory() {
    //   this.loadingExportExcel = true
    //   this.listQuery.action = 1
    //   await this.$store.dispatch('exportHistoryChangeAccount', this.listQuery).then(response => {
    //     if (response.error_code === 0) {
    //       this.handleDownloadExport(response.data.url_file)
    //     } else {
    //       this.$message.error(response.message)
    //     }
    //   })
    // },
    handleDownloadExport(urlFile) {
      axios({
        url: urlFile,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `Basic ${getToken()}`
        }
      }).then(response => {
        this.loadingExportExcel = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const date = new Date()
        const fileName = `${date.getUTCFullYear()}_${date.getUTCMonth() + 1}_${date.getUTCDate()}_${date.getTime()}_lich_su_doi_ma.xlsx`
        link.setAttribute('download', fileName) // or any other extension
        document.body.appendChild(link)
        link.click()
        this.handleRemoveFileExcel(urlFile)
      })
    },
    handleRemoveFileExcel(path) {
      RemoveFileResource.list({ path: path })
    },
    remoteMethod(keyword) {
      this.loadingSearchUser = true
      if (keyword === '' || keyword === undefined) {
        this.golfers = []
        return
      }
      const params = { keyword: keyword }
      this.$store.dispatch('searchGolfer', params).then(response => {
        if (response.error_code === 0) {
          this.loadingSearchUser = false
          const result = response.data
          if (result.data.length > 0) {
            const array = []
            result.data.map(value => {
              const name = `${value.fullname} (${value.nickname})`
              const item = { value: value.id, label: name }
              array.push(item)
            })
            this.golfers = [...array]
          }
        }
      })
    },
    handleIndexMethod(index) {
      return this.from + index
    },
    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      // this.onGetHistoryChangeVga()
    },
    convertDate,
    formatNumber
  }
}
</script>
