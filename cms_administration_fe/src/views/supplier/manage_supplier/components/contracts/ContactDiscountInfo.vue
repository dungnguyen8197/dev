<template>
  <div class="id">
    <el-row class="search-wrapper">
      <el-row :sm="24" style="display: flex; justify-content: space-between">
        <el-col
          :sm="12"
          style="
            justify-content: flex-start;
            display: flex;
            align-items: center;
          "
        >
          <h3>III. {{ "Thông tin chiết khấu" }}</h3>
        </el-col>
        <el-col
          :sm="12"
          style="
            justify-content: flex-end;
            display: flex;
            margin-bottom: 25px;
            align-items: center;
          "
        >
          <el-button
            v-if="approve < 1"
            type="primary"
            style="margin-left: 10px; font-size: 16px; font-weight: 400"
            @click="createDiscount"
          >{{ "Thêm mới" }}</el-button>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column prop="id" :label="'ID'" width="90" align="center" />
          <!-- <template slot-scope="scope">
            <el-link type="primary" @click="onShowDialogDetail(scope.row)">{{ `#${scope.row.id}` }}</el-link>
          </template>
        </el-table-column> -->
          <el-table-column
            prop="name"
            :label="'Tên chiết khấu'"
            align="center"
          />
          <el-table-column
            prop="type_name"
            :label="'Loại chiết khấu'"
            align="center"
          />
          <el-table-column :label="'Giá trị'" align="center">
            <template slot-scope="scope">
              <span style="font-size: 16px; color: black">{{
                scope.row.value
                  ? scope.row.value + "%"
                  : scope.row.discount
                    ? scope.row.discount + "%"
                    : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'Điều kiện từ'" align="center">
            <template slot-scope="scope">
              <span style="font-size: 16px; color: black">{{
                scope.row.condition_from
                  ? "price_vnd_2".format(formatNumber(scope.row.condition_from))
                  : scope.row.type === 2
                    ? "not_apply"
                    : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'Điều kiện đến'" align="center">
            <template slot-scope="scope">
              <label
                style="font-size: 16px; color: black; font-weight: normal"
              >{{
                scope.row.condition_to
                  ? "price_vnd_2".format(formatNumber(scope.row.condition_to))
                  : scope.row.type === 2
                    ? "not_apply"
                    : ""
              }}</label>
            </template>
          </el-table-column>
          <el-table-column
            prop="category_name"
            :label="'Nhóm hàng'"
            align="center"
          />
          <el-table-column :label="'Trạng thái'" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.active === 1 ? 'success' : 'danger'">{{
                scope.row.active === 1 ? "Hoạt động" : "Tạm dừng"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="'Hành động'" align="center" width="120">
            <template slot-scope="scope">
              <!-- <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" /> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="onDeletePress(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <dialog-create-discount-vue
        :show-dialog="onShowDialogCreateDiscount"
        @onClickButtonDialog="onHandlerEventDiscount"
      />
    </el-row>
  </div>
</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
import { getAcountInfo } from '@/utils/auth'
import DialogCreateDiscountVue from './DialogCreateDiscount.vue'
import { formatNumber } from '@/utils/convert'
// import i18n from '@/lang/i18n'
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()

export default {
  name: 'ContractDiscountInfo',
  components: { DialogCreateDiscountVue },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: Number,
      default() {
        return 0
      }
    },
    isNew: {
      type: Boolean,
      default: false
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
      tableData: [],
      onShowDialogCreateDiscount: false,
      approve: 0,
      contract_id: 0
    }
  },
  methods: {
    setData(data, contract_id) {
      this.tableData = [...data]
      this.contract_id = contract_id
    },
    setApprove(approve) {
      this.approve = approve
    },
    onHandlerEventDiscount(obj) {
      const { data } = obj
      console.log(
        '.......... them so tai kgoan ngan hang',
        JSON.stringify(data)
      )
      const body = Object.assign({}, data)
      this.onShowDialogCreateDiscount = false
      if (data) {
        if (!this.isNew) {
          body.contract_id = this.contract_id
          this.requestUploadDiscount(body, () => {
            data.id = this.tableData.length + 1
            this.tableData.push(data)
          })
        } else {
          data.id = this.tableData.length + 1
          this.tableData.push(data)
        }
      }
    },
    requestUploadDiscount(body, callback = null) {
      this.loadingTable = true
      supplierResource
        .upload_discount(body)
        .then((res) => {
          this.loadingTable = false
          const { error, msg } = res
          if (error === 0) {
            this.$message.success(msg)
            if (callback) {
              callback()
            }
          } else {
            this.$message.error(msg)
          }
        })
        .catch((_err) => {
          this.loadingTable = false
        })
    },
    getInfo() {
      return this.tableData
    },
    createDiscount() {
      // this.$router.push({ path: `/contract?shop_id=${this.shopId}` })
      this.onShowDialogCreateDiscount = true
      // this.$emit('discountHandler', {
      //   createDiscount: true,
      //   reload: true
      // })
    },
    onDeletePress(row) {
      this.$confirm(`Xác nhận xóa chiết khấu:  ${row.name}`)
        .then((_) => {
          const body = {
            id: row.id
          }
          supplierResource.detele_discount(body).then((response) => {
            const { error, msg } = response
            if (error === 0) {
              this.$message.success(msg)
              const index = this.tableData.findIndex((d) => d.id === row.id)
              if (index !== -1) {
                this.tableData.splice(index, 1)
              }
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch((_) => {})
    },
    requestListContractActive() {
      this.loadingTable = true
      supplierResource
        .list_contract_active(this.shopId)
        .then((res) => {
          this.loadingTable = false
          const { error, data } = res
          if (error === 0) {
            this.tableData = data
          }
        })
        .catch((err) => {
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
    },
    formatNumber
  }
}
</script>

<style lang="scss" scoped>
.id {
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
.row-item-2 {
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
.row-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.row-row-first {
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
