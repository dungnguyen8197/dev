<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listRoles"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="STT" width="150px" align="center" type="index" />
      <el-table-column label="Tên vai trò">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hành động">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleShowDialog(row)">
            Sửa
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Danh sách Quyền" :visible.sync="dialogFormVisible">
      <el-checkbox-group v-model="query.permission_id" v-loading="dialogLoading">
        <template v-for="(permission, index) in listPermission">
          <div :key="index">
            <el-checkbox :key="permission.id" :label="permission.id" :value="permission.id">{{
              permission.descriptions
            }}
            </el-checkbox>
          </div>
        </template>
      </el-checkbox-group>
      <template>
        <el-button type="primary" size="mini" @click="updateRole(query.role_id)">
          Sửa
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import RoleResource from '@/api/roles'
import { Message } from 'element-ui'

const roleResource = new RoleResource()

export default {
  name: 'Roles',
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      listRoles: [],
      total: 1000,
      temp: '',
      dialogFormVisible: false,
      listPermission: [],
      query: {
        role_id: '',
        permission_id: []
      },
      checkbox: false,
      dialogLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      roleResource.RoleList().then(res => {
        this.listRoles = res.data
      }).finally(() => { this.listLoading = false })
    },
    handleShowDialog(row) {
      this.query.permission_id = []
      this.dialogLoading = true
      roleResource.listPermission().then(res => {
        this.listPermission = res.data
      })
      roleResource.getPermissionByRole({ role_id: row.id, user_id: 1 }).then(res => {
        const pluck = (key, array) =>
          array.reduce((values, current) => {
            values.push(current[key])
            return values
          }, [])
        this.query.permission_id = pluck('id', res.data)
      }).finally(() => { this.dialogLoading = false })
      this.dialogFormVisible = true
      this.query.role_id = row.id
    },
    updateRole(role) {
      this.dialogLoading = true
      roleResource.addPermissionToRole(this.query, role).then(res => {
        if (res.error_code === 0) {
          Message({
            message: res.error_msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.dialogFormVisible = false
          this.query = {
            role_id: '',
            permission_id: []
          }
        } else {
          Message({
            message: res.error_msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).finally(() => { this.dialogLoading = false })
    }
  }
}
</script>

<style></style>
