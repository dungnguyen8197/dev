<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleCloseDialog"
    width="width"
  >
    <el-image :src="url" :fit="contain" />
  </el-dialog>
</template>

<script>
export default {
  name: 'DetailShop',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      width: 0,
      height: 0,
      contain: 'contain'
    }
  },
  watch: {
    url(value) {
      // console.log('............url anh ', value)
      this.getSizeImage(value)
    }
  },
  methods: {
    getSizeImage(url) {
      if (!url || !url.length) return
      const img = new Image()
      img.src = url
      img.onload = () => {
        console.log(`the image dimensions are ${img.width}x${img.height}`)
        this.width = img.width
        this.height = img.height
      }
    },
    handleCloseDialog() {
      this.$emit('onClickButtonDialogDetail', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
