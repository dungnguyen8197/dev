<template>
  <el-dialog
    :style="{ top: offsetTop + 'px'}"
    style="right: 0px;"
    :visible.sync="showDetail"
    width="100%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="dialog-show-info"
  >
    <h3 style="color: black;">Thông tin doanh thu đơn hàng</h3>
    <hr>
    <h4 style="color: blueviolet;">Thông tin chung</h4>
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
      <div class="flex-item-dialog">
        <h6 class="font-lable">Mã đơn: <span class="font-value">{{ objectData.code }}</span></h6>
        <h6 class="font-lable">Nguồn: <span class="font-value">{{ objectData.name_source }}</span></h6>
        <h6 class="font-lable">Người thanh toán: <span class="font-value">{{ objectData.customerName }}</span></h6>
        <h6 class="font-lable">Trạng thái: <span class="font-value">{{ objectData.name_state_delivery }}</span></h6>
      </div>
      <div class="flex-item-dialog">
        <h6 class="font-lable">Doanh thu: <span class="font-value">{{ objectData.revenueFormat }}</span></h6>
        <h6 class="font-lable">Tổng giá nhập: <span class="font-value">{{ objectData.totalCostFormat }}</span></h6>
        <h6 class="font-lable">Tổng hoàn point: <span class="font-value">{{ objectData.totalPointFormat }}</span></h6>
        <h6 class="font-lable">Mã voucher:  <span class="font-value">{{ objectData.voucher_code }}</span></h6>
      </div>
      <div class="flex-item-dialog">
        <h6 class="font-lable">Lợi nhuận: <span class="font-value">{{ objectData.profitFormat }}</span></h6>
        <h6 class="font-lable">Giá vận chuyển:  <span class="font-value">{{ objectData.cod_price }}</span></h6>
        <h6 class="font-lable">Thanh toán: <span class="font-value">{{ objectData.name_payment }}</span></h6>
      </div>
      <div style="width: 25%;">
        <h6 class="font-lable">Sale xử lý: <span class="font-value">{{ objectData.saleName }}</span></h6>
        <h6 class="font-lable">Ngày tạo đơn: <span class="font-value">{{ objectData.createdAt }}</span></h6>
        <h6 class="font-lable">Ngày tính doanh thu: <span class="font-value">{{ objectData.date_complete }}</span></h6>
      </div>
    </div>
    <h6 class="font-lable">Ghi chú: <span class="font-value">{{ objectData.shop_noted }}</span></h6>
    <hr>
    <h4 style="color: blueviolet;">Chi tiết đơn hàng</h4>

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
        <el-table-column label="Giá nhập" align="center">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEditing">
              {{ scope.row.costFormat }}
              <el-button v-if="is_delete || is_edit" type="text" icon="el-icon-edit" @click="startEdit(scope.row)" />
            </div>
            <div v-else>
              <el-input v-model="scope.row.editingCost" size="small" />
              <el-button type="text" icon="el-icon-check" @click="saveEdit(scope.row)" />
              <el-button type="text" icon="el-icon-close" @click="cancelEdit(scope.row)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="Nhà cung cấp" align="center" />
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getListOrder" />
      </el-row>
    </div>

  </el-dialog>
</template>

<script>
import ManageRevenueResource from '@/api/manage_supplier/revenue'
import ManageSupplierResource from '@/api/manage_supplier/supplier'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'

