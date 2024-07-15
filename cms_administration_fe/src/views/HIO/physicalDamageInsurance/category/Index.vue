<template>
  <div class="p-10">
    <el-row>
      <el-col :span="12">
        <h4>Danh sách danh mục</h4>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="mini" @click="dialogFormVisible = true">Thêm danh mục +</el-button>
        <el-button type="primary" size="mini" @click="dialogFormSubVisible = true">Thêm danh mục con +</el-button>
      </el-col>
    </el-row>
    <div>
      <table class="w-100 border table-bordered">
        <thead>
          <th class="text-center">STT</th>
          <th class="text-center">Tên danh mục</th>
          <th class="text-center">Danh mục con</th>
          <th class="text-center">Hiển thị danh mục con</th>
          <th class="text-center">Hiển thị danh mục cha</th>
          <th class="text-center">Hành động</th>
          <th class="text-center">Hành động Cat</th>
        </thead>
        <tbody>
          <template v-for="(cat, indexCat) in tableData">
            <template v-if="cat.list_sub_category.length > 0">
              <tr
                v-for="(subCat, indexSubCat) in cat.list_sub_category"
                :key="cat.id + '-' + indexSubCat"
                class="text-center"
              >
                <td v-if="indexSubCat === 0" :rowspan="cat.list_sub_category.length">
                  {{ indexCat + 1 }}
                </td>
                <td v-if="indexSubCat === 0" :rowspan="cat.list_sub_category.length">
                  {{ cat.category }}
                </td>
                <td>
                  {{ subCat.title }}
                </td>
                <td>
                  <el-switch
                    v-model="subCat.is_public"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    @change="changeDisplaySubCat(subCat)"
                  />
                </td>
                <td v-if="indexSubCat === 0" :rowspan="cat.list_sub_category.length">
                  <el-switch
                    v-model="cat.is_public"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    @change="changeDisplay(cat)"
                  />
                </td>
                <td class="p-10">
                  <el-button type="primary" size="mini" @click="handleOpenDialogEdit(subCat, cat)">Sửa</el-button>
                </td>
                <td v-if="indexSubCat === 0" class="p-10" :rowspan="cat.list_sub_category.length">
                  <el-button type="primary" size="mini" @click="handleOpenDialogEditCat(cat)">Sửa</el-button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr class="text-center">
                <td class="p-10">
                  {{ indexCat + 1 }}
                </td>
                <td>
                  {{ cat.category }}
                </td>
                <td />
                <td />
                <td>
                  <el-switch
                    v-model="cat.is_public"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    @change="changeDisplay(cat)"
                  />
                </td>
                <td class="p-10" />
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <pagination
      v-show="total > listQuery.limit"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="onGetListCategory"
    />
    <el-dialog :title="!isEmpty(formCreate.category) ? 'Sửa danh mục' : 'Tạo mới danh mục'" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="formCreate">
        <el-row>
          <label>Tên danh mục:</label>
          <el-form-item class="pr-10">
            <el-input v-model="formCreate.category" autocomplete="off" class="w-100 pr-10" />
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitFormCreateCategory">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="isEmpty(formCreateSub.id_sub_category) ? 'Tạo mới danh mục con' : 'Sửa danh mục con'"
      :visible.sync="dialogFormSubVisible"
      @close="closeDialog"
    >
      <el-form :model="formCreateSub">
        <el-row>
          <label>Tên danh mục con: <span class="required">*</span> </label>
          <el-form-item class="pr-10">
            <el-input v-model="formCreateSub.title" autocomplete="off" class="w-100 pr-10" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <label>Chọn loại/dòng: <span class="required">*</span></label>
            <el-form-item class="">
              <el-select v-model="formCreateSub.category_id" :disabled="!isEmpty(formCreateSub.id_sub_category)" placeholder="Chọn loại dòng" class="w-100 pr-10">
                <el-option v-for="(cat, index) in categories" :key="index" :label="cat.category" :value="cat.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSubVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitFormCreateSubCategory">Confirm</el-button>
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
import { isEmpty } from '@/utils/validate'

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()

