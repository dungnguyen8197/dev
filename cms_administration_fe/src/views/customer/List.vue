<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="12">
        <h3 class="title">Danh sách khách hàng thân thiết</h3>
      </el-col>
      <el-col :sm="12" align="right">
        <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
        <el-button type="primary" @click="createCustom">Thêm mới</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          :loading="loadingExportExcel"
          @click="handleDownload"
        >
          Export excel
        </el-button>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-button>
              Tổng khách hàng: <b>{{ formatNumber(total) }}</b>
            </el-button>
            <el-button>
              Chờ phê duyệt: <b>{{ formatNumber(total_waiting) }}</b>
            </el-button>
          </div>
        </el-col>
        <el-col class="search-custom" :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="listQuery.user_id" placeholder="mã khách hàng" />
          </div>
        </el-col>
        <el-col class="search-custom" :span="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="listQuery.is_approve"
              class="w-100"
              clearable
              placeholder="Trạng thái phê duyệt"
            >
              <el-option
                v-for="item in listStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-custom" :span="5">
          <div class="grid-content bg-purple">
            <el-date-picker
              v-model="valueDate"
              class="w-100"
              format="dd-MM-yyyy HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="requestCustormList">
              Tìm kiếm
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onshowDialogImport">Import
            </el-button>
            <el-button size="small" class="filter-item" type="primary" @click="downloadSampleFile">Tải file mẫu</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row class="list-account__data">
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
          :label="('Mã KH')"
          align="center"
        >
          <template slot-scope="{row}">
            VID{{ row.user_id }}
          </template>
        </el-table-column>
        <el-table-column
          prop="start_date"
          label="Ngày đề xuất"
          align="center"
        />
        <el-table-column
          prop="suggest_name"
          label="Người đề xuất"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.user_request_name }}
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày hết hạn"
          prop="end_date"
          align="center"
        />
        <el-table-column
          prop="approver"
          label="Người phê duyệt"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.user_approve_name }}
          </template>
        </el-table-column>
        <el-table-column
          label="Trạng thái duyệt"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="(scope.row.is_approve === 1) ? 'success' : 'danger'">
              {{ (scope.row.is_approve === 1) ? 'Đã duyệt' : 'Chưa duyệt' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Trạng thái xửa lý"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_process_upgrade === 0">
              Đang chờ xử lý
            </el-tag>
            <el-tag v-else-if="scope.row.is_process_upgrade === 1" type="info">
              Đang xử lý
            </el-tag>
            <el-tag v-else-if="scope.row.is_process_upgrade === 2" type="success">
              Đã xử lý
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Lý do đề xuất"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.noted }}
          </template>
        </el-table-column>
        <el-table-column
          label="Lý do phê duyệt"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.approve_noted }}
          </template>
        </el-table-column>
        <el-table-column
          prop="is_active"
          label="Chi tiết"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button type="primary" @click="onShowHistory(row)">Xem</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
            <!--            <el-button type="danger" icon="el-icon-delete" circle @click="onDeleteAccount(scope.row)" />-->
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="requestCustormList"
        />
      </el-row>
      <dialog-transaction-history
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :object-data="objectAccount"
        :admins="admins"
        @onClickButtonDialog="handleClickButtonDialog"
      />
      <import-excel :dialog-visible="showDialogImport" @onClickButtonImport="handleClickButtonImport" />
      <history-custorm
        :show-dialog="showHistory"
        :object-history="objectHistory"
        @onClickButtonHistory="handleClickButtonHistory"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import RoleResource from '@/api/roles'
import DialogTransactionHistory from '@/views/customer/components/DialogTransactionHistory'
import historyCustorm from '@/views/customer/components/historyCustorm.vue'
import ImportExcel from '@/views/customer/components/ImportExcel.vue'
import CustomResource from '@/api/custorm'
import { convertDate1, formatNumber } from '@/utils/convert'
const roleResource = new RoleResource()
const customResource = new CustomResource()
const defaultQuery = {
  page: 1,
  limit: 10
}

