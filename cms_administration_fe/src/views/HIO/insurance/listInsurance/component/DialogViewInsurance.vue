<template>
  <el-dialog
    title="Chỉnh sửa thông tin chi tiết Bảo Hiểm"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
  >
    <el-row v-loading="loadingDialog" class="dialog-edit-insurance">
      <el-row class="warning-member">
        <el-col v-show="errorObject.show">
          <el-alert
            :title="errorObject.message"
            type="warning"
            effect="dark"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="6">
          <el-col v-if="postForm.is_refund != 1" class="mb-2">
            <label>Xác nhận giải outing:</label>
            <div class="clearfix-5" />
            <el-checkbox v-model="postForm.is_outing">Outing</el-checkbox>
          </el-col>
          <el-col class="mb-2">
            <label>Tên giải đấu: </label>
            <div class="clearfix-5" />
            <el-input v-model="postForm.name_tour" class="w-100" placeholder="Nhập tên giải đấu" />
          </el-col>
          <el-col class="mb-2">
            <label>Người mua bảo hiểm: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <div class="search-golfer">
              <el-select
                v-model="postForm.user_id"
                filterable
                remote
                class="w-100"
                placeholder="Tìm kiếm theo tên hoặc mã vID"
                :remote-method="onSearchGolferByInsurance"
              >
                <el-option
                  v-for="golfer in golferByInsurances"
                  :key="golfer.value"
                  :label="golfer.label"
                  :value="golfer.value"
                />
              </el-select>
            </div>
          </el-col>
          <el-col class="mb-2">
            <label>Chọn Teetime: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-row>
              <el-col :sm="12">
                <el-date-picker
                  v-model="datePlayed"
                  class="w-100"
                  type="date"
                  placeholder="Chọn ngày chơi"
                />
              </el-col>
              <el-col :sm="12">
                <el-time-select
                  v-model="timePlayed"
                  class="w-100"
                  :picker-options="timePickerOptions"
                  placeholder="Chọn giờ chơi"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col class="mb-2">
            <label>Chọn sân đánh: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-select
              v-model="facilityModel"
              class="w-100"
              filterable
              remote
              reserve-keyword
              placeholder="Nhập tên sân"
              :remote-method="onGetListFacilities"
              :loading="loadingSearchFacility"
            >
              <el-option
                v-for="facility in facilities"
                :key="facility.value"
                :label="facility.label"
                :value="facility"
              />
            </el-select>
          </el-col>
          <template v-if="paths.length > 0">
            <el-col class="mb-2">
              <label>Chọn gói bảo hiểm muốn mua: <span class="required">*</span></label>
              <div class="clearfix-5" />
              <el-select
                v-model="optionMoneyIdModel"
                class="w-100"
                placeholder="Chọn gói bảo hiểm muốn mua"
              >
                <el-option
                  v-for="item in prices"
                  :key="item.value"
                  class="option-insurance-prices"
                  :label="item.label"
                  :value="item"
                />
              </el-select>
            </el-col>
            <el-col class="mb-2">
              <label>Trạng thái gửi đơn sang PVI: <span class="required">*</span></label>
              <div class="clearfix-5" />
              <el-select v-model="postForm.is_pay" class="w-100" placeholder="Trạng thái gửi đơn PVI">
                <el-option
                  v-for="item in optionsPay"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col class="mb-2">
              <label>Ghi chú:</label>
              <div class="clearfix-5" />
              <el-input
                v-model="postForm.note"
                type="textarea"
                :rows="2"
                placeholder="Nội dung ghi chú"
              />
            </el-col>
            <el-col class="mb-2">
              <label>Chọn đại lý bán BH: <span class="required">*</span></label>
              <div class="clearfix-5" />
              <el-select
                v-model="postForm.agent_id"
                filterable
                remote
                class="w-100"
                placeholder="Chọn đại lý"
                :remote-method="onSearchAgent"
                :loading="loadingSearchAgent"
              >
                <el-option
                  v-for="agent in agentInsurance"
                  :key="agent.value"
                  :label="agent.label"
                  :value="agent.value"
                />
              </el-select>
            </el-col>
          </template>
        </el-col>
        <el-col :sm="18" class="pl-5">
          <view-info-insurance
            :object-insurance="objectInsurance"
            :object-path-one="postForm.path_id1"
            :object-path-two="pathModel2"
            @onClickButton="handleClickButton"
          />
        </el-col>
      </el-row>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy bỏ</el-button>
      <el-button type="primary" :loadin="loadingUpdate" @click="onSubmitUpdate">Cập nhật</el-button>
    </span>
  </el-dialog>

</template>
<script>
// import ViewInfoInsurance from './ViewInfoInsurance'
// import ButtonSendPvi from './ButtonSendPvi'
import BookingPaxResource from '@/api/BookingPax'
import ViewInfoInsurance from '@/views/booking/bill/components/ViewInfoInsurance.vue'
const bookingPaxResource = new BookingPaxResource()

