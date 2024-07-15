<template>
  <el-dialog :visible.sync="showDialog" :before-close="handleClose" width="70%" title="Thông tin nhà cung cấp">
    <div
      v-loading="loadingDialog"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-row class="data-table-content table-responsive">
        <table class="table-golfer border table-bordered w-100">
          <thead>
            <th class="p-10 text-center word-break" style="width: 80px;">#</th>
            <th class="p-10 text-center word-break" style="min-width: 180px;">Tên dịch vụ</th>
            <th class="p-10 text-center word-break" style="min-width: 180px;">Mã hàng</th>
            <th class="p-10 text-center word-break" style="min-width: 180px;">Nhà cung cấp</th>
            <th class="p-10 text-center word-break" style="min-width: 180px;">Giá nhập</th>
            <th class="p-10 text-center word-break" style="min-width: 180px;">Xác nhận TT NCC</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list_service" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">
                {{ item.service }}
              </td>
              <td class="text-center">
                {{ item.label }}
              </td>
              <td class="text-center">
                <el-select
                  v-if="item.id == 1 || item.type=='other_service'"
                  v-model="list_service[index].supplier_id"
                  size="small"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="Tìm kiếm NCC"
                  :loading="loadingSearchSupplier"
                >
                  <el-option
                    v-for="Supplier in suppliers"
                    :key="Supplier.id"
                    :label="Supplier.name"
                    :value="Supplier.id"
                  />
                </el-select>
                <span v-else-if="item.type=='shop'">{{ item.supplier_id }}</span>
              </td>
              <td class="text-center">
                <el-input-number v-if="item.id == 1 || item.type=='other_service' " v-model="list_service[index].source_price" size="small" placeholder="Giá nhập" />
                <span v-else-if="item.type=='shop'">{{ list_service[index].source_price ? formatNumber(list_service[index].source_price) : '' }}</span>
              </td>
              <td v-if="data_pax && data_pax.is_purchase_supplier == 0 && !comfirm_done" class="text-center">
                <el-button v-if="item.id == 1" type="primary" size="small" @click="comfirmTT()">Xác nhận TT</el-button>
              </td>
              <td v-else class="text-center">
                <el-tag v-if="item.id == 1" type="success">Đã cập nhật thanh toán nhà cung</el-tag>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>
      <div style="text-align:right; margin-top: 20px;">
        <el-button @click="handleClose">Đóng</el-button>
        <el-button type="primary" :loading="loadingSubmit" @click="onsubmitInput">Lưu</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import { isEmpty } from '@/utils/validate'
import BookingPaxResource from '@/api/BookingPax'
import SearchResource from '@/api/search-api'
import { formatNumber } from '@/utils/convert'
const searchResource = new SearchResource()
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogUpdateSupplier',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      booked: [],
      loadingSubmit: false,
      // formRequest: {},
      list_service: [],
      suppliers: [],
      loadingSearchSupplier: false,
      pax_id: '',
      id_bill: '',
      data_pax: {},
      comfirm_done: false,
      loadingDialog: false
    }
  },
  watch: {
    objectData(value) {
      if (!isEmpty(value)) {
        this.id_bill = value.general_bill_id
        this.onGetDetail(value.general_bill_id)
        this.onGetListService()
      }
    }
  },
  methods: {
    async onGetDetail(id) {
      this.loadingDialog = true
      await bookingPaxResource.detailBill({ bill_id: id }).then(async(res) => {
        if (res.error_code === 0) {
          this.data_pax = res.data?.pax
          console.log('this.pax........', this.data_pax)
          console.log('res.data?.service..........', res.data?.service)
          const list = res.data?.service?.map((item, i) => ({
            id: i + 2,
            type: item.type,
            service: item.type === 'other_service' ? 'Sản phẩm khác' : item.type === 'hio' ? 'Bảo hiểm' : 'Shop',
            label: item.type === 'other_service' ? item?.name_other_service : item.type === 'hio' ? 'BH' + item?.hio_id : item?.name_product,
            supplier_id: item.type === 'other_service' ? item?.bookingOutside?.supplier_id : item.type === 'shop' ? item?.product?.shop_name : '',
            pax_id: null,
            other_service_id: item.type === 'other_service' ? item?.bookingOutside?.id : null,
            source_price: item.type === 'other_service' ? item?.bookingOutside?.original_amount : item.type === 'shop' ? item?.cost : ''
          }))
          if (this.data_pax) {
            this.list_service = [{
              id: 1,
              service: 'Booking',
              label: '',
              supplier_id: res.data?.pax?.supplier_id,
              pax_id: res.data?.pax_id, other_service_id: null,
              source_price: this.data_pax.number_hole === 9 ? this.data_pax.source_price_9 : this.data_pax.number_hole === 27 ? this.data_pax.source_price_27 : this.data_pax.source_price_18
            },
            ...list]
          } else {
            this.list_service = [...list]
          }
          console.log('..........list_service.......', this.list_service)
          this.pax_id = res.data?.pax_id
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    onsubmitInput() {
      this.loadingSubmit = true
      bookingPaxResource.updateSuplierBill({ list_service: this.list_service, pax_id: this.pax_id, general_bill_id: this.id_bill }).then(res => {
        console.log('--------------------')
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    onGetListService() {
      searchResource.listSupplier().then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.suppliers = data
        }
      })
    },
    comfirmTT() {
      const body = {
        pax_id: this.data_pax?.id,
        type: 0,
        general_bill_id: this.id_bill
      }
      this.$confirm('Bạn có chắc muốn xác nhận thanh toán NCC cho bill này?').then(_ => {
        bookingPaxResource.confirmExpense(body).then(res => {
          const { error_code, error_msg } = res
          if (error_code === 0) {
            this.comfirm_done = true
            this.$message.success(error_msg)
            this.onGetLists()
          } else {
            this.$message.error(error_msg)
          }
        })
      })
    },
    handleClose() {
      this.$emit('handleCloseDialog', { dialog: false, reload: false })
    },
    formatNumber
  }
}
</script>

<style scoped>
td, th {
  padding: 8px;
}
thead, tr{
  border: 1px solid #dddddd;
  border-left: none;
  border-right: none;
}
.surcharge-revenue{
  border: 1px solid #ddd;
  padding: 10px;
}
.surcharge-revenue:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
}
</style>
