<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">DANH SÁCH GIAN HÀNG</h3>
      </el-col>
    </el-row>

    <el-row>
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
        <el-table-column label="STT" width="50" align="center" type="index" :index="handleIndexMethod" />
        <el-table-column label="Tên thương nhân" align="center">
          <el-table-column prop="name" label="Tên thương nhân" align="center" />
          <el-table-column prop="address" label="Địa chỉ" align="center" />
          <el-table-column prop="mst" label="Mã số thuế" align="center" />
          <el-table-column prop="business_regis" label="Đăng ký kinh doanh" align="center" />
          <el-table-column prop="license_date" label="Ngày cấp" align="center" />
          <el-table-column prop="license_place" label="Nơi cấp" align="center" />
        </el-table-column>
        <el-table-column label="Đại diện pháp nhân" align="center">
          <el-table-column label="Họ và tên" align="center">
            <template slot-scope="{row}">
              {{ row.nguoi_dai_dien.name }}
            </template>
          </el-table-column>
          <el-table-column label="Ngày sinh" align="center">
            <template slot-scope="{row}">
              {{ row.nguoi_dai_dien.birthday }}
            </template>
          </el-table-column>
          <el-table-column label="Địa chỉ liên lạc" align="center">
            <template slot-scope="{row}">
              {{ row.nguoi_dai_dien.address }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Liên hệ phản ánh" align="center">
          <el-table-column label="Điện thoại" align="center">
            <template slot-scope="{row}">
              {{ row.contact.phone }}
            </template>
          </el-table-column>
          <el-table-column label="Fax" align="center">
            <template slot-scope="{row}">
              {{ row.contact.fax }}
            </template>
          </el-table-column>
          <el-table-column label="Email" align="center">
            <template slot-scope="{row}">
              {{ row.contact.email }}
            </template>
          </el-table-column>
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
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import PartnerServiceResource from '@/api/partner-service/partner-service'
import { formatNumber, convertDateTime } from '@/utils/convert'
import { ARRAY_STATUS_PARTNER_SERVICE } from '@/utils/constant'
const partnerServiceResource = new PartnerServiceResource()
import { create_signature_hub } from '@/utils/create-signnature'
import { trim_string_object } from '@/utils/trim-string-object'

export default {
  name: 'ListPartner',
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
      isAdd: true,
      objectData: {},
      showDialog: false,
      statusList: ARRAY_STATUS_PARTNER_SERVICE
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
      partnerServiceResource.ListStand(this.query).then(res => {
        if (res.data.error_code === 0) {
          this.tableData = res.data.data
          this.total = this.query.limit * this.query.page + this.query.limit
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
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
      this.$confirm(`Bạn có chắc chắn muốn xóa đối tác ${row.name}`).then(async(_) => {
        let body = { partner_id: row.id }
        const signature = await this.create_signature_hub(body)
        body = { ...body, signature }
        partnerServiceResource.remove_partner(body).then(res => {
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
      this.showDialogAddVoucher = false
      this.showDialogListUser = false
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
