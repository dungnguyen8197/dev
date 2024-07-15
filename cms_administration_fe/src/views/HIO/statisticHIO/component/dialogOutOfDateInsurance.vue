<template>
  <el-dialog class="detail-custom" title="Danh sách đơn bảo hiểm" :visible.sync="showDialog" :before-close="handleClose" width="80%">
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
          <!--                    <el-table-column label="Sale phụ trách">-->
          <!--                        <template slot-scope="scope">-->
          <!--                            <template v-if="scope.row.agent_id !== 0 && scope.row.agent.sales !== null">-->
          <!--                                <el-tag type="info">{{ scope.row.agent.sales.name }}</el-tag>-->
          <!--                            </template>-->
          <!--                        </template>-->
          <!--                    </el-table-column>-->
          <el-table-column label="Ghi chú">
            <template slot-scope="scope">
              {{ (scope.row.note) }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="Hành động">-->
          <!--            <template slot-scope="scope">-->
          <!--              <template v-if="scope.row.status === 1 && scope.row.is_verify === 0">-->
          <!--                <el-button-->
          <!--                  :loading="loadingUpdateVerify"-->
          <!--                  size="small"-->
          <!--                  type="info"-->
          <!--                  icon="el-icon-check"-->
          <!--                  circle-->
          <!--                  @click="onUpdateIsVerify(scope.row)"-->
          <!--                />-->
          <!--              </template>-->
          <!--              <template v-if="scope.row.is_pay === 1">-->
          <!--                &lt;!&ndash;                <template v-if="scope.row.is_send_pvi === 1 && scope.row.status === 1">&ndash;&gt;-->
          <!--                &lt;!&ndash;                  <button-refund-money&ndash;&gt;-->
          <!--                &lt;!&ndash;                    :object-insurance="scope.row"&ndash;&gt;-->
          <!--                &lt;!&ndash;                    @onReloadData="handleReloadData"&ndash;&gt;-->
          <!--                &lt;!&ndash;                  />&ndash;&gt;-->
          <!--                &lt;!&ndash;                </template>&ndash;&gt;-->
          <!--                <template v-if="scope.row.is_send_pvi === 0">-->
          <!--                  <button-send-pvi-->
          <!--                    :object-insurance="scope.row"-->
          <!--                    @onReloadData="handleReloadData"-->
          <!--                  />-->
          <!--                </template>-->
          <!--                <template v-if="scope.row.is_send_pvi === 2">-->
          <!--                  <button-cancel-send-pvi-->
          <!--                    :object-insurance="scope.row"-->
          <!--                    @onReloadData="handleReloadData"-->
          <!--                  />-->
          <!--                </template>-->
          <!--              </template>-->
          <!--              <el-button-->
          <!--                size="small"-->
          <!--                :title="`Sửa giao dịch  ${scope.row.name}`"-->
          <!--                type="primary"-->
          <!--                icon="el-icon-edit"-->
          <!--                circle-->
          <!--                @click="onShowDialogDetail(scope.row)"-->
          <!--              />-->
          <!--              <template v-if="scope.row.is_pay === 0">-->
          <!--                <el-button-->
          <!--                  size="small"-->
          <!--                  :title="`Tạo code thanh toán`"-->
          <!--                  type="warning"-->
          <!--                  icon="el-icon-plus"-->
          <!--                  circle-->
          <!--                  @click="onCreateCodePay(scope.row)"-->
          <!--                />-->
          <!--              </template>-->
          <!--              <template-->
          <!--                v-if=" scope.row.is_pay === 1 && scope.row.is_outing ===1 && scope.row.uid_buy !== 0 && scope.row.is_refund !== 1"-->
          <!--              >-->
          <!--                <el-button-->
          <!--                  size="small"-->
          <!--                  :title="`refund money ${scope.row.name}`"-->
          <!--                  type="primary"-->
          <!--                  icon="el-icon-refresh"-->
          <!--                  circle-->
          <!--                  @click="onRefundInsurance(scope.row)"-->
          <!--                />-->
          <!--              </template>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="outOfDateInsurance"
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
  name: 'OutOfDateInsurance',
  components: { Pagination },
  props: {
    objectOutOfDateInsurance: {
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
      total: 0

    }
  },
  watch: {
    objectOutOfDateInsurance(val) {
      if (val) {
        this.outOfDateInsurance(val.id)
      }
    }
  },
  methods: {
    outOfDateInsurance() {
      const query = {
        agent_id: this.objectOutOfDateInsurance.id,
        limit: this.listQuery.limit,
        page: this.listQuery.page
      }
      const listQuery = { ...query, ...this.objectQuery }
      console.log('sadasdsad', listQuery)
      typeServiceResource.listOutOfDateInsuranceByAgent(listQuery).then(res => {
        this.tableData = res?.data?.data.data || []
        this.total = res?.data?.data.total || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleReloadData() {
      this.outOfDateInsurance()
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
          this.outOfDateInsurance()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handleClose() {
      this.$emit('onClickButtonOutOfDateInsurance', { dialog: false, reload: false })
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
