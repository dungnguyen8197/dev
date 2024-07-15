<template>
  <el-row style="margin:20px;">
    <el-row>
      <el-col :sm="18">
        <h3 style="margin: 0; width: 100%; padding: 10px">Danh sách giao dịch</h3>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <div class="filter-container">
      <el-row>
        <el-col :sm="4" class="mr-10">
          <el-input
            v-model="query.code_booking"
            clearable
            placeholder="Mã booking"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col class="search-money mr-10" :sm="6" :md="3">
          <div class="grid-content bg-purple">
            <el-select
              ref="SearchAdmin"
              v-model="query.admin_id"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="Nhập tên sale"
              :remote-method="onSearchAdmin"
              :loading="loadingSearchAdmin"
              @hook:mounted="(value) => cancelReadOnly(value, 'SearchAdmin')"
              @visible-change="(value) => cancelReadOnly(value, 'SearchAdmin')"
            >
              <el-option
                v-for="admin in admins"
                :key="admin.id"
                :label="admin.name"
                :value="admin.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :sm="6" class="mr-10">
          <el-date-picker
            v-model="dateRange"
            class="w-100"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-col>
        <el-col :sm="6" class="mr-10">
          <el-button class="filter-item" icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="clearfix-10" />
    <el-row style="margin-top: 40px;">
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
          label="Mã vID"
          align="center"
        />

        <el-table-column
          label="Tên khách hàng "
          align="center"
        />
        <el-table-column
          label="Point"
          align="center"
        />
        <el-table-column
          label="Mã giao dịch"
          align="center"
        />
        <el-table-column
          label="Trạng thái"
          align="center"
        />
        <el-table-column
          label="Ngày tạo"
          align="center"
        />
        <el-table-column
          label=" Mô tả "
          align="center"
        />
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetList"
        />
        <dialog-history-log
          :show-dialog="onShowDialog"
          :object-data="objectDetail"
          @onClickButtonDialog="handleClickButtonDialog"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { convertDateTimeSecond, formatDate } from '@/utils/convert'
import BookingPaxResource from '@/api/BookingPax'
const bookingPaxResource = new BookingPaxResource()
import SearchResource from '@/api/search-api'
import moment from 'moment'
import DialogHistoryLog from '@/views/manage-booking/history-log/DialogHistoryLog.vue'
const searchResource = new SearchResource()

export default {
  name: 'LogHistory',
  components: {
    DialogHistoryLog,
    Pagination
  },
  data() {
    return {
      loadingTable: false,
      tableData: [],
      adminData: [],
      loadingSearchAdmin: false,
      onShowDialog: false,
      objectDetail: {},
      query: {
        limit: 10,
        page: 1
      },
      total: 0,
      admins: [],
      dateRange: []

    }
  },
  computed: {

  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.dateStart = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        this.query.dateEnd = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    convertDateTimeSecond,
    onGetList() {
      this.loadingTable = true
      bookingPaxResource.listPaymentPoint(this.query).then(response => {
        if (response.error_code === 0) {
          const result = response.data
          console.log('saaaaaaa', result)
          this.tableData = result.data
          console.log(this.tableData)
          this.total = this.query.limit * this.query.page + this.query.limit
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : (this.query.page - 1) * this.query.limit + index + 1
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
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    onShowDialogDetail(row) {
      this.objectDetail = { ...row }
      this.onShowDialog = true
    },
    handleClickButtonDialog(value) {
      this.onShowDialog = value
    },
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    formatDate

  }
}
</script>

<style scoped>
.mr-10 {
  margin-right: 10px;
}
</style>
