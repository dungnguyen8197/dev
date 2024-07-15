<template>
  <el-dialog
    title="Thông tin chi tiết giao dịch"
    :visible.sync="showDialog"
    width="90%"
    :before-close="handleClose"
  >
    <el-row style="margin-top: 20px;">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col" class="text-center">STT</th>
            <th scope="col" class="text-center">Pax id</th>
            <th scope="col" class="text-center">Thời gian tạo</th>
            <th scope="col" class="text-center">Người được thanh toán</th>
            <th scope="col" class="text-center">Booked id</th>
            <th scope="col" class="text-center">Price</th>
          </tr>
        </thead>
        <tbody v-if="tableData.length > 0">
          <template v-for="(value) in tableData">
            <template>
              <tr v-for="(item, index) in value.list_user_pay.slice(0, 1)" :key="index">
                <td class="text-center" :rowspan="value.list_user_pay.length">{{ 1 }}</td>
                <td class="text-center" :rowspan="value.list_user_pay.length">{{ value.pax_id }}</td>
                <td class="text-center" :rowspan="value.list_user_pay.length">{{ value.created_at }}</td>
                <td class="text-center">{{ item.user_id }}</td>
                <td class="text-center">{{ item.id_booked }}</td>
                <td class="text-center">{{ formatNumber(item.price) }}</td>
              </tr>

              <tr v-for="(item, index) in value.list_user_pay.slice(1)" :key="index + 1000">
                <td class="text-center">{{ item.user_id }}</td>
                <td class="text-center">{{ item.id_booked }}</td>
                <td class="text-center">{{ formatNumber(item.price) }}</td>
              </tr>

            </template>
          </template>

        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="15" class="text-center">
              <i>Không tìm thấy dữ liệu</i> <i class="el-icon-warning" />
            </td>
          </tr>
        </tbody>
      </table>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Đóng</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { formatDate, formatNumber } from '@/utils/convert'

export default {
  name: 'DialogDetailTransaction',
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
      tableData: [
      ],
      query: {
        page: 1, limit: 10
      }
    }
  },
  computed: {
  },
  watch: {
    objectData(value) {
      const { list_user_pay, pax_id } = value.dataProvider
      const created_at = value.created_at
      this.tableData = [{ list_user_pay, pax_id, created_at }]
    }
  },
  methods: {
    handleClose() {
      this.query = {}
      this.$emit('onClickButtonDialog', false)
    },
    formatDate, formatNumber
  }

}
</script>

<style scoped>
.mr-10 {
    margin-right: 10px;
}
</style>
