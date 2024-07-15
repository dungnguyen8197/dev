<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Ngày">
        <el-form-item prop="date_transaction">
          <el-date-picker
            v-model="formRequest.date_transaction"
            :disabled="!isAdd"
            style="width: 100%;"
            type="datetime"
            format="dd-MM-yyyy HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="Ngày"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Số tiền">
        <el-form-item prop="price">
          <input v-model="formRequest.amount_money" :disabled="!isAdd" type="number" placeholder="Số tiền" class="input-amount">
          <!--          <el-input-->
          <!--            v-model="price"-->
          <!--            :disabled="!isAdd"-->
          <!--            prop="price"-->
          <!--            placeholder="Số tiền"-->
          <!--            @input="onInputPrice"-->
          <!--            @keyup.enter.native="onSubmitForm('ruleForm')"-->
          <!--          />-->
        </el-form-item>
      </el-form-item>
      <el-form-item label="Ngân hàng">
        <el-form-item prop="bank_name">
          <el-input
            v-model="formRequest.bank_name"
            :disabled="!isAdd"
            prop="bank_name"
            placeholder="Ngân hàng"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Số tài khoản">
        <el-form-item prop="bank_account_number">
          <el-input
            v-model="formRequest.bank_account_number"
            :disabled="!isAdd"
            prop="bank_name"
            placeholder="Số tài khoản"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!formRequest.is_clear || formRequest.is_clear == 0" label="Mã BK">
        <el-form-item prop="code_booking">
          <el-tag
            v-for="codeBooking in codeBookings"
            :key="codeBooking"
            closable
            :disable-transitions="false"
            @close="handleCloseCodeBooking(codeBooking)"
          >
            {{ codeBooking }}
          </el-tag>
          <el-select
            ref="saveTagInput"
            v-model="inputValue"
            style="width: 100%"
            class="input-new-tag"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Tìm kiếm mã booking"
            :remote-method="onSearchCodeBooking"
            :loading="loadingSearchCodeBooking"
            @change="handleInputConfirm"
          >
            <el-option
              v-for="booking in bookes"
              :key="booking"
              :label="booking"
              :value="booking"
              :disabled="Boolean(codeBookings.includes(booking))"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Dịch vụ thanh toán">
        <template v-if="!loadingListGB">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            :disabled="Boolean(formRequest.is_clear && formRequest.is_clear != 0)"
            @change="handleCheckAllChange"
          >
            Check all
          </el-checkbox>
          <el-row class="data-table-content table-responsive">
            <table class="table table-bordered table_custom">
              <thead>
                <tr>
                  <th scope="col" class="text-center" style="min-width: 150px">Code thanh toán</th>
                  <th scope="col" class="text-center" style="min-width: 150px">Dịch vụ trong code</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in arrayCodePayment" :key="index">
                  <td style="text-align: left" class="col-3">
                    <el-checkbox
                      v-model="item.checked"
                      :label="item.id"
                      :checked="item.checked"
                      :disabled="item.disabled || Boolean(formRequest.is_clear && formRequest.is_clear != 0)"
                      :style="!item.disabled && 'color: red' "
                      @change="handleCheckboxItem($event, item)"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </td>
                  <td style="max-width:100px" class="vertical-middle">
                    <template v-for="(service, i) in item.data_transaction">
                      <!-- <div :key="i"> -->
                      <p :key="i" :style="{marginBottom: `0 !important`, fontSize: `14px !important`, color: `${item.checked && !item.disabled ? '#1890ff' : ''}`}"> {{ i+1 }}. {{ service?.label }}</p>
                      <!-- </div> -->
                      <!-- <el-tag :key="i">
                        {{ service?.label }}
                      </el-tag> -->
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </template>
        <div v-else>
          {{ 'Đang load dữ liệu ...' }}
        </div>
      </el-form-item>
      <!--      <el-form-item v-else label="Người thanh toán" :label-width="formLabelWidth">-->
      <!--        {{ 'Không có dữ liệu' }}-->
      <!--      </el-form-item>-->
      <el-form-item label="Ghi chú">
        <el-form-item prop="note">
          <el-input
            v-model="formRequest.note"
            :disabled="is_clear == 1 && is_sale"
            prop="note"
            placeholder="Ghi chú"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Nội dung chuyển khoản">
        <el-form-item prop="transfer_content">
          <el-input
            v-model="formRequest.transfer_content"
            :disabled="!isAdd"
            prop="transfer_content"
            placeholder="Nội dung chuyển khoản"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="Lựa chọn clear or no">
        <el-form-item prop="is_clear">
          <el-select
            v-model="is_clear"
            :disabled="true"
            class="w-100"
            prop="is_clear"
            placeholder="Lựa chọn clear or no"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          >
            <el-option
              v-for="status in statusList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="Sale xử lý">
        <el-form-item prop="sale_id">
          <el-select
            v-model="formRequest.sale"
            style="width: 100%"
            :disabled="true"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="Nhập tên sale"
            :remote-method="onSearchAdmin"
            :loading="loadingSearchAdmin"
          >
            <el-option
              v-for="admin in admins"
              :key="admin.id"
              :label="admin.name"
              :value="admin.id"
            />
          </el-select>
          <!-- <el-input :disabled="!isAdd" v-model="formRequest.sale" prop="sale_id" placeholder="Sale xử lý" @keyup.enter.native="onSubmitForm('ruleForm')" /> -->
        </el-form-item>
      </el-form-item>
      <!-- <el-form-item label="Hình thức thanh toán">
        <el-form-item>
          <el-select
            v-model="formRequest.type_purchase"
            :disabled="true"
            class="w-100"
            placeholder="Hình thức thanh toán"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          >
            <el-option
              v-for="type_purchase in arrayTypePurchase"
              :key="type_purchase.value"
              :label="type_purchase.label"
              :value="type_purchase.value"
            />
          </el-select>
        </el-form-item>
      </el-form-item> -->
      <!-- <el-form-item v-if="isSale" label="Admin">
              <el-form-item prop="admin">
                <el-input :disabled="!isAdd" v-model="formRequest.admin" prop="sale_id" placeholder="Admin" @keyup.enter.native="onSubmitForm('ruleForm')" />
              </el-form-item>
            </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { validateDate, validateText } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import MoneyInResource from '@/api/manage-booking/money-in'
