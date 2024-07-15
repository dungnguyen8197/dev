<template>
  <el-dialog
    title="DANH SÁCH THÀNH TÍCH"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
    fullscreen
  >
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="mr-10 mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.achievement_name"
              placeholder="Nhập tên thành tích"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10">
          <el-button class="filter-item" icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin:20px; font-family:Sans-serif">
      <div class="filter-container" />
      <!-- max-height: 80vh; -->
      <el-row style="width: 100%;">
        <!-- max-height:60vh; overflow: scroll; -->
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column prop="event_name" label="Tên sự kiện" align="center" />
          <el-table-column prop="achievement_name" label="Tên thành tựu" align="center" />
          <el-table-column prop="user_id" label="User id" align="center">
            <template slot-scope="{row}">
              {{ +row.user_id > 0 ? `viD${row.user_id}` : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Loại" align="center">
            <template slot-scope="{row}">
              <el-tag type="primary">{{ row.type === 1 ? "CLB" : "Cá nhân" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Câu lạc bộ" align="center">
            <template slot-scope="{row}">
              {{ row.club ? row.club.name : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Sân" align="center">
            <template slot-scope="{row}">
              {{ row.facility ? row.facility.sub_title : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Thời gian bắt đầu" align="center">
            <template slot-scope="scope">
              {{ scope.row.tee_time ? convertDateTime(scope.row.tee_time) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Thời gian kết thúc" align="center">
            <template slot-scope="scope">
              {{ scope.row.tee_time_end ? convertDateTime(scope.row.tee_time_end) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Ngày tạo" align="center">
            <template slot-scope="scope">
              {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Hành động" width="150" align="center">
            <template slot-scope="scope">
              <!-- <el-button
                class="mb-10"
                size="small"
                :title="`Sửa`"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleUpdate(scope.row)"
              /> -->
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
            v-show="total >= query.limit"
            style="padding: 0"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
        </el-row>
      </el-row>
    </el-row>
  </el-dialog>
</template>
<script>

import Pagination from '@/components/Pagination/index'
import { formatNumber, convertDateTime } from '@/utils/convert'
import EventResource from '@/api/event'
import { trim_string_object } from '@/utils/trim-string-object'

const eventResource = new EventResource()

export default {
  name: 'DialogListUseAddEvent',
  components: {
    Pagination
  },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingTable: false,
      query: { page: 1, limit: 10 },
      total: 10,
      tableData: [],
      objectDetail: {}
    }
  },
  watch: {
    objectData(value) {
      console.log('...................', value)
      if (value) {
        this.objectDetail = value
        this.onGetList()
      }
    },
    '$store.getters.isShowDialogAddAchievement'(value) {
      this.onGetList()
    }
  },
  created() {
    // this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      await this.trim_string_object(this.query)
      console.log('..........', this.query)
      eventResource.list_achievement(this.query, this.objectDetail.id).then(res => {
        const { error_code, data, error_msg } = res
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
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleAdd() {
      console.log('objectDetail............', this.objectDetail)
      this.$store.dispatch('showDialogAddAchievement', this.objectDetail)
    },

    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
      this.resetquery()
    },

    async resetquery() {
      await Promise.resolve(
        this.query = { page: 1, limit: 10 },
        this.total = 10,
        this.tableData = []
      )
    },
    async handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn xóa thành tích này không ?`).then((_) => {
        eventResource.remove_achievement({ id: row.id }).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.data)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    formatNumber,
    convertDateTime,
    trim_string_object
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

