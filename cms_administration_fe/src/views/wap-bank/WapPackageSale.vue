<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">GÓI BÁN WAP </h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
        <!-- <el-tag :style="{ backgroundColor: colorTag, color: colorText }">Your Tag Text</el-tag> -->
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="6" :md="4">
          <div class="grid-content bg-purple-light">
            <search-facility :clear-data="clearFacility" @selection-changed-facility="handleSelectionChanged" />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.bank_id"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Ngân hàng"
            >
              <el-option
                v-for="bank in bankList"
                :key="bank.id"
                :label="bank.name"
                :value="bank.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="10" :md="6">
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="dateRange"
              clearable
              label="Thời gian tạo"
              size="small"
              style="width: 100%"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy HH:mm:ss"
              start-placeholder="BĐ ngày tạo"
              end-placeholder="KT ngày tạo"
              :default-time="['00:00:00', '23:59:00']"
            />
          </div>
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
      <!-- <span style="color: red; font-size: 13px;">{{ `Note: Mặc định lấy tháng hiện tại` }}</span> -->
    </div>
    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column label="Ngân hàng" align="center">
          <template slot-scope="{row}">
            {{ row.bank ? row.bank.name : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Sân" align="center">
          <template slot-scope="{row}">
            <el-popover
              ref="popoverRef"
              placement="top"
              width="250"
              trigger="hover"
            >
              <div>
                {{ row.detail_facility.map(item =>item.facility_name).join(', ') }}
              </div>
              <el-link
                slot="reference"
                type="primary"
              >{{ row.detail_facility ? row.detail_facility[0].facility_name : '' }}</el-link>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column label="Tỉ lệ phần trăm" align="center">
          <template slot-scope="{row}">
            {{ `${row.type != 1 ? 'Tăng' : 'Giảm'} ${row.amount}%` }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="{row}">
            {{ row.created_at ? formatDate(row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="{row}">
            <el-button
              class="mb-10"
              size="small"
              type="primary"
              circle
              icon="el-icon-edit"
              @click="handleEdit(row)"
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
        <DialogPackageSale
          :show-dialog="showDialog"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { formatNumber, formatDate } from '@/utils/convert'
import moment from 'moment'
import SearchFacility from '@/views/component/SearchFacility.vue'
import DialogPackageSale from '@/views/wap-bank/components/DialogPackageSale.vue'
import WapBankResource from '@/api/wap-bank/wap-bank'
const wapBankResource = new WapBankResource()

export default {
  name: 'ListPackage',
  components: {
    Pagination,
    SearchFacility,
    DialogPackageSale
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
      loadingSearchPartner: false,
      showDialog: false,
      objectData: {},
      clearFacility: false,
      role_admin: [],
      dateRange: '',
      bankList: [],
      isAdd: true,
      colorTag: '#333',
      colorText: '#fff'
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
        this.query.start_date = moment(value[0]).unix()
        this.query.end_date = moment(value[1]).unix()
      } else {
        this.query.start_date = ''
        this.query.end_date = ''
      }
    }
  },
  created() {
    this.onGetList()
    this.onGetListBank()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      wapBankResource.list_package_sale(this.query).then(res => {
        const { error_code, data, error_msg } = res
        console.log('data.............', data)
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
    onGetListBank() {
      wapBankResource.list_bank().then(res => {
        const { error_code, data, error_msg } = res
        console.log('data.............', data)
        if (error_code === 0) {
          this.bankList = data
        } else {
          this.$message.error(error_msg)
        }
      }).finally(() => {
      })
    },
    handleFilter() {
      this.query.page = 1
      this.query.search = 1
      this.loadingTable = true
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = Object.assign({}, { bank_list: this.bankList })
    },
    handleEdit(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, { ...row, bank_list: this.bankList })
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.clearFacility = true
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleSelectionChanged(value) {
      this.clearFacility = false
      this.query.facility_id = value.value
    },
    handleClose() {
      this.showDialog = false
      this.onGetList()
    },
    formatNumber,
    formatDate
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

