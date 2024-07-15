<template>
  <!-- <el-row class="app-container list-product"> -->
  <div id="debt-page">
    <!-- <el-row class="list-product__header mb-10"> -->
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <p style="margin-right: 15px; margin-bottom: 0px" @click="onBack"><i class="el-icon-back" /></p>
        <h3 style="margin: 0px">{{ ("Quản lý sản phẩm") }}</h3>
      </div>
      <div>
        <div class="text-right">
          <el-button
            v-if="is_write"
            type="warning"
            @click="updateProductExist = true"
          >{{ ("Cập nhật tồn kho") }}</el-button>
          <el-button
            v-if="is_export"
            type="primary"
            icon="el-icon-download"
            @click="onDownloadFileSimplePress"
          >{{ ("Tải file mẫu") }}</el-button>
          <el-button
            v-if="is_write"
            type="warning"
            @click="showDialogImport = true"
          >{{ ("Import Excel") }}</el-button>
          <el-button
            v-if="is_export"
            type="primary"
            icon="el-icon-download"
            @click="showDialogExport"
          >{{ ("Export Excel") }}</el-button>

          <!-- <el-button type="primary" icon="el-icon-search" round @click="onGetListProduct">Tìm kiếm</el-button> -->
          <el-button
            v-if="is_write"
            type="primary"
            @click="onShowDialogCreate"
          >{{ ("+ Thêm mới") }}</el-button>
          <!--            <el-col :sm="17" class="pr-lg-5">-->
          <!--              <el-select v-model="sort_type_data" placeholder="Sắp xếp">-->
          <!--                <el-option v-for="sort in list_sort_type" :key="sort.key" :label="sort.name" :value="sort" />-->
          <!--              </el-select>-->
          <!--            </el-col>-->
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <div style="width: 17%;">
        <!-- <el-select v-model="shopId" :placeholder="('filter_shop')">
          <el-option v-for="shop in shops" :key="shop.id" :label="shop.name" :value="shop.id" />
          </el-select> -->
        <el-select
          v-model="shopId"
          style="width: 100%"
          class="w-100"
          remote
          :multiple-limit="1"
          :placeholder="('Lọc theo shop')"
        >
          <el-option
            v-for="shop in shops"
            :key="shop.id"
            :label="shop.name"
            :value="shop.id"
          />
        </el-select>
      </div>
      <div style="width: 20%;">
        <!-- <el-select v-model="categoryId" :placeholder="('filter_cate')">
            <el-option v-for="cate in categories" :key="cate.id" :label="cate.name" :value="cate.id" />
          </el-select> -->
        <el-select
          v-model="categoryId"
          style="width: 100%"
          class="w-100"
          remote
          :multiple-limit="1"
          :placeholder="('Lọc theo danh mục')"
        >
          <el-option
            v-for="cate in categories"
            :key="cate.id"
            :label="cate.name"
            :value="cate.id"
          />
        </el-select>
      </div>
      <div style="width: 22%;">
        <!-- <el-select v-model="trademarkId" :placeholder="('filter_trademarks')">
            <el-option
              v-for="mark in trademarks"
              :key="`mark_${mark.id}`"
              :label="mark.name"
              :value="mark.id"
            />
          </el-select> -->
        <el-select
          v-model="trademarkId"
          style="width: 100%"
          class="w-100"
          remote
          :multiple-limit="1"
          :placeholder="('Lọc theo thương hiệu')"
        >
          <el-option
            v-for="mark in trademarks"
            :key="`mark_${mark.id}`"
            :label="mark.name"
            :value="mark.id"
          />
        </el-select>
      </div>
      <div style="width: 22%;">
        <!-- <el-select v-model="trademarkId" :placeholder="('filter_trademarks')">
            <el-option
              v-for="mark in trademarks"
              :key="`mark_${mark.id}`"
              :label="mark.name"
              :value="mark.id"
            />
          </el-select> -->
        <el-select
          v-model="typeInput"
          style="width: 100%"
          class="w-100"
        >
          <el-option
            v-for="ti in type_input"
            :key="ti.id"
            :label="ti.name"
            :value="ti.id"
          />
        </el-select>
      </div>
      <div style="width: 16%;">
        <!-- <el-select v-model="tagId" :placeholder="('filter_tag')">
            <el-option
              v-for="tag in tags"
              :key="`ta_${tag.id}`"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select> -->
        <el-select
          v-model="tagId"
          style="width: 100%"
          class="w-100"
          remote
          :multiple-limit="1"
          :placeholder="('Lọc theo tag')"
        >
          <el-option
            v-for="tag in tags"
            :key="`ta_${tag.id}`"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </div>
      <!-- <el-col :sm="4" class="pr-lg-2 pb-3">
          <el-select v-model="activeId" :placeholder="('filter_active')">
            <el-option
              v-for="ac in actives"
              :key="ac.id"
              :label="ac.name"
              :value="ac.id"
            />
          </el-select>
        </el-col> -->
      <!-- <el-col :sm="3" class="pr-lg-2">
          <el-input v-model="listQuery.q" :placeholder="('Nhập tên sản phẩm')" />
        </el-col>
        <el-col :sm="3" class="pr-lg-2">
          <el-select v-model="filterId" :placeholder="('Tìm theo từ khóa')">
            <el-option
              v-for="filter in filters"
              :key="`filter_${filter.key}`"
              :label="filter.name"
              :value="filter.key"
            />
          </el-select>
        </el-col>
        <el-col :sm="2" class="pr-lg-2">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="requestListProduct"
          >{{ ("Tìm kiếm") }}
          </el-button>
        </el-col> -->
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <div style="display: flex; width: 100%; justify-content: flex-end; margin-right: 10px;">
        <div style="margin-right: 10px;">
          <el-input v-model="listQuery.q" :placeholder="('Nhập tên sản phẩm')" />
        </div>
        <div>
          <el-select v-model="filterId" :placeholder="('Tìm theo từ khóa')">
            <el-option
              v-for="filter in filters"
              :key="`filter_${filter.key}`"
              :label="filter.name"
              :value="filter.key"
            />
          </el-select>
        </div>
      </div>
      <div style="width: 160px; margin-right: 10px;">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="requestListProduct"
        >{{ ("Tìm kiếm") }}
        </el-button>
      </div>
      <div style="width: 280px; margin-right: 10px;">
        <el-select v-model="activeId" :placeholder="('Lọc theo trạng thái')">
          <el-option
            v-for="ac in actives"
            :key="ac.id"
            :label="ac.name"
            :value="ac.id"
          />
        </el-select>
      </div>
      <div style="width: 160px;">
        <el-button icon="el-icon-refresh" @click="onRefresh">
          {{ ("Refresh") }}
        </el-button>
      </div>
    </div>
    <!-- </el-row> -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="Hàng hóa" name="first" />
      <el-tab-pane label="Dịch vụ" name="second" />
      <el-row class="list-product__data">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          :element-loading-text="loading_text"
          border
          style="width: 100%"
        >
          <el-table-column label="Id" align="center" width="90">
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDialogDetail(scope.row)">{{
                `#${scope.row.id}`
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="Logo" width="110" align="center">
            <template slot-scope="scope">
              <span class="demonstration">{{ scope.row.contain }}</span>
              <el-link
                type="primary"
                @click="onShowDialogProductDetail(scope.row.images)"
              >
                <el-image
                  v-if="scope.row.thumb"
                  :src="scope.row.thumb"
                  :fit="contain"
                />
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="product_code" :label="('Mã sản phẩm')" align="center" />

          <el-table-column prop="name" :label="('Tên sản phẩm')" align="center" />
          <el-table-column :label="('NCC')" align="center">
            <template slot-scope="scope">{{
              scope.row.shop_name ? scope.row.shop_name : ""
            }}</template>
          </el-table-column>
          <el-table-column :label="('Hạng mục')" align="center">
            <template slot-scope="scope">{{
              scope.row.category_name ? scope.row.category_name : ""
            }}</template>
          <!-- <template slot-scope="scope">
              <el-row>
                <span> {{ `Shop: ${scope.row.shop_name ? scope.row.shop_name : ""}` }} </span>
              </el-row>
              <el-row>
                <span> {{ `Category: ${scope.row.category_name ? scope.row.category_name : ""}` }} </span>
              </el-row>
              <el-row>
                <span> {{ `Trademark: ${scope.row.trademark_name ? scope.row.trademark_name : ""}` }} </span>
              </el-row>
              <el-row>
                <span> {{ `Tags: ${scope.row.tag_name ? scope.row.tag_name : ""}` }} </span>
              </el-row>
            </template> -->
          </el-table-column>
          <el-table-column :label="('Thương hiệu')" align="center">
            <template slot-scope="scope">{{
              scope.row.trademark_name ? scope.row.trademark_name : ""
            }}</template>
          </el-table-column>
          <el-table-column :label="('Tag')" align="center">
            <template slot-scope="scope">{{
              scope.row.tag_name ? scope.row.tag_name : ""
            }}</template>
          </el-table-column>
          <el-table-column v-if="activeName === 'first'" :label="('Phương thức phân phối')" align="center">
            <template slot-scope="scope">{{
              (scope.row.type_input === 1 ) ? ('Nhập kho') : ('Không qua kho')
            }}</template>
          </el-table-column>
          <!-- <el-table-column :label="('Giá nhập')" align="center">
            <template slot-scope="scope">{{ typeof scope.row.cost === 'number' ?
              formatNumber(scope.row.cost) : scope.row.cost
            }}</template>
          </el-table-column> -->
          <!-- <el-table-column :label="('price_info')" align="center">
            <template slot-scope="scope">
              <el-row>
                <span class="text_bold"> {{ `${('import_price')}: ` }} </span>
                <span style="text-align: left;"> {{ `${scope.row.cost ? ('price_vnd_2').format(formatNumber(scope.row.cost)) : ""}` }} </span>
              </el-row>
              <el-row>
                <span style="text-align: left;"> {{ `${('price')}: ${scope.row.price ? ('price_vnd_2').format(formatNumber(scope.row.price)) : ""}` }} </span>
              </el-row>
              <el-row>
                <span style="text-align: left;"> {{ `${('price_sale')}: ${scope.row.price_sale ? ('price_vnd_2').format(formatNumber(scope.row.price_sale)) : ""}` }} </span>
              </el-row>
            </template>
          </el-table-column> -->
          <!-- <el-table-column :label="('Giá niêm yết')" align="center">
            <template slot-scope="scope">{{ formatNumber(scope.row.price) }}</template>

          </el-table-column>
          <el-table-column :label="('Giá bán')" align="center">
            <template slot-scope="scope">{{ formatNumber(scope.row.price_sale) }}</template>
          </el-table-column>
          <el-table-column :label="('Giá đại lý')" align="center">
            <template slot-scope="scope">{{ formatNumber(scope.row.agency_price) }}</template>
          </el-table-column>
          <el-table-column :label="('Giá nội bộ')" align="center">
            <template slot-scope="scope">{{ formatNumber(scope.row.internal_price) }}</template>
          </el-table-column> -->
          <!-- <el-table-column :label="('attribute1')" align="center" width="100">
            <template slot-scope="scope">{{
              formatAtributed(
                scope.row.name_param_first,
                scope.row.params.map(d => d.param_first)
              )
            }}</template>
          </el-table-column>
          <el-table-column :label="('attribute2')" align="center" width="100">
            <template slot-scope="scope">{{
              formatAtributed(
                scope.row.name_param_second,
                scope.row.params.map(d => d.param_second)
              )
            }}</template>
          </el-table-column> -->
          <el-table-column :label="('Tình trạng')" align="center" width="90">
            <!-- <template slot-scope="scope">{{
              scope.row.state > 0 ? ('stock') : ('empty')
            }}</template> -->
            <template slot-scope="scope">
              <!-- <span style=""> {{ scope.row.state > 0 ? ('stock') : ('empty') }} </span> -->
              <el-tag :type="(scope.row.state > 0) ? 'success' : 'danger'">{{ scope.row.state > 0 ? ('Còn hàng') : ('Hết hàng') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="('Trạng thái')" align="center" width="100">
            <template slot-scope="scope">
              <el-tag :type="(scope.row.is_delete > 0) ? 'danger' : 'success'">{{ scope.row.is_delete > 0 ? ('Tạm dừng') : ('Hoạt động') }}</el-tag>
            </template>
          </el-table-column>
          <!--        <el-table-column v-if="is_delete || is_edit" label="Action" width="120" align="center">-->
          <el-table-column :label="('Hành động')" width="100" align="center">
            <template slot-scope="scope">
              <!--            <el-button v-if="is_edit" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />-->
              <el-row>
                <el-button
                  v-if="is_edit"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="onShowDialogEdit(scope.row)"
                />
              </el-row>
              <el-row style="margin-top: 10px;">
                <el-button
                  v-if="is_delete"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="onDeleteProduct(scope.row)"
                />
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="requestListProduct"
        />
      </el-row>
      <dialog-import-excel
        :dialog-visible="showDialogImport"
        @onClickButtonImport="handleClickButtonImport"
      />
      <dialog-import-product :dialog-visible="updateProductExist" @onClickButtonImport="handleClickButtonImportProduct" />
      <dialog-form-product
        :dialog-visible="showDialogForm"
        :product-id="productID"
        :is-add="isAdd"
        :shops="shops.filter(d => d.id)"
        :tags="tags"
        :categories="categories.filter(d => d.id)"
        :trademarks="trademarks.filter(d => d.id)"
        @onClickButtonForm="handleClickButtonForm"
      />
      <detail-product
        :dialog-visible="showDialogProductDetail"
        :image_urls="url_image"
        @onClickButtonDialogDetail="handleClickButtonDialogDetail"
      />
      <detail
        :dialog-visible="showDialogDetail"
        :product-id="idProduct"
        @onClickButtonDialogDetail="handleClickButtonDialogProductDetail"
      />
    </el-tabs>
  </div>
  <!-- </el-row> -->
</template>

<script>
import ProductResource from '@/api/manage_supplier/product'
import Pagination from '@/components/Pagination/index.vue'
const productResource = new ProductResource()
import { formatNumber } from '@/utils/convert'
import DialogImportExcel from '@/views/supplier/manage_product/components/DialogImportExcel'
import DialogImportProduct from './components/DialogImportProduct.vue'
import DialogFormProduct from '@/views/supplier/manage_product/components/DialogFormProduct'
import DetailProduct from '@/views/supplier/manage_product/components/DetailProduct'
import Detail from '@/views/supplier/manage_product/components/Detail'
import { getAcountInfo, parseJson } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'

const defaultQuery = {
  page: 1,
  limit: 10,
  type: 1
}
const LOADING_TEXT = {
  LOADING: 'Đang tải dữ liệu...',
  EXPORT: 'Đang xuất dữ liệu, vui lòng đợi...'
}
export default {
  name: 'List',
  components: {
    DialogFormProduct,
    DialogImportExcel,
    Pagination,
    DetailProduct,
    Detail,
    DialogImportProduct
  },
  data() {
    // const account = getAcountInfo()
    // console.log('...................bien toan cuc : ', JSON.stringify(account))
    // const permission_id = account.permission_id
    // const is_write = permission_id ? permission_id.indexOf('purchase') >= 0 : true
    return {
      loading_text: LOADING_TEXT.LOADING,
      is_delete: 0,
      is_write: 0,
      is_edit: 0,
      is_export: 0,
      is_view: 0,
      showDialogDetail: false,
      url_image: [],
      contain: 'contain',
      showDialogProductDetail: false,
      loadingTable: false,
      tableData: [],
      shops: [],
      shopId: 0,
      filterId: null,
      filters: [
        { key: 3, name: 'Tìm theo Id' },
        { key: 1, name: 'Tìm theo mã sản phẩm' },
        { key: 2, name: 'Tìm theo tên sản phẩm' }
      ],
      tags: [
        { id: 0, name: 'Lọc theo tag (Tất cả)' }
      ],
      categories: [
        {
          id: 0, name: 'Lọc theo danh mục (Tất cả)'
        }
      ],
      trademarks: [],
      listQuery: Object.assign({}, defaultQuery),
      activeName: 'first',
      total: 0,
      showDialogImport: false,
      updateProductExist: false,
      showDialogForm: false,
      isAdd: true,
      productID: 0,
      idProduct: 0,
      categoryId: 0,
      trademarkId: 0,
      typeInput: 0,
      type_input: [
        { id: 0, name: 'Phương thức phân phối (Tất cả)' },
        { id: 1, name: 'Nhập kho' },
        { id: 2, name: 'Không qua kho' }
      ],
      tagId: 0,
      activeId: 0,
      actives: [
        { id: 0, name: 'Trạng thái (Tất cả)' },
        { id: 2, name: 'Kích hoạt' },
        { id: 1, name: 'Tạm ẩn' },
        { id: 3, name: 'Hết hàng' },
        { id: 4, name: 'Còn hàng' }
      ],
      // sort_type_data: null,
      list_sort_type: [
        {
          key: 1,
          name: 'Priority'
        },
        {
          key: 2,
          name: 'Giá tăng dần'
        },
        {
          key: 3,
          name: 'Giá giảm dần'
        },
        {
          key: 4,
          name: 'Khuyến mại'
        },
        {
          key: 5,
          name: 'Sản phẩm mới'
        },
        {
          key: 6,
          name: 'Mã sản phẩm'
        }
      ]
    }
  },
  watch: {
    shopId(shop_id) {
      this.listQuery.shop_id = shop_id
      // this.onGetListRevenue()
      this.requestListProduct()
    },
    // tim kiem theo id, ten , ma san pham
    filterId(filter_id) {
      this.listQuery.filter = filter_id
      if (this.listQuery.q && this.listQuery.q.trim().length) {
        this.requestListProduct()
      }
    },
    tagId(tag_id) {
      this.listQuery.tag_id = tag_id
      this.requestListProduct()
    },
    categoryId(category_id) {
      this.listQuery.category_id = category_id
      this.requestListProduct()
      this.onGetTag()
    },
    trademarkId(trademark_id) {
      this.listQuery.trademark_id = trademark_id
      this.requestListProduct()
    },
    activeId(ac) {
      this.listQuery.active = ac
      this.requestListProduct()
    },
    typeInput(ti) {
      this.listQuery.type_input = ti
      this.requestListProduct()
    }
  },
  created() {
    console.log('..........router', this.$router.history.current.meta.roles)
    this.requestListPermissionMenu()
    this.onGetListShop()
    // this.requestListProduct()
    this.onGetListCategories()
    this.onGetTrademarks()
    // this.onGetTag()
  },
  mounted() {
    this.shopId = this.$route.params.idCat
    this.categoryId = this.$route.params.idHM
    // console.log(this.$route.params, ' ________________213213')
  },
  methods: {
    onBack() {
      window.history.back()
    },
    requestListPermissionMenu() {
      const roles = this.$router.history.current.meta.roles
      let menu_id = roles && roles.length ? roles[0] : 0
      menu_id = parseInt(menu_id.replace('NCC', ''))
      const account = getAcountInfo()
      const email = account.email
      get_list_permission(email, menu_id, (data) => {
        console.log('............list data 1', JSON.stringify(data))
        if (data) {
          let { is_supper_admin, is_add, is_view, is_edit, is_delete, is_export } = data
          is_supper_admin = parseInt(is_supper_admin) || 0
          is_add = parseInt(is_add) || 1
          is_view = parseInt(is_view) || 1
          is_edit = parseInt(is_edit) || 1
          is_delete = parseInt(is_delete) || 1
          is_export = parseInt(is_export) || 1
          this.is_delete = is_supper_admin ? 1 : is_delete - 1
          this.is_write = is_supper_admin ? 1 : is_add - 1
          this.is_edit = is_supper_admin ? 1 : is_edit - 1
          this.is_export = is_supper_admin ? 1 : is_export - 1
          this.is_view = is_supper_admin ? 1 : is_view - 1
          if (this.is_view) {
            this.requestListProduct()
          }
        }
      })
    },
    onDownloadFileSimplePress() {
      const url = 'https://vcallid.s3.ap-southeast-1.amazonaws.com/file_mau_ncc+2.zip'
      this.getFileFromServer(url, 'Tải file mẫu thành công, vui lòng vào thư mục download để xem!')
    },
    formatAtributed(params_name, params_value) {
      if (!params_name) return ''
      console.log('................. formatAtributed', params_name, params_value)
      const values = params_value.filter(d => d !== null)
      var text_show = `${params_name}`
      if (values.length) {
        text_show = `${text_show}(${values.join(',')})`
      }
      return text_show
    },
    showDialogExport() {
      this.$confirm('Bạn có chắc chắn muốn export dữ liệu?').then(_ => {
        this.loading_text = LOADING_TEXT.EXPORT
        this.loadingTable = true
        productResource.getExportList(this.listQuery).then(response => {
          setTimeout(() => {
            this.loadingTable = false
            const { error, msg } = response
            if (error === 0) {
              this.confirmDowload(response.link)
            } else {
              this.$message.error(msg)
            }
          }, 2000)
        })
          .catch(_ => {
            this.loadingTable = false
          })
      })
    },
    confirmDowload(url) {
      this.getFileFromServer(url)
    },
    async getFileFromServer(url, msg = 'Xuất file thành công') {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success(msg)
      }, 250)
      // const fileName = url.substring(url.lastIndexOf('/') + 1)
      // const response = await fetch(url)
      // const blob = await response.blob()
      // const newBlob = new Blob([blob])
      // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //   window.navigator.msSaveOrOpenBlob(newBlob)
      // } else {
      //   const objUrl = window.URL.createObjectURL(newBlob)
      //   const link = document.createElement('a')
      //   link.href = objUrl
      //   link.download = fileName
      //   link.click()
      //   setTimeout(() => {
      //     window.URL.revokeObjectURL(objUrl)
      //     this.$message.success(('export_success'))
      //   }, 250)
      // }
    },
    onShowDialogDetail(row) {
      this.idProduct = row.id
      this.showDialogDetail = true
    },
    handleClickButtonDialogProductDetail(object) {
      this.showDialogDetail = object.dialog
      this.idProduct = 0
      if (object.reload) {
        this.requestListProduct()
      }
    },
    onShowDialogProductDetail(urls) {
      urls = parseJson(urls)
      this.url_image = [...urls]
      console.log(
        ('.................click list url : ', JSON.stringify(this.url_image))
      )
      this.showDialogProductDetail = true
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogProductDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
      }
    },
    onShowDialogCreate() {
      this.DetailProduct = {}
      this.isAdd = true
      this.showDialogForm = true
    },
    onShowDialogEdit(row) {
      this.productID = row.id
      this.isAdd = false
      this.showDialogForm = true
    },
    handleClickButtonForm(object) {
      this.showDialogForm = object.dialog
      this.productID = 0
      if (object.reload) {
        this.requestListProduct()
      }
    },
    handleClickButtonImportProduct(object) {
      this.updateProductExist = object.dialog
      if (object.reload) {
        this.requestListProduct()
      }
    },
    handleClickButtonImport(object) {
      this.showDialogImport = object.dialog
      if (object.reload) {
        this.requestListProduct()
      }
    },
    onDeleteProduct(row) {
      this.$confirm(`Are you sure you want to delete ${row.name}?`)
        .then(_ => {
          productResource.deleteProduct(row.id).then(response => {
            if (response.error === 0) {
              this.requestListProduct()
              this.$message.success(response.msg)
            } else {
              this.$message.warning(response.msg)
            }
          })
        })
        .catch(_ => {})
    },

    requestListProduct() {
      if (!this.is_view) return
      this.loading_text = LOADING_TEXT.LOADING
      this.loadingTable = true
      console.log(
        '............ lay san pham : ',
        JSON.stringify(this.listQuery)
      )
      productResource
        .listProduct(this.listQuery)
        .then(response => {
          console.log(
            '---------------------------------------------lítproduct',
            JSON.stringify(response)
          )
          this.loadingTable = false
          if (response.error === 0) {
            this.tableData = response.list
            this.total =
                this.listQuery.page === 1 ? response.total : this.total
          } else {
            this.tableData = []
          }
        })
        .catch(error => {
          this.loadingTable = false
          this.$message.error(`Có lỗi xảy ra : ${error}`)
        })
    },
    onGetListProduct() {
      this.listQuery.q = ''
      this.filterId = null
      this.requestListProduct()
    },
    onGetListShop() {
      productResource.listShopOption().then(response => {
        if (response.error === 0) {
          this.shops = [{ id: 0, name: ('Lọc theo shop(tất cả)') }, ...response.list]
        }
      })
    },
    onGetListCategories() {
      productResource.listCategory().then(response => {
        this.categories = [
          { id: 0, name: ('Lọc theo danh mục (Tất cả)') },
          ...response.list
        ]
      })
    },
    onGetTrademarks() {
      productResource.listTrademarkOption().then(response => {
        this.trademarks = [
          { id: 0, name: ('Lọc theo thương hiệu (Tất cả)') },
          ...response.list
        ]
      })
    },

    onGetTag() {
      productResource
        .tagListOption({ category_id: this.categoryId })
        .then(response => {
          this.tags = [{ id: 0, name: ('Lọc theo tag (Tất cả)') }, ...response.list]
        })
    },

    onRefresh() {
      const type = this.listQuery.type
      this.listQuery = Object.assign({}, defaultQuery)
      this.listQuery.type = type
      this.requestListProduct()
    },
    handleGetNameShop(shopID) {
      const shops = this.shops
      if (shops.length > 0) {
        shops.map(shop => {
          if (shopID === shop.id) {
            return shop.name
          }
        })
      }
      return ''
    },
    handleGetNameCategogy(category_id) {
      if (this.categories.length > 0) {
        this.categories.map(category => {
          if (category_id === category.id) {
            return category.name
          }
        })
      }
      return ''
    },
    handleTabClick(tab) {
      this.listQuery.type = tab.name === 'first' ? 1 : 2
      this.requestListProduct()
    },
    formatNumber
  }
}
</script>
  <style>
  .el-loading-spinner{
    top: 10%;
  }
  </style>
  <style lang="scss" scoped>
  .el-input--medium {
    margin-bottom: 10px;
  }
  .el-select {
    width: 100%;
  }
  .text_bold {
    text-align: left;
    font-weight: 700
  }
  #debt-page {
    margin: 20px 30px 50px 30px;
  }
  .p-tag {
    margin: 10px 0px;
  }
  .select-tag {
    padding-right: 10px;
  }
  .el-range-separator {
    line-height: 28px;
    font-size: 14px;
    width: 30px;
  }
  ::v-deep .el-range-editor--medium .el-range-separator {
      line-height: 28px;
      font-size: 14px;
      width: 30px;
  }
  </style>
