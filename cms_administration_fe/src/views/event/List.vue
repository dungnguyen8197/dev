<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Quản lý sự kiện</h3>
        </el-col>
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddEvent">Thêm mới
        </el-button>
      </el-row>
      <div class="filter-container mt-10">
        <el-row>
          <!--          <el-col :sm="24" :md="4" :lg="4" class="mr-10">-->
          <!--            <el-input-->
          <!--              v-model="query.keyword"-->
          <!--              class="w-100"-->
          <!--              clearable-->
          <!--              placeholder="Nhập tên sự kiện"-->
          <!--              @keyup.enter.native="handleFilter"-->
          <!--            />-->
          <!--          </el-col>-->
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              ref="searchEvent"
              v-model="query.name"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Nhập tên sự kiện"
              :remote-method="onSearchNameEvent"
              :loading="loadingSearchNameEvent"
              @hook:mounted="(value) => cancelReadOnly(value, 'searchEvent')"
              @visible-change="(value) => cancelReadOnly(value, 'searchEvent')"
            >
              <el-option v-for="name in Names" :key="name.value" :label="name.label" :value="name.label" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <search-facility @selection-changed-facility="handleSelectionChanged" />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <search-user @selection-changed-user="handleSelectionChangedUser" />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-select
              v-model="query.is_hot"
              class="w-100"
              clearable
              placeholder="Sự kiện Hot"
            >
              <el-option v-for="(item, key) in arrayYesNo" :key="key" :label="item" :value="key" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-select
              v-model="query.is_show"
              class="w-100"
              clearable
              placeholder="Show App"
            >
              <el-option v-for="(item, key) in arrayYesNo" :key="key" :label="item" :value="key" />
            </el-select>
          </el-col>

        </el-row>
        <el-row class="mt-10 mb-10">
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-select
              ref="SearchTournament"
              v-model="query.event_tournament_id"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm tournament"
              :remote-method="onSearchTournament"
              :loading="loadingSearchTournament"
              @hook:mounted="(value) => cancelReadOnly(value, 'SearchTournament')"
              @visible-change="(value) => cancelReadOnly(value, 'SearchTournament')"
            >
              <el-option
                v-for="tournament in Tournaments"
                :key="tournament.value"
                :label="tournament.label"
                :value="tournament.value"
              />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-select
              v-model="query.is_global"
              class="w-100"
              clearable
              placeholder="Sự kiện công khai"
            >
              <el-option v-for="(item, key) in arrayYesNo" :key="key" :label="item" :value="key" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <search-club @selection-changed-club="handleSelectionChangedClub" />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-select
              v-model="query.status"
              class="w-100"
              clearable
              placeholder="Trạng thái sự kiện"
            >
              <el-option v-for="(item, key) in statusEvent" :key="key" :label="item" :value="key" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="6" :lg="6" class="mr-10">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="To"
              format="dd-MM-yyyy HH:mm:ss"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </el-col>
        </el-row>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Tìm kiếm
        </el-button>
        <el-button class="filter-item" icon="el-icon-refresh" round @click="onReset">Reset</el-button>

        <p style="color: red; font-size: 15px; text-align: center !important;">{{ title }}</p>
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
            prop="name"

            :label="('Tên sự kiện')"
            align="center"
          />
          <el-table-column
            label="Sân"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.facility ? row.facility.title : '' }}
            </template>

          </el-table-column>
          <el-table-column
            label="Câu lạc bộ/Doanh nghiệp"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.club ? row.club.name : '' }}
            </template>

          </el-table-column>
          <el-table-column
            label="Tournament"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.tournament ? row.tournament.name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Option sự kiện"
            align="center"
          >
            <template v-if=" row.event.length > 0" slot-scope="{row}">
              <div v-for="(item ) in row.event" :key="item.id">
                <el-tag v-if="item.active == true">{{ item.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Ngày bắt đầu"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatDate(row.tee_time) }}
            </template>

          </el-table-column>
          <el-table-column
            label="Ngày kết thúc"
            align="center"
          >
            <template slot-scope="{row}">
              {{ formatDate(row.tee_time_end) }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Loại sự kiện"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.is_global === 1 ? 'SK công khai' : 'SK thường' }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Hiển thị App"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.is_show === 1 ? 'success' : 'danger'">{{
                row.is_show === 1 ? 'Show' : 'Không show'
              }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Hình ảnh" width="150" align="center">
            <template slot-scope="{row}">
              <img
                :src="row.img_background"
                alt=""
                width="100%"
              >
            </template>
          </el-table-column>
          <!-- <el-table-column
            width="100"
            label="Số người"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag type="primary">
                {{ formatNumber(row.total_joined) }}
              </el-tag>
            </template>
          </el-table-column> -->
          <el-table-column
            label="Người tạo"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag v-if="row.user" type="primary">
                vID{{ row.user_created }} - {{ row.user.fullname }}
              </el-tag>

            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="is_approve"
            label="Trạng thái"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="getStatus(row).type">{{ getStatus(row).value }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Nguồn tạo"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag v-if="row.source_created == 1" type="primary">CMS sân golf</el-tag>
              <el-tag v-if="row.source_created == 4" type="primary">APP WGHN</el-tag>
              <el-tag v-if="row.source_created == 0" type="primary">CMS sự kiện</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="scope">
              <el-button
                class="mb-5"
                icon="el-icon-plus"
                size="mini"
                round
                style="background-color: #3642A7; color: white"
                @click="handleListChanel(scope.row)"
              >
                Kênh TV
              </el-button>
              <el-button
                class="mb-5"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                round
                @click="handleAddUser(scope.row)"
              >
                User thêm
              </el-button>
              <el-button
                class="mb-5"
                type="success"
                icon="el-icon-info"
                size="mini"
                round
                @click="handleListAchievement(scope.row)"
              >
                Thành tích
              </el-button>
              <el-button
                class="mb-5"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditEvent(scope.row)"
              >
                Sửa
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleDeleteEvent(scope.row.id)"
              >
                Xóa
              </el-button>
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
        <dialog-add-event
          :organization-data="organizations"
          :show-dialog="showDialogAddEvent"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <dialog-list-use-add-event
          :show-dialog="showDialogListUser"
          :object-data="objectDataListUser"
          @onCloseDialog="handleClose"
        />
        <dialog-add-user />
        <dialog-list-achievements
          :show-dialog="showDialogListAchievement"
          :object-data="objectDataListAchievement"
          @onCloseDialog="handleClose"
        />
        <dialog-achievement />
        <dialog-list-chanel-event
          :show-dialog="showDialogListChanel"
          :object-data="objectDataListChanel"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import EventResource from '@/api/event'
import UnitResource from '@/api/event/unit'
import DialogAddEvent from '@/views/event/components/DialogAddEvent'
import DialogListUseAddEvent from '@/views/event/components/DialogListUseAddEvent.vue'
import DialogListAchievements from '@/views/event/components/DialogListAchievements.vue'
import DialogAchievement from '@/views/event/components/DialogAchievement'
import { formatDate, formatNumber } from '@/utils/convert'
import SearchFacility from '@/views/component/SearchFacility.vue'
import { isEmpty } from '@/utils/validate'
import SearchUser from '@/views/component/SearchUser.vue'
import SearchClub from '@/views/component/SearchClub.vue'
import DialogAddUser from '@/views/event/components/DialogAddUser.vue'

import moment from 'moment'
import DialogListChanelEvent from '@/views/event/components/DialogListChanelEvent.vue'

const arrayYesNo = { 1: 'Có', 0: 'Không' }

const eventResource = new EventResource()
const unitResource = new UnitResource()

export default {
  name: 'List',
  components: {
    DialogListChanelEvent,
    SearchClub,
    SearchUser,
    SearchFacility,
    Pagination,
    DialogAddEvent,
    DialogListUseAddEvent,
    DialogAddUser,
    DialogListAchievements,
    DialogAchievement
  },
  data() {
    return {
      organizations: [],
      arrayYesNo: arrayYesNo,
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
      showDialogAddEvent: false,
      objectData: {},
      dateRange: '',
      statusEvent: {
        0: 'Sắp diễn ra',
        1: 'Đang diễn ra',
        2: 'Hoàn thành'
      },
      showDialogListUser: false,
      showDialogListChanel: false,
      objectDataListUser: {},
      objectDataListChanel: {},
      showDialogListAchievement: false,
      objectDataListAchievement: {},
      statistic_count: 0,
      title: '',
      tournamentModel: null,
      loadingSearchTournament: false,
      Tournaments: [],
      loadingSearchNameEvent: false,
      Names: []
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
  tournamentModel(value) {
    console.log('aaaaaaaaaaaaa', value)
    if (value) {
      this.query.event_tournament_id = value.value
    } else {
      this.query.event_tournament_id = ''
    }
  },
  created() {
    this.onGetList()
    this.statistic()
    this.onGetOrganization()
  },
  methods: {
    onSearchNameEvent(keyword) {
      this.loadingSearchNameEvent = true
      eventResource.searchNameEvent({ keyword_name_event: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.Names = result.map(value => {
              return { value: value.id, label: value.name }
            })
          } else {
            this.Names = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchNameEvent = false
      })
    },
    onSearchTournament(keyword) {
      this.loadingSearchTournament = true
      eventResource.searchTournament({ keyword_tournament: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.Tournaments = result.map(value => {
              return { value: value.id, label: value.name }
            })
            console.log('qưewqeqweqwe', this.Tournaments)
          } else {
            this.Tournaments = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchTournament = false
      })
    },
    async statistic() {
      eventResource.statistic_hot_event(this.query).then(res => {
        const { error_code, data, error_msg } = res
        if (error_code === 0) {
          this.statistic_count = data.total
          if (this.statistic_count < 5) {
            this.title = 'NOTE: Số lượng chưa đủ 5 hot event, bạn cần set thêm hot event'
          }
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
      })
    },
    onGetOrganization() {
      unitResource.lists({ page: 1, limit: 50, is_active: 1 }).then(res => {
        if (res.error_code === 0) {
          this.organizations = res?.data?.data
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },
    handleSelectionChanged(value) {
      console.log('value_____', value)
      if (isEmpty(value)) {
        delete this.query.facility_id
        this.handleFilter()
        return
      }
      this.query.facility_id = value.value
      // this.handleFilter()
    },
    handleSelectionChangedUser(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.query.uid
        this.handleFilter()
        return
      }
      this.query.uid = value.value
      // this.handleFilter()
    },
    handleSelectionChangedClub(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.query.club_id
        this.handleFilter()
        return
      }
      this.query.club_id = value.value
      // this.handleFilter()
    },
    onGetList() {
      this.loadingTable = true
      eventResource.lists(this.query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res?.data?.data || []
          this.total = res?.data?.total || 0
          console.log('this.tableData___________', this.tableData)
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
      return this.query.page === 1 ? this.query.page + index : ((this.query.page - 1) * this.query.limit) + index + 1
    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.dateRange = ''
      delete this.query.club_id
      delete this.query.uid
      this.golferModel = ''
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddEvent = false
      this.showDialogListUser = false
      this.showDialogListAchievement = false
      this.showDialogListChanel = false
      if (value.reload) {
        this.onGetList()
      }
    },
    handleAddEvent() {
      this.isAdd = true
      this.showDialogAddEvent = true
      this.objectData = {}
    },
    handleAddUser(row) {
      this.showDialogListUser = true
      this.objectDataListUser = Object.assign({}, { id: row.id })
    },
    handleListChanel(row) {
      this.showDialogListChanel = true
      this.objectDataListChanel = Object.assign({}, row)
    },
    handleEditEvent(row) {
      this.isAdd = false
      this.showDialogAddEvent = true
      this.objectData = Object.assign({}, row)
    },
    handleListAchievement(row) {
      this.showDialogListAchievement = true
      this.objectDataListAchievement = Object.assign({}, row)
    },
    handleDeleteEvent(id) {
      this.$confirm(`Bạn có chắc chắn xóa sự kiện này không ?`).then((_) => {
        eventResource.remove(id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    getStatus(row) {
      const now = moment()
      const tee_time = moment(row.tee_time)
      const tee_time_end = moment(row.tee_time_end)
      if (tee_time.isAfter(now)) {
        return { type: 'primary', value: 'Sắp diễn ra' }
      } else if (now.isBetween(tee_time, tee_time_end)) {
        return { type: 'danger', value: 'Đang diễn ra' }
      } else if (tee_time_end.isBefore(now)) {
        return { type: 'success', value: 'Hoàn thành' }
      }
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
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  text-transform: uppercase;
}

.mb-5 {
  margin-bottom: 5px !important;
}
</style>
