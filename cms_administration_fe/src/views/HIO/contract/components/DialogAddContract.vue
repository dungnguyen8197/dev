<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="50%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">
          <el-form-item label="Tên hợp đồng:" required>
            <el-input
              v-model="formRequest.contract_name"
              prop="contract_name"
              placeholder="Tên hợp đồng"
              @keyup.enter.native="onSubmitForm('ruleForm')"
            />
          </el-form-item>
          <el-form-item label="Mã hợp đồng:" required>
            <el-input
              v-model="formRequest.contract_code"
              prop="contract_code"
              placeholder="Mã hợp đồng"
              @keyup.enter.native="onSubmitForm('ruleForm')"
            />
          </el-form-item>
          <el-form-item label="File hợp đồng:">
            <el-upload
              ref="ruleForm"
              :file-list="listImage"
              class="upload-demo"
              action="uploadURL"
              list-type="picture-thumb"
              multiple
              :on-change="onPickImage"
              :on-remove="removeFile"
              :auto-upload="false"
              :limit="1"
              :on-exceed="(file, fileList) => handleExceed(files, fileList, 1)"
            >
              <el-button type="primary"> Upload file</el-button>
            </el-upload>
          </el-form-item>
          <el-row class="row" style="padding-left: 18px">
            <el-col :sm="24" :lg="8">
              <el-form-item label="Chiết khấu sân:">
                <el-select
                  v-model="formRequest.facility_id"
                  class="w-100"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Tìm kiếm sân golf"
                  :remote-method="onSearchFacility"
                  :loading="loadingSearchFacility"
                >
                  <el-option v-for="facility in facilities" :key="facility.value" :label="facility.label" :value="facility.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="8" style="padding-left: 18px">
              <el-form-item label="Tỷ lệ chiết khấu sân:">
                <el-input
                  v-model="formRequest.facility_discount"
                  prop="facility_discount"
                  placeholder="Nhập tỉ lệ chiết khấu"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row" style="padding-left: 18px">
            <el-col :sm="24" :lg="8">
              <el-form-item label="Lobby:">
                <el-input
                  v-model="formRequest.lobby_name"
                  prop="lobby_name"
                  placeholder="Nhập tên lobby"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="8" style="padding-left: 18px">
              <el-form-item label="Tỷ lệ chiết khấu lobby:">
                <el-input
                  v-model="formRequest.lobby_discount"
                  prop="lobby_discount"
                  placeholder="Nhập tỉ lệ chiết khấu"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Tỷ lệ chiết khấu PVI:">
            <el-input
              v-model="formRequest.PVI_discount"
              prop="PVI_discount"
              placeholder="Nhập tỉ lệ chiết khấu"
              @keyup.enter.native="onSubmitForm('ruleForm')"
            />
          </el-form-item>
          <el-form-item label="Tỷ lệ chiết khấu WGHN:">
            <el-input
              v-model="formRequest.WGHN_discount"
              prop="WGHN_discount"
              placeholder="Nhập tỉ lệ chiết khấu"
              @keyup.enter.native="onSubmitForm('ruleForm')"
            />
          </el-form-item>
          <el-row class="row" style="padding-left: 18px">
            <el-col :sm="24" :lg="8">
              <el-form-item label="Chi nhánh:">
                <el-select
                  v-model="formRequest.branch_id"
                  class="filter-item full-width"
                  placeholder="Chọn Chi nhánh"
                >
                  <el-option
                    v-for="level in arrayBranch"
                    :key="level.value"
                    :label="level.label"
                    :value="level.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="8" style="padding-left: 18px">
              <el-form-item label="Tỷ lệ chiết khấu chi nhánh:">
                <el-input
                  v-model="formRequest.branch_discount"
                  prop="branch_discount"
                  placeholder="Nhập tỉ lệ chiết khấu"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Booking:">
            <el-input
              v-model="formRequest.booking_discount"
              prop="booking_discount"
              placeholder="Nhập tỉ lệ chiết khấu"
              disabled
              @keyup.enter.native="onSubmitForm('ruleForm')"
            />
          </el-form-item>
          <el-form-item label="Trạng thái:">
            <el-select
              v-model="formRequest.status"
              placeholder="Trạng thái hiệu lực"
            >
              <el-option
                v-for="level in arrayStatus"
                :key="level.value"
                :label="level.label"
                :value="level.value"
              />
            </el-select>
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
import { isEmpty } from '@/utils/validate'
import { Message } from 'element-ui'
// import { baseURL } from '@/constant/config'
import { getAcountInfo } from '@/utils/auth'
import { v4 as uuidv4 } from 'uuid'
// import moment from 'moment'
import { formatNumber } from '@/utils/convert'
import Axios from 'axios'
import FacilityResource from '@/api/facility/facility'
import InsuranceApi from '@/api/HIO/insurance'
const facilityResource = new FacilityResource()
const insuranceApi = new InsuranceApi()

