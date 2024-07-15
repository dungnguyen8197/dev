<template>
  <el-dialog
    title="Xác nhận nhận xử lý ?"
    :visible.sync="dialogConfirmProcess"
    width="30%"
    center
    :before-close="handleClose"
  >
    <span>Bạn có xác nhận nhận xử lý này không ?</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="handleConfirmProcess()">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import axios from 'axios'
import MoneyInResource from '@/api/manage-booking/money-in'
import { getAcountInfo } from '@/utils/auth'
const moneyInResource = new MoneyInResource()
export default {
  name: 'DialogConfirmProcess',
  props: {
    dialogConfirmProcess: {
      type: Boolean,
      default: false
    },
    objectData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      query: {},
      loadingSubmit: false,
      baseUrl: ''
    }
  },
  watch: {
    dialogSendMail(value) {
      this.dialogVisible = value
    }
  },
  methods: {
    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
    },
    handleConfirmProcess() {
      this.loadingSubmit = true
      const admin = getAcountInfo()
      const body = {
        admin_id: admin.id
      }
      moneyInResource.confirmProcess(body, this.objectData.id).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.handleClose()
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!')
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    }
  }
}
</script>
