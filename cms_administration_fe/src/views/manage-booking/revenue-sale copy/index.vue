<template>
  <el-row>
    <el-row class="app-container list-account">
      <!-- <el-row class="list-account__header"> -->
      <el-col :sm="24" style="display:flex;">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align: center;">Quản lý doanh thu sale</h3>
      </el-col>
      <!-- </el-row> -->
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-input
                v-model="listQuery.code_booking"
                placeholder="Mã booking"
                class="filter-item full-width"
                clearable
                @keyup.enter.native="handleFilter"
              />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-input
                v-model="listQuery.code_payment"
                placeholder="Mã thanh toán:"
                class="filter-item full-width"
                clearable
                @keyup.enter.native="handleFilter"
              />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-select
                v-model="listQuery.facility"
                style="width: 100%"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="Tên sân"
                :remote-method="onSearchFacility"
                :loading="loadingSearchFacility"
              >
                <el-option
                  v-for="facility in facilityList"
                  :key="facility.id"
                  :label="facility.sub_title"
                  :value="facility.id"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-select
                v-model="listQuery.type_purchase"
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Hình thức thanh toán"
              >
                <el-option
                  v-for="type_purchase in typePurchaseList"
                  :key="type_purchase.value"
                  :label="type_purchase.label"
                  :value="type_purchase.value"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-date-picker
                v-model="dateRange"
                style="width: 100%"
                format="dd-MM-yyyy HH:mm:ss"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start ngày chơi"
                end-placeholder="End ngày chơi"
              />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-select
                v-model="listQuery.region"
                clearable
                style="width: 100%"
                remote
                reserve-keyword
                :multiple-limit="1"
                placeholder="Vùng"
              >
                <el-option
                  v-for="region in regionList"
                  :key="region.value"
                  :label="region.label"
                  :value="region.value"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-select
                v-model="listQuery.agency_id"
                style="width: 100%"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="Đại lý"
                :remote-method="onSearchAgency"
                :loading="loadingSearchAgency"
                @change="onChangeAgency"
              >
                <el-option
                  v-for="agency in AgencyList"
                  :key="agency.id"
                  :label="agency.name"
                  :value="agency.name"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-date-picker
                v-model="dateRangePayment"
                style="width: 100%"
                format="dd-MM-yyyy HH:mm:ss"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start ngày TT"
                end-placeholder="End ngày TT"
              />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="24" align="right">
            <div class="grid-content bg-purple">
              <el-button size="small" icon="el-icon-refresh" round @click="onReset">Reset</el-button>
              <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">
                Tìm kiếm
              </el-button>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-download"
                :loading="loadingExportExcel"
                @click="handleDownload"
              >
                Export excel
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="text-center">
            <h4 style="color: red; text-align: center; padding: 30px 0 20px;">
              {{ `Tổng giá: ${formatNumberOrNull(total_price_booking)} VNĐ` }}
            </h4>
          </el-col>
          <el-col :span="12" class="text-center">
            <h4 style="color: red; text-align: center; padding: 30px 0 20px;">
              {{ `Tổng giá doanh thu: ${formatNumberOrNull(total_money)} VNĐ` }}
            </h4>
          </el-col>
        </el-row>
      </div>

      <el-row class="data-table-content table-responsive">
        <table v-loading="loadingTable" class="table table-bordered" style="font-size: 12px">
          <thead>
            <tr>
              <th scope="col" class="text-center">STT</th>
              <th scope="col" class="text-center">Pax id</th>
              <th scope="col" class="text-center">Sân</th>
              <th scope="col" class="text-center">Phụ phí(VND)</th>
              <th scope="col" class="text-center">Golfer</th>
              <th scope="col" class="text-center">Code booking</th>
              <th scope="col" class="text-center">Mã cuộc gọi</th>
              <th scope="col" class="text-center">Mã giảm giá</th>
              <th scope="col" class="text-center">Người đặt</th>
              <th scope="col" class="text-center">Nguồn</th>
              <th scope="col" class="text-center">Admin</th>
              <th scope="col" class="text-center">Người giới thiệu</th>
              <th scope="col" class="text-center">Giá</th>
              <th scope="col" class="text-center">Giá doanh thu</th>
              <th scope="col" class="text-center">Phụ phí cố định</th>
              <th scope="col" class="text-center">Giá gốc</th>
              <th scope="col" class="text-center">Refund</th>
              <th scope="col" class="text-center">Ngày đánh</th>
              <th scope="col" class="text-center">Ngày công nợ</th>
              <th scope="col" class="text-center">Ngày đặt</th>
              <th scope="col" class="text-center">HIO</th>
              <th scope="col" class="text-center">Trạng thái</th>
              <th scope="col" class="text-center">Ngày thanh toán</th>
              <th scope="col" class="text-center">Ngày đại lý thanh toán</th>
              <th scope="col" class="text-center" style="width: 200px">Note</th>
              <th scope="col" class="text-center" style="width: 200px">Thông tin khách xuất hoá đơn</th>
              <th scope="col" class="text-center">Code Payment</th>
              <th scope="col" class="text-center">CCCD / Passport</th>
              <th scope="col" class="text-center">Đối chiếu</th>
              <th scope="col" class="text-center">TT Xác nhận Booking</th>
              <th scope="col" class="text-center" />
            </tr>
          </thead>
          <tbody v-for="(value, i) in tableData" :key="i">
            <tr
              v-for="(item, index) in value.booked"
              :key="index"
              :class="{'delay': value.delay_date == 1}"
            >
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length + value.billOutsidePayment.length">{{ from + i + 1 }}</td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length + value.billOutsidePayment.length">{{ value.id }}</td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length + value.billOutsidePayment.length">{{
                value.facility.sub_title
              }}
              </td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length + value.billOutsidePayment.length">{{ value.surcharge_price }}</td>
              <template v-if="item.user_id != null && item.user_id != -1">
                <td class="text-center">{{ item.golfer ? `${item.user_id} - ${item.golfer['fullname']}` : '' }}</td>
              </template>
              <template v-else>
                <td class="text-center">(OUT) - {{ item.name_out_system }}</td>
              </template>
              <td class="text-center">{{ item.code_booking }}</td>
              <td class="text-center">
                {{ item['v10_user_reservation_booking'] ? item['v10_user_reservation_booking']['code'] : '' }}
              </td>
              <td class="text-center">
                <template v-if="item['promotion_code_id'] != null">
                  {{ item['promotional']['code'] }}
                </template>
              </td>
              <td class="text-center">
                <template v-if="item['host_user_id'] != null && item['host_user_id'] != -1">
                  {{ `VID${item['host_user_id']}` }}
                </template>
              </td>
              <td class="text-center">{{ (item['source'] == 1) ? 'App' : 'CMS' }}</td>
              <td class="text-center">{{ item['cms_admin'] ? item['cms_admin']['name'] : '' }}</td>
              <td class="text-center">{{ value['admin'] ? value['admin']['name'] : '' }}</td>
              <td class="text-center">{{ formatNumberOrNull(item['price_booking']) }}</td>
              <td class="text-center">{{ formatNumberOrNull(value['revenue_price']) }}</td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length">
                {{ formatNumberOrNull(value.surcharge_facility_sum_price_surcharge_facility) }}
              </td>
              <td class="text-center">
                {{
                  (value['number_hole'] == 9) ? formatNumberOrNull(value['source_price_9']) : ((value['number_hole'] == 18) ? formatNumberOrNull(value['source_price_18']) : ((value['number_hole'] == 27) ? formatNumberOrNull(value['source_price_27']) : ''))
                }}
              </td>
              <th class="text-center" style="color: red">
                <template
                  v-if="item.point != null && queryPoint(item) != null && queryPoint(item).source == 3 && queryPoint(item).type == 1"
                >
                  {{ formatNumberOrNull(queryPoint(item).point) }}
                </template>
              </th>
              <td class="text-center">{{ convertDateTimeSecond(item['date_played']) }}</td>
              <td class="text-center">
                <template v-if="item['day_debt'] != null">
                  <div>
                    {{ convertDateTimeSecond(item['day_debt']) }}
                  </div>
                </template>
              </td>
              <td class="text-center">{{ convertDateTimeSecond(item['created_at']) }}</td>
              <td class="text-center">
                <template v-if="value.insurance != null">
                  <div class="text-center">
                    <p>{{ value.insurance.options_money_id === 1 ? 'D100' : 'D200' }}
                      - BH{{ value.insurance.id }}</p>
                  </div>
                </template>
                <template v-if="value.insurance20 != null">
                  <div class="text-center">
                    <p>D20 - BH{{ value.insurance20.id }}</p>
                  </div>
                </template>
              </td>
              <td class="text-center">
                <template v-if="item['type_purchase'] != 0">
                  <el-tag type="success">{{ typePurchase(item['type_purchase']) }}</el-tag>
                </template>
                <template v-else>
                  <el-tag type="danger">Chưa thanh toán</el-tag>
                </template>
              </td>
              <td class="text-center">
                <template v-if="item['date_payment'] != null">
                  {{ convertDate(item['date_payment']) }}
                </template>
              </td>
              <td class="text-center">
                <template v-if="item['date_agent_payment'] != null">
                  {{ convertDateTimeSecond(item['date_agent_payment']) }}
                </template>
              </td>
              <td
                v-if="index === 0"
                class="text-center"
                :rowspan="value.booked.length"
              >{{ value['note'] }}
              </td>
              <td
                v-if="index === 0"
                class="text-center"
                :rowspan="value.booked.length"
              >{{ value['customer_invoice'] }}
              </td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length">
                <section v-for="(code, codeIndex) in value['transactionBooking']" :key="codeIndex">
                  <el-tag style="margin: 2px">{{ code['code_payment'] }}</el-tag>
                </section>
              </td>
              <td class="text-center">
                <div v-for="pass in item.user_passport" :key="pass.id">{{ pass ? pass.passport : '' }}</div>
              </td>
              <td class="text-center">
                <template v-if="value['is_inventory'] != 0">
                  <el-tag type="success">Hoàn tất</el-tag>
                </template>
                <template v-else>
                  <el-tag type="danger">Chưa đối chiếu</el-tag>
                </template>
                <template v-if="item['surcharge_entry_price'] != null">
                  <el-tag type="success">Đã xuất hoá đơn</el-tag>
                </template>
              </td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length">
                <template v-if="value['status'] == 6">
                  <el-tag type="success"> Đã xác nhận</el-tag>
                </template>
                <template v-else>
                  <el-tag type="danger">Chưa xác nhận</el-tag>
                </template>
              </td>
              <td v-if="index === 0" class="text-center" :rowspan="value.booked.length">
                <div class="p-10">
                  <el-button icon="el-icon-edit" size="mini" type="primary" @click="clickUpdateStatistic(value)">Edit
                  </el-button>
                </div>
              </td>
            </tr>
            <tr v-for="(billOutSide, keyBillOutSide) in value.billOutsidePayment" :key="keyBillOutSide + '-' + i">
              <td>Phụ phí ngoài</td>
              <td>{{ billOutSide.code_booking }}</td>
              <td :colspan="3">{{ billOutSide.user_id > 0 ? `VID` + billOutSide.user_id : '' }}</td>
              <td :colspan="4">{{ formatNumberOrNull(billOutSide.real_payment) }}</td>
              <td />
              <td />
              <td>{{ formatNumberOrNull(billOutSide.original_amount) }}</td>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td class="text-center">
                <el-tag :type="billOutSide.status === 0 ? 'info' : (billOutSide.status === 1 ? 'success' : (billOutSide.status === 2 ? 'warning' : 'danger'))">
                  {{ typePurchaseBillOutSide[billOutSide.status] }}
                </el-tag>
              </td>
              <td />
              <td />
              <td>
                {{ billOutSide.note }}
              </td>
              <td />
              <td>
                {{ billOutSide.code_payment }}
              </td>
              <td />
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </el-row>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetList"
        />
      </el-row>
    </el-row>
    <dialog-edit-statistic
      :show-dialog-edit="showEdit"
      :object-data="objectData"
      :statistic-id="statisticId"
      @onClickDialogEdit="handleClickDialogEdit"
    />
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import SearchResource from '@/api/search-api'
import StatisticResource from '@/api/manage-booking/statistic'
import DialogEditStatistic from '@/views/manage-booking/statistic/components/DialogEditStatistic.vue'
import moment from 'moment'
import { formatNumberOrNull, convertDateTimeSecond, convertDate } from '@/utils/convert'
import { typePurchase, typePurchaseBill, arrayTypePurchase, TYPE_PURCHASE_BILL_OUTSIDE } from '@/utils/status'
import { getAcountInfo } from '@/utils/auth'

