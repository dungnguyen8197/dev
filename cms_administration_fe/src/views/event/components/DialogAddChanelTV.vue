<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="$store.getters.isShowDialogAddEvent"
    width="50%"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :model="objectData" class="demo-ruleForm">
      <el-row>
        <h3>Thông tin Tournament :</h3>
        <el-col :sm="24" :md="24">
          <el-form-item label="Tên kênh TV :" required>
            <el-form-item prop="chanel_name">
              <el-input
                v-model="formRequest.fullname"
                prop="name"
                placeholder="Tên kênh TV"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Tên sự kiện:" required>
            <el-form-item prop="event_id">
              <el-input
                v-model="formRequest.name_unit"
                prop="name"
                placeholder="Tên sự kiện"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Link kênh TV :" required>
            <el-form-item prop="link">
              <el-input
                v-model="formRequest.fullname"
                prop="name"
                placeholder="Tên kênh TV"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item :sm="12">
            <label>Trạng thái:</label>
            <el-select
              v-model="formRequest.active"
              placeholder="trạng thái hiển thị"
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
import { getAcountInfo } from '@/utils/auth'
import moment from 'moment'
import { formatNumber } from '@/utils/convert'
import EventResource from '@/api/event'
const eventResource = new EventResource()
const arrayStatus = [
  { value: 1, label: 'Hiển thị' },
  { value: 0, label: 'Không hiển thị' }
]
export default {
  name: 'DialogAddChanelTV',
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
      editorConfig: {
        toolbarGroups: [
          { name: 'document', groups: ['mode', 'document', 'doctools'] },
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
          { name: 'forms', groups: ['forms'] },
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
          { name: 'links', groups: ['links'] },
          { name: 'insert', groups: ['insert'] },
          { name: 'styles', groups: ['styles'] },
          { name: 'colors', groups: ['colors'] },
          { name: 'tools', groups: ['tools'] },
          { name: 'others', groups: ['others'] },
          { name: 'about', groups: ['about'] }
        ],
        height: 300,
        line_height: '1'
      },
      arrayStatus: [...arrayStatus],
      loadingSubmit: false,
      dialogLoading: false,
      loadingSearchFacility: false,
      loadingSearchUser: false,
      loadingSearchClub: false,
      is_global_show: false,
      isShowOrganizationChild: false,
      loadingSearchOption: false,
      organizationChild: [],
      formRequest: {
        admin_id: getAcountInfo().id,
        fullname: '',
        name_unit: ''
      },
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      listImage: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      round: [],
      facilities: [],
      users: [],
      clubs: [],
      paths: [],
      facilityModel: {},
      file: null,
      dialog: { titleName: 'Thêm mới sự kiện', buttonName: 'Thêm mới' },
      organization: null
    }
  },
  computed: {
    pickerExport() {
      if (this.formRequest['tee_time_end']) {
        return {
          disabledDate: (time) => {
            return !moment(time.getTime()).isBetween(moment().subtract(1, 'day'), this.formRequest['tee_time_end'])
          }
        }
      } else {
        return {
          disabledDate: (time) => {
            return time.getTime() < moment().subtract(1, 'day')
          }
        }
      }
    },
    pickerImport() {
      if (this.formRequest['tee_time']) {
        return {
          disabledDate: (time) => {
            return moment(time.getTime()).isBefore(moment(this.formRequest['tee_time']))
          }
        }
      } else {
        return {
          disabledDate: (time) => {
            return time.getTime() < moment().subtract(1, 'day')
          }
        }
      }
    }

  },
  watch: {
    async objectData(value) {
      console.log('value___________________', value)
      if (!this.isAdd) {
        this.formRequest = {
          ...this.formRequest,
          ...value
        }
        this.listImage = value.img_background ? [{ url: value.img_background }] : []
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
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới kênh TV ', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật kênh TV ', buttonName: 'Cập nhật' })
      }
    }
  },

  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.loadingSubmit = true
          const formBody = await this.appendForm()
          console.log('ffffffffffffff', formBody)
          if (this.isAdd) await this.handleSubmitAdd(formBody)
          else await this.handleSubmitUpdate(formBody)
        }
      })
    },
    async handleSubmitAdd(formBody) {
      eventResource.storeTournament(formBody).then(async res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          await this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async handleSubmitUpdate(formBody) {
      eventResource.updateTournament(formBody, formBody.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.$emit('onCloseDialog', { dialog: false, reload: true })
          this.resetformRequest()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    async resetformRequest() {
      await Promise.resolve(
        (
          this.formRequest = {
            admin_id: getAcountInfo().id,
            fullname: '',
            name_unit: ''
          },
          this.listImage = []
        )
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetformRequest()
    },

    handleCloseTag(round) {
      this.rounds.splice(this.rounds.indexOf(round), 1)
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
