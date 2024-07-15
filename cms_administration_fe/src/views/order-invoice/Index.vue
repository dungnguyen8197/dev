<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h4 style="margin: 0; width: 100%; font-weight: 700; color: #0A1F8F;">{{ 'QUẢN LÝ YÊU CẦU XUẤT HÓA ĐƠN' }}</h4>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <div class="filter-container">
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Mã bill</span>
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.code_key"
              placeholder="Nhập mã bill hoặc mã thanh toán"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Mã số thuế</span>
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.tax_code"
              placeholder="Nhập mã số thuế doanh nghiệp"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Tên đơn vị</span>
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.unit_name"
              placeholder="Nhập tên doanh nghiệp"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Tên người mua hàng</span>
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.customer_name"
              placeholder="Nhập tên người mua hàng"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Tình trạng order</span>
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.status"
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Tìm kiếm theo trạng thái order"
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
        <el-col class="search-money mt-10" :sm="24" :md="10" :lg="5">
          <span class="title_search">Ngày tạo</span>
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="dateRange"
              class="w-100"
              format="dd-MM-yyyy"
              value-format="yyyy-MM-dd 12:00:00"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Đại lý</span>
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.agency"
              clearable
              style="width: 100%"
              remote
              filterable
              reserve-keyword
              :multiple-limit="1"
              placeholder="Tìm kiếm theo đại lý"
            >
              <el-option
                v-for="agency in agencies"
                :key="agency.value"
                :label="agency.label"
                :value="agency.label"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="24" :md="6" :lg="4">
          <span class="title_search">Trạng thái thanh toán</span>
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.status_payment"
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Tìm kiếm theo trạng thái TT"
            >
              <el-option
                v-for="status_payment in statusPaymentList"
                :key="status_payment.value"
                :label="status_payment.label"
                :value="status_payment.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="row-search-money group-button">
        <div :sm="8" :md="8" class="mb-10">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </div>
        <div :sm="16" :md="16" class="mb-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Làm mới</el-button>
          <el-button
            type="primary"
            icon="el-icon-download"
            :loading="loadingExportExcel"
            @click="handleDownload"
          >
            Export excel
          </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            :disabled="multipleSelection.length == 0"
            @click="handleExportMultiOrder"
          >
            Xuất chứng từ {{ multipleSelection.length > 0 ? `(${multipleSelection.length})` : '' }}
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
            Tạo mới
          </el-button>
        </div>
      </div>
    </div>
    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelectRow" />
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="bill_code" label="Mã bill" align="center" />
        <el-table-column label="Mã thanh toán" align="center">
          <template slot-scope="scope">
            <el-link type="primary" target="_blank" @click="handleRedirectBill(scope.row.payment_code)"> {{ scope.row.payment_code }}
            </el-link></template>
        </el-table-column>
        <el-table-column prop="customer_name" label="Tên khách hàng" align="center" />
        <el-table-column prop="tax_code" label="Mã số thuế" align="center" />
        <el-table-column prop="unit_name" label="Tên đơn vị" align="center" />
        <el-table-column prop="receiver_email" label="Email" align="center" />
        <el-table-column label="Dịch vụ" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.service">
              <el-tag
                v-for="item in [...scope.row.service.split(',')]"
                :key="item"
                :style="{borderColor: convertName(+item)?.color, background: 'white', color: '#666', borderRadius: '20px', margin: '2px'}"
              >{{ convertName(+item)?.label }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="Tổng tiền" align="center">
          <template slot-scope="scope">
            {{ scope.row.total_money ? formatNumber(scope.row.total_money) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="agency" label="Đại lý" align="center" />
        <el-table-column label="Trạng thái thanh toán" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status_payment === 1" size="small" type="success">Đã thanh toán</el-tag>
            <el-tag v-else-if="scope.row.status_payment === 0" size="small" type="danger">Chưa thanh toán</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="Ghi chú" align="center" />
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Người tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row?.user_create_id > 0 ? `${scope.row?.user_create?.fullname} - vID${scope.row?.user_create_id}` : scope.row?.admin?.name }}
          </template>
        </el-table-column>
        <el-table-column label="Tình trạng order" align="center">
          <template slot-scope="scope">
            <template>
              <el-tag v-if="scope.row.status === 1" type="success">Đã xuất chứng từ</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="danger">Đã hủy</el-tag>
              <el-tag v-else>Đã khởi tạo</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" style="width: 150px" align="center">
          <section slot-scope="scope" style="display: flex; align-items: center;">
            <section class="mr-10">
              <el-button
                type="primary"
                round
                size="mini"
                class="button-action"
                @click="onShowDetail(scope.row)"
              >Chi tiết
              </el-button>
              <el-button
                v-if="scope.row.status !== 1 && scope.row.status !== 2"
                type="danger"
                round
                size="mini"
                class="button-action"
                :loading="loadingSubmitCancelOrder"
                @click="onCancelOrder(scope.row)"
              >Hủy
              </el-button>
              <el-button
                v-if="scope.row.status !== 1 && scope.row.status !== 2"
                type="warning"
                round
                size="mini"
                class="button-action"
                :loading="loadingSubmitExportVoucher"
                @click="handleExportVoucher(scope.row)"
              >Xuất chứng từ
              </el-button>
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
        <dialogCreateOrder
          :show-dialog="showDialogCreateOrder"
          :object-data="objectDataCreateOrder"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
    <el-dialog
      width="400px"
      class="dialog-cancel-order"
      :show-close="false"
      :visible.sync="showDialogCancel"
      :before-close="handleClose"
    >
      <el-row>
        <p style="margin: 0; width: 100%; font-size: 14px; font-weight: 700; text-align: center;">{{ 'Xác nhận hủy yêu cầu xuất hóa đơn ?' }}</p>
        <el-form>
          <el-form-item>
            <span style="font-size: 14px;">Lý do hủy <span style="color: red;">(*)</span></span>
            <el-input
              v-model="postForm.cancellation_reason"
              rows="5"
              type="textarea"
              placeholder=""
            />
          </el-form-item>
          <el-form-item style="float: right; margin-bottom: 0;">
            <el-button size="small" @click="() => {showDialogCancel=false}">Hủy</el-button>
            <el-button size="small" type="primary" @click="confirmCancelOrder">Xác nhận</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
    <template v-if="data_notify.length > 0">
      <el-dialog
        width="400px"
        class="dialog-statistic-bill"
        :show-close="false"
        :visible.sync="isShowDialogNotify"
        :close-on-click-modal="false"
        :before-close="handleCLoseDialogNotify"
      >
        <el-row>
          <el-col>
            <h5 style="margin: 0; width: 100%; font-weight: 600; color: #0A1F8F; text-align: center; margin-bottom: 10px">Thông báo</h5>
          </el-col>
          <el-col>
            <p v-for="(notify, i) of data_notify" :key="i" :style="{ fontSize: '14px', color: notify.Success ? 'green' : 'red'}">
              {{ `${i + 1}.Mã bill: ${notify.bill_code} - Mã thanh toán: ${notify.payment_code} - Mô tả: ${notify.description}` }}
            </p>
          </el-col>
        </el-row>
        <el-row style="text-align: center">
          <el-button type="primary" @click="handleCLoseDialogNotify">Xác nhận</el-button>
        </el-row>
      </el-dialog>
    </template>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import OrderInvoiceResource from '@/api/order-invoice/order-invoice'
import { formatNumber, convertDateTime } from '@/utils/convert'
import moment from 'moment'
// import { getAcountInfo } from '@/utils/auth'
import dialogCreateOrder from './components/dialogCreateOrder.vue'
import BookingPaxResource from '@/api/BookingPax'
import { getAcountInfo } from '@/utils/auth'
import { isEmpty } from '@/utils/validate'
import AgencyResource from '@/api/agency'

const agencyResource = new AgencyResource()
const bookingPaxResource = new BookingPaxResource()
const orderInvoiceResource = new OrderInvoiceResource()

const STATUS_OBJ = {
  '-1': 'Tất cả',
  0: 'Đã khởi tạo',
  1: 'Đã xuất chứng từ',
  2: 'Đã hủy',
  3: 'Thất bại'
}

const STATUS_LIST = Object.entries(STATUS_OBJ).map(([key, value]) => ({
  value: parseInt(key),
  label: value
}))
export default {
  name: 'MoneyIn',
  components: {
    Pagination,
    dialogCreateOrder
  },
  // props: ['admin'],
  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1,
        status: -1,
        status_payment: -1,
        agency: 'Tất cả'
      },
      total: 20,
      loadingExportExcel: false,
      loadingSubmitCancelOrder: false,
      loadingSubmitExportVoucher: false,
      statusList: STATUS_LIST,
      statusObj: STATUS_OBJ,
      statusPaymentList: [
        { value: -1, label: 'Tất cả' },
        { value: 0, label: 'Chưa thanh toán' },
        { value: 1, label: 'Đã thanh toán' }
      ],
      objectData: {},
      dateRange: '',
      showDialogCreateOrder: false,
      objectDataCreateOrder: {},
      showDialogDetailOrder: false,
      objectDataDetailOrder: {},
      showDialogCancel: false,
      postForm: {},
      isAdd: true,
      multipleSelection: [],
      data_notify: [],
      isShowDialogNotify: false,
      agencies: []
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
      console.log('val..............', value)
      if (value) {
        this.query.start_time = moment(value[0]).unix()
        this.query.end_time = moment(value[1]).unix()
      } else {
        this.query.start_time = ''
        this.query.end_time = ''
      }
    }
  },
  created() {
    if (this.$route.query.code_key) {
      this.query = {
        ...this.query,
        code_key: this.$route.query.code_key
      }
    }
    this.onSearchAgency()
    this.onGetList()
    // this.timer = setInterval(this.onGetList, 1000 * 20)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    canSelectRow(row, index) {
      return +row.status === 0
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleExportMultiOrder() {
      this.$confirm(`Bạn có chắc chắn muốn xuất nhiều chứng từ trong 1 lần không ?`).then(async _ => {
        this.loadingSubmitExportVoucher = true
        const mapData = this.multipleSelection.map(item => ({ ...item, general_bill_ids: [item.payment_code_id] }))
        const taxCodesMap = {}

        mapData.forEach(item => {
          if (!taxCodesMap[item.tax_code]) {
            taxCodesMap[item.tax_code] = {
              tax_code: item.tax_code,
              employee_id: getAcountInfo().id,
              payment_code: item.payment_code,
              bill_code: item.bill_code,
              id: item.id,
              general_bill_ids: []
            }
          }
          if (item.general_bill_ids && item.general_bill_ids.length > 0) {
            taxCodesMap[item.tax_code].general_bill_ids.push(...item.general_bill_ids)
          }
        })

        const body = Object.values(taxCodesMap)

        console.log('body.............', body)
        const response = await Promise.all(
          body.map((item, index) => bookingPaxResource.createMiSaVoucher({
            tax_code: item.tax_code,
            employee_id: item.employee_id,
            general_bill_ids: item.general_bill_ids
          }).then(res => ({ ...item, res: res })))
        )
        console.log('response.................', response)
        for (let i = 0; i < response.length; i++) {
          const v = response[i].res.data
          console.log('.............v', v)
          const { error_code, data, error_msg } = v
          if (error_code === 1) {
            this.data_notify.push({ status: 0, Success: false, ...response[i], description: error_msg })
          } else {
            for (let j = 0; j < data.list_res.length; j++) {
              const dt = data.list_res[j]
              if (dt.Success) {
                this.data_notify.push({ status: 1, Success: true, ...response[i], description: 'Xuất chứng từ thành công !!!' })
              } else {
                this.data_notify.push({ status: 0, Success: false, ...response[i], description: dt?.ErrorMessage })
              }
            }
          }
        }
        console.log('data_notify...............', this.data_notify)
        // const data_success = data_notify.filter(t => t.Success)
        // if (data_success.length > 0) {
        await orderInvoiceResource.changeStatusExportVoucher({ list_code_payment: this.data_notify, order_id: null })
        this.isShowDialogNotify = true
        // }
      })
    },
    handleCLoseDialogNotify() {
      this.isShowDialogNotify = false
      this.data_notify = []
      this.onGetList()
    },
    handleRedirectBill(code) {
      this.$router.push({
        path: '/booking/bill-by-statistic',
        query: { code_key: code }
      })
    },
    onSearchAgency() {
      agencyResource.lists({
        limit: 1000,
        page: 1
      }).then(res => {
        if (res.error_code === 0) {
          const result = res.data.data
          console.log('result............', result)
          if (result.length > 0) {
            this.agencies = result.map(value => {
              return { value: value.id, label: value.name }
            })
            this.agencies.unshift({ value: -1, label: 'Tất cả' })
          } else {
            this.agencies = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onGetList() {
      this.loadingTable = true
      const request = { ...this.query }
      if (isEmpty(request.status) || request.status === -1) {
        delete request.status
      }
      if (isEmpty(request.status_payment) || request.status_payment === -1) {
        delete request.status_payment
      }
      if (isEmpty(request.agency) || request.agency === 'Tất cả') {
        delete request.agency
      }
      orderInvoiceResource.listOrder(request).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      const current_route = this.$router.history.current
      if (!isEmpty(current_route.query)) {
        const domain = window.location.origin
        window.location.href = `${domain}/#${current_route.path}`
      }
      this.data_notify = []
      this.query = Object.assign({}, { page: 1, limit: 10, status: -1, status_payment: -1, agency: 'Tất cả' })
      this.dateRange = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleAdd() {
      this.isAdd = true
      this.showDialogCreateOrder = true
      this.objectDataCreateOrder = {}
    },
    onShowDetail(row) {
      this.isAdd = false
      this.showDialogCreateOrder = true
      this.objectDataCreateOrder = { ...row }
      // this.showDialogDetailOrder = true
      // this.objectDataDetailOrder = { ...row }
    },
    onCancelOrder(row) {
      this.postForm.id = row.id
      this.showDialogCancel = true
    },
    handleDownload() {
      this.loadingExportExcel = true
      const body = Object.assign({}, this.query)
      delete body.limit
      delete body.page
      if (isEmpty(body.status) || body.status === -1) {
        delete body.status
      }
      if (isEmpty(body.status_payment) || body.status_payment === -1) {
        delete body.status_payment
      }
      if (isEmpty(body.agency) || body.agency === 'Tất cả') {
        delete body.agency
      }
      orderInvoiceResource.exportExcel(body).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.dataExcel = data.data
          // const arr = []
          this.dataExcel.map((result, i) => {
            result.index = i + 1
            let user_create_name = ''
            let type = 'App'
            if (result.user_create) {
              user_create_name = `${result.user_create.fullname} - vID${result.user_create_id}`
            }
            if (result.admin) {
              const admin_name = result.admin.name
              user_create_name = admin_name
              type = 'CMS'
            }
            result.user_create_name = user_create_name
            result.type = type
            if (result.service) {
              let service_name = ''
              for (const service of result.service.split(',')) {
                service_name += `${this.convertName(+service)?.label}, `
              }
              result.service_name = service_name.slice(0, -2)
            }
            if (result.created_at) {
              result.created_at_new = this.convertDateTime(result.created_at)
            }
            result.status_new = result.status === 1 ? 'Đã xuất chứng từ' : (result.status === 2 ? 'Đã hủy' : 'Đã khởi tạo')
            result.status_payment_new = result.status_payment === 1 ? 'Đã thanh toán' : (result.status_payment === 0 ? 'Chưa thanh toán' : '')
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['STT', 'Mã bill', 'Mã thanh toán', 'Tên khách hàng', 'Mã số thuế', 'Tên đơn vị', 'Email', 'Dịch vụ', 'Tổng tiền', 'Đại lý', 'Trạng thái thanh toán', 'Ghi chú', 'Ngày tạo', 'Tình trạng', 'Người tạo', 'Nguồn tạo']
            const filterVal = ['index', 'bill_code', 'payment_code', 'customer_name', 'tax_code', 'unit_name', 'receiver_email', 'service_name', 'total_money', 'agency', 'status_payment_new', 'note', 'created_at_new', 'status_new', 'user_create_name', 'type']
            let data = this.dataExcel

            data = this.formatJson(filterVal, data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'danh sach order xuat hoa don'
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
    confirmCancelOrder() {
      this.postForm.status = 2
      if (!this.postForm.cancellation_reason) {
        this.$message.warning('Bạn phải nhập lý do !!!')
        return
      }
      this.loadingSubmitCancelOrder = true
      orderInvoiceResource.cancelOrder(this.postForm).then(async(res) => {
        if (+res.error_code === 0) {
          this.$message.success('Hủy thành công !!!')
          this.postForm = {}
          this.showDialogCancel = false
          this.onGetList()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmitCancelOrder = false
      })
    },
    async handleExportVoucher(row) {
      this.$confirm(`Bạn có chắc chắn muốn xuất chứng từ mã thanh toán ${row.payment_code}`).then(async _ => {
        this.loadingSubmitExportVoucher = true
        this.postForm.tax_code = row.tax_code
        this.postForm.employee_id = getAcountInfo().id
        this.postForm.general_bill_ids = [row.payment_code_id]
        const { error_code, data, error_msg } = await bookingPaxResource.createMiSaVoucher(this.postForm)
        if (error_code === 0) {
          if (data?.data?.list_res?.length > 0) {
            const data1 = await orderInvoiceResource.changeStatusExportVoucher({ status: data?.data?.list_res[0]?.Success ? 1 : 0, order_id: row.id })
            if (data1.error_code === 0) {
              this.$message.success('Xuất chứng từ thành công')
              this.postForm = {}
              this.onGetList()
            } else {
              this.$message.error(data1?.error_msg)
            }
          } else {
            this.$message.error(data?.data?.list_res[0]?.ErrorMessage || 'Xuất chứng từ thất bại')
            this.postForm = {}
            this.onGetList()
          }
        } else {
          this.$message.error(error_msg)
          this.loadingSubmitExportVoucher = false
        }
        this.loadingSubmitExportVoucher = false
      })
    },
    handleClose() {
      this.showDialogCreateOrder = false
      this.showDialogDetailOrder = false
      this.showDialogCancel = false
      this.multipleSelection = []
      this.data_notify = []
      this.onGetList()
    },
    convertName(number) {
      switch (number) {
        case 1:
          return {
            color: '#0075FF',
            label: 'Booking'
          }
        case 2:
          return {
            color: '#FF910F',
            label: 'Hio'
          }
        case 3:
          return {
            color: '#1A970F',
            label: 'Shop'
          }
        case 4:
          return {
            color: '#7A1BF3',
            label: 'DV khác'
          }
        default:
          return {
            color: '#0075FF',
            label: 'Booking'
          }
      }
    },
    formatNumber,
    convertDateTime
  }
}
</script>

<style scoped lang="scss">
  .clearfix-20 {
    height: 20px;
    clear: both;
  }
  .title_search {
    font-size: 14px;
    margin-left: 10px ;
  }
  .group-button {
    display: flex;
    justify-content: space-between;
  }
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
  .button-action{
    margin: 2px !important;
  }
  @media screen and (min-width: 0px) and (max-width: 600px) {
    .group-button {
      flex-direction: column;
    }
  }
</style>
