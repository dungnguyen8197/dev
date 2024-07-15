<template>
  <el-row class="main-content">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h1 style="margin: 0; width: 100%; padding: 10px; text-align: center;">Danh sách nâng cấp golfer đặc biệt</h1>
      </el-col>
    </el-row>

    <div class="filter-container">
      <el-row>
        <el-col :sm="3" class="mr-10" style="padding-right: 5px">
          <div class="search-golfer">
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
                :label="item.fullname + ' - ' + (item.id_display||item._id)"
                :value="item._id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :sm="6" align="right">
          <el-button icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter()">Tìm kiếm</el-button>
        </el-col>
      </el-row>
    </div>

    <el-row class="list-golfer">
      <el-col>
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            label="STT"
            width="100"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            label="Mã vID"
            align="center"
          >
            <template slot-scope="scope">
              {{ `vID${scope.row.user_id}` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="time_upgrade"
            label="Thời hạn nâng"
            align="center"
          />
          <el-table-column
            label="Hạng được nâng"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type_upgrade === 1">
                Member
              </el-tag>
              <el-tag v-else-if="scope.row.type_upgrade === 2" type="warning">
                Vip
              </el-tag>
              <el-tag v-else type="success">
                Luxury
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="time_old_user"
            align="center"
            label="Thời hạn hội viên cũ"
          />
          <el-table-column
            prop="time_old_user"
            align="center"
            label="Hạng hội viên cũ"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.type_old_user"
                :type="convertMembership(scope.row.type_old_user).className"
              >
                {{ convertMembership(scope.row.type_old_user).text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="cms_id"
            align="center"
            label="Người nâng"
          />
          <el-table-column
            label="Note"
            align="center"
            prop="note"
          />
          <el-table-column
            prop="created_at"
            label="Thời gian tạo"
            align="center"
          />
        </el-table>
        <pagination
          v-show="total > listQuery.number"
          :total="total"
          :limit.sync="listQuery.number"
          :page.sync="listQuery.page"
          @pagination="onGetHistoryUpgradeAccount"
        />
      </el-col>
    </el-row>
  </el-row>

</template>

<script>
import Pagination from '@/components/Pagination'
import { typeAccounts } from '@/utils/defaultOptions'
import { optionsPlayer } from '@/utils/optionGolfer'
import ListGolferResource from '@/api/membership/golfer'
import { convertMembership } from '@/utils/convertNumberToString'
// import axios from 'axios'
import { formatNumber } from '@/utils'
const listGolferResources = new ListGolferResource()
// import { convertDate } from '@/utils/convert'
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'
const optionType = [
  { value: 'bank', label: 'bank' },
  { value: 'point', label: 'point' }
]

const optionStatus = [
  { value: 0, label: 'Chưa thanh toán' },
  { value: 1, label: 'Đã thanh toán' }
]
export default {
  name: 'Lists',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        number: 10,
        page: 1
      },
      limit: 10,
      total: 20,
      optionType: [...optionType],
      optionStatus: [...optionStatus],
      form: 1,
      loadingSearchUser: false,
      loadingTable: false,
      tableData: [],
      golfers: [],
      options: [...typeAccounts],
      typeAccount: -1,
      dateRange: [],
      pickerOptions: {
        // shortcuts: pickerOptions
      },
      objDetail: {},
      showDialog: false,
      showDialogHistory: false,
      golferID: null,
      optionsPlayer: [...optionsPlayer],
      playerModel: {},
      isProPlayer: 0,
      showDialogDetailGolfer: false,
      showDialogExtendGolfer: false,
      year: '',
      roleUser: this.$store.getters.roles,
      loadingSearch: false,
      dialogShowQRCode: false,
      listGolfer: [],
      nameOptionChoose: {}
    }
  },
  watch: {
    dateRange(value) {
      this.listQuery.time_step_1 = moment(value[0]).unix()
      this.listQuery.time_step_2 = moment(value[1]).unix()
    },
    golferID(value) {
      if (value === null || value === undefined) {
        this.listQuery.user_id = null
      } else {
        this.listQuery.user_id = value
      }
      this.onGetHistoryUpgradeAccount()
    }
  },
  mounted() {
    this.onGetHistoryUpgradeAccount()
  },
  methods: {
    moment,
    formatNumber,
    convertMembership,
    onGetHistoryUpgradeAccount() {
      this.loadingTable = true
      const data = {
        cms_id: getAcountInfo().id,
        user_id: this.user_id
      }
      console.log(this.listQuery)
      console.log('...................', Object.assign(data, this.listQuery))
      listGolferResources.listUpgradeGolferSpecial({ ...data, ...this.listQuery }, this.listQuery).then(async response => {
        console.log('ui zoi loi', response)
        if (response.error_code === 0) {
          const result = response.data
          console.log('sss...........................', result)
          this.tableData = [...result]
        }
        this.loadingTable = false
      })
      this.total = this.listQuery.number * this.listQuery.page + this.listQuery.number
    },
    handleFilter() {
      this.listQuery.page = 1
      this.loadingTable = true
      this.onGetHistoryUpgradeAccount()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * 10 + index + 1
    },
    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.onGetHistoryUpgradeAccount()
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
    }
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
  padding: 50px 20px 0 20px;
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
