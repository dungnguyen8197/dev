<template>
  <el-dialog
    title="Danh sách người dùng sở hữu voucher"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
    fullscreen
  >
    <el-row style="margin:20px; font-family:Sans-serif">
      <div class="filter-container" />
      <!-- max-height: 80vh; -->
      <el-row style="width: 100%;">
        <!-- max-height:60vh; overflow: scroll; -->
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%;">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column prop="user_id" label="vID" align="center">
            <template slot-scope="{row}">
              {{ `vID${row.user_id}` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="avatar"
            label="Avatar"
            align="center"
          >
            <template slot-scope="{row}">
              <el-image
                style="width: 100px; height: auto"
                :src="row.avatar"
              />
            </template>
          </el-table-column>
          <el-table-column prop="fullname" label="Họ tên" align="center" />
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

import PartnerServiceResource from '@/api/partner-service/partner-service'
import Pagination from '@/components/Pagination/index'
import { create_signature_hub } from '@/utils/create-signnature'

const partnerServiceResource = new PartnerServiceResource()

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
      total: 10,
      tableData: []
    }
  },
  watch: {
    objectData(value) {
      console.log('...................', value)
      if (value) {
        this.query = { ...this.query, ...value }
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
      const signature = await this.create_signature_hub(this.query)
      this.query = { ...this.query, signature }
      partnerServiceResource.get_user_own_voucher(this.query).then(res => {
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
    create_signature_hub
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

