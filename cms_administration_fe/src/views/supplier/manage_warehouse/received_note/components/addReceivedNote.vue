<template>
  <el-dialog
    :visible.sync="showDetail"
    :before-close="handleClose"
    top="1vh"
    width="90%"
  >
    <el-form ref="ruleForm" :rules="rules" style="margin-bottom: 40px" :model="objData">
      <h5 style="color: black;">TẠO PHIẾU NHẬP KHO</h5>
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
            <!-- <el-date-picker
              v-model="dateReceivedNote"
              type="date"
              style="margin-top: 10px; width: 100%;"
              placeholder="Ngày nhập kho"
            /> -->
            <el-form-item prop="dateReceivedNote">
              <el-date-picker
                v-model="dateReceivedNote"
                type="date"
                prop="dateReceivedNote"
                style="margin-top: 10px; width: 100%;"
                placeholder="Ngày nhập kho"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
          <div style="flex: 1; margin-left: 20px">
            <label class="item-label">{{ "Tên phiếu nhập" }}<span style="color: red">*</span></label>
            <!-- <el-input
              v-model="dataBody.name"
              style="margin-top: 10px"
              :placeholder="'Tên phiếu nhập'"
            /> -->
            <el-form-item prop="name">
              <el-input
                v-model="dataBody.name"
                prop="name"
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
            <!-- <el-input
              v-model="dataBody.shop_id"
              :disabled="true"
              style="margin-top: 10px"
              :placeholder="'Mã nhà cung cấp'"
            /> -->
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
            <!-- <el-select v-model="selectShop" style="margin-top: 10px; width: 100%;" placeholder="Tên nhà cung cấp">
              <el-option
                v-for="item in optionShop"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->

            <el-form-item prop="selectShop">
              <el-select v-model="selectShop" style="margin-top: 10px; width: 100%;" placeholder="Tên nhà cung cấp">
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
              style="margin-top: 10px"
              :placeholder="'Địa chỉ'"
            />
          </div>
        </div>
        <div style="margin-top: 20px">
          <label class="item-label">{{ "Ghi chú" }}</label>
          <el-input
            v-model="dataBody.noted"
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
            <el-select
              v-model="scope.row.product_code"
              filterable
              remote
              reserve-keyword
              placeholder="Nhập để tìm kiếm"
              :remote-method="remoteMethodProduct"
              :loading="loadingNameProduct"
              @change="onChangeProduct(scope.row)"
            >
              <el-option
                v-for="item in optionAllProduct"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <p :style="{ visibility: true ? 'visible' : 'hidden' }" class="warning-table">okok</p> -->
          </template>
        </el-table-column>

        <el-table-column label="Mã hàng NCC" align="center">
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
              placeholder="Nhập đơn vị tính"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Số lượng" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.origin_number"
              placeholder="Nhập số lượng"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column label="Giá nhập" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.price"
              placeholder="Giá nhập"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="center">
          <template slot-scope="{ row }">
            <el-input
              :value="(row.origin_number && row.price) ? formatNumber(row.origin_number * row.price) : null"
              placeholder="Giá thành tiền"
              style="margin-top: 10px"
              :disabled="true"
            />
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Thuộc tính 1" align="center">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.param_first"
              placeholder="Chọn thuộc tính 1"
            >
              <el-option
                v-for="item in row.list_attr1"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Thuộc tính 2" align="center">
          <template slot-scope="{ row }">
            <!-- <el-input
              v-model="row.param_second"
              style="margin-top: 10px"
              :disabled="true"
            /> -->
            <el-select
              v-model="row.param_second"
              placeholder="Chọn thuộc tính 1"
            >
              <el-option
                v-for="item in row.list_attr2"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column :label="('Hành động')" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="onDeleteRow(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-top: 10px"
        plain
        @click="onAddRow"
      >Thêm sản phẩm</el-button>
      <hr>
      <div style="display: flex; justify-content: end;">
        <p style="font-weight: 500; color: blue; font-size: medium; margin-right: 30px">Tổng tiền: <span style="color: gray">{{ formatNumber(totalMoneyNote) }} VND</span></p>
      </div>
      <div style="display: flex; justify-content:right; margin-right: 30px">
        <el-button
          type="primary"
          style="margin-top: 10px"
          plain
          @click="handleClose"
        >Hủy</el-button>
        <el-button
          type="primary"
          style="margin-top: 10px"
          @click="onSaveNote"
        >Lưu</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import { validateText } from '@/utils/validate'
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { format_product_params } from '@/utils/productUtils'
import { copyClipboard } from '@/utils/commonHandle'
import { formatNumber } from '@/utils/convert'

