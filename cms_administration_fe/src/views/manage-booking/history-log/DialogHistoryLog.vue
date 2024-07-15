<template>
  <el-dialog
    title="Thông tin chi tiết "
    :visible.sync="showDialog"
    width="90%"
    :before-close="handleClose"
  >
    <div class="filter-container">
      <el-row>
        <el-col :sm="6" class="mr-10">
          <el-date-picker
            v-model="dateRange"
            class="w-100"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-col>
        <el-col :sm="4" class="mr-10">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top: 40px;">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
        height="500"
      >
        <el-table-column
          label="STT"
          width="100"
          align="center"
          type="index"
        />
        <el-table-column
          prop="pax_id"
          label="Pax_id"
          align="center"
        />
        <el-table-column
          prop="description"
          label="Mô tả"
          align="center"
        />

        <el-table-column label="VID" align="center">
          <template slot-scope="{row}">
            <el-button v-if="row.booked !== null " type="primary" plain>
              VID{{ row.booked.user_id }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Người xử lý" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" plain>
              {{ row?.admin?.name || '' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Thời gian" align="center">
          <template slot-scope="{row}">
            <span v-if="row.created_at">{{ row.created_at }}</span>
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
      </el-row>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Đóng</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { formatDate } from '@/utils/convert'
import moment from 'moment/moment'
import BookingPaxResource from '@/api/BookingPax'
import Pagination from '@/components/Pagination'

const bookingPaxResource = new BookingPaxResource()
export default {
  name: 'DialogHistoryLog',
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
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 0,
      dateRange: []
    }
  },
  computed: {},
  watch: {
    objectData(value) {
      if (value) {
        this.query.code_booking = value.code_booking
        this.query.limit = 10
        this.query.page = 1
        this.onGetList()
      }
    },
    dateRange(value) {
      if (value) {
        this.query.dateStart = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        this.query.dateEnd = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      bookingPaxResource.detailHistoryLog(this.query).then(response => {
        if (response.error_code === 0) {
          const result = response.data
          this.tableData = result.data
          this.total = result.total
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleClose() {
      this.query = {}
      this.$emit('onClickButtonDialog', false)
    },
    handleFilter() {
      this.onGetList()
    },

    formatDate
  }

}
</script>

<style scoped>
.mr-10 {
  margin-right: 10px;
}
</style>
