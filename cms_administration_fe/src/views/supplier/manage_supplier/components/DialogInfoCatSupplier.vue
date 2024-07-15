<template>
  <el-dialog
    :style="{ top: offsetTop + 'px' }"
    style="right: 0px"
    :visible.sync="showDetail"
    width="100%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="dialog-show-info"
  >
    <h3 style="color: black">Danh sách hạng mục cung cấp</h3>
    <div id="brand-table-id" style="margin-top: 20px">
      <el-table
        v-loading="loading"
        :data="tableData"
        align="center"
        border
        style="width: 100%"
      >
        <!-- <el-table-column prop="stt" label="STT" width="60" align="center" /> -->
        <el-table-column
          prop="id"
          label="Mã danh mục"
          align="center"
          width="150px"
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên danh mục" align="center">
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="count_product" label="Sản phẩm" align="center">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              style="color: #4ca1d5"
              @click="handleDialogInfoProduct(scope.row.id)"
            >{{ "Xem chi tiết " + (`(` + scope.row.count_product + `)`) }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="getListOrder"
        />
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import ManageSupplierResource from '@/api/manage_supplier/supplier'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
const supplierResource = new ManageSupplierResource()

export default {
  name: 'DialogInfoCatSupplier',
  components: {
    Pagination
  },
  props: {
    idCat: {
      type: Number,
      default: 0
    },
    showDetail: {
      type: Boolean,
      default: false
    },
    offsetTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialog: {
        titleName: 'Thông tin hạng mục'
      },
      tableData: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  mounted() {
    this.getListOrder()
    console.log('objectData', this.objectData)
  },
  methods: {
    formatNumber,
    handleClose() {
      this.$emit('closeDialog')
    },
    handleImageError(event) {
      event.showImage = false
    },
    getListOrder() {
      this.loading = true
      supplierResource
        .supplier_list_category({ supplier_id: this.idCat })
        .then((res) => {
          console.log(res, '............list or')
          this.tableData = res.data
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('Lỗi khi lấy dữ liệu hạng mục')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDialogInfoProduct(idHM) {
      this.$router.push({
        name: `Manage Products`,
        params: {
          idCat: this.idCat,
          idHM: idHM
        }
      })
    }
  }
}
</script>

<style scoped>
.el-dialog__wrapper {
  position: absolute;
}
::v-deep .el-dialog {
  margin-top: 0px !important;
  margin-bottom: 180px;
}
.flex-item-dialog {
  /* margin: 10px 10px 10px 20px; */
  width: 24%;
}
.font-lable {
  font-weight: bold;
  color: black;
  font-size: 15px;
}
.font-value {
  font-weight: 400;
}
::v-deep body.el-popup-parent--hidden {
  overflow: hidden !important;
  padding-right: 0px !important;
}
</style>

<!-- <style>
  .el-popup-parent--hidden {
    padding-right: 0px !important;
  }
  </style> -->
