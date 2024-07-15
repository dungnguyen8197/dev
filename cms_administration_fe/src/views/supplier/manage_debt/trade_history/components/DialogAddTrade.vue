<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >

    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="formRequest" class="add-trade-ruleForm">
      <el-form-item>
        <label>{{ "Số tiền thanh toán" }}<span style="color: red;">*</span></label>
        <el-form-item prop="money">
          <el-input
            v-model="formatMoney"
            required
            maxlength="20"
            prop="money"
            placeholder="Số tiền thanh toán"
            @input="handleInput"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>

      <el-form-item>
        <label>{{ "Ngày thanh toán" }}<span style="color: red;">*</span></label>
        <el-form-item prop="date_payment_format">
          <el-date-picker
            v-model="formRequest.date_payment_format"
            style="width: 100%"
            type="date"
            placeholder="Chọn ngày thanh toán"
            value-format="yyyy-MM-dd"
            @change="handleChangeDate"
          />
        </el-form-item>
      </el-form-item>

      <el-form-item>
        <label>{{ "Nhà cung cấp" }}<span style="color: red;">*</span></label>
        <el-form-item prop="shop_id">
          <el-select v-model="formRequest.shop_id" style="width: 100%" filterable placeholder="Nhà cung cấp">
            <el-option
              v-for="item in listShop"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="Chứng từ">
        <UploadContract ref="upload-contract" style="width: 200px;" />
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
import ManageDebtResource from '@/api/manage_supplier/debt'
import UploadContract from './UploadContract.vue'
import { formatNumber } from '@/utils/convert'

const manageDebtResource = new ManageDebtResource()
export default {
  name: 'DialogAddTrade',
  components: {
    UploadContract
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    formRequest: {
      type: Object,
      default: () => {
        return {
          money: '',
          date_payment_format: '',
          shop_id: '',
          list_files: []
        }
      }
    }
  },
  data() {
    return {
      rules: {
        money: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.money, callback, 'Số tiền thanh toán'),
          trigger: 'change'
        }],
        date_payment_format: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.date_payment_format, callback, 'Ngày thanh toán'),
          trigger: 'change'
        }],
        shop_id: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.shop_id, callback, 'Nhà cung cấp'),
          trigger: 'change'
        }]
      },
      dialog: {
        titleName: 'Thêm mới giao dịch',
        buttonName: 'Tạo mới'
      },
      dialogLoading: false,
      loadingSubmit: false,
      formatMoney: '',
      listShop: [],

      filterCategory: '',
      categoryOption: []
    }
  },
  watch: {
    formRequest: {
      handler(val) {
        console.log(val, 'formRequest')
      },
      deep: true
    }
  },
  created() {
    // this.$root.$on('set-image-list', () => {
    //   this.formRequest.list_files = this.$refs['upload-contract'].fileList
    //   console.log('set-image-list')
    //   // this.showDialog = false
    // })
  },
  mounted() {
    this.getListShop()
  },
  // beforeDestroy() {
  //   this.$root.$off('set-image-list')
  // },
  methods: {
    formatNumber,
    validNumber(str) {
      const reg = /^[0-9]+$/
      return reg.test(str)
    },
    getListShop() {
      manageDebtResource.listShop().then(response => {
        console.log(response, 'response')
        this.listShop = response.list
      })
    },
    handleInput(value) {
      console.log(value[value.length - 1], 'value')
      if (value) {
        if (this.validNumber(value[value.length - 1])) {
          const inputWithoutDots = value.replace(/\./g, '')
          if (!this.validNumber(inputWithoutDots)) {
            return this.$message.error('Số tiền thanh toán không hợp lệ')
          }
          const parsedValue = inputWithoutDots
          if (!isNaN(parsedValue)) {
            const formatted = this.formatNumber(parsedValue)// parsedValue.toLocaleString()
            this.formRequest.money = parsedValue
            this.formatMoney = formatted
          }
        } else {
          this.formatMoney = value.length === 1 ? '' : value.slice(0, -1)
        }
      }
    },
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.createNewTrade()
        }
      })
    },
    handleClose() {
      this.showDialog = false
      this.$parent.$emit('hide-add-tag-dialog')
    },
    createNewTrade() {
      this.dialogLoading = true
      this.formRequest.list_files = this.$refs['upload-contract'].fileList.map(item => item.url)
      manageDebtResource.updateHistoryTrade(this.formRequest).then(response => {
        console.log(response, 'responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        this.dialogLoading = false
        this.$message.success('Tạo mới giao dịch thành công')
        this.showDialog = false
        this.$parent.$emit('hide-add-tag-dialog')
        this.$parent.$emit('refresh-list-tag')
      }).catch((err) => {
        console.log(err)
        this.$message.error('Thêm mới giao dịch thất bại')
      }).finally(() => {
        this.dialogLoading = false
      })
    },
    handleChangeDate(value) {
      const date_pay = new Date(value)
      this.formRequest.date_payment = date_pay.getTime()
    }
  }
}
</script>
<style scoped>
/* ::v-deep .add-trade-ruleForm .el-upload-list--text {
  display: none;
} */
</style>
