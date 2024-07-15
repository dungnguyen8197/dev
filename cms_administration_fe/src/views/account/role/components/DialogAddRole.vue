<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên quyền" prop="title">
        <el-input v-model="formRequest.title" placeholder="Tên quyền" @keyup.enter.native="onSubmitForm()" />
      </el-form-item>
      <el-form-item label="Slug" prop="name">
        <el-input v-model="formRequest.name" placeholder="Slug" @keyup.enter.native="onSubmitForm()" />
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
import RoleResource from '@/api/account/role'

const roleResource = new RoleResource()

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
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Slug', 2, 40), trigger: 'change' }],
        title: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.title, callback, 'Tên quyền', 2, 100), trigger: 'change' }]
      },
      dialog: { titleName: 'Thêm mới quyền', buttonName: 'Thêm' },
      loadingSubmit: false,
      formRequest: {}
    }
  },
  watch: {

    isAdd(value) {
      if (value) {
        this.dialog = { titleName: 'Thêm mới quyền', buttonName: 'Thêm' }
      } else {
        this.dialog = { titleName: 'Cập nhật quyền', buttonName: 'Cập nhập' }
      }
    },
    objectData(object) {
      if (object.row) {
        this.formRequest = object.row
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
      roleResource.create(this.formRequest).then(response => {
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
      roleResource.update(this.formRequest).then(response => {
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
