<template>
  <el-dialog
    :visible.sync="showDetail"
    :before-close="handleClose"
    top="1vh"
    width="90%"
  >
    <el-form ref="ruleForm" :rules="rules" style="margin-bottom: 40px" :model="objData">
      <h5 style="color: black;">TẠO PHIẾU XUẤT KHO</h5>
      <div style="border: 1px solid gainsboro; padding: 30px 20px; margin-top: 20px">
        <div style="display: flex; justify-content: left;">
          <div style="width: 25%">
            <label class="item-label">{{ "Mã phiếu xuất" }}</label>
            <el-input
              v-model="note_code"
              :disabled="true"
              style="margin-top: 10px"
              :placeholder="'Mã phiếu xuất'"
            />
          </div>
          <div style="width: 25%; margin-left: 20px">
            <label class="item-label">{{ "Ngày xuất kho" }}<span style="color: red">*</span></label>
            <!-- <el-date-picker
              v-model="dateDeliveryNote"
              type="date"
              style="margin-top: 10px; width: 100%;"
              placeholder="Ngày xuất kho"
            /> -->
            <el-form-item prop="dateDeliveryNote">
              <el-date-picker
                v-model="dateDeliveryNote"
                type="date"
                prop="dateDeliveryNote"
                style="margin-top: 10px; width: 100%;"
                placeholder="Ngày xuất kho"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
          <div style="flex: 1; margin-left: 20px">
            <label class="item-label">{{ "Tên phiếu xuất kho" }}<span style="color: red">*</span></label>
            <!-- <el-input
              v-model="dataBody.purpose"
              style="margin-top: 10px"
              :placeholder="'Mục đích xuất kho'"
            /> -->
            <el-form-item prop="purpose">
              <el-input
                v-model="dataBody.purpose"
                prop="purpose"
                style="margin-top: 10px"
                placeholder="Tên phiếu xuất kho"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
        </div>
        <div style="display: flex; justify-content: left; margin-top: 20px">
          <div style="width: 25%">
            <label class="item-label">{{ "Bên nhận" }}<span style="color: red">*</span></label>
            <!-- <el-input
              v-model="dataBody.shop_id"
              style="margin-top: 10px"
              :placeholder="'Bên nhận'"
            /> -->
            <el-form-item prop="receiving">
              <el-input
                v-model="dataBody.receiving"
                prop="receiving"
                style="margin-top: 10px"
                placeholder="Bên nhận"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </div>
          <div style="width: 25%; margin-left: 20px">
            <label class="item-label">{{ "SĐT" }}</label>
            <el-form-item prop="phone">
              <el-input
                v-model="dataBody.phone"
                style="margin-top: 10px"
                :placeholder="'SĐT'"
              />
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
              style="margin-top: 10px"
              width="150"
              :disabled="true"
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
              :value="(row.price) ? formatNumber(row.price) : null"
              placeholder="Giá nhập"
              style="margin-top: 10px"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="center">
          <template slot-scope="{ row }">
            <el-input
              :value="(row.origin_number && row.price) ? formatNumber(row.origin_number * row.price) : null"
              placeholder="Giá thành tiền"
              :disabled="true"
              style="margin-top: 10px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Thuộc tính 1" align="center">
          <!-- <template slot-scope="{ row }">
            <el-select
              v-model="row.param_first_id"
              placeholder=""
              @change="onSelectAttr1(row)"
            >
              <el-option
                v-for="item in row.params"
                :key="item.id"
                :label="item.param_first"
                :value="item.id"
              />
            </el-select>
          </template> -->
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
              placeholder="Chọn thuộc tính 2"
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
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { validateText, validatePhoneNumberWithEmpty } from '@/utils/validate'
import { format_product_params } from '@/utils/productUtils'
import { copyClipboard } from '@/utils/commonHandle'
import { formatNumber } from '@/utils/convert'

const warehouseApi = new WarehouseResource()
Vue.config.warnHandler = function(msg, vm, trace) {
  // Disable all warnings
}
export default {
  name: 'DialogAddDeliveryNote',
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
        receiving: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.receiving, callback, 'Bên nhận'),
          trigger: 'change'
        }],
        purpose: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.purpose, callback, 'Tên phiếu xuất kho'),
          trigger: 'change'
        }],
        phone: [{
          required: false,
          validator: (rule, _, callback) => validatePhoneNumberWithEmpty(rule, this.dataBody.phone, callback, 'Số điện thoại'),
          trigger: 'change'
        }],
        dateDeliveryNote: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.import_time, callback, 'Ngày xuất kho'),
          trigger: 'change'
        }]
      },
      tableData: [{}],
      loading: false,
      dateDeliveryNote: '',

      optionShop: [],
      dataBody: {
        name: null,
        purpose: null,
        import_time: null,
        receiving: null,
        noted: null,
        phone: null,
        address: null,
        list_product: null,
        type: 1 // 0 là nhập kho, 1 là xuất kho
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
    dateDeliveryNote(val) {
      const date = new Date(val)
      const timestamp = date.getTime()
      this.dataBody.import_time = timestamp
    }
  },
  mounted() {
    this.listAllShop()
  },
  methods: {
    formatNumber,
    format_product_params,
    copyClipboard,
    onSaveNote() {
      this.onSubmitForm('ruleForm')
    },
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.dataBody.name = this.dataBody.purpose
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
          this.createDeliveryNote()
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
    createDeliveryNote() {
      warehouseApi.create_note(this.dataBody).then(res => {
        const { error, data } = res
        console.log('..........createDeliveryNote ', JSON.stringify(data))
        if (error === 0) {
          this.$message.success('Tạo phiếu xuất kho thành công')
          this.$emit('success-create-note')
          this.handleClose()
        } else {
          throw new Error('Tạo phiếu xuất kho thất bại')
        }
      }).catch(err => {
        console.log('..........createDeliveryNote ', err)
        this.$message.error(err.message)
      })
      console.log('createDeliveryNote')
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
    requestListProduct() {
      this.loadingNameProduct = true
      warehouseApi
        .list_product(this.listQueryProduct)
        .then(response => {
          const { error, list } = response
          if (error === 0) {
            this.optionAllProduct = list.map(item => {
              return {
                id: item.id,
                value: item.product_code,
                label: item.name,
                product_code_shop: item.product_code_shop,
                params: item.params,
                price: item.price
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
        row.price = product.price

        const { list_attr1, list_attr2 } = this.format_product_params(row.params)
        // console.log(data, 'data attr')
        row.list_attr1 = list_attr1
        row.list_attr2 = list_attr2
        console.log(product, 'onChangeProduct')
      }
    },
    onSelectAttr1(row) {
      const product = row.params.find(item => item.id === row.param_first_id)
      row.param_first = product.param_first
      row.param_second = product.param_second
    }
  }
}
</script>
<style scoped>
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
