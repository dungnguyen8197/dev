<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Doanh thu theo hợp đồng</h3>
        </el-col>

      </el-row>
      <div class="filter-container mt-10">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              ref="searchContract"
              v-model="query.contract_name"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm theo tên hợp đồng"
              :remote-method="onSearchContract"
              :loading="loadingSearchContract"
              @hook:mounted="(value) => cancelReadOnly(value, 'searchContract')"
              @visible-change="(value) => cancelReadOnly(value, 'searchContract')"
            >
              <el-option
                v-for="contract in Contracts"
                :key="contract.value"
                :label="contract.label"
                :value="contract.label"
              />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              ref="searchFacility"
              v-model="query.facility_id"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm theo sân"
              :remote-method="onSearchFacility"
              :loading="loadingSearchFacility"
              @hook:mounted="(value) => cancelReadOnly(value, 'searchFacility')"
              @visible-change="(value) => cancelReadOnly(value, 'searchFacility')"
            >
              <el-option
                v-for="facility in Facilities"
                :key="facility.value"
                :label="facility.label"
                :value="facility.value"
              />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="6" class="mr-10 pb-10">
            <el-date-picker
              v-model="dateRange"
              class="date-rang-history"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="đến"
              start-placeholder="Ngày bắt đầu"
              end-placeholder="Ngày kết thúc"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="8">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
            <el-button class="mr-10 filter-item" type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleExportExcel">
              Xuất Excel
            </el-button>
          </el-col>

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
            prop="contract_code"
            label="Mã hợp đồng"
            align="center"
          />
          <el-table-column
            label="Tên hợp đồng"
            align="center"
            prop="contract_name"
          />
          <el-table-column
            label="Sân"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row["facility.sub_title"] ? row["facility.sub_title"] : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Số lượng đơn"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.totalInsurance }}
            </template>
          </el-table-column>
          <el-table-column
            label="Tổng doanh thu"
            align="center"
          >
            <template slot-scope="{row}">
              <el-link
                size="mini"
                style="color: #20a0ff"
                @click="onGetListInsurance(row)"
              >
                {{ formatNumber(row.totalMoney) }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="Chiết khấu sân"
            align="center"
          >
            <template slot-scope="{row}">
              <el-row>
                <p>{{ `${ formatNumber(row.moneyFacility) }đ` }}</p>
                <p style="color: red">{{ `${ row.facility_discount }%` }}</p>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="Chiết khấu lobby"
            align="center"
          >
            <template slot-scope="{row}">
              <el-row>
                <p>{{ row.lobby_name }}</p>
                <p>{{ `${ formatNumber(row.moneyLobby) }đ` }}</p>
                <p style="color: red">{{ `${ row.lobby_discount }%` }}</p>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="PVI"
            align="center"
          >
            <template slot-scope="{row}">
              <el-row>
                <p>{{ `${ formatNumber(row.moneyPVI) }đ` }}</p>
                <p style="color: red">{{ `${ row.PVI_discount }%` }}</p>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="WGHN"
            align="center"
          >
            <template slot-scope="{row}">
              <el-row>
                <p>{{ `${ formatNumber(row.moneyWGHN) }đ` }}</p>
                <p style="color: red">{{ `${ row.WGHN_discount }%` }}</p>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="Chi nhánh"
            align="center"
          >
            <template slot-scope="{row}">
              <el-row>
                <p>{{ (row.branch_id === 1) ? 'Central' : 'Southern' }}</p>
                <p>{{ `${ formatNumber(row.moneyBranch) }đ` }}</p>
                <p style="color: red">{{ `${ row.branch_discount }%` }}</p>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="Booking"
            align="center"
          >
            <template slot-scope="{row}">
              <p>{{ `${ formatNumber(row.moneyBooking) }đ` }}</p>
              <p style="color: red">{{ `${ row.booking_discount }%` }}</p>
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
        <dialog-add-contract
          :show-dialog="showDialogAddContract"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <dialog-list-insurance
          :object-query="query"
          :show-dialog="showTotalInsurance"
          :object-total-insurance="objectTotalInsurance"
          @onClickButtonTotalInsurance="onClickButtonTotalInsurance"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { convertDate, convertDateTime, formatDate, formatNumber } from '@/utils/convert'

import InsuranceApi from '@/api/HIO/insurance'
import DialogAddContract from '@/views/HIO/contract/components/DialogAddContract.vue'
import FacilityResource from '@/api/facility/facility'
import DialogListInsurance from '@/views/HIO/contract/components/DialogListInsurance.vue'
import { baseURL } from '@/constant/config'
const insuranceApi = new InsuranceApi()
const facilityResource = new FacilityResource()

const arrayStatus = [
  { value: 0, label: 'Hết hiệu lực' },
  { value: 1, label: 'Còn hiệu lực' }
]
export default {
  name: 'List',
  components: { DialogListInsurance, DialogAddContract, Pagination },
  data() {
    return {
      arrayStatus: [...arrayStatus],
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
      showDialogAddContract: false,
      loadingSearchContract: false,
      objectData: {},
      objectDataListMember: {},
      dateRange: '',
      Contracts: [],
      showDialogListMember: false,
      ContractCodes: [],
      Facilities: [],
      loadingSearchContractCode: false,
      loadingSearchFacility: false,
      showTotalInsurance: false,
      objectTotalInsurance: {},
      loadingExportExcel: false
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.date_start = this.convertDate(value[0], 'YYYY-MM-DD')
        this.query.date_end = this.convertDate(value[1], 'YYYY-MM-DD')
      } else {
        this.query.date_start = ''
        this.query.date_end = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    handleExportExcel() {
      this.loadingExportExcel = true
      insuranceApi.exportRevenueContract(this.query).then(response => {
        var fileLink = document.createElement('a')
        const params = new URLSearchParams(this.query).toString()
        fileLink.href = `${baseURL}insurance-hio/export-revenue-contract?${params}`
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
    onGetListInsurance(row) {
      console.log('qưeqưeqưewqeqưe', row)
      this.objectTotalInsurance = row
      this.showTotalInsurance = true
    },
    onClickButtonTotalInsurance(object) {
      const { dialog, reload } = object
      this.showTotalInsurance = dialog
      if (reload) {
        this.onGetList()
      }
    },
    convertDate,
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.dateRange = ''

      this.onGetList()
    },
    convertDateTime,
    onGetList() {
      this.loadingTable = true
      insuranceApi.revenueContract(this.query).then(res => {
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
    handleFilter() {
      this.query.page = 1
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    handleClose(value) {
      this.showDialogAddContract = value.dialog
      if (value.reload) {
        this.query = Object.assign({}, { limit: 10, page: 1 })
        this.onGetList()
      }
    },

    onSearchContract(keyword) {
      this.loadingSearchContract = true
      insuranceApi.searchContract({ keyword_contract: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.Contracts = result.map(value => {
              return { value: value.id, label: value.contract_name }
            })
          } else {
            this.Contracts = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchContract = false
      })
    },

    onSearchContractCode(keyword) {
      this.loadingSearchContract = true
      insuranceApi.searchContractCode({ keyword_contractCode: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.ContractCodes = result.map(value => {
              return { value: value.id, label: value.contract_code }
            })
          } else {
            this.ContractCodes = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchContract = false
      })
    },
    onSearchFacility(keyword) {
      this.loadingSearchFacility = true
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.Facilities = result.map(value => {
              return { value: value.id, label: value.sub_title }
            })
          } else {
            this.Facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchFacility = false
      })
    },

    changeStatus(row) {
      const obj = {
        status: row.status
      }
      this.$confirm(`Bạn có chắc chắn muốn đổi trạng thái`).then(_ => {
        insuranceApi.updateStatusContract(obj, row.id).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    convertLink(value) {
      return value
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
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
