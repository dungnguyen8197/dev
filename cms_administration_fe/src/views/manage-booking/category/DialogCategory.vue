<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleCloseDialog"
    width="50%"
  >
    <el-form ref="form" class="dialog-form-agent" :model="objectData">
      <el-col :span="24">
        <el-form-item label="Tên">
          <el-input v-model="objectData.name" prod="name" />
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">Hủy bỏ</el-button>
      <el-button v-if="isAdd" type="primary" @click="onSubmitCreate">Thêm mới</el-button>
      <el-button v-else type="primary" @click="onSubmitUpdate">Chỉnh sửa</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BookingPaxResource from '@/api/BookingPax'

const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogCategory',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      title: '',
      loadingSubmit: false,
      sales: [],
      golferByInsurances: [],
      listImage: [],
      uploadFileLoading: false,
      updateID: '',
      listGolfer: [],
      loadingSearch: false,
      request: {},
      file_remove: null,
      disabled: Boolean
    }
  },
  watch: {
    isAdd(value) {
      this.title = (value) ? 'Thêm mới hạng mục' : 'Chỉnh sửa hạng mục'
    },
    objectData(object) {
      console.log('..................object', object)
      this.postForm = Object.assign({}, object)
      this.postForm.name = object.name
    }
  },
  methods: {
    async onSubmitCreate() {
      this.loadingSubmit = true
      bookingPaxResource.createCategory(this.objectData).then(response => {
        this.loadingSubmit = true
        if (response.error_code === 0) {
          this.$message.success(response.error_msg)
          this.$emit('onClickCloseDialog', { dialog: true, reload: true })
        } else {
          this.$message.error(response.error_msg)
        }
      })
    },
    async onSubmitUpdate() {
      this.loadingSubmit = true

      bookingPaxResource.updateCategory(this.objectData, this.objectData.id).then(res => {
        console.log('asdasdasd', res)
        if (res.error_code === 0) {
          this.$message.success('Sửa thành công')
          this.$emit('onClickCloseDialog', { dialog: true, reload: true })
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    handleCloseDialog() {
      this.$emit('onClickCloseDialog', { dialog: true, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
