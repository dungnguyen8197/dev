<template>
  <el-dialog
    :visible.sync="showDialog"
    class="dialog-statistic-bill"
    :show-close="false"
    :before-close="handleClose"
    center
    width="80%"
    append-to-body
  >
    <h4 style="margin: 0; width: 100%; font-weight: 700; color: #0A1F8F;">{{ "Xem lịch sử" }}</h4>
    <el-row style="margin:20px; font-family:Sans-serif">
      <el-row style="width: 100%;">
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%;">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column label="Thời gian thực hiện" align="center">
            <template slot-scope="scope">
              {{ scope.row.time ? (scope.row.type_user == 'Admin' ? convertDateTime(scope.row.time) : scope.row.time) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="type_action" label="Loại hành động" align="center" />
          <el-table-column prop="detail_action" label="Chi tiết hành động" align="center" />
          <el-table-column prop="user_action" label="Người thực hiện" align="center" />
          <el-table-column prop="type_user" label="Loại tài khoản" align="center" />
        </el-table>
        <el-row class="list-device__footer">
          <pagination
            v-show="total >= query.limit"
            style="padding: 0"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
        </el-row>
      </el-row>
    </el-row>
  </el-dialog>
</template>
<script>

import Pagination from '@/components/Pagination/index'
import { convertDateTime } from '@/utils/convert'

export default {
  name: 'DialogListUseAddEvent',
  components: {
    Pagination
  },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerVisible: false,
      formInline: {
        user: '',
        region: ''
      },
      loadingTable: false,
      loadingTableMember: false,
      query: { page: 1, limit: 10 },
      total: 0,
      tableData: [],
      tableDataMember: [],
      postForm: {}
    }
  },
  watch: {
    objectData(value) {
      if (value) {
        this.postForm = { ...value }
        this.onGetList()
      }
    }
  },
  created() {
  },
  methods: {
    async onGetList() {
      let data_log = []
      if (this.postForm.user_create_id > 0 && this.query.page === 1) {
        data_log.push(
          {
            time: this.postForm.created_at,
            type_action: 'Khởi tạo',
            detail_action: '',
            user_action: this.postForm?.user_create?.fullname,
            user_id: this.postForm?.user_create_id,
            type_user: 'Khách hàng'
          }
        )
        this.total = 1
      }
      if (this.postForm?.data_log) {
        const data_log_json = JSON.parse(this.postForm?.data_log)
        data_log = [...data_log, ...data_log_json]
      }
      this.tableData = data_log?.reverse().slice((this.query.page - 1) * this.query.limit, this.query.page * this.query.limit)
      this.total = data_log.length
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetquery()
    },
    async resetquery() {
      await Promise.resolve(
        this.query = { page: 1, limit: 10 },
        this.total = 0,
        this.tableData = []
      )
    },
    convertDateTime
  }
}
</script>
  <style scoped>
  .el-tag + .el-tag {
      margin-left: 10px;
  }

  .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
  }

  .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
  }
  .input-amount{
    width: 100%;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    padding: 0 10px;
  }
  .input-amount::placeholder{
    color: #606266;
  }
  .input-amount:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
  }
  .mb-10 {
    margin-bottom: 10px;
  }
</style>

