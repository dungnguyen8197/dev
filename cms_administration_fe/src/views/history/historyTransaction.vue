<template>
  <el-row style="margin:20px;">
    <el-row>
      <el-col :sm="18">
        <h3 style="margin: auto; width: 100%; padding: 10px">Lịch sử giao dịch</h3>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <div class="filter-container">
      <el-row>
        <el-col :sm="3" class="mr-10 mb-10">
          <el-input
            v-model="query.user_id"
            clearable
            placeholder="MÃ "
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <!--                <el-col :sm="4" class="mr-10 mb-10">-->
        <!--                    <el-input-->
        <!--                        v-model="query.user_name"-->
        <!--                        placeholder="Tên Golfer"-->
        <!--                        @keyup.enter.native="handleFilter"-->
        <!--                    />-->
        <!--                </el-col>-->
        <el-col :sm="3" class="mr-10 mb-10">
          <el-input
            v-model="query.code_transaction"
            clearable
            placeholder="Mã giao dịch"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <!--                <el-col :sm="4" class="mr-10 mb-10">-->
        <!--                    <el-input-->
        <!--                        v-model="query.code_booking"-->
        <!--                        placeholder="Code Booking"-->
        <!--                        @keyup.enter.native="handleFilter"-->
        <!--                    />-->
        <!--                </el-col>-->
        <el-col :sm="3" class="mr-10 mb-10">
          <el-date-picker
            v-model="fromDate"
            clearable
            style="width: 100%;"
            type="datetime"
            format="dd-MM-yyyy HH:mm:ss"
            placeholder="Ngày bắt đầu"
          />
        </el-col>
        <el-col :sm="3" class="mr-10 mb-10">
          <el-date-picker
            v-model="toDate"
            clearable
            style="width: 100%;"
            type="datetime"
            default-time="23:59:00"
            format="dd-MM-yyyy HH:mm:ss"
            placeholder="Ngày kết thúc"
            :picker-options="datePickerOptions"
          />
        </el-col>
        <el-col :sm="3" class="mr-10 mb-10">
          <el-select v-model="query.status" placeholder="Trạng thái" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :sm="6" class="mr-10" style="display: flex;">
          <el-button class="filter-item" icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button class="mr-10 filter-item" type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleDownload"> Export excel</el-button>
          <!-- <div v-if="isDone" style="display: none">
                      <vue-excel-xlsx
                          ref="test"
                          :data="items"
                          :columns="columns"
                          :file-name="'list'"
                          :file-type="'xlsx'"
                          :sheet-name="'sheetname'"
                          >
                      </vue-excel-xlsx>
                  </div> -->
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
          prop="code"
          label="Code Payment"
          align="center"
          rowspan="2"
          colspan="2"
        />
        <el-table-column
          prop="user_id"
          label="Người thanh toán"
          align="center"
        >
          <template slot-scope="{row}">
            {{ `VID${row.user_id}` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="bank_name"
          label="Ngân hàng"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag type="info">{{ row.bank_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Giá trị"
          align="center"
        >
          <tempalte slot-scope="{row}">
            {{ formatNumber(row.money) }}
          </tempalte>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Trạng thái"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.status == 0" type="danger">Không thành công</el-tag>
            <el-tag v-else-if="row.status == 1" type="success">Thành công</el-tag>
            <el-tag v-else-if="row.status == 2" type="success">Lỗi</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="Thời gian tạo"
          align="center"
        />
        <el-table-column
          label="Hành động"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-view"
              circle
              @click="showDetail(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.number"
          :total="total"
          :limit.sync="query.number"
          :page.sync="query.page"
          @pagination="onGetList"
        />

        <dialog-detail-transaction
          :show-dialog="showDialogDetail"
          :object-data="objectDataDetail"
          @onClickButtonDialog="close"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
const status = [
  {
    value: 0,
    label: 'Không thành công'
  },
  {
    value: 1,
    label: 'Thành công'
  }, {
    value: 2,
    label: 'Chưa thanh toán'
  }
]
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import DialogDetailTransaction from './components/DialogDetailTransaction.vue'
import moment from 'moment'
import HistoryTransactionResource from '@/api/history/historyTransaction'

const historyResource = new HistoryTransactionResource()

export default {
  name: 'ListTransaction',
  components: {
    Pagination,
    DialogDetailTransaction
  },
  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        number: 10,
        page: 1
      },
      total: 20,
      loadingExportExcel: false,
      options: status,
      from: 1,
      showDialogDetail: false,
      objectDataDetail: {},
      toDate: '',
      fromDate: '',
      time_step_1: '',
      time_step_2: '',
      isDone: false,

      tableDataExport: []
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.query.time_step_1)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    fromDate(value) {
      if (value) {
        this.query.time_step_1 = moment(value).unix()
      } else {
        this.query.time_step_1 = ''
      }
    },
    toDate(value) {
      if (value) {
        this.query.time_step_2 = moment(value).unix()
      } else {
        this.query.time_step_2 = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      historyResource.listTransaction(this.query).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          this.tableData = result.map(item => {
            const dataProvider = JSON.parse(item.data_provider)
            const rowspan = dataProvider.list_user_pay.length
            return { ...item, dataProvider, rowspan }
          })
          const currentTotal = this.total / this.query.number
          if (this.query.page === currentTotal && this.tableData.length === this.query.number) {
            this.total += this.query.number
          }
        } else {
          this.$message.warning('Có lỗi sảy ra. Vui lòng thử lại!')
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
      return this.query.page === 1 ? this.query.page + index : (this.query.page - 1) * this.query.number + index + 1
    },

    showDetail(row) {
      this.showDialogDetail = true
      this.objectDataDetail = Object.assign({}, row)
    },
    close(value) {
      console.log('var', value)
      this.showDialogDetail = false
    },
    onReset() {
      this.query = Object.assign({}, { number: 10, page: 1 })
      this.fromDate = ''
      this.toDate = ''
      this.onGetList()
    },
    handleDownload() {
      // this.isDone = false
      // axios.post(`${baseUrl}/api/v1/transaction`, this.query).then(res => {
      //     if (response.status === 200) {
      //         console.log('==============', response);
      //         let result = response.data;
      //         this.tableDataExport = result?.data.map(item => {
      //             let dataProvider = JSON.parse(item.data_provider)
      //             let rowspan = dataProvider.list_user_pay.length
      //             return {...item, dataProvider, rowspan}
      //         })
      //         // console.log('this.tableData', this.tableData);
      //         const currentTotal = this.total / this.query.number
      //         if (this.query.page === currentTotal && this.tableData.length === this.query.number) {
      //             this.total += this.query.number
      //         }
      //         this.isDone = true
      //     } else {
      //         this.$message.error("Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật");
      //     }
      // }).finally(() => {
      //      this.$refs.test.$el.click()
      // });
    },
    formatStatus(status) {
      switch (status) {
        case 0:
          return 'Không thành công'
        case 1:
          return 'Thành công'
        case 2:
          return 'Chưa xác nhận'
        default:
          return
      }
    },
    formatNumber
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
</style>
