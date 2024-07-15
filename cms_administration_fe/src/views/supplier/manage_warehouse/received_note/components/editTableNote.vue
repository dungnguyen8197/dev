<template>
  <el-dialog
    :modal="false"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose"
    width="50%"
  >
    <h5 style="color: #424147; margin-bottom: 30px">Thông tin hàng hóa</h5>
    <el-form ref="ruleForm" :rules="rules" style="" :model="form">
      <div style="">
        <div style="display: flex; justify-content: space-between;">
          <div class="div-product">
            <label class="item-label">{{ "Mã sản phẩm" }}<span style="color: red">*</span></label>
            <el-form-item prop="product_code">
              <el-input
                v-model="dataBody.product_code"
                :disabled="true"
                prop="product_code"
                style="margin-top: 10px"
                placeholder=""
              />
            </el-form-item>
          </div>
          <div class="div-product">
            <label class="item-label">{{ "Tên sản phẩm" }}<span style="color: red">*</span></label>
            <el-form-item prop="product_code">
              <el-select
                v-model="dataBody.product_code"
                style="margin-top: 10px; width: 100%"
                filterable
                :disabled="checkDisabledProduct"
                remote
                reserve-keyword
                placeholder="Nhập để tìm kiếm"
                :remote-method="remoteMethodProduct"
                :loading="loadingNameProduct"
                @change="onChangeProduct"
              >
                <el-option
                  v-for="item in optionAllProduct"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="div-product">
            <label class="item-label">{{ "Mã hàng NCC" }}</label>
            <el-form-item prop="product_code_shop">
              <el-input
                v-model="dataBody.product_code_shop"
                prop="product_code_shop"
                :disabled="true"
                style="margin-top: 10px"
              />
            </el-form-item>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div class="div-product">
            <label class="item-label">{{ "Đơn vị tính" }}<span style="color: red">*</span></label>
            <el-form-item prop="unit">
              <el-input
                v-model="dataBody.unit"
                placeholder="Nhập đơn vị tính"
                prop="unit"
                style="margin-top: 10px"
              />
            </el-form-item>
          </div>
          <div class="div-product">
            <label class="item-label">{{ "Số lượng" }}<span style="color: red">*</span></label>
            <el-form-item prop="origin_number">
              <el-input
                v-model="dataBody.origin_number"
                placeholder="Nhập số lượng"
                prop="origin_number"
                style="margin-top: 10px"
              />
            </el-form-item>
          </div>
          <div class="div-product">
            <label class="item-label">{{ "Giá nhập" }}<span style="color: red">*</span></label>
            <el-form-item prop="price">
              <el-input
                v-model="dataBody.price"
                placeholder="Giá nhập"
                prop="price"
                style="margin-top: 10px"
              />
            </el-form-item>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <div class="div-product">
            <label class="item-label">{{ "Thành tiền" }}<span style="color: red">*</span></label>
            <el-form-item prop="cost">
              <el-input
                :value="(dataBody.origin_number && dataBody.price) ? formatNumber(dataBody.origin_number * dataBody.price) : null"
                placeholder="Giá thành tiền"
                prop="cost"
                style="margin-top: 10px"
                :disabled="true"
              />
            </el-form-item>
          </div>
          <div class="div-product">
            <label class="item-label">{{ "Thuộc tính 1" }}</label>
            <!-- <el-select
              v-model="dataBody.param_first_id"
              style="margin-top: 10px; width: 100%"
              placeholder=""
              @change="onSelectAttr1"
            >
              <el-option
                v-for="item in allParamFirst"
                :key="item.id"
                :label="item.param_first"
                :value="item.id"
              />
            </el-select> -->
            <el-select
              v-model="dataBody.param_first"
              style="margin-top: 10px; width: 100%;"
              placeholder="Chọn thuộc tính 1"
            >
              <el-option
                v-for="item in dataBody.list_attr1"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <div class="div-product">
            <label class="item-label">{{ "Thuộc tính 2" }}</label>
            <!-- <el-form-item prop="param_second">
              <el-input
                v-model="dataBody.param_second"
                prop="param_second"
                :disabled="true"
                style="margin-top: 10px"
              />
            </el-form-item> -->
            <el-select
              v-model="dataBody.param_second"
              style="margin-top: 10px; width: 100%;"
              placeholder="Chọn thuộc tính 2"
            >
              <el-option
                v-for="item in dataBody.list_attr2"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>
      </div>
    </el-form>
    <div style="display: flex; justify-content: right; margin-right: 30px; margin-top: 20px">
      <el-button plain type="primary" @click="handleClose">Hủy</el-button>
      <el-button type="primary" @click="confirmHandle">Lưu</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validateText } from '@/utils/validate'
