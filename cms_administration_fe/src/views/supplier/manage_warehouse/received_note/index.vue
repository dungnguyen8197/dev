<template>
  <div id="received-note">
    <addReceivedNote v-if="showDialogAddReceivedNote" :show-detail="showDialogAddReceivedNote" @close-dialog="showDialogAddReceivedNote=false" @handle-success-add-note="resetFilter" />
    <editReceivedNote v-if="showDialogEditReceivedNote" :id="edit_id" :show-detail="showDialogEditReceivedNote" @close-dialog="showDialogEditReceivedNote=false" @success-edit-note="handleSuccessEdit" />
    <viewReceivedNote v-if="showDialogViewReceivedNote" :id="view_id" :show-detail="showDialogViewReceivedNote" @close-dialog="showDialogViewReceivedNote=false" />
    <div style="width: 100; display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">Quản lý phiếu nhập kho</h3>
      </div>
      <div style="display: flex; justify-content: end; height: 40px">
        <el-button v-if="is_write" type="primary" icon="el-icon-plus" @click="onAddReceivedNote">Tạo phiếu nhập kho</el-button>
        <el-button icon="el-icon-refresh" :loading="loading" @click="resetFilter">Làm mới</el-button>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-top: 10px">
      <div>
        <el-input v-model="listQuery.q" style="width: 160px;" type="text" :rows="2" placeholder="Nhập để tìm kiếm">
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <el-select v-model="filterSearch" placeholder="Trạng thái đơn" style="width: 200px; margin-left: 10px;">
          <el-option v-for="item in searchOption" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearchReceivedNote">Tìm kiếm</el-button>
      </div>
      <div style="display: flex;">
        <el-select v-model="listQuery.shop_id" placeholder="Nhà cung cấp" style="width: 140px; margin-right: 10px;" @change="onSelectShop">
          <el-option v-for="item in optionShop" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          style="width: 300px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          @change="handleChangeDateRange"
        />
      </div>
    </div>
    <div id="brand-table-id" style="margin-top: 10px;">
      <el-tabs v-model="tabName" @tab-click="handleChangeTab">
        <el-tab-pane label="Danh sách phiếu nhập" name="first" />
        <el-tab-pane label="Phiếu nhập đã hủy" name="second" />
      </el-tabs>
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <el-table-column prop="id" label="Mã phiếu nhập" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" style="color:#4CA1D5" @click="handleView(scope.row)">NK{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên phiếu nhập" align="center" />
        <el-table-column prop="shop_name" label="Nhà cung cấp" align="center" />
        <el-table-column prop="total_number" label="Số lượng" align="center" />
        <el-table-column prop="total_price" label="Tổng tiền" align="center">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.total_price) }}đ
          </template>
        </el-table-column>
        <el-table-column prop="import_time" label="Ngày nhập kho" align="center">
          <template slot-scope="scope">
            {{ handleImportTime(scope.row.import_time) }}
          </template>
        </el-table-column>

        <el-table-column prop="user.username" label="Người nhập" align="center" />
        <el-table-column prop="noted" label="Ghi chú" align="center" />
        <el-table-column v-if="tabName==='first'" prop="action" label="Hành động" width="120" align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.type_system && is_edit" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
            <el-button v-if="!scope.row.type_system && is_delete" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getTableData" />
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import addReceivedNote from './components/addReceivedNote'
import editReceivedNote from './components/editReceivedNote'
import viewReceivedNote from './components/viewReceivedNote'
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { formatNumber } from '@/utils/convert'
import { get_list_permission } from '@/utils/utils'
import { getAcountInfo } from '@/utils/auth'
const warehouseApi = new WarehouseResource()
export default {
  components: {
    Pagination, addReceivedNote, editReceivedNote, viewReceivedNote
  },
  data() {
    return {
      dateRange: '',
      listQuery: {
        page: 1,
        limit: 10,
        type: 0,
        q: ''
      },
      filterSearch: 2,
      searchOption: [
        { id: 2, name: 'Tìm theo tên phiếu nhập' },
        { id: 1, name: 'Tìm theo mã phiếu nhập' }
      ],
      loading: false,
      tableData: [],
      total: 0,
      showDialogAddReceivedNote: false,
      showDialogEditReceivedNote: false,
      showDialogViewReceivedNote: false,
      edit_id: null,
      view_id: null,
      tabName: 'first',
      optionShop: []
    }
  },
  mounted() {
    this.requestListPermissionMenu()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    formatNumber,
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
          this.getTableData()
          this.listAllShop()
        }
      })
    },
    handleChangeDateRange(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.date_from = startDate.getTime()
      this.listQuery.date_to = endDate.getTime()
      this.getTableData()
    },
    resetFilter() {
      this.dateRange = ''
      this.searchString = ''
      this.listQuery.page = 1
      this.listQuery.date_from = ''
      this.listQuery.date_to = ''

      this.listQuery.shop_id = ''
      this.filterSearch = 2
      this.listQuery.q = ''
      this.listQuery.type_search = 2
      this.getTableData()
    },
    getTableData() {
      this.loading = true
      warehouseApi.list_warehouse_received_note(this.listQuery).then(res => {
        const { error, data } = res
        if (error !== 0) throw new Error('Lỗi lấy dữ liệu')
        if (this.listQuery.page === 1) this.total = res.total
        this.tableData = data
      }).catch(err => {
        console.log(err)
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    handleEdit(row) {
      this.showDialogEditReceivedNote = true
      this.edit_id = row.id
    },
    handleView(row) {
      this.showDialogViewReceivedNote = true
      this.view_id = row.id
    },
    deleteWarehouseNote(data) {
      this.loading = true
      warehouseApi.delete_warehouse_note(data).then(res => {
        const { error } = res
        if (error !== 0) throw new Error('Lỗi xóa phiếu nhập')
        this.$message.success('Xóa phiếu nhập thành công')
        this.loading = false
        this.getTableData()
      }).catch(err => {
        console.log(err)
        this.$message.error(err.message)
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm('Bạn có chắc muốn xóa phiếu nhập này?', 'Warning', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.deleteWarehouseNote({ warehouse_id: row.id })
        // this.onSubmitForm('ruleForm')
      })
    },
    onAddReceivedNote() {
      this.showDialogAddReceivedNote = true
    },
    onSearchReceivedNote() {
      this.listQuery.page = 1
      this.listQuery.type_search = this.filterSearch
      this.getTableData()
    },
    handleImportTime(dateString) {
      const date = dateString.split(' ')[1]
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    handleSuccessEdit() {
      this.getTableData()
    },
    handleChangeTab(tab) {
      this.listQuery.is_cancel = tab.name === 'first' ? 0 : 1
      this.resetFilter()
    },
    listAllShop() {
      warehouseApi.list_shop_all().then(res => {
        const { error, list } = res
        if (error === 0) {
          this.optionShop = list.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          throw new Error('Không lấy được danh sách cửa hàng')
        }
      }).catch(err => {
        console.log('..........listShopAll ', err)
        this.$message.error(err.message)
      })
    },
    onSelectShop() {
      this.listQuery.page = 1
      this.getTableData()
    }
  }
}
</script>
<style scoped>
#received-note {
    margin: 20px 30px 50px 30px;
}
::v-deep .el-range-separator{
    width: 20px;
}
</style>
