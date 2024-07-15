<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Danh sách hợp đồng</h3>
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
              ref="searchContractCode"
              v-model="query.contract_code"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm theo mã hợp đồng"
              :remote-method="onSearchContractCode"
              :loading="loadingSearchContractCode"
              @hook:mounted="(value) => cancelReadOnly(value, 'searchContractCode')"
              @visible-change="(value) => cancelReadOnly(value, 'searchContractCode')"
            >
              <el-option
                v-for="contractCode in ContractCodes"
                :key="contractCode.value"
                :label="contractCode.label"
                :value="contractCode.label"
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
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              v-model="query.status"
              class="filter-item full-width"
              placeholder="Trạng thái"
            >
              <el-option
                v-for="status in arrayStatus"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-col>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
          <el-button type="primary" class="filter-item" icon="el-icon-plus" @click="handleAddContract">Thêm mới
          </el-button>
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
              {{ row.facility ? row.facility.sub_title : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="File hợp đồng"
            align="center"
          >
            <template slot-scope="{row}">
              <el-link
                v-if="row.url_file"
                type="primary"
                :href="convertLink(row.url_file)"
                target="_blank"
              >
                <el-button>Xem</el-button>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="Ngày tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ convertDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Người tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.admin ? row.admin.name : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái">
            <template slot-scope="scope">
              <el-col>
                <el-tag v-if="scope.row.status === 0" type="danger">Hết hiệu lực</el-tag>
                <el-tag v-else type="success">Còn hiệu lực </el-tag>
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeStatus(scope.row)"
                />
              </el-col>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="{row}">
              <el-button
                class="mb-2"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditContract(row)"
              >
                Sửa
              </el-button>
              <!--              <el-button-->
              <!--                type="danger"-->
              <!--                icon="el-icon-delete"-->
              <!--                size="mini"-->
              <!--                round-->
              <!--                @click="handleDeleteCompany(row.id)"-->
              <!--              >-->
              <!--                Xóa-->
              <!--              </el-button>-->
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
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { convertDate, convertDateTime, formatDate, formatNumber } from '@/utils/convert'

import moment from 'moment'
import InsuranceApi from '@/api/HIO/insurance'
import DialogAddContract from '@/views/HIO/contract/components/DialogAddContract.vue'
import FacilityResource from '@/api/facility/facility'
const insuranceApi = new InsuranceApi()
const facilityResource = new FacilityResource()

const arrayStatus = [
  { value: 0, label: 'Hết hiệu lực' },
  { value: 1, label: 'Còn hiệu lực' }
]
export default {
  name: 'List',
  components: { DialogAddContract, Pagination },
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
      loadingSearchFacility: false
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.start_date = moment(value[0]).unix()
        this.query.end_date = moment(value[1]).unix()
      } else {
        this.query.start_date = ''
        this.query.end_date = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    convertDate,
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    convertDateTime,
    onGetList() {
      this.loadingTable = true
      insuranceApi.listContract(this.query).then(res => {
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
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.dateRange = ''
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddContract = value.dialog
      if (value.reload) {
        this.query = Object.assign({}, { limit: 10, page: 1 })
        this.onGetList()
      }
    },

    handleAddContract() {
      this.isAdd = true
      this.showDialogAddContract = true
      this.objectData = {}
    },

    handleEditContract(row) {
      this.isAdd = false
      this.showDialogAddContract = true
      this.objectData = Object.assign({}, row)
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
