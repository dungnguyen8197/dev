<template>
  <el-dialog
    width="50%"
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="notifyForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-notifyForm">
      <el-row>
        <el-col :sm="24" :md="24" align="center">
          <el-form-item label="Tiêu đề" required>
            <el-form-item prop="title">
              <el-input
                v-model="formRequest.title"
                clearable
                prop="title"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="!isPopup && !isScoreCard" label="Độ ưu tiên (Độ ưu tiên cao hơn sẽ được show lên trước)">
            <el-form-item prop="priority">
              <el-input
                v-model="formRequest.priority"
                clearable
                prop="priority"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian bắt đầu" required>
            <el-form-item prop="start_time">
              <el-date-picker
                v-model="formRequest.start_time"
                :picker-options="pickerExport"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian bắt đầu"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian hết hạn" required>
            <el-form-item prop="expiried_time">
              <el-date-picker
                v-model="formRequest.expired_time"
                :picker-options="pickerImport"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="Thời gian hết hạn"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="isPopup" label="Thời gian hiển thị" required>
            <el-form-item prop="time_slot">
              <el-time-picker
                v-model="formRequest.time_slot"
                :on-change="changeSlotTime"
                is-range
                range-separator="To"
                start-placeholder="Start time"
                end-placeholder="End time"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Điều hướng đến màn hình trên app khi touch vào" required>
            <el-form-item prop="screen_target_data">
              <el-select
                v-model="formRequest.screen_target_data"
                style="width: 100%"
                class="w-100"
                :multiple-limit="1"
                placeholder="Chọn màn hình hiển thị"
                filterable
              >
                <el-option
                  v-for="item in ScreenTouch"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item label="Số lần hiển thị" required> -->
          <!-- <el-form-item prop="number_of_impressions">
              <el-input
                v-model="formRequest.number_of_impressions"
                clearable
                prop="number_of_impressions"
              />
            </el-form-item> -->
          <el-form-item label="Link web">
            <el-form-item prop="linkWeb">
              <el-input v-model="formRequest.linkWeb" prop="quantity" />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Nội dung" required>
            <el-form-item prop="content">
              <el-input
                v-model="formRequest.content"
                prop="content"
                :rows="3"
                type="textarea"
                placeholder="Nội dung..."
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Ảnh hiển thị" required>
            <el-form-item prop="image">
              <div class="clearfix" />
              <el-upload
                ref="upload"
                v-model="this.formRequest.banner_url"
                action="https://api-v2.vcallid.com/api/utils/upload/data"
                list-type="picture-card"
                name="image"
                :on-remove="onRemoveImage"
                :on-change="onPickKeyImage"
                :on-success="onSuccessUploadImage"
                :on-error="onErrorUploadImage"
                :auto-upload="true"
                :file-list="keyImage"
                :limit="1"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
                accept="image/*"
              >
                <i class="el-icon-upload" />
              </el-upload>
            </el-form-item>
          </el-form-item>
          <!-- </el-form-item> -->
          <el-form-item v-if="!isPopup && !isScoreCard" prop="list_screen" label="Màn hình hiển thị">
            <el-select
              v-model="formRequest.list_screen"
              multiple
              placeholder="Chọn màn hình hiển thị"
              style="width: 100%"
              class="w-100"
              filterable
            >
              <el-option
                v-for="item in Screens"
                ref="option_select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <el-checkbox v-model="item.check" @change="handleChangeScreen">{{ item.label }}</el-checkbox>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="!isPopup && !isScoreCard" label="Vị trí" required>
            <el-form-item prop="position">
              <el-select
                v-model="formRequest.position"
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
                  v-for="{value, label} in position"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-col>
        <!-- <el-col v-if="isPopup" :sm="24" :md="{span:24,offset:1}">
          <el-form-item label="Đối tượng hiển thị quảng cáo:" required />
          <el-row>
            <el-col :xs="24" :md="8" :sm="8">
              <label for="">Danh sách vID hiển thị quảng cáo:</label>
            </el-col>
            <el-col :xs="24" :md="8" :sm="8">
              <el-button size="mini" type="primary" @click="downloadTemplate">Tải file mẫu<i
                class="el-icon-download el-icon-right"
              /></el-button>
            </el-col>

            <el-col :xs="24" :md="8" :sm="8">
              <el-upload ref="upload_golfer_receiver" action="uploadURL" :on-change="onChangeFileExcel" :auto-upload="false" :limit="1">
                <el-button size="mini" type="primary">Import Golfer <i
                  class="el-icon-download el-icon-right"
                /></el-button>
              </el-upload>
            </el-col>
          </el-row>
          <label for="">Theo điều kiện lọc :</label>
          <el-row>
            <el-col :xs="24" :md="6" :sm="24">
              <label for="">Theo hạng Member :</label>
              <el-checkbox-group v-model="formRequest.filter_member_ship">
                <el-checkbox v-for="item in listMember" :key="item.value" class="w-100" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :xs="24" :md="6" :sm="24">
              <label for="">Giới tính  :</label>
              <el-checkbox-group v-model="formRequest.filter_member_gender">
                <el-checkbox v-for="item in listGender" :key="item.value" class="w-100" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :xs="24" :md="6" :sm="24">
              <label for="">Độ tuổi  :</label>
              <el-checkbox-group v-model="formRequest.filter_member_age">
                <el-checkbox v-for="item in listAge" :key="item.value" class="w-100" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col
              :xs="24"
              :md="6"
              :sm="24"
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
            <span class="mb-20"><b>Danh sách Golfer hiển thị quảng cáo: </b></span>
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
                    {{ `VID${golfer.id} - ` + golfer.fullname }}
                  </th>

                  <td style="text-align: center; max-width:100px" class="vertical-middle">
                    <el-button type="danger" size="mini" @click="handleCloseTag(golfer)">Xóa</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
          <el-row v-if="listGoferBlock.length > 0" class="data-table-content table-responsive mt-10">
            <span class="mb-20"><b>Danh sách Golfer không hiển thị quảng cáo: </b></span>
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
                    {{ `VID${golfer.id} - ` + golfer.fullname }}
                  </th>

                  <td style="text-align: center; max-width:100px" class="vertical-middle">
                    <el-button type="danger" size="mini" @click="handleCloseTagBlock(golfer)">Xóa</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </el-col> -->
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('notifyForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { isEmpty, validateText, validateWebsite, validateDate, validateImage, validateSelect } from '@/utils/validate'
import { POSITION, SCREEN_APP, list_position } from '@/utils/status'
import { Message } from 'element-ui'
import * as XLSX from 'xlsx'
import GolferResource from '@/api/golfer/golfer'
import { getAcountInfo, getAllAdmin } from '@/utils/auth'
import { formatNumber } from '@/utils/convert'
import moment from 'moment'
import { listMember, listGender, listAge } from '@/utils/defaultOptions'
import AdvResourceScoreCard from '@/api/adv/scorecard'
import AdvResource from '@/api/adv/adv'
import AdvResourcePopup from '@/api/adv/popup'
import { baseURL } from '@/constant/config'

const golferResource = new GolferResource()

let advResource = null

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
    },
    isPopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        content: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.content, callback, 'Nội dung'), trigger: 'change' }],
        title: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.title, callback, 'Tiêu đề'), trigger: 'change' }],
        start_time: [{ validator: (rule, _, callback) => validateDate(rule, this.formRequest.start_time, callback, 'Thời gian bắt đầu'), trigger: 'change' }],
        expiried_time: [{ validator: (rule, _, callback) => validateDate(rule, this.formRequest.expired_time, callback, 'Thời gian kết thúc'), trigger: 'change' }],
        // list_screen: [{ validator: (rule, value, callback) => validateSelectNotEmpty(rule, this.formRequest.list_screen, callback, 'Màn hình hiển thị'), trigger: 'change' }],
        // screen_target_data: [{ validator: (rule, value, callback) => validateSelectNotEmpty(rule, this.formRequest.screen_target_data, callback, 'Màn hình điều hướng'), trigger: 'change' }],
        image: [{ validator: (rule, _, callback) => validateImage(rule, this.formRequest.banner_url, callback, 'Ảnh'), trigger: 'change' }],
        screen_target_data: [{ validator: (rule, _, callback) => validateSelect(rule, this.formRequest.screen_target_data, callback, 'Màn hình'), trigger: 'change' }],

        linkWeb: [{ validator: (rule, _, callback) => validateWebsite(rule, this.formRequest.linkWeb, callback, 'Link', this.formRequest.screen_target_data), trigger: 'change' }]
      },
      listAdmin: getAllAdmin(),
      listAge: listAge,
      listGender: listGender,
      listMember: listMember,
      screenApp: SCREEN_APP,
      position: list_position,
      listGolfers: [],
      listGoferBlock: [],
      dialog: { titleName: 'Thêm mới chương trình', buttonName: 'add' },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        filter_member_gender: [],
        filter_member_ship: [],
        filter_member_age: [],
        start_time: null,
        expired_time: null,
        cskh_id: getAcountInfo().id,
        list_screen: [],
        screen_target_data: null,
        title: '',
        position: POSITION.Top,
        priority: 1,
        linkWeb: '',
        banner_url: ''
      },
      request: {},
      notiId: '',
      companyData: [],
      listImage: [],
      keyImage: [],
      query: {
        limit: 10,
        page: 1
      },
      Screens: [],
      ScreenTouch: []
    }
  },
  computed: {
    pickerExport() {
      console.log('pickerExport', this.formRequest['expired_time'])
      if (this.formRequest['expired_time']) {
        return {
          disabledDate: (time) => {
            return !moment(time.getTime()).isBetween(moment().subtract(1, 'day'), this.formRequest['expired_time'])
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
      console.log('pickerImport', this.formRequest['start_time'])
      if (this.formRequest['start_time']) {
        console.log('pickerImport 11111111111111', this.formRequest['start_time'])
        return {
          disabledDate: (time) => {
            return time.getTime() < new Date(!isEmpty(this.formRequest['start_time']) ? this.formRequest['start_time'] : moment().subtract(1, 'day'))
          }
        }
      } else {
        console.log('pickerImport 222222222222222', this.formRequest['start_time'])
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
        this.resetScreens()
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật chương trình', buttonName: 'update' })
      }
    },
    async objectData(obj) {
      console.log('objectData', obj)
      if (!isEmpty(obj)) {
        console.log('object data ...........', obj)
        // const screenKeys = obj.screens.map(screen => screen.info.key);

        this.notiId = obj.id
        this.formRequest = {
          ...obj,
          expired_time: moment(obj.expiried_time).format('yyyy-MM-DD HH:mm:ss'),
          banner_url: obj.banner_url,
          position: this.position.filter(item => item.value === obj.position)[0]?.label,
          list_screen: obj?.screens?.map(screen => screen.info.key),
          screen_target_data: obj?.target?.name,
          linkWeb: obj.url,
          start_time: !isEmpty(obj.start_time) ? moment(obj.start_time).format('yyyy-MM-DD HH:mm:ss') : moment().format('yyyy-MM-DD HH:mm:ss'),
          filter_member_age: JSON.parse(obj.age)?.map(item => parseInt(item)) || [],
          filter_member_gender: obj.gender ? JSON.parse(obj.gender)?.map(item => parseInt(item)) : [],
          filter_member_ship: JSON.parse(obj.membership_class_user)?.map(item => parseInt(item)) || [],
          users_id: JSON.parse(obj.user_id_display) || [],
          user_id_block: JSON.parse(obj.user_id_not_display) || [],
          time_slot: this.isPopup ? [obj.time_slot_start, obj.time_slot_end] : []
        }
        if (this.Screens && this.formRequest.list_screen) {
          this.Screens.forEach(screen => {
            screen.check = this.formRequest.list_screen.includes(screen.value)
          })
        }
        console.log(this.formRequest.screens, '112121212vvv')
        console.log('this.formRequest', this.formRequest)

        if (this.isScoreCard || this.isPopup) {
          this.keyImage.push({
            url: obj.banner_url?.includes('http') ? obj.banner_url : baseURL + obj.banner_url
          })
        } else {
          this.keyImage.push({
            url: obj.bannner_url_square?.includes('http') ? obj.bannner_url_square : baseURL + obj.bannner_url_square
          })
        }
        if (obj.user_id_display && obj.user_id_display.length > 0) {
          console.log('obj.user_id_display', JSON.parse(obj.user_id_display))
          const data = await this.onGetInGolfer(JSON.parse(obj.user_id_display))
          this.listGolfers = data
        }
        if (obj.user_id_not_display && obj.user_id_not_display.length > 0) {
          const data = await this.onGetInGolfer(JSON.parse(obj.user_id_not_display))
          this.listGoferBlock = data
        }
        console.log('this.formRequest', this.formRequest)
      }
    }
    // formRequest() {
    //   // watch deep
    //   this.request = Object.assign({}, this.formRequest)
    // }
  },
  created() {
    if (this.isScoreCard) {
      advResource = new AdvResourceScoreCard()
    } else if (this.isPopup) {
      advResource = new AdvResourcePopup()
    } else {
      advResource = new AdvResource()
    }
  },
  mounted() {
    this.getListAdvScreensShow()
    this.getListTouchScreen()
  },
  methods: {
    getListAdvScreensShow() {
      advResource.listAdvScreensShow().then(res => {
        if (res.error_code === 0) {
          this.Screens = res.data.map(item => ({
            value: item.key,
            label: item.name,
            check: false
          }))
          console.log(this.Screens, 'vungle mpt')
        } else {
          Message.error('Không tìm thấy dữ liệu')
        }
      })
    },
    getListTouchScreen() {
      advResource.listTouchScreen().then(res => {
        if (res.error_code === 0) {
          this.ScreenTouch = res.data.map(item => ({
            value: item.id,
            label: item.name
          }))
          console.log(this.ScreenTouch, 'vungle jack')
        } else {
          Message.error('Không tìm thấy dữ liệu')
        }
      })
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          if (this.isAdd) this.handleSubmit()
          else this.handleUpdate()
        }
      })
      this.Screens = this.Screens.map(item => {
        return {
          ...item,
          check: false
        }
      })
    },
    async handleSubmit() {
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
      console.log('this.request.............................handleUpdate', this.request)
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
      await Promise.resolve(
        this.formRequest = {
          filter_member_gender: [],
          filter_member_ship: [],
          filter_member_age: [],
          cskh_id: getAcountInfo().id
        },
        this.listImage = [],
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
      this.formRequest.users_id.splice(this.formRequest.users_id.indexOf(golfer.id), 1)
    },
    handleCloseTagBlock(golfer) {
      this.listGoferBlock.splice(this.listGoferBlock.indexOf(golfer), 1)
      this.formRequest.user_id_block.splice(this.formRequest.user_id_block.indexOf(golfer.id), 1)
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
                  message: `không tồn tại mã VID ${nonExistingUserIds}`,
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
                this.formRequest.users_id = this.listGolfers.map(item => item.id)
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
                  message: `không tồn tại mã VID ${nonExistingUserIds}`,
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
                this.formRequest.user_id_block = this.listGoferBlock.map(item => item.id)
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
      console.log(users_id)
      const res = await golferResource.getInGolfer({ users_id: users_id })
      if (res.error_code === 0) return res.data
      else return []
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
      } else if (value && value.raw && value.raw.deleted) {
      // Xử lý việc xóa ảnh
        this.keyImage = array
        this.formRequest.banner_url = null // Reset giá trị checkImage nếu cần thiết
      } else {
        if (value.status !== 'success') {
          console.log(value)
          this.formRequest.banner_url = value
          console.log(this.formRequest.banner_url, ' hahaa')
        }
      }
    },
    onRemoveImage(file, fileList) {
      this.keyImage = fileList
      this.formRequest.banner_url = null
      this.formRequest.image = null
    },
    onSuccessUploadImage(value) {
      console.log(value)
      this.formRequest.banner_url = value.name
    },
    onErrorUploadImage(error) {
      console.log(error)
      this.$message.error('Upload ảnh thất bại')
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
      for (const key in this.formRequest) {
        if (this.formRequest[key] !== null && this.formRequest[key] !== undefined) {
          if (key === 'icon_file_key' && this.formRequest[key]?.raw) {
            console.log('có file ...........................')
            const myNewFile = new File([this.formRequest[key].raw], `${Date.now()}_${this.formRequest[key].name}`, { type: this.formRequest[key].raw.type })
            console.log('myNewFile..................', myNewFile)
            this.formRequest[key] = myNewFile
          }
          if (key === 'remove_images' && Array.isArray(this.formRequest[key])) {
            for (const r of this.formRequest[key]) {
              formData.append('remove_images', r)
            }
          }
          if (key === 'time_slot') {
            console.log(this.formRequest[key])
            console.log('timeSlot..................', this.formRequest[key])
            formData.append('time_slot_start', this.formRequest[key][0])
            formData.append('time_slot_end', this.formRequest[key][1])
          } else if (key === 'time_slot_start' || key === 'time_slot_end') {
            continue
          } else if (key === 'list_screen' && Array.isArray(this.formRequest[key])) {
            formData.append('list_screen', JSON.stringify(this.formRequest[key]))
          } else if (key === 'screen_target_data') {
            const arr = {
              app_screen_id: this.formRequest[key]
            }
            formData.append('screen_target_data', JSON.stringify(arr))
          } else if (key === 'position' && this.formRequest[key]) {
            formData.append('position', this.formRequest[key])
          } else if (key === 'priority' && this.formRequest[key]) {
            formData.append('priority', this.formRequest[key])
          } else {
            formData.append(key, this.formRequest[key])
          }
        }
      }
      // formData.append('position', '1')
      // formData.append('priority', '1')

      this.request = formData
      console.log('this.request..................', this.request)
      console.log('this.formRequest..................', this.formRequest)
    },

    changeSlotTime(value) {
      console.log(value)
    },
    handleChangeScreen(itemValue) {
      // e.preventDefault()
      setTimeout(() => {
        console.log(this.$refs.option_select[0].$children[0].value)
        const list_select = this.$refs.option_select
        const output = list_select.reduce((acc, item) => {
          acc.push(item.$children[0].value)
          return acc
        }, [])
        this.formRequest.list_screen = output.reduce((acc, item, index) => {
          if (item) acc.push(index)
          return acc
        }, [])
      }, 10)
    },
    resetScreens() {
      if (this.Screens) {
        this.Screens.forEach(screen => {
          screen.check = false
        })
      }
    },
    formatNumber
  }
}
</script>

<style>
.w-100 {
  width: 100%;
}
.mt-10{
  margin-top: 10px;
}
.el-tag__close {
  display: none;
}
</style>
