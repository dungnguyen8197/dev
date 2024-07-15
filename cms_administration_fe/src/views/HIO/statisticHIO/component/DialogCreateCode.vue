<template>
  <el-dialog
    :title="showPopup === false ? 'Tạo mã thanh toán đại lý' : 'Mã thanh toán'"
    class="dialog-code-create"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="1000px"
  >
    <el-row>
      <el-col>
        <el-form v-if="!showPopup">
          <el-form-item>
            <el-form-item class="mr-2 mb-1">
              <label>Tìm kiếm theo thời gian:</label>
              <el-date-picker
                v-model="dateRange"
                label="Tìm kiếm theo thời gian"
                class="date-rang-history"
                type="daterange"
                range-separator="đến"
                start-placeholder="Ngày bắt đầu"
                end-placeholder="Ngày kết thúc"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item>
              <label>Giá chiết khấu</label>
              <el-input
                v-model="discount"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <label>Chọn Đại lý</label>
              <el-select
                v-model="supplierModel"
                style="width: 100%"
                filterable
                clearable
                remote
                placeholder="Tìm kiếm đại lý"
                :remote-method="onSearchSupplier"
                :loading="loadingSearchSupplier"
              >
                <el-option
                  v-for="agent in suppliers"
                  :key="agent.value"
                  :label="agent.label"
                  :value="agent.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <label>
                <span>Tổng tiền hàng trước chiết khấu:</span>
                <span>{{
                  formatNumber(tota_money_before)
                }}đ</span>
              </label>
            </el-form-item>
            <el-form-item>
              <label>
                <span>Tổng tiền hàng sau chiết khấu:</span>
                <span>{{
                  formatNumber(bodyCreateCodePayment.amount_money)
                }}đ</span>
              </label>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group v-model="bodyCreateCodePayment.list_pax_id">
                <el-checkbox
                  v-for="item in expenses"
                  :key="item.id"
                  :label="item.id"
                  @change="checkBooked($event, item.total_pay)"
                >
                  {{ item.id }} - {{ formatNumber(totalMoney(item.total_pay)) }}đ
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button @click="handleClose">Hủy bỏ</el-button>
              <el-button type="primary" :loading="loadingCreateCode" @click="handleCreate">Lưu</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>

        <el-row v-if="showPopup" id="table-vue" class="popup-row">
          <h1>Bill thanh toán đại lý {{ expenses[0].agent.name }}</h1>
          <div>
            <h3 class="ml-2">
              Tổng tiền: {{ formatNumber(bodyCreateCodePayment.amount_money) }}đ
            </h3>
          </div>
          <el-col>
            <el-col class="col-4">
              <div>
                <p v-if="expenses[0].agent.name !== 0" class="ml-2">
                  Tên đại lý: {{ `${expenses[0].agent.name}` }}
                </p>
              </div>
              <div>
                <p v-if="expenses[0].agent.code_agent !== null" class="ml-2">Mã đại lý: {{
                  expenses[0].agent.code_agent
                }} </p>
                <p v-else class="ml-2">Mã đại lý: N/A</p>
              </div>
              <div>
                <p v-if="expenses[0].agent.phone_number !== null" class="ml-2">SĐT đại lý:
                  {{ `${expenses[0].agent.phone_number}` }}</p>
                <p v-else class="ml-2">SĐT đại lý: N/A</p>
              </div>
            </el-col>
            <el-col class="col-4">
              <div>
                <p v-if="expenses[0].agent.agent_vid !== 0" class="ml-2">
                  vID đại lý: vID{{ `${expenses[0].agent.agent_vid}` }}
                </p>
                <p v-else class="ml-2">
                  vID đại lý: N/A
                </p>
              </div>
              <div>
                <p v-if="expenses[0].agent.address !== null" class="ml-2">Địa chỉ: {{ expenses[0].agent.address }} </p>
                <p v-else class="ml-2">Địa chỉ: N/A</p>
              </div>
              <div>
                <p v-if="expenses[0].agent.tax_code !== null" class="ml-2">Mã số thuế:
                  {{ `${expenses[0].agent.tax_code}` }}</p>
                <p v-else class="ml-2">Mã số thuế: N/A</p>
              </div>
            </el-col>
            <el-col class="col-4">
              <p>
                <span>Code thanh toán:</span>
                <span style="color: red; padding-left: 10px">{{ code_payment }}</span>
              </p>
              <span ref="screenshotInvoice" class="main-pd-wrapper">
                <el-image :src="urlQRcode" style="height: 70%; width: 70%;" />
              </span>
            </el-col>
            <el-table
              :data="expensesDataSelected"
              border
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="STT"
                width="50"
                class="text-center"
              />
              <el-table-column
                label="Mã BH"
              >
                <template slot-scope="scope">
                  {{ `BH${scope.row.id}` }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name_tour"
                label="Tên giải đấu"
              />
              <el-table-column prop="facility.sub_title" label="Tên Sân" />
              <el-table-column label="Mã vID/Passport">
                <template slot-scope="scope">
                  <p> {{ `vID${scope.row.user_id}` }}</p>
                </template>
              </el-table-column>
              <el-table-column label="Gói BH">
                <template slot-scope="scope">
                  <template v-if="scope.row.money.reward_value === 100000000 ">
                    <p>D100</p>
                  </template>
                  <template v-else-if="scope.row.money.reward_value === 200000000">
                    <p>D200</p>
                  </template>
                  <template v-else-if="scope.row.money.reward_value === 50000000 ">
                    <p>D50</p>
                  </template>
                  <template v-else-if="scope.row.money.reward_value === 20000000">
                    <p>D20</p>
                  </template>
                  <template v-else-if="scope.row.money.reward_value === 46000000 ">
                    <p>F10</p>
                  </template>
                  <template v-else-if="scope.row.money.reward_value === 92000000 ">
                    <p>F20</p>
                  </template>
                  <template v-else />
                </template>
              </el-table-column>
              <el-table-column label="Giá mua">
                <template slot-scope="scope">
                  {{ (scope.row.money) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}
                </template>
              </el-table-column>
              <el-table-column prop="date_played" label="Ngày chơi" />
              <el-table-column label="Ngày Tạo" prop="created_at" />
              <el-table-column label="Trạng thái gạch nợ">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status_debit === 1" type="success">Đã trả</el-tag>
                  <div v-else-if="scope.row.status_debit === 2">
                    <el-tag type="danger">Ghi nợ</el-tag>
                    <p>{{ (scope.row.money) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}</p>
                  </div>
                  <el-tag v-else-if="scope.row.status_debit === 3" type="warning">Công nợ</el-tag>

                  <!--                            <el-button size="small" v-if="scope.row.code_pay !== null"  :title="`Lịch sử thanh toán với mã GD`" @click="onShowHistoryCodePay(scope.row)" type="warning" icon="el-icon-view" circle></el-button>-->
                </template>

              </el-table-column>
              <el-table-column prop="time_pay" label="Ngày thanh toán" />
              <el-table-column label="Ghi chú">
                <template slot-scope="scope">
                  {{ (scope.row.note) }}
                </template>
              </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
              <el-link @click="exportToPDF()">Download to PDF</el-link>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { convertDate, convertDateTime, formatNumber } from '@/utils/convert'
import html2pdf from 'html2pdf.js'
import { genQrCode } from '@/utils/vietqr'
import AgentHIOResource from '@/api/HIO/agentHIO'

const typeServiceResource = new AgentHIOResource()

import {
  convertIsPayToString,
  convertSourceBuyToString,
  convertIsSendPviToString
} from '@/utils/insurance/convertNumberToString'
import { isEmpty } from '@/utils/validate'
import { getAdmin } from '@/utils/auth'
import { pickerOptions } from '@/utils/dateRangOptions'

export default {
  name: 'DialogCreateCode',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value2: [new Date(), new Date()],
      loadingSearchSupplier: false,
      suppliers: [],
      listQuery: Object.assign({}),
      expenses: [],
      supplierModel: '',
      moneyDiscount: 0,
      discount: 0,
      loadingTable: false,
      checked: false,
      booked: [],
      ids: [],
      total_money: 0,
      loadingSubmit: false,
      showEditPrice: false,
      showPopup: false,
      loadingCreateCode: false,
      code_payment: '',
      urlQRcode: '',
      tota_money_before: 0,
      bodyCreateCodePayment: {
        list_pax_id: [],
        supplier_id: 0,
        amount_money: 0,
        cms_id: getAdmin().id
      },
      expensesDataSelected: [],
      dateRange: [],
      pickerOptions: {
        shortcuts: pickerOptions
      }
    }
  },
  watch: {
    supplierModel(val) {
      if (val) {
        this.listQuery.agent_id = val
        this.bodyCreateCodePayment.supplier_id = val
        this.requestExpenseList()
      }
    },
    dateRange(value) {
      console.log('value.........', value)
      if (value) {
        this.listQuery.dateStart = this.convertDate(value[0], 'YYYY-MM-DD')
        this.listQuery.dateEnd = this.convertDate(value[1], 'YYYY-MM-DD')
      }
    }
  },
  methods: {
    convertDate,
    convertDateTime,
    convertIsPayToString,
    convertSourceBuyToString,
    convertIsSendPviToString,
    EditPrice() {
      this.showEditPrice = true
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.number + index + 1
    },
    handleCreate() {
      if (isEmpty(this.supplierModel)) {
        this.$message.error('Vui lòng chọn đại lý')
        return
      }
      if (this.bodyCreateCodePayment.list_pax_id.length === 0) {
        this.$message.error('Vui lòng chọn đơn hàng')
        return
      }
      console.log('this.bodyCreateCodePayment...............', this.bodyCreateCodePayment)
      this.loadingCreateCode = true
      typeServiceResource.createCodePayment(this.bodyCreateCodePayment).then(async res => {
        const { error_code, error_msg, data } = res
        if (error_code === 0) {
          // lấy tất cả đơn hàng có id this.bodyCreateCodePayment.list_pax_id xuất hiện trong mảng res.data.data[0] và gán vào this.expensesDataSelected
          this.expensesDataSelected = this.expenses.filter(item => this.bodyCreateCodePayment.list_pax_id.includes(item.id))
          console.log('this.expensesDataSelected', this.expensesDataSelected)
          // this.$message.success(error_msg)
          this.code_payment = data
          this.showPopup = true
          this.supplierModel = ''
          const qr_info_data = genQrCode({
            bank: 970428,
            accountName: 'CONG TY CO PHAN DICH VU DAT SAN GOLF VIET NAM',
            accountNumber: 131355899,
            amount: this.bodyCreateCodePayment.amount_money,
            memo: this.code_payment,
            template: 'compact'
          })
          console.log('qr_info_data', qr_info_data)
          const res = await qr_info_data
          this.urlQRcode = res.result
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingCreateCode = false
      })
    },

    checkBooked($event, expense) {
      console.log($event, expense)
      if (!$event) {
        this.bodyCreateCodePayment.amount_money -= expense
      } else {
        this.bodyCreateCodePayment.amount_money += expense
      }
    },
    async onSearchSupplier(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchAgency = true
      typeServiceResource.searchAgentNew({ keyword: keywords }).then(res => {
        const data = res.data.data
        const array = []
        if (data.length > 0) {
          data.map(value => {
            const item = { label: `${value.name}`, value: value.id }
            array.push(item)
          })
        }
        this.suppliers = [...array]
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchAgency = false
    },
    totalMoney(expense) {
      if (expense) {
        const gia_nhap_pax = expense
        return gia_nhap_pax
      }
    },
    requestExpenseList() {
      this.loadingTable = true
      this.bodyCreateCodePayment.amount_money = 0
      this.tota_money_before = 0
      this.moneyDiscount = (this.discount) / 100
      console.log('ádsadsadsweqwe', this.moneyDiscount)

      typeServiceResource.listDebitInsuranceByAgentCode(this.listQuery).then(res => {
        this.loadingTable = false
        if (res.error_code === 0) {
          this.expenses = res.data.data[0]
          console.log('expexxxxxx', this.discount)
          this.expenses.map((item) => {
            this.tota_money_before += this.totalMoney(item.total_pay)
            this.bodyCreateCodePayment.amount_money += this.totalMoney(item.total_pay) - (this.totalMoney(item.total_pay) * this.moneyDiscount)
          })
          this.bodyCreateCodePayment.list_pax_id = this.expenses.map(d => d.id)
        }
      })
    },
    async onCreateQR(row) {
      const qr_info_data = genQrCode({
        bank: 970428,
        accountName: 'CTCP CN MANG LUOI TINH DIEM CHAP GOLF QUOC TE',
        accountNumber: 181833888,
        amount: row.money,
        memo: row.code,
        template: 'compact'
      })
      console.log('qr_info_data', qr_info_data)
      const res = await qr_info_data
      this.urlQRcode = res.result
      this.dialogShowQRCode = true
    },

    exportToPDF() {
      var element = document.getElementById('table-vue')
      var opt = {
        margin: 1,
        filename: 'certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(element).save()
      html2pdf(element, opt)
    },
    handleClose() {
      this.showPopup = false
      this.supplierModel = ''
      this.bodyCreateCodePayment.amount_money = ''
      this.expenses = []
      this.$emit('clickButtonDialog', { dialog: false, reload: false })
    },
    formatNumber
  }
}
</script>

<style>
.dialog-code-create .el-dialog .el-dialog__header .el-dialog__title {
  font-size: 24px;
}

.dialog-code-create .el-dialog {
  font-family: Sans-serif;
}

.dialog-code-create .el-dialog .el-dialog__body .el-button, .dialog-code-create .el-dialog .el-dialog__body p, .dialog-code-create .el-dialog .el-dialog__body .el-checkbox__label, .dialog-code-create .el-dialog .el-dialog__body .el-input__inner, .dialog-code-create .el-dialog .el-dialog__body .el-range-input, .dialog-code-create .el-dialog .el-dialog__body label {
  font-size: 16px;
}
</style>
