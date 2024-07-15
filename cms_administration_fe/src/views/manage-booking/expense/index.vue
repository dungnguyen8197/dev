<template>
  <el-row class="app-container list-expense">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
        <el-row class="list-expense__header">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <el-row class="title-header">
                <el-col :span="12">
                  <h4>Quản lý chi</h4>
                </el-col>
                <el-col :span="12" align="right">
                  <el-button type="primary" @click="handleCreateCode">Tạo code chi</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <label>Mã booking</label>
                    <el-input
                      v-model="listQuery.code_booking"
                      size="small"
                      placeholder="Nhập mã booking"
                      style="width: 100%"
                    />
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <label>Mã Bill tổng</label>
                    <el-select
                      ref="SearchBill"
                      v-model="listQuery.id_general_bill_detail"
                      class="w-100"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      placeholder="Tìm kiếm mã Bill"
                      :remote-method="onSearchBill"
                      @hook:mounted="(value) => cancelReadOnly(value, 'SearchBill')"
                      @visible-change="(value) => cancelReadOnly(value, 'SearchBill')"
                    >
                      <el-option v-for="item in billSearch" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <label>vID Khách hàng</label>
                    <search-user size="small" @selection-changed-user="changeUser" />
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <label>Code chi</label>
                    <el-input
                      v-model="listQuery.code_payment"
                      size="small"
                      placeholder="Nhập code chi"
                      style="width: 100%"
                    />
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <label>Tên NCC</label>
                    <el-select
                      ref="SearchSupplier"
                      v-model="listQuery.supplier_id"
                      size="small"
                      style="width: 100%"
                      filterable
                      remote
                      reserve-keyword
                      clearable
                      placeholder="Tìm kiếm NCC"
                      :remote-method="onSearchSupplier"
                      :loading="loadingSearchSupplier"
                      @hook:mounted="(value) => cancelReadOnly(value, 'SearchSupplier')"
                      @visible-change="(value) => cancelReadOnly(value, 'SearchSupplier')"
                    >
                      <el-option
                        v-for="Supplier in suppliers"
                        :key="Supplier.id"
                        :label="Supplier.name"
                        :value="Supplier.id"
                      />
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <label>Thanh toán NCC</label>
                    <el-select
                      v-model="listQuery.type_purchase"
                      size="small"
                      clearable
                      placeholder="Chọn thanh toán NCC"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="purchase_s in purchaseSupplier"
                        :key="purchase_s.key"
                        :label="purchase_s.name"
                        :value="purchase_s.key"
                      />
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <label>Thời gian đánh</label>
                    <el-date-picker
                      v-model="value1"
                      clearable
                      label="Thời gian đánh"
                      size="small"
                      style="width: 100%"
                      type="daterange"
                      range-separator="To"
                      format="dd-MM-yyyy HH:mm:ss"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      :default-time="['00:00:00', '23:59:00']"
                    />
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <label>Hình thức thanh toán NCC</label>
                    <el-select
                      v-model="listQuery.type_purchase_supplier"
                      size="small"
                      clearable
                      placeholder="Chọn thanh toán NCC"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="purchase in purchases"
                        :key="purchase.key"
                        :label="purchase.name"
                        :value="purchase.key"
                      />
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <label>Admin</label>
                    <el-select
                      ref="SearchAdmin"
                      v-model="listQuery.admin"
                      size="small"
                      style="width: 100%"
                      filterable
                      multiple
                      remote
                      reserve-keyword
                      clearable
                      placeholder="Chọn admin"
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
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <label style="width: 100%; margin-bottom: 1.6rem" />
                    <el-button size="small" type="primary" @click="requestExpenseList">Tìm kiếm</el-button>
                    <el-button size="small" @click="onRefresh">Refresh</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      icon="el-icon-download"
                      :loading="loadingExportExcel"
                      @click="handleDownload"
                    >
                      Export excel
                    </el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row style="border-bottom: 1px solid #dddddd; border-top: 1px solid #dddddd" class="p-10">
                <div class="text-center">
                  <h4>{{ `Tổng giá trị booking NCC: ${formatNumber(total_money)}` }}</h4>
                </div>
                <el-col :span="12" class="text-center">
                  <h6>{{ `Tổng giá trị booking đã thanh toán: ${formatNumber(total_money_purchase)}` }}</h6>
                </el-col>
                <el-col :span="12" class="text-center">
                  <h6>{{ `Tổng giá trị booking chưa thanh toán: ${formatNumber(total_money_no_purchase)}` }}</h6>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row class="list-expense__data" style="overflow-x: auto">
          <el-col :span="24">
            <table v-loading="loadingTable">
              <thead>
                <th style="width: 50px" class="th-table-expense">STT</th>
                <th class="th-table-expense">Sân</th>
                <th class="th-table-expense">Golfer</th>
                <th class="th-table-expense">Code booking</th>
                <th class="th-table-expense">Mã giảm giá</th>
                <th class="th-table-expense">Người đặt</th>
                <th class="th-table-expense">Nguồn</th>
                <th class="th-table-expense">Admin</th>
                <th class="th-table-expense">Giá(VND)</th>
                <th class="th-table-expense">Giá doanh thu(VND)</th>
                <th class="th-table-expense">Phụ thu cố định</th>
                <th class="th-table-expense">Giá gốc(VND)</th>
                <th class="th-table-expense">Ngày đánh</th>
                <th class="th-table-expense">Ngày đặt</th>
                <th class="th-table-expense">HIO</th>
                <th class="th-table-expense">Trạng thái</th>
                <th style="width: 7%" class="th-table-expense">Nhà cung cấp</th>
                <th class="th-table-expense">Note</th>
                <th class="th-table-expense">Giá nhập phụ phí</th>
                <th class="th-table-expense">Doanh Thu Phụ Phí</th>
                <th class="th-table-expense">Hạng mục</th>
                <th class="th-table-expense">Đại lý</th>
                <th class="th-table-expense">Số lượng khách</th>
                <th class="th-table-expense">CCCD / Passport</th>
                <th class="th-table-expense">Code Payment</th>
                <th class="th-table-expense">Đối chiếu</th>
                <th class="th-table-expense">Xác nhận TT</th>
                <th class="th-table-expense">Code chi</th>
                <th class="th-table-expense">TT Xác nhận Booking</th>
              </thead>
              <tbody>
                <template v-for="(data, index) in tableData">
                  <template v-for="(booked, keyBooked) in data.booked">
                    <tr :key="booked.id" :class="{'delay': data.delay_date != 0}">
                      <td
                        v-if="keyBooked === 0"
                        style="width: 50px"
                        class="td-table-expense"
                        :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length + data.billOutsidePayment.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                      >
                        {{ index + 1 }}
                      </td>
                      <td
                        v-if="keyBooked === 0"
                        class="td-table-expense"
                        :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length + data.billOutsidePayment.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                      >
                        {{ data.facility ? data.facility.sub_title : '' }}
                      </td>
                      <td class="td-table-expense">
                        <p>{{
                          (booked.user_id > 0) ? (booked.golfer !== null ? `VID${booked.user_id} - ${booked.golfer.fullname}` : booked.name_out_system) : booked.name_out_system
                        }}</p>
                      </td>
                      <td class="td-table-expense">{{ booked.code_booking }}</td>
                      <td class="td-table-expense">
                        <p v-if="booked.promotion_code_id">{{ booked.promotional ? booked.promotional.code : '' }}</p>
                      </td>
                      <td class="td-table-expense">
                        {{ booked.host_user_id !== null ? `VID` + booked.host_user_id : '' }}
                      </td>
                      <td class="td-table-expense">{{ booked.source === 1 ? 'APP' : 'CMS' }}</td>
                      <td class="td-table-expense">{{ booked.cms_admin ? booked.cms_admin.name : '' }}</td>
                      <td class="td-table-expense">{{ formatNumber(booked.price_booking) }}</td>
                      <td class="td-table-expense">{{ formatNumber(data.revenue_price) }}</td>
                      <td class="td-table-expense" />
                      <td class="td-table-expense">{{ formatNumber(sourcePrice(data)) }}</td>
                      <td class="td-table-expense">{{ convertDateTimeString(booked.date_played) }}</td>
                      <td class="td-table-expense">{{ convertDateTimeString(booked.created_at) }}</td>
                      <td class="td-table-expense">
                        <p v-if="data.insurance && booked.user_id != 1">
                          {{ `${data.insurance.options_money_id === 1 ? 'D100' : 'D200'} - BH${data.insurance.id}` }}</p>
                        <p v-if="data.insurance20 && booked.user_id != 1">{{ `D20 - BH${data.insurance20.id}` }}</p>
                      </td>
                      <td class="td-table-expense">
                        <el-tag :type="booked.type_purchase !== 0 ? 'success' : 'danger'">
                          {{ booked.type_purchase !== 0 ? typePurchase(booked.type_purchase) : 'Chưa thanh toán' }}
                        </el-tag>
                      </td>
                      <td class="td-table-expense">
                        {{ data.supplier ? data.supplier.name : '' }}
                      </td>
                      <td class="td-table-expense">{{ data.note }}</td>
                      <td class="td-table-expense">{{ formatNumber(booked.surcharge_entry_price) }}</td>
                      <td class="td-table-expense">{{ booked.surcharge_revenue }}</td>
                      <template>
                        <td class="td-table-expense">{{ data.category_name }}</td>
                      <!--                        <td v-else>123123</td>-->
                      </template>

                      <td class="td-table-expense">{{ booked.agency_name ? booked.agency_name : 'Khách lẻ' }}</td>
                      <td class="td-table-expense">{{ booked.quantity_guest }}</td>
                      <td class="td-table-expense">
                        <div v-for="pass in booked.user_passport" :key="pass.id">{{ pass ? pass.passport : '' }}</div>
                      </td>
                      <template>
                        <td
                          v-if="keyBooked === 0"
                          class="td-table-expense"
                          :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                        >
                          <div v-for="payment in data.code_payment" :key="payment.code_payment">
                            {{ payment.code_payment }}
                          </div>
                        </td>
                      </template>
                      <template>
                        <td
                          v-if="keyBooked === 0"
                          class="td-table-expense"
                          :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length + data.billOutsidePayment.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                        >
                          <el-button
                            v-if="data.is_inventory === 0"
                            size="small"
                            type="primary"
                            style="margin-bottom: 5px"
                            @click="handleInventory(data)"
                          > Đối chiếu </el-button>
                          <el-tag v-if="data.is_inventory !== 0" style="margin-bottom: 5px" type="success"> Đã đối chiếu</el-tag>
                          <el-button size="small" type="primary" @click="handleInputPrice(data)">Giá nhập phụ phí</el-button>
                        </td>
                      </template>
                      <td
                        v-if="keyBooked === 0"
                        :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                        class="td-table-expense"
                      >
                        <el-button v-if="data.is_purchase_supplier === 0" size="small" type="primary" @click="comfirmTT(data)">XNTT
                        </el-button>
                        <el-tag v-if="data.is_purchase_supplier !== 0" type="success">Hoàn thành</el-tag>
                      </td>
                      <template>
                        <td
                          v-if="keyBooked === 0"
                          :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length + data.billOutsidePayment.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                          style="width: 150px"
                          class="td-table-expense"
                        >
                          <!-- <div v-for="payment in data.codePaymentExpense" :key="payment.id"> -->
                          {{ data.code_expense }}
                          <!-- </div> -->
                        </td>
                      </template>
                      <td
                        v-if="keyBooked === 0"
                        :rowspan="keyBooked === 0 && data.billOutsidePayment.length > 0 ? (data.booked.length + data.billOutsidePayment.length) : (keyBooked === 0 && data.billOutsidePayment.length == 0 ? data.booked.length : '')"
                        class="td-table-expense"
                      >
                        <el-tag :type="data.status === 6 ? 'success' : 'danger'">
                          {{ data.status === 6 ? 'Đã xác nhận' : 'Chưa xác nhận' }}
                        </el-tag>
                      </td>
                    </tr>
                  </template>
                  <template v-if="data.billOutsidePayment.length > 0">
                    <template v-for="(bill) in data.billOutsidePayment">
                      <tr :key="bill.code_booking">
                        <td class="td-table-expense">Phụ phí ngoài</td>
                        <td class="td-table-expense">{{ bill.code_booking }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense">{{ JSON.parse(bill.product_info).product_name }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense">{{ data.booked[0].cms_admin ? data.booked[0].cms_admin.name : '' }}</td>
                        <td class="td-table-expense">{{ formatNumber(bill.real_payment) }}</td>
                        <td class="td-table-expense">{{ formatNumber(bill.real_payment) }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense">{{ formatNumber(bill.original_amount) }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense">{{ formatDate(bill?.created_at) }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense">
                          <el-tag :type="bill.status === 1 ? 'success' : 'danger'">
                            {{ typePurchaseBill(bill.status) }}
                          </el-tag>
                        </td>
                        <td class="td-table-expense">{{ JSON.parse(bill.product_info)?.supplier_name }}</td>
                        <td class="td-table-expense">{{ bill.note }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense" />
                        <td class="td-table-expense" />
                        <td class="td-table-expense" />
                        <td class="td-table-expense">{{ JSON.parse(bill.product_info)?.quantity }}</td>
                        <td class="td-table-expense" />
                        <td class="td-table-expense">{{ bill.code_payment }}</td>
                        <td class="td-table-expense">{{ +bill.confirm_payment_supplier === 1 ? "Xác nhận thanh toán NCC" : "Chưa xác nhận thanh toán NCC" }}</td>
                      </tr>
                    </template>
                  </template>

                </template>
              </tbody>
            </table>
          </el-col>
        </el-row>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > listQuery.limit"
            :total="total"
            :limit.sync="listQuery.limit"
            :page.sync="listQuery.page"
            @pagination="requestExpenseList"
          />
        </el-row>
        <dialog-create-code :show-dialog="showDialogCreate" @clickButtonDialog="handleButtonDialogCreate" />
        <dialog-input-price
          :show-dialog="showPriceInput"
          :object-data="objectData"
          @clickButtonDialogInput="handleButtonDialogInput"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { formatNumber, convertDateTimeString, formatDate } from '@/utils/convert'
import Pagination from '@/components/Pagination/index.vue'
import DialogCreateCode from '@/views/manage-booking/expense/compoment/DialogCreateCode.vue'
import DialogInputPrice from '@/views/manage-booking/expense/compoment/DialogInputPrice.vue'
import { typePurchase, typePurchaseBill } from '@/utils/status'
import ExpenseResource from '@/api/manage-booking/expense'
import SearchResource from '@/api/search-api'
import { getAcountInfo } from '@/utils/auth'
import SearchUser from '@/views/component/SearchUser.vue'
import BookingPaxResource from '@/api/BookingPax'
import { numberFormatter } from '@/filters'

const bookingPaxResource = new BookingPaxResource()
const expenseResource = new ExpenseResource()
const searchResource = new SearchResource()
export default {
  name: 'List',
  components: { SearchUser, Pagination, DialogCreateCode, DialogInputPrice },
  data() {
    return {
      listQuery: { page: 1, limit: 10 },
      loadingTable: false,
      tableData: [],
      admins: [],
      suppliers: [],
      loadingSearchAdmin: false,
      from: 0,
      source_price: 0,
      loadingSearchSupplier: false,
      value1: '',
      purchaseSupplier: [
        { key: 0, name: 'Chưa thanh toán NCC' },
        { key: 1, name: 'Đã thanh toán NCC' }
      ],
      purchases: [
        { key: 0, name: 'TT theo ngày' },
        { key: 1, name: 'TT theo tuần' },
        { key: 2, name: 'TT theo tháng' }
      ],
      total: 0,
      total_money: 0,
      total_money_no_purchase: 0,
      total_money_purchase: 0,
      showDialogCreate: false,
      showPriceInput: false,
      objectData: {},
      loadingExportExcel: false,
      billSearch: []
    }
  },
  watch: {
    value1(val) {
      if (val) {
        console.log('val...................', val)
        let start = val[0]
        let end = val[1]
        start = (new Date(start)).getTime()
        end = (new Date(end)).getTime()
        console.log('....................thoi gian', start, end)
        this.from_date = start
        this.to_date = end
        this.listQuery.page = 1
        this.listQuery.start_date = this.from_date / 1000
        this.listQuery.end_date = this.to_date / 1000
        this.requestExpenseList()
      }
    }
  },
  created() {
    console.log('admin.......................', getAcountInfo())
    this.requestExpenseList()
  },
  methods: {
    formatDate,
    numberFormatter,
    async handleDownload() {
      this.listQuery.agency_name = this.agencySelect?.id ?? ''
      this.loadingExportExcel = true
      const params = Object.keys(this.listQuery).map(key => {
        return `${key}=${this.listQuery[key]}`
      }).join('&')
      await expenseResource.downloadExcel(params).then(res => {
        console.log('res...............', res)
        this.loadingTable = false
        const link = document.createElement('a')
        // nếu trong link trả về không có http hoặc https thì thêm vào
        link.href = res.data.link.includes('http') ? res.data.link : 'http://' + res.data.link
        link.download = 'expense.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.loadingExportExcel = false
      }).catch(err => {
        this.$message.error(err?.error_code || 'Có lỗi xảy ra')
      })
      this.loadingExportExcel = false
    },
    onRefresh() {
      this.listQuery = Object.assign({}, { page: 1, limit: 10 })
      this.requestExpenseList()
    },
    handleCreateCode() {
      this.showDialogCreate = true
    },
    handleButtonDialogCreate(object) {
      const { dialog, reload } = object
      this.showDialogCreate = dialog
      if (reload) {
        this.requestExpenseList()
      }
    },
    handleInventory(data) {
      const body = {
        pax_id: data.id,
        type: 1
      }
      this.$confirm('Bạn có chắc muốn xác nhận đối chiếu cho teetime này?').then(_ => {
        expenseResource.confirmExpense(body).then(res => {
          const { error_code, error_msg } = res
          if (error_code === 0) {
            this.$message.success(error_msg)
            this.requestExpenseList()
          } else {
            this.$message.error(error_msg)
          }
        })
      })
    },
    comfirmTT(data) {
      const body = {
        pax_id: data.id,
        type: 0
      }
      this.$confirm('Bạn có chắc muốn xác nhận thanh toán cho teetime này?').then(_ => {
        expenseResource.confirmExpense(body).then(res => {
          const { error_code, error_msg } = res
          if (error_code === 0) {
            this.$message.success(error_msg)
            this.requestExpenseList()
          } else {
            this.$message.error(error_msg)
          }
        })
      })
    },
    handleInputPrice(data) {
      this.objectData = data
      this.showPriceInput = true
    },
    handleButtonDialogInput(object) {
      const { dialog, reload } = object
      this.showPriceInput = dialog
      if (reload) {
        this.requestExpenseList()
      }
    },
    sourcePrice(d) {
      if (d.number_hole === 9) {
        return d.source_price_9
      } else if (d.number_hole === 18) {
        return d.source_price_18
      } else if (d.number_hole === 27) {
        return d.source_price_27
      } else {
        return d.source_price_18
      }
    },
    onSearchSupplier(keyword) {
      this.loadingSearchSupplier = true
      searchResource.searchSupplier({ keyword_supplier: keyword.trim() }).then(res => {
        this.loadingSearchSupplier = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.suppliers = data
        }
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
    requestExpenseList() {
      this.loadingTable = true
      console.log(this.listQuery)
      console.log('listQuery...........................', this.listQuery)
      expenseResource.expenseList(this.listQuery).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
          this.total_money = data.total_money
          this.total_money_purchase = data.total_money_purchase
          this.total_money_no_purchase = data.total_money_no_purchase
        }
      })
    },
    changeUser(val) {
      console.log('val', val)
      this.listQuery.user_id = val.value
    },
    onSearchBill(keyword) {
      this.loadingSearchUser = true
      this.billSearch = []
      bookingPaxResource.listBill({ limit: 10, page: 1, code_key: keyword }).then(res => {
        console.log('res.............................bookingPaxResource', res)
        if (res.error_code === 0) {
          this.billSearch = res?.data?.bill?.bill_list.map(item => {
            return {
              value: item.general_bill_id,
              label: item.code
            }
          })

          console.log('this.bills.............................', this.billSearch)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchUser = false
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
    convertDateTimeString,
    typePurchase,
    typePurchaseBill
  }
}
</script>

<style scoped>
td, th {
  border: 1px solid #dddddd;
  text-align: center;
}

.list-expense__header .grid-content {
  margin-bottom: 10px;
}

.list-expense__header {
  margin-bottom: 20px;
}

.list-expense {
  font-family: Sans-serif;
}

.th-table-expense, .td-table-expense {
  padding: 10px;
}

.delay {
  background-color: rgba(255, 85, 0, 0.12) !important;
}

p, p span {
  font-size: 12px !important;
}

span, label, th {
  font-size: 12px !important;
}

p, p span {
  font-size: 12px !important;
}

span, label, th, td {
  font-size: 12px !important;
}
</style>
