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
          <el-table-column label="Mô tả" align="center">
            <template slot-scope="scope">
              <div v-html="scope.row.description ? splitNewLine(scope.row.description.discount_desc_vi) : ''" />
            </template>
          </el-table-column>
          <el-table-column label="Nhà cung cấp" align="center">
            <template slot-scope="scope">
              {{ scope.row.provider_info ? scope.row.provider_info.name : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Ngày tạo" align="center">
            <template slot-scope="scope">
              {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status != 0" :type="statusVoucher[scope.row.status].type">{{ statusVoucher[scope.row.status].label }}</el-tag>
              <el-tag v-else type="warning">Chờ</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Loại voucher" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.voucher_type" type="primary">{{ voucherType[scope.row.voucher_type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Loại hình khuyến mãi" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.discount_type" type="primary">{{ discountType[scope.row.discount_type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Giá trị chiết khấu" align="center">
            <template slot-scope="scope">
              {{ scope.row.discount_amount ? formatNumber(scope.row.discount_amount) : 0 }}
            </template>
          </el-table-column>
          <el-table-column label="Giá trị tối đa" align="center">
            <template slot-scope="scope">
              {{ scope.row.max_discount ? formatNumber(scope.row.max_discount) : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="Giá bán" align="center">
            <template slot-scope="scope">
              {{ scope.row.price ? formatNumber(scope.row.price) : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="max_use" label="Số lượng sử dụng" align="center">
            <template slot-scope="scope">
              {{ scope.row.max_use ? formatNumber(scope.row.max_use) : 0 }}
            </template>
          </el-table-column>
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
          <el-table-column prop="screen" label="Màn hình sử dụng" align="center" />
          <el-table-column prop="total_required_condition" label="Tổng điều kiện bắt buộc" align="center" />
          <el-table-column prop="total_optional_condition" label="Tổng điều kiện không bắt buộc" align="center" />
          <el-table-column prop="effect_time" label="Thời gian hiệu lực" align="center" />
          <el-table-column label="Hình thức phân phối" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.allocation_type" type="primary">{{ allocationType[scope.row.allocation_type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="max_owned" label="Số lượng tối đa có thể sở hữu" align="center" />
          <el-table-column prop="quantity_releases" label="Số lượng voucher phát hành" align="center">
            <template slot-scope="scope">
              {{ scope.row.quantity_releases ? formatNumber(scope.row.quantity_releases) : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="admin_id" label="ID admin tạo" align="center" />
          <el-table-column prop="total_releases" label="Tổng đã phân phối" align="center">
            <template slot-scope="scope">
              {{ scope.row.total_releases ? formatNumber(scope.row.total_releases) : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="total_used" label="Tổng sử dụng" align="center">
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
import { STATUS_VOUCHER, ARRAY_STATUS_VOUCHER, DISCOUNT_TYPE, ALLOCATION_TYPE, ARRAY_ALLOCATION_TYPE, VOUCHER_TYPE, ARRAY_VOUCHER_TYPE } from '@/utils/constant'
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
      statusList: ARRAY_STATUS_VOUCHER,
      discountType: DISCOUNT_TYPE,
      allocationType: ALLOCATION_TYPE,
      allocationList: ARRAY_ALLOCATION_TYPE,
      voucherType: VOUCHER_TYPE,
      voucherList: ARRAY_VOUCHER_TYPE,
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

