<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="40%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">

          <el-form-item label="Tên đơn vị tổ chức :" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                prop="name"
                placeholder="Tên đơn vị tổ chức"
                @keyup.enter.native="onSubmitForm('ruleForm')"
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
          <el-form-item label="kích hoạt:">
            <el-form-item prop="is_active">
              <el-select
                v-model="formRequest.is_active"
                class="w-100"
              >
                <el-option v-for="(item, key) in objectYesNo" :key="key" :label="item" :value="+key" />
              </el-select>
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
import { validateText } from '../../../utils/validate'
import UnitResource from '@/api/event/unit'
import { formatNumber } from '@/utils/convert'
import { v4 as uuidv4 } from 'uuid'

const unitResource = new UnitResource()

const objectYesNo = { 1: 'Có', 0: 'Không' }

export default {
  name: 'DialogAddEvent',
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
              validateText(rule, this.formRequest.name, callback, 'Tên sự kiện'),
            trigger: 'change'
          }
        ]
      },
      objectYesNo: objectYesNo,
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        is_active: 1
      },
      request: {},
      dialog: { titleName: 'Thêm mới đơn vị tổ chức', buttonName: 'Thêm mới' },
      keyImage: [],
      isUploadImage: false
    }
  },
  watch: {
    objectData(value) {
      if (!this.isAdd) {
        this.formRequest = {
          ...value
        }
        if (value.avt_organization) {
          this.isUploadImage = false
          this.keyImage.push({ url: value.avt_organization })
        }
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
      if (this.isUploadImage) {
        this.$refs.uploadLogo.submit()
      } else {
        await unitResource.store(formBody).then(res => {
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
      }
    },
    async handleSubmitUpdate(formBody) {
      if (this.isUploadImage) {
        this.$refs.uploadLogo.submit()
      } else {
        await unitResource.update(formBody, formBody.id).then(res => {
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
      }
    },
    async resetformRequest() {
      await Promise.resolve(
        (
          this.formRequest = {
            is_active: 0
          })
      )
      this.keyImage = []
      this.isUploadImage = false
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
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
            this.formRequest.avt_organization = []
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
      this.formRequest.avt_organization = res.name
      this.onSubmitForm('ruleForm')
    },
    onError(err) {
      console.log('err................', err)
      this.$message.error('Upload file thất bại')
    },
    async appendForm() {
      const formData = this.formRequest
      for (const key in formData) {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key]
        }
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