import SearchResource from '@/api/search-api'
import BookingPaxResource from '@/api/BookingPax'
import { NAME_PROVIDER } from '@/utils/constant'
import { isEmpty } from '@/utils/validate'
import moment from 'moment'
import { arrayTypePurchase } from '@/utils/status'

const moneyInResource = new MoneyInResource()
const searchResource = new SearchResource()
const bookingPaxResource = new BookingPaxResource()
export default {
  name: 'DialogEditHistory',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    // isSale: {
    //   type: Boolean,
    //   default: false
    // },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      admins: [],
      bookes: [],
      rules: {
        // code_booking: [{ validator: (rule, _, callback) => validateCodeBooking(rule, this.formRequest.code_booking, callback, 'Code booking'), trigger: 'change' }],
        date_transaction: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.date_transaction, callback, 'Ngày'),
          trigger: 'change'
        }],
        amount_money: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.amount_money, callback, 'Số tiền'),
          trigger: 'change'
        }],
        bank_name: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.bank_name, callback, 'Ngân hàng'),
          trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      query: {
        limit: 10,
        page: 1
      },
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
      is_clear: 0,
      codeBookings: [],
      bookingListQuery: [],
      inputValue: '',
      loadingSearchCodeBooking: false,
      dialog: { titleName: 'Thêm mới giao dịch', buttonName: 'add' },
      adminData: [],
      loadingSearchAdmin: false,
      arrayCodePayment: [],
      formLabelWidth: '200px',
      check_list: [],
      isEmpty: false,
      checkAll: false,
      isIndeterminate: true,
      amount_money: '',
      price: null,
      is_sale: false,
      data_bill_GB: [],
      loadingListGB: false,
      arrayTypePurchase: Object.keys(arrayTypePurchase()).map(key => ({
        value: parseInt(key),
        label: arrayTypePurchase()[key]
      }))
    }
  },

  watch: {
    objectData(value) {
      if (!this.isAdd) {
        this.formRequest = value
        this.formRequest.sale = value?.sale?.name
        this.formRequest.admin = value?.admin?.name
        this.price = value.amount_money ? this.formatNumber(value.amount_money) : ''
        this.is_clear = value?.is_clear
        this.is_sale = value?.is_sale ?? false
        this.codeBookings = []
        // if (value?.booked?.length > 0) {
        //   this.codeBookings = (Array.from(new Set(value?.booked.map((item) => item.code_booking))))
        // } else {
        //   this.codeBookings = []
        //   this.check_list = []
        //   if (value.code_booking) {
        //     // this.codeBookings.push(value?.code_booking)
        //     // this.codeBookings = [...this.codeBookings, ...value.code_booking.split(',')?.filter(item => item.includes('GB'))]
        //   }
        // }
        if (value.code_booking) {
          this.codeBookings = [...value.code_booking.split(',')] // ?.filter(item => item.includes('GB'))
        }
      } else {
        this.formRequest.sale = null
        this.formRequest.admin = null
        this.price = null
        this.codeBookings = []
      }
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới giao dịch', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật giao dịch', buttonName: 'Cập nhật' })
      }
    },

    codeBookings(value) {
      this.arrayCodePayment = []
      this.check_list = []
      const date_not_free_d20 = moment('2024-02-20', 'YYYY-MM-DD')
      console.log('value.........', value)
      if (value.find(item => item.includes('GB'))) {
        // ------------ List Mã GB----------------
        console.log('this.data_bill_GB.........', this.data_bill_GB)
        const array_db = value.filter(item => item.includes('GB'))
        console.log('array_db........', array_db)
        let name_service = ''
        const body_change_status = null
        const list_user_out_system = []
        this.loadingListGB = true
        const list_service = []
        // ------------ call api lay data provider----------------
        bookingPaxResource.listBillSearchArrayGB({ code_key: array_db }).then(async res => {
          if (res.error_code === 0) {
            const data = res?.data
            console.log('............data', data)
            // ------------ loop response data----------------
            for (let i_data = 0; i_data < data.length; i_data++) {
              const item = data[i_data]
              console.log('item..........', item)
              console.log('i_data.....', i_data)
              const data_json = JSON.parse(item.data_json)
              console.log('data_json.........', data_json)
              const regex_check_hio_with_golfer = new RegExp('-TotalBill')
              let user_id_buy_hio = null
              // ------------ loop data_provider từng mã bill đã chọn----------------
              if (item.data_provider.length > 0) {
                const new_provider = []
                for (let i_service = 0; i_service < item.data_provider.length; i_service++) {
                  const provider = item.data_provider[i_service]
                  // ------------ D20 tặng sau 20-02 -> continue----------------
                  if (provider.name === NAME_PROVIDER.HIO && +provider.is_hio_other !== 1 && +provider.data_transaction.options_money_id === 9 && moment(provider.data_transaction?.created_at, 'HH:mm:ss,DD-MM-YYYY') < date_not_free_d20) {
                    continue
                  }
                  // ------------ check từng loại dịch vụ format hiển thị label----------------
                  if (provider.name === NAME_PROVIDER.BOOKING || provider.name === NAME_PROVIDER.BOOKING_MN || provider.name === NAME_PROVIDER.BOOKING_MT) {
                  // name_service = `vID${provider.data_transaction?.list_user_pay?.[0]?.user_id}`
                    if (+provider.data_transaction?.list_user_pay?.[0]?.user_id === -1) {
                      name_service = `vID${provider.data_transaction?.list_user_pay?.[0]?.id_booked}`
                      list_user_out_system.push(provider.data_transaction?.list_user_pay?.[0]?.id_booked)
                    } else {
                      name_service = `vID${provider.data_transaction?.list_user_pay?.[0]?.user_id}`
                      user_id_buy_hio = provider.data_transaction?.list_user_pay?.[0]?.user_id
                    }
                  // body_change_status = provider.data_transaction?.list_user_pay?.[0]?.id_booked
                  } else if (provider.name === NAME_PROVIDER.HIO) {
                    console.log('vao day...........')
                    name_service = `BH${provider.data_transaction?.id}`
                    if (+provider.is_hio_other !== 1 && regex_check_hio_with_golfer.test(provider.data_transaction.name_tour) && data_json && data_json.hio && data_json.hio.length > 0) {
                      user_id_buy_hio = data_json.hio.find(item => item.id === provider.data_transaction.id)?.user_id
                    }
                  } else if (provider.name === NAME_PROVIDER.BOOKING_OUTSIDE) {
                    name_service = `OUT${provider.data_transaction.payment_id} - ${provider.product_name}`
                  } else if (provider.name === NAME_PROVIDER.SHOP) {
                    name_service = `SHOP-${provider?.product_name}`
                  }
                  // ------------ thêm dịch vụ vào list_service và bỏ những dịch vụ lặp----------------
                  // service.hio.filter(hio => !(new RegExp('D20').test(hio.name_tour)) && new RegExp('-Pax' + item.pax_id + '-TotalBill').test(hio.name_tour) && hio?.list_user_insurrance?.[0]?.user_id === item.user_id)
                  if (+provider.is_cancel !== 1 && +provider.deleted_at !== 1 && isEmpty(this.arrayCodePayment.find(item => item.transaction_provider_id === provider.transaction_provider_id))) {
                    const newData = {
                    // id: i_service + 1,
                      label: `${item.is_code_payment === 1 && !isEmpty(item.parent) ? item.parent.bill_code : item.bill_code} - ${name_service}`,
                      value: `${item.is_code_payment === 1 && !isEmpty(item.parent) ? item.parent.bill_code : item.bill_code}-${item.is_code_payment === 1 && !isEmpty(item.parent) ? item.parent.general_bill_id : item?.general_bill_id}-${provider.transaction_provider_id}-${provider.name}-${body_change_status}`,
                      disabled: provider.status === 1 || (+provider.transaction_money_in_id > 0 && +provider.transaction_money_in_id !== +this.formRequest.id),
                      checked: +provider.transaction_money_in_id === +this.formRequest.id,
                      transaction_provider_id: provider.transaction_provider_id,
                      transaction_money_in_id: provider.transaction_money_in_id,
                      user_id_buy_hio: user_id_buy_hio
                    }
                    new_provider.push(newData)
                    name_service = ''
                    user_id_buy_hio = null
                  }
                }
                list_service.push(...new_provider)
                // ------------ kiểm tra nếu có code thanh toán lẻ thì push vào arrayCodePayment----------------
                console.log('list_service.........', list_service)
                const list_code_payment = item.list_code_paymnet.filter(t => t.is_cancel === 0)
                if (list_code_payment.length > 0) {
                  for (let i_code = 0; i_code < list_code_payment.length; i_code++) {
                    const code = list_code_payment[i_code]
                    if (code.data_transaction.length > 0) {
                      const new_data_transaction = list_service.filter(item => code.data_transaction.map(val => +val).includes(+item.transaction_provider_id))
                      // neu 1 code có 2 dịch vụ và mỗi dịch vụ gắn cho 2 bản ghi rồi thì disable (luồng cũ)
                      const check_disabled = [...new Set(new_data_transaction.map(item => item.transaction_money_in_id))].length > 1 || !isEmpty(new_data_transaction.find(item => item.disabled))
                      const count_money_in = new_data_transaction.filter(item => +item.transaction_money_in_id === +this.formRequest.id)
                      console.log('check_disabled.....', check_disabled)
                      console.log('code........', code)
                      const data_push = {
                        id: code?.bill_id || i_code + 1,
                        ...code,
                        label: code.payment_code,
                        value: `${code.bill_id} - ${item?.general_bill_id} - ${code?.payment_code}`,
                        disabled: check_disabled || (+code.transaction_money_in_id > 0 && +code.transaction_money_in_id !== +this.formRequest.id) || (+code.status === 1 && +code.transaction_money_in_id === +this.formRequest.id),
                        checked: count_money_in.length === new_data_transaction.length || +code.transaction_money_in_id === +this.formRequest.id,
                        transaction_provider_id: '',
                        data_transaction: new_data_transaction
                      }
                      this.arrayCodePayment.push(data_push)
                      // ------------ Cập nhật check_list và checkAll khi action checkbox item---------------
                      this.handleCheckboxItem(data_push.checked, data_push)
                    } else {
                      const data_push = {
                        id: code?.bill_id || i_code + 1,
                        ...code,
                        label: code.payment_code,
                        value: `${code.bill_id} - ${item?.general_bill_id} - ${code?.payment_code}`,
                        disabled: (+code.transaction_money_in_id > 0 && +code.transaction_money_in_id !== +this.formRequest.id) || (+code.status === 1 && +code.transaction_money_in_id === +this.formRequest.id),
                        checked: +code.transaction_money_in_id === +this.formRequest.id,
                        transaction_provider_id: '',
                        data_transaction: []
                      }
                      this.arrayCodePayment.push(data_push)
                      this.handleCheckboxItem(data_push.checked, data_push)
                    }
                  }
                }
                // ------------ nếu là code thanh toán thì add luôn vào mảng hiển thị---------------
                const check_outing = (+item.parent_id === 0 && +item.user_id > 0) || (+item.parent_id > 0 && +item.user_id > 0 && !isEmpty(item.parent))
                const check_code_payment_paid = list_code_payment.find(t => +t.status === 1)
                if (check_outing && isEmpty(check_code_payment_paid)) {
                  const data_push = {
                    id: item?.general_bill_id || -1,
                    label: item.code,
                    value: `${item.general_bill_id} - ${+item.parent_id > 0 ? item?.parent_id : item.general_bill_id} - ${item.code}`,
                    disabled: (+item.transaction_money_in_id > 0 && +item.transaction_money_in_id !== +this.formRequest.id),
                    checked: +item.transaction_money_in_id === +this.formRequest.id,
                    transaction_provider_id: '',
                    data_transaction: new_provider
                  }
                  this.arrayCodePayment.push(data_push)
                }
              }
            }
            // ------------ map tên cho các dịch vụ booking người ngoài hệ thống----------------
            if (list_user_out_system.length > 0) {
              console.log('list_user_out_system...........', list_user_out_system)
              let data_user_out = []
              await searchResource.searchUserByBooked({ list: list_user_out_system }).then(res => {
                const { error_code, data } = res
                if (error_code === 0) {
                  data_user_out = data
                }
              })
              console.log('data_user_out...........', data_user_out)
              for (let i_user = 0; i_user < list_service.length; i_user++) {
                const user = list_service[i_user]
                if (user?.label?.includes('vID')) {
                  const find_user = data_user_out.find(item => +item.id === +user?.label?.split(' - ')?.[1]?.slice(3))
                  console.log('find_user...........', find_user)
                  if (find_user && Object.keys(find_user).length > 0) {
                    console.log('......user?.........', user?.label?.split(' - ')?.[1]?.slice(3), user.label)
                    user.label = user.label.replace(`${user?.label?.split(' - ')?.[1]}`, `(OUT)${find_user.name_out_system}`)
                  }
                }
              }
            }
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingListGB = false
        })
      }
      if (value.find(item => !item.includes('GB'))) {
        // ------------ List Mã C, BK----------------
        const array_db = value.filter(item => !item.includes('GB'))
        this.onGetBookedByCodeBooking(array_db)
      }
    }
  },
  created() {
  },
  methods: {
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
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          if (this.isAdd) this.handleSubmitAdd()
          else this.handleSubmitUpdate()
        }
      })
    },

    async handleSubmitAdd() {
      const body = {
        list_code_booking: this.codeBookings.join(),
        check_list: this.check_list.join(),
        date_transaction: this.formRequest.date_transaction,
        amount_money: this.formRequest.amount_money,
        bank_name: this.formRequest.bank_name,
        bank_account_number: this.formRequest.bank_account_number,
        note: this.formRequest.note,
        transfer_content: this.formRequest.transfer_content
      }
      this.loadingSubmit = true
      moneyInResource.storeMoneyIn(body).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },

    async handleSubmitUpdate() {
      console.log('......this.check_list...', this.check_list)
      const check_list_C = this.check_list.filter(item => typeof item === 'number').filter(item => this.arrayCodePayment.find(code => code.value === item && code.checked))
      this.check_list = this.check_list.filter(item => typeof item !== 'number')
      // ------------ Map ra danh sách value các provider trong code paymnet được chọn----------------
      let check_list_provider = []
      if (this.check_list.length > 0) {
        check_list_provider = [...new Set(this.check_list.map(item => this.arrayCodePayment.find(code => code.value === item).data_transaction.map(val => val.value)).flat())]
      }
      console.log('......check_list_provider...', check_list_provider)
      const body = {
        sale: this.formRequest.sale,
        admin: this.formRequest.admin,
        list_code_booking: this.codeBookings.join(),
        check_list: check_list_provider.join(),
        list_code_payment: this.check_list,
        date_transaction: this.formRequest.date_transaction,
        amount_money: this.formRequest.amount_money,
        bank_name: this.formRequest.bank_name,
        bank_account_number: this.formRequest.bank_account_number,
        note: this.formRequest.note,
        transfer_content: this.formRequest.transfer_content,
        check_list_C: check_list_C
      }
      console.log('body..........', body)
      // return
      this.loadingSubmit = true
      moneyInResource.updateMoneyIn(body, this.formRequest.id).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success('Cập nhât thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
      // this.loadingSubmit = true
      // await axios.post(`${baseUrl}/cms/booking-history-transaction-bank/update/${this.formRequest.id}`, this.request).then(response => {
      //   if (response.status == 200 && response.data.error_code == 0) {
      //     this.$message({
      //       message: 'Cập nhật thành công',
      //       type: 'success'
      //     })
      //     this.handleClose()
      //   } else {
      //     this.$message({
      //       message: response.data.message,
      //       type: 'error'
      //     })
      //   }
      // }).catch(error => {
      // })
      // this.loadingSubmit = false
      // this.resetformRequest()
    },

    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {}
      )
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
    },
    handleCloseCodeBooking(codeBooking) {
      this.codeBookings.splice(this.codeBookings.indexOf(codeBooking), 1)
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.codeBookings.push(inputValue)
      }
      this.inputValue = ''
    },

    // showDialogChangeCodeBooking(value) {
    //     value.codeBookings.forEach(item => {
    //         this.codeBookings.push(item.codeBooking);
    //     })
    // },

    onSearchCodeBooking(keyword) {
      this.loadingSearchCodeBooking = true
      console.log('keyword...........', keyword)
      if (keyword.includes('GB')) {
        bookingPaxResource.listBillSearchArrayGB({ code_key: [keyword.trim()] }).then(res => {
          if (res.error_code === 0) {
            const data = res?.data
            console.log('............data', data)
            this.data_bill_GB = res?.data
            console.log('this.data_bill_GB.......', this.data_bill_GB)
            this.bookes = res?.data.map(item => item.is_code_payment === 1 && !isEmpty(item.parent) ? item.code + ' (Bill cha: ' + item.parent.bill_code + ') ' : item.bill_code)
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingSearchCodeBooking = false
        })
      } else {
        searchResource.searchBooking({ keyword_code_booking: keyword.trim() }).then(res => {
          this.loadingSearchCodeBooking = false
          const { error_code, data } = res
          if (error_code === 0) {
            this.bookes = data
          }
        }).catch(_ => {
          this.loadingSearchCodeBooking = false
        })
      }
    },

    onGetBookedByCodeBooking(keyword) {
      this.loadingSearchCodeBooking = true
      const params = { code_booking: keyword }
      searchResource.searchByBooking(params).then(res => {
        this.loadingSearchCodeBooking = false
        const { error_code, data } = res
        if (error_code === 0) {
          if (data.length > 0) {
            const user = data.map(item => (
              {
                label: `${item?.code_booking} - VID${item?.golfer?.id ?? '(OUT)'} - ${item?.golfer?.fullname ?? item?.name_out_system ?? item?.booked?.name_out_system ?? 'null'}`,
                value: item?.id,
                disabled: (item.code_payment_id !== this.formRequest.id && item.code_payment_id !== null) || (item.code_payment_id == null && item.type_purchase !== 0),
                checked: (item.code_payment_id === this.formRequest.id && item.code_payment_id !== null)
              }))
            this.arrayCodePayment = [...user]
            for (const val of user) {
              if (val.checked) {
                this.check_list.push(val.value)
              }
              // this.handleCheckboxItem(val.checked, val)
            }
          }
        }
      }).catch(_ => {
        this.loadingSearchCodeBooking = false
      })
    },

    onSearchUserByBooked(list) {
      const body = { list: list }
      searchResource.searchUserByBooked(body).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          return data
        }
      }).catch(_ => {
      })
    },

    handleCheckAllChange(value) {
      const array = []
      if (value) {
        const list = this.arrayCodePayment.filter(element => !element.disabled)
        list.map(item => {
          array.push(item.value)
        })
      }
      this.arrayCodePayment = this.arrayCodePayment.map(item => ({
        ...item,
        checked: !item.disabled ? value : item.checked
      }))

      console.log('this.arrayCodePayment........', this.arrayCodePayment)
      this.check_list = [...array]
      console.log('check_list........', this.check_list)
      this.isIndeterminate = false
    },
    handleCheckboxItem($event, value) {
      console.log('val............', value)
      console.log('$event............', $event)
      console.log('this.check_list.. 111', this.check_list)
      // if (value.user_id_buy_hio) {
      if ($event) {
        this.check_list = [...new Set([...this.check_list, ...this.arrayCodePayment.filter(item => item.id === value.id).map(item => item.value)])]
      } else {
        this.check_list = this.check_list.filter(item => !this.arrayCodePayment.filter(item => item.id === value.id).map(item => item.value).includes(item))
      }
      console.log('this.check_list..........', this.check_list, this.check_list.length)
      console.log('this.arrayCodePayment.filter(item => !item.disabled).length.......', this.arrayCodePayment.filter(item => !item.disabled || (item.disabled && item.checked)).length)
      const checkedCount = this.check_list.length
      this.checkAll = checkedCount === this.arrayCodePayment.filter(item => !item.disabled || (item.disabled && item.checked)).length
      // this.check_list = [...value]
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.arrayCodePayment.filter(item => !item.disabled || (item.disabled && item.checked)).length
      // }
      console.log('checkedCount..........', checkedCount)
      console.log('checkAll..........', this.checkAll)
      console.log(' this.check_list..........', this.check_list)
    },
    // handleCheckedGolferChange(value) {
    //   const checkedCount = value.length
    //   this.checkAll = checkedCount === this.arrayCodePayment.length
    //   this.check_list = [...value]
    //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.arrayCodePayment.length
    // },
    appendForm() {
      const formData = new FormData()

      const formRequest = this.formRequest

      Object.keys(formRequest).forEach(function(key) {
        formData.append(key, formRequest[key])
      })

      if (this.price) {
        formData.append('amount_money', this.price)
      }
      if (this.codeBookings) {
        formData.append('list_code_booking', this.codeBookings)
      }
      if (this.check_list) {
        formData.append('check_list', this.check_list)
      }

      this.request = formData
    },
    formatNumber,
    onInputPrice(value) {
      if (value) {
        this.formRequest['amount_money'] = value.toString().replaceAll('.', '')
        this.price = this.formatNumber(value)
      }
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.input-amount{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  padding: 0 10px;
}
.input-amount::placeholder{
  color: #606266;
}
.input-amount:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
}
</style>
