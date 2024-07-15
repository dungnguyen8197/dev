<template>
  <el-dialog
    title="Code thanh toán đơn Outing"
    width="80%"
    :before-close="onCloseDialog"
    :visible.sync="showDialog"
  >
    <div
      v-loading="loadingTable"
      class="filter-container"
    >
      <div>
        <el-button v-if="isCreate" class="mb-20" type="primary" style="border-radius:10px; float:right;" @click="handleCreate">Thêm mới cọc</el-button>
      </div>
      <table class="table table-bordered " style="vertical-align: center">
        <thead>
          <tr style="background-color: #E3F5FF;color:#147AD6">
            <th class="text-center  vertical-middle" style="min-width: 180px">Mã thanh toán</th>
            <th scope="col" class="text-center" style="min-width: 180px">Người thanh toán</th>
            <th scope="col" class="text-center" style="min-width: 180px">Giá</th>
            <th scope="col" class="text-center" style="min-width: 180px">% giá trị Bill</th>
            <th scope="col" class="text-center" style="min-width: 180px">Trạng thái</th>
            <th scope="col" class="text-center" style="min-width: 180px">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="objectData.number_of_payment == 0" style="color: #7C7C7C">
            <td scope="col" class=" text-center">
              {{ objectData.code }} (Default)
            </td>
            <td scope="col" class=" text-center">
              VID{{ objectData.user_id }}
            </td>
            <td scope="col" class=" text-center">
              {{ formatNumber(objectData.payment_amount - getMoneyPaid) }}
            </td>
            <td scope="col" class=" text-center">
              {{ getDepositRate(objectData.payment_amount - getMoneyPaid) }}
            </td>
            <td scope="col" class=" text-center">
              {{ status_code[objectData.status] }}
            </td>
            <td scope="col" class=" text-center">
              <el-button
                v-if="getMoneyPaid != objectData.payment_amount"
                type="primary"
                size="mini"
                round
                class="mb-10 "
                @click="createQRCode(objectData.payment_amount - getMoneyPaid, objectData.code)"
              > Tạo QR
              </el-button>
            </td>
          </tr>
          <tr v-for="(item, key) in listData" :key="key" style="color: #7C7C7C">

            <td scope="col" class=" text-center">
              {{ item.payment_code }}
            </td>
            <td scope="col" class=" text-center">
              VID{{ objectData.user_id }}
            </td>
            <td scope="col" class=" text-center">
              {{ formatNumber(item.payment_amount) }}
            </td>
            <td scope="col" class=" text-center">
              {{ getDepositRate(item.payment_amount) }}
            </td>
            <td scope="col" class=" text-center">
              {{ status_code[item.status] ? `${status_code[item.status]} cọc lần ${key + 1}` : '' }}
            </td>
            <td scope="col" class=" text-center">
              <el-button
                v-if="item.status === 3"
                type="primary"
                size="mini"
                round
                class="mb-10 "
                @click="createQRCode(item.payment_amount, item.payment_code)"
              > Tạo QR
              </el-button>
              <el-button
                v-if="item.status === 3"
                class=" mb-10"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleUpdate(item)"
              >
                Sửa
              </el-button>
              <el-button
                v-if="item.status === 3"
                class=" mb-10"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleRemove(item)"
              >
                Xóa
              </el-button>
            </td>
          </tr>
          <tr style="background-color: #E3F5FF;color:#147AD6; border:none">

            <th style=" border:none" class="text-center  vertical-middle" />
            <th style=" border:none" scope="col" class="text-center" />
            <th style=" border:none" scope="col" class="text-center" />
            <th style=" border:none" scope="col">
              <p style="color: #909091;" class="m-0">Tổng số lần cọc</p>
              <p class="m-0">{{ listData.length }}</p>

            </th>
            <th style=" border:none" scope="col">
              <p style="color: #909091;" class="m-0">Số tiền đã thanh toán</p>
              <p class="m-0">{{ formatNumber(getMoneyPaid) }}đ</p>
            </th>
            <th style=" border:none" scope="col">
              <p style="color: #909091;" class="m-0">Số tiền toàn bill</p>
              <p class="m-0">{{ formatNumber(objectData.payment_amount) }}đ</p>
            </th>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="onCloseDialog">Xác nhận</el-button> -->

        <el-button @click="onCloseDialog">Hủy bỏ</el-button>

      </span>
      <div class="dialog-in">
        <el-dialog
          :visible.sync="dialogShowQRCode"
          width="30%"
          append-to-body
          center
        >
          <section ref="screenshotInvoice" class="main-pd-wrapper">
            <el-image :src="urlQRcode" style="height: 100%; width: 100%;" />
          </section>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogShowQRCode = false">Hủy</el-button>
            <el-button type="primary" icon="el-icon-upload" :loading="loadingSubmitDownQr" @click="downloadImage">
              Download
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
          width="40%"
          :title="isAdd ? 'Thêm mới cọc' : 'Cập nhật cọc' "
          :visible.sync="innerVisible"
          :before-close="handleCloseDialogCreate"
          append-to-body
        >
          <div>
            <p style="margin:0">Số tiền toàn bill: <span style="color: red;">{{ formatNumber(objectData.payment_amount) }} đ</span></p>
            <p style="margin:0">Số tiền đặt cọc tối đa: <span style="color: red;">{{ formatNumber(getMoneyMax()) }} đ</span></p>
          </div>
          <el-form ref="ruleForm" :rules="rules" :model="formRequest" class="demo-ruleForm">
            <el-form-item label="Số tiền đặt cọc" required>
              <el-form-item prop="payment_amount">
                <el-input v-model="formRequest.payment_amount" clearable type="number" placeholder="Nhập số tiền cọc (Số tiền cọc không vượt quá số tiền bill)" @keyup.enter.native="onSubmitForm('ruleForm')" />
              </el-form-item>

            </el-form-item>
            <el-form-item label="Tỉ lệ đặt cọc (%)" prop="phone">
              <el-input :value="getDepositRate(formRequest.payment_amount)" disabled placeholder="Tỉ lệ đặt cọc" @keyup.enter.native="onSubmitForm('ruleForm')" />
            </el-form-item>
            <span>
              <el-button @click="handleCloseDialogCreate">Hủy</el-button>
              <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ isAdd ? 'Thêm mới' : 'Cập nhật' }}</el-button>
            </span>
          </el-form>

        </el-dialog>

      </div>
    </div>

  </el-dialog>

