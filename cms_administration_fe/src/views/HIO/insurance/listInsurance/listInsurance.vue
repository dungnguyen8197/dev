<template>
  <el-row class="insurance-lists">
    <el-row class="insurance-lists__header">
      <el-col :sm="12">
        <h3>Danh sách bảo hiểm  </h3>
      </el-col>
      <el-col :sm="12">
        <!--        <div class="text-right pt-10">-->
        <!--          <el-button type="primary" icon="el-icon-plus" @click="showDialogCreate = true"> Thêm mới</el-button>-->
        <!--        </div>-->
        <div class="text-right">
          <el-button type="danger" @click="onClickRemoveHold"> Gạch nợ danh sách đã chọn</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="insurance-lists__search mb-5">
      <el-col :sm="3" class="pr-lg-2">
        <div class="search-golfer">
          <el-input v-model="listQuery.id" placeholder="Nhập mã bảo hiểm" class="w-100" />
        </div>
      </el-col>
      <el-col :sm="3" class="pr-lg-2">
        <el-select
          v-model="listQuery.agent_id"
          filterable
          remote
          class="w-100"
          placeholder="Tìm đại lý"
          :remote-method="onSearchAgent"
        >
          <el-option
            v-for="agent in agents"
            :key="agent.value"
            :label="agent.label"
            :value="agent.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="pr-lg-2">
        <el-select
          v-model="listQuery.facility_id"
          filterable
          remote
          class="w-100"
          placeholder="Tìm theo sân"
          :remote-method="onGetListFacilities"
        >
          <el-option
            v-for="facility in facilities"
            :key="facility.value"
            :label="facility.label"
            :value="facility.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="5" class="pr-lg-2">
        <el-select
          v-model="listQuery.source_buy"
          class="w-100"
          placeholder="Lọc theo nguồn"
        >
          <el-option
            v-for="item in arraySource"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="5" class="pr-lg-2">
        <el-switch
          v-model="isDatePlayed"
          :active-text="titleIsDatePlayed"
        />
      </el-col>
    </el-row>
    <el-row class="form-search">
      <el-col :sm="2" class="pr-lg-2">
        <div class="search-golfer">
          <el-input v-model="listQuery.user_id" placeholder="Nhập mã vID" class="w-100" />
        </div>
      </el-col>
      <el-col :sm="2" class="pr-lg-2">
        <el-select
          v-model="listQuery.status_debit"
          class="w-100"
          placeholder="Bảo hiểm nợ"
        >
          <el-option
            v-for="debit in arrayInsuranceDebt"
            :key="debit.value"
            :label="debit.label"
            :value="debit.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="pr-lg-2">
        <el-select
          v-model="listQuery.is_pay"
          class="w-100"
          placeholder="TT thanh toán"
        >
          <el-option
            v-for="item in arrayIsPay"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="pr-lg-2">
        <el-select
          v-model="listQuery.status"
          class="w-100"
          placeholder="TT phản hồi từ PVI"
        >
          <el-option
            v-for="status in arrayStatus"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="6">
        <el-date-picker
          v-model="dateRange"
          class="date-rang-history"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :picker-options="pickerOptions"
        />
      </el-col>
      <el-col :sm="6">
        <div class="text-right">
          <!--          <el-button-->
          <!--            type="primary"-->
          <!--            icon="el-icon-download"-->
          <!--            :loading="loadingExportExcel"-->
          <!--            @click="onExportInsurance"-->
          <!--          >Xuất excel-->
          <!--          </el-button>-->
          <el-button icon="el-icon-refresh" @click="onResetQuery"> Làm mới</el-button>
          <el-button type="primary" icon="el-icon-search" @click.prevent="onGetListInsurances(1)"> Tìm kiếm
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="table-history">
      <el-col>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            :index="handleIndexMethod"
            label="STT"
            width="50"
          />
          <el-table-column
            label="Mã BH"
          >
            <template slot-scope="scope">
              {{ `BH${scope.row.id}` }}
            </template>
          </el-table-column>
          <el-table-column
            label="Đại lý"
          >
            <template slot-scope="scope">
              {{ (scope.row.agent) ? scope.row.agent.name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name_tour"
            label="Tên giải đấu"
          />
          <el-table-column prop="facility.sub_title" label="Tên Sân" />
          <el-table-column label="Mã vID/Passport">
            <template slot-scope="scope">
              <p> {{ `vID${scope.row.user_id}` }}</p>
            </template>
          </el-table-column>
          <el-table-column label="Gói BH">
            <template slot-scope="scope">
              <template v-if="scope.row.money.reward_value === 100000000 ">
                <p>D100</p>
              </template>
              <template v-if="scope.row.money.reward_value === 300000000 ">
                <p>D300</p>
              </template>
              <template v-if="scope.row.money.reward_value === 400000000 ">
                <p>D400</p>
              </template>
              <template v-if="scope.row.money.reward_value === 500000000 ">
                <p>D500</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 200000000">
                <p>D200</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 50000000 ">
                <p>D50</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 20000000">
                <p>D20</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 46000000 ">
                <p>F10</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 92000000 ">
                <p>F20</p>
              </template>
              <template v-else />
            </template>
          </el-table-column>
          <el-table-column label="Giá mua">
            <template slot-scope="scope">
              {{ (scope.row.money) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="date_played" label="Ngày chơi" />
          <el-table-column label="Ngày Tạo" prop="created_at" />
          <el-table-column prop="time_pay" label="Ngày thanh toán" />
          <el-table-column label="Trạng thái khách thanh toán">
            <template slot-scope="scope">
              <el-col class="mb-5">
                <div v-if="scope.row.is_customer_pay === 0">
                  <el-tag type="danger">Ghi nợ</el-tag>
                  <p>{{ (scope.row.money) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}</p>
                </div>
                <!--                                <p>Đã thanh toán</p>-->
                <el-tag v-if="scope.row.is_customer_pay === 1" type="success">
                  <template v-if="scope.row.sale">
                    {{ `Người xử lý: ${scope.row.sale.name}` }}
                  </template>
                </el-tag>
                <el-tag v-if="scope.row.is_customer_pay === 1" type="success">
                  {{ `Ngày xác nhận: ${scope.row.updated_at}` }}
                </el-tag>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái">
            <template slot-scope="scope">
              <el-tag :type="(scope.row.is_pay === 0 ? 'info' : 'success')">
                {{ convertIsPayToString(scope.row.is_pay) }}
              </el-tag>
              <el-tag :type="convertIsSendPviToString(scope.row.is_send_pvi).className">
                {{ convertIsSendPviToString(scope.row.is_send_pvi).text }}
              </el-tag>
              <el-tag>{{ convertSourceBuyToString(scope.row.source_buy) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Người xử lý">
            <template slot-scope="scope">
              <template v-if="scope.row.dcard">
                <el-tag type="info">{{ scope.row.dcard.serial }}</el-tag>
              </template>
              <template v-else-if="scope.row.admin">
                <el-tag type="info">{{ scope.row.admin.name }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú">
            <template slot-scope="scope">
              {{ (scope.row.note) }}
            </template>
          </el-table-column>
          <el-table-column label="Hành động">
            <template slot-scope="scope">
              <template v-if="scope.row.status === 1 && scope.row.is_verify === 0">
                <el-button
                  :loading="loadingUpdateVerify"
                  size="small"
                  type="info"
                  icon="el-icon-check"
                  circle
                />
              </template>
              <template v-if="scope.row.is_pay === 1">

                <template v-if="scope.row.is_send_pvi === 0">
                  <button-send-pvi
                    :object-insurance="scope.row"
                    @onReloadData="handleReloadData"
                  />
                </template>
                <template v-if="scope.row.is_send_pvi === 2">
                  <button-cancel-send-pvi
                    :object-insurance="scope.row"
                    @onReloadData="handleReloadData"
                  />
                </template>
              </template>
              <!--              <template v-if="userPermission === 'AdminDevelop' && scope.row.is_pay === 0">-->
              <!--                <el-button-->
              <!--                  size="small"-->
              <!--                  type="danger"-->
              <!--                  icon="el-icon-delete"-->
              <!--                  circle-->
              <!--                  @click="onRemoveInsurance(scope.row)"-->
              <!--                />-->
              <!--              </template>-->
              <el-button
                size="small"
                :title="`Sửa giao dịch  ${scope.row.name}`"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="onShowDialogDetail(scope.row)"
              />
              <!--              <template v-if="scope.row.is_pay === 0">-->
              <!--                <el-button-->
              <!--                  size="small"-->
              <!--                  :title="`Tạo code thanh toán`"-->
              <!--                  type="warning"-->
              <!--                  icon="el-icon-plus"-->
              <!--                  circle-->
              <!--                  @click="onCreateCodePay(scope.row)"-->
              <!--                />-->
              <!--              </template>-->
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="45"
          />
        </el-table>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetListInsurances"
        />
      </el-col>
    </el-row>
    <dialog-view-insurance
      :show-dialog="showDialogDetail"
      :object-insurance="objectInsurance"
      @onCloseDialog="handleCloseDialogViewDetail"
    />

    <!--    <dialog-create-insurance18-hole-->
    <!--      v-if="isFacility18Hole"-->
    <!--      :show-dialog="showDialogCreate"-->
    <!--      @onCloseDialogCreate="handleCloseDialogCreate"-->
    <!--    />-->
    <!--    <dialog-create-insurance-->
    <!--      v-else-->
    <!--      :show-dialog="showDialogCreate"-->
    <!--      @onCloseDialogCreate="handleCloseDialogCreate"-->
    <!--    />-->
    <!--    <dialog-create-code-pay-->
    <!--      :show-dialog="isCreateLogCodePay"-->
    <!--      :object-insurance="objectInsurance"-->
    <!--      :object-codedata="objectCodeData"-->
    <!--      @onCloseDialog="handleCloseDialogCreateCode"-->
    <!--    />-->
    <!--    <dialog-show-history-code-pay-->
    <!--      :show-dialog="isShowLogCodePay"-->
    <!--      :object-insurance="objectInsurance"-->
    <!--      @onCloseDialog="handleCloseDialogViewCodePay"-->
    <!--    />-->
  </el-row>
</template>
<script>
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/dateRangOptions'
import { convertDate, formatNumber, convertDateTime } from '@/utils/convert'
import {
  convertIsPayToString,
  convertSourceBuyToString,
  convertIsSendPviToString,
  convertSourcePayToString
} from '@/utils/insurance/convertNumberToString'

import InsuranceApi from '@/api/HIO/insurance'
import { getAcountInfo } from '@/utils/auth'
import ButtonSendPvi from '@/views/HIO/insurance/listInsurance/component/ButtonSendPvi.vue'
import ButtonCancelSendPvi from '@/views/HIO/insurance/listInsurance/component/ButtonCancelSendPvi.vue'
const insuranceApi = new InsuranceApi()
import BookingPaxResource from '@/api/BookingPax'
import DialogViewInsurance from '@/views/HIO/insurance/listInsurance/component/DialogViewInsurance.vue'
const bookingPaxResource = new BookingPaxResource()

const defaultQuery = {
  page: 1,
  name: '',
  limit: 10
}
const arrayisPay = [
  { value: 0, label: 'Chưa thanh toán' },
  { value: 1, label: 'Đã thanh toán' }
]
const arrayStatus = [
  { value: 1, label: 'Đã nhận phản hồi PVI' },
  { value: 2, label: 'Đang chờ phản hồi' }
]
const arrayInsuranceDebt = [
  { value: 1, label: 'Đã trả ' },
  { value: 2, label: 'Ghi nợ' },
  { value: 3, label: 'Công nợ' }
]
const arraySource = [
  { value: 1, label: 'App ' },
  { value: 2, label: 'Sport' },
  { value: 3, label: 'Booking' },
  { value: 4, label: 'Agent' }
  // { value: 6, label: 'Zalo' },
  // { value: 5, label: 'Auto add' }
]
export default {
  name: 'ListInsurances',
  components: {
    DialogViewInsurance,
    // DialogViewInsurance,
    ButtonCancelSendPvi,
    ButtonSendPvi,
    Pagination
    // DialogShowHistoryCodePay,
    // DialogCreateCodePay
  },
  data() {
    return {
      value: [],
      listQuery: Object.assign({}, defaultQuery),
      dateRange: [],
      pickerOptions: {
        shortcuts: pickerOptions
      },
      tableData: [],
      agents: [],
      loading: false,
      loadingUpdateVerify: false,
      total: 0,
      from: 0,
      showDialogDetail: false,
      showDialogCreate: false,
      objectInsurance: {},
      objectCodeData: {},

      arrayIsPay: [...arrayisPay],
      arrayStatus: [...arrayStatus],
      arrayInsuranceDebt: [...arrayInsuranceDebt],
      arraySource: [...arraySource],
      timer: null,
      loadingExportExcel: false,
      isFacility18Hole: true,
      isDatePlayed: false,
      titleIsDatePlayed: 'Tìm kiếm theo ngày khởi tạo',
      nameAgent: '',
      listQueryRefund: Object.assign({}),
      objectRefund: [],
      userPermission: [],
      roleUser: this.$store.getters.roles,
      isShowLogCodePay: false,
      isCreateLogCodePay: false,
      facilities: [],
      valuePublic: [],
      changeStatus: []
      // countInsuranceDebit: 0,
      // countInsuranceNotPay: 0,
    }
  },
  watch: {
    dateRange(value) {
      if (value !== null) {
        this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD')
        this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD')
      } else {
        this.listQuery.date_star = null
        this.listQuery.date_end = null
      }
    },
    isDatePlayed(value) {
      if (value) {
        this.listQuery.is_date_played = 1
        this.titleIsDatePlayed = 'Tìm kiếm theo ngày chơi'
      } else {
        this.listQuery.is_date_played = 0
        this.titleIsDatePlayed = 'Tìm kiếm theo ngày khởi tạo'
      }
    }
  },
  created() {
    this.onGetListInsurances()
    // this.timer = setInterval(this.onGetListInsurances, 30000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onClickRemoveHold() {
      this.$confirm('Bạn có chắc chắn muốn thực hiện thao tác này').then(_ => {
        const array = []
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.map(item => {
            array.push(item.id)
          })
          insuranceApi.changeStatusCustomerPayAll({ ids: array, admin_id: getAcountInfo().id }).then(response => {
            if (response.error_code === 0) {
              this.$message.success(response.message)
              this.onGetListInsurances()
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          this.$message.warning('Vui lòng chọn bảo hiểm để gạch nợ')
        }
      }).catch(_ => {})
    },
    onGetListInsurances(e) {
      if (e === 1) {
        this.listQuery.page = 1
      }
      const data = {
        cms_id: getAcountInfo().id
      }
      this.loading = true
      insuranceApi.listInsurance({ ...data, ...this.listQuery }).then(response => {
        console.log('aaaaaaaaaaaaaaaaaaa', response)
        if (response.error_code === 0) {
          this.loading = false
          const result = response.data.data
          this.tableData = [...result.data]
          this.total = result.total
          this.from = result.from
          const array = []
          result.data.map((value, key) => {
            if (value.is_customer_pay === 1) {
              array[key] = true
            } else {
              array[key] = false
            }
          })
          this.changeStatus = [...array]
        }
      })
    },
    changeStatusCustomerPay(index, id, status) {
      this.$confirm(`Bạn có chắc chắn xác nhận thanh toán BH`).then(_ => {
        const params = { id: id, is_customer_pay: status }
        insuranceApi.changeStatusCustomerPay(params, { id: id }).then(response => {
          if (response.error_code === 0) {
            this.$message.success(response.message)
          } else {
            this.$message.warning(response.message)
            this.$set(this.changeStatus, index, !this.changeStatus[index])
          }
        })
      }).catch((error) => {
        console.log('error_catch', error)
        this.$set(this.changeStatus, index, !this.changeStatus[index])
      })
    },
    // onRemoveInsurance(row) {
    //   this.$confirm(`Bạn có chắc chắn muốn xóa giải đấu ${row.name_tour}?`).then(_ => {
    //     this.$store.dispatch('deleteUserByInsurance', row.id).then(response => {
    //       const code = response.error_code
    //       switch (code) {
    //         case 1:
    //           this.$message.error(response.message)
    //           break
    //         case 2:
    //           this.$message.warning(response.message)
    //           break
    //         default:
    //           this.$message.success(response.message)
    //           this.onGetListInsurances()
    //           break
    //       }
    //     })
    //   }).catch(_ => {
    //   })
    // },
    handleCloseDialogCreate(value) {
      this.showDialogCreate = false
      if (value) {
        this.onGetListInsurances()
      }
    },
    onShowDialogDetail(row) {
      this.showDialogDetail = true
      this.objectInsurance = Object.assign({}, row)
    },
    handleCloseDialogViewDetail(value) {
      if (value.dialog) {
        this.showDialogDetail = false
      }
      if (value.load) {
        this.onGetListInsurances()
      }
    },
    handleReloadData() {
      this.onGetListInsurances()
    },
    onResetQuery() {
      this.listQuery = Object.assign({}, defaultQuery)
      this.isDatePlayed = false
      this.dateRange = null
      this.onGetListInsurances()
    },
    // async onSearchAgent(keyword) {
    //   const params = { keyword: keyword }
    //   const { data } = await SearchAgentResource.list(params)
    //   const array = []
    //   if (data.length > 0) {
    //     data.map(value => {
    //       const item = { label: `${value.name} - ${value.code_agent}`, value: value.id }
    //       array.push(item)
    //     })
    //   }
    //   this.agents = [...array]
    // },
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
        this.agents = [...array]
        console.log(this.agentInsurance)
      } else {
        this.agents = []
      }
    },
    onUpdateIsVerify(row) {
      this.loadingUpdateVerify = true
      const params = { id: row.id }
      this.$store.dispatch('updateIsVerifyInsurance', params).then(response => {
        this.loadingUpdateVerify = false
        if (response.error_code === 0) {
          this.$message.success(response.message)
          this.onGetListInsurances()
        } else {
          this.$message.error(response.message)
        }
      })
    },

    handleIndexMethod(index) {
      return this.from + index
    },
    // handlePermission() {
    //   const fromDb = undefined
    //   const arrPermission = fromDb || []
    //   this.roleUser.map(function(element) {
    //     if (element === 'AdminSport' || element === 'AdminDevelop') {
    //       arrPermission[0] = element
    //     }
    //   })
    //   this.userPermission = arrPermission[0]
    // },
    onCreateCodePay(row) {
      this.isCreateLogCodePay = true
      this.objectInsurance = Object.assign({}, row)
    },
    onShowHistoryCodePay(row) {
      this.isShowLogCodePay = true
      this.objectInsurance = Object.assign({}, row)
    },
    handleCloseDialogCreateCode(value) {
      this.isCreateLogCodePay = false
      if (value) {
        this.onGetListInsurances()
      }
    },
    handleCloseDialogViewCodePay(value) {
      this.isShowLogCodePay = false
    },
    onGetListFacilities(keyword) {
      const params = { title: keyword }
      this.loadingSearchFacility = true
      bookingPaxResource.getFacilityCanBuyInsurance(params).then(response => {
        console.log('sssssssssss', response)
        this.loadingSearchFacility = false
        const results = response.data.data
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
    convertDate,
    formatNumber,
    convertDateTime,
    convertIsPayToString,
    convertSourceBuyToString,
    convertIsSendPviToString,
    convertSourcePayToString
  }
}
</script>

<style lang="scss">
.insurance-lists {
  margin: 0 10px;

  .form-search {
    margin-bottom: 10px;
  }

  .hidden {
    display: none;
  }

  .mb-1 {
    margin-bottom: 5px;
  }

  .text-right {
    text-align: right;
  }

  .date-rang-history {
    width: 100%;
  }

  .w-100 {
    width: 100%;
  }

  .el-button + {
    .el-button {
      margin-left: 0;
    }
  }
}
</style>
