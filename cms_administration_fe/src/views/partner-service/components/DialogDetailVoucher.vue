<template>
  <el-dialog
    title="Thông tin chi tiết voucher"
    :visible.sync="showDialog"
    :before-close="handleClose"
    center
    fullscreen
  >
    <el-row style="margin:20px; font-family:Sans-serif">
      <div class="filter-container" />

      <el-row style="width: 100%">
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column prop="title" label="Tên voucher" align="center" />
          <el-table-column prop="code" label="Mã code" align="center" />
          <el-table-column label="Ngày bắt đầu" align="center">
            <template slot-scope="scope">
              {{ scope.row.start_at ? convertDateTime(scope.row.start_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Ngày kết thúc" align="center">
            <template slot-scope="scope">
              {{ scope.row.end_at ? convertDateTime(scope.row.end_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Tên đối tác" align="center">
            <template slot-scope="scope">
              {{ scope.row.partner ? scope.row.partner.name : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status != 0" :type="statusVoucher[scope.row.status].type">{{ statusVoucher[scope.row.status].label }}</el-tag>
              <el-tag v-else type="warning">Chờ</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quantity_release" label="Số lượng voucher phát hành" align="center">
            <template slot-scope="scope">
              {{ scope.row.quantity_release ? formatNumber(scope.row.quantity_release) : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="discount_desc_vn" label="Mô tả về chiết khấu (Tiếng việt)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.discount_desc_vn)" />
            </template>
          </el-table-column>

          <el-table-column prop="payment_desc_vn" label="Mô tả phương thức thanh toán (Tiếng việt)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.payment_desc_vn)" />
            </template>
          </el-table-column>
          <el-table-column prop="condition_desc_vn" label="Mô tả điều kiện sử dụng (Tiếng việt)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.condition_desc_vn)" />
            </template>
          </el-table-column>
          <el-table-column prop="general_desc_vn" label="Mô tả chung (Tiếng việt)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.general_desc_vn)" />
            </template>
          </el-table-column>
          <el-table-column prop="discount_desc_en" label="Mô tả về chiết khấu (Tiếng anh)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.discount_desc_en)" />
            </template>
          </el-table-column>
          <el-table-column prop="payment_desc_en" label="Mô tả phương thức thanh toán (Tiếng anh)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.payment_desc_en)" />
            </template>
          </el-table-column>
          <el-table-column prop="condition_desc_en" label="Mô tả điều kiện sử dụng (Tiếng anh)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.condition_desc_en)" />
            </template>
          </el-table-column>
          <el-table-column prop="general_desc_en" label="Mô tả chung (Tiếng anh)" align="center">
            <template slot-scope="scope">
              <div v-html="splitNewLine(scope.row.general_desc_en)" />
            </template>
          </el-table-column>
          <el-table-column label="Ngày tạo" align="center">
            <template slot-scope="scope">
              {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="total_releases" label="Số lượng đã phát hành" align="center">
            <template slot-scope="scope">
              {{ scope.row.total_releases ? formatNumber(scope.row.total_releases) : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="total_used" label="Số lượng sử dụng" align="center">
            <template slot-scope="scope">
              {{ scope.row.total_used ? formatNumber(scope.row.total_used) : 0 }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </el-dialog>
</template>
<script>

// import VoucherResource from '@/api/voucher/voucher'
import { create_signature_hub } from '@/utils/create-signnature'
import { formatNumber, convertDateTime } from '@/utils/convert'
import { STATUS_VOUCHER } from '@/utils/constant'
// const voucherResource = new VoucherResource()

export default {
  name: 'DialogDetailVoucher',
  components: {
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
      statusVoucher: STATUS_VOUCHER,
      providerList: []
    }
  },
  watch: {
    objectData(value) {
      console.log('...................', value)
      if (value) {
        this.tableData = [{ ...value }]

        console.log('this.tableData', this.tableData)
      }
    }
  },
  methods: {
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
    splitNewLine(text) {
      return text.split('\n').join('<br>')
    },
    formatNumber,
    convertDateTime,
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