</template>

<script>
import { formatNumber, formatDate } from '@/utils/convert'
import { validateNumber } from '@/utils/validate'
import PaymentHubResource from '@/api/paymentHub'
import moment from 'moment'
import { create_signature_hub } from '@/utils/create-signnature'
import { trim_string_object } from '@/utils/trim-string-object'
import { genQrCode } from '@/utils/vietqr'
import html2canvas from 'html2canvas'
// import { STATUS_BILL } from '@/utils/status'
const paymentHubResource = new PaymentHubResource()

export default {
  name: 'DialogCodePaymentOuting',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
      value: false
    },
    isCreate: {
      type: Boolean,
      default: false,
      value: false
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    currentAdmin: {
      type: Object,
      default() {
        return {}
      }
    },
    regionInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isAdd: true,
      infoData: {},
      dialogShowQRCode: false,
      loadingSubmitDownQr: false,
      rules: {
        payment_amount: [{ validator: (rule, _, callback) => validateNumber(rule, this.formRequest.payment_amount, callback, 'Số tiền đặt cọc', 0, this.getMoneyMax()), trigger: 'change' }]
      },
      status_code: {
        1: 'Đã thanh toán',
        3: 'Chưa thanh toán'
      },
      loadingSubmit: false,
      loadingTable: false,
      innerVisible: false,
      urlQRcode: null,
      formRequest: {},
      listData: []
    }
  },
  computed: {
    getMoneyPaid() {
      const money = this.listData?.filter(i => i.status === 1)?.map(i => i.payment_amount)?.reduce((a, b) => a + b, 0) || 0
      return money || 0
    },
    getMoneyDeposit() {
      const money = this.listData?.map(i => i.payment_amount)?.reduce((a, b) => a + b, 0) || 0
      return money || 0
    }
  },
  watch: {
    objectData(row) {
      console.log('row________', row)
      // return
      if (row) {
        this.onGetDetail(row.bill_code)
      }
    }
  },
  created() {
  },
  methods: {
    getMoneyMax() {
      if (this.isAdd) {
        return this.objectData.payment_amount - this.getMoneyDeposit
      } else {
        return this.objectData.payment_amount - this.getMoneyDeposit + this.infoData.payment_amount
      }
    },
    handleUpdate(item) {
      this.isAdd = false
      this.infoData = { ...item }
      this.formRequest = {
        payment_amount: item.payment_amount,
        id_general_bill: item.bill_id
      }
      this.innerVisible = true
    },
    async handleRemove(item) {
      this.$confirm(`Bạn có chắc chắn xóa mã thanh toán ${item.payment_code} ?`).then(async(_) => {
        let body = { id_general_bill: item.bill_id }
        await this.trim_string_object(body)
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        paymentHubResource.delete_general_bill_advance_money_outing(body).then(res => {
          const { error_code, error_msg } = res
          if (error_code !== 0) {
            this.$message.error(error_msg)
            return
          } else {
            this.$message.success('Xóa thành công.')

            this.onGetDetail(this.objectData.bill_code)
          }
        })
      })
    },
    handleCreate() {
      if (this.objectData.payment_amount - this.getMoneyDeposit <= 0) {
        this.$message.warning('Bạn đã đặt cọc tối đa số tiền toàn bill.')
        return
      }
      if (this.objectData.status === 1) {
        this.$message.warning('Đơn hàng đã được thanh toán.')
        return
      }
      this.isAdd = true
      this.innerVisible = true
    },
    async createQRCode(payment_amount, payment_code) {
      const region = this.regionInfo[this.currentAdmin.region]
      console.log('region_____________________', region)
      const qr_info_data = genQrCode({
        bank: region.bank,
        accountName: region.bank_account_name,
        accountNumber: region.bank_account_number,
        amount: payment_amount,
        memo: payment_code,
        template: 'compact'
      })
      console.log('qr_info_data', qr_info_data)
      const res = await qr_info_data
      this.urlQRcode = res.result
      this.dialogShowQRCode = true
    },
    downloadImage() {
      this.loadingSubmitDownQr = true
      const fileName = `QRCode.jpg`
      html2canvas(this.$refs.screenshotInvoice)
        .then((canvas) => {
          const link = document.createElement('a')
          const uri = canvas.toDataURL('image/jpeg', 1.0)
          if (typeof link.download !== 'string') {
            window.open(uri)
          } else {
            link.href = uri
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
        .finally(() => {
          this.loadingSubmitDownQr = false
        })
    },
    getDepositRate(amount) {
      const rate = (amount / this.objectData.payment_amount) * 100
      const roundedNumber = rate.toFixed(2)
      return roundedNumber || 0
    },
    onGetDetail(code_key) {
      this.loadingTable = true
      paymentHubResource.get_list_by_code({ code_key: [code_key] }).then(res => {
        const { error_code, data, error_msg } = res
        if (error_code === 0) {
          this.listData = data[0].list_code_paymnet.length > 0 ? data[0].list_code_paymnet.filter(i => i.is_cancel === 0) : []
          console.log('res__________', data)
        } else {
          this.$message.error(error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    async create_general_bill_advance_money_outing() {
      let body = {
        provider_receive_money: 'booking_new',
        payment_amount: this.formRequest.payment_amount,
        vouchers: [],
        payment_method: 'bank',
        uid: this.objectData.user_id,
        admin_id: this.objectData.admin_id,
        note: this.objectData.note,
        parent_id: this.objectData.general_bill_id,
        is_code_payment: 1,
        bill_name: this.objectData.bill_name,
        update_expiration_time: this.convertTime(this.objectData.update_expiration_time)
      }
      const getIdCodePayment = await paymentHubResource.get_id_general_bill_detail()
      body.id_general_bill_detail = getIdCodePayment.data.id_general_bill_detail
      await this.trim_string_object(body)
      const signature = await this.create_signature_hub(body)
      body = { ...body, signature }
      console.log('body_____________', body)
      this.loadingSubmit = true
      paymentHubResource.create_general_bill_advance_money_outing(body).then(res => {
        console.log('res create_general_bill_advance_money_outing', res)
        const { error_code, error_msg } = res
        if (error_code !== 0) {
          this.$message.error(error_msg)
          return
        } else {
          this.$message.success('Thêm mới thành công.')
          this.onGetDetail(this.objectData.bill_code)
          this.innerVisible = false
          this.resetFormRequest()
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async update_general_bill_advance_money_outing() {
      let body = {
        payment_amount: this.formRequest.payment_amount,
        id_general_bill: this.formRequest.id_general_bill
      }
      await this.trim_string_object(body)
      const signature = await this.create_signature_hub(body)
      body = { ...body, signature }
      console.log('body__________', body)
      this.loadingSubmit = true
      paymentHubResource.update_general_bill_advance_money_outing(body).then(res => {
        console.log('res update_general_bill_advance_money_outing', res)
        const { error_code, error_msg } = res
        if (error_code !== 0) {
          this.$message.error(error_msg)
          return
        } else {
          this.$message.success('Update thành công.')
          this.onGetDetail(this.objectData.bill_code)
          this.innerVisible = false
          this.resetFormRequest()
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async get_id_general_bill_detail() {
      paymentHubResource.get_id_general_bill_detail()
    },
    handleClose() {
      this.innerVisible = false
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (this.isAdd) this.create_general_bill_advance_money_outing()
          else this.update_general_bill_advance_money_outing()
        }
      })
    },
    convertTime(inputString) {
      // Định dạng chuỗi đầu vào sử dụng Moment.js
      const dateTimeFormat = 'HH:mm:ss,DD-MM-YYYY'
      // Chuyển đổi chuỗi thành timestamp (milliseconds từ epoch) bằng Moment.js
      const timestamp = moment(inputString, dateTimeFormat).valueOf()
      return timestamp
    },
    async resetFormRequest() {
      await Promise.resolve(
        this.formRequest = {
        }
      )
      this.$refs['ruleForm'].clearValidate()
    },
    onCloseDialog() {
      this.$emit('clickCloseDialog', { dialog: false })
    },
    handleCloseDialogCreate() {
      this.innerVisible = false
      this.loadingSubmit = false
      this.resetFormRequest()
    },
    formatNumber, formatDate, create_signature_hub, trim_string_object
  }
}
</script>
<style lang="scss" scoped>

.border-1 {
  border: 1px solid #cccccc;
  border-radius: 15px;
}

.pb-10 {
  padding-bottom: 10px;
}

.p-10 {
  padding: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.table>tbody>tr>th {
  vertical-align: middle !important;
}

.vertical-middle {
  vertical-align: middle !important;
}
</style>
