<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH EVENT DRAF</h3>
        <p v-if="total_unedited > 0" style="color: red; text-align: center;">{{ title }}</p>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.name"
              placeholder="Nhập tên"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.status"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Trạng thái"
            >
              <el-option
                v-for="status in statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column prop="name" label="Tên" align="center" />
        <el-table-column label="Loại" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type" type="primary">{{ typeList[scope.row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">Đã biên tập</el-tag>
            <el-tag v-else type="danger">Chưa biên tập</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="Sân" align="center" />
        <el-table-column prop="unit_organization" label="Đơn vị tổ chức" align="center" />
        <el-table-column
          label="Link live score"
          width="150"
          align="center"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              :href="row.link"
              target="_blank"
            >{{ row.link }}</el-link>

          </template>
        </el-table-column>
        <el-table-column label="Trạng thái livescore" align="center">
          <template v-if="scope.row.live_status == ''" slot-scope="scope">
            <el-tag v-if="scope.row.live_status != 0" type="primary">{{ liveStatus[scope.row.live_status] }}</el-tag>
            <el-tag v-else type="danger">Đã kết thúc</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="logo"
          label="Logo"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              v-if="row.logo"
              style="width: 100px; height: auto"
              :src="row.logo"
            />
            <span v-else>Không có ảnh</span>
          </template>
        </el-table-column>
        <el-table-column label="Thời gian bắt đầu" align="center">
          <template slot-scope="scope">
            {{ scope.row.date_start ? formatDate(scope.row.date_start) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian kết thúc" align="center">
          <template slot-scope="scope">
            {{ scope.row.date_end ? formatDate(scope.row.date_end) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? formatDate(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status != 1"
              class="mb-10"
              size="small"
              :title="`Biên tập`"
              type="success"
              icon="el-icon-plus"
              circle
              @click="handleCreateEvent(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :title="`Xóa`"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
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
        <dialog-add-event
          :organization-data="organizations"
          :show-dialog="showDialogAddEvent"
          :object-data="objectDataAddEvent"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <dialog-event-draf
          :show-dialog="showDialog"
          :object-data="objectData"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import EventResource from '@/api/event'
import { formatDate, formatNumber } from '@/utils/convert'
import DialogAddEvent from '@/views/event/components/DialogAddEvent'
import DialogEventDraf from '@/views/event/components/DialogEventDraf'
import UnitResource from '@/api/event/unit'
import { getAcountInfo } from '@/utils/auth'
import { ARRAY_ADMIN } from '@/utils/constant'

const eventResource = new EventResource()
const unitResource = new UnitResource()

export default {
  name: 'ListPartner',
  components: {
    Pagination,
    DialogAddEvent,
    DialogEventDraf
  },

  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 0,
      isAdd: true,
      objectDataAddEvent: {},
      showDialogAddEvent: false,
      statusList: [{ value: 0, label: 'Chưa biên tập' }, { value: 1, label: 'Đã biên tập' }],
      typeList: {
        1: 'Quốc tế',
        2: 'VGATour',
        3: 'Nghiệp dư trong nước',
        4: 'Khác'
      },
      liveStatus: {
        0: 'Đã kết thúc',
        1: 'Đang diễn ra',
        2: ' Sắp diễn ra'
      },
      organizations: [],
      showDialog: false,
      objectData: {},
      total_unedited: 0,
      title: '',
      account: getAcountInfo(),
      ARRAY_ADMIN: ARRAY_ADMIN
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.onGetList()
    this.onGetOrganization()
    this.timer = setInterval(this.onGetList, 1000 * 60 * 5)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    async onGetOrganization() {
      await unitResource.lists({ page: 1, limit: 50, is_active: 1 }).then(res => {
        if (res.error_code === 0) {
          this.organizations = res?.data?.data
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    async onGetList() {
      this.loadingTable = true
      eventResource.list_event_draf(this.query).then(res => {
        const { error_code, data, error_msg } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
          this.total_unedited = data.total_unedited
          this.title = `( Note: Có ${this.total_unedited} bản ghi chưa được biên tập )`
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },

    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa ${row.name}`).then(async(_) => {
        eventResource.remove_event_draf(row.id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.data)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleClose() {
      this.showDialogAddEvent = false
      this.showDialog = false
      this.onGetList()
    },
    async handleCreateEvent(row) {
      console.log('.......... bien tap')
      this.isAdd = true
      // let organization_id = null
      // await this.onGetOrganization()
      // console.log('organizations.............', this.organizations)
      // const check_organization = this.organizations.find((item) => item.name === row.unit_organization)
      // if (check_organization) {
      //   organization_id = check_organization?.id
      // }
      // console.log('organization_id..............', organization_id)
      this.showDialogAddEvent = true
      this.objectDataAddEvent = Object.assign({},
        {
          eventDrafID: row.id,
          name: row.name,
          location: row.location,
          tee_time: row.date_start,
          tee_time_end: row.date_end,
          is_global: 1,
          unit_organization: row.unit_organization,
          // organization_id: organization_id ?? '',
          // live_score: 1,
          url_live_score: row.link ? row.link : '',
          is_international: 1,
          is_public_all: 1
        })
    },
    handleAdd() {
      this.showDialog = true
      this.objectData = Object.assign({},
        {
          liveStatus: this.liveStatus,
          typeList: this.typeList
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
  </style>

