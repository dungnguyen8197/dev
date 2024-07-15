<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">QL Option đơn vị tổ chức sự kiện</h3>
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
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-select
              v-model="query.organization_id"
              class="w-100"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="Tìm kiếm theo đơn vị cha"
              @change="handleFilter"
            >
              <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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

            :label="('Tên đơn vị con')"
            align="center"
          />
          <el-table-column
            :label="('Thuộc đơn vị cha')"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row?.organization?.name }}
            </template>

          </el-table-column>
          <el-table-column label="Hình ảnh" width="150" align="center">
            <template slot-scope="{row}">
              <img
                :src="row.image"
                alt=""
                width="100%"
              >
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
        <dialog-add-organization-option
          :show-dialog="showDialogAddEvent"
          :object-data="objectData"
          :organizations="organizations"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import OrganizationOptionResource from '@/api/event/organizationOption'
import UnitResource from '@/api/event/unit'
import DialogAddOrganizationOption from '@/views/event/components/DialogAddOrganizationOption.vue'
import { formatDate, formatNumber } from '@/utils/convert'
import { isEmpty } from '@/utils/validate'

import moment from 'moment'
const arrayYesNo = { 1: 'Khóa', 0: 'Kích hoạt' }

const organizationOptionResource = new OrganizationOptionResource()
const unitResource = new UnitResource()

export default {
  name: 'List',
  components: { Pagination, DialogAddOrganizationOption },
  data() {
    return {
      arrayYesNo: arrayYesNo,
      tableData: [],
      organizations: [],
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
      dateRange: ''
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
    this.onGetOrganization()
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
      organizationOptionResource.lists(this.query).then(res => {
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
    onGetOrganization() {
      unitResource.lists({ page: 1, limit: 50 }).then(res => {
        if (res.error_code === 0) {
          this.organizations = res?.data?.data
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleEditEvent(row) {
      this.isAdd = false
      this.showDialogAddEvent = true
      this.objectData = Object.assign({}, row)
    },
    handleDeleteEvent(id) {
      this.$confirm(`Bạn có chắc chắn xóa đơn vị này không ?`).then((_) => {
        organizationOptionResource.remove(id).then(res => {
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
