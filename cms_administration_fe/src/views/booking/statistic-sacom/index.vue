
<template>
  <el-row class="p-10">
    <!-- <div class="clearfix-20"></div> -->
    <el-row class="list-device__header">
      <el-col :sm="24">
        <h3 style="margin: 0;text-align: center; width: 100%; padding: 10px;">
          DANH SÁCH KHÁCH HÀNG SACOMBANK SỬ DỤNG DỊCH VỤ GOLF
        </h3>
        <h3 style="margin: 0;text-align: center; width: 100%; padding: 10px; color: red;">
          {{ `TỔNG TIỀN: ${formatNumber(total_money)} VNĐ` }}
        </h3>
      </el-col>
    </el-row>
    <div class="clearfix-10" />
    <div class="filter-container">
      <el-row>
        <el-col :sm="3" class="mr-10 mt-10">
          <el-input
            v-model="query.passport"
            style="width: 100%"
            clearable
            placeholder="Nhập CCCD để tìm kiếm"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

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

        <el-col :sm="3" class="mr-10 mt-10">
          <el-input
            v-model="query.code_booking"
            style="width: 100%"
            clearable
            placeholder="Nhập mã CMS để tìm kiếm"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <el-col :sm="6" :md="3" class="mr-10 mt-10">
          <el-select
            ref="searchAdmin"
            v-model="query.sale_id"
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="Nhập tên sale"
            :remote-method="onSearchAdmin"
            :loading="loadingSearchAdmin"
            @hook:mounted="(value) => cancelReadOnly(value, 'searchAdmin')"
            @visible-change="(value) => cancelReadOnly(value, 'searchAdmin')"
          >
            <el-option
              v-for="admin in adminData"
              :key="admin.value"
              :label="'VID' + admin.value + ' - ' + admin.label"
              :value="admin.value"
            />
          </el-select>
        </el-col>
        <el-col :sm="5" :md="5" class="mr-10 mt-10">
          <el-date-picker
            v-model="dateRange"
            type="month"
            class="w-100"
            format="MM-yyyy"
            placeholder="Tìm kiếm theo tháng"
          />

          <!-- <el-date-picker
            v-model="dateRange"
            class="w-100"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          /> -->
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10 filter-search" style="float: right;">
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
    <el-row class="list-device__data ">
      <div class="clearfix-20" />
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column align="center" width="150" label="TÊN KHÁCH HÀNG">
          <template slot-scope="{ row }">
            {{
              row.real_name
                ? upperCase(row.real_name)
                : row.golfer
                  ? upperCase(row.golfer.fullname)
                  : upperCase(row.name_out_system)
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="180" label="SỐ CCCD/CMND">
          <template slot-scope="{ row }">
            {{ row.passport }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="DÒNG THẺ">
          <template slot-scope="{ row }">
            {{ row.type_card ? listTypeCard[row.type_card].split('-')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="LƯỢT SỬ DỤNG">
          <template slot-scope="{ row }">
            {{ row.type_card ? listTypeCard[row.type_card].split('-')[1] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="SÂN GOLF" align="center">
          <template slot-scope="{ row }">
            {{ row.facility.sub_title }}
          </template>
        </el-table-column>
        <el-table-column label="MIỀN" align="center">
          <template slot-scope="{ row }">
            {{ row.facility.regions_id > 0 ? regions[row.facility.regions_id].label : '' }}
          </template>
        </el-table-column>
        <el-table-column width="100" label="CHỦ THẺ" align="center">
          <template>
            1
          </template>
        </el-table-column>
        <el-table-column width="100" label="NGƯỜI CHƠI CÙNG" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.partner_number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="TỔNG" align="center">
          <template slot-scope="{ row }">
            {{ row.partner_number ? 1 + +row.partner_number : 1 }}
          </template>
        </el-table-column>
        <el-table-column label="NGÀY CHƠI" align="center">
          <template slot-scope="{ row }">
            {{ row.date_played ? convertDate(row.date_played) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="ĐƠN GIÁ" align="center">
          <template slot-scope="{ row }">
            {{
              row.price_sacom
                ? !isWeekend(new Date(row.date_played))
                  ? formatNumber(row.price_sacom.normal_price)
                  : formatNumber(row.price_sacom.holiday_price)
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="THÀNH TIỀN" align="center">
          <template slot-scope="{ row }">
            {{
              row.price_sacom
                ? !isWeekend(new Date(row.date_played))
                  ? formatNumber(
                    (row.partner_number ? 1 + +row.partner_number : 1) *
                      row.price_sacom.normal_price,
                  )
                  : formatNumber(
                    (row.partner_number ? 1 + +row.partner_number : 1) *
                      row.price_sacom.holiday_price,
                  )
                : ''
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="GHI CHÚ: TÊN NGƯỜI CHƠI CÙNG" align="center">
                  <template slot-scope="{ row }"> </template>
              </el-table-column> -->
        <el-table-column label="GHI CHÚ: TÊN NGƯỜI CHƠI CÙNG">
          <template slot-scope="{ row }">
            {{ row.note }}
          </template>
        </el-table-column>
        <el-table-column label="SALE" align="center">
          <template slot-scope="{ row }">
            {{ row.admin }}
          </template>
        </el-table-column>
        <el-table-column label="MÃ CMS" align="center">
          <template slot-scope="{ row }">
            {{ row.code_booking }}
          </template>
        </el-table-column>
        <el-table-column label="TT XÁC NHẬN" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="renderClassStatus(row.reservation_status)"
            >{{ convertStatusString(row.reservation_status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái Bank" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.is_bank_confirm == 1" type="success">
              Đã xác nhận
            </el-tag>
            <el-tag v-else type="danger">
              Chưa xác nhận
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Hành động" align="center">
                  <section
                      slot-scope="scope"
                      style="display: flex; align-items: center; display: flex; flex-direction: column;"
                  >
                      <section v-if="checkAdmin(scope.row)">
                          <el-tag v-if="scope.row.is_admin_confirm == 1" type="success">
                              Đã xác nhận
                          </el-tag>
                          <el-button v-else type="primary" size="small" @click="confirmDone(scope.row)"
                              >Xác nhận
                          </el-button>
                      </section>
                  </section>
              </el-table-column> -->
        <el-table-column label="Hành động" align="center">
          <section
            slot-scope="scope"
            style="display: flex; align-items: center; display: flex; flex-direction: column;"
          >
            <el-button class="mb-10" type="primary" @click="handleEdit(scope.row)">Edit </el-button>
            <section>
              <template v-if="scope.row.is_admin_confirm == 1">
                <el-tag type="success">
                  Đã xác nhận
                </el-tag>
                <el-button
                  type="primary"
                  size="small"
                  @click="unConfirmDone(scope.row)"
                >Bỏ xác nhận
                </el-button>
              </template>
              <el-tag v-else type="danger">
                Chưa xác nhận
              </el-tag>
              <!-- <el-button v-else type="primary" size="small" @click="confirmDone(scope.row)"
                              >Xác nhận
                          </el-button> -->
            </section>
          </section>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 10px;">
        <el-col :sm="2">
          <el-button
            v-show="!loadingTable"
            type="primary"
            icon="el-icon-check"
            @click="confirmDone"
          >Xác nhận</el-button>
        </el-col>
        <el-col>
          <pagination
            v-show="total > query.limit"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
          <DialogEditSacom
            :show-dialog="showDialog"
            :is-add="isAdd"
            :object-data="objectData"
            @onCloseDialog="handleClose"
          />
        </el-col>
      </el-row>
    </el-row>
  </el-row>
</template>
<script>
import Pagination from '@/components/Pagination'
import moment from 'moment'
import { formatNumber, convertDate, upperCase, renderClassStatus, convertStatusString } from '@/utils/convert'
import ControlBankResource from '@/api/ControlBank'
const controlBankResource = new ControlBankResource()
import DialogEditSacom from './components/DialogEditSacom.vue'
import { LIST_TYPE_CARD, REGIONS, LIST_HOLIDAY } from '@/utils/constant'
import SearchResource from '@/api/search-api'
const baseURL = process.env.VUE_APP_BASE_API

const searchResource = new SearchResource()

export default {
  name: 'ControlBankSacomStatistic',
  components: {
    Pagination,
    DialogEditSacom
  },
  props: ['admin'],
  data() {
    return {
      tableData: [],
      loadingTable: false,
      total: 0,
      query: {
        limit: 10,
        page: 1
      },
      dateRange: '',
      title: '',
      loadingExportExcel: false,
      regions: REGIONS,
      listTypeCard: LIST_TYPE_CARD,
      dialogEditNote: false,
      noteEdit: '',
      body: {},
      showDialog: false,
      isAdd: true,
      objectData: {},
      multipleSelection: [],
      dialogConfirmDone: false,
      total_money: 0,
      loadingSearchAdmin: false,
      adminData: [],
      LIST_HOLIDAY: LIST_HOLIDAY,
      timer: ''
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
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        console.log('value', value)
        this.query.start_time = moment(value).startOf('month').unix()
        this.query.end_time = moment(value).endOf('month').unix()
        // this.title = `${moment(value[0]).get('date')}.${moment(value[1]).get('month') + 1} - ${moment(
        //   value[1]
        // ).get('date')}.${moment(value[1]).get('month') + 1} năm ${moment(value[1]).get('year')}`
      } else {
        this.query.start_time = ''
        this.query.end_time = ''
      }
    }
  },

  created() {
    this.onGetList()
    // this.onGetTotalMoney()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    checkAdmin(row) {
      if (row?.admin === this.admin?.id) {
        return true
      }
      return false
    },
    onGetList() {
      const self = this
      self.loadingTable = true
      controlBankResource.listSaCom(this.query).then(response => {
        if (response.error_code === 0) {
          const data = response.data.data
          // let data = result.data;
          console.log('data----------------------', data)
          self.tableData = data
          console.log('self.tableData----------------------', self.tableData)
          self.total = response.data.total
          self.from += self.query.limit * (self.query.page - 1)
        } else {
          self.$message.error(response.error_msg)
        }
      }).finally(() => {
        self.loadingTable = false
      })
    },
    onGetTotalMoney() {
      controlBankResource.totalMoneySaCom(this.query).then(response => {
        console.log('response total____________', response)
        if (response.error_code === 0) {
          this.total_money = response.data
        } else {
          self.$message.error(response.error_msg)
        }
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
      // this.onGetTotalMoney()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleDownload() {
      this.loadingExportExcel = true
      controlBankResource.exportSaCom(this.query).then(response => {
        var fileLink = document.createElement('a')
        const params = new URLSearchParams(this.query).toString()
        fileLink.href = `${baseURL}/control-bank/exportSaCom?${params}`
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
    isWeekend(date = new Date()) {
      function pad(s) {
        return s < 10 ? '0' + s : s
      }

      const format_date = [pad(date.getDate()), pad(date.getMonth() + 1), pad(date.getFullYear())].join('-')

      if (this.LIST_HOLIDAY.includes(format_date)) {
        return true
      }
      return date.getDay() % 6 === 0
    },

    handleSelectionChange(val) {
      this.multipleSelection = val.map((item) => item.id)
    },
    confirmDone() {
      const self = this
      if (self.multipleSelection.length < 1) {
        self.$message.warning('Chọn bản ghi trước khi xác nhận.')
        return
      }
      console.log('self.multipleSelection', self.multipleSelection)
      this.dialogConfirmDone = true
      this.query.list_id = this.multipleSelection
      this.$confirm(`Bạn có chắc chắn xác nhận không ?`).then((_) => {
        controlBankResource.confirmDone(this.query).then(res => {
          console.log(res)
          if (res.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Xác nhận thành công!'
            })
            this.dialogConfirmDone = false
            this.onGetList()
          } else {
            this.$message({
              type: 'error',
              message: res.error_msg
            })
          }
        })
      })
    },
    handleEdit(row) {
      this.showDialog = true
      this.isAdd = false
      this.objectData = Object.assign({}, row)
    },
    handleClose(obj) {
      this.showDialog = false
      if (obj.reload) {
        this.onGetList()
      }
    },
    unConfirmDone(row) {
      console.log('row..................', row)
      this.dialogConfirmDone = true
      this.$confirm(`Bạn có chắc chắn bỏ xác nhận không ?`).then((_) => {
        controlBankResource.unConfirmDone(this.query, row.id).then(res => {
          console.log(res)
          if (res.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Xác nhận thành công!'
            })
            this.dialogConfirmDone = false
            this.onGetList()
          } else {
            this.$message({
              type: 'error',
              message: res.error_msg
            })
          }
        })
          .finally(() => {
            this.dialogConfirmDone = false
          })
      })
    },
    onSearchAdmin(keyword) {
      const self = this
      self.loadingSearchAdmin = true
      searchResource.searchAdmin({ keyword_admin: keyword.trim() }).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          if (data.length > 0) {
            const array = []
            data.map((admin) => {
              const item = { value: admin.id, label: admin.name }
              array.push(item)
            })
            this.adminData = [...array]
          }
        }
      }).finally(() => {
        self.loadingSearchAdmin = false
      })
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
    convertDate,
    convertStatusString,
    renderClassStatus,
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

.mt-10 {
  margin-top: 10px;
}
</style>
