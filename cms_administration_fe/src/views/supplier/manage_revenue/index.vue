<template>
  <div id="debt-page">
    <RevenueInfo v-if="showInfoDetail" :object-data="objectDetail" :show-detail="showInfoDetail" :offset-top="currentY" @closeDialog="showInfoDetail = false" />
    <div style="width: 100; display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">Quản lý doanh thu đơn hàng</h3>
      </div>
      <div style="display: flex;">
        <el-button v-if="is_export" type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất excel</el-button>
        <el-button style="float: right;" icon="el-icon-refresh" :loading="loading" @click="resetFilter">Làm mới</el-button>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <el-select v-model="filterSale" placeholder="Sale xử lý" style="width: 15%;">
        <el-option v-for="item in saleOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="filterPaid" placeholder="Thanh toán" style="width: 19%;">
        <el-option v-for="item in paidOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

      <el-date-picker
        v-model="dateRangeCreate"
        style="width: 28%"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="Đến"
        start-placeholder="Ngày tạo"
        end-placeholder="Ngày tạo"
        @change="handleChangeDateRangeCreate"
      />
      <el-date-picker
        v-model="dateRangeDebt"
        style="width: 35%;"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="Đến"
        start-placeholder="Ngày tính doanh thu"
        end-placeholder="Ngày tính doanh thu"
        @change="handleChangeDateRange"
      />
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
      <el-input v-model="searchRevenue" style="width: 200px;" type="text" :rows="2" placeholder="Nhập mã đơn hàng để tìm kiếm">
        <i slot="suffix" class="el-icon-search el-input__icon" />
      </el-input>
      <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleSearchRevenue">Tìm kiếm</el-button>
      <el-button style="margin-left: 10px" @click="onClearSearchPress">Xóa tìm kiếm</el-button>
      <el-select v-model="filterState" placeholder="Trạng thái đơn" style="width: 180px; margin-left: 10px;">
        <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="filterSource" placeholder="Nguồn" style="width: 180px; margin-left: 10px;">
        <el-option v-for="item in sourceOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>

    <div id="brand-table-id" style="margin-top: 10px;">
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <!-- <el-table-column prop="stt" label="STT" width="60" align="center" /> -->
        <el-table-column prop="code" label="Mã đơn" width="90" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" style="color:#4CA1D5" @click="handleDialogInfo(scope.row)">{{ scope.row.code }}</el-link>
            <!-- <DialogShowInfo :object-data="scope.row" :show-dialog="showInfoDetail" @closeDialog="showInfoDetail = false" /> -->
          </template>
        </el-table-column>
        <el-table-column label="Mã voucher" width="100" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" style="color:#4CA1D5" @click="handleDialogVoucher(scope.row)">{{ scope.row.voucher_code }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="Khách hàng" align="center" />
        <el-table-column prop="revenueFormat" label="Doanh thu" align="center" />
        <el-table-column prop="totalCostFormat" label="Tổng giá nhập" align="center" />
        <el-table-column label="Tổng hoàn point" align="center">
          <template slot-scope="scope">
            <p v-if="isNumber(scope.row.point_refund)">{{ formatNumber(scope.row.point_refund) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="profitFormat" label="Lợi nhuận" align="center" />

        <el-table-column prop="paid" label="Thanh toán" align="center" width="140">
          <template slot-scope="scope">
            <p v-if="scope.row.state_payment == 1" style="color: #0C8C56; font-size: 14px;">{{ scope.row.name_payment }}</p>
            <p v-if="scope.row.state_payment == 0" style="color: red; font-size: 14px;">{{ scope.row.name_payment }}</p>
            <!-- <el-tag :type="(scope.row.isPaid) ? 'success' : 'danger'">{{ scope.row.name_payment }}</el-tag> -->
            <!-- <el-tag :type="(scope.row.name_payment === "Đã thanh toán") ? 'success' : 'danger'">{{ scope.row.name_payment }}</el-tag> -->
          </template>
        </el-table-column>

        <el-table-column prop="saleName" label="Sale xử lý" align="center" />
        <el-table-column prop="secretaryName" label="Thư ký" align="center" />
        <el-table-column prop="date_complete" label="Ngày tính doanh thu" align="center" />
        <el-table-column prop="name_state_delivery" label="Trạng thái đơn" align="center" />
        <el-table-column prop="createdAt" label="Ngày tạo đơn" align="center" />
        <el-table-column prop="name_source" label="Nguồn" align="center" />
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getRevenue" />
      </el-row>
    </div>
    <DialogVoucher v-if="showDialogVoucher" :data-object="voucherObject" :show-detail="showDialogVoucher" @closeDialog="showDialogVoucher = false" />
  </div>
</template>
<script>
import ManageRevenueResource from '@/api/manage_supplier/revenue'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import RevenueInfo from './components/RevenueInfo.vue'
import DialogVoucher from './components/DialogVoucher.vue'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'

const manageRevenueResource = new ManageRevenueResource()

export default {
  name: 'RevenuePage',
  components: {
    Pagination, RevenueInfo, DialogVoucher
  },
  data() {
    return {
      is_add: 0,
      is_edit: 0,
      is_delete: 0,
      is_view: 0,
      is_export: 0,
      currentY: 0,
      showDialogVoucher: false,
      showInfoDetail: false,
      dateRangeDebt: '',
      dateRangeCreate: '',
      loading: false,
      showDialogAddTag: false,
      showDialogEditTag: false,

      objectDetail: {},
      voucherObject: {},

      tableData: [],

      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        source: 0,
        type_search: 1
      },

      filterShop: 0,
      shopOption: [],

      filterSale: 0,
      saleOption: [],

      filterState: 0,
      stateOption: [
        {
          id: 0,
          name: 'Trạng thái (Tất cả)'
        },
        {
          id: 1,
          name: 'Đã xác nhận bán'
        },
        {
          id: 3,
          name: 'Đã giao'
        }
      ],

      filterSource: 0,
      sourceOption: [
        {
          id: 0,
          name: 'Nguồn (Tất cả)'
        },
        {
          id: 1,
          name: 'App Wghn'
        },
        {
          id: 2,
          name: 'Đơn offline từ cms'
        },
        {
          id: 3,
          name: 'Đơn từ cms'
        },
        {
          id: 4,
          name: 'Wap/web đối tác(bank)'
        },
        {
          id: 5,
          name: 'Wap/web shop'
        },
        {
          id: 7,
          name: 'Bill tổng'
        }
        // {
        //   id: 8,
        //   name: ''
        // }
      ],
      filterPaid: 0,
      paidOption: [
        {
          id: 0,
          name: 'Thanh toán (Tất cả)'
        },
        {
          id: 2,
          name: 'Đã thanh toán'
        },
        {
          id: 1,
          name: 'Chưa thanh toán'
        }
      ],
      searchRevenue: ''
    }
  },
  watch: {
    filterShop: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.shop_id = this.filterShop
        this.getRevenue()
      }
    },
    filterSource: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.source = this.filterSource
        this.getRevenue()
      }
    },
    filterPaid: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.paid = this.filterPaid
        this.getRevenue()
      }
    },
    filterSale: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.account_id = this.filterSale
        this.getRevenue()
      }
    },
    filterState: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.state = this.filterState
        this.getRevenue()
      }
    },
    searchRevenue: {
      handler: function() {
        this.listQuery.q = this.searchRevenue
      }
    }
  },
  created() {
    this.$on('hide-add-tag-dialog', () => {
      this.showDialogAddTag = false
    })
    this.$on('hide-edit-tag-dialog', () => {
      this.showDialogEditTag = false
    })
    this.$on('refresh-list-tag', () => {
      this.getRevenue()
    })
  },
  beforeDestroy() {
    this.$off('hide-add-tag-dialog')
    this.$off('hide-edit-tag-dialog')
    window.removeEventListener('scroll', this.getCurrentY)
    // this.$off('refresh-list-tag')
  },
  mounted() {
    window.addEventListener('scroll', this.getCurrentY)
    // this.getRevenue()
    this.getAllSale()
    this.requestListPermissionMenu()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    requestListPermissionMenu() {
      const roles = this.$router.history.current.meta.roles
      let menu_id = roles && roles.length ? roles[0] : 0
      menu_id = parseInt(menu_id.replace('NCC', ''))
      const account = getAcountInfo()
      const email = account.email
      get_list_permission(email, menu_id, (data) => {
        console.log('............list data 1', JSON.stringify(data))
        if (data) {
          let { is_supper_admin, is_add, is_view, is_edit, is_delete, is_export } = data
          is_supper_admin = parseInt(is_supper_admin) || 0
          is_add = parseInt(is_add) || 1
          is_view = parseInt(is_view) || 1
          is_edit = parseInt(is_edit) || 1
          is_delete = parseInt(is_delete) || 1
          is_export = parseInt(is_export) || 1
          this.is_delete = is_supper_admin ? 1 : is_delete - 1
          this.is_write = is_supper_admin ? 1 : is_add - 1
          this.is_edit = is_supper_admin ? 1 : is_edit - 1
          this.is_export = is_supper_admin ? 1 : is_export - 1
          this.is_view = is_supper_admin ? 1 : is_view - 1
          this.getRevenue()
        }
      })
    },
    formatNumber,
    getCurrentY() {
      this.currentY = window.scrollY
    },
    isNumber(data) {
      return typeof data === 'number' && !isNaN(data)
    },
    getAllSale() {
      manageRevenueResource.listSale().then(response => {
        this.saleOption = [{ id: 0, name: 'Sale xử lý(Tất cả)' }, ...response.data]
      }).catch((err) => {
        console.log(err)
      })
    },
    handleChangeDateRange(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.from_date_payment = startDate.getTime()
      this.listQuery.to_date_payment = endDate.getTime()
      this.getRevenue()
    },
    handleChangeDateRangeCreate(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.from_date_create = startDate.getTime()
      this.listQuery.to_date_create = endDate.getTime()
      this.getRevenue()
    },
    confirmDowload(url) {
      this.getFileFromServer(url)
    },
    async getFileFromServer(url) {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success('Xuất file thành công, vui lòng vào thư mục donwload để xem')
      }, 250)
    },
    handleExportExcel() {
      console.log('export excel')
      manageRevenueResource.exportExcelRevenue(this.listQuery).then((res) => {
        const { error, link } = res
        if (error === 0) {
          this.confirmDowload(link)
        } else {
          this.$message.error('Lỗi khi xuất file excel')
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('Lỗi khi xuất file excel')
      })
    },
    onClearSearchPress() {
      this.listQuery.q = ''
      this.searchRevenue = ''
      this.getRevenue()
    },
    handleSearchRevenue() {
      this.listQuery.page = 1
      this.getRevenue()
    },
    getRevenue() {
      if (!this.is_view) return
      this.loading = true
      if (!this.listQuery.q) {
        delete this.listQuery.q
      }
      manageRevenueResource.listRevenue(this.listQuery).then(response => {
        if (this.listQuery.page === 1) {
          this.total = response.total
        }
        this.tableData = response.data
        this.tableData.forEach((item, index) => {
          console.log('..........check item : ', JSON.stringify(item))
          item.stt = (this.listQuery.page - 1) * this.listQuery.limit + index + 1
          item.isPaid = item.name_payment === 'Đã thanh toán'
          item.code = 'DL' + item.id
          item.customerName = item.golfer ? item.golfer.name : ''
          item.revenueFormat = this.formatNumber(item.revenue) + 'đ'
          item.profitFormat = this.formatNumber(item.profit) + 'đ'
          item.totalCostFormat = this.formatNumber(item.total_cost) + 'đ'
          item.totalPointFormat = item.point_refund ? this.formatNumber(item.point_refund) : ''
          item.saleName = item.sale ? item.sale.name : null
          item.secretaryName = item.thuky_info ? item.thuky_info.name : null
        })
      }).catch((err) => {
        console.log(err)
        this.$message.error('Lỗi khi lấy dữ liệu đơn hàng')
      }).finally(() => {
        this.loading = false
      })
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        type_search: 1
      }
      this.filterShop = 0
      this.dateRangeDebt = ''
      this.dateRangeCreate = ''
      this.filterSale = 0
      this.filterSource = 0
      this.filterPaid = 0
      this.listQuery.q = ''
      this.searchRevenue = ''
      this.getRevenue()
    },
    handleDialogInfo(data) {
      this.showInfoDetail = true
      this.objectDetail = data
    },
    handleDialogVoucher(data) {
      this.showDialogVoucher = true
      this.voucherObject = data
    }
  }
}
</script>
  <style scoped>
  #debt-page {
    margin: 20px 30px 50px 30px;
  }

  .p-tag {
    margin: 10px 0px;
  }

  .select-tag {
    padding-right: 10px;
  }

  .el-range-separator {
    line-height: 28px;
    font-size: 14px;
    width: 30px;
  }

  ::v-deep .el-range-editor--medium .el-range-separator {
      line-height: 28px;
      font-size: 14px;
      width: 30px;
  }
  </style>
