<template>
  <el-row style="margin:20px;">
    <el-row>
      <el-col :sm="24">
        <h3 style="margin: 0; width: 100%; padding: 10px; text-align:center;">QUẢN LÝ TIỀN CHI</h3>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <el-row>
      <el-col :sm="24">
        <h4 style="margin: 0; width: 100%; padding: 10px; color: red;text-align:center;">{{ `Tổng số tiền đã chi: ${formatNumber(total_money)} VNĐ` }}</h4>
      </el-col>
    </el-row>
    <div class="clearfix-20" />
    <div class="filter-container">
      <el-row>
        <el-col :sm="6" :md="3" class="mr-10">
          <el-select
            v-model="query.bank_account_number"
            filterable
            clearable
            style="width: 100%"
            remote
            reserve-keyword
            :multiple-limit="1"
            placeholder="Số tài khoản"
          >
            <el-option
              v-for="account in bankAccountList"
              :key="account.value"
              :label="account.label"
              :value="account.value"
            />
          </el-select>
        </el-col>

        <el-col :sm="4" class="mr-10">
          <el-input
            v-model="query.code_payment"
            placeholder="Code chi"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <el-col :sm="3" class="mr-10">
          <el-select
            v-model="query.supplier_id"
            clearable
            style="width: 100%"
            remote
            filterable
            reserve-keyword
            :multiple-limit="1"
            :remote-method="onSearchSupplier"
            :loading="loadingSearchSupplier"
            placeholder="Tìm kiếm theo NCC"
          >
            <el-option
              v-for="supplier in suppliers"
              :key="supplier.id"
              :label="supplier.name"
              :value="supplier.id"
            />
          </el-select>
        </el-col>
        <el-col :sm="3" class="mr-10">
          <el-select
            v-model="query.type_purchase"
            clearable
            style="width: 100%"
            remote
            filterable
            reserve-keyword
            :multiple-limit="1"
            placeholder="Loại giao dịch"
          >
            <el-option
              v-for="type_pur in typePurchaseList"
              :key="type_pur.value"
              :label="type_pur.label"
              :value="type_pur.value"
            />
          </el-select>
        </el-col>
        <el-col :sm="6" class="mr-10">
          <el-date-picker
            v-model="dateRange"
            class="w-100"
            format="dd-MM-yyyy HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-col>
        <el-col :sm="6" class="mr-10" style="float: right;">
          <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="handleDownload"> Export excel</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="clearfix-10" />
    <el-row style="margin-top: 40px;">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="STT"
          width="100"
          align="center"
          type="index"
          :index="handleIndexMethod"
        />
        <el-table-column
          prop="code_payment"
          label="Code chi"
          align="center"
        />
        <el-table-column
          prop="amount_money"
          label="Số tiền"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.amount_money ? formatNumber(scope.row.amount_money) : "" }}
          </template>
        </el-table-column>
        <el-table-column
          label="Mã BK"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.code.length > 0">
              <template>
                <el-tag v-for="item in listCodeBooking(scope.row)" :key="item">{{ item }}</el-tag>
              </template>
            </template>
          </template>

        </el-table-column>
        <el-table-column
          prop="supplier.name"
          label="NCC"
          align="center"
        />
        <el-table-column
          prop="bank_account_number"
          label="Số tài khoản"
          align="center"
        />
        <el-table-column
          prop="date_transaction"
          label="Ngày giao dịch"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.date_transaction ? convertDateTime(scope.row.date_transaction) : "" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_content"
          label="Nội dung TT"
          align="center"
        />
        <el-table-column
          prop="accounting_date"
          label="Loại giao dịch"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type_purchase === 0" type="warning">Bản nháp</el-tag>
            <el-tag v-else type="success">Giao dịch thực</el-tag>
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
        <!-- <dialog-edit-money-out :show-dialog="showDialogUpdateRow" :is-add="isAdd" :object-data="objectDataEdit" @onCloseDialog="handleClose" /> -->
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatNumber, convertDateTime } from '@/utils/convert'
// import DialogEditMoneyOut from './components/DialogEditMoneyOut.vue'
import moment from 'moment'
import MoneyOutResource from '@/api/manage-booking/money-out'
import SearchResource from '@/api/search-api'
const searchResource = new SearchResource()
const moneyOutResource = new MoneyOutResource()
export default {
  name: 'MoneyOut',
  components: {
    Pagination
    // DialogEditMoneyOut
  },
  data() {
    return {
      loadingTable: false,
      tableData: [],
      query: {
        limit: 10,
        page: 1,
        type: 1
      },
      total: 20,
      loadingExportExcel: false,
      total_money: 0,
      dialogUpdateNote: false,
      objectData: {},
      objectDataEdit: {},
      adminData: [],
      loadingSearchAdmin: false,
      dateRange: '',
      dialogConfirmDone: false,
      dialogConfirmClear: false,
      body: {},
      loadingSearchSupplier: false,
      suppliers: [],
      supplierList: [],
      bankAccountList: [
        { label: '20098849999 - Ngân hàng TMCP Sài Gòn Thương tín', value: '20098849999' },
        { label: '3066011566666 - Ngân hàng TMCP Hàng hải Việt Nam', value: '3066011566666' },
        { label: '114002914443 - Ngân hàng TMCP Công Thương Việt Nam', value: '114002914443' },
        { label: '119002907921 - Ngân hàng TMCP Công Thương Việt Nam', value: '119002907921' },
        { label: '121366999 - Ngân hàng TMCP NAM Á', value: '121366999' },
        { label: '122861313 - Ngân hàng TMCP NAM Á', value: '122861313' },
        { label: '131355468 - Ngân hàng TMCP NAM Á', value: '131355468' },
        { label: '131355668 - Ngân hàng TMCP NAM Á', value: '131355668' },
        { label: '131355899 - Ngân hàng TMCP NAM Á', value: '131355899' },
        { label: '135566888 - Ngân hàng TMCP NAM Á', value: '135566888' },
        { label: '801114474566688 - Ngân hàng TMCP NAM Á', value: '801114474566688' },
        { label: '888899988 - Ngân hàng TMCP NAM Á', value: '888899988' },
        { label: '131366888 - Ngân hàng TMCP NAM Á', value: '131366888' },
        { label: '668797988888 - Ngân hàng TMCP Á Châu', value: '668797988888' },
        { label: '9201100133006 - Ngân hàng TMCP Quân đội', value: '9201100133006' },
        { label: '9201168466666 - Ngân hàng TMCP Quân đội', value: '9201168466666' },
        { label: '9201184888888 - Ngân hàng TMCP Quân đội', value: '9201184888888' },
        { label: '1018888 - Ngân hàng TMCP NAM Á', value: '1018888' }
      ],
      showDialogUpdateRow: false,
      isAdd: true,
      typePurchaseList: [
        { label: 'Bản nháp', value: '0' },
        { label: 'Giao dịch thực', value: '1' }
      ]
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.query.start_time)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }

  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.start_time = moment(value[0]).unix()
        this.query.end_time = moment(value[1]).unix()
      } else {
        this.query.start_time = ''
        this.query.end_time = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      moneyOutResource.moneyOutList(this.query).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = data.data
          this.total = data.total
          this.total_money = data.total_money
        }
      }).catch(_ => {
        this.loadingTable = false
      })
    },
    onSearchSupplier(keyword) {
      this.loadingSearchSupplier = true
      searchResource.searchSupplier({ keyword_supplier: keyword.trim() }).then(res => {
        this.loadingSearchSupplier = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.suppliers = data
        }
      })
    },
    handleFilter() {
      this.query.page = 1
      this.loadingTable = true
      this.onGetList()
    },
    onReset() {
      this.query = Object.assign({}, { page: 1, limit: 10, type: 1 })
      this.dateRange = ''
      this.onGetList()
    },
    handleDownload() {
      this.loadingTable = true
      this.query.get_all = true
      moneyOutResource.moneyOutList(this.query).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.dataExcel = data.data
          this.dataExcel.map((result, i) => {
            result.index = i + 1
            if (result.supplier) {
              const supplier_name = result.supplier.name
              result.supplier_name = supplier_name
            }
            const list_code = this.listCodeBooking(result)
            result.code_book = [...new Set(list_code)].join()
            result.purchase = result.type_purchase === 0 ? 'bản nháp' : 'Giao dịch thực'
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['STT', 'Code chi', 'Số tiền', 'Mã BK', 'NCC', 'Số tài khoản', 'Ngày giao dịch', 'Nội dung TT', 'Loại giao dịch']
            const filterVal = ['index', 'code_payment', 'amount_money', 'code_book', 'supplier_name', 'bank_account_number', 'date_transaction', 'transfer_content', 'purchase']
            let data = this.dataExcel
            data = this.formatJson(filterVal, data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'money-out'
            })
          })
          this.query.get_all = false
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
        this.loadingTable = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleEditNote(row) {
      this.dialogUpdateNote = true
      this.objectData = Object.assign({}, row)
    },
    handleClose() {
      this.dialogUpdateNote = false
      this.showDialogUpdateRow = false
      this.onGetList()
    },
    // handleEdit(row) {
    //   this.showDialogUpdateRow = true
    //   this.objectDataEdit = Object.assign({}, row)
    // },
    confirmDone(row) {
      this.dialogConfirmDone = true
      this.query.id = row.id
    },

    listCodeBooking(row) {
      const list = []
      row.code.map((item) => list.push(item?.codePaymentExpense?.booked?.[0]?.code_booking))
      return list
    },

    handleEdit(row) {
      this.isAdd = false
      this.showDialogUpdateRow = true
      this.objectDataEdit = Object.assign({}, row)
    },

    formatNumber, convertDateTime
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
.filter-container .filter-item{
  margin-bottom: 0;
}
.cell .el-tag{
  margin: 5px;
}
</style>
