<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h3 style="margin: 0; width: 100%; padding: 10px">Danh sách dịch vụ</h3>
        <div style="width: 100%;">
          <el-button style="float:right; padding-top: 11px" type="primary" @click="handleCreateAccount">Tạo dịch vụ +
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-col :sm="4" class="mr-10">
        <el-input
          v-model="listBody.descriptions"
          placeholder="Tên dịch vụ"
          class="filter-item full-width"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </el-col>
      <!-- <el-col :sm="4" class="mr-10">
        <el-input
          v-model="listBody.permission_name"
          placeholder="Slug"
          class="filter-item full-width"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </el-col> -->
      <el-col :sm="4" class="mr-10">
        <el-date-picker
          v-model="time_step_1"
          clearable
          style="width: 100%;"
          type="datetime"
          align="center"
          format="dd-MM-yyyy HH:mm:ss"
          placeholder="Chọn thời gian bắt đầu"
        />
      </el-col>
      <el-col :sm="4" class="mr-10">
        <el-date-picker
          v-model="time_step_2"
          clearable
          style="width: 100%;"
          type="datetime"
          default-time="23:59:00"
          align="center"
          format="dd-MM-yyyy HH:mm:ss"
          placeholder="Chọn thời gian kết thúc"
          :picker-options="datePickerOptions"
        />
      </el-col>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Tìm kiếm
      </el-button>
    </div>

    <el-row class="list-account__data">
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
          prop="name"
          label="Tên dịch vụ"
          align="center"
        />
        <el-table-column
          label="Ngày tạo"
          align="center"
        >
          <template slot-scope="{row}">
            {{ convertDateTimeSecond(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="onDeleteAccount(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetList"
        />
      </el-row>
      <dialog-form-notification
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :object-data="dialogObject"
        @onClickButtonDialog="handleClickButtonDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import DialogFormNotification from './components/DialogFormNotification'
import moment from 'moment'
import { convertDateTimeSecond } from '@/utils/convert'
import TypeServiceResource from '@/api/type-service'

const typeServiceResource = new TypeServiceResource()

export default {
  name: 'List',
  components: { DialogFormNotification, Pagination },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      listQuery: { page: 1, limit: 10 },
      listBody: {},
      total: 0,
      isAdd: true,
      onShowDialog: false,
      dialogObject: {},
      time_step_1: '',
      time_step_2: ''
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.time_step_1)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    time_step_1(value) {
      this.listBody.time_step_1 = value ? moment(value).unix() : ''
    },
    time_step_2(value) {
      this.listBody.time_step_2 = value ? moment(value).unix() : ''
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onShowDialogEdit(row) {
      this.dialogObject = { row }
      this.isAdd = false
      this.onShowDialog = true
    },
    handleCreateAccount() {
      this.dialogObject = { row: null }
      this.isAdd = true
      this.onShowDialog = true
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },
    onDeleteAccount(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa dịch vụ ${row.name}`).then(_ => {
        typeServiceResource.remove(row.id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    onGetList() {
      this.loadingTable = true
      typeServiceResource.list(this.listBody, this.listQuery).then(res => {
        this.tableData = res?.data?.data || []
        this.total = res?.data?.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    convertDateTimeSecond
  }
}
</script>
<style scoped>
.pr-5 {
  padding-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.content {
  line-height: 1.5rem;
  max-height: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>
