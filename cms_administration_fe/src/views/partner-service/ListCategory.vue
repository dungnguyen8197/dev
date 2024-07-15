<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH DANH MỤC</h3>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="name" label="Tên danh mục" align="center" />
        <el-table-column
          prop="icon"
          label="Icon"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              v-if="row.icon"
              :style="{ width: '100px',height: 'auto', background: row.color_code }"
              :src="row.icon"
            />
            <span v-else>Không có ảnh</span>
          </template>
        </el-table-column>
        <el-table-column prop="color_code" label="Màu" align="center" />
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
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
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import PartnerServiceResource from '@/api/partner-service/partner-service'
import { formatNumber, convertDateTime } from '@/utils/convert'
const partnerServiceResource = new PartnerServiceResource()
import { create_signature_hub } from '@/utils/create-signnature'
import { trim_string_object } from '@/utils/trim-string-object'

export default {
  name: 'ListCategory',
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
      total: 10
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true

      await this.trim_string_object(this.query)
      const signature = await this.create_signature_hub(this.query)
      this.query = { ...this.query, signature }

      partnerServiceResource.get_category(this.query).then(res => {
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
    convertDateTime,
    create_signature_hub,
    trim_string_object
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
