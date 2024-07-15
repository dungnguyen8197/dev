<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên dịch vụ" prop="name">
        <el-input v-model="formRequest.name" placeholder="Tên dịch vụ" @keyup.enter.native="onSubmitForm()" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm()">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateText } from '@/utils/validate'
import TypeServiceResource from '@/api/type-service'

const typeServiceResource = new TypeServiceResource()

export default {
  name: 'DialogFormNotification',
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
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingDialog: false,
      rules: {
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên dịch vụ', 2, 40), trigger: 'change' }]
      },
      dialog: { titleName: 'Thêm mới dịch vụ', buttonName: 'Thêm' },
      loadingSubmit: false,
      formRequest: {},
      updateID: ''
    }
  },
  watch: {
    isAdd(value) {
      if (value) {
        this.dialog = { titleName: 'Thêm mới dịch vụ', buttonName: 'Thêm' }
      } else {
        this.dialog = { titleName: 'Cập nhật dịch vụ', buttonName: 'Sửa' }
      }
    },
    objectData(object) {
      if (object.row) {
        const { name, id } = object.row
        this.updateID = id
        this.formRequest = { name }
      }
    }
  },
  methods: {
    onSubmitForm() {
      this.$refs.ruleForm.validate((validate) => {
        if (validate) {
          if (this.isAdd) this.handleAdd()
          else this.handleUpdate()
        }
      })
    },
    handleAdd() {
      this.loadingSubmit = true
      typeServiceResource.create(this.formRequest).then(response => {
        if (response.error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.resetFormRequest()
          this.$message.success(response.error_msg)
        } else {
          this.$message.error(response.error_msg)
        }
      }).finally(() => { this.loadingSubmit = false })
    },
    handleUpdate() {
      this.loadingSubmit = true
      typeServiceResource.update(this.updateID, this.formRequest).then(response => {
        if (response.error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.resetFormRequest()
          this.$message.success(response.error_msg)
        } else {
          this.$message.error(response.error_msg)
        }
      }).finally(() => { this.loadingSubmit = false })
    },
    resetFormRequest() {
      this.formRequest = {}
      setTimeout(() => {
        this.$refs['ruleForm'].clearValidate()
      }, 0)
    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    }
  }
}
</script>

<style scoped>
  .maxWidth {
    width: 100%;
  }
</style>
