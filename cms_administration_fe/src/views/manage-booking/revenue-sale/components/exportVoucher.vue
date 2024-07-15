<template>
  <el-dialog title="Xuất chứng từ" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form ref="ruleForm" :rules="rules" :model="postForm" class="demo-ruleForm">
      <el-form-item>
        <el-radio-group v-model="radio" @change="handleRadio">
          <el-radio border :value="1" :label="1">Khách có MST</el-radio>
          <el-radio border :value="2" :label="2">Khách lẻ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Nhập mã số thuế khách hàng" required>
        <el-form-item prop="tax_code">
          <el-select
            v-model="postForm.tax_code"
            :disabled="radio === 2"
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="Nhập mã số thuế của khách"
            :remote-method="onSearchPaxCode"
            :loading="loadingSearchPaxCode"
            @change="handleTaxCode"
          >
            <el-option
              v-for="(pax,index) in listpax"
              :key="index"
              :label="pax.companyName + ' - Mã thuế: ' + pax.taxCode"
              :value="pax.taxCode"
            />
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="Tên sản phẩm" required>
        <el-form-item prop="product_name">
          <el-input v-model="postForm.product_name" placeholder="Nhập tên sản phẩm" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Họ tên người mua" required>
        <el-form-item prop="name">
          <el-input v-model="postForm.name" placeholder="Nhập tên người mua" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Mã số thuê">
        <el-input v-model="postForm.tax_code" disabled placeholder="Mã số thuê" />
      </el-form-item>
      <el-form-item label="Địa chỉ" required>
        <el-form-item prop="address">
          <el-input v-model="postForm.address" placeholder="Địa chỉ" />
        </el-form-item>      </el-form-item>
      <el-form-item label="Mã Bill :" required>
        <el-form-item prop="general_bill_ids">
          <el-tag
            v-for="(bill,index) in listBill"
            :key="index"
            style="margin-right: 10px;"
            closable
            type="primary"
            @close="handleCloseBill(bill)"
          >
            Code: {{ bill.bill_code }}
          </el-tag>
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="handleSubmit('ruleForm')">Xuất</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import BookingPaxResource from '@/api/BookingPax'
import { getAcountInfo } from '@/utils/auth'
import { validateArray, validateText } from '@/utils/validate'

const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'ExportVoucher',
  props: {
    listBillExport: {
      type: Array,
      default() {
        return []
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio: 1,
      rules: {
        tax_code: [{ validator: (rule, _, callback) => validateText(rule, this.radio === 1 ? this.postForm.tax_code : 'ok', callback, 'Mã số thuế'), trigger: 'change' }],
        product_name: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.product_name, callback, 'Tên sản phẩm'), trigger: 'change' }],
        name: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.name, callback, 'Người mua'), trigger: 'change' }],
        address: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.address, callback, 'Địa chỉ'), trigger: 'change' }],
        general_bill_ids: [{ validator: (rule, _, callback) => validateArray(rule, this.postForm.general_bill_ids, callback, 'Mã bill'), trigger: 'change' }]
      },
      postForm: {
      },
      payments: [
        { id: 0, name: 'Chuyển khoản' },
        { id: 1, name: 'Tiền mặt' },
        { id: 2, name: 'Chuyển khoản / tiền mặt' }
      ],
      paxCode: null,
      loadingSearchPaxCode: false,
      loadingSearchBill: false,
      listpax: [],
      listBill: [],
      general_bill_id: null,
      loadingSubmit: false
    }
  },
  watch: {
    listBillExport(value) {
      this.listBill = value
      this.postForm.general_bill_ids = value?.map(item => item.general_bill_id)
    }
  },
  methods: {
    handleCloseBill(tag) {
      this.listBill.splice(this.listBill.findIndex(item => item.general_bill_id === tag.general_bill_id), 1)
      this.postForm.general_bill_ids.splice(this.postForm.general_bill_ids.indexOf(tag.general_bill_id), 1)
      this.$emit('onRemoveBillExport', tag)
    },
    async onSearchPaxCode(keyword) {
      this.loadingSearchPaxCode = true
      const configHeader = {
        project: 'VGS',
        apikey: '6PTi057KDbwDrNXAuvQCF5D2RIyOW4Cv'
      }
      const data = { input: keyword }
      await axios.get('https://test-org.misa.com.vn/ms-org/v1/search', { headers: configHeader, params: data }).then(res => {
        this.loadingSearchPaxCode = false
        const { data } = res
        this.listpax = data.data
      })
    },
    onSearchBill(keyword) {
      const body = {
        code_key: keyword,
        page: 1,
        limit: 10
      }
      this.loadingSearchBill = true
      bookingPaxResource.listBill(body).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.listBill = res?.data?.bill?.bill_list.filter(item => item.misa_voucher_status === 0 || item.misa_voucher_status === 2)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchBill = false
      })
    },
    handleRadio(value) {
      if (value === 2) {
        this.listpax = []
        delete this.postForm.tax_code
      }
    },
    handleTaxCode(value) {
      if (value) {
        const pax = this.listpax.find(item => item.taxCode === value)
        this.postForm.tax_code = pax.taxCode
        this.postForm.address = pax.address
        this.postForm.name = pax.companyName
      }
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.loadingSubmit = true
          this.postForm.employee_id = getAcountInfo().id
          // if (this.postForm.general_bill_ids.length < 1) {
          //   this.$message.warning('Mã bill không được để trống.')
          //   this.loadingSubmit = false
          //   return
          // }
          bookingPaxResource.createMiSaVoucher(this.postForm).then(res => {
            if (res.error_code === 0) {
              this.$emit('onClickButtonExportVoucher', { dialog: false, reload: true })
              this.$message.success('Xuất chứng từ thành công')
              this.resetDataModal()
            } else {
              this.$message.error(res.error_msg)
            }
          }).finally(() => {
            this.loadingSubmit = false
          })
        }
      })
    },
    handleClose() {
      this.$emit('onClickButtonExportVoucher', { dialog: false, reload: false })
      this.resetDataModal()
    },
    async resetDataModal() {
      await Promise.resolve(
        (this.listpax = [],
        this.listpax = [],
        this.postForm = {},
        this.listBill = [],
        this.general_bill_id = ''
        )
      )
      this.$refs['ruleForm'].clearValidate()
    }
  }
}
</script>

<style scoped>
.mt-10 {
  margin-bottom: 10px
}
</style>
