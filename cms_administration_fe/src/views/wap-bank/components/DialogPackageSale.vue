
<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="50%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24">
          <el-form-item label="Ngân hàng :" required>
            <el-form-item prop="bank_id">
              <el-select
                v-model="formRequest.bank_id"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Ngân hàng"
              >
                <el-option
                  v-for="bank in bankList"
                  :key="bank.id"
                  :label="bank.name"
                  :value="bank.id"
                />
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item label="Tên sân :" required>
            <el-form-item prop="facility_list">
              <el-select
                v-model="formRequest.facility_list"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                placeholder="Sân"
                multiple
                :remote-method="onSearchFacility"
                :loading="loadingSearchFacility"
              >
                <el-option
                  v-for="facility in facilityList"
                  :key="facility.id"
                  :label="facility.title"
                  :value="facility.id"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Loại tỉ lệ :" required>
            <el-form-item prop="type">
              <el-select
                v-model="formRequest.type"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                placeholder="Loại tỉ lệ"
              >
                <el-option
                  v-for="typePercent in typePercentList"
                  :key="typePercent.value"
                  :label="typePercent.label"
                  :value="typePercent.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Giá trị">
            <el-form-item prop="amount">
              <el-input-number
                v-model="formRequest.amount"
                placeholder="Giá trị"
                :min="1"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
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
import { validateText, validateArray } from '../../../utils/validate'
import WapBankResource from '@/api/wap-bank/wap-bank'
import FacilityResource from '@/api/facility/facility'

const facilityResource = new FacilityResource()
const wapBankResource = new WapBankResource()

export default {
  name: 'DialogPackageSale',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    organizations: {
      type: Array,
      default() {
        return []
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
        bank_id: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.bank_id, callback, 'Ngân hàng'),
            trigger: 'change'
          }
        ],
        facility_list: [
          {
            validator: (rule, _, callback) =>
              validateArray(rule, this.formRequest.facility_list, callback, 'Sân'),
            trigger: 'change'
          }
        ],
        type: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.type, callback, 'Loại tỉ lệ'),
            trigger: 'change'
          }
        ],
        amount: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.amount, callback, 'Giá trị'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: { type: 0, facility_list: [] },
      dialog: { titleName: 'Thêm mới gói bán wap', buttonName: 'Thêm mới' },
      bankList: [],
      facilityList: [],
      typePercentList: [
        { value: 0, label: 'Tăng' },
        { value: 1, label: 'Giảm' }
      ],
      loadingSearchFacility: false
    }
  },
  watch: {
    objectData(value) {
      console.log('...............vale', value)
      this.bankList = value?.bank_list
      if (!this.isAdd) {
        this.formRequest.id = value.id
        this.formRequest.bank_id = value.bank_id
        this.formRequest.facility_list = [...value.detail_facility.map((value) => value.facility_id)]
        this.formRequest.type = value.type
        this.formRequest.amount = value.amount

        this.facilityList = [...value.detail_facility.map((value) => ({ id: value.facility_id, title: value.facility_name }))]

        console.log('this.facilityList.', this.facilityList)
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới gói bán wap', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật gói bán wap', buttonName: 'Cập nhật' })
      }
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          if (this.isAdd) this.handleSubmitAdd()
          else this.handleSubmitUpdate()
        }
      })
    },
    onSearchFacility(keyword) {
      console.log('keyword......................', keyword)
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.facilityList = result.map(value => {
              return { id: value.id, title: value.sub_title }
            })
          } else {
            this.facilityList = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    async handleSubmitAdd() {
      wapBankResource.store_package_sale(this.formRequest).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.data)
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate() {
      wapBankResource.update_package_sale(this.formRequest, this.formRequest.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.data)
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async resetformRequest() {
      await Promise.resolve(
        (this.formRequest = { type: 0, facility_list: [] })
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
    }
  }
}
</script>

  <style scoped>
  .w-100 {
    width: 100%;
  }
  .mr-10 {
    margin-right: 10px;
  }
  </style>

