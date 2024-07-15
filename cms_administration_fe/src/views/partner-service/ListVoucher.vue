<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">QUẢN LÝ VOUCHER</h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.code"
              placeholder="Mã voucher"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.status"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Trạng thái"
            >
              <el-option
                v-for="status in statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.max_quantity_release"
              placeholder="SL voucher phân phối tối đa"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.min_quantity_release"
              placeholder="SL voucher phân phối tối thiểu"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col :sm="8" :md="4" class="search-money mt-10">
          <el-date-picker
            v-model="fromDate"
            style="width: 100%;"
            type="datetime"
            format="dd-MM-yyyy HH:mm:ss"
            placeholder="Ngày bắt đầu"
          />
        </el-col>
        <el-col :sm="8" :md="4" class="search-money mt-10">
          <el-date-picker
            v-model="toDate"
            style="width: 100%;"
            type="datetime"
            default-time="23:59:00"
            format="dd-MM-yyyy HH:mm:ss"
            placeholder="Ngày kết thúc"
            :picker-options="datePickerOptions"
          />
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10 filter-search">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <!-- <el-button
            type="primary"
            icon="el-icon-download"
            :loading="loadingExportExcel"
            @click="handleDownload"
          >
            Export excel
          </el-button> -->
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="title" label="Tên voucher" align="center" />
        <el-table-column prop="code" label="Mã code" align="center" />
        <el-table-column label="Ngày bắt đầu" align="center">
          <template slot-scope="scope">
            {{ scope.row.start_at ? convertDateTime(scope.row.start_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày kết thúc" align="center">
          <template slot-scope="scope">
            {{ scope.row.end_at ? convertDateTime(scope.row.end_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Tên đối tác" align="center">
          <template slot-scope="scope">
            {{ scope.row.partner ? scope.row.partner.name : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status != 0" :type="statusVoucher[scope.row.status].type">{{ statusVoucher[scope.row.status].label }}</el-tag>
            <el-tag v-else type="warning">Chờ</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Hành động" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              class="mb-10"
              :title="`${scope.row.status === 3 ? 'Mở khóa' : 'khóa'}`"
              :type="`${scope.row.status === 3 ? 'danger' : 'success'}`"
              @click="handleLockVoucher(scope.row)"
            >
              {{ scope.row.status === 3 ? 'Mở khóa' : 'khóa' }}
            </el-button>
            <el-button
              class="mb-10"
              size="small"
              :title="`Thêm voucher cho user`"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="handleUseVoucher(scope.row)"
            />
            <el-button
              v-if="scope.row.status == 0"
              class="mb-10"
              size="small"
              :title="`Xóa`"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
            <el-button
              size="small"
              :title="`Thông tin`"
              type="primary"
              icon="el-icon-info"
              circle
              @click="handleInfo(scope.row)"
            />
            <el-button
              size="small"
              :title="`Thông tin chi tiết voucher`"
              icon="el-icon-info"
              circle
              @click="handleDetail(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetList"
        />
        <dialog-voucher
          :show-dialog="showDialog"
          :is-add="isAdd"
          :object-data="objectData"
          @onCloseDialog="handleClose"
        />
        <add-voucher-for-user
          :show-dialog="showDialogAddVoucher"
          :object-data="objectDataAddVoucher"
          @onCloseDialog="handleClose"
        />
        <dialog-list-use-has-voucher
          :show-dialog="showDialogListUser"
          :object-data="objectDataListUser"
          @onCloseDialog="handleClose"
        />
        <dialog-detail-voucher
          :show-dialog="showDialogDetail"
          :object-data="objectDataDetail"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import PartnerServiceResource from '@/api/partner-service/partner-service'
// import SearchResource from '@/api/search-api'
import { formatNumber, convertDateTime } from '@/utils/convert'
import { STATUS_VOUCHER, ARRAY_STATUS_VOUCHER } from '@/utils/constant'
import moment from 'moment'
// import { getAcountInfo } from '@/utils/auth'
import DialogVoucher from './components/DialogVoucher.vue'
import AddVoucherForUser from './components/AddVoucherForUser.vue'
import DialogListUseHasVoucher from './components/DialogListUseHasVoucher.vue'
import DialogDetailVoucher from './components/DialogDetailVoucher.vue'
import { trim_string_object } from '@/utils/trim-string-object'

// const searchResource = new SearchResource()
const partnerServiceResource = new PartnerServiceResource()
import { create_signature_hub } from '@/utils/create-signnature'

export default {
  name: 'ListVoucher',
  components: {
    Pagination,
    DialogVoucher,
    AddVoucherForUser,
    DialogListUseHasVoucher,
    DialogDetailVoucher
  },

  data() {
    return {
      partnerList: [],

      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 20,
      loadingExportExcel: false,
      objectData: {},
      showDialog: false,
      adminData: [],
      loadingSearchAdmin: false,
      fromDate: '',
      toDate: '',
      body: {},
      request: {},
      timer: '',
      isAdd: true,
      admins: [],
      statusVoucher: STATUS_VOUCHER,
      statusList: ARRAY_STATUS_VOUCHER,
      showDialogAddVoucher: false,
      objectDataAddVoucher: {},
      showDialogListUser: false,
      objectDataListUser: {},
      showDialogDetail: false,
      objectDataDetail: {}
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.fromDate)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    fromDate(value) {
      if (value) {
        this.query.start_at = moment(value).unix() * 1000
      } else {
        this.query.start_at = ''
      }
    },
    toDate(value) {
      if (value) {
        this.query.end_at = moment(value).unix() * 1000
      } else {
        this.query.end_at = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  beforeDestroy() {
  },
  methods: {
    async onGetList() {
      this.loadingTable = true

      await this.trim_string_object(this.query)
      const signature = await this.create_signature_hub(this.query)
      this.query = { ...this.query, signature }

      partnerServiceResource.voucher_management(this.query).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          console.log('tableData..........', this.tableData)
          this.total = data.total
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.fromDate = ''
      this.toDate = ''
      this.onGetList()
    },
    handleDownload() {
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleClose() {
      this.showDialog = false
      this.showDialogAddVoucher = false
      this.showDialogListUser = false
      this.showDialogDetail = false
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },
    handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa voucher ${row.title}`).then(async(_) => {
        let body = { voucher_id: row.id }
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        partnerServiceResource.cancel_voucher(body).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.data)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleLockVoucher(row) {
      this.$confirm(`Bạn có chắc chắn muốn ${row.status === 3 ? 'mở khóa' : 'khóa'} voucher ${row.title}`).then(async(_) => {
        let body = { voucher_id: row.id, type: row.status === 3 ? 0 : 1 }
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        partnerServiceResource.lock_voucher(body).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.data)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleUseVoucher(row) {
      this.showDialogAddVoucher = true
      this.objectDataAddVoucher = Object.assign({}, { voucher_id: row.id })
    },
    handleInfo(row) {
      this.showDialogListUser = true
      this.objectDataListUser = Object.assign({}, { voucher_id: row.id })
    },
    splitNewLine(text) {
      return text.split('\n').join('<br>')
    },
    handleDetail(row) {
      this.showDialogDetail = true
      this.objectDataDetail = Object.assign({}, row)
    },
    formatNumber,
    convertDateTime,
    create_signature_hub,
    trim_string_object
  }
}
</script>

<style scoped>
.mr-10 {
    margin-right: 10px;
}

.mb-10 {
    margin-bottom: 10px;
}

.mt-10 {
    margin-top: 10px;
}

.filter-search {
  float: right;
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
}
.filter-container .filter-item{
  margin-bottom: 0;
}
.search-money{
  padding-right: 10px;
}
.search-money:last-child{
  padding-right: 0;
}
.row-search-money{
  margin-bottom: 10px;
}
.cell .el-tag{
  margin: 5px;
}
.clearfix-10 {
  height: 10px;
  clear: both;
}
.clearfix-20 {
  height: 20px;
  clear: both;
}
.mt-10 {
  margin-top: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
