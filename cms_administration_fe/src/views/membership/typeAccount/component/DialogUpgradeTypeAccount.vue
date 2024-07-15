<template>
  <el-dialog
    title="Cập nhật loại tài khoản"
    :visible.sync="dialogVisible"
    :show-close="true"
    :close-on-click-modal="true"
    :before-close="handleClose"
    width="60%"
  >
    <el-row v-loading="loadingForm" class="box-form">
      <el-form ref="form" :model="postForm">
        <el-form-item label="vID: ">
          <el-input v-model="postForm.id" disabled placeholder="vID:" />
        </el-form-item>
        <el-form-item label="Loại tài khoản hiện tại: ">
          <el-tag
            v-if="postForm.type_user_old !== 0"
            :type="convertTypeAccount(postForm.type_user_old).className"
          >
            {{ convertTypeAccount(postForm.type_user_old).text }}
          </el-tag>
        </el-form-item>
        <el-form-item label="Loại tài khoản muốn nâng: ">
          <el-select v-model="postForm.type" class="w-100" placeholder="Loại tài khoản">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-col>
          <label>Hạn khuyến mãi </label>
          <div class="clearfix-5" />
          <el-date-picker
            v-model="expiredTime"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="Pick a day"
            :picker-options="pickerOptions"
          />
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">Hủy bỏ</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmit">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import Resource from '@/api/resource'
import { typeMembership } from '@/utils/defaultOptions'
import { convertDate, convertDateTimeString } from '@/utils/convert'
import ListGolferResource from '@/api/membership/golfer'
import { getAcountInfo } from '@/utils/auth'
import { convertMembership, convertTypeAccount } from '@/utils/convertNumberToString'
// import { pickerOptions } from '@/utils/dateRangOptions'
const listGolferResources = new ListGolferResource()
const defaultForm = {
  allow_using_scorecard_image: 0,
  options_upgrade_account_id: ''
}

export default {
  name: 'DialogUpgradeTypeAccount',
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
      options: [...typeMembership],
      loadingForm: false,
      allowUsingScorecardImage: 0,
      user_id: 0,
      arrayOptionAccount: [],
      disabledOption: false,
      loadingSubmit: false,
      expiredTime: '',
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
      dataSelect1: [],
      TypeOldUser: 0
    }
  },
  watch: {
    TypeOldUser(value) {
      console.log('value', value)
      this.postForm.type_old_user = value
    },
    objDetail(value) {
      if (value) {
        this.TypeOldUser = value.type_old_user
        this.user_id = this.postForm.id
        // this.postForm.options_upgrade_account_id = value;
        this.postForm = Object.assign({}, value)
      }
    },
    expiredTime(value) {
      this.postForm.expried_time = convertDate(value, 'dd-MM-yyyy')
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
        user_id: this.postForm.id,
        type: this.postForm.type,
        expried_time: this.expiredTime
      }
      listGolferResources.addUpgradeTypeAccount(data).then(response => {
        this.loadingSubmit = false
        console.log('adtasdasd...........', response.data)
        if (response.data.error_code === 0) {
          this.$message.success(response.data.message)
          this.dialogVisible = false
          this.$emit('clickButton', true)
        } else if (response.data.error_code === 2) {
          const typeKM = response.data
          this.$message.error(response.data.message + this.options[typeKM])
        } else {
          this.$message.error(response.data.message)
        }
      })
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
