<template>
  <div class="reservation_booking app-container">
    <div class="col-md-12">
      <el-row class="list-account__header mb-10">
        <el-col :sm="24">
          <h3 class="title">Quản lý doanh thu sale</h3>
          <h5 style="margin: 0;text-align: center; width: 100%; padding: 10px; color: red;">
            {{ `TỔNG TIỀN THEO THÁNG: ${formatNumber(total_money)} VNĐ` }}
          </h5>
        </el-col>
      </el-row>
      <div class="filter-container">
        <el-row>
          <el-col :sm="12" :md="4" :lg="4" class="mr-10">
            <label class="w-100">Mã bill</label>
            <el-input
              v-model="listQuery.code_key"
              class="w-100"
              clearable
              placeholder="Nhập mã bill hoặc mã thanh toán"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <!-- <el-col :sm="12" :md="4" :lg="4" class="mr-10">
            <label class="w-100">Mã bill</label>
            <el-input
              v-model="listQuery.code_by_booking"
              class="w-100"
              clearable
              placeholder="Nhập Code Booking hoặc mã OUT"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="12" :md="4" :lg="4" class="mr-10">
            <label class="w-100">Tên sân</label>
            <search-facility @selection-changed-facility="handleSelectionChanged" />
          </el-col>
          <el-col :sm="12" :md="4" :lg="4" class="mr-10">
            <label class="w-100">Trạng thái thanh toán</label>
            <el-select
              v-model="listQuery.status"
              class="w-100"
              clearable
              placeholder="Trạng thái thanh toán"
              @keyup.enter.native="handleFilter"
            >
              <el-option v-for="(item, key) in status_bill" :key="key" :label="item" :value="key" />
            </el-select>
          </el-col>

          <el-col :sm="12" :md="6" :lg="6" class="mr-10">
            <label class="w-100">Ngày chơi</label>
            <el-date-picker
              v-model="listQuery.date_played"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy"
              value-format="dd/MM/yyyy"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </el-col>

          <el-col :sm="12" :md="4" :lg="4" class="mr-10">
            <label class="w-100">User</label>
            <search-user @selection-changed-user="handleSelectionChangedUser" />
          </el-col> -->
          <el-col :sm="22" :md="6" :lg="6" class="mr-10">
            <label class="w-100">Ngày tạo</label>
            <el-date-picker
              v-model="DateRangeCreated"
              class="daterange"
              format="dd/MM/yyyy HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="5" class="pt-10">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
          </el-col>
          <el-col :sm="5" class="pt-10">
            <el-button class="filter-item" type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleExportExcel">
              Xuất Excel
            </el-button>
          </el-col>
          <!-- <el-col :sm="5" class="mr-10 pt-10">
            <el-button
              type="primary"
              round
              @click="exportVoucher"
            >
              Xuất chứng từ
            </el-button>
          </el-col> -->

        </el-row>
      </div>
      <div class="clearfix-20" />
      <el-row class="list-account__data">
        <el-table
          ref="multipleTable"
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <!-- <el-table-column
            type="selection"
            width="45"
            :selectable="canSelectRow"
          /> -->
          <!-- <el-table-column
            width="50"
            prop="checked"
          >
            <template slot-scope="{row}">

              <el-checkbox v-if=" row.status !== 0 && (row.misa_voucher_status === 0 || row.misa_voucher_status === 2)" v-model="row.checked" @change="handleChangeChecked(row)" />
            </template>

          </el-table-column> -->
          <el-table-column
            label="STT"
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column

            width="100"
            prop="bill_code"
            label="Mã bill"
            align="center"
          />
          <el-table-column
            width="100"
            prop="general_bill_id"
            label="Code"
            align="center"
          />
          <el-table-column
            width="100"
            label="Code Booking"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.key ? row.key.codeBooking : '' }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Sân"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.key ? row.key.facility_name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="HIO"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag v-for="(hio, key) in row.hio" :key="key">
                {{ hio }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="OUT"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag v-for="(out, key) in row.out" :key="key">
                {{ out }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="100"

            label="Tổng tiền"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatNumber(row.payment_amount) }} đ
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="VID Thanh toán"
            align="center"
          >
            <template slot-scope="{row}">
              VID{{ row.user_id }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Admin tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ handleAdmin(row.admin_id) }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="created_at"
            label="Ngày tạo"
            align="center"
          />
          <el-table-column
            width="100"
            label="Ngày chơi"
            align="center"
          >
            <template slot-scope="{row}">
              <span v-if=" JSON.parse(row.data_json)?.pax">
                {{ formatDate( JSON.parse(row.data_json)?.pax?.date_played, 'HH:mm:ss, DD-MM-YYYY') }}
              </span>
              <!-- {{ row.update_expiration_time != null ? row.update_expiration_time : '' }} -->
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="TT xuất chứng từ"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="color_status[row.misa_voucher_status]">{{ (voucher_status[row.misa_voucher_status]) }}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column
            width="150"
            prop="status"
            label="Trạng thái thanh toán"
            align="center"
          >
            <template slot-scope="{row}">
              <template v-if="row.status === 1">
                <el-tag :type="color_status[row.status]">
                  {{ payment_method[row.payment_method] }}
                </el-tag>
              </template>
              <template v-else-if="row.status !== 1 && row.is_cancel !== 1">
                <el-tag :type="color_status[row.status]">
                  {{ status_bill[row.status] }}
                </el-tag>
              </template>
              <template v-else-if="row.is_cancel === 1">
                <el-tag type="danger">
                  Đã hủy
                </el-tag>
              </template>
            </template>
          </el-table-column> -->
          <el-table-column
            width="150"
            prop="status"
            label="Trạng thái thanh toán"
            align="center"
          >
            <template slot-scope="{row}">
              <template>
                <el-tag v-if=" row.is_cancel !== 1" :type="color_status[row.status]">
                  {{ status_bill[row.status] }}
                </el-tag>
                <el-tag v-else-if="row.is_cancel === 1" type="danger">
                  Đã hủy
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Hành động">
            <template slot-scope="{row}">
              <!-- <el-button
                v-if="(row.misa_voucher_status == 0 || row.misa_voucher_status == 3 ) && row.status === 1"
                type="info"
                round
                size="mini"
                @click="exportVoucher(row)"
              >Xuất chứng từ
              </el-button> -->
              <el-button
                v-if="row?.is_cancel !== 1 && row.status != 0"
                type="success"
                icon="el-icon-info"
                round
                size="mini"
                @click="onShowStatistic(row)"
              >Quản lý thu
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-edit"
                round
                size="mini"
                @click="onShowDetail(row)"
              >Chi tiết
              </el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > listQuery.limit"
            :total="total"
            :limit.sync="listQuery.limit"
            :page-sizes="[10, 20, 30, 50, 100, 200, 300, 500]"
            :page.sync="listQuery.page"
            @pagination="onGetLists"
          />

          <dialog-detail-bill
            :list-agency="listAgency"
            :show-dialog="showDialogDetail"
            :list-insurrance="listInsurrance"
            :object-data="objectData"
            @clickButtonDialogDetail="handleClickDialogDetail"
          />
          <dialog-detail-other-service
            :show-dialog="showDialogDetailService"
            :service-id="serviceId"
            @clickButtonDialogDetailService="handleClickDialogDetailService"
          />
          <export-voucher
            :list-bill-export="multipleSelection"
            :dialog-visible="showVoucher"
            @onRemoveBillExport="handleRemoveBillExport"
            @onClickButtonExportVoucher="handleClickButtonExportVoucher"
          />
          <dialog-confirm-payment
            :dialog-visible="showDialogConfirmPayment"
            :object-data="objectDataV2"
            @onClickButtonConfirmPayment="handleClickButtonConfirmPayment"
          />
          <dialog-statistic
            :show-dialog="showDialogStatistic"
            :object-data="objectDataStatistic"
            :list-insurrance="listInsurrance"
            @closeDialog="handleCloseDialog"
            @openDialogDetailProduct="handleOpenDialogDetailProduct"
          />
          <dialog-input-price-bill
            :show-dialog="showPriceInput"
            :object-data="objectDataPriceInput"
            @handleCloseDialog="handleCloseDialog"
          />
          <dialog-update-supplier
            :show-dialog="showUpdateSupplier"
            :object-data="objectDataUpdateSupplier"
            @handleCloseDialog="handleCloseDialog"
          />
        </el-row>

      </el-row>

    </div>
  </div>
