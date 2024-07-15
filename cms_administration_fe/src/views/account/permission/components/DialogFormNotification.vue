<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên quyền" prop="descriptions">
        <el-input v-model="formRequest.descriptions" placeholder="Tên quyền" @keyup.enter.native="onSubmitForm()" />
      </el-form-item>
      <el-form-item label="Slug" prop="permission_name">
        <el-input v-model="formRequest.permission_name" placeholder="Slug" @keyup.enter.native="onSubmitForm()" />
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
import PermissionResource from '@/api/account/permission'

const permissionResource = new PermissionResource()

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
        descriptions: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.descriptions, callback, 'Tên quyền', 2, 40), trigger: 'change' }],
        permission_name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.permission_name, callback, 'Slug'), trigger: 'change' }]
      },
      dialog: { titleName: 'Thêm mới quyền', buttonName: 'Thêm' },
      loadingSubmit: false,
      formRequest: {},
      updateID: ''
    }
  },
  watch: {
    isAdd(value) {
      if (value) {
        this.dialog = { titleName: 'Thêm mới quyền', buttonName: 'Thêm' }
      } else {
        this.dialog = { titleName: 'Cập nhật quyền', buttonName: 'Sửa' }
      }
    },
    objectData(object) {
      if (object.row) {
        const { descriptions, permission_name, id } = object.row
        this.updateID = id
        this.formRequest = { descriptions, permission_name }
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
      permissionResource.create(this.formRequest).then(response => {
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
      permissionResource.update(this.updateID, this.formRequest).then(response => {
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
