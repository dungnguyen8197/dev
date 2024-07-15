<template>
  <el-row class="app-container list-categories">
    <div class="list-account__header mb-10">
      <!-- <el-col :sm="24" style="display:flex">
        <h3 style="margin: 0; width: 80%;">Quản lý nhà cung cấp</h3>
      </el-col> -->
      <DialogInfoCatSupplier v-if="showInfoDetail" :id-cat="idCat" :show-detail="showInfoDetail" :offset-top="currentY" @closeDialog="showInfoDetail = false" />
      <div style="width: 98%; display: flex; justify-content: space-between; margin-left: 10px">
        <div style="display: flex; align-items: center;">
          <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
          <h3 style="margin: 0">Quản lý nhà cung cấp</h3>
        </div>
        <div>
          <el-button
            v-if="is_write"
            style="padding-top: 11px"
            type="primary"
            @click="handleCreateAdv"
          >+ Thêm mới
          </el-button>
          <el-button
            class="filter-item"
            icon="el-icon-refresh"
            style="float: right;"
            :loading="loadingTable"
            @click="refreshHome"
          >
            Làm mới
          </el-button>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end;">
      <div style="margin-right: 10px;">
        <el-input v-model="listQuery.q" :placeholder="('Nhập để tìm kiếm')" icon="search" @keyup.enter.native="onSearchPress" />
      </div>
      <div style="width: 200px; margin-right: 10px;">
        <el-select
          v-model="filter_id"
        >
          <el-option
            v-for="filter in filters"
            :key="filter.id"
            :label="filter.name"
            :value="filter.id"
          />
        </el-select>
      </div>
      <div style="width: 120px; margin-right: 10px">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @keyup.enter="onSearchPress"
          @click="onSearchPress"
        >
          Tìm kiếm
        </el-button>
      </div>
      <div style="width: 160px; margin-right: 10px">
        <el-select v-model="type_id">
          <el-option
            v-for="filter in type_bussiness"
            :key="filter.id"
            :label="filter.name"
            :value="filter.id"
          />
        </el-select>
      </div>
      <div style="width: 160px; margin-right: 10px">
        <el-select
          v-model="categoryId"
          style="width: 100%"
          class="w-100"
          remote
          :multiple-limit="1"
          :placeholder="('Lọc theo danh mục')"
        >
          <el-option
            v-for="cate in categories"
            :key="cate.id"
            :label="cate.name"
            :value="cate.id"
          />
        </el-select>
      </div>
      <div style="width: 160px; margin-right: 10px">
        <el-select
          v-model="service_type"
          class="select-item"
          style="width: 100%"
          remote
          :placeholder="('Lọc theo loại dịch vụ')"
        >
          <el-option
            v-for="service in service_types"
            :key="service.id"
            :label="service.name"
            :value="service.id"
          />
        </el-select>
      </div>
      <div style="width: 160px; margin-right: 10px">
        <el-select v-model="filter_sort_id">
          <el-option
            v-for="filter in filters_sort"
            :key="filter.id"
            :label="filter.name"
            :value="filter.id"
          />
        </el-select>
      </div>
      <!-- <div style="display: flex; flex-direction: flex-end;">
        <el-row>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-refresh"
            style="background-color: #fff; color: #000; border: 1px solid rgb(151 149 149) ;"
            :loading="loadingTable"
            @click="refreshHome"
          >
            Làm mới
          </el-button>
          <el-button
            style="float:right; padding-top: 11px"
            type="primary"
            @click="handleCreateAdv"
          >Thêm mới +
          </el-button>
        </el-row>
      </div> -->
    </div>

    <div style=" padding-right: 10px; margin-top: 10px;">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          label="Id"
          align="center"
          type="index"
          :index="handleIndexMethod"
          width="120"
        >
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDialogDetail(scope.row)">{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="Mã NCC"
          align="center"
          type="index"
          :index="handleIndexMethod"
          width="140"
        >
          <template slot-scope="scope">
            <el-link type="primary" @click="onShowDialogDetail(scope.row)">{{ scope.row.supplier_code ? scope.row.supplier_code : '' }}</el-link>
          </template>
        </el-table-column> -->
        <el-table-column label="Tên NCC" align="center">
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Logo"
          align="center"
          width="60"
        >
          <template slot-scope="scope">
            <span class="demonstration">{{ scope.row.contain }}</span>
            <el-link type="primary" @click="onShowDialogShopDetail(scope.row.logo)">
              <el-image
                v-if="isValidImage(scope.row.logo)"
                :src="scope.row.logo"
                :fit="contain"
              />
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="('Loại dịch vụ')"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ (scope.row.business_type === 1) ? ('Hàng hóa') : ('Sự kiện - giải đấu') }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="Hạng mục" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" style="color:#4CA1D5" @click="handleDialogInfo(scope.row.id)">{{ 'Xem chi tiết' }}</el-link>
            <!-- <DialogShowInfo :object-data="scope.row" :show-dialog="showInfoDetail" @closeDialog="showInfoDetail = false" /> -->
          </template>
        </el-table-column>
        <el-table-column
          :label="('Loại NCC')"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ (scope.row.type === 1) ? ('Cá nhân') : ('Doanh nghiệp') }}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="('Trạng thái')"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ (scope.row.active === 1) ? ('Hoạt động') : ('Tạm dừng') }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="('Hành động')" align="center">
          <template slot-scope="scope">
            <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
            <el-button v-if="is_delete" type="danger" icon="el-icon-delete" circle @click="onDeleteShop(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="getList"
        />
      </el-row>
      <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" @onClickDialogShop="handleClickDialogShop" />
      <detail-shop :dialog-visible="showDialogShopDetail" :url="url_image" @onClickButtonDialogDetail="handleClickButtonDialogDetail" />
      <detail :dialog-visible="showDialogDetail" :shop-id="shopId" @onClickButtonDialogDetail="handClickButtonDetail" />
    </div>
  </el-row>
