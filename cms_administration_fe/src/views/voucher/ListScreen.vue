<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH MÀN HÌNH SỬ DỤNG</h3>
      </el-col>
    </el-row>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="screen" label="Tên màn hình" align="center" />
        <el-table-column prop="type" label="type" align="center" />
        <el-table-column prop="provider_id" label="provider id" align="center" />
        <el-table-column
          prop="image"
          label="Hình ảnh"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              v-if="row.image"
              style="width: 100px; height: auto"
              :src="row.image"
            />
            <span v-else>Không có ảnh</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="name" align="center" />
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetList"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import VoucherResource from '@/api/voucher/voucher'
import { formatNumber, convertDateTime } from '@/utils/convert'
// import moment from 'moment'
const voucherResource = new VoucherResource()

export default {
  name: 'ListScreen',
  components: {
    Pagination
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 0
    }
  },

  created() {
    this.onGetList()
  },

  methods: {
    onGetList() {
      this.loadingTable = true
      voucherResource.get_screen_using().then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data
          this.total += this.query.limit
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
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
    handleAdd() {},
    formatNumber,
    convertDateTime
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
