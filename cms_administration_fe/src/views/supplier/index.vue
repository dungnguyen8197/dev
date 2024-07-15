<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
    <div v-if="screen_id=2" class="table-data">
      <el-row class="list-filter">
        <el-col :sm="24" align="right">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            popper-class="custom-date-picker"
            align="right"
            unlink-panels
            :range-separator="$t('to')"
            :start-placeholder="start"
            :end-placeholder="end"
            format="dd-MM-yyyy HH:mm:ss"
            :picker-options="pickerOptions"
          />
          <el-badge :value="contract_count">
            <el-button :title="contract_count === 0 ? $t('not_have_contract_for_approve') : $t('count_contract_not_approve').format(contract_count)" type="primary" style="margin-left: 10px;" @click="onApprovePress">{{ $t('approve_contract') }}</el-button>
          </el-badge>
          <el-button type="primary" style="margin-left: 10px;" @click="onStatisticalPress">{{ $t('statistical_sale') }}</el-button>
          <el-button style="margin-left: 10px;" :loading="loadingTable" icon="el-icon-refresh" @click="onResetPress">{{ $t('reload') }}</el-button>
        </el-col>
      </el-row>
      <el-row v-if="isShow" class="list-title">
        <h3 align="left">{{ $t('traffic_shop') }} <span>{{ timeName || $t('time_name') }}</span></h3>
      </el-row>
      <el-row v-loading="loadingTable">
        <el-row class="list__data">
          <el-table v-if="isShow" :data="tableData" border style="width: 100%">
            <el-table-column :label="$t('id')" width="100" align="center">
              <template slot-scope="scope">
                <el-link @click="selectedItem(scope.row)">{{ `#${scope.row.id}` }}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('taxonomy_name')" prop="screen_name" align="center">
              <template slot-scope="scope">
                <el-link @click="selectedItem(scope.row)">{{ `${scope.row.screen_name}` }}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('user_traffic')" prop="number_user_access" align="center">
              <template slot-scope="scope">
                <el-link @click="selectedItem(scope.row)">{{ `${scope.row.number_user_access}` }}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('traffic')" prop="traffic" align="center">
              <template slot-scope="scope">
                <el-link @click="selectedItem(scope.row)">{{ `${scope.row.traffic}` }}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('traffic_type')" prop="traffic_type" align="center">
              <template slot-scope="scope">
                <el-link @click="selectedItem(scope.row)">{{ `${scope.row.traffic_type}` }}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('note')" prop="note" align="center">
              <template slot-scope="scope">
                <el-link @click="selectedItem(scope.row)">{{ `${scope.row.note}` }}</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row v-if="seen" class="list-detail">
          <el-col :sm="24">
            <el-col :sm="12">
              <h3 align="left">{{ $t('traffic_detail') }} <span>{{ screenName || '' }}</span></h3>
            </el-col>
            <el-col align="right" :sm="12">
              <el-button type="primary" @click="exportTraffic">Export</el-button>
            </el-col>
          </el-col>
          <!--        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="onGetDetailDashboard" />-->
          <el-table
            border
            :data="tableChoosen"
            style="width: 100%"
          >
            <el-table-column prop="user_id" :label="$t('VGA')" align="center" />
            <el-table-column prop="user_name" :label="$t('name')" align="center" />
            <el-table-column v-if="trafficID === 4" prop="shop_name" :label="$t('shop')" align="center" />
            <el-table-column v-if="trafficID === 4" prop="category_name" :label="$t('category')" align="center" />
            <el-table-column v-if="trafficID === 4" prop="trademark_name" :label="$t('trademark')" align="center" />
            <el-table-column v-if="trafficID === 4" prop="tag_name" :label="$t('tag')" align="center" />
            <!-- <el-table-column prop="traffic" label="Lượt truy cập" align="center" /> -->
            <el-table-column prop="createdAt" :label="$t('time')" align="center" />
            <el-table-column prop="params" :label="$t('params')" align="center" />
          </el-table>
          <index
            v-show="total > listQuery.limit"
            :total="total"
            :limit.sync="listQuery.limit"
            :page.sync="listQuery.page"
            @pagination="onGetDetailDashboard"
          />
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
// import JwPagination from 'jw-vue-pagination'
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import LineChart from '@/utils/LineChart'
import VueApexCharts from 'vue-apexcharts'
import DashboardResource from '@/api/dashboard'
import Index from '@/components/Pagination1'
import Chart from '@/views/dashboard/chart/Chart'
import PieChart from '@/views/dashboard/chart/PieChart'
import { getAcountInfo } from '@/utils/auth'
import icon_chat from '@/icons/svg/chart.svg'
// import Pagination from '@/components/Pagination'
import SupplierResource from '@/api/supplier'
const supplierResource = new SupplierResource()

const dashboardResource = new DashboardResource()

