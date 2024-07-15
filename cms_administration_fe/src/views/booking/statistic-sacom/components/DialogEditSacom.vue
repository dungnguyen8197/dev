<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên khách hàng">
        <el-form-item prop="name">
          <el-input
            v-model="formRequest.name"
            prop="name"
            placeholder="Tên khách hàng"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="CCCD/Passport" required>
        <el-form-item prop="passport">
          <el-input
            v-model="formRequest.passport"
            prop="passport"
            placeholder="CCCD/Passport"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Loại thẻ">
        <el-form-item prop="type_card">
          <el-select
            v-model="formRequest.type_card"
            class="w-100"
            prop="type_card"
            placeholder="Chọn loại thẻ"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          >
            <el-option
              v-for="type_card in listTypeCard"
              :key="type_card.value"
              :label="type_card.label"
              :value="type_card.value"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Chủ thẻ">
        <el-form-item prop="owner_number">
          <el-input
            v-model="formRequest.owner_number"
            prop="owner_number"
            :disabled="true"
            placeholder="Chủ thẻ"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Người đi cùng">
        <el-form-item prop="partner_number">
          <el-input
            v-model="formRequest.partner_number"
            prop="partner_number"
            placeholder="Người đi cùng"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Ghi chú: Người đi cùng">
        <el-form-item prop="note">
          <el-input
            v-model="formRequest.note"
            prop="note"
            placeholder="Ghi chú: Người đi cùng"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Tổng">
        <el-form-item prop="total_number">
          <el-input
            v-model="formRequest.total_number"
            prop="total_number"
            placeholder="Tổng"
            :disabled="true"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Ngày chơi">
        <el-form-item prop="date_played">
          <el-date-picker
            v-model="formRequest.date_played"
            style="width: 100%;"
            type="datetime"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            :disabled="true"
            placeholder="Ngày chơi"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Đơn giá">
        <el-form-item prop="unit_amount">
          <el-input
            v-model="formRequest.unit_amount"
            prop="unit_amount"
            placeholder="Đơn giá"
            :disabled="true"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Thành tiền">
        <el-form-item prop="total_amount">
          <el-input
            v-model="formRequest.total_amount"
            prop="total_amount"
            placeholder="Thành tiền"
            :disabled="true"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
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
import { validateText } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import ControlBankResource from '@/api/ControlBank'

const controlBankResource = new ControlBankResource()

export default {
  name: 'DialogEditSacom',
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
        passport: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.passport, callback, 'CCCD/Passport'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: { name: '', passport: '', note: '', unit_amount: '', partner_number: '', type_card: '' },
      request: {},
      dialog: { titleName: 'THÊM MỚI LƯỢT CHƠI', buttonName: 'Thêm mới' },
      formLabelWidth: '200px',
      listTypeCard: [
        { label: 'Thẻ Infinite - Miễn Phí', value: 1 },
        { label: 'Thẻ World MC - Giảm Phí', value: 2 },
        { label: 'Thẻ World MC - Miễn Phí', value: 3 },
        { label: 'Thẻ VIP - Miễn Phí', value: 4 },
        { label: 'Thẻ Infinite FLC - Miễn phí', value: 5 }
      ]
    }
  },

  watch: {
    objectData(value) {
      console.log('value', value)
      this.formRequest.name = value.real_name
        ? value.real_name
        : value.golfer
          ? value.golfer.fullname
          : value.name_out_system
      this.formRequest.passport = value?.passport
      this.formRequest.type_card = value.type_card ? value.type_card : ''
      this.formRequest.owner_number = 1
      this.formRequest.date_played = value.date_played
      this.formRequest.partner_number = value.partner_number
      // this.formRequest.total_number = value.partner_number ? 1 + +value.partner_number : 1;
      this.formRequest.unit_amount = value.price_sacom
        ? !this.isWeekend(new Date(value.date_played))
          ? value.price_sacom.normal_price
          : value.price_sacom.holiday_price
        : ''
      this.formRequest.note = value.note
      this.formRequest.id = value.id
    },
    'formRequest.unit_amount'(value) {
      if (value) {
        this.formRequest.total_amount = value * +this.formRequest.total_number
      }
    },
    'formRequest.partner_number'(value) {
      this.formRequest.total_number = +value + 1
      this.formRequest.total_amount = this.formRequest.total_number * this.formRequest.unit_amount
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'THÊM MỚI LƯỢT CHƠI', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'CẬP NHẬT LƯỢT CHƠI', buttonName: 'Cập nhật' })
      }
    },

    codeBookings(value) {
      this.arrayUser = []
      this.check_list = []
      console.log('check_list...........................', this.check_list)
      this.onGetBookedByCodeBooking(value)
    }
  },
  created() {
    console.log('objectData...............', this.objectData)
  },
  methods: {
    isWeekend(date = new Date()) {
      return date.getDay() % 6 === 0
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          this.handleSubmitUpdate()
        }
      })
    },

    async handleSubmitUpdate() {
      console.log('this.request', this.request)
      console.log('this.formRequest', this.formRequest)
      this.loadingSubmit = true
      controlBankResource.updateSacom(this.request, this.formRequest.id).then(response => {
        if (response.error_code === 0) {
          this.$message({
            message: 'Cập nhật thành công',
            type: 'success'
          })
          this.$emit('onCloseDialog', { dialog: true, reload: true })
          this.resetFormRequest()
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      }).catch((error) => {
        console.log('error', error)
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    async resetFormRequest() {
      this.formRequest = { name: '', passport: '', note: '', unit_amount: '', partner_number: '' }
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetFormRequest()
    },

    appendForm() {
      const formData = new FormData()

      const formRequest = this.formRequest

      Object.keys(formRequest).forEach(function(key) {
        formData.append(key, formRequest[key])
      })

      this.request = formData
    },
    formatNumber
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
</style>
