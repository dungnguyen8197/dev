<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="40%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">
          <el-form-item label="Tiêu đề CLB">
            <el-form-item prop="title">
              <el-input
                v-model="formRequest.title"
                placeholder="Tiêu đề CLB"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Tên CLB">
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                placeholder="Tên CLB"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Địa chỉ">
            <el-form-item prop="address">
              <el-input
                v-model="formRequest.address"
                placeholder="Địa chỉ"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả">
            <el-form-item prop="about">
              <el-input
                v-model="formRequest.about"
                placeholder="Mô tả"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Ngày thành lập:" required>
            <el-form-item prop="date_birthday">
              <el-date-picker
                v-model="formRequest.date_birthday"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Ngày thành lập"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Logo">
            <el-form-item prop="logo">
              <div class="clearfix" />
              <el-upload
                ref="uploadLogo"
                class="upload-demo"
                name="image"
                action="https://api-v2.vcallid.com/api/utils/upload/data"
                :on-error="onError"
                :on-success="onSuccess"
                :auto-upload="false"
                :on-remove="onPickImageLogo"
                :on-change="onPickImageLogo"
                :before-upload="beforeUpload"
                :file-list="keyImage"
                :limit="1"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
                list-type="picture-card"
              >
                <i class="el-icon-upload" />
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
import { validateText, validateDate } from '../../../utils/validate'
import { v4 as uuidv4 } from 'uuid'
import { formatNumber } from '@/utils/convert'
import { getAcountInfo } from '@/utils/auth'
import AdminClubResource from '@/api/club/admin-club'

const adminClubResource = new AdminClubResource()

export default {
  name: 'DialogOptionAchievement',
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
              validateText(rule, this.formRequest.name, callback, 'Tên event'),
            trigger: 'change'
          }
        ],
        date_birthday: [
          {
            validator: (rule, _, callback) =>
              validateDate(rule, this.formRequest.date_birthday, callback, 'Thời gian bắt đầu'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      dialog: { titleName: 'Thêm mới câu lạc bộ', buttonName: 'Thêm mới' },
      keyImage: [],
      isUploadImage: false
    }
  },
  watch: {
    objectData(value) {
      console.log('val..............', value)
      this.formRequest = value
      if (value.logo_url_path) {
        this.isUploadImage = false
        this.keyImage.push({ url: value.logo_url_path })
      }
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới câu lạc bộ', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật câu lạc bộ', buttonName: 'Cập nhật' })
      }
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          if (this.isAdd) {
            this.handleSubmitAdd()
          } else {
            this.handleSubmitUpdate()
          }
        }
      })
    },

    async handleSubmitAdd() {
      if (this.isUploadImage) {
        this.$refs.uploadLogo.submit()
      } else {
        this.formRequest.admin_cms_id = getAcountInfo()?.id
        await adminClubResource.store(this.formRequest).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.data)
            this.handleClose()
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingSubmit = false
        })
      }
    },
    async handleSubmitUpdate() {
      if (this.isUploadImage) {
        this.$refs.uploadLogo.submit()
      } else {
        this.formRequest.admin_cms_id = getAcountInfo()?.id
        await adminClubResource.update(this.formRequest, this.formRequest.id).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.data)
            this.handleClose()
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingSubmit = false
        })
      }
    },
    async resetformRequest() {
      await Promise.resolve(
        (this.formRequest = {}),
        this.keyImage = [],
        this.isUploadImage = false
      )
      this.$refs['ruleForm'].clearValidate()
    },

    async onPickImageLogo(value, array) {
      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        this.$message.warning(`Yêu cầu định dạng ảnh là JPG, JPEG, PNG`)
        array.pop()
        this.keyImage = array
      } else if (value.size > 100000000) {
        this.$message.warning(`Kích thước ảnh tối đa là 100 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`)
        array.pop()
        this.keyImage = array
      } else {
        if (value.status !== 'success') {
          if (array[0] && array[0]?.raw) {
            this.keyImage = array
            this.isUploadImage = true
            this.$refs['ruleForm'].clearValidate('logo')
          } else {
            this.formRequest.logo_url_path = []
          }
        }
      }
    },
    handleExceed(files, fileList, length) {
      this.$message.warning(`Tối đa là ${length} hình ảnh, bạn đang chọn ${files.length + fileList.length} hình ảnh`)
    },

    beforeUpload(file) {
      if (file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const newFile = new File([file], `${uuidv4().toString()}.png`, { type: file?.type ?? 'image/png' })
            resolve(newFile)
          }
          reader.readAsArrayBuffer(file)
        })
      } else {
        return false
      }
    },

    onSuccess(res) {
      console.log('res................', res)
      this.isUploadImage = false
      this.formRequest.logo_url_path = res.name
      this.onSubmitForm('ruleForm')
    },
    onError(err) {
      console.log('err................', err)
      this.$message.error('Upload file thất bại')
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
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
