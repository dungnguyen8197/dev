<template>
  <el-dialog
    title="Danh sách user được thêm vào"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
    fullscreen
  >
    <el-row>
      <el-col class="mb-10">
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddFromApp">
          Duyệt từ app
        </el-button>
      </el-col>
      <el-col class="mb-10">
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
          Thêm mới
        </el-button>
      </el-col>
    </el-row>
    <el-row style="margin:20px; font-family:Sans-serif">
      <div class="filter-container" />
      <!-- max-height: 80vh; -->
      <el-row style="width: 100%;">
        <!-- max-height:60vh; overflow: scroll; -->
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%;">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column prop="user_id" label="vID" align="center">
            <template slot-scope="{row}">
              {{ `vID${row.user_id}` }}
            </template>
          </el-table-column>
          <el-table-column label="Họ tên" align="center">
            <template slot-scope="{row}">
              {{ row.user ? row.user.fullname : '' }}
            </template>
          </el-table-column>
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
    <el-dialog
      width="50%"
      title="Danh sách đăng ký qua app"
      :visible.sync="innerVisible"
      :before-close="handleCloseDialog"

      append-to-body
    >
      <div class="text-right pb-10">
        <el-button type="danger" @click="onClickRemoveHold"> Phê duyệt danh sách đã chọn</el-button>
      </div>
      <el-row class="list-account__data">
        <el-table
          v-loading="loadingTableMember"
          :data="tableDataMember"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="STT"
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column label="Tên golfer" align="center">
            <template slot-scope="{row}">
              {{ row.user ? row.user.fullname : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Vid"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.user_id ? row.user_id : '' }}
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="45"
          />
        </el-table>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > query.limit"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetListMember"
          />
        </el-row>
      </el-row>

    </el-dialog>
  </el-dialog>
</template>
<script>

import Pagination from '@/components/Pagination/index'
import EventResource from '@/api/event'
const eventResource = new EventResource()

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
      total: 10,
      tableData: [],
      tableDataMember: []
    }
  },
  watch: {
    objectData(value) {
      console.log('...................', value)
      if (value) {
        this.query = { ...this.query, ...value }
        this.onGetList()
      }
    },
    '$store.getters.isShowDialogAddUser'(value) {
      this.onGetList()
    }
  },
  created() {
    // this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      console.log('..........', this.query)
      eventResource.list_gofer_to_flight(this.query, this.query.id).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onClickRemoveHold() {
      this.$confirm('Bạn có chắc chắn muốn thực hiện thao tác này').then(_ => {
        const array = []
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.map(item => {
            array.push(item.id)
          })
          eventResource.acceptMemberEvent({ ids: array }).then(response => {
            if (response.error_code === 0) {
              this.$message.success(response.error_msg)
              this.handleCloseDialog()
            } else {
              this.$message.error(response.error_msg)
            }
          })
        } else {
          this.$message.warning('Vui lòng chọn bảo hiểm để gạch nợ')
        }
      }).catch(_ => {})
    },
    async onGetListMember() {
      this.loadingTableMember = true
      console.log('111111111', this.query)
      eventResource.listMemberEvent(this.query).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableDataMember = data.data
          this.total = data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTableMember = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleAdd() {
      this.$store.dispatch('showDialogAddUser', this.query.id)
    },
    handleAddFromApp() {
      this.innerVisible = true
      this.onGetListMember()
    },

    handleCloseDialog() {
      this.innerVisible = false
      this.onGetList()
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetquery()
    },

    async resetquery() {
      await Promise.resolve(
        this.query = { page: 1, limit: 10 },
        this.total = 10,
        this.tableData = []
      )
    }
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

