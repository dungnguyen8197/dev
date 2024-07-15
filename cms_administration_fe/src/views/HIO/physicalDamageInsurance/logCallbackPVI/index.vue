<template>
  <div>
    <el-row class="mb-10">
      <el-col :span="12">
        <h4>Danh sách phản hồi từ PVI</h4>
      </el-col>
    </el-row>
    <el-row class="p-10">
      <el-col :span="4" class="mr-1 mb-1">
        <el-input v-model="listQuery.material_covered_id" size="small" placeholder="Mã đơn hàng" clearable @change="changeSearch" />
      </el-col>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="onGetList">
        Tìm kiếm
      </el-button>
    </el-row>
    <el-row class="p-10">
      <el-table :data="dataTable" border style="width: 100%">
        <el-table-column
          type="index"
          label="STT"
          :index="handleIndexMethod"
          width="50"
          class="boder"
          align="center"
        />
        <el-table-column prop="id_material_covered" label="ID Bảo Hiểm" />
        <el-table-column prop="hole_select" label="Hố bán" />
        <el-table-column prop="hole_id" label="ID hố" />
        <el-table-column prop="PVIID" label="PVIID" />
        <el-table-column prop="URL" label="URL" />
        <el-table-column prop="status" label="Trạng thái" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">PVI đã xác nhận</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="warning">Đã gửi đợi PVI xác nhận</el-tag>
            <el-tag v-else type="danger">Thất bại</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total >= listQuery.limit"
        :total="total"
        :limit.sync="listQuery.limit"
        :page.sync="listQuery.page"
        @pagination="onGetList"
      />
    </el-row>
  </div>
</template>

<script>
import PhysicalDamegeInsurance from '@/api/HIO/physicalDamegeInsurance'
import Pagination from '@/components/Pagination/index.vue'

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()

export default {
  name: 'LogCallbackPVI',
  components: { Pagination },
  data() {
    return {
      dataTable: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loading = true
      physicalDamageInsuranceProductResource.listLogCallbackPVI(this.listQuery).then(res => {
        if (res.error_code === 0) {
          this.dataTable = res.data.data
          this.total = res.data.total
        }
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    changeSearch() {
      this.onGetList()
    }
  }
}
</script>
