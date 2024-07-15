<template>
  <el-dialog :visible.sync="showDialog" :before-close="handleClose" width="500px">
    <table style="width: 100%; text-align: center">
      <thead>
        <th style="width: 50px;">#</th>
        <th>Tên</th>
        <th>Phụ phí</th>
        <th>Giá nhập phụ phí</th>
      </thead>
      <tbody>
        <tr v-for="(b, index) in booked" :key="index">
          <td style="width: 50px;">{{ index + 1 }}</td>
          <td>{{ b.golfer ? b.golfer.fullname : b.name_out_system }}</td>
          <td />
          <td>
            <input v-model="body.surcharge_entry_price[index].surcharge_entry_price" class="surcharge-revenue" type="number" placeholder="Nhập giá phụ phí">
          </td>
        </tr>
      </tbody>
    </table>
    <div style="text-align:right; margin-top: 20px;">
      <el-button @click="handleClose">Đóng</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onsubmitInput">Lưu</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ExpenseResource from '@/api/manage-booking/expense'
const expenseResource = new ExpenseResource()
export default {
  name: 'DialogInputPrice',
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
      body: {
        pax_id: '',
        surcharge_entry_price: []
      }
    }
  },
  watch: {
    objectData(val) {
      if (val) {
        this.body.pax_id = val.id
        this.booked = val.booked
        const user = []
        this.booked.map(function(booked) {
          console.log(booked, '--surcharge_entry_price')
          const dataUser = {
            booked_id: booked.id,
            surcharge_entry_price: booked.surcharge_entry_price
          }
          user.push(dataUser)
        })
        this.body.surcharge_entry_price = user
      }
    }
  },
  methods: {
    onsubmitInput() {
      this.loadingSubmit = true
      expenseResource.inputPrice(this.body).then(res => {
        console.log('--------------------')
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.$emit('clickButtonDialogInput', { dialog: false, reload: true })
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    handleClose() {
      this.$emit('clickButtonDialogInput', { dialog: false, reload: false })
    }
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
