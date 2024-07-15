<template>
  <el-upload
    :action="urlBaseApi"
    :name="typeName"
    :limit="1"
    list-type="picture-card"
    :on-success="handleUploadImageSuccess"
    :on-remove="handleRemoveImage"
    :file-list="fileList"
    accept="image/*"
  >
    <i class="el-icon-plus" />
  </el-upload>
</template>

<script>
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER
export default {
  name: 'UploadImage',
  props: {
    urlCurrent: {
      type: String,
      default: null
    },
    typeName: {
      type: String,
      default() {
        return 'image'
      }
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      urlBaseApi: `${urlBaseApi}/post_cdn`,
      objectData: {},
      fileList: []
    }
  },
  watch: {
    urlCurrent(value) {
      if (value) {
        this.fileList = [{ url: value }]
      } else {
        this.fileList = []
      }
    }
  },
  methods: {
    handleUploadImageSuccess(response, file) {
      const object = { ...response, ...{ remove: 0 }}
      this.$emit('onSetUrlImage', object)
      this.dialogImageUrl = response.name
    },
    handleRemoveImage(file) {
      this.$emit('onSetUrlImage', { remove: 1 })
    }
  }
}
</script>

  <style scoped>

  </style>
