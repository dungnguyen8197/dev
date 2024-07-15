<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h5 class="title">Quản lý Tee time</h5>
        </el-col>

      </el-row>
      <div class="filter-container">
        <el-row>

          <el-col :sm="24" :md="4" :lg="4" class="mr-10 mb-10">
            <label>Ngày chơi</label>
            <br>
            <div class="grid-content bg-purple">
              <el-date-picker
                v-model="query.dayPlayed"
                class="w-100"
                type="date"
                format="dd/MM/yyyy"
                value-format="dd-MM-yyyy"
                placeholder="Chọn ngày"
              />
              <!-- <el-date-picker
                v-model="dateRangeDateUse"
                style="width: 100%"
                format="dd-MM-yyyy"
                type="daterange"
                range-separator="To"
                start-placeholder="Start ngày chơi"
                end-placeholder="End ngày chơi"
              /> -->
            </div>
          </el-col>
          <el-col class="mr-10 mb-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Sân</label>
            <br>
            <el-select
              v-model="facilityModel"
              class="w-100"
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm sân golf"
              :remote-method="onSearchFacility"
              :loading="loadingSearchFacility"
            >
              <el-option
                v-for="facility in facilities"
                :key="facility.value"
                :label="facility.label"
                :value="facility"
              />
            </el-select>
          </el-col>
          <el-col class="mr-10 mb-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="2">
            <label>Đường</label>
            <br>
            <el-select
              v-model="query.path_id"
              :disabled="Object.keys(facilityModel).length === 0"
              placeholder="Chọn đường"
            >
              <el-option v-for="item in paths" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
          <el-col style="margin-top: 5px;" :xs="24" :sm="12" :md="8" :lg="4" :xl="2">
            <label />
            <br>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
          </el-col><el-col style="margin-top: 5px;" :xs="24" :sm="12" :md="8" :lg="4" :xl="2">
            <label />
            <br>
            <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>

          </el-col>

        </el-row>
        <el-row>
          <el-col :sm="24" :md="5" :lg="5">
            <label>Thời gian khóa tee</label>
            <br>
            <el-time-picker
              v-model="timeUpdatePax"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
              value-format="HH:mm"
            />
          </el-col>
          <el-col style="margin-top: 5px; margin-left: 20px" :sm="24" :md="4" :lg="2">
            <label />
            <br>
            <el-button class="filter-item" type="info" @click="handleUpdateLockPaxMultiple(0)">
              Mở khóa Tee
            </el-button>
          </el-col>
          <el-col style="margin-top: 5px;" :sm="24" :md="4" :lg="4">
            <label />
            <br>
            <el-button class="filter-item" type="danger" @click="handleUpdateLockPaxMultiple(1)">
              Khóa Tee
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :selectable="canSelectRow"

            type="selection"
            width="55"
          />
          <el-table-column
            label="STT"
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            width="250"
            :label="('Giờ Teetime')"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatDate(row.date_played, "HH:mm") }}
            </template>
          </el-table-column>

          <el-table-column
            prop="is_approve"
            label="Trạng thái mở Tee"
            align="center"
          >
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_lock"
                :disabled="row.booked.length > 0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="0"
                :inactive-value="1"
                @change="handleSwitchLockPax(row,'approve')"
              />
            </template>
          </el-table-column>

          <el-table-column
            width="150"

            label="Số người chơi"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.booked.length > 0 ? row.booked.length : "" }}
            </template>
          </el-table-column>
          <el-table-column
            width="150"

            label="Giá 9 hố"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatNumber(row.price_9_hole) }} đ
            </template>
          </el-table-column>
          <el-table-column
            width="150"

            label="Giá 18 hố"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatNumber(row.price_18_hole) }} đ

            </template>
          </el-table-column>
          <el-table-column
            width="150"

            label="Giá 27 hố"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatNumber(row.price_27_hole) }} đ
            </template>
          </el-table-column>
          <el-table-column
            width="250"

            label="Sale"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.booked.length > 0 ? handleAdmin(row.booked[0].cms_admin_id) : "" }}
            </template>
          </el-table-column>
          <el-table-column
            width="250"
            label="Hành động"
            align="center"
          >
            <template slot-scope="{row}">
              <el-popover
                ref="popoverRef"
                placement="left"
                width="250"
                trigger="click"
              >
                <el-form ref="form" label-position="right">
                  <el-form-item label="Giá 9 hố :">
                    <el-input-number
                      v-model="row.price_9_hole"
                      :min="0"
                      :step="50000"
                    />
                  </el-form-item>
                  <el-form-item label="Giá 18 hố : ">
                    <el-input-number
                      v-model="row.price_18_hole"
                      :min="0"
                      :step="50000"
                    />
                  </el-form-item>
                  <el-form-item label="Giá 27 hố :">
                    <el-input-number
                      v-model="row.price_27_hole"
                      :min="0"
                      :step="50000"
                    />
                  </el-form-item>
                  <el-button v-loading="loadingUpdatePricePax" type="primary" size="mini" @click="updatePricePax(row)">Đổi giá
                  </el-button>

                </el-form>

                <el-button
                  slot="reference"
                  icon="el-icon-edit"
                  round
                  type="primary"
                  size="mini"
                >Giá bán</el-button>
              </el-popover>
              <!-- <el-button
                type="primary"
                icon="el-icon-edit"
                round
                size="mini"
                @click="showListFacility(scope.row)"
              >Giá bán
              </el-button> -->

            </template>
          </el-table-column>
        </el-table>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > query.limit"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            :page-sizes="pageSizes"
            @pagination="onGetList"
          />
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo, getAllAdmin } from '@/utils/auth'
import { baseURL } from '@/constant/config'
import BookingPaxResource from '@/api/BookingPax'
import moment from 'moment'
import { formatDate, formatNumber } from '@/utils/convert'
import FacilityResource from '@/api/facility/facility'
import { isEmpty } from '@/utils/validate'

