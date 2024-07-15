<template>
  <el-dialog
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <h4 slot="title">{{ formRequest.facility ? formRequest.facility.sub_title : "" }}</h4>
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Ngày bán">
        <el-form-item prop="date">
          <el-date-picker
            v-model="formRequest.date"
            style="width: 100%;"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy/MM/dd"
            placeholder="Ngày bán"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Chọn đường">
        <el-form-item prop="listPath">
          <el-select
            v-model="formRequest.listPath"
            filterable
            clearable
            style="width: 100%"
            remote
            multiple
            reserve-keyword
            placeholder="Chọn đường"
          >
            <el-option
              v-for="path in pathList"
              :key="path.value"
              :label="path.label"
              :value="path.value"
            />
          </el-select>
        </el-form-item>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { validateDate, validateText } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import FacilityResource from '@/api/facility/facility'
import PackageTeeResource from '@/api/package-tee/index'

const packageTeeResource = new PackageTeeResource()
const facilityResource = new FacilityResource()

export default {
  name: 'DialogSellPackage',
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
    }
  },
  data() {
    return {
      rules: {
        date: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.date, callback, 'Ngày bán'),
          trigger: 'change'
        }],
        listPath: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.listPath, callback, 'Tên đường'),
          trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      request: {},
      pathList: []
    }
  },

  watch: {
    objectData(value) {
      console.log('value', value)
      if (value) {
        this.formRequest = { ...value }
        this.getPath()
      }
    }
  },
  created() {
  },
  methods: {
    getPath() {
      facilityResource.listFacility({ title: this.formRequest.facility.sub_title }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.pathList = result?.[0]?.paths.map(value => {
              return { value: value.id, label: value.name }
            })
          } else {
            this.pathList = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },

    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.handleSubmitAdd()
        }
      })
    },

    async handleSubmitAdd() {
      packageTeeResource.sell_pack({ date: this.formRequest.date, listPath: this.formRequest.listPath, idPack: this.formRequest.id }).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Bán thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },

    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {}
      )
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.resetformRequest()
      this.$emit('onCloseDialog', { dialog: true, reload: false })
    },

    formatNumber
  }
}
</script>

  <style scoped>
  .mb-10 {
    margin-bottom: 10px;
  }
  </style>

