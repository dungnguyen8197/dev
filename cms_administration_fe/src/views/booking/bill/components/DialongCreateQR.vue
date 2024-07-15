<template>
  <el-dialog
    title="Tạo mã QR"
    width="50%"
    :before-close="onCloseDialog"
    :visible.sync="showDialog"
  >
    <div class="filter-container">
      <el-row>
        <el-col :sm="24" :md="10" :lg="10" class="mr-10">
          <el-select
            ref="SearchBill"
            v-model="modelBill"
            class="w-100"
            filterable
            multiple
            remote
            clearable
            no-data-text="Đơn hàng không tồn tại hoặc chưa được xác nhận."
            reserve-keyword
            placeholder="Nhập mã thanh toán"
            :remote-method="onSearchBill"
            :loading="loadingSearchBill"
            @change="handleQRBill"
            @hook:mounted="(value) => cancelReadOnly(value, 'SearchBill')"
            @visible-change="(value) => cancelReadOnly(value, 'SearchBill')"
          >
            <el-option
              v-for="(bill, key) in dataBill"
              :key="key"
              :label="`Mã bill: ${bill?.id} - Mã thanh toán: ${bill?.payment_code} - Giá: ${formatNumber(bill?.payment_amount)} VNĐ`"
              :value="bill.id
              "
            />
          </el-select>

        </el-col>
        <el-col :sm="24" :md="4" :lg="4">
          <el-button type="primary" :loading="btnLoading" @click="createQRCode">Tạo QR</el-button>
        </el-col>
        <el-col v-if="total_payment" :sm="24" :md="4" :lg="2">
          <el-button>Tổng tiền : {{ formatNumber(total_payment) }} VNĐ </el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="urlQRcode">
      <el-row>
        <el-col :sm="24" :md="12" :lg="{span:12,offset: 6}">
          <section ref="screenshotInvoice" class="main-pd-wrapper">
            <el-image :src="urlQRcode" style="height: 100%; width: 100%;" />
          </section>
          <span class="dialog-footer">
            <el-button type="primary" icon="el-icon-upload" :loading="loadingSubmitDownQr" @click="downloadImage">
              Download
            </el-button>
          </span>
        </el-col>
      </el-row>
    </div>

  </el-dialog>

</template>

<script>
import BookingPaxResource from '@/api/BookingPax'
// import { isEmpty } from '@/utils/validate'
import { getAcountInfo } from '@/utils/auth'
import { genQrCode } from '@/utils/vietqr'
import html2canvas from 'html2canvas'
import { TYPE_REGION, REGION_INFO } from '@/utils/constant'
import { formatNumber } from '@/utils/convert'
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogSendMail',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
      value: false
    }
  },
  data() {
    return {
      region: TYPE_REGION,
      region_info: REGION_INFO,
      btnLoading: false,
      loadingDialog: false,
      urlQRcode: null,
      currentAdmin: getAcountInfo(),
      loadingSearchBill: false,
      loadingSubmitDownQr: false,
      dataBill: [],
      modelBill: [],
      total_payment: null,
      billSelectHistory: [],
      memo: ''
    }
  },
  watch: {
    // dialogSendMail(value) {
    //   console.log('dialogSendMail...........', value)
    // }
    // objectData(value) {
    //   console.log('objectData..........', value)
    //   if (!isEmpty(value)) {
    //     this.onGetDetail(value.general_bill_id)
    //   }
    // }
  },
  created() {
  },
  methods: {
    handleQRBill(val) {
      this.memo = ''
      console.log('handleQRBill...........', val)
      const valueBill = this.dataBill.filter(item => val.includes(item.id))
      this.billSelectHistory = [...valueBill, ...this.billSelectHistory]
      console.log('handleQRBill...........', this.billSelectHistory)
      this.total_payment = 0
      this.urlQRcode = null
      const data = this.billSelectHistory?.filter(item => val.includes(item.id))

      // loại bỏ có phần tử bị trùng general_bill_id trong mảng data
      const dataFilter = data.filter((obj, index, self) =>
        index === self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))
      )
      console.log('handleQRBill...........', dataFilter)
      dataFilter.forEach(item => {
        this.memo += ' ' + item.payment_code
        this.total_payment += item.payment_amount
      })
    },
    onCloseDialog() {
      this.total_payment = null
      this.urlQRcode = null
      this.dataBill = []
      this.modelBill = []
      this.$emit('clickCloseDialog', true)
      this.billSelectHistory = []
    },
    async sendMail() {
      this.btnLoading = true

      this.btnLoading = false
      this.onCloseDialog()
    },
    async onSearchBill(val) {
      const query = {
        page: 1,
        limit: 10,
        code_key: val,
        is_code_payment: 1
      }
      this.loadingSearchBill = true
      bookingPaxResource.listBill(query).then(res => {
        console.log(res)

        if (res.error_code === 0) {
          const data = res?.data?.bill_list?.filter(item => +item.status !== 0)
          console.log('............data', data)
          let currentBill = []
          if (this.modelBill > 0) {
            currentBill = this.dataBill.filter(item => this.modelBill.includes(item.id))
          }
          this.dataBill = [...data, ...currentBill].filter((obj, index, self) =>
            index === self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))
          )
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchBill = false
      })
    },
    async createQRCode() {
      if (this.modelBill.length < 1) {
        this.$message.warning('Mã bill không được bỏ trống.')
        return
      }
      this.btnLoading = true
      // const memo = this.dataBill?.filter(item => this.modelBill?.includes(item.general_bill_id)).map(item => item.code).join(' - ')
      const region = this.region_info[this.currentAdmin.region]
      const qr_info_data = genQrCode({
        bank: region.bank,
        accountName: region.bank_account_name,
        accountNumber: region.bank_account_number,
        amount: this.total_payment,
        memo: this.memo,
        template: 'compact'
      })
      console.log('qr_info_data', qr_info_data)
      const res = await qr_info_data
      console.log('res____________________', res)
      this.urlQRcode = res.result
      this.$message.success('Tạo mã Qr thành công.')
      this.btnLoading = false
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
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    formatNumber
  }
}
</script>
<style lang="scss" scoped>

.border-1 {
  border: 1px solid #ccc;
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
