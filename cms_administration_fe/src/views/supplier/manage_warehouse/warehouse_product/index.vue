<template>
  <div id="received-note">
    <div style="display: flex; justify-content: space-between; margin-top: 15px">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">Quản lý kho</h3>
      </div>
      <!-- <el-button type="primary" @click="resetFilter">Import excel</el-button> -->
      <div style="display: flex; justify-content: end; height: 40px">
        <el-button type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất excel</el-button>
        <el-button
          icon="el-icon-refresh"
          :loading="loading"
          @click="resetFilter"
        >Làm mới</el-button>
      </div>

    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 10px;
      "
    >
      <div>
        <el-input
          v-model="listQuery.q"
          style="width: 160px"
          type="text"
          :rows="2"
          placeholder="Nhập để tìm kiếm"
        >
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <el-select
          v-model="filterSearch"
          placeholder="Trạng thái đơn"
          style="width: 200px; margin-left: 10px"
        >
          <el-option
            v-for="item in searchOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-search"
          @click="onSearchReceivedNote"
        >Tìm kiếm</el-button>
      </div>
      <div style="display: flex">
        <el-date-picker
          v-model="dateRange"
          style="width: 300px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          @change="handleChangeDateRange"
        />
      </div>
    </div>
    <div id="brand-table-id" style="margin-top: 15px">
      <el-table
        v-loading="loading"
        :data="tableData"
        align="center"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="Mã sản phẩm" align="center">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              style="color: #4ca1d5"
              @click="onClickProduct(scope.row.id)"
            >#{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="Ảnh sản phẩm" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 75px; height: 75px"
              :src="scope.row.thumb"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên sản phẩm" align="center" />
        <el-table-column
          prop="total_inventory_start_month"
          label="Số lượng tồn đầu tháng"
          align="center"
        />
        <el-table-column
          prop="total_number_import"
          label="Nhập kho"
          align="center"
        />
        <el-table-column
          prop="total_number_export"
          label="Xuất kho"
          align="center"
        />
        <el-table-column
          prop="total_inventory_end_month"
          label="Số lượng tồn cuối tháng"
          align="center"
        />
      </el-table>
      <el-row>
        <pagination
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="getTableData"
        />
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { formatNumber } from '@/utils/convert'

const warehouseApi = new WarehouseResource()
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dateRange: '',
      listQuery: {
        page: 1,
        limit: 10
      },
      filterSearch: 1,
      searchOption: [
        { id: 1, name: 'Tìm theo tên sản phẩm' },
        { id: 2, name: 'Tìm theo mã sản phẩm' }
      ],
      loading: false,
      tableData: [],
      total: 0,
      showDialogAddReceivedNote: false
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    formatNumber,
    onBack() {
      window.history.back()
    },
    handleChangeDateRange(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.from_date = startDate.getTime()
      this.listQuery.to_date = endDate.getTime()
      this.getTableData()
      // this.getRevenue()
    },
    resetFilter() {
      this.dateRange = ''
      this.searchString = ''
      this.listQuery = {
        page: 1,
        limit: 10,
        q: '',
        date_range: '',
        date_from: '',
        date_to: '',
        type_search: 2
      }
      // this.listQuery.from_date_payment = ''
      // this.listQuery.to_date_payment = ''
      this.getTableData()
      // this.getRevenue()
    },
    getTableData() {
      this.loading = true
      warehouseApi
        .warehouse_tatistical(this.listQuery)
        .then((res) => {
          const { error, data } = res
          if (error !== 0) throw new Error('Lỗi lấy dữ liệu')
          if (this.listQuery.page === 1) this.total = res.total
          this.tableData = data
          console.log(this.tableData, 'dataaaaaaaaaaaaaaaaaaaa')
        })
        .catch((err) => {
          console.log(err)
          this.$message.error(err.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleEdit(row) {
      console.log(row)
      // this.$router.push({ name: 'editReceivedNote', params: { id: row.id } })
    },
    onAddReceivedNote() {
      this.showDialogAddReceivedNote = true
    },
    onSearchReceivedNote() {
      this.listQuery.page = 1
      this.listQuery.type_search = this.filterSearch

      this.getTableData()
    },
    onClickProduct(product_id) {
      this.$router.push({
        name: 'Warehouse Info',
        params: { data: product_id }
      })
    },
    confirmDowload(url) {
      this.getFileFromServer(url)
    },
    async getFileFromServer(url) {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success('Xuất file thành công, vui lòng vào thư mục donwload để xem')
      }, 250)
    },
    handleExportExcel() {
      console.log('export excel')
      warehouseApi.export_warehouse(this.listQuery).then((res) => {
        const { error, link } = res
        if (error === 0) {
          this.confirmDowload(link)
        } else {
          this.$message.error('Lỗi khi xuất file excel')
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('Lỗi khi xuất file excel')
      })
    } }
}
</script>
<style scoped>
#received-note {
  margin: 20px 30px 50px 30px;
}
::v-deep .el-range-separator {
  width: 20px;
}
</style>
