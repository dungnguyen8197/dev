<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="12">
        <h3 class="title">Thống kê DOANH SỐ</h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col :sm="8" class="mr-2">
          <el-date-picker
            v-model="dateRange"
            class="date-rang-history"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="findDate">
              Tìm kiếm
            </el-button>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              :loading="loadingExportExcel"
              @click="handleDownload"
            >
              Export excel
            </el-button>
            <el-button class="filter-item" @click="reset">Reset</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row class="list-account__data">
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
          label="Hạng hội viên"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.membership_class }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Tổng số lượng: ' + formatNumber(totalMember)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.total ? formatNumber(scope.row.total) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          label="Đổi hạng bằng đóng phí"
          align="center"
        />
        <el-table-column
          label=" Đổi hạng bằng chi tiêu"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.change_by_payment ? formatNumber(scope.row.change_by_payment) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          label="Đổi hạng CMS"
          align="center"
        />
        <el-table-column
          :label="'Doanh thu phí hội viên: ' + formatNumber(totalMoneyMemberShip)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.money_membership ? formatNumber(scope.row.money_membership) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Doanh thu mã đẹp VSim: ' + formatNumber(totalMoneyVSim)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.money_vsim ? formatNumber(scope.row.money_vsim) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Doanh thu Booking: ' + formatNumber(totalMoneyBooking)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.money_booking ? formatNumber(scope.row.money_booking) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Doanh thu BH HIO: ' + formatNumber(totalMoneyHIO)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.money_HIO ? formatNumber(scope.row.money_HIO) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Doanh thu Shop: ' + formatNumber(totalMoneyShop)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.money_shop ? formatNumber(scope.row.money_shop) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Nạp ví vWallet: ' + formatNumber(totalMoneyVWallet)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.money_vWallet ? formatNumber(scope.row.money_vWallet) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Tổng cộng: ' + formatNumber(totalMoneyMemberShip + totalMoneyVSim + totalMoneyBooking + totalMoneyHIO + totalMoneyShop + totalMoneyVWallet)"
          align="center"
        >
          <template slot-scope="scope">
            {{
              formatNumber(scope.row.money_booking + scope.row.money_membership + scope.row.money_vWallet + scope.row.money_vsim + scope.row.money_shop + scope.row.money_HIO)
            }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          label="Cập nhật"-->
        <!--          align="center"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            {{-->
        <!--              convertDateTimeSecond(scope.row.updated_at)-->
        <!--            }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="requestCustormList"
        />
      </el-row>
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import RoleResource from '@/api/roles'
import { convertDateTimeSecond, convertDateTimeSecond1, convertDate, formatNumber } from '@/utils/convert'
import ReportResource from '@/api/membership/report'
import { convertMembership } from '@/utils/convertNumberToString'

const roleResource = new RoleResource()
const reportResource = new ReportResource()
const defaultQuery = {
  page: 1,
  limit: 10
}

export default {
  name: 'List',
  components: { Pagination },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      tableData: [],
      admins: [],
      dateRange: [],
      loadingTable: false,
      listQuery: Object.assign({}, defaultQuery),
      total: 0,
      isAdd: true,
      onShowDialog: false,
      objectAccount: {},
      roles: [],
      admin: {}, // getAcountInfo(),
      currentPermissions: {}, // getPermissions(),
      listStatus: [
        { id: 0, name: 'Chưa duyệt' },
        { id: 1, name: 'Đã duyệt' }
      ],
      showDialogImport: false,
      showHistory: false,
      objectHistory: {},
      valueDate: '',
      total_waiting: 0,
      loadingExportExcel: false,
      totalMoney: 0,
      dateC: '',
      totalMember: 0,
      totalMoneyMemberShip: 0,
      totalMoneyVSim: 0,
      totalMoneyBooking: 0,
      totalMoneyHIO: 0,
      totalMoneyShop: 0,
      totalMoneyVWallet: 0,
      totalMoneyALl: 0
    }
  },
  watch: {
    dateRange(value) {
      if (value !== null) {
        this.listQuery.dateStart = this.convertDate(value[0], 'YYYY-MM-DD')
        this.listQuery.dateEnd = this.convertDate(value[1], 'YYYY-MM-DD')
      } else {
        this.listQuery.dateStart = null
        this.listQuery.dateEnd = null
      }
    }
  },
  created() {
    // this.onGetListAccount()
    // this.getListRole()
    this.requestCustormList()
  },
  methods: {
    convertDateTimeSecond,
    requestCustormList() {
      this.loadingTable = true
      reportResource.reportAll(this.listQuery).then(res => {
        console.log('ssssssssssssss', res)
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
          this.totalMember = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.total
          }, 0)
          this.totalMoneyMemberShip = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money_membership
          }, 0)
          this.totalMoneyVSim = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money_vsim
          }, 0)
          this.totalMoneyBooking = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money_booking
          }, 0)
          this.totalMoneyHIO = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money_HIO
          }, 0)
          this.totalMoneyShop = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money_shop
          }, 0)
          this.totalMoneyVWallet = this.tableData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money_vWallet
          }, 0)
        }
      }).catch(_ => {
        this.loadingTable = false
      })
      const date = new Date()
      this.dateC = convertDateTimeSecond(date)
    },

    findDate() {
      this.loadingTable = true
      reportResource.countNonMember(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMember(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMemberVip(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMemberLuxury(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMemberInfinite(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      this.requestCustormList()
    },

    reset() {
      this.listQuery = {
        dateStart: null,
        dateEnd: null,
        limit: 10, page: 1
      }
      this.loadingTable = true
      reportResource.countNonMember(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMember(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMemberVip(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMemberLuxury(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      reportResource.countMemberInfinite(this.listQuery).then(res => {
        this.loadingTable = false
      }).catch(_ => {
        this.loadingTable = false
      })
      this.requestCustormList()
    },

    getListRole() {
      roleResource.getUnder().then(res => {
        this.roles = res.data
      })
    },
    handleSwitch(row) {
      console.log(row)
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    onReset() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.requestCustormList()
    },
    async handleDownload() {
      let stop = false
      const query = {
        page: 1,
        limit: 40
      }
      query.dateStart = this.listQuery.dateStart
      query.dateEnd = this.listQuery.dateEnd
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await reportResource.exportExcel(query)
          console.log('res..............', res.data.data)
          console.log('this.tableData', res.data.data)
          if (res.data.data.data.length <= 0) {
            stop = true
          }
          query.page = +query.page + 1
          list_all = [...list_all, ...res.data.data.data].flat(Infinity)
          console.log('list_all', list_all)
        } catch (error) {
          console.error(error)
          stop = true
        }
      }

      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Mã vID', 'Hạng hiện tại', 'Thời hạn thành viên', 'Doanh số Phí hội viên', 'Doanh thu VSim', 'Doanh thu Booking', 'Doanh thu BH HIO', 'Doanh thu Shop', 'Doanh thu vWallet']
        const filterVal = ['user_id', 'allow_using_scorecard_image', 'expried_time', 'totalMoneyMembership', 'totalMoneyVSim', 'totalMoneyBooking', 'totalMoneyHIO', 'totalMoneyShop', 'totalMoneyVWallet']
        let data = list_all
        data = this.formatJson(filterVal, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'report-user'
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
        if (j === 'user_id') {
          return v[j]
        } else if (j === 'totalMoneyMembership') {
          return v[j]
        } else if (j === 'totalMoneyVSim') {
          return v[j]
        } else if (j === 'totalMoneyBooking') {
          return v[j]
        } else if (j === 'totalMoneyHIO') {
          return v[j]
        } else if (j === 'totalMoneyShop') {
          return v[j]
        } else if (j === 'totalMoneyVWallet') {
          return v[j]
        } else if (j === 'allow_using_scorecard_image') {
          return convertMembership(v[j]).text
        } else if (j === 'expried_time') {
          return v[j] > this.dateC ? convertDateTimeSecond1(v[j]) : v[j] <= this.dateC ? 'Hết hạn' : 'Chưa gia hạn'
        } else if (j === 'totalMoneyShop') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    },
    formatNumber,
    convertDate
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}

.pr-5 {
  padding-right: 15px;
}

.mr-10 {
  margin-right: 10px;
}

.title {
  margin: 0;
  width: 100%;
  margin: 10px 0 20px 0;
}

.search-custom {
  padding-right: 10px;
}
</style>
