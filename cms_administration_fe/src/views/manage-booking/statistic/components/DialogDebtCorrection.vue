<template>
  <el-dialog title="Sửa công nợ" :visible.sync="showDialog" :before-close="handleClose">
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
      <el-form-item>
        <el-button type="primary" :loading="loadingSubmit" @click="onSubmit">Lưu</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { convertDateTime } from '@/utils/convert'
import StatisticResource from '@/api/manage-booking/statistic'
const statisticResource = new StatisticResource()
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
      postForm: {},
      debt: '',
      loadingSubmit: false
    }
  },
  watch: {
    objectDebt(val) {
      this.postForm.date_played = convertDateTime(val.date_played)
      // this.debt = convertDate(val.day_debt)
      // this.postForm.day_debt = convertDate(val.day_debt)
    }
  },
  methods: {
    onSubmit() {
      const body = {
        booked_id: this.objectDebt.id,
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
          this.$emit('onClickDialog', { dialog: false, reload: true })
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    handleClose() {
      this.$emit('onClickDialog', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
