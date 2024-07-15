<template>
  <el-row style="margin:20px;">
    <el-row>
      <el-col :sm="18">
        <h3 style="margin: 0; width: 100%; padding: 10px">Quản lý order App</h3>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <div class="filter-container">
      <el-row class="filter-container">
        <el-col :sm="4" class="mr-10">
          <label>Tìm kiếm theo vID:</label>
          <el-select
            v-model="golferID"
            filterable
            remote
            placeholder="Nhập vID"
            :remote-method="onSearchGolfer"
            style="width: 100%"
          >
            <el-option
              v-for="item in listGolfer"
              :key="item._id"
              :label="item.fullname + ' - ' + 'mã gốc ' + (item.id) + '-' + 'mã hiển thị ' + (item.id_display)"
              :value="item._id"
            />
          </el-select>
        </el-col>
        <el-col :sm="4" class="mr-10">
          <label>Tìm kiếm theo Admin xử lý:</label>
          <el-select
            v-model="adminModel"
            class="w-100"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="Tìm kiếm Admin"
            :remote-method="onSearchAdmin"
            :loading="loadingSearchAdmin"
          >
            <el-option v-for="admin in admins" :key="admin.id" :label="admin.name" :value="admin.id" />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-button icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onGetList()">Tìm kiếm</el-button>
      </el-row>
    </div>
    <div class="clearfix-10" />
    <el-row class="data-table-content table-responsive">
      <table v-loading="loadingTable" class="table table-bordered" style="font-size: 12px">
        <thead>
          <tr>
            <th scope="col" class="text-center vertical-middle">vID khách đặt</th>
            <th scope="col" class="text-center vertical-middle">Sân</th>
            <th scope="col" class="text-center vertical-middle">Số người chơi</th>
            <th scope="col" class="text-center vertical-middle">Ngày chơi</th>
            <th scope="col" class="text-center vertical-middle">Thời điểm chơi</th>
            <th scope="col" class="text-center vertical-middle">Ngày đặt</th>
            <th scope="col" class="text-center vertical-middle">HIO</th>
            <th scope="col" class="text-center vertical-middle">Loại order</th>
            <th scope="col" class="text-center vertical-middle">Trạng thái</th>
            <th scope="col" class="text-center vertical-middle">Admin xử lý</th>
            <th scope="col" class="text-center vertical-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tableData"
            :key="index"
          >
            <td class="text-center">
              vID{{ item.user_id }}
            </td>
            <td class="text-center">
              {{ item?.facility?.title }}
            </td>
            <td class="text-center">
              {{ item.total_user ? item.total_user : '' }}
            </td>
            <td class="text-center">
              <template v-if="item.type === false">
                {{ convertDate(item.date_played) }}
              </template>
              <template v-else>
                {{ convertDateTimeSecond(item.date_played) }}
              </template>
            </td>
            <td class="text-center">
              <template v-if="item.step_select === 1">
                Sáng
              </template>
              <template v-else-if="item.step_select === 2">
                Chiều
              </template>
              <template v-if="item.step_select === 3">
                Giờ đèn
              </template>
            </td>
            <td class="text-center">
              <!--              {{ convertDateTimeSecond2(item.created_at) }}-->
              {{ convertDateTimeSecond2(item.created_at, 'DD/MM/YYYY', true) }}
            </td>
            <td class="text-center">
              <template v-if="item.type_hio === 1">
                D100
              </template>
              <template v-else-if="item.type_hio === 2">
                D200
              </template>
              <template v-else-if="item.type_hio === 3">
                D20
              </template>
              <template v-else-if="item.type_hio === 5">
                D500
              </template>
              <template v-else />
            </td>
            <td class="text-center">
              <el-tag v-if="item.type === false">
                Đặt sân nhanh
              </el-tag>
              <el-tag v-else type="success">
                Đặt sân teetime
              </el-tag>
            </td>
            <td class="text-center">
              {{ item.is_done === 0 ? 'Chưa xác nhận' : 'Đã xác nhận' }}
            </td>
            <td class="text-center">
              {{ item.admin != null ? item.admin.name : '' }}
            </td>
            <td class="text-center">
              <el-button
                v-if="item.is_done === 0"
                :loading="loadingSubmit"
                class="filter-item"
                type="primary"
                @click="handleConfirm(item)"
              >
                Xác nhận
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-row>
    <el-row class="list-shop__footer">
      <pagination
        v-show="total > query.limit"
        :total="total"
        :limit.sync="query.limit"
        :page.sync="query.page"
        @pagination="onGetList"
      />
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { convertDate, convertDateTimeSecond, convertDateTimeSecond2, formatDate } from '@/utils/convert'
import { getAcountInfo } from '@/utils/auth'
import BookingPaxResource from '@/api/BookingPax'
const bookingPaxResource = new BookingPaxResource()
import ListGolferResource from '@/api/membership/golfer'
const listGolferResources = new ListGolferResource()
import AccountResource from '@/api/account'
const adminResource = new AccountResource()
export default {
  name: 'DataUser',
  components: {
    Pagination
  },
  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1
      },
      total: 0,
      loadingExportExcel: false,
      loadingSubmit: false,
      golferID: null,
      adminModel: null,
      listGolfer: [],
      admins: [],
      loadingSearchAdmin: false
    }
  },
  watch: {
    golferID(value) {
      if (value === null || value === undefined) {
        this.query.user_id = null
      } else {
        this.query.user_id = value
      }
    },
    adminModel(value) {
      if (value === null || value === undefined) {
        this.query.admin_id = null
      } else {
        this.query.admin_id = value
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    convertDateTimeSecond2,
    convertDate,
    convertDateTimeSecond,
    formatDate,
    onSearchAdmin(keyword) {
      adminResource.Lists({ name: keyword }).then(res => {
        console.log('res...............', res)
        this.admins = res?.data?.data || []
        console.log('this.admins...............', this.admins)
      }).finally(() => {
        this.loadingSearchAdmin = false
      })
    },
    onGetList() {
      this.loadingTable = true
      bookingPaxResource.listRequestOrder(this.query).then(response => {
        if (response.error_code === 0) {
          console.log('==============', response)
          const result = response.data
          this.tableData = result.data
          this.total = result.total
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : (this.query.page - 1) * this.query.limit + index + 1
    },
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.golferID = []
      this.adminModel = []
      this.onGetList()
    },
    onSearchGolfer(query) {
      if (query !== '') {
        this.loadingSearch = true
        listGolferResources.searchGolfer({ q: query }).then((response) => {
          if (response.error_code === 0) {
            this.loadingSearch = true
            this.listGolfer = response.data
          }
        })
      } else {
        this.listGolfer = []
      }
    },
    handleConfirm(row) {
      this.loadingSubmit = true
      const admin = getAcountInfo()
      console.log(row)
      const body = {
        admin_id: admin.id,
        id: row.id
      }
      bookingPaxResource.updateStatusConfirmRequest(body, row.id).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.onGetList()
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật!')
        }
      }).catch(_ => {
        this.loadingSubmit = false
        this.onGetList()
      })
    }

  }
}
</script>

<style scoped>
.mr-10 {
  margin-right: 10px;
}
</style>
