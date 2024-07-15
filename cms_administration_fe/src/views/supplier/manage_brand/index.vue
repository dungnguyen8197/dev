<template>
  <div id="brand-page">
    <div style="display: flex; justify-content: space-between; margin-top: 20px; margin-bottom: 10px">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px;margin-bottom: 0px;" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">Quản lý thương hiệu</h3>
      </div>
      <div>
        <el-button
          v-if="is_write"
          type="primary"
          icon="el-icon-plus"
          :loading="loadingAddBrand"
          @click="handleAddBrand"
        >
          Thêm mới
        </el-button>
        <el-button
          icon="el-icon-refresh"
          :loading="loadingLoadingRefresh"
          @click="handleButtonRefresh"
        >
          Làm mới
        </el-button>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end;">
      <!-- <SearchBrand ref="searchBrand" style="width: 65%" /> -->
      <el-input v-model="searchText" style="width: 500px" type="text" :rows="2" placeholder="Nhập để tìm kiếm">
        <i slot="suffix" class="el-icon-search el-input__icon" />
      </el-input>
      <el-select v-model="searchType" style="margin-left: 10px; width: 500px" placeholder="Tìm kiếm">
        <el-option
          v-for="item in searchOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="searchBrand">Tìm kiếm</el-button>
      <el-select v-model="filterState" style="margin-left: 10px; width: 400px" placeholder="Trạng thái">
        <el-option
          v-for="item in stateOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!-- <div>
        <el-button
          v-if="is_write"
          type="primary"
          icon="el-icon-plus"
          :loading="loadingAddBrand"
          @click="handleAddBrand"
        >
          Tạo mới
        </el-button>
        <el-button
          icon="el-icon-refresh"
          :loading="loadingLoadingRefresh"
          @click="handleButtonRefresh"
        >
          Làm mới
        </el-button>
      </div> -->
      <DialogAddBrand v-if="showAddBrandDialog" :key="keyAddDialog" :show-dialog="showAddBrandDialog" />
    </div>
    <div id="brand-table-id" style="margin-top: 10px;">
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <el-table-column prop="code" label="Mã thương hiệu" width="180" align="center" />
        <!-- <el-table-column prop="logo" label="Logo" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.image ? scope.row.image : ''"
              style="width: 100px;"
              @error="handleImageError(scope.row)"
            >
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="Tên thương hiệu" align="center" />
        <el-table-column prop="state" label="Trạng thái" align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="Hành động" width="180" align="center">
          <template v-if="is_edit" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
      </el-row>
      <DialogEditBrand v-if="showDialog" :object-data="objectRow" :show-dialog="showDialog" />
    </div>
    <!-- <BrandTable class="component-class" :data-search="dataSearch" :refresh-times="refreshTimes" /> -->
  </div>
</template>
<script>
// import BrandTable from './components/SupplierBrandTable.vue'
// import SearchBrand from './components/SupplierSearchBrand.vue'
import DialogAddBrand from './components/DialogAddBrand.vue'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'
import Pagination from '@/components/Pagination'
import ManageBrandResource from '@/api/manage_supplier/brand'
import DialogEditBrand from './components/DialogEditBrand.vue'
const manageBrandResource = new ManageBrandResource()

export default {
  components: {
    // BrandTable,
    // SearchBrand,
    DialogAddBrand,
    Pagination,
    DialogEditBrand
  },
  data() {
    return {
      loadingLoadingRefresh: false,
      loadingAddBrand: false,

      refreshTimes: 0,
      dataSearch: '',

      showAddBrandDialog: false,
      keyAddDialog: 0,
      is_write: 0,
      is_edit: 0,
      is_delete: 0,
      is_view: 0,
      defaultLogo: 'https://vcallid.s3.ap-southeast-1.amazonaws.com/defaul.png', // require('@/assets/defaul.png'),
      loading: false,
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        q: '',
        active: 0
      },
      tableData: [],
      showDialog: false,
      objectRow: {},
      contain: 'contain',
      filterState: 0,
      filterOject: {
        state: 0,
        searchType: 2,
        searchText: ''
      },
      stateOption: [
        { id: 0, name: 'Trạng thái(Tất cả)' },
        { id: 2, name: 'Hoạt động' },
        { id: 1, name: 'Tạm dừng' }
      ],
      searchOption: [
        { id: 2, name: 'Tìm theo tên thương hiệu' },
        { id: 1, name: 'Tìm theo mã thương hiệu' }
      ],
      searchText: '',
      searchType: 1
    }
  },
  watch: {
    filterState(val) {
      console.log('.............thay doi trang thai ', val)
      this.listQuery.active = val
      this.getList()
    }
  },
  created() {
    this.$on('hide-edit-brand-dialog', () => {
      this.showDialog = false
    })
    this.$root.$on('update-brand-and-refresh-table', () => {
      this.getList()
    })
    // this.$on('on-search-brand', (dataSearch) => {
    //   // this.dataSearch = dataSearch.
    //   this.listQuery.q = dataSearch.searchText
    //   this.listQuery.type_filter = dataSearch.searchType
    //   this.listQuery.active = dataSearch.state
    //   this.getList()
    // })
    this.$on('loading-table', (value) => {
      this.loadingLoadingRefresh = value
    })
    this.$on('hide-add-brand-dialog', () => {
      this.keyAddDialog += 1
      this.showAddBrandDialog = false
    })
    this.requestListPermissionMenu()
    // this.$on('cancel-dialog-add-brand', () => {
    //   this.keyAddDialog+=1
    // })
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
          this.getList()
          // if (this.$refs.searchBrand) {
          //   console.log('............dang vao day')
          //   this.$refs.searchBrand.loadData(this.is_view, this.is_edit)
          // }
        }
      })
    },
    searchBrand() {
      this.listQuery.q = this.searchText
      this.listQuery.type_filter = this.searchType
      this.getList()
    },
    getList() {
      if (!this.is_view) return
      this.loading = true
      manageBrandResource
        .listBrand(this.listQuery)
        .then((res) => {
          const { error, list } = res
          if (error === 0) {
            if (this.listQuery.page === 1) {
              this.total = res.total
            }
            this.tableData = list.map((item) => {
              return {
                id: item.id,
                showImage: item.image,
                code: 'TH' + item.id,
                image: item.image,
                name: item.name,
                active: item.active,
                state: item.active ? 'Hoạt động' : 'Tạm dừng'
              }
            })
          }
        })
        .catch((err) => {
          this.$message.error(err)
        }).finally(() => {
          this.loading = false
          this.$parent.$emit('loading-table', false)
        })
    },
    handleImageError(event) {
      event.showImage = false
    },
    handleEdit(data) {
      this.showDialog = true
      this.objectRow = data
      // console.log(data)
    },
    handleButton() {
      console.log('handleButton')
    },
    handleButtonRefresh() {
      // this.$refs.searchBrand.resetFilter()
      // this.refreshTimes += 1
      this.listQuery.page = 1
      this.listQuery.active = 0
      this.listQuery.q = ''
      this.searchText = ''
      this.searchType = 1
      this.filterState = 0
      this.getList()
    },
    handleAddBrand() {
      this.showAddBrandDialog = true
    }
  }
}
</script>
<style scoped>
#brand-page {
  margin: 10px 30px 30px 30px;
}
.brand-header {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.component-class {
  margin-top: 20px;
}
.p-tag {
  margin: 10px 0px;
}
.select-tag {
  padding-right: 20px;
}
</style>
