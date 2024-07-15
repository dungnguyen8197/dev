<template>
  <el-dialog
    title="Danh sách kênh TV"
    :visible.sync="showDialog"
    :before-close="handleClose"
    fullscreen
    center
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" class="demo-ruleForm">
      <el-form-item required>
        <el-row class="data-table-content table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="text-center" style="min-width: 180px">Tên kênh TV</th>
                <th scope="col" class="text-center" style="min-width: 180px">Link kênh TV</th>
                <th scope="col" class="text-center" style="min-width: 180px">Avatar</th>
                <th scope="col" class="text-center" style="min-width: 180px">Trạng thái</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in tableData" :key="index">
              <tr>
                <td class="text-center">
                  <el-input
                    v-model="item.chanel_name"
                    placeholder="Tên Kênh TV"
                  />
                </td>
                <td class="text-center">
                  <el-input
                    v-model="item.link"
                    placeholder="Link Kênh TV"
                  />
                </td>
                <td class="text-center">
                  <el-upload
                    ref="ruleForm"
                    :file-list="item.listImage"
                    class="upload-demo"
                    action="uploadURL"
                    list-type="picture"
                    multiple
                    :on-change="value => onPickImage(value, item)"
                    :on-remove="value => removeFile(value, item)"
                    :on-preview="previewFile"
                    :auto-upload="false"
                    :limit="1"
                    :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
                  >
                    <el-button type="primary"> Upload poster</el-button>
                  </el-upload>
                </td>
                <td class="text-center">
                  <div>
                    <el-switch
                      v-model="item.active"
                      :active-value="true"
                      :inactive-value="false"
                      style="padding-right: 10px"
                    />
                    <el-tag v-if="item.active === true" type="secondary">Hiển thị</el-tag>
                    <el-tag v-else-if="item.active === false" type="success">Không hiển thị</el-tag>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <el-row class="text-center">
            <el-button class="text-center" @click="addChanelTV">Thêm kênh TV</el-button>
          </el-row>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>
<script>
import EventResource from '@/api/event'
const eventResource = new EventResource()
import { trim_string_object } from '@/utils/trim-string-object'
import { Message } from 'element-ui'
import { formatNumber } from '@/utils/convert'
import { baseURL } from '@/constant/config'
import { v4 as uuidv4 } from 'uuid'
import Axios from 'axios'
import { isEmpty } from '@/utils/validate'
// import { isEmpty } from '@/utils/validate'

export default {
  name: 'DialogListChanelEvent',
  components: {
    // Pagination
  },
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
    }
  },
  data() {
    return {
      loadingTable: false,
      query: { page: 1, limit: 10 },
      total: 10,
      tableData: [],
      showDialogAddEvent: false,
      dialogLoading: false,
      formRequest: {
        chanelTV_lists: []
      },
      loadingSubmit: false,
      event_id: 0,
      listImage: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      files: []

    }
  },
  watch: {
    objectData(value) {
      if (value) {
        this.query.event_id = value.id
        this.onGetList()
      }
    }
  },
  created() {
  },
  methods: {
    trim_string_object,
    addChanelTV() {
      this.tableData.push({ chanel_name: '', link: '', active: 0, url_image: null })
    },
    async onGetList() {
      this.loadingTable = true
      eventResource.listChanelTvEvent(this.query).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data.map(item => {
            item.listImage = item.url_image ? [{ url: item.url_image }] : []
            return item
          })
          this.total = data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onSubmitForm() {
      this.handleSubmit()
    },
    async handleSubmit() {
      const process = []
      if (this.files.length > 0) {
        this.files.map(item => {
          process.push({
            id: item.id,
            process: this.uploadFileToServe(item.file)
          })
        })
        const listDataCardAll = await Promise.all(process.map(item => item.process)).then(res => {
          const resultMap = []
          res.forEach((result, index) => {
            resultMap.push({
              id: process[index].id,
              result
            })
          })
          console.log(JSON.stringify(resultMap))
          return resultMap
        })
        console.log('teeeeeeeeeeee', listDataCardAll)
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i]
          const url_image = listDataCardAll.find(item2 => item2.id === data.id)?.result
          if (!isEmpty(url_image)) { data.url_image = url_image }
        }
      }
      console.log('qwwwwwwwwwwwwwwwwwwwwwwwwwww', this.tableData)
      await this.trim_string_object(this.formRequest)
      const list = this.tableData
        .map((item) => (
          {
            id: item.id,
            chanel_name: item.chanel_name,
            link: item.link,
            active: item.active,
            url_image: item.url_image,
            event_id: this.objectData.id
          }
        ))
      eventResource.storeChanelTV(list).then(res => {
        this.loadingSubmit = false
        console.log('res.................................', res)
        if (res.error_code === 0) {
          this.$message.success('Thêm mới thành công')
          // this.onGetList()
        } else {
          this.$message.error(res.error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10, event_id: this.objectData.id })
      this.onGetList()
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
    },
    async onPickImage(value, array) {
      console.log('111111111111111111111111', value)
      console.log('2222222222222', array)
      if (value?.raw?.type !== 'image/png' && value?.raw?.type !== 'image/jpg' && value?.raw?.type !== 'image/jpeg' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là JPG, JPEG, PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        // array.pop()
        this.listImage = [value]
      } else if (value.size > 4 * 1000 * 1000) {
        Message({
          message: `Kích thước ảnh tối đa là 4 MB, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} B`,
          type: 'warning',
          duration: 5 * 1000
        })
        // array.pop()
        this.listImage = [value]
      } else {
        this.files = [...this.files, { file: value.raw, id: array.id }]
      }
    },
    removeFile(value, array) {
      console.log('11111111', value)
      console.log('12122222', array)

      array.url_image = null
      console.log('ttttttttttttttttt', this.files)
      this.files.slice(this.files.findIndex(item => item.id === array.id), 1)
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
      if (res.status === 200) { return res.data.name } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>

