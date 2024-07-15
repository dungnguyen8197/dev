<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="40%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">
          <el-form-item label="Tên event">
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                placeholder="Tên event"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Loại event">
            <el-form-item prop="type">
              <el-select
                v-model="formRequest.type"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Loại event"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Location">
            <el-form-item prop="location">
              <el-input
                v-model="formRequest.location"
                placeholder="Location"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Link live score">
            <el-form-item prop="link">
              <el-input
                v-model="formRequest.link"
                placeholder="Link live score"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Trạng thái livescore">
            <el-form-item prop="live_status">
              <el-select
                v-model="formRequest.live_status"
                filterable
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Trạng thái livescore"
              >
                <el-option
                  v-for="item in liveStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Đơn vị tổ chức">
            <el-form-item prop="unit_organization">
              <el-input
                v-model="formRequest.unit_organization"
                placeholder="Đơn vị tổ chức"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian bắt đầu :" required>
            <el-form-item prop="date_start">
              <el-date-picker
                v-model="formRequest.date_start"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian bắt đầu"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian kết thúc :" required>
            <el-form-item prop="date_end">
              <el-date-picker
                v-model="formRequest.date_end"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian kết thúc"
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
import EventResource from '@/api/event'
import { v4 as uuidv4 } from 'uuid'
import { formatNumber } from '@/utils/convert'

const eventResource = new EventResource()

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
        type: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.type, callback, 'Loại event'),
            trigger: 'change'
          }
        ],
        location: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.location, callback, 'Location'),
            trigger: 'change'
          }
        ],
        unit_organization: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.unit_organization, callback, 'Đơn vị tổ chức'),
            trigger: 'change'
          }
        ],
        date_start: [
          {
            validator: (rule, _, callback) =>
              validateDate(rule, this.formRequest.date_start, callback, 'Thời gian bắt đầu'),
            trigger: 'change'
          }
        ],
        date_end: [
          {
            validator: (rule, _, callback) =>
              validateDate(rule, this.formRequest.date_end, callback, 'Thời gian kết thúc'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      dialog: { titleName: 'Thêm mới event draf', buttonName: 'Thêm mới' },
      typeList: [],
      liveStatus: [],
      keyImage: [],
      isUploadImage: false
    }
  },
  watch: {
    objectData(value) {
      this.typeList = Object.entries(value.typeList).map(([key, value]) => ({
        value: parseInt(key),
        label: value
      }))
      this.liveStatus = Object.entries(value.liveStatus).map(([key, value]) => ({
        value: parseInt(key),
        label: value
      }))
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          this.handleSubmitAdd()
        }
      })
    },

    async handleSubmitAdd() {
      if (this.isUploadImage) {
        this.$refs.uploadLogo.submit()
      } else {
        await eventResource.store_event_draf(this.formRequest).then(res => {
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
            this.formRequest.logo = []
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
      this.formRequest.logo = res.name
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