const manageRevenueResource = new ManageRevenueResource()
const supplierResources = new ManageSupplierResource()
export default {
  name: 'DialogShowInfo',
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
    showDetail: {
      type: Boolean,
      default: false
    },
    offsetTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      is_delete: 0, // account.is_delete,
      is_write: 0, // account.is_write,
      is_edit: 0, // account.is_edit,
      is_export: 0,
      is_view: 0,
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
      note: 'Các khoản công nợ được cập nhật kịp thời vào sổ chi tiết ngay khi phát sinh; Cuối tháng, kế toán công nợ sẽ tổng hợp lại để tính tổng công nợ với từng khách hàng, nhà cung cấp, sau đó đối chiếu số liệu 2 bên.'
    }
  },
  mounted() {
    this.listQuery.delivery_bill_id = this.objectData.id
    this.getListOrder()
    console.log('objectData', this.objectData)
    this.requestListPermissionMenu()
  },
  methods: {
    requestListPermissionMenu() {
      const roles = this.$router.history.current.meta.roles
      let menu_id = roles && roles.length ? roles[0] : 0
      menu_id = parseInt(menu_id.replace('NCC', ''))
      const account = getAcountInfo()
      const email = account.email
      get_list_permission(email, menu_id, (data) => {
        console.log('............list data 1', JSON.stringify(data))
        if (data) {
          let { is_supper_admin, is_add, is_view, is_edit, is_delete, is_export } = data
          is_supper_admin = parseInt(is_supper_admin) || 0
          is_add = parseInt(is_add) || 1
          is_view = parseInt(is_view) || 1
          is_edit = parseInt(is_edit) || 1
          is_delete = parseInt(is_delete) || 1
          is_export = parseInt(is_export) || 1
          this.is_delete = is_supper_admin ? 1 : is_delete - 1
          this.is_write = is_supper_admin ? 1 : is_add - 1
          this.is_edit = is_supper_admin ? 1 : is_edit - 1
          this.is_export = is_supper_admin ? 1 : is_export - 1
          this.is_view = is_supper_admin ? 1 : is_view - 1
          this.getRevenue()
        }
      })
    },
    formatNumber,
    startEdit(row) {
      this.$set(row, 'isEditing', true)
      this.$set(row, 'editingCost', row.cost)
    },
    saveEdit(row) {
      const data = {
        delivery_id: row.delivery_id,
        product_id: row.id_product,
        cost: row.editingCost
      }
      supplierResources.update_cost(data).then(res => {
        if (res.error === 0) {
          this.$set(row, 'costFormat', this.formatNumber(row.editingCost) + 'đ')
          this.$set(row, 'isEditing', false)
          this.$message.success('Cập nhật giá nhập thành công')
          this.getListOrder()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.error('Lỗi khi cập nhật giá nhập', err)
        this.$message.error('Lỗi khi cập nhật giá nhập')
      })
    },
    cancelEdit(row) {
      this.$set(row, 'isEditing', false)
    },
    handleClose() {
      this.$emit('closeDialog')
    },
    handleImageError(event) {
      event.showImage = false
    },
    getListOrder() {
      this.loading = true
      manageRevenueResource.listOrder(this.listQuery).then(res => {
        console.log(res, 'ưqewqewqewqewqeqwewqewq')
        if (this.listQuery.page === 1) {
          this.total = res.total
        }
        this.tableData = res.list
        // console.log('.........list table data: ', JSON.stringify(this.tableData))
        this.tableData.forEach((item, index) => {
          item.stt = (this.listQuery.page - 1) * this.listQuery.limit + index + 1
          item.code = item.product.product_code
          item.logo = item.product.thumb
          item.size = item.size ? item.size.replace('null', '') : ''
          item.color = item.color ? item.color.replace('null', '') : ''
          item.priceFormat = this.formatNumber(item.price) + 'đ'
          item.priceSaleFormat = this.formatNumber(item.price_sale) + 'đ'
          item.costFormat = this.formatNumber(item.cost) + 'đ'
          item.profit = this.formatNumber(item.profit) + 'đ'
          item.supplierName = item.product.shop.name
          item.category_name = item.product.category ? item.product.category.name : ''
          item.delivery_id = item.delivery_bill_id
          item.id_product = item.product.id
          item.input_cost = item.cost
        })
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
</style>

<!-- <style>
.el-popup-parent--hidden {
  padding-right: 0px !important;
}
</style> -->
