<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-form-item label="Tài khoản " prop="name">
        <el-input v-model="formRequest.name" placeholder="Tên tài khoản" @keyup.enter.native="onSubmitForm('ruleForm')" />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="formRequest.phone" placeholder="Số điện thoại" @keyup.enter.native="onSubmitForm('ruleForm')" @blur="handleCheckPhone" />
        <span v-if="isCheckPhone" style="color: red; font-size: 12px;">Số điện thoại này đã có tài khoản club</span>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="formRequest.email" placeholder="Email" @keyup.enter.native="onSubmitForm('ruleForm')" />
      </el-form-item>
      <el-form-item label="Ngày sinh" prop="birthday">
        <el-date-picker
          v-model="formRequest.birthday"
          type="date"
          format="dd/MM/yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Ngày sinh"
        />
      </el-form-item>
      <el-form-item label="Duyệt tài khoản">
        <el-switch
          v-model="formRequest.is_active"

          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="0"
          :inactive-value="1"
        />
      </el-form-item>
      <el-form-item prop="roles" label="Quyền">
        <el-select
          v-model="formRequest.roles"
          multiple
          placeholder="Chọn quyền"
          class="filter-item  pd-2"
          style="width: 100%"
        >
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.title"
            :value="role.id"
          />
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button :disabled="isCheckPhone" type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AccountResource from '@/api/account'
import { Message } from 'element-ui'
import { validateArray, validatePhoneNumber, validateText, validateEmail } from '@/utils/validate'
import moment from 'moment'

