<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Tên đại lý" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                clearable
                prop="name"
                placeholder="Tên đại lý"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Tên đại diện" required>
            <el-form-item prop="representative_name">
              <el-input
                v-model="formRequest.representative_name"
                clearable
                prop="representative_name"
                placeholder="Tên đại diện"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="SĐT" required>
            <el-form-item prop="phone">
              <el-input
                v-model="formRequest.phone"
                clearable
                prop="phone"
                placeholder="SĐT"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">

          <el-form-item label="Địa chỉ" required>
            <el-form-item prop="address">
              <el-input
                v-model="formRequest.address"
                clearable
                prop="address"
                placeholder="Địa chỉ"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Mã số thuế" required>
            <el-form-item prop="tax_code">
              <el-input
                v-model="formRequest.tax_code"
                clearable
                prop="tax_code"
                placeholder="Mã số thuế"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Ngày công nợ" required>
            <el-form-item prop="day_debt">
              <el-input
                v-model="formRequest.day_debt"
                clearable
                prop="day_debt"
                placeholder="Ngày công nợ"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Ngày bắt đầu kỳ đối soát">
            <el-form-item prop="control_day">
              <el-date-picker
                v-model="formRequest.control_day"
                class="w-100"
                type="date"
                format="dd-MM-yyyy"
                placeholder="Ngày đối soát"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Số ngày đối soát">
            <el-form-item prop="number_control_day">
              <el-input
                v-model="formRequest.number_control_day"
                clearable
                type="number"
                prop="number_control_day"
                placeholder="Số ngày đối soát"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Mã đối tượng Misa">
            <el-form-item prop="account_object_code_misa">
              <el-input
                v-model="formRequest.account_object_code_misa"
                clearable
                prop="account_object_code_misa"
                placeholder="Nhập mã đối tượng"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="Upload file" required>
            <el-form-item prop="upload">
              <el-upload
                ref="ruleForm"
                :file-list="listImage"
                class="upload-demo"
                action="uploadURL"
                list-type="picture"
                multiple
                :on-change="onPickImage"
                :on-remove="removeFile"
                :on-preview="previewFile"
                :auto-upload="false"
                :limit="1"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
              >
                <el-button type="primary"> Chọn file PDF để upload</el-button>
              </el-upload>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="!isAdd" label="Link PDF" required>
        <el-form-item prop="link_pdf">
          <el-input
            v-model="formRequest.link_pdf"
            v-loading="uploadFileLoading"
            clearable
            prop="link_pdf"
            placeholder="Link PDF"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <!-- <el-form-item label="Trạng thái duyệt">
              <el-radio-group v-model="formRequest.is_approve">
                  <el-radio border value="0" :label="0">Chưa duyệt</el-radio>
                  <el-radio border value="1" :label="1">Đã duyệt </el-radio>
              </el-radio-group>
          </el-form-item> -->
      <el-form-item label="Có bán bảo hiểm không ?">
        <el-radio-group v-model="formRequest.is_sell_insurance">
          <el-radio border value="0" :label="0">Không</el-radio>
          <el-radio border value="1" :label="1">Có </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Chuyển trạng thái booking khi xác nhận">
        <el-radio-group v-model="formRequest.auto_confirm_sale">
          <el-radio border value="0" :label="0">Không</el-radio>
          <el-radio border value="1" :label="1">Có </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Admin giới thiệu">
        <el-form-item prop="admin_introduced_id">
          <el-select
            v-model="formRequest.admin_introduced_id"
            style="width: 100%"
            class="w-100"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Nhập mã VID admin"
            :remote-method="onSearchAdmin"
          >
            <el-option
              v-for="admin in adminData1"
              :key="admin.id"
              :label="'VID' + admin.id + '  ' + admin.name"
              :value="admin.id"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!isAdd && formRequest.is_approve == 1" label="Admin duyệt">
        <el-form-item prop="admin_approve_id">
          <el-select
            v-model="formRequest.admin_approve_id"
            disabled
            style="width: 100%"
            class="w-100"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Nhập mã VID admin"
            :remote-method="onSearchAdmin"
          >
            <el-option
              v-for="admin in adminData2"
              :key="admin.id"
              :label="'VID' + admin.id + '  ' + admin.name"
              :value="admin.id"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="Admin tạo">
        <el-form-item prop="admin_created_id">
          <el-select
            v-model="formRequest.admin_created_id"
            style="width: 100%"
            class="w-100"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Nhập mã VID admin"
            :remote-method="onSearchAdmin"
          >
            <el-option
              v-for="admin in adminData3"
              :key="admin.id"
              :label="'VID' + admin.id + '  ' + admin.name"
              :value="admin.id"
            />
          </el-select>
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
import { Message } from 'element-ui'
import AccountResource from '@/api/account'
import AgencyResource from '@/api/agency'
import { baseURL } from '@/constant/config'
import { getAcountInfo } from '@/utils/auth'

