<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="advForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-advForm">
      <el-form-item label="Tiêu đề" required>
        <el-form-item prop="title">
          <el-input v-model="formRequest.title" prop="title" @keyup.enter.native="onSubmitForm('advForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Thời gian hết hạn" required>
        <el-form-item prop="expired_date">
          <el-date-picker
            v-model="formRequest.expired_time"
            style="width: 100%;"
            type="datetime"
            format="dd-MM-yyyy HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="Ngày nhập"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="!isScoreCard" label="Điều hướng đến màn hình trên app khi touch vào" required>
        <el-form-item prop="screenApp">
          <el-select
            v-model="formRequest.typeScreen"
            clearable
            style="width: 100%"
            class="w-100"
            filterable
            remote
            reserve-keyword
            :multiple-limit="1"
            placeholder="Chọn màn hình"
          >
            <el-option
              v-for="(screen, key) in screenApp"
              :key="key"
              :label="screen"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Đơn vị" required>
        <el-form-item prop="typeAdv">
          <el-select
            v-model="formRequest.typeUnit"
            clearable
            style="width: 100%"
            class="w-100"
            filterable
            remote
            reserve-keyword
            :multiple-limit="1"
            placeholder="Chọn đơn vị"
          >
            <el-option
              v-for="(unit, keyUnit) in typeAdv"
              :key="keyUnit"
              :label="unit"
              :value="keyUnit"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Link web" required>
        <el-form-item prop="linkWeb">
          <el-input v-model="formRequest.linkWeb" prop="quantity" @keyup.enter.native="onSubmitForm('advForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Ghi chú">
        <el-form-item prop="note">
          <el-input
            v-model="formRequest.note"
            prop="note"
            :rows="3"
            type="textarea"
            placeholder="Ghi chú(Nếu có)"
            @keyup.enter.native="onSubmitForm('advForm')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Ảnh hiển thị" required>
        <el-form-item prop="image">
          <div class="clearfix" />
          <el-upload
            ref="fileKey"
            action="uploadURL"
            list-type="picture-card"
            name="image"
            :on-remove="onPickKeyImage"
            :on-change="onPickKeyImage"
            :auto-upload="false"
            :file-list="keyImage"
            :limit="1"
            :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
            accept="image/*"
          >
            <i class="el-icon-upload" />
          </el-upload>
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('advForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>

import AdvResource from '@/api/adv/adv'
import AdvResourceScoreCard from '@/api/adv/scorecard'
import { Message } from 'element-ui'
import { formatNumber } from '@/utils/convert'
import { validateDate, validateText } from '@/utils/validate'
import { baseURL } from '@/constant/config'

let advResource = null

import { SCREEN_APP, TYPE_ADV } from '@/utils/status'
import moment from 'moment'

export default {
  name: 'FormCreateAdv',
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
    },
    isScoreCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        typeUnit: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.typeUnit, callback, 'Đơn vị'),
          trigger: 'change'
        }],
        title: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.title, callback, 'Tiêu đề'),
          trigger: 'change'
        }],
        typeScreen: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.typeScreen, callback, 'Màn hình điều hướng'),
          trigger: 'change'
        }],
        expired_time: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.expired_time, callback, 'Thời gian hết hạn'),
          trigger: 'change'
        }],
        icon_file_key: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.icon_file_key, callback, 'Hình ảnh'),
          trigger: 'change'
        }]
      },
      screenApp: SCREEN_APP,
      dialog: { titleName: 'Thêm mới tài sản', buttonName: 'add' },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      deviceId: '',
      // employeesData: [],
      typeAdv: TYPE_ADV,
      keyImage: [],
      categoryName: '',
      query: {
        limit: 10,
        page: 1
      }
      // status: status
    }
  },
  watch: {
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới tài sản', buttonName: 'add' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật tài sản', buttonName: 'update' })
      }
    },
    objectData(object) {
      console.log('object', object)
      if (Object.keys(object).length > 0) {
        this.keyImage = []
        this.dialogLoading = true
        this.formRequest = {
          id: object.id,
          title: object.title,
          typeUnit: JSON.stringify(object.type),
          typeScreen: this.isScoreCard ? 1 : JSON.stringify(object.type_display),
          linkWeb: object.url,
          note: object.note,
          expired_time: moment(object.expiried_time).format('yyyy-MM-DD HH:mm:ss')
        }
        if (this.isScoreCard) {
          this.keyImage.push({
            url: object.banner_url.includes('http') ? object.banner_url : baseURL + object.banner_url
          })
        } else {
          this.keyImage.push({
            url: object.bannner_url_square.includes('http') ? object.bannner_url_square : baseURL + object.bannner_url_square
          })
        }

        console.log('this.formRequest', this.formRequest)
        console.log('screenApp', this.screenApp)
        console.log('typeAdv', this.typeAdv)
        // this.getUpdateDevice(object.row.id)
        this.dialogLoading = false
      }
    }
  },
  created() {
    if (this.isScoreCard) {
      advResource = new AdvResourceScoreCard()
    } else {
      advResource = new AdvResource()
    }
  },
  methods: {
    onSubmitForm(formName) {
      console.log('this.formRequest', this.formRequest)
      // this.formRequest.bought_date = moment(this.formRequest.bought_date).unix()
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          if (this.isAdd) this.handleAdd()
          else this.handleUpdate()
        }
      })
    },
    async handleAdd() {
      this.loadingSubmit = true
      console.log('this.request.............................', this.request)

      await advResource.storeAdv(this.request).then(res => {
        if (res.error_code === 0) {
          Message.success('Thêm mới thành công')
          this.$emit('onClickButtonDialog')
          this.resetFormRequest()
          this.handleClose()
        } else {
          Message.error('Thêm mới thất bại')
        }
        console.log('res', res)
      }).catch(err => {
        console.log('err', err)
        Message.error(err)
      })
      this.loadingSubmit = false
    },
    handleUpdate() {
      this.loadingSubmit = true
      console.log('this.request.............................', this.request)
      advResource.updateAdv(this.request, this.deviceId).then(res => {
        console.log('res', res)
        if (res.error_code === 0) {
          Message.success('Cập nhật thành công')
          this.$emit('onClickButtonDialog')
          this.resetFormRequest()
          this.handleClose()
        } else {
          Message.error('Cập nhật thất bại')
        }
      }).catch(err => {
        console.log('err', err)
        Message.error(err)
      })
      this.loadingSubmit = false
    },
    async resetFormRequest() {
      this.formRequest = {}
      this.keyImage = []
      this.$refs['advForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onClickButtonDialog')
      this.resetFormRequest()
    },
    onPickImage(value, array) {
      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là JPG, JPEG, PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else if (value.size > 100000000) {
        Message({
          message: `Kích thước ảnh tối đa là 100 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else {
        if (value.status === 'success') {
          if (this.formRequest?.remove_images) this.formRequest.remove_images = [...this.formRequest.remove_images, value.id]
          else this.formRequest.remove_images = [value.id]
        } else {
          this.formRequest.files = array
        }
      }
    },
    onPickKeyImage(value, array) {
      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là JPG, JPEG, PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.keyImage = array
      } else if (value.size > 100000000) {
        Message({
          message: `Kích thước ảnh tối đa là 100.000 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.keyImage = array
      } else {
        if (value.status !== 'success') {
          this.formRequest.icon_file_key = array[0]
          this.$refs['advForm'].clearValidate('upload')
        }
      }
    },
    handleExceed(files, fileList, length) {
      Message({
        message: `Tối đa là ${length} hình ảnh, bạn đang chọn ${files.length + fileList.length} hình ảnh`,
        type: 'warning',
        duration: 5 * 1000
      })
    },
    appendForm() {
      console.log('this.formRequest......................', this.formRequest)
      const formData = new FormData()
      if (this.formRequest.icon_file_key && this.formRequest?.icon_file_key?.raw) {
        console.log('có file ...........................')
        const myNewFile = new File([this.formRequest.icon_file_key.raw], `${Date.now()}_${this.formRequest.icon_file_key.name}`, { type: this.formRequest.icon_file_key.raw.type })
        console.log('myNewFile..................', myNewFile)
        formData.append('icon_file_key', myNewFile)
      }
      console.log('formData..................', formData)
      if (this.formRequest.remove_images && Array.isArray(this.formRequest.remove_images)) {
        for (const r of this.formRequest.remove_images) {
          formData.append('remove_images', r)
        }
      }
      formData.append('linkWeb', this.formRequest.linkWeb)
      formData.append('title', this.formRequest.title)
      formData.append('typeScreen', this.formRequest.typeScreen)
      formData.append('typeUnit', this.formRequest.typeUnit)
      formData.append('expired_time', this.formRequest.expired_time)
      if (this.formRequest.note) {
        formData.append('note', this.formRequest.note)
      }
      if (this.formRequest.id) {
        formData.append('id', this.formRequest.id)
      }
      this.request = formData
    }
  }
}
</script>

<style scoped>

</style>
