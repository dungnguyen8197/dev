<template>
  <div>
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3>Danh sách mã QR gói S</h3>
        </el-col>
      </el-row>
      <el-col style="padding-top: 20px; padding-bottom: 20px">
        <el-col :sm="24" :md="4" :lg="4" class="mr-10">
          <label> Tìm kiếm theo sân:</label>
          <search-facility @selection-changed-facility="handleSelectionChanged" />
        </el-col>
        <div class="text-right" style="padding-top: 30px">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button icon="el-icon-refresh" @click="onRefreshSearch"> Làm mới</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleAddQR">Thêm mới
          </el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="list-account__data">
      <el-col>
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :index="handleIndexMethod"
            label="STT"
            width="50"
          />
          <el-table-column
            label="Đại lý"
            width="100px"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.agent">
                <el-tag>{{ scope.row.agent.name }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="Sân golf"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.facility">{{ scope.row.facility.title }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="Hố, Đường"
          >
            <template slot-scope="scope">
              <p>{{ `${scope.row.hole.stt} - ${scope.row.hole.path_name}(${scope.row.hole.par})` }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="QR"
            :width="600"
          >
            <template slot-scope="scope">
              <qrcode-vue :size="500" level="L" :value="scope.row.content ? scope.row.content : ''" />
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái">
            <template slot-scope="scope">
              <el-col class="mb-5">
                <el-tag v-if="scope.row.status === 0" type="danger">Tắt</el-tag>
                <el-tag v-else type="success">Bật</el-tag>
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeStatusAgent(scope.row)"
                />
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            label="Người tạo"
          >
            <template v-if="scope.row.admin" slot-scope="scope">
              <p>{{ scope.row.admin.name }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="Ngày tạo"
          >
            <template slot-scope="scope">
              {{ convertDateTimeSecond(scope.row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > query.limit" :total="total" :limit.sync="query.limit" :page.sync="query.page" @pagination=" getListQrDebit" />
      </el-col>
    </el-row>
    <dialog-add-q-r
      :show-dialog="showDialogAddQR"
      :object-data="objectData"
      :is-add="isAdd"
      @onCloseDialog="handleClose"
    />
  </div>
</template>
<script>
// import Resource from '@/api/resource';
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import QrcodeVue from 'qrcode.vue'
import InsuranceApi from '@/api/HIO/insurance'
import DialogAddQR from '@/views/HIO/insuranceS/qr/components/DialogAddQR.vue'
import { convertDateTimeSecond } from '@/utils/convert'
import SearchFacility from '@/views/component/SearchFacility.vue'
import { isEmpty } from '@/utils/validate'
const insuranceApi = new InsuranceApi()

export default {

  name: 'Documentation',
  components: { SearchFacility, DialogAddQR, Pagination, QrcodeVue },
  data() {
    return {
      query: {
        page: 1,
        limit: 15
      },
      objectData: {},
      changeStatus: [],
      tableData: [],
      dataQr: [],
      loading: false,
      total: 0,
      from: 0,
      qrValue: 'My secret value',
      showDialogAddQR: false,
      isAdd: true
    }
  },
  watch: {},
  mounted() {
    this.getListQrDebit()
  },
  methods: {
    handleFilter() {
      this.query.page = 1
      this.getListQrDebit()
    },
    handleSelectionChanged(value) {
      console.log('value_____', value)
      if (isEmpty(value)) {
        delete this.query.facility_id
        this.handleFilter()
        return
      }
      this.query.facility_id = value.value
      // this.handleFilter()
    },
    convertDateTimeSecond,
    handleAddQR() {
      this.isAdd = true
      this.showDialogAddQR = true
      this.objectData = {}
    },
    handleClose(value) {
      this.showDialogAddQR = false
      if (value.reload) {
        this.getListQrDebit()
      }
    },
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.getListQrDebit()
    },
    formatNumber,
    getListQrDebit() {
      this.loadingTable = true
      insuranceApi.listQR(this.query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    changeStatusAgent(row) {
      const obj = {
        status: row.status
      }
      this.$confirm(`Bạn có chắc chắn muốn đổi trạng thái`).then(_ => {
        insuranceApi.updateStatusQr(obj, row.id).then(res => {
          if (res.error_code === 0) {
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    test(dataUrl) {
      console.log(dataUrl)
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : ((this.query.page - 1) * this.query.limit) + index + 1
    }
  }
}
</script>

<style scoped lang="scss">
.wrap-page{
  padding: 16px;
}
</style>
