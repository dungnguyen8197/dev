<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Danh sách Kênh TV </h3>
        </el-col>

      </el-row>
      <div class="filter-container mt-10">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-input
              v-model="query.fullname"
              class="w-100"
              clearable
              placeholder="Nhập tên kênh TV"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-input
              v-model="query.name_unit"
              class="w-100"
              clearable
              placeholder="Nhập tên sự kiện"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
        </el-row>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Tìm kiếm
        </el-button>
        <el-button class="filter-item" icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>

        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddEvent">Thêm mới
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
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            prop="name"

            :label="('Tên kênh TV ')"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.chanel_name ? row.chanel_name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label=" Sự kiện "
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.event ? row.event.name : '' }}
            </template>

          </el-table-column>
          <el-table-column label="Poster" width="150" align="center">
            <template slot-scope="{row}">
              <el-link type="success" :href="row.link" target="_blank">{{ row.link ? row.link : '' }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Trạng thái hiển thị"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.active === true ? 'success' : 'danger'">{{ row.active === true ? "Hiển thị " : "Không hiển thị" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="scope">
              <el-button
                class="mb-5"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditEvent(scope.row)"
              >
                Sửa
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
        <dialog-add-chanel-t-v
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
import { formatDate, formatNumber } from '@/utils/convert'
import { isEmpty } from '@/utils/validate'

import DialogAddChanelTV from '@/views/event/components/DialogAddChanelTV.vue'
const arrayYesNo = { 1: 'Có', 0: 'Không' }
const eventResource = new EventResource()

export default {
  name: 'ListChanelTV',
  components: {
    DialogAddChanelTV,
    Pagination
  },
  data() {
    return {
      organizations: [],
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
      showDialogListUser: false,
      objectDataListUser: {},
      showDialogListAchievement: false,
      objectDataListAchievement: {},
      statistic_count: 0,
      title: ''
    }
  },
  watch: {

  },
  created() {
    this.onGetList()
  },
  methods: {
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
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

    onGetList() {
      this.loadingTable = true
      eventResource.listChanelTv(this.query).then(res => {
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
      return this.query.page === 1 ? this.query.page + index : ((this.query.page - 1) * this.query.limit) + index + 1
    },

    handleClose(value) {
      this.showDialogAddEvent = false
      this.showDialogListUser = false
      this.showDialogListAchievement = false
      if (value.reload) {
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

.w-100 {
  width: 100%;
}

.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  text-transform: uppercase;
}

.mb-5 {
  margin-bottom: 5px !important;
}
</style>
