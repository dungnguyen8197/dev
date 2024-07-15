
<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="50%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24">
          <el-form-item label="Tên chiến dịch">
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                placeholder="Tên chiến dịch"
                :min="1"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Ngân hàng :" required>
            <el-form-item prop="bank_list">
              <el-select
                v-model="formRequest.bank_list"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                multiple
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
          <el-form-item label="Thời gian bắt đầu :" required>
            <el-form-item prop="time_active_start">
              <el-date-picker
                v-model="formRequest.time_active_start"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian bắt đầu"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian kết thúc :" required>
            <el-form-item prop="time_active_end">
              <el-date-picker
                v-model="formRequest.time_active_end"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian kết thúc"
              />
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item label="Chọn tag :" required>
            <el-form-item prop="tag_list">
              <el-select
                v-model="formRequest.tag_list"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                placeholder="Chọn tag"
                multiple
              >
                <el-option
                  v-for="tag in tagList"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </el-form-item>
          </el-form-item> -->
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
import moment from 'moment'
const facilityResource = new FacilityResource()
const wapBankResource = new WapBankResource()

export default {
  name: 'DialogWapPreferentialPrice',
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
        name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.name, callback, 'Tên chiến dịch'),
            trigger: 'change'
          }
        ],
        bank_list: [
          {
            validator: (rule, _, callback) =>
              validateArray(rule, this.formRequest.bank_list, callback, 'Ngân hàng'),
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
        ],
        time_active_start: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.time_active_start, callback, 'Ngày bắt đầu'),
            trigger: 'change'
          }
        ],
        time_active_end: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.time_active_end, callback, 'Ngày kết thúc'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: { type: 0, facility_list: [], bank_list: [], tag_list: [1, 2] },
      dialog: { titleName: 'Thêm mới tỉ lệ giá bán', buttonName: 'Thêm mới' },
      bankList: [],
      facilityList: [],
      tagList: [],
      typePercentList: [
        { value: 0, label: 'Tăng' },
        { value: 1, label: 'Giảm' }
      ],
      loadingSearchFacility: false
    }
  },
  watch: {
    objectData(value) {
      this.formRequest.tag_list = ['Đã booked', 'Đang bán chạy']
      console.log('...............vale', value)
      this.bankList = value?.bank_list
      this.tagList = value?.tag_list
      if (!this.isAdd) {
        this.formRequest.id = value.id
        this.formRequest.bank_list = [...new Set(value.detail_discount_price.map((value) => value.bank_id))]
        this.formRequest.facility_list = [...new Set(value.detail_discount_price.map((value) => value.facility_id))]
        // this.formRequest.tag_list = [...new Set(value.detail_discount_price.map((value) => value.tag_id))]

        this.formRequest.type = value.type
        this.formRequest.amount = value.amount
        this.formRequest.name = value.name
        this.formRequest.time_active_start = moment(value.time_active_start).format('yyyy-MM-DD HH:mm:ss')
        this.formRequest.time_active_end = moment(value.time_active_end).format('yyyy-MM-DD HH:mm:ss')

        const uniqueFacilitySet = new Set(value.detail_discount_price.map(item => JSON.stringify({ id: item.facility_id, title: item.facility_name })))
        const uniqueFacilityArray = [...uniqueFacilitySet].map(JSON.parse)
        this.facilityList = uniqueFacilityArray
        // this.bankList = [...new Set(value.detail_discount_price.map(item => JSON.stringify({ id: item.bank_id, name: item.bank_name })))].map(JSON.parse)
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới tỉ lệ giá bán', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật tỉ lệ giá bán', buttonName: 'Cập nhật' })
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
      wapBankResource.store_discount_price(this.formRequest).then(res => {
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
      wapBankResource.update_discount_price(this.formRequest, this.formRequest.id).then(res => {
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
        (this.formRequest = { type: 0, facility_list: [], bank_list: [], tag_list: [1, 2] })
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

