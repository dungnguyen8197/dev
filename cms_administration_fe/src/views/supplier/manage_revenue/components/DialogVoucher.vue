<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDetail"
    :before-close="handleClose"
    width="70%"
  >
    <div style="display: flex; flex-direction: row; justify-content: start;">
      <div style="border: 1px solid gainsboro; border-radius: 12px; padding: 20px; width: 500px">
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Mã voucher: <span style="font-size: medium; font-weight: 400;">{{ dataObject.voucher_code }}</span></h6>
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Tên voucher: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.name }}</span></h6>
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Giới hạn tối đa: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.limit_max > 0 ? voucherObject.limit_max : 'Không giới hạn' }}</span></h6>
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Ngày áp dụng: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.from_date }}</span></h6>
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Số lần sử dụng cho khách: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.count_use_per_golfer }}</span></h6>
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Mô tả: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.description }}</span></h6>
        <!-- <p style="font-size: medium; font-weight: 400; white-space: pre-line;">{{ voucherObject.description }}</p> -->
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Số lần sử dụng cả chương trình: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.max_use }}</span></h6>
      </div>

      <div style="margin-left: 15px; border: 1px solid gainsboro; border-radius: 12px; padding: 20px; width: 400px">
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Loại voucher: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.types?.desc }}</span></h6>
        <h6 style="font-size: 16px; font-weight: bold; color: black;">Loại mã: <span style="font-size: medium; font-weight: 400;">{{ voucherObject.types?.name }}</span></h6>

        <h6 style="font-size: 16px; font-weight: bold; color: black;">Trạng thái: <el-tag :type="(voucherObject.types?.active) ? 'success' : 'danger'">{{ voucherObject.types?.active ? "Hoạt động" : "Ngừng hoạt động" }}</el-tag></h6>

        <h6 style="font-size: 16px; font-weight: bold; color: black;">Giá trị: <span style="font-size: medium; font-weight: 400;">{{ `${voucherObject.value}${voucherObject.types.don_vi_tinh}` }}</span></h6>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import ManageRevenueResource from '@/api/manage_supplier/revenue'
const manageRevenueResource = new ManageRevenueResource()

export default {
  name: 'DialogVoucher',
  props: {
    showDetail: {
      type: Boolean,
      default: false
    },
    dataObject: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      voucherObject: {},
      dialog: {
        titleName: 'Chi tiết voucher'
      }
    }
  },
  mounted() {
    manageRevenueResource.voucherDetail({ id: this.dataObject.discount_id }).then(res => {
      const { error, data } = res
      console.log('..........voucher detail ', JSON.stringify(data))
      if (error === 0) {
        this.voucherObject = data
      }
    })
    // console.log('dataObject', this.dataObject)
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog')
    }
  }
}
</script>
