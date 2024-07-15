<template>
  <div class="p-10">
    <h6>Danh sách công nợ ADMIN</h6>
    <br>
    <el-table :data="dataTable" border>
      <el-table-column align="center" label="STT" type="index" :index="handleIndexMethod" width="50" />
      <el-table-column align="center" prop="name" label="Tên Admin" />
      <el-table-column align="center" prop="phone" label="SĐT" />
      <el-table-column align="center" prop="total_money" label="Tổng tiền chưa thanh toán">
        <template slot-scope="scope">
          <span>{{ formatNumberOrNull(scope.row.total_money) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Danh sách chi tiết">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detailDayDebt(scope.row)">Xem</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Danh sách Booking chưa thanh toán" :visible.sync="showDialog" :before-close="handleClose">
      <el-table :data="listBookedDialog" border width="75%">
        <el-table-column align="center" label="STT" type="index" width="50" />
        <el-table-column align="center" prop="code_booking" label="Code Booking" />
        <el-table-column align="center" prop="name_out_system" label="Tên khách hàng" />
        <el-table-column align="center" label="Ngày công nợ">
          <template slot-scope="scope">
            <span>{{ convertDate(scope.row.day_debt) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Giá tiền">
          <template slot-scope="scope">
            <span>{{ formatNumberOrNull(scope.row.price_booking) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div></template>

<script>
import StatisticResource from '@/api/manage-booking/statistic'
import { formatNumberOrNull, convertDateTimeSecond, convertDate } from '@/utils/convert'

const statisticResource = new StatisticResource()

export default {
  name: 'DayDebt',
  data() {
    return {
      dataTable: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      totalMoney: 0,
      count: 0,
      showDialog: false,
      listBookedDialog: []
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    formatNumberOrNull, convertDateTimeSecond, convertDate,
    onGetList() {
      this.loading = true
      statisticResource.dayDebt().then(res => {
        if (res.error_code === 0) {
          console.log(res.data)
          this.dataTable = res.data.data
          console.log(this.dataTable)
          this.count = res.data.count
          let money = 0
          res.data.data.map(item => {
            money += item.total_money
          })
          this.totalMoney = money
        }
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    detailDayDebt(row) {
      this.listBookedDialog = row.data
      this.showDialog = true
      console.log(row)
    },
    handleClose() {
      this.listBookedDialog = []
      this.showDialog = false
    }
  }
}
</script>
