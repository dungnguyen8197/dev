<template>
  <el-dialog
    title="Tạo mới Passport"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="100%"
  >
    <el-row class="form-upload-passport">
      <el-col>
        <div class="form-group">
          <label>Nhập mã vID:</label>
          <div class="clearfix-10" />
          <el-input v-model="golferID" placeholder="Số CMND/Passport" />
          <div v-show="error.type" class="text-error">
            <span>{{ error.message }}</span>
          </div>
        </div>
      </el-col>
      <div class="clearfix-20" />
      <el-col>
        <div class="form-group">
          <label>Loại giấy tờ:</label>
          <div class="clearfix-10" />
          <el-select v-model="postForm.type" placeholder="Loại giấy tờ" class="w-100">
            <el-option
              v-for="item in arrayOptionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <div class="clearfix-20" />
      <el-row>
        <el-col :sm="8" class="mb-xs-20">
          <div class="form-group">
            <label>Ảnh CMND/PASSPORT mặt trước: </label>
            <div class="clearfix-10" />
            <div v-loading="loadingUpload">
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
              >
                <el-button type="primary"> Upload poster</el-button>
              </el-upload>
            </div>
          </div>
        </el-col>
        <el-col :sm="8" class="mb-xs-20">
          <label>Ảnh CMND/PASSPORT mặt sau: </label>
          <div class="clearfix-10" />
          <div v-loading="loadingUpload">
            <el-upload
              ref="ruleForm"
              :file-list="listImage1"
              class="upload-demo"
              action="uploadURL"
              list-type="picture"
              multiple
              :on-change="onPickImage1"
              :on-remove="removeFile1"
              :on-preview="previewFile"
              :auto-upload="false"
              :limit="1"
            >
              <el-button type="primary"> Upload poster</el-button>
            </el-upload>
          </div>
        </el-col>
        <el-col :sm="8">
          <label>Ảnh Chân dung(nếu có): </label>
          <div class="clearfix-10" />
          <div v-loading="loadingUpload">
            <el-upload
              ref="ruleForm"
              :file-list="listImage2"
              class="upload-demo"
              action="uploadURL"
              list-type="picture"
              multiple
              :on-change="onPickImage2"
              :on-remove="removeFile2"
              :on-preview="previewFile"
              :auto-upload="false"
              :limit="1"
            >
              <el-button type="primary"> Upload poster</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy bỏ</el-button>
      <el-button type="primary" @click="onSubmitCreatePassport">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import Axios from 'axios'
