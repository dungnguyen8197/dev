<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 class="title">Danh sách thành viên CLB</h3>
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
        <el-table-column prop="name" label="Tên user" align="center">
          <template slot-scope="{row}">
            {{ row.user ? `viD${row.user_id} - ${row.user.fullname ? row.user.fullname : 'null'}` : `viD${row.user_id}` }}
          </template>
        </el-table-column>
        <el-table-column label="Chức vụ" align="center">
          <template v-if="convertTypeMember(scope.row).length > 0" slot-scope="scope">
            <template v-for="(item, i) in convertTypeMember(scope.row)">
              <el-tag :key="i" type="primary">{{ item }}</el-tag>
            </template>
          </template>
          <template v-else type="primary">
            <el-tag>Thành viên</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
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
        </el-table-column> -->
        <el-table-column label="Hành động" width="150" align="center">
          <!-- <template slot-scope="scope">
            <el-button
              class="mb-10"
              size="small"
              :title="`Chi tiết`"
              type="primary"
              icon="el-icon-info"
              circle
              @click="handleInfoClub(scope.row)"
            />
          </template> -->
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
        <dialog-add-user
          :show-dialog="showDialog"
          :object-data="objectData"
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
import DialogAddUser from '@/views/club/detail/components/DialogAddUser.vue'

const adminClubResource = new AdminClubResource()

export default {
  name: 'ListPartner',
  components: {
    Pagination,
    DialogAddUser
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
      organizations: [],
      showDialog: false,
      objectData: {}
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.valueId = this.$route.params.id
    this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      adminClubResource.list_member(this.query, this.valueId).then(res => {
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
      this.$router.push({
        name: 'DetailClub',
        params: row.id
      })
    },
    handleClose() {
      this.showDialog = false
      this.onGetList()
    },
    handleAdd() {
      this.showDialog = true
      this.objectData = {}
    },
    convertTypeMember(row) {
      const result = []
      if (row.is_user_admin === 1) {
        result.push('Chủ tịch')
      }
      if (row.is_vice_president === 1) {
        result.push('Phó chủ tịch')
      }
      if (row.is_captain === 1) {
        result.push('Đội trưởng')
      }
      if (row.is_general_secretary === 1) {
        result.push('Tổng thư ký')
      }
      if (row.is_moderator === 1) {
        result.push('Quản trị viên')
      }
      return result
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

