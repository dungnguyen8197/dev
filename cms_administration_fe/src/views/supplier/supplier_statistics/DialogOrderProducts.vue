<template>
  <el-dialog
    style="right: 0px"
    :visible.sync="showDetail"
    width="100%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="dialog-show-info"
    :lock-scroll="false"
  >
    <h3 style="color: black;">{{ listQuery.type_statistical === 1 ? (name.length ? `Danh sách sản phẩm trong đơn thống kê nhà cung cấp(${name})` : 'Danh sách sản phẩm trong đơn thống kê') : (name.length ? `Danh sách sản phẩm trong đơn thống kê kênh(${name})` : 'Danh sách sản phẩm trong đơn thống kê') }}</h3>
    <div id="brand-table-id" style="margin-top: 20px;">
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <!-- <el-table-column prop="stt" label="STT" width="60" align="center" /> -->
        <el-table-column prop="code" label="Mã SP" align="center" width="80px" />

        <el-table-column prop="logo" label="Logo" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.logo ? scope.row.logo : ''"
              style="width: 100px;"
              @error="handleImageError(scope.row)"
            >
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Tên sản phẩm" align="center" />
        <el-table-column prop="category_name" label="Hạng mục" align="center" />
        <el-table-column prop="number" label="Số lượng" align="center" width="90px" />
        <el-table-column prop="size" label="Thuộc tính 1" align="center" />
        <el-table-column prop="color" label="Thuộc tính 2" align="center" />
        <el-table-column prop="priceFormat" label="Giá niêm yết" align="center" />
        <el-table-column prop="priceSaleFormat" label="Giá bán" align="center" />
        <el-table-column prop="costFormat" label="Giá nhập" align="center" />
        <!-- <el-table-column prop="supplierName" label="Nhà cung cấp" align="center" /> -->
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getListOrder" />
      </el-row>
    </div>

  </el-dialog>
</template>

<script>
import ManageRevenueResource from '@/api/manage_supplier/revenue'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
const manageRevenueResource = new ManageRevenueResource()

export default {
  name: 'DialogOrderProducts',
  components: {
    Pagination
  },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    offsetTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialog: {
        titleName: 'Thông tin doanh thu đơn hàng'
      },
      tableData: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      showDetail: false,
      shop_id: 0,
      name: ''
    }
  },
  mounted() {
    this.listQuery.delivery_bill_id = this.objectData.id
    this.getListOrder()
    console.log('objectData', this.objectData)
  },
  methods: {
    formatNumber,
    handleClose() {
      this.showDetail = false
    },
    handleImageError(event) {
      event.showImage = false
    },
    show(is_show, y, shop_info, params) {
      this.showDetail = is_show
      this.tableData = []
      // this.offsetTop = y
      this.shop_id = shop_info.id
      console.log('.........thong tin san pham ', JSON.stringify(params))
      // {"date_from":1709251200000,"date_to":1711843200000,"type_statistical":1,"page":1} 3329
      this.listQuery.limit = 8
      this.listQuery.page = 1
      this.listQuery.date_from = params.date_from
      this.listQuery.date_to = params.date_to
      this.listQuery.type_statistical = params.type_statistical
      this.listQuery.id = this.shop_id
      this.name = shop_info.name
      this.getListOrder()
    },
    getListOrder() {
      this.loading = true
      manageRevenueResource.listStatisticalOrder(this.listQuery).then(res => {
        console.log('Danh sach san pham thong ke: ', JSON.stringify(res))
        const { error, data, total } = res
        if (error === 0) {
          if (this.listQuery.page === 1) {
            this.total = total
          }
          this.tableData = data
          // console.log('.........list table data: ', JSON.stringify(this.tableData))
          this.tableData.forEach((item, index) => {
            item.stt = (this.listQuery.page - 1) * this.listQuery.limit + index + 1
            item.code = item.product_code
            item.logo = item.thumb
            item.size = item.size ? item.size.replace('null', '') : ''
            item.color = item.color ? item.color.replace('null', '') : ''
            item.priceFormat = this.formatNumber(item.price) + 'đ'
            item.priceSaleFormat = this.formatNumber(item.price_sale) + 'đ'
            item.costFormat = this.formatNumber(item.cost) + 'đ'
            item.profit = this.formatNumber(item.profit) + 'đ'
            // item.supplierName = item.product.shop.name
            item.category_name = item.category ? item.category.name : ''
          })
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('Lỗi khi lấy dữ liệu đơn hàng')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
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
.dialog-show-info {
  padding: 0px !important;
}
</style>

<!-- <style>
.el-popup-parent--hidden {
  padding-right: 0px !important;
}
</style> -->
