<template>
  <el-dialog
    width="50%"
    :title="dialog.titleName"
    :visible.sync="$store.getters.isShowDialogAddUser"
    :before-close="handleClose"
  >
    <el-form ref="notifyForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-notifyForm">
      <el-row>
        <el-col :sm="24">
          <el-row>
            <el-col :xs="24" :md="{span:12,offset:1}">
              <el-row>
                <el-select
                  v-model="golferModel"
                  class="w-100"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="Tìm kiếm mã vID"
                  :remote-method="onSearchGolfer"
                  :loading="loadingSearchUser"
                >
                  <el-option v-for="user in users" :key="user.value" :label="`vID${user.value} - ${user.label}`" :value="user" />
                </el-select>
              </el-row>
            </el-col>
            <el-col
              :xs="12"
              :sm="4"
              style="text-align: right;margin-right: 10px;"
            >
              <el-button size="mini" type="primary" @click="downloadTemplate">Tải file mẫu<i
                class="el-icon-download el-icon-right"
              /></el-button>
            </el-col>

            <el-col :xs="12" :sm="4">
              <el-upload ref="upload_golfer_receiver" action="uploadURL" :on-change="onChangeFileExcel" :auto-upload="false" :limit="1">
                <el-button size="mini" type="primary">Import Golfer <i
                  class="el-icon-download el-icon-right"
                /></el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row v-if="listGolfers.length > 0" class="data-table-content table-responsive mt-10">
            <el-col>
              <span class="mb-20"><b>Danh sách Golfer thêm: </b></span>
              <table
                class="table table-bordered"
                style="vertical-align: center ;
                display: block;
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
            </el-col>
          </el-row>
        </el-col>
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

import { Message } from 'element-ui'
import * as XLSX from 'xlsx'
import GolferResource from '@/api/golfer/golfer'
import { formatNumber } from '@/utils/convert'
import EventResource from '@/api/event'

const eventResource = new EventResource()
const golferResource = new GolferResource()

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
      rules: {},
      listGolfers: [],
      dialog: { titleName: 'Thêm mới user', buttonName: 'add' },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      loadingSearchUser: false,
      users: [],
      golferModel: {}
    }
  },
  computed: {},
  watch: {
    async objectData(value) {
      this.formRequest = value
    },
    async golferModel(value) {
      if (value && Object.keys(this.golferModel).length !== 0) {
        const checkExist = this.listGolfers.filter(item => item.user_id === value.value)
        if (checkExist.length > 0) {
          this.$message.warning('vID đã được chọn.')
          return
        }
        const golfer = {
          id: value.value,
          fullname: value.label
        }
        this.listGolfers.push(golfer)
      }
    }
  },
  created() {
  },
  methods: {
    onSearchGolfer(keyword) {
      const params = { keyword: keyword }
      this.loadingSearchUser = true
      golferResource.searchGolfer(params).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              return { value: value.id, label: value.fullname }
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
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.handleSubmit()
        }
      })
    },
    async handleSubmit() {
      // this.listGolfers = this.listGolfers.filter(item => item.fullname)
      console.log('this.listGolfers........', this.listGolfers)
      const list_id = [...new Set(this.listGolfers.map((item) => item.id))]
      // if (list_id.length === 0) {
      //   Message.error('Các User không có fullname không được thêm')
      //   return
      // }
      this.loadingSubmit = true
      await eventResource.add_gofer_to_flight({ list_id: list_id }, this.$store.getters.event_id).then(res => {
        if (res.error_code === 0) {
          Message.success('Thêm thành công. Các User trùng lặp và không có fullname không được thêm')
          this.resetFormRequest()
          this.handleClose()
        } else {
          Message.error(res.error_msg)
        }
        console.log('res', res)
      }).catch(err => {
        console.log('err', err)
        Message.error(err)
      })
      this.loadingSubmit = false
    },
    async resetFormRequest() {
      await Promise.resolve(
        this.formRequest = {},
        this.listGolfers = [],
        this.users = [],
        this.golferModel = {}
      )
      this.$refs['notifyForm'].clearValidate()
    },
    handleClose() {
      this.$store.dispatch('hideDialogAddUser')
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
              const checkUserPass = arrUserId.filter(id => !existingUserIds.includes(id))
              console.log('checkUserPass........', checkUserPass)
              // const nonExistingUserIds = arrUserId.filter(id => !existingUserIds.includes(id))
              // if (nonExistingUserIds.length > 0) {
              //   Message({
              //     message: `không tồn tại mã VID ${nonExistingUserIds}`,
              //     type: 'warning',
              //     duration: 8 * 1000
              //   })
              //   return
              // } else {
              this.listGolfers = [...this.listGolfers, ...result.filter(item => !checkUserPass.includes(item.id))].filter((obj, index, self) =>
                index === self.findIndex((o) => (
                  o.id === obj.id
                ))
              )
              this.formRequest.users_id = this.listGolfers.map(item => item.id)
              this.listGolfers = this.listGolfers.filter(item => item.fullname)
              console.log('this.listGolfers........', this.listGolfers)
              this.$message.success('Import thành công , Các User trùng lặp sẽ xóa.')
              // }
            })
          } else {
            this.$message.warning('Không có bản ghi.')
            return
          }
        }
        reader.readAsBinaryString(value.raw)
        array.pop()
      }
    },
    async onGetInGolfer(users_id) {
      console.log(users_id)
      const res = await golferResource.getInGolfer({ users_id: users_id })
      if (res.error_code === 0) return res.data
      else return []
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
</style>