</template>

<script>
import moment from 'moment'

import Pagination from '@/components/Pagination'
// import DialogAddBill from './components/dialogCreateBill'
import DialogDetailBill from './components/DialogDetailBill'
import DialogDetailOtherService from './components/DialogDetailOtherSerivce.vue'
import DialogConfirmPayment from './components/DialogConfirmPayment.vue'
import DialogStatistic from './components/DialogStatistic.vue'
import exportVoucher from './components/exportVoucher.vue'
import { formatNumber, formatDate } from '@/utils/convert'
import { getAcountInfo, getAllAdmin } from '@/utils/auth'
import BookingPaxResource from '@/api/BookingPax'
import { create_signature } from '@/utils/create-signnature'
import { STATUS_BILL, COLOR_STATUS, MISA_VOUCHER_STATUS, REGION, PAYMENT_METHOD } from '@/utils/status'
import V11PriceByHoleInsurrance from '@/api/V11PriceByHoleInsurrance'
// import SearchFacility from '@/views/component/SearchFacility.vue'
// import SearchAdmin from '@/views/component/SearchAdmin.vue'
import { isEmpty } from '@/utils/validate'
// import SearchAgency from '@/views/component/SearchAgency.vue'
// import SearchUser from '@/views/component/SearchUser.vue'
import AgencyResource from '@/api/agency/agency'
import DialogInputPriceBill from './components/DialogInputPriceBill.vue'
import DialogUpdateSupplier from './components/DialogUpdateSupplier.vue'

