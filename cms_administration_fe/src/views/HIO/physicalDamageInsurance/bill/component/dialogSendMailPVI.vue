<template>
  <el-dialog
    title="Thông tin chi tiết"
    :visible.sync="dialogVisible"
    :show-close="false"
    :before-close="closeDialog"
    class="update-passport"
    width="90%"
  />
</template>

<script>
export default {
  name: 'DialogShowImage',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    objectBill: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      imageUrl: []
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.imageUrl = []
        this.imageUrl.push({
          img_position: this.objectBill.img_position_1
        })
        this.imageUrl.push({
          img_position: this.objectBill.img_position_2
        })
        this.imageUrl.push({
          img_position: this.objectBill.img_position_3
        })
        this.imageUrl.push({
          img_position: this.objectBill.img_position_4
        })
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>
