<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="dialogVisible"
    :before-close="handleCloseDialog"
    width="80%"
  >
    <el-form ref="form" class="dialog-form-agent" :model="formRequest">
      <el-col :span="12">
        <el-col :span="23">
          <el-form-item label="Tên đại lý">
            <el-input
              v-model="formRequest.name"
            />
          </el-form-item>
          <el-form-item label="Mã đại lý">
            <el-input
              v-model="formRequest.code_agent"
            />
          </el-form-item>
          <!--          <el-form-item label="Tên sale xử lý">-->
          <!--            <el-select-->
          <!--              v-model="postForm.user_in_charge"-->
          <!--              filterable-->
          <!--              remote-->
          <!--              class="w-100"-->
          <!--              placeholder="Tên sale xử lý:"-->
          <!--              :remote-method="onSearchSale"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="sale in sales"-->
          <!--                :key="sale.value"-->
          <!--                :label="sale.label"-->
          <!--                :value="sale.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="SĐT đại lý:">
            <el-input
              v-model="formRequest.phone_number"
              prop="phone_number"
              placeholder="SĐT đại lý"
            />
          </el-form-item>
          <el-form-item label="Địa chỉ:">
            <el-input
              v-model="formRequest.address"
              prop="address"
              placeholder="Địa chỉ"
            />
          </el-form-item>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="23">
          <el-form-item label="Mã số thuế:">
            <el-input
              v-model="formRequest.tax_code"
              prop="tax_code"
              placeholder="Mã số thuế"
            />
          </el-form-item>
          <!--          <el-form-item label="vID đại lý:">-->
          <!--            <el-select-->
          <!--              v-model="postForm.agent_vid"-->
          <!--              filterable-->
          <!--              remote-->
          <!--              placeholder="Member"-->
          <!--              :remote-method="onSearchGolfer"-->
          <!--              style="width: 100%"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in listGolfer"-->
          <!--                :key="item._id"-->
          <!--                :label="item.fullname + ' - ' + (item.id_display||item._id)"-->
          <!--                :value="item._id"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
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
          <el-form-item label="Cấp Đại lý:">
            <el-select
              v-model="formRequest.level_agent"
              class="w-100"
              placeholder="Chọn cấp đại lý"
            >
              <el-option
                v-for="item in arrayLevelAgent"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Loại Đại Lý:">
            <el-select
              v-model="formRequest.agent_type"
              class="w-100"
              placeholder="Chọn loại đại lý"
            >
              <el-option
                v-for="item in arrayAgentType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">Hủy bỏ</el-button>
      <el-button v-if="isAdd" type="primary" @click="handleSubmitAdd">Thêm mới</el-button>
      <el-button v-else type="primary" @click="handleSubmitUpdate">Chỉnh sửa</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import AgentHIOResource from '@/api/HIO/agentHIO'
import { v4 as uuidv4 } from 'uuid'
import Axios from 'axios'
import { formatNumber } from '@/utils'
import { isEmpty } from '@/utils/validate'
import { getAcountInfo } from '@/utils/auth'

const agentHIOResource = new AgentHIOResource()
const arrayViewFacility = [
  { value: 1, label: 'Cho phép xem toàn bộ sân' },
  { value: 0, label: 'Giới hạn sân Golf' }
]

const arrayLevelAgent = [
  { value: -1, label: 'Không' },
  { value: 1, label: 'Loại 1: 20% <= 50tr hoặc 25% > 50tr' },
  { value: 2, label: 'Loại 2: 10% <= 10tr / 10 < 13% <= 50tr hoặc 50tr < 16% <= 80tr / 20% > 80tr' },
  { value: 3, label: 'Đại lý sân golf: 20% <= 50tr hoặc 25% > 50tr' }
]

const arrayAgentType = [
  { value: 0, label: 'Đại lý cá nhân' },
  { value: 1, label: 'Đại lý doanh nghiệp' }
]
export default {
  name: 'DialogFormAgent',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      title: '',
      loadingSubmit: false,
      arrayViewFacility: [...arrayViewFacility],
      arrayLevelAgent: [...arrayLevelAgent],
      arrayAgentType: [...arrayAgentType],
      sales: [],
      golferByInsurances: [],
      listImage: [],
      uploadFileLoading: false,
      updateID: '',
      listGolfer: [],
      loadingSearch: false,
      request: {},
      file_remove: null,
      disabled: Boolean,
      files: null,
      dialog: { titleName: 'Thêm mới đại lý', buttonName: 'Thêm mới' },
      formRequest: {
        id: '',
        name: '',
        code_agent: '',
        url_file: null,
        phone: null,
        address: null,
        tax_code: null,
        level_agent: null,
        agent_type: null,
        status_confirm: 0,
        parent_id: 8,
        admin_id: getAcountInfo().id
      }
    }
  },
  watch: {
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới  đại lý', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật đại lý', buttonName: 'Cập nhật' })
      }
    },
    objectData(value) {
      console.log('value1211111111111', value)
      if (!this.isAdd) {
        this.formRequest = {
          ...this.formRequest,
          ...value
        }
        this.listImage = value.url_file ? [{ url: value.url_file, name: value?.url_file }] : []
      } else {
        if (value) {
          this.formRequest = {
            ...this.formRequest,
            ...value
          }
          console.log('this.formRequest.....................', this.formRequest)
        }
      }
    }
  },
  methods: {
    async appendForm() {
      const formData = this.formRequest
      if (this.files != null && isEmpty(formData.file)) {
        const fileUpload = await this.uploadFileToServe(this.files)
        if (fileUpload) {
          formData.url_file = fileUpload.data.name
        }
      }
      return formData
    },
    async handleSubmitAdd() {
      if (this.files != null && isEmpty(this.formRequest.file)) {
        const fileUpload = await this.uploadFileToServe(this.files)
        if (fileUpload) {
          this.formRequest.url_file = fileUpload.data.name
        }
      }
      agentHIOResource.create(this.formRequest).then(async res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          await this.resetFormRequest()
          this.handleCloseDialog()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate() {
      if (this.files != null && isEmpty(this.formRequest.file)) {
        const fileUpload = await this.uploadFileToServe(this.files)
        if (fileUpload) {
          this.formRequest.url_file = fileUpload.data.name
        }
      }
      console.log('ưeqưeqưeqưeqưewq', this.formRequest.id)
      console.log('ưeqưeqưeqưeqưewq', this.formRequest)

      agentHIOResource.update(this.formRequest, this.formRequest.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.resetFormRequest()
          this.handleCloseDialog()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    onSearchGolfer(query) {
      if (query !== '') {
        this.loadingSearch = true
        agentHIOResource.searchGolfer({ q: query }).then((response) => {
          if (response.error_code === 0) {
            this.loadingSearch = true
            this.listGolfer = response.data
          }
        })
      } else {
        this.listGolfer = []
      }
    },

    async onPickImage(value, array) {
      console.log('value___________', value)
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
      delete this.postForm.url_file
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
    onSearchAdmin(keyword) {
      const params = { vID: keyword }
      agentHIOResource.searchAdmin(params).then(res => {
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
    async resetFormRequest() {
      (
        this.formRequest = {
          id: '',
          name: '',
          code_agent: '',
          url_file: null,
          phone: null,
          address: null,
          tax_code: null,
          level_agent: null,
          agent_type: null,
          status_confirm: 0,
          parent_id: 8,
          admin_id: getAcountInfo().id
        },
        this.listImage = [],
        this.files = null
      )
    },
    handleCloseDialog() {
      this.$emit('onClickCloseDialog', { dialog: true, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
