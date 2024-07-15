<template>
  <el-dialog
    class="detail-custom"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="80%"
  >
    <h3>Danh sách đơn bảo hiểm S100 sân {{ objectTotalInsurance["facility.sub_title"] }} </h3>
    <el-button class="mr-10 filter-item" type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleExportExcel">
      Xuất Excel
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
          <el-table-column label="Nguồn tạo">
            <template slot-scope="{row}">
              <span v-if="row.source_buy === 7">
                hio.wghn.net
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="hole_select" label="Tên hố" />
          <el-table-column label="Mã vID/Passport">
            <template slot-scope="scope">
              <p> {{ `vID${scope.row.user_id}` }}</p>
            </template>
          </el-table-column>
          <el-table-column label="Giá mua">
            <template slot-scope="scope">
              {{ (scope.row) ? `${formatNumber(scope.row.total_pay)} VNĐ` : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Số người chơi">
            <template slot-scope="scope">
              {{ (scope.row.total_member) ? scope.row.total_member : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Giờ chơi">
            <template slot-scope="{row}">
              {{ convertDateTime(row.date_played) }}
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái đơn">
            <template slot-scope="{row}">
              <div v-if="row.status === 3">
                <el-tag type="danger">
                  Không có hiệu lực
                </el-tag>
                <el-tag v-if="row.is_customer_pay === 0" type="danger">
                  Chưa thanh toán
                </el-tag>
                <el-tag v-if="row.is_customer_pay === 1" type="success">
                  Đã thanh toán
                </el-tag>
                <el-tag v-if="row.is_send_pvi === 1" type="success">
                  Đã gửi đơn qua PVI
                </el-tag>
                <el-tag v-if="row.is_send_pvi === 2" type="primary">
                  Đã đẩy vào hàng chờ
                </el-tag>
                <el-tag v-if="row.is_send_pvi === 0" type="warning">
                  Chưa gửi thông tin
                </el-tag>
              </div>
              <div v-if="row.status === 1">
                <el-tag type="success">
                  Có hiệu lực
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetListInsurances"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import InsuranceApi from '@/api/HIO/insurance'

const insuranceApi = new InsuranceApi()

import Pagination from '@/components/Pagination/index.vue'
import {
  convertDateTime,
  formatNumber
} from '@/utils/convert'
import {
  convertIsPayToString,
  convertSourceBuyToString,
  convertIsSendPviToString,
  convertSourcePayToString
} from '@/utils/insurance/convertNumberToString'
import { baseURL } from '@/constant/config'

export default {
  name: 'DialogListInsurance',
  components: { Pagination },
  props: {
    objectTotalInsurance: {
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
    objectTotalInsurance(val) {
      if (val) {
        this.onGetListInsurances(val.id)
      }
    }
  },
  methods: {
    handleExportExcel() {
      const query = {
        facility_id: this.objectTotalInsurance.facility_id,
        date_start: this.objectQuery.date_start,
        date_end: this.objectQuery.date_end
      }
      this.loadingExportExcel = true
      insuranceApi.exportListInsuranceDialog(query).then(response => {
        var fileLink = document.createElement('a')
        const params = query.toString()
        fileLink.href = `${baseURL}insurance-hio/export-list-insurance-dialog?${params}`
        fileLink.setAttribute('download', 'proposed_file_name')

        document.body.appendChild(fileLink)

        fileLink.click()
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
        .finally(() => {
          this.loadingExportExcel = false
        })
    },
    convertDateTime,
    onGetListInsurances() {
      const query = {
        facility_id: this.objectTotalInsurance.facility_id,
        limit: this.listQuery.limit,
        page: this.listQuery.page,
        date_start: this.objectQuery.date_start,
        date_end: this.objectQuery.date_end
      }
      this.loadingTable = true
      insuranceApi.listInsuranceDialog(query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res?.data?.data || []
          this.total = res?.data?.total || 0
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },

    handleClose() {
      this.$emit('onClickButtonTotalInsurance', { dialog: false, reload: false })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
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
.detail-custom .title.bold, .detail-custom .el-dialog__title {
  font-weight: bolder;
}
</style>
