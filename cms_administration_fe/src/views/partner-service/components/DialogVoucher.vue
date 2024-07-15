<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="11">
          <el-form-item label="Tên đối tác">
            <el-form-item prop="partner_id">
              <el-select
                v-model="formRequest.partner_id"
                class="w-100"
                filterable
                remote
                clearable
                prop="partner_id"
                placeholder="Tên đối tác"
                :remote-method="onSearchPartner"
                :loading="loadingSearchPartner"
              >
                <el-option
                  v-for="partner in partnerList"
                  :key="partner.id"
                  :label="partner.name"
                  :value="partner.id"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Tên voucher">
            <el-form-item prop="title">
              <el-input
                v-model="formRequest.title"
                prop="title"
                placeholder="Tên voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mã voucher">
            <el-form-item prop="code">
              <el-input
                v-model="formRequest.code"
                prop="code"
                placeholder="Mã voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian bắt đầu có hiệu lực">
            <el-form-item prop="start_at">
              <el-date-picker
                v-model="formRequest.start_at"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                placeholder="Thời gian bắt đầu có hiệu lực"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian hết hiệu lực">
            <el-form-item prop="end_at">
              <el-date-picker
                v-model="formRequest.end_at"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                placeholder="Thời gian hết hiệu lực"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Số lượng voucher phát hành">
            <el-form-item prop="quantity_release">
              <el-input
                v-model="formRequest.quantity_release"
                prop="quantity_release"
                placeholder="Số lượng voucher phát hành"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="11" style="float: right;">
          <el-form-item label="Mô tả điều kiện sử dụng (Tiếng việt)">
            <el-form-item prop="condition_desc_vi">
              <el-input
                v-model="formRequest.condition_desc_vi"
                :rows="2"
                type="textarea"
                prop="condition_desc_vi"
                placeholder="Mô tả điều kiện sử dụng (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả điều kiện sử dụng (Tiếng anh)">
            <el-form-item prop="condition_desc_en">
              <el-input
                v-model="formRequest.condition_desc_en"
                :rows="2"
                type="textarea"
                prop="condition_desc_en"
                placeholder="Mô tả điều kiện sử dụng (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả phương thức thanh toán (Tiếng việt)">
            <el-form-item prop="payment_desc_vi">
              <el-input
                v-model="formRequest.payment_desc_vi"
                :rows="2"
                type="textarea"
                prop="payment_desc_vi"
                placeholder="Mô tả phương thức thanh toán (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả phương thức thanh toán (Tiếng anh)">
            <el-form-item prop="payment_desc_en">
              <el-input
                v-model="formRequest.payment_desc_en"
                :rows="2"
                type="textarea"
                prop="payment_desc_en"
                placeholder="Mô tả phương thức thanh toán (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chung (Tiếng việt)">
            <el-form-item prop="general_desc_vi">
              <el-input
                v-model="formRequest.general_desc_vi"
                :rows="2"
                type="textarea"
                prop="general_desc_vi"
                placeholder="Mô tả chung (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chung (Tiếng anh)">
            <el-form-item prop="general_desc_en">
              <el-input
                v-model="formRequest.general_desc_en"
                :rows="2"
                type="textarea"
                prop="general_desc_en"
                placeholder="Mô tả chung (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng việt)">
            <el-form-item prop="discount_desc_vi">
              <el-input
                v-model="formRequest.discount_desc_vi"
                :rows="2"
                type="textarea"
                prop="discount_desc_vi"
                placeholder="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng anh)">
            <el-form-item prop="discount_desc_en">
              <el-input
                v-model="formRequest.discount_desc_en"
                :rows="2"
                type="textarea"
                prop="discount_desc_en"
                placeholder="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row></el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { validateDate, validateText, validateEndAt, validateCodeVoucher, validateTextArea } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import PartnerServiceResource from '@/api/partner-service/partner-service'
