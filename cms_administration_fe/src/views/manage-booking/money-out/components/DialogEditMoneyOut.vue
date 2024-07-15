<!-- <template>
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
      <el-form-item label="Code chi">
        <el-form-item prop="code_payment">
          <el-input v-model="formRequest.code_payment" :disabled="!isAdd" prop="code_payment" placeholder="Code chi" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Số tiền">
        <el-form-item prop="price">
          <el-input v-model="price" :disabled="!isAdd" prop="price" placeholder="Số tiền" @input="onInputPrice" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!formRequest.is_clear || formRequest.is_clear == 0" :disabled="!isAdd" label="Mã BK">
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
              v-for="booking in bookingListQuery"
              :key="booking"
              :label="booking"
              :value="booking"
              :disabled="Boolean(codeBookings.includes(booking))"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Nhà cung cấp">
        <el-form-item prop="supplier_name">
          <el-input v-model="formRequest.supplier" :disabled="!isAdd" prop="supplier_name" placeholder="Nhà cung cấp" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Số tài khoản">
        <el-form-item prop="bank_account_number">
          <el-input v-model="formRequest.bank_account_number" :disabled="!isAdd" prop="bank_account_number" placeholder="Số tài khoản" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Nội dung TT">
        <el-form-item prop="transfer_content">
          <el-input v-model="formRequest.transfer_content" :disabled="!isAdd" prop="transfer_content" placeholder="Nội dung TT" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Loại giao dịch">
        <el-form-item prop="accounting_date">
          <el-input v-model="formRequest.accounting_date" :disabled="!isAdd" prop="accounting_date" placeholder="Nội dung TT" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { validateDate, validateText } from '../../../../utils/validate'
import { formatPrice, formatNumber } from '../../../../utils/convert'

export default {
  name: 'DialogEditMoneyOut',
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
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        date_transaction: [{ validator: (rule, _, callback) => validateDate(rule, this.formRequest.date_transaction, callback, 'Ngày'), trigger: 'change' }],
        amount_money: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.amount_money, callback, 'Số tiền'), trigger: 'change' }],
        bank_name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.bank_name, callback, 'Ngân hàng'), trigger: 'change' }]
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
      arrayUser: [],
      formLabelWidth: '200px',
      check_list: [],
      isEmpty: false,
      checkAll: false,
      isIndeterminate: true,
      amount_money: '',
      price: null
    }
  },

  watch: {
    objectData(value) {
      console.log('value0', value)
      if (!this.isAdd) {
        this.formRequest = value
        this.formRequest.supplier = value?.supplier?.name
        this.price = value.amount_money ? this.formatPrice(value.amount_money) : ''
        if (value?.code?.length > 0) {
            value?.code?.map((item) => this.codeBookings.push(item?.pax_booked?.booked?.[0]?.code_booking))
        } else {
          this.codeBookings = []
          this.check_list = []
          if (value.code_booking) {
            this.codeBookings.push(value?.code_booking)
          }
        }
      } else {
        this.formRequest.supplier = null
        this.price = null
        this.codeBookings = []
      }
    },

    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới giao dịch', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật giao dịch', buttonName: 'Cập nhật' })
      }
    }
  },
  created() {
    console.log('objectData...............', this.objectData)
  },
  methods: {
    onSearchAdmin(keyword) {
      const self = this
      const params = { keyword: keyword }
      self.loadingSearchAdmin = true
      axios.get(`${baseUrl}/api/v1/search-admin`, { params: params }).then(response => {
        if (response.status === 200) {
          const result = response.data
          if (result.error_code === 0) {
            const data = result.data.data
            if (data.length > 0) {
              const array = []
              data.map(admin => {
                const item = { value: admin.id, label: admin.name }
                array.push(item)
              })
              this.adminData = [...array]
            }
          } else {
            self.$message.error(result.message)
          }
        } else {
          self.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).finally(() => {
        self.loadingSearchAdmin = false
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
      //
    },

    async handleSubmitUpdate() {
      this.loadingSubmit = true
      await axios.post(`${baseUrl}/cms/booking-history-transaction-bank/update-money-out/${this.formRequest.id}`, this.request).then(response => {
        if (response.status == 200 && response.data.error_code == 0) {
          this.$message({
            message: 'Cập nhật thành công',
            type: 'success'
          })
          this.handleClose()
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        console.log('error', error)
      })
      this.loadingSubmit = false
      this.resetformRequest()
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
      console.log('sdfdsf')
      const inputValue = this.inputValue
      if (inputValue) {
        this.codeBookings.push(inputValue)
      }
      this.inputValue = ''
    },
    onSearchCodeBooking(keyword) {
      const self = this
      const params = { code_booking: keyword }
      self.loadingSearchCodeBooking = true
      axios.post(`${baseUrl}/api/v1/search-code-booking`, params).then(response => {
        if (response.status === 200) {
          const result = response.data
          if (result.error_code == 0) {
            const data = result.data
            self.bookingListQuery = [...data]
          } else {
            self.$message.error(result.message)
          }
        } else {
          self.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!')
        }
      }).finally(() => {
        self.loadingSearchCodeBooking = false
      })
    },
    appendForm() {
      const formData = new FormData()
      if (this.formRequest.date_transaction) {
        formData.append('date_transaction', this.formRequest.date_transaction)
      }
      if (this.price) {
        formData.append('amount_money', this.price)
      }
      if (this.codeBookings) {
        formData.append('list_code_booking', this.codeBookings)
      }
      if (this.formRequest.note) {
        formData.append('note', this.formRequest.note)
      }

      if (this.formRequest.transfer_content) {
        formData.append('transfer_content', this.formRequest.transfer_content)
      }
      if (this.formRequest.is_clear) {
        formData.append('is_clear', this.formRequest.is_clear)
      }
      if (this.check_list) {
        formData.append('check_list', this.check_list)
      }
      if (this.formRequest.bank_name) {
        formData.append('bank_name', this.formRequest.bank_name)
      }
      if (this.formRequest.transfer_content) {
        formData.append('transfer_content', this.formRequest.transfer_content)
      }
      if (this.formRequest.bank_account_number) {
        formData.append('bank_account_number', this.formRequest.bank_account_number)
      }

      this.request = formData
    },
    formatPrice, formatNumber,
    onInputPrice(value) {
      console.log('value.................', value)
      if (value) {
        this.formRequest['amount_money'] = value.toString().replaceAll('.', '')
        this.price = this.formatPrice(value)
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
  </style> -->
