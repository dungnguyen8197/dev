<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên vai trò" prop="name">
        <el-input v-model="formRequest.name" placeholder="Tên vai trò" @keyup.enter.native="onSubmitForm()" />
      </el-form-item>
      <el-form-item label="Slug" prop="guard">
        <el-input v-model="formRequest.guard" placeholder="Slug" @keyup.enter.native="onSubmitForm()" />
      </el-form-item>
      <el-form-item label="Level" prop="level">
        <el-input v-model="formRequest.level" min="1" max="6" type="number" />
      </el-form-item>
      <el-form-item v-if="isShowViewer" label="Kiểu quản lý">
        <br>
        <el-switch
          v-model="accountType"
          :active-text="activeTitle"
        />
      </el-form-item>
      <el-form-item label="Loại dịch vụ" prop="type_service">
        <el-select v-model="formRequest.type_services" placeholder="Loại dịch vụ" style="width: 100%" clearable class="pd-2 full-width">
          <el-option v-for="type_service in type_services" :key="type_service.id" :label="type_service.name" :value="type_service.id" />
        </el-select>
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
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên vai trò', 2, 40), trigger: 'change' }],
        guard: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.guard, callback, 'Slug'), trigger: 'change' }]
      },
      dialog: { titleName: 'Thêm mới vai trò', buttonName: 'Thêm' },
      loadingSubmit: false,
      formRequest: { level: 1 },
      updateID: '',
      type_services: [],
      isShowViewer: false,
      accountType: true,
      activeTitle: 'Người quản lý'
    }
  },
  watch: {
    accountType(value) {
      if (value) {
        this.activeTitle = 'Người quản lý'
        this.formRequest.is_viewer = 0
      } else {
        this.activeTitle = 'Người xem'
        this.formRequest.is_viewer = 1
      }
    },
    'formRequest.level'(value) {
      // eslint-disable-next-line eqeqeq
      if (value == '3' || value == '2') this.isShowViewer = true
      else this.isShowViewer = false
    },
    isAdd(value) {
      if (value) {
        this.dialog = { titleName: 'Thêm mới vai trò', buttonName: 'Thêm' }
      } else {
        this.dialog = { titleName: 'Cập nhật vai trò', buttonName: 'Sửa' }
      }
    },
    objectData(object) {
      this.type_services = object.type_services
      if (object.row) {
        const { name, guard, type_services, level, id, is_viewer } = object.row
        this.accountType = (is_viewer === 0)
        this.updateID = id
        this.formRequest = { name, guard, type_services, level, is_viewer }
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
      roleResource.update(this.updateID, this.formRequest).then(response => {
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
