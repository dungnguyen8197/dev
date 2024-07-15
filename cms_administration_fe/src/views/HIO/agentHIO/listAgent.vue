<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h1 style="margin: 0; width: 100%; padding: 10px">Danh sách đại lý</h1>
        <div style="width: 100%;">
          <el-button style="float:right; padding-top: 11px" type="primary" @click="onAddAgent">Tạo đại lý +
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Tổng số đại lý</div>
            <count-to :start-val="0" :end-val="total" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="filter-container">
      <el-col :sm="4" class="mr-10">
        <el-select
          v-model="listQuery.agent_id"
          filterable
          clearable
          remote
          class="w-100"
          placeholder="Tìm đại lý"
          :remote-method="onSearchAgent"
          :loading="loadingSearchAgency"
        >
          <el-option
            v-for="agent in agents"
            :key="agent.value"
            :label="agent.label"
            :value="agent.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="mr-10">
        <el-select
          v-model="listQuery.level_agent"
          class="filter-item full-width"
          placeholder="Loại Đại lý"
        >
          <el-option
            v-for="level in arrayLevelAgent"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="5" class="">
        <el-select
          v-model="listQuery.status_confirm"
          class="filter-item full-width"
          placeholder="Trạng thái phê duyệt"
        >
          <el-option
            v-for="status in statusConfirm"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-col>
      <el-button
        type="primary"
        icon="el-icon-download"
        :loading="loadingExportExcel"
        @click="handleDownload"
      >
        Export excel
      </el-button>
      <el-button icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
      <el-button type="primary" icon="el-icon-search" @click.prevent="onGetList(1)">
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
          label="Tên đại lý"
          align="center"
        />
        <el-table-column
          label="vID đại lý"
          align="center"
        >
          <template v-if="scope.row.agent_vid !== 0" slot-scope="scope">
            vID{{ `${scope.row.agent_vid}` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="code_agent"
          label="Mã đại lý"
          align="center"
        />
        <el-table-column
          label="Sale phụ trách"
          align="center"
        >
          <template v-if="scope.row.sale !== null" slot-scope="scope">
            {{ `${scope.row.sale.name}` }}
          </template>
        </el-table-column>

        <el-table-column
          prop="phone_number"
          label="SĐT đại lý"
          align="center"
        />
        <el-table-column
          prop="address"
          label="Địa chỉ"
          align="center"
        />
        <el-table-column
          prop="tax_code"
          label="Mã số thuế"
          align="center"
        />
        <el-table-column
          label="Cấp đại lý"
          align="center"
        >
          <template v-if="scope.row.level_agent !== null" slot-scope="scope">
            <p v-if="scope.row.level_agent === 1">Loại 1</p>
            <p v-else-if="scope.row.level_agent === 2">Loại 2</p>
            <p v-else-if="scope.row.level_agent === 3">Đại lý sân golf</p>
          </template>
        </el-table-column>

        <el-table-column
          label="Hợp đồng"
          align="center"
        >
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.url_file"
              type="primary"
              :href="scope.row.url_file"
              target="_blank"
            > <el-button>Xem </el-button></el-link>

          </template>
        </el-table-column>
        <el-table-column
          label="Tổng đại lý"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.parent">{{ scope.row.parent.name }}</el-tag>
            <el-tag v-else>Đại lý tổng</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Loại đại lý"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.agent_type === 0">Đại lý cá nhân</el-tag>
            <el-tag v-else-if="scope.row.agent_type === 1">Đại lý Doanh Nghiệp</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Duyệt đại lý"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.status_confirm"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatusAgent(scope.row,'approve')"
              />
            </div>
            <div style="padding-top: 5px">
              <el-tag v-if="scope.row.status_confirm === 0" type="secondary">Chưa phê duyệt</el-tag>
              <el-tag v-else-if="scope.row.status_confirm === 1" type="success">Đã phê duyệt</el-tag>
              <el-tag v-if="scope.row.status_confirm === 1 && scope.row.adminConfirm" type="success">{{ scope.row.adminConfirm.name }}</el-tag>
              <el-tag v-if="scope.row.status_confirm === 1" type="success">Cập nhật: {{ convertDateTimeSecond(scope.row.updated_at) }}</el-tag>
            </div>
          </template>
        </el-table-column>
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
            <el-button type="primary" icon="el-icon-edit" round size="mini" @click="onEditAgent(scope.row)">Sửa
            </el-button>
            <!--            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDeleteAccount(scope.row)" />-->
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
      <dialog-form-agent
        :dialog-visible="showDialog"
        :is-add="isAdd"
        :object-data="objectData"
        @onClickCloseDialog="handleCloseDialog"
      />
    </el-row>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import moment from 'moment'
import { convertDateTimeSecond } from '@/utils/convert'
import { getAcountInfo } from '@/utils/auth'
import AgentHIOResource from '@/api/HIO/agentHIO'
// import axios from 'axios'

const agentHIOResource = new AgentHIOResource()
import CountTo from 'vue-count-to'
import DialogFormAgent from './DialogFormAgent'
import { baseURL } from '@/constant/config'

const arrayLevelAgent = [
  { value: 1, label: 'Loại 1' },
  { value: 2, label: 'Loại 2' },
  { value: 3, label: 'Đại lý sân golf' }
]

const statusConfirm = [
  { value: 0, label: 'Chưa phê duyệt' },
  { value: 1, label: 'Phê duyệt' }
]

export default {
  name: 'List',
  components: { Pagination, CountTo, DialogFormAgent },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      listQuery: { page: 1, limit: 10 },
      listBody: {},
      total: 0,
      isAdd: true,
      onShowDialog: false,
      showDialog: false,
      dialogObject: {},
      dialogConfirmAgent: false,
      arrayLevelAgent: [...arrayLevelAgent],
      statusConfirm: [...statusConfirm],
      changeStatus: [],
      objectData: {},
      loadingExportExcel: false,
      totalAgentNotApprove: 0,
      agents: [],
      loadingSearchAgency: false
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
    onGetList(e) {
      if (e === 1) {
        this.listQuery.page = 1
      }
      this.loadingTable = true
      agentHIOResource.list(this.listQuery).then(res => {
        this.tableData = res?.data?.data || []
        this.total = res?.data?.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    async handleDownload() {
      let stop = false
      const query = {
        page: 1,
        limit: 10000
      }
      query.agent_id = this.listQuery.agent_id
      query.name = this.listQuery.name
      query.level_agent = this.listQuery.level_agent
      query.status_confirm = this.listQuery.status_confirm
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await agentHIOResource.list(query)
          console.log('res..............', res.data.data)
          console.log('this.tableData', res.data.data)
          if (res.data.data.length <= 0) {
            stop = true
          }
          list_all = [...list_all, ...res.data.data]
          console.log('list_all', list_all)
          if (res.error_code === 0) {
            stop = true
          }
        } catch (error) {
          console.error(error)
          stop = true
        }
      }

      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Tên đại lý', 'vID đại lý', 'Mã đại lý', 'Sale phụ trách', 'SĐT đại lý', 'Địa chỉ', 'Mã số thuế', 'Cấp đại lý', 'Loại đại lý', 'Duyệt đại lý', 'Ngày tạo']
        const filterVal = ['name', 'agent_vid', 'code_agent', 'totalMoneyDebit', 'phone_number', 'address', 'tax_code', 'level_agent', 'agent_type', 'status_confirm', 'created_at']
        let data = list_all
        data = this.formatJson(filterVal, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-list'
        })
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'name') {
          return v[j]
        } else if (j === 'name') {
          return v[j]
        } else if (j === 'agent_vid') {
          return v[j]
        } else if (j === 'code_agent') {
          return v[j]
        } else if (j === 'address') {
          return v[j]
        } else if (j === 'phone_number') {
          return v[j]
        } else if (j === 'tax_code') {
          return v[j]
        } else if (j === 'level_agent') {
          return v[j]
        } else if (j === 'agent_type') {
          return +v[j] === 0 ? 'đại lý cá nhân' : 'Đại lý doanh nghiệp'
        } else if (j === 'status_confirm') {
          return +v[j] === 0 ? 'Chưa duyệt' : 'Đã duyệt'
        } else if (j === 'created_at') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    },
    async onSearchAgent(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchAgency = true
      agentHIOResource.searchAgentNew({ keyword: keywords }).then(res => {
        const data = res.data.data
        const array = []
        if (data.length > 0) {
          data.map(value => {
            const item = { label: `${value.name}`, value: value.id }
            array.push(item)
          })
        }
        this.agents = [...array]
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchAgency = false
    },
    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    changeStatusAgent(row, type) {
      let obj = {}
      switch (type) {
        case 'approve':
          obj = {
            user_confirm: getAcountInfo().id,
            status_confirm: row.status_confirm
          }
          break
        case 'status':
          obj = { status: row.status }
          break
      }
      this.$confirm(`Bạn có chắc chắn muốn xác nhận đại lý ${row.name}`).then(_ => {
        agentHIOResource.updateStatus(obj, row.id).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.error_msg)
            if (type === 'approve') {
              this.onGetList()
            }
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleCloseDialog(object) {
      if (object.dialog) {
        this.showDialog = false
        this.onGetList()
      }
    },
    onAddAgent() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },

    onEditAgent(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, row)
    },

    onDeleteAccount(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa đại lý ${row.name}`).then(_ => {
        agentHIOResource.remove(row.id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    convertLink(value) {
      return baseURL + value
    },
    handleFilter() {
      this.listQuery.page = 1
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
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

.icon-people {
  color: #40c9c6;
}

.icon-message {
  color: #36a3f7;
}

.icon-money {
  color: #f4516c;
}

.icon-shopping {
  color: #34bfa3
}

.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel-icon {
  float: left;
  font-size: 48px;
}

.card-panel-col {
  margin-bottom: 32px;
}

.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
}

.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}

.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-num {
  font-size: 20px;
}

.panel-group {
  margin-top: 18px;

}
</style>
