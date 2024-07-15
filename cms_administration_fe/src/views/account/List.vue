<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h3 style="margin: 0; width: 100%; padding: 10px">Danh sách Tài khoản</h3>
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
      <el-select v-model="query.role_id" placeholder="Quyền" clearable class="filter-item  pd-2">
        <el-option v-for="role in roles" :key="role.id" :label="role.title" :value="role.id" />
      </el-select>

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
          label="Sân"
          align="center"
        >
          <template slot-scope="{row}">
            {{ row.facility ? row.facility.sub_title : "" }}
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="birthday"

          label="Ngày sinh"
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
          label="Quyền"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag
              v-for="item in row.role_admin"
              :key="item.id"
              size="medium"
              class="mr-10 mb-10"
            >
              {{ item.title }}
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
            <!-- <el-button type="danger" icon="el-icon-delete" circle @click="onDeleteAccount(scope.row)" /> -->
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
      <dialog-form-account
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :roles="roles"
        :object-data="objectAccount"
        :admins="admins"
        @onClickButtonDialog="handleClickButtonDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import DialogFormAccount from '@/views/account/components/DialogFormAccount'
import { getAcountInfo } from '@/utils/auth'
import AccountResource from '@/api/account'
import RoleResource from '@/api/account/role'
import Permissions from '@/constant/permissions'
import { convertDateTimeSecond } from '@/utils/convert'
import { ARRAY_ROLE_CLUB, ARRAY_ADMIN } from '@/utils/constant'

const accountResource = new AccountResource()
const roleResource = new RoleResource()

export default {
  name: 'List',
  components: { DialogFormAccount, Pagination },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      tableData: [],
      admins: [],
      loadingTable: false,
      total: 0,
      isAdd: true,
      onShowDialog: false,
      objectAccount: {},
      roles: [],
      query: {
        limit: 10,
        page: 1
      },
      clubRoleList: ARRAY_ROLE_CLUB,
      admin: getAcountInfo(),
      currentPermissions: ''
    }
  },
  computed: {
    createPermission() {
      return !this.currentPermissions.includes(Permissions.CreateAccount)
    },
    updatePermission() {
      return !this.currentPermissions.includes(Permissions.UpdateAccount)
    },
    deletePermission() {
      return !this.currentPermissions.includes(Permissions.DeleteAccount)
    }
  },
  created() {
    this.onGetListAccount()
    this.getListRole()
  },
  methods: {
    onShowDialogEdit(row) {
      this.objectAccount = Object.assign({ clubRoleList: ARRAY_ROLE_CLUB }, row)
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
    onDeleteAccount(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa tài khoản ${row.name} `).then(_ => {
        accountResource.deleteAccount(row.id).then(res => {
          if (res.error_code === 0) {
            this.onGetListAccount()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    onGetListAccount() {
      this.loadingTable = true
      if (!ARRAY_ADMIN.includes(getAcountInfo().phone)) {
        this.query.not_has_role = this.clubRoleList
      }
      accountResource.Lists(this.query).then(res => {
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
    getListRole() {
      roleResource.getAllRole().then(res => {
        if (res.error_code === 0) {
          if (!ARRAY_ADMIN.includes(getAcountInfo().phone)) {
            this.roles = res.data.filter(item => !this.clubRoleList.includes(item.name))
          } else {
            this.roles = res.data
          }
        }
      })
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
