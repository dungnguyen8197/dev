<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 class="title">Danh sách câu lạc bộ</h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.name"
              placeholder="Nhập tên"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <!-- <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.status"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Trạng thái"
            >
              <el-option
                v-for="status in statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </div>
        </el-col> -->
        <el-col :sm="12" :md="8" class="mr-10 mt-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="title" label="Mã CLB" align="center" />
        <el-table-column prop="name" label="Tên CLB" align="center" />
        <el-table-column prop="address" label="Địa chỉ" align="center" />
        <el-table-column label="Trạng thái public" align="center">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.is_public"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              @change="changStatusPublic(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="Logo"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              v-if="row.logo_url_path"
              style="width: 100px; height: auto"
              :src="row.logo_url_path"
            />
            <span v-else>Không có ảnh</span>
          </template>
        </el-table-column>
        <el-table-column label="NGày thành lập" align="center">
          <template slot-scope="scope">
            {{ scope.row.date_birthday ? formatDate(scope.row.date_birthday) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? formatDate(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              class="mb-10"
              size="small"
              :title="`Sửa`"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :title="`Chi tiết`"
              icon="el-icon-info"
              circle
              @click="handleInfoClub(scope.row)"
            />
            <!-- <el-button
              class="mb-10"
              size="small"
              :title="`Thêm thư ký`"
              type="success"
              icon="el-icon-plus"
              circle
              @click="handleAddSecretary(scope.row)"
            /> -->
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetList"
        />
        <dialog-club
          :is-add="isAdd"
          :show-dialog="showDialog"
          :object-data="objectData"
          @onCloseDialog="handleClose"
        />
        <dialog-add-secretary
          :show-dialog="showDialogAddSecretary"
          :object-data="objectDataAddSecretary"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { formatDate, formatNumber } from '@/utils/convert'
import AdminClubResource from '@/api/club/admin-club'
// import moment from 'moment'
import DialogClub from '@/views/club/components/DialogClub'
import DialogAddSecretary from '@/views/club/components/DialogAddSecretary'
import { getAcountInfo } from '@/utils/auth'

const adminClubResource = new AdminClubResource()

export default {
  name: 'ListPartner',
  components: {
    Pagination,
    DialogClub,
    DialogAddSecretary
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 0,
      isAdd: true,
      showDialog: false,
      objectData: {},
      showDialogAddSecretary: false,
      objectDataAddSecretary: {},
      role_admin: getAcountInfo()?.role_admin.map(item => item.name)
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      if (!this.role_admin.includes('role_boss_club') && !this.role_admin.includes('role_leader_club')) {
        this.query.admin_cms_id = getAcountInfo()?.id
      }
      adminClubResource.list(this.query).then(res => {
        const { error_code, data, error_msg } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },

    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleInfoClub(row) {
      this.$router.push(`/club/detail/${row.id}`)
    },
    async changStatusPublic(row) {
      console.log('row................', row)
      const params = {
        is_hidden: +row.is_public === 1 ? 1 : 0
      }
      await adminClubResource.change_status_public(params, row.id).then(response => {
        console.log('response................', response)
        if (response.error_code === 1) {
          console.log('response................', response)
          this.$message.error('Thay đổi trạng thái thất bại')
          return
        }
        this.$message.success('Thay đổi trạng thái thành công')
        this.onGetList()
      })
    },
    handleAddSecretary(row) {
      this.showDialogAddSecretary = true
      this.objectDataAddSecretary = Object.assign({}, row)
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },
    handleEdit(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, row)
    },
    handleClose() {
      this.showDialogAddSecretary = false
      this.showDialog = false
      this.onGetList()
    },
    formatNumber,
    formatDate
  }
}
</script>

  <style scoped>
  .mr-10 {
      margin-right: 10px;
  }

  .mb-10 {
      margin-bottom: 10px;
  }

  .mt-10 {
      margin-top: 10px;
  }

  .filter-search {
    float: right;
    display: flex;
    justify-content: flex-end;
    margin-right: 0;
  }
  .filter-container .filter-item{
    margin-bottom: 0;
  }
  .search-money{
    padding-right: 10px;
  }
  .search-money:last-child{
    padding-right: 0;
  }
  .row-search-money{
    margin-bottom: 10px;
  }
  .cell .el-tag{
    margin: 5px;
  }
  .clearfix-10 {
    height: 10px;
    clear: both;
  }
  .clearfix-20 {
    height: 20px;
    clear: both;
  }
  .mt-10 {
    margin-top: 10px;
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

