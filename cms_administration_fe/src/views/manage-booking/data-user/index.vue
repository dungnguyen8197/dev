<template>
  <el-row style="margin:20px;">
    <el-row>
      <el-col :sm="18">
        <h3 style="margin: 0; width: 100%; padding: 10px">Thông tin user</h3>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <div class="filter-container">
      <el-row>
        <el-col :sm="4" class="mr-10">
          <el-input
            v-model="query.user_id"
            placeholder="Tìm kiếm theo id"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="4" class="mr-10">
          <el-input
            v-model="query.name_out_system"
            placeholder="Tìm kiếm theo name"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="4" class="mr-10">
          <el-input
            v-model="query.passport"
            placeholder="Tìm kiếm theo CCCD / Passport"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :sm="6" class="mr-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleDownload"> Export excel</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="clearfix-10" />
    <el-row style="margin-top: 40px;">
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
          prop="pax_id"
          label="Pax id"
          align="center"
        />
        <el-table-column
          prop="user_id"
          label="User id"
          align="center"
        />
        <el-table-column
          prop="name_out_system"
          label="User name"
          align="center"
        />
        <el-table-column
          prop="passport"
          label="CCCD / Passport"
          align="center"
        />
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
import Pagination from '@/components/Pagination'
import BookingPaxResource from '@/api/BookingPax'

const bookingPaxResource = new BookingPaxResource()
export default {
  name: 'DataUser',
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
      total: 0,
      loadingExportExcel: false
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      bookingPaxResource.listDataUser(this.query).then(response => {
        if (response.error_code === 0) {
          console.log('==============', response)
          const result = response.data
          this.tableData = result.data
          this.total = result.total
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : (this.query.page - 1) * this.query.limit + index + 1
    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    async handleDownload() {
      let stop = false
      const query = {
        page: 1,
        limit: 1000
      }
      query.name_out_system = this.query.name_out_system
      query.passport = this.query.passport
      query.user_id = this.query.user_id
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await bookingPaxResource.listDataUser(query)
          console.log('res..............', res.data.data)
          console.log('this.tableData', res.data.data)
          if (res.data.data.length <= 0) {
            stop = true
          }
          list_all = [...list_all, ...res.data.data]
          console.log('list_all', list_all)
          if (res.error_code === 0) {
            stop = true
          }
        } catch (error) {
          console.error(error)
          stop = true
        }
      }

      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Pax id', 'User id', 'Tên', 'Passport']
        const filterVal = ['pax_id', 'user_id', 'name_out_system', 'passport']
        let data = list_all
        data = this.formatJson(filterVal, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-list'
        })
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'pax_id') {
          return v[j]
        } else if (j === 'user_id') {
          return v[j]
        } else if (j === 'name_out_system') {
          return v[j]
        } else if (j === 'passport') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    }

  }
}
</script>

<style scoped>
.mr-10 {
  margin-right: 10px;
}
</style>
