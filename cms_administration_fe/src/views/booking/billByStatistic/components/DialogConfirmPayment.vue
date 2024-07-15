<template>
  <el-dialog title="Xác nhận thanh toán" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form ref="ruleForm" :rules="rules" :model="postForm">
      <el-form-item prop="method_payment" label="Hình thức thanh toán">
        <el-select v-model="postForm.method_payment" style="width: 100%;" placeholder="Hình thức thanh toán">
          <el-option v-for="pay in payments" :key="pay.id" :label="pay.name" :value="pay.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Ngân hàng">
        <el-input v-model="postForm.name_bank" placeholder="Ngân hàng" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm()">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BookingPaxResource from '@/api/BookingPax'
import { getAcountInfo } from '@/utils/auth'
import { validateText } from '@/utils/validate'

const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'ConfirmPayment',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        method_payment: [{ validator: (rule, _, callback) => validateText(rule, this.postForm.method_payment, callback, 'Hình thức thanh toán'), trigger: 'change' }]
      },
      postForm: {
        admin_id: getAcountInfo().id
      },
      payments: [
        { id: 0, name: 'Chuyển khoản' },
        { id: 1, name: 'Tiền mặt' },
        { id: 2, name: 'Chuyển khoản / tiền mặt' },
        { id: 3, name: 'Thanh toán bằng code payment' }
        // { id: 4, name: 'Đã hủy' }
      ],
      loadingSubmit: false
    }
  },
  watch: {
    objectData(value) {
      if (value) {
        this.postForm.general_bill_id = value.general_bill_id
      }
    }

  },
  methods: {
    onSubmitForm() {
      this.$refs.ruleForm.validate((validate) => {
        if (validate) {
          this.handleSubmit()
        }
      })
    },
    handleSubmit() {
      this.loadingSubmit = true
      console.log('post form...............', this.postForm)
      if (this.postForm.method_payment === 0) {
        bookingPaxResource.detailBill({ bill_id: this.postForm.general_bill_id }).then(async(res) => {
          if (res.error_code === 0) {
            const data = res.data
            let hio_by_golfer = []
            if (data.pax_id > 0) {
              const arrayOfLists = data?.golfers?.map(obj => obj.insurance_id_pax) || []
              hio_by_golfer = [].concat(...arrayOfLists)
            }
            this.postForm.data = { pax_id: data.pax_id, service: data.service, general_bill_id: data.general_bill_id }
            this.postForm.hio_by_golfer = hio_by_golfer
            bookingPaxResource.updatePaymentServiceChildStatistic(this.postForm).then(res => {
              if (res.error_code === 0) {
                // bookingPaxResource.confirmPaymentBill(this.postForm).then(res => {
                //   if (res.error_code === 0) {
                this.$emit('onClickButtonConfirmPayment', { dialog: false, reload: true })
                this.$message.success('Xác nhận thành công.')
                this.resetDataModal()
              } else {
                this.$message.error(res.error_msg)
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingSubmit = false
        })
      } else {
        if (this.postForm.method_payment === 3) { // || this.postForm.method_payment === 4
          bookingPaxResource.detailBill({ bill_id: this.postForm.general_bill_id }).then(res => {
            if (res.error_code === 0) {
              const data = res.data
              let hio_by_golfer = []
              if (data.pax_id > 0) {
                const arrayOfLists = data?.golfers?.map(obj => obj.insurance_id_pax) || []
                hio_by_golfer = [].concat(...arrayOfLists)
              }
              this.postForm.data = { pax_id: data.pax_id, service: data.service, general_bill_id: data.general_bill_id }
              this.postForm.hio_by_golfer = hio_by_golfer
              bookingPaxResource.confirmPaymentBill(this.postForm).then(async(res) => {
                if (res.error_code === 0) {
                  bookingPaxResource.updatePaymentBillCodePaymnet(this.postForm).then(res => {
                    if (res.error_code === 0) {
                      this.$emit('onClickButtonConfirmPayment', { dialog: false, reload: true })
                      this.$message.success('Xác nhận thành công.')
                      this.resetDataModal()
                    } else {
                      this.$message.error(res.error_msg)
                    }
                  }).finally(() => {
                    this.loadingSubmit = false
                  })
                } else {
                  this.$message.error(res.error_msg)
                  this.loadingSubmit = false
                }
              })
            } else {
              this.$message.error(res.error_msg)
            }
          }).finally(() => {
            this.loadingSubmit = false
          })
        } else {
          bookingPaxResource.confirmPaymentBill(this.postForm).then(async(res) => {
            if (res.error_code === 0) {
              this.$emit('onClickButtonConfirmPayment', { dialog: false, reload: true })
              this.$message.success('Xác nhận thành công.')
              this.resetDataModal()
            } else {
              this.$message.error(res.error_msg)
            }
          }).finally(() => {
            this.loadingSubmit = false
          })
        }
      }
    },
    handleClose() {
      this.$emit('onClickButtonConfirmPayment', { dialog: false, reload: false })
      this.resetDataModal()
    },
    resetDataModal() {
      this.postForm = {
        admin_id: getAcountInfo().id
      }
    }
  }
}
</script>

<style scoped>
.mt-10 {
  margin-bottom: 10px
}
</style>
