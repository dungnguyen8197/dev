<template>
  <div id="tag-page">
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">Quản lý tag</h3>
      </div>
      <div>
        <el-button v-if="is_write" type="primary" icon="el-icon-plus" @click="handleAddTag">Thêm mới</el-button>
        <el-button icon="el-icon-refresh" :loading="loading" @click="resetFilter">Làm mới</el-button>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 10px; flex-wrap: wrap;">
      <div style="display: flex; flex-direction: row; margin-right: 10px;">
        <el-input v-model="searchTagName" style="width: 180px; margin-right: 10px;" type="text" :rows="1" placeholder="Nhập tên tag" maxlength="50">
          <i slot="suffix" class="el-icon-search el-input__icon" @click="resetPage" />
        </el-input>
        <el-select v-model="searchType" style="width: 180px;" filterable>
          <el-option
            v-for="item in searchOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="resetPage">Tìm kiếm</el-button>
      </div>
      <div class="select-tag">
        <!-- <p class="p-tag">Hạng mục</p> -->
        <el-select v-model="filterCategory" style="width: 180px;" filterable placeholder="Chọn hạng mục" @change="resetPage()">
          <el-option
            v-for="item in categoryOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="select-tag">
        <!-- <p class="p-tag">Trạng thái</p> -->
        <el-select v-model="filterState" placeholder="Trạng thái" style="width: 140px;" @change="resetPage()">
          <el-option
            v-for="item in stateOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <!-- <div class="media-screen"> -->
      <!-- </div> -->
    </div>

    <div id="brand-table-id" style="margin-top: 20px;">
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <el-table-column prop="code" label="Mã tag" width="180" align="center" />
        <el-table-column prop="name" label="Tên tag" align="center" />
        <el-table-column prop="category_name" label="Hạng mục" align="center" />
        <el-table-column prop="state" label="Trạng thái" align="center">
          <template slot-scope="scope">
            <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="Hành động" width="180" align="center">
          <template slot-scope="scope">
            <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
            <!-- <el-button type="text" @click="handleEdit(scope.row)">
              <i class="el-icon-edit" style="font-size: x-large" />
            </el-button> -->
          </template>
        </el-table-column>

      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getListTag" />
      </el-row>

      <DialogAddTag v-if="showDialogAddTag" :show-dialog="showDialogAddTag" />
      <DialogEditTag v-if="showDialogEditTag" :show-dialog="showDialogEditTag" :object-data="objectRow" />
    </div>
  </div>
</template>

<script>
import ManageTagResource from '@/api/manage_supplier/tag'
import Pagination from '@/components/Pagination'
import DialogAddTag from './components/DialogAddTag.vue'
import DialogEditTag from './components/DialogEditTag.vue'
import { get_list_permission } from '@/utils/utils'
import { getAcountInfo } from '@/utils/auth'
const manageTagResource = new ManageTagResource()

export default {
  name: 'TagPage',
  components: { Pagination, DialogAddTag, DialogEditTag },
  data() {
    return {
      is_delete: 0,
      is_view: 0,
      is_edit: 0,
      is_export: 0,
      is_write: 0,
      loading: false,
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      objectRow: {},
      showDialog: false,
      filterCategory: 0,
      categoryOption: [{ id: 0, name: 'Hạng mục(Tất cả)' }],
      filterState: 0,
      stateOption: [
        { id: 0, name: 'Trạng thái(Tất cả)' },
        { id: 2, name: 'Hoạt động' },
        { id: 1, name: 'Tạm dừng' }
      ],
      searchTagName: '',

      showDialogAddTag: false,
      showDialogEditTag: false,
      searchType: 0,
      searchOption: [
        {
          id: 0,
          name: 'Tìm theo tên'
        },
        {
          id: 1,
          name: 'Tìm theo mã'
        }
      ]
    }
  },
  created() {
    console.log(this.$router.current)
    this.$on('hide-add-tag-dialog', () => {
      this.showDialogAddTag = false
    })
    this.$on('hide-edit-tag-dialog', () => {
      this.showDialogEditTag = false
    })
    this.$on('refresh-list-tag', () => {
      this.getListTag()
    })
  },
  mounted() {
    // this.getListTag()
    this.getListCategory()
    this.requestListPermissionMenu()
  },
  beforeDestroy() {
    this.$off('hide-add-tag-dialog')
    this.$off('hide-edit-tag-dialog')
    this.$off('refresh-list-tag')
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
          this.getListTag()
        }
      })
    },
    getListTag() {
      if (!this.is_view) return
      this.loading = true
      if (this.filterCategory) {
        this.listQuery.category_id = this.filterCategory
      }
      this.listQuery.active = this.filterState ? this.filterState : 0

      if (this.searchTagName) {
        this.listQuery.q = this.searchTagName.trim()
      }
      this.listQuery.searchType = this.searchType
      manageTagResource.listTag(this.listQuery).then(response => {
        if (this.listQuery.page === 1) {
          this.total = response.total
        }
        this.loading = false
        this.tableData = response.data
        this.tableData.forEach(item => {
          item.state = item.active ? 'Hoạt động' : 'Tạm dừng'
          item.code = 'TAG' + item.id
        })
      })
    },
    getListCategory() {
      manageTagResource.listCategory().then(response => {
        const { error, data } = response
        if (error === 0) {
          this.categoryOption = [{ id: 0, name: 'Hạng mục(Tất cả)' }, ...data]
        }
      })
    },
    resetFilter() {
      this.filterCategory = 0
      this.filterState = 0
      this.searchTagName = ''
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.getListTag()
    },
    resetPage() {
      this.listQuery.page = 1
      this.getListTag()
    },
    // resetActive() {
    //   this.listQuery.page = 1
    //   this.filterState = null
    // },
    handleAddTag() {
      this.showDialogAddTag = true
    },
    handleEdit(dataRow) {
      this.showDialogEditTag = true
      this.objectRow = dataRow
    }
  }
}
</script>

<style scoped>
#tag-page {
  margin: 30px 30px 50px 30px;
}
.p-tag {
  margin: 10px 0px;
}
.select-tag {
  padding-right: 10px;
}
@media screen and (max-width: 940px){
  .media-screen {
    margin-top: 10px;
  }

}
</style>
