<template>
  <div class="dialog-show-info">
    <div style="display: flex; margin-top: 10px; justify-content: space-between;">
      <div style="display: flex;">
        <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="font-size: 20px; color: black">Top sản phẩm bán chạy</h3>
      </div>
      <div>
        <el-button style="margin-left: 10px; float: right;" type="primary" :loading="loadingHome" icon="el-icon-refresh" @click="onRefresh">{{ ('Làm mới') }}</el-button>
        <div style="display: flex; justify-content: right; align-items: center;">
          <!-- <h3 style="font-size: 20px; color: black">Top sản phẩm bán chạy</h3> -->
          <el-date-picker
            v-model="dateRangeProduct"
            style="width: 300px; float: right;"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="Đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            @change="handleChangeDateRange"
          />
        </div>
      </div>
    </div>

    <div id="brand-table-id" style="margin-top: 20px;">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="product_code"
          :label="('Mã sản phẩm')"
          align="center"
        />

        <el-table-column
          prop="name"
          :label="('Tên sản phẩm')"
          align="center"
        />

        <el-table-column
          label="Logo"
          align="center"
          width="130"
        >
          <template slot-scope="scope">
            <el-link type="primary">
              <el-image
                v-if="scope.row.thumb"
                :src="scope.row.thumb ? scope.row.thumb : ''"
                :fit="contain"
              />
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="category.name"
          :label="('Hạng mục')"
          align="center"
        />

        <el-table-column
          prop="number"
          :label="('Số lượng')"
          align="center"
        />
        <el-table-column
          :label="('Doanh thu')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatNumber(scope.row.total_price) }} đ</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="('Tổng giá nhập')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatNumber(scope.row.total_cost) }} đ</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="('Lợi nhuận')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatNumber(scope.row.total_profit) }} đ</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="shop.name"
          :label="('Nhà cung cấp')"
          align="center"
        />
        <!-- <el-table-column
          :label="('Giá niêm yết')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatNumber(scope.row.price) }} đ</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="('Giá bán')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatNumber(scope.row.price_sale) }} đ</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="('Giá nhập')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatNumber(scope.row.cost) }} đ</span>
          </template>
        </el-table-column> -->
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getListOrder" />
      </el-row>
    </div>

  </div>
</template>

<script>
// import ManageRevenueResource from '@/api/manage_supplier/revenue'
import ShopResource from '@/api/manage_supplier/statistical'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import { get_ranger_time_month } from '@/utils/utils'

import moment from 'moment'
const shopResource = new ShopResource()

