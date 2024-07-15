<template>
  <el-row v-loading="loading" class="info-insurance">
    <el-row class="mb-10">
      <el-col :sm="12">
        <label>Danh sách các hố bán HIO</label>
        <div class="clearfix-5" />
        <span class="text-bold">{{ stringHoleOne }}, {{ stringHoleTwo }}</span>
      </el-col>
      <el-col :sm="6">
        <label>Giá mua: </label>
        <div class="clearfix-5" />
        <span class="text-bold">{{ formatNumber(objectInsurance.total_pay) }} VNĐ</span>
      </el-col>
      <el-col :sm="6">
        <label>Người xử lý: </label>
        <div class="clearfix-5" />
        <template v-if="objectInsurance.admin">
          <el-tag>{{ objectInsurance.admin.name }}</el-tag>
        </template>
      </el-col>
    </el-row>
    <div class="clearfix-5" />
    <el-row v-if="objectInsurance.pvi">
      <!--            <el-col :sm="6">-->
      <!--                      <el-link type="success" :href="objectInsurance.pvi.URL" target="_blank"> <i class="el-icon-success"></i> Giấy chứng nhận bảo hiểm</el-link>-->
      <!--            </el-col>-->
      <el-col :sm="6">
        <el-link :href="`/#/certificate-new/${objectInsurance.id}`" target="_blank" style="color: #0000cc"> Xem chứng nhận</el-link>
      </el-col>
    </el-row>
    <el-row v-if="objectInsurance.is_send_pvi === 2 || objectInsurance.pvi === null">
      <el-col :sm="6">
        <el-link :href="`/#/certificate-new/${objectInsurance.id}`" target="_blank" style="color: #0000cc"> Xem chứng nhận</el-link>
      </el-col>
    </el-row>
    <div class="clearfix-10" />
    <el-col>
      <label>Thông tin chi tiết các golfer: </label>
      <div class="clearfix-5" />
      <template v-if="objectInsurance.status !== 1 && objectInsurance.is_send_pvi !== 1">
        <el-row>
          <el-col :sm="8">
            <el-col v-if="objectInsurance.status_debit !== 1" class="mb-2">
              <label>Chọn kiểu thêm golfer : <span class="required">*</span></label>
              <div class="clearfix-5" />
              <el-select v-model="typeChooseGolferSelect" class="w-100" placeholder="Chọn loại thêm golfer">
                <el-option
                  v-for="item in typeChooseOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col v-if="typeChooseGolferSelect === 1" class="mb-2">
              <div class="clearfix-5" />
              <el-row>
                <el-col class="mb-5">
                  <el-select
                    v-model="objectGolfer"
                    filterable
                    remote
                    class="w-100"
                    placeholder="Tìm kiếm theo tên hoặc mã vID"
                    :remote-method="onSearchGolfers"
                    @change="onSetGolferID"
                  >
                    <el-option
                      v-for="golfer in golfers"
                      :key="golfer.value"
                      :label="golfer.label"
                      :value="golfer"
                    />
                  </el-select>
                </el-col>
                <el-col class="text-right">
                  <el-button type="primary" :loading="loadingSubmit" @click="onAddGolfer()"> Thêm mới</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col v-if="typeChooseGolferSelect === 0" class="mb-2">
              <div class="clearfix-5" />
              <el-row style="padding-bottom: 10px">
                <el-col :sm="24">
                  <el-input
                    v-model="postForm.name_user"
                    type="text"
                    placeholder="Nhập họ và tên"
                  />
                </el-col>
              </el-row>
              <el-row style="padding-bottom: 10px">
                <el-col :sm="24">
                  <el-input
                    v-model="postForm.passport"
                    type="text"
                    placeholder="Nhập ID CCCD/Passport hoặc Ngày sinh"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col style="text-align: center">
                  <el-button :loading="loadingSubmit" type="primary" @click="onAddGolfer()">Xác nhận thông tin</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-col>
        </el-row>
      </template>
      <div class="clearfix-5" />
      <el-row>
        <label>Tìm kiếm người chơi</label>
        <div class="clearfix-5" />
        <el-col :sm="8">
          <el-select
            v-model="objectGolfer"
            filterable
            remote
            class="w-100"
            placeholder="Tìm kiếm theo tên hoặc mã vID"
            :remote-method="onSearchGolfers"
            @change="handleSelected"
          >
            <el-option
              v-for="golfer in golfers"
              :key="golfer.value"
              :label="golfer.label"
              :value="golfer"
            />
          </el-select>
        </el-col>
        <el-col :sm="6" class="text-center">
          <span>Số người tham gia giải đấu: <strong>{{ total }} golfer</strong> </span>
        </el-col>
        <el-col :sm="10" class="text-right">
          <el-button type="info" icon="el-icon-refresh" @click="onResetQuery"> Làm mới</el-button>
        </el-col>
      </el-row>
      <div class="clearfix-5" />
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="STT"
          :index="handleSetStt"
          width="50"
        />
        <el-table-column
          label="Mã vID"
        >
          <template slot-scope="scope">
            vID{{ scope.row.user_id }}
          </template>
        </el-table-column>
        <el-table-column
          label="Họ Tên"
        >
          <template slot-scope="scope">
            <!--                        <template v-if="scope.row.passport && scope.row.passport.is_confirm === 1 && scope.row.certificate">-->
            <template v-if="scope.row.golfer ">
              {{ scope.row.golfer.fullname }}
            </template>
            <template v-else-if="scope.row.name && scope.row.user_id!== -1">
              {{ scope.row.name.fullname }}
            </template>

            <template v-else-if="scope.row.name_user">
              {{ scope.row.name_user }}
            </template>
            <template v-else>
              <span class="warning-passport"><i class="el-icon-warning" /> Cập nhật định danh</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="golfer.nickname"
          label="Nickname"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.golfer">
              {{ scope.row.golfer.nickname }}
            </template>
            <template v-else-if="scope.row.certificate">
              {{ scope.row.certificate.nickname }}
            </template>
            <template v-else>
              <span class="warning-passport"><i class="el-icon-warning" /> Cập nhật định danh</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="CMND/PASSPORT OR Birthday"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.passports && scope.row.passports.is_confirm === 1">
              <span class="success-passport"><i class="el-icon-success" /> Đã cập nhật</span>
            </template>
            <template v-else-if="scope.row.passport"> {{ scope.row.passport }}</template>
            <template v-else>
              <span class="warning-passport"><i class="el-icon-warning" /> Chưa cập nhật</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="Action"
        >
          <template slot-scope="scope">
            <template v-if="objectInsurance.status !== 1 && objectInsurance.is_send_pvi !== 1">
              <el-popover
                ref="popover"
                placement="bottom"
                title="Thay đổi golfer"
                width="400"
                trigger="click"
              >
                <el-row>
                  <el-col class="mb-5">
                    <!--                    <search-golfer @getObjectGolfer="onSetGolferID" />-->
                  </el-col>
                  <el-col class="text-right">
                    <el-button type="primary" :loading="loadingSubmit" @click="onChangeGolfer(scope.row)"> Xác nhận</el-button>
                  </el-col>
                </el-row>
                <el-button slot="reference" type="info" icon="el-icon-refresh" circle />
              </el-popover>
              <template v-if="!scope.row.passports && !scope.row.name">
                <el-popover
                  placement="bottom"
                  title="Cập nhật định danh cho Golfer"
                  width="400"
                  trigger="click"
                >
                  <el-row>
                    <el-col class="mb-5">
                      <el-input ref="nameOutInput" v-model="postFormNameInsuranceOut.fullname" placeholder="Họ và tên" />
                    </el-col>
                    <el-col class="text-right">
                      <el-button type="primary" :loading="loadingUpdateName" @click="onAddNameInsuranceOut(scope.row)"> Xác nhận</el-button>
                    </el-col>
                  </el-row>
                  <el-button slot="reference" type="primary" icon="el-icon-edit" circle />
                </el-popover>
              </template>
              <template v-if="objectInsurance.is_send_pvi !== 1">
                <el-button type="danger" icon="el-icon-delete" circle @click="onDeleteMember(scope.row)" />
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getListMember" />
    </el-col>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatNumber, setArraySelect } from '@/utils/convert'
