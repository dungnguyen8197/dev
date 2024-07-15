<template>
  <div id="debt-page">
    <div style="width: 100; display: flex; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center;">
          <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
          <h3 style="margin: 0px">Quản lý công nợ( {{ sub_title }})</h3>
        </div>
        <h4 v-if="isOverdueDebt" style="color: red;">{{ stringOverdueDebt }}</h4>
      </div>
      <div style="display: flex; align-items: center;">
        <el-button v-if="is_export" style="height: 40px" type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất excel</el-button>
        <el-button style="float: right; height: 40px" icon="el-icon-refresh" :loading="loading" @click="resetFilter">Làm mới</el-button>
      </div>
    </div>
    <!-- <div style="display: flex; flex-direction: row; justify-content: flex-end;">
      <div class="select-tag" style="display: flex; flex-direction: column; justify-content: end;">
        <p class="p-tag">Lọc theo</p>
      </div>
      <div class="select-tag">
        <p class="p-tag">Trạng thái</p>
        <el-select v-model="filterState" placeholder="Trạng thái">
          <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <div class="select-tag">
        <p class="p-tag">Ngày thanh toán</p>
        <el-date-picker
          v-model="dateRangeDebt"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          @change="handleChangeDateRange"
        />
      </div> -->
    <!-- </div> -->
    <!-- <hr> -->
    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
      <!-- <div> -->
      <el-input v-model="listQuery.q" style="width: 200px; margin-right: 10px;" type="text" :rows="2" placeholder="Nhập tìm kiếm">
        <i slot="suffix" class="el-icon-search el-input__icon" />
      </el-input>
      <el-select v-model="listQuery.type_search" style="margin-right: 10px; width: 220px;" placeholder="Phương thức tìm kiếm">
        <el-option v-for="item in searchOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button style="margin-right: 10px" type="primary" icon="el-icon-search" @click="getDebt">Tìm
        kiếm</el-button>
      <!-- <div class="select-tag"> -->
      <!-- <p class="p-tag">Trạng thái</p> -->
      <el-select v-model="filterState" placeholder="Trạng thái" style="width: 170px; margin-right: 10px;">
        <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <!-- </div> -->
      <!-- <div class="select-tag"> -->
      <!-- <p class="p-tag">Ngày thanh toán</p> -->
      <el-date-picker
        v-model="dateRangeDebt"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="Đến"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        @change="handleChangeDateRange"
      />
      <!-- </div> -->
      <!-- </div> -->

      <!-- <div> -->
      <!-- </div> -->
    </div>

    <div id="brand-table-id" style="margin-top: 20px;">
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <el-table-column prop="code" label="Mã NCC" width="100" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" style="color: #1890ff" :href="'#/supplier-info?shop_id=' + scope.row.shop_id">{{ scope.row.code }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="shop_name" label="Tên nhà cung cấp" align="center" />
        <el-table-column prop="debt_beginning_format" label="CNĐK tháng T-1" align="center" />
        <el-table-column prop="debt_end_priod_format" label="CNCK tháng T-1" align="center" />
        <el-table-column prop="debt_arises_format" label="CNPS tháng T" align="center" />
        <el-table-column prop="money_paid_format" label="Số tiền đã thanh toán" align="center" />
        <el-table-column prop="remaining_money_format" label="Số tiền còn lại" align="center" />
        <el-table-column prop="date_payment" label="Ngày thanh toán" align="center" />
        <el-table-column prop="status_paid" label="Trạng thái" align="center">
          <template slot-scope="scope">
            <!-- <el-tag :type="(scope.row.status_paid === 0) ? 'danger' : 'success'">{{ scope.row.state }}</el-tag> -->
            <p v-if="scope.row.status_paid === 0" style="color: red; font-size: 14px;">{{ scope.row.state }}</p>
            <p v-if="scope.row.status_paid === 1" style="color: #0C8C56; font-size: 14px;">{{ scope.row.state }}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getDebt" />
      </el-row>
    </div>
  </div>
</template>
<script>
import ManageDebtResource from '@/api/manage_supplier/debt'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'

const manageDebtResource = new ManageDebtResource()