// import moment from 'moment'
const agencyResource = new AgencyResource()

const priceByHoleInsurrance = new V11PriceByHoleInsurrance()
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'Lists',
  components: {
    // SearchUser,
    // SearchAgency,
    // SearchAdmin,
    // SearchFacility,
    Pagination,
    DialogDetailOtherService,
    DialogDetailBill,
    exportVoucher,
    DialogConfirmPayment,
    DialogStatistic,
    DialogInputPriceBill,
    DialogUpdateSupplier
  },
  props: {
    admin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bank: {
      type: Object,
      default: () => {
        return {}
      }
    }

  },
  data() {
    return {
      listAgency: [],
      is_delete: getAcountInfo().is_delete,
      is_write: getAcountInfo().is_write,
      is_edit: getAcountInfo().is_edit,
      dataAllAdmin: getAllAdmin() || [],
      listQuery: {
        limit: 10,
        page: 1,
        admin_id: [getAcountInfo().id]
      },
      isAdd: true,
      tableData: [],
      total: 0,
      from: 0,
      total_money: 0,
      objectData: {},
      objectDataV2: {},
      showDialogAddGolfer: false,
      showDialogDetailService: false,
      showDialogDetail: false,
      loadingTable: false,
      loadingData: false,
      showVoucher: false,
      showDialogConfirmPayment: false,
      serviceId: 0,
      bill: {},
      objectDataProduct: {},
      status_bill: STATUS_BILL,
      payment_method: PAYMENT_METHOD,
      color_status: COLOR_STATUS,
      voucher_status: MISA_VOUCHER_STATUS,
      listInsurrance: [],
      objectVoucher: {},
      region: REGION,
      isColumnDisabled: true,
      multipleSelection: [],
      loadingExportExcel: false,
      objectDataStatistic: {},
      showDialogStatistic: false,
      showPriceInput: false,
      objectDataPriceInput: {},
      showUpdateSupplier: false,
      objectDataUpdateSupplier: {},
      DateRangeCreated: []
    }
  },
  computed: {
  },
  watch: {
    DateRangeCreated(value) {
      if (value) {
        this.listQuery.start_time = moment(value[0]).unix() * 1000
        this.listQuery.end_time = moment(value[1]).unix() * 1000
        const Max31Day = new Date(this.listQuery.start_time)
        Max31Day.setDate(Max31Day.getDate() + 31)
        if (new Date(this.listQuery.end_time).getTime() > Max31Day.getTime()) {
          this.$message.warning('Chọn tối đa 31 ngày thôi !!!')
          this.DateRangeCreated = undefined // Gán undefined thay vì []
          this.listQuery.start_time = undefined
          this.listQuery.end_time = undefined
          console.log('this.listQuery.......', this.listQuery)
        }
      } else {
        delete this.listQuery.start_time
        delete this.listQuery.end_time
      }
    },
    'listQuery.date_played'(value) {
      if (value) {
        console.log('value..........', value, moment(this.listQuery.date_played[1], 'DD/MM/yyyy').unix())
        console.log('start..........', moment(this.listQuery.date_played[0], 'DD/MM/yyyy').unix() * 1000)
        const Max31Day = moment(this.listQuery.date_played[0], 'DD/MM/yyyy').add(31, 'days').unix() * 1000
        const last_day = moment(this.listQuery.date_played[1], 'DD/MM/yyyy').unix() * 1000
        console.log('Max31Day..........', Max31Day)
        console.log('last_day..........', last_day)
        if (Max31Day < last_day) {
          this.$message.warning('Chọn tối đa 31 ngày thôi !!!')
          this.listQuery.date_played = undefined
          console.log('this.listQuery.......', this.listQuery)
        }
      }
    }
  },
  created() {
    this.getListInsurrance()
  },
  mounted() {
    this.onGetLists()
    this.getRevenueBillBySale()
    this.getListAgent()
  },
  beforeDestroy() {
  },
  methods: {
    getRevenueBillBySale() {
      const { page, limit, ...restQuery } = this.listQuery
      console.log(page, limit)
      bookingPaxResource.getRevenueBillBySale({ ...restQuery, admin_id: getAcountInfo().id }).then(res => {
        if (res.error_code === 0) {
          console.log(res)
          this.total_money = res?.data?.payment_amount || 0
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    getListAgent() {
      agencyResource.searchAgency().then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.listAgency = result.map(value => {
              return { value: value.id, label: value.name, data: value }
            })
          } else {
            this.listAgency = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    canSelectRow(row, index) {
      return row.status !== 0 && (row.misa_voucher_status === 0 || row.misa_voucher_status === 2)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.onGetLists()
      this.getRevenueBillBySale()
    },
    handleClickDialogAddGolfer(value) {
      this.showDialogAddGolfer = false
      if (value) {
        this.onGetLists()
      }
    },
    onSearchForm(value) {
      this.listQuery = value
      this.onGetLists()
    },
    onReloadTableData(value) {
      if (value) {
        this.listQuery = Object.assign({}, { limit: 10, page: 1 })
        this.onGetLists()
      }
    },
    onGetLists() {
      this.loadingTable = true
      bookingPaxResource.listBill(this.listQuery).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.tableData = res?.data?.bill?.bill_list
          this.total = res?.data?.total
          this.tableData.map(item => {
            item.hio = []
            item.out = []
            item.data_provider.forEach(element => {
              if (element.name === 'buy_hio') {
                const nameHIO = element.data_transaction.name_tour.split('-')[1] + ' - ' + element.data_transaction.id
                item.hio.push(nameHIO)
              } else if (element.name === 'booking_outside_new') {
                const nameOUT = 'OUT' + element.data_transaction.payment_id
                item.out.push(nameOUT)
              }
            })
            // if (item.update_expiration_time !== null) {
            //   const date1 = item.update_expiration_time.split(',')
            //   const date2 = date1[1].split('-')
            //   const date3 = date1[0] + ' ' + date2[0] + '-' + date2[1] + '-' + date2[2]
            //   item.update_expiration_time = moment(date3, 'HH:mm:ss DD-MM-YYYY').add(30, 'minutes').format('HH:mm:ss DD-MM-YYYY')
            // }
          })
          console.log('this.tableData', this.tableData)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onShowDetail(value) {
      this.showDialogDetail = true
      this.objectData = { ...value }
    },
    handleEdit(row) {
      this.showDialogAddGolfer = true
      this.isAdd = false
      this.bill = { ...row }
    },
    handleDelete(id) {
      this.$confirm(`Bạn có chắc chắn xóa Bill này ?`).then((_) => {
        let bodyRequest = { general_bill_id: id }
        const signature = this.create_signature(bodyRequest)
        bodyRequest = { ...bodyRequest, signature }
        bookingPaxResource.removeBooking(bodyRequest).then(res => {
          if (res.error_code === 0) {
            this.$message.success('Xóa thành công')
            this.onGetLists()
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleConfirmBill(id) {
      this.$confirm(`Bạn có muốn xác nhận bill này ?`).then((_) => {
        let bodyRequest = { general_bill_id: id }
        const signature = this.create_signature(bodyRequest)
        bodyRequest = { ...bodyRequest, signature }
        bookingPaxResource.billConfirm(bodyRequest).then(res => {
          if (res.error_code === 0) {
            this.$message.success('Xác nhận thành công.')
            this.onGetLists()
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    handleOpenDialogDetailProduct(value) {
      this.showDialogDetailService = true
      if (value) {
        this.serviceId = value.service_id
      }
    },
    handleClickDialogDetailService(value) {
      this.showDialogDetailService = false
      if (value) {
        this.objectDataProduct = value
      }
    },
    handleClickDialogDetail(value) {
      this.showDialogDetail = false
    },
    handleAddBill() {
      this.showDialogAddGolfer = true
      this.isAdd = true
    },
    getListInsurrance() {
      priceByHoleInsurrance.listAllPackage().then(res => {
        if (res.error_code === 0) {
          const result = res?.data
          if (result.length > 0) {
            this.listInsurrance = result.filter(item => item.name && item.name.includes('D') && ((item.is_public === 1 && item.number_hole === 4) || (item.number_hole === 4 && item.name === 'D20'))).map(value => {
              return { value: value.id, label: value.name, price: value.price }
            })
            this.listInsurrance = [...this.listInsurrance, { value: 0, label: 'Không mua', price: 0 }]
          } else {
            this.listInsurrance = [{ value: 0, label: 'Không mua', price: 0 }]
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleAdmin(admin_id) {
      const admin = this.dataAllAdmin.find(item => item.id === admin_id)
      if (admin) return admin.name
      else return admin_id
    },
    handleClickButtonExportVoucher(object) {
      const { dialog, reload } = object
      this.showVoucher = dialog
      if (reload) {
        this.onGetLists()
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    exportVoucher() {
      this.showVoucher = true
    },
    handleConfirmPayment(value) {
      this.objectDataV2 = { ...value }
      this.showDialogConfirmPayment = true
    },
    handleClickButtonConfirmPayment(object) {
      const { dialog, reload } = object
      this.showDialogConfirmPayment = dialog
      if (reload) {
        this.onGetLists()
      }
    },
    handleSelectionChanged(value) {
      console.log('value_________________', value)
      if (isEmpty(value)) {
        delete this.listQuery.facility_id
        return
      }
      this.listQuery.facility_id = value.value
      console.log('this.listQuery.facility_id', this.listQuery)
    },
    handleSelectionChangedAdmin(value) {
      if (isEmpty(value)) {
        delete this.listQuery.admin_id
        return
      }
      this.listQuery.admin_id = value
    },
    handleSelectionChangedAgency(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.listQuery.agency_id
        return
      }
      this.listQuery.agency_id = value.value
    },
    handleSelectionChangedUser(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.listQuery.uid
        return
      }
      this.listQuery.uid = value.value
    },
    handleRemoveBillExport(rows) {
      // this.$refs.multipleTable.clearSelection()
      const arr = [rows]
      arr.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, false)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleExportExcel() {
      this.loadingExportExcel = true
      const queryExport = Object.assign({}, this.listQuery)
      delete queryExport.page
      delete queryExport.limit
      console.log(this.listQuery)
      console.log(queryExport)

      bookingPaxResource.exportBill(queryExport).then(res => {
        const link = document.createElement('a')
        // nếu trong link trả về không có http hoặc https thì thêm vào
        link.href = res.data.link.includes('http') ? res.data.link : 'http://' + res.data.link
        link.download = 'statistic.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err?.error_code || 'Có lỗi xảy ra')
      }).finally(() => {
        this.loadingExportExcel = false
      })
    },
    onShowStatistic(row) {
      this.showDialogStatistic = true
      this.objectDataStatistic = { ...row } // 12015, 11896, 12032, 12020, 12122
    },
    handleCloseDialog() {
      this.objectDataStatistic = {}
      this.showDialogStatistic = false
      this.showPriceInput = false
      this.showUpdateSupplier = false
      this.objectDataUpdateSupplier = {}
      this.onGetLists()
    },
    handleInputPrice(row) {
      console.log('.....roww,,,,,,,,,', row)
      this.objectDataPriceInput = Object.assign({}, { pax: JSON.parse(row.data_json)?.pax, general_bill_id: row.general_bill_id })
      this.showPriceInput = true
    },
    handleShowUpdateSupplier(row) {
      this.objectDataUpdateSupplier = { ...row }
      this.showUpdateSupplier = true
    },
    checkShowButtonConfirmPayment(row) {
      const data = JSON.parse(row.data_json)
      const check_exist_payment = (
        data?.hio?.some(item => item?.is_customer_pay === 1) ||
    data?.pax?.booked.some(item => item?.type_purchase > 0 && +item?.type_purchase !== 14) ||
    data?.other_services?.some(item => item?.status === 1) ||
    data?.shop?.some(item => item.some(shopItem => shopItem?.paid > 0))
      )
      // const check_payment = data.map(item => )
      console.log('json..................', JSON.parse(row.data_json))
      console.log('check_exist_payment.....', check_exist_payment)
      console.log('status........', row.status)
      // console.log('(res........', check_exist_payment)
      return (row.status === 2 || row.status === 3) && !check_exist_payment && row?.is_cancel !== 1
    },
    formatNumber, create_signature, formatDate
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}
.pr-5 {
  padding-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.w-100{
  width: 100%;
}
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 0 0;
  font-weight: 700px;
  text-transform: uppercase;
}
</style>
