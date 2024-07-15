<template>
  <div class="reservation_booking">
    <el-row class="app-container list-account">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Quản lý doanh nghiệp</h3>
        </el-col>
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddCompany">Thêm mới
        </el-button>
      </el-row>
      <div class="filter-container mt-10">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 pb-10">
            <el-select
              ref="searchCompany"
              v-model="query.name"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm doanh nghiệp"
              :remote-method="onSearchCompany"
              :loading="loadingSearchCompany"
              @hook:mounted="(value) => cancelReadOnly(value, 'searchCompany')"
              @visible-change="(value) => cancelReadOnly(value, 'searchCompany')"
            >
              <el-option v-for="company in Companies" :key="company.value" :label="company.label" :value="company.label" />
            </el-select>
          </el-col>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Tìm kiếm
          </el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="onRefreshSearch">Refresh</el-button>

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
            label="Tên doanh Nghiệp "
            align="center"
          />
          <el-table-column
            label="Logo"
            align="center"
          >
            <template slot-scope="{row}">
              <el-image
                v-if="row.logo_url_path"
                style="width: 100px; height: auto"
                :src="row.logo_url_path"
              />
              <span v-else>Không có ảnh</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Background"
            align="center"
          >
            <template slot-scope="{row}">
              <el-image
                v-if="row.img_background"
                style="width: 100px; height: auto"
                :src="row.img_background"
              />
              <span v-else>Không có ảnh</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Địa chỉ"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.address ? row.address : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Giới thiệu"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.about ? row.about : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Số điện thoại"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.hotline ? row.hotline : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Email"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.email ? row.email : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="Link web"
            align="center"
          >
            <template slot-scope="{row}">
              <el-link type="success" :href="row.facebook_link" target="_blank"> {{ row.facebook_link ? row.facebook_link : '' }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="trạng thái"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag :type="row.is_public === 1 ? 'success' : 'danger'">{{ arrayYesNo[row.is_public] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="Ngày tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ convertDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Người tạo"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.admin ? row.admin.name : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="{row}">
              <el-button
                class="mb-2"
                icon="el-icon-plus"
                size="mini"
                round
                style="background-color: #3642A7; color: white"
                @click="handleListMember(row)"
              >
                DS member
              </el-button>
              <el-button
                class="mb-2"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                round
                @click="handleEditCompany(row)"
              >
                Sửa
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="handleDeleteCompany(row.id)"
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
        <dialog-add-company
          :show-dialog="showDialogAddCompany"
          :object-data="objectData"
          :is-add="isAdd"
          @onCloseDialog="handleClose"
        />
        <dialog-list-member-company
          :show-dialog="showDialogListMember"
          :object-data="objectDataListMember"
          @onCloseDialog="handleCloseListMember"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { convertDate, convertDateTime, formatDate, formatNumber } from '@/utils/convert'

import moment from 'moment'
import EventResource from '@/api/event'
import DialogAddCompany from '@/views/event/components/DialogAddCompany.vue'
import DialogListMemberCompany from '@/views/event/components/DialogListMemberCompany.vue'

const arrayYesNo = { 1: 'Hiển thị', 0: 'khóa' }

const eventResource = new EventResource()

export default {
  name: 'List',
  components: { DialogListMemberCompany, DialogAddCompany, Pagination },
  data() {
    return {
      arrayYesNo: arrayYesNo,
      tableData: [],
      loadingTable: false,
      total: 0,
      isAdd: true,
      onShowDialog: false,
      query: {
        limit: 10,
        page: 1
      },
      loadingData: true,
      from: 0,
      showDialogAddCompany: false,
      loadingSearchCompany: false,
      objectData: {},
      objectDataListMember: {},
      dateRange: '',
      Companies: [],
      showDialogListMember: false,
      statusEvent: {
        0: 'Sắp diễn ra',
        1: 'Đang diễn ra',
        2: 'Hoàn thành'
      }
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.query.start_date = moment(value[0]).unix()
        this.query.end_date = moment(value[1]).unix()
      } else {
        this.query.start_date = ''
        this.query.end_date = ''
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    convertDate,
    onRefreshSearch() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.onGetList()
    },
    handleListMember(row) {
      this.showDialogListMember = true
      this.objectDataListMember = Object.assign({}, row)
    },
    handleCloseListMember(value) {
      this.showDialogListMember = value.dialog
      if (value.reload) {
        this.query = Object.assign({}, { limit: 10, page: 1 })
        this.onGetList()
      }
    },
    convertDateTime,
    onGetList() {
      this.loadingTable = true
      eventResource.listCompany(this.query).then(res => {
        if (res.error_code === 0) {
          this.tableData = res?.data?.data || []
          this.total = res?.data?.total || 0
          console.log('this.tableData___________', this.tableData)
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
    handleIndexMethod(index) {
      return this.query.page === 1 ? this.query.page + index : this.query.page * 10 + index
    },
    onReset() {
      this.query = Object.assign({}, { limit: 10, page: 1 })
      this.dateRange = ''
      this.onGetList()
    },
    handleClose(value) {
      this.showDialogAddCompany = value.dialog
      if (value.reload) {
        this.query = Object.assign({}, { limit: 10, page: 1 })
        this.onGetList()
      }
    },

    handleAddCompany() {
      this.isAdd = true
      this.showDialogAddCompany = true
      this.objectData = {}
    },

    handleEditCompany(row) {
      this.isAdd = false
      this.showDialogAddCompany = true
      this.objectData = Object.assign({}, row)
    },
    onSearchCompany(keyword) {
      this.loadingSearchCompany = true
      eventResource.searchCompany({ keyword_company: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.paths = []
            this.Companies = result.map(value => {
              return { value: value.id, label: value.name }
            })
          } else {
            this.Companies = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchCompany = false
      })
    },
    handleDeleteCompany(id) {
      this.$confirm(`Bạn có chắc chắn xóa doanh nghiệp này không ?`).then((_) => {
        eventResource.removeCompany(id).then(res => {
          if (res.error_code === 0) {
            this.onGetList()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    formatDate, formatNumber
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

.mb-10 {
  margin-bottom: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.w-100 {
  width: 100%;
}

.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