import {
  convertSourceBuyToString
} from '@/utils/insurance/convertNumberToString'
// import ViewImportFileExcel from './ViewImportFileExcel'
// import SearchGolfer from '../../../components/SearchGolfer/index'
import BookingPaxResource from '@/api/BookingPax'

const bookingPaxResource = new BookingPaxResource()

const defaultForm = {
  user_id: '',
  id: '',
  user_buy_insurance_id: '',
  passport: '',
  name_user: ''
}
const defaultFormNameInsuranceOut = {
  user_id: '',
  fullname: ''
}
const typeChooseOption = [
  {
    value: 0,
    label: 'ID căn cước công dân hoặc Passport'
  },
  {
    value: 1,
    label: 'Mã vID'
  }
]
export default {
  name: 'ViewInfoInsurance',
  components: {
    // SearchGolfer,
    // ViewImportFileExcel,
    Pagination },
  props: {
    objectInsurance: {
      type: Object,
      default: null
    },
    objectPathOne: Number,
    objectPathTwo: Number
  },
  data() {
    return {
      loading: false,
      loadingTable: false,
      loadingUpdateName: false,
      arrayHoleHIO: [],
      tableData: [],
      imageDefault: 'https://staging-api-s3.golfervn.com/images/av.png',
      stringHoleOne: '',
      stringHoleTwo: '',
      total: 0,
      from: 1,
      ids: [],
      listQuery: {
        limit: 10,
        page: 1,
        action: 2
      },
      postForm: Object.assign({}, defaultForm),
      postFormNameInsuranceOut: Object.assign({}, defaultFormNameInsuranceOut),
      loadingSubmit: false,
      isDisabled: false,
      clearData: false,
      typeChooseOption: typeChooseOption,
      typeChooseGolferSelect: '',
      passport: '',
      objectGolfer: {},
      golfers: []

    }
  },
  watch: {
    typeChooseGolferSelect(value) {
      console.log(value)
    },
    objectInsurance(value) {
      if (value) {
        this.getListMember()
      }
    },
    objectPathOne(value) {
      if (value !== 0) {
        this.onGetHoleBuyHIO(value, 1)
      }
    },
    objectPathTwo(value) {
      if (value !== -1) {
        this.onGetHoleBuyHIO(value, 2)
      }
    }
  },
  created() {
    this.getListMember()
  },
  methods: {
    setArraySelect,
    onSearchGolfers(keyword) {
      const params = { keyword: keyword }
      bookingPaxResource.getGolferByIdInsurance(params).then(response => {
        if (response.error_code === 0) {
          const result = response.data
          if (result.data.length > 0) {
            const array = this.setArraySelect(result.data)
            this.golfers = [...array]
          }
        }
      })
    },
    handleSelected(golfer) {
      this.listQuery.user_id = golfer.value
      this.getListMember()
    },
    onAddNameInsuranceOut(row) {
      this.postFormNameInsuranceOut.user_id = row.user_id
      if (this.postFormNameInsuranceOut.fullname === '' && this.postFormNameInsuranceOut.fullname === undefined) {
        this.$message.warning('Vui lòng nhập tên định danh cho golfer!')
        this.$refs.nameOutInput.focus()
      } else {
        this.loadingUpdateName = true
        bookingPaxResource.onCreateUserNameInsuranceOut(this.postFormNameInsuranceOut).then(response => {
          if (response.error_code === 0) {
            this.loadingUpdateName = false
            this.$message.success(response.message)
            this.getListMember()
          } else {
            this.$message.error(response.message)
          }
        })
      }
    },
    onDeleteMember(row) {
      // this.$confirm(`Bạn có chắc chắn muốn xóa Golfer ${row.golfer.fullname} - VGA${row.golfer.id}?`).then(_ => {
      this.$confirm(`Bạn có chắc chắn muốn xóa Golfer có vID${row.user_id}?`).then(_ => {
        const data = { id: row.id, user_buy_insurance_id: this.objectInsurance.id }
        bookingPaxResource.onDeleteMemberInsurance(data).then(response => {
          const code = response.error_code
          switch (code) {
            case 1:
              this.$message.error(response.message)
              break
            case 2:
              this.$message.warning(response.message)
              break
            default:
              this.$message.success(response.message)
              this.getListMember()
              break
          }
        })
      }).catch(_ => {})
    },
    onAddGolfer() {
      this.postForm.user_buy_insurance_id = this.objectInsurance.id
      // this.postForm.options_member_id = this.$store.getters.options_member_id;
      this.postForm.options_member_id = 6
      this.postForm.options_money_id = this.objectInsurance.options_money_id
      this.handleUpdateOrCreateMember()
    },
    onChangeGolfer(row) {
      this.postForm.user_buy_insurance_id = this.objectInsurance.id
      this.postForm.id = row.id
      // this.postForm.options_member_id = this.$store.getters.options_member_id;
      this.postForm.options_member_id = 6
      this.postForm.options_money_id = this.objectInsurance.options_money_id
      this.handleUpdateOrCreateMember()
    },
    handleUpdateOrCreateMember() {
      this.loadingSubmit = true
      console.log(this.postForm)
      bookingPaxResource.onUpdateOrCreateMember(this.postForm).then(response => {
        this.loadingSubmit = false
        const code = response.data.error_code
        switch (code) {
          case 0:
            this.getListMember()
            this.$emit('onClickButton', true)
            this.$message.success(response.data.message)
            break
          case 1:
            this.$message.error(response.data.message)
            break
          case 2:
            this.$message.warning(response.data.message)
            break
          default:
            break
        }
        this.postForm = Object.assign({}, defaultForm)
      })
    },
    onSetGolferID(golfer) {
      console.log(golfer)
      this.postForm.user_id = golfer.value
    },
    getValuePass(value) {
      // const passport = this.postForm.value_user;
      console.log(value)
    },
    onSearchMember(golfer) {
      this.listQuery.user_id = golfer.value
      this.getListMember()
    },
    onResetQuery() {
      this.listQuery = Object.assign({}, { page: 1, limit: 10, action: 2 })
      this.getListMember()
      this.handleClearFormSearch()
    },
    onGetHoleBuyHIO(pathID, typePath = 1) {
      const params = { path_id: pathID }
      bookingPaxResource.onGetHoleSelectInsurance(params).then(response => {
        const result = response.data.data
        console.log(result)

        if (result.length > 0) {
          const array = []
          result.map(value => {
            const item = `${value.hole.stt}${value.hole.path_name} - Par ${value.hole.par}`
            array.push(item)
          })
          if (typePath === 1) {
            this.stringHoleOne = array.join(',')
          } else {
            this.stringHoleTwo = array.join(',')
          }
        }
      })
    },
    getListMember() {
      this.loadingTable = true
      const params = Object.assign(this.listQuery, { insurance_id: this.objectInsurance.id })
      bookingPaxResource.onGetMemberInsurance(params).then(response => {
        this.loadingTable = false
        if (response.error_code === 0) {
          const result = response.data.data
          this.from = result.from
          this.total = result.total
          // console.log(this.total);
          this.tableData = [...result.data]
        } else {
          this.tableData = []
        }
      })
    },
    onReloadListMember() {
      this.getListMember()
    },
    handleSetTotal() {
      this.total = this.golfers.length
    },
    handleSetStt(index) {
      return this.from + index
    },
    handleClearFormSearch() {
      this.clearData = true
      setTimeout(() => {
        this.clearData = false
      }, 2000)
    },
    formatNumber,
    convertSourceBuyToString
  }
}
</script>

<style lang="scss">
.info-insurance {
  .clearfix-5 {
    height: 5px;
    clear: both;
  }

  .info-golfer {
    .image-avatar {
      overflow: hidden;
      height: 90px;
      width: 90px;
      margin: 0 auto;
      border-radius: 50%;
    }
  }

  .title-golfer-not-passport {
    font-style: italic;

    i {
      color: #ff0000;
    }
  }

  .text-right {
    text-align: right;
  }

  .pr-5 {
    padding-right: 5px;
  }

  .warning-passport {
    color: #aa5d00;

    i {
      color: #ff0000;
    }
  }

  .success-passport {
    i {
      color: #67c23a;
    }
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  .text-bold {
    font-weight: 700;
  }

  .pl-5 {
    padding-left: 10px;
  }

  .w-100 {
    width: 100%;
  }
}
</style>
