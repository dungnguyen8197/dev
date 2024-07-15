<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="formRequest" class="demo-ruleForm">
      <el-form-item>
        <label>{{ "Tên tag" }}<span style="color: red;">*</span></label>
        <el-form-item prop="name">
          <el-input
            v-model="formRequest.name"
            prop="name"
            placeholder="Nhập tên tag"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>

      <el-form-item>
        <label>{{ "Hạng mục" }}<span style="color: red;">*</span></label>
        <el-form-item prop="category">
          <el-select v-model="formRequest.category_id" style="width: 100%" filterable placeholder="Chọn hạng mục">
            <el-option v-for="item in categoryOption" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="Trạng thái">
        <el-form-item prop="active">
          <el-switch v-model="formRequest.active" :active-value="1" :inactive-value="0" active-color="#13ce66" />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirm">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { validateText, validateSelect } from '@/utils/validate'
import ManageTagResource from '@/api/manage_supplier/tag'
const manageTagResource = new ManageTagResource()

export default {
  name: 'DialogEditTag',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    objectData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.name, callback, 'Tên tag'),
            trigger: 'change'
          }
        ],
        category: [
          {
            validator: (rule, _, callback) =>
              validateSelect(
                rule,
                this.formRequest.category_id,
                callback,
                'Hạng mục'
              ),
            trigger: 'change'
          }
        ]
      },
      dialog: {
        titleName: 'Cập nhật tag',
        buttonName: 'Cập nhật'
      },
      dialogLoading: false,
      loadingSubmit: false,
      formRequest: {},

      filterCategory: '',
      categoryOption: []
    }
  },
  mounted() {
    this.formRequest = { ...this.objectData }
    this.getListCategory()
  },
  methods: {
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.editConfirm()
        }
      })
    },
    getListCategory() {
      manageTagResource.listCategory().then((response) => {
        console.log(response.data)
        this.categoryOption = response.data
      })
    },
    handleClose() {
      this.showDialog = false
      this.$parent.$emit('hide-edit-tag-dialog')
    },
    editTag() {
      this.dialogLoading = true
      manageTagResource.activeTag(this.formRequest)
        .then((res) => {
          manageTagResource
            .updateTag(this.formRequest)
            .then((response) => {
              this.dialogLoading = false
              this.$message.success('Cập nhật tag thành công')
              this.showDialog = false
              this.$parent.$emit('hide-edit-tag-dialog')
              this.$parent.$emit('refresh-list-tag')
              this.dialogLoading = false
            })
            .catch((err) => {
              console.log(err)
              this.$message.error('Cập nhật tag thất bại')
              this.dialogLoading = false
            })
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('Cập nhật tag thất bại')
          this.dialogLoading = false
        })
    },
    cancelConfirm() {
      this.$confirm('Các chỉnh sửa sẽ không được lưu. Bạn có chắc chắn muốn tiếp tục ?', 'Xác nhận hủy chỉnh sửa?', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.handleClose()
      }).catch(() => {
        console.log('cancel')
      })
    },
    editConfirm() {
      this.$confirm('Các thông tin sẽ được cập nhật. Bạn có chắc chắn muốn lưu các thay đổi ?', 'Xác nhận thay đổi thông tin?', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.editTag()
      }).catch(() => {
        console.log('cancel')
      })
    }
  }
}
</script>
