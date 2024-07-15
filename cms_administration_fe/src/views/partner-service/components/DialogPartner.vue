<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="User ID admin của đối tác">
        <el-form-item prop="user_admin">
          <el-select
            v-model="formRequest.user_admin"
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="User ID admin của đối tác"
            :remote-method="onSearchGolfer"
            :loading="loadingSearchGolfer"
          >
            <el-option
              v-for="golfer in golferList"
              :key="golfer.id"
              :label="`vID${golfer.id} - ${golfer.fullname}`"
              :value="golfer.id"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Tên đối tác">
        <el-form-item prop="name">
          <el-input
            v-model="formRequest.name"
            prop="name"
            placeholder="Tên đối tác"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Địa chỉ đối tác">
        <el-form-item prop="address">
          <el-input
            v-model="formRequest.address"
            prop="address"
            placeholder="Địa chỉ đối tác"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Số điện thoại đối tác">
        <el-form-item prop="phone">
          <el-input
            v-model="formRequest.phone"
            prop="phone"
            placeholder="Số điện thoại đối tác"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Thời gian mở cửa trong ngày">
        <el-form-item prop="open_time">
          <el-time-picker
            v-model="formRequest.open_time"
            style="width: 100%;"
            type="time"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="Thời gian mở cửa trong ngày"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Thời gian đóng cửa trong ngày">
        <el-form-item prop="close_time">
          <el-time-picker
            v-model="formRequest.close_time"
            style="width: 100%;"
            type="time"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="Thời gian đóng cửa trong ngày"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Danh sách vID admin duyệt voucher">
        <el-form-item prop="operating_time_desc">
          <el-input
            v-model="formRequest.operating_time_desc"
            :rows="2"
            type="textarea"
            prop="operating_time_desc"
            placeholder="Danh sách vID admin duyệt voucher"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Danh mục">
        <el-form-item prop="category_id">
          <el-select
            v-model="formRequest.category_id"
            filterable
            clearable
            style="width: 100%"
            remote
            reserve-keyword
            :multiple-limit="1"
            placeholder="Danh mục"
          >
            <el-option
              v-for="category in categoryList"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Website đối tác">
        <el-form-item prop="website">
          <el-input
            v-model="formRequest.website"
            prop="website"
            placeholder="Website đối tác"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Icon">
        <el-form-item prop="icon">
          <div class="clearfix" />
          <el-upload
            ref="uploadIcon"
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

      <el-form-item label="Cover">
        <el-form-item prop="cover">
          <div class="clearfix" />
          <el-upload
            ref="uploadCover"
            class="upload-demo"
            name="image"
            action="https://api-v2.vcallid.com/api/utils/upload/data"
            :on-error="onErrorCover"
            :on-success="onSuccessCover"
            :auto-upload="false"
            :on-remove="onPickImageCover"
            :on-change="onPickImageCover"
            :file-list="listImage"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
            list-type="picture-card"
          >
            <i class="el-icon-upload" />
          </el-upload>
        </el-form-item>
      </el-form-item>

      <el-form-item label="Mô tả về đối tác">
        <el-form-item prop="description">
          <el-input
            v-model="formRequest.description"
            :rows="2"
            type="textarea"
            prop="description"
            placeholder="Mô tả về đối tác"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Trạng thái: ">
        <el-radio-group v-model="formRequest.status">
          <el-radio border value="0" :label="0">Đóng</el-radio>
          <el-radio border value="1" :label="1">Mở </el-radio>
        </el-radio-group>
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

import { validateDate, validateText, validateEndAt, validatePhoneNumber, validateImage, validateTextArea } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import PartnerServiceResource from '@/api/partner-service/partner-service'
// import { getAcountInfo } from '@/utils/auth'
import { create_signature_hub } from '@/utils/create-signnature'
import { v4 as uuidv4 } from 'uuid'
import { trim_string_object } from '@/utils/trim-string-object'
import SearchResource from '@/api/search-api'

