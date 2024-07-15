<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleCloseDialog"
    width="width"
  >
    <el-carousel height="500px" arrow="always" :autoplay="false">
      <el-carousel-item v-for="url in image_urls" :key="url">
        <!--        <h3 class="small">{{ images }}</h3>-->
        <el-image :src="url" :fit="contain" style="height: 100%; width: 100%;" />
      </el-carousel-item>
    </el-carousel>
    <!--    <el-image :src="url" :fit="contain" />-->
  </el-dialog>
</template>

<script>
export default {
  name: 'DetailProduct',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    image_urls: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      width: 0,
      height: '0px',
      contain: 'contain'
    }
  },
  watch: {
    image_urls(value) {
      console.log('............url anh ', JSON.stringify(value))
      if (value.length) {
        const url = value[0]
        this.getSizeImage(url)
      }
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
        this.height = `${img.height}px`
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
