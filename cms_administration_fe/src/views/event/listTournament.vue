<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Danh sách Tournament </h3>
        </el-col>

      </el-row>
      <div class="filter-container mt-10">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              ref="SearchTournament"
              v-model="query.name"
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
              <el-option v-for="tournament in Tournaments" :key="tournament.value" :label="tournament.label" :value="tournament.label" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              ref="SearchUnitTournament"
              v-model="query.name_unit"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm đơn vị tổ chức"
              :remote-method="onSearchUnitTournament"
              :loading="loadingSearchUnit"
              @hook:mounted="(value) => cancelReadOnly(value, 'SearchUnitTournament')"
              @visible-change="(value) => cancelReadOnly(value, 'SearchUnitTournament')"
            >
              <el-option v-for="unit in Units" :key="unit.value" :label="unit.label" :value="unit.label" />
            </el-select>
          </el-col>
        </el-row>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Tìm kiếm
        </el-button>
        <el-button class="filter-item" icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>

        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddEvent">Thêm mới
        </el-button>
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

            :label="('Tên Tournament')"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.name ? row.name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Đơn vị tổ chức "
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.name_unit ? row.name_unit : '' }}
            </template>

          </el-table-column>
          <el-table-column label="Poster" width="150" align="center">
            <template slot-scope="{row}">
              <img
                :src="row.img_poster"
                alt=""
                width="100%"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="Người tạo"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag type="primary">
                {{ row.admin ? row.admin.name : '' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Trạng thái"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.is_public === 1 ? 'success' : 'danger'">{{ row.is_public === 1 ? "Hiển thị " : "Không hiển thị" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="scope">
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
        <dialog-add-tournament
          :organization-data="organizations"
          :show-dialog="showDialogAddEvent"
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
import EventResource from '@/api/event'
import { formatDate, formatNumber } from '@/utils/convert'
import { isEmpty } from '@/utils/validate'

import DialogAddTournament from '@/views/event/components/DialogAddTournament.vue'
const arrayYesNo = { 1: 'Có', 0: 'Không' }
const eventResource = new EventResource()

export default {
  name: 'List',
  components: {
    DialogAddTournament,
    Pagination
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
      showDialogListUser: false,
      objectDataListUser: {},
      showDialogListAchievement: false,
      objectDataListAchievement: {},
      statistic_count: 0,
      title: '',
      loadingSearchTournament: false,
      Tournaments: [],
      loadingSearchUnit: false,
      Units: []
    }
  },
  watch: {

  },
  created() {
    this.onGetList()
  },
  methods: {
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
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
      this.handleFilter()
    },

    onGetList() {
      this.loadingTable = true
      eventResource.listTournament(this.query).then(res => {
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

    handleClose(value) {
      this.showDialogAddEvent = false
      this.showDialogListUser = false
      this.showDialogListAchievement = false
      if (value.reload) {
        this.onGetList()
      }
    },
    handleAddEvent() {
      this.isAdd = true
      this.showDialogAddEvent = true
      this.objectData = {}
    },
    handleEditEvent(row) {
      this.isAdd = false
      this.showDialogAddEvent = true
      this.objectData = Object.assign({}, row)
    },
    handleDeleteEvent(id) {
      this.$confirm(`Bạn có chắc chắn xóa Tournament này không ?`).then((_) => {
        eventResource.removeTournament(id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
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
    onSearchUnitTournament(keyword) {
      this.loadingSearchUnit = true
      eventResource.searchUnitTournament({ keyword_unit: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.Units = result.map(value => {
              return { value: value.id, label: value.name_unit }
            })
          } else {
            this.Units = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchUnit = false
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