import moment from 'moment'
import { create_signature_hub } from '@/utils/create-signnature'
import { trim_string_object } from '@/utils/trim-string-object'

const partnerServiceResource = new PartnerServiceResource()

export default {
  name: 'DialogVoucher',
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
        partner_id: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.partner_id, callback, 'Tên đối tác'),
          trigger: 'change'
        }],
        title: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.title, callback, 'Tên voucher'),
          trigger: 'change'
        }],
        start_at: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.start_at, callback, 'Thời gian bắt đầu có hiệu lực'),
          trigger: 'change'
        }],
        end_at: [{
          validator: (rule, _, callback) => validateEndAt(rule, this.formRequest.start_at, this.formRequest.end_at, callback, 'Thời gian hết hiệu lực'),
          trigger: 'change'
        }],
        code: [{
          validator: (rule, _, callback) => validateCodeVoucher(rule, this.formRequest.code, callback, 'Mã voucher'),
          trigger: 'change'
        }],
        condition_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.condition_desc_vi, callback, 'Mô tả điều kiện sử dụng (Tiếng việt)'),
          trigger: 'change'
        }],
        // condition_desc_en: [{
        //   validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.condition_desc_en, callback, 'Mô tả điều kiện sử dụng (Tiếng anh)'),
        //   trigger: 'change'
        // }],
        payment_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.payment_desc_vi, callback, 'Mô tả phương thức thanh toán (Tiếng việt)'),
          trigger: 'change'
        }],
        // payment_desc_en: [{
        //   validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.payment_desc_en, callback, 'Mô tả phương thức thanh toán (Tiếng anh)'),
        //   trigger: 'change'
        // }],
        general_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.general_desc_vi, callback, 'Mô tả chung (Tiếng việt)'),
          trigger: 'change'
        }],
        // general_desc_en: [{
        //   validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.general_desc_en, callback, 'Mô tả chung (Tiếng anh)'),
        //   trigger: 'change'
        // }],
        discount_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.discount_desc_vi, callback, 'Mô tả chi tiết về chiết khấu, quà tặng (Tiếng việt)'),
          trigger: 'change'
        }]
        // discount_desc_en: [{
        //   validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.discount_desc_en, callback, 'Mô tả chi tiết về chiết khấu, quà tặng (Tiếng anh)'),
        //   trigger: 'change'
        // }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      dialog: { titleName: 'Thêm mới voucher', buttonName: 'Thêm mới' },
      partnerList: [],
      loadingSearchPartner: false
    }
  },

  watch: {
    objectData(value) {
      if (value) {
        console.log('value', value)
        this.formRequest = value
      }
    },

    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới voucher', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật voucher', buttonName: 'Cập nhật' })
      }
    }
  },
  created() {
  },
  methods: {
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          if (this.isAdd) this.handleSubmitAdd()
        }
      })
    },

    onSearchPartner(keyword) {
      this.loadingSearchPartner = true
      partnerServiceResource.list({ name: keyword }).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.partnerList = data.data
          this.loadingSearchPartner = false
        } else {
          this.$message.error(res.message)
        }
      }).catch(_ => {
        this.loadingSearchPartner = false
      })
    },

    async handleSubmitAdd() {
      this.formRequest.start_at = moment(this.formRequest.start_at).unix() * 1000
      this.formRequest.end_at = moment(this.formRequest.end_at).unix() * 1000
      await this.trim_string_object(this.formRequest)
      const signature = await this.create_signature_hub(this.formRequest)
      this.formRequest = { ...this.formRequest, signature }

      partnerServiceResource.create_new_voucher(this.formRequest).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Thêm mới thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
    },

    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {}
      )
      this.$refs['ruleForm'].clearValidate()
    },

    formatNumber,
    create_signature_hub,
    trim_string_object
  }
}
</script>

<style scoped>
.mb-10 {
  margin-bottom: 10px;
}
</style>
