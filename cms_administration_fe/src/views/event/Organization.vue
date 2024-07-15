<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Quản lý đơn vị tổ chức sự kiện</h3>
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
              placeholder="Nhập tên đơn vị tổ chức"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
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
            prop="name"

            :label="('Tên đơn vị')"
            align="center"
          />
          <el-table-column
            label="Logo"
            align="center"
          >
            <template slot-scope="{row}">
              <el-image
                v-if="row.avt_organization"
                style="width: 100px; height: auto"
                :src="row.avt_organization"
              />
              <span v-else>Không có ảnh</span>
            </template>
          </el-table-column>
          <el-table-column
            label="trạng thái"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.is_active === 1 ? 'success' : 'danger'">{{ arrayYesNo[row.is_active] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="Ngày tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatDate(row.createdAt) }}
            </template>

          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="{row}">
              <el-button
                v-if="row.type === 1"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditEvent(row)"
              >
                Sửa
              </el-button>
              <el-button
                v-if="row.type === 1"

                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleDeleteEvent(row.id)"
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
        <dialog-add-unit
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
import UnitResource from '@/api/event/unit'
import DialogAddUnit from '@/views/event/components/DialogAddOrganization.vue'
import { formatDate, formatNumber } from '@/utils/convert'
import { isEmpty } from '@/utils/validate'

import moment from 'moment'
const arrayYesNo = { 1: 'Kích hoạt', 0: 'khóa' }

const unitResource = new UnitResource()

export default {
  name: 'List',
  components: { Pagination, DialogAddUnit },
  data() {
    return {
      arrayYesNo: arrayYesNo,
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
      objectData: {},
      dateRange: '',
      statusEvent: {
        0: 'Sắp diễn ra',
        1: 'Đang diễn ra',
        2: 'Hoàn thành'
      }
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
    checkTimeShow(item) {
      if (item.tee_time_end) {
        const now = moment()
        const tee_time_end = moment(item.tee_time_end)
        return now.isBefore(tee_time_end)
      }
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },
    handleSelectionChanged(value) {
      console.log('value_____', value)
      if (isEmpty(value)) {
        delete this.query.facility_id
        this.handleFilter()
        return
      }
      this.query.facility_id = value.value
      this.handleFilter()
    },
    handleSelectionChangedUser(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.query.uid
        this.handleFilter()
        return
      }
      this.query.uid = value.value
      this.handleFilter()
    },
    handleSelectionChangedClub(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.query.club_id
        this.handleFilter()
        return
      }
      this.query.club_id = value.value
      this.handleFilter()
    },
    onGetList() {
      this.loadingTable = true
      unitResource.lists(this.query).then(res => {
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
      this.dateRange = ''
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddEvent = value.dialog
      if (value.reload) {
        this.query = Object.assign({}, { limit: 10, page: 1 })
        this.onGetList()
      }
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
        unitResource.remove(id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    formatDate, formatNumber
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
