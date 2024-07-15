<template>
  <el-dialog :visible.sync="showDialog" :before-close="handleClose" width="70%" title="Thông tin ngày báo công nợ sản phẩm khác và shop">
    <div
      v-loading="loadingDialog"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-form :model="postForm">
        <el-form-item>
          <label style="width: 100%;">Ngày công nợ</label>
          <el-date-picker
            v-model="debt"
            type="date"
            placeholder="Ngày công nợ"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item v-if="list_service.length > 0">
          <label style="width: 100%;">Chọn dịch vụ</label>
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">Check all</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="postForm.check_list" @change="handleCheckedBookedChange">
            <el-row style="width: 100%;">
              <el-col v-for="service in list_service" :key="service.id" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-checkbox :disabled="service.type_purchase !== 0" :label="service.id">
                  {{ service.shop_id ? 'SHOP' : service.label }} - Ngày công nợ: {{ service.date_debt }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClose">Đóng</el-button>
          <el-button type="primary" :loading="loadingSubmit" @click="onSubmit">Lưu</el-button>
        </el-form-item>
      </el-form>
    </div></el-dialog>
</template>

<script>
import moment from 'moment'
import { isEmpty } from '@/utils/validate'
import BookingPaxResource from '@/api/BookingPax'

const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogDebtCorrection',
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
      postForm: {
        check_list: []
      },
      debt: '',
      loadingSubmit: false,
      loadingDialog: false,
      checkAll: false,
      isIndeterminate: true,
      list_service: []
    }
  },
  watch: {
    objectData(value) {
      if (!isEmpty(value)) {
        this.id_bill = value.general_bill_id
        this.onGetDetail(value.general_bill_id)
      }
    }
  },
  methods: {
    async onGetDetail(id) {
      this.loadingDialog = true
      await bookingPaxResource.detailBill({ bill_id: id }).then(async(res) => {
        if (res.error_code === 0) {
          const list_other = res.data?.service?.filter(t => t.type === 'other_service')
          const list_shop = res.data?.service?.filter(t => t.type === 'shop')
          if (list_other.length > 0) {
            const list = list_other?.map((item, i) => ({
              id: i + 1,
              type: item.type,
              other_service_id: item.type === 'other_service' ? item?.bookingOutside?.id : null,
              service: item.type === 'other_service' ? 'Sản phẩm khác' : item.type === 'hio' ? 'Bảo hiểm' : 'Shop',
              label: item.type === 'other_service' ? '(Sản phẩm khác) ' + item?.name_other_service : item.type === 'shop' ? item?.name_product : '',
              date_debt: item?.bookingOutside?.date_debt ? moment(item?.bookingOutside?.date_debt).format('DD/MM/yyyy') : '',
              type_purchase: item?.bookingOutside?.status === 0 || item?.bookingOutside?.status === 2 ? 0 : 1
            }))
            this.list_service = [...list]
          }
          if (list_shop.length > 0) {
            const shop = {
              id: this.list_service.length + 1,
              type: 'shop',
              service: 'Shop',
              label: '',
              shop_id: list_shop[0]?.delivery_bill_id || 1,
              date_debt: list_shop[0]?.date_debt ? moment(list_shop[0]?.date_debt).format('DD/MM/yyyy') : '',
              type_purchase: list_shop.some(t => t.status_payment === 0) ? 0 : 1
            }
            this.list_service.push(shop)
          }
          console.log('..........list_service.......', this.list_service)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    onSubmit() {
      if (this.list_service.length > 0) {
        if (isEmpty(this.debt)) {
          this.$message.warning('Vui lòng chọn ngày công nợ.')
          return
        }
        if (this.postForm?.check_list.length === 0) {
          this.$message.warning('Vui lòng chọn dịch vụ.')
          return
        }
        this.loadingSubmit = true
        const body = this.list_service.filter(t => this.postForm?.check_list.includes(t.id)).map(v => ({ ...v, date_debt: this.debt }))
        bookingPaxResource.updateDateDebt({ list_service: body, id_general_bill_detail: this.id_bill }).then(res => {
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
      }
    },
    handleClose() {
      this.list_service = []
      this.id_bill = ''
      this.clearData()
      this.$emit('handleCloseDialog', { dialog: false, reload: false })
    },
    handleCheckAllChange(val) {
      console.log('val.............', val)
      this.postForm.check_list = val ? this.list_service.filter(i => i.type_purchase === 0).map(i => i.id) : []
      this.isIndeterminate = false
      console.log(' this.postForm.check_list_________', this.postForm.check_list)
    },
    handleCheckedBookedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.list_service.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list_service.length
    },
    clearData() {
      this.debt = ''
      this.list_service = []
      this.postForm = {
        check_list: []
      }
      this.checkAll = false
      this.isIndeterminate = true
    }
  }
}
</script>

<style scoped>

</style>
