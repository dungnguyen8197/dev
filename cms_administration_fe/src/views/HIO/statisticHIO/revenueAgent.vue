<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex; text-align: center;">
        <h1 style="margin: 0; width: 100%; padding: 10px">Doanh số đại lý</h1>
      </el-col>
    </el-row>
    <el-row class="filter-container">
      <el-col :sm="4" class="mr-10 mb-1">
        <label>Tìm sale xử lý:</label>
        <el-select
          v-model="listQuery.admin_id"
          label="Tìm sale xử lý"
          filterable
          clearable
          remote
          class="w-100"
          placeholder="Tìm sale xử lý"
          :remote-method="onSearchSale"
          :loading="loadingSearchAgency"
        >
          <el-option
            v-for="sale in sales"
            :key="sale.value"
            :label="sale.label"
            :value="sale.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="mr-10 mb-1">
        <label>Tìm đại lý:</label>
        <el-select
          v-model="listQuery.agent_id"
          label="Tìm đại lý"
          filterable
          clearable
          remote
          class="w-100"
          placeholder="Tìm đại lý"
          :remote-method="onSearchAgent"
          :loading="loadingSearchAgency"
        >
          <el-option
            v-for="agent in agents"
            :key="agent.value"
            :label="agent.label"
            :value="agent.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="3" class="mr-10 mb-1">
        <label>Sắp xếp theo:</label>
        <el-select
          v-model="listQuery.key_sort"
          filterable
          clearable
          remote
          class="w-100"
          placeholder="Sắp xếp"
        >
          <el-option
            v-for="key in sortByKey"
            :key="key.value"
            :label="key.label"
            :value="key.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="7" class="mr-2 mb-1">
        <label>Tìm kiếm theo thời gian:</label>
        <el-date-picker
          v-model="dateRange"
          label="Tìm kiếm theo thời gian"
          class="date-rang-history"
          type="daterange"
          align="right"
          range-separator="đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :picker-options="pickerOptions"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col class=" mb-1" :sm="8">
        <el-button class="filter-item" icon="el-icon-refresh" round @click="onReset">Reset</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onGetList()">
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
        <el-button class="filter-item" type="primary" @click="handleCreateCode">Tạo bill đại lý</el-button>
      </el-col>
    </el-row>

    <p>Đại lý cấp 1: Ngày 18 hàng tháng mà các đơn phát sinh từ ngày 1-15 tháng đó chưa thanh toán bị coi là quá hạn.
      ngày mùng 4 hàng tháng các đơn phát sinh từ ngày 16-30/31 tháng trước chưa thanh toán là quá hạn.</p>
    <p>Đại lý cấp 2: Thứ 5 hàng tuần, tất cả các đơn từ thứ 2 đến CN tuần trước mà chưa thanh toán thì bị coi là quá
      hạn.</p>
    <p>Đại lý sân golf: Ngày 10 hàng tháng mà các đơn phát sinh tháng trước chưa thanh toán gọi là quá hạn.</p>

    <el-row class="list-account__data">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%; background-color: #fafafa "
      >
        <el-table-column
          label="STT"
          width="50"
          align="center"
          type="index"
          :index="handleIndexMethod"
        />
        <el-table-column
          label="Thông tin"
          align="center"
          type="expand"
          width="100"
        >
          <template slot-scope="scope">
            <el-row class="row">
              <el-col class="col-4">
                <div>
                  <p v-if="scope.row.agent_vid !== 0" class="ml-2">
                    vID đại lý: vID{{ `${scope.row.agent_vid}` }}
                  </p>
                  <p v-else class="ml-2">
                    vID đại lý: N/A
                  </p>
                </div>
                <div>
                  <p v-if="scope.row.code_agent !== null" class="ml-2">Mã đại lý: {{ scope.row.code_agent }} </p>
                  <p v-else class="ml-2">Mã đại lý: N/A</p>
                </div>
                <div>
                  <p v-if="scope.row.sales !== null" class="ml-2">Sale phụ trách: {{ `${scope.row.sales.name}` }}</p>
                  <p v-else class="ml-2">Sale phụ trách: N/A</p>
                </div>
                <div>
                  <p v-if="scope.row.phone_number !== null" class="ml-2">SĐT đại lý: {{
                    `${scope.row.phone_number}`
                  }}</p>
                  <p v-else class="ml-2">SĐT đại lý: N/A</p>
                </div>
              </el-col>
              <el-col class="col-4">
                <div>
                  <p v-if="scope.row.address !== null" class="ml-2">Địa chỉ: {{ `${scope.row.address}` }}</p>
                  <p v-else class="ml-2">Địa chỉ: N/A</p>
                </div>
                <div>
                  <p v-if="scope.row.tax_code !== null" class="ml-2">Mã số thuế: {{ `${scope.row.tax_code}` }}</p>
                  <p v-else class="ml-2">Mã số thuế: N/A</p>
                </div>
                <div>
                  <template v-if="scope.row.level_agent !== null">
                    <p v-if="scope.row.level_agent === 1" class="ml-2">Cấp đại lý: Loại 1</p>
                    <p v-else-if="scope.row.level_agent === 2" class="ml-2">Cấp đại lý: Loại 2</p>
                    <p v-else-if="scope.row.level_agent === 3" class="ml-2">Cấp đại lý: Loại 3</p>
                  </template>
                </div>
                <div>
                  <el-link
                    v-if="scope.row.url_file"
                    type="primary"
                    :href="convertLink(scope.row.url_file)"
                    target="_blank"
                  >
                    <el-button>Xem Hợp đồng</el-button>
                  </el-link>
                </div>
                <p class="ml-2">Ngày tạo: {{ `${scope.row.created_at}` }}</p>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Tên đại lý"
          align="center"
        />
        <el-table-column
          prop="level_agent"
          label="Cấp đại lý"
          align="center"
          width="80%"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.level_agent === -1 " />
            <p v-else>{{ scope.row.level_agent }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Admin"
          align="center"
          width="80%"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.sales">
              {{ scope.row.sales.name }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="'Doanh thu tháng trước: ' + formatNumber(totalMoneyLastMonthInsurance)"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.totalMoneyLastMonth) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="'Doanh thu hiện tại: ' + formatNumber(totalMoneyInsurance)"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.totalMoney) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="level_agent"
          :label="'Chiết khấu: ' + formatNumber(totalMoneyDiscountInsurance)"
          align="center"
          width="120px"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.totalMoneyDiscount) }}
          </template>
        </el-table-column>

        <el-table-column
          width="100px"
          :label="'Tổng đơn: ' + totalInsurance"
          align="center"
        >
          <template slot-scope="scope">
            <el-link
              size="mini"
              style="color: #20a0ff"
              @click="onGetTotalInsurance(scope.row)"
            >
              {{ scope.row.totalOrder }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          width="125px"
          :label="'Chưa gạch nợ: ' +totalDebitInsurance"
          align="center"
        >
          <template slot-scope="scope">
            <el-link
              size="mini"
              style="color: red"
              @click="onGetDebitInsurance(scope.row)"
            >
              {{ scope.row.totalOrderDebit }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="'Tổng nợ: ' + formatNumber(totalMoneyDebitInsurance)"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.totalMoneyDebit) }}
          </template>
        </el-table-column>

        <el-table-column
          label="Đơn quá hạn"
          align="center"
        >
          <template slot-scope="scope">
            <el-link
              size="mini"
              style="color: red"
              @click="onGetOutOfDateInsurance(scope.row)"
            >
              {{ scope.row.totalOutOfDate }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          :label="'Tiền quá hạn: ' + formatNumber(totalMoneyOutOfDateInsurance)"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.totalMoneyOutOfDate) }}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="spliceData"
        />
      </el-row>
      <total-insurance
        :object-query="listQuery"
        :show-dialog="showTotalInsurance"
        :object-total-insurance="objectTotalInsurance"
        @onClickButtonTotalInsurance="onClickButtonTotalInsurance"
      />
      <debit-insurance
        :object-query="listQuery"
        :show-dialog="showDebitInsurance"
        :object-debit-insurance="objectDebitInsurance"
        @onClickButtonDebitInsurance="onClickButtonDebitInsurance"
      />
      <out-of-date-insurance
        :object-query="listQuery"
        :show-dialog="showOutOfDateInsurance"
        :object-out-of-date-insurance="objectOutOfDateInsurance"
        @onClickButtonOutOfDateInsurance="onClickButtonOutOfDateInsurance"
      />
      <dialog-create-code :show-dialog="showDialogCreate" @clickButtonDialog="handleButtonDialogCreate" />
    </el-row>

  </el-row>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  formatNumber,
  convertDate
} from '@/utils/convert'
import { pickerOptions } from '@/utils/dateRangOptions'
// import axios from 'axios'
import TotalInsurance from '@/views/HIO/statisticHIO/component/dialogTotalInsurance.vue'
import DebitInsurance from '@/views/HIO/statisticHIO/component/dialogDebitInsurance.vue'
import OutOfDateInsurance from '@/views/HIO/statisticHIO/component/dialogOutOfDateInsurance.vue'
import DialogCreateCode from '@/views/HIO/statisticHIO/component/DialogCreateCode.vue'
import AgentHIOResource from '@/api/HIO/agentHIO'
import { baseURL } from '@/constant/config'
import { getAdmin } from '@/utils/auth'
// import page from '@/views/permission/page.vue'
// import { getAcountInfo } from '@/utils/auth'
const typeServiceResource = new AgentHIOResource()
// import moment from 'moment/moment'

