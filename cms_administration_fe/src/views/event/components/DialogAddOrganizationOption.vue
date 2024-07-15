<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="40%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">

          <el-form-item label="Tên đơn vị con :" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                prop="name"
                placeholder="Tên đơn vị tổ chức"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thuộc đơn vị cha:" required>
            <el-form-item prop="organization_id">
              <el-select
                v-model="formRequest.organization_id"
                class="w-100"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="Chọn đơn vị cha"
              >
                <el-option v-for="organization in organizations" :key="organization.id" :label="organization.name" :value="organization.id" />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Ảnh đại diện:" required>
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
                :auto-upload="false"
                :limit="1"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
              >
                <el-button type="primary"> Upload ảnh</el-button>
              </el-upload>
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
import { isEmpty, validateText } from '../../../utils/validate'
import OrganizationOptionResource from '@/api/event/organizationOption'
import { formatNumber } from '@/utils/convert'
import { Message } from 'element-ui'
import { v4 as uuidv4 } from 'uuid'
import Axios from 'axios'

const organizationOptionResource = new OrganizationOptionResource()

const objectYesNo = { 1: 'Không', 0: 'Có' }

export default {
  name: 'DialogAddEvent',
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
              validateText(rule, this.formRequest.name, callback, 'Tên đơn vị con'),
            trigger: 'change'
          }
        ],
        organization_id: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.organization_id, callback, 'Tên đơn vị cha'),
            trigger: 'change'
          }
        ]
      },
      objectYesNo: objectYesNo,
      loadingSubmit: false,
      dialogLoading: false,
      listImage: [],
      file: null,
      formRequest: {
        is_active: 0
      },
      dialog: { titleName: 'Thêm mới đơn vị tổ chức', buttonName: 'Thêm mới' }
    }
  },
  watch: {
    objectData(value) {
      if (!this.isAdd) {
        this.formRequest = {
          ...value
        }
        this.listImage = value.image ? [{ url: value.image }] : []
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới đơn vị tổ chức', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật đơn vị tổ chức', buttonName: 'Cập nhật' })
      }
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          const formBody = await this.appendForm()
          if (this.isAdd) this.handleSubmitAdd(formBody)
          else this.handleSubmitUpdate(formBody)
        }
      })
    },

    async handleSubmitAdd(formBody) {
      organizationOptionResource.store(formBody).then(res => {
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
    async handleSubmitUpdate(formBody) {
      organizationOptionResource.update(formBody, formBody.id).then(res => {
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
    async onPickImage(value, array) {
      console.log('value___________', value)

      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là JPG, JPEG, PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else if (value.size > 60000000) {
        Message({
          message: `Kích thước ảnh tối đa là 60.000 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else {
        this.file = value.raw
      }
    },
    removeFile(value) {
      delete this.formRequest.image
      this.file = null
    },
    handleExceed(files, fileList, length) {
      Message({
        message: `Tối đa là ${length} file, bạn đang chọn ${files.length + fileList.length} file`,
        type: 'warning',
        duration: 5 * 1000
      })
    },
    async resetformRequest() {
      await Promise.resolve(
        (
          this.formRequest = {
            is_active: 0
          },
          this.listImage = []
        )
      )
      this.$refs['ruleForm'].clearValidate()
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
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
    },

    async appendForm() {
      const formData = this.formRequest
      for (const key in formData) {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key]
        }
      }
      if (this.file != null && isEmpty(formData.image)) {
        const fileUpload = await this.uploadFileToServe(this.file)
        if (fileUpload) { formData.image = fileUpload.data.name }
      }

      return formData
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
</style>
