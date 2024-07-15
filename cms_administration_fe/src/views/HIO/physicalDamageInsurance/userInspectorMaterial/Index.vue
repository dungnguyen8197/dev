<template>
  <div class="p-10">
    <el-row class="mb-10">
      <el-col :span="12">
        <h4>Danh sách người giám sát</h4>
        <el-button round icon="el-icon-refresh" size="mini" @click="onGetList">Tải lại</el-button>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="mini" @click="dialogVisible = true">Thêm người giám sát +</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        v-loading="loadingTable"
        :data="dataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="STT"
          :index="handleIndexMethod"
          width="50"
          align="center"
        />
        <el-table-column
          prop="user_id"
          label="vID"
          align="center"
        />
        <el-table-column label="Tên User">
          <template slot-scope="{row}">
            <span>{{ row.User?.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sân">
          <template slot-scope="{row}">
            <span>{{ row.Facility?.sub_title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" align="center" width="100px">
          <template slot-scope="{row}">
            <el-button type="danger" size="mini" @click="onDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total >= listQuery.number"
        :total="total"
        :limit.sync="listQuery.number"
        :page.sync="listQuery.page"
        @pagination="onGetList"
      />
    </el-row>
    <el-dialog
      title="Thêm người giám sát"
      :visible.sync="dialogVisible"
      @close="closeDialog"
    >
      <el-form :model="formCreate" label-width="100px">
        <el-row class="p-10">
          <label>User: </label>
          <search-user @selection-changed-user="changeUser" />
        </el-row>
        <el-row class="p-10">
          <label>Sân: </label>
          <search-facility @selection-changed-facility="changeFacility" />
        </el-row>
        <el-row>
          <el-button @click="closeDialog">Hủy</el-button>
          <el-button type="primary" @click="onCreate">Thêm</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import PhysicalDamegeInsurance from '@/api/HIO/physicalDamegeInsurance'
import SearchUser from '@/views/component/SearchUser.vue'
import SearchFacility from '@/views/component/SearchFacility.vue'
import { getAdmin } from '@/utils/auth'
import { isEmpty } from '@/utils/validate'
const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()

export default {
  name: 'UserInspectorMaterial',
  components: { SearchFacility, SearchUser, Pagination },
  data() {
    return {
      dataTable: [],
      loading: false,
      listQuery: {
        page: 1,
        number: 10
      },
      total: 1000,
      loadingTable: false,
      dialogVisible: false,
      formCreate: {}
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      physicalDamageInsuranceProductResource.listUserInspector(this.listQuery).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.dataTable = res.data
          // this.total = res.data.total
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: err.error_msg,
          type: 'error'
        })
      }).finally(() => {
        this.loadingTable = false
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.number + index + 1
    },
    closeDialog() {
      this.dialogVisible = false
    },
    changeUser(user) {
      console.log('user........................', user)
      this.formCreate.user_id = user.value
    },
    changeFacility(facility) {
      console.log('facility........................', facility)
      this.formCreate.facility_id = facility.value
    },
    onCreate() {
      this.formCreate.cms_id = getAdmin().id
      this.formCreate.type = 1
      console.log('formCreate........................', this.formCreate)
      if (isEmpty(this.formCreate.user_id)) {
        this.$message({
          message: 'Vui lòng chọn user',
          type: 'error'
        })
        return
      }

      if (isEmpty(this.formCreate.facility_id)) {
        this.$message({
          message: 'Vui lòng chọn sân',
          type: 'error'
        })
        return
      }

      physicalDamageInsuranceProductResource.createUserInspector(this.formCreate).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.$message({
            message: 'Thêm thành công',
            type: 'success'
          })
          this.onGetList()
          this.closeDialog()
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: err.error_msg,
          type: 'error'
        })
      })
    },
    onDelete(row) {
      this.$confirm('Bạn có chắc chắn muốn xóa người giám sát này?', 'Cảnh báo', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        console.log('row................', row)
        const data = {
          user_id: row.user_id,
          facility_id: row.facility_id,
          cms_id: getAdmin().id,
          type: 2
        }
        console.log('data................', data)
        physicalDamageInsuranceProductResource.createUserInspector(data).then(res => {
          console.log('res................', res)
          if (res.error_code === 0) {
            this.$message({
              message: 'Xóa thành công',
              type: 'success'
            })
            this.onGetList()
          }
        }).catch(err => {
          this.$message({
            message: err.error_msg,
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Đã hủy xóa'
        })
      })
    }
  }
}

</script>
