<template>
  <el-row class="app-container list-shop">
    <el-row v-if="show_list">
      <el-row class="list-shop__header">
        <el-col :sm="12">
          <h3>{{ ('Danh sách nhà cung cấp') }}</h3>
        </el-col>
        <!-- <el-col :sm="12">
            <div class="text-right">
              <el-button v-if="is_write" type="primary" @click="onShowDialogCreate">{{ ('add') }}</el-button>
            </div>
          </el-col> -->
      </el-row>
      <el-row class="text-right" :sm="24" style="padding-bottom:10px; margin-top:10px; justify-content: flex-end; display: flex;">
        <el-col :sm="24" align="right">
          <div class="grid-content bg-purple" style="padding-bottom: 10px">
            <label style="font-weight:unset">{{ ('Lọc theo ngày tạo') }}: </label>
            <el-date-picker
              v-model="value1"
              style="margin: 0 5px"
              type="datetimerange"
              align="right"
              unlink-panels
              :range-separator="('to')"
              :start-placeholder="('Bắt đầu')"
              :end-placeholder="('Kết thúc')"
              format="dd-MM-yyyy HH:mm:ss"
              :default-time="defaultTime"
              :picker-options="pickerOptions"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="text-right" :sm="24" :gutter="10" style="margin-bottom: 15px; margin-left: -5px; justify-content: flex-end; display: flex;">
        <el-col>
          <el-input v-model="listQuery.q" :placeholder="('Lọc theo tên')" icon="search" />
        </el-col>
        <!-- <el-select v-model="filter_id" :placeholder="('search')" style="padding: 0 7px">
            <el-option
              v-for="type in filters"
              :key="type.id"
              :label="type.name"
              :value="type.key"
            />
          </el-select> -->
        <el-col>
          <el-select
            v-model="filter_id"
          >
            <el-option
              v-for="filter in filters"
              :key="filter.id"
              :label="filter.name"
              :value="filter.id"
            />
          </el-select>
        </el-col>
        <el-col>
          <el-button type="primary" @click="onSearchPress">{{ ('Tìm kiếm') }}</el-button>
        </el-col>
        <el-col>
          <el-select
            v-model="filter_sort_id"
          >
            <el-option
              v-for="filter in filters_sort"
              :key="filter.id"
              :label="filter.name"
              :value="filter.id"
            />
          </el-select>
        </el-col>
        <!-- <el-col> -->
        <el-col>
          <el-button :loading="loadingTable" icon="el-icon-refresh" @click="onResetSearch">{{ ('Làm mới') }}</el-button>
          <el-button v-if="is_write" type="primary" @click="onShowDialogCreate">{{ ('Thêm') }}</el-button>
          <el-button type="warning" @click="onStatisticalPress">{{ ('Xem thống kê') }}</el-button>
        </el-col>
        <!-- </el-col> -->
      </el-row>
      <el-row class="list-shop__data">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            :label="('id')"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDialogDetail(scope.row)">{{ `#${scope.row.id}` }}</el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="supplier_code"
            :label="('supplier_code')"
            align="center"
          /> -->
          <el-table-column
            prop="name"
            :label="('Tên nhà cung cấp')"
            align="center"
          />
          <!-- <el-table-column
            :label="('logo')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="demonstration">{{ scope.row.contain }}</span>
              <el-link type="primary" @click="onShowDialogShopDetail(scope.row.logo)">
                <el-image
                  v-if="scope.row.logo"
                  :src="scope.row.logo"
                  :fit="contain"
                />
              </el-link>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
              :label="('logo_menu')"
              align="center"
            >
              <template slot-scope="scope">
                <span class="demonstration">{{ scope.row.contain }}</span>
                <el-image
                  v-if="scope.row.logo_menu"
                  :src="scope.row.logo_menu"
                  :fit="contain"
                />
              </template>
            </el-table-column> -->
          <!-- <el-table-column
              prop="name"
              :label="('shop_name')"
              align="center"
            /> -->
          <el-table-column
            prop="phone"
            :label="('Kênh bán hàng')"
            align="center"
          />
          <el-table-column
            prop="ma_so_thue"
            :label="('Tổng số đơn hàng')"
            align="center"
          />
          <el-table-column
            :label="('Doanh thu(VNĐ)')"
            align="center"
          >
            <template slot-scope="scope">
              <p>{{ moment(scope.row.createdAt).format('DD/MM/YYYY') }}</p>
            </template>
          </el-table-column>
          <el-table-column
            :label="('Giá vốn(VNĐ)')"
            align="center"
          >
            <template slot-scope="scope">
              <p>{{ (scope.row.type === 1) ? ('ca_nhan') : ('doanh_nghiep') }}</p>
            </template>
          </el-table-column>
          <el-table-column
            :label="('Lợi nhuận gộp(VNĐ)')"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ (scope.row.active === 1) ? ('Hoạt động') : ('Tạm dừng') }}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column v-if="is_delete || is_edit" :label="('action')" align="center">
            <template slot-scope="scope">
              <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
              <el-button v-if="is_delete" type="danger" icon="el-icon-delete" circle @click="onDeleteShop(scope.row)" />
            </template>
          </el-table-column> -->
        </el-table>
      </el-row>
      <el-row class="list-shop__footer">
        <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="onGetListShop" />
      </el-row>
      <!--    <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" :province-data="provinces" @onClickDialogShop="handleClickDialogShop" />-->
      <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" @onClickDialogShop="handleClickDialogShop" />
      <detail-shop :dialog-visible="showDialogShopDetail" :url="url_image" @onClickButtonDialogDetail="handleClickButtonDialogDetail" />
      <detail :dialog-visible="showDialogDetail" :shop-id="shopId" @onClickButtonDialogDetail="handClickButtonDetail" />
    </el-row>
    <!-- <screen-detail :is-new="isNew" :show="show_detail" :shop-id="shopId" @onBackHandler="onBackScreen" @handlerEvent="handlerEvent"/> -->
    <!-- <screen-contract :show="show_contract" /> -->
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import ShopResource from '@/api/manage_supplier/statistical'
import DialogFormShop from '@/views/shop/components/DialogFormShop'
import DetailShop from '@/views/shop/components/DetailShop'
// import ScreenDetail from './components/ScreenDetail.vue'
// import ScreenContract from './components/ScreenContract.vue'
// import Detail from '@/views/products/components/Detail'
import Detail from '@/views/shop/components/Detail'
import { getAcountInfo } from '@/utils/auth'
import moment from 'moment'
const shopResource = new ShopResource()
const defaultQuery = {
  page: 1,
  limit: 10
}
function getStartDate(start) {
  const hour = start.getHours()
  const minutes = start.getMinutes()
  const second = start.getSeconds()
  const timestamp = hour * 60 * 60 * 1000 + minutes * 60 * 1000 + second * 1000
  let start_date = start.getTime() - timestamp
  start_date = new Date(start_date)
  return start_date
}

