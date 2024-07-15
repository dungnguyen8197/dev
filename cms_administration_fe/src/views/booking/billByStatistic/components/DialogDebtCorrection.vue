<template>
  <el-dialog title="Sửa công nợ" :visible.sync="showDialog" :before-close="handleClose">
    <div
      v-loading="loadingDialog"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-form :model="postForm">
        <el-form-item label="Ngày chơi" prop="date_played">
          <el-input v-model="postForm.date_played" disabled />
        </el-form-item>
        <el-form-item>
          <label style="width: 100%;">Ngày công nợ</label>
          <el-date-picker
            v-model="debt"
            type="date"
            placeholder="Pick a day"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item v-if="listBooked.length > 0">
          <label style="width: 100%;">Chọn Golfer</label>
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">Check all</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="postForm.booked_ids" @change="handleCheckedBookedChange">
            <el-row style="width: 100%;">
              <el-col v-for="booked in listBooked" :key="booked.id" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-checkbox :disabled="booked.type_purchase !== 0" :label="booked.id">
                  {{ booked.user_id == -1 ? `(OUT) ` + booked.fullname : `VID${booked.user_id} - ` + booked.fullname }} - {{ booked.day_debt }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loadingSubmit" @click="onSubmit">Lưu</el-button>
        </el-form-item>
      </el-form>
    </div></el-dialog>
</template>

<script>
import { convertDateTime, formatDate } from '@/utils/convert'
import StatisticResource from '@/api/manage-booking/statistic'
import BookingPaxResource from '@/api/BookingPax'

const statisticResource = new StatisticResource()
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogDebtCorrection',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    objectDebt: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      postForm: {
        booked_ids: []
      },
      debt: '',
      loadingSubmit: false,
      loadingDialog: false,
      checkAll: false,
      isIndeterminate: true,
      listBooked: []
    }
  },
  watch: {
    objectDebt(val) {
      if (val) {
        console.log('val__________________', val)
        this.onGetDetail(val.general_bill_id)
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.postForm.booked_ids.length < 1) {
        this.$message.warning('Vui lòng chọn golfer.')
        return
      }
      const body = {
        booked_id: this.postForm.booked_ids,
        day_debt: this.debt
      }
      console.log(body)
      this.loadingSubmit = true
      statisticResource.editDebt(body).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.debt = ''
          this.clearData()
          this.$emit('onClickDialog', { dialog: false, reload: true })
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    async onGetDetail(id) {
      this.loadingDialog = true
      await bookingPaxResource.detailBill({ bill_id: id }).then(res => {
        if (res.error_code === 0) {
          const data = res.data
          console.log(data)
          this.postForm.date_played = convertDateTime(data?.pax?.date_played)

          this.listBooked = data?.golfers.map(value => value.booked)
            ?.map(i => ({ id: i.id, fullname: i.name_out_system, user_id: i.user_id, type_purchase: i.type_purchase, day_debt: i.day_debt ? 'Ngày công nợ:' + formatDate(i.day_debt, 'DD/MM/YYYY') : null }))
          console.log('   this.listBooked ____________', this.listBooked)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    handleCheckAllChange(val) {
      this.postForm.booked_ids = val ? this.listBooked.filter(i => i.type_purchase === 0).map(i => i.id) : []
      this.isIndeterminate = false
      console.log(' this.postForm.booked_ids_________', this.postForm.booked_ids)
    },
    handleCheckedBookedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listBooked.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listBooked.length
    },
    clearData() {
      this.debt = ''
      this.listBooked = []
      this.postForm = {
        booked_ids: []
      }
      this.checkAll = false
      this.isIndeterminate = true
    },
    handleClose() {
      this.clearData()
      this.$emit('onClickDialog', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
