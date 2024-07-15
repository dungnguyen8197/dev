<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="35%"
  >
    <el-form ref="ruleForm" :model="postForm" :rules="rules" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" class="pr-lg-5">
          <el-form-item :label="('Chủ tài khoản')" :required="true">
            <el-input v-model="postForm.account_name" :placeholder="('nhập tên chủ tài khoản')" />
          </el-form-item>
          <el-form-item :label="('Số tài khoản')" :required="true">
            <el-input v-model="postForm.account_id" :placeholder="('nhập số tài khoản')" />
          </el-form-item>
          <el-form-item :label="('Tên ngân hàng')" :required="true">
            <el-input v-model="postForm.bank_name" :placeholder="('nhập tên ngân hàng')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ ('Hủy bỏ') }}</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formatNumber } from '@/utils/convert'
// import i18n from '@/lang/i18n'
// import SupplierResource from '@/api/supplier'

// const supplierResource = new SupplierResource()

export default {
  name: 'DialogCreateBankAccount',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: { titleName: ('Thêm mới tài khoản ngân hàng'), buttonName: ('Thêm mới') },
      rules: {
        account_name: [
          { required: true, message: ('Tên chủ tài khoản không được để trống'), trigger: 'blur' }
        ],
        account_id: [
          { required: true, message: ('Số tài khoản không được để trống'), trigger: 'blur' }
        ],
        bank_name: [
          { required: true, message: ('Tên ngân hàng không được để trống'), trigger: 'blur' }
        ]
      },
      loadingSubmit: false,
      postForm: {}
    }
  },
  created() {
    // this.nameTitle()
  },
  methods: {
    onSubmitForm(formName) {
      console.log('......... post form', JSON.stringify(this.postForm), formName)
      this.$refs[formName].validate((validate) => {
        console.log('............ validate ', validate)
        if (validate) {
          if (!this.postForm.account_name) {
            return this.$message.warning(('Tên chủ tài khoản không được để trống'))
          }
          if (!this.postForm.account_id) {
            return this.$message.warning(('Số tài khoản không được để trống'))
          }
          if (!this.postForm.bank_name) {
            return this.$message.warning(('Tên ngân hàng không được để trống'))
          }
          this.$emit('onClickButtonDialog', { dialog: false, reload: false, data: Object.assign({}, this.postForm) })
          this.postForm = {}
          //   if (!this.objectData.category_id || this.objectData.category_id === '' || this.objectData.category_id === undefined) {
          //     this.$message.warning(('choosen_category'))
          //   } else {
          //     if (this.isAdd) {
          //       this.handleSubmitTag()
          //     } else {
          //       this.handleUpdateTag()
          //     }
          //   }
        }
      })
    },
    // nameTitle() {
    //   if (this.isCondition === true) {
    //     this.dialog = Object.assign({}, { titleName: ('add_new_discount'), buttonName: ('add') })
    //   } else {
    //     this.dialog = Object.assign({}, { titleName: ('update_conditions'), buttonName: ('update') })
    //   }
    // },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
    },
    formatNumber
  }
}
</script>

  <style>
  .el-dialog__body {
    /* padding: 10px 20px; */
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-top: 10px;
    color: #606266;
    /* font-size: 14px; */
    /* word-break: break-all; */
  }
  .row {
      margin-top: 15px;
  }
  .input {
      margin-top: 10px;
  }
  .tem-label {
      font-size: 16px;
      color: #000;
  }
  </style>
