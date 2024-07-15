<template>
  <div class="id">
    <el-row class="search-wrapper">
      <el-row v-if="isApprove === 0" :sm="24">
        <el-col :sm="24" style="justify-content: flex-start; display: flex; align-items: center;">
          <h5>{{ stt }}. {{ ('Thông tin hợp đồng') }}</h5>
        </el-col>
        <el-col :sm="24" style="justify-content: flex-start; display: flex; align-items: center;">
          <el-button style="margin-bottom: 10px; font-size: 13px;font-weight: 400; " @click="createContract">+ Thêm mới hợp đồng</el-button>
        </el-col>
      </el-row>
      <el-row style="display: flex;">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            :label="('ID')"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-link type="primary" @click="onDetailPress(scope.row)">{{ `#${scope.row.id}` }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="('Tên hợp đồng')"
            align="center"
          />
          <el-table-column
            prop="type_name"
            :label="('Loại hợp đồng')"
            align="center"
          />
          <el-table-column
            prop="date_sign"
            :label="('Ngày ký')"
            align="center"
          />
          <el-table-column
            prop="account_sign_name"
            :label="('Người ký')"
            align="center"
          />
          <el-table-column
            :label="('Tình trạng')"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ (scope.row.active === 1) ? ('Đã kích hoạt') : ('Đã ẩn') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="('Trạng thái')"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="(scope.row.approve === 1) ? 'success' : 'danger'">{{ (scope.row.approve === 1) ? ('approve') : (scope.row.approve === 2 ? ('Từ chối') : ('Chờ duyệt')) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="account_approve_name"
            :label="('Người duyệt')"
            align="center"
          />
          <el-table-column
            prop="approve_date"
            :label="('Ngày duyệt')"
            align="center"
          />
          <el-table-column :label="('Hành động')" align="center">
            <template slot-scope="scope">
              <!-- <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" /> -->
              <el-button
                size="small"
                :title="('Bật bản hợp đồng')"
                type="primary"
                icon="el-icon-check"
                circle
                @click="onActivePress(scope.row)"
              />
              <el-button
                size="small"
                :title="('Tắt bản hợp đồng')"
                type="danger"
                icon="el-icon-close"
                circle
                @click="onInActivePress(scope.row)"
              />
              <el-button size="small" :title="('Xóa hợp đồng')" type="danger" icon="el-icon-delete" circle @click="onDeletePress(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </div>
</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
import { getAcountInfo } from '@/utils/auth'
// import i18n from '@/lang/i18n'
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()

export default {
  name: 'ContractInfo',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: Number,
      default() { return 0 }
    },
    isNew: {
      type: Boolean,
      default: false
    },
    stt: {
      type: String,
      default: 'II'
    },
    // eslint-disable-next-line vue/prop-name-casing
    isApprove: {
      type: Number,
      default() { return 0 }
    }
  },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      loadingTable: false,
      isCreate: false,
      isUpdate: false,
      tableData: []
    }
  },
  methods: {
    // setApprove() {
    //   this.is_approve = 1
    //   console.log('.......... set approve ', this.is_approve)
    // },
    onActivePress(row) {
      this.requestChangeStateContact(row, 1)
    },
    onInActivePress(row) {
      this.requestChangeStateContact(row, 0)
    },
    onDetailPress(row) {
      this.$router.push({ path: `/contract?shop_id=${this.shopId}&id=${row.id}` })
    },
    createContract() {
      this.$router.push({ path: `/contract?shop_id=${this.shopId}&create=1` })
    },
    onDeletePress(row) {
      this.requestDeleteContract(row)
    },
    requestChangeStateContact(row, active = 1) {
      const msg = active === 1 ? `Bạn có chắc muốn kích hoạt hợp đồng : ${row.name}` : `Bạn có chắc muốn ẩn hợp đồng: ${row.name}`
      this.$confirm(msg).then(_ => {
        const body = {
          id: row.id,
          active: active
        }
        supplierResource.contract_change_state(body).then(response => {
          const { error, msg } = response
          if (error === 0) {
            this.$message.success(msg)
            const obj = this.tableData.find(d => d.id === row.id)
            if (obj) {
              obj.active = active
            }
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(_ => {})
    },
    requestDeleteContract(row) {
      this.$confirm(`Bạn có chắc muốn xóa hợp đồng: ${row.name}`).then(_ => {
        const body = {
          id: row.id,
          shop_id: this.shopId
        }
        supplierResource.delete_contract(body).then(response => {
          const { error, msg } = response
          if (error === 0) {
            this.$message.success(msg)
            const index = this.tableData.findIndex(d => d.id === row.id)
            if (index !== -1) {
              this.tableData.splice(index, 1)
            }
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(_ => {})
    },

    requestListContractActive() {
      this.loadingTable = true
      supplierResource.list_contract_active(this.shopId).then(res => {
        this.loadingTable = false
        const { error, data } = res
        console.log('.......... list hop dong : ', JSON.stringify(res))
        if (error === 0) {
          this.tableData = data
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('............ danh sach nha cung cap : ', err)
      })
    },
    /**
     * Lấy list hợp đồng cần duyệt
     */
    requestListContactForApprove() {
      this.loadingTable = true
      supplierResource.list_contact_not_approve().then(res => {
        this.loadingTable = false
        const { error, data } = res
        console.log('.......... list hop dong : ', JSON.stringify(res))
        if (error === 0) {
          this.tableData = data
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('............ danh sach nha cung cap : ', err)
      })
    },
    /**
       * tra ra thong tin nguoi lien he
      */
    onEditPress() {
      this.disable = false
      this.isUpdate = true
      this.isCreate = false
      this.show_btn = (this.isCreate || this.isUpdate) && this.shopId
      this.provinces_search = [...this.listProvinces]
      this.provinces = [...this.listProvinces]
    },
    onCreatePress() {
      this.disable = false
      this.isUpdate = false
      this.isCreate = true
      this.show_btn = (this.isCreate || this.isUpdate) && this.shopId
      this.resetAllInfo()
    },
    onShowDialogShopDetail(url) {
      this.url_image = url
      this.showDialogShopDetail = true
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogShopDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
      }
    },
    handleClickDialogShop(object) {
      console.log('--------------------------------dialog', object)
      this.onShowDialog = object.dialog
      if (object.reload) {
        // this.onGetListShop()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.id{
  background-color: #ffffff;
}
.search-wrapper {
  margin-bottom: 40px;
  padding: 25px;
  border: 1px solid #ebeef5;
}
        .app-container {
        padding: 15px;
      }
      .row-item {
        display: table;
        background-color: blue($color: #000000);
        width: 270px;
      }
      .row-item-left {
        display: table;
        background-color: blue($color: #000000);
        width: 270px;
        margin-left: 1em;
      }
      .row-item-2{
        display: table;
        width: 260px;
      }
      .select-item {
        margin-top: 10px;
        width: 270px;
      }
      .select-item-2 {
        margin-top: 10px;
        width: 260px;
      }
      .text-lable {
        margin-right: 10px;
        font-size: 16px;
        font-weight: 400;
      }
      .item-label {
        font-size: 16px;
        font-weight: 400;
      }
      .row-row{
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
      .row-row-first{
        display: flex;
        justify-content: flex-end;
        // margin-top: 10px;
      }
      .el-col-24 {
        // width: 100%;
      }
      .mb-10 {
        margin-left: 2em;
      }
</style>
