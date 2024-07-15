<template>
  <el-row class="main-content">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h1 style="margin: 0; width: 100%; padding: 10px; text-align: center;">Danh sách nâng cấp hạng hội viên</h1>
      </el-col>
    </el-row>

    <div class="filter-container">
      <el-row :sm="24">
        <el-col :sm="3" class="mr-10" style="padding-right: 5px">
          <div class="search-golfer">
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
                :label="item.fullname + ' - ' + (item.id_display||item._id)"
                :value="item._id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="padding-right: 5px">
          <div class="grid-content bg-purple">
            <el-date-picker
              v-model="dateRange"
              style="width: 100%"
              format="dd-MM-yyyy"
              type="daterange"
              range-separator="To"
              start-placeholder="Start"
              end-placeholder="End"
            />
          </div>
        </el-col>
        <el-col :span="4" style="padding-right: 5px">
          <div class="grid-content bg-purple">
            <el-input
              v-model="listQuery.code"
              placeholder="Mã thanh toán:"
              class="filter-item full-width"
              clearable
              @keyup.enter.native="handleFilter"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="listQuery.type"
            style="padding-right: 5px"
            class="w-100"
            placeholder="Phương thức thanh toán"
          >
            <el-option
              v-for="item in optionType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="listQuery.status"
            style="padding-right: 5px"
            class="w-100"
            placeholder="Trạng thái thanh toán"
          >
            <el-option
              v-for="item in optionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <!--      <el-col :sm="6" class="text-right">-->
      <!--        &lt;!&ndash;        <el-button&ndash;&gt;-->
      <!--        &lt;!&ndash;          type="primary"&ndash;&gt;-->
      <!--        &lt;!&ndash;          icon="el-icon-download"&ndash;&gt;-->
      <!--        &lt;!&ndash;          :loading="loadingExportExcel"&ndash;&gt;-->
      <!--        &lt;!&ndash;          @click="handleDownload"&ndash;&gt;-->
      <!--        &lt;!&ndash;        >&ndash;&gt;-->
      <!--        &lt;!&ndash;          Export excel&ndash;&gt;-->
      <!--        &lt;!&ndash;        </el-button>&ndash;&gt;-->
      <!--        <el-button icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>-->
      <!--        <el-button type="primary" icon="el-icon-search" @click="handleFilter()">Tìm kiếm</el-button>-->
      <!--      </el-col>-->
      <el-col :sm="24" align="right">
        <el-button icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter()">Tìm kiếm</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          :loading="loadingExportExcel"
          @click="handleDownload"
        >
          Export excel
        </el-button>
      </el-col>
    </div>

    <el-row class="list-golfer">
      <el-col>
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
            label="Mã vID"
            align="center"
          >
            <template slot-scope="scope">
              {{ `vID${scope.row.user_id}` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="Mã thanh toán"
            align="center"
          />
          <el-table-column
            label="Số tiền"
            align="center"
          >
            <template slot-scope="scope">
              {{ formatNumber(scope.row.money) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            label="Phương thức thanh toán"
          />
          <el-table-column
            label="Trạng thái thanh toán"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="success">Đã thanh toán</el-tag>
              <el-tag v-else type="info">Chưa thanh toán</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="Gói nâng cấp"
            align="center"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.DetailTransaction.ListTransaction[0].OptionsUpgrade.option_name }}</p>
              <p v-if="scope.row.DetailTransaction.ListTransaction[1]">{{ scope.row.DetailTransaction.ListTransaction[1].OptionsUpgrade.option_name }}</p>
              <p v-if="scope.row.DetailTransaction.ListTransaction[2]">{{ scope.row.DetailTransaction.ListTransaction[2].OptionsUpgrade.option_name }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="Thời gian tạo"
            align="center"
          />
          <el-table-column
            label="Hành động"
            class="text-center"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 0" type="success" size="small" @click="onCreateQR(scope.row)">
                Tạo QR
              </el-button>
              <el-button v-if="scope.row.status === 0" type="warning" size="small" @click="confirmPayment(scope.row)">
                Xác nhận GD
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > listQuery.number"
          :total="total"
          :limit.sync="listQuery.number"
          :page.sync="listQuery.page"
          @pagination="onGetHistoryUpgradeAccount"
        />
      </el-col>
      <el-col :sm="24" />
    </el-row>
    <el-dialog
      :visible.sync="dialogShowQRCode"
      width="30%"
      center
    >
      <section ref="screenshotInvoice" class="main-pd-wrapper">
        <el-image :src="urlQRcode" style="height: 100%; width: 100%;" />
      </section>
    </el-dialog>
  </el-row>

</template>

<script>
import Pagination from '@/components/Pagination'
import { typeAccounts } from '@/utils/defaultOptions'
import { optionsPlayer } from '@/utils/optionGolfer'
import { genQrCode } from '@/utils/vietqr'
import ListGolferResource from '@/api/membership/golfer'
import axios from 'axios'
import { formatNumber } from '@/utils'
const listGolferResources = new ListGolferResource()
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'
const optionType = [
  { value: 'bank', label: 'bank' },
  { value: 'point', label: 'point' }
]

const optionStatus = [
  { value: 0, label: 'Chưa thanh toán' },
  { value: 1, label: 'Đã thanh toán' }
]
export default {
  name: 'Lists',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        number: 10,
        page: 1
      },
      limit: 10,
      total: 20,
      optionType: [...optionType],
      optionStatus: [...optionStatus],
      form: 1,
      loadingSearchUser: false,
      loadingTable: false,
      tableData: [],
      golfers: [],
      options: [...typeAccounts],
      typeAccount: -1,
      dateRange: [],
      pickerOptions: {
        // shortcuts: pickerOptions
      },
      objDetail: {},
      showDialog: false,
      showDialogHistory: false,
      golferID: null,
      optionsPlayer: [...optionsPlayer],
      playerModel: {},
      isProPlayer: 0,
      showDialogDetailGolfer: false,
      showDialogExtendGolfer: false,
      year: '',
      roleUser: this.$store.getters.roles,
      dateNow: '',
      dateC: '',
      loadingSearch: false,
      dialogShowQRCode: false,
      urlQRcode: '',
      listGolfer: [],
      nameOptionChoose: {},
      loadingExportExcel: false
    }
  },
  watch: {
    dateRange(value) {
      this.listQuery.time_step_1 = moment(value[0]).unix()
      this.listQuery.time_step_2 = moment(value[1]).unix()
    },
    golferID(value) {
      if (value === null || value === undefined) {
        this.listQuery.user_id = null
      } else {
        this.listQuery.user_id = value
      }
      this.onGetHistoryUpgradeAccount()
    }
  },
  mounted() {
    this.onGetHistoryUpgradeAccount()
  },
  methods: {
    moment,
    formatNumber,
    onGetHistoryUpgradeAccount() {
      this.loadingTable = true
      const data = {
        signdata: 123
      }
      console.log(this.listQuery)
      listGolferResources.listCreateCodePayment({ ...data, ...this.listQuery }, this.listQuery).then(async response => {
        console.log('ui zoi loi', response)
        if (response.error_code === 0) {
          const result = response.data
          console.log('sss...........................', result)
          this.tableData = [...result]
        }
        this.loadingTable = false
        // for (let i = 0; i < this.tableData.length; i++) {
        //   this.tableData[i].infor = JSON.parse(this.tableData[i].data_provider)
        // }
        // const currentTotal = this.total / this.listQuery.number
        // if (this.listQuery.page === currentTotal && this.tableData.length === this.listQuery.number) {
        //   this.total += this.listQuery.number
        // }
        // console.log(this.total)
      })
      this.total = this.listQuery.number * this.listQuery.page + this.listQuery.number
    },
    handleFilter() {
      this.listQuery.page = 1
      this.loadingTable = true
      this.onGetHistoryUpgradeAccount()
    },
    confirmPayment(row) {
      this.$confirm(`Bạn có chắc chắn muốn xác nhận`).then(_ => {
        this.loadingTable = true
        const data = {
          cms_id: getAcountInfo().id,
          transaction_id: row.provider_transaction_id,
          status: 1,
          signdata: 123
        }
        axios({
          url: 'https://wghn-api-staging.vcallid.com/api/v1/for_cms/confirm_transaction_upgrade_account',
          method: 'POST',
          data
        }).then(response => {
          console.log('ssssssss.................', response)
          if (response.data.error_code === 0) {
            const result = response.data.data
            this.$message.success('Cập nhật hạng hội viên thành công')
            console.log('assss...........', result)
          } else {
            this.$message.success('Cập nhật hạng hội viên không thành công')
          }
          this.loadingTable = false
        })
      }).catch(_ => {
      })
    },
    async onCreateQR(row) {
      const qr_info_data = genQrCode({
        bank: 970428,
        accountName: 'CTCP CN MANG LUOI TINH DIEM CHAP GOLF QUOC TE',
        accountNumber: 181833888,
        amount: row.money,
        memo: row.code,
        template: 'compact'
      })
      console.log('qr_info_data', qr_info_data)
      const res = await qr_info_data
      this.urlQRcode = res.result
      this.dialogShowQRCode = true
    },
    // downloadImage() {
    //   this.loadingSubmit = true
    //   const fileName = `QRCode.jpg`
    //   html2canvas(this.$refs.screenshotInvoice).then((canvas) => {
    //     const link = document.createElement('a')
    //     const uri = canvas.toDataURL('image/jpeg', 1.0)
    //     if (typeof link.download !== 'string') {
    //       window.open(uri)
    //     } else {
    //       link.href = uri
    //       link.download = fileName
    //       document.body.appendChild(link)
    //       link.click()
    //       document.body.removeChild(link)
    //     }
    //   }).finally(() => {
    //     this.loadingSubmit = false
    //   })
    // },
    handleIndexMethod(index) {
      // return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.number + index + 1
    },
    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.golferID = ''
      this.dateRange = ''
      this.onGetHistoryUpgradeAccount()
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
    async handleDownload() {
      let stop = false
      const query = {
        number: 5000,
        page: 1
      }
      const data = {
        signdata: 123
      }
      let list_all = []
      this.loadingExportExcel = true
      while (!stop) {
        try {
          const res = await listGolferResources.listCreateCodePayment({ ...data, ...query }, this.listQuery)
          console.log('res..............', res)
          console.log('this.tableData', res.data)
          if (res.data.length <= 0) {
            stop = true
          }
          query.page = +query.page + 1
          list_all = [...list_all, ...res.data]
        } catch (error) {
          console.error(error)
          stop = true
        }
      }
      list_all.map(item => {
        item.options_upgrade = item.DetailTransaction.ListTransaction.map((val) => val.OptionsUpgrade.option_name).toString()
      })
      console.log('list_all', list_all)
      this.loadingExportExcel = false
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Mã vID', 'Mã thanh toán', 'Số tiền', 'Phương thức thanh toán', 'Trạng thái thanh toán', 'Gói nâng cấp', 'Thời gian tạo']
        const filterVal = ['user_id', 'code', 'money', 'type', 'status', 'options_upgrade', 'created_at']
        let data = list_all
        data = this.formatJson(filterVal, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-list'
        })
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'money') {
          return formatNumber(v[j])
        } else if (j === 'status') {
          return +v[j] === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  .breadcrumb {
    padding: 10px 0;
  }

  .w-100 {
    width: 100%;
  }

  .text-right {
    text-align: right;
  }
}

.filter-container {
  padding: 10px 20px 20px 20px;
}

.list-golfer {
  padding: 50px 20px 0 20px;
}

@media (min-width: 1200px) {
  .pr-10 {
    padding-right: 10px;
  }
}

@media only screen and (max-width: 580px) {
  .el-select {
    margin-bottom: 20px;
  }
  .el-button {
    margin: 20px 0;
  }
}

.mb-2 {
  margin-bottom: 10px;
}
</style>
