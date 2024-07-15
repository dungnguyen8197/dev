<template>
  <div style="margin-top: 10px;">
    <div v-if="isShowForm" style="margin-top: 10px; margin-bottom: 10px;">
      <h6>Nhập thông tin thuộc tính sản phẩm</h6>
      <div style="border: 1px solid gray; padding: 10px;">
        <div style="width: 100; display: flex; justify-content: space-between;">
          <div style="width: 30%;">
            <span>Ngày nhập<span style="color: red;">(*)</span></span>
          </div>
          <div style="width: 30%;">
            <span>{{ body.cost ? `Giá nhâp: ${formatNumber(body.cost)} đ` : 'Giá nhập' }}</span>
          </div>
          <div style="width: 30%;">
            <span>Hành động</span>
          </div>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; margin-top: 10px;">
          <div style="width: 30%;">
            <el-date-picker
              v-model="body.date_input"
              type="datetime"
              format="HH:mm dd/MM/yyyy"
              placeholder="Chọn ngày"
              @change="() => handleDateChange()"
            />
          </div>
          <div style="width: 30%;">
            <el-input
              v-model="body.cost"
              type="number"
              placeholder="Nhập giá"
              autocomplete="off"
            />
          </div>
          <div style="width: 30%;">
            <el-button type="primary" @click="onRefreshDateInputPress()">Nhập lại</el-button>
            <!-- <el-button style="margin-left: 10px;" type="danger" @click="removeInputEntry(index)">Clear</el-button> -->
          </div>
        </div>
        <div style="border: 0.5px solid gray; width: 100%; margin-top: 20px; margin-bottom: 20px;" />
        <div style="display: flex; width: 100%; justify-content: space-between;">
          <div style="width: 22%;">
            <span style="color: black; font-size: 14px;">{{ objectProduct.name_param_first && objectProduct.name_param_first.trim().length ? `Thuộc tính 1(${objectProduct.name_param_first})` : 'Thuộc tính 1' }}</span>
            <el-input v-model="body.param_first" style="margin-top: 6px" placeholder="Thuộc tính 1" />
          </div>
          <div style="width: 22%;">
            <span style="color: black; font-size: 14px;">{{ objectProduct.name_param_first && objectProduct.name_param_first.trim().length ? `Thuộc tính 2(${objectProduct.name_param_second})` : 'Thuộc tính 2' }}</span>
            <el-input v-model="body.param_second" style="margin-top: 6px" placeholder="Thuộc tính 1" />
          </div>
          <div style="width: 22%;">
            <span style="color: black; font-size: 14px;">Số lượng<span style="color: red">(*)</span></span>
            <el-input v-model="body.number" style="margin-top: 6px" placeholder="Thuộc tính 1" />
          </div>
          <div style="width: 25%;">
            <span style="color: black; font-size: 14px;">Hành động</span>
            <div style="display: block ruby; justify-content: flex-end; margin-top: 6px;">
              <el-button type="info" @click="onCancelProperties">Nhập lại</el-button>
              <el-button type="primary" :loading="loadingSubmit" @click="onSubmitProperties">{{ (isAddTable) ? 'Thêm mới' : 'Cập nhật' }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix-10" />
    <div style="width: 100%;">
      <div style="display: flex; justify-content: space-between;">
        <h6 style="margin-bottom: 10px;">Danh sách thuộc tính sản phẩm</h6>
        <el-link v-if="!isShowForm" type="primary" @click="onShowFormAddProperties">{{ ('Thêm thuộc tính') }}</el-link>
      </div>
      <el-table
        v-loading="loadingTable"
        :data="listProperties"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="param_first"
          :label="('Thuộc tính 1')"
          align="center"
        />
        <el-table-column
          prop="param_second"
          :label="('Thuộc tính 2')"
          align="center"
        />
        <el-table-column
          prop="number"
          :label="('Số lượng')"
          align="center"
        />
        <el-table-column
          prop="cost"
          :label="('Giá nhập')"
          align="center"
        >
          <template slot-scope="scope">{{ `${formatNumber(scope.row.cost)} đ` }}</template>
        </el-table-column>
        <el-table-column
          prop="date_input"
          :label="('Ngày nhập')"
          align="center"
        >
          <template slot-scope="scope">{{ moment(scope.row.date_input).format('DD/MM/YYYY') }}</template>
        </el-table-column>
        <el-table-column :label="('Hành động')" align="center">
          <template slot-scope="scope">
            <!--              <el-button type="primary" icon="el-icon-edit" circle @click="onEditParam(scope.row, scope.$index)" />-->
            <el-button type="primary" icon="el-icon-edit" circle @click="onEditParam(scope.row)" />
            <el-button type="danger" :loading="loadingTable" icon="el-icon-delete" circle @click="onDeleteParam(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>

import ProductResource from '@/api/manage_supplier/product'
import moment from 'moment'
const productResource = new ProductResource()
import { formatNumber } from '@/utils/convert'

export default {
  name: 'TableListParam',
  props: {
    objectProduct: {
      type: Object,
      default() { return {} }
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listProperties: [],
      loadingTable: false,
      loadingSubmit: false,
      isShowForm: false,
      // postForm: {},
      isAddTable: true,
      body: {},
      date_input: '',
      indexEdit: 0,
      rules: {
        number: [
          { required: true, message: 'Vui lòng nhập số lượng', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    isAdd(newValue) {
      if (newValue === true) {
        this.refreshTableData()
      }
    },
    objectProduct(value) {
      // this.body = {}
      if (Object.keys(value).length > 0) {
        if ('map_params' in value) {
          this.listProperties = [...value.map_params]
        }
      } else {
        this.listProperties = []
      }
    }
  },
  created() {
    console.log('...........thong tin san pham them: ', JSON.stringify(this.objectProduct))
  },
  methods: {
    refreshData() {
      this.refreshAll()
      this.listProperties = []
      this.isShowForm = false
    },
    formatNumber,
    // setNameParamsFisrt(params_fisrt) {
    //   console.log('............ params fisrt ', params_fisrt)
    // },
    onRefreshDateInputPress() {
      this.refreshDateInput()
    },
    refreshTableData() {
      this.listProperties = []
      // this.body = {}
    },
    handleDateChange(newValue) {
      // this.body.date_input = newValue ? (new Date(newValue)).getTime() : null
      // console.log(this.body.date_input, '-------------------date_input' + newValue)
    },
    onSubmitProperties() {
      const body = Object.assign({}, this.body)
      const number = parseInt(body.number) || 0
      if (!number) {
        return this.$msgbox('Số lượng không được để trống')
      }
      // this.$refs.rule_form.validate((valid) => {
      // if (valid) {
      if (this.isAddTable) {
        if (this.objectProduct.id) {
          this.createQuantity()
        } else {
          body.index_check = this.listProperties.length + 1
          this.listProperties.push(body)
          this.refreshProperties()
        }
        // this.listProperties = [this.body]
      } else {
        if (this.objectProduct.id) {
          this.updateQuantity()
          this.isShowForm = false
        } else {
          // this.listProperties.push(body)
          const obj = this.listProperties.find(d => d.index_check === this.body.index_check)
          console.log('.............. check object: ', JSON.stringify(obj))
          if (obj) {
            const keys = Object.keys(obj)
            for (const key of keys) {
              obj[key] = this.body[key]
            }
          }
          this.refreshProperties()
        }
      }
      console.log(this.objectProduct, '111111')
      // this.$emit('onSetData', { data: this.listProperties, index: this.objectProduct.index })
      this.$emit('onSetData', this.listProperties)
    },
    moment,
    createQuantity() {
      this.body.product_id = this.objectProduct.id
      this.loadingSubmit = true
      productResource.createQuantity(this.body).then(response => {
        this.loadingSubmit = false
        if (response.error === 0) {
          this.$message.success(response.msg)
          this.body.id = response.params_id
          this.listProperties.push(this.body)
          this.refreshProperties()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    updateQuantity() {
      this.loadingSubmit = true
      delete this.body.createdAt
      delete this.body.updatedAt
      // const cost = parseInt(this.body.cost) || 0
      // if (!cost) {
      //   this.$message.error('Giá nhập không được để trống')
      // }
      if (!this.body.date_input) {
        return this.$message.error('Ngày nhập không được để trống')
      }
      productResource.updateQuantity(this.body).then(response => {
        console.log('-----------------------------body', JSON.stringify(this.body))
        this.loadingSubmit = false
        if (response.error === 0) {
          this.$message.success(response.msg)
          console.log('-----------------------------------eror', response.msg)
          const obj = this.listProperties.find(d => d.id === this.body.id)
          if (obj) {
            const keys = Object.keys(this.body)
            for (const key of keys) {
              obj[key] = this.body[key]
            }
          }
          this.refreshAll()
        } else {
          this.$message.error(response.msg)
          console.log('------------------------err', response.msg)
        }
      }).catch(err => {
        this.loadingSubmit = false
        this.$message.error(err)
      })
    },
    onShowFormAddProperties() {
      console.log('...........thong tin sap ', JSON.stringify(this.objectProduct))
      this.isAddTable = true
      this.isShowForm = true
    },
    onCancelProperties() {
      this.refreshProperties()
      // this.isShowForm = false
    },
    refreshDateInput() {
      this.body.date_input = null
      this.body.cost = ''
    },
    refreshProperties() {
      this.body.param_first = ''
      this.body.param_second = ''
      this.body.number = 1
      console.log('.........refresh propertyes ', JSON.stringify(this.body))
    },
    refreshAll() {
      this.body = {}
      console.log('.........bi xoa tat ca: ', JSON.stringify(this.body))
    },
    // onEditParam(row, index) {
    //   this.indexEdit = index
    //   this.isAdd = false
    //   this.isShowForm = true
    //   this.postForm = Object.assign({}, row)
    // },
    onEditParam(row) {
      this.isAddTable = false
      this.isShowForm = true
      // this.objectParam = Object.assign({}, row)
      this.body = Object.assign({}, row)
    },
    onDeleteParam(row) {
      // this.listProperties.splice(index, 1)
      // this.$emit('onSetData', this.listProperties)
      // {"id":2779,"product_id":1116,"param_first":"Xanh đen","param_second":"MISC","number":1,"createdAt":"2021-06-15 15:00:26","updatedAt":"2021-06-15 15:00:26"}
      this.$confirm(`Bạn có chắc chắn muốn xóa thuộc tính ${row.param_first.toUpperCase()}-${row.param_second.toUpperCase()}?`).then(_ => {
        this.loadingTable = true
        productResource.deleteParam(row.id).then(response => {
          this.loadingTable = false
          if (response.error === 0) {
            this.$message.success(response.msg)
            const index = this.listProperties.findIndex(d => d.id === row.id)
            if (index !== -1) {
              this.listProperties.splice(index, 1)
            }
            // this.requestListProduct()
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(_ => {})
    }
  }
}
</script>
<style scoped>
</style>