export default {
  name: 'List',
  components: { Pagination, DialogTransactionHistory, ImportExcel, historyCustorm },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      tableData: [],
      admins: [],
      loadingTable: false,
      listQuery: Object.assign({}, defaultQuery),
      total: 0,
      isAdd: true,
      onShowDialog: false,
      objectAccount: {},
      roles: [],
      admin: {}, // getAcountInfo(),
      currentPermissions: {}, // getPermissions(),
      listStatus: [
        { id: 0, name: 'Chưa duyệt' },
        { id: 1, name: 'Đã duyệt' }
      ],
      showDialogImport: false,
      showHistory: false,
      objectHistory: {},
      valueDate: '',
      total_waiting: 0,
      loadingExportExcel: false
    }
  },
  watch: {
    valueDate(val) {
      const start = val[0]
      const end = val[1]
      // start = (new Date(start)).getTime()
      // end = (new Date(end)).getTime()
      // console.log('....................thoi gian', start, end)
      this.from_date = start
      this.to_date = end
      this.listQuery.page = 1
      this.listQuery.start_date = convertDate1(this.from_date)
      this.listQuery.end_date = convertDate1(this.to_date)
      this.requestCustormList()
    }
  },
  created() {
    // this.onGetListAccount()
    // this.getListRole()
    console.log(getAcountInfo(), '---------------------')
    this.requestCustormList()
  },
  methods: {
    requestCustormList() {
      this.loadingTable = true
      const account = getAcountInfo()
      this.listQuery.uid = account.id
      customResource.customList(this.listQuery).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.items
          this.total = data.count
          this.total_waiting = data.total_waiting
        }
      }).catch(_ => {
        this.loadingTable = false
      })
    },
    onDownloadExcelExample() {
      const urlFile = `${this.baseUrl}/File_import_loyal_customer.xlsx`
      const link = document.createElement('a')
      link.href = urlFile
      link.setAttribute('download', 'File_import_loyal_customer')
      document.body.appendChild(link)
      link.click()
    },
    // downloadSampleFile() {
    //   const params = ['STT', 'code_booking', 'date_agent_payment']
    //   const baseUrl = process.env.VUE_APP_BASE_API
    //   const url = `${baseUrl}/public/file-excel-example?headers=${JSON.stringify(params)}`
    //   statisticResource.downloadFile({ headers: JSON.stringify(params) })
    //     .then(res => {
    //       console.log('res..', res)
    //       var fileLink = document.createElement('a')
    //
    //       fileLink.href = url
    //       document.body.appendChild(fileLink)
    //
    //       fileLink.click()
    //       this.$message({
    //         message: 'Export thành công',
    //         type: 'success',
    //         duration: 5 * 1000
    //       })
    //     })
    //     .finally(() => {
    //       this.loadingExportExcel = false
    //     })
    // },
    downloadSampleFile() {
      // Tạo một đối tượng URL từ đường dẫn đến file mẫu
      const fileURL = '/File_import_loyal_customer1.xlsx'

      // Tạo một thẻ a ẩn
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.download = 'File_import_list_golfer.xlsx'

      // Kích hoạt sự kiện click để tải file
      link.click()
    },
    onshowDialogImport() {
      // this.$confirm('Bạn phải import file trước ngày mùng 5 hàng tháng').then(_ => {
      //   this.showDialogImport = true
      // })
      this.showDialogImport = true
    },
    onShowHistory(row) {
      this.objectHistory = row
      this.showHistory = true
    },
    handleClickButtonHistory(object) {
      const { dialog, reload } = object
      this.showHistory = dialog
      if (reload) {
        this.onGetListAccount()
      }
    },
    handleClickButtonImport(object) {
      const { dialog, reload } = object
      this.showDialogImport = dialog
      if (reload) {
        this.requestCustormList()
      }
    },
    onShowDialogEdit(row) {
      this.objectAccount = Object.assign(row)
      this.isAdd = false
      this.onShowDialog = true
      console.log('ssssssssss', row)
    },
    createCustom() {
      this.onShowDialog = true
      this.isAdd = true
      this.objectAccount = {}
    },
    handleCreateAccount() {
      this.objectAccount = Object.assign({}, { roles: this.roles })
      this.isAdd = true
      this.onShowDialog = true
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.requestCustormList()
      }
    },
    // onDeleteAccount(row) {
    //   this.loadingTable = true
    //   this.$confirm(`bạn có chắc chắn muốn xóa VID${row.user_id}`).then(() => {
    //     customResource.customRemove(row.id).then(res => {
    //       this.loadingTable = false
    //       const { error, error_msg } = res
    //       if (error === 0) {
    //         this.$message.success('Xóa khách hàng thành công')
    //         this.requestCustormList()
    //       } else {
    //         this.$message.error(error_msg)
    //       }
    //     }).catch(_ => {
    //       this.loadingTable = false
    //     })
    //   })
    // },
    getListRole() {
      roleResource.getUnder().then(res => {
        this.roles = res.data
      })
    },
    handleSwitch(row) {
      console.log(row)
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    onReset() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.requestCustormList()
    },
    async handleDownload() {
      let stop = false
      const query = {
        limit: 5000,
        page: 1
      }
      let list_all = []
      const account = getAcountInfo()
      query.uid = account.id
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await customResource.customList(query)
          console.log('res..............', res)
          console.log('this.tableData', res.data.items)
          if (res.data.items.length <= 0) {
            stop = true
          }
          query.page = +query.page + 1
          list_all = [...list_all, ...res.data.items]
        } catch (error) {
          console.error(error)
          stop = true
        }
      }
      list_all.map(item => {
        item.display_id = item?.id_display ?? item?.id ?? null
      })
      console.log('list_all', list_all)
      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Mã KH', 'Ngày đề xuất', 'Người đề xuất', 'Ngày hết hạn', 'Người phê duyệt', 'Trạng thái duyệt', 'Trạng thái xửa lý', 'Lý do đề xuất', 'Lý do phê duyệt']
        const filterVal = ['user_id', 'start_date', 'user_request_name', 'end_date', 'user_approve_name', 'is_approve', 'is_process_upgrade', 'noted', 'approve_noted']
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
        if (j === 'is_approve') {
          return +v[j] === 1 ? 'Đã duyệt' : 'Chưa duyệt'
        } else if (j === 'is_process_upgrade') {
          return +v[j] === 0 ? 'Đang chờ xử lý' : +v[j] === 1 ? ' Đang xử lý' : ' Đã xử lý'
        } else {
          return v[j]
        }
      }))
    },
    formatNumber
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}

.pr-5 {
  padding-right: 15px;
}

.mr-10 {
  margin-right: 10px;
}

.title {
  margin: 0;
  width: 100%;
  margin: 10px 0 20px 0;
}

.search-custom {
  padding-right: 10px;
}
</style>
