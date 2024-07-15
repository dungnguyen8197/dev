<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24">
        <h2 class="title">BOOKING</h2>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row class="mb-20">
        <el-col :sm="24" :md="4" :lg="3" class="mr-10">
          <el-select
            v-model="query.status"
            class="w-100"
            clearable
            placeholder="Đơn Outing"
          >
            <el-option
              v-for="item in listStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :sm="24" :md="4" :lg="4" class="mr-10">
          <el-select
            v-model="query.supplier_id"
            class="w-100"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Chọn vID người TT & nhận tiền"
            :remote-method="onSearchGolfer"
            :loading="loadingGolfer"
          >
            <el-option
              v-for="item in golfers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :sm="24" :md="4" :lg="3" class="mr-10">
          <el-select
            v-model="query.supplier_id"
            class="w-100"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Chọn sân"
            :remote-method="onSearchGolfer"
            :loading="loadingGolfer"
          >
            <el-option
              v-for="item in golfers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :sm="24" :md="12" :lg="6" class="mr-10">
          <el-date-picker
            v-model="query.date"
            class="w-100"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-col>
        <el-col :sm="24" :md="4" :lg="3" class="mr-10">
          <el-input
            v-model="query.price"
            style="width: 100%"
            clearable
            placeholder="Nhập giá"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="24" :md="4" :lg="3" class="mr-10">
          <el-select
            v-model="value"
            filterable
            placeholder="D20"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>

      </el-row>
      <el-row class="mb-20">
        <el-col :sm="24" :md="4" :lg="3" class="mr-10">
          <el-select
            v-model="value"
            filterable
            placeholder="Chọn gói bảo hiểm"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
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
          :label="('Mã KH')"
          align="center"
        >
          <template slot-scope="{row}">
            vID{{ row.user_id }} - {{ row.golfer.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="suggest_date"
          label="Ngày đề xuất"
          align="center"
        />
        <el-table-column
          prop="suggest_name"
          label="Người đề xuất"
          align="center"
        />
        <el-table-column
          label="Ngày hết hạn"
          prop="out_date"
          align="center"
        />
        <el-table-column
          prop="approver"
          label="Người phê duyệt"
          align="center"
        />
        <el-table-column
          prop="phone"
          label="Trạng thái"
          align="center"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitch(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="is_active"
          label="Lịch sử giao dịch"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button type="primary" @click="handleCreateAccount(row)">Xem </el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="is_delete || is_edit" label="Hành động" align="center">
          <template slot-scope="scope">
            <el-button v-if="is_edit" :disabled="updatePermission" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
            <el-button v-if="is_delete" :disabled="deletePermission" type="danger" icon="el-icon-delete" circle @click="onDeleteAccount(scope.row)" />
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
      <dialog-transaction-history
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :object-data="objectAccount"
        :admins="admins"
        @onClickButtonDialog="handleClickButtonDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import AccountResource from '@/api/account'
import RoleResource from '@/api/roles'

import DialogTransactionHistory from '@/views/customer/components/DialogTransactionHistory'

const accountResource = new AccountResource()
const roleResource = new RoleResource()

const defaultQuery = {
  page: 1,
  limit: 10
}

export default {
  name: 'List',
  components: { Pagination, DialogTransactionHistory },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      tableData: [
        {
          id: 1,
          user_id: 15107,
          golfer: {
            id: 15107,
            name: 'Nguyễn Đức Bình'
          },
          suggest_date: '29/7/2023',
          suggest_name: 'Nguyễn Đức Bình',
          out_date: '29/9/2023',
          approver: ' Nguyễn Đức Bình',
          type: 0
        }, {
          id: 2,
          user_id: 15107,
          golfer: {
            id: 15107,
            name: 'Nguyễn Đức Bình'
          },
          suggest_date: '29/7/2023',
          suggest_name: 'Nguyễn Đức Bình',
          out_date: '29/9/2023',
          approver: ' Nguyễn Đức Bình',
          type: 1
        }, {
          id: 3,
          user_id: 15107,
          golfer: {
            id: 15107,
            name: 'Nguyễn Đức Bình'
          },
          suggest_date: '29/7/2023',
          suggest_name: 'Nguyễn Đức Bình',
          out_date: '29/9/2023',
          approver: ' Nguyễn Đức Bình',
          type: 0
        }, {
          id: 4,
          user_id: 15107,
          golfer: {
            id: 15107,
            name: 'Nguyễn Đức Bình'
          },
          suggest_date: '29/7/2023',
          suggest_name: 'Nguyễn Đức Bình',
          out_date: '29/9/2023',
          approver: ' Nguyễn Đức Bình',
          type: 1
        }, {
          id: 6,
          user_id: 15107,
          golfer: {
            id: 15107,
            name: 'Nguyễn Đức Bình'
          },
          suggest_date: '29/7/2023',
          suggest_name: 'Nguyễn Đức Bình',
          out_date: '29/9/2023',
          approver: ' Nguyễn Đức Bình',
          type: 0
        }, {
          id: 7,
          user_id: 15107,
          golfer: {
            id: 15107,
            name: 'Nguyễn Đức Bình'
          },
          suggest_date: '29/7/2023',
          suggest_name: 'Nguyễn Đức Bình',
          out_date: '29/9/2023',
          approver: ' Nguyễn Đức Bình',
          type: 1
        }
      ],
      options: [{
        value: 'D10',
        label: 'D10'
      }, {
        value: 'D20',
        label: 'D20'
      }, {
        value: 'D30',
        label: 'D30'
      }, {
        value: 'D40',
        label: 'D40'
      }, {
        value: 'D50',
        label: 'D50'
      }],
      admins: [],
      loadingTable: false,
      listQuery: Object.assign({}, defaultQuery),
      total: 0,
      isAdd: true,
      onShowDialog: false,
      loadingGolfer: false,
      objectAccount: {},
      roles: [],
      query: {
        limit: 10,
        page: 1
      },
      golfers: [],
      admin: {},
      currentPermissions: {},
      listStatus: [],
      value: ''
    }
  },
  computed: {
    // createPermission() {
    //   return !this.currentPermissions.includes(Permissions.CreateAccount)
    // },
    // updatePermission() {
    //   return !this.currentPermissions.includes(Permissions.UpdateAccount)
    // },
    // deletePermission() {
    //   return !this.currentPermissions.includes(Permissions.DeleteAccount)
    // }
  },
  created() {
    this.onGetListAccount()
    this.getListRole()
  },
  methods: {
    onShowDialogEdit(row) {
      this.objectAccount = Object.assign({}, { roles: this.roles, row })
      this.isAdd = false
      this.onShowDialog = true
    },
    handleCreateAccount() {
      this.objectAccount = Object.assign({}, { roles: this.roles })
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
      accountResource.getChildren(row.id).then((res) => {
        if (res.error_code === 0) {
          let children = ''
          if (res?.data?.data && Array.isArray(res.data.data)) children = res.data.data.map((a) => a.user_name).join(', ')
          this.$confirm(`Bạn có chắc chắn muốn xóa tài khoản ${row.user_name} với tài khoản con: ${children}`).then(_ => {
            accountResource.deleteAccount(row.id).then(res => {
              if (res.error_code === 0) {
                this.onGetListAccount()
                this.$message.success(res.error_msg)
              } else {
                this.$message.error(res.error_msg)
              }
            })
          })
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onGetListAccount() {
      this.loadingTable = true
      const params = Object.keys(this.query).map(key => {
        return `${key}=${this.query[key]}`
      }).join('&')
      accountResource.AccountList(params).then(res => {
        // this.tableData = res?.data?.data || []
        this.total = res?.data?.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      const params = Object.keys(this.query).map(key => {
        return `${key}=${this.query[key]}`
      }).join('&')
      this.loadingTable = true
      accountResource.AccountList(params).then(res => {
        if (res.error_code === 0) {
          this.loadingTable = false
          this.tableData = res.data.data
          this.total = res.data.total
        } else {
          this.loadingTable = false
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    getListRole() {
      roleResource.getUnder().then(res => {
        this.roles = res.data
      })
    },
    handleSwitch(row) {
      console.log(row)
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    onSearchGolfer() {

    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    }
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
.mb-20{
  margin-bottom: 20px;
}
.w-100{
  width: 100%;
}
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 50px 0;
  font-weight: 700px;
  text-transform: uppercase;
}
</style>