const errorDefault = { type: false, message: '' }
const defaultForm = {
  user_id: '',
  img_passport_front: '',
  img_passport_back: '',
  system_avatar_path: '',
  type: 1
}
const arrayOptionTypes = [
  { value: 1, label: 'CMND' },
  { value: 2, label: 'PASSPORT' }
]
export default {
  name: 'DialogCreatePassport',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      golferID: '',
      golfers: [],
      listImage: [],
      listImage1: [],
      listImage2: [],
      loadingSearchUser: false,
      dialogVisible: false,
      timer: null,
      error: Object.assign({}, errorDefault),
      postForm: Object.assign({}, defaultForm),
      urlUpload: `https://api-v2.vcallid.com/api/utils/upload/data`,
      headerUpload: { 'content-type': 'multipart/form-data' },
      loadingUpload: false,
      arrayOptionTypes: [...arrayOptionTypes],
      baseUrl: window.baseUrl,
      file: null,
      file1: null,
      file2: null
    }
  },
  watch: {
    showDialog(value) {
      this.dialogVisible = value
    },

    golferID(value) {
      if (value) {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.getGolferExitsPassport(value)
          this.postForm.user_id = value
        }, 800)
      }
    }
  },
  methods: {
    async onSubmitCreatePassport() {
      if (this.file) {
        const upload = await this.uploadFileToServe(this.file)
        this.postForm.img_passport_front = upload.data.name
      }
      if (this.file1) {
        const upload = await this.uploadFileToServe(this.file1)
        this.postForm.img_passport_back = upload.data.name
      }
      if (this.file2) {
        const upload = await this.uploadFileToServe(this.file2)
        this.postForm.system_avatar_path = upload.data.name
      }
      if (this.postForm.user_id) {
        console.log(this.postForm)
        this.$store.dispatch('createUserPassport', this.postForm).then(response => {
          console.log('assaasaaa', response)
          if (response.error_code === 0) {
            this.$message.success(response.message)
            this.$emit('onClickDialogCreate', true)
          } else {
            this.$message.error(response.message)
          }
        })
      } else {
        this.$message.warning('Vui lòng nhập mã vID!')
      }
    },
    onPickImage(value, array) {
      console.log('value___________', value)
      if (value.size > 60000000) {
        this.$message.warning('Kích thước ảnh tối đa là 60.000 mb')
        array.pop()
        this.listImage = array
      } else {
        this.file = value.raw
      }
    },
    removeFile(value) {
      delete this.formRequest.img_background
      this.file = null
    },
    onPickImage1(value, array) {
      console.log('value___________', value)
      if (value.size > 60000000) {
        this.$message.warning('Kích thước ảnh tối đa là 60.000 mb')
        array.pop()
        this.listImage1 = array
      } else {
        this.file1 = value.raw
      }
    },
    removeFile1(value) {
      delete this.formRequest.img_background
      this.file1 = null
    },
    onPickImage2(value, array) {
      console.log('value___________', value)
      if (value.size > 60000000) {
        this.$message.warning('Kích thước ảnh tối đa là 60.000 mb')
        array.pop()
        this.listImage2 = array
      } else {
        this.file2 = value.raw
      }
    },
    removeFile2(value) {
      delete this.formRequest.img_background
      this.file2 = null
    },
    previewFile(value) {
      if (!this.isAdd) {
        window.open(this.baseURL + value.url, '_blank')
      } else {
        window.open(value.url, '_blank')
      }
    },
    async uploadFileToServe(file) {
      console.log(file)
      const myNewFile = new File([file], `${uuidv4().toString()}.png`, { type: file.type })
      // const url = `https://upload.vcallid.com/api/public/post`
      const url = 'https://api-v2.vcallid.com/api/utils/upload/data'
      const formData = new FormData()
      formData.append('image', myNewFile)
      const res = await Axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      console.log('res image api ', res)
      return res
    },
    handleUploadSuccess(res, file) {
      if (res.error_code === 0) {
        this.$message.success(res.message)
        this.loadingUpload = false
        const result = res.data
        const type = parseInt(result.type)
        switch (type) {
          case 1:
            this.postForm.img_passport_front = result.image
            break
          case 2:
            this.postForm.img_passport_back = result.image
            break
          default:
            this.postForm.system_avatar_path = result.image
            break
        }
      } else {
        this.$message.error(res.message)
      }
    },
    beforeUpload(file) {
      if (this.golferID && !this.error.type) {
        this.loadingUpload = true
      } else {
        this.$message.warning('Vui lòng nhập mã vID trước khi upload!')
      }
    },
    handleRemove(pathImage, file) {
      console.log(pathImage)
    },
    getGolferExitsPassport(golferID) {
      const params = { golfer_id: golferID }
      this.$store.dispatch('getGolferExitsPassport', params).then(response => {
        if (response.error_code === 1) {
          this.error = Object.assign({}, { type: true, message: response.message })
        }
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.error = Object.assign({}, errorDefault)
        }, 5000)
      })
    },
    handleUpdateNumber(number) {
      this.golferID = number
    },
    handleClose() {
      this.$emit('onClickDialogCreate', false)
    }
  }
}
</script>

<style lang="scss">
.form-upload-passport {
  .w-100 {
    width: 100%;
  }
  .clearfix-10 {
    height: 10px;
    clear: both;
  }
  .clearfix-20 {
    height: 20px;
    clear: both;
  }
  .text-error {
    padding: 5px;
    color: #ff0000;
  }
  .avatar-uploader {
    position: relative;
    .item-delete {
      position: absolute;
      top: 5px;
      right: 5px;
      color: #ff0000;
    }
  }
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 178px;
    display: block;
  }
}
@media only screen and(max-width: 768px) {
  .mb-xs-20 {
    margin-bottom: 20px;
  }
}
</style>
