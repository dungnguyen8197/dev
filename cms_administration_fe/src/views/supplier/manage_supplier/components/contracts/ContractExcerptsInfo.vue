<template>
  <div class="id">
    <el-row class="search-wrapper">
      <el-row :sm="24" style="display: flex; justify-content: space-between;">
        <el-col :sm="12" style="justify-content: flex-start; display: flex; align-items: center;">
          <h3>IV. {{ ('Danh sách trích lục') }}</h3>
        </el-col>
        <el-col :sm="12" style="justify-content: flex-end; display: flex; margin-bottom:20px; align-items: center;">
          <el-button v-if="approve < 1" type="primary" style="margin-left: 10px; font-size: 16px;font-weight: 400;" @click="createExerpts">{{ ('Thêm mới ') }}</el-button>
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
            prop="id"
            :label="('ID')"
            width="90"
            align="center"
          />
          <!-- <template slot-scope="scope">
            <el-link type="primary" @click="onShowDialogDetail(scope.row)">{{ `#${scope.row.id}` }}</el-link>
          </template>
        </el-table-column> -->
          <el-table-column
            prop="name"
            :label="('Tên trích lục')"
            align="center"
            width="200"
          />
          <el-table-column
            prop="list_link"
            :label="('Link chi tiết')"
            align="center"
          >
            <template slot-scope="scope">
              <el-col v-for="item in scope.row.listFile" :key="item.id">
                <el-row>
                  <span style="font-size: 16px; color: #406EE2; font-style: italic;" @click="onDetailPress(item)"> {{ item.name }} - {{ ('click_here_for_download') }}</span>
                </el-row>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            :label="('Trạng thái')"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ (scope.row.active === 1) ? ('active1') : ('stop') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="is_delete || is_edit" :label="('Hành động')" align="center" width="130">
            <template slot-scope="scope">
              <!-- <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" /> -->
              <el-button v-if="is_delete && approve < 1" type="danger" icon="el-icon-delete" circle @click="onDeletePress(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <dialog-create-exeprts :show-dialog="onShowDialogCreate" @onClickButtonDialog="onHandlerEvent" />
    </el-row>
  </div>
</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
import { getAcountInfo } from '@/utils/auth'
import DialogCreateExeprts from './DialogCreateExeprts.vue'
// import i18n from '@/lang/i18n'
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()

export default {
  name: 'ContractExcerptsInfo',
  components: { DialogCreateExeprts },
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
      onShowDialogCreate: false,
      contract_id: 0,
      approve: 0
    }
  },
  methods: {
    setApprove(approve) {
      this.approve = approve
    },
    onHandlerEvent(obj) {
      const { data } = obj
      this.onShowDialogCreate = false
      if (data) {
        data.list_link = data.fileList && data.fileList.length ? ('view_list_file') : ''
        data.id = this.tableData.length + 1
        this.tableData.push(data)
        console.log('.......... is new ', this.isNew, JSON.stringify(data))
        if (!this.isNew) {
          this.requestCreateExeprt({ contract_id: this.contract_id, name: data.name, fileList: data.listFile })
        }
      }
    },

    requestCreateExeprt(body) {
      this.loadingTable = true
      supplierResource.create_new_exeprt(body).then(res => {
        this.loadingTable = false
        const { error, msg } = res
        if (error === 0) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      }).catch(err => {
        console.log('.....err', err)
        this.loadingTable = false
      })
    },

    onDetailPress(item) {
      console.log('............ detail : ', JSON.stringify(item))
      const { url, link } = item
      if (url && url.length) {
        // window.open(url, '_blank')
        const fileName = url.substring(url.lastIndexOf('/') + 1)
        const _link = document.createElement('a')
        _link.href = url
        _link.download = fileName
        _link.click()
      } else if (link && link.length) {
        // window.open(url, '_blank')
        const fileName = link.substring(link.lastIndexOf('/') + 1)
        const _link = document.createElement('a')
        _link.href = link
        _link.download = fileName
        _link.click()
      }
    },
    onDeletePress(row) {
      this.$confirm(('Bạn có chắc muốn xoá trích lục không?').format(row.name)).then(_ => {
        const body = {
          id: row.id
        }
        supplierResource.delete_exeprt(body).then(response => {
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
    setData(data, contract_id = 0) {
      this.tableData = [...data]
      this.contract_id = contract_id
    },
    getInfo() {
      return this.tableData
    },
    createExerpts() {
      // this.$router.push({ path: `/contract?shop_id=${this.shopId}` })
      this.onShowDialogCreate = true
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
  background-color: #ffffff
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
