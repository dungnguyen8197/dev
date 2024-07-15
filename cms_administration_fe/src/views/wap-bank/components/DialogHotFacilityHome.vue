
<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="50%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24">
          <!-- <el-form-item label="Khoảng thời gian tìm kiếm:" required> -->
          <el-form-item prop="dateRange">
            <el-date-picker
              v-model="dateRange"
              clearable
              label="Ngày tạo"
              size="small"
              style="width: 100%"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy HH:mm:ss"
              start-placeholder="Bắt đầu"
              end-placeholder="Kết thúc"
              :default-time="['00:00:00', '23:59:00']"
            />
          </el-form-item>
          <!-- </el-form-item> -->
          <!-- <el-form-item label="Chiến dịch :" required> -->
          <el-form-item v-show="dateRange" prop="campaign_id">
            <el-select
              v-if="campaignList.length > 0"
              v-model="formRequest.campaign_id"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Chiến dịch"
            >
              <el-option
                v-for="campaign in campaignList"
                :key="campaign.id"
                :label="campaign.name"
                :value="campaign.id"
              />
            </el-select>
            <span v-else style="width: 100%">Không có dữ liệu</span>
          <!-- </el-form-item> -->
          </el-form-item>
          <!-- <el-form-item v-show="formRequest.campaign_id" label="Ngân hàng :" required> -->
          <el-form-item v-show="formRequest.campaign_id" prop="bank_list">
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
          <!-- </el-form-item> -->
          <!-- <el-form-item v-show="formRequest.campaign_id" label="Tên sân :" required> -->
          <el-form-item v-show="formRequest.campaign_id" prop="facility_list">
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
          <!-- </el-form-item> -->
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
  name: 'DialogHotFacilityHome',
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
        campaign_id: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.campaign_id, callback, 'Chiến dịch'),
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
        ]
      },
      dateRange: '',
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: { type: 0, facility_list: [] },
      dialog: { titleName: 'Chọn sân giá tốt hiển thị màn Home', buttonName: 'Thêm mới' },
      bankList: [],
      facilityList: [],
      campaignList: [],
      typePercentList: [
        { value: 0, label: 'Tăng' },
        { value: 1, label: 'Giảm' }
      ],
      loadingSearchFacility: false
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.formRequest.start_date)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        const time_active_start = moment(value[0]).unix()
        const time_active_end = moment(value[1]).unix()
        this.onGetListCampaign({ time_active_start, time_active_end })
      } else {
        this.campaignList = []
      }
    },
    'formRequest.campaign_id'(val) {
      if (val) {
        const campaign = this.campaignList.find(item => +item.id === +val)
        console.log('campaign............', campaign)
        if (Object.keys(campaign).length > 0) {
          this.bankList = [...new Set(campaign.detail_discount_price.map(item => JSON.stringify({ id: item.bank_id, name: item.bank_name })))].map(JSON.parse)
          this.facilityList = [...new Set(campaign.detail_discount_price.map(item => JSON.stringify({ id: item.facility_id, title: item.facility_name })))].map(JSON.parse)
        }
      } else {
        delete this.formRequest.bank_list
        delete this.formRequest.facility_list
      }
    }
  },
  methods: {
    async onGetListCampaign(query) {
      this.loadingTable = true
      wapBankResource.list_discount_price(query).then(res => {
        const { error_code, data, error_msg } = res
        console.log('data.............', data)
        if (error_code === 0) {
          this.campaignList = data.data
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          this.handleSubmitAdd()
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
      wapBankResource.store_hot_facility_home(this.formRequest).then(res => {
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
      this.dateRange = ''
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

