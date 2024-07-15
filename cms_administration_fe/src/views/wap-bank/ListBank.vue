<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH BANK </h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
        <!-- <el-tag :style="{ backgroundColor: colorTag, color: colorText }">Your Tag Text</el-tag> -->
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.keyword"
              placeholder="Nhập tên bank"
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
      <!-- <span style="color: red; font-size: 13px;">{{ `Note: Mặc định lấy tháng hiện tại` }}</span> -->
    </div>
    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="name" label="Ngân hàng" align="center" />
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="{row}">
            <el-button
              class="mb-10"
              size="small"
              type="primary"
              circle
              icon="el-icon-edit"
              @click="handleEdit(row)"
            />
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
        <DialogBank
          :show-dialog="showDialog"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { formatNumber, formatDate } from '@/utils/convert'
import DialogBank from '@/views/wap-bank/components/DialogBank.vue'
import WapBankResource from '@/api/wap-bank/wap-bank'
const wapBankResource = new WapBankResource()

export default {
  name: 'ListBank',
  components: {
    Pagination,
    DialogBank
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 20,
      showDialog: false,
      objectData: {},
      isAdd: true
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      wapBankResource.list_bank(this.query).then(res => {
        const { error_code, data, error_msg } = res
        console.log('data.............', data)
        if (error_code === 0) {
          this.tableData = data
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
      this.query.search = 1
      this.loadingTable = true
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.clearFacility = true
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleClose() {
      this.showDialog = false
      this.onGetList()
    },
    handleEdit(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, row)
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
</style>

