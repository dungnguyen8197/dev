<template>
  <el-row class="main-content">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h1 style="margin: 0; width: 100%; padding: 10px; text-align: center;">Danh sách Golfer</h1>
      </el-col>
    </el-row>

    <el-row class="filter-container">
      <el-col :sm="3" class="mr-10">
        <label>Tìm kiếm theo vID:</label>
        <el-select
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
            :label="item.fullname + ' - ' + 'mã gốc ' + (item.id) + '-' + 'mã hiển thị ' + (item.id_display)"
            :value="item._id"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="mr-10">
        <label> Hạng thành viên:</label>
        <el-select v-model="typeAccount" class="select-status w-100" placeholder="Hạng thành viên">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="mr-10">
        <label>Tìm kiếm loại tài khoản:</label>
        <el-select v-model="typeMembership" class="select-status w-100" placeholder="Loại tài khoản">
          <el-option
            v-for="item in optionsMembership"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="mr-10">
        <label>Tìm kiếm theo loại golfer:</label>
        <el-select v-model="listQuery.is_pro_player" class="select-status w-100 pr-10" placeholder="Loại Golfer">
          <el-option
            v-for="item in optionsPlayer"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="mr-10">
        <label>Tìm kiếm số điện thoại:</label>
        <el-input
          v-model="listQuery.phone"
          placeholder="Số điện thoại"
        />
      </el-col>
      <el-col :sm="4">
        <label>Tìm kiếm giới tính:</label>
        <el-select
          v-model="listQuery.gender"
          placeholder="Giới tính"
        >
          <el-option
            v-for="level in arrayGender"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row class="filter-container">
      <el-col :sm="6" class="mr-2 mb-1">
        <label>Tìm kiếm theo ngày sinh:</label>
        <el-date-picker
          v-model="dateRange"
          class="date-rang-history"
          type="daterange"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
        />
      </el-col>
      <el-col :sm="5" class="mr-2 mb-1">
        <label>Tìm kiếm theo năm sinh:</label>
        <el-date-picker
          v-model="yearBirthday"
          type="year"
          placeholder="Pick a year"
        />
      </el-col>

      <el-col :sm="6">
        <label />
        <div class="pt-2">
          <el-button icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
          <el-button type="primary" icon="el-icon-search" @click="onGetListsGolfer(1)">Tìm kiếm</el-button>
          <el-button
            type="primary"
            icon="el-icon-download"
            :loading="loadingExportExcel"
            @click="handleDownload"
          >
            Export excel
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="list-golfer">
      <el-col :sm="24">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            label="STT"
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            label="Tên golfer"
          >
            <template slot-scope="scope">
              <b>{{ `${scope.row.fullname}` }}</b>
            </template>
          </el-table-column>
          <el-table-column
            label="Mã vID gốc"
          >
            <template slot-scope="scope">
              {{ `vID${scope.row.id}` }}
            </template>
          </el-table-column>
          <el-table-column
            label="Mã vID hiển thị"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.id_display !== null">{{ `vID${scope.row.id_display}` }}</template>
              <template v-else>{{ `vID${scope.row.id}` }}</template>
            </template>
          </el-table-column>
          <el-table-column
            label="Hạng thành viên"
          >
            <template slot-scope="scope">
              <el-tag
                :type="convertMembership(scope.row.allow_using_scorecard_image).className"
              >
                {{ convertMembership(scope.row.allow_using_scorecard_image).text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="Thời hạn thành viên"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.expried_time > dateC">{{
                convertDateTimeSecond(scope.row.expried_time)
              }}
              </template>
              <template v-if="scope.row.expried_time <= dateC">
                <el-tag type="danger">Hết hạn</el-tag>
              </template>
              <template v-if="scope.row.expried_time === null" type="primary">
                <el-tag>Chưa gia hạn</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Loại Player">
            <template slot-scope="scope">
              <p class="wrap-text" @click="handleSetDataPlayer(scope.row.is_pro_player)">
                {{ convertIsProPlayer(scope.row.is_pro_player).text }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="loại tài khoản"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.type_user_old">
                <p
                  v-if="scope.row.type_user_old"
                  class="wrap-text"
                >
                  {{ convertTypeAccount(scope.row.type_user_old).text }}
                </p>
              </template>
              <template v-else>
                N/A
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="Thời hạn loại tài khoản"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.typeAccount">
                <template v-if="scope.row.typeAccount > dateC">{{
                  convertDateTimeSecond(scope.row.typeAccount.expried_time)
                }}
                </template>
                <template v-if="scope.row.typeAccount <= dateC">
                  N/A
                </template>
              </template>
              <template v-else>
                N/A
              </template>
            </template>
          </el-table-column>

          <el-table-column
            label="Doanh số chi tiêu ALL"
          >
            <template slot-scope="scope">
              <!--              {{ scope.row.total_spending_estimate ? formatNumber(scope.row.total_spending_estimate) : '' }}-->
              <el-link
                size="mini"
                style="color: #20a0ff"
                @click="onGetHistoryTransaction(scope.row)"
              >
                {{ scope.row.total_spending_estimate ? formatNumber(scope.row.total_spending_estimate) : '' }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="Doanh số chi tiêu trong kỳ"
          >
            <template slot-scope="scope">
              <el-link
                size="mini"
                style="color: #20a0ff"
                @click="onGetHistoryTransactionInDate(scope.row)"
              >
                {{ scope.row.money_in_date ? formatNumber(scope.row.money_in_date) : '' }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="Birthday"
          >
            <template slot-scope="scope">
              {{ scope.row.birthday ? convertDate(scope.row.birthday) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Giới tính"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.gender === 0">Nam</template>
              <template v-if="scope.row.gender === 1">Nữ</template>
            </template>
          </el-table-column>
          <el-table-column
            label="Note"
          >
            <template slot-scope="scope">
              <el-button
                :title="`xem chi tiết note ${scope.row.fullname}`"
                type="warning"
                @click="onShowDialogNoteGolfer(scope.row)"
              >Xem Note
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="Hành động"
            class="text-center"
          >
            <template slot-scope="scope">
              <span class="pr-1">
                <el-button
                  :title="`Chi tiết Golfer ${scope.row.fullname}`"
                  type="warning"
                  icon="el-icon-view"
                  circle
                  @click="onShowDialogDetailGolfer(scope.row)"
                />
              </span>
              <span
                v-if="!isEmpty(roles.find(role => role.name === 'role_statistic'))"
                class="pr-1"
              >
                <el-dropdown>
                  <el-button type="info" icon="el-icon-more" circle />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-link type="primary" icon="el-icon-arrow-right" @click="onShowDialog(scope.row)"> Nâng cấp Hạng hội viên</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link
                        type="primary"
                        icon="el-icon-arrow-right"
                        @click="onShowDialogEditTypeAccount(scope.row)"
                      > Nâng cấp loại tài khoản</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <span>
                <el-button
                  :title="` Nâng hạng đặc biệt ${scope.row.fullname}`"
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="onShowDialogUpgradeGolferSpecial(scope.row)"
                />
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetListsGolfer"
        />
      </el-col>
      <el-col :sm="24" />
    </el-row>
    <golfer-detail :obj-detail="objDetail" :show-dialog="showDialog" @clickButton="handleClickButton" />
    <history-change-golfer :obj-detail="objDetail" :show-dialog="showDialogHistory" @clickButton="handleClickClose" />
    <dialog-detail-golfer
      :show-dialog="showDialogDetailGolfer"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseDialogDetailGolfer"
    />
    <dialog-history-transaction
      :show-dialog="showHistoryTransaction"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseDialogHistoryTransaction"
    />
    <dialog-history-transaction-in-date
      :show-dialog="showHistoryTransactionInDate"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseDialogHistoryTransactionInDate"
    />
    <dialog-note-golfer
      :show-dialog="showDialogNoteGolfer"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseDialogNoteGolfer"
    />
    <upgrade-golfer-special
      :show-dialog="showDialogUpgradeGolferSpecial"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseUpgradeGolferSpecial"
    />
    <dialog-upgrade-type-account
      :obj-detail="objDetail"
      :show-dialog="showDialogEditTypeAccount"
      @clickButton="handleClickCloseDialogUpgradeAccount"
    />
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { typeAccounts, typeMembership } from '@/utils/defaultOptions'
import { convertDate, convertDateTimeSecond, convertDateTimeSecond1, formatDate } from '@/utils/convert'
import GolferDetail from './components/GolferDetail'
import UpgradeGolferSpecial from './components/UpgradeGolferSpecial.vue'
import HistoryChangeGolfer from './components/HistoryChangeGolfer'
import DialogDetailGolfer from './components/DialogDetailGolfer'
import { convertTypeAccount, convertIsProPlayer, convertMembership } from '@/utils/convertNumberToString'
import { optionsPlayer } from '@/utils/optionGolfer'
import { setArraySelect } from '@/utils/convertArray'
import { formatNumber } from '@/utils'
import DialogUpgradeTypeAccount from '@/views/membership/typeAccount/component/DialogUpgradeTypeAccount.vue'
import { getAdmin } from '@/utils/auth'
import moment from 'moment'
import DialogNoteGolfer from '@/views/membership/listGolfer/components/DialogNoteGolfer.vue'
import DialogHistoryTransaction from '@/views/membership/listGolfer/components/DialogHistoryTransaction.vue'
import DialogHistoryTransactionInDate
from '@/views/membership/listGolfer/components/DialogHistoryTransactionInDate.vue'
import ListGolferResource from '@/api/membership/golfer'
import { isEmpty } from '@/utils/validate'

const listGolferResources = new ListGolferResource()
const roles = getAdmin().role_admin
const arrayGender = [
  { value: 0, label: 'Nam' },
  { value: 1, label: 'Nữ' }
]
export default {
  name: 'Lists',
  components: {
    DialogHistoryTransactionInDate,
    DialogHistoryTransaction,
    DialogNoteGolfer,
    DialogUpgradeTypeAccount,
    Pagination,
    UpgradeGolferSpecial,
    HistoryChangeGolfer,
    GolferDetail,
    DialogDetailGolfer
  },
  data() {
    return {
      listQuery: {
        limit: 10,
        page: 1
      },
      form: 1,
      total: 0,
      loadingSearchUser: false,
      loadingTable: false,
      tableData: [],
      golfers: [],
      options: [...typeAccounts],
      optionsMembership: [...typeMembership],
      typeAccount: '',
      typeMembership: '',
      pickerOptions: {
        // shortcuts: pickerOptions
      },
      objDetail: {},
      showDialog: false,
      showDialogHistory: false,
      golferID: null,
      optionsPlayer: [...optionsPlayer],
      arrayGender: [...arrayGender],
      playerModel: {},
      isProPlayer: 0,
      showDialogDetailGolfer: false,
      showDialogNoteGolfer: false,
      showDialogExtendGolfer: false,
      showDialogUpgradeGolferSpecial: false,
      showDialogEditTypeAccount: false,
      showHistoryTransaction: false,
      showHistoryTransactionInDate: false,
      year: '',
      dateNow: '',
      loadingSearch: false,
      listGolfer: [],
      dateC: '',
      moneyBuy: 0,
      loadingExportExcel: false,
      roles: roles,
      dateRange: [],
      yearBirthday: 0
    }
  },
  watch: {
    typeAccount(value) {
      if (value === -1) {
        this.listQuery.allow_using_scorecard_image = null
      } else {
        this.listQuery.allow_using_scorecard_image = value
      }
    },
    typeMembership(value) {
      this.listQuery.type_user_old = value
    },
    golferID(value) {
      if (value === null || value === undefined) {
        this.listQuery.id = null
      } else {
        this.listQuery.id = value
      }
      this.onGetListsGolfer()
    },
    isProPlayer(value) {
      this.listQuery.is_pro_player = value
    },
    dateRange(value) {
      if (value) {
        this.listQuery.dateStart = moment(value[0]).format('MM-DD')
        this.listQuery.dateEnd = moment(value[1]).format('MM-DD')
      }
    },
    yearBirthday(value) {
      if (value) {
        this.listQuery.year = moment(value).format('Y')
      }
    }
  },
  mounted() {
    this.onGetListsGolfer()
  },
  methods: {
    isEmpty,
    formatDate,
    convertDateTimeSecond,
    onGetListsGolfer(e) {
      if (e === 1) {
        this.listQuery.page = 1
        this.listQuery.limit = 10
      }
      this.loadingTable = false
      listGolferResources.list(this.listBody, this.listQuery).then(response => {
        this.loadingTable = false
        if (response.error_code === 0) {
          const result = response.data
          for (let i = 0; i < result.data.length; i++) {
            const item = result.data[i]
            console.log('ádsqwewqewqeqw', result)
            const matchingItem = result.response.data.find(d => +d.user_id === +item.id)
            const moneyInDate = result.moneyInDate.find(d => +d.user_id === +item.id)
            if (matchingItem) {
              item.total_spending_estimate = matchingItem.total_spending_estimate
            }
            if (moneyInDate) {
              item.money_in_date = moneyInDate.sumMoney
            }
          }
          this.tableData = [...result.data]
          this.total = result.total
          this.from = result.from

          // this.tableData.map(value => {
          //   const data1 = value.payment
          //   console.log(data1)
          // })
        }
      })
      const date = new Date()
      this.dateC = convertDateTimeSecond(date)
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
    onGetHistoryTransaction(row) {
      this.showHistoryTransaction = true
      this.objDetail = Object.assign({}, row)
    },
    onGetHistoryTransactionInDate(row) {
      this.showHistoryTransactionInDate = true
      this.objDetail = Object.assign({}, row)
    },
    onShowDialogDetailGolfer(row) {
      this.showDialogDetailGolfer = true
      this.objDetail = Object.assign({}, row)
    },
    onShowDialogNoteGolfer(row) {
      this.showDialogNoteGolfer = true
      this.objDetail = Object.assign({}, row)
    },
    onShowDialogUpgradeGolferSpecial(row) {
      this.showDialogUpgradeGolferSpecial = true
      this.objDetail = Object.assign({}, row)
    },
    handleClickCloseUpgradeGolferSpecial(value) {
      this.showDialogUpgradeGolferSpecial = false
      if (value) {
        this.onGetListsGolfer()
      }
    },
    onShowDialog(row) {
      this.showDialog = true
      this.objDetail = Object.assign({}, row)
    },

    onShowDialogEditTypeAccount(row) {
      this.showDialogEditTypeAccount = true
      this.objDetail = Object.assign({}, row)
    },
    handleClickCloseDialogUpgradeAccount(value) {
      this.showDialogEditTypeAccount = false
      if (value) {
        this.onGetListsGolfer()
      }
    },
    handleClickButton(value) {
      this.showDialog = false
      if (value) {
        this.onGetListsGolfer()
      }
    },
    handleClickClose(value) {
      this.showDialogHistory = false
    },
    handleClickCloseDialogDetailGolfer(value) {
      this.showDialogDetailGolfer = false
      if (value) {
        this.onGetListsGolfer()
      }
    },
    handleClickCloseDialogHistoryTransaction(value) {
      this.showHistoryTransaction = false
      if (value) {
        this.onGetListsGolfer()
      }
    },
    handleClickCloseDialogHistoryTransactionInDate(value) {
      this.showHistoryTransactionInDate = false
      if (value) {
        this.onGetListsGolfer()
      }
    },
    handleClickCloseDialogNoteGolfer(value) {
      this.showDialogNoteGolfer = false
      if (value) {
        this.onGetListsGolfer()
      }
    },

    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.golferID = null
      this.typeAccount = ''
      this.typeMembership = ''
      this.yearBirthday = ''
      this.dateRange = null
      this.year = null
      this.onGetListsGolfer()
    },
    convertDate,
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    handleSetDataPlayer(isProPlayer) {
      const label = this.convertIsProPlayer(isProPlayer).text
      this.playerModel = Object.assign({}, { value: isProPlayer, label: label })
    },
    async handleDownload() {
      let stop = false
      const query = {
        limit: 5000,
        page: 1,
        id: this.listQuery.id,
        allow_using_scorecard_image: this.listQuery.allow_using_scorecard_image,
        type_user_old: this.listQuery.type_user_old,
        is_pro_player: this.listQuery.is_pro_player,
        phone: this.listQuery.phone,
        dateStart: this.listQuery.dateStart,
        dateEnd: this.listQuery.dateEnd,
        gender: this.listQuery.gender,
        year: this.listQuery.year
      }
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await listGolferResources.list(query, query)
          console.log('res..............', res)
          console.log('this.tableData', res.data.data)
          if (res.data.data.length <= 0) {
            stop = true
          }
          query.page = +query.page + 1
          for (let i = 0; i < res.data.data.length; i++) {
            const item = res.data.data[i]
            const matchingItem = res.data.response.data.find(d => +d.user_id === +item.id)
            if (matchingItem) {
              item.total_spending_estimate = matchingItem.total_spending_estimate
            }
          }
          list_all = [...list_all, ...res.data.data]
        } catch (error) {
          console.error(error)
          stop = true
        }
      }
      list_all.map(item => {
        item.display_id = item?.id_display ?? item?.id ?? null
      })
      console.log('list_all', list_all)
      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Tên golfer', 'Mã vID gốc', 'Mã vID hiển thị', 'Birthday', 'Giới tính', 'Hạng thành viên', 'Loại tài khoản', 'Loại Player', 'Thời hạn thành viên', 'Doanh số chi tiêu', 'Thời hạn Infinite']
        const filterVal = ['fullname', 'id', 'display_id', 'birthday', 'gender', 'allow_using_scorecard_image', 'type_user_old', 'is_pro_player', 'expried_time', 'total_spending_estimate', '']
        let data = list_all
        data = this.formatJson(filterVal, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-list'
        })
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'expried_time') {
          return v[j] > this.dateC ? convertDateTimeSecond1(v[j]) : v[j] <= this.dateC ? 'Hết hạn' : 'Chưa gia hạn'
        } else if (j === 'ranking_system_last_update') {
          return convertDateTimeSecond1(v[j])
        } else if (j === 'allow_using_scorecard_image') {
          return convertMembership(v[j]).text
        } else if (j === 'type_user_old') {
          return convertTypeAccount(v[j]).text
        } else if (j === 'is_pro_player') {
          return convertIsProPlayer(v[j]).text
        } else if (j === 'total_spending_estimate') {
          return formatNumber(v[j])
        } else if (j === 'birthday') {
          return convertDate(v[j])
        } else if (j === 'gender') {
          return v[j] === 0 ? 'Nam' : 'Nữ'
        } else {
          return v[j]
        }
      }))
    },
    convertTypeAccount,
    convertIsProPlayer,
    setArraySelect,
    convertDateTimeSecond1,
    convertMembership,
    formatNumber
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  .breadcrumb {
    padding: 10px 0;
  }

  .w-100 {
    width: 100%;
  }

  .text-right {
    text-align: right;
  }
}

.filter-container {
  padding: 10px 20px 20px 20px;
}

.list-golfer {
  padding: 0 20px 0 20px;
}

@media (min-width: 1200px) {
  .pr-10 {
    padding-right: 10px;
  }
}

@media only screen and (max-width: 580px) {
  .el-select {
    margin-bottom: 20px;
  }
  .el-button {
    margin: 20px 0;
  }
}

.mb-2 {
  margin-bottom: 10px;
}
</style>
