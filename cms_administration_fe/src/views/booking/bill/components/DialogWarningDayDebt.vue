<template>
  <el-dialog
    title="Booking của bạn sẽ bị khóa sau 2 ngày. Đề nghị thu hồi các công nợ sau"
    width="50%"
    :before-close="onCloseDialog"
    :visible.sync="showDialog"
  >
    <div class="filter-container">
      <table class="table table-bordered" style="vertical-align: center">
        <thead>
          <tr>
            <th class="text-center col-3 vertical-middle" style="min-width: 180px">ID Bill</th>
            <th scope="col" class="text-center" style="min-width: 180px">Ngày công nợ</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in listData" :key="key" style="background: rgb(248, 192, 192);">

            <td scope="col" class=" text-center">
              {{ item.id_general_bill_detail }}
            </td>
            <td scope="col" class=" text-center ">
              {{ getDayDebt(item.booked) }}
            </td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseDialog">Hủy bỏ</el-button>

      </span>
    </div>

  </el-dialog>

</template>

<script>
import { formatNumber, formatDate } from '@/utils/convert'

export default {
  name: 'DialogWarningBookingDayDebt',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
      value: false
    },
    listData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {

  },
  created() {
  },
  methods: {

    onCloseDialog() {
      this.$emit('clickCloseDialog', { dialog: false })
    },
    getDayDebt(booked) {
      const day_debt = booked?.map(i => i.day_debt).sort((a, b) => new Date(a) - new Date(b))
      // Lấy phần tử đầu tiên (gần nhất)
      const nearestDebt = day_debt[0]
      console.log('nearestDebt_____________________', nearestDebt)
      return this.formatDate(nearestDebt)
    },
    formatNumber, formatDate
  }
}
</script>
<style lang="scss" scoped>

.border-1 {
  border: 1px solid #ccc;
  border-radius: 15px;
}

.pb-10 {
  padding-bottom: 10px;
}

.p-10 {
  padding: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.table>tbody>tr>th {
  vertical-align: middle !important;
}

.vertical-middle {
  vertical-align: middle !important;
}
</style>
