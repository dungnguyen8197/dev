<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên đối tác">
        <el-form-item prop="partner_id">
          <el-select
            v-model="formRequest.partner_id"
            class="w-100"
            filterable
            remote
            clearable
            :disabled="!isAdd"
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
      <el-form-item label="Tên sản phẩm">
        <el-form-item prop="name">
          <el-input
            v-model="formRequest.name"
            prop="name"
            placeholder="Tên sản phẩm"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Trạng thái">
        <el-form-item prop="status">
          <el-select
            v-model="formRequest.status"
            filterable
            clearable
            style="width: 100%"
            remote
            reserve-keyword
            :multiple-limit="1"
            placeholder="Trạng thái"
          >
            <el-option
              v-for="status in statusList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-form-item prop="description">
          <el-input
            v-model="formRequest.description"
            :rows="2"
            type="textarea"
            prop="description"
            placeholder="Mô tả"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Hình ảnh">
        <el-form-item prop="image">
          <div class="clearfix" />
          <el-upload
            ref="uploadImage"
            class="upload-demo"
            name="image"
            action="https://api-v2.vcallid.com/api/utils/upload/data"
            :on-error="onError"
            :on-success="onSuccess"
            :auto-upload="false"
            :on-remove="onPickImageIcon"
            :on-change="onPickImageIcon"
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

      <el-form-item label="Giá">
        <el-form-item prop="price">
          <el-input
            v-model="formRequest.price"
            prop="price"
            placeholder="Giá"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
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

import { validateText, validateImage, validateTextArea } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import PartnerServiceResource from '@/api/partner-service/partner-service'
// import { getAcountInfo } from '@/utils/auth'
import { create_signature_hub } from '@/utils/create-signnature'
import { v4 as uuidv4 } from 'uuid'
// import axios from 'axios'
import { ARRAY_STATUS_PRODUCT_PARTNER } from '@/utils/constant'
// import SearchResource from '@/api/search-api'
import { trim_string_object } from '@/utils/trim-string-object'

// const searchResource = new SearchResource()
const partnerServiceResource = new PartnerServiceResource()

export default {
  name: 'DialogPartner',
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
        name: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên sản phẩm'),
          trigger: 'change'
        }],
        status: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.status, callback, 'Trạng thái'),
          trigger: 'change'
        }],
        description: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.description, callback, 'Mô tả'),
          trigger: 'change'
        }],
        image: [{
          validator: (rule, _, callback) => validateImage(rule, this.keyImage, callback, 'Hình ảnh'),
          trigger: 'change'
        }],
        price: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.price, callback, 'giá'),
          trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      dialog: { titleName: 'Thêm mới sản phẩm', buttonName: 'Thêm mới' },
      listImage: [],
      keyImage: [],
      categoryList: [],
      golferList: [],
      loadingSearchGolfer: false,
      isUploadImage: true,
      partnerList: [],
      loadingSearchPartner: false,
      statusList: ARRAY_STATUS_PRODUCT_PARTNER
    }
  },

  watch: {
    objectData(value) {
      console.log('value', value)
      if (value && !this.isAdd) {
        this.formRequest = value
        this.formRequest.user_admin = value.chat_id
        this.partnerList = [{ ...value.partner }]
        if (value.image) {
          this.isUploadImage = false
          this.keyImage.push({ url: value.image })
        }
      }
    },

    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới sản phẩm', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật sản phẩm', buttonName: 'Cập nhật' })
      }
    }
  },
  created() {
  },
  methods: {
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
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          if (this.isAdd) this.handleSubmitAdd()
          else this.handleSubmitUpdate()
        }
      })
    },

    async handleSubmitAdd() {
      if (this.isUploadImage) {
        this.$refs.uploadImage.submit()
      } else {
        await this.trim_string_object(this.formRequest)
        const signature = await this.create_signature_hub(this.formRequest)
        this.formRequest = { ...this.formRequest, signature }

        partnerServiceResource.create_partner_product(this.formRequest).then(res => {
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
      }
    },

    async handleSubmitUpdate() {
      if (this.isUploadImage) {
        if (this.keyImage[0].raw !== undefined) {
          this.$refs.uploadImage.submit()
        }
      } else {
        this.formRequest.product_id = this.formRequest.id
        await this.trim_string_object(this.formRequest)
        const signature = await this.create_signature_hub(this.formRequest)
        this.formRequest = { ...this.formRequest, signature }
        this.loadingSubmit = true
        partnerServiceResource.update_partner_product(this.formRequest).then(res => {
          this.loadingSubmit = false
          const { error_code, error_msg } = res
          console.log('res.................................', res)
          if (error_code === 0) {
            this.$message.success('Cập nhật thành công')
            this.resetformRequest()
            this.handleClose()
          } else {
            this.$message.error(error_msg)
          }
        }).catch(_ => {
          this.loadingSubmit = false
        })
      }
    },

    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {},
        this.keyImage = []
      )
      this.$refs['ruleForm'].clearValidate()
    },

    async onPickImageIcon(value, array) {
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
            this.isUploadImage = true
            this.keyImage = array
            this.$refs['ruleForm'].clearValidate('image')
          } else {
            this.formRequest.image = []
          }
        }
      }
    },

    handleExceed(files, fileList, length) {
      this.$message.warning(`Tối đa là ${length} hình ảnh, bạn đang chọn ${files.length + fileList.length} hình ảnh`)
    },

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const newFile = new File([reader.result], `${uuidv4().toString()}.png`, { type: file?.type ?? 'image/png' })
          resolve(newFile)
          console.log('file............................', file)
          console.log('newFile............................', newFile)
        }
        reader.readAsArrayBuffer(file)
      })
    },

    onSuccess(res) {
      console.log('res................', res)
      this.isUploadImage = false
      this.formRequest.image = res.name
      console.log('this.formCreateImage................', this.formRequest)
      this.onSubmitForm('ruleForm')
    },
    onError(err) {
      console.log('err................', err)
      this.$message.error('Upload file thất bại')
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
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