const statisticResource = new StatisticResource()
const searchResource = new SearchResource()

export default {
  name: 'List',
  components: { Pagination, DialogEditStatistic },
  data() {
    return {
      tableData: [],
      loadingTable: false,
      listQuery: { page: 1, limit: 10 },
      total: 0,
      isAdd: true,
      onShowDialog: false,
      dialogObject: {},
      time_step_1: '',
      time_step_2: '',
      type_services: [],
      dateRange: '',
      dateRangePayment: '',
      loadingExportExcel: false,
      loading: false,
      from: 0,
      loadingSearchFacility: false,
      loadingSearchAgency: false,
      facilityList: [],
      regionList: [
        { value: 1, label: 'Miền Bắc' },
        { value: 2, label: 'Miền Trung' },
        { value: 3, label: 'Miền Nam' }
      ],
      showDialogImport: false,
      AdminList: [],
      AgencyList: [],
      total_money: 0,
      total_price_booking: 0,
      typePurchaseList: Object.keys(arrayTypePurchase()).map(key => ({
        value: parseInt(key),
        label: arrayTypePurchase()[key]
      })),
      objectDebt: {},
      showEdit: false,
      objectData: {},
      statisticId: 0,
      fileName: '',
      attachment: '',
      showVoucher: false,
      objectVoucher: {},
      agencyModel: {},
      typePurchaseBillOutSide: TYPE_PURCHASE_BILL_OUTSIDE,
      agencySelect: {}
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.listQuery.start_date)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },

  watch: {
    dateRange(value) {
      if (value) {
        this.listQuery.start_date = moment(value[0]).unix()
        this.listQuery.end_date = moment(value[1]).unix()
      } else {
        this.listQuery.start_date = ''
        this.listQuery.end_date = ''
      }
    },
    dateRangePayment(value) {
      if (value) {
        this.listQuery.start_date_payment = moment(value[0]).unix()
        this.listQuery.end_date_payment = moment(value[1]).unix()
      } else {
        this.listQuery.start_date_payment = ''
        this.listQuery.end_date_payment = ''
      }
    }
  },
  created() {
    this.listQuery.admin = getAcountInfo()?.id
    this.onGetList()
  },
  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    clickUpdateStatistic(value) {
      this.showEdit = true
      this.objectData = value
      this.statisticId = value.id
    },
    handleClickDialogEdit(object) {
      const { dialog } = object
      this.showEdit = dialog
      // this.onGetList()
    },
    onSearchFacility(keyword) {
      this.loadingSearchFacility = true
      searchResource.searchFacility({ keyword_facility: keyword.trim() }).then((res) => {
        if (res.error_code === 0) {
          this.facilityList = res.data
        }
        this.loadingSearchFacility = false
      })
    },
    onSearchAgency(keyword) {
      this.loadingSearchAgency = true
      searchResource.searchAgency({ keyword_agency: keyword.trim() }).then((res) => {
        if (res.error_code === 0) {
          this.AgencyList = res.data
        }
        this.loadingSearchAgency = false
      })
    },
    onShowDialogEdit(row) {
      this.dialogObject = { row, type_services: this.type_services }
      this.isAdd = false
      this.onShowDialog = true
    },

    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },
    onGetList() {
      if (this.listQuery.agency_id) {
        this.listQuery.agency_name = this.listQuery.agency_id
      }
      this.loadingTable = true
      const params = Object.keys(this.listQuery).map(key => {
        return `${key}=${this.listQuery[key]}`
      }).join('&')

      statisticResource.getSumRevenue(params).then(res => {
        this.total_money = res?.data?.total_revenue
        this.total_price_booking = res?.data?.total_price_booking
      })

      statisticResource.list(params).then(res => {
        console.log('res...............', res?.data)
        this.tableData = res?.data?.data || []
        this.total = res?.data?.total || 0
        this.from = this.listQuery.limit * (this.listQuery.page - 1)
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onReset() {
      this.listQuery = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.dateRangePayment = ''
      this.listQuery.admin = getAcountInfo()?.id
      this.onGetList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    async handleDownload() {
      this.listQuery.agency_name = this.agencySelect?.id ?? ''
      this.loadingExportExcel = true
      const params = Object.keys(this.listQuery).map(key => {
        return `${key}=${this.listQuery[key]}`
      }).join('&')
      await statisticResource.downloadExcel(params).then(res => {
        console.log('res...............', res)
        this.loadingTable = false
        const link = document.createElement('a')
        // nếu trong link trả về không có http hoặc https thì thêm vào
        link.href = res.data.link.includes('http') ? res.data.link : 'http://' + res.data.link
        link.download = 'statistic.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.loadingExportExcel = false
      }).catch(err => {
        this.$message.error(err?.error_code || 'Có lỗi xảy ra')
      })
      this.loadingExportExcel = false
    },
    queryPoint(value) {
      if (value.point == null) {
        return null
      }

      const point = value.point.find(item => item.user_id === value.user_id)
      return point
    },
    onChangeAgency(value) {
      if (this.AgencyList.length > 0 && this.listQuery.agency_id) {
        this.agencySelect = this.AgencyList.find(item => item.name === this.listQuery.agency_id)
      }
      console.log('value............', value)
    },
    formatNumberOrNull, convertDateTimeSecond, convertDate, typePurchase, typePurchaseBill, arrayTypePurchase
  }
}
</script>
<style lang="scss" scoped>
.delay {
  background-color: rgba(255, 85, 0, 0.12) !important;
}

.pr-5 {
  padding-right: 15px;
}

.mr-10 {
  margin-right: 10px;
}

.mt-10 {
  margin-top: 10px;
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

.data-table-content {
  .clearfix-10 {
    height: 10px;
    clear: both;
  }

  .position-relative {
    position: relative;

    .button-add-golf {
      position: absolute;
      bottom: 20px;
    }

    .btn-change-type-purchase {
      position: absolute;
      top: 0;
      right: 10px;
    }
  }

  .cursor {
    cursor: pointer;
  }
}
</style>
