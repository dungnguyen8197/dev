<template>
  <div style="height: 200px;">
    <el-upload
      :file-list="fileList"
      class="upload-demo"
      :action="urlBaseApi"
      name="image"
      :on-preview="handlePreview"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :limit="5"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
      multiple
      style="margin-top: 10px; display: inline-block;"
    >
      <el-button type="primary">Tải lên chứng từ</el-button>
      <template #tip>
        <div class="el-upload__tip">
          Tải lên file nhỏ hơn 5MB
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script>
import axios from '@/utils/axios'
const urlBase = process.env.VUE_APP_BASE_API_SUPPLIER

export default {
  name: 'UploadContract',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      urlBaseApi: `${urlBase}/post_cdn`,
      fileList: []
    }
  },
  methods: {
    uploadFile(data) {
      axios({
        url: this.urlBaseApi,
        method: 'post',
        data: data
      })
    },
    emitListFile() {
      this.$root.$emit('set-image-list', this.fileList)
      console.log('emit success')
    },
    handleUploadSuccess(response, file) {
      console.log(response, file, 'response')
      if (response.error === 0) {
        this.fileList.push({ url: response.name, name: file.name, uid: file.uid })
        this.emitListFile()
      }
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.emitListFile()
      console.log(this.fileList, 'this.fileList')

      // this.$emit('onSetUrlImage', { remove: 1 })
    },
    handleExceed(files, fileList) {
      this.$message.error('Số file phải ít hơn 5')
    },
    handlePreview(file) {
      // window.open(file.url, '_blank')
    },
    beforeUpload(file) {
      const maxSize = 5 * 1024 * 1024 // 5 MB (adjust as needed)
      if (file.size > maxSize) {
        this.$message.error('File phải có dung lượng nhỏ hơn 5 MB.')
        return false
      }
      return true
    }
  }
}
</script>
<style scoped>
</style>