export default {
  name: 'DebtPage',
  components: {
    Pagination
  },
  data() {
    const date = new Date()
    return {
      is_view: 0,
      is_edit: 0,
      is_delete: 0,
      is_export: 0,
      is_write: 0,
      dateRangeDebt: '',
      loading: false,
      countOverdueDebt: 0,
      isOverdueDebt: false,

      tableData: [],
      sub_title: `Tháng ${date.getMonth() + 1}/ ${date.getFullYear()}`,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        type_search: 2,
        q: ''
      },

      filterState: 0,
      stateOption: [
        {
          id: 0,
          name: 'Trạng thái (Tất cả)'
        },
        {
          id: 2,
          name: 'Đã thanh toán'
        },
        {
          id: 1,
          name: 'Chưa thanh toán'
        }
      ],
      searchOption: [
        {
          id: 2,
          name: 'Tìm theo tên nhà cung cấp'
        },
        {
          id: 1,
          name: 'Tìm theo mã nhà cung cấp'
        }
      ]
    }
  },
  computed: {
    stringOverdueDebt() {
      return `Bạn có ${this.countOverdueDebt} công nợ sắp đến hạn thanh toán`
    }
  },
  watch: {
    filterState: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.paid = this.filterState
        this.getDebt()
      }
    },
    'listQuery.q': {
      handler: function() {
        if (this.listQuery.q === '') {
          this.listQuery.page = 1
          this.getDebt()
        }
      }
    }
  },
  mounted() {
    // this.getDebt()
    this.getCountOverdueDebt()
    this.requestListPermissionMenu()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    requestListPermissionMenu() {
      const roles = this.$router.history.current.meta.roles
      let menu_id = roles && roles.length ? roles[0] : 0
      menu_id = parseInt(menu_id.replace('NCC', ''))
      const account = getAcountInfo()
      const email = account.email
      get_list_permission(email, menu_id, (data) => {
        console.log('............list data 1', JSON.stringify(data))
        if (data) {
          let { is_supper_admin, is_add, is_view, is_edit, is_delete, is_export } = data
          is_supper_admin = parseInt(is_supper_admin) || 0
          is_add = parseInt(is_add) || 1
          is_view = parseInt(is_view) || 1
          is_edit = parseInt(is_edit) || 1
          is_delete = parseInt(is_delete) || 1
          is_export = parseInt(is_export) || 1
          this.is_delete = is_supper_admin ? 1 : is_delete - 1
          this.is_write = is_supper_admin ? 1 : is_add - 1
          this.is_edit = is_supper_admin ? 1 : is_edit - 1
          this.is_export = is_supper_admin ? 1 : is_export - 1
          this.is_view = is_supper_admin ? 1 : is_view - 1
          this.getDebt()
          // if (this.$refs.searchBrand) {
          //   this.$refs.searchBrand.loadData(this.is_view, this.is_edit)
          // }
        }
      })
    },
    formatNumber,
    getCountOverdueDebt() {
      manageDebtResource.countOverdueDebt().then(response => {
        this.countOverdueDebt = response.data.count
        if (this.countOverdueDebt > 0) {
          this.isOverdueDebt = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleChangeDateRange(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.from_date_payment = startDate.getTime()
      this.listQuery.to_date_payment = endDate.getTime()
      this.getDebt()
    },
    checkLinkValidity(url) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'HEAD'
        })
          .then(response => {
            if (response.ok) {
              resolve('ok')
            } else {
              reject(`Failed to fetch the URL: ${response.status}`)
            }
          })
          .catch(error => {
            reject(`An error occurred while fetching the URL: ${error}`)
          })
      })
    },
    confirmDowload(url) {
      this.getFileFromServer(url)
    },
    async getFileFromServer(url) {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success('Xuất file thành công, vui lòng vào thư mục donwload để xem')
      }, 250)
    },
    handleExportExcel() {
      console.log('export excel')
      manageDebtResource.exportExcelListDebt(this.listQuery).then((res) => {
        const { error, link } = res
        if (error === 0) {
          this.confirmDowload(link)
        } else {
          this.$message.error('Lỗi khi xuất file excel')
        }
        // if (res.link) {
        //   this.checkLinkValidity(res.link).then(() => {
        //     window.open(res.link)
        //     this.$message.success('Xuất file excel thành công')
        //   }).catch((err) => {
        //     console.log(err)
        //     this.$message.error('Lỗi khi xuất file excel')
        //   })
        // } else {
        //   throw new Error(res.msg)
        // }
      }).catch((err) => {
        console.log(err)
        this.$message.error('Lỗi khi xuất file excel')
      })
    },
    getDebt() {
      if (!this.is_view) return
      this.loading = true
      if (!this.listQuery.q) {
        delete this.listQuery.q
      }
      manageDebtResource.listDebt(this.listQuery).then(response => {
        console.log(response)
        if (this.listQuery.page === 1) {
          this.total = response.total
        }
        this.tableData = response.data
        this.tableData.forEach(item => {
          item.code = 'NCC' + item.shop_id
          item.state = item.status_paid === 0 ? 'Đã quá hạn' : 'Đúng hạn'
          item.debt_beginning_format = this.formatNumber(item.debt_beginning) + 'đ'
          item.debt_end_priod_format = this.formatNumber(item.debt_end_priod) + 'đ'
          item.debt_arises_format = this.formatNumber(item.debt_arises) + 'đ'
          item.money_paid_format = this.formatNumber(item.money_paid) + 'đ'
          item.remaining_money_format = this.formatNumber(item.remaining_money) + 'đ'
        })
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
      console.log('get list tag')
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        type_search: 2,
        q: ''
      }
      this.filterState = null
      this.dateRangeDebt = ''
      this.getDebt()
    }
  }
}
</script>
<style scoped>
#debt-page {
  margin: 20px 30px 50px 30px;
}

.p-tag {
  margin: 10px 0px;
}

.select-tag {
  padding-right: 10px;
}

.el-range-separator {
  line-height: 28px;
  font-size: 14px;
  width: 30px;
}

::v-deep .el-range-editor--medium .el-range-separator {
    line-height: 28px;
    font-size: 14px;
    width: 30px;
}
</style>
