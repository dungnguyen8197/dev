<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="60%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col>
          <el-form-item label="Tên doanh nghiệp:" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"
                prop="name"
                placeholder="Tên doanh nghiệp"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Địa chỉ:" required>
            <el-form-item prop="address">
              <el-input
                v-model="formRequest.address"
                prop="name"
                placeholder="Địa chỉ"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Giới thiệu:" required>
            <el-form-item prop="about">
              <el-input
                v-model="formRequest.about"
                prop="name"
                type="textarea"
                placeholder="Giới thiệu"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Số điện thoai:" required>
            <el-form-item prop="hotline">
              <el-input
                v-model="formRequest.hotline"
                prop="name"
                placeholder="Số điện thoai"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Link web:" required>
            <el-form-item prop="facebook_link">
              <el-input
                v-model="formRequest.facebook_link"
                prop="name"
                placeholder="Link web"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="email:" required>
            <el-form-item prop="email">
              <el-input
                v-model="formRequest.email"
                prop="name"
                placeholder="email"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Trạng thái:">
            <el-select
              v-model="formRequest.is_public"
              placeholder="trạng thái hiển thị"
            >
              <el-option
                v-for="level in arrayStatus"
                :key="level.value"
                :label="level.label"
                :value="level.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isAdd === true" label="vID chủ tịch:" required>
            <el-form-item prop="user_admin">
              <el-select
                v-model="formRequest.user_admin"
                class="w-100"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="Tìm kiếm mã VID"
                :remote-method="onSearchGolfer"
                :loading="loadingSearchUser"
              >
                <el-option v-for="user in users" :key="user.value" :label="user.label" :value="user.value" />
              </el-select>
            </el-form-item>
          </el-form-item>

          <el-form-item label="Logo doanh nghiệp:" required>
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
                <el-button type="primary"> Upload poster</el-button>
              </el-upload>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Background doanh nghiệp:">
            <el-form-item prop="upload">
              <el-upload
                ref="ruleForm"
                :file-list="listImageBackground"
                class="upload-demo"
                action="uploadURL"
                list-type="picture"
                multiple
                :on-change="onPickImageBackground"
                :on-remove="removeFileBackground"
                :on-preview="previewFile"
                :auto-upload="false"
                :limit="1"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
              >
                <el-button type="primary"> Upload poster</el-button>
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
import { isEmpty } from '@/utils/validate'
import { Message } from 'element-ui'
import { baseURL } from '@/constant/config'
import { getAcountInfo } from '@/utils/auth'
import { v4 as uuidv4 } from 'uuid'
// import moment from 'moment'
import { formatNumber } from '@/utils/convert'
import Axios from 'axios'
import EventResource from '@/api/event'
import GolferResource from '@/api/golfer/golfer'
const golferResource = new GolferResource()

const eventResource = new EventResource()
const arrayStatus = [
  { value: 1, label: 'Hiển thị' },
  { value: 0, label: 'Không hiển thị' }
]
export default {
  name: 'DialogAddCompany',
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
      editorConfig: {
        toolbarGroups: [
          { name: 'document', groups: ['mode', 'document', 'doctools'] },
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
          { name: 'forms', groups: ['forms'] },
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
          { name: 'links', groups: ['links'] },
          { name: 'insert', groups: ['insert'] },
          { name: 'styles', groups: ['styles'] },
          { name: 'colors', groups: ['colors'] },
          { name: 'tools', groups: ['tools'] },
          { name: 'others', groups: ['others'] },
          { name: 'about', groups: ['about'] }
        ],
        height: 300,
        line_height: '1'
      },
      arrayStatus: [...arrayStatus],
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
        user_create_club: getAcountInfo().id,
        name: null,
        logo_url_path: '',
        address: null,
        about: null,
        hotline: null,
        email: null,
        facebook_link: null,
        type_club: 4
      },
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      listImage: [],
      listImageBackground: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      round: [],
      facilities: [],
      users: [],
      clubs: [],
      paths: [],
      facilityModel: {},
      file: null,
      fileBackground: null,
      dialog: { titleName: 'Thêm mới doanh nghiệp', buttonName: 'Thêm mới' },
      organization: null,
      loadingSearchCompany: false
    }
  },
  computed: {

  },
  watch: {
    async objectData(value) {
      console.log('value1211111111111', value)
      if (!this.isAdd) {
        this.formRequest = {
          ...this.formRequest,
          ...value
        }
        this.listImage = value.logo_url_path ? [{ url: value.logo_url_path }] : []
        this.listImageBackground = value.img_background ? [{ url: value.img_background }] : []
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
        this.dialog = Object.assign({}, { titleName: 'Thêm mới doanh nghiệp', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật doanh nghiệp', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    onSearchGolfer(keyword) {
      golferResource.searchGolfer({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              const label = `vID${value.id} - ${value.fullname}`
              return { value: value.id, label: label, phone: value.phone }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
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
      eventResource.storeCompany(formBody).then(async res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          await this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate(formBody) {
      eventResource.updateCompany(formBody, formBody.id).then(res => {
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

    async resetformRequest() {
      await Promise.resolve(
        (
          this.formRequest = {
            user_create_club: getAcountInfo().id,
            name: null,
            logo_url_path: '',
            address: null,
            about: null,
            hotline: null,
            email: null,
            facebook_link: null,
            type_club: 4
          },
          this.listImage = [],
          this.listImageBackground = []
        )
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
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
      } else if (value.size > 4 * 1000 * 1000) {
        Message({
          message: `Kích thước ảnh tối đa là 4 MB, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} B`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImage = array
      } else {
        this.file = value.raw
      }
    },
    async onPickImageBackground(value, array) {
      console.log('value___________', value)

      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là JPG, JPEG, PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImageBackground = array
      } else if (value.size > 4 * 1000 * 1000) {
        Message({
          message: `Kích thước ảnh tối đa là 4 MB, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} B`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.listImageBackground = array
      } else {
        this.fileBackground = value.raw
      }
    },
    removeFile(value) {
      delete this.formRequest.logo_url_path
      this.file = null
    },
    removeFileBackground(value) {
      delete this.formRequest.img_background
      this.fileBackground = null
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
      if (this.file != null && isEmpty(formData.logo_url_path)) {
        const fileUpload = await this.uploadFileToServe(this.file)
        if (fileUpload) { formData.logo_url_path = fileUpload.data.name }
      }
      if (this.fileBackground != null && isEmpty(formData.img_background)) {
        const fileUpload = await this.uploadFileToServe(this.fileBackground)
        if (fileUpload) { formData.img_background = fileUpload.data.name }
      }
      formData.title = this.formRequest.name

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
