<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="objectData" :rules="rules" class="demo-ruleForm">
      <el-row v-if="objectData.id">
        <el-col :span="12">
          <div class="grid-content bg-purple" style="padding-right: 10px">
            <el-form-item label="Mã hạng mục" prop="code">
              <el-input v-model="objectData.code" disabled />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple" style="padding-right: 10px">
            <el-form-item label="Tên hạng mục" prop="name">
              <el-input v-model="objectData.name" placeholder="Nhập tên hạng mục" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="Thứ tự hiển thị(trên app,web...)" prop="sort_index">
              <el-input v-model="objectData.sort_index" placeholder="$t('order_of_display')" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="Loại dịch vụ" prop="type_service">
              <el-select v-model="objectData.type_service" style="margin-right: 10px; width: 150px;">
                <el-option v-for="item in serviceOption" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- <el-form-item label="Ảnh đại diện">
        <div class="clearfix" />
        <upload-image :url-current="objectData.thumb" @onSetUrlImage="handleSetUrlImage" />
      </el-form-item> -->
      <el-form-item label="Hoạt động">
        <el-switch
          v-model="activeCategories"
          :active-text="activeTitle"
        />
      </el-form-item>
      <el-form-item v-if="objectData.type===1" label="Thêm danh sách sản phẩm">
        <el-input v-model="list_product" type="textarea" :rows="3" placeholder="Nhập danh sách sản phẩm" />
      </el-form-item>
      <el-row v-if="objectData.type===1">
        <el-col><div class="grid-content bg-purple" align="right">
          <el-button type="primary" plain @click="handleCreateProductCategory"> Thêm mới </el-button>
        </div></el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose"> Hủy </el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import I18n from '@/lang/i18n'
import CategoryResource from '@/api/manage_supplier/index'
// import UploadImage from '@/components/UploadImage'
const categoryResource = new CategoryResource()
export default {
  name: 'DialogFormCategory',
  components: { },
  props: {
    objectData: {
      type: Object,
      default() {
        return {
          type_service: 1,
          sort_index: 1
        }
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeCategories: false,
      activeTitle: 'Tắt',
      rules: {
        name: [
          { required: true, message: 'Nhập tên hạng mục', trigger: 'blur' }
        ],
        type_service: [
          { required: true, message: 'Chọn loại dịch vu', trigger: 'blur' }
        ]
      },
      dialog: { titleName: 'Tạo mới hạng mục', buttonName: 'Thêm mới' },
      loadingSubmit: false,
      list_product: '',
      serviceOption: [
        {
          id: 1,
          name: 'Hàng hóa'
        },
        {
          id: 2,
          name: 'Sự kiện giải đấu'
        }
      ]
    }
  },
  watch: {
    isAdd(value) {
      console.log('........trang thai popup ', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Tạo mới hạng mục', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật hạng mục', buttonName: 'Cập nhật' })
      }
    },
    objectData(object) {
      if (Object.keys(object).length > 0) {
        this.activeCategories = (object.active === 1)
      }
    },
    activeCategories(value) {
      this.activeTitle = value ? 'Hoạt động' : 'Đã tắt'
      this.objectData.active = value ? 1 : 0
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (this.isAdd) {
            this.handleSubmitCreate()
          } else {
            this.handleUpdateCategory()
          }
        }
      })
    },
    handleCreateProductCategory() {
      const body = {
        category_id: this.objectData.id,
        list_product: this.list_product
      }
      categoryResource.storeProductCategory(body).then(res => {
        const { error, msg } = res
        if (error === 0) {
          this.$message({ message: msg, type: 'success', dangerouslyUseHTMLString: true })
        } else {
          this.$message({ message: msg, type: 'error', dangerouslyUseHTMLString: true })
        }
      })
    },
    handleSubmitCreate() {
      this.loadingSubmit = true
      this.objectData.sort_index = parseInt(this.objectData.sort_index)
      categoryResource.storeCategory(this.objectData).then(response => {
        this.loadingSubmit = false
        if (response.error === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true })
          this.$message.success('Tạo hạng mục thành công!')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleUpdateCategory() {
      this.loadingSubmit = true
      this.objectData.sort_index = parseInt(this.objectData.sort_index)
      categoryResource.updateCategory(this.objectData).then(response => {
        this.loadingSubmit = false
        if (response.error === 0) {
          this.$emit('onClickButtonDialog', { dialog: false, reload: true, data: this.objectData })
          this.$message.success(response.msg)
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleSetUrlImage(object) {
      if (object.remove === 1) {
        this.objectData.thumb = ''
      } else {
        this.objectData.thumb = object.name
      }
    },
    handleClose() {
      this.$emit('onClickButtonDialog', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