const defaultForm = {
  user_id: '',
  name_tour: '',
  facility_id: '',
  path_id1: '',
  path_id2: '',
  date_played: '',
  options_member_id: '',
  options_money_id: '',
  total_pay: '',
  total_member: '',
  is_pay: 0,
  note: ''
}
const defaultOptionPay = [
  { value: 0, label: 'Chưa xác nhận gửi PVI' },
  { value: 1, label: 'Đã xác nhận gửi PVI' }
]
const defaultOptionCustomerPay = [
  { value: 0, label: 'Chưa thanh toán' },
  { value: 1, label: 'Đã thanh toán' }
]

const defaultOptionDebit = [
  { value: 0, label: 'Ghi nợ' },
  { value: 1, label: 'Đã trả' }
]
export default {
  name: 'DialogViewInsurance',
  components: {
    ViewInfoInsurance
    // ViewInfoInsurance
  },
  props: {
    objectInsurance: {
      type: Object,
      default: null
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loadingDialog: false,
      loadingSearchFacility: false,
      postForm: Object.assign({}, defaultForm),
      groups: [],
      facilities: [],
      paths: [],
      golfers: [],
      deleteMembers: [],
      prices: [],
      golferByInsurances: [],
      optionsMemberModel: {},
      optionMoneyIdModel: {},
      facilityModel: {},
      pathModel2: null,
      datePlayed: '',
      timePlayed: '',
      optionsPay: [...defaultOptionPay],
      optionsCustomerPay: [...defaultOptionCustomerPay],
      optionsDebit: [...defaultOptionDebit],
      timePickerOptions: {
        start: '04:00',
        step: '00:01',
        end: '21:00'
      },
      loadingUpdate: false,
      errorObject: {
        show: false,
        message: ''
      },
      userPermission: [],
      loadingSearchAgent: false,
      agentInsurance: []
    }
  },
  watch: {
    showDialog(value) {
      this.dialogVisible = value
    },
    optionsMemberModel(value) {
      this.postForm.options_member_id = value.value
      // this.$store.dispatch('setGroupID', value.value);
    },
    optionMoneyIdModel(value) {
      this.postForm.options_money_id = value.value
      // this.$store.dispatch('setMoneyID', value.value)
    },
    objectInsurance(value) {
      console.log('sssssssssssssss', value)
      if (Object.keys(value).length > 0) {
        this.loadingDialog = true
        this.postForm = Object.assign({}, value)
        // this.optionsMemberModel = this.groups.filter(group => value.options_member_id === group.value)[0];
        this.handleConvertDateTimePlayed(value.date_played)
        this.handleConvertFacility(value.facility_id, value.path_id1, value.path_id2)
        this.golferByInsurances.push({
          value: value.golfer.id,
          label: `VGA${value.golfer.id} - ${value.golfer.fullname}`
        })
        if (value.agent_id === 0) {
          value.agent_id = ''
        }
        if (value.agent) {
          const item = { label: `${value.agent.name} - ${value.agent.code_agent}`, value: value.agent.id }
          this.agentInsurance.push(item)
        }
      }
    },
    facilityModel(value) {
      this.paths = [...value.paths]
      this.postForm.facility_id = value.value
      this.onGetListPrices(this.postForm)
      if (this.paths.length > 1) {
        this.postForm.path_id1 = this.paths[0].id
        this.pathModel2 = this.paths[1].id
      }
    },
    pathModel2(value) {
      this.postForm.path_id2 = value
    },
    datePlayed(value) {
      const stringDate = this.handleConvertDatePlayed(value)
      this.postForm.date_played = `${stringDate} ${this.timePlayed}`
    },
    timePlayed(value) {
      const stringDate = this.handleConvertDatePlayed(this.datePlayed)
      this.postForm.date_played = `${stringDate} ${value}`
    }
  },
  created() {
    this.onGetListGroup()
    // this.handlePermission();
  },
  methods: {
    onSubmitUpdate() {
      this.loadingUpdate = true
      console.log('sssssssssss', this.postForm)
      bookingPaxResource.updateInsurance(this.postForm).then(response => {
        this.loadingUpdate = false
        const code = response.data.error_code
        switch (code) {
          case 1:
            this.$message.error(response.data.message)
            break
          case 2:
            this.errorObject.show = true
            this.errorObject.message = response.data.message
            break
          case 3:
            this.$message.error(response.data.message)
            this.$emit('onCloseDialog', { dialog: false, load: false })
            break
          default:
            this.$message.success(response.data.message)
            this.$emit('onCloseDialog', { dialog: true, load: true })
            break
        }
      })
    },
    onSearchGolferByInsurance(keyword) {
      this.handleSearchGolfers(keyword)
    },
    onSearchGolfer(keyword) {
      this.handleSearchGolfers(keyword, false)
    },
    handleSearchGolfers(keyword, isHot = true) {
      const params = { keyword: keyword }
      bookingPaxResource.getGolferByIdInsurance(params).then(response => {
        console.log(response)
        if (response.data.error_code === 0) {
          const result = response.data
          console.log(result)
          if (result.data.length > 0) {
            const array = []
            result.data.map(value => {
              const name = `vID${value.id} - ${value.fullname}-${value.nickname}`
              const item = { value: value.id, label: name }
              array.push(item)
            })
            if (isHot) {
              this.golferByInsurances = [...array]
            } else {
              this.golfers = [...array]
            }
          }
        }
      })
    },
    onGetListGroup() {
      const params = { }

      bookingPaxResource.getListsOptionsMember(params).then(response => {
        const results = response.data
        if (results.length > 0) {
          const array = []
          results.map(result => {
            const item = { label: result.text_display, value: result.id, group: result }
            array.push(item)
          })
          this.groups = [...array]
        } else {
          this.groups = []
        }
      })
    },
    onGetListFacilities(keyword) {
      const params = { title: keyword }
      this.loadingSearchFacility = true
      bookingPaxResource.getFacilityCanBuyInsurance(params).then(response => {
        this.loadingSearchFacility = false
        const results = response.data
        if (results.length > 0) {
          const array = []
          results.map(result => {
            const item = { label: result.sub_title, value: result.id, paths: result.paths }
            array.push(item)
          })
          this.facilities = [...array]
        } else {
          this.facilities = []
        }
      })
    },
    handleConvertFacility(facilityID, pathID1, pathID2) {
      const params = { facility_id: facilityID }
      bookingPaxResource.getFacilityCanBuyInsurance(params).then(response => {
        const result = response.data.data
        if (result) {
          const item = { label: result.sub_title, value: result.id, paths: result.paths }
          this.facilityModel = Object.assign({}, item)
          this.facilities.push(item)
          this.postForm.path_id1 = pathID1
          this.pathModel2 = pathID2
        }
      })
    },
    onGetListPrices(params) {
      const query = { action: 1, facility_id: params.facility_id }
      bookingPaxResource.getListsPriceByHoleInsurance(query).then(response => {
        const results = response.data.data
        const filteredArr = results.reduce((acc, current) => {
          const x = acc.find(item => item.reward_value === current.reward_value)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        }, [])
        // console.log(filteredArr);
        this.loadingDialog = false
        if (filteredArr.length > 0) {
          const array = []
          // const array2 = [];
          filteredArr.map(result => {
            const item = {
              label: `${result.text_display} - ${result.reward_value.toLocaleString()}`,
              value: result.id
            }
            array.push(item)
          })
          // results.map(result => {
          //   const item = { label: `${result.text_display} - ${result.reward_value.toLocaleString()}`, value: result.id };
          //   array2.push(item);
          // });
          this.prices = [...array]
          const objectMoney = array.filter(price => this.objectInsurance.options_money_id === price.value)[0]
          this.optionMoneyIdModel = Object.assign({}, objectMoney)
        }
      })
    },
    handleConvertDateTimePlayed(datePlayedString) {
      function pad(s) {
        return (s < 10) ? '0' + s : s
      }

      const d = new Date(datePlayedString.replace(/\s/, 'T'))
      this.datePlayed = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
      this.timePlayed = [pad(d.getHours()), pad(d.getMinutes())].join(':')
    },
    handleClose() {
      this.handleResetData()
      this.$emit('onCloseDialog', { dialog: true, load: true })
    },
    handleClickButton(value) {
      if (value) {
        this.$emit('onCloseDialog', { dialog: false, load: true })
      }
    },
    handleConvertDatePlayed(time) {
      const d = new Date(time)

      function pad(s) {
        return (s < 10) ? '0' + s : s
      }

      return [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
    },

    async onSearchAgent(keyword) {
      const params = { keyword: keyword }
      this.loadingSearchAgent = true
      const { data } = await bookingPaxResource.searchAgentNew(params)
      const array = []
      if (data.length > 0) {
        this.loadingSearchAgent = false
        data.map(value => {
          const item = { label: `${value.name} - ${value.code_agent}`, value: value.id }
          array.push(item)
        })
        this.agentInsurance = [...array]
        console.log(this.agentInsurance)
      } else {
        this.agentInsurance = []
      }
    },
    handleResetData() {
      this.facilities = []
      this.golfers = []
      this.deleteMembers = []
      this.prices = []
      this.arrayPath = []
      this.golferByInsurances = []
      this.pathModel2 = -1
      this.errorObject = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-edit-insurance {
  .clearfix-5 {
    height: 5px;
    clear: both;
  }

  .w-100 {
    width: 100%;
  }

  .mb-2 {
    margin-bottom: 10px;
  }

  .pl-5 {
    padding-left: 10px;
  }

  .warning-member {
    margin-bottom: 10px;
  }
}

.option-insurance-prices {
  // background-color: red;
}
</style>
