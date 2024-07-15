<template>
  <el-upload
    :action="urlBaseApi"
    list-type="picture-card"
    name="image"
    :on-success="handleUploadImageSuccess"
    :on-remove="handleRemoveImage"
    :file-list="fileList"
    accept="image/*"
  >
    <i class="el-icon-upload" />
  </el-upload>
</template>

<script>
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER
export default {
  name: 'UploadImageProduct',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      urlBaseApi: `${urlBaseApi}/post_cdn`
    }
  },
  methods: {
    handleUploadImageSuccess(response, file, files) {
      this.fileList.push({ url: response.name })
      console.log('.......... handleUploadImageSuccess : ', response.name, file, files)
      this.$emit('onChangeUploadImage', this.fileList)
    },
    handleRemoveImage(file, files) {
      this.$emit('onChangeUploadImage', files, file)
    }
  }
}
</script>

<style scoped>

</style>
