<template>
  <el-dialog
    class="detail-custom"
    title="Danh sách người chơi"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="80%"
  >
    <el-row class="table-history">
      <el-col>
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :index="handleIndexMethod"
            label="STT"
            width="50"
          />
          <el-table-column
            label="vID"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.user_id ? row.user_id : '' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Tên khách hàng"
          >
            <template slot-scope="{row}">
              <p v-if="row.user_id !== -1">
                {{ row.user ? row.user.fullname : '' }}
              </p>
              <p v-else>
                {{ row.name_user }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="CCCD/năm sinh"
          >
            <template slot-scope="{row}">
              {{ row.passport ? row.passport : '' }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import InsuranceApi from '@/api/HIO/insurance'

const insuranceApi = new InsuranceApi()

// import Pagination from '@/components/Pagination/index.vue'
import {
  convertDateTime,
  formatNumber
} from '@/utils/convert'
import {
  convertIsPayToString,
  convertSourceBuyToString,
  convertIsSendPviToString,
  convertSourcePayToString
} from '@/utils/insurance/convertNumberToString'

export default {
  name: 'DialogListMemberInsurance',
  components: { },
  props: {
    objectMember: {
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
      detail: {},
      loading: false,
      listQuery: { page: 1, limit: 10 },
      loadingUpdateVerify: false,
      tableData: [],
      total: 0,
      loadingExportExcel: false
    }
  },
  watch: {
    objectMember(val) {
      if (val) {
        this.onGetListMember(val.id)
      }
    }
  },
  methods: {
    convertDateTime,
    onGetListMember() {
      const query = {
        insurrance_id: this.objectMember.id
      }
      this.loadingTable = true
      insuranceApi.listMemberInsurance(query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res.data
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },

    handleClose() {
      this.$emit('onClickButtonMember', { dialog: false, reload: false })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    formatNumber,
    convertIsPayToString,
    convertSourceBuyToString,
    convertIsSendPviToString,
    convertSourcePayToString
  }
}
</script>

<style>
.detail-custom .title.bold, .detail-custom .el-dialog__title {
  font-weight: bolder;
}
</style>
