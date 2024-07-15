<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="postForm" class="demo-ruleForm">
      <el-form-item label="Mã khách hàng">
        <!--        <el-input v-if="isAdd === true" v-model="postForm.user_id" placeholder="Mã khách hàng" />-->
        <el-input v-if="isAdd === false" v-model="postForm.user_id" disabled placeholder="Mã khách hàng" />
        <el-select
          v-if="isAdd === true"
          v-model="golferID"
          filterable
          remote
          placeholder="Nhập vID"
          :remote-method="onSearchGolfer"
          style="width: 100%"
        >
          <el-option
            v-for="item in listGolfer"
            :key="item._id"
            :label="item.fullname + ' - ' + (item.id_display||item._id)"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isAdd === true" label="Ngày đề xuất" prop="start_date">
        <el-date-picker
          v-model="dateStart"
          type="datetime"
          placeholder="Ngày đề xuất"
        />
      </el-form-item>
      <el-form-item v-if="isAdd === true" label="Ngày hết hạn" prop="end_date">
        <el-date-picker
          v-model="endDate"
          type="datetime"
          placeholder="Ngày hết hạn"
        />
      </el-form-item>
      <el-form-item v-if="isAdd === false" label="Duyệt tài khoản">
        <el-switch
          v-model="activeCustom"
          :active-text="activeTitle"
        />
      </el-form-item>
      <el-form-item label="Lý do đề xuất" prop="approve_noted">
        <el-input
          v-if="isAdd === true"
          v-model="postForm.noted"
          type="textarea"
          placeholder="Lý do đề xuất"
        />
        <el-input
          v-if="isAdd === false"
          v-model="postForm.noted"
          type="textarea"
          placeholder="Lý do đề xuất"
          disabled
        />
      </el-form-item>

      <el-form-item v-if="isAdd === false" label="Lý do duyệt" prop="noted">
        <el-input
          v-model="postForm.approve_noted"
          type="textarea"
          placeholder="Lý do duyệt"
        />
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
import { isEmpty, validateArray, validatePhoneNumber, validateText } from '@/utils/validate'
// import { convertDate1, convertDateTimeString } from '@/utils/convert'
import { getAcountInfo } from '@/utils/auth'
import moment from 'moment'
import CustomResource from '@/api/custorm'
const customResource = new CustomResource()
import ListGolferResource from '@/api/membership/golfer'
const listGolferResources = new ListGolferResource()
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
      dateStart: '',
      endDate: '',
      loadingDialog: false,
      activeAccount: true,
      rules: {
        name: [{ validator: (rule, _, callback) => validateText(rule, this.formRequest.user_name, callback, 'Tên', 2, 40), trigger: 'change' }],
        phone: [{ validator: (rule, _, callback) => validatePhoneNumber(rule, this.formRequest.phone, callback, 'Số điện thoại'), trigger: 'change' }],
        roles: [{ validator: (rule, _, callback) => validateArray(rule, this.formRequest.roles, callback, 'Vai trò'), trigger: 'change' }]
      },
      dialog: { titleName: 'Thêm khách hàng thân thiết', buttonName: 'add' },
      loadingSubmit: false,
      roles: [],
      parents: [],
      formRequest: {
        roles: []
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
      postForm: {},
      activeTitle: 'Chưa duyệt',
      activeCustom: false,
      golferID: null,
      listGolfer: []
    }
  },
  watch: {
    golferID(value) {
      if (value === null || value === undefined) {
        this.postForm.user_id = null
      } else {
        this.postForm.user_id = value
      }
    },
    dateStart(val) {
      this.postForm.start_date = val ? moment(val.start_date, 'HH:mm:ss,DD-MM-YYYY').format('YYYY-DD-MM HH:mm:ss') : ''
    },
    endDate(val) {
      this.postForm.end_date = val ? moment(val.end_date, 'HH:mm:ss,DD-MM-YYYY').format('YYYY-DD-MM HH:mm:ss') : ''
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới khách hàng thân thiết', buttonName: 'add' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Phê duyệt khách hàng thân thiết', buttonName: 'update' })
      }
    },
    objectData(object) {
      console.log('..................object', object)
      this.postForm = Object.assign({}, object)
      this.activeCustom = (object.is_approve === 1)
      this.postForm.start_date = object.start_date ? moment(object.start_date, 'HH:mm:ss,DD-MM-YYYY').format('YYYY-DD-MM HH:mm:ss') : ''
      this.postForm.end_date = object.end_date ? moment(object.end_date, 'HH:mm:ss,DD-MM-YYYY').format('YYYY-DD-MM HH:mm:ss') : ''
    },
    activeCustom(value) {
      this.activeTitle = value ? 'Đã duyệt' : 'Chưa duyệt'
      this.postForm.is_approve = value ? 1 : 0
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (isEmpty(this.formRequest.is_active)) this.formRequest.is_active = 1
          if (this.isAdd) this.handleSubmitAccount()
          else this.handleUpdateAccount()
        }
      })
    },
    handleSubmitAccount() {
      this.loadingSubmit = true
      const account = getAcountInfo()
      const body = {
        user_id: this.postForm.user_id,
        user_id_request: account.id,
        user_id_approve: account.id,
        approve_noted: this.postForm.approve_noted,
        noted: this.postForm.noted,
        is_approve: this.activeCustom,
        start_date: this.dateStart,
        end_date: this.endDate
      }
      customResource.storeCustom(body).then(response => {
        const { error_code, error_msg } = response
        this.loadingSubmit = false
        if (error_code === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.postForm = {}
          this.dateStart = ''
          this.endDate = ''
          this.$message.success('Thêm khách hàng thành công')
        } else {
          this.$message.error(error_msg)
        }
      })
    },
    onSearchGolfer(query) {
      if (query !== '') {
        this.loadingSearch = true
        listGolferResources.searchGolfer({ q: query }).then((response) => {
          if (response.error_code === 0) {
            this.loadingSearch = true
            this.listGolfer = response.data
          }
        })
      } else {
        this.listGolfer = []
      }
    },
    handleUpdateAccount() {
      this.loadingSubmit = true
      const body = {
        id: this.postForm.id,
        is_approve: this.activeCustom,
        approve_noted: this.postForm.approve_noted,
        noted: this.postForm.noted
      }
      customResource.updateCustom(body).then(response => {
        const { error, error_msg } = response
        this.loadingSubmit = false
        if (error === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.postForm = {}
          this.$message.success('Cập nhật thành công')
        } else {
          this.$message.error(error_msg)
        }
      })
    },
    async resetFormRequest() {
      this.postForm = {}
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },
    // changeLevel(roleId) {
    //   if ((roleId?.length || 0) > (this.formRequest?.roles?.length || 0)) {
    //     this.getByLevel(roleId[roleId.length - 1])
    //     this.formRequest.roles = [...this.formRequest.roles || [], { role_id: roleId[roleId.length - 1] }]
    //     const type_service = this.roles.find((value) => value.id === roleId[roleId.length - 1]).type_services
    //     this.typeServices = [...this.typeServices, type_service]
    //   } else {
    //     this.formRequest.roles = this.formRequest.roles.filter((value, index) => {
    //       if (roleId.includes(value.role_id)) {
    //         return value
    //       } else {
    //         const type_service = this.roles.find((v) => v.id === value.role_id).type_services
    //         this.typeServices = this.typeServices.filter((v) => {
    //           if (v !== type_service) return v
    //         })
    //         this.parents.splice(index, 1)
    //         this.agents.splice(index, 1)
    //         this.super_agent.splice(index, 1)
    //         this.rolesRequest.splice(index, 1)
    //       }
    //     })
    //   }
    // },
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
    }
    // getByLevel(roleId) {
    //   this.loadingDialog = true
    //   accountResource.getByLevel(roleId, this.adminId).then(res => {
    //     if (res.error_code === 0) {
    //       if (res.data) {
    //         this.parents = [...this.parents, res.data.admins]
    //         this.agents = [...this.agents, res.data.agents]
    //         this.super_agent = [...this.super_agent, res.data.super_agent]
    //       }
    //     } else {
    //       this.$message.error(res.error_msg)
    //     }
    //   }).finally(() => {
    //     this.loadingDialog = false
    //   })
    // },
    // async getByLevelOnUpdate(admin_has_role) {
    //   this.loadingDialog = true
    //   const response = await Promise.all(admin_has_role.map((role, index) =>
    //     accountResource.getByLevel(role.role_id, this.adminId).then((res) => {
    //       if (res.error_code === 0) {
    //         if (res.data) {
    //           if (res?.data?.admins && res.data.admins.map((v) => v.id).includes(role.parent_id)) this.rolesRequest[index] = role.parent_id
    //           else this.rolesRequest[index] = null
    //           if (res?.data?.agents && res.data.agents.map((v) => v.id).includes(role.list_agent_id)) this.dataAgent[index] = role.list_agent_id
    //           else this.dataAgent[index] = null
    //           if (res?.data?.super_agent && res.data.super_agent.map((v) => v.id).includes(role.list_super_agent_id)) this.dataSuperAgent[index] = role.list_super_agent_id
    //           else this.dataSuperAgent[index] = null
    //           return res.data
    //         }
    //       } else {
    //         this.$message.error(res.error_msg)
    //       }
    //     })
    //   ))
    //   this.loadingDialog = false
    //   this.parents = response.map((r) => r.admins)
    //   this.agents = response.map((r) => r.agents)
    //   this.super_agent = response.map((r) => r.super_agent)
    // }
  }
}
</script>

<style scoped>
  .maxWidth {
    width: 100%;
  }
</style>
