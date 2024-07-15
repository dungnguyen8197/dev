<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH NHÀ CUNG CẤP</h3>
      </el-col>
    </el-row>
    <div class="filter-container" />

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="name" label="Tên" align="center" />
        <el-table-column
          prop="icon"
          label="Icon"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 100px; height: auto"
              :src="row.icon"
            />
          </template>
        </el-table-column>
        <el-table-column prop="background_color" label="Màu background" align="center" />
        <el-table-column prop="text_color" label="Màu chữ" align="center" />
        <el-table-column prop="border_color" label="Màu border" align="center" />
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
import { create_signature_hub } from '@/utils/create-signnature'
const voucherResource = new VoucherResource()

export default {
  name: 'ListProvider',
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
  computed: {
    // datePickerOptions() {
    //   return {
    //     disabledDate: (time) => {
    //       const yesterday = new Date(this.query.start_date)
    //       yesterday.setDate(yesterday.getDate() + 1)
    //       return time.getTime() < yesterday.getTime()
    //     }
    //   }
    // }
  },
  watch: {
    // dateRange(value) {
    //   if (value) {
    //     this.query.start_date = moment(value[0]).unix() * 1000
    //     this.query.end_date = moment(value[1]).unix() * 1000
    //   } else {
    //     this.query.start_date = ''
    //     this.query.end_date = ''
    //   }
    // }
  },
  created() {
    this.onGetList()
    // this.timer = setInterval(this.onGetList, 1000 * 20)
  },
  beforeDestroy() {
    // clearInterval(this.timer)
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      voucherResource.list_provider().then(res => {
        const { error_code, data } = res
        console.log('list_provider.......', data)
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
    convertDateTime,
    create_signature_hub
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
