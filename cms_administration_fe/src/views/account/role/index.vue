<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h3 style="margin: 0; width: 100%; padding: 10px">Danh sách quyền</h3>
        <div style="width: 100%;">
          <el-button style="float:right; padding-top: 11px" type="primary" @click="handleCreateAccount">Tạo quyền +
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-col :sm="4" class="mr-10">
        <el-input
          v-model="listQuery.title"
          placeholder="Tên quyền"
          class="filter-item full-width"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </el-col>
      <el-col :sm="4" class="mr-10">
        <el-input
          v-model="listQuery.name"
          placeholder="Slug"
          class="filter-item full-width"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </el-col>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Tìm kiếm
      </el-button>
    </div>

    <el-row class="list-account__data">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="STT"
          width="100"
          align="center"
          type="index"
          :index="handleIndexMethod"
        />
        <el-table-column
          label="ID"
          prop="id"
          width="100"
          align="center"
        />
        <el-table-column
          prop="title"
          label="Tên quyền"
          align="center"
        />
        <el-table-column
          prop="name"
          label="Slug"
          align="center"
        />
        <el-table-column
          label="Ngày tạo"
          align="center"
        >
          <template slot-scope="{row}">
            {{ convertDateTimeSecond(row.created_at) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="Hành động" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.id <=13 || Boolean(clubRoleList.includes(scope.row.name))" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
          </template>
        </el-table-column> -->
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetList"
        />
      </el-row>
      <dialog-add-role
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :object-data="dialogObject"
        @onClickButtonDialog="handleClickButtonDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import DialogAddRole from './components/DialogAddRole'
import TypeServiceResource from '@/api/type-service'
import RoleResource from '@/api/account/role'
import moment from 'moment'
import { convertDateTimeSecond } from '@/utils/convert'
import { ARRAY_ROLE_CLUB } from '@/utils/constant'

const roleResource = new RoleResource()
const typeServiceResource = new TypeServiceResource()

export default {
  name: 'List',
  components: { DialogAddRole, Pagination },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      listQuery: { page: 1, limit: 10 },
      listBody: {},
      total: 0,
      isAdd: true,
      onShowDialog: false,
      dialogObject: {},
      time_step_1: '',
      time_step_2: '',
      type_services: [],
      clubRoleList: ARRAY_ROLE_CLUB
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.time_step_1)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    time_step_1(value) {
      this.listBody.time_step_1 = value ? moment(value).unix() : ''
    },
    time_step_2(value) {
      this.listBody.time_step_2 = value ? moment(value).unix() : ''
    }
  },
  created() {
    this.onGetList()
    // this.onGetListTypeService()
  },
  methods: {
    onGetListTypeService() {
      typeServiceResource.TypeServiceList().then((res) => {
        if (res.error_code === 0) {
          this.type_services = res.data
        }
      })
    },
    onShowDialogEdit(row) {
      this.dialogObject = { row, type_services: this.type_services }
      this.isAdd = false
      this.onShowDialog = true
    },
    handleCreateAccount() {
      this.dialogObject = { row: null, type_services: this.type_services }
      this.isAdd = true
      this.onShowDialog = true
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },
    onDeleteAccount(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa vai trò ${row.name}`).then(_ => {
        roleResource.remove(row.id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    onGetList() {
      this.loadingTable = true
      roleResource.list(this.listQuery).then(res => {
        this.tableData = res?.data?.data || []
        this.total = res?.data?.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    convertDateTimeSecond
  }
}
</script>
<style scoped>
.pr-5 {
  padding-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.content {
  line-height: 1.5rem;
  max-height: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>