const sortByKey = [
  { value: 'totalMoney', label: 'Doanh thu hiện tại' },
  { value: 'totalMoneyLastMonth', label: 'Doanh thu tháng trước' },
  { value: 'totalMoneyDiscount', label: 'Chiết khấu' },
  { value: 'totalOrder', label: 'Tổng đơn' }

]

const arrayLevelAgent = [
  { value: 1, label: 'Loại 1' },
  { value: 2, label: 'Loại 2' },
  { value: 3, label: 'Loại 3' }
]
const roles = getAdmin().role_admin

export default {
  name: 'List',
  components: { DialogCreateCode, OutOfDateInsurance, DebitInsurance, TotalInsurance, Pagination },
  data() {
    return {
      showTotalInsurance: false,
      showDebitInsurance: false,
      showOutOfDateInsurance: false,
      tableData: [],
      loadingTable: false,
      loadingTableInsurance: false,
      dateRange: [],
      pickerOptions: {
        shortcuts: pickerOptions
      },
      listQuery: { page: 1, limit: 10, key_sort: 'totalMoney' },
      listQueryInsurance: {
        page: 1, limit: 5
      },
      listBody: {},
      listBodyInsurance: {},
      total: 0,
      totalInsurance: 0,
      isAdd: true,
      onShowDialog: false,
      showDialog: false,
      dialogObject: {},
      dialogConfirmAgent: false,
      arrayLevelAgent: [...arrayLevelAgent],
      changeStatus: [],
      objectData: {},
      idAgent: 0,
      agents: [],
      objectTotalInsurance: {},
      objectDebitInsurance: {},
      objectOutOfDateInsurance: {},
      totalDebitInsurance: 0,
      totalMoneyInsurance: 0,
      totalMoneyDebitInsurance: 0,
      totalMoneyLastMonthInsurance: 0,
      totalMoneyDiscountInsurance: 0,
      totalMoneyOutOfDateInsurance: 0,
      showDialogCreate: false,
      loadingExportExcel: false,
      loadingSearchAgency: false,
      loadingSearchSale: false,
      sales: [],
      dataAgentSort: [],
      sortByKey: sortByKey,
      roles: roles,
      objectQuery: {}
    }
  },
  computed: {},
  watch: {
    dateRange(value) {
      console.log('value.........', value)
      if (value) {
        this.listQuery.dateStart = this.convertDate(value[0], 'YYYY-MM-DD')
        this.listQuery.dateEnd = this.convertDate(value[1], 'YYYY-MM-DD')
      }
    }
  },
  created() {
    this.onGetList()
  },

  methods: {
    spliceData() {
      this.tableData = this.dataAgentSort.splice(this.listQuery.page === 1 ? 1 : this.listQuery.page * this.listQuery.limit, this.listQuery.limit)
    },
    onGetList() {
      this.loadingTable = true
      if (roles.find(role => role.name === 'role_statistic')) {
        this.listQuery.cms_id = ''
      } else {
        this.listQuery.cms_id = getAdmin().id
      }

      typeServiceResource.listRevenueAgent(this.listQuery).then(res => {
        this.dataAgentSort = res?.data.data[0]
        if (this.dataAgentSort.length > this.listQuery.limit) {
          this.tableData = this.dataAgentSort.splice(this.listQuery.page === 1 ? 0 : this.listQuery.page * this.listQuery.limit, this.listQuery.limit)
        } else {
          this.tableData = res?.data.data[0]
        }
        console.log('this.tableData................', this.tableData)
        this.total = res?.data.data[0].length
        this.totalDebitInsurance = res?.data.data.totalDebitInsurance
        this.totalInsurance = res?.data.data.totalInsurance
        this.totalMoneyInsurance = res?.data.data.totalMoneyInsurance
        this.totalMoneyLastMonthInsurance = res?.data.data.totalMoneyLastMonthInsurance
        this.totalMoneyDebitInsurance = res?.data.data.totalMoneyDebitInsurance
        this.totalMoneyDiscountInsurance = res?.data.data.totalMoneyDiscountInsurance
        this.totalMoneyOutOfDateInsurance = res?.data.data.totalMoneyOutOfDateInsurance
      }).finally(() => {
        this.loadingTable = false
      })
    },
    convertLink(value) {
      return baseURL + value
    },
    handleCreateCode() {
      this.showDialogCreate = true
    },
    handleButtonDialogCreate(object) {
      const { dialog, reload } = object
      this.showDialogCreate = dialog
      if (reload) {
        this.requestExpenseList()
      }
    },
    onGetTotalInsurance(row) {
      this.objectTotalInsurance = row
      this.showTotalInsurance = true
    },
    onGetDebitInsurance(row) {
      this.objectDebitInsurance = row
      this.showDebitInsurance = true
    },
    onGetOutOfDateInsurance(row) {
      this.objectOutOfDateInsurance = row
      this.showOutOfDateInsurance = true
    },
    onClickButtonTotalInsurance(object) {
      const { dialog, reload } = object
      this.showTotalInsurance = dialog
      if (reload) {
        this.onGetList()
      }
    },
    onClickButtonDebitInsurance(object) {
      const { dialog, reload } = object
      this.showDebitInsurance = dialog
      if (reload) {
        this.onGetList()
      }
    },
    onClickButtonOutOfDateInsurance(object) {
      const { dialog, reload } = object
      this.showOutOfDateInsurance = dialog
      if (reload) {
        this.onGetList()
      }
    },
    async onSearchAgent(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchAgency = true
      typeServiceResource.searchAgentNew({ keyword: keywords }).then(res => {
        const data = res.data.data
        const array = []
        if (data.length > 0) {
          data.map(value => {
            const item = { label: `${value.name}`, value: value.id }
            array.push(item)
          })
        }
        this.agents = [...array]
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchAgency = false
    },
    async onSearchSale(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchSale = true
      typeServiceResource.searchSaleNew({ keyword: keywords }).then(res => {
        const data = res.data.data
        const array = []
        if (data.length > 0) {
          data.map(value => {
            const item = { label: `${value.name}`, value: value.id }
            array.push(item)
          })
        }
        this.sales = [...array]
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchSale = false
    },
    onReset() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1, key_sort: 'totalMoney' })
      this.dateRange = null
      // this.listQuery.key_sort = 'totalMoney'
      // this.listQuery.agent_id = null
      // this.listQuery.dateStart = ''
      // this.listQuery.dateEnd = ''
      // this.listQuery.admin_id = null
      this.onGetList()
    },
    async handleDownload() {
      let stop = false
      const query = {
        page: 1,
        limit: 10
      }
      query.dateStart = this.listQuery.dateStart
      query.dateEnd = this.listQuery.dateEnd
      query.agent_id = this.listQuery.agent_id
      query.key_sort = this.listQuery.key_sort
      query.cms_id = this.listQuery.cms_id
      query.admin_id = this.listQuery.admin_id
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await typeServiceResource.listRevenueAgent(query)
          console.log('res..............', res.data.data[0])
          console.log('this.tableData', res.data.data)
          if (res.data.data[0].length <= 0) {
            stop = true
          }
          list_all = [...list_all, ...res.data.data[0]]
          console.log('list_all', list_all)
          if (res.error_code === 0) {
            stop = true
          }
        } catch (error) {
          console.error(error)
          stop = true
        }
      }

      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Tên đại lý', 'Tổng đơn', 'Chưa gạch nợ', 'Tổng nợ', 'Doanh thu', 'Doanh thu tháng trước', 'Chiết khấu', 'Đơn quá hạn', 'Tiền quá hạn']
        const filterVal = ['name', 'totalOrder', 'totalOrderDebit', 'totalMoneyDebit', 'totalMoney', 'totalMoneyLastMonth', 'totalMoneyDiscount', 'totalOutOfDate', 'totalMoneyOutOfDate']
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
        if (j === 'name') {
          return v[j]
        } else if (j === 'totalOrder') {
          return v[j]
        } else if (j === 'totalOrderDebit') {
          return v[j]
        } else if (j === 'totalMoneyDebit') {
          return v[j]
        } else if (j === 'totalMoney') {
          return v[j]
        } else if (j === 'totalMoneyLastMonth') {
          return v[j]
        } else if (j === 'totalMoneyDiscount') {
          return v[j]
        } else if (j === 'totalOutOfDate') {
          return v[j]
        } else if (j === 'totalMoneyOutOfDate') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    },

    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },

    formatNumber,
    convertDate
  }
}
</script>
<style scoped>
.pr-5 {
  padding-right: 15px;
}

.mr-10 {
  margin-right: 10px;
}

.content {
  line-height: 1.5rem;
  max-height: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel-col {
  margin-bottom: 32px;
}

.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  background: #ECECEC;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, .05);
  border-color: black;
}

.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}

.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.432);
  font-size: 25px;
  margin-bottom: 12px;
  margin-top: 12px;
  font-weight: bold;
  text-align: center;
}

.card-panel-num {
  text-align: center;
  font-size: 20px;
  color: red;
  font-weight: bold;
}

.card-panel-num1 {
  text-align: center;
  font-size: 20px;
  color: black;
  font-weight: bold;
}

.panel-group {
  margin-top: 18px;

}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 825px;
}
</style>

