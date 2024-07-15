<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="40%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">
          <el-form-item label="Loại thành tích :" required>
            <el-form-item prop="name">
              <el-input
                v-model="formRequest.achievement_name"
                prop="name"
                placeholder="Loại thành tích"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
            <el-form-item label="Custom tên thành tích">
              <el-radio-group v-model="formRequest.is_custom" class="w-100">
                <el-radio border value="0" :label="0">Không</el-radio>
                <el-radio border value="1" :label="1">Có </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-item>
        </el-col>

      </el-row>
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
import { validateText } from '../../../utils/validate'
import EventResource from '@/api/event'

const eventResource = new EventResource()

export default {
  name: 'DialogOptionAchievement',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    organizations: {
      type: Array,
      default() {
        return []
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
        name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.formRequest.achievement_name, callback, 'Tên thành tích'),
            trigger: 'change'
          }
        ]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      dialog: { titleName: 'Thêm mới thành tích', buttonName: 'Thêm mới' }
    }
  },
  watch: {
    objectData(value) {
      if (!this.isAdd) {
        this.formRequest = {
          ...value
        }
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới thành tích', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật thành tích', buttonName: 'Cập nhật' })
      }
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          if (this.isAdd) this.handleSubmitAdd()
          else this.handleSubmitUpdate()
        }
      })
    },

    async handleSubmitAdd() {
      eventResource.store_option_achievement(this.formRequest).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.data)
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate() {
      eventResource.update_option_achievement(this.formRequest, this.formRequest.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.data)
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async resetformRequest() {
      await Promise.resolve(
        (this.formRequest = {})
      )
      this.$refs['ruleForm'].clearValidate()
    },
    changeDisplay(row) {
      console.log('row................', row)
      // const params = {
      //   uid: this.admin.id,
      //   type: 1,
      //   is_hidden: row.is_public === 1 ? 1 : 0,
      //   id_select: row.id
      // }
      // physicalDamageInsuranceProductResource.changeDisplay(params).then(response => {
      //   console.log('response................', response)
      //   if (response.error_code === 1) {
      //     console.log('response................', response)
      //     this.$message.error('Thay đổi trạng thái thất bại')
      //     return
      //   }
      //   this.$message.success('Thay đổi trạng thái thành công')
      //   this.onGetListCategory()
      // })
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
    }
  }
}
</script>

<style scoped>
.w-100 {
  width: 100%;
}
.mr-10 {
  margin-right: 10px;
}
</style>
