<template>
  <el-row class="reservation_booking_content">
    <el-row>
      <el-col :sm="6" class="pr-10">
        <label>Tìm kiếm: </label>
        <el-input v-model="listQuery.user_id" class="w-100" placeholder="Ex: VID1, BK123, 0977949494" />
      </el-col>
      <el-col :sm="6" class="pr-10">
        <el-row>
          <el-col :sm="12" class="pr-10">
            <label>Loại đặt chỗ: </label>
            <el-select v-model="listQuery.type" class="w-100" placeholder="Loại đặt chỗ">
              <el-option
                v-for="item in arrayTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :sm="12">
            <label>Trạng thái: </label>
            <el-select v-model="listQuery.status" class="w-100" placeholder="Trạng thái">
              <el-option
                v-for="item in arrayStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <!--            <el-col :sm="6">-->
      <!--                <label>Thời gian yêu cầu đặt chỗ: </label>-->
      <!--                <div class="block">-->
      <!--                    <el-date-picker-->
      <!--                        class="w-100"-->
      <!--                        v-model="dateRange"-->
      <!--                        type="daterange"-->
      <!--                        align="right"-->
      <!--                        range-separator="to"-->
      <!--                        start-placeholder="Ngày bắt đầu"-->
      <!--                        end-placeholder="Ngày kết thúc"-->
      <!--                        :picker-options="pickerOptions">-->
      <!--                    </el-date-picker>-->
      <!--                </div>-->
      <!--            </el-col>-->
      <el-col :sm="12">
        <label>&nbsp;</label>
        <div class="w-100 text-right mt-20">
          <el-button type="primary" icon="el-icon-search" round @click="onSearch">Tìm kiếm</el-button>
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
// import { pickerOptions } from '../../../utils/dateRangOptions'
// import { arrayTypes, arrayStatus } from '../../../utils/v10/reservationSelect'
import { convertDate } from '@/utils/convert'
export default {
  name: 'BoxSearch',
  data() {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        is_host_user: 1
      },
      pickerOptions: {
        // shortcuts: pickerOptions
      },
      arrayTypes: [],
      arrayStatus: []
      // dateRange: []
    }
  },
  watch: {
    // dateRange(value) {
    //     if (value.length > 0) {
    //         this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD');
    //         this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD');
    //     } else {
    //         this.listQuery.date_start = null;
    //         this.listQuery.date_end = null;
    //     }
    // },
  },
  methods: {
    onSearch() {
      const self = this
      self.$emit('handleSearchForm', self.listQuery)
    },
    onReset() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1, is_host_user: 1 })
      // this.dateRange = [];
      this.$emit('handleSearchForm', this.listQuery)
    },
    convertDate
  }
}
</script>

<style lang="scss" scoped>
    .reservation_booking_content {
        .pr-10 {
            padding-right: 10px;
        }
    }
</style>
