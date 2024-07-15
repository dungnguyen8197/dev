<template>
  <el-dialog
    title="Thêm thư ký vào CLB"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label=" Danh sách thư ký được thêm">
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
                {{ `${golfer.name_out_system} - ${golfer.phone}` }}
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
              >
                <el-option v-for="user in users" :key="user.value" :disabled="listGolfers.map(item=>item.id).includes(user.value)" :label="`${user.label} - ${user.phone}`" :value="user" />
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

import { getAcountInfo } from '@/utils/auth'
import { create_signature_hub } from '@/utils/create-signnature'
import AccountResource from '@/api/account'
import { ARRAY_ROLE_CLUB } from '@/utils/constant'
import AdminClubResource from '@/api/club/admin-club'

const adminClubResource = new AdminClubResource()
const accountResource = new AccountResource()

export default {
  name: 'DialogAddSecretary',
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
          id: value.value,
          name_out_system: value.label,
          phone: value.phone
        }
        this.listGolfers.push(golfer)
      }
    },
    showDialog(value) {
      if (value) {
        this.onListAdminClub()
      }
    }
  },
  created() {
  },
  methods: {
    handleCloseTag(golfer) {
      this.listGolfers.splice(this.listGolfers.indexOf(golfer), 1)
    },
    async onListAdminClub() {
      console.log('........................')
      this.loadingSearchUser = true
      await accountResource.Lists({ clubRoleList: ARRAY_ROLE_CLUB }).then(res => {
        const result = res.data.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              return { value: value.id, label: value.name, phone: value.phone || '' }
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
      if (this.listGolfers.length === 0) {
        this.$message.error('Bạn chưa chọn người để thêm')
        return
      }
      this.formRequest.list_admin = this.listGolfers.map((item) => ({ id: item.id, name: item.name_out_system }))
      console.log('..................listGolfers', this.formRequest.list_admin, this.formRequest.id, this.formRequest.name)
      this.loadingSubmit = true

      adminClubResource.add_club_secretary({ list_admin: this.formRequest.list_admin, club_name: this.formRequest.name }, this.formRequest.id).then(res => {
        const { data, error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success(data)
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
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

