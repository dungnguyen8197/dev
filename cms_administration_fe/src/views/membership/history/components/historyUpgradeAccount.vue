<!--<template>-->
<!--  <el-row class="list-history-change-vga">-->
<!--    <el-row>-->
<!--      <el-row class="box-search">-->
<!--        <el-col :sm="3">-->
<!--          <div class="search-golfer">-->
<!--            <el-select-->
<!--              v-model="listQuery.user_id"-->
<!--              v-loading="loadingSearchUser"-->
<!--              filterable-->
<!--              remote-->
<!--              class="w-100"-->
<!--              placeholder="Nhập mã vID"-->
<!--              :remote-method="remoteMethod"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="golfer in golfers"-->
<!--                :key="golfer.value"-->
<!--                :label="golfer.label"-->
<!--                :value="golfer.value"-->
<!--              />-->
<!--            </el-select>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :sm="3" class="pr-lg-5">-->
<!--          <el-select-->
<!--            v-model="listQuery.options_payment"-->
<!--            class="w-100"-->
<!--            placeholder="Gói nâng cấp"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in arrayPackage"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--        <el-col :sm="3" class="pr-lg-5">-->
<!--          <el-select-->
<!--            v-model="listQuery.agent_id"-->
<!--            filterable-->
<!--            remote-->
<!--            class="w-100"-->
<!--            placeholder="Tìm đại lý"-->
<!--            :remote-method="onSearchAgent"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="agent in agents"-->
<!--              :key="agent.value"-->
<!--              :label="agent.label"-->
<!--              :value="agent.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--        <el-col :sm="8">-->
<!--          <div class="block">-->
<!--            <el-date-picker-->
<!--              v-model="dateRange"-->
<!--              class="date-rang-history w-100"-->
<!--              type="daterange"-->
<!--              align="right"-->
<!--              unlink-panels-->
<!--              range-separator="đến"-->
<!--              start-placeholder="Ngày bắt đầu"-->
<!--              end-placeholder="Ngày kết thúc"-->
<!--              :picker-options="pickerOptions"-->
<!--            />-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :sm="7">-->
<!--          <div class="text-right">-->
<!--            <el-button icon="el-icon-refresh" @click="onRefreshSearch"> Refresh</el-button>-->
<!--            <el-button type="primary" icon="el-icon-search" @click="onGetHistoryUpgradeAccount(1)">Tìm kiếm</el-button>-->
<!--            <el-button type="primary" icon="el-icon-download" :loading="loadingExportExcel" @click="onExportHistory">Xuất excel</el-button>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-row>-->
<!--    <el-row class="box-form">-->
<!--      <el-table-->
<!--        v-loading="loadingTable"-->
<!--        :data="tableData"-->
<!--        border-->
<!--        style="width: 100%"-->
<!--      >-->
<!--        <el-table-column-->
<!--          type="index"-->
<!--          label="STT"-->
<!--          :index="indexMethod"-->
<!--          width="50"-->
<!--        />-->
<!--        <el-table-column-->
<!--          prop="name"-->
<!--          label="Mã VGA mới"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            {{ `VGA${scope.row.user_id}` }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="Gói  cũ"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            {{ handleConvertType(scope.row.type_before) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="Gói  mới"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            {{ handleConvertType(scope.row.type) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        &lt;!&ndash;                <el-table-column&ndash;&gt;-->
<!--        &lt;!&ndash;                    label="Giá trị">&ndash;&gt;-->
<!--        &lt;!&ndash;                    <template slot-scope="scope">&ndash;&gt;-->
<!--        &lt;!&ndash;                        {{handleConvertType(scope.row.type)}}&ndash;&gt;-->
<!--        &lt;!&ndash;                    </template>&ndash;&gt;-->
<!--        &lt;!&ndash;                </el-table-column>&ndash;&gt;-->
<!--        &lt;!&ndash;                <el-table-column&ndash;&gt;-->
<!--        &lt;!&ndash;                    label="Gói mới">&ndash;&gt;-->
<!--        &lt;!&ndash;                    <template slot-scope="scope">&ndash;&gt;-->
<!--        &lt;!&ndash;                        {{ `Nâng cấp tài khoản từ: ${handleConvertType(scope.row.type_before) } -> ${handleConvertType(scope.row.type)}` }}&ndash;&gt;-->
<!--        &lt;!&ndash;                    </template>&ndash;&gt;-->
<!--        &lt;!&ndash;                </el-table-column>&ndash;&gt;-->
<!--        <el-table-column-->
<!--          label="Ngày có hiệu lực"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            {{ convertDate(scope.row.time_upgrade) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="Người nâng cấp"-->
<!--        >-->
<!--          <template v-if="scope.row.admin" slot-scope="scope">-->
<!--            {{ (scope.row.admin.name) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="note"-->
<!--          label="Ghi chú"-->
<!--        />-->
<!--        <el-table-column-->
<!--          label="Đại lý"-->
<!--        >-->
<!--          <template v-if="scope.row.agent" slot-scope="scope">-->
<!--            {{ (scope.row.agent.name) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="onGetHistoryUpgradeAccount" />-->
<!--    </el-row>-->
<!--  </el-row>-->
<!--</template>-->

<!--<script>-->
<!--import Resource from '@/api/resource'-->
<!--import { pickerOptions, selectOptions } from '@/utils/dateRangOptions'-->
<!--import { convertDate } from '@/utils/convert'-->
<!--import Pagination from '@/components/Pagination'-->
<!--import axios from 'axios'-->
<!--import { getToken } from '@/utils/auth'-->
<!--const RemoveFileResource = new Resource('api/v1/public-remove-file')-->
<!--const SearchAgentResource = new Resource('api/v1/search-agents')-->
<!--const arrayPackage = [-->
<!--  { value: 3, label: 'Pre  ' },-->
<!--  { value: 2, label: 'Vip' },-->
<!--  { value: 12, label: 'Infinite' },-->
<!--  { value: 11, label: 'Senior' }-->
<!--]-->
<!--export default {-->
<!--  name: 'HistoryUpgradeAccount',-->
<!--  components: { Pagination },-->
<!--  data() {-->
<!--    return {-->
<!--      pickerOptions: {-->
<!--        shortcuts: pickerOptions-->
<!--      },-->
<!--      dateRange: [],-->
<!--      options: selectOptions,-->
<!--      listQuery: {-->
<!--        page: 1,-->
<!--        limit: 10,-->
<!--        type: 1-->
<!--      },-->
<!--      total: 0,-->
<!--      from: 0,-->
<!--      loadingSearchUser: false,-->
<!--      loadingTable: false,-->
<!--      loadingExportExcel: false,-->
<!--      golfers: [],-->
<!--      tableData: [],-->
<!--      arrayPackage: [...arrayPackage],-->
<!--      agents: []-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    dateRange(value) {-->
<!--      this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD')-->
<!--      this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD')-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.onGetHistoryUpgradeAccount()-->
<!--  },-->
<!--  methods: {-->
<!--    remoteMethod(keyword) {-->
<!--      this.loadingSearchUser = true-->
<!--      if (keyword === '' || keyword === undefined) {-->
<!--        this.golfers = []-->
<!--        return-->
<!--      }-->
<!--      const params = { keyword: keyword }-->
<!--      this.$store.dispatch('searchGolfer', params).then(response => {-->
<!--        if (response.error_code === 0) {-->
<!--          this.loadingSearchUser = false-->
<!--          const result = response.data-->
<!--          if (result.data.length > 0) {-->
<!--            const array = []-->
<!--            result.data.map(value => {-->
<!--              const name = `${value.fullname} (${value.nickname})`-->
<!--              const item = { value: value.id, label: name }-->
<!--              array.push(item)-->
<!--            })-->
<!--            this.golfers = [...array]-->
<!--          }-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    async onSearchAgent(keyword) {-->
<!--      const params = { keyword: keyword }-->
<!--      const { data } = await SearchAgentResource.list(params)-->
<!--      const array = []-->
<!--      if (data.length > 0) {-->
<!--        data.map(value => {-->
<!--          const item = { label: `${value.name} - ${value.code_agent}`, value: value.id }-->
<!--          array.push(item)-->
<!--        })-->
<!--      }-->
<!--      this.agents = [...array]-->
<!--    },-->
<!--    async onExportHistory() {-->
<!--      this.loadingExportExcel = true-->
<!--      this.listQuery.action = 0-->
<!--      await this.$store.dispatch('exportHistoryChangeAccount', this.listQuery).then(response => {-->
<!--        if (response.error_code === 0) {-->
<!--          this.handleDownloadExport(response.data.url_file)-->
<!--        } else {-->
<!--          this.$message.error(response.message)-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    handleDownloadExport(urlFile) {-->
<!--      const self = this-->
<!--      axios({-->
<!--        url: urlFile,-->
<!--        method: 'GET',-->
<!--        responseType: 'blob',-->
<!--        headers: {-->
<!--          'Authorization': `Basic ${getToken()}`-->
<!--        }-->
<!--      }).then(response => {-->
<!--        self.loadingExportExcel = false-->
<!--        const url = window.URL.createObjectURL(new Blob([response.data]))-->
<!--        const link = document.createElement('a')-->
<!--        link.href = url-->
<!--        const date = new Date()-->
<!--        const fileName = `${date.getUTCFullYear()}_${date.getUTCMonth() + 1}_${date.getUTCDate()}_${date.getTime()}_lich_su_nang_cap.xlsx`-->
<!--        link.setAttribute('download', fileName) // or any other extension-->
<!--        document.body.appendChild(link)-->
<!--        link.click()-->
<!--        self.handleRemoveFileExcel(urlFile)-->
<!--      })-->
<!--    },-->
<!--    handleRemoveFileExcel(path) {-->
<!--      RemoveFileResource.list({ path: path })-->
<!--    },-->
<!--    onGetHistoryUpgradeAccount(e) {-->
<!--      if (e === 1) {-->
<!--        this.listQuery.page = 1-->
<!--      }-->
<!--      this.loadingTable = true-->
<!--      this.$store.dispatch('getHistoryUpgradeAccount', this.listQuery).then(response => {-->
<!--        if (response.error_code === 0) {-->
<!--          const result = response.data-->
<!--          this.listQuery = { ...this.listQuery, ...{ page: result.current_page }}-->
<!--          this.total = result.total-->
<!--          this.tableData = result.data-->
<!--        }-->
<!--        this.loadingTable = false-->
<!--      })-->
<!--    },-->
<!--    onRefreshSearch() {-->
<!--      this.listQuery = Object.assign({}, { limit: 10, page: 1 })-->
<!--      this.onGetHistoryUpgradeAccount()-->
<!--    },-->
<!--    handleConvertType(type) {-->
<!--      switch (type) {-->
<!--        case 0:-->
<!--          return 'Tài khoản thường'-->
<!--        case 1:-->
<!--          return 'Tài khoản VIP'-->
<!--        case 2:-->
<!--          return 'Tài khoản Member'-->
<!--        case 6:-->
<!--          return 'Tài khoản Priority'-->
<!--        case 11:-->
<!--          return 'Tài khoản Senior'-->
<!--        case 12:-->
<!--          return 'Tài khoản Infinite'-->
<!--        default:-->
<!--          return 'Tài khoản Premium'-->
<!--      }-->
<!--    },-->
<!--    indexMethod(index) {-->
<!--      return this.from + index-->
<!--    },-->
<!--    convertDate-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
