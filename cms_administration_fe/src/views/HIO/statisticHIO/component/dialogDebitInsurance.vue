<template>
  <el-dialog class="detail-custom" title="Danh sách đơn bảo hiểm" :visible.sync="showDialog" :before-close="handleClose" width="80%">
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      :loading="loadingExportExcel"
      @click="handleDownload"
    >
      Export excel
    </el-button>
    <el-row class="table-history">
      <el-col>
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :index="handleIndexMethod"
            label="STT"
            width="50"
          />
          <el-table-column
            label="Mã BH"
          >
            <template slot-scope="scope">
              {{ `BH${scope.row.id}` }}
            </template>
          </el-table-column>
          <el-table-column
            label="Đại lý"
          >
            <template slot-scope="scope">
              {{ (scope.row.agent) ? scope.row.agent.name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name_tour"
            label="Tên giải đấu"
          />
          <el-table-column prop="facility.sub_title" label="Tên Sân" />
          <el-table-column label="Mã vID/Passport">
            <template slot-scope="scope">
              <p> {{ `vID${scope.row.user_id}` }}</p>
            </template>
          </el-table-column>
          <el-table-column label="Gói BH">
            <template slot-scope="scope">
              <template v-if="scope.row.money.reward_value === 100000000 ">
                <p>D100</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 200000000">
                <p>D200</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 50000000 ">
                <p>D50</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 20000000">
                <p>D20</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 46000000 ">
                <p>F10</p>
              </template>
              <template v-else-if="scope.row.money.reward_value === 92000000 ">
                <p>F20</p>
              </template>
              <template v-else />
            </template>
          </el-table-column>
          <el-table-column label="Giá mua">
            <template slot-scope="scope">
              {{ (scope.row.money) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="date_played" label="Ngày chơi" />
          <el-table-column label="Ngày Tạo" prop="created_at" />
          <el-table-column label="Trạng thái gạch nợ">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status_debit === 1" type="success">Đã trả</el-tag>
              <div v-else-if="scope.row.status_debit === 2">
                <el-tag type="danger">Ghi nợ</el-tag>
                <p>{{ (scope.row.money) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}</p>
              </div>
              <el-tag v-else-if="scope.row.status_debit === 3" type="warning">Công nợ</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time_pay" label="Ngày thanh toán" />
          <el-table-column label="Trạng thái">
            <template slot-scope="scope">
              <el-tag :type="(scope.row.is_pay === 0 ? 'info' : 'success')">
                {{ convertIsPayToString(scope.row.is_pay) }}
              </el-tag>
              <el-tag :type="convertIsSendPviToString(scope.row.is_send_pvi).className">
                {{ convertIsSendPviToString(scope.row.is_send_pvi).text }}
              </el-tag>
              <el-tag>{{ convertSourceBuyToString(scope.row.source_buy) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Người xử lý">
            <template slot-scope="scope">
              <template v-if="scope.row.dcard">
                <el-tag type="info">{{ scope.row.dcard.serial }}</el-tag>
              </template>
              <template v-else-if="scope.row.admin">
                <el-tag type="info">{{ scope.row.admin.name }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú">
            <template slot-scope="scope">
              {{ (scope.row.note) }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="debitInsurance"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import AgentHIOResource from '@/api/HIO/agentHIO'
const typeServiceResource = new AgentHIOResource()
// import ButtonSendPvi from '@/views/HIO/insurance/listInsurance/component/ButtonSendPvi.vue'
import Pagination from '@/components/Pagination/index.vue'
// import ButtonCancelSendPvi from '@/views/HIO/insurance/listInsurance/component/ButtonCancelSendPvi.vue'
import {
  formatNumber
} from '@/utils/convert'
import {
  convertIsPayToString,
  convertSourceBuyToString,
  convertIsSendPviToString,
  convertSourcePayToString
} from '@/utils/insurance/convertNumberToString'
export default {
  name: 'DebitInsurance',
  components: { Pagination },
  props: {
    objectDebitInsurance: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    objectQuery: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      detail: {},
      loading: false,
      listQuery: { page: 1, limit: 10 },
      loadingUpdateVerify: false,
      tableData: [],
      total: 0,
      loadingExportExcel: false

    }
  },
  watch: {
    objectDebitInsurance(val) {
      if (val) {
        this.debitInsurance(val.id)
      }
    }
  },
  methods: {
    debitInsurance() {
      console.log('ssssssssssssssss', this.objectDebitInsurance)
      const query = {
        agent_id: this.objectDebitInsurance.id,
        limit: this.listQuery.limit,
        page: this.listQuery.page,
        admin_id: this.objectQuery.admin_id,
        dateStart: this.objectQuery.dateStart,
        dateEnd: this.objectQuery.dateEnd
      }
      typeServiceResource.listDebitInsuranceByAgent(query).then(res => {
        this.tableData = res?.data?.data.data || []
        this.total = res?.data?.data.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    async handleDownload() {
      let stop = false
      const query = {
        agent_id: this.objectDebitInsurance.id,
        page: 1,
        limit: 50,
        admin_id: this.objectQuery.admin_id,
        dateStart: this.objectQuery.dateStart,
        dateEnd: this.objectQuery.dateEnd
      }

      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await typeServiceResource.listDebitInsuranceByAgent(query)
          console.log('res..............', res.data.data.data.length)
          console.log('this.tableData', res.data.data)
          if (res.data.data.data.length <= 0) {
            stop = true
          }
          query.page = +query.page + 1
          list_all = [...list_all, ...res.data.data.data]
          console.log('list_all', list_all)
        } catch (error) {
          console.error(error)
          stop = true
        }
      }

      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Mã BH', 'Tên giải đấu', 'Tên sân', 'vID', 'gói BH', 'Giá mua', 'Ngày chơi', 'Ngày tạo', 'trạng thái gạch nợ', 'ngày thanh toán', 'Người xử lý', 'Ghi chú']
        const filterVal = ['id', 'name_tour', 'title', 'user_id', 'reward_value', 'total_pay', 'date_played', 'created_at', 'status_debit', 'time_pay', 'name', 'note']
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
        } else if (j === 'id') {
          return v[j]
        } else if (j === 'totalOrder') {
          return v[j]
        } else if (j === 'name_tour') {
          return v[j]
        } else if (j === 'course_name') {
          return v[j]
        } else if (j === 'user_id') {
          return v[j]
        } else if (j === 'reward_value') {
          return +v[j] === 100000000 ? 'D100' : +v[j] === 200000000 ? ' D200' : +v[j] === 50000000 ? ' D50' : ' D20'
        } else if (j === 'total_pay') {
          return v[j]
        } else if (j === 'date_played') {
          return v[j]
        } else if (j === 'created_at') {
          return v[j]
        } else if (j === 'status_debit') {
          return +v[j] === 1 ? 'Đã trả' : +v[j] === 2 ? ' Ghi nợ' : ' Công nợ'
        } else if (j === 'time_pay') {
          return v[j]
        } else if (j === 'name') {
          return v[j]
        } else if (j === 'note') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    },
    handleReloadData() {
      this.debitInsurance()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    onUpdateIsVerify(row) {
      this.loadingUpdateVerify = true
      const params = { id: row.id }
      this.$store.dispatch('updateIsVerifyInsurance', params).then(response => {
        this.loadingUpdateVerify = false
        if (response.error_code === 0) {
          this.$message.success(response.message)
          this.debitInsurance()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handleClose() {
      this.$emit('onClickButtonDebitInsurance', { dialog: false, reload: false })
    },
    formatNumber,
    convertIsPayToString,
    convertSourceBuyToString,
    convertIsSendPviToString,
    convertSourcePayToString
  }
}
</script>

<style>
.detail-custom .title.bold, .detail-custom .el-dialog__title{
  font-weight: bolder;
}
</style>
