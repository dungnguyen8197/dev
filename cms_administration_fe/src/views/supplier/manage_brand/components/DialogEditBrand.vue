<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="formRequest" class="demo-ruleForm">
      <el-form-item>
        <label>{{ "Mã thương hiệu" }}<span style="color: red;">*</span></label>
        <el-form-item prop="code">
          <el-input
            v-model="formRequest.code"
            prop="code"
            placeholder="Mã thương hiệu"
            disabled
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>

      <el-form-item>
        <label>{{ "Tên thương hiệu" }}<span style="color: red;">*</span></label>
        <el-form-item prop="name">
          <el-input
            v-model="formRequest.name"
            prop="name"
            placeholder="Tên thương hiệu"
            @keyup.enter.native="onSubmitForm('ruleForm')"
          />
        </el-form-item>
      </el-form-item>

      <div label="Logo">
        <label>Logo</label>
        <UploadCropImage ref="crop_component" :img-default="formRequest.image" />
        <!-- <UploadCropImage ref="crop_component" :img_default="formRequest.image" /> -->
      </div>

      <el-form-item label="Trạng thái">
        <el-form-item prop="state">
          <el-switch v-model="formRequest.state" active-color="#13ce66" />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirm">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { validateText } from '@/utils/validate'
import UploadCropImage from './UploadCropImage.vue'
import ManageBrandResource from '@/api/manage_supplier/brand'
const manageBrandResource = new ManageBrandResource()

export default {
  name: 'DialogEditBrand',
  components: {
    UploadCropImage
  },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rules: {
        name: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên thương hiệu'),
          trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      dialog: { titleName: 'Cập nhật thông tin thương hiệu', buttonName: 'Cập nhật' },
      listImage: [],
      keyImage: [],
      isUploadImage: true,
      isUploadImageCover: true
    }
  },

  watch: {
  },
  mounted() {
    this.formRequest = { ...this.objectData }
    this.formRequest.state = !!this.objectData.active
    console.log(this.formRequest, 'formRequest')
  },
  created() {
    this.$root.$on('update_brand_avatar', (url_image) => {
      this.formRequest.image = url_image || null
      this.formRequest.active = this.formRequest.state ? 1 : 0

      manageBrandResource.updateActiveBrand(this.formRequest).then((res) => {
        manageBrandResource.editBrand(this.formRequest).then((res) => {
          console.log(this.formRequest, 'formRequest')
          this.$message.success('Cập nhật thương hiệu thành công')
          // this.objectData = { ...this.formRequest }
          this.handleClose()
          this.$root.$emit('update-brand-and-refresh-table')
        })
      })
        .catch((err) => {
          console.log(err)
          this.handleClose()
          this.$message.error('Cập nhật thương hiệu thất bại')
        })
    })
  },
  beforeDestroy() {
    this.$root.$off('update_brand_avatar')
  },
  methods: {
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.editConfirm()
        }
      })
    },
    handleClose() {
      this.showDialog = false
      this.$parent.$emit('hide-edit-brand-dialog')
      // this.resetformRequest()
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
        this.$refs['crop_component'].$emit('handle_add_new_brand')
      }).catch(() => {
        console.log('cancel')
      })
    }
  }
}
</script>

    <style scoped>
    .mb-10 {
      margin-bottom: 10px;
    }
    </style>