const agencyResource = new AgencyResource()
const accountResource = new AccountResource()
export default {
  name: 'DialogAddAgency',
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
        name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.name, callback, 'Tên đại lý'),
            trigger: 'change'
          }
        ],
        representative_name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.representative_name, callback, 'Tên đại diện'),
            trigger: 'change'
          }
        ],
        phone: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.phone, callback, 'Số điện thoại'),
            trigger: 'change'
          }
        ],
        address: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.address, callback, 'Địa chỉ'),
            trigger: 'change'
          }
        ],
        tax_code: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.tax_code, callback, 'Mã số thuế'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      loadingSearchAdmin: false,
      formRequest: {
        is_approve: 0,
        is_sell_insurance: 1,
        auto_confirm_sale: 0,
        admin_created_id: getAcountInfo().id,
        representative_name: '',
        phone: '',
        address: '',
        tax_code: '',
        admin_introduced_id: '',
        admin_approve_id: '',
        link_pdf: '',
        day_debt: ''
      },
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      listImage: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      adminData1: [],
      adminData2: [],
      adminData3: [],
      file: null,
      file_remove: null,
      dialog: { titleName: 'Thêm mới đại lý', buttonName: 'Thêm mới' }
    }
  },

  watch: {
    objectData(value) {
      if (!this.isAdd) {
        this.formRequest = {
          ...value,
          id: value.id,
          name: value.name,
          admin_introduced_id: value.admin_introduced_id,
          admin_approve_id: value.admin_approve_id,
          admin_created_id: value.admin_created_id,
          link_pdf: value.link_pdf,
          phone: value.phone,
          address: value.address,
          tax_code: value.tax_code,
          is_approve: value.is_approve,
          is_sell_insurance: value.is_sell_insurance,
          representative_name: value.representative_name,
          auto_confirm_sale: value.auto_confirm_sale,
          day_debt: value.day_debt,
          number_control_day: value.number_control_day,
          control_day: value.control_day ? value.control_day : null
        }
        if (value?.admin_introduced) {
          this.adminData1 = [{ id: value?.admin_introduced_id, name: value?.admin_introduced?.name }]
        }
        if (value?.admin_approve) {
          this.adminData2 = [{ id: value?.admin_approve_id, name: value?.admin_approve?.name }]
        }
        if (value?.admin_created) {
          this.adminData3 = [{ id: value?.admin_created_id, name: value?.admin_created?.name }]
        }
        if (value?.link_pdf) {
          this.listImage = [{ id: 1, url: value?.link_pdf, name: value?.link_pdf }]
        }
      } else {
        this.formRequest.admin_introduced_id = ''
        this.formRequest.admin_approve_id = ''
      }
    },

    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới đại lý', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật đại lý', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          if (this.isAdd) this.handleSubmitAdd()
          else this.handleSubmitUpdate()
        }
      })
    },
    async handleSubmitAdd() {
      this.loadingSubmit = true
      agencyResource.store(this.request).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate() {
      agencyResource.update(this.request, this.formRequest.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    onSearchAdmin(keyword) {
      const params = { vID: keyword }
      accountResource.searchAdmin(params).then(res => {
        if (res.error_code === 0) {
          const result = res?.data || []
          this.adminData1 = [...result]
          if (!this.isAdd) {
            this.adminData2 = [...result]
            this.adminData3 = [...result]
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    async resetformRequest() {
      await Promise.resolve(
        ((this.formRequest = {
          representative_name: '',
          phone: '',
          address: '',
          tax_code: '',
          is_approve: 0,
          is_sell_insurance: 1,
          auto_confirm_sale: 0,
          admin_introduced_id: '',
          admin_approve_id: '',
          admin_created_id: getAcountInfo().id,
          link_pdf: '',
          day_debt: ''
        }),
        (this.listImage = []),
        (this.users = []))
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
    },
    async onPickImage(value, array) {
      if (value?.name.includes('%') || value?.name.includes('#') || value?.name.includes('/')) {
        Message({
          message: `Tên file khồng được chứa ký tự %, # và /`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else if (value?.raw?.type !== 'application/pdf' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng file là PDF`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else if (value.size > 100000000) {
        Message({
          message: `Kích thước file tối đa là 100 mb, bạn đang chọn file ${value.name} với kích thước ${value.size} kb`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else {
        this.file = value.raw
        this.file_remove = null
      }
    },
    removeFile(value) {
      this.formRequest.link_pdf = ''
      this.file = null
      if (value.status === 'success') {
        this.file_remove = value.url
      }
    },
    previewFile(value) {
      if (!this.isAdd) {
        window.open(baseURL + value.url, '_blank')
      } else {
        window.open(value.url, '_blank')
      }
    },
    handleExceed(files, fileList, length) {
      Message({
        message: `Tối đa là ${length} file, bạn đang chọn ${files.length + fileList.length} file`,
        type: 'warning',
        duration: 5 * 1000
      })
    },

    appendForm() {
      const formData = new FormData()

      const formRequest = this.formRequest

      Object.keys(formRequest).forEach(function(key) {
        if (formRequest[key]) {
          formData.append(key, formRequest[key])
        }
      })
      if (this.file != null) {
        formData.append('file_pdf', this.file)
      }
      if (this.file_remove != null) {
        formData.append('file_remove', this.file_remove)
      }
      this.request = formData
    }
  }
}
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>
