<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header mb-10">
      <el-col :sm="24" style="display:flex">
        <h3 style="margin: 0; width: 80%;">Danh sách quảng cáo Popup</h3>
        <div style="width: 20%">
          <el-button
            style="float: right; padding-top: 11px"
            type="primary"
            @click="handleCreateAdv"
          >Thêm quảng cáo +
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div style="float: right" class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        placeholder="Tìm kiếm theo tên"
        style="width: 170px"
        class="filter-item mr-10"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.is_displayed"
        clearable
        placeholder="Trạng thái"
        style="width: 150px"
        class="filter-item mr-10"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.startDate"
        class="filter-item mr-10"
        type="date"
        format="dd-MM-yyyy"
        value-format="yyyy-MM-dd"
        placeholder="Chọn ngày bắt đầu"
        style="width: 180px"
      />
      <el-date-picker
        v-model="listQuery.endDate"
        class="filter-item mr-10"
        type="date"
        format="dd-MM-yyyy"
        value-format="yyyy-MM-dd"
        placeholder="Chọn ngày kết thúc"
        style="width: 185px"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Tìm kiếm
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        style="
          background-color: #fff;
          color: #000;
          border: 1px solid rgb(151 149 149);
        "
        :loading="loadingTable"
        @click="refreshPopUP"
      >
        Làm mới
      </el-button>
    </div>
    <div class="data-table p-10">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          label="Id"
          width="70"
          align="center"
          type="index"
          :index="handleIndexMethod"
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiêu đề" align="center">
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thời gian" width="180" align="center">
          <template slot-scope="{ row }">
            <div>{{ convertToDateTimeString(row.start_time) }}</div>
            <div>{{ convertToDateTimeString(row.expiried_time) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="Màn hình điều hướng"
          width="150px"
          align="center"
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.target?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Admin" width="100" align="center">
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.admin?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hiển thị" width="100" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.is_displayed"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              @change="change(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="Hình ảnh" width="180" align="center">
          <template slot-scope="{ row }">
            <img
              :src="
                row.banner_url.includes('http')
                  ? row.banner_url
                  : baseUrlImg + '/' + row.banner_url
              "
              alt=""
              width="100%"
            >
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="140" align="center">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(row)"
            />
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination
          v-show="total > listQuery.number"
          :total="total"
          :limit.sync="listQuery.number"
          :page.sync="listQuery.page"
          @pagination="getList"
        />
      </el-row>
    </div>
    <dialog-adv
      :is-popup="true"
      :is-score-card="false"
      :is-add="isAdd"
      :show-dialog="dialogFormVisible"
      :object-data="objectAdv"
      @onClickButtonDialog="handleClickButtonDialog"
    />
  </el-row>
</template>

<script>
import DialogAdv from '@/views/adv/component/DialogAdv.vue'
import AdvResource from '@/api/adv/popup'
import { SCREEN_APP, TYPE_ADV } from '@/utils/status'
import { convertToDateTimeString } from '@/utils/convert'
import Pagination from '@/components/Pagination/index.vue'

const statusDisplay = [
  { value: 1, label: 'Hiển thị' },
  { value: 0, label: 'Ẩn' }
]
const advResource = new AdvResource()

export default {
  name: 'Home',
  components: { Pagination, DialogAdv },
  data() {
    return {
      loadingTable: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: ''
      },
      isAdd: true,
      objectAdv: {},
      typeAdv: TYPE_ADV,
      screenApp: SCREEN_APP,
      tableData: [],
      baseUrlImg: process.env.VUE_APP_BASE_API,
      searchValue: '',
      total: 0,
      listQuery: {
        page: 1,
        number: 10
      },
      statusOptions: statusDisplay
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleClickButtonDialog(isAdd, objectAdv) {
      console.log('isAdd', isAdd)
      console.log('objectAdv', objectAdv)
      this.isAdd = true
      this.objectAdv = {}
      this.dialogFormVisible = false
      this.getList()
    },
    handleCreateAdv() {
      this.isAdd = true
      this.objectAdv = {}
      this.dialogFormVisible = true
    },
    getList() {
      this.loadingTable = true
      advResource
        .listAdv(this.listQuery)
        .then((res) => {
          this.tableData = res.data.rows
          this.total = res.data.count
        })
        .finally(() => {
          this.loadingTable = false
        })
    },
    search() {
      advResource.listAdv({ title: this.searchValue }).then((res) => {
        this.tableData = res.data
      })
    },
    convertToDateTimeString,
    handleEdit(row) {
      console.log('row', row)
      this.isAdd = false
      this.objectAdv = row
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('Bạn có chắc chắn muốn xóa?', 'Cảnh báo', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          advResource.destroyAdv({ id: row.id }).then((res) => {
            this.$message({
              type: 'success',
              message: 'Xóa thành công!'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    async refreshPopUP() {
      this.listQuery = {
        name: '',
        is_displayed: null,
        startDate: null,
        endDate: null
      }

      await this.getList()
    },
    change(row) {
      console.log('row', row)
      advResource
        .activeAdv({ id: row.id, is_displayed: row.is_displayed })
        .then((res) => {
          console.log('res', res)
          if (res.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Cập nhật thành công!'
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Cập nhật thất bại!'
            })
            row.is_displayed = !row.is_displayed
          }
        })
        .catch((err) => {
          console.log('err', err)
          row.is_displayed = !row.is_displayed
        })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1
        ? this.listQuery.page + index
        : this.listQuery.page * 10 + index
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style>
.p-10 {
  padding: 10px;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.mr-10 {
  margin-right: 10px;
}
.store-update-box {
  padding-left: 12px;
}
</style>
