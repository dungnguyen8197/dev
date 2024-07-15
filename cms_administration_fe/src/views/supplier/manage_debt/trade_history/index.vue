<template>
  <div id="debt-page">
    <div style="width: 100; display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">Bảng kê giao dịch</h3>
      </div>
      <div style="display: flex;">
        <el-button v-if="is_export" type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất excel</el-button>
        <el-button v-if="is_write" type="primary" icon="el-icon-plus" @click="handleAddDialog">Thêm giao dịch</el-button>
        <el-button style="float: right;" icon="el-icon-refresh" :loading="loading" @click="resetFilter">Làm mới</el-button>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
      <!-- <el-input v-model="listQuery.q" style="width: 200px; margin-right: 10px;" type="text" :rows="2" placeholder="Nhập tìm kiếm">
        <i slot="suffix" class="el-icon-search el-input__icon" />
      </el-input>
      <el-select v-model="listQuery.type_search" style="margin-right: 10px; width: 220px;" placeholder="Phương thức tìm kiếm">
        <el-option v-for="item in searchOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button style="margin-right: 10px" type="primary" icon="el-icon-search" @click="getDebt">Tìm
        kiếm</el-button> -->
      <el-select v-model="filterShop" placeholder="Nhà cung cấp" style="width: 190px; margin-right: 10px;">
        <el-option v-for="item in shopOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="dateRangeDebt"
        style="width: 450px;"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="Đến"
        start-placeholder="Ngày bắt đầu thanh toán"
        end-placeholder="Ngày kết thúc thanh toán"
        @change="handleChangeDateRange"
      />

      <el-date-picker
        v-model="dateRangeCreate"
        style="width: 450px; margin-left: 10px;"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="Đến"
        start-placeholder="Ngày bắt đầu tạo"
        end-placeholder="Ngày kết thúc tạo"
        @change="handleChangeDateRangeCreate"
      />
    </div>

    <div id="brand-table-id" style="margin-top: 20px;">
      <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column prop="code" label="Mã NCC" width="120" align="center" />
        <el-table-column prop="shop_name" label="Tên nhà cung cấp" align="center" />
        <el-table-column prop="money_paid_format" label="Số tiền đã thanh toán" align="center" />
        <el-table-column prop="date_payment" label="Ngày thanh toán" align="center" />

        <el-table-column prop="date_created" label="Ngày tạo" align="center" />

        <el-table-column prop="remaining_money_format" label="Số tiền còn lại" align="center" />

        <el-table-column label="Hành động" width="100" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="primary" icon="el-icon-edit" circle @click="handleButton(scope.row)" /> -->
            <el-button v-if="is_delete" type="danger" icon="el-icon-delete" circle @click="onDeleteTransaction(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getDebt" />
      </el-row>
    </div>
    <DialogAddTrade v-if="showDialogAddTag" :show-dialog="showDialogAddTag" />
  </div>
</template>
<script>
import ManageDebtResource from '@/api/manage_supplier/debt'
import Pagination from '@/components/Pagination'
import { formatNumber } from '@/utils/convert'
import DialogAddTrade from './components/DialogAddTrade.vue'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'

const manageDebtResource = new ManageDebtResource()

export default {
  name: 'DebtPage',
  components: {
    Pagination, DialogAddTrade
  },
  data() {
    return {
      is_write: 0,
      is_edit: 0,
      is_delete: 0,
      is_view: 0,
      is_export: 0,
      dateRangeDebt: '',
      dateRangeCreate: '',
      loading: false,
      showDialogAddTag: false,
      showDialogEditTag: false,

      tableData: [],

      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },

      filterShop: 0,
      shopOption: [],
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
  watch: {
    filterShop: {
      handler: function() {
        this.listQuery.page = 1
        this.listQuery.shop_id = this.filterShop
        this.getDebt()
      }
    }
  },
  created() {
    this.$on('hide-add-tag-dialog', () => {
      this.showDialogAddTag = false
    })
    this.$on('hide-edit-tag-dialog', () => {
      this.showDialogEditTag = false
    })
    this.$on('refresh-list-tag', () => {
      this.getDebt()
    })
  },
  beforeDestroy() {
    this.$off('hide-add-tag-dialog')
    this.$off('hide-edit-tag-dialog')
    // this.$off('refresh-list-tag')
  },
  mounted() {
    console.log('........check o day ', JSON.stringify(this.$router.history.current.meta))
    // this.getDebt()
    this.getAllShop()
    this.requestListPermissionMenu()
  },
  methods: {
    onBack() {
      window.history.back()
    },
    requestListPermissionMenu() {
      const roles = this.$router.history.current.meta.roles
      let menu_id = roles && roles.length ? roles[0] : 0
      console.log('........check info ', menu_id, roles)
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
        }
      })
    },
    formatNumber,
    getAllShop() {
      manageDebtResource.listShop().then(response => {
        this.shopOption = [{ id: 0, name: 'Nhà cung cấp(Tất cả)' }, response.list]
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
    handleChangeDateRangeCreate(val) {
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.from_date_create = startDate.getTime()
      this.listQuery.to_date_create = endDate.getTime()
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
      manageDebtResource.exportExcelListDebtHistory(this.listQuery).then((res) => {
        const { error, link } = res
        if (error === 0) {
          this.confirmDowload(link)
        } else {
          this.$message.error('Lỗi khi xuất file excel')
        }
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
      manageDebtResource.listDebtHistory(this.listQuery).then(response => {
        if (this.listQuery.page === 1) {
          this.total = response.total
        }
        this.tableData = response.data
        this.tableData.forEach((item, index) => {
          item.stt = (this.listQuery.page - 1) * this.listQuery.limit + index + 1
          item.code = 'NCC' + item.shop_id
          item.state = item.status_paid === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'
          item.debt_beginning_format = this.formatNumber(item.debt_beginning)
          item.debt_end_priod_format = this.formatNumber(item.debt_end_priod)
          item.debt_arises_format = this.formatNumber(item.debt_arises)
          item.money_paid_format = this.formatNumber(item.money_paid) + 'đ'
          item.remaining_amount_format = this.formatNumber(item.remaining_amount) + 'đ'
        })
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.filterShop = null
      this.dateRangeDebt = ''
      this.dateRangeCreate = ''
      this.getDebt()
    },
    onDeleteTransaction(data) {
      this.$confirm('Bạn đang thao tác xóa giao dịch. Bạn có chắc chắn muốn tiếp tục ?', 'Xác nhận xóa giao dịch?', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.handleDeleteTransaction(data.id)
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleDeleteTransaction(id) {
      manageDebtResource.deleteDebtTransaction({ id: id }).then(response => {
        this.$message.success('Xóa giao dịch thành công')
        this.getDebt()
      }).catch((err) => {
        console.log(err)
        this.$message.error('Xóa giao dịch thất bại')
      })
    },
    handleAddDialog() {
      this.showDialogAddTag = true
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