import WarehouseResource from '@/api/manage_supplier/warehouse'
import { format_product_params } from '@/utils/productUtils'
import { formatNumber } from '@/utils/convert'

const warehouseApi = new WarehouseResource()
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    dataBodyOld: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Number, // 0: add, 1: edit
      default: 0
    },
    warehouseId: {
      type: Number,
      default: null
    },
    shopId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      rules: {
        product_code: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.product_code, callback, 'Mã sản phẩm'),
          trigger: 'change'
        }],
        product_name: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.product_code, callback, 'Tên sản phẩm'),
          trigger: 'change'
        }],
        unit: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.unit, callback, 'Đơn vị tính'),
          trigger: 'change'
        }],
        origin_number: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.origin_number, callback, 'Số lượng'),
          trigger: 'change'
        }],
        price: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.price, callback, 'Giá nhập'),
          trigger: 'change'
        }],
        cost: [{
          required: true,
          validator: (rule, _, callback) => validateText(rule, this.dataBody.cost, callback, 'Thành tiền'),
          trigger: 'change'
        }]
      },
      form: {},
      listQueryProduct: {
        page: 1,
        limit: 10,
        q: ''
      },
      loadingNameProduct: false,
      dataBody: {},
      allParamFirst: []
    }
  },
  computed: {
    checkDisabledProduct() {
      return this.type === 1
    }
  },
  created() {
    this.dataBody = { ...this.dataBodyOld }
    console.log(this.dataBodyOld, 'dataBodyOld')
  },
  mounted() {
    if (this.type === 1) {
      this.remoteMethodProduct(this.dataBody.name)
      // setTimeout(() => {
      //   this.onChangeProduct(this.dataBody.product_code)
      // }, 500)
    }
    console.log(this.dataBody, 'dataBody')
  },
  methods: {
    formatNumber,
    format_product_params,
    handleClose() {
      this.$emit('on-close')
    },
    async onSubmitForm(formName) {
      console.log(this.dataBody, 'dataBody')
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          if (this.type === 0) {
            this.onAddProduct()
          } else {
            this.onEditProduct()
          }
        }
      })
    },
    emitParent() {
      if (this.type === 0) {
        this.$emit('on-add', this.dataBody)
      } else {
        this.$emit('on-edit', this.dataBody)
      }
    },
    onChangeProduct(data) {
      console.log('okkkkkkkkkkkkkkkkkkkk')
      const product = this.optionAllProduct.find(item => item.value === data)
      if (product) {
        this.dataBody.product_id = product.id
        this.dataBody.product_code_shop = product.product_code_shop
        this.dataBody.name = product.label
        this.allParamFirst = product.params
        // this.dataBody.param_first_id = this.allParamFirst.find(item => item.param_second === this.dataBody.param_second).id

        const { list_attr1, list_attr2 } = this.format_product_params(this.allParamFirst)
        // console.log(data, 'data attr')
        this.dataBody.list_attr1 = list_attr1
        this.dataBody.list_attr2 = list_attr2
        console.log(product, 'onChangeProduct')
      }
    },
    remoteMethodProduct(query) {
      if (query !== '') {
        this.listQueryProduct.q = query
        this.listQueryProduct.shop_id = this.shopId
        // this.requestListProduct()
        if (this.type === 1) {
          this.requestListProductFail()
        } else {
          this.requestListProduct()
        }
      } else {
        this.options = []
      }
    },
    onAddProduct() {
      warehouseApi.add_product_to_warehouse({ warehouse_id: this.warehouseId, product: this.dataBody }).then(response => {
        const { error, msg } = response
        if (error === 0) {
          this.$message.success(msg)
          this.emitParent()
          this.handleClose()
        } else {
          this.$message.error(msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    onEditProduct() {
      const dataBody = {
        id: this.dataBody.id,
        product_id: this.dataBody.product_id,
        price: parseInt(this.dataBody.price),
        // cost: parseInt(this.dataBody.cost),
        cost: parseInt(this.dataBody.price * this.dataBody.origin_number),
        unit: this.dataBody.unit,
        origin_number: parseInt(this.dataBody.origin_number),
        param_first: this.dataBody.param_first,
        param_second: this.dataBody.param_second
      }
      warehouseApi.edit_product_to_warehouse({ warehouse_id: this.warehouseId }, dataBody).then(response => {
        const { error, msg } = response
        if (error === 0) {
          this.$message.success(msg)
          this.emitParent()
          this.handleClose()
        } else {
          this.$message.error(msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    requestListProductFail2nd() {
      this.loadingNameProduct = true
      this.listQueryProduct.q = this.dataBody.product_code_shop
      warehouseApi
        .list_product(this.listQueryProduct)
        .then(response => {
          const { error, list } = response
          if (error === 0) {
            this.optionAllProduct = list.map(item => {
              return {
                id: item.id,
                value: item.product_code,
                product_code_shop: item.product_code_shop,
                label: item.name,
                params: item.params
              }
            })
            this.onChangeProduct(this.dataBody.product_code)
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
    requestListProductFail() {
      this.loadingNameProduct = true
      this.listQueryProduct.q = this.dataBody.product_code
      if (this.type === 1) {
        this.listQueryProduct.filter = 1
      }
      warehouseApi
        .list_product(this.listQueryProduct)
        .then(response => {
          const { error, list } = response
          if (error === 0) {
            if (list.length === 0) throw new Error('Không tìm thấy sản phẩm')
            this.optionAllProduct = list.map(item => {
              return {
                id: item.id,
                value: item.product_code,
                product_code_shop: item.product_code_shop,
                label: item.name,
                params: item.params
              }
            })
            this.onChangeProduct(this.dataBody.product_code)
          } else {
            throw new Error('Không lấy được danh sách sản phẩm')
          }
        })
        .catch(error => {
          console.log(error, 'error')
          // this.requestListProductFail2nd()
          this.$message.error(error.message)
        })
        .finally(() => {
          this.loadingNameProduct = false
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
                product_code_shop: item.product_code_shop,
                label: item.name,
                params: item.params
              }
            })
            this.onChangeProduct(this.dataBody.product_code)
          } else {
            throw new Error('Không lấy được danh sách sản phẩm')
          }
        })
        .catch(error => {
          console.log(error, 'error')
          // this.requestListProductFail()
          this.$message.error(error.message)
        })
        .finally(() => {
          this.loadingNameProduct = false
        })
    },
    // onSelectAttr1(data) {
    //   const product = this.allParamFirst.find(item => item.id === data)
    //   this.dataBody.param_first = product.param_first
    //   this.dataBody.param_second = product.param_second
    //   console.log(this.dataBody, 'dataBody')
    // },
    confirmHandle() {
      if (this.type === 1) {
        this.$confirm('Bạn có chắc muốn sửa sản phẩm?', 'Warning', {
          confirmButtonText: 'Lưu',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }).then(() => {
          this.onSubmitForm('ruleForm')
        })
      } else {
        this.$confirm('Bạn có chắc muốn thêm sản phẩm?', 'Warning', {
          confirmButtonText: 'Thêm',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }).then(() => {
          this.onSubmitForm('ruleForm')
        })
      }
    }
  }
}
</script>
<style scoped>
.div-product {
  width: 33%;
  margin: 0px 20px 0px 0px;
}
</style>
