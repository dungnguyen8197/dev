<template>
  <div>
    <el-dialog class="dialog-statistic-bill" :visible.sync="showDialog" :show-close="false" :before-close="handleClose" width="80%">
      <el-row>
        <el-row style="display: flex;">
          <el-col>
            <h4 style="margin: 0; width: 100%; font-weight: 700; color: #0A1F8F;">{{ dialog.titleName }}</h4>
          </el-col>
          <el-col v-if="!isAdd" class="mb-10">
            <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleShowHistoryLog">
              Lịch sử
            </el-button>
          </el-col>
        </el-row>
        <div class="clearfix-20" />
        <div class="clearfix-20" />
        <el-form ref="ruleForm" :model="postForm" :rules="rules">
          <p style="font-size: 18px !important; color: #0A1F8F;">I. Thông tin chung</p>
          <div class="clearfix-20" />
          <el-row class="row-order-invoice ">
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="payment_code" label="Mã thanh toán" required>
                  <el-select
                    ref="SearchPaymentCode"
                    v-model="postForm.payment_code"
                    size="small"
                    style="width: 100%"
                    filterable
                    :disabled="!isAdd"
                    remote
                    reserve-keyword
                    clearable
                    placeholder="Nhập mã thanh toán"
                    :remote-method="onSearchPaymentCode"
                    :loading="loadingSearchPaymentCode"
                    @visible-change="(value) => cancelReadOnly(value, 'SearchPaymentCode')"
                  >
                    <!-- @hook:mounted="(value) => cancelReadOnly(value, 'SearchPaymentCode')" -->
                    <el-option
                      v-for="code in list_payment_code"
                      :key="code.general_bill_id"
                      :label="code.code"
                      :value="code.code"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Mã bill" required>
                  <el-input v-model="postForm.bill_code" disabled placeholder="Nhập mã bill" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Đại lý">
                  <el-input v-model="postForm.agency" disabled placeholder="Đại lý" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Tình trạng thanh toán">
                  <el-input v-model="postForm.status_payment_label" disabled placeholder="Tình trạng thanh toán" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col v-if="!isAdd" class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Ngày tạo">
                  <el-input v-model="postForm.created_at" disabled placeholder="" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col v-if="!isAdd" class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Tình trạng">
                  <el-input v-model="postForm.status_name" disabled placeholder="" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col v-if="!isAdd && postForm.status == 2" class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Lý do">
                  <el-input v-model="postForm.cancellation_reason" disabled placeholder="" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="tax_code" label="Mã số thuế" required>
                  <el-select
                    ref="searchPaxCode"
                    v-model="postForm.tax_code"
                    style="width: 100%"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder="Nhập mã số thuế"
                    :remote-method="onSearchPaxCode"
                    :loading="loadingSearchPaxCode"
                    @change="handleTaxCode"
                    @hook:mounted="(value) => cancelReadOnly(value, 'searchPaxCode')"
                    @visible-change="(value) => cancelReadOnly(value, 'searchPaxCode')"
                  >
                    <el-option
                      v-for="(pax,index) in list_tax_code"
                      :key="index"
                      :label="'Mã thuế: ' + pax.taxCode"
                      :value="pax.taxCode"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="customer_name" label="Họ tên người mua hàng" required>
                  <el-input v-model="postForm.customer_name" placeholder="Họ tên người mua hàng" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="unit_name" label="Tên đơn vị" required>
                  <el-input v-model="postForm.unit_name" size="small" placeholder="Nhập tên doanh nghiệp" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="address" label="Địa chỉ" required>
                  <el-input v-model="postForm.address" placeholder="Nhập địa chỉ" size="small" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div class="line">
            <hr>
          </div>
          <p style="font-size: 18px !important; color: #0A1F8F;">II. Thông tin người nhận chứng từ</p>
          <div class="clearfix-20" />
          <el-row class="row-order-invoice ">
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="receiver_email" label="Email nhận hóa đơn" required>
                  <el-input v-model="postForm.receiver_email" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="receiver_phone" label="SĐT">
                  <el-input v-model="postForm.receiver_phone" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <!-- <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="receiver_address" label="Địa chỉ" required>
                  <el-input v-model="postForm.receiver_address" size="small" />
                </el-form-item>
              </div>
            </el-col> -->
            <el-col class="col-top-statistic" :sm="24" :md="6">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="receiver_note" label="Ghi chú">
                  <el-input v-model="postForm.receiver_note" size="small" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div class="line">
            <hr>
          </div>

          <p style="font-size: 18px !important; color: #0A1F8F;">III. Thông tin hàng hóa dịch vụ</p>
          <div
            v-loading="loadingDialog"
            element-loading-text="Loading..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-row class="p-10 mb-10">
              <el-row class="data-table-content table-responsive">
                <table class="table table-bordered table_custom">
                  <thead style="background-color: #C4C4C4; color: #000; font-weight: 700; height: 20px !important;">
                    <tr>
                      <th scope="col" class="text-center" style="min-width: 50px">STT</th>
                      <th class="text-center vertical-middle" style="min-width: 180px">Tên dịch vụ</th>
                      <th scope="col" class="text-center" style="min-width: 150px">Teetime</th>
                      <th scope="col" class="text-center" style="min-width: 150px">Code</th>
                      <th scope="col" class="text-center " style="min-width: 250px">Tên sân</th>
                      <th scope="col" class="text-center " style="min-width: 100px">Đơn vị tính</th>
                      <th scope="col" class="text-center " style="min-width: 150px">Giá bán</th>
                      <th scope="col" class="text-center" style="min-width: 150px">Số lượng</th>
                      <th scope="col" class="text-center" style="min-width: 150px">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="listService.length > 0">
                      <tr v-for="(service, key_service) in listService" :key="key_service">
                        <td class="text-center">{{ key_service + 1 }}</td>
                        <td class="text-center">{{ service.service_name }}</td>
                        <td class="text-center">{{ service.tee_time }}</td>
                        <td class="text-center">{{ service.code }}</td>
                        <td class="text-center">{{ service.facility_name }}</td>
                        <td class="text-center">{{ service.unit }}</td>
                        <td class="text-center">{{ service.price ? formatNumber(service.price) : 0 }}</td>
                        <td class="text-center">{{ service.quantity }}</td>
                        <td class="text-center">{{ service.money ? formatNumber(service.money) : 0 }}</td>
                      </tr>
                    </template>

                    <tr v-else>
                      <td colspan="9" class="text-center">Chưa có dịch vụ đi kèm</td>
                    </tr>
                  </tbody>
                </table>
              </el-row>
            </el-row>
          </div>
          <div style="float: right; font-weight: 700; margin-right: 20px;">Tổng tiền thanh toán: {{ formatNumber(total_money) }}</div>
          <div class="clearfix-20" />
          <el-row class="p-10 border-1 mb-10">
            <span>Note nội bộ</span>
            <el-input
              v-model="postForm.note"
              rows="5"
              type="textarea"
              placeholder="Note hiển thị nội bộ"
            />
          </el-row>
          <el-form-item style="float: right;">
            <el-button class="px-30" type="info" @click="handleClose">Hủy</el-button>
            <el-button v-if="isAdd || postForm.status != 2" class="px-30" :disabled="!callDetailDone" type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
    <DialogHistoryLog
      :show-dialog="showDialogHistoryLog"
      :object-data="objectDataHistoryLog"
      :is-add="isAdd"
      append-to-body
      @onCloseDialog="handleCloseHistoryLog"
    />
  </div>
