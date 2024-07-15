<template>
  <div id="permission-page">
    <el-row style="display: ruby; width: 100%; padding: 0px 30px;">
      <p style="margin-right: 10px;" @click="onBack"><i class="el-icon-back" /></p>
      <h3 style="font-size: 26px; display: inherit;">{{ ('Thông tin quyền') }}</h3>
    </el-row>

    <div style="width: 100%; height: 100%; padding: 0px 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h5>Tài khoản: {{ accountSelect.name }}</h5>
        <div style="display: flex; justify-content: space-between;align-items: center; margin-bottom: 10px;">
          <el-select
            v-model="menu_add_id"
            style="width: 250px; margin-right: 10px;"
            class="select1"
            placeholder="Thêm nhóm quyền"
            @change="handleSelectPermission"
          >
            <el-option
              v-for="item in permissionsOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button style="float: right;" icon="el-icon-refresh" :loading="loading" @click="onRefreshPress">Làm mới</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="tablePermission" align="center" border>
        <el-table-column prop="id" label="Id" width="90" align="center" />
        <el-table-column prop="name" label="Nhóm quyền" width="170" align="center" />
        <el-table-column prop="name" label="Thiết lập quyền" align="left">
          <template slot-scope="scope">
            <div style="display: flex; flex-wrap: wrap; justify-content: left; width: 100%;">
              <!-- <el-checkbox
                v-for="item in scope.row.list_sub_permission"
                :key="item.name"
                :value="item.active"
                style="width: 30%; height: 30px; display: flex; justify-content: left; align-items: center; margin:0px"
                @change="handleCheckAllChange"
              >{{ item.name }}
              </el-checkbox> -->
              <div v-for="item in scope.row.list_sub_permission" :key="item.key" style="width: 30%; margin-left: 2%">
                <el-checkbox :v-model="item.key" :label="item.name" :checked="item.active" @change="handleChecked(scope.row.id, item)" />
              </div>
              <!-- <el-checkbox-group
                :v-model="list"
                @change="handleCheckAllChange"
              >
                <el-checkbox
                  v-for="item in scope.row.list_sub_permission"
                  :key="item.key"
                  :label="item.active"
                  :value="item.active"
                > {{ item.name }} </el-checkbox>
              </el-checkbox-group> -->
              <!-- <el-checkbox-group v-model="list" style="display: flex; flex-wrap: wrap;">
                <template
                  v-for="item in scope.row.list_sub_permission"
                >
                  <el-checkbox
                    :key="item.key"
                    style="width: 30%;"
                    :label="item.key"
                    @change="handleChecked(scope.row.id, item)"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </template>
              </el-checkbox-group> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active" :active-value="1" :inactive-value="0" active-color="#13ce66" @change="onChangeActive(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div v-if="list_permissions.length" slot="footer" style="margin-top: 20px; float: right;">
        <el-button @click="handleClose">Hủy bỏ</el-button>
        <el-button type="primary" :loading="loadingSubmit" @click="submitPermission">{{ "Lưu thay đổi" }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ManagePermissionResource from '@/api/manage_supplier/permission'

const managePermissionResource = new ManagePermissionResource()

export default {
  name: 'EditPermission',
  data() {
    return {
      accountSelect: {},
      tablePermission: [],
      permissionRender: {},
      permissionsOption: [],
      loadingSubmit: false,
      loading: false,
      list: [],
      list_old: [],
      is_change: false,
      list_permissions: [],
      menu_add_id: 0
    }
  },
  watch: {
    list(val) {
      console.log('..............handl ', JSON.stringify(val))
    }
  },
  mounted() {
    // this.getPermissionAdd()
    this.accountSelect = this.$route.params
    console.log('qqqqqqqqqqqqqqqq', JSON.stringify(this.accountSelect))
    if (Object.keys(this.accountSelect).length > 0) {
      this.getPermissionAccount()
      this.getPermissionAdd()
    } else {
      this.$message.error('Lỗi khi lấy thông tin tài khoản')
      this.onBack()
    }
  },
  methods: {
    onBack() {
      this.$router.back()
    },
    onRefreshPress() {
      this.getPermissionAccount()
    },
    handleChecked(row_id, obj_sub_permision) {
      console.log('...........check all ', row_id, JSON.stringify(obj_sub_permision))
      // console.log('...........check all ', JSON.stringify(item))
      const { active, key } = obj_sub_permision
      const value = active ? 1 : 2 // lay nguoc lai gia tri
      const obj = this.list_permissions.find(d => d.id === row_id)
      obj_sub_permision.active = !active
      // const list_sub_permission = this.tablePermission.find(d => d.id === row_id).list_sub_permission
      // const check = list_sub_permission.find(d => d.key === key)
      if (obj) {
        obj[key] = value
      } else {
        const obj = {}
        obj[key] = value
        obj['id'] = row_id
        this.list_permissions.push(obj)
      }
    },
    addPermissionConfirm(id) {
      this.$confirm('Bạn có chắc thêm nhóm quyền này?', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.addPermissionToAccount(id)
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleSelectPermission(id) {
      console.log('groupPermission', id)
      this.addPermissionConfirm(id)
    },
    submitPermission() {
      console.log('..........list permisison ', JSON.stringify(this.list_permissions))
      if (!this.list_permissions.length) return
      this.loadingSubmit = true
      // const menus = this.tablePermission.map(item => {
      //   const dataPush = {
      //     id: item.id
      //   }
      //   this.permissionRender[item.menu_id].data.forEach(subItem => {
      //     dataPush[subItem.nameId] = subItem.active ? 1 : 0
      //     // dataPush.name = item.name
      //   })
      //   return dataPush
      // })
      this.$confirm(`Bạn có chắc muốn lưu lại thay đổi?`, {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        managePermissionResource.updateSubPermission({ account_id: this.accountSelect.id, menus: this.list_permissions }).then(res => {
          const { error, msg } = res
          console.log('............cap nhat sub quyen ', JSON.stringify(res))
          if (error === 0) {
            this.list_permissions = []
            this.list = []
            this.$message.success(msg)
            this.onBack()
          } else {
            this.$message.error(msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('Cập nhật quyền thất bại')
        }).finally(() => {
          this.loadingSubmit = false
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    addPermissionToAccount(id) {
      managePermissionResource.addMenuToAccount({ account_id: this.accountSelect.id, menu_id: id }).then(res => {
        const { error } = res
        if (error === 0) {
          this.menu_add_id = 0
          this.getPermissionAccount()
          this.getPermissionAdd()
          this.$message.success('Thêm quyền thành công')
        }
        // this.onBack()
      }).catch(err => {
        console.log(err)
        this.$message.error('Lỗi khi thêm quyền')
      })
      console.log('addPermission')
    },
    getPermissionAccount() {
      this.loading = true
      managePermissionResource.listPermissionOfAccount({ account_id: this.accountSelect.id }).then(res => {
        console.log('getPermissionAccount: ', JSON.stringify(res))
        this.loading = false
        const { error, data } = res
        if (error === 0) {
          this.tablePermission = data
          // this.permissionRender
          this.tablePermission.forEach(item => {
            // this.permissionRender[item.menu_id].data.forEach(subItem => {
            //   subItem.active = item[subItem.nameId] === 1
            // })
            let { is_supper_admin, is_add, is_edit, is_delete, is_view, sort_name, is_export } = item
            is_supper_admin = parseInt(is_supper_admin) || 0
            is_add = parseInt(is_add) || 0
            is_edit = parseInt(is_edit) || 0
            is_delete = parseInt(is_delete) || 0
            is_view = parseInt(is_view) || 0
            is_export = parseInt(is_export) || 0
            sort_name = sort_name ? sort_name.trim().toLowerCase() : ''
            const list_sub_permission = []
            if (is_supper_admin) {
              list_sub_permission.push({
                key: 'is_super_admin',
                name: 'Super admin(Full quyền)',
                active: false
              })
            } else {
              if (is_add) {
                const active = is_add - 1
                list_sub_permission.push({
                  key: 'is_add',
                  name: 'Thêm mới ' + sort_name,
                  active: active > 0
                })
              }
              if (is_edit) {
                const active = is_edit - 1
                list_sub_permission.push({
                  key: 'is_edit',
                  name: 'Chỉnh sửa ' + sort_name,
                  active: active > 0
                })
              }
              if (is_delete) {
                const active = is_delete - 1
                list_sub_permission.push({
                  key: 'is_delete',
                  name: 'Xóa ' + sort_name,
                  active: active > 0
                })
              }
              if (is_view) {
                const active = is_view - 1
                list_sub_permission.push({
                  key: 'is_view',
                  name: 'Xem danh sách ' + sort_name,
                  active: active > 0
                })
              }
              if (is_export) {
                const active = is_export - 1
                list_sub_permission.push({
                  key: 'is_export',
                  name: 'Xuất Excel',
                  active: active > 0
                })
              }
            }
            // this.list = list_sub_permission.filter(d => d.active).map(d => d.key)
            item.list_sub_permission = list_sub_permission
            this.list_old = []
            console.log('............ list permission : ', JSON.stringify(list_sub_permission), JSON.stringify(this.list))
          })
        }
        // this.groupPermission = res.data.map(item => item.id)
      }).catch(err => {
        this.loading = false
        console.log(err)
        this.$message.error('Lỗi khi lấy danh sách quyền')
      })
    },
    getPermissionAdd() {
      managePermissionResource.listMenuForAdd({ account_id: this.accountSelect.id }).then(res => {
        const { error, data } = res
        console.log('.............list menu add ', JSON.stringify(res))
        if (error === 0) {
          this.permissionsOption = [{ id: 0, name: 'Thêm nhóm quyền' }, ...data]
          this.permissionsOption.forEach(item => {
            item.value = item.id
            item.label = item.name
          })
        }
      }).catch(err => {
        console.log(err)
        // this.$message.error('Lỗi khi lấy danh sách quyền')
      })
    },
    handleChangeActiveMenu(row) {
      managePermissionResource.changeActiveMenu({ account_id: this.accountSelect.id, id: row.id }).then(res => {
        const { error, msg } = res
        if (error === 0) {
          this.getPermissionAccount()
          this.getPermissionAdd()
          this.list_permissions = []
          this.list = []
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('Lỗi khi thay đổi trạng thái quyền')
      })
    },
    changeActiveMenuConfirm(row) {
      console.log(row, 'changeActiveMenuConfirm')
      this.$confirm(`Bạn có chắc muốn thay đổi trạng thái quản lý ${row.sort_name}?`, {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.handleChangeActiveMenu(row)
      }).catch(() => {
        this.tablePermission.forEach(item => {
          if (item.menu_id === row.menu_id) {
            item.active = item.active ? 0 : 1
          }
        })
        console.log('cancel')
      })
    },
    onChangeActive(row) {
      this.changeActiveMenuConfirm(row)
    },
    handleClose() {
      this.onBack()
    }
  }
}
</script>
<style scoped>
#permission-page {
  margin: 20px 20px;
}

</style>
