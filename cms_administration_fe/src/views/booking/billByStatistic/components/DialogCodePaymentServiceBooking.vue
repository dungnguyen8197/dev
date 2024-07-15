<template>
  <div>
    <el-dialog
      :title="`Code thanh toán dịch vụ Booking`"
      :visible.sync="dialogCodePaymentServiceBooking"
      :before-close="handleClose"
      width="80%"
    >
      <div
        v-loading="loadingDialog"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div class="p-10 mb-10" style="border-bottom: 1px solid #030303">
          <el-row>
            <el-col :span="24">
              <el-table border :data="dataCodePayment" style="width: 100%">
                <el-table-column label="Mã thanh toán" align="center">
                  <template slot-scope="{row}">
                    <el-tag size="medium" type="success">{{ row.code }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Người thanh toán" align="center">
                  <template slot-scope="{row}">
                    <el-tag size="medium" type="success">{{ `vID${row.user_id}` }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Dịch vụ được thanh toán" align="center">
                  <template slot-scope="{row}">
                    <template v-for="(item, key) in convertDataPayment(row)">
                      <el-tag :key="key" class="m-1" size="medium" type="success">{{ item }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="Giá" align="center">
                  <template slot-scope="{row}">
                    <el-tag size="medium" type="success">{{ row.payment_amount ? `${formatNumberOrNull(row.payment_amount)} đ` : '' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Trạng thái" align="center">
                  <template slot-scope="{row}">
                    <el-tag size="medium" :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? 'Đã thanh toán' : 'Chưa thanh toán' }}</el-tag>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="Hành động" align="center">
                  <template slot-scope="{row}">
                    <el-button size="small" type="primary" :loading="loadingSubmitButton" @click="clearCodePayment(row)">Gạch nợ</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div>
          <div>
            <el-form :model="form">
              <el-form-item class="title_code_payment" label="Dịch vụ thanh toán" :label-width="formLabelWidth">
                <el-checkbox-group
                  v-model="form.check_list"
                  style="display: flex;flex-wrap: wrap"
                >
                  <template
                    v-for="item in listService.filter(service => service.provider != 'buy_hio'
                      || (service.provider == 'buy_hio' && !list_hio_not_service_child.map(value => value.data_transaction.id).includes(+service.hio_id)))"
                  >
                    <el-checkbox
                      :key="item.id"
                      style="min-width: 20%;"
                      :label="item.id"
                      :disabled="item.is_payment === 1 && item.is_check_service_unpaid != 0"
                    >
                      <div style="display: flex; flex-direction: column;">
                        <span>
                          {{ `${item.service_name} ${+item.is_cancel === 1 ? '(Đã hủy)' : +item.is_deleted === 1 ? '(Đã xóa)' : +item.is_payment === 1 ? '(Đã thanh toán)' : '(Chưa thanh toán)'}` }}
                        </span>
                        <template v-if="item.provider == 'booking_new'">
                          <template v-for="(val, i) in item.list_hio">
                            <span :key="i" style="font-size: 12px;">
                              {{ `${val?.product_name} - BH${val.hio_id} ${+val.is_cancel === 1 ? ' (Đã hủy)' : +val.is_customer_pay === 1 ? '(Đã thanh toán)' : '(Chưa thanh toán)'}` }}
                            </span>
                          </template>
                        </template>
                      </div>
                    </el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item class="title_code_payment" label="Người thanh toán" :label-width="formLabelWidth">
                <search-user
                  style="width: 250px !important;"
                  :data-model="{}"
                  @selection-changed-user="handleSelectionChangedUser"
                />
              </el-form-item>
              <el-form-item label="Số tiền thanh toán" :label-width="formLabelWidth">
                <label>{{ formatNumberOrNull(form.price) }}</label>
              </el-form-item>
              <el-form-item>
                <el-button @click="handleClose">Huỷ bỏ</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isEmpty } from '@/utils/validate'
import { formatNumberOrNull } from '@/utils/convert'
import BookingPaxResource from '@/api/BookingPax'
import { REGION_INFO } from '@/utils/constant'
const bookingPaxResource = new BookingPaxResource()
import { getAllAdmin, getAcountInfo } from '@/utils/auth'
import { NAME_PROVIDER } from '@/utils/constant'
import SearchUser from '@/views/component/SearchUser.vue'

export default {
  name: 'DialogCodePaymentServiceBooking',
  components: {
    SearchUser
  },
  props: {
    dialogCodePaymentServiceBooking: {
      type: Boolean,
      default: false,
      value: false
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loadingDialog: false,
      btnLoading: false,
      dataCodePayment: [],
      bank: REGION_INFO,
      urlQRcode: '',
      loadingSubmit: false,

      dataAllAdmin: getAllAdmin() || [],
      form: {
        check_list: [],
        resource: '',
        price: 0
      },
      formLabelWidth: '250px',
      arrayUser: [],
      listUserNotRefund: [],
      listServicePay: [],
      listService: [],
      bill_id: '',
      data_detail: {},
      listServiceDetail: [],
      list_hio_not_service_child: [],
      list_hio_all: [],
      checkAll: false,
      isIndeterminate: true,
      loadingSubmitButton: false
    }
  },
  watch: {
    dialogCodePaymentServiceBooking(value) {
      console.log('dialogCodePaymentServiceBooking...........', value)
    },
    objectData(value) {
      console.log('objectData..........', value)
      if (!isEmpty(value)) {
        this.bill_id = value.general_bill_id
        this.onGetDetail(value.general_bill_id)
        this.getCodePaymentByBillID()
        console.log('value...........', value)
        this.arrayUser.push({ user_id: value.user_id, name_out_system: '' })

        this.list_hio_not_service_child = value.data_provider.filter(item => item.name === 'buy_hio' && +item.is_hio_other !== 1)
        console.log('.............list_hio_not_service_child...........', this.list_hio_not_service_child)
        const service = value.data_provider
        console.log('.........service........', service)
        if (service.filter(item =>
          item.name === NAME_PROVIDER.HIO).length > 0) {
          this.list_hio_all = service.filter(item =>
            item.name === NAME_PROVIDER.HIO).map((item, index) => ({
            ...item,
            id: index + this.listService.length + 1,
            service_name: `HIO - ${item?._product_name} - BH${item?.data_transaction?.id}`,
            money: +item.payment_amount || +item.quantity_price,
            provider: NAME_PROVIDER.HIO,
            hio_id: item?.data_transaction?.id,
            total_pay: +item.payment_amount,
            transaction_provider_id: item.transaction_provider_id,
            is_payment: item.is_customer_pay
          }
          ))
        }
        console.log('...............this.listService.............', this.listService)
      }
    }
  },
  created() {
    console.log('getAcountInfo_________', getAcountInfo())
  },
  methods: {
    handleSelectionChangedUser(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.form.resource
        return
      }
      this.form.resource = value.value
    },
    async onGetDetail(id) {
      this.loadingDialog = true
      bookingPaxResource.detailBill({ bill_id: id, all_service: true }).then(async(res) => {
        if (res.error_code === 0) {
          const data = res.data
          console.log('data.........', data)
          this.data_detail = res.data
          const service = data.service
          const other_service = service.filter(item => item.id === -1)
          const hio_service = service.filter(item => item.id === 2)
          const shop_service = service.filter(item => item.id === 1)
          if (data.pax) {
            if (data.pax.booked.find(item => +item.user_id === +this.arrayUser?.[0]?.user_id && +item.user_id > 0)) {
              this.arrayUser = []
            }
            data.pax.booked.forEach(itemBooked => {
              console.log('itemBooked...........', itemBooked)
              if (itemBooked.user_id > 0) {
                this.arrayUser.push(itemBooked)
              }
            })
            console.log('this.arrayUser...........', this.arrayUser)
            const list_hio = data.list_hio.map((item, index) => ({
              ...item,
              id: index + this.listService.length + 1,
              service_name: `HIO - ${item?.OptionsMoney?.name} - BH${item?.id}`,
              product_name: item?.OptionsMoney?.name,
              money: +item.total_pay,
              provider: NAME_PROVIDER.HIO,
              hio_id: item?.id,
              total_pay: +item.total_pay
            }))
            // this.listGolfers = [...data.golfers]
            const arrayOfLists = data.golfers.map(obj => obj.insurance_id_pax)

            const list_hio_has_user = [].concat(...arrayOfLists)
            console.log('..........list_hio_has_user', list_hio_has_user)
            const list_hio_service = data.service.filter(item => item.type === 'hio').map(item => item.hio_id)
            const list_hio_all = data.list_hio.map(item => item.id)
            console.log('..........list_hio_all', list_hio_all)
            const list_hio_dif = list_hio_all.filter(item => !list_hio_has_user.includes(item) && !list_hio_service.includes(item))
            console.log('..........list_hio_dif', list_hio_dif)
            const list_hio_send_pvi_user_delete =
        data.list_hio.filter(item => list_hio_dif.includes(item.id) && +item.is_outing === 0 && +item.is_send_pvi === 1 && +item.options_money_id !== 9)
          .map(item1 => ({
            User: item1.User,
            options_money_id: item1.options_money_id,
            can_payment: item1.can_payment,
            id: item1.id,
            id_general_bill_detail: item1.id_general_bill_detail,
            is_outing: item1.is_outing,
            user_id: item1.user_id,
            total_pay: item1.total_pay,
            is_send_pvi: item1.is_send_pvi,
            status: item1.status,
            is_customer_pay: item1.is_customer_pay,
            is_pay: item1.is_pay
          }))
            console.log('..........list_hio_send_pvi_user_delete', list_hio_send_pvi_user_delete)
            const list_golfer_delete_hio_send_pvi = this.listUserDEteleHioSendPVI(list_hio_send_pvi_user_delete)
            console.log('..........list_golfer_delete_hio_send_pvi', list_golfer_delete_hio_send_pvi)
            if (list_golfer_delete_hio_send_pvi.length > 0) {
              this.listService = [
                ...this.listService,
                ...list_golfer_delete_hio_send_pvi?.map((item, index) => (
                  {
                    id: index + this.listService.length + 1,
                    service_name: 'vID' + item?.user_id + ' - ' + item?.name,
                    money: 0,
                    provider: NAME_PROVIDER.BOOKING,
                    pax_id: null,
                    code_booking: null,
                    facility_id: null,
                    facility_name: null,
                    booked_id: null,
                    user_id: item.user_id,
                    list_hio: item?.insurance_provider ? [...list_hio.filter(hio => item?.insurance_provider?.map(pro => +pro.id)?.includes(+hio.hio_id)).map(val => ({ ...val, html_cert_insurrance: '', ...item?.insurance_provider?.find(i => +i.id === +val.hio_id) }))] : [],
                    is_payment: 1,
                    is_check_service_unpaid: item?.insurance_provider?.filter(item1 => +item1.is_customer_pay !== 1 && +item1.is_cancel !== 1).length > 0 ? 0 : 1,
                    transaction_provider_id: item.transaction_provider_id,
                    is_deleted: 1
                  }
                ))
              ]
            }
            console.log('...........this.listService.111111.........', this.listService)
            if (data.golfers.length > 0) {
              this.listService = [
                ...this.listService,
                ...data.golfers?.filter(item => !(+item.id === -1 && !item.name))?.map((item, index) => (
                  {
                    id: index + this.listService.length + 1,
                    service_name: 'vID' + item?.booked?.user_id + ' - ' + item?.booked?.name_out_system,
                    money: item.booked?.price_booking,
                    provider: NAME_PROVIDER.BOOKING,
                    pax_id: item.booked?.pax_id,
                    code_booking: item.booked?.code_booking,
                    facility_id: data.pax.facility_id,
                    facility_name: data.pax?.facility?.sub_title,
                    booked_id: item.booked?.id,
                    user_id: item.booked?.user_id,
                    list_hio: item?.insurance_provider ? [...list_hio.filter(hio => item?.insurance_provider?.map(pro => +pro.id)?.includes(+hio.hio_id)).map(val => ({ ...val, html_cert_insurrance: '', ...item?.insurance_provider?.find(i => +i.id === +val.hio_id) }))] : [],
                    is_payment: (item.booked?.type_purchase > 0 && +item.booked?.type_purchase !== 14) || +item.is_cancel === 1 ? 1 : 0,
                    is_check_service_unpaid: (item.booked?.type_purchase === 0 && +item.is_cancel !== 1) || (item?.insurance_provider?.filter(item1 => +item1.is_customer_pay !== 1 && +item1.is_cancel !== 1).length > 0) ? 0 : 1,
                    transaction_provider_id: item.transaction_provider_id,
                    is_cancel: item.is_cancel
                  }
                ))
              ]
            }
          }
          console.log('...........this.listService.33333333333.........', this.listService)
          if (hio_service.length > 0) {
            console.log('.......hio_service...', hio_service)
            this.listService = [
              ...this.listService,
              ...hio_service.map((item, index) => ({
                ...item.hio_info,
                id: index + this.listService.length + 1,
                service_name: `HIO - ${item?.hio_info?.money?.name} - BH${item.hio_id}`,
                money: item.amount,
                provider: NAME_PROVIDER.HIO,
                hio_id: item.hio_id,
                is_payment: item?.hio_info?.is_customer_pay === 1 || +item.is_cancel === 1 ? 1 : 0,
                transaction_provider_id: item.transaction_provider_id,
                is_cancel: item.is_cancel
              }
              ))]
          }
          if (other_service.length > 0) {
            this.listService = [
              ...this.listService,
              ...other_service.map((item, index) => (
                {
                  ...item,
                  id: index + this.listService.length + 1,
                  service_name: `${item?.bookingOutside?.code_booking} - ${item.name_other_service}`,
                  money: item.amount,
                  provider: NAME_PROVIDER.BOOKING_OUTSIDE,
                  is_payment: item?.bookingOutside?.status === 1 || +item.is_cancel === 1 ? 1 : 0,
                  transaction_provider_id: item.transaction_provider_id,
                  is_cancel: item.is_cancel
                }
              ))
            ]
          }
          if (shop_service.length > 0) {
            // const total_amount = shop_service.reduce((accumulator, currentValue) => {
            //   return accumulator + currentValue.amount
            // }, 0)
            // const name = shop_service.reduce((accumulator, currentValue) => {
            //   return accumulator + (accumulator.length === 0 ? currentValue.name_product : `, ${currentValue.name_product}`)
            // }, '')
            console.log('...........shop_service..........', shop_service)

            const resultMap = new Map()

            shop_service.forEach(item => {
              const key = item.transaction_provider_id

              if (!resultMap.has(key)) {
                resultMap.set(key, { ...item })
              } else {
                resultMap.get(key).name_product += ` + ${item.name_product}`
                resultMap.get(key).amount += item.amount
              }
            })

            // Chuyển kết quả từ Map thành mảng
            const resultArrayShop = Array.from(resultMap.values())
            console.log('resultArrayShop...........', resultArrayShop)
            this.listService = [
              ...this.listService,
              ...resultArrayShop.map((item, index) => (
                {
                  ...item,
                  id: index + this.listService.length + 1,
                  service_name: `SHOP - ${item.name_product}`,
                  money: item.amount,
                  provider: NAME_PROVIDER.SHOP,
                  deliverys: item?.delivery_bill_id,
                  is_payment: item.status_payment === 1 || +item.is_cancel === 1 ? 1 : 0,
                  transaction_provider_id: item.transaction_provider_id,
                  is_cancel: item.is_cancel
                }
              ))
            ]
          }
          console.log('...........this.listService..........', this.listService)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    formatNumberOrNull,
    clearCodePayment(code) {
      const body = {
        general_bill_id: code.general_bill_id,
        method_payment: 0,
        data: { data_provider: code.data_provider, pax_id: this.data_detail.pax_id }
      }
      console.log('body............', body)
      this.$confirm(`Bạn có chắc chắn gạch nợ cho mã code ${code.code}`).then(async(_) => {
        this.loadingSubmitButton = true
        bookingPaxResource.clearCodePaymentStatus(body).then(async(res) => {
          if (res.error_code === 0) {
          // this.$emit('onClickButtonConfirmPayment', { dialog: false, reload: true })
            this.$message.success('Xác nhận thành công.')
            // this.resetDataModal()
            this.getCodePaymentByBillID()
            this.form = {
              check_list: [],
              resource: '',
              price: 0
            }
            this.checkAll = false
            this.isIndeterminate = true
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingSubmitButton = false
        })
      })
    },
    handleClose() {
      this.dataCodePayment = []
      this.form = {
        check_list: [],
        resource: '',
        price: 0
      }
      this.arrayUser = []
      this.listUserNotRefund = []
      this.listServicePay = []
      this.listService = []
      // this.listGolfers = []
      this.$emit('closeDialogCodePaymentServiceBooking')
    },
    getCodePaymentByBillID() {
      bookingPaxResource.getDetailCodePaymentGeneralBill({ general_bill_id: this.bill_id }).then(res => {
        if (res.error_code === 0) {
          this.dataCodePayment = res.data.bill.bill_list
          console.log(' this.dataCodePayment ...........', this.dataCodePayment)
        }
      }).catch(err => {
        console.log('err...........', err)
      }).finally(() => {
        console.log('finally...........')
      })
    },
    convertDataPayment(row) {
      let result = []
      const provider_list = row.data_provider
      for (const provider of provider_list) {
        if (provider.name === NAME_PROVIDER.BOOKING || provider.name === NAME_PROVIDER.BOOKING_MN || provider.name === NAME_PROVIDER.BOOKING_MT) {
          result = [...result, ...provider?.data_transaction?.list_user_pay.map(item => ('vID' + item.user_id))]
        }
        if (provider.name === NAME_PROVIDER.HIO) {
          result = [...result, `BH${provider?.data_transaction?.id}`]
        }
        if (provider.name === NAME_PROVIDER.BOOKING_OUTSIDE) {
          result = [...result, provider?.data_transaction?._product_name]
        }
        if (provider.name === NAME_PROVIDER.SHOP) {
          result = [...result, `SHOP-${provider?.data_transaction?._product_name}`]
        }
      }
      return result
    },
    listUserDEteleHioSendPVI(data) {
      const resultArray = []
      // Đối tượng dùng để theo dõi các user_id đã xử lý
      const processedUserIds = {}
      // Hàm để tìm kiếm đối tượng theo user_id trong mảng kết quả
      data.forEach(item => {
        const userId = item.user_id
        // Nếu user_id đã được xử lý, thêm options_money_id và id vào các mảng tương ứng
        if (processedUserIds[userId]) {
          const existingUser = resultArray.find(user => user.id === userId)
          existingUser.insurance_pax.push(item.options_money_id)
          existingUser.insurance_id_pax.push(item.id)
          existingUser.insurance_provider.push({
            'id': item.id,
            'is_customer_pay': item.is_customer_pay,
            'is_send_pvi': item.is_send_pvi,
            'is_cancel': item?.is_cancel || 0,
            'options_money_id': item.options_money_id
          })
        } else {
          // Nếu user_id chưa được xử lý, tạo đối tượng mới và thêm vào mảng kết quả
          const newUser = {
            user_id: userId,
            name: item?.User?.fullname,
            insurance_pax: [item.options_money_id],
            insurance_id_pax: [item.id],
            is_deleted: 1,
            insurance_provider: [{
              'id': item.id,
              'is_customer_pay': item.is_customer_pay,
              'is_send_pvi': item.is_send_pvi,
              'is_cancel': item?.is_cancel || 0,
              'options_money_id': item.options_money_id
            }]
          }
          resultArray.push(newUser)
          // Đánh dấu user_id đã được xử lý
          processedUserIds[userId] = true
        }
      })
      return resultArray
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