export default {
  name: 'InsuranceProductIndex',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        number: 10
      },
      total: 0,
      tableData: [],
      loadingTable: false,
      categories: [],
      dialogFormVisible: false,
      dialogFormSubVisible: false,
      formCreate: {
        category: ''
      },
      formCreateSub: {
        title: '',
        category_id: ''
      },
      keyImage: [],
      admin: getAdmin(),
      isUpdateSubCat: false,
      isUpdateCat: false
    }
  },
  created() {
    this.onGetListCategory()
  },
  methods: {
    isEmpty,
    onGetListCategory() {
      physicalDamageInsuranceProductResource.listCategoryProduct().then(response => {
        console.log('response................', response)
        this.tableData = response.data
        console.log('tableData................', this.tableData)
        this.categories = response.data
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.number + index + 1
    },
    handleOpenDialogEdit(subCat, cat) {
      console.log('row................', subCat)
      console.log('row................', cat)
      this.dialogFormSubVisible = true
      this.formCreateSub = {
        title: subCat.title,
        id_sub_category: subCat.id,
        category_id: cat.id
      }
      this.isUpdateSubCat = true
    },
    handleOpenDialogEditCat(cat) {
      console.log('row................', cat)
      this.dialogFormVisible = true
      this.formCreate = {
        category: cat.category,
        id_category: cat.id
      }
      this.isUpdateCat = true
    },
    handleDelete(row) {
      console.log('row................', row)
    },
    changeDisplay(row) {
      console.log('row................', row)
      const params = {
        uid: this.admin.id,
        type: 1,
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
        this.onGetListCategory()
      })
    },
    closeDialog() {
      this.formCreate = {}
      this.keyImage = []
      this.formCreateSub = {}
      this.isUpdateSubCat = false
      this.isUpdateCat = false
    },
    submitFormCreateSubCategory() {
      console.log('this.formCreateSub................', this.formCreateSub)
      if (isEmpty(this.formCreateSub.title)) {
        Message({
          message: `Vui lòng nhập tên danh mục con`,
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }
      if (isEmpty(this.formCreateSub.category_id)) {
        Message({
          message: `Vui lòng chọn danh mục cha`,
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }
      this.formCreateSub.cms_id = this.admin.id
      console.log('this.formCreateSub................', this.formCreateSub)
      if (this.isUpdateSubCat) {
        physicalDamageInsuranceProductResource.updateSubCategory(this.formCreateSub).then(response => {
          console.log('response................', response)
          if (response.error_code === 1) {
            this.$message.error('Cập nhật thất bại')
            return
          }
          this.$message.success('Cập nhật thành công')
          this.dialogFormSubVisible = false
          this.onGetListCategory()
        })
        return
      }
      physicalDamageInsuranceProductResource.createSubCategory(this.formCreateSub).then(response => {
        console.log('response................', response)
        if (response.error_code === 1) {
          console.log('response................', response)
          this.$message.error('Tạo danh mục con thất bại')
          return
        }
        this.$message.success('Tạo danh mục con thành công')
        this.dialogFormSubVisible = false
        this.onGetListCategory()
      })
    },
    submitFormCreateCategory() {
      console.log('this.formCreate................', this.formCreate)
      if (this.formCreate.category === '') {
        Message({
          message: `Vui lòng nhập tên danh mục`,
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }
      this.formCreate.cms_id = this.admin.id
      if (this.isUpdateCat) {
        this.formCreate.name_category = this.formCreate.category
        physicalDamageInsuranceProductResource.updateCategory(this.formCreate).then(response => {
          console.log('response................', response)
          if (response.error_code === 1) {
            this.$message.error('Cập nhật thất bại')
            return
          }
          this.$message.success('Cập nhật thành công')
          this.dialogFormVisible = false
          this.onGetListCategory()
        })
        return
      }
      console.log('this.formCreate................', this.formCreate)
      physicalDamageInsuranceProductResource.createCategory(this.formCreate).then(response => {
        console.log('response................', response)
        if (response.error_code === 1) {
          console.log('response................', response)
          this.$message.error('Tạo danh mục thất bại')
          return
        }
        this.$message.success('Tạo danh mục thành công')
        this.dialogFormVisible = false
        this.onGetListCategory()
      })
    },
    changeDisplaySubCat(subCat) {
      console.log('subCat................', subCat)
      const params = {
        uid: this.admin.id,
        type: 2,
        is_hidden: subCat.is_public === 1 ? 1 : 0,
        id_select: subCat.id
      }
      physicalDamageInsuranceProductResource.changeDisplay(params).then(response => {
        console.log('response................', response)
        if (response.error_code === 1) {
          console.log('response................', response)
          this.$message.error('Thay đổi trạng thái thất bại')
          return
        }
        this.$message.success('Thay đổi trạng thái thành công')
        this.onGetListCategory()
      })
    },
    formatNumber
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

.border-bottom {
  border-bottom: 1px solid #ebeef5;
}
</style>
