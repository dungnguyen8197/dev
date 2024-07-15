<template>
  <el-row class="app-container list-shop">
    <!-- <el-row> -->
    <el-row class="list-shop__header">
      <!-- <el-col :sm="12">
          <h3>{{ ('home') }}</h3>
        </el-col> -->
      <!-- <el-row style="display: ruby;"> -->
      <el-col :sm="12">
        <el-row style="display: ruby;">
          <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
          <h3 style="color: #3C3D40; font-size: 20px;">{{ shop_name.length ? `${('home_revenue')} - ${shop_name}` : ('home_revenue') }}</h3>
        </el-row>
      </el-col>
      <el-col :sm="12" style="justify-content: flex-end; display: flex; align-items: center;">
        <!-- <div class="text-right"> -->
        <!-- <el-button type="primary" @click="onRevenuePress">{{ ('statistical_revue') }}</el-button> -->
        <el-button :loading="loadingTable" icon="el-icon-refresh" @click="onResetSearch">{{ ('reload') }}</el-button>
        <!-- </div> -->
      </el-col>
      <!-- </el-row> -->
      <!-- <el-col :sm="12">
              <div class="text-right">
                <el-button v-if="is_write" type="primary" @click="onShowDialogCreate">{{ ('add') }}</el-button>
              </div>
            </el-col> -->
    </el-row>
    <!-- </el-row> -->
    <el-row>
      <div style="border-radius: 10px; border-width: 1px; background-color: #5F6368; min-height: 100px; padding-left: 10px; padding-right: 10px; padding-top: 10px; padding-bottom: 10px;">
        <span style="font-size: 16px; color: white;">{{ ('total_bill') }}</span>
        <el-row :sm="24">
          <el-col :sm="6">
            <span class="label_text">{{ ('from_start_day') }}</span>
            <span class="value_text">{{ `${('bill').format(doashboard.today_count_delivery ? doashboard.today_count_delivery : 0)}: ${('price_vnd_2').format(formatNumber(doashboard.today_total_price ? doashboard.today_total_price : 0))}` }}</span>
            <!-- <el-col>
              <el-row>
                <span class="value_text">Số đơn</span>
                <span class="value_text">{{ doashboard.today_count_delivery ? doashboard.today_count_delivery : 0 }}</span>
              </el-row>
              <el-row>
                <span class="value_text">Tổng tiền</span>
                <span class="value_text">{{ doashboard.today_total_price ? doashboard.today_total_price : 0 }}</span>
              </el-row> -->
            <!-- </el-col> -->
          </el-col>
          <el-col :sm="6">
            <span class="label_text">{{ ('yesterday') }}</span>
            <span class="value_text">{{ `${('bill').format(doashboard.yesterday_count_delivery ? doashboard.yesterday_count_delivery : 0)}: ${('price_vnd_2').format(formatNumber(doashboard.yesterday_total_price ? doashboard.yesterday_total_price : 0))}` }}</span>
            <!-- <span class="value_text">20 đơn: 2.000.0000đ</span> -->
          </el-col>
          <el-col :sm="6">
            <span class="label_text">{{ ('from_start_month') }}</span>
            <span class="value_text">{{ `${('bill').format(doashboard.month_count_delivery ? doashboard.month_count_delivery : 0)}: ${('price_vnd_2').format(formatNumber(doashboard.month_total_price ? doashboard.month_total_price : 0))}` }}</span>
            <!-- <span class="value_text">20 đơn: 2.000.0000đ</span> -->
          </el-col>
          <el-col :sm="6">
            <span class="label_text">{{ ('last_month') }}</span>
            <span class="value_text">{{ `${('bill').format(doashboard.last_month_count_delivery ? doashboard.last_month_count_delivery : 0)}: ${('price_vnd_2').format(formatNumber(doashboard.last_month_total_price ? doashboard.last_month_total_price : 0))}` }}</span>
            <!-- <span class="value_text">20 đơn: 2.000.0000đ</span> -->
          </el-col>
        </el-row>
      </div>
    </el-row>
    <el-row>
      <el-col :sm="24" style="margin-top: 30px;">
        <!-- <img :src="require('@/icons/svg/icon_datetime.svg')" style="width: 20px; height: 30px;"> -->
        <el-select
          v-model="filter_id"
          style="width: 40%;"
        >
          <el-option
            v-for="filter in filters"
            :key="filter.id"
            :label="filter.name"
            :value="filter.id"
            style="width: 100%;"
          />
        </el-select>
        <!-- <div class="grid-content bg-purple" style="padding-bottom: 10px">
          <label style="font-weight:unset">{{ ('filter_date_create') }}: </label>
          <el-date-picker
            v-model="value1"
            style="margin: 0 5px"
            type="datetimerange"
            align="right"
            unlink-panels
            :range-separator="('to')"
            :start-placeholder="('start_time')"
            :end-placeholder="('finish_time')"
            format="dd-MM-yyyy HH:mm:ss"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </div> -->
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-row>
        <span style="font-size: 16px; color: #202124;">{{ ('suppler_succes') }}</span>
      </el-row>
      <el-row class="list-shop__data" style="margin-top: 10px;">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            :label="('id')"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-link type="primary" @click="onDetailPress(scope.row)">{{ `#${scope.row.shop_id}` }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="shop_name"
            :label="('shop_name_')"
            align="center"
          />
          <el-table-column
            prop="count_delivered"
            :label="('total_delivered')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ scope.row.count_delivered }}</span>
              <span v-if="scope.row.count_delivered_compare === 0" class="text_nomal">{{ ` (${scope.row.count_delivered_compare})` }}</span>
              <span v-if="scope.row.count_delivered_compare < 0" class="text_sub">{{ ` (${scope.row.count_delivered_compare}) (-${scope.row.count_delivered_percen}%)` }}</span>
              <span v-if="scope.row.count_delivered_compare > 0" class="text_add">{{ ` (+${scope.row.count_delivered_compare}) (+${scope.row.count_delivered_percen}%)` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="('doanh_thu')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.total_price)) }}</span>
              <span v-if="scope.row.total_price_compare === 0" class="text_nomal">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))})` }}</span>
              <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))}) (-${scope.row.total_price_percen}%)` }}</span>
              <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))}) (+${scope.row.total_price_percen}%)` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="count_delivering"
            :label="('capital_price')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.total_cost)) }}</span>
              <span v-if="scope.row.total_cost_compare === 0" class="text_nomal">{{ ` (${ ('price_vnd_2').format(formatNumber(scope.row.total_cost_compare)) })` }}</span>
              <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}) (-${scope.row.total_cost_percen}%)` }}</span>
              <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}) (+${scope.row.total_cost_percen}%)` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="('gross_profit')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.loi_nhuan)) }}</span>
              <span v-if="scope.row.loi_nhuan_compare === 0" class="text_nomal">{{ ` (${ ('price_vnd_2').format(formatNumber(scope.row.loi_nhuan_compare))})` }}</span>
              <span v-if="scope.row.loi_nhuan_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.loi_nhuan_compare))}) (-${scope.row.loi_nhuan_percen}%)` }}</span>
              <span v-if="scope.row.loi_nhuan_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.loi_nhuan_compare))}) (+${scope.row.loi_nhuan_percen}%)` }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="count_return"
            :label="('total_order_return')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ scope.row.count_return }}</span>
              <span v-if="scope.row.count_return_compare === 0" class="text_nomal">{{ ` (${scope.row.count_return_compare})` }}</span>
              <span v-if="scope.row.count_return_compare < 0" class="text_sub">{{ ` (${scope.row.count_return_compare}) (-${scope.row.count_return_percen}%)` }}</span>
              <span v-if="scope.row.count_return_compare > 0" class="text_add">{{ ` (+${scope.row.count_return_compare}) (+${scope.row.count_return_percen}%)` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_product"
            :label="('total_product')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ scope.row.total_product }}</span>
              <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
              <span v-if="scope.row.total_product_compare < 0" class="text_sub">{{ ` (${scope.row.total_product_compare}) (-${scope.row.total_product_percen}%)` }}</span>
              <span v-if="scope.row.total_product_compare > 0" class="text_add">{{ ` (+${scope.row.total_product_compare}) (+${scope.row.total_product_percen}%)` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_price"
            :label="('total_money')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.total_price)) }}</span>
              <span v-if="scope.row.total_price_compare === 0" class="text_nomal">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))})` }}</span>
              <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))}) (-${scope.row.total_price_percen}%)` }}</span>
              <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))}) (+${scope.row.total_price_percen}%)` }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
              :label="('logo_menu')"
              align="center"
            >
              <template slot-scope="scope">
                <span class="demonstration">{{ scope.row.contain }}</span>
                <el-image
                  v-if="scope.row.logo_menu"
                  :src="scope.row.logo_menu"
                  :fit="contain"
                />
              </template>
            </el-table-column> -->
          <!-- <el-table-column
              prop="name"
              :label="('shop_name')"
              align="center"
            /> -->
        </el-table>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import ShopResource from '@/api/manage_supplier/statistical'
import { getAcountInfo } from '@/utils/auth'
// import icon_datetime from '@/icons/svg/icon_datetime.svg'
import { formatNumber } from '@/utils/convert'
import { get_ranger_time_today, get_ranger_time_yesterday, get_ranger_time_week, get_ranger_time_month, get_ranger_time_same_date_last_week } from '@/utils/utils'
// import PieChart from '@/views/dashboard/chart/PieChart.vue'

// import moment from 'moment'
const shopResource = new ShopResource()

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
  let end_date =
    end.getTime() -
        timestamp +
        23 * 60 * 60 * 1000 +
        59 * 60 * 1000 +
        59 * 1000
  end_date = new Date(end_date)
  return end_date
}

export default {
  name: 'ShopStatisticalRevenueView',
  // components: { Detail, DialogFormShop, Pagination, DetailShop, ScreenDetail, ScreenContract },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      pickerOptions: {
        shortcuts: [
          {
            text: ('Tuần trước'),
            onClick(picker) {
              const end = getEndDate(new Date())
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              start = getStartDate(start)
              console.log(start, end)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: ('Tháng trước'),
            onClick(picker) {
              const end = getEndDate(new Date())
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              start = getStartDate(start)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: ('3 tháng trước'),
            onClick(picker) {
              const end = getEndDate(new Date())
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              start = getStartDate(start)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: ('Từ đầu đến giờ'),
            onClick(picker) {
              picker.$emit('pick', [0, 0])
            }
          }
        ]
      },
      value1: '',
      filters: [
        {
          id: 1,
          name: ('Đầu ngày tới giờ')
        },
        {
          id: 2,
          name: ('Ngày hôm qua so với cùng ngày tuần trước')
        },
        {
          id: 3,
          name: ('7 ngày qua so với 7 ngày trước đó')
        },
        {
          id: 4,
          name: ('Tháng qua so với tháng trước đó')
        }
      ],
      filter_id: 1,
      tableData: [],
      listQuery: {},
      doashboard: '',
      chart_data: [],
      shop_id: 0,
      shop_name: ''
    }
  },
  watch: {
    value1(value) {
      let start = value[0]
      let end = value[1]
      start = new Date(start).getTime()
      end = new Date(end).getTime()
      this.listQuery.date_create_from = start
      this.listQuery.date_create_to = end
      this.onGetListShop()
    },
    filter_id(val) {
      if (val === 1) { // dau ngay doi gio lay tu 0h00
        const ranger = get_ranger_time_today()
        this.listQuery.date_from = ranger[0] // start.getTime()
        this.listQuery.date_to = ranger[1]
      } else if (val === 2) { // thong ke ngay hom qua so voi cung ngay tuan truoc
        const ranger = get_ranger_time_yesterday()
        this.listQuery.date_from = ranger[0] // start.getTime()
        this.listQuery.date_to = ranger[1]
      } else if (val === 3) {
        const ranger = get_ranger_time_week()
        this.listQuery.date_from = ranger[0] // start.getTime()
        this.listQuery.date_to = ranger[1]
      } else if (val === 4) {
        const ranger = get_ranger_time_month()
        this.listQuery.date_from = ranger[0] // start.getTime()
        this.listQuery.date_to = ranger[1]
      }
      this.listQuery.type = val
      this.requestStatisticalSupplierList()
    }
  },
  created() {
    const query = this.$route.query
    if (query) {
      this.shop_id = parseInt(query.shop_id) || 0
      if (this.shop_id) {
        this.requestShopDetail()
      }
    }
    //   this.onGetListShop()
    // this.onGetProvinceList()
    const ranger = get_ranger_time_today() // mac dinh dau ngay toi gio
    this.listQuery.date_from = ranger[0] // start.getTime()
    this.listQuery.date_to = ranger[1]
    this.listQuery.type = 1
    this.listQuery.shop_id = this.shop_id
    this.requestStatisticalSupplierList()
    this.requestStatisticalHome()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    /**
     * Xem thống kê doanh thu theo kênh bán hàng
     */
    onRevenuePress() {
      this.$router.push({ path: `/statistical_revenue` })
    },
    onResetSearch() {
      this.requestStatisticalSupplierList()
      this.requestStatisticalHome()
    },
    requestShopDetail() {
      shopResource.get_name_shop(this.shop_id).then(res => {
        console.log('........... detail shop ', JSON.stringify(res))
        const { error, data } = res
        if (error === 0) {
          this.shop_name = data.name
        }
      })
    },
    /**
     * xem thong ke 1 shop
     */
    onDetailPress(row) {
      this.$router.push({ path: `/detail_statistical?shop_id=${row.shop_id}` })
    },
    drawChart(data) {
      console.log('........... draw chart ', JSON.stringify(data))
      if (this.$refs.chartPie) {
        this.$refs.chartPie.drawChart(data.map(d => d.percent), data.map(d => d.user_name))
      }
      // this.chart_data = [...data]
    },
    requestStatisticalHome() {
      shopResource.statistical_home(this.shop_id).then(res => {
        const { error, data } = res
        if (error === 0) {
          this.doashboard = data
          console.log('.......... doash board ', JSON.stringify(data))
        }
      })
    },
    requestStatisticalSupplierList() {
      this.loadingTable = true
      shopResource.statistical_revenue(this.listQuery).then(res => {
        const { error, data, msg } = res
        this.loadingTable = false
        console.log('.................. thong ke ', JSON.stringify(res), this.loadingTable)
        if (error === 0) {
          this.tableData = data
          const total_count_delivered = data.map(d => d.count_delivered).reduce((a, b) => a + b, 0)
          const statistical = []
          for (const shop of data) {
            const user = {}
            if (shop.count_delivered) {
              user.total = shop.count_delivered
              user.percent = Math.round((shop.count_delivered / total_count_delivered) * 100)
              user.user_name = shop.shop_name
              statistical.push(user)
            }
          }
          this.drawChart(statistical)
        } else {
          this.$message.error(msg)
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('........... error', err)
      })
    },
    random_bg_color() {
      const x = Math.floor(Math.random() * 256)
      const y = Math.floor(Math.random() * 256)
      const z = Math.floor(Math.random() * 256)
      const bgColor = 'rgb(' + x + ',' + y + ',' + z + ')'
      return bgColor
    },

    formatNumber,
    get_ranger_time_today,
    get_ranger_time_yesterday,
    get_ranger_time_week,
    get_ranger_time_month,
    get_ranger_time_same_date_last_week
  }
}
</script>
  <style lang="scss" scoped>
    .search-wrapper{
      margin-bottom: 10px;
    }
    .row_item{
      margin-right: 3px;
    }
    .el-col-sm-6 {
      width: 25%;
      display: grid;
      margin-top: 20px;
    }
    .value_text {
        font-size: 20px;
        color: white;
        margin-top: 5px;
        font-weight: 500;
    }
    .label_text {
        font-size: 16px;
        color: #CFD0D2;
    }
    .statistical {
        border: solid;
        border-radius: 10px;
        border-width: 1px;
        border-color: gray;
        background-color: white;
        min-height: 100px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-top: 20px;
    }
    .text_add {
      color: #1F7F3B;
      font-size: 16px;
    }
    .text_nomal {
      color: #000;
      font-size: 16px;
    }
    .text_sub {
      color: #D76E6D;
      font-size: 16px;
    }
    </style>
