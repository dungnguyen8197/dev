<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="60%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tài khoản " prop="name">
        <el-input v-model="formRequest.name" placeholder="Tên tài khoản" @keyup.enter.native="onSubmitForm('ruleForm')" />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="formRequest.phone" placeholder="Số điện thoại" @keyup.enter.native="onSubmitForm('ruleForm')" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="formRequest.email" placeholder="Email" @keyup.enter.native="onSubmitForm('ruleForm')" />
      </el-form-item>
      <el-form-item label="Chọn option view sân:">
        <el-radio-group v-model="typeChooseFacility">
          <el-radio :label="1"> View all sân</el-radio>
          <el-radio :label="0"> Chọn sân</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="typeChooseFacility === 0" label="Chọn danh sách sân">
        <el-select
          v-model="dataFacility"
          multiple
          class="w-100"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="Nhập tên sân"
          :remote-method="onSearchFacility"
          :loading="loadingSearchUser"
        >
          <el-option v-for="facility in facilities" :key="facility.value" :label="facility.label" :value="facility.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Duyệt tài khoản">
        <el-switch
          v-model="formRequest.is_active"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="0"
          :inactive-value="1"
        />
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
// import moment from 'moment'
import { formatNumber } from '@/utils/convert'
import FacilityResource from '@/api/facility/facility'
import AccountResource from '@/api/account'
import { validateEmail, validatePhoneNumber, validateText } from '@/utils/validate'
const facilityResource = new FacilityResource()
const accountResource = new AccountResource()

const arrayStatus = [
  { value: 1, label: 'Hiển thị' },
  { value: 0, label: 'Không hiển thị' }
]
const typeChoose = [
  {
    value: '0',
    label: 'View all sân'
  },
  {
    value: '1',
    label: 'Chọn sân'
  }
]
export default {
  name: 'DialogAddAccountHIO',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    organizationData: {
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
      typeChooseFacility: 0,
      arrayStatus: [...arrayStatus],
      typeChoose: [...typeChoose],
      loadingSubmit: false,
      dialogLoading: false,
      loadingSearchFacility: false,
      loadingSearchUser: false,
      loadingSearchClub: false,
      is_global_show: false,
      isShowOrganizationChild: false,
      loadingSearchOption: false,
      organizationChild: [],
      formRequest: {
        name: null,
        phone: null,
        email: null,
        facility_id: [],
        roles: [2],
        is_active: 0
      },
      dataFacility: [],
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      facilities: [],
      loadingDialog: false,
      dialog: { titleName: 'Thêm mới tài khoản', buttonName: 'Thêm mới' },
      rules: {
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên', 2, 40), trigger: 'change' }],
        email: [{ validator: (rule, _, callback) => validateEmail(rule, this.formRequest.email, callback, 'Email'), trigger: 'change' }],
        phone: [{ validator: (rule, _, callback) => validatePhoneNumber(rule, this.formRequest.phone, callback, 'Số điện thoại'), trigger: 'change' }]
      }
    }
  },
  computed: {},
  watch: {
    async objectData(value) {
      console.log('value1211111111111', value)
      if (!this.isAdd) {
        this.formRequest = {
          ...this.formRequest,
          ...value
        }
        this.facilities = value.facility_insurance.map(item => {
          return { value: item.facility_id, label: item.facility.title }
        })
        this.dataFacility = value.facility_insurance.map(item => {
          return item.facility_id
        })

        if (value.is_view_all_facility === 0) {
          this.typeChooseFacility = 0
        } else {
          this.typeChooseFacility = 1
        }
      } else {
        if (value) {
          this.formRequest = {
            ...this.formRequest,
            ...value
          }
          console.log('this.formRequest.....................', this.formRequest)
        }
      }
    },
    dataFacility(value) {
      this.formRequest.facility_id = value
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới tài khoản', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật tài khoản', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    onSearchFacility(keyword) {
      this.loadingSearchFacility = true
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, booking: value.booking, path: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchFacility = false
      })
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          const formBody = await this.appendForm()
          console.log('ffffffffffffff', formBody)
          if (this.isAdd) await this.handleSubmitAdd(formBody)
          else await this.handleSubmitUpdate(formBody)
        }
      })
    },
    async handleSubmitAdd(formBody) {
      accountResource.storeAccountHIO(formBody).then(async res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          await this.resetFormRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate(formBody) {
      accountResource.updateAccountHIO(formBody, formBody.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          this.resetFormRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    async resetFormRequest() {
      (
        this.formRequest = {
          name: null,
          phone: null,
          email: null,
          is_active: 0,
          facility_id: [],
          roles: [2]
        }
      )
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },

    async appendForm() {
      const formData = this.formRequest
      if (this.typeChooseFacility === 1) {
        formData.is_view_all_facility = 1
      } else {
        formData.is_view_all_facility = 0
      }

      return formData
    },
    handleCloseTag(round) {
      this.rounds.splice(this.rounds.indexOf(round), 1)
    },

    formatNumber
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

.color-red {
  color: red;
}
</style>