</template>

<script>
import { convertDateTime, formatNumber } from '@/utils/convert'
import { validateText, validateEmail } from '@/utils/validate'
import BookingPaxResource from '@/api/BookingPax'
import moment from 'moment'
import { isEmpty } from '@/utils/validate'
import { NAME_PROVIDER } from '@/utils/constant'
import DialogHistoryLog from './DialogHistoryLog.vue'
import OrderInvoiceResource from '@/api/order-invoice/order-invoice'

const bookingPaxResource = new BookingPaxResource()
const orderInvoiceResource = new OrderInvoiceResource()

export default {
  name: 'DialogCreateOrder',
  components: {
    DialogHistoryLog
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        payment_code: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.payment_code, callback, 'Mã thanh toán'), trigger: 'change' }],
        tax_code: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.tax_code, callback, 'Mã số thuế'), trigger: 'change' }],
        customer_name: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.customer_name, callback, 'Tên khách hàng'), trigger: 'change' }],
        address: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.address, callback, 'Địa chỉ'), trigger: 'change' }],
        unit_name: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.unit_name, callback, 'Tên đơn vị'), trigger: 'change' }],
        receiver_email: [{ validator: (rule, _, callback) => validateEmail(rule, this.postForm.receiver_email, callback, 'Email nhận hóa đơn'), trigger: 'change' }]
        // receiver_address: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.receiver_address, callback, 'Địa chỉ'), trigger: 'change' }]
      },
      list_payment_code: [],
      listService: [],
      loadingSearchPaymentCode: false,
      loadingSearchPaxCode: false,
      loadingDialog: false,
      loadingSubmit: false,
      total_money: 0,
      postForm: {
        payment_code: '',
        tax_code: '',
        customer_name: '',
        address: '',
        unit_name: '',
        receiver_email: '',
        receiver_address: ''
      },
      dialog: { titleName: 'TẠO YÊU CẦU XUẤT HÓA ĐƠN', buttonName: 'Lưu' },
      showDialogHistoryLog: false,
      objectDataHistoryLog: {},
      callDetailDone: true,
      list_tax_code: []
    }
  },
  watch: {
    objectData(value) {
      if (!isEmpty(value)) {
        this.postForm = { ...value, created_at: convertDateTime(value.created_at), status_name: value.status === 1 ? 'Đã xuất hóa đơn' : (value.status === 2 ? 'Đã hủy' : 'Đã khởi tạo') }
        this.onSearchPaymentCode(value.payment_code)
      }
    },
    'postForm.payment_code'(val) {
      if (!val) {
        delete this.postForm.bill_code
        this.listService = []
      }
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'TẠO YÊU CẦU XUẤT HÓA ĐƠN', buttonName: 'Lưu' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'THÔNG TIN YÊU CẦU XUẤT HÓA ĐƠN', buttonName: 'Xác nhận' })
      }
    }
  },
  methods: {
    async onSearchPaxCode(keyword) {
      this.loadingSearchPaxCode = true
      const body = { tax_code: keyword }
      bookingPaxResource.getDataCompanyByTaxCode(body).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.list_tax_code = res.data
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchPaxCode = false
      })
    },
    handleTaxCode(value) {
      if (value) {
        const pax = this.list_tax_code.find(item => item.taxCode === value)
        this.postForm.tax_code = pax.taxCode
        this.postForm.address = pax.address
        this.postForm.unit_name = pax.companyName
      }
    },
    onSearchPaymentCode(keyword) {
      this.loadingSearchPaymentCode = true
      this.callDetailDone = false
      setTimeout(() => {
        bookingPaxResource.listBillSearchArrayGB({ code_key: [keyword.trim()] }).then(res => {
          const { error_code, data } = res
          if (error_code === 0) {
            this.list_payment_code = data
            if (this.list_payment_code.length === 1) {
              this.postForm.payment_code_id = this.list_payment_code[0]?.general_bill_id
              this.postForm.bill_code = this.list_payment_code[0]?.parent?.bill_code || this.list_payment_code[0]?.bill_code
              this.postForm.bill_id = this.list_payment_code[0].parent_id > 0 ? this.list_payment_code[0].parent_id : this.list_payment_code[0].general_bill_id
              this.postForm.status_payment = this.list_payment_code[0]?.status === 1 ? 1 : 0
              this.postForm.status_payment_label = this.list_payment_code[0]?.status === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'
              this.listService = []
              const service = this.list_payment_code[0].data_provider.filter(item => item.is_cancel !== 1 && item.deleted_at !== 1)
              const booking_service = service.filter(item => item.name === NAME_PROVIDER.BOOKING || item.name === NAME_PROVIDER.BOOKING_MN || item.name === NAME_PROVIDER.BOOKING_MT)
              const hio_service = service.filter(item => item.name === NAME_PROVIDER.HIO)
              const other_service = service.filter(item => item.name === NAME_PROVIDER.BOOKING_OUTSIDE)
              const shop_service = service.filter(item => item.name === NAME_PROVIDER.SHOP)
              this.postForm.service = ''
              if (booking_service.length > 0) {
                this.postForm.service += '1,'
                this.listService = [
                  ...this.listService,
                  ...booking_service?.map((item, index) => (
                    {
                      id: index + this.listService.length + 1,
                      service_name: 'Đặt sân',
                      // service_name: 'vID' + item?.booked?.user_id + ' - ' + item?.booked?.name_out_system,
                      tee_time: this.list_payment_code[0]?.parent?.facility?.tee ? moment(this.list_payment_code[0]?.parent?.facility?.tee, 'HH:mm:ss, DD-MM-YYYY').format('HH:mm, DD/MM/YYYY') : '',
                      code: this.list_payment_code[0]?.key?.codeBooking,
                      facility_name: this.list_payment_code[0]?.key?.facility_name,
                      unit: 'Lượt',
                      price: item.payment_amount,
                      money: item.payment_amount,
                      quantity: 1,
                      provider: NAME_PROVIDER.BOOKING,
                      booked_id: item.data_transaction?.list_user_pay?.[0]?.id_booked,
                      user_id: item.data_transaction?.list_user_pay?.[0]?.user_id,
                      is_cancel: item.is_cancel
                    }
                  ))
                ]
              }
              if (hio_service.length > 0) {
                this.postForm.service += '2,'
                console.log('.......hio_service...', hio_service)
                this.listService = [
                  ...this.listService,
                  ...hio_service.map((item, index) => ({
                    id: index + this.listService.length + 1,
                    service_name: `Gói bảo hiểm`,
                    tee_time: '',
                    code: `BH${item.data_transaction?.id}`,
                    facility_name: item.data_transaction?.course_name,
                    unit: 'Gói',
                    price: item.payment_amount,
                    money: item.payment_amount,
                    provider: NAME_PROVIDER.HIO,
                    quantity: 1,
                    hio_id: item.data_transaction?.id,
                    transaction_provider_id: item.transaction_provider_id,
                    is_cancel: item.is_cancel
                  }
                  ))]
              }
              console.log('.......this.listService...', this.listService)
              if (booking_service.length > 0 || other_service.length > 0 || shop_service.length > 0) {
                if (shop_service.length > 0) {
                  this.postForm.service += '3,'
                }
                if (other_service.length > 0) {
                  this.postForm.service += '4,'
                }
                if (this.list_payment_code[0].parent_id > 0) {
                  this.onGetDetail(this.list_payment_code[0].parent_id)
                } else {
                  this.onGetDetail(this.list_payment_code[0].general_bill_id)
                }
              } else {
                this.total_money = this.sumaryMoney()
                this.callDetailDone = true
              }
              this.postForm.service = this.postForm.service.slice(0, -1)
            }
          }
        }).finally(() => {
          this.loadingSearchPaymentCode = false
        })
      }, 150)
    },
    sumaryMoney() {
      return this.listService.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.money),
        0
      )
    },
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          if (this.isAdd) this.handleSubmitAdd()
          else this.handleSubmitUpdate()
        }
      })
    },
    handleSubmitAdd() {
      console.log('postForm............', this.postForm)
      this.loadingSubmit = true
      this.postForm.total_money = this.total_money
      orderInvoiceResource.storeOrder(this.postForm).then(async(res) => {
        if (+res.error_code === 0) {
          this.$message.success('Thêm mới thành công !!!')
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    handleSubmitUpdate() {
      console.log('postForm............', this.postForm)
      this.loadingSubmit = true
      orderInvoiceResource.updateOrder(this.postForm, this.postForm.id).then(async(res) => {
        if (+res.error_code === 0) {
          this.$message.success('Cập nhật thành công !!!')
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async onGetDetail(id) {
      console.log('_________', this.listTypePurchaseChildService)
      this.loadingDialog = true
      bookingPaxResource.detailBill({ bill_id: id, all_service: true }).then(async(res) => {
        if (res.error_code === 0) {
          const data = res.data
          console.log('data.........', data)

          const service = data.service?.filter(item => item.is_cancel !== 1 && item.deleted_at !== 1 && this.list_payment_code[0]?.data_provider?.map(val => +val.transaction_provider_id)?.includes(+item.transaction_provider_id))
          const other_service = service?.filter(item => item.id === -1)
          // const hio_service = service.filter(item => item.id === 2)
          const shop_service = service?.filter(item => item.id === 1)
          const data_booking_in_code = data.golfers?.filter(item => !(+item.id === -1 && !item.name) && this.list_payment_code[0]?.data_provider?.map(val => +val.transaction_provider_id)?.includes(+item.transaction_provider_id))
          const booking_agency = data_booking_in_code?.filter(t => t.agency_name).map(v => v.agency_name)
          if (booking_agency.length > 0) {
            this.postForm.agency = [...new Set(booking_agency)].join(', ')
          }
          // if (data.golfers.length > 0 && data.pax_id > 0) {
          //   const new_data = data.golfers?.filter(item => !(+item.id === -1 && !item.name) && this.list_payment_code[0].data_provider.map(val => +val.transaction_provider_id).includes(+item.transaction_provider_id))
          //   this.listService = [
          //     ...this.listService,
          //     ...new_data?.map((item, index) => (
          //       {
          //         id: index + this.listService.length + 1,
          //         service_name: 'Đặt sân',
          //         // service_name: 'vID' + item?.booked?.user_id + ' - ' + item?.booked?.name_out_system,
          //         tee_time: data.pax?.date_played ? moment(data.pax.date_played).format('HH:mm, DD/MM/YYYY') : '',
          //         code: item.booked?.code_booking,
          //         facility_name: data.pax?.facility?.sub_title,
          //         unit: 'Lượt',
          //         price: item.booked?.price_booking,
          //         money: item.booked?.price_booking,
          //         quantity: 1,
          //         provider: NAME_PROVIDER.BOOKING,
          //         booked_id: item.booked?.id,
          //         user_id: item.booked?.user_id,
          //         is_cancel: item.is_cancel
          //       }
          //     ))
          //   ]
          // }
          // if (hio_service.length > 0) {
          //   console.log('.......hio_service...', hio_service)
          //   this.listService = [
          //     ...this.listService,
          //     ...hio_service.map((item, index) => ({
          //       ...item.hio_info,
          //       id: index + this.listService.length + 1,
          //       service_name: `Gói bảo hiểm`,
          //       tee_time: '',
          //       code: `BH${item.hio_id}`,
          //       facility_name: '',
          //       unit: 'Gói',
          //       price: item.amount,
          //       money: item.amount,
          //       provider: NAME_PROVIDER.HIO,
          //       quantity: 1,
          //       hio_id: item.hio_id,
          //       is_payment: item?.hio_info?.is_customer_pay === 1 || +item.is_cancel === 1 ? 1 : 0,
          //       transaction_provider_id: item.transaction_provider_id,
          //       is_cancel: item.is_cancel
          //     }
          //     ))]
          // }
          if (other_service.length > 0) {
            this.listService = [
              ...this.listService,
              ...other_service.map((item, index) => (
                {
                  ...item,
                  id: index + this.listService.length + 1,
                  service_name: `Dịch vụ ngoài`,
                  tee_time: '',
                  code: item?.bookingOutside?.code_booking,
                  facility_name: item?.bookingOutside?.facility_name,
                  unit: 'Sản phẩm',
                  price: item.price,
                  money: item.amount,
                  provider: NAME_PROVIDER.BOOKING_OUTSIDE,
                  is_payment: item?.bookingOutside?.status === 1 || +item.is_cancel === 1 ? 1 : 0,
                  transaction_provider_id: item.transaction_provider_id,
                  quantity: item?.quantity,
                  is_cancel: item.is_cancel
                }
              ))
            ]
          }
          if (shop_service.length > 0) {
            this.listService = [
              ...this.listService,
              ...shop_service.map((item, index) => (
                {
                  ...item,
                  id: index + 1,
                  service_name: `shop`,
                  tee_time: '',
                  code: item.name_product,
                  facility_name: '',
                  unit: 'Sản phẩm',
                  price: item.price,
                  money: item.amount,
                  quantity: item?.quantity,
                  provider: NAME_PROVIDER.SHOP,
                  deliverys: item?.delivery_bill_id,
                  is_payment: item.status_payment === 1 || +item.is_cancel === 1 ? 1 : 0,
                  transaction_provider_id: item.transaction_provider_id,
                  is_cancel: item.is_cancel
                }
              ))
            ]
          }
          this.callDetailDone = true
          this.total_money = this.sumaryMoney()
          console.log('......total_money', this.total_money)
          console.log('.......this.listService...', this.listService)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    handleShowHistoryLog() {
      this.showDialogHistoryLog = true
      this.objectDataHistoryLog = { ...this.postForm }
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
    resetFormRequest() {
      this.listService = []
      this.list_payment_code = []
      this.callDetailDone = true
      this.total_money = 0
      this.list_tax_code = []
      this.postForm = {
        payment_code: '',
        tax_code: '',
        customer_name: '',
        address: '',
        unit_name: '',
        receiver_email: '',
        receiver_address: ''
      }
      setTimeout(() => {
        this.$refs['ruleForm'].clearValidate()
      }, 0)
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },
    handleCloseHistoryLog() {
      this.showDialogHistoryLog = false
    },
    convertDateTime,
    formatNumber
  }
}
</script>

<style scoped lang="scss">
  .col-top-statistic{
    padding-right: 10px;
  }

  .clearfix-20 {
    height: 20px;
    clear: both;
  }
  .line hr {
    border-top: 1px solid #eee9e9;
  }

  .line {
    margin: 20px 2px 40px;
    width: 100%;
  }

  p, p span {
    font-size: 12px !important;
  }

  span, label, th, td {
    font-size: 12px !important;
  }
  .border-1 {
    border: 1px solid #dbd2d2;
    border-radius: 15px;
  }
  .p-10 {
    padding: 10px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .px-30 {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
</style>
