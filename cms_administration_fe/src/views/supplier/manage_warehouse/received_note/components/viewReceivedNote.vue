<template>
  <el-dialog
    :visible.sync="showDetail"
    :before-close="handleClose"
    top="1vh"
    width="90%"
  >
    <el-form ref="ruleForm" :rules="rules" style="margin-bottom: 40px" :model="objData">
      <h5 style="color: black;">THÔNG TIN PHIẾU NHẬP KHO</h5>
      <div style="border: 1px solid gainsboro; padding: 30px 20px; margin-top: 20px">
        <div style="display: flex; justify-content: left;">
          <div style="width: 25%">
            <label class="item-label">{{ "Mã phiếu nhập" }}</label>
            <el-input
              v-model="note_code"
              :disabled="true"
              style="margin-top: 10px"
              :placeholder="'Mã phiếu nhập'"
            />
          </div>
          <div style="width: 25%; margin-left: 20px">
            <label class="item-label">{{ "Ngày nhập kho" }}<span style="color: red">*</span></label>
            <el-form-item prop="dateReceivedNote">
              <el-date-picker
                v-model="dateReceivedNote"
                type="date"
                :disabled="true"
                prop="dateReceivedNote"
                style="margin-top: 10px; width: 100%;"
                placeholder="Ngày nhập kho"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
          <div style="flex: 1; margin-left: 20px">
            <label class="item-label">{{ "Tên phiếu nhập" }}<span style="color: red">*</span></label>
            <el-form-item prop="name">
              <el-input
                v-model="dataBody.name"
                prop="name"
                :disabled="true"
                style="margin-top: 10px"
                placeholder="Tên phiếu nhập"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
        </div>
        <div style="display: flex; justify-content: left; margin-top: 20px">
          <div style="width: 25%">
            <label class="item-label">{{ "Mã nhà cung cấp" }}<span style="color: red">*</span></label>
            <el-form-item prop="shop_id">
              <el-input
                v-model="dataBody.shop_id"
                :disabled="true"
                prop="shop_id"
                style="margin-top: 10px"
                placeholder="Mã nhà cung cấp"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
          <div style="width: 25%; margin-left: 20px">
            <label class="item-label">{{ "Tên nhà cung cấp" }}<span style="color: red">*</span></label>
            <el-form-item prop="selectShop">
              <el-select v-model="selectShop" style="margin-top: 10px; width: 100%;" :disabled="true" placeholder="Tên nhà cung cấp">
                <el-option
                  v-for="item in optionShop"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="flex: 1; margin-left: 20px">
            <label class="item-label">{{ "Địa chỉ" }}</label>
            <el-input
              v-model="dataBody.address"
              :disabled="true"
              style="margin-top: 10px"
              :placeholder="'Địa chỉ'"
            />
          </div>
        </div>
        <div style="margin-top: 20px">
          <label class="item-label">{{ "Ghi chú" }}</label>
          <el-input
            v-model="dataBody.noted"
            :disabled="true"
            style="margin-top: 10px"
            :placeholder="'Ghi chú'"
          />
        </div>
      </div>
    </el-form>
    <div>
      <h5>Thông tin hàng hóa</h5>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          label="Mã sản phẩm"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.product_code"
              :disabled="true"
              style="margin-top: 10px"
              :placeholder="'Mã sản phẩm'"
            >
              <template slot="append">
                <el-button style="padding: 0px" icon="el-icon-document" @click="copyClipboard(scope.row.product_code)" />
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="Tên sản phẩm"
          align="center"
          type="index"
          width="200"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column label="Mã hàng NCC" align="center" width="150">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.product_code_shop"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column label="Đơn vị tính" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.unit"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Số lượng" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.origin_number"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column label="Giá nhập" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.price"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="center">
          <template slot-scope="{ row }">
            <el-input
              :value="(row.origin_number && row.price) ? formatNumber(row.origin_number * row.price) : formatNumber(row.cost)"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Thuộc tính 1" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.param_first"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Thuộc tính 2" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.param_second"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>
      </el-table>
      <hr>
      <div style="display: flex; justify-content: end;">
        <p style="font-weight: 500; color: blue; font-size: medium; margin-right: 30px">Tổng tiền: <span style="color: gray">{{ formatNumber(totalMoneyNote) || formatNumber }} VND</span></p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import { validateText } from '@/utils/validate'
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { formatNumber } from '@/utils/convert'
import { copyClipboard } from '@/utils/commonHandle'
const warehouseApi = new WarehouseResource()
Vue.config.warnHandler = function(msg, vm, trace) {
  // Disable all warnings
}
export default {
  name: 'DialogViewReceivedNote',
  props: {
    showDetail: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      objData: {},
      dataEditRow: {},
      rules: {
        name: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.name, callback, 'Tên phiếu nhập'),
          trigger: 'change'
        }],
        shop_id: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.shop_id, callback, 'Mã nhà cung cấp'),
          trigger: 'change'
        }],
        dateReceivedNote: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.import_time, callback, 'Ngày nhập kho'),
          trigger: 'change'
        }],
        selectShop: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.shop_id, callback, 'Tên nhà cung cấp'),
          trigger: 'change'
        }]
      },
      typeHandleDialog: null,
      tableData: [{}],
      loading: false,
      dateReceivedNote: '',
      selectShop: null,
      optionShop: [],
      dataBody: {
        name: null,
        import_time: null,
        shop_id: null,
        noted: null,
        address: null,
        list_product: null,
        type: 0 // 0 là nhập kho, 1 là xuất kho
      },
      listQueryProduct: {
        page: 1,
        limit: 10,
        q: ''
      },
      loadingNameProduct: false,
      optionAllProduct: [],
      showEditTableNote: false,
      dataUpdate: {}
    }
  },
  computed: {
    note_code() {
      return 'NK' + this.dataBody.id
    },
    totalMoneyNote() {
      const totalData = this.tableData.reduce((total, item) => {
        if (!item.origin_number || !item.price) return total
        return total + (item.origin_number * item.price)
      }, 0)
      const totalDataCost = this.tableData.reduce((total, item) => {
        if (!item.cost) return total
        return total + item.cost
      }, 0)
      return totalData || totalDataCost
    }
  },
  watch: {
    dateReceivedNote(val) {
      const date = new Date(val)
      const timestamp = date.getTime()
      this.dataBody.import_time = timestamp
    },
    selectShop(val) {
      console.log('selectShop', val)
      this.dataBody.shop_id = val
    }
  },
  mounted() {
    console.log(this.id, 'this.id')
    this.getEditNoteInfo()
    this.listAllShop()
  },
  methods: {
    formatNumber,
    copyClipboard,
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.dataUpdate = {
            id: this.id,
            address: this.dataBody.address,
            import_time: this.dataBody.import_time,
            name: this.dataBody.name,
            noted: this.dataBody.noted,
            shop_id: this.dataBody.shop_id
          }
          this.editReceivedNote()
        }
      })
    },
    handleClose() {
      this.$emit('close-dialog')
    },
    onDeleteRow(row) {
      this.$confirm('Bạn có chắc muốn xóa sản phẩm?', 'Warning', {
        confirmButtonText: 'Thêm',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        warehouseApi.delete_product_to_warehouse({ warehouse_id: this.id, product_id: row.product_id }).then(res => {
          const { error } = res
          if (error === 0) {
            this.$message.success('Xóa sản phẩm thành công')
            this.tableData = this.tableData.filter(item => item !== row)
            console.log(this.tableData, 'this.tableData')
          } else {
            throw new Error('Xóa sản phẩm thất bại')
          }
        }).catch(err => {
          console.log('..........deleteProduct ', err)
          this.$message.error(err.message)
        })
      })
    },
    onEditRow(row) {
      this.typeHandleDialog = 1
      this.dataEditRow = row
      this.showEditTableNote = true
    },
    onAddRow() {
      this.typeHandleDialog = 0
      this.dataEditRow = {}
      this.showEditTableNote = true
    },
    editReceivedNote() {
      warehouseApi.edit_warehouse_note(this.dataUpdate).then(res => {
        const { error, data } = res
        console.log('..........editReceivedNote ', JSON.stringify(data))
        if (error === 0) {
          this.$message.success('Cập nhật phiếu nhập kho thành công')
          this.$emit('success-edit-note')
          this.handleClose()
        } else {
          throw new Error('Cập nhật phiếu nhập kho thất bại')
        }
      }).catch(err => {
        console.log('..........editReceivedNote ', err)
        this.$message.error(err.message)
      })
      console.log('editReceivedNote')
    },
    listAllShop() {
      warehouseApi.list_shop_all().then(res => {
        const { error, list } = res
        if (error === 0) {
          this.optionShop = list.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          throw new Error('Không lấy được danh sách cửa hàng')
        }
      }).catch(err => {
        console.log('..........listShopAll ', err)
        this.$message.error(err.message)
      })
    },
    onSaveNote() {
      this.onSubmitForm('ruleForm')
      console.log('onSaveNote')
      console.log('this.dataBody', this.dataBody)
    },
    remoteMethodProduct(query) {
      if (query !== '') {
        this.listQueryProduct.q = query
      } else {
        this.options = []
      }
    },
    onChangeProduct(row) {
      console.log('onChangeProduct', row)
      const product = this.optionAllProduct.find(item => item.value === row.product_code)
      if (product) {
        row.product_id = product.id
      }
    },
    getEditNoteInfo() {
      warehouseApi.detail_warehouse_note({ warehouse_id: this.id }).then(res => {
        const { error, data } = res
        if (error === 0) {
          this.dataBody = data
          this.selectShop = data.shop_id
          this.dateReceivedNote = data.import_time.split(' ')[0]
          this.tableData = data.list_product
          this.tableData.forEach(item => {
            console.log(item, 'item')
            this.remoteMethodProduct(item.name)
            // item.product_code = item.product.product_code
          })
          console.log('..........getEditNoteInfo ', this.dataBody)
        } else {
          throw new Error('Không lấy được thông tin phiếu nhập kho')
        }
      }).catch(err => {
        console.log('..........getEditNoteInfo ', err)
        this.$message.error(err.message)
      })
    },
    addRowNote(data) {
      console.log('addRowNote', data)
      this.tableData.push(data)
      this.showEditTableNote = false
    },
    editRowNote(data) {
      const index = this.tableData.findIndex(item => item.product_id === data.product_id)
      this.$set(this.tableData, index, data)
      this.showEditTableNote = false
    }
  }
}
</script>
  <style scoped>
  .warning-table {
    color: red;
    font-size: 12px;
    margin: 0px;
  }
  /* ::v-deep .el-table--enable-row-transition .el-table__body td.el-table__cell {
    padding: 5px;
  } */
  ::v-deep .el-input--medium .el-input__icon {
    display: none !important;
  }
  ::v-deep .el-input--medium .el-input__inner {
    padding: 15px !important;
  }
  ::v-deep .el-table td.el-table__cell div {
    margin: 0 !important;
  }
  ::v-deep .el-input-group__append {
    padding: 0px 10px !important;
  }
  </style>
