<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">{{ 'MÀN KẾ TOÁN' }}</h3>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <el-row>
      <el-col :sm="24">
        <h4 style="margin: 0; width: 100%; padding: 10px; color: red;text-align:center;">
          {{ `Tổng số tiền: ${formatNumber(total_money)} VNĐ` }}
        </h4>
      </el-col>
    </el-row>
    <!-- <div class="clearfix-20"></div> -->
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money" :span="6">
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
        <el-col class="search-money" :span="6">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.is_clear"
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Tìm kiếm theo trạng thái"
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
        <el-col class="search-money" :span="6">
          <div class="grid-content bg-purple">
            <el-select
              v-model="query.bank_account_number"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Số tài khoản"
            >
              <el-option
                v-for="account in bankAccountList"
                :key="account.value"
                :label="account.label"
                :value="account.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money" :span="6">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.code_booking"
              placeholder="Nhập mã booking"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money" :span="6">
          <div class="grid-content bg-purple">
            <el-input
              v-model="query.transfer_content"
              placeholder="Nhập Nội dung CK"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money" :span="4">
          <div class="grid-content bg-purple">
            <el-input
              v-model="query.amount_money"
              placeholder="Nhập số tiền"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money" :span="4">
          <div class="grid-content bg-purple-light">
            <el-input v-model="query.note" placeholder="Ghi chú" @keyup.enter.native="handleFilter" />
          </div>
        </el-col>
        <el-col class="search-money" :span="4">
          <div class="grid-content bg-purple">
            <el-select
              v-model="query.source_type"
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Nguồn tạo"
            >
              <el-option
                v-for="source in sourceList"
                :key="source.value"
                :label="source.label"
                :value="source.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money" :span="6">
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
      </el-row>
      <el-row>
        <el-col :sm="12" :md="8" class="mr-10 mt-10 filter-search">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
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
    </div>
    <div class="clearfix-10" />
    <el-row style="margin-top: 40px;">
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column label="Nguồn tạo" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.source_type == 0" type="success">Hệ thống tạo</el-tag>
            <el-tag v-else type="warning">CMS tạo</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date_transaction" label="Ngày" align="center">
          <template slot-scope="scope">
            {{ scope.row.date_transaction ? convertDateTime(scope.row.date_transaction) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="amount_money" label="Số tiền" align="center">
          <template slot-scope="scope">
            {{ scope.row.amount_money ? formatNumber(scope.row.amount_money) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="bank_account_number" label="Số tài khoản" align="center" />
        <el-table-column prop="bank_name" label="Ngân hàng" align="center" />
        <el-table-column prop="code_payment" label="Mã thanh toán" align="center" />
        <el-table-column prop="trace_code" label="trace code" align="center" />
        <el-table-column label="Mã BK" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.booked.length > 0">
              <template
                v-for="item in [...scope.row.code_booking.split(',')]"
              >
                <el-tag :key="item">{{ item }}</el-tag>
              </template>
            </template>
            <template v-else-if="scope.row.code_booking">
              <template
                v-for="item in scope.row.code_booking.split(',')"
              >
                <el-tag :key="item">{{ item }}</el-tag>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="NOTE" align="center" />
        <el-table-column prop="transfer_content" label="Nội dung chuyển khoản" align="center" />
        <el-table-column label="TT Clear" align="center">
          <template slot-scope="scope">
            <template>
              <el-tag v-if="scope.row.is_clear === 1" type="success">Clear</el-tag>
              <el-tag v-else type="warning">No</el-tag>
            </template>
            <template>
              <el-tag v-if="scope.row.is_system_clear === 1" type="success">Hệ thống Clear</el-tag>
            </template>
            <!-- <el-select
                            v-model="scope.row.is_clear"
                            class="w-100"
                        >
                            <el-option
                                v-for="status in statusList"
                                :key="status.value"
                                :label="status.label"
                                :value="status.value"
                            >
                            </el-option>
                        </el-select> -->
          </template>
        </el-table-column>
        <el-table-column prop="sale.name" label="Sale xử lý" align="center" />
        <el-table-column label="Hành động" align="center">
          <section slot-scope="scope" style="display: flex; align-items: center;">
            <section class="mr-10">
              <el-button
                class="mb-10"
                type="warning"
                size="small"
                @click="confirmClear(scope.row)"
              >Cập nhật TT Clear
              </el-button>
              <el-button type="primary" @click="handleEdit(scope.row)">Edit </el-button>
            </section>
          </section>
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
        <!-- <dialog-edit-note :show-dialog="dialogUpdateNote"  @onCloseDialog="handleClose"
                          :object-data="objectData"></dialog-edit-note> -->
        <dialog-edit-history
          :show-dialog="showDialogUpdateRow"
          :is-add="isAdd"
          :object-data="objectDataEdit"
          @onCloseDialog="handleClose"
        />
        <dialog-confirm-process
          :dialog-confirm-process="dialogConfirmProcess"
          :object-data="objectData"
          @onCloseDialog="handleClose"
        />
        <el-dialog title="Xác nhận xong " :visible.sync="dialogConfirmDone" width="30%" center>
          <span>Bạn có xác nhận đã "DONE" ?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogConfirmDone = false">Cancel</el-button>
            <el-button type="primary" @click="handleConfirmDone()">Confirm</el-button>
          </span>
        </el-dialog>

        <el-dialog title="Xác nhận clear or no " :visible.sync="dialogConfirmClear" :before-close="() => {body = {}; dialogConfirmClear= false}" width="30%" center>
          <el-form>
            <el-form-item label="Chọn hình thức thanh toán">
              <el-select v-model="body.type_purchase" placeholder="Chọn hình thức thanh toán" class="w-100" size="small">
                <el-option
                  v-for="(arr, i) in arrayTypePurchase.filter(item => item.value != 14 && item.value > 0)"
                  :key="i"
                  :label="arr.label"
                  :value="arr.value"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="handleConfirmClear((clear = 0))">No</el-button>
            <el-button type="primary" @click="handleConfirmClear((clear = 1))">Clear</el-button>
          </span>
        </el-dialog>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import MoneyInResource from '@/api/manage-booking/money-in'
import SearchResource from '@/api/search-api'
import { formatNumber, convertDateTime } from '@/utils/convert'
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'
// import DialogEditNote from './components/DialogEditNote.vue'
import DialogEditHistory from './components/DialogEditHistory.vue'
import DialogConfirmProcess from './components/DialogConfirmProcess.vue'
import { LIST_BANK_ACCOUNT, ARRAY_STATUS_CHILD_SERVICE } from '@/utils/constant'

const moneyInResource = new MoneyInResource()
const searchResource = new SearchResource()

export default {
  name: 'MoneyIn',
  components: {
    Pagination,
    // DialogEditNote,
    DialogEditHistory,
    DialogConfirmProcess
  },
  // props: ['admin'],
  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1,
        type: 2
      },
      total: 20,
      loadingExportExcel: false,
      statusList: [
        {
          label: 'no',
          value: 0
        },
        {
          label: 'clear',
          value: 1
        }
      ],
      sourceList: [
        {
          label: 'Hệ thống tạo',
          value: 0
        },
        {
          label: 'CMS tạo',
          value: 1
        }
      ],
      bankAccountList: LIST_BANK_ACCOUNT,
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
      arrayTypePurchase: ARRAY_STATUS_CHILD_SERVICE
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
    // this.timer = setInterval(this.onGetList, 1000 * 20)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    checkAdmin(row) {
      if (row?.sale?.id === this.admin?.id) {
        return true
      }
      return false
    },
    onGetList() {
      this.loadingTable = true
      moneyInResource.moneyInList(this.query).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
          this.total_money = data.total_money
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
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10, type: 2 })
      this.dateRange = ''
      this.onGetList()
    },
    handleDownload() {
      this.loadingExportExcel = true
      const body = Object.assign({}, this.query)
      delete body.limit
      delete body.page
      moneyInResource.exportExcel(body).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.dataExcel = data.data
          // const arr = []

          this.dataExcel.map((result, i) => {
            result.index = i + 1
            if (result.sale) {
              const sale_name = result.sale.name
              result.sale_name = sale_name
            }
            if (result.admin) {
              const admin_name = result.admin.name
              result.admin_name = admin_name
            }
            if (result.booked) {
              const code = [...new Set(result.booked.map(d => d.code_booking))]
              result.booked = code.join()
              console.log(result.booked)
            }
            result.source_name = result.source_type === 0 ? 'Hệ thống tạo' : 'CMS tạo'
            result.clear = result.is_clear === 0 ? 'No' : 'Clear'
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['STT', 'Sale xử lý', 'Nguồn tạo', 'TT clear', 'Ngày', 'Số tiền', 'Số tài khoản', 'Ngân hàng', 'Mã thanh toán', 'trace code', 'Mã BK', 'Note', 'Nội dung chuyển khoản', 'Admin']
            const filterVal = ['index', 'sale_name', 'source_name', 'clear', 'date_transaction', 'amount_money', 'bank_account_number', 'bank_name', 'code_payment', 'trace_code', 'booked', 'note', 'transfer_content', 'admin_name']
            let data = this.dataExcel

            data = this.formatJson(filterVal, data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'TopUpCms'
            })
          })
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
        this.loadingExportExcel = false
      }).finally(_ => {
        this.loadingExportExcel = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleEditNote(row) {
      this.dialogUpdateNote = true
      this.objectData = Object.assign({}, row)
    },
    handleClose() {
      this.dialogUpdateNote = false
      this.showDialogUpdateRow = false
      this.dialogConfirmProcess = false
      this.onGetList()
    },
    handleEdit(row) {
      this.isAdd = false
      this.showDialogUpdateRow = true
      this.objectDataEdit = Object.assign({}, row)
    },
    handleAdd() {
      this.isAdd = true
      this.showDialogUpdateRow = true
      this.objectDataEdit = {}
    },
    confirmDone(row) {
      this.dialogConfirmDone = true
      this.query.id = row.id
      this.request.time_done = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    handleConfirmDone() {
      // axios
      //   .post(`${baseUrl}/cms/booking-history-transaction-bank/confirm-done/${this.query.id}`, this.request)
      //   .then((res) => {
      //     console.log(res)
      //     if (res.data.error_code === 0) {
      //       this.$message({
      //         type: 'success',
      //         message: 'Xác nhận thành công!'
      //       })
      //       this.dialogConfirmDone = false
      //       this.onGetList()
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: 'Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!'
      //       })
      //     }
      //   })
      //   .finally(() => {
      //     this.dialogConfirmDone = false
      //   })
    },
    confirmClear(row) {
      this.dialogConfirmClear = true
      this.query.id = row.id
      this.body = {}
      this.body.date_transaction = moment(row.date_transaction).format('YYYY-MM-DD HH:mm:ss')

      if (row.code_booking.includes('GB')) {
        this.body.list_code_GB = row.code_booking.split(',').filter(item => item.includes('GB'))
      } else {
        this.body.list_code_GB = []
      }
      // this.body.date_transaction = row.date_transaction
    },
    handleConfirmClear(clear) {
      if (!this.body.type_purchase && clear === 1) {
        this.$message.warning('Bạn cần chọn hình thức thanh toán !!')
        return
      }
      const admin = getAcountInfo()
      this.body.admin_id = admin.id
      this.body.is_clear = clear
      // this.dialogConfirmClear = false
      console.log('body..........', this.body)
      moneyInResource.confirmClear(this.body, this.query.id).then(res => {
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success('Clear thành công')
          this.dialogConfirmClear = false
          this.onGetList()
        } else {
          this.$message.error(error_msg)
        }
      })

      // const params = Object.assign(this.body, { is_clear: clear })
      // axios
      //   .post(`${baseUrl}/cms/booking-history-transaction-bank/confirm-clear/${this.query.id}`, params)
      //   .then((res) => {
      //     console.log(res)
      //     if (res.data.error_code === 0) {
      //       this.$message({
      //         type: 'success',
      //         message: 'Xác nhận thành công!'
      //       })
      //       this.dialogConfirmClear = false
      //       this.onGetList()
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: 'Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!'
      //       })
      //     }
      //   })
      //   .finally(() => {
      //     this.dialogConfirmClear = false
      //   })
    },
    confirmProcess(row) {
      this.dialogConfirmProcess = true
      row.baseUrl = this.baseUrl
      this.objectData = Object.assign({}, row)
    },
    unConfirmProcess(row) {
      // console.log(row)
      // axios.post(`${baseUrl}/cms/booking-history-transaction-bank/un-confirm-process/${row.id}`).then((res) => {
      //   if (res.data.error_code === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: 'Nhả xử lý thành công!'
      //     })
      //     this.onReset()
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: 'Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!'
      //     })
      //   }
      // })
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
  margin-bottom: 20px;
}
.cell .el-tag{
  margin: 5px;
}
</style>
