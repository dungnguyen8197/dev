<template>
  <div class="dialog-show-info">
    <dialog-order-products-vue ref="refDialogOrderProducts" :offset-top="currentY" />
    <div style="display: flex; margin-top: 10px; justify-content: space-between;">
      <div style="display: flex;">
        <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="font-size: 20px; color: black">Thống kê nhà cung cấp</h3>
      </div>
      <div style="display: flex; flex-direction: row;">
        <div style="margin-right: 10px;">
          <el-button type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất Excel</el-button>
        </div>
        <div>
          <el-button :loading="loading" icon="el-icon-refresh" @click="onRefresh">{{ ('Refresh') }}</el-button>
        </div>
      </div>
    </div>
    <!-- <el-row>
      <el-col :sm="24" style="margin-top: 30px; display: flex; justify-content: right;">
        <div style="display: flex; flex-direction: row;">
          <div style="margin-right: 10px;">
            <el-button type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất Excel</el-button>
          </div>
          <div>
            <el-button :loading="loading" icon="el-icon-refresh" @click="onRefresh">{{ ('Refresh') }}</el-button>
          </div>
        </div>
      </el-col>

    </el-row> -->
    <div style="display: flex; justify-content: space-between; margin-top: 10px">
      <div style="margin-right: 10px; width: 100%;">
        <el-input v-model="listQueryAll.q" :placeholder="('Nhập để tìm kiếm')" icon="search" @keyup.enter.native="onSearchPressSupplier">
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
      </div>
      <div style="display: flex;">
        <div style="width: 180px; margin-right: 10px;">
          <el-select
            v-model="listQueryAll.type_search"
          >
            <el-option
              v-for="filter in filters"
              :key="filter.id"
              :label="filter.name"
              :value="filter.id"
            />
          </el-select>
        </div>
        <div style="width: 120px; margin-right: 10px;">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @keyup.enter="onSearchPressSupplier"
            @click="onSearchPressSupplier"
          >
            Tìm kiếm
          </el-button>
        </div>
        <el-date-picker
          v-model="dateRangeDebt"
          style="width: 300px; margin-right: 10px;"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="Đến"
          start-placeholder="Ngày tính doanh thu"
          end-placeholder="Ngày tính doanh thu"
          @change="handleChangeDateRangeSupplierAll"
        />
        <div style="width: 200px; margin-left: 10px">
          <el-select
            v-model="source_id"
          >
            <el-option
              v-for="source in sources"
              :key="source.id"
              :label="source.name"
              :value="source.id"
              style="width: 100%;"
            />
          </el-select>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px;">
      <el-row class="list-shop__data" style="margin-top: 10px;">
        <el-table
          v-loading="loading"
          :data="tableDataSupplierAll"
          border
          style="width: 100%"
        >
          <el-table-column
            v-if="source_id === 1"
            :label="('Mã NCC')"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ ` NCC ${scope.row.shop_info.id ? scope.row.shop_info.id : scope.row.source}` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="source_id === 1"
            prop="shop_info.name"
            :label="('Tên NCC')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.shop_info.name }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            v-if="source_id === 2"
            prop="chanel_name"
            :label="('Kênh bán hàng')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.shop_info.name }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_delivery"
            :label="('Tổng đơn tính doanh thu')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.total_delivery }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare > 0" class="text_add">{{ `${('Tăng')}: +${scope.row.count_delivered_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare > 0" class="text_add">{{ `${('Tỷ lệ')}: +${scope.row.count_delivered_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare < 0" class="text_sub">{{ `${('Giảm')}: ${scope.row.count_delivered_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare < 0" class="text_sub">{{ `${('Tỷ lệ')}: -${scope.row.count_delivered_percen}%` }}</span>
              </el-row>
            </template>
          </el-table-column>>
          <el-table-column
            prop="all_products"
            :label="('Tổng sản phẩm')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <el-link type="primary" @click="onShowAllProductPress(scope.row)">{{
                  scope.row.all_products
                }}</el-link>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare < 0" class="text_sub">{{ `${('giam')}: ${scope.row.total_product_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.total_product_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare > 0" class="text_add">{{ `${('tang')}: +${scope.row.total_product_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.total_product_percen}%` }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="all_revenue"
            :label="('Doanh thu')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ formatNumber(scope.row.all_revenue) }} đ</span>
              </el-row>
              <!-- <el-row>
                  <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
                </el-row> -->
              <el-row>
                <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ `giam: ${formatNumber(scope.row.total_price_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.total_price_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ `tang: +${formatNumber(scope.row.total_price_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.total_price_percen}%` }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="all_cost"
            :label="('Tổng giá nhập')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ formatNumber(scope.row.all_cost) }} đ</span>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column
            prop="all_refund_point"
            :label="('Tổng hoàn point')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ (scope.row.all_refund_point) }}</span>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column
            prop="all_profit"
            :label="('Lợi nhuận gộp')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ formatNumber(scope.row.all_profit) }} đ</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare < 0" class="text_sub">{{ `giam: ${formatNumber(scope.row.loi_nhuan_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.loi_nhuan_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare > 0" class="text_add">{{ `tang: +${formatNumber(scope.row.loi_nhuan_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.loi_nhuan_percen}%` }}</span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <pagination :total="totalSupplier" :limit.sync="listQueryAll.limit" :page.sync="listQueryAll.page" @pagination="getListSupplierAll" />
        </el-row>
      </el-row>
    </el-row>

  </div>
</template>

<script>
// import ManageRevenueResource from '@/api/manage_supplier/revenue'
import DialogOrderProductsVue from '../DialogOrderProducts.vue'
import ShopResource from '@/api/manage_supplier/statistical'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import { get_ranger_time_month } from '@/utils/utils'

import moment from 'moment'
const shopResource = new ShopResource()

export default {
  components: {
    Pagination, DialogOrderProductsVue
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
        limit: 10,
        type_search: 2
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
      // filter_id: 1,
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
  watch: {
    source_id(val) {
      this.getListSupplierAll()
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
    this.getListSupplierAll()
    window.addEventListener('scroll', this.getCurrentY)
    // console.log('objectData', this.objectData)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.getCurrentY)
  },
  methods: {
    formatNumber,
    getCurrentY() {
      this.currentY = window.scrollY
    },
    handleClose() {
      this.$emit('closeDialog')
    },
    handleImageError(event) {
      event.showImage = false
    },
    onShowAllProductPress(row) {
      if (this.$refs.refDialogOrderProducts) {
        this.$refs.refDialogOrderProducts.show(true, this.currentY, row.shop_info, this.listQuery, this.source_id)
      }
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
    getListSupplierAll() {
      this.listQueryAll.type_statistical = this.source_id
      this.loading = true
      shopResource.list_statistical_supplier_for_all(this.listQueryAll).then(res => {
        const { error, data, msg } = res
        console.log('.................. thong ke ', JSON.stringify(res))
        if (error === 0) {
          if (this.listQueryAll.page === 1) this.totalSupplier = res.total
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
        this.loading = false
        console.log('........... error', err)
      }).finally(() => {
        this.loading = false
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
        this.$message.success('Xuất file thành công, vui lòng vào thư mục donwload để xem')
      }, 250)
    },
    handleExportExcel() {
      this.requestStatisticalSupplierListExport()
      console.log('export excel')
    },
    requestStatisticalSupplierListExport() {
      this.listQuery.type_statistical = this.source_id
      shopResource.export_statistical(this.listQuery).then(res => {
        const { error, link } = res
        console.log('.................. thong ke ', JSON.stringify(res), this.loadingTable)
        if (error === 0) {
          this.confirmDowload(link)
        } else {
          this.$message.error('Lỗi khi xuất file excel')
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('........... error', err)
      })
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
      this.getListSupplierAll()
    },
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
