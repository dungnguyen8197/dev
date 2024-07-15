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
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.code"
              placeholder="Nhập mã code"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple">
            <el-select
              v-model="query.provider_id"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="Provider"
            >
              <el-option
                v-for="provider in providerList"
                :key="provider.id"
                :label="provider.name"
                :value="provider.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
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
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple">
            <el-select
              v-model="query.allocation_type"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Hình thức phân phối"
            >
              <el-option
                v-for="allocation in allocationList"
                :key="allocation.value"
                :label="allocation.label"
                :value="allocation.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple">
            <el-select
              v-model="query.voucher_type"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Loại voucher"
            >
              <el-option
                v-for="voucher in voucherList"
                :key="voucher.value"
                :label="voucher.label"
                :value="voucher.value"
              />
            </el-select>
          </div>
        </el-col>
        <!-- <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple">
            <el-select
              v-model="query.admin_id"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="Nhập tên sale"
              :remote-method="onSearchAdmin"
              :loading="loadingSearchAdmin"
            >
              <el-option
                v-for="admin in admins"
                :key="admin.id"
                :label="admin.name"
                :value="admin.id"
              />
            </el-select>
          </div>
        </el-col> -->
        <el-col class="search-money mt-10" :span="6">
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="dateRange"
              class="w-100"
              format="dd-MM-yyyy HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
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
        <el-table-column label="Nhà cung cấp" align="center">
          <template slot-scope="scope">
            {{ scope.row.provider_info ? scope.row.provider_info.name : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status != 0" :type="statusVoucher[scope.row.status].type">{{ statusVoucher[scope.row.status].label }}</el-tag>
            <el-tag v-else type="warning">Chờ</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Loại voucher" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.voucher_type" type="primary">{{ voucherType[scope.row.voucher_type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Loại hình khuyến mãi" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.discount_type" type="primary">{{ discountType[scope.row.discount_type] }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column prop="screen" label="Màn hình sử dụng" align="center" />
        <el-table-column label="Hình thức phân phối" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.allocation_type" type="primary">{{ allocationType[scope.row.allocation_type] }}</el-tag>
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
              v-if="scope.row.allocation_type == 2 && [0, 1].includes(scope.row.status)"
              class="mb-10"
              size="small"
              :title="`Thêm voucher cho user`"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="handleUseVoucher(scope.row)"
            />
            <el-button
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
              :title="`Thông tin ds người sử hữu voucher`"
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
          :show-dialog="showDialogUpdateRow"
          :is-add="isAdd"
          :object-data="objectDataEdit"
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
import VoucherResource from '@/api/voucher/voucher'
import SearchResource from '@/api/search-api'
import { formatNumber, convertDateTime } from '@/utils/convert'
import { STATUS_VOUCHER, ARRAY_STATUS_VOUCHER, DISCOUNT_TYPE, ALLOCATION_TYPE, ARRAY_ALLOCATION_TYPE, VOUCHER_TYPE, ARRAY_VOUCHER_TYPE } from '@/utils/constant'
import moment from 'moment'
// import { getAcountInfo } from '@/utils/auth'
import DialogVoucher from './components/DialogVoucher.vue'
import AddVoucherForUser from './components/AddVoucherForUser.vue'
import DialogListUseHasVoucher from './components/DialogListUseHasVoucher.vue'
import DialogDetailVoucher from './components/DialogDetailVoucher.vue'

import { create_signature_hub } from '@/utils/create-signnature'

const searchResource = new SearchResource()
const voucherResource = new VoucherResource()

export default {
  name: 'List',
  components: {
    Pagination,
    DialogVoucher,
    AddVoucherForUser,
    DialogListUseHasVoucher,
    DialogDetailVoucher
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 20,
      loadingExportExcel: false,
      sourceList: [],
      bankAccountList: [],
      total_money: 0,
      dialogUpdateNote: false,
      objectData: {},
      objectDataEdit: {},
      showDialogUpdateRow: false,
      adminData: [],
      loadingSearchAdmin: false,
      dateRange: '',
      dialogConfirmDone: false,
      dialogConfirmClear: false,
      dialogConfirmProcess: false,
      body: {},
      request: {},
      timer: '',
      isAdd: true,
      admins: [],
      statusVoucher: STATUS_VOUCHER,
      statusList: ARRAY_STATUS_VOUCHER,
      discountType: DISCOUNT_TYPE,
      allocationType: ALLOCATION_TYPE,
      allocationList: ARRAY_ALLOCATION_TYPE,
      voucherType: VOUCHER_TYPE,
      voucherList: ARRAY_VOUCHER_TYPE,
      providerList: [],
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
          const yesterday = new Date(this.query.start_date)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.start_date = moment(value[0]).unix() * 1000
        this.query.end_date = moment(value[1]).unix() * 1000
      } else {
        this.query.start_date = ''
        this.query.end_date = ''
      }
    }
  },
  created() {
    this.onGetListProvider()
    this.onGetList()
    // this.timer = setInterval(this.onGetList, 1000 * 20)
  },
  beforeDestroy() {
    // clearInterval(this.timer)
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      const obj = this.query
      Object.keys(obj).forEach(function(k) {
        obj[k] = typeof obj[k] === 'string' ? obj[k].trim() : obj[k]
      })
      const signature = await this.create_signature_hub(this.query)
      this.query = { ...this.query, signature }

      voucherResource.list(this.query).then(res => {
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
    onSearchAdmin(keyword) {
      this.loadingSearchAdmin = true
      searchResource.searchAdmin({ keyword_admin: keyword.trim() }).then(res => {
        this.loadingSearchAdmin = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.admins = data
        }
      })
    },
    onGetListProvider() {
      voucherResource.list_provider().then(res => {
        const { error_code, data } = res
        console.log('list_provider.......', data)
        if (error_code === 0) {
          this.providerList = data
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
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
      this.showDialogUpdateRow = false
      this.showDialogAddVoucher = false
      this.showDialogListUser = false
      this.showDialogDetail = false
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialogUpdateRow = true
      this.objectDataEdit = Object.assign({}, { providerList: this.providerList })
    },
    handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa voucher ${row.title}`).then(async() => {
        let body = { voucher_id: row.id }
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        voucherResource.cancel_voucher(body).then(res => {
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
      this.$confirm(`Bạn có chắc chắn muốn ${row.status === 3 ? 'mở khóa' : 'khóa'} voucher ${row.title}`).then(async() => {
        let body = { voucher_id: row.id, type: row.status === 3 ? 0 : 1 }
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        voucherResource.clock_voucher(body).then(res => {
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
    handleDetail(row) {
      this.showDialogDetail = true
      this.objectDataDetail = Object.assign({}, row)
    },
    splitNewLine(text) {
      return text.split('\n').join('<br>')
    },
    formatNumber,
    convertDateTime,
    create_signature_hub
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
