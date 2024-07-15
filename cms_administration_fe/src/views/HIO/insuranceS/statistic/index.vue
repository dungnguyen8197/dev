<template>
  <el-row class="insurance-lists">
    <el-row class="insurance-lists__header">
      <el-col :sm="12" style="padding-top: 10px">
        <h3>Danh sách bảo hiểm gói S100  </h3>
      </el-col>
    </el-row>
    <el-row class="insurance-lists__search mb-5">
      <el-col :sm="3" class="pr-lg-2">
        <div class="search-golfer">
          <el-input v-model="listQuery.id" placeholder="Nhập mã bảo hiểm" class="w-100" />
        </div>
      </el-col>
      <el-col :sm="2" class="pr-lg-2">
        <div class="search-golfer">
          <el-input v-model="listQuery.user_id" placeholder="Nhập mã vID" class="w-100" />
        </div>
      </el-col>
      <el-col :sm="4" class="pr-lg-2">
        <el-select
          v-model="listQuery.facility_id"
          filterable
          remote
          class="w-100"
          placeholder="Tìm theo sân"
          :remote-method="onGetListFacilities"
        >
          <el-option
            v-for="facility in facilities"
            :key="facility.value"
            :label="facility.label"
            :value="facility.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="6">
        <el-date-picker
          v-model="dateRange"
          class="date-rang-history"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :picker-options="pickerOptions"
        />
      </el-col>
    </el-row>
    <el-row class="form-search">

      <el-col :sm="4" class="pr-lg-2">
        <el-select
          v-model="listQuery.is_customer_pay"
          class="w-100"
          placeholder="TT thanh toán"
        >
          <el-option
            v-for="item in arrayIsPay"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :sm="4" class="pr-lg-2">
        <el-select
          v-model="listQuery.status"
          class="w-100"
          placeholder="Trạng thái đơn"
        >
          <el-option
            v-for="status in arrayStatus"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-col>

      <el-col :sm="6">
        <div class="text-right">
          <el-button class="mr-10 filter-item" type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleExportExcel">
            Xuất Excel
          </el-button>
          <el-button icon="el-icon-refresh" style="margin-right: 20px" @click="onResetQuery"> Làm mới
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click.prevent="onGetListInsurances()"> Tìm kiếm
          </el-button>
        </div>
      </el-col>
    </el-row>
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

          <el-table-column prop="facility.sub_title" label="Tên Sân" />
          <el-table-column prop="hole_select" label="Tên hố" />
          <el-table-column label="Mã vID">
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
              <el-link
                size="mini"
                style="color: #20a0ff"
                @click="onGetLisMember(scope.row)"
              >
                {{ formatNumber(scope.row.total_member) }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="Giờ chơi">
            <template slot-scope="{row}">
              {{ convertDateTime(row.date_played) }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="Trạng thái gửi PVI">-->
          <!--            <template slot-scope="{row}">-->
          <!--          <el-tag v-if="row.is_send_pvi === 1" type="success">-->
          <!--            Đã gửi đơn qua PVI-->
          <!--          </el-tag>-->
          <!--          <el-tag v-if="row.is_send_pvi === 2" type="primary">-->
          <!--            Đã đẩy vào hàng chờ-->
          <!--          </el-tag>-->
          <!--          <el-tag v-if="row.is_send_pvi === 0" type="warning">-->
          <!--            Chưa gửi thông tin-->
          <!--          </el-tag>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
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
        <dialog-list-member-insurance
          :show-dialog="showDialogMember"
          :object-member="objectMember"
          @onClickButtonMember="onClickButtonMember"
        />
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/dateRangOptions'
import { formatNumber, convertDateTime } from '@/utils/convert'

import InsuranceApi from '@/api/HIO/insurance'
import { getAcountInfo } from '@/utils/auth'
const insuranceApi = new InsuranceApi()
import BookingPaxResource from '@/api/BookingPax'
import { baseURL } from '@/constant/config'
import DialogListMemberInsurance from '@/views/HIO/insuranceS/statistic/DialogListMemberInsurance.vue'
import moment from 'moment/moment'
const bookingPaxResource = new BookingPaxResource()

const defaultQuery = {
  page: 1,
  name: '',
  limit: 10
}
const arrayisPay = [
  { value: 0, label: 'Chưa thanh toán' },
  { value: 1, label: 'Đã thanh toán' }
]
const arrayStatus = [
  { value: 1, label: 'Đơn có hiệu lực' },
  { value: 3, label: 'Đơn không hiệu lực' }
]
const arrayInsuranceDebt = [
  { value: 1, label: 'Đã trả ' },
  { value: 2, label: 'Ghi nợ' },
  { value: 3, label: 'Công nợ' }
]
export default {
  name: 'ListInsurances',
  components: {
    DialogListMemberInsurance,
    // DialogViewInsurance,
    Pagination
  },
  data() {
    return {
      value: [],
      listQuery: Object.assign({}, defaultQuery),
      dateRange: [],
      pickerOptions: {
        shortcuts: pickerOptions
      },
      tableData: [],
      agents: [],
      loading: false,
      loadingUpdateVerify: false,
      total: 0,
      from: 0,
      showDialogDetail: false,
      showDialogCreate: false,
      objectInsurance: {},
      objectCodeData: {},

      arrayIsPay: [...arrayisPay],
      arrayStatus: [...arrayStatus],
      arrayInsuranceDebt: [...arrayInsuranceDebt],
      timer: null,
      loadingExportExcel: false,
      isFacility18Hole: true,
      isDatePlayed: false,
      titleIsDatePlayed: 'Tìm kiếm theo ngày khởi tạo',
      nameAgent: '',
      listQueryRefund: Object.assign({}),
      objectRefund: [],
      userPermission: [],
      roleUser: this.$store.getters.roles,
      isShowLogCodePay: false,
      isCreateLogCodePay: false,
      facilities: [],
      objectMember: {},
      showDialogMember: false
    }
  },
  watch: {
    dateRange(value) {
      if (value !== null) {
        this.listQuery.date_start = moment(value[0]).format('YYYY-MM-DD 00:00:00')
        this.listQuery.date_end = moment(value[1]).format('YYYY-MM-DD 23:59:59')
      } else {
        this.listQuery.date_start = null
        this.listQuery.date_end = null
      }
    }
  },
  created() {
    this.onGetListInsurances()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    onClickButtonMember(object) {
      const { dialog, reload } = object
      this.showDialogMember = dialog
      if (reload) {
        this.onGetListInsurances()
      }
    },
    onGetLisMember(row) {
      this.objectMember = row
      this.showDialogMember = true
    },
    handleExportExcel() {
      this.loadingExportExcel = true
      insuranceApi.exportListInsuranceS(this.listQuery).then(response => {
        var fileLink = document.createElement('a')
        const params = new URLSearchParams(this.listQuery).toString()
        fileLink.href = `${baseURL}insurance-hio/export-list-insurance-s?${params}`
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
    onGetListInsurances() {
      const data = {
        cms_id: getAcountInfo().id
      }
      this.loading = true
      insuranceApi.listInsuranceS({ ...data, ...this.listQuery }).then(response => {
        if (response.error_code === 0) {
          this.loading = false
          const result = response.data
          this.tableData = [...result.listInsurancePackageS]
          this.total = result.total
        }
      })
    },

    onResetQuery() {
      this.listQuery = Object.assign({}, defaultQuery)
      this.isDatePlayed = false
      this.dateRange = null
      this.onGetListInsurances()
    },

    handleIndexMethod(index) {
      return this.from + index
    },
    onGetListFacilities(keyword) {
      const params = { title: keyword }
      this.loadingSearchFacility = true
      bookingPaxResource.getFacilityCanBuyInsurance(params).then(response => {
        this.loadingSearchFacility = false
        const results = response.data.data
        if (results.length > 0) {
          const array = []
          results.map(result => {
            const item = { label: result.sub_title, value: result.id, paths: result.paths }
            array.push(item)
          })
          this.facilities = [...array]
        } else {
          this.facilities = []
        }
      })
    },
    formatNumber,
    convertDateTime
  }
}
</script>

<style lang="scss">
.insurance-lists {
  margin: 0 10px;

  .form-search {
    margin-bottom: 10px;
  }

  .hidden {
    display: none;
  }

  .mb-1 {
    margin-bottom: 5px;
  }

  .text-right {
    text-align: right;
  }

  .date-rang-history {
    width: 100%;
  }

  .w-100 {
    width: 100%;
  }

  .el-button + {
    .el-button {
      margin-left: 0;
    }
  }
}
</style>
