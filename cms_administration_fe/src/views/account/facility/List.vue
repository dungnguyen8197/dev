<template>
  <el-row class="app-container list-account">
    <el-row class="list-account__header">
      <el-col :sm="24" style="display:flex;">
        <h3 style="margin: 0; width: 100%; padding: 10px">Danh sách sân</h3>
        <!-- <div style="width: 100%;">
          <el-button style="float:right; padding-top: 11px" type="primary" @click="handleCreateAccount">Tạo Account +
          </el-button>
        </div> -->
      </el-col>
    </el-row>
    <div class="filter-container">
      <el-input
        v-model="query.keyword"
        clearable
        placeholder="Nhập tên sân"
        style="width: 200px;"
        class="filter-item  pd-2"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Tìm kiếm
      </el-button>
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
          align="center"
          type="index"
          :index="handleIndexMethod"
        />
        <el-table-column
          prop="sub_title"
          :label="('Sân')"
          align="center"
        />
        <el-table-column
          prop="email"
          label="Email"
          align="center"
        >
          <template slot-scope="{row}">
            <template v-for="(item, index) in row.emails">
              <div v-if="index < row.emails.length - 1" :key="index" style="border-bottom: 1px solid #c9c3c3; padding: 1px">
                <span>{{ item.email }}</span>
              </div>
              <div v-else :key="index">
                <span>{{ item.email }}</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column width="200" label="Hành động" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialogChangeEmail(scope.row)"
            >Sửa
            </el-button>          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > query.limit"
          :total="total"
          :limit.sync="query.limit"
          :page.sync="query.page"
          @pagination="onGetListFacility"
        />
      </el-row>

    </el-row>

    <el-dialog title="Email Sân" :visible.sync="dialogChangeEmail">
      <el-tag
        v-for="(item, index) in emails"
        :key="index"
        class="mr-10 mb-10"
        closable
        :disable-transitions="false"
        @close="handleClose(item)"
      >
        {{ item.email }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Thêm Email</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeEmail = false">Huỷ</el-button>
        <el-button type="primary" :loading="loadingData" @click="submitChangeEmail()">Xác nhận</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
import { convertDateTimeSecond } from '@/utils/convert'
import FacilityResource from '@/api/facility'
const facilityResource = new FacilityResource()

export default {
  name: 'List',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      loadingData: false,
      dialogChangeEmail: false,
      loadingTable: false,
      total: 0,
      onShowDialog: false,
      objectData: {},
      query: {
        limit: 10,
        page: 1
      },
      admin: getAcountInfo(),
      emails: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.onGetListFacility()
  },
  methods: {
    submitChangeEmail() {
      if (this.emails.length === 0) {
        this.$message.error('Vui lòng nhập email.')
        return
      }
      this.loadingData = true
      console.log('changeEmail____________', this.emails)
      facilityResource.changeEmail(this.emails).then(res => {
        const { error_code, error_msg } = res
        if (error_code !== 0) {
          this.$message.error(error_msg)
          return
        }
        this.$message.success('Cập nhật email thành công.')
        this.dialogChangeEmail = false
        this.onGetListFacility()
      }).finally(() => {
        this.loadingData = false
      })
    },
    handleClickButtonDialog(object) {
      this.onShowDialog = object.dialog
      if (object.reload) {
        this.onGetListFacility()
      }
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(email) {
      this.emails.splice(this.emails.indexOf(email), 1)
      console.log('emails', this.emails)
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.emails.push(
          {
            email: inputValue,
            facility_id: this.facilityId
          }
        )
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onGetListFacility() {
      this.loadingTable = true
      facilityResource.lists(this.query).then(res => {
        this.tableData = res?.data?.rows || []
        this.total = res?.data?.count || 0
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleFilter() {
      this.query.page = 1
      this.onGetListFacility()
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    showDialogChangeEmail(value) {
      console.log('value____________', value)
      this.emails = []
      this.dialogChangeEmail = true
      value.emails.forEach(item => {
        this.emails.push({
          facility_id: value.id,
          email: item.email
        })
      })
      this.facilityId = value.id
      console.log('emails', this.emails)
    },
    convertDateTimeSecond
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
</style>
