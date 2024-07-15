<template>
  <el-row class="app-container list-categories">
    <el-row class="list-categories__header">
      <el-col :sm="12">
        <div style="display: flex; align-items: center;">
          <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
          <h3 style="margin: 0px">Quản lý hạng mục</h3>
        </div>
      </el-col>
      <el-col :sm="12">
        <div class="text-right">
          <el-button v-if="is_write" type="primary" icon="el-icon-plus" @click="onShowDialogCreate">Thêm mới</el-button>
          <el-button style="float: right;" icon="el-icon-refresh" :loading="loadingTable" @click="onRefreshPress">Làm mới</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: flex-end; margin-top: 10px; margin-bottom: 10px;">
      <!-- <div> -->
      <el-input v-model="listQuery.q" style="width: 200px; margin-right: 10px;" type="text" placeholder="Nhập tìm kiếm" maxlength="200" />
      <el-select v-model="listQuery.type_search" style="margin-right: 10px; width: 150px;" placeholder="Phương thức tìm kiếm">
        <el-option v-for="item in searchOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button style="margin-right: 10px" type="primary" icon="el-icon-search" @click="onSearchPress">Tìm
        kiếm</el-button>
      <!-- <div class="select-tag"> -->
      <!-- <p class="p-tag">Trạng thái</p> -->
      <el-select v-model="filterState" placeholder="Trạng thái" style="width: 190px; margin-right: 10px;">
        <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="type_service" placeholder="Loại dịch vụ" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in serviceOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <!-- </div> -->
      <!-- <div class="select-tag"> -->
      <!-- <p class="p-tag">Ngày thanh toán</p> -->
      <el-date-picker
        v-model="dateRange"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="Đến"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        @change="handleChangeDateRange"
      />
      <!-- </div> -->
      <!-- </div> -->

      <!-- <div> -->
      <!-- </div> -->
    </div>
    <el-row class="list-categories__data">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="Mã hạng mục"
          align="center"
        >
          <template slot-scope="scope">{{ `HM${scope.row.id}` }}</template>
        </el-table-column>
        <!-- <el-table-column
          label="Ảnh đại diện"
          align="center"
        >
          <template slot-scope="scope">
            <el-avatar :size="60" :src="scope.row.thumb">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
            </el-avatar>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="name"
          label="Tên hạng mục"
          align="center"
        />
        <el-table-column
          prop="type_service"
          label="Loại dịch vụ"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.type_service_name }}</template>
        </el-table-column>
        <el-table-column
          prop="sort_index"
          label="Thứ tự hiển thị"
          align="center"
        />
        <el-table-column
          label="Số lượng NCC"
          align="center"
          prop="count_shops"
        >
          <template slot-scope="scope">
            <el-link :underline="false" style="color:#4CA1D5" @click="handleViewSupplier(scope.row.id)">{{ scope.row.count_shops }}</el-link>
            <!-- <DialogShowInfo :object-data="scope.row" :show-dialog="showInfoDetail" @closeDialog="showInfoDetail = false" /> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="duyet"
          label="Trạng thái"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ (scope.row.active === 1) ? 'Hoạt động': 'Tạm dừng' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="Ngày tạo"
          align="center"
        >
          <template slot-scope="scope">{{ moment(scope.row.createdAt).format('DD/MM/YYYY') }}</template>
        </el-table-column>
        <el-table-column v-if="is_delete || is_edit" label="Hành động" width="120" align="center">
          <template v-if="is_delete || is_edit" slot-scope="scope">
            <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
            <el-button v-if="is_delete" type="danger" icon="el-icon-delete" circle @click="onDeleteCategory(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="list-categories__footer">
      <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="onGetListCategories" />
    </el-row>
    <dialog-form-category :show-dialog="onShowDialog" :is-add="isAdd" :object-data="objectCategory" @onClickButtonDialog="handleClickButtonDialog" />
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import CategoryResource from '@/api/manage_supplier/index'
import DialogFormCategory from './components/DialogFormCategory'
// import { getAcountInfo } from '@/utils/auth'
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'
// import i18n from '@/lang/i18n'
const categoryResource = new CategoryResource()
const defaultQuery = {
  page: 1,
  limit: 10,
  type_search: 1
}
export default {
  name: 'List',
  components: { DialogFormCategory, Pagination },
  data() {
    // const account = getAcountInfo()
    return {
      is_delete: 0, // account.is_delete,
      is_write: 0, // account.is_write,
      is_edit: 0, // account.is_edit,
      is_export: 0,
      is_view: 0,
      tableData: [],
      loadingTable: false,
      listQuery: Object.assign({}, defaultQuery),
      total: 0,
      onShowDialog: false,
      objectCategory: {},
      isAdd: true,
      sortIndex: 0,
      filterState: 0,
      dateRange: '',
      stateOption: [
        {
          id: 0,
          name: 'Trạng thái(Tất cả)'
        },
        {
          id: 1,
          name: 'Tạm dừng'
        },
        {
          id: 2,
          name: 'Hoạt động'
        }
      ],
      type_service: 0,
      serviceOption: [
        {
          id: 0,
          name: 'Loại dịch vụ(Tất cả)'
        },
        {
          id: 1,
          name: 'Hàng hóa'
        },
        {
          id: 2,
          name: 'Sự kiện giải đấu'
        }
      ],
      searchOption: [
        {
          id: 1,
          name: 'Tìm theo mã'
        },
        {
          id: 2,
          name: 'Tìm theo tên'
        }
      ]
    }
  },
  watch: {
    sortIndex(sort_index) {
      this.listQuery.sort_index = sort_index
      this.onGetListCategories()
    },
    filterState(val) {
      console.log('..........filter state ', val)
      this.listQuery.active = val
      this.listQuery.page = 1
      this.tableData = []
      this.onGetListCategories()
    },
    type_service(val) {
      this.listQuery.type_service = val
      this.listQuery.page = 1
      this.tableData = []
      this.onGetListCategories()
    }
  },
  created() {
    // this.onGetListCategories()
    this.requestListPermissionMenu()
  },

  methods: {
    onBack() {
      window.history.back()
    },
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
          this.onGetListCategories()
        }
      })
    },
    onSearchPress() {
      this.listQuery.page = 1
      this.tableData = []
      this.onGetListCategories()
    },
    onRefreshPress() {
      this.dateRange = ''
      this.listQuery.from_date_create = 0
      this.listQuery.to_date_create = 0
      this.listQuery.q = ''
      this.listQuery.type_search = 1
      this.tableData = []
      this.listQuery.page = 1
      this.filterState = 0
      this.onGetListCategories()
    },
    moment,
    handleChangeDateRange(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.from_date_create = startDate.getTime()
      this.listQuery.to_date_create = endDate.getTime()
      this.onGetListCategories()
    },
    onShowDialogCreate() {
      this.onShowDialog = true
      this.objectCategory = {
        type_service: 1,
        sort_index: 1
      }
      this.isAdd = true
    },
    onShowDialogEdit(row) {
      this.onShowDialog = true
      this.objectCategory = Object.assign({}, row)
      this.objectCategory.code = 'HM' + row.id
      this.isAdd = false
      console.log('.........chinh sua hang muc ', this.isAdd)
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      const { reload } = object
      if (reload) {
        // if (data && Object.keys(data).length) {
        //   const obj = this.tableData.find(d => parseInt(d.id) === parseInt(data.id))
        //   if (obj) {
        //     const keys = Object.keys(data)
        //     for (const key of keys) {
        //       obj[key] = data[key]
        //     }
        //   }
        // } else {
        this.onGetListCategories()
        // }
      }
    },
    handleViewSupplier(id) {
      this.$router.push({
        name: `Manage Supplier`,
        params: {
          category_id: id
        }
      })
    },
    onDeleteCategory(row) {
      this.$confirm(`Bạn có chắc muốn xóa hạng mục ${row.name} không `).then(_ => {
        categoryResource.deleteCategory(row.id).then(response => {
          if (response.error === 0) {
            this.$message.success('Xóa hạng mục thành công!')
            this.onGetListCategories()
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(_ => {})
    },
    onGetListCategories() {
      if (!this.is_view) return
      this.loadingTable = true
      categoryResource.listCategory(this.listQuery).then(response => {
        this.loadingTable = false
        if (response.error === 0) {
          this.tableData = [...response.list]
          if (this.listQuery.page === 1) {
            this.total = response.total
          }
        } else {
          this.tableData = []
          this.total = 0
        }
      }).catch(error => {
        this.loadingTable = false
        this.$message.error(`Có lỗi, ${error}`)
      })
    }
  }
}
</script>

<style scoped>
.el-avatar--circle{
  border-radius: unset;
}

::v-deep .el-range-editor--medium .el-range-separator {
    line-height: 28px;
    font-size: 14px;
    width: 30px;
}
</style>