</template>

<script>
import ProductResource from '@/api/manage_supplier/product'
const productResource = new ProductResource()
import ManageSupplierResource from '@/api/manage_supplier/index'
import Pagination from '@/components/Pagination/index.vue'
import Detail from '@/views/supplier/manage_supplier/components/Detail'
import DialogFormShop from '@/views/supplier/manage_supplier/components/DialogFormShop'
import DetailShop from '@/views/supplier/manage_supplier/components/DetailShop'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'
import DialogInfoCatSupplier from './components/DialogInfoCatSupplier'
const supplierResource = new ManageSupplierResource()
const defaultQuery = {
  page: 1,
  limit: 10
}
const statusDisplay = [
  { value: 1, label: 'Hiển thị' },
  { value: 0, label: 'Ẩn' }
]

export default {
  name: 'Index',
  components: { Detail, DialogFormShop, Pagination, DetailShop, DialogInfoCatSupplier },
  data() {
    return {
      is_write: 0,
      is_edit: 0,
      is_export: 0,
      is_delete: 0,
      is_view: 0,
      loadingTable: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: ''
      },
      isAdd: true,
      objectAdv: {},
      showDialogShopDetail: false,
      tableData: [],
      show_detail: false,
      objectShop: {},
      isNew: false,
      show_list: true,
      showDialogDetail: false,
      onShowDialog: false,
      data: [],
      shopId: 0,
      categoryId: 0,
      categories: [
        {
          id: 0, name: 'Lọc theo danh mục (Tất cả)'
        }
      ],
      url_image: '',
      baseUrlImg: process.env.VUE_APP_BASE_API,
      searchValue: '',
      contain: 'contain',
      total: 0,
      listQuery: Object.assign({}, defaultQuery),
      filters: [
        {
          id: 1,
          name: ('Tìm theo tên NCC')
        },
        {
          id: 2,
          name: ('Tìm theo mã NCC')
        }
        // {
        //   id: 3,
        //   name: ('Tìm theo SĐT')
        // },
        // {
        //   id: 4,
        //   name: ('Tìm theo mã số thuế')
        // }
      ],
      filter_id: 1,
      filters_sort: [
        {
          id: 1,
          name: ('Trạng thái (Tất cả)')
        },
        {
          id: 2,
          name: ('Hoạt động')
        },
        {
          id: 3,
          name: ('Tạm dừng')
        }
        // {
        //   id: 4,
        //   name: ('Từ cũ tới mới')
        // }
      ],
      filter_sort_id: 1,

      type_bussiness: [
        {
          id: 0,
          name: 'Loại (Tất cả)'
        },
        {
          id: 1,
          name: ('Doanh nghiệp')
        },
        {
          id: 2,
          name: ('Cá nhân')
        }
      ],
      service_type: 0,
      service_types: [
        {
          id: 0,
          name: 'Lọc theo loại dịch vụ (Tất cả)'
        },
        {
          id: 1,
          name: 'Hàng Hóa'
        },
        {
          id: 2,
          name: 'Sự kiện - giải đấu'
        }
      ],
      type_id: 0,
      statusOptions: statusDisplay,
      showInfoDetail: false,
      idCat: null,
      currentY: 0
    }
  },
  watch: {
    filter_sort_id(val) {
      this.listQuery.filter_id = val
      this.getList()
    },
    filter_id(val) {
      this.listQuery.filter_search_id = val
      this.getList()
    },
    type_id(val) {
      this.listQuery.type_id = val
      this.getList()
    },
    categoryId(category_id) {
      this.listQuery.category_id = category_id
      this.getList()
    },
    service_type(service_type) {
      this.listQuery.service_type = service_type
      this.getList()
    }
  },
  created() {
    // this.getList()
    this.requestListPermissionMenu()
    this.onGetListCategories()
  },
  beforeDestroy() {
    this.$off('hide-add-tag-dialog')
    this.$off('hide-edit-tag-dialog')
    window.removeEventListener('scroll', this.getCurrentY)
    // this.$off('refresh-list-tag')
  },
  mounted() {
    window.addEventListener('scroll', this.getCurrentY)
    // this.getRevenue()  mounted() {
    this.categoryId = this.$route.params.category_id
  },
  methods: {
    onBack() {
      window.history.back()
    },
    isValidImage(url) {
      return url && (url.startsWith('http://') || url.startsWith('https://'))
    },
    getCurrentY() {
      this.currentY = window.scrollY
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
          this.getList()
        }
      })
    },
    handleClickButtonDialog(isAdd, objectAdv) {
      console.log('isAdd', isAdd)
      console.log('objectAdv', objectAdv)
      this.isAdd = true
      this.objectAdv = {}
      this.dialogFormVisible = false
      this.getList()
    },
    handleCreateAdv() {
      this.shopId = 0
      this.isNew = true
      this.show_detail = true
      this.show_list = false
      this.$router.push({ path: `/supplier-info` })
    },
    getList() {
      this.loadingTable = true
      supplierResource.ListSupplier(this.listQuery).then(res => {
        // this.total = res.total
        this.loadingTable = false
        const { error, list, total } = res
        if (error === 0) {
          this.tableData = [...list]
          this.data = [...list]
          this.total = this.listQuery.page === 1 ? total : this.total
        } else {
          this.tableData = []
          this.data = []
        }
      }).catch(error => {
        this.loadingTable = false
        this.$message.error(`('error')}, ${error}`)
      })
    },
    search() {
      supplierResource.listAdv({ title: this.searchValue }).then(res => {
        this.tableData = res.data
      })
    },
    onDeleteShop(row) {
      this.$confirm(`Bạn có muốn xóa nhà cung cấp ${row.name}?`).then(_ => {
        supplierResource.deleteShop(row.id).then(response => {
          if (response.error === 0) {
            this.$message.success(`Successfully deleted ${row.name}`)
            this.getList()
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(_ => {})
    },
    handleClickDialogShop(object) {
      console.log('--------------------------------dialog', object)
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.getlist()
      }
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogShopDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
      }
    },
    onShowDialogDetail(row) {
      this.shopId = row.id
      // // this.showDialogDetail = true
      // this.isNew = false
      // this.show_detail = true
      // this.show_list = false
      this.$router.push({ path: `/supplier-info?shop_id=${this.shopId}` })
    },
    handClickButtonDetail(object) {
      this.showDialogDetail = object.dialog
      this.shopId = 0
      if (object.reload) {
        this.getlist()
      }
    },
    onGetListCategories() {
      productResource.listCategory().then(response => {
        this.categories = [
          { id: 0, name: ('Lọc theo danh mục (Tất cả)') },
          ...response.list
        ]
      })
    },
    onShowDialogEdit(row) {
      // this.isAdd = false
      // this.onShowDialog = true
      // this.objectShop = Object.assign({}, row)
      this.$router.push({ path: `/supplier-info?shop_id=${row.id}` })
    },
    onSearchPress() {
      this.loadingTable = true
      // // let { q } = this.listQuery
      // // q = q ? q.trim() : ''
      // // if (!q.length) {
      // //   this.loadingTable = false
      // //   this.tableData = [...this.data]
      // // } else {
      this.listQuery.filter_search_id = this.filter_id
      this.getList()
      // }
    },
    async refreshHome() {
      this.listQuery = {
        q: '',
        page: 1,
        limit: 10
      }
      this.filter_sort_id = 1
      this.filter_id = 1
      this.type_id = 0
      this.categoryId = 0
      this.service_type = 0
      await this.getList()
    },

    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    handleDialogInfo(data) {
      this.showInfoDetail = true
      this.idCat = data
      console.log(this.idCat, '1111id cat')
    }
  }
}
</script>

  <style>
  .p-10 {
    padding-left: 10px;
    padding-right: 10px;
  }

  .d-flex {
    display: flex;
  }

  .justify-content-between {
    justify-content: space-between;
  }

  .mr-10 {
    margin-right: 10px;
  }
  .store-update-box{
    padding-left: 12px;
  }
  .screen-names {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  #brand-page {
  margin: 10px 30px 30px 30px;
}

  </style>
