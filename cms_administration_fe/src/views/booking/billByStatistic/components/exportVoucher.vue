<template>
  <el-dialog title="Xuất chứng từ" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="loadingFrom" :rules="rules" :model="postForm" class="demo-ruleForm">
      <el-form-item>
        <el-radio-group v-model="radio" @change="handleRadio">
          <el-radio border :value="1" :label="1">Khách có MST</el-radio>
          <el-radio border :value="2" :label="2">Khách lẻ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row :gutter="20" />

      <div v-if="radio === 1">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Nhập mã số thuế khách hàng" required>
              <el-form-item prop="tax_code">
                <el-select
                  ref="searchPaxCode"
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
                  @hook:mounted="(value) => cancelReadOnly(value, 'searchPaxCode')"
                  @visible-change="(value) => cancelReadOnly(value, 'searchPaxCode')"
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
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Họ tên người mua" required>
              <el-form-item prop="name">
                <el-input v-model="postForm.name" placeholder="Nhập tên người mua" />
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã số thuê">
              <el-input v-model="postForm.tax_code" disabled placeholder="Mã số thuê" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Địa chỉ">
              <el-form-item prop="address">
                <el-input v-model="postForm.address" placeholder="Địa chỉ" />
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="arrayCodePayment.length > 1">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Có gộp đơn hay không?" required prop="is_merger">
              <el-select v-model="postForm.is_merger" class="w-100" placeholder="chọn option">
                <el-option
                  v-for="(key, value) in mergeObj"
                  :key="key"
                  :label="key"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã thông tin khách hàng" required>
              <el-form-item prop="account_object_code">
                <el-select
                  ref="searchAccount_object_code"
                  v-model="postForm.account_object_code"
                  style="width: 100%"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="Nhập code"
                  :remote-method="onSearchAccountObjectCode"
                  :loading="loadingSearchPaxCode"
                  @hook:mounted="(value) => cancelReadOnly(value, 'searchPaxCode')"
                  @visible-change="(value) => cancelReadOnly(value, 'searchPaxCode')"
                >
                  <el-option
                    v-for="(item,index) in dataAccount"
                    :key="index"
                    :label="`Code: ${item.account_object_code} - ${item.account_object_name}`"
                    :value="item.account_object_code"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Diễn giải" required>
              <el-form-item prop="journal_memo">
                <el-input v-model="postForm.journal_memo" placeholder="Nhập diễn giải" />
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Ngày chứng từ" required>
              <el-form-item prop="refdate">
                <el-date-picker
                  v-model="postForm.refdate"
                  class="w-100"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="timestamp"
                  placeholder="Ngày chứng từ"
                />
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Ngày hạch toán" required>
              <el-form-item prop="posted_date">
                <el-date-picker
                  v-model="postForm.posted_date"
                  class="w-100"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="timestamp"
                  placeholder="Ngày hạch toán"
                />
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="Ngày hóa đơn" required>
              <el-form-item prop="inv_date">
                <el-date-picker
                  v-model="postForm.inv_date"
                  class="w-100"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="timestamp"
                  placeholder="Ngày hóa đơn"
                />
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- <el-form-item label="Mã Bill :" required>
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
      </el-form-item> -->
      <el-form-item v-if="arrayCodePayment.length > 0">
        <label style="width: 100%;">Danh sách mã bill</label>
        <!-- <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">Check all</el-checkbox> -->
        <el-table
          :data="arrayCodePayment"
          width="100%"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column
            prop="bill_code"
            label="Mã bill"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.bill_code }}
            </template>
          </el-table-column>
          <el-table-column
            label="Mã thanh toán"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-row style="width: 100%;">
                <el-col v-for="code in row.data_transaction" :key="code.id" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-checkbox
                    v-model="code.checked"
                    :disabled="[STATUS_PUSH_MISA.SUCCESS, STATUS_PUSH_MISA.WAITING].includes(code.is_push_misa)"
                    :checked="code.checked"
                    :label="code.value"
                  >
                    {{ code.label }}
                  </el-checkbox>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="action"
            label="Hành động"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDetele(scope.$index, scope.row)"
              >
                Xoá
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>

      </el-form-item>
      <div v-else>
        <p style="text-align: center;">Không có thông tin bill</p>
      </div>
    </el-form>
    <el-dialog
      width="30%"
      title="Hệ thống đã xuất chứng từ các dịch vụ hợp lệ."
      :visible.sync="innerVisible"
      append-to-body
    >
      <div>
        <div v-if="listError.length > 0">
          <p style="color: red;margin:0">Lưu ý: Các đơn có dịch vụ lỗi xuất chứng từ</p>
          <el-table
            :data="listError"
            width="100%"
            :show-header="false"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :before-close="handleCloseDialogNoty"
          >
            <el-table-column
              prop="bill_code"
              label=""
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="handleSubmit('ruleForm')">Xuất</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BookingPaxResource from '@/api/BookingPax'
import { getAcountInfo } from '@/utils/auth'
import { isEmpty, validateArray, validateDate, validateText } from '@/utils/validate'
import { STATUS_PUSH_MISA } from '@/utils/status'
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
      mergeObj: { 0: 'Không', 1: 'Có' },
      innerVisible: false,
      STATUS_PUSH_MISA: STATUS_PUSH_MISA,
      radio: 1,
      dataAccount: [],
      rules: {
        inv_date: [{ validator: (rule, _, callback) => validateDate(rule, this.postForm.inv_date, callback, 'Ngày hóa đơn'), trigger: 'change' }],
        posted_date: [{ validator: (rule, _, callback) => validateDate(rule, this.postForm.posted_date, callback, 'Ngày hạch toán'), trigger: 'change' }],
        refdate: [{ validator: (rule, _, callback) => validateDate(rule, this.postForm.refdate, callback, 'Ngày chứng từ'), trigger: 'change' }],
        tax_code: [{ validator: (rule, _, callback) => validateText(rule, this.radio === 1 ? this.postForm.tax_code : 'ok', callback, 'Mã số thuế'), trigger: 'change' }],
        // product_name: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.product_name, callback, 'Tên sản phẩm'), trigger: 'change' }],
        name: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.name, callback, 'Người mua'), trigger: 'change' }],
        // address: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.address, callback, 'Địa chỉ'), trigger: 'change' }],
        general_bill_ids: [{ validator: (rule, _, callback) => validateArray(rule, this.postForm.general_bill_ids, callback, 'Mã bill'), trigger: 'change' }],
        is_merger: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.is_merger, callback, 'Yêu cầu gộp đơn'), trigger: 'change' }],
        journal_memo: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.journal_memo, callback, 'Diễn giải'), trigger: 'change' }],
        account_object_code: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.account_object_code, callback, 'Thông tin'), trigger: 'change' }]

      },
      postForm: {
        general_bill_ids: []
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
      listError: [],
      checkAll: false,
      isIndeterminate: true,
      arrayCodePayment: [],
      general_bill_id: null,
      loadingSubmit: false,
      loadingFrom: false
    }
  },
  watch: {
    listBillExport(value) {
      this.listBill = value
    },
    dialogVisible(val) {
      console.log('val____________', val)
      if (val && this.listBillExport.length > 0) {
        const arrCode = this.listBillExport?.map(item => item.bill_code)
        this.getListCodeBk(arrCode)
      }
    }
  },
  methods: {
    onSearchAccountObjectCode(keyword) {
      this.loadingSearchPaxCode = true
      const body = { account_object_code: keyword }
      bookingPaxResource.get_account_object(body).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          const body = {
            account_object_id: data.account_object_id,
            account_object_code: data.account_object_code,
            account_object_name: data.account_object_name
          }
          this.dataAccount = !isEmpty(res.data) ? [body] : []
          console.log(res)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchPaxCode = false
      })
    },
    handleCloseDialogNoty() {
      this.innerVisible = false
      this.listError = []
    },
    handleDetele(index, row) {
      console.log(index, row)
      this.arrayCodePayment.splice(index, 1)
    },
    handleCheckAllChange(val) {
      this.postForm.general_bill_ids = val ? this.arrayCodePayment.map(i => i.value) : []
      this.isIndeterminate = false
      console.log(' this.postForm.booked_ids_________', this.postForm.general_bill_ids)
    },
    handleCheckedBookedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.arrayCodePayment.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.arrayCodePayment.length
    },
    getListCodeBk(arr = []) {
      if (arr.length < 1) return
      this.loadingFrom = true
      // ------------ call api lay data provider----------------
      bookingPaxResource.listBillSearchArrayGB({ code_key: arr }).then(async res => {
        if (res.error_code === 0) {
          const data = res?.data
          console.log('............data', data)
          // ------------ loop response data----------------
          for (let i_data = 0; i_data < data.length; i_data++) {
            const item = data[i_data]
            const data_push = {
              bill_code: item.bill_code,
              general_bill_id: item.general_bill_id,
              data_transaction: []
            }
            const list_code_payment = item.list_code_paymnet
            if (list_code_payment.length > 0) {
              for (let i_code = 0; i_code < list_code_payment.length; i_code++) {
                const code = list_code_payment[i_code]
                if (code.data_transaction.length > 0) {
                  const data_transaction = {
                    id: code?.bill_id || i_code + 1,
                    ...code,
                    label: code.payment_code,
                    value: code.bill_id,
                    checked: ![this.STATUS_PUSH_MISA.SUCCESS, this.STATUS_PUSH_MISA.WAITING].includes(code.is_push_misa)
                  }
                  data_push.data_transaction.push(data_transaction)
                }
              }
            }
            this.arrayCodePayment.push(data_push)
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingFrom = false
      })
    },
    handleCloseBill(tag) {
      this.listBill.splice(this.listBill.findIndex(item => item.general_bill_id === tag.general_bill_id), 1)
      this.postForm.general_bill_ids.splice(this.postForm.general_bill_ids.indexOf(tag.general_bill_id), 1)
      this.$emit('onRemoveBillExport', tag)
    },
    async onSearchPaxCode(keyword) {
      this.loadingSearchPaxCode = true
      const body = { tax_code: keyword }
      bookingPaxResource.getDataCompanyByTaxCode(body).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.listpax = res.data
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchPaxCode = false
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
    async handleRadio(value) {
      if (value === 2) {
        this.listpax = []
        delete this.postForm.tax_code
        delete this.postForm.name
        delete this.postForm.address
      }

      this.$refs['ruleForm'].clearValidate(['tax_code', 'name', 'address'])
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
      console.log('this.arrayCodePayment_________', this.arrayCodePayment)
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (this.arrayCodePayment.length < 1) {
            this.$message.warning('Mã bill không được để trống.')
            this.loadingSubmit = false
            return
          }
          this.loadingSubmit = true
          this.postForm.employee_id = getAcountInfo().id
          let general_bill_ids = []
          for (let i = 0; i < this.arrayCodePayment.length; i++) {
            const data = this.arrayCodePayment[i]
            const checked = data.data_transaction.some(i => i.checked === false)
            if (data.data_transaction.length < 1 || !checked) {
              general_bill_ids.push(data.general_bill_id)
            } else {
              const listId = data.data_transaction?.filter(i => i.checked)?.map(i => i.value)
              general_bill_ids = [...general_bill_ids, ...listId]
            }
          }
          if (general_bill_ids.length < 1) {
            this.$message.warning('Tất cả các dịch vụ đã được xuất chứng từ.')
            this.loadingSubmit = false
            return
          }
          this.postForm.general_bill_ids = general_bill_ids
          console.log('this.arrayCodePayment________________________', this.arrayCodePayment.map(i => i.general_bill_id))
          const body = {
            ...this.postForm,
            ...this.dataAccount[0]
          }
          console.log('body________________________', body)

          bookingPaxResource.createMiSaVoucher(body).then(res => {
            if (res.error_code !== 0) {
              this.$message.error(res.error_msg)
              return
            }

            const { data } = res.data
            console.log('data__________', data)
            if (res.data.error_code !== 0) {
              this.$message.error(res.data.error_msg)
              return
            }
            if (data.list_res.length > 0) {
              const list_error = Array.from(new Set(data.list_res.filter(i => !i.Success).map(i => i.ErrorMessage)))

              if (list_error.length > 0) {
                this.listError = list_error
                this.innerVisible = true
              } else {
                this.$message.success('Hệ thống đã ghi nhận yêu cầu đồng bộ vào hàng đợi, dữ liệu sẽ được đồng bộ sang hệ thống AMIS Kế toán sớm nhất có thể. Sau khi xử lý xong yêu cầu đồng bộ, hệ thống sẽ trả kết quả đồng bộ vào đường dẫn callback mà đối tác đã cung cấp cho AMIS kế toán.')
              }
            }
            if (data.data_voucher.length > 0) {
              this.resetDataModal()
              this.$emit('onClickButtonExportVoucher', { dialog: false, reload: true })
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
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    async resetDataModal() {
      await Promise.resolve(
        (this.listpax = [],
        this.listpax = [],
        this.postForm = {
          general_bill_ids: []
        },
        this.listBill = [],
        this.general_bill_id = '',
        this.arrayCodePayment = [],
        this.dataAccount = []
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
