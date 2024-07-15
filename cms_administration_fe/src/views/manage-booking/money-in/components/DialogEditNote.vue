<!-- <template>
  <el-dialog
    title="Cập nhật ghi chú"
    :visible.sync="showDialog"
    width="30%"
    center
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Mã BK">
        <el-form-item prop="code_booking">
          <el-input v-model="formRequest.code_booking" prop="code_booking" placeholder="Mã BK" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Ghi chú">
        <el-form-item prop="note">
          <el-input
            v-model="formRequest.note"
            prop="note"
            :rows="4"
            type="textarea"
            placeholder="Ghi chú"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script>

export default {
  name: 'DialogEditNote',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        code_booking: [{ validator: (rule, _, callback) => validateCodeBooking(rule, this.formRequest.code_booking, callback, 'Code booking'), trigger: 'change' }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      statusList: [
        {
          label: 'no',
          value: 0
        },
        {
          label: 'clear',
          value: 1
        }
      ],
      is_clear: 0
    }
  },

  watch: {
    objectData(value) {
      if (value) {
        this.formRequest = value
      }
    }
  },

  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          this.handleUpdateNote()
        }
      })
    },
    async handleUpdateNote() {
      const url = `${baseUrl}/cms/booking-history-transaction-bank/update-note/${this.formRequest.id}`
      await axios.post(url, this.request).then(res => {
        if (res.data.error_code === 0) {
          this.$message({
            type: 'success',
            message: 'Cập nhật thành công!'
          })

          this.handleClose()
        } else {
          this.$message({
            type: 'error',
            message: 'Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!'
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: 'Cập nhật ghi chú thất bại!'
        })
      })
    },

    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {}
      )
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
    },

    appendForm() {
      const formData = new FormData()
      if (this.formRequest.code_booking) {
        formData.append('code_booking', this.formRequest.code_booking)
      }
      formData.append('note', this.formRequest.note)

      this.request = formData
    }
  }
}
</script>

<style scoped>

</style> -->
