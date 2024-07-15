<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH CÁC GÓI BÁN THEO NGÀY</h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <search-facility :clear-data="clearFacility" @selection-changed-facility="handleSelectionChanged" />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="10" :md="6">
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="dateRange"
              clearable
              label="Thời gian bán"
              size="small"
              style="width: 100%"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy HH:mm:ss"
              start-placeholder="Start date sell"
              end-placeholder="End date sell"
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
      <span style="color: red; font-size: 13px;">{{ `Note: Mặc định lấy tháng hiện tại` }}</span>
    </div>
    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column label="Ngày" align="center">
          <template slot-scope="scope">
            {{ scope.row.date_sell ? convertDate(scope.row.date_sell) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Gói bán" align="center">
          <template slot-scope="scope">
            {{ scope.row.booking_tee ? scope.row.booking_tee.name : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Sân bán" align="center">
          <template slot-scope="scope">
            {{ scope.row.facility ? scope.row.facility.sub_title : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Đường bán" align="center">
          <template slot-scope="scope">
            {{ scope.row.path ? scope.row.path.name : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="checkDate(scope.row)"
              class="mb-10"
              size="small"
              :title="`Khóa gói`"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >Bỏ gói</el-button>
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
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import PackageTeeResource from '@/api/package-tee'
import { formatNumber, convertDate } from '@/utils/convert'
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'
import SearchFacility from '@/views/component/SearchFacility.vue'

const packageTeeResource = new PackageTeeResource()

export default {
  name: 'ListPackage',
  components: {
    Pagination,
    SearchFacility
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 0,
      loadingSearchPartner: false,
      objectData: {},
      clearFacility: false,
      role_admin: [],
      dateRange: ''
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
    console.log('.........', moment().startOf('day').add(1, 'days').unix())
    this.role_admin = getAcountInfo()?.role_admin.map(item => item.name)
    this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      packageTeeResource.statistic_list_pack_trade_by_day(this.query).then(res => {
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
    handleFilter() {
      this.query.page = 1
      this.query.search = 1
      this.loadingTable = true
      this.onGetList()
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
      this.onGetList()
    },
    checkDate(row) {
      if (moment(row.date_sell).startOf('day').unix() < moment().startOf('day').add(1, 'days').unix()) {
        return false
      }
      return true
    },
    handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn bỏ gói không ?`).then((_) => {
        packageTeeResource.erase_pack({ id: row.id }).then(res => {
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
    formatNumber,
    convertDate
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

