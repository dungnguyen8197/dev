<template>
  <el-dialog
    title="Thêm voucher cho user"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label=" Danh sách user được tặng voucher">
        <el-form-item prop="list_user_voucher">
          <el-col>
            <el-col v-if="listGolfers.length > 0">
              <el-tag
                v-for="(golfer, key) in listGolfers"
                :key="key"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(golfer)"
              >
                {{ `vID${golfer.user_id} - ` + golfer.name_out_system }}
              </el-tag>
            </el-col>
          </el-col>
          <div class="mb-10" />
          <el-col>
            <el-row>
              <el-select
                v-model="golferModel"
                class="w-100"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="Tìm kiếm mã vID"
                :remote-method="onSearchGolfer"
                :loading="loadingSearchUser"
              >
                <el-option v-for="user in users" :key="user.value" :label="`vID${user.value} - ${user.label}`" :value="user" />
              </el-select>
            </el-row>
          </el-col>
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

import PartnerServiceResource from '@/api/partner-service/partner-service'
import GolferResource from '@/api/golfer/golfer'
import { getAcountInfo } from '@/utils/auth'
import { create_signature_hub } from '@/utils/create-signnature'

const partnerServiceResource = new PartnerServiceResource()
const golferResource = new GolferResource()

export default {
  name: 'DialogVoucher',
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
      rules: {},
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {},
      listGolfers: [],
      users: [],
      golferModel: {},
      loadingSearchUser: false
    }
  },

  watch: {
    objectData(value) {
      if (value) {
        this.formRequest = value
      }
    },
    async golferModel(value) {
      if (value && Object.keys(this.golferModel).length !== 0) {
        const checkExist = this.listGolfers.filter(item => item.user_id === value.value)
        if (checkExist.length > 0) {
          this.$message.warning('vID đã được chọn.')
          return
        }
        const golfer = {
          user_id: value.value,
          name_out_system: value.label
        }
        this.listGolfers.push(golfer)
      }
    }
  },
  created() {
  },
  methods: {
    handleCloseTag(golfer) {
      this.listGolfers.splice(this.listGolfers.indexOf(golfer), 1)
    },
    onSearchGolfer(keyword) {
      const params = { keyword: keyword }
      this.loadingSearchUser = true
      golferResource.searchGolfer(params).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              return { value: value.id, label: value.fullname, phone: value.phone || '' }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.handleSubmitAdd()
        }
      })
    },

    async handleSubmitAdd() {
      this.formRequest.admin_id = getAcountInfo().id
      this.formRequest.signature = '123'
      if (this.listGolfers.length === 0) {
        this.$message.error('Bạn chưa chọn người để thêm')
        return
      }
      this.formRequest.user_list = this.listGolfers.map((item) => item.user_id)
      const signature = await this.create_signature_hub(this.formRequest)
      this.formRequest = { ...this.formRequest, signature }
      this.loadingSubmit = true
      partnerServiceResource.add_voucher_to_user(this.formRequest).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Thêm voucher cho user thành công')
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
        this.formRequest = {},
        this.users = [],
        this.golferModel = {},
        this.listGolfers = []
      )
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
    },
    create_signature_hub
  }
}
</script>

  <style scoped>
  .el-tag + .el-tag {
      margin-left: 10px;
  }

  .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
  }

  .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
  }
  .input-amount{
    width: 100%;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    padding: 0 10px;
  }
  .input-amount::placeholder{
    color: #606266;
  }
  .input-amount:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  </style>

