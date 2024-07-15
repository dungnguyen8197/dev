<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="35%"
  >
    <el-form ref="ruleForm" :model="postForm" :rules="rules" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" class="pr-lg-5">
          <el-form-item :label="('Tên chiết khấu')" prop="name">
            <el-input v-model="postForm.name" :placeholder="('nhập tên chiết khấu')" />
          </el-form-item>
          <el-row>
            <el-col :sm="24" class="pr-lg-5">
              <el-form-item :label="('Loại chiết khấu')">
                <el-select
                  v-model="postForm.type"
                  class="w-100"
                >
                  <el-option
                    v-for="_type in discount_types"
                    :key="_type.id"
                    :label="_type.name"
                    :value="_type.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="('Giá trị (tính theo %)')" prop="value" :required="true">
            <el-input v-model="postForm.value" type="number" :placeholder="('nhập giá trị chiết khấu')" />
          </el-form-item>
          <el-row v-if="postForm.type === 1">
            <el-col :sm="24" class="pr-lg-5">
              <el-form-item :label="('Nhóm hàng áp dụng')" :required="true">
                <el-select
                  v-model="postForm.category_id"
                  class="w-100"
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="postForm.type === 2" :label="('Doanh thu từ').format(postForm.condition_from ? ('price_vnd_2').format(formatNumber(postForm.condition_from)) : '') ">
            <el-input v-model="postForm.condition_from" type="number" :placeholder="('Nhập doanh thu')" />
          </el-form-item>
          <el-form-item v-if="postForm.type === 2" :label="('Doanh thu đến').format(postForm.condition_to ? ('price_vnd_2').format(formatNumber(postForm.condition_to)) : '')">
            <el-input v-model="postForm.condition_to" type="number" :placeholder="('Nhập doanh thu')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ ('canel') }}</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formatNumber } from '@/utils/convert'
// import i18n from '@/lang/i18n'
import ManageSupplierResource from '@/api/manage_supplier/index'

const supplierResource = new ManageSupplierResource()

export default {
  name: 'DialogCreateDiscount',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    isCondition: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: { titleName: ('Thêm chiết khấu'), buttonName: ('Thêm mới ') },
      discount_types: [
        {
          id: 1,
          name: 'Theo nhóm hàng'
        },
        {
          id: 2,
          name: 'Theo doanh thu'
        }
      ],
      type: 0,
      name: '',
      rules: {
        name: [
          { required: true, message: ('Tên chiết khấu không được để trống'), trigger: 'blur' }
        ],
        value: [
          { required: true, message: ('Giá trị chiết khấu không được để trống'), trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: ('Giá trị chiết khấu không được để trống'), trigger: 'blur' }
        ]
      },
      categories: [],
      loadingSubmit: false,
      postForm: {}
    }
  },
  watch: {
    showDialog(val) {
      if (val && !this.categories.length) {
        this.requestListCategory()
      }
    }
  },
  created() {
    // this.nameTitle()
  },
  methods: {
    resetModel() {
      this.postForm = {}
      this.type = 0
      this.name = ''
      this.categories = []
    },
    onSubmitForm(formName) {
      console.log('......... post form', JSON.stringify(this.postForm))
      const category = this.categories.find(d => d.id === this.postForm.category_id)
      this.postForm.category = category
      this.postForm.category_name = category ? category.name : ''
      const type = this.discount_types.find(d => d.id === this.postForm.type)
      this.postForm.type_name = type ? type.name : ''
      console.log('......... tyoe chiet khau ', type)
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (this.postForm.type === 1) {
            const category_id = parseInt(this.postForm.category_id) || 0
            delete this.postForm.condition_from
            delete this.postForm.condition_to
            if (!category_id) {
              return this.$msgbox(('Nhóm hàng không được để trống'))
            }
          } else {
            delete this.postForm.category_id
            delete this.postForm.category
            delete this.postForm.category_name
          }
          this.$emit('onClickButtonDialog', { dialog: false, reload: false, data: Object.assign({}, this.postForm) })
          this.postForm = {}
        //   if (!this.objectData.category_id || this.objectData.category_id === '' || this.objectData.category_id === undefined) {
        //     this.$message.warning(('choosen_category'))
        //   } else {
        //     if (this.isAdd) {
        //       this.handleSubmitTag()
        //     } else {
        //       this.handleUpdateTag()
        //     }
        //   }
        }
      })
    },
    // nameTitle() {
    //   if (this.isCondition === true) {
    //     this.dialog = Object.assign({}, { titleName: ('add_new_discount'), buttonName: ('add') })
    //   } else {
    //     this.dialog = Object.assign({}, { titleName: ('update_conditions'), buttonName: ('update') })
    //   }
    // },
    requestListCategory() {
      supplierResource.list_categories().then(res => {
        const { error, data } = res
        if (error === 0) {
          this.categories = data
        }
      })
    },
    onSubmit() {
      if (this.isCondition) {
        this.createCondition()
      } else {
        this.updateCondition()
      }
    },
    createCondition() {
      const body = {
        value_from: parseInt(this.objectCodition.value_from),
        value_to: parseInt(this.objectCodition.value_to),
        shop_id: this.objectCodition.shop_id
      }
      this.listCondition.push(body)
      console.log(this.listCondition)
      this.$emit('onClickButtonDialog', {
        dialog: false,
        reload: false,
        body: body
      })
    },
    updateCondition() {

    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
    },
    formatNumber
  }
}
</script>

<style>
.el-dialog__body {
  /* padding: 10px 20px; */
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-top: 10px;
  color: #606266;
  /* font-size: 14px; */
  /* word-break: break-all; */
}
.row {
    margin-top: 15px;
}
.input {
    margin-top: 10px;
}
.tem-label {
    font-size: 16px;
    color: #000;
}
</style>
