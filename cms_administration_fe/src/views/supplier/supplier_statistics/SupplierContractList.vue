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
          <h3 style="color: #3C3D40; font-size: 20px;">{{ ('list_contract_no_approve') }}</h3>
        </el-row>
      </el-col>
      <el-col :sm="12" style="justify-content: flex-end; display: flex; align-items: center;">
        <!-- <div class="text-right"> -->
        <!-- <el-button type="primary" @click="onRevenuePress">{{ ('statistical_revue') }}</el-button> -->
        <el-button :loading="loadingTable" icon="el-icon-refresh" @click="onResetSearch">{{ ('Làm mới') }}</el-button>
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
    <el-row style="margin-top: 20px;">
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
              <el-link type="primary" @click="onDetailPress(scope.row)">{{ `#${scope.row.id}` }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="('Tên hợp đồng')"
            align="center"
          />
          <el-table-column
            prop="Tên nhà cung cấp"
            :label="('Nhà cung cấp')"
            align="center"
          />
          <el-table-column
            prop="type_name"
            :label="('Loại hợp đồng')"
            align="center"
          />
          <el-table-column
            prop="date_sign"
            :label="('Ngày đăng kí')"
            align="center"
          />
          <el-table-column
            prop="account_sign_name"
            :label="('Người ký')"
            align="center"
          />
          <el-table-column
            :label="('Tình trạng')"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ (scope.row.active === 1) ? ('_active') : ('_inactive') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="('active')"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="(scope.row.approve === 1) ? 'success' : 'danger'">{{ (scope.row.approve === 1) ? ('approve') : (scope.row.approve === 2 ? ('reject') : ('pedding')) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="account_approve_name"
            :label="('Người duyệt')"
            align="center"
          />
          <el-table-column
            prop="approve_date"
            :label="('Ngày duyệt')"
            align="center"
          />
          <el-table-column v-if="is_delete || is_edit" :label="('action')" align="center">
            <template slot-scope="scope">
              <!-- <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" /> -->
              <el-row>
                <el-button
                  v-if="is_edit && scope.row.active === 0"
                  size="small"
                  :title="('Bật bản hợp đồng')"
                  type="primary"
                  icon="el-icon-check"
                  circle
                  @click="onActivePress(scope.row)"
                />
                <el-button
                  v-if="is_edit && scope.row.active === 1"
                  size="small"
                  :title="('Tắt bản hợp đồng')"
                  type="danger"
                  icon="el-icon-close"
                  circle
                  @click="onInActivePress(scope.row)"
                />
                <el-button v-if="is_delete" size="small" :title="('Xoá hợp đồng')" type="danger" icon="el-icon-delete" circle @click="onDeletePress(scope.row)" />
              </el-row>
              <el-row>
                <el-button v-if="is_write" size="small" :title="('Duyệt hợp đồng này')" type="primary" icon="el-icon-check" circle @click="onApprovePress(scope.row)" />
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
// import ShopResource from '@/api/shop'
import SupplierResource from '@/api/supplier'
import { getAcountInfo } from '@/utils/auth'
// import ContractInfo from '../components/ContractInfo.vue'
// import icon_datetime from '@/icons/svg/icon_datetime.svg'
const supplierResource = new SupplierResource()
import { formatNumber } from '@/utils/convert'
import { get_ranger_time_today, get_ranger_time_yesterday, get_ranger_time_week, get_ranger_time_month, get_ranger_time_same_date_last_week } from '@/utils/utils'
// import PieChart from '@/views/dashboard/chart/PieChart.vue'
// import PieChart from './PieChart.vue'
// import LineChart from './LineChart.vue'

// import moment from 'moment'
// const shopResource = new ShopResource()

export default {
  name: 'ShopStatisticalHomeView',
  // components: { Detail, DialogFormShop, Pagination, DetailShop, ScreenDetail, ScreenContract },
  components: { },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      tableData: [],
      listQuery: {},
      doashboard: '',
      shop_id: 0,
      shop_name: '',
      loadingTable: false
    }
  },
  created() {
    const query = this.$route.query
    if (query) {
      this.shop_id = parseInt(query.shop_id) || 0
      // if (this.shop_id) {
      //   this.requestShopDetail()
      // }
    }
    this.requestListContactForApprove()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    onApprovePress(row) {
      this.requestApprove(row)
    },
    onDeletePress(row) {
      this.requestDeleteContract(row)
    },
    requestApprove(row) {
      this.$confirm(('Bạn có chắc muốn phê duyệt bản hợp đồng này?')).then(_ => {
        supplierResource.approve_contract({ id: row.id }).then(res => {
          const { error, msg } = res
          console.log('........... tao moi nha cung cap ', JSON.stringify(res))
          if (error === 0) {
            this.$msgbox(msg).then(_ => {
              // this.shopDetail.approve = 1
              const index = this.tableData.findIndex(d => d.id === row.id)
              if (index !== -1) {
                this.tableData.splice(index, 1)
              }
              // this.approve = 1
            })
          } else {
            this.$msgbox(msg)
            // this.resetAllInfo()
          }
        }).catch(err => {
          console.log('.......... tao don co loi ', err)
          this.loadingTable = false
          this.$msgbox(('Có lỗi xảy ra, vui lòng quay lại sau!'))
        })
      }).catch(_ => {})
    },
    /**
     * Lấy list hợp đồng cần duyệt
    */
    requestListContactForApprove() {
      this.loadingTable = true
      supplierResource.list_contact_not_approve().then(res => {
        this.loadingTable = false
        const { error, data } = res
        console.log('.......... list hop dong : ', JSON.stringify(res))
        if (error === 0) {
          this.tableData = data
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('............ danh sach nha cung cap : ', err)
      })
    },
    onActivePress(row) {
      this.requestChangeStateContact(row, 1)
    },
    onInActivePress(row) {
      this.requestChangeStateContact(row, 0)
    },
    requestChangeStateContact(row, active = 1) {
      const msg = active === 1 ? ('Bạn có chắc muốn kích hoạt hợp đồng không?').format(row.name) : ('Bạn có chắc muốn ẩn hợp đồng không?').format(row.name)
      this.$confirm(msg).then(_ => {
        const body = {
          id: row.id,
          active: active
        }
        supplierResource.contract_change_state(body).then(response => {
          const { error, msg } = response
          if (error === 0) {
            this.$message.success(msg)
            const obj = this.tableData.find(d => d.id === row.id)
            if (obj) {
              obj.active = active
            }
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(_ => {})
    },
    requestDeleteContract(row) {
      this.$confirm(('Bạn có chắc muốn xoá hợp đồng không?').format(row.name)).then(_ => {
        const body = {
          id: row.id
        }
        supplierResource.delete_contract(body).then(response => {
          const { error, msg } = response
          if (error === 0) {
            this.$message.success(msg)
            const index = this.tableData.findIndex(d => d.id === row.id)
            if (index !== -1) {
              this.tableData.splice(index, 1)
            }
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(_ => {})
    },
    /**
     * Xem thống kê doanh thu theo kênh bán hàng
     */
    onRevenuePress() {
      this.$router.push({ path: `/statistical_revenue` })
    },
    onResetSearch() {
      this.requestListContactForApprove()
    },
    /**
     * xem thong ke 1 shop
     */
    onDetailPress(row) {
      this.$router.push({ path: `/contract?shop_id=${row.shop_id}&id=${row.id}` })
    },
    drawChart(data) {
      console.log('........... draw chart ', JSON.stringify(data))
      if (this.$refs.chartPie) {
        this.$refs.chartPie.drawChart(data.map(d => d.percent), data.map(d => d.user_name))
      }
      // this.chart_data = [...data]
    },
    requestStatisticalHome() {
      supplierResource.statistical_home(this.shop_id).then(res => {
        const { error, data } = res
        if (error === 0) {
          this.doashboard = data
          console.log('.......... doash board ', JSON.stringify(data))
        }
      })
    },
    requestStatisticalSupplierList() {
      this.loadingTable = true
      supplierResource.statistical_supplier_list(this.listQuery).then(res => {
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
    requestStatisticalWeek() {
      supplierResource.statistical_line_chart_week(this.shop_id).then(res => {
        console.log('............. thong ke 7 ngay ', JSON.stringify(res))
        const { error, data } = res
        if (error === 0) {
          const labels = data.lables
          const datas = data.datas
          console.log('............datas ', JSON.stringify(datas))
          datas.forEach(element => {
            // element.label = element.shop_id + ''
            element.data = element.datas
            element.backgroundColor = 'transparent'
            element.borderColor = this.random_bg_color()
            element.pointBackgroundColor = 'rgba(171, 71, 188, 1)'
            delete element.datas
            delete element.shop_id
          })
          if (this.$refs.chartLine) {
            this.$refs.chartLine.drawChart(datas, labels)
          }
        }
      })
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
    .value_text_2 {
        font-size: 18px;
        color: white;
        margin-top: 3px;
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
