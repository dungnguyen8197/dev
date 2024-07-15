<template>
  <el-dialog
    width="80%"
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="notifyForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-notifyForm">
      <el-row>
        <el-col :sm="24" :md="11">
          <el-form-item label="Branch Name" required>
            <el-form-item prop="branch_name">
              <el-select
                v-model="formRequest.branch_name"
                clearable
                style="width: 100%"
                class="w-100"
                filterable
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Chọn Branch"
              >
                <el-option
                  v-for="(branch, key) in branchName"
                  :key="key"
                  :label="branch"
                  :value="+key"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Tiêu đề" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.name"

                placeholder="Nhập tiêu đề..."
                clearable
                prop="title"
                @keyup.enter.native="onSubmitForm('notifyForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian bắt đầu" required>
            <el-form-item prop="start_date">
              <el-date-picker
                v-model="formRequest.start_date"
                :picker-options="pickerExport"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian bắt đầu"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian kết thúc" required>
            <el-form-item prop="end_date">
              <el-date-picker
                v-model="formRequest.end_date"
                :picker-options="pickerImport"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian kết thúc"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Điều hướng đến màn hình trên app khi touch vào" required>
            <el-form-item prop="category">
              <el-select
                v-model="formRequest.type_screen"
                clearable
                style="width: 100%"
                class="w-100"
                filterable
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Chọn màn hình"
                @change="() => delete formRequest.service_id"
              >
                <el-option
                  v-for="(screen, key) in screenApp"
                  :key="key"
                  :label="screen.label"
                  :value="screen.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="type_detail_screen.includes(formRequest.type_screen)" label="Chọn sản phẩm chi tiết" required>
            <el-form-item prop="service_id">
              <el-input
                v-model="formRequest.service_id"

                placeholder="Nhập ID sản phẩm"
                clearable
                prop="service_id"
                @keyup.enter.native="onSubmitForm('notifyForm')"
              />
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item label="Link web">
            <el-form-item prop="link_web">
              <el-input v-model="formRequest.linkWeb" prop="quantity" @keyup.enter.native="onSubmitForm('notifyForm')" />
            </el-form-item>
          </el-form-item> -->
          <el-form-item label="Nội dung" required>
            <el-form-item prop="content">
              <el-input
                v-model="formRequest.content"
                prop="content"
                :rows="3"
                type="textarea"
                placeholder="Nội dung..."
                @keyup.enter.native="onSubmitForm('notifyForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Ảnh hiển thị">
            <el-form-item prop="upload">
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
                :limit="5"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
                accept="image/*"
              >
                <i class="el-icon-upload" />
              </el-upload>
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item label="Admin tạo">
            <el-select v-model="formRequest.cskh_id" class="w-100" filterable placeholder="Chọn Admin">
              <el-option

                v-for="item in listAdmin"
                :key="item.id"
                :label="`${item.name} - ${item.phone}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
        </el-col>
        <el-col :sm="24" :md="{span:12,offset:1}">
          <el-form-item label="Đối tượng nhận Noti :" required />
          <el-row>
            <el-col :xs="24" :sm="6">
              <label for="">Danh sách vID nhận Noti :</label>
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-button size="mini" type="primary" @click="downloadTemplate">Tải file mẫu<i
                class="el-icon-download el-icon-right"
              /></el-button>
            </el-col>

            <el-col :xs="24" :sm="4">

              <el-upload ref="upload_golfer_receiver" action="uploadURL" :on-change="onChangeFileExcel" :auto-upload="false" :limit="1">
                <el-button size="mini" type="primary">Import Golfer <i
                  class="el-icon-download el-icon-right"
                /></el-button>
              </el-upload>
            </el-col>
          </el-row>
          <label for="">Theo điều kiện lọc :</label>
          <el-row>
            <el-col :xs="24" :sm="6">
              <label for="">Theo hạng Member :</label>
              <el-checkbox-group v-model="formRequest.filter_member_ship">
                <el-checkbox v-for="item in listMember" :key="item.value" class="w-100" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :xs="24" :sm="6">
              <label for="">Giới tính  :</label>
              <el-checkbox-group v-model="formRequest.filter_member_gender">
                <el-checkbox v-for="item in listGender" :key="item.value" class="w-100" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :xs="24" :sm="6">
              <label for="">Độ tuổi  :</label>
              <el-checkbox-group v-model="formRequest.filter_member_age">
                <el-checkbox v-for="item in listAge" :key="item.value" class="w-100" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col
              :xs="24"
              :sm="6"
            >
              <label for="">Danh sách loại trừ :</label>
              <el-button
                style="margin-bottom: 10px;"
                size="mini"
                type="primary"
                @click="downloadTemplate"
              >
                Tải file mẫu
                <i class="el-icon-download " />
              </el-button>
              <br>
              <el-upload ref="upload_golfer_block" action="uploadURL" :on-change="onChangeFileExcelUserBlock" :auto-upload="false" :limit="1">
                <el-button size="mini" type="primary">Import Golfer <i
                  class="el-icon-download el-icon-right"
                /></el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row v-if="listGolfers.length > 0" class="data-table-content table-responsive mt-10">
            <span class="mb-20"><b>Danh sách Golfer nhận thông báo: </b></span>
            <table
              class="table table-bordered"
              style="vertical-align: center ;
                display: block;
                max-height: 500px;
                overflow-y: scroll;"
            >
              <thead>
                <tr>
                  <th class="text-center col-3 vertical-middle" style="min-width: 500px">Tên</th>
                  <th scope="col" class="text-center" style="max-width:100px">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(golfer, key) in listGolfers" :key="key">
                  <th style="text-align: left" class="col-3">
                    {{ `vID${golfer.id} - ` + golfer.fullname }}
                  </th>

                  <td style="text-align: center; max-width:100px" class="vertical-middle">
                    <el-button type="danger" size="mini" @click="handleCloseTag(golfer)">Xóa</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
          <el-row v-if="listGoferBlock.length > 0" class="data-table-content table-responsive mt-10">
            <span class="mb-20"><b>Danh sách Golfer chặn thông báo: </b></span>
            <table
              class="table table-bordered"
              style="vertical-align: center ;
                display: block;
                max-height: 500px;
                overflow-y: scroll;"
            >
              <thead>
                <tr>
                  <th class="text-center col-3 vertical-middle" style="min-width: 500px">Tên</th>
                  <th scope="col" class="text-center" style="max-width:100px">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(golfer, key) in listGoferBlock" :key="key">
                  <th style="text-align: left" class="col-3">
                    {{ `vID${golfer.id} - ` + golfer.fullname }}
                  </th>

                  <td style="text-align: center; max-width:100px" class="vertical-middle">
                    <el-button type="danger" size="mini" @click="handleCloseTagBlock(golfer)">Xóa</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button :disabled="!isAdd && objectData.state != 0" type="primary" :loading="loadingSubmit" @click="onSubmitForm('notifyForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { validateDate, validateText } from '@/utils/validate'
