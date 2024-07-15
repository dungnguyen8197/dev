<template>
  <el-dialog
    title="Danh sách thành viên doanh nghiệp"
    :visible.sync="showDialog"
    :before-close="handleClose"
    fullscreen
    center
  >
    <el-row>
      <el-col class="mb-10">
        <el-button style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddMemberCompany">
          Thêm mới
        </el-button>
      </el-col>
    </el-row>
    <el-row style="margin:20px; font-family:Sans-serif">
      <div class="filter-container" />
      <el-row style="width: 100%;">
        <el-table v-loading="loadingTable" :data="tableData" border style="width: 100%;">
          <el-table-column label="STT" width="100" align="center" type="index" :index="handleIndexMethod" />
          <el-table-column prop="user_id" label="vID" align="center">
            <template slot-scope="{row}">
              {{ `vID${row.user_id}` }}
            </template>
          </el-table-column>
          <el-table-column label="Họ tên" align="center">
            <template slot-scope="{row}">
              {{ row.user ? row.user.fullname : '' }}
            </template>
          </el-table-column>
          <el-table-column label="Quyền" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.is_moderator === 1 && row.is_user_admin === 1" type="success">Chủ tịch</el-tag>
              <el-tag v-else-if="row.is_moderator === 1" type="primary">Ban điều hành</el-tag>
              <el-tag v-else-if="row.is_moderator === 0" type="primary">thành viên</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="{row}">
              <!--              <el-button-->
              <!--                v-if="row.is_user_admin !== 1"-->
              <!--                class="mb-5"-->
              <!--                type="warning"-->
              <!--                icon="el-icon-edit"-->
              <!--                size="mini"-->
              <!--                round-->
              <!--                @click="handleEditCompany(row)"-->
              <!--              >-->
              <!--                Sửa-->
              <!--              </el-button>-->
              <el-button
                v-if="row.is_user_admin !== 1"
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
        <el-row class="list-device__footer">
          <pagination
            v-show="total >= query.limit"
            style="padding: 0"
            :total="total"
            :limit.sync="query.limit"
            :page.sync="query.page"
            @pagination="onGetListMember"
          />
        </el-row>
      </el-row>
    </el-row>
    <el-dialog
      width="50%"
      title="thêm thành viên"
      :visible.sync="innerVisible"
      :before-close="handleCloseDialog"
      append-to-body
    >
      <el-form ref="ruleForm" v-loading="dialogLoading" class="demo-ruleForm">
        <el-row>
          <el-col>
            <el-form-item label="vID thành viên:" required>
              <el-form-item prop="user_id">
                <el-select
                  v-model="formRequest.user_id"
                  class="w-100"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="Tìm kiếm mã VID"
                  :remote-method="onSearchGolfer"
                  :loading="loadingSearchUser"
                >
                  <el-option v-for="user in users" :key="user.value" :label="user.label" :value="user.value" />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Quyền thành viên:">
              <el-select
                v-model="roles"
                placeholder="Quyền thành viên"
              >
                <el-option
                  v-for="level in arrayRole"
                  :key="level.value"
                  :label="level.label"
                  :value="level.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">Hủy</el-button>
        <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">Thêm mới</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import EventResource from '@/api/event'
const eventResource = new EventResource()
const golferResource = new GolferResource()

import Pagination from '@/components/Pagination/index.vue'
import GolferResource from '@/api/golfer/golfer'
// import { isEmpty } from '@/utils/validate'
const arrayRole = [
  { value: 1, label: 'Ban điều hành' },
  { value: 2, label: 'Thành viên' }
]
export default {
  name: 'DialogListMemberCompany',
  components: {
    Pagination
    // Pagination
  },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      arrayRole: [...arrayRole],
      users: [],
      innerVisible: false,
      loadingTable: false,
      query: { page: 1, limit: 10 },
      total: 10,
      tableData: [],
      loadingSearchUser: false,
      showDialogAddEvent: false,
      dialogLoading: false,
      formRequest: {
        is_user_admin: 0,
        is_moderator: 0,
        is_treasurer: 0,
        invited_by_user_id: null,
        is_accepted: 1,
        is_banner_post_club: 0,
        user_id: null,
        is_vice_president: 0,
        is_captain: 0,
        is_general_secretary: 0
      },
      loadingSubmit: false,
      event_id: 0,
      listImage: [],
      uploadFileLoading: false,
      listRemoveFile: [],
      files: [],
      roles: ''

    }
  },
  watch: {
    objectData(value) {
      if (value) {
        this.query.club_id = value.id
        this.formRequest.club_id = value.id
        this.onGetListMember()
      }
    },
    roles(value) {
      if (value === 1) {
        this.formRequest = {
          is_user_admin: 0,
          is_moderator: 1,
          is_treasurer: 0,
          invited_by_user_id: null,
          is_accepted: 1,
          is_banner_post_club: 0,
          is_vice_president: 0,
          is_captain: 0,
          is_general_secretary: 0,
          club_id: this.objectData.id,
          user_id: this.formRequest.user_id
        }
      } else {
        this.formRequest = {
          is_user_admin: 0,
          is_moderator: 0,
          is_treasurer: 0,
          invited_by_user_id: null,
          is_accepted: 1,
          is_banner_post_club: 0,
          is_vice_president: 0,
          is_captain: 0,
          is_general_secretary: 0,
          club_id: this.objectData.id,
          user_id: this.formRequest.user_id
        }
      }
    }
  },
  created() {
  },
  methods: {
    handleEditCompany(row) {
      this.isAdd = false
      this.showDialogAddEvent = true
      this.objectData = Object.assign({}, row)
    },
    handleDeleteCompany(id) {
      this.$confirm(`Bạn có chắc chắn xóa thành viên này không ?`).then((_) => {
        eventResource.removeMemberCompany(id).then(res => {
          if (res.error_code === 0) {
            this.onGetListMember()
            this.$message.success(res.error_msg)
          } else {
            this.$message.error(res.error_msg)
          }
        })
      })
    },
    onSearchGolfer(keyword) {
      golferResource.searchGolfer({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              const label = `vID${value.id} - ${value.fullname}`
              return { value: value.id, label: label, phone: value.phone }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    async onGetListMember() {
      this.loadingTable = true
      eventResource.listMemberCompany(this.query).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.tableData = res.data.data
          this.total = data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleAddMemberCompany() {
      this.innerVisible = true
    },
    handleCloseDialog() {
      this.innerVisible = false
      this.onResetDialog()
    },
    onSubmitForm() {
      eventResource.storeMemberCompany(this.formRequest).then(async res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.innerVisible = false
          this.onResetDialog()
          await this.onGetListMember()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    onResetDialog() {
      this.formRequest = Object.assign({}, { })
    },
    handleIndexMethod(index) {
      return this.query.page === 1
        ? this.query.page + index
        : (this.query.page - 1) * this.query.limit + index + 1
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>

