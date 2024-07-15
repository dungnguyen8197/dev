<template>
  <div id="tag-page">
    <!-- <h3>Quản lý phân quyền</h3> -->
    <div style="display: flex; margin-top: 10px;">
      <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
      <h3 style="font-size: 20px; color: black">Danh sách tài khoản</h3>
    </div>
    <div style="display: flex; justify-content: flex-end;">
      <div style="display: flex; justify-content: left; align-items: center; margin-right: 10px;">
        <el-input v-model="searchUser" style="width: 180px; margin-right: 10px;" type="text" :rows="2" placeholder="Nhập để tìm kiếm">
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <el-select v-model="searchFilter" placeholder="Tìm kiếm theo" style="width: 200px; margin-right: 10px;">
          <el-option v-for="item in searchOption" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearchUser">Tìm kiếm</el-button>
      </div>
      <el-select v-model="stateFilter" placeholder="Trạng thái" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button style="float: right;" icon="el-icon-refresh" :loading="loading" @click="onRefreshPress">Làm mới</el-button>
    </div>
    <div id="user-table-id" style="display: flex; margin-top: 10px;">
      <div style="width: 100%">
        <el-table v-loading="loading" :data="tableData" align="center" border>
          <el-table-column prop="id" label="Id" width="60" align="center" />
          <el-table-column prop="name" label="Tên tài khoản" align="center">
            <template slot-scope="scope">
              <el-link :underline="false" style="color:#4CA1D5" @click="onSelectUser(scope.row)">{{ scope.row.name }}</el-link>
            <!-- <DialogShowInfo :object-data="scope.row" :show-dialog="showInfoDetail" @closeDialog="showInfoDetail = false" /> -->
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="Số điện thoại" align="center" width="150px" />
          <el-table-column prop="email" label="Email" align="center" />
          <el-table-column prop="acount_type_name" label="Loại tài khoản" align="center" />
          <!-- <el-table-column prop="active" label="Trạng thái " align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? "Hoạt động" : "Khóa" }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="Trạng thái" width="130" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.active" :active-value="1" :inactive-value="0" active-color="#13ce66" @change="onChangeActiveAccount(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="created" label="Ngày tạo" align="center" />
        </el-table>
        <el-row>
          <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getAllUser" />
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import ManagePermissionResource from '@/api/manage_supplier/permission'
import moment from 'moment'

const managePermissionResource = new ManagePermissionResource()

export default {
  name: 'PermissionPage',
  components: {
    Pagination
  },
  data() {
    return {
      searchUser: '',
      tableData: [],
      loading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      groupPermission: null,
      permissionsOption: [],
      accountSelect: {},
      tablePermission: [],
      showGroupPermission: false,
      formRequest: {},
      loadingSubmit: false,

      subPermissionList: [],
      stateFilter: 0,
      stateOption: [
        {
          id: 0,
          name: 'Theo trạng thái(Tất cả)'
        },
        {
          id: 1,
          name: 'Tài khoản đã off'
        },
        {
          id: 2,
          name: 'Đang hoạt động'
        }
      ],
      searchFilter: 0,
      searchOption: [
        {
          id: 0,
          name: 'Tìm theo tên tài khoản'
        },
        {
          id: 1,
          name: 'Tìm theo số điện thoại'
        },
        {
          id: 2,
          name: 'Tìm theo email'
        }
      ]
    }
  },
  watch: {
    stateFilter(val) {
      this.listQuery.active = val
      this.getAllUser()
    }
  },
  mounted() {
    this.getAllUser()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    moment,
    onRefreshPress() {
      this.listQuery.active = 0
      this.listQuery.q = ''
      this.searchFilter = 0
      this.stateFilter = 0
      this.searchUser = ''
      this.getAllUser()
    },
    getAllUser() {
      this.loading = true
      managePermissionResource.listAccount(this.listQuery).then(res => {
        if (this.listQuery.page === 1) {
          this.total = res.total
        }
        this.tableData = res.data
        this.tableData.forEach((item, index) => {
          // item.stt = (this.listQuery.page - 1) * this.listQuery.limit + index + 1
          item.created = item.createdAt ? moment(item.createdAt).format('HH:mm DD/MM/YYYY') : (item.updatedAt ? moment(item.updatedAt).format('Hh:mm DD/MM/YYYY') : '')
        })
        this.loading = false
      })
    },
    onSelectUser(row) {
      if (row.prefix_domain === 'super_admin') {
        this.$message.error('Không thể cấu hình quyền cho tài khoản super admin')
        return
      } else {
        this.$router.push({
          name: 'Permission Info',
          params: row
        })
      }
    },
    handleSearchUser() {
      console.log('searchUser', this.searchUser)
      this.listQuery.q = this.searchUser
      this.listQuery.searchFilter = this.searchFilter
      this.getAllUser()
    },
    onChangeActiveAccount(row) {
      console.log('row', row)
      managePermissionResource.changeActiveAccount({ id: row.id, active: row.active }).then(res => {
        console.log(res, 'update state')
        if (res.error === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('Cập nhật trạng thái thất bại')
      })
    }
  }
}
</script>
<style scoped>
#tag-page {
  margin: 10px 30px 50px 30px;
}
.p-tag {
  margin: 10px 0px;
}
.select-tag {
  padding-right: 10px;
}
::v-deep .el-dialog {
  margin-top: 40px !important;
}
::v-deep .el-dialog__body {
  padding-bottom: 90px !important;
}
</style>
