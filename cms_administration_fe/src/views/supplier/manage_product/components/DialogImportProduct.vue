<template>
  <el-dialog
    :title="('Sản phẩm tồn tại')"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-row class="dialog-upload">
      <el-upload
        class="upload-demo"
        name="image"
        :action="urlBaseApi"
        :file-list="fileList"
        :on-success="handleUploadSuccess"
        accept=".xlsx, .xls"
        list-type="picture"
      >
        <el-button size="small" type="primary">{{
          ("Click để upload")
        }}</el-button>
        <div slot="tip" class="el-upload__tip">
          {{ ("File Import") }}
          <span v-if="uploadSuccess" style="color: red">{{
            ("Uploading...")
          }}</span>
        </div>
      </el-upload>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ ("Cancel") }}</el-button>
      <el-button
        type="primary"
        :loading="loadingSubmit"
        @click="onSubmitPostForm"
      >{{ ("Cập nhật") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ProductResource from '@/api/manage_supplier/product'
const productResource = new ProductResource()
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER
import FileExcel from '@/assets/images/excel.png'
export default {
  name: 'DialogImportProduct',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loadingSubmit: false,
      fileList: [],
      urlBaseApi: `${urlBaseApi}/post`,
      //   isFileZip: true,
      postForm: {},
      uploadSuccess: false
    }
  },

  mounted() {},

  methods: {
    onSubmitPostForm() {
      this.loadingSubmit = true
      console.log('.......post upload : ', JSON.stringify(this.postForm))
      const body = this.postForm
      productResource.importFileInventory(body).then(response => {
        console.log('----------------------------ré', response, body)
        this.loadingSubmit = false
        console.log(response)
        //   this.onGetProductStatus(response.id);
        const { error, msg } = response
        if (error === 0) {
          this.$message.success(msg)
          this.$emit('onClickButtonImport', { dialog: false, reload: true })
        } else {
          this.$message.error(msg)
        }
      })
        .catch(error => {
          console.log('............. co loi : ', error)
          this.loadingSubmit = false
        })
    },
    handleUploadSuccess(response, file) {
      const File = FileExcel
      const objectFile = { name: response.path, url: File, data: response }
      this.postForm.path_exel = response.path
      this.uploadSuccess = false
      this.fileList.push(objectFile)
    },
    handleClose() {
      this.loadingSubmit = false
      this.$emit('onClickButtonImport', { dialog: false, reload: false })
    }
  }
}
</script>

<style lang="scss" scoped></style>
