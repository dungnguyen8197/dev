<template>
  <el-dialog
    :title="showPopup === false ? 'Chi tiết note' : 'Chỉnh sửa note'"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="80%"
  >
    <div v-if="!showPopup">
      <el-row style="padding-bottom: 20px">
        <el-button style="float:right" type="primary" @click="onShowEditNote">Thêm note
        </el-button>
      </el-row>
    </div>
    <div v-if="!showPopup">
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
          prop="note"
          label="Note"
          align="center"
        />
        <el-table-column
          label="Người Note"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.admin">{{ scope.row.admin.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Nguồn Note"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.source_buy === 1">CMS CSKH</el-tag>
            <el-tag v-else>CMS KHTT</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày Note"
          align="center"
        >
          <template slot-scope="scope">
            {{ convertDateTimeSecond(scope.row.created_at) }}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetListNoteGolfer"
        />
      </el-row>
    </div>
    <div v-if="showPopup">
      <el-row>
        <label>Chỉnh sửa note:</label>
        <el-input v-model="listQuery.note" type="textarea" />
      </el-row>
      <el-row class="pt-2">
        <el-button style="float:right" type="primary" @click="onSubmitCreate">Thêm note
        </el-button>
      </el-row>

    </div>
  </el-dialog>
</template>

<script>
// import Vue from 'vue'
import ListGolferResource from '@/api/membership/golfer'
import { convertTypeAccount } from '@/utils/convertNumberToString'
import { convertDateTimeSecond, convertDate } from '@/utils/convert'
import Pagination from '@/components/Pagination/index.vue'
import { getAdmin } from '@/utils/auth'

const listGolferResources = new ListGolferResource()
export default {
  name: 'DialogNoteGolfer',
  components: { Pagination },
  props: {
    objDetail: {
      type: Object,
      default: () => {
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: { page: 1, limit: 10 },
      dialogVisible: false,
      tableData: [],
      from: 1,
      total: 1,
      objData: {},
      dateC: '',
      images: [],
      loadingTable: false,
      showPopup: false
    }
  },
  watch: {
    objDetail(value) {
      if (value) {
        this.listQuery = { user_id: value.id, limit: 10, page: 1 }
        this.onGetListNoteGolfer()
        this.objData = Object.assign({}, value)
      }
    },
    showDialog(value) {
      this.dialogVisible = value
    }
  },
  methods: {
    onGetListNoteGolfer() {
      this.loadingTable = true
      listGolferResources.listNoteUser(this.listQuery).then(response => {
        if (response.error_code === 0) {
          this.tableData = response.data.data
          this.total = response.data.total || 0
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },

    async onSubmitCreate() {
      this.listQuery = {
        admin_id: getAdmin().id,
        source_buy: 1,
        user_id: this.listQuery.user_id,
        note: this.listQuery.note
      }
      listGolferResources.createNote(this.listQuery).then(response => {
        this.loadingSubmit = true
        if (response.error_code === 0) {
          this.$message.success(response.error_msg)
          this.$emit('onClickCloseDialog', { dialog: true, reload: true })
        } else {
          this.$message.error(response.error_msg)
        }
      })
    },

    handleClose(done) {
      this.dialogVisible = false
      this.showPopup = false
      this.$emit('clickButton', false)
      done()
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    indexMethod(index) {
      return index + this.from
    },
    onShowEditNote() {
      this.showPopup = true
    },

    convertTypeAccount,
    convertDateTimeSecond,
    convertDate
  }
}
</script>

<style scoped>
.w-100 {
  width: 80%;
}

.padding-style {
  padding-bottom: 15px;
}
</style>
