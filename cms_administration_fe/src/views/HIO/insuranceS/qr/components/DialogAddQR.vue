<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="50%" :before-close="handleClose">
    <el-form ref="ruleForm" v-loading="dialogLoading" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="24">
          <el-form-item label="Chọn đại lý:">
            <el-select
              v-model="formRequest.agent_id"
              clearable
              filterable
              remote
              reserve-keyword
              class="w-100"
              placeholder="Tìm đại lý"
              :remote-method="onSearchAgent"
              :loading="loadingSearchAgency"
            >
              <el-option
                v-for="agent in agents"
                :key="agent.value"
                :label="agent.label"
                :value="agent.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Chọn sân:">
            <el-select
              v-model="facilityModel"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Nhập tên sân"
              :remote-method="onSearchFacility"
              :loading="loadingSearchFacility"
            >
              <el-option
                v-for="facility in facilities"
                :key="facility.value"
                :label="facility.label"
                :value="facility"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Chọn đường:">
            <el-select
              v-model="formRequest.path_id"
              clearable
              placeholder="Chọn đường đi "
              @change="changeSearch"
            >
              <el-option v-for="item in paths" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Chọn hố par 3:">
            <el-select
              v-model="formRequest.hole_id"
              clearable
              placeholder="Chọn hố par 3 "
            >
              <el-option
                v-for="item in holes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Trạng thái:">
            <el-select
              v-model="formRequest.status"
              placeholder="Trạng thái hiển thị"
            >
              <el-option
                v-for="level in arrayStatus"
                :key="level.value"
                :label="level.label"
                :value="level.value"
              />
            </el-select>
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
import { isEmpty } from '@/utils/validate'
import { getAcountInfo } from '@/utils/auth'
import { formatNumber } from '@/utils/convert'
const agentHIOResource = new AgentHIOResource()
const facilityResource = new FacilityResource()
import InsuranceApi from '@/api/HIO/insurance'
const insuranceApi = new InsuranceApi()

import AgentHIOResource from '@/api/HIO/agentHIO'
import FacilityResource from '@/api/facility/facility'
const arrayStatus = [
  { value: 1, label: 'Hiển thị' },
  { value: 0, label: 'Không hiển thị' }
]
export default {
  name: 'DialogAddQR',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    organizationData: {
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
      arrayStatus: [...arrayStatus],
      loadingSubmit: false,
      dialogLoading: false,
      loadingSearchFacility: false,
      formRequest: {
        admin_id: getAcountInfo().id,
        agent_id: '',
        facility_id: '',
        path_id: '',
        hole_id: '',
        status: 0
      },
      request: {},
      facilities: [],
      users: [],
      paths: [],
      holes: [],
      facilityModel: {},
      dialog: { titleName: 'Thêm mới mã QR', buttonName: 'Thêm mới' },
      organization: null,
      agents: [],
      loadingSearchAgency: false
    }
  },
  watch: {
    async objectData(value) {
      console.log('value1211111111111', value)
      if (!this.isAdd) {
        this.formRequest = {
          ...this.formRequest,
          ...value
        }
      } else {
        if (value) {
          this.formRequest = {
            ...this.formRequest,
            ...value
          }
          console.log('this.formRequest.....................', this.formRequest)
        }
      }
    },
    facilityModel(value) {
      console.log('ưe........', value)
      if (!isEmpty(value)) {
        this.paths = value.paths
        this.formRequest.facility_id = value.value
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới mã QR', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật mã QR', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    onSearchFacility(keyword) {
      this.loadingSearchFacility = true
      facilityResource.searchFacilityNew({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, paths: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchFacility = false
      })
    },
    async onSearchAgent(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchAgency = true
      agentHIOResource.searchAgentNew({ keyword: keywords }).then(res => {
        const data = res.data.data
        const array = []
        if (data.length > 0) {
          data.map(value => {
            const item = { label: `${value.name}`, value: value.id }
            array.push(item)
          })
        }
        this.agents = [...array]
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchAgency = false
    },
    changeSearch() {
      this.getListHolePar3()
    },
    getListHolePar3() {
      insuranceApi.listHolePar3({ path_id: this.formRequest.path_id, facility_id: this.formRequest.facility_id }).then(res => {
        if (res.error_code === 0) {
          const array1 = []
          res.data.map(result => {
            const item = { label: `${result.stt} - ${result.path_name}(${result.par})`, value: result.id }
            array1.push(item)
          })
          this.holes = [...array1]
          console.log('qưeqư.................', this.holes)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          const formBody = await this.appendForm()
          console.log('ffffffffffffff', formBody)
          if (this.isAdd) await this.handleSubmitAdd(formBody)
        }
      })
    },
    async handleSubmitAdd(formBody) {
      insuranceApi.createQR(formBody).then(async res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          await this.resetFormRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    async resetFormRequest() {
      (
        this.formRequest = {
          admin_id: getAcountInfo().id,
          agent_id: '',
          facility_id: '',
          path_id: '',
          hole_id: '',
          status: 0
        },
        this.facilityModel = {}
      )
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetFormRequest()
    },
    async appendForm() {
      const formData = this.formRequest
      for (const key in formData) {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key]
        }
      }
      return formData
    },

    formatNumber
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
.color-red {
  color: red;
}
</style>
