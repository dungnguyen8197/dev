<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h5 class="title">Quản lý nhà cung cấp</h5>
        </el-col>
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddAgency">Thêm mới
        </el-button>
      </el-row>
      <div class="filter-container">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="query.keyword"
              class="w-100"
              clearable
              placeholder="Nhập tên nhà cung cấp"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="5" class="mr-10">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
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
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            prop="name"

            :label="('Tên nhà cung cấp')"
            align="center"
          />

          <el-table-column label="Hành động" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditAgency(scope.row)"
              >
                Sửa
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleDeleteAgency(scope.row.id)"
              >
                Xóa
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > query.limit"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
        </el-row>
        <dialog-add
          :show-dialog="showDialogAddAgency"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />

      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import SupplierResource from '@/api/supplier'
import DialogAdd from '@/views/manage-booking/supplier/components/DialogAdd'
import { baseURL } from '@/constant/config'
const supplierResource = new SupplierResource()

export default {
  name: 'List',
  components: { Pagination, DialogAdd },
  data() {
    const account = getAcountInfo()
    console.log('account....................', account)
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
      query: {
        limit: 10,
        page: 1
      },
      // currentPermissions: getPermissions(),
      loadingData: true,
      from: 0,
      isShowListFacility: false,
      optionsFacility: [],
      agencyId: 0,
      showDialogAddAgency: false,
      objectData: {},
      objectDataDetail: {}
    }
  },
  computed: {

  },
  created() {
    this.onGetList()
  },
  methods: {

    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },

    onGetList() {
      this.loadingTable = true
      supplierResource.lists(this.query).then(res => {
        console.log('res______', res)
        if (res.error_code === 0) {
          this.tableData = res?.data?.data || []
          this.total = res?.data?.total || 0
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.onGetList()
    },

    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddAgency = value.dialog
      if (value.reload) {
        this.onGetList()
      }
    },

    handleAddAgency() {
      this.isAdd = true
      this.showDialogAddAgency = true
      this.objectData = {}
    },

    handleEditAgency(row) {
      this.isAdd = false
      this.showDialogAddAgency = true
      this.objectData = Object.assign({}, row)
    },
    handleDeleteAgency(id) {
      this.$confirm(`Bạn có chắc chắn xóa nhà cung cấp này không ?`).then((_) => {
        supplierResource.remove(id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    convertLink(value) {
      return baseURL + value
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
.w-100{
  width: 100%;
}
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700px;
  text-transform: uppercase;
}
</style>

<style scoped>
p, p span {
  font-size: 12px !important;
}

span, label, th, td {
  font-size: 12px !important;
}
</style>