const facilityResource = new FacilityResource()
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'ListTee',
  components: { Pagination },
  data() {
    const account = getAcountInfo()
    console.log('account....................', account)
    return {
      dataAllAdmin: getAllAdmin() || [],
      tableData: [],
      pageSizes: [10, 20, 30, 50, 'All'],
      facilityModel: {},
      paths: [],
      facilities: [],
      loadingTable: false,
      total: 0,
      onShowDialog: false,
      query: {
        limit: 50,
        page: 1
      },
      loadingData: true,
      from: 0,
      isShowListFacility: false,
      optionsFacility: [],
      showDialogAddAgency: false,
      objectData: {},
      objectDataDetail: {},
      loadingSearchFacility: false,
      dateRangeDateUse: '',
      idsLock: [],
      loadingUpdatePricePax: false,
      timeUpdatePax: null
    }
  },
  computed: {

  },
  watch: {
    facilityModel(value) {
      if (this.paths.length > 0) {
        this.paths = []
        this.query.path_id = null
      }
      if (!isEmpty(value)) {
        this.paths = value.path
        console.log('paths', this.paths)
        this.query.facility_id = value.value
      }
    },

    dateRangeDateUse(value) {
      console.log('value__________', value)
      if (value) {
        this.query.start_date = moment(value[0]).format('DD-MM-YYYY')
        this.query.end_date = moment(value[1]).format('DD-MM-YYYY')
        // this.title = `TỪ ${moment(value[0]).get('date')}.${moment(value[1]).get('month') + 1} - ${moment(
        //     value[1],
        // ).get('date')}.${moment(value[1]).get('month') + 1} năm ${moment(value[1]).get('year')}`;
      } else {
        this.query.start_date = ''
        this.query.end_date = ''
      }
    }
  },
  async created() {
    await this.getFacilityByAdmin()
  },
  methods: {
    updatePricePax(row) {
      console.log('row____________', row)
      this.loadingUpdatePricePax = true
      const body = {
        price_9_hole: row?.price_9_hole || 0,
        price_18_hole: row?.price_18_hole || 0,
        price_27_hole: row?.price_27_hole || 0,
        pax_id: row.id
      }
      bookingPaxResource.updatePricePax(body).then(res => {
        if (res.error_code === 0) {
          this.onGetList()
          this.$message.success(res.error_msg)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingUpdatePricePax = false
        this.$refs.popoverRef.doClose()
      })
    },
    async getFacilityByAdmin() {
      this.query.path_id = null
      const id = getAcountInfo().facility_id || 32
      facilityResource.Detail({ facility_id: id }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result) {
            const data = { value: result.id, label: result.sub_title, path: result.paths }
            this.facilities = [data]
            this.facilityModel = data
            this.query = {
              ...this.query,
              facility_id: result.id,
              path_id: result.paths[0].id
            }

            this.onGetList()
          } else {
            this.facilities = []
            this.facilityModel = {}
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSearchFacility(keyword) {
      this.query.path_id = null
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, booking: value.booking, path: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleAdmin(admin_id) {
      const admin = this.dataAllAdmin.find(item => item.id === admin_id)
      if (admin) return admin.name
      else return admin_id
    },

    onGetList() {
      this.loadingTable = true

      bookingPaxResource.listTeeTime(this.query).then(res => {
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
    handleSwitchLockPax(row, type) {
      console.log('row__________', row)
      let obj = {}
      switch (row.is_lock) {
        case 1:
          obj = {
            value: 1,
            textConfirm: 'Bạn có muốn khóa Tee này không ?'
          }
          break
        case 0:
          obj = {
            value: 0,
            textConfirm: 'Bạn có muốn mở Tee này không ?'
          }
          break
      }

      if (confirm(obj.textConfirm)) {
        bookingPaxResource.updateLockPax({ id: row.id, is_lock: obj.value }).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.error_msg)
            this.onGetList()
          } else {
            this.$message.error(res.error_msg)
            row.is_lock = row.is_lock === 1 ? 0 : 1
          }
        })
      } else {
        row.is_lock = row.is_lock === 1 ? 0 : 1
      }
    },
    handleUpdateLockPaxMultiple(type) {
      console.log('row__________', type)
      if (!this.timeUpdatePax && this.idsLock.length === 0) {
        this.$message.warning('Vui lòng chọn thời gian hoặc tích chọn tee.')
        return
      }
      let obj = {}
      switch (type) {
        case 0:
          obj = {
            value: type,
            textConfirm: 'Bạn có muốn mở khóa các Tee này không ?'
          }
          break
        case 1:
          obj = {
            value: 1,
            textConfirm: 'Bạn có muốn khóa các Tee này không ?'
          }
          break
      }
      console.log('timeUpdatePax__________', this.timeUpdatePax)

      let bodyFrom = {}
      if (this.timeUpdatePax) {
        const dayPlayed = this.query.dayPlayed ? this.query.dayPlayed : moment().format('DD-MM-YYYY')
        console.log(dayPlayed)
        const start_time = moment(dayPlayed, 'DD-MM-YYYY').add(moment.duration(this.timeUpdatePax[0])).format('DD-MM-YYYY HH:mm:ss')
        const end_time = moment(dayPlayed, 'DD-MM-YYYY').add(moment.duration(this.timeUpdatePax[1])).format('DD-MM-YYYY HH:mm:ss')
        bodyFrom = {
          ...bodyFrom,
          start_time,
          end_time,
          facility_id: this.query.facility_id,
          path_id: this.query.path_id
        }
        console.log('bodyFrom____________', bodyFrom)
      }
      if (this.idsLock.length > 0) {
        bodyFrom = {
          ...bodyFrom,
          id: this.idsLock
        }
      }
      if (confirm(obj.textConfirm)) {
        console.log('this.idsLock___________', this.idsLock)
        bodyFrom = {
          ...bodyFrom,
          is_lock: obj.value
        }
        bookingPaxResource.updateLockPaxMultiple(bodyFrom).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.error_msg)
            this.onGetList()
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.timeUpdatePax = null
        })
      }
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    // onReset() {
    //   this.query = Object.assign({}, { limit: 50, page: 1 })
    //   this.onGetList()
    // },
    handleClose(value) {
      this.showDialogAddAgency = value.dialog
      if (value.reload) {
        this.onGetList()
      }
    },
    showListFacility(row) {
      this.isShowListFacility = true
      this.objectDataDetail = Object.assign({}, row)
    },

    handleSelectionChange(val) {
      console.log('val_______________', val)
      if (val.length > 0) {
        this.idsLock = val.map(item => item.id)
      } else {
        this.idsLock = []
      }
    },
    onReset() {
      window.location.reload()
    },
    convertLink(value) {
      return baseURL + value
    },
    canSelectRow(row, index) {
      return row.booked.length < 1
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
.w-100{
  width: 100%;
}
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700;
  text-transform: uppercase;
}
</style>

<style scoped>
.mb-10 {
  margin-bottom: 10px;
}
p, p span {
  font-size: 12px !important;
}

span, label, th, td {
  font-size: 12px !important;
}
.mt-5 {
  margin-top: 5px;
}
</style>