function getEndDate(end) {
  const hour = end.getHours()
  const minutes = end.getMinutes()
  const second = end.getSeconds()
  const timestamp = hour * 60 * 60 * 1000 + minutes * 60 * 1000 + second * 1000
  let end_date =
      end.getTime() -
      timestamp +
      23 * 60 * 60 * 1000 +
      59 * 60 * 1000 +
      59 * 1000
  end_date = new Date(end_date)
  return end_date
}

export default {
  name: 'ShopStatisticalView',
  // components: { Detail, DialogFormShop, Pagination, DetailShop, ScreenDetail, ScreenContract },
  components: { Detail, DialogFormShop, Pagination, DetailShop },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      filters: [
        {
          id: 1,
          name: ('Tìm kiếm theo tên')
        },
        {
          id: 2,
          name: ('Tìm kiếm theo mã')
        },
        {
          id: 3,
          name: ('Tìm kiếm theo số điện thoại')
        },
        {
          id: 4,
          name: ('Tìm kiếm theo mã số thuế')
        }
      ],
      filter_id: 1,
      filters_sort: [
        {
          id: 1,
          name: ('Tất cả')
        },
        {
          id: 2,
          name: ('Đã kích hoạt')
        },
        {
          id: 3,
          name: ('Đã ẩn')
        },
        {
          id: 4,
          name: ('Từ mới đến cũ')
        }
      ],
      filter_sort_id: 1,
      data: [],
      listQuery: Object.assign({}, defaultQuery),
      tableData: [],
      total: 0,
      loadingTable: false,
      objectShop: {},
      isAdd: true,
      onShowDialog: false,
      // provinces: [],
      url_image: '',
      contain: 'contain',
      showDialogShopDetail: false,
      showDialogDetail: false,
      // shopID: 0,
      show_list: true,
      show_detail: false,
      shopId: 0,
      isNew: false,
      show_contract: false,
      pickerOptions: {
        shortcuts: [
          {
            text: ('Tuần trước'),
            onClick(picker) {
              const end = getEndDate(new Date())
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              start = getStartDate(start)
              console.log(start, end)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: ('Tháng trước'),
            onClick(picker) {
              const end = getEndDate(new Date())
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              start = getStartDate(start)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: ('3 tháng trước'),
            onClick(picker) {
              const end = getEndDate(new Date())
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              start = getStartDate(start)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: ('Từ đầu đến giờ'),
            onClick(picker) {
              picker.$emit('pick', [0, 0])
            }
          }
        ]
      },
      value1: ''
    }
  },
  watch: {
    filter_sort_id(val) {
      this.listQuery.filter_id = val
      this.onGetListShop()
    },
    value1(value) {
      let start = value[0]
      let end = value[1]
      start = new Date(start).getTime()
      end = new Date(end).getTime()
      this.listQuery.date_create_from = start
      this.listQuery.date_create_to = end
      this.onGetListShop()
    }
  },
  created() {
    // this.onGetListShop()
    // this.onGetProvinceList()
  },
  methods: {
    onStatisticalPress() { // xem thong ke

    },
    onBackScreen(obj) {
      const { reload } = obj
      console.log('..........reload screen ', obj)
      if (reload) {
        this.listQuery.page = 1
        this.tableData = []
        this.onGetListShop()
      }
      this.show_detail = false
      this.show_list = true
    },
    handlerEvent(obj) {
      const { show_contract } = obj
      this.show_contract = show_contract
    },
    onShowDialogDetail(row) {
      this.shopId = row.id
      // // this.showDialogDetail = true
      // this.isNew = false
      // this.show_detail = true
      // this.show_list = false
      this.$router.push({ path: `/supplier?shop_id=${this.shopId}` })
    },
    handClickButtonDetail(object) {
      this.showDialogDetail = object.dialog
      this.shopId = 0
      if (object.reload) {
        this.onGetListShop()
      }
    },
    onShowDialogShopDetail(url) {
      this.url_image = url
      this.showDialogShopDetail = true
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogShopDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
      }
    },
    onShowDialogCreate() {
      // this.isAdd = true
      // this.onShowDialog = true
      // this.objectShop = {}
      this.shopId = 0
      this.isNew = true
      this.show_detail = true
      this.show_list = false
      this.$router.push({ path: `/supplier` })
    },
    onShowDialogEdit(row) {
      this.isAdd = false
      this.onShowDialog = true
      this.objectShop = Object.assign({}, row)
    },
    handleClickDialogShop(object) {
      console.log('--------------------------------dialog', object)
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetListShop()
      }
    },
    onGetListShop() {
      this.loadingTable = true
      shopResource.shopList(this.listQuery).then(response => {
        this.loadingTable = false
        const { error, list, total } = response
        if (error === 0) {
          this.tableData = [...list]
          this.data = [...list]
          this.total = total || 0
        } else {
          this.tableData = []
          this.data = []
        }
      }).catch(error => {
        this.loadingTable = false
        this.$message.error(`${('error')}, ${error}`)
      })
    },
    onDeleteShop(row) {
      this.$confirm(('Bạn có chắc chắn muốn xóa shop').format(row.name)).then(_ => {
        shopResource.deleteShop(row.id).then(response => {
          if (response.error === 0) {
            this.$message.success(('Xóa shop thành công?').format(row.name))
            this.onGetListShop()
          } else {
            this.$message.error(response.mgs)
          }
        })
      }).catch(_ => {})
    },
    onSearchPress() {
      this.loadingTable = true
      let { q } = this.listQuery
      q = q ? q.trim() : ''
      if (!q.length) {
        this.loadingTable = false
        this.tableData = [...this.data]
      } else {
        this.listQuery.filter_search_id = this.filter_id
        this.onGetListShop()
      }
    },
    onResetSearch() {
      // this.listQuery = Object.assign({}, defaultQuery)
      this.onGetListShop()
    },
    moment
  }
}
</script>

  <style lang="scss" scoped>
  .search-wrapper{
    margin-bottom: 10px;
  }
  .row_item{
    margin-right: 3px;
  }
  .el-col-24 {
    width: fit-content !important;
  }
  </style>
