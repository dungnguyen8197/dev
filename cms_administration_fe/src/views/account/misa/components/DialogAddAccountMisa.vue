<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tên tài khoản " required>
        <el-form-item prop="name">
          <el-input v-model="formRequest.name" placeholder="Tên tài khoản" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Mã nhân viên" required>
        <el-form-item prop="misa_id">
          <el-input v-model="formRequest.misa_id" placeholder="Nhập mã nhân viên trên hệ thống MiSa" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="CMS ID" required>
        <el-form-item prop="cms_id">
          <el-input v-model="formRequest.cms_id" placeholder="Nhập mã Cms Id" @keyup.enter.native="onSubmitForm('ruleForm')" />
        </el-form-item>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { validateText } from '@/utils/validate'
import { create_signature_hub } from '@/utils/create-signnature'
import AccountMiSaResource from '@/api/account/accountMisa'

const accountMiSaResource = new AccountMiSaResource()

export default {
  name: 'DialogFormAccount',
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
      activeAccount: true,
      rules: {
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên', 2, 40), trigger: 'change' }],
        misa_id: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.misa_id, callback, 'Mã nhân viên'), trigger: 'change' }],
        cms_id: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.cms_id, callback, 'CMS ID'), trigger: 'change' }]

      },
      dialog: { titleName: 'Thêm mới tài khoản', buttonName: 'add' },
      loadingSubmit: false,
      parents: [],
      formRequest: {}

    }
  },
  watch: {
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới tài khoản', buttonName: 'add' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật tài khoản', buttonName: 'update' })
      }
    },
    objectData(object) {
      if (object) {
        this.formRequest = {
          cms_id: object.cms_id,
          misa_id: object.misa_id,
          name: object.name

        }
      }
    }

  },
  created() {
  },

  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (this.isAdd) this.handleSubmitAccount()
          else this.handleUpdateAccount()
        }
      })
    },
    async handleSubmitAccount() {
      this.loadingSubmit = true
      const signature = await this.create_signature_hub(this.formRequest)
      this.formRequest.signature = signature
      accountMiSaResource.create(this.formRequest).then(response => {
        this.loadingSubmit = false
        if (response.error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.resetFormRequest()
          Message({
            message: 'Tạo thành công',
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: response.error_msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    async handleUpdateAccount() {
      this.loadingSubmit = true
      const signature = await this.create_signature_hub(this.formRequest)
      this.formRequest.signature = signature
      accountMiSaResource.update(this.formRequest).then(response => {
        this.loadingSubmit = false
        if (response.error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.resetFormRequest()
          this.$message.success('Cập nhật thành công.')
        } else {
          this.$message.error(response.error_msg)
        }
      })
    },
    async resetFormRequest() {
      await Promise.resolve(
        this.formRequest = {}
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },

    create_signature_hub
  }
}
</script>

<style scoped>
  .maxWidth {
    width: 100%;
  }
</style>
