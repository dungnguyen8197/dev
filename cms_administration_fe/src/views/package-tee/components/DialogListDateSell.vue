<template>
  <el-dialog
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
    fullscreen
  >
    <h4 slot="title">{{ `Danh sách ngày đã bán sân: ${objectDetail.facility ? objectDetail.facility.sub_title : ""}` }}</h4>
    <el-row style="margin:20px; font-family:Sans-serif">
      <div class="filter-container" />
      <el-row style="width: 100%;">
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%;">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column prop="user_id" label="Đường" align="center">
            <template slot-scope="{row}">
              {{ row.path ? row.path.name : "" }}
            </template>
          </el-table-column>
          <el-table-column label="Ngày bán" align="center">
            <template slot-scope="scope">
              {{ scope.row.date_sell ? convertDateTime(scope.row.date_sell) : '' }}
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

import PackageTeeResource from '@/api/package-tee/index'

const packageTeeResource = new PackageTeeResource()

export default {
  name: 'DialogVoucher',
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
      total: 0,
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
    }
  },
  created() {
    // this.onGetList()
  },
  methods: {
    async onGetList() {
      this.loadingTable = true
      if (this.objectDetail.date) {
        this.query.date = this.objectDetail.date
      }
      packageTeeResource.list_date_sell({ ...this.query, id: this.objectDetail.id }).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error(res.message)
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

    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetquery()
    },

    async resetquery() {
      await Promise.resolve(
        this.query = { page: 1, limit: 10 },
        this.total = 10,
        this.tableData = []
      )
    },
    convertDateTime,
    formatNumber
  }
}
</script>

    <style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .input-amount{
      width: 100%;
      border: 1px solid #DCDFE6;
      border-radius: 5px;
      padding: 0 10px;
    }
    .input-amount::placeholder{
      color: #606266;
    }
    .input-amount:focus {
      border-color: #66afe9;
      outline: 0;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    }
    .mb-10 {
      margin-bottom: 10px;
    }
    </style>