const arrayBranch = [
  { value: 1, label: 'Central' },
  { value: 2, label: 'Southern' }
]

const arrayStatus = [
  { value: 0, label: 'Hết hiệu lực' },
  { value: 1, label: 'Còn hiệu lực' }
]
export default {
  name: 'DialogAddContract',
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
      arrayBranch: [...arrayBranch],
      arrayStatus: [...arrayStatus],
      loadingSubmit: false,
      dialogLoading: false,
      loadingSearchFacility: false,
      loadingSearchUser: false,
      loadingSearchOption: false,
      formRequest: {
        admin_id: getAcountInfo().id,
        contract_name: '',
        contract_code: '',
        url_file: '',
        facility_id: '',
        facility_discount: '',
        lobby_name: '',
        lobby_discount: '',
        PVI_discount: '',
        WGHN_discount: '',
        booking_discount: 100,
        branch_id: '',
        branch_discount: '',
        status: ''
      },
      request: {},
      listImage: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      round: [],
      facilities: [],
      users: [],
      clubs: [],
      paths: [],
      facilityModel: {},
      file: null,
      files: null,
      dialog: { titleName: 'Thêm mới hợp đồng', buttonName: 'Thêm mới' },
      organization: null
    }
  },
  computed: {
  },
  watch: {
    'formRequest.WGHN_discount'() {
      this.updateBookingDiscount()
    },
    'formRequest.facility_discount'() {
      this.updateBookingDiscount()
    },
    'formRequest.lobby_discount'() {
      this.updateBookingDiscount()
    },
    'formRequest.PVI_discount'() {
      this.updateBookingDiscount()
    },
    'formRequest.branch_discount'() {
      this.updateBookingDiscount()
    },
    async objectData(value) {
      console.log('value1211111111111', value)
      if (!this.isAdd) {
        this.formRequest = {
          ...this.formRequest,
          ...value
        }
        this.listImage = value.url_file ? [{ url: value.url_file, name: value?.url_file }] : []
        this.facilities = [{ value: value.facility_id, label: value.facility.sub_title }]
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
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới hợp đồng', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật hợp đồng', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    updateBookingDiscount() {
      // Cập nhật giá trị mới cho booking_discount dựa trên WGHN_discount và branch_discount
      let bookingDiscount = 100
      if (this.formRequest.WGHN_discount) {
        bookingDiscount -= parseInt(this.formRequest.WGHN_discount)
      }
      if (this.formRequest.facility_discount) {
        bookingDiscount -= parseInt(this.formRequest.facility_discount)
      }
      if (this.formRequest.lobby_discount) {
        bookingDiscount -= parseInt(this.formRequest.lobby_discount)
      }
      if (this.formRequest.PVI_discount) {
        bookingDiscount -= parseInt(this.formRequest.PVI_discount)
      }
      if (this.formRequest.branch_discount) {
        bookingDiscount -= parseInt(this.formRequest.branch_discount)
      }
      this.formRequest.booking_discount = bookingDiscount
    },

    onSearchFacility(keyword) {
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
      insuranceApi.storeContract(formBody).then(async res => {
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
      insuranceApi.updateContract(formBody, formBody.id).then(res => {
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
      await Promise.resolve(
        (
          this.formRequest = {
            admin_id: getAcountInfo().id,
            contract_name: '',
            contract_code: '',
            url_file: '',
            facility_id: '',
            facility_discount: '',
            lobby_name: '',
            lobby_discount: '',
            PVI_discount: '',
            WGHN_discount: '',
            booking_discount: 100,
            branch_id: '',
            branch_discount: '',
            status: ''
          },
          this.listImage = []
        )
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },
    async onPickImage(value, array) {
      if (value.size > 60000000) {
        Message({
          message: `Kích thước ảnh tối đa là 60.000 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else {
        this.files = value.raw
      }
    },
    removeFile(value) {
      delete this.formRequest.url_file
      // this.listImage = []
      this.file = null
    },
    handleExceed(filess, fileList, length) {
      Message({
        message: `Tối đa là ${length} file, bạn đang chọn ${filess.length + fileList.length} file`,
        type: 'warning',
        duration: 5 * 1000
      })
    },
    async uploadFileToServe(file) {
      const myNewFile = new File([file], `${uuidv4().toString()}.png`, { type: file.type })
      const url = 'https://api-v2.vcallid.com/api/utils/upload/data'
      const formData = new FormData()
      formData.append('image', myNewFile)
      const res = await Axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      return res
    },

    async appendForm() {
      const formData = this.formRequest

      if (this.files != null && isEmpty(formData.file)) {
        const fileUpload = await this.uploadFileToServe(this.files)
        if (fileUpload) { formData.url_file = fileUpload.data.name }
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