const accountResource = new AccountResource()

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
    },
    roles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loadingDialog: false,
      activeAccount: true,
      rules: {
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.name, callback, 'Tên', 2, 40), trigger: 'change' }],
        birthday: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.birthday, callback, 'Ngày sinh'), trigger: 'change' }],
        email: [{ validator: (rule, _, callback) => validateEmail(rule, this.formRequest.email, callback, 'Email'), trigger: 'change' }],
        phone: [{ validator: (rule, _, callback) => validatePhoneNumber(rule, this.formRequest.phone, callback, 'Số điện thoại'), trigger: 'change' }],
        roles: [{ validator: (rule, _, callback) => validateArray(rule, this.formRequest.roles, callback, 'Quyền'), trigger: 'change' }]
      },
      dialog: { titleName: 'Thêm mới tài khoản', buttonName: 'add' },
      loadingSubmit: false,
      parents: [],
      formRequest: {
        is_active: 0,
        roles: [],
        clubRoleList: []
      },
      dataRole: [],
      rolesRequest: [],
      discountRequest: [],
      typeServices: [],
      adminId: '',
      agents: [],
      super_agent: [],
      dataAgent: [],
      dataSuperAgent: [],
      isCheckPhone: false,
      admins: [],
      clubRoleList: []
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
      console.log('object...........', object)
      if (this.isAdd) {
        this.admins = object.admins
      } else {
        if (object) {
          this.adminId = object.id
          this.formRequest = {
            name: object.name,
            is_active: object.is_active,
            phone: object.phone,
            email: object.email,
            birthday: moment(object.birthday).format('YYYY-MM-DD'),
            roles: object.role_admin.map(item => item.id),
            clubRoleList: object.clubRoleList
          }
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
    handleSubmitAccount() {
      this.loadingSubmit = true
      this.parent_id
      accountResource.storeAccountClub(this.formRequest).then(response => {
        this.loadingSubmit = false
        if (response.error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.resetFormRequest()
          Message({
            message: response.error_msg,
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
    handleUpdateAccount() {
      this.loadingSubmit = true
      accountResource.updateAccountClub(this.formRequest, this.adminId).then(response => {
        this.loadingSubmit = false
        if (response.error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.resetFormRequest()
          this.$message.success(response.error_msg)
        } else {
          this.$message.error(response.error_msg)
        }
      })
    },
    async resetFormRequest() {
      await Promise.resolve(
        this.formRequest = {
          is_active: 0,
          clubRoleList: [],
          roles: []
        },
        this.parents = [],
        this.dataRole = [],
        this.rolesRequest = [],
        this.typeServices = [],
        this.dataAgent = [],
        this.dataSuperAgent = [],
        this.agents = [],
        this.super_agent = [],
        this.activeAccount = true,
        this.adminId = '',
        this.isCheckPhone = false,
        this.admins = []
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },
    changeLevel(roleId) {
      if ((roleId?.length || 0) > (this.formRequest?.roles?.length || 0)) {
        this.getByLevel(roleId[roleId.length - 1])
        this.formRequest.roles = [...this.formRequest.roles || [], { role_id: roleId[roleId.length - 1] }]
        const type_service = this.roles.find((value) => value.id === roleId[roleId.length - 1]).type_services
        this.typeServices = [...this.typeServices, type_service]
      } else {
        this.formRequest.roles = this.formRequest.roles.filter((value, index) => {
          if (roleId.includes(value.role_id)) {
            return value
          } else {
            const type_service = this.roles.find((v) => v.id === value.role_id).type_services
            this.typeServices = this.typeServices.filter((v) => {
              if (v !== type_service) return v
            })
            this.parents.splice(index, 1)
            this.agents.splice(index, 1)
            this.super_agent.splice(index, 1)
            this.rolesRequest.splice(index, 1)
          }
        })
      }
    },
    changeParent(index, adminId) {
      this.formRequest.roles = this.formRequest.roles.map((value, i) => {
        if (i === index) {
          const newValue = value
          newValue.parent_id = adminId
          return newValue
        }
        return value
      })
    },
    changeDiscount(index, discount) {
      this.formRequest.roles = this.formRequest.roles.map((value, i) => {
        if (i === index) {
          const newValue = value
          newValue.discount = discount
          return newValue
        }
        return value
      })
    },
    changeAgent(index, agentId) {
      this.formRequest.roles = this.formRequest.roles.map((value, i) => {
        if (i === index) {
          const newValue = value
          newValue.list_agent_id = agentId
          return newValue
        }
        return value
      })
    },
    changeSuperAgent(index, superAgentId) {
      this.formRequest.roles = this.formRequest.roles.map((value, i) => {
        if (i === index) {
          const newValue = value
          newValue.list_super_agent_id = superAgentId
          return newValue
        }
        return value
      })
    },
    getByLevel(roleId) {
      this.loadingDialog = true
      accountResource.getByLevel(roleId, this.adminId).then(res => {
        if (res.error_code === 0) {
          if (res.data) {
            this.parents = [...this.parents, res.data.admins]
            this.agents = [...this.agents, res.data.agents]
            this.super_agent = [...this.super_agent, res.data.super_agent]
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    async getByLevelOnUpdate(admin_has_role) {
      this.loadingDialog = true
      const response = await Promise.all(admin_has_role.map((role, index) =>
        accountResource.getByLevel(role.role_id, this.adminId).then((res) => {
          if (res.error_code === 0) {
            if (res.data) {
              if (res?.data?.admins && res.data.admins.map((v) => v.id).includes(role.parent_id)) this.rolesRequest[index] = role.parent_id
              else this.rolesRequest[index] = null
              if (res?.data?.agents && res.data.agents.map((v) => v.id).includes(role.list_agent_id)) this.dataAgent[index] = role.list_agent_id
              else this.dataAgent[index] = null
              if (res?.data?.super_agent && res.data.super_agent.map((v) => v.id).includes(role.list_super_agent_id)) this.dataSuperAgent[index] = role.list_super_agent_id
              else this.dataSuperAgent[index] = null
              return res.data
            }
          } else {
            this.$message.error(res.error_msg)
          }
        })
      ))
      this.loadingDialog = false
      this.parents = response.map((r) => r.admins)
      this.agents = response.map((r) => r.agents)
      this.super_agent = response.map((r) => r.super_agent)
    },
    handleCheckPhone() {
      const check_admin = this.admins.find(item => item.phone === this.formRequest.phone)
      if (check_admin) {
        this.isCheckPhone = true
      } else {
        this.isCheckPhone = false
      }
    }
  }
}
</script>

<style scoped>
  .maxWidth {
    width: 100%;
  }
</style>
