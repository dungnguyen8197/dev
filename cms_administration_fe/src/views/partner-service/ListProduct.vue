<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH SẢN PHẨM ĐỐI TÁC</h3>
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-row>
        <el-col class="mb-10">
          <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAdd">
            Thêm mới
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-search-money">
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.partner_id"
              class="w-100"
              filterable
              remote
              clearable
              prop="partner_id"
              placeholder="Tên đối tác"
              :remote-method="onSearchPartner"
              :loading="loadingSearchPartner"
            >
              <el-option
                v-for="partner in partnerList"
                :key="partner.id"
                :label="partner.name"
                :value="partner.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.name"
              placeholder="Nhập tên"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="8" :md="4">
          <div class="grid-content bg-purple-light">
            <el-select
              v-model="query.status"
              filterable
              clearable
              style="width: 100%"
              remote
              reserve-keyword
              :multiple-limit="1"
              placeholder="Trạng thái"
            >
              <el-option
                v-for="status in statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col class="search-money mt-10" :sm="6" :md="3">
          <div class="grid-content bg-purple-light">
            <el-input
              v-model="query.price"
              placeholder="Nhập giá"
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col :sm="12" :md="8" class="mr-10 mt-10">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column label="Tên đối tác" align="center">
          <template slot-scope="scope">
            {{ scope.row.partner ? scope.row.partner.name : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên sản phẩm" align="center" />
        <el-table-column prop="description" label="Mô tả" width="350" align="center">
          <template slot-scope="scope">
            <div v-html="splitNewLine(scope.row.description)" />
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status != 0" :type="statusType[scope.row.status].type">{{ statusType[scope.row.status].label }}</el-tag>
            <el-tag v-else type="info">Chuẩn bị bán</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="image"
          label="Hình ảnh"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              v-if="row.image"
              style="width: 100px; height: auto"
              :src="row.image"
            />
            <span v-else>Không có ảnh</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="Giá" align="center">
          <template slot-scope="scope">
            {{ scope.row.price ? formatNumber(scope.row.price) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at ? convertDateTime(scope.row.created_at) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              class="mb-10"
              size="small"
              :title="`Sửa`"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            />
            <el-button
              class="mb-10"
              size="small"
              :title="`Xóa`"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-device__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetList"
        />
        <dialog-product
          :show-dialog="showDialog"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import PartnerServiceResource from '@/api/partner-service/partner-service'
import { formatNumber, convertDateTime } from '@/utils/convert'
import { STATUS_PRODUCT_PARTNER, ARRAY_STATUS_PRODUCT_PARTNER } from '@/utils/constant'
import DialogProduct from './components/DialogProduct.vue'
import { create_signature_hub } from '@/utils/create-signnature'
import { trim_string_object } from '@/utils/trim-string-object'

const partnerServiceResource = new PartnerServiceResource()

export default {
  name: 'ListProduct',
  components: {
    Pagination,
    DialogProduct
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
      statusType: STATUS_PRODUCT_PARTNER,
      statusList: ARRAY_STATUS_PRODUCT_PARTNER,
      loadingSearchPartner: false,
      partnerList: [],
      showDialog: false,
      objectData: {},
      isAdd: true
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.onGetList()
    // this.timer = setInterval(this.onGetList, 1000 * 20)
  },
  beforeDestroy() {
    // clearInterval(this.timer)
  },
  methods: {
    async onGetList() {
      this.loadingTable = true

      await this.trim_string_object(this.query)
      const signature = await this.create_signature_hub(this.query)
      this.query = { ...this.query, signature }

      partnerServiceResource.partner_product_management(this.query).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },

    onSearchPartner(keyword) {
      this.loadingSearchPartner = true
      partnerServiceResource.list({ name: keyword.trim() }).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.partnerList = data.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingSearchPartner = false
      })
    },

    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10 })
      this.dateRange = ''
      this.onGetList()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleDelete(row) {
      this.$confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${row.name}`).then(async(_) => {
        let body = { product_id: row.id }
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        partnerServiceResource.remove_product(body).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.data)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    handleClose() {
      this.showDialog = false
      this.onGetList()
    },
    handleAdd() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },
    handleUpdate(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, row)
    },
    splitNewLine(text) {
      return text.split('\n').join('<br>')
    },
    formatNumber,
    convertDateTime,
    create_signature_hub,
    trim_string_object
  }
}
</script>

<style scoped>
.mr-10 {
    margin-right: 10px;
}

.mb-10 {
    margin-bottom: 10px;
}

.mt-10 {
    margin-top: 10px;
}

.filter-search {
  float: right;
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
}
.filter-container .filter-item{
  margin-bottom: 0;
}
.search-money{
  padding-right: 10px;
}
.search-money:last-child{
  padding-right: 0;
}
.row-search-money{
  margin-bottom: 10px;
}
.cell .el-tag{
  margin: 5px;
}
.clearfix-10 {
  height: 10px;
  clear: both;
}
.clearfix-20 {
  height: 20px;
  clear: both;
}
.mt-10 {
  margin-top: 10px;
}
</style>
