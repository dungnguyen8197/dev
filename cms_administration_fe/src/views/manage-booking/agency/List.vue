<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h5 class="title">Quản lý đại lý</h5>
        </el-col>
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddAgency">Thêm mới
        </el-button>
      </el-row>
      <div class="filter-container">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="query.keyword"
              class="w-100"
              clearable
              placeholder="Nhập tên đại lý"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="5" class="mr-10">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-row class="list-account__data">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            label="STT"
            width="50"
            align="center"
            type="index"
            :index="handleIndexMethod"
          />
          <el-table-column
            prop="name"

            :label="('Tên đại lý')"
            align="center"
          />
          <el-table-column
            prop="representative_name"
            label="Tên đại diện"
            align="center"
          />
          <el-table-column
            prop="phone"
            label="SĐT"
            align="center"
          />
          <el-table-column
            prop="user_id"
            label="VID"
            align="center"
          />
          <el-table-column
            prop="address"
            label="Địa chỉ"
            align="center"
          />
          <el-table-column
            prop="tax_code"
            label="Mã thuế"
            align="center"
          />
          <el-table-column
            label="Link PDF"
            align="center"
          >
            <template slot-scope="{row}">
              <el-link
                v-if="row.link_pdf"
                type="primary"
                :href="convertLink(row.link_pdf)"
                target="_blank"
              > <el-button>Xem </el-button></el-link>

            </template>

          </el-table-column>
          <el-table-column
            width="100"
            prop="is_approve"
            label="TT duyệt"
            align="center"
          >
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_approve"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :disabled="row.is_approve == 1"
                :active-value="1"
                :inactive-value="0"
                @change="handleSwitch(row,'approve')"
              />
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="phone"
            label="TT HIO"
            align="center"
          >
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_sell_insurance"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="handleSwitch(row,'insurance')"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="Chuyển TT booking khi xác nhận"
            align="center"
          >
            <template slot-scope="{row}">
              <el-switch
                v-model="row.auto_confirm_sale"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="handleSwitch(row,'auto_confirm_sale')"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="day_debt"
            label="Ngày nợ"
            align="center"
          />
          <el-table-column
            label="Admin giới thiệu"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.admin_introduced ? row.admin_introduced.name : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Admin tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.admin_created_id ? row.admin_created.name: '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Admin duyệt"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.admin_approve_id ? row.admin_approve.name: '' }}
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                round
                size="mini"
                @click="showListFacility(scope.row)"
              >Giá bán
              </el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditAgency(scope.row)"
              >
                Sửa
              </el-button>
              <el-button
                v-if="['0348048435'].includes(getAcountInfo().phone)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleDeleteAgency(scope.row.id)"
              >
                Xóa
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="list-shop__footer">
          <pagination
            v-show="total > query.limit"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetList"
          />
        </el-row>
        <dialog-add-agency
          :show-dialog="showDialogAddAgency"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <dialog-detail-agency
          :show-dialog="isShowListFacility"
          :object-data="objectDataDetail"
          @onCloseDialog="handleCloseDetailAgency"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import AgencyResource from '@/api/agency'
import DialogAddAgency from '@/views/manage-booking/agency/components/DialogAddAgency'
import DialogDetailAgency from '@/views/manage-booking/agency/components/DialogDetailAgency'
import { baseURL } from '@/constant/config'
const agencyResource = new AgencyResource()

export default {
  name: 'ListTee',
  components: { Pagination, DialogAddAgency, DialogDetailAgency },
  data() {
    const account = getAcountInfo()
    console.log('account....................', account)
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      tableData: [],
      admins: [],
      loadingTable: false,
      total: 0,
      isAdd: true,
      onShowDialog: false,
      query: {
        limit: 10,
        page: 1
      },
      // currentPermissions: getPermissions(),
      loadingData: true,
      from: 0,
      isShowListFacility: false,
      optionsFacility: [],
      agencyId: 0,
      showDialogAddAgency: false,
      objectData: {},
      objectDataDetail: {}
    }
  },
  computed: {

  },
  created() {
    this.onGetList()
  },
  methods: {
    handleCloseDetailAgency() {
      this.isShowListFacility = false
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetList()
      }
    },

    onGetList() {
      this.loadingTable = true
      agencyResource.lists(this.query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res?.data?.data || []
          this.total = res?.data?.total || 0
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.onGetList()
    },
    handleSwitch(row, type) {
      let obj = {}
      switch (type) {
        case 'approve':
          obj = {
            admin_approve_id: getAcountInfo().id,
            is_approve: row.is_approve
          }
          break
        case 'insurance':
          obj = { is_sell_insurance: row.is_sell_insurance }
          break
        case 'auto_confirm_sale':
          obj = { auto_confirm_sale: row.auto_confirm_sale }
          break
      }

      agencyResource.updateStatus(obj, row.id).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          if (type === 'approve') {
            this.onGetList()
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddAgency = value.dialog
      if (value.reload) {
        this.onGetList()
      }
    },
    showListFacility(row) {
      this.isShowListFacility = true
      this.objectDataDetail = Object.assign({}, row)
    },

    handleAddAgency() {
      this.isAdd = true
      this.showDialogAddAgency = true
      this.objectData = {}
    },

    handleEditAgency(row) {
      this.isAdd = false
      this.showDialogAddAgency = true
      this.objectData = Object.assign({}, row)
    },
    handleDeleteAgency(id) {
      this.$confirm(`Bạn có chắc chắn xóa đại lý này không ?`).then((_) => {
        agencyResource.remove(id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    convertLink(value) {
      return baseURL + value
    },
    getAcountInfo
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}
.pr-5 {
  padding-right: 15px;
}
.mr-10 {
  margin-right: 10px;
}
.w-100{
  width: 100%;
}
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700px;
  text-transform: uppercase;
}
</style>

<style scoped>
p, p span {
  font-size: 12px !important;
}

span, label, th, td {
  font-size: 12px !important;
}
</style>