const warehouseApi = new WarehouseResource()
Vue.config.warnHandler = function(msg, vm, trace) {
  // Disable all warnings
}
export default {
  name: 'DialogAddReceivedNote',
  props: {
    showDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      objData: {},
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
      optionAllProduct: []
    }
  },
  computed: {
    totalMoneyNote() {
      const totalData = this.tableData.reduce((total, item) => {
        if (!item.origin_number || !item.price) return total
        return total + (item.origin_number * item.price)
      }, 0)
      return totalData || 0
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
      this.listQueryProduct.shop_id = val
    }
  },
  mounted() {
    this.listAllShop()
  },
  methods: {
    formatNumber,
    format_product_params,
    copyClipboard,
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.dataBody.list_product = this.tableData.map(item => {
            return {
              product_id: item.product_id,
              unit: item.unit,
              price: parseInt(item.price),
              cost: parseInt(item.price * item.origin_number),
              origin_number: parseInt(item.origin_number),
              param_first: item.param_first,
              param_second: item.param_second
            }
          })
          this.createReceivedNote()
        }
      })
    },
    handleClose() {
      this.$emit('close-dialog')
    },
    onDeleteRow(row) {
      this.tableData = this.tableData.filter(item => item !== row)
      console.log(this.tableData, 'this.tableData')
    },
    onAddRow() {
      this.tableData.push({})
    },
    createReceivedNote() {
      warehouseApi.create_note(this.dataBody).then(res => {
        const { error, data } = res
        console.log('..........createReceivedNote ', JSON.stringify(data))
        if (error === 0) {
          this.$message.success('Tạo phiếu nhập kho thành công')
          this.$emit('handle-success-add-note')
          this.handleClose()
          // this.voucherObject = data
        } else {
          throw new Error('Tạo phiếu nhập kho thất bại')
        }
      }).catch(err => {
        console.log('..........createReceivedNote ', err)
        this.$message.error(err.message)
      })
      console.log('createReceivedNote')
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
    requestListProduct() {
      this.loadingNameProduct = true
      warehouseApi
        .list_product(this.listQueryProduct)
        .then(response => {
          const { error, list } = response
          if (error === 0) {
            this.optionAllProduct = list.map(item => {
              console.log('item optionAllProduct', item)
              return {
                id: item.id,
                value: item.product_code,
                label: item.name,
                product_code_shop: item.product_code_shop,
                params: item.params
              }
            })
          } else {
            throw new Error('Không lấy được danh sách sản phẩm')
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
        .finally(() => {
          this.loadingNameProduct = false
        })
    },
    remoteMethodProduct(query) {
      if (query !== '') {
        this.listQueryProduct.q = query
        this.requestListProduct()
      } else {
        this.options = []
      }
    },
    onChangeProduct(row) {
      const product = this.optionAllProduct.find(item => item.value === row.product_code)
      if (product) {
        row.product_id = product.id
        row.product_code_shop = product.product_code_shop
        row.params = product.params
        const { list_attr1, list_attr2 } = this.format_product_params(row.params)
        // console.log(data, 'data attr')
        row.list_attr1 = list_attr1
        row.list_attr2 = list_attr2
        console.log(product, 'onChangeProduct')
      }
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