import { BRANCH_NAME } from '@/utils/status'
import { Message } from 'element-ui'
import * as XLSX from 'xlsx'
import GolferResource from '@/api/golfer/golfer'
import NotifyResource from '@/api/adv/notify'
import { getAcountInfo, getAllAdmin } from '@/utils/auth'
import { formatNumber } from '@/utils/convert'
import moment from 'moment'
import { listMember, listGender, listAge, SCREEN_APP, TYPE_DETAIL_SCREEN } from '@/utils/defaultOptions'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const golferResource = new GolferResource()
const notifyResource = new NotifyResource()
// const URL_API_UPLOAD = process.env.VUE_APP_URL_API_UPLOAD

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
    }
  },
  data() {
    return {
      rules: {
        content: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.content, callback, 'Nội dung'), trigger: 'change' }],
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tiêu đề'), trigger: 'change' }],
        start_date: [{ validator: (rule, _, callback) => validateDate(rule, this.formRequest.start_date, callback, 'Thời gian bắt đầu'), trigger: 'change' }],
        end_date: [{ validator: (rule, _, callback) => validateDate(rule, this.formRequest.end_date, callback, 'Thời gian kết thúc'), trigger: 'change' }],
        branch_name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.branch_name, callback, 'Branch Name'), trigger: 'change' }]
      },
      listAdmin: getAllAdmin(),
      listAge: listAge,
      listGender: listGender,
      listMember: listMember,
      screenApp: SCREEN_APP,
      branchName: BRANCH_NAME,
      type_detail_screen: TYPE_DETAIL_SCREEN,
      listGolfers: [],
      listGoferBlock: [],
      dialog: { titleName: 'Thêm mới chương trình', buttonName: 'add' },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        filter_member_gender: [],
        filter_member_ship: [],
        filter_member_age: [],
        cskh_id: getAcountInfo().id,
        branch_name: 0
      },
      request: {},
      notiId: '',
      showInputService: false,
      listImage: [],
      keyImage: [],
      query: {
        limit: 10,
        page: 1
      }
    }
  },
  computed: {
    pickerExport() {
      if (this.formRequest['end_date']) {
        return {
          disabledDate: (time) => {
            return !moment(time.getTime()).isBetween(moment().subtract(1, 'day'), this.formRequest['end_date'])
          }
        }
      } else {
        return {
          disabledDate: (time) => {
            return time.getTime() < moment().subtract(1, 'day')
          }
        }
      }
    },
    pickerImport() {
      if (this.formRequest['start_date']) {
        return {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.formRequest['start_date'])
          }
        }
      } else {
        return {
          disabledDate: (time) => {
            return time.getTime() < moment().subtract(1, 'day')
          }
        }
      }
    }
  },
  watch: {
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới chương trình', buttonName: 'add' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật chương trình', buttonName: 'update' })
      }
    },
    async objectData(obj) {
      if (obj) {
        this.keyImage = []
        console.log('object data ...........', obj)
        const listImage = JSON.parse(JSON.parse(obj.image))

        this.loadingSubmit
        this.notiId = obj.id
        this.formRequest = {
          ...obj,
          filter_member_age: obj.filter_member_age || [],
          filter_member_gender: obj.filter_member_gender || [],
          filter_member_ship: obj.filter_member_ship || []
        }
        if (obj.users_list_receiver && obj.users_list_receiver.length > 0) {
          const data = await this.onGetInGolfer(obj.users_list_receiver)
          this.listGolfers = data
        }
        if (obj.users_list_block && obj.users_list_block.length > 0) {
          const data = await this.onGetInGolfer(obj.users_list_block)
          this.listGoferBlock = data
        }
        if (obj.payload_data) {
          this.formRequest.linkWeb = obj.payload_data?.data?.url
        }
        if (listImage && listImage.length > 0) {
          console.log('listImage', listImage.length)
          this.formRequest.image = listImage

          this.keyImage = []
          for (let i = 0; i < listImage.length; i++) {
            const image = listImage[i]
            this.keyImage.push({ url: image })
          }
        }
      }
    }
  },
  created() {

  },
  methods: {
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          await this.formatForm()
          if (this.isAdd) this.handleSubmit()
          else this.handleUpdate()
        }
      })
    },
    handleSubmit() {
      this.loadingSubmit = true

      notifyResource.storeNotify(this.formRequest).then(res => {
        if (res.error_code === 0) {
          console.log('kết quả đạt được', res)
          this.$message.success('Tạo mới thành công.')
          this.resetFormRequest()
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    handleUpdate() {
      this.loadingSubmit = true

      notifyResource.updateNotify(this.formRequest).then(res => {
        if (res.error_code === 0) {
          console.log('kết quả đạt được', res)
          this.$message.success('Cập nhật thành công.')
          this.resetFormRequest()
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async resetFormRequest() {
      await Promise.resolve(
        this.formRequest = {
          filter_member_gender: [],
          filter_member_ship: [],
          filter_member_age: [],
          cskh_id: getAcountInfo().id,
          branch_name: 0
        },
        this.keyImage = [],
        this.listGolfers = [],
        this.listGoferBlock = []
      )
      this.$refs['notifyForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },
    downloadTemplate() {
      // Tạo một đối tượng URL từ đường dẫn đến file mẫu
      const fileURL = '/list_golfer_notify_example.xlsx'
      // Tạo một thẻ a ẩn
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.download = 'list-golfer-example.xlsx'

      // Kích hoạt sự kiện click để tải file
      link.click()
    },
    handleCloseTag(golfer) {
      this.listGolfers.splice(this.listGolfers.indexOf(golfer), 1)
    },
    handleCloseTagBlock(golfer) {
      this.listGoferBlock.splice(this.listGoferBlock.indexOf(golfer), 1)
    },
    async onChangeFileExcel(value, array) {
      if (value?.name.includes('%') || value?.name.includes('#') || value?.name.includes('/')) {
        Message({
          message: `Tên file khồng được chứa ký tự %, # và /`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else if (value?.raw?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng file là XLSX`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else {
        console.log(value.raw)
        this.fileExcel = value.raw
        const reader = new FileReader()
        reader.onload = (e) => {
          var data = e.target.result
          var workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const rowObject = XLSX.utils.sheet_to_json(worksheet, { header: ['id'] })
          rowObject.shift()
          if (rowObject.length > 0) {
            const arrUserId = rowObject.filter(item => item.id).map(item => +item.id)
            golferResource.getInGolfer({ users_id: arrUserId }).then(res => {
              const result = res.data
              const existingUserIds = result.map(user => user.id)
              const nonExistingUserIds = arrUserId.filter(id => !existingUserIds.includes(id))
              if (nonExistingUserIds.length > 0) {
                Message({
                  message: `không tồn tại mã vID ${nonExistingUserIds}`,
                  type: 'warning',
                  duration: 8 * 1000
                })
                return
              } else {
                this.listGolfers = [...this.listGolfers, ...result].filter((obj, index, self) =>
                  index === self.findIndex((o) => (
                    o.id === obj.id
                  ))
                )
                this.$message.success('Import thành công , Các User trùng lặp sẽ xóa.')
              }
            })
          } else {
            this.$message.warning('Không có bản ghi.')
            return
          }
        }
        reader.readAsBinaryString(value.raw)
        array.pop()
        // this.$refs.upload.clearFiles()
      }
    },
    async onChangeFileExcelUserBlock(value, array) {
      if (value?.name.includes('%') || value?.name.includes('#') || value?.name.includes('/')) {
        Message({
          message: `Tên file khồng được chứa ký tự %, # và /`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else if (value?.raw?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng file là XLSX`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else {
        console.log(value.raw)
        this.fileExcel = value.raw
        const reader = new FileReader()
        reader.onload = (e) => {
          var data = e.target.result
          var workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const rowObject = XLSX.utils.sheet_to_json(worksheet, { header: ['id'] })
          rowObject.shift()
          if (rowObject.length > 0) {
            const arrUserId = rowObject.filter(item => item.id).map(item => +item.id)
            golferResource.getInGolfer({ users_id: arrUserId }).then(res => {
              const result = res.data
              const existingUserIds = result.map(user => user.id)
              const nonExistingUserIds = arrUserId.filter(id => !existingUserIds.includes(id))
              if (nonExistingUserIds.length > 0) {
                Message({
                  message: `không tồn tại mã vID ${nonExistingUserIds}`,
                  type: 'warning',
                  duration: 8 * 1000
                })
                return
              } else {
                this.listGoferBlock = [...this.listGoferBlock, ...result].filter((obj, index, self) =>
                  index === self.findIndex((o) => (
                    o.id === obj.id
                  ))
                )
                this.$message.success('Import thành công , Các User trùng lặp sẽ xóa.')
              }
            })
          } else {
            this.$message.warning('Không có bản ghi.')
            return
          }
        }
        reader.readAsBinaryString(value.raw)
        array.pop()
        // this.$refs.upload.clearFiles()
      }
    },
    async onGetInGolfer(users_id) {
      const res = await golferResource.getInGolfer({ users_id: users_id })
      if (res.error_code === 0) return res.data
      else return []
    },
    async onPickKeyImage(value, array) {
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
          if (array[0] && array[0]?.raw) {
            this.formRequest.image = array.map(file => file.raw)
          } else {
            this.formRequest.image = []
          }
          console.log('............................  this.formRequest.image', this.formRequest.image)
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
    async uploadFileToServe(file) {
      console.log(file)
      const myNewFile = new File([file], `${uuidv4().toString()}.png`, { type: file.type })
      const url = `https://prod-web-wghn.vcallid.com/adv/notify/post-image-vcall`
      const formData = new FormData()
      formData.append('image', myNewFile)
      const res = await axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      console.log('res image api ', res)
      return res
    },
    async formatForm() {
      if (this.listGolfers.length > 0) {
        const users_list_receiver = this.listGolfers.map(item => item.id)
        this.formRequest.users_list_receiver = users_list_receiver
      }

      if (this.listGoferBlock.length > 0) {
        const users_list_block = this.listGoferBlock.map(item => item.id)
        this.formRequest.users_list_block = users_list_block
      }

      if (this.formRequest.linkWeb) {
        const linkWeb = {
          type: 'openweb',
          data: {
            url: this.formRequest.linkWeb
          }
        }
        this.formRequest.payload_data = linkWeb
        delete this.formRequest.linkWeb
      }

      if (this.formRequest.image && this.formRequest.image.length > 0) {
        const addFile = []
        const files = this.formRequest.image
        this.formRequest.image = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileUpload = await this.uploadFileToServe(file)
          addFile.push(fileUpload.data.name)
          this.formRequest.image = addFile
        }
      }
    },

    formatNumber
  }
}
</script>

<style scoped>
.w-100 {
  width: 100%;
}
.mt-10{
  margin-top: 10px;
}
</style>
