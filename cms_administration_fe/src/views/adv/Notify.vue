<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header mb-10">
      <el-col :sm="24" style="display:flex">
        <h3 style="margin: 0; width: 80%;">Danh sách chương trình đã tạo</h3>
        <div style="width: 20%;">
          <el-button style="float:right; padding-top: 11px" type="primary" @click="handleCreateAccount">Tạo Notify +
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: flex-end; align-items: center;" class="filter-container">
      <el-input
        v-model="query.name"
        clearable
        placeholder="Tìm kiếm theo tên"
        style="width: 200px;"
        class="filter-item mr-10"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="dateTime"
        class="filter-item mr-10"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
      <el-button class="filter-item " type="primary" icon="el-icon-search" @click="handleFilter">
        Tìm kiếm
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        style="background-color: #fff; color: #000; border: 1px solid rgb(151 149 149) ;"
        :loading="loadingTable"
        @click="refresh"
      >
        Làm mới
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
        <el-table-column
          width="200"
          prop="name"
          :label="('Title')"
          align="center"
        />
        <el-table-column
          width="120"
          :label="('Branch Name')"
          align="center"
        >
          <template slot-scope="{row}">
            {{ branchName[row.branch_name] }}
          </template>
        </el-table-column>
        <el-table-column
          width="400"
          prop="content"

          label="Nội dung Noti"
          align="center"
        />

        <el-table-column
          width="150"
          prop="start_date"
          label="Thời gian thực hiện"
          align="center"
        />

        <el-table-column
          width="150"
          prop="end_date"
          label="Thời gian kết thúc"
          align="center"
        />
        <el-table-column
          width="100"
          label="Admin tạo"
          align="center"
        >
          <template slot-scope="{row}">
            {{ handleAdmin(row.cskh_id) }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="Tổng số user nhận"
          align="center"
        >
          <template slot-scope="{row}">
            {{ formatNumber(row.number_send) }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          width="150"
          label="Tổng số đã nhận"
          align="center"
        >
          <template slot-scope="{row}">
            {{ formatNumber(row.number_receiver) }}
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="Tổng gửi lỗi"
          align="center"
        >
          <template slot-scope="{row}">
            {{ formatNumber(row.number_fail) }}
          </template>
        </el-table-column> -->
        <el-table-column
          width="150"
          prop="is_active"
          label="Trạng thái"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag :type="status_color[row.state]">
              {{ status_notify[row.state] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column width="200" label="Hành động" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(row)" />
            <el-button :disabled="row.state == -1" type="danger" round @click="onDeleteAccount(row)"> Hủy</el-button>
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
      <dialog-add-notify
        :show-dialog="onShowDialog"
        :is-add="isAdd"
        :object-data="objectData"
        @onClickButtonDialog="handleClickButtonDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import DialogAddNotify from '@/views/adv/component/DialogAddNotify.vue'
import { getAcountInfo, getAllAdmin } from '@/utils/auth'
import { convertDateTimeSecond, formatNumber } from '@/utils/convert'
import NotifyResource from '@/api/adv/notify'
import { STATUS_NOTIFY, COLOR_STATUS_NOTI } from '@/utils/status'
import moment from 'moment'
import { BRANCH_NAME } from '@/utils/status'

const notifyResource = new NotifyResource()

export default {
  name: 'List',
  components: { DialogAddNotify, Pagination },
  data() {
    return {

      tableData: [],
      loadingTable: false,
      total: 0,
      isAdd: true,
      onShowDialog: false,
      objectData: {},
      roles: [],
      status_notify: STATUS_NOTIFY,
      status_color: COLOR_STATUS_NOTI,
      query: {
        limit: 10,
        page: 1
      },
      dataAllAdmin: getAllAdmin() || [],
      admin: getAcountInfo(),
      currentPermissions: '',
      dateTime: '',
      branchName: BRANCH_NAME

    }
  },
  computed: {

  },
  watch: {
    dateTime(val) {
      if (val) {
        this.query.start_date = moment(val[0]).format('YYYY-MM-DD')
        this.query.end_date = moment(val[1]).format('YYYY-MM-DD')
      } else {
        delete this.query.start_date
        delete this.query.end_date
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      notifyResource.listNotify(this.query).then(res => {
        if (res.data.error_code === 0) {
          const result = res?.data?.data

          this.tableData = result?.items

          this.total = result.count
        } else {
          this.$message.error('Có lỗi sảy ra vui lòng liên hệ bộ phận kỹ thuật.')
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onShowDialogEdit(row) {
      this.objectData = Object.assign({}, row)
      this.isAdd = false
      this.onShowDialog = true
    },
    handleCreateAccount() {
      this.isAdd = true
      this.onShowDialog = true
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },
    handleAdmin(admin_id) {
      const admin = this.dataAllAdmin.find(item => item.id === admin_id)
      if (admin) return admin.name
      else return admin_id
    },
    async refresh() {
      this.query = {
        name: ''
      }
      this.dateTime = ''
      await this.onGetList()
    },
    onDeleteAccount(row) {
      this.loadingSubmit = true
      const body = {
        id: row.id,
        state: -1
      }
      notifyResource.updateNotify(body).then(res => {
        if (res.error_code === 0) {
          this.$message.success('Hủy thành công.')
          this.onGetList()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    handleFilter() {
      this.query.page = 1
      this.onGetList()
    },

    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    convertDateTimeSecond, formatNumber
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

</style>
