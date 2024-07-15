<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h3 style="margin: 0; width: 100%; padding: 10px">Danh sách Tài khoản HIO</h3>
        <div style="width: 100%;">
          <el-button style="float:right; padding-top: 11px" type="primary" @click="handleCreateAccount">Tạo Account +
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-input
        v-model="query.name"
        clearable
        placeholder="Tên"
        style="width: 200px;"
        class="filter-item  pd-2"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.phone"
        clearable
        placeholder="Số điện thoại"
        style="width: 200px;"
        class="filter-item  pd-2"
        @keyup.enter.native="handleFilter"
      />

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
          width="250"
          prop="name"
          :label="('Tên tài khoản')"
          align="center"
        />
        <el-table-column
          width="200"
          prop="phone"
          label="Số điện thoại"
          align="center"
        />
        <el-table-column
          width="250"
          prop="email"
          label="Email"
          align="center"
        />
        <el-table-column
          label="Sân"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.is_view_all_facility === 1">ALL sân</el-tag>
            <el-tag
              v-for="item in row.facility_insurance"
              v-else
              :key="item.id"
              size="medium"
              class="mr-10 mb-10"
            >
              {{ item.facility ? item.facility.title : '' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="is_active"
          label="Kích hoạt"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag :type="(row.is_active === 0) ? 'success' : 'danger'">
              {{ (row.is_active === 0) ? ('Kích hoạt') : ('Khóa') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" label="Hành động" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetListAccount"
        />
      </el-row>
      <dialog-add-account-h-i-o
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :object-data="objectData"
        @onCloseDialog="handleClickButtonDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import AccountResource from '@/api/account'
import { convertDateTimeSecond } from '@/utils/convert'
import DialogAddAccountHIO from '@/views/account/business/components/DialogAddAccountHIO.vue'

const accountResource = new AccountResource()

export default {
  name: 'List',
  components: { DialogAddAccountHIO, Pagination },
  data() {
    return {
      tableData: [],
      admins: [],
      loadingTable: false,
      total: 0,
      isAdd: true,
      onShowDialog: false,
      objectData: {},
      roles: [],
      query: {
        limit: 10,
        page: 1
      },
      admin: getAcountInfo(),
      currentPermissions: ''
    }
  },
  created() {
    this.onGetListAccount()
  },
  methods: {
    onShowDialogEdit(row) {
      this.objectData = Object.assign({}, row)
      this.isAdd = false
      this.onShowDialog = true
    },
    handleCreateAccount() {
      this.isAdd = true
      this.onShowDialog = true
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetListAccount()
      }
    },
    onGetListAccount() {
      this.loadingTable = true
      // if (!ARRAY_ADMIN.includes(getAcountInfo().phone)) {
      //   this.query.not_has_role = this.clubRoleList
      // }
      accountResource.listAccountHIO(this.query).then(res => {
        this.tableData = res?.data?.data || []
        this.total = res?.data?.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.onGetListAccount()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    convertDateTimeSecond
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}
.pr-5 {
  padding-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
