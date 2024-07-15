<template>
  <el-row class="p-10">
    <el-row class="list-device__header">
      <el-col :sm="24">
        <h3 style="margin: 0;text-align: center; width: 100%; padding: 10px;">
          DANH SÁCH LƯỢT SỬ DỤNG NAM Á BANK
        </h3>
      </el-col>
    </el-row>
    <div class="clearfix-10" />
    <div class="filter-container">
      <el-row>
        <el-col :sm="6" :md="3" class="mr-10 mt-10">
          <el-input
            v-model="query.user_id"
            style="width: 100%"
            clearable
            placeholder="Nhập vid khách hàng"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="6" :md="3" class="mr-10 mt-10">
          <el-input
            v-model="query.user_name"
            style="width: 100%"
            clearable
            placeholder="Nhập tên khách hàng"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="6" :md="3" class="mr-10 mt-10">
          <el-input
            v-model="query.code_booking"
            style="width: 100%"
            clearable
            placeholder="Nhập mã booking để tìm kiếm"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <el-col :sm="6" :md="3" class="mr-10 mt-10">
          <el-input
            v-model="query.sale_name"
            style="width: 100%"
            clearable
            placeholder="Nhập tên sale"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="6" :md="3" class="mr-10 mt-10">
          <el-select v-model="query.is_use" class="w-100" clearable placeholder="Chọn trạng thái">
            <el-option
              v-for="is_use in isUseList"
              :key="is_use.value"
              :label="is_use.label"
              :value="is_use.value"
            />
          </el-select>
        </el-col>

        <el-col :sm="8" :md="5" class="mr-10 mt-10">
          <el-date-picker
            v-model="dateRangeDateUse"
            class="w-100"
            style="width: 100%;"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="BĐ ngày sử dụng"
            end-placeholder="KT ngày sử dụng"
          />
        </el-col>

        <el-col :sm="8" :md="5" class="mr-10 mt-10">
          <el-date-picker
            v-model="dateRange"
            class="w-100"
            style="width: 100%;"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="BĐ ngày hết hạn"
            end-placeholder="KT ngày hết hạn"
          />
        </el-col>

        <el-col :sm="12" :md="12" class="mr-10 mt-10 filter-search">
          <el-button icon="el-icon-refresh filter-search" round @click="onReset">Reset</el-button>
          <el-button class="filter-search" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button
            type="primary"
            class="filter-search"
            icon="el-icon-download"
            :loading="loadingExportExcel"
            @click="handleDownload"
          >
            Export excel
          </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            class="filter-search"

            :disabled="multipleSelection.length == 0"
            @click="handleNotificationNAB"
          >
            Push sang Nam Á
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="clearfix-10" />
    <el-row class="list-device__data ">
      <div class="clearfix-20" />
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" :selectable="canSelectRow"> </el-table-column> -->
        <el-table-column type="selection" width="55" :selectable="canSelectRow" />
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="main_card" align="center" label="THẺ CHÍNH" />
        <el-table-column prop="fullname" align="center" label="HỌ TÊN KH">
          <template slot-scope="{ row }">
            {{ row.fullname ? upperCase(row.fullname) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="fullcard" align="center" label="SỐ THẺ" />
        <el-table-column prop="code" label="MÃ QUÀ TẶNG" align="center" />
        <el-table-column prop="end_card" label="MÃ THẺ" align="center" />
        <el-table-column label="NGÀY ĐẶT BOOKING" align="center">
          <template slot-scope="{ row }">
            {{ row.date_use ? convertDate(row.date_use) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="NGÀY SỬ DỤNG" align="center">
          <template slot-scope="{ row }">
            {{ row.date_booked ? convertDate(row.date_booked) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="facility_name" label="SÂN" align="center" />
        <el-table-column prop="process_name" label="TÊN CHƯƠNG TRÌNH" align="center" />
        <el-table-column label="NGÀY HẾT HẠN" align="center">
          <template slot-scope="{ row }">
            {{ row.date_expried ? convertDate(row.date_expried) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="ĐÃ SỬ DỤNG" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.is_use == 1" type="success">
              Đã push sang NAB
            </el-tag>
            <el-tag v-else-if="row.is_use == 2" type="warning">
              Đã đẩy vào hàng chờ
            </el-tag>
            <el-tag v-else type="danger">
              Chưa sử dụng
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sale_name" label="SALE" align="center" />
        <el-table-column prop="code_booking" label="MÃ CMS" align="center" />
        <el-table-column prop="note" label="Note" align="center" />

      </el-table>

      <el-row style="margin-top: 10px;">

        <el-col>
          <pagination
            v-show="total > query.limit"
            :total="total"
            :page-sizes="[10, 20, 30, 50, 100, 200, 300, 500]"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
          <!-- <DialogEditNamA
                      :show-dialog="showDialog"
                      :is-add="isAdd"
                      :object-data="objectData"
                      @onCloseDialog="handleClose"
                  ></DialogEditNamA> -->
        </el-col>
      </el-row>
    </el-row>
  </el-row>
</template>
<script>

// import DialogEditNamA from './components/DialogEditNamA.vue';

import axios from 'axios'
import Pagination from '@/components/Pagination'
import moment from 'moment'
import { convertDate, upperCase } from '@/utils/convert'
import ControlBankResource from '@/api/ControlBank'
import { isEmpty } from '@/utils/validate'
const baseURL = process.env.VUE_APP_BASE_API
import { getAcountInfo } from '@/utils/auth'

const controlBankResource = new ControlBankResource()
export default {
  name: 'ControlBankNamAStatistic',
  components: {
    Pagination
    // DialogEditNamA,
  },
  props: ['admin'],
  data() {
    return {
      tableData: [],
      loadingTable: false,
      total: 0,
      query: {
        limit: 10,
        page: 1,
        type: 1
      },
      dateRange: [
        // moment()
        //     .startOf('month')
        //     .toString(),
        // moment()
        //     .endOf('month')
        //     .toString(),
      ],
      // title: '',
      from: 0,
      loadingExportExcel: false,
      isUse: {
        0: {
          label: 'Chưa sử dụng'
        },
        1: {
          label: 'Đã sử dụng'
        }
      },
      isUseList: [
        { value: 0, label: 'Chưa sử dụng' },
        { value: 1, label: 'Đã push sang NAB' },
        { value: 2, label: 'Đã đẩy vào hàng chờ' }
      ],
      dialogConfirmDone: false,
      showDialog: false,
      isAdd: true,
      objectData: {},
      multipleSelection: [],
      dateRangeDateUse: '',
      timer: '',
      list_code_check: [],
      list_check_success: []
      // list_id_send_to_NAB: [],
    }
  },

  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.query.start_time)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    },

    renderTitle() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.query.start_time)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.start_time = moment(value[0]).unix()
        this.query.end_time = moment(value[1]).unix()
        // this.title = `TỪ ${moment(value[0]).get('date')}.${moment(value[1]).get('month') + 1} - ${moment(
        //     value[1],
        // ).get('date')}.${moment(value[1]).get('month') + 1} năm ${moment(value[1]).get('year')}`;
      } else {
        this.query.start_time = ''
        this.query.end_time = ''
      }
    },

    dateRangeDateUse(value) {
      if (value) {
        this.query.start_date_use = moment(value[0]).unix()
        this.query.end_date_use = moment(value[1]).unix()
        // this.title = `TỪ ${moment(value[0]).get('date')}.${moment(value[1]).get('month') + 1} - ${moment(
        //     value[1],
        // ).get('date')}.${moment(value[1]).get('month') + 1} năm ${moment(value[1]).get('year')}`;
      } else {
        this.query.start_date_use = ''
        this.query.end_date_use = ''
      }
    }
  },

  created() {
    this.onGetList()
    this.timer = setInterval(this.onGetList, 1000 * 60)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    canSelectRow(row, index) {
      const currentDate = new Date()
      const dateBooked = new Date(row?.date_expried)

      const isSameDate =
      currentDate.getFullYear() === dateBooked.getFullYear() &&
      currentDate.getMonth() === dateBooked.getMonth() &&
      currentDate.getDate() === dateBooked.getDate()
      return +row.is_use === 2 && (this.list_check_success.includes(row.code_booking)) || isSameDate
    },

    onGetList() {
      const self = this
      self.loadingTable = true
      controlBankResource.listNamA(this.query).then(response => {
        const result = response.data
        if (response.error_code === 0) {
          const data = result.data
          self.tableData = data
          this.checkCodeBookingBeforePushNAB(data)
          console.log('self.tableData----------------------', self.tableData)
          self.total = result.total
          self.from += self.query.limit * (self.query.page - 1)
        } else {
          self.$message.error(result.message)
        }
      })
        .finally(() => {
          self.loadingTable = false
        })
    },
    handleFilter() {
      for (const key in this.query) {
        if (isEmpty(this.query[key])) {
          delete this.query[key]
        }
      }
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },

    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10, type: 1 })
      this.dateRange = ''
      this.dateRangeDateUse = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleDownload() {
      this.loadingExportExcel = true
      controlBankResource.exportNamA(this.query).then(response => {
        var fileLink = document.createElement('a')
        const params = new URLSearchParams(this.query).toString()
        fileLink.href = `${baseURL}/control-bank/exportNamA?${params}`
        document.body.appendChild(fileLink)

        fileLink.click()
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
        .finally(() => {
          this.loadingExportExcel = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('this.multipleSelection ....', this.multipleSelection)
    },
    confirmDone() {
      const self = this
      if (self.multipleSelection.length < 1) {
        self.$message.warning('Chọn bản ghi trước khi xác nhận.')
        return
      }
      this.dialogConfirmDone = true
      this.query.list_id = this.multipleSelection.map((item) => item.id)
      this.$confirm(`Bạn có chắc chắn xác nhận không ?`).then((_) => {
        axios
          .post(`/control-bank/confirm-done`, this.query)
          .then((res) => {
            console.log(res)
            if (res.data.error_code === 0) {
              this.$message({
                type: 'success',
                message: 'Xác nhận thành công!'
              })
              this.dialogConfirmDone = false
              this.onGetList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
          .finally(() => {
            this.dialogConfirmDone = false
          })
      })
    },
    unConfirmDone(row) {
      console.log('row..................', row)
      this.dialogConfirmDone = true
      this.$confirm(`Bạn có chắc chắn bỏ xác nhận không ?`).then((_) => {
        axios
          .post(`/control-bank/un-confirm-done/${row.id}`, this.query)
          .then((res) => {
            console.log(res)
            if (res.data.error_code === 0) {
              this.$message({
                type: 'success',
                message: 'Xác nhận thành công!'
              })
              this.dialogConfirmDone = false
              this.onGetList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
          .finally(() => {
            this.dialogConfirmDone = false
          })
      })
    },
    handleEdit(row) {
      this.showDialog = true
      this.isAdd = false
      this.objectData = Object.assign({}, row)
    },
    checkCodeBookingBeforePushNAB(data) {
      const list_code_push = data.filter((item) => item.is_use === 2)
      controlBankResource.checkCodeBookingBeforePushNAB({
        list_code: [
          ...new Set(list_code_push.filter((item) => item.code_booking).map((item) => item.code_booking))
        ]
      })
        .then((response) => {
          console.log('response..................', response)
          if (response.error_code === 0) {
            this.list_check_success = response.data || []
            console.log(' this.list_check_success.......', this.list_check_success)
          } else {
            this.$message.error(response.error_msg)
          }
        })
    },
    handleNotificationNAB() {
      const list_code_push = this.multipleSelection.filter((item) => item.is_use === 2)
      this.$confirm(
        `Bạn có xác nhận gửi danh sách mã quà tặng sang Nam Á Bank không: ${list_code_push
          .map((item) => `${item.user_id} : ${item.code}`)
          .join(', ')}`
      ).then((_) => {
        const bodyFrom = {
          admin_id: getAcountInfo().id,
          data_use: list_code_push.map((item) => ({ id: item.id, code: item.code }))

        }
        controlBankResource.sendOrderCardFree(bodyFrom).then(async(res) => {
          console.log('res.', res)
          if (res.error_code === 0) {
            this.$message.success('Push sang NAB thành công !!!')
          } else {
            this.$message.error(res.error_msg)
          }
        })
          .finally(() => {
            this.dialogConfirmDone = false
          })
      })
    },
    handleClose() {
      this.showDialog = false
      this.onGetList()
    },
    convertDate,
    upperCase
  }
}
</script>

<style>
.p-10 {
  padding: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.ml-10 {
  margin-left: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mt-10 {
  margin-top: 10px;
}
.el-message-box__message {
  word-wrap: break-word;
}
</style>
