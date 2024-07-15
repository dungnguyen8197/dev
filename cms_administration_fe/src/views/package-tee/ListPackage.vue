<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH GÓI BÁN</h3>
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
            <search-facility :clear-data="clearFacility" @selection-changed-facility="handleSelectionChanged" />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.name"
              placeholder="Nhập tên gói"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="query.date"
              style="width: 100%;"
              type="date"
              format="dd-MM-yyyy"
              value-format="yyyy/MM/dd"
              placeholder="Ngày bán"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <el-select
            v-model="query.is_active"
            class="w-100"
            label=""
            placeholder="Trạng thái Active"
            @change="handleFilter"
          >
            <el-option v-for="(item, keyActive) in actives" :key="keyActive" :label="item" :value="+keyActive" />
          </el-select>
        </el-col>
        <el-col class="search-money mt-10" :sm="22" :md="6">
          <el-date-picker
            v-model="DateRangeCreated"
            class="daterange"
            format="dd/MM/yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            value-format="timestamp"
            start-placeholder="BĐ Ngày tạo"
            end-placeholder="KT Ngày tạo"
          />
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleExportExcel">
            Xuất Excel
          </el-button>
        </el-col>

      </el-row>
      <span style="color: red; font-size: 13px;">{{ `Note: (Chọn ngày bán nhấn tìm kiếm để kiểm tra ngày đó nhũng sân nào đã bán, sau đó có thể chọn vào nút ds ngày bán bên cột hành động để xem đường đã bán)` }}</span>
    </div>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column label="Sân" align="center">
          <template slot-scope="scope">
            {{ scope.row.facility ? scope.row.facility.sub_title : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên gói" align="center" />
        <el-table-column label="Thời gian bắt đầu" align="center">
          <template slot-scope="scope">
            {{ scope.row.time_active_start ? convertDateTime(scope.row.time_active_start) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian kết thúc" align="center">
          <template slot-scope="scope">
            {{ scope.row.time_active_end ? convertDateTime(scope.row.time_active_end) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center">
          <template slot-scope="{row}">
            <el-tag :type="checkStatusPriceEntry(row.teetime).type">{{ row.teetime ? checkStatusPriceEntry(row.teetime).label : '' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              class="mb-10"
              size="small"
              :title="`Chi tiết`"
              type="info"
              icon="el-icon-info"
              circle
              @click="handleShowDetailPackage(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :title="`Sửa`"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            />
            <el-button
              v-if="checkDate(scope.row)"
              class="mb-10"
              size="small"
              :title="`Bán gói`"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="handleSell(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :title="`Danh sách ngày đã bán`"
              type="primary"
              icon="el-icon-info"
              circle
              @click="handleListDateSell(scope.row)"
            />
            <el-button
              v-if="role_admin && (role_admin.includes('role_statistic')|| role_admin.includes('role_master') || role_admin.includes('role_admin') || role_admin.includes('role_super_admin'))"
              class="mb-10"
              size="small"
              :title="`QL Giá nhập`"
              type="success"
              icon="el-icon-info"
              circle
              @click="handleUpdateSourcePrice(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :title="`Khóa gói`"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              type="danger"
              round
              @click="handleBlock(scope.row)"
            > {{ scope.row.is_active === 1 ? 'Đóng gói' : 'Show gói' }} </el-button>
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
        <dialog-package-teetime
          :show-dialog="showDialog"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <dialog-sell-package
          :show-dialog="showDialogSell"
          :object-data="objectDataSell"
          @onCloseDialog="handleClose"
        />
        <dialog-list-date-sell
          :show-dialog="showDialogDetail"
          :object-data="objectDataDetail"
          @onCloseDialog="handleClose"
        />
        <dialog-source-price
          :show-dialog="showDialogSourcePrice"
          :object-data="objectDataSourcePrice"
          @onCloseDialog="handleClose"
        />
        <dialog-detail-package
          :show-dialog="showDialogDetailPackage"
          :object-data="objectDataDetailPackage"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import PackageTeeResource from '@/api/package-tee'
import { formatNumber, convertDateTime } from '@/utils/convert'
import { STATUS_PRODUCT_PARTNER, ARRAY_STATUS_PRODUCT_PARTNER } from '@/utils/constant'
import DialogPackageTeetime from './components/DialogPackageTeetime.vue'
import DialogSellPackage from './components/DialogSellPackage.vue'
import DialogListDateSell from './components/DialogListDateSell.vue'
import DialogSourcePrice from './components/DialogSourcePrice.vue'
import DialogDetailPackage from './components/DialogDetailPackage.vue'
import SearchFacility from '@/views/component/SearchFacility.vue'
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'

const packageTeeResource = new PackageTeeResource()

export default {
  name: 'ListPackage',
  components: {
    Pagination,
    DialogPackageTeetime,
    SearchFacility,
    DialogSellPackage,
    DialogListDateSell,
    DialogSourcePrice,
    DialogDetailPackage
  },

  data() {
    return {
      actives: { 1: 'Active', 0: 'No active' },
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1,
        is_active: 1
      },
      total: 0,
      statusType: STATUS_PRODUCT_PARTNER,
      statusList: ARRAY_STATUS_PRODUCT_PARTNER,
      loadingSearchPartner: false,
      partnerList: [],
      showDialog: false,
      objectData: {},
      isAdd: true,
      showDialogSell: false,
      objectDataSell: {},
      showDialogDetail: false,
      objectDataDetail: {},
      showDialogSourcePrice: false,
      objectDataSourcePrice: {},
      clearFacility: false,
      role_admin: [],
      showDialogDetailPackage: false,
      objectDataDetailPackage: {},
      DateRangeCreated: [],
      loadingExportExcel: false
    }
  },
  computed: {
  },
  watch: {
    DateRangeCreated(value) {
      console.log(value)
      if (value) {
        this.query.start_time = value[0] / 1000
        this.query.end_time = value[1] / 1000
      } else {
        delete this.query.start_time
        delete this.query.end_time
      }
    }
  },
  created() {
    this.role_admin = getAcountInfo()?.role_admin.map(item => item.name)
    this.onGetList()
  },
  methods: {
    handleExportExcel() {
      this.loadingExportExcel = true
      packageTeeResource.exportPackage(this.query).then(res => {
        const link = document.createElement('a')
        // nếu trong link trả về không có http hoặc https thì thêm vào
        link.href = res.data.link.includes('http') ? res.data.link : 'http://' + res.data.link
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err?.error_code || 'Có lỗi xảy ra')
      }).finally(() => {
        this.loadingExportExcel = false
      })
    },
    async onGetList() {
      this.loadingTable = true

      packageTeeResource.list(this.query).then(res => {
        const { error_code, data, error_msg } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },

    handleFilter() {
      this.query.page = 1
      this.query.search = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10, is_active: 1 })
      this.dateRange = ''
      this.clearFacility = true
      console.log('this.cl', this.clearFacility)
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },

    handleClose() {
      this.isAdd = true
      this.showDialog = false
      this.showDialogSell = false
      this.showDialogDetail = false
      this.showDialogSourcePrice = false
      this.showDialogDetailPackage = false
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },
    handleSell(row) {
      this.showDialogSell = true
      this.objectDataSell = Object.assign({}, row)
    },
    handleShowDetailPackage(row) {
      this.showDialogDetailPackage = true
      this.objectDataDetailPackage = Object.assign({}, row)
    },
    handleUpdate(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, row)
    },
    handleSelectionChanged(value) {
      this.clearFacility = false
      this.query.facility_id = value.value
    },
    handleListDateSell(row) {
      this.showDialogDetail = true
      this.objectDataDetail = Object.assign({ ...this.query }, row)
    },
    handleUpdateSourcePrice(row) {
      this.showDialogSourcePrice = true
      this.objectDataSourcePrice = Object.assign({ ...this.query }, row)
    },
    checkDate(row) {
      if (+moment(row.time_active_start).unix() < +moment().unix() && +moment(row.time_active_end).unix() > +moment().unix()) {
        return true
      }
      return false
    },
    handleCheckSellDate() {
      this.query.page = 1
      this.query.search = 0
      this.loadingTable = true
      this.onGetList()
    },
    handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn khóa gói "${row.name}" không ?`).then((_) => {
        packageTeeResource.clock_package({ id: row.id }).then(res => {
          const { error_code, data, error_msg } = res
          if (error_code === 0) {
            this.$message.success(data)
            this.onGetList()
          } else {
            this.$message.error(error_msg)
          }
        }).catch(_ => {
        }).finally(() => {
          this.loadingTable = false
        })
      })
    },
    handleBlock(row) {
      this.$confirm(`Bạn có chắc chắn ${row.is_active === 1 ? 'đóng' : 'mở'} gói "${row.name}" không ?`).then((_) => {
        packageTeeResource.block_package_tee({ is_active: row.is_active === 1 ? 0 : 1 }, row.id).then(res => {
          const { error_code, data, error_msg } = res
          if (error_code === 0) {
            this.$message.success(data)
            this.onGetList()
          } else {
            this.$message.error(error_msg)
          }
        }).catch(_ => {
        }).finally(() => {
          this.loadingTable = false
        })
      })
    },
    checkStatusPriceEntry(teetime) {
      let result = { label: 'Chưa duyệt', type: 'warning' }
      const tee = teetime.map(i => i.tee).flat()
      if (tee.length > 0) {
        const check = tee.some(i => i.source_price != null)
        if (check) result = { label: 'Đã duyệt', type: 'success' }
      }
      return result
    },
    formatNumber,
    convertDateTime
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
  </style>

