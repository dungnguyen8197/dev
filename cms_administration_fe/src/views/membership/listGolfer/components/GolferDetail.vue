<template>
  <el-dialog
    title="Nâng cấp Hạng Hội Viên"
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
        <el-form-item label="Hạng hội viên hiện tại: ">
          <el-tag
            v-if="postForm.allow_using_scorecard_image !== 0"
            :type="convertMembership(postForm.allow_using_scorecard_image).className"
          >
            {{ convertMembership(postForm.allow_using_scorecard_image).text }}
          </el-tag>
        </el-form-item>
        <el-form-item label="Hạng hội viên muốn nâng: ">
          <el-select v-model="allowUsingScorecardImage" class="w-100" placeholder="Hạng hội viên">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Gói gia hạn tài khoản:">
          <el-select
            v-model="postForm.options_upgrade_account_id"
            placeholder="Gói gia hạn"
            style="width: 100%"
            :change="selectOption"
            :remote-method="onGetOptionsUpgradeAccount"
            @input="selectOption"
          >
            <el-option
              v-for="item in listOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import axios from 'axios'
const listGolferResources = new ListGolferResource()
const defaultForm = {
  allow_using_scorecard_image: 0,
  options_upgrade_account_id: ''
}
export default {
  name: 'GolferDetail',
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
      dialogVisible: false,
      postForm: Object.assign({}, defaultForm),
      options: [...AccountOptionForm],
      loadingForm: false,
      allowUsingScorecardImage: 0,
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
    allowUsingScorecardImage(value) {
      console.log('value', value)
      this.postForm.type_upgrade = value
      this.onGetOptionsUpgradeAccount()
    },
    objDetail(value) {
      if (value) {
        this.allowUsingScorecardImage = value.allow_using_scorecard_image
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
      console.log('listoption', this.listOption)
      console.log('sdasdasdasdasdsadasd', this.dataSelect)
      this.loadingSubmit = false
      const data = {
        cms_id: getAcountInfo().id,
        payment_method: 'bank',
        money: this.dataSelect1,
        list_user_upgrade: this.dataSelectOption
      }
      axios({
        url: 'https://wghn-api-staging.vcallid.com/api/v1/for_cms/create_payment_upgrade_account?uid=' + this.user_id + '&uid_upgrade=' + this.user_id + '&type_upgrade=' + this.postForm.type_upgrade,
        method: 'POST',
        data
      }).then(response => {
        this.loadingSubmit = false
        console.log('adtasdasd...........', response.data)
        if (response.data.error_code === 0) {
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
    onGetOptionsUpgradeAccount() {
      console.log('this.postForm.type_upgrade', this.postForm.type_upgrade)
      this.listCanOpen = []
      const array = []
      this.listQuery = {
        uid: getAcountInfo().id,
        uid_upgrade: this.user_id,
        type_upgrade: this.postForm.type_upgrade
      }
      listGolferResources.getOptionUpgradeAccount(this.listQuery).then((res) => {
        if (res.error_code === 0) {
          if (res.data.length === 0) {
            this.listCanOpen = res.data
            this.listCanOpen.map(value => {
              const label = 'Không có gói phù hợp'
              const item = { value: value.name, label: label, option: value, money: value.total_pay }
              array.push(item)
            })
          } else {
            this.listCanOpen = res.data
            this.listCanOpen.map(value => {
              if (value) {
                const label = `Gói ${value.name} - ${value.total_pay}Đ`
                const item = { value: value.name, label: label, option: value, money: value.total_pay }
                array.push(item)
              }
            })
          }
        }
        this.listOption = [...array]
      })
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