function getStartDate(start) {
  const hour = start.getHours()
  const minutes = start.getMinutes()
  const second = start.getSeconds()
  const timestamp = hour * 60 * 60 * 1000 + minutes * 60 * 1000 + second * 1000
  let start_date = start.getTime() - timestamp
  start_date = new Date(start_date)
  return start_date
}

function getEndDate(end) {
  const hour = end.getHours()
  const minutes = end.getMinutes()
  const second = end.getSeconds()
  const timestamp = hour * 60 * 60 * 1000 + minutes * 60 * 1000 + second * 1000
  let end_date = end.getTime() - timestamp + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000
  end_date = new Date(end_date)
  return end_date
}

const defaultQuery = {
  page: 1,
  limit: 10
}
const LOADING_TEXT = {
  LOADING: 'Đang tải dữ liệu...',
  DETAIL: 'Đang tải dữ liệu...',
  EXPORT: 'Đang xuất dữ liệu, vui lòng đợi...'
}

export default {
  name: 'Dashboard',
  components: { PieChart, Chart, apexchart: VueApexCharts, adminDashboard, editorDashboard, LineChart, Index },
  data() {
    const account = getAcountInfo()
    console.log('........... thong tin tai khoan ', JSON.stringify(account))
    const prefix_domain = account.prefix_domain
    return {
      icon_chat: icon_chat,
      screen_id: prefix_domain === 'super_admin' ? 2 : (prefix_domain === 'admin' ? 1 : 0),
      loading_text: LOADING_TEXT.LOADING,
      objectDetail: {},
      chart_data: [],
      value1: '',
      pageOfItems: [],
      total: 0,
      timeName: '',
      screenName: '',
      isShow: true,
      seen: false,
      trafficID: 0,
      tableChoosen: [],
      from_date: 0,
      to_date: 0,
      start: new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
      end: new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' }),
      pickerOptions: {
        disabledDate: this.disabledDate,
        shortcuts: [{
          text: 'Đầu ngày tới giờ',
          onClick: (picker) => {
            const end = new Date()
            let start = new Date()
            start = getStartDate(start)
            picker.$emit('pick', [start, end])
            this.getTimeName('đầu ngày tới giờ')
          }
        }, {
          text: 'Ngày hôm qua',
          onClick: (picker) => {
            const end = getEndDate(new Date())
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            start = getStartDate(start)
            picker.$emit('pick', [start, end])
            this.getTimeName('ngày hôm qua')
          }
        }, {
          text: '7 ngày qua',
          onClick: (picker) => {
            const end = getEndDate(new Date())
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            start = getStartDate(start)
            picker.$emit('pick', [start, end])
            this.getTimeName('7 ngày qua')
          }
        }, {
          text: '1 tháng qua',
          onClick: (picker) => {
            const end = getEndDate(new Date())
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            start = getStartDate(start)
            picker.$emit('pick', [start, end])
            this.getTimeName('1 tháng qua')
          }
        }]
      },
      defaultTime: ['00:00:00', '23:59:00'],
      value2: '',
      tableData: [],
      loadingTable: false,
      loading: false,
      listQuery: Object.assign({}, defaultQuery),
      currentRole: 'adminDashboard',
      series3: [{
        name: 'Shop',
        data: [50, 100, 50, 100, 50, 100, 50]
      }, {
        name: 'Category',
        data: [40, 90, 40, 90, 40, 90, 40]
      }, {
        name: 'Product',
        data: [35, 80, 35, 80, 35, 80, 35]
      }, {
        name: 'Trademarks',
        data: [30, 70, 30, 70, 30, 70, 30]
      }, {
        name: 'Account',
        data: [25, 60, 25, 60, 25, 62, 25]
      }, {
        name: 'Tag',
        data: [20, 50, 20, 50, 20, 50, 20]
      }, {
        name: 'Revenue',
        data: [15, 40, 15, 40, 15, 40, 15]
      }, {
        name: 'Promotions',
        data: [10, 30, 10, 30, 10, 30, 10]
      }, {
        name: 'Delivery',
        data: [5, 20, 5, 20, 5, 20, 5]
      }, {
        name: 'UploadError',
        data: [1, 10, 1, 10, 1, 10, 1]
      }],
      chartOptions3: {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ['2018-09-19T00:00:00.000Z', '2018-09-19T01:30:00.000Z', '2018-09-19T02:30:00.000Z', '2018-09-19T03:30:00.000Z', '2018-09-19T04:30:00.000Z', '2018-09-19T05:30:00.000Z', '2018-09-19T06:30:00.000Z']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      },
      contract_count: 0
    }
  },
  watch: {
    value2(value) {
      this.seen = false
      let start = value[0]
      let end = value[1]
      start = (new Date(start)).getTime()
      end = (new Date(end)).getTime()
      // console.log('....................thoi gian', start, end)
      this.from_date = start
      this.to_date = end
      this.listQuery.from_date = this.from_date
      this.listQuery.to_date = this.to_date
      this.onGetListDashboard()
    }
  },
  created() {
    this.requestCountContractNotApprove()
    // this.onGetListDashboard()
    if (this.screen_id === 2) {
      this.value2 = [getStartDate(new Date()), new Date()]
    }
    this.getValue1()
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  methods: {
    /**
      * contract
    */
    onApprovePress() {
      this.$router.push({ path: `/SupplierContractList` })
    },
    onStatisticalPress() {
      this.$router.push({ path: `/statistical` })
    },
    onResetPress() {
      this.onGetListDashboard()
      this.requestCountContractNotApprove()
    },
    requestCountContractNotApprove() {
      supplierResource.count_contact_not_approve().then(res => {
        const { error, count } = res
        if (error === 0) {
          this.contract_count = count
        }
      })
    },
    disabledDate(date) {
      const yesterday = new Date(this.from_date)
      yesterday.setDate(yesterday.getDate() + 31)
      return date.getTime() >= yesterday.getTime()
    },
    exportTraffic() {
      this.$confirm(`Bạn có chắc chắn muốn export dữ liệu`).then(_ => {
        this.listQuery.id = this.trafficID
        this.loading_text = LOADING_TEXT.EXPORT
        this.loadingTable = true
        dashboardResource.getExportList(this.listQuery).then(response => {
          setTimeout(() => {
            this.loadingTable = false
            const { error, msg } = response
            if (error === 0) {
              this.confirmDowload(response.link)
            } else {
              this.$message.error(msg)
            }
          }, 2000)
        }).catch(_ => {
          this.loadingTable = false
        })
      })
    },
    confirmDowload(url) {
      this.getFileFromServer(url)
    },
    async getFileFromServer(url) {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success(('Export thành công'))
      }, 250)
    },
    getValue1(value1) {
      this.value1 = value1
    },
    getTimeName(value) {
      this.timeName = value
    },
    selectedItem(row) {
      // console.log('................... chon traffic : ', JSON.stringify(row))
      // this.tableChoosen = [row]
      this.trafficID = row.id
      this.screenName = row.screen_name
      this.from_date = row.from_date
      this.listQuery.page = 1
      this.onGetDetailDashboard()
    },
    onGetListDashboard() {
      this.loading_text = LOADING_TEXT.LOADING
      this.loadingTable = true
      console.log('..........check tracking : ', this.listQuery)
      dashboardResource.dashboardList(this.listQuery).then(response => {
        // console.log('==================================dashboard', JSON.stringify(response))
        this.loadingTable = false
        const { error, data } = response
        if (error === 0) {
          this.tableData = [...data]
          this.isShow = true
        } else {
          this.tableData = []
          this.isShow = false
        }
      }).catch(e => {
        this.tableData = []
        this.isShow = false
        this.loadingTable = false
      })
    },
    onGetDetailDashboard() {
      this.loading_text = LOADING_TEXT.DETAIL
      this.loadingTable = true
      this.listQuery.id = this.trafficID
      dashboardResource.dashboardDetail(this.listQuery).then(response => {
        // console.log('----------------------------------------------detail', JSON.stringify(response))
        this.loadingTable = false
        const { error, data, total } = response
        if (error === 0) {
          this.tableChoosen = [...data]
          this.total = this.listQuery.page === 1 ? total : this.total
          this.objectDetail = {}
          this.seen = true
        } else {
          this.tableChoosen = []
          this.seen = false
        }
      }).catch(e => {
        this.tableChoosen = []
        this.seen = false
        this.loading = false
      })
    },
    onGetChartDetail() {
      this.listQuery.id = this.trafficID
      this.loaded = false
      dashboardResource.chartDetail(this.listQuery).then(response => {
        this.loaded = true
        if (response.error === 0) {
        // this.tableChart = response.data
          const responseData = response.data
          // this.drawChart(responseData)
          this.NameScreen(responseData)
        } else {
          this.tableChart = []
        }
      })
    },
    NameScreen() {
      this.screen_name = this.screenName
      console.log('--------------------------------------this.screen_name = ', this.screenName)
    },
    drawChart(data) {
      this.chart_data = [...data]
    }
  }
}

</script>
  <style scoped>
  .dashboard-container{
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  #line-chart{
    height: 350px;
  }
  .table-data{
    padding: 30px;
  }
  .list__data{
    padding-top: 30px;
  }
  .item:before {
    content: "từ ";
  }
  .item + .item:before {
    content: " đến ";
  }
  .list-detail{
    margin-top: 50px;
  }
  .custom-date-picker.el-date-picker>.el-picker-panel__sidebar{
      width: 200px!important;
    }
  .card-footer-page {
    padding-top: 30px;
  }
  .page-item.active .page-link {
    z-index: 1;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
  .pagination-container{
    display: block!important;
  }
  .el-badge__content {
    background-color: #ff4949;
    border-radius: 10px;
    color: #FFFFFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 6px 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #FFFFFF;
  }
</style>