const searchResource = new SearchResource()
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
        user_admin: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.user_admin, callback, 'ID admin'),
          trigger: 'change'
        }],
        name: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên đối tác'),
          trigger: 'change'
        }],
        address: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.address, callback, 'Địa chỉ đối tác'),
          trigger: 'change'
        }],
        phone: [{
          validator: (rule, _, callback) => validatePhoneNumber(rule, this.formRequest.phone, callback, 'Số điện thoại đối tác'),
          trigger: 'change'
        }],
        open_time: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.open_time, callback, 'Thời gian mở cửa trong ngày'),
          trigger: 'change'
        }],
        close_time: [{
          validator: (rule, _, callback) => validateEndAt(rule, this.formRequest.open_time, this.formRequest.close_time, callback, 'Thời gian đóng cửa trong ngày'),
          trigger: 'change'
        }],
        operating_time_desc: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.operating_time_desc, callback, 'Mô tả thời gian hoạt động'),
          trigger: 'change'
        }],
        category_id: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.category_id, callback, 'Danh mục'),
          trigger: 'change'
        }],
        // website: [{
        //   validator: (rule, _, callback) => validateWebsite(rule, this.formRequest.website, callback, 'Website đối tác'),
        //   trigger: 'change'
        // }],
        icon: [{
          validator: (rule, _, callback) => validateImage(rule, this.keyImage, callback, 'Icon'),
          trigger: 'change'
        }],
        cover: [{
          validator: (rule, _, callback) => validateImage(rule, this.listImage, callback, 'Cover'),
          trigger: 'change'
        }],
        description: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.description, callback, 'Mô tả về đối tác'),
          trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        status: 0,
        user_admin: '',
        website: ''
      },
      request: {},
      dialog: { titleName: 'Thêm mới đối tác', buttonName: 'Thêm mới' },
      listImage: [],
      keyImage: [],
      categoryList: [],
      golferList: [],
      loadingSearchGolfer: false,
      isUploadImage: true,
      isUploadImageCover: true,
      isUploadImageUpdate: true,
      isUploadImageCoverUpdate: true
    }
  },

  watch: {
    objectData(value) {
      console.log('value', value)
      if (value && !this.isAdd) {
        this.formRequest = { ...value, user_admin: value.chat_id }
        if (value.icon) {
          this.isUploadImage = false
          this.keyImage.push({ url: value.icon })
        }

        if (value.cover) {
          this.isUploadImageCover = false
          this.listImage.push({ url: value.cover })
        }
      }
    },

    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới đối tác', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật đối tác', buttonName: 'Cập nhật' })
      }
    }
  },
  created() {
    this.getListCategory()
  },
  methods: {
    onSearchGolfer(keyword) {
      if (keyword) {
        this.loadingSearchGolfer = true
        setTimeout(() => {
          searchResource.searchGolfer({ keyword_golfer: keyword.trim() }).then(res => {
            this.loadingSearchGolfer = false
            const { error_code, data } = res
            if (error_code === 0) {
              this.golferList = [...data]
            }
          })
        }, 500)
      } else {
        this.golferList = []
      }
    },
    getListCategory() {
      this.loadingTable = true
      partnerServiceResource.get_category().then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.categoryList = data.map((item) => ({ value: item.id, label: item.name }))
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
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
        this.$refs.uploadIcon.submit()
      } else if (this.isUploadImageCover) {
        this.$refs.uploadCover.submit()
      } else {
        await this.trim_string_object(this.formRequest)
        const signature = await this.create_signature_hub(this.formRequest)
        this.formRequest = { ...this.formRequest, signature }

        partnerServiceResource.create_new_partner(this.formRequest).then(res => {
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
      if (this.isUploadImage || this.isUploadImageCover) {
        if (this.isUploadImage && this.keyImage[0].raw !== undefined) {
          this.$refs.uploadIcon.submit()
        } else if (this.isUploadImageCover && this.listImage[0].raw !== undefined) {
          this.$refs.uploadCover.submit()
        }
      } else {
        this.formRequest.partner_id = this.formRequest.id
        await this.trim_string_object(this.formRequest)
        const signature = await this.create_signature_hub(this.formRequest)
        this.formRequest = { ...this.formRequest, signature }
        this.loadingSubmit = true
        partnerServiceResource.update_partner(this.formRequest).then(res => {
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
        this.formRequest = {
          status: 0,
          user_admin: '',
          website: ''
        },
        this.listImage = [],
        this.keyImage = [],
        this.golferList = []
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
            this.keyImage = array
            this.isUploadImage = true
            this.$refs['ruleForm'].clearValidate('icon')
          } else {
            this.formRequest.icon = []
          }
        }
      }
    },
    async onPickImageCover(value, array) {
      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        this.$message.warning(`Yêu cầu định dạng ảnh là JPG, JPEG, PNG`)
        array.pop()
        this.listImage = array
      } else if (value.size > 100000000) {
        this.$message.warning(`Kích thước ảnh tối đa là 100 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`)
        array.pop()
        this.listImage = array
      } else {
        if (value.status !== 'success') {
          if (array[0] && array[0]?.raw) {
            this.listImage = array
            this.isUploadImageCover = true
            this.$refs['ruleForm'].clearValidate('cover')
          } else {
            this.formRequest.cover = []
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
      this.formRequest.icon = res.name
      if (this.keyImage.length > 0 && !this.isAdd || this.isAdd) {
        this.onSubmitForm('ruleForm')
      }
    },
    onError(err) {
      console.log('err................', err)
      this.$message.error('Upload file thất bại')
    },

    onSuccessCover(res) {
      console.log('res................', res)
      this.isUploadImageCover = false
      this.formRequest.cover = res.name

      if (this.listImage.length > 0 && !this.isAdd || this.isAdd) {
        this.onSubmitForm('ruleForm')
      }
    },
    onErrorCover(err) {
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

