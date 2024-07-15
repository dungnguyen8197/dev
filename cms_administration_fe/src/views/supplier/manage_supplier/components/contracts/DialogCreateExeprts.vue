<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="35%"
  >
    <el-form ref="ruleForm" :model="postForm" :rules="rules" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" class="pr-lg-5">
          <el-form-item :label="('Tên trích lục ')" prop="name">
            <el-input v-model="postForm.name" :placeholder="('nhập tên trích lục')" />
          </el-form-item>
          <el-form-item :label="('File trích lục')">
            <el-upload
              :file-list="fileList"
              class="upload-demo"
              :action="urlBaseApi"
              multiple
              name="image"
              :on-preview="handlePreview"
              :on-success="handleUploadImageSuccess"
              :on-remove="handleRemoveImage"
              :limit="3"
              :on-exceed="handleExceed"
              style="margin-top: 10px; display: inline-block;"
            >
              <el-button type="primary">Click to upload</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png/pdf files with a size less than 5MB.
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ ('Hủy bỏ') }}</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formatNumber } from '@/utils/convert'
// import i18n from '@/lang/i18n'
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER
// import SupplierResource from '@/api/supplier'

// const supplierResource = new SupplierResource()

export default {
  name: 'DialogCreateExeprts',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    isCondition: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: { titleName: ('Tạo mới trích lục'), buttonName: ('Thêm mới') },
      rules: {
        name: [
          { required: true, message: ('Tên chiết khấu không được để trống'), trigger: 'blur' }
        ]
      },
      loadingSubmit: false,
      fileList: [],
      postForm: {},
      urlBaseApi: `${urlBaseApi}/post_cdn`
    }
  },
  created() {
    // this.nameTitle()
  },
  methods: {
    handlePreview(uploadFile) {
      console.log(' file upload ', JSON.stringify(uploadFile))
    },
    handleExceed(files, uploadFiles) {
      // ElMessage.warning(
      //   `The limit is 3, you selected ${files.length} files this time, add up to ${
      //     files.length + uploadFiles.length
      //   } totally`
      // )
    },
    handleUploadImageSuccess(response, file, files) {
      this.fileList.push({ url: response.name, name: file.name })
      console.log('.......... handleUploadImageSuccess : ', response.name, JSON.stringify(file))
    //   this.$emit('onChangeUploadImage', this.fileList)
    },
    handleRemoveImage(file, files) {
      this.$emit('onChangeUploadImage', files, file)
      console.log('......... xoa file trick lucj ', JSON.stringify(file), JSON.stringify(files))
      this.fileList = [...files]
      // const index = this.fileList.findIndex(d => d.url === file)
      // if (index !== -1) {
      //   this.fileList.splice(index, 1)
      // }
    },
    onSubmitForm(formName) {
      console.log('......... post form', JSON.stringify(this.postForm))
      this.postForm.listFile = this.fileList
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: false, data: this.postForm })
          this.resetModel()
          //   if (!this.objectData.category_id || this.objectData.category_id === '' || this.objectData.category_id === undefined) {
          //     this.$message.warning(('choosen_category'))
          //   } else {
          //     if (this.isAdd) {
          //       this.handleSubmitTag()
          //     } else {
          //       this.handleUpdateTag()
          //     }
          //   }
        }
      })
    },
    onSubmit() {
      if (this.isCondition) {
        this.createCondition()
      } else {
        this.updateCondition()
      }
    },
    resetModel() {
      this.fileList = []
      this.postForm = {}
    },
    handleClose() {
      this.resetModel()
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
    },
    formatNumber
  }
}
</script>

  <style>
  .el-dialog__body {
    /* padding: 10px 20px; */
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-top: 10px;
    color: #606266;
    /* font-size: 14px; */
    /* word-break: break-all; */
  }
  .row {
      margin-top: 15px;
  }
  .input {
      margin-top: 10px;
  }
  .tem-label {
      font-size: 16px;
      color: #000;
  }
  </style>
