<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
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

      <!-- <div label="Logo">
        <label>Logo</label>
        <UploadCropImage ref="crop_component" />
      </div> -->

      <el-form-item label="Trạng thái">
        <el-form-item prop="state">
          <el-switch v-model="formRequest.state" active-color="#13ce66" />
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

import { validateText } from '@/utils/validate'
// import UploadCropImage from './UploadCropImage.vue'
import ManageBrandResource from '@/api/manage_supplier/brand'
const manageBrandResource = new ManageBrandResource()

export default {
  name: 'DialogAddBrand',
  components: {
    // UploadCropImage
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
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
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
      formRequest: {
        state: false
      },
      request: {},
      dialog: { titleName: 'Thêm mới thương hiệu', buttonName: 'Thêm mới' },
      keyImage: [],
      isUploadImage: true,
      isUploadImageCover: true
    }
  },

  watch: {
    showDialog(val) {
      console.log(val)
      if (!val) {
        this.resetformRequest()
      }
    }
  },
  created() {
    // this.$root.$on('update_brand_avatar', (url_image) => {
    //   this.formRequest.image = url_image || null
    //   this.formRequest.active = this.formRequest.state ? 1 : 0

    //   console.log('create brand:', this.formRequest)
    //   manageBrandResource.addBrand(this.formRequest).then((res) => {
    //     this.$root.$emit('update-brand-and-refresh-table')
    //     this.$message.success('Thêm mới thương hiệu thành công')
    //   }).catch((err) => {
    //     console.log(err)
    //     this.$message.error('Thêm mới thương hiệu thất bại')
    //   })
    // })
  },
  beforeDestroy() {
    this.$root.$off('update_brand_avatar')
  },
  methods: {
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          // this.$refs['crop_component'].$emit('handle_add_new_brand')
          // this.formRequest.image = this.$refs['crop_component'].brand_avatar || null
          this.formRequest.active = this.formRequest.state ? 1 : 0

          console.log('create brand:', this.formRequest)
          manageBrandResource.addBrand(this.formRequest).then((res) => {
            this.$root.$emit('update-brand-and-refresh-table')
            this.$message.success('Thêm mới thương hiệu thành công')
            this.handleClose()
          }).catch((err) => {
            console.log(err)
            this.$message.error('Thêm mới thương hiệu thất bại')
          })
        }
      })
    },
    resetformRequest() {
      this.formRequest = {
        state: false
      }
      // this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.showDialog = false
      this.$parent.$emit('hide-add-brand-dialog')
      // this.resetformRequest()
      // this.$parent.$emit('hide-add-brand-dialog')
    }
  }
}
</script>

    <style scoped>
    .mb-10 {
      margin-bottom: 10px;
    }
    </style>

