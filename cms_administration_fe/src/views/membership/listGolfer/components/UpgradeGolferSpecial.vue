<template>
  <el-dialog
    title="Nâng hạng tài khoản đặc biệt"
    :visible.sync="dialogVisible"
    :show-close="true"
    :close-on-click-modal="true"
    :before-close="handleClose"
    width="60%"
  >
    <el-row v-loading="loadingForm" class="box-form">
      <el-form ref="form" :model="postForm">
        <el-form-item label="Tên Golfer: ">
          <el-input v-model="postForm.fullname" disabled placeholder="Tên Golfer" />
        </el-form-item>
        <el-form-item label="Loại tài khoản: ">
          <el-tag
            v-if="postForm.allow_using_scorecard_image !== 0"
            :type="convertMembership(postForm.allow_using_scorecard_image).className"
          >
            {{ convertMembership(postForm.allow_using_scorecard_image).text }}
          </el-tag>
        </el-form-item>
        <el-form-item label="Hạng hội viên muốn nâng: ">
          <el-select v-model="postForm.type_upgrade" class="w-100" placeholder="Hạng hội viên">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Ngày hết hạn " prop="start_date">
          <el-date-picker
            v-model="postForm.time_upgrade"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="Ngày hết hạn"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <el-form-item label="Ghi chú: ">
          <el-input
            v-model="postForm.note"
            type="textarea"
            placeholder="Ghi chú"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">Hủy bỏ</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmit">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import Resource from '@/api/resource'
import { AccountOptionForm } from '@/utils/defaultOptions'
import { convertDateTimeString } from '@/utils/convert'
import ListGolferResource from '@/api/membership/golfer'
import { getAcountInfo } from '@/utils/auth'
import { convertMembership, convertTypeAccount } from '@/utils/convertNumberToString'
// import axios from 'axios'
const listGolferResources = new ListGolferResource()
const defaultForm = {
  allow_using_scorecard_image: 0,
  options_upgrade_account_id: ''
}
export default {
  name: 'UpgradeGolferSpecial',
  props: {
    objDetail: {
      type: Object,
      default: () => {
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          return date < Date.now()
        }
      },
      dialogVisible: false,
      postForm: Object.assign({}, defaultForm),
      options: [...AccountOptionForm],
      loadingForm: false,
      user_id: 0,
      arrayOptionAccount: [],
      disabledOption: false,
      loadingSubmit: false,
      expiredTime: null,
      roleUser: this.$store.getters.roles,
      userPermission: [],
      arrayOptionAccountPre: [],
      agent: '',
      loadingSearchAgent: false,
      agentInsurance: [],
      loadingSearch: false,
      listOption: [],
      listCanOpen: {},
      listQuery: {},
      dataSelectOption: [],
      dataSelect1: []
    }
  },
  watch: {
    objDetail(value) {
      if (value) {
        this.user_id = value.id
        // this.postForm.options_upgrade_account_id = value;
        this.postForm = Object.assign({}, value)
        this.expiredTime = value.expried_time
      }
    },
    expiredTime(value) {
      const date = new Date()
      const dateCopy = new Date(date.getTime())
      dateCopy.setFullYear(date.getFullYear() + 1)
      this.postForm.expried_time = this.convertDateTimeString(value)
    },
    showDialog(value) {
      this.dialogVisible = value
    }
  },
  mounted() {
  },
  methods: {
    convertMembership,
    onCloseDialog() {
      this.dialogVisible = false
      this.$emit('clickButton', false)
    },
    onSubmit() {
      this.loadingSubmit = false
      const data = {
        cms_id: getAcountInfo().id,
        user_id: this.user_id,
        type_upgrade: this.postForm.type_upgrade,
        time_upgrade: Date.parse(this.postForm.time_upgrade) / 1000,
        note: this.postForm.note
      }
      console.log('dattttttttttttttttta', data)
      listGolferResources.upgradeGolferSpecial(data).then(response => {
        this.loadingSubmit = false
        console.log('adtasdasd...........', response)
        if (response.error_code === 0) {
          this.$message.success('Gửi yêu cầu nâng hạng thành viên thành công')
          this.dialogVisible = false
          this.$emit('clickButton', true)
        } else {
          this.$message.error('Gửi yêu cầu nâng hạng thất bại')
        }
      })
    },
    onCreateQR() {
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$emit('clickButton', false)
      done()
    },

    convertDateTimeString,
    convertTypeAccount,
    selectOption(value) {
      let dataSelect = {}
      this.listOption.map(item => {
        if (item.value === value) {
          dataSelect = item
        }
      })
      const dataIdSelect = []
      dataSelect.option.list_options.map(item => dataIdSelect.push({ user_id: this.user_id, upgrade_id: item.id }))
      this.dataSelect1 = dataSelect.money
      this.dataSelectOption = [...dataIdSelect]
    }
  }
}
</script>

<style lang="scss">
.w-100 {
  width: 100%;
}

.el-dialog {
  width: 100%;
}
</style>
