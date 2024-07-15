<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">GIÁ ƯU DÃI WAP</h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
          <el-button class="mr-10" style="float:right;" type="success" icon="el-icon-plus" @click="handleStoreHotFacilityHome">
            Chọn sân giá tốt hiển thị màn Home
          </el-button>
        </el-col>
        <!-- <el-tag :style="{ backgroundColor: colorTag, color: colorText }">Your Tag Text</el-tag> -->
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <search-facility :clear-data="clearFacility" @selection-changed-facility="handleSelectionChanged" />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.bank_id"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Ngân hàng"
            >
              <el-option
                v-for="bank in bankList"
                :key="bank.id"
                :label="bank.name"
                :value="bank.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.name"
              placeholder="Tên chiến lược"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.tag_id"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Tag"
            >
              <el-option
                v-for="tag in tagList"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="10" :md="6">
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="dateRange"
              clearable
              label="Ngày tạo"
              size="small"
              style="width: 100%"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy HH:mm:ss"
              start-placeholder="BĐ ngày tạo"
              end-placeholder="KT ngày tạo"
              :default-time="['00:00:00', '23:59:00']"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="10" :md="6">
          <div class="grid-content bg-purple-light">
            <el-date-picker
              v-model="dateRangeTimeActive"
              clearable
              label="TG áp dụng"
              size="small"
              style="width: 100%"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy HH:mm:ss"
              start-placeholder="BĐ TG áp dụng"
              end-placeholder="KT TG áp dụng"
              :default-time="['00:00:00', '23:59:00']"
            />
          </div>
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10 filter-search" style="float: right">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
      <!-- <span style="color: red; font-size: 13px;">{{ `Note: Mặc định lấy tháng hiện tại` }}</span> -->
    </div>
    <el-row>
      <div style="float: right; margin-right: 100px;">
        <el-switch
          v-model="query.is_lock"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          @change="handleFilter"
        />
      </div>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="name" label="Tên chiến dịch" align="center" />
        <el-table-column label="Ngân hàng" align="center">
          <template slot-scope="{row}">
            <el-popover
              ref="popoverRef"
              placement="top"
              width="250"
              trigger="hover"
            >
              <div>
                {{ [...new Set(row.detail_discount_price.map(item =>item.bank_name))].join(', ') }}
              </div>
              <el-link
                slot="reference"
                type="primary"
              > {{ row.detail_discount_price ? row.detail_discount_price[0].bank_name : '' }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Sân" align="center">
          <template slot-scope="{row}">
            <el-popover
              ref="popoverRef"
              placement="top"
              width="250"
              trigger="hover"
            >
              <div>
                {{ [...new Set(row.detail_discount_price.map(item =>item.facility_name))].join(', ') }}
              </div>
              <el-link
                slot="reference"
                type="primary"
              >{{ row.detail_discount_price ? row.detail_discount_price[0].facility_name : '' }}</el-link>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column label="Tỉ lệ phần trăm" align="center">
          <template slot-scope="{row}">
            {{ `${row.type !== 1 ? 'Tăng' : 'Giảm'} ${row.amount}%` }}
          </template>
        </el-table-column>
        <el-table-column width="180" label="Ngày áp dụng" align="center">
          <template slot-scope="{row}">
            {{ row.time_active_start && row.time_active_end ? `${formatDate(row.time_active_start)} - ${formatDate(row.time_active_end)}` : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="{row}">
            {{ row.created_at ? formatDate(row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Tag">
          <template slot-scope="{row}">
            <el-popover
              ref="popoverRef"
              placement="top"
              width="250"
              trigger="click"
            >
              <el-tag
                v-for="(item, i) in tags"
                :key="i"
                :closable="item !== 'Đã booked' || item !== 'Đang bán chạy'"
                :disable-transitions="false"
                @close="handleCloseTag(item)"
              >
                {{ item }}
              </el-tag>
              <div>
                <el-input
                  v-if="inputVisible"
                  ref="saveTagInput"
                  v-model="inputValue"
                  class="input-new-tag"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                />
                <el-button v-else class="button-new-tag mt-10" size="small" @click="showInput">+ Thêm tag</el-button>
              </div>
              <el-button class="mt-10" size="small" type="primary" @click="handleUpdateTag(row)">Xác nhận</el-button>
              <el-link
                slot="reference"
                type="primary"
              ><div v-for="(tag, i) in [...new Set(row.detail_discount_price.map(item =>item.tag_name))].slice(0,2)" :key="i" @click="handleShowTag(row)">
                <el-tag :style="{ backgroundColor: 'pink', color: 'black' }" size="small">{{ tag }}</el-tag>
              </div></el-link>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="{row}">
            <el-button
              class="mb-10"
              size="small"
              type="primary"
              circle
              icon="el-icon-edit"
              @click="handleEdit(row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :type="`${+row.is_lock === 1 ? 'primary' : 'danger'}`"
              circle
              :icon="`${+row.is_lock === 1 ? 'el-icon-unlock' : 'el-icon-lock'}`"
              @click="handleChangeStatus(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetList"
        />
        <DialogWapPreferentialPrice
          :show-dialog="showDialog"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <DialogHotFacilityHome
          :show-dialog="showDialogHotFacility"
          :object-data="objectDataHotFacility"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { formatNumber, formatDate } from '@/utils/convert'
import moment from 'moment'
// import { getAcountInfo } from '@/utils/auth'
import SearchFacility from '@/views/component/SearchFacility.vue'
import DialogWapPreferentialPrice from '@/views/wap-bank/components/DialogWapPreferentialPrice.vue'
import DialogHotFacilityHome from '@/views/wap-bank/components/DialogHotFacilityHome.vue'

import WapBankResource from '@/api/wap-bank/wap-bank'
const wapBankResource = new WapBankResource()

export default {
  name: 'ListPackage',
  components: {
    Pagination,
    SearchFacility,
    DialogWapPreferentialPrice,
    DialogHotFacilityHome
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 20,
      loadingSearchPartner: false,
      showDialog: false,
      objectData: {},
      showDialogHotFacility: false,
      objectDataHotFacility: {},
      clearFacility: false,
      role_admin: [],
      dateRange: '',
      dateRangeTimeActive: '',
      bankList: [],
      tagList: [],
      isAdd: true,
      inputValue: '',
      list_tag_show: [],
      data_new_tag: [],
      inputVisible: false,
      tags: []
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.query.start_date)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    },
    datePickerOptionsTimeActive() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.query.time_active_start)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
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
    },
    dateRangeTimeActive(value) {
      if (value) {
        this.query.time_active_start = moment(value[0]).unix()
        this.query.time_active_end = moment(value[1]).unix()
      } else {
        this.query.time_active_start = ''
        this.query.time_active_end = ''
      }
    }
  },
  created() {
    // console.log('.........', moment().startOf('day').add(1, 'days').unix())
    // this.role_admin = getAcountInfo()?.role_admin.map(item => item.name)
    this.onGetList()
    this.onGetListBank()
    // this.onGetListTag()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      wapBankResource.list_discount_price(this.query).then(res => {
        const { error_code, data, error_msg } = res
        console.log('data.............', data)
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onGetListBank() {
      wapBankResource.list_bank().then(res => {
        const { error_code, data, error_msg } = res
        console.log('data.............', data)
        if (error_code === 0) {
          this.bankList = data
        } else {
          this.$message.error(error_msg)
        }
      }).finally(() => {
      })
    },
    // onGetListTag() {
    //   wapBankResource.list_tag().then(res => {
    //     const { error_code, data, error_msg } = res
    //     console.log('data.............', data)
    //     if (error_code === 0) {
    //       this.tagList = data
    //     } else {
    //       this.$message.error(error_msg)
    //     }
    //   }).finally(() => {
    //   })
    // },
    handleFilter() {
      this.query.page = 1
      this.query.search = 1
      this.loadingTable = true
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = Object.assign({}, { bank_list: this.bankList })
    },
    handleStoreHotFacilityHome() {
      this.showDialogHotFacility = true
      this.objectDataHotFacility = {}
    },
    handleEdit(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, { ...row, bank_list: this.bankList })
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.clearFacility = true
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleSelectionChanged(value) {
      this.clearFacility = false
      this.query.facility_id = value.value
    },
    handleClose() {
      this.showDialog = false
      this.showDialogHotFacility = false
      this.onGetList()
    },
    handleChangeStatus(row) {
      console.log('row................', row)
      const params = {
        is_lock: +row.is_lock === 1 ? 0 : 1
      }
      this.$confirm(`Bạn có chắc chắn muốn ${+row.is_lock !== 1 ? 'mở khóa' : 'khóa'} chiến dịch ${row.name}`).then(async() => {
        wapBankResource.change_status_discount_price(params, row.id).then(res => {
          const { error_code, data, error_msg } = res
          if (error_code === 1) {
            this.$message.error(error_msg)
            return
          } else {
            this.$message.success(data)
            this.onGetList()
          }
        })
      })
    },
    handleShowTag(row) {
      console.log('.................')
      this.tags = [...new Set(row.detail_discount_price.map(item => item.tag_name))]
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseTag(email) {
      this.tags.splice(this.tags.indexOf(email), 1)
      console.log('tags', this.tags)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleUpdateTag(row) {
      wapBankResource.update_tag_discount_price({ tag_list_new: this.tags }, row.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.data)
          this.handleClose()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    formatNumber,
    formatDate
  }
}
</script>

<style scoped>
  .mr-10 {
      margin-right: 10px;
  }

  .mb-10 {
      margin-bottom: 10px;
  }

  .mt-10 {
      margin-top: 10px;
  }

  .filter-search {
    float: right;
    display: flex;
    justify-content: flex-end;
    margin-right: 0;
  }
  .filter-container .filter-item{
    margin-bottom: 0;
  }
  .search-money{
    padding-right: 10px;
  }
  .search-money:last-child{
    padding-right: 0;
  }
  .row-search-money{
    margin-bottom: 10px;
  }
  .cell .el-tag{
    margin: 5px;
  }
  .clearfix-10 {
    height: 10px;
    clear: both;
  }
  .clearfix-20 {
    height: 20px;
    clear: both;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .mr-10 {
    margin-right: 10px;
  }
</style>

