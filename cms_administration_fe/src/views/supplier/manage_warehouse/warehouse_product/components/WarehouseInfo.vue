<template>
  <div id="warehouse-info">
    <el-row class="list-shop__header">
      <!-- <el-col :sm="12">
          <h3>{{ ('home') }}</h3>
        </el-col> -->
      <!-- <el-row style="display: ruby;"> -->
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex">
          <p style="margin-right: 15px" @click="onBack">
            <i class="el-icon-back" />
          </p>
          <h3 style="color: #3c3d40; font-size: 20px">
            Thông tin xuất nhập hàng
          </h3>
        </div>

      </div>
    </el-row>
    <el-row
      style="
        border-radius: 10px;
        border-width: 1px;
        background-color: #d9d9d9;
        min-height: 150px;
        height: auto;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
      "
    >
      <div>
        <el-col :span="8" :xs="24" style="border-right: 1px solid #8E8E8E;">
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              padding: 20px;
            "
          >
            <div>
              <!-- <img
                style="width: 94px; height: 142px; border: 1px solid #3c3d40"
                :src="infostatistics.image"
                class="image"
              > -->
              <el-image :src="infostatistics.image" style="width: 130px;  height: 147px; border: 1px solid #3c3d40" />

            </div>
            <div style="padding-left: 80px">
              <div>
                <label
                  for="idSupplier"
                  style="margin-bottom: 5px; display: block"
                >
                  <span
                    style="color: #000; font-weight: normal"
                  >Mã sản phẩm</span>
                </label>
                <el-input
                  id="idSupplier"
                  v-model="infostatistics.id"
                  class="custom-input"
                  placeholder="Please input"
                  readonly
                />
              </div>
              <div style="padding-top: 20px">
                <label
                  for="nameSupplier"
                  style="margin-bottom: 5px; display: block"
                >
                  <span
                    style="color: #000; font-weight: normal"
                  >Tên sản phẩm</span>
                </label>
                <el-input
                  id="nameSupplier"
                  v-model="infostatistics.name"
                  class="custom-input"
                  placeholder="Please input"
                  readonly
                />
              </div>
            </div>
          </div>
          <div>
            <label
              for="nameSupplier"
              style="margin-left: 25px; margin-top: 8px; display: block"
            >
              <span
                style="color: #000; font-weight: normal"
              >ẢNH SẢN PHẨM</span>
            </label>
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              height: 150px;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
            "
          >
            <div>
              <h4 style="text-align: center;">Số lượng trong kho</h4>
              <h4 class="h4">{{ infostatistics.total_inventory }}</h4>
            </div>
            <div>
              <h4 style="text-align: center;">Tổng số lượng đã nhập</h4>
              <h4 class="h4">{{ infostatistics.total_number_import }}</h4>
            </div>
            <div>
              <h4 style="text-align: center;">Tổng số lượng đã xuất</h4>
              <h4 class="h4">{{ infostatistics.total_number_export }}</h4>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <div style="border-bottom: 2px solid #E3E3E3 ;padding-top:30px" />
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-top: 40px;margin-bottom:20px">
      <div>
        <el-input v-model="listQuery.q" style="width: 160px;" type="text" :rows="2" placeholder="Nhập để tìm kiếm">
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <el-select v-model="filterSearch" placeholder="Tìm kiếm" style="width: 200px; margin-left: 10px;">
          <el-option v-for="item in searchOption" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">Tìm kiếm</el-button>
      </div>
      <div style="display: flex;">
        <el-date-picker
          v-model="dateRange"
          style="width: 300px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          @change="handleChangeDateRange"
        />
        <el-select v-model="listQuery.shop_id" placeholder="Nhà cung cấp" style="width: 140px; margin-left: 10px;" @change="onSelectShop">
          <el-option v-for="item in optionShop" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button
          style="margin-left: 10px"
          :loading="loadingHome"
          icon="el-icon-refresh"
          @click="resetFilter"
        >{{ "Refresh" }}</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="Nhập kho" name="first" />
      <el-tab-pane label="Xuất kho" name="second" />
      <el-row class="list-product__data">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            :label="activeName === 'first' ? 'Ngày nhập' : 'Ngày xuất'"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{ activeName === 'first' ? scope.row.import_time : scope.row.import_time }}
            </template>
          </el-table-column>
          <el-table-column
            :label="activeName === 'first' ? 'Mã phiếu nhập' : 'Mã phiếu xuất'"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              {{ activeName === 'first' ? scope.row.id : scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column
            :label="activeName === 'first' ? 'Tên phiếu nhập' : 'ID bill'"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              {{ activeName === 'first' ? scope.row.name : (scope.row.delivery_id ? 'DL' + scope.row.delivery_id : '') }}
            </template>
          </el-table-column>
          <el-table-column
            :label="activeName === 'first' ? 'Mã hàng NCC' : 'Tên phiếu xuất'"
            align="center"
            width="170"
          >
            <template slot-scope="scope">
              {{ activeName === 'first' ? infostatistics.shopIdCode : scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column :label="('Thuộc tính 1')" align="center">
            <template slot-scope="scope">
              {{ scope.row.param_first }}
            </template>
          </el-table-column>
          <el-table-column :label="('Thuộc tính 2')" align="center">
            <template slot-scope="scope">{{
              scope.row.param_second
            }}</template>
          </el-table-column>
          <el-table-column
            v-if="activeName === 'first'"
            label="Nhà cung cấp"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.shop_name ? scope.row.shop_name : ""
            }}</template>
          </el-table-column>
          <el-table-column :label="('Số lượng')" align="center">
            <template slot-scope="scope">{{ scope.row.origin_number }}</template>

          </el-table-column>
          <el-table-column :label="('Đơn giá')" align="center">
            <template slot-scope="scope">{{ formatNumber(scope.row.cost) }}đ</template>
          </el-table-column>
          <el-table-column :label="('Thành tiền')" align="center">
            <template slot-scope="scope">{{ formatNumber(scope.row.price) }}đ</template>
          </el-table-column>
          <el-table-column
            :label="activeName === 'first' ? 'Người nhập' : 'Người xuất'"
            align="center"
          >
            <template slot-scope="scope">
              {{ activeName === 'first' ? scope.row?.account?.name : scope.row?.account?.name }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="list-shop__footer">
        <pagination
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="getListWareHouseProduct"
        />
      </el-row>
    </el-tabs>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { formatNumber } from '@/utils/convert'

const warehouseApi = new WarehouseResource()
export default {
  components: {
    Pagination
  },
  data() {
    return {
      f: '',
      dateRange: '',
      listQuery: {
        page: 1,
        limit: 10,
        q: '',
        type: 0
      },
      filterSearch: 1,
      searchOption: [
        { id: 1, name: 'Tìm theo mã phiếu' },
        { id: 2, name: 'Tìm theo tên phiếu' }
      ],
      loading: false,
      tableData: [],
      total: 0,
      showDialogAddReceivedNote: false,
      loadingHome: false,
      shopIdCode: null,
      idSupplier: '',
      nameSupplier: '',
      options: [
        {
          value: 'Option1',
          label: 'Option1'
        },
        {
          value: 'Option2',
          label: 'Option2'
        }
      ],
      value: '',
      activeName: 'first',
      loadingTable: false,
      infostatistics: {
        total_inventory: 0,
        total_number_import: 0,
        total_number_export: 0,
        name: '',
        image: '',
        id: null,
        shopIdCode: null
      },
      optionShop: []

    }
  },
  created() {
    this.infostatistics.id = this.$route.params.data
    console.log(this.infostatistics.id, 'this.infostatistics.id')
  },
  mounted() {
    this.listAllShop()
    this.getListWareHouseProduct()
    this.getListWareHouseStatistics()
    console.log(this.infostatistics.id = this.$route.params.data, 'this.infostatistics.id')
  },
  methods: {
    onBack() {
      window.history.back()
    },
    formatNumber,
    handleTabClick(tab) {
      this.listQuery.type = tab.name === 'first' ? 0 : 1
      this.getListWareHouseProduct()
    },
    getListWareHouseProduct() {
      this.loadingTable = true

      const query = {
        product_id: this.infostatistics.id,
        type: this.listQuery.type,
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        type_search: this.listQuery.type_search,
        q: this.listQuery.q,
        shop_id: this.listQuery.shop_id,
        date_from: this.listQuery.date_from,
        date_to: this.listQuery.date_to
      }
      warehouseApi.detail_warehouse_list_product(query).then(res => {
        if (res.error === 0) {
          if (this.listQuery.page === 1) { this.total = res.total }

          this.tableData = res.data
          console.log(this.tableData, '11111111111111111111111')
          // this.total = res.meta.total
        } else {
          this.tableData = []
        }
      }).catch(error => {
        this.loadingTable = false
        this.$message.error(`Có lỗi xảy ra : ${error}`)
      }).finally(() => {
        this.loadingTable = false
      })
    },
    getListWareHouseStatistics() {
      const query = {
        product_id: this.infostatistics.id
      }
      warehouseApi.detail_warehouse_product_statistical(query).then(res => {
        if (res.error === 0) {
          console.log(res, 'hihihihihih')
          this.infostatistics = {
            ...this.infostatistics,
            total_inventory: res.data.total_inventory,
            total_number_import: res.data.total_number_import,
            total_number_export: res.data.total_number_export,
            name: res.data.name,
            image: res.data.thumb,
            id: res.data.id,
            shopIdCode: res.data.product_code_shop
          }
        } else {
          this.infostatistics = {}
        }
      }).catch(error => {
        this.$message.error(`Có lỗi xảy ra : ${error}`)
      })
    },
    onSearch() {
      this.listQuery.page = 1
      this.listQuery.type_search = this.filterSearch
      this.getListWareHouseProduct()
    },
    onSelectShop() {
      this.listQuery.page = 1
      this.getListWareHouseProduct()
    },
    handleChangeDateRange(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.date_from = startDate.getTime()
      this.listQuery.date_to = endDate.getTime()
      this.getListWareHouseProduct()
    },
    resetFilter() {
      this.dateRange = ''
      this.searchString = ''
      this.listQuery.page = 1
      this.listQuery.date_from = ''
      this.listQuery.date_to = ''

      this.listQuery.shop_id = ''
      this.filterSearch = 2
      this.listQuery.q = ''
      this.listQuery.type_search = 2
      this.getListWareHouseProduct()
    },
    listAllShop() {
      warehouseApi.list_shop_all().then(res => {
        const { error, list } = res
        if (error === 0) {
          this.optionShop = list.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          throw new Error('Không lấy được danh sách cửa hàng')
        }
      }).catch(err => {
        console.log('..........listShopAll ', err)
        this.$message.error(err.message)
      })
    }
  }

}
</script>
<style scoped>
#warehouse-info {
  margin: 20px 30px 50px 30px;
}
.h4 {
  text-align: center;
  color: #0075ff;
}
.input {
  display: flex;
  justify-content: end;
}
.custom-input ::v-deep .el-input__inner {
  width: 140%;
}
::v-deep .el-range-editor--medium .el-range-separator {
  width: 20px !important;
}
@media (max-width: 1800px) {
  .custom-input ::v-deep .el-input__inner {
    width: 100%;
  }
  .input, .h4 {
    text-align: center;
}

@media (max-width: 768px) {
  .custom-input .el-input__inner {
    width: 100%;
  }
  .input, .h4 {
    text-align: center;
  }
  .input {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .el-col {
    margin-bottom: 20px;
  }
  .el-col:last-child {
    margin-bottom: 0;
  }
}
@media (max-width: 1000px) {
  .custom-input .el-input__inner, .custom-input ::v-deep .el-input__inner {
    width: 100%;
  }
  .input, .h4 {
    text-align: center;
  }
  .input {
    justify-content: center;
  }
  .el-col {
    border-right: none;
  }
}
}
</style>
