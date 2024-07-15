<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">QUẢN LÝ OPTION THÀNH TÍCH</h3>
        </el-col>
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddEvent">Thêm mới
        </el-button>
      </el-row>
      <div class="filter-container mt-10">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="query.keyword"
              class="w-100"
              clearable
              placeholder="Nhập tên"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="12" :md="8">
            <el-button class="filter-item" icon="el-icon-refresh" round @click="onReset">Reset</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
          </el-col>
        </el-row>

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
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            prop="achievement_name"
            label="Loại thành tích"
            align="center"
          />
          <el-table-column label="Custom name" align="center">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_custom"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                @change="changeDisplay(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditEvent(scope.row)"
              >
                Sửa
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleDeleteEvent(scope.row.id)"
              >
                Xóa
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > query.limit"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
        </el-row>
        <dialog-option-achievement
          :show-dialog="showDialogAddEvent"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import EventResource from '@/api/event'
import DialogOptionAchievement from '@/views/event/components/DialogOptionAchievement.vue'
import { formatDate, formatNumber } from '@/utils/convert'
import moment from 'moment'
import { trim_string_object } from '@/utils/trim-string-object'

const eventResource = new EventResource()

export default {
  name: 'ListOptionAchievement',
  components: { Pagination, DialogOptionAchievement },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      total: 0,
      isAdd: true,
      onShowDialog: false,
      query: {
        limit: 10,
        page: 1
      },
      loadingData: true,
      from: 0,
      showDialogAddEvent: false,
      objectData: {}
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.start_date = moment(value[0]).unix()
        this.query.end_date = moment(value[1]).unix()
      } else {
        this.query.start_date = ''
        this.query.end_date = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      await this.trim_string_object(this.query)
      eventResource.list_option_achievement(this.query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res?.data?.data || []
          this.total = res?.data?.total || 0
          console.log('this.tableData___________', this.tableData)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddEvent = value.dialog
      this.onGetList()
    },
    handleAddEvent() {
      this.isAdd = true
      this.showDialogAddEvent = true
      this.objectData = {}
    },
    handleEditEvent(row) {
      this.isAdd = false
      this.showDialogAddEvent = true
      this.objectData = Object.assign({}, row)
    },
    handleDeleteEvent(id) {
      this.$confirm(`Bạn có chắc chắn xóa đơn vị này không ?`).then((_) => {
        eventResource.remove_option_achievement({ id: id }).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.data)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    changeDisplay(row) {
      console.log('row................', row)
      const params = {
        is_hidden: row.is_custom === 1 ? 1 : 0
      }
      eventResource.change_status_custom(params, row.id).then(response => {
        console.log('response................', response)
        if (response.error_code === 1) {
          console.log('response................', response)
          this.$message.error('Thay đổi trạng thái thất bại')
          return
        }
        this.$message.success('Thay đổi trạng thái thành công')
        this.onGetList()
      })
    },
    formatDate, formatNumber, trim_string_object
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}
.pr-5 {
  padding-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mt-10 {
  margin-top: 10px;
}
.w-100{
  width: 100%;
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