export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialog: {
        titleName: 'Thông tin doanh thu đơn hàng'
      },
      tableData: [],
      tableDataSupplierAll: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      listQueryAll: {
        page: 1,
        limit: 10
      },
      total: 0,
      totalSupplier: 0,
      dateRangeProduct: '',
      dateRangeDebt: '',
      filters: [
        {
          id: 1,
          name: ('Tìm theo mã NCC')
        },
        {
          id: 2,
          name: ('Tìm theo tên NCC')
        }
      ],
      filter_id: 1,
      sources: [
        {
          id: 1,
          name: ('Theo nhà cung cấp')
        },
        {
          id: 2,
          name: ('Theo kênh bán hàng')
        }
      ],
      source_id: 1
    }
  },
  mounted() {
    const ranger = get_ranger_time_month() // mac dinh dau ngay toi gio
    const date_from = ranger[0]
    const date_to = ranger[1]
    this.listQuery.date_from = ranger[0] // start.getTime()
    this.listQuery.date_to = ranger[1]
    this.dateRangeProduct = [moment(date_from).format('YYYY-MM-DD'), moment(date_to).format('YYYY-MM-DD')]

    this.listQueryAll.date_from = ranger[0] // start.getTime()
    this.listQueryAll.date_to = ranger[1]
    this.dateRangeDebt = [moment(date_from).format('YYYY-MM-DD'), moment(date_to).format('YYYY-MM-DD')]
    // this.listQuery.delivery_bill_id = this.objectData.id
    this.getListOrder()
    // this.getListSupplierAll()
    // console.log('objectData', this.objectData)
  },
  methods: {
    formatNumber,
    handleClose() {
      this.$emit('closeDialog')
    },
    handleImageError(event) {
      event.showImage = false
    },
    handleChangeDateRange(val) {
      if (val && val.length === 2) {
        const startDate = val[0]
        const endDate = val[1]
        this.dateRangeText = `Thống kê từ ${moment(startDate).format('DD/MM/YYYY')} đến ${moment(endDate).format('DD/MM/YYYY')}`
      }
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.date_from = startDate.getTime()
      this.listQuery.date_to = endDate.getTime()
      // this.requestStatisticalSupplierList()
      console.log(this.listQuery)
      this.getListOrder()
    },
    handleChangeDateRangeSupplierAll(val) {
      if (val && val.length === 2) {
        const startDate = val[0]
        const endDate = val[1]
        this.dateRangeText = `Thống kê từ ${moment(startDate).format('DD/MM/YYYY')} đến ${moment(endDate).format('DD/MM/YYYY')}`
      }
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQueryAll.page = 1
      this.listQueryAll.date_from = startDate.getTime()
      this.listQueryAll.date_to = endDate.getTime()
      // this.requestStatisticalSupplierList()
      console.log(this.listQueryAll)
      this.getListSupplierAll()
    },
    getListOrder() {
      this.loading = true
      shopResource.list_product_order(this.listQuery).then(res => {
        console.log(res, 'asdasasd')
        if (this.listQuery.page === 1) {
          this.total = res.total
        }
        const { data, error } = res
        if (error !== 0) throw new Error('Lỗi khi lấy dữ liệu đơn hàng')
        this.tableData = data
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    getListSupplierAll() {
      this.listQueryAll.type_statistical = this.source_id
      shopResource.list_statistical_supplier_for_all(this.listQueryAll).then(res => {
        const { error, data, msg } = res
        console.log('.................. thong ke ', JSON.stringify(res))
        if (error === 0) {
          this.tableDataSupplierAll = data
          // const total_count_delivered = data.map(d => d.count_delivered).reduce((a, b) => a + b, 0)
          // const statistical = []
          // for (const shop of data) {
          //   const user = {}
          //   if (shop.count_delivered) {
          //     user.total = shop.count_delivered
          //     user.percent = Math.round((shop.count_delivered / total_count_delivered) * 100)
          //     user.user_name = shop.shop_name ? shop.shop_name : shop.chanel_name
          //     statistical.push(user)
          //   }
          // }
        } else {
          this.$message.error(msg)
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('........... error', err)
      })
    },
    handleExportExcel() {
      this.requestStatisticalSupplierListExport()
      console.log('xuaast execel')
    },
    onBack() {
      this.$router.back()
    },
    onRefresh() {
      const ranger = get_ranger_time_month() // mac dinh dau ngay toi gio
      const date_from = ranger[0]
      const date_to = ranger[1]
      this.listQuery.date_from = ranger[0] // start.getTime()
      this.listQuery.date_to = ranger[1]
      this.dateRangeProduct = [moment(date_from).format('YYYY-MM-DD'), moment(date_to).format('YYYY-MM-DD')]
      this.getListOrder()
    },
    // onSearchPress() {
    //   this.listQuery.page = 1
    //   this.getListOrder()
    // },
    onSearchPressSupplier() {
      this.listQueryAll.page = 1
      this.getListSupplierAll()
    }
  }
}
</script>

<style scoped>
.dialog-show-info {
  padding: 20px;
}
.el-dialog__wrapper {
  position: absolute;
}
::v-deep .el-dialog {
  margin-top: 0px !important;
  margin-bottom: 180px;
}
.flex-item-dialog {
  /* margin: 10px 10px 10px 20px; */
  width: 24%;
}
.font-lable {
  font-weight: bold;
  color: black;
  font-size: 15px;
}
.font-value {
  font-weight: 400;
}
::v-deep body.el-popup-parent--hidden {
  overflow: hidden !important;
  padding-right: 0px !important;
}
::v-deep .el-range-editor--medium .el-range-separator {
  width: 20px;
}
::v-deep .el-range-editor.el-input__inner {
  margin: 0px !important;
}
</style>

<!-- <style>
.el-popup-parent--hidden {
  padding-right: 0px !important;
}
</style> -->
