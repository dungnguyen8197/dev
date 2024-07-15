<template>
  <div class="p-10">
    <el-row>
      <el-col :span="12">
        <h4>Biên tập sản phẩm</h4>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="mini" @click="dialogFormVisible = true">Thêm sản phẩm +</el-button>
      </el-col>
    </el-row>
    <el-row class="p-10">
      <!--      <el-col :span="4" class="mr-1">-->
      <!--        <el-select-->
      <!--          v-model="listQuery.category_id"-->
      <!--          size="small"-->
      <!--          clearable-->
      <!--          placeholder="Tìm kiếm theo danh mục sản phẩm"-->
      <!--          style="width: 200px;"-->
      <!--          class="filter-item mr-10 w-100"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="item in categories"-->
      <!--            :key="item.id"-->
      <!--            :label="item.category"-->
      <!--            :value="item.id"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-col>-->
      <!--      <el-col :span="4" class="mr-1">-->
      <!--        <el-select v-model="listQuery.is_public" clearable class="w-100" size="small" placeholder="Trạng thái đơn">-->
      <!--          <el-option label="Mở bán" value="1" />-->
      <!--          <el-option label="Tạm dừng" value="0" />-->
      <!--        </el-select>-->
      <!--      </el-col>-->
      <el-col :span="4" class="mr-1">
        <el-input v-model="listQuery.q" class="required" required clearable size="small" placeholder="Nhập tên sản phẩm" />
      </el-col>
      <el-col :span="4" class="mr-1">
        <el-select
          v-model="listQuery.category_id"
          filterable
          clearable
          remote
          size="small"
          class="w-100"
          placeholder="Danh mục cha"
        >
          <el-option
            v-for="key in categoriesFilter"
            :key="key.id"
            :label="key.category"
            :value="key.id"
          />
        </el-select>
      </el-col>
      <el-col :span="4" class="mr-1">
        <el-select
          v-model="listQuery.id_sub_category"
          filterable
          clearable
          size="small"
          remote
          class="w-100"
          placeholder="Danh mục con"
        >
          <el-option
            v-for="key in subCategoriesFilter"
            :key="key.id"
            :label="key.title"
            :value="key.id"
          />
        </el-select>
      </el-col>
      <el-col :span="4" class="mr-1">
        <el-select
          v-model="listQuery.is_public"
          filterable
          clearable
          size="small"
          remote
          class="w-100"
          placeholder="public"
        >
          <el-option
            v-for="key in publics"
            :key="key.value"
            :label="key.label"
            :value="key.value"
          />
        </el-select>
      </el-col>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="onGetListProductByCategory(false)">
        Tìm kiếm
      </el-button>
      <!--      <el-col :span="4" class="mr-1">-->
      <!--        <search-admin size="small" @selection-changed-admin="handleSelectionChangedAdmin" />-->
      <!--      </el-col>-->
      <!--      <el-col :span="4" class="mr-1">-->
      <!--        <search-user size="small" @selection-changed-user="handleSelectionChangedUser" />-->
      <!--      </el-col>-->
      <!--      <el-col :span="4" class="mr-1">-->
      <!--        <search-facility size="small" @selection-changed-facility="handleSelectionChangedFacility" />-->
      <!--      </el-col>-->
      <!--      <el-col :span="4" class="mr-1">-->
      <!--        <el-select-->
      <!--          v-model="listQuery.status"-->
      <!--          size="small"-->
      <!--          clearable-->
      <!--          placeholder="Trạng thái"-->
      <!--          style="width: 200px;"-->
      <!--          class="filter-item mr-10"-->
      <!--        >-->
      <!--          <el-option value="1" label="2">-->

      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-col>-->
    </el-row>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--        <el-tab-pane v-for="(category, index) in categories" :key="index" :label="category.category" :name="String(category.id)">-->
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="STT"
            :index="handleIndexMethod"
            width="50"
            align="center"
          />
          <el-table-column
            label="Danh mục"
            width="180"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.InfoCategory.category }}
            </template>
          </el-table-column>
          <el-table-column
            label="Danh mục con"
            width="180"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.InfoCategory.InfoSubCategory.title }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="Model"
            width="180"
            align="center"
          />
          <el-table-column
            prop="address"
            label="Hình ảnh"
            align="center"
          >
            <template slot-scope="{row}">
              <img
                :src="row.image"
                alt=""
                width="100%"
              >
            </template>
          </el-table-column>
          <el-table-column label="Giá tiền" prop="price" align="center">
            <template slot-scope="{row}">
              {{ formatNumber(row.price) }}
            </template>
          </el-table-column>
          <el-table-column label="Ngày tạo" prop="created_at" align="center" />
          <!--          <el-table-column label="Mô tả" prop="money" align="center" />-->
          <el-table-column label="Hiển thị trên app" align="center">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_public"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                @change="changeDisplay(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="Hành động" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleEdit(row)">Sửa</el-button>
              <!--              <el-button type="danger" size="mini" @click="handleDelete(row)">Xóa</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>
    <pagination
      v-show="total > listQuery.number"
      :total="total"
      :limit.sync="listQuery.number"
      :page.sync="listQuery.page"
      @pagination="onGetListProductByCategory(true)"
    />
    <el-dialog :title="!isEmpty(formCreate.product_id) ? 'Sửa sản phẩm' : 'Tạo mới sản phẩm'" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="formCreate">
        <el-row>
          <el-col :span="24">
            <label>Tên sản phẩm: <span class="required">*</span></label>
            <el-input v-model="formCreate.name" required autocomplete="off" class="w-100 pr-10" />
          </el-col>
        </el-row>
        <el-row>
          <label>Danh mục: <span class="required">*</span></label>
          <el-form-item class="pr-10">
            <el-select v-model="formCreate.category_id" :disabled="!isEmpty(formCreate.product_id)" required class="w-100" placeholder="Chọn danh mục" @change="changeCategory">
              <template v-for="(cat, index) in categories">
                <el-option v-if="cat.is_public === 1" :key="index" :label="cat.category" :value="cat.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <label>Chọn loại/dòng: <span class="required">*</span></label>
            <el-form-item class="">
              <el-select v-model="formCreate.detail_key" :disabled="!isEmpty(formCreate.product_id)" required placeholder="Chọn loại dòng" class="w-100 pr-10">
                <template v-for="(cat, index) in subCategory">
                  <el-option v-if="cat.is_public === 1" :key="index" :label="cat.title" :value="cat.key" />
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <label>Model: </label>-->
          <!--            <el-input v-model="formCreate.model" autocomplete="off" class="w-100 pr-10" />-->
          <!--          </el-col>-->
        </el-row>
        <el-row>
          <label>Giá tiền: <span class="required">*</span></label>
          <el-input v-model="formCreate.price" min="1" required autocomplete="off" class="w-100 pr-10" @keyup.native="formatPrice" />
        </el-row>
        <el-row>
          <label>Phí bảo hiểm: <span class="required">*</span></label>
          <el-input v-model="formCreate.fee" required autocomplete="off" class="w-100 pr-10" />
        </el-row>
        <el-row>
          <el-form-item label="Ảnh hiển thị" required>
            <el-form-item prop="image">
              <div class="clearfix" />
              <el-upload
                ref="upload"
                class="upload-demo"
                name="image"
                action="https://api-v2.vcallid.com/api/utils/upload/data"
                :file-list="keyImage"
                :on-error="onError"
                :on-success="onSuccess"
                :on-remove="onRemoveImage"
                :on-change="onPickKeyImage"
                :limit="1"
                :auto-upload="false"
                :on-exceed="(file, fileList) => handleExceed(file, fileList, 1)"
                list-type="picture-card"
              >
                <i class="el-icon-upload" />
                <div slot="tip" class="el-upload__tip" style="font-style: italic">Kích thước ảnh khuyến nghị 145x120</div>
              </el-upload>
            </el-form-item>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitFormCreateProduct">Xác nhận</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import PhysicalDamegeInsurance from '@/api/HIO/physicalDamegeInsurance'
import { formatNumber } from '@/utils/convert'
import { Message } from 'element-ui'
import { getAdmin } from '@/utils/auth'
// import SearchAdmin from '@/views/component/SearchAdmin.vue'
// import SearchUser from '@/views/component/SearchUser.vue'
// import SearchFacility from '@/views/component/SearchFacility.vue'
import { isEmpty } from '@/utils/validate'

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()

export default {
  name: 'InsuranceProductIndex',
  components: {
    // SearchFacility,
    // SearchUser,
    // SearchAdmin,
    Pagination
  },
  data() {
    return {
      priceFormat: 0,
      listQuery: {
        q: '',
        page: 1,
        number: 10
      },
      total: 2000,
      tableData: [],
      loadingTable: false,
      activeName: 'first',
      categories: [],
      dialogFormVisible: false,
      formCreate: {},
      keyImage: [],
      subCategory: [],
      isUploadImage: true,
      admin: getAdmin(),
      isSearch: false,
      isEdit: false,
      categoriesFilter: [],
      subCategoriesFilter: [],
      publics: [{ value: 0, label: 'Không public' }, { value: 1, label: 'Public' }]
    }
  },
  watch: {
    'listQuery.category_id'(value) {
      if (value) {
        delete this.listQuery.id_sub_category
        const data = this.categoriesFilter.find(item => item.id === value)
        this.subCategoriesFilter = [...data.list_sub_category].filter(item => item.is_public === 1)
      } else {
        delete this.listQuery.id_sub_category
        this.subCategoriesFilter = []
        this.categories.filter(item => item.is_public === 1).map(item => { this.subCategoriesFilter = [...this.subCategoriesFilter, ...item.list_sub_category].filter(item => item.is_public === 1) })
      }
    }
  },
  created() {
    this.onGetListProductByCategory(false)
    this.getListCategory()
  },
  methods: {
    onGetListProductByCategory(isPaginate = false) {
      console.log('isPaginate..............', isPaginate)
      this.loadingTable = true
      if (!isPaginate) {
        this.listQuery.page = 1
      }
      console.log('this.listQuery..............', this.listQuery)
      if (!isEmpty(this.listQuery.category_id) || !isEmpty(this.listQuery.id_sub_category) || !isEmpty(this.listQuery.is_public) || !isEmpty(this.listQuery.q)) {
        physicalDamageInsuranceProductResource.listMaterialCovered(this.listQuery).then(response => {
          console.log('response................', response)
          if (response.error_code === 0) {
            this.tableData = response.data
            console.log('this.tableData................', this.tableData)
          } else {
            this.$message.error(response?.error_msg)
          }
          this.loadingTable = false
        })
        return
      }

      physicalDamageInsuranceProductResource.listProduct(this.listQuery).then(response => {
        console.log('response................', response)
        if (response.error_code === 0) {
          if (response.data.length > 0) {
            this.tableData = response.data
            console.log('this.tableData................', this.tableData)
          }
        }
        this.loadingTable = false
      })
      this.tableData = []
    },
    getListCategory() {
      physicalDamageInsuranceProductResource.listCategoryProduct().then(response => {
        console.log('response................', response)
        this.categories = response.data
        console.log('this.categories................', this.categories)
        this.categoriesFilter = response.data.filter(item => item.is_public === 1)
        this.categoriesFilter.map(item => { this.subCategoriesFilter = [...this.subCategoriesFilter, ...item.list_sub_category].filter(item => item.is_public === 1) })
        console.log('this.subCategoriesFilter................', this.subCategoriesFilter)
        // this.activeName = String(this.categories[0].id)
        console.log('this.activeName................', String(this.activeName))
        // this.onGetListProductByCategory(this.activeName)
      })
    },
    handleClick(tab, event) {
      console.log('this.activeName................', this.activeName)
      console.log('tab................', tab.name)
      this.onGetListProductByCategory(false)
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.number + index + 1
    },
    handleEdit(row) {
      console.log('row................', row)
      console.log('categories................', this.categories)
      this.dialogFormVisible = true
      this.formCreate = Object.assign({}, row)
      this.formCreate.price = formatNumber(row.price)
      this.formCreate.product_id = row.id
      this.keyImage.push({
        name: 'image',
        url: row.image
      })
      this.isEdit = true
    },
    handleDelete(row) {
      console.log('row................', row)
    },
    changeDisplay(row) {
      console.log('row................', row)
      const params = {
        uid: this.admin.id,
        type: 3,
        is_hidden: row.is_public === 1 ? 1 : 0,
        id_select: row.id
      }
      physicalDamageInsuranceProductResource.changeDisplay(params).then(response => {
        console.log('response................', response)
        if (response.error_code === 1) {
          console.log('response................', response)
          this.$message.error('Thay đổi trạng thái thất bại')
          return
        }
        this.$message.success('Thay đổi trạng thái thành công')
        this.onGetListProductByCategory(false)
      })
    },
    submitFormCreateProduct() {
      console.log('this.formCreate................', this.formCreate)
      console.log('this.isUploadImage................', this.isUploadImage)
      console.log('this.keyImage................', this.keyImage)
      if (this.isUploadImage && this.keyImage.length === 0) {
        this.$refs.upload.submit()
      } else {
        if (isEmpty(this.formCreate.name)) {
          this.$message.error('Vui lòng nhập tên sản phẩm')
          return
        }

        if (isEmpty(this.formCreate.category_id) && isEmpty(this.formCreate.product_id)) {
          this.$message.error('Vui lòng chọn danh mục sản phẩm')
          return
        }
        if (isEmpty(this.formCreate.detail_key) && isEmpty(this.formCreate.product_id)) {
          this.$message.error('Vui lòng chọn loại dòng')
          return
        }
        if (isEmpty(this.formCreate.price)) {
          this.$message.error('Vui lòng nhập giá sản phẩm')
          return
        }
        this.formCreate.price = this.formCreate.price.replace(/\./g, '')

        console.log('parseInt(this.formCreate.price)......................................', parseInt(this.formCreate.price) < 10000000)
        if (parseInt(this.formCreate.price) < 10000000) {
          this.$message.error('Giá sản phẩm không được nhỏ hơn 10.000.000')
          return
        }

        if (isEmpty(this.formCreate.fee)) {
          this.$message.error('Vui lòng nhập phí bh')
          return
        }

        if (this.isEdit) {
          console.log('this.formCreate................', this.formCreate)
          physicalDamageInsuranceProductResource.updateProduct(this.formCreate).then(response => {
            console.log('response................', response)
            if (response.error_code === 0) {
              this.$message.success('Cập nhật sản phẩm thành công')
              this.closeDialog()
              this.onGetListProductByCategory(false)
            } else {
              this.$message.error('Cập nhật sản phẩm thất bại')
            }
          })
          return
        }
        physicalDamageInsuranceProductResource.createProduct(this.formCreate).then(response => {
          console.log('response................', response)
          if (response.error_code === 0) {
            this.$message.success('Tạo mới sản phẩm thành công')
            this.closeDialog()
            this.onGetListProductByCategory(false)
          } else {
            this.$message.error('Tạo mới sản phẩm thất bại')
          }
        })
      }
    },
    onPickKeyImage(value, array) {
      if (value?.raw?.type !== 'image/png' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng ảnh là PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.keyImage = array
      } else if (value.size > 100000000) {
        Message({
          message: `Kích thước ảnh tối đa là 100.000 mb, bạn đang chọn ảnh ${value.name} với kích thước ${formatNumber(value.size)} kb`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.keyImage = array
      } else {
        if (value.status !== 'success') {
          console.log('this.keyImage................', this.keyImage)
        }
      }
    },
    handleExceed(files, fileList, length) {
      Message({
        message: `Tối đa là ${length} hình ảnh, bạn đang chọn ${files.length + fileList.length} hình ảnh`,
        type: 'warning',
        duration: 5 * 1000
      })
    },
    onSuccess(res) {
      console.log('res................', res)
      this.isUploadImage = false
      this.formCreate.image = res.name
      console.log('this.formCreate................', this.formCreate)
      this.submitFormCreateProduct()
    },
    onError(err) {
      console.log('err................', err)
      this.$message.error('Upload file thất bại')
    },
    closeDialog() {
      this.formCreate = {}
      this.subCategory = []
      this.dialogFormVisible = false
      this.isUploadImage = true
      this.$refs.upload.clearFiles()
      this.isEdit = false
      this.keyImage = []
    },
    changeCategory(value) {
      console.log('value................', value)
      const category = this.categories.find(item => item.id === value)
      console.log('category................', category)
      this.subCategory = category.list_sub_category
    },
    handleSelectionChangedAdmin(data) {
      console.log('data................', data)
      this.listQuery.admin_id = data
      this.isSearch = true
    },
    handleSelectionChangedUser(data) {
      console.log('data................', data)
      this.listQuery.user_id = data.value
      this.isSearch = true
    },
    handleSelectionChangedFacility(data) {
      console.log('data................', data)
      this.listQuery.facility_id = data.value
      this.isSearch = true
    },
    onRemoveImage(value, array) {
      this.keyImage = []
      this.isUploadImage = true
      if (value?.raw?.type !== 'image/png') {
        Message({
          message: `Yêu cầu định dạng ảnh là PNG`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
        this.keyImage = array
      }
    },
    formatPrice(val) {
      console.log('val................', this.formCreate.price)
      if (val) {
        this.formCreate.price = this.formCreate.price.replace(/[^0-9]/g, '')
      }

      if (this.formCreate.price) {
        this.formCreate.price = formatNumber(this.formCreate.price)
      }
      console.log('this.formCreate.price................', this.formCreate.price)
    },
    changeSearch(val) {
      this.onGetListProductByCategory(false)
    },
    formatNumber, isEmpty
  }
}
</script>

<style lang="scss">
.p-10 {
  padding: 10px;
}

.pr-10 {
  padding-right: 10px;
}

.pt-10 {
  padding-top: 10px;
}

.pb-10 {
  padding-bottom: 10px;
}

.pl-10 {
  padding-left: 10px;
}

.required {
  color: red;
}
</style>
