<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="90%"
  >
    <el-row class="list-shop__header">
      <el-col :sm="24">
        <el-row style="display: ruby">
          <h3 style="font-size: 26px; display: inherit">
            {{ "Thông tin sản phẩm" }}
          </h3>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="dialog-product" style="padding: 10px">
      <el-form ref="ruleForm" :model="objectProduct" status-icon :rules="rules">
        <el-row style="display: flex">
          <el-col :sm="5" style="padding-left: 60px">
            <el-form-item :label="'Ảnh đại diện sản phẩm'" prop="thumb">
              <div class="clearfix" />
              <upload-image
                :url-current="productAvatar"
                @onSetUrlImage="handleSetImageProduct"
              />
            </el-form-item>
            <el-form-item :label="'Show trên app'">
              <el-switch
                v-model="objectProduct.is_hide_on_app"
                :active-value="0"
                :inactive-value="1"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="17">
            <el-row class="row-row-first">
              <el-col :sm="24">
                <el-row>
                  <el-col :sm="6">
                    <el-form-item
                      :label="'Mã sản phẩm (mã WGHN)'"
                      prop="product_code"
                    >
                      <el-input
                        v-model="objectProduct.product_code"
                        :placeholder="'Nhập mã'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item
                      :label="'Mã nhà cung cấp'"
                      prop="product_code_shop"
                    >
                      <el-input
                        v-model="objectProduct.product_code_shop"
                        :placeholder="'Nhập mã nhà cung cấp'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>

                  <!-- <el-col :sm="6" class="pl-10">
                    <el-form-item :label="('Code')" prop="product_code_shop">
                      <el-input v-model="objectProduct.product_code_shop" :placeholder="('Nhập Code')" autocomplete="off" />
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="6" class="pl-10">
                    <el-form-item :label="'Tên sản phẩm'" prop="name">
                      <el-input
                        v-model="objectProduct.name"
                        :placeholder="'Nhập tên sản phẩm'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" class="pl-10">
                    <el-form-item :label="'Mức độ ưu tiên'" prop="priority">
                      <el-input
                        v-model="objectProduct.priority"
                        rows="10"
                        :placeholder="'Nhập mức độ ưu tiên'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-row class="row-row-row">
              <el-col :sm="24">
                <el-row>
                  <el-col :sm="6">
                    <el-form-item
                      :label="'Danh mục sản phẩm'"
                      prop="category_id"
                    >
                      <el-select
                        key="category"
                        v-model="objectProduct.category_id"
                        :placeholder="'Chọn danh mục'"
                        class="w-100"
                        @change="changeCategory"
                      >
                        <el-option
                          v-for="category in categories"
                          :key="`category_${category.id}`"
                          :label="category.name"
                          :value="category.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item key="shop" :label="'Cửa hàng'" prop="shop_id">
                      <el-select
                        v-model="objectProduct.shop_id"
                        class="w-100"
                        :placeholder="'Chọn cửa hàng'"
                      >
                        <el-option
                          v-for="shop in shops"
                          :key="`shop_${shop.id}`"
                          :label="shop.name"
                          :value="shop.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item
                      key="trademark"
                      :label="'Thương hiệu'"
                      prop="trademark_id"
                    >
                      <el-select
                        v-model="objectProduct.trademark_id"
                        class="w-100"
                        :placeholder="'Chọn thương hiệu'"
                        aria-label="acd"
                      >
                        <el-option
                          v-for="trademark in trademarks"
                          :key="`trademark_${trademark.id}`"
                          :label="trademark.name"
                          :value="trademark.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item key="tag" :label="'Tag'">
                      <el-select
                        v-model="product_tags"
                        class="w-100"
                        multiple
                        filterable
                        :placeholder="'Chọn tag'"
                      >
                        <el-option
                          v-for="tag in tags"
                          :key="`tag_${tag.id}`"
                          :label="tag.name"
                          :value="tag.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-row class="row-row-row">
              <el-col :sm="24">
                <el-row>
                  <el-col :sm="6">
                    <el-form-item
                      :label="'Tên thuộc tính 1'"
                      prop="name_param_first"
                    >
                      <el-input
                        v-model="objectProduct.name_param_first"
                        :placeholder="'Nhập thuộc tính 1'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item
                      :label="'Tên thuộc tính 2'"
                      prop="name_param_second"
                    >
                      <el-input
                        v-model="objectProduct.name_param_second"
                        :placeholder="'Nhập thuộc tính 2'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10" style="padding-top:5px">
                    <el-form-item label="Loại sản phẩm" prop="type">
                      <el-select
                        v-model="type"
                        placeholder="Chọn loại hàng hóa"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="ti in typeOption"
                          :key="`type_${ti.id}`"
                          :label="ti.name"
                          :value="ti.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item :label="'Trọng lượng'" prop="weight">
                      <el-input
                        v-model="objectProduct.weight"
                        :disabled="type === 2"
                        type="number"
                        :placeholder="'Nhập khối lượng'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item>
                      <label>{{ "Ship từ Viettel" }}:</label>
                      <div class="delivery">
                        <el-select
                          v-model="day_pickup"
                          :disabled="type === 2"
                          :placeholder="'Chọn'"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="day in pickDays"
                            :key="`day_${day.key}`"
                            :label="day.name"
                            :value="day.key"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" class="pl-10">
                    <el-form-item prop="type_input">
                      <label>{{ "Phương thức phân phối" }}:</label>
                      <div class="delivery">
                        <el-select
                          v-model="type_input"
                          :disabled="type === 2"
                          :placeholder="'Chọn phương thức phân phối'"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="ti in typeInput"
                            :key="`typeinput_${ti.id}`"
                            :label="ti.name"
                            :value="ti.id"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="row-row-row">
              <el-col :sm="24">
                <el-row>
                  <!-- <el-col :sm="12">
                    <el-form-item :label="'Giá đại lý'" prop="agency_price">
                      {{ formatNumber(objectProduct.agency_price || 0) }}đ
                      <el-input
                        v-model="objectProduct.agency_price"
                        type="number"
                        :placeholder="'Nhập giá đại lý'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :sm="12" class="pl-10">
                    <el-form-item :label="'Giá nội bộ'" prop="internal_price">
                      {{ formatNumber(objectProduct.internal_price || 0) }}đ
                      <el-input
                        v-model="objectProduct.internal_price"
                        type="number"
                        :placeholder="'Nhập giá nội bộ '"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </el-col>
            </el-row>
            <el-row class="row-row-row">
              <el-col :sm="24">
                <el-row>

                  <!-- <el-col :sm="6" class="pl-10">
                    <el-form-item :label="'Giá niêm yết'" prop="price">
                      {{ formatNumber(objectProduct.price || 0) }}đ
                      <el-input
                        v-model="objectProduct.price"
                        type="number"
                        :placeholder="'Nhập giá niêm yết'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :sm="6" class="pl-10">
                    <el-form-item :label="'Khuyến mại'" prop="sale">
                      {{ formatNumber(priceSale ? priceSale : 0) }}%
                      <el-input
                        v-model="priceSale"
                        type="number"
                        :placeholder="'Nhập sale'"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :sm="6" class="pl-10">
                    <el-form-item :label="'Giá bán'" prop="priceSale">
                      <el-input
                        disabled
                        :placeholder="
                          priceSale > 0
                            ? Math.round(
                              objectProduct.price -
                                (priceSale * objectProduct.price) / 100
                            )
                            : objectProduct.price
                        "
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </el-col>
            </el-row>
            <el-row class="row-row-row">
              <el-col :sm="24">
                <el-form-item :label="'Mô tả sản phẩm '" prop="desc">
                  <el-input
                    v-model="objectProduct.desc"
                    type="textarea"
                    rows="10"
                    :placeholder="'Nhập mô tả'"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <div v-for="(id, date_input, cost, properties) in inputEntries" :key="id" style="border: 1px solid gray; padding: 10px; margin-top: 10px; height: 500px">
              <div style="width: 100; display: flex; justify-content: space-between;">
                <div style="width: 30%;">
                  <span>Ngày nhập</span>
                </div>
                <div style="width: 30%;">
                  <span>Giá nhập</span>
                </div>
                <div style="width: 30%;">
                  <span>Hành động</span>
                </div>
              </div>
              <div style="width: 100%; display: flex; justify-content: space-between; margin-top: 10px;">
                <div style="width: 30%;">
                  <el-date-picker
                    :v-model="date_input"
                    type="date"
                    format="dd/MM/yyyy"
                    placeholder="Chọn ngày"
                    @change="() => handleDateChange(id)"
                  />
                </div>
                <div style="width: 30%;">
                  <el-input
                    :v-model="cost"
                    type="number"
                    placeholder="Nhập giá"
                    autocomplete="off"
                  />
                </div>
                <div style="width: 30%;">
                  <el-button type="primary" @click="addInputAndTableListParam(id)">Thêm</el-button>
                  <el-button v-if="inputEntries.length > 1" style="margin-left: 10px;" type="danger" @click="removeInputEntry(index)">Xóa</el-button>
                </div>
              </div>
              <div v-for="property in properties" :key="'property_' + property.id" style="margin-top: 10px;height: 200px;">
                <div style="height: 200px; width: 100%;" />
                <div style="width: 100%; justify-content: space-between; height: 200px;">
                  <div style="width: 18%;">
                    <span style="color: black; font-size: 14px;">Thuộc tính 1</span>
                    <el-input :v-model="property.param_first" style="margin-top: 6px" placeholder="Thuộc tính 1" />
                  </div>
                  <div style="width: 18%;">
                    <span style="color: black; font-size: 14px;">Thuộc tính 2</span>
                    <el-input :v-model="property.param_second" style="margin-top: 6px" placeholder="Thuộc tính 1" />
                  </div>
                  <div style="width: 18%;">
                    <span style="color: black; font-size: 14px;">Giá nhập</span>
                    <el-input :v-model="property.cost" style="margin-top: 6px" placeholder="Thuộc tính 1" />
                  </div>
                  <div style="width: 18%;">
                    <span style="color: black; font-size: 14px;">Ngày nhập</span>
                    <el-input :v-model="property.date_input" style="margin-top: 6px" placeholder="Thuộc tính 1" />
                  </div>
                  <div style="width: 18%;">
                    <div style="display: block ruby; justify-content: flex-end; background-color: transparent">
                      <el-button type="info" @click="onCancelProperties">{{ ('Hủy') }}</el-button>
                      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitProperties">{{ (isAddTable) ? 'Thêm mới' : 'Cập nhật' }}</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <el-row class="row-row-row" style="padding-top: 50px;padding-bottom:50px">
              <el-col :sm="24">
                <table
                  border="1"
                  style="width: 100%; border-collapse: collapse"
                >
                  <tr>
                    <th rowspan="3">
                      <el-form-item :label="'Giá niêm yết'" prop="price" style="padding:15px">
                        <el-input
                          v-model="objectProduct.price"
                          type="number"
                          :placeholder="'Nhập giá niêm yết'"
                          autocomplete="off"
                        />
                      </el-form-item>
                    </th>
                    <td />
                    <td
                      style="
                        text-align: center;
                        height: 50px;
                        font-weight: 500;
                        font-size: 15px;
                      "
                    >
                      Khách lẻ
                    </td>
                    <td
                      style="
                        text-align: center;
                        font-weight: 500;
                        font-size: 15px;
                      "
                    >
                      Nội bộ
                    </td>
                    <td
                      style="
                        text-align: center;
                        font-weight: 500;
                        font-size: 15px;
                      "
                    >
                      Đại lý
                    </td>
                  </tr>
                  <tr style="height: 70px">
                    <td
                      style="
                        width: 200px;
                        text-align: center;
                        font-weight: 500;
                        font-size: 15px;
                      "
                    >
                      Phần trăm khuyến mãi
                    </td>
                    <td>
                      <div style="display: flex">
                        <el-input
                          v-model="priceSale"
                          type="number"
                          placeholder="Nhập sale"
                          autocomplete="off"
                          class="custom-input"
                        >
                          <template slot="append">
                            <span class="append-percent-sign">%</span>
                          </template>
                        </el-input>
                      </div>
                    </td>
                    <td>
                      <div style="display: flex">
                        <el-input
                          v-model="priceInternal"
                          type="number"
                          :placeholder="'Nhập sale'"
                          autocomplete="off"
                          class="custom-input"
                        >
                          <template slot="append">
                            <span class="append-percent-sign">%</span>
                          </template>
                        </el-input>
                      </div>
                    </td>
                    <td>
                      <div style="display: flex">
                        <el-input
                          v-model="priceAgency"
                          type="number"
                          :placeholder="'Nhập sale'"
                          autocomplete="off"
                          class="custom-input"
                        >
                          <template slot="append">
                            <span class="append-percent-sign">%</span>
                          </template>
                        </el-input>
                      </div>
                    </td>
                  </tr>
                  <tr style="height: 70px">
                    <td
                      style="
                        width: 200px;
                        text-align: center;
                        font-weight: 500;
                        font-size: 15px;
                      "
                    >
                      Giá bán
                    </td>
                    <td>
                      <el-input
                        class="custom-input_1"
                        readonly
                        :placeholder="
                          priceSale > 0
                            ? formatVND(
                              Math.round(
                                objectProduct.price - (priceSale * objectProduct.price) / 100
                              )
                            )
                            : formatVND(objectProduct.price)
                        "
                        autocomplete="off"
                      >
                        <template slot="append">
                          <span class="append-percent-sign">VND</span>
                        </template>
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        class="custom-input_1"
                        readonly
                        :placeholder="
                          priceInternal > 0
                            ? formatVND(
                              Math.round(
                                objectProduct.price - (priceInternal * objectProduct.price) / 100
                              )
                            )
                            : formatVND(objectProduct.price)
                        "
                        autocomplete="off"
                      >
                        <template slot="append">
                          <span class="append-percent-sign">VND</span>
                        </template>
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        class="custom-input_1"
                        readonly
                        :placeholder="
                          priceAgency > 0
                            ? formatVND(
                              Math.round(
                                objectProduct.price - (priceAgency * objectProduct.price) / 100
                              )
                            )
                            : formatVND(objectProduct.price)
                        "
                        autocomplete="off"
                      >
                        <template slot="append">
                          <span class="append-percent-sign">VND</span>
                        </template>
                      </el-input>
                    </td>
                  </tr>
                </table>
              </el-col>
            </el-row>
            <table-list-param
              ref="refListParams"
              :is-add="isAdd"
              :list-properties="listProperties"
              :object-product="objectProduct"
              @onSetData="handleSetData"
            />
            <el-row>
              <el-form-item :label="'Image'" prop="image">
                <div class="clearfix" />
                <upload-image-product
                  :file-list="listImage"
                  @onChangeUploadImage="handleChangeUploadImage"
                />
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ "Hủy" }}</el-button>
      <el-button
        type="primary"
        :loading="loadingSubmit"
        @click="onSubmitForm('ruleForm')"
      >{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formatNumber } from '@/utils/convert'
import ProductResource from '@/api/manage_supplier/product'
import { calculatorPriceSale } from '@/utils/product/convertProduct'
import UploadImageProduct from '@/views/supplier/manage_product/components/UploadImageProduct'
import UploadImage from '@/components/UploadImage'
import { setRules } from '@/utils/product/validateProduct'
const productResource = new ProductResource()
import TableListParam from '@/views/supplier/manage_product/components/TableListParam'
export default {
  name: 'DialogFormProduct',
  components: { TableListParam, UploadImage, UploadImageProduct },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    shops: {
      type: Array,
      default() {
        return []
      }
    },
    categories: {
      type: Array,
      default() {
        return []
      }
    },
    trademarks: {
      type: Array,
      default() {
        return []
      }
    },
    // tags: {
    //   type: Array,
    //   default() { return [] }
    // },
    isAdd: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      default() {
        return 0
      }
    }
  },

  data() {
    return {
      rules: setRules(),
      dialog: { title: 'Thêm mới sản phẩm', buttonName: 'Thêm mới' },
      priceSale: null,
      Sale: 0,
      Internal: 0,
      Agency: 0,
      priceInternal: null,
      priceAgency: null,
      numberSalePrice: 0,
      productAvatar: '',
      listImage: [],
      listProperties: [],
      tableData: [{}],
      newListProperties: [],
      loadingSubmit: false,
      objectProduct: {
        day_pickup: 0,
        type_input: 1
      },
      product_tags: [],
      // inputEntries: [{ id: 1, date_input: null, cost: 0, properties: [{ id: 1, param_first: '', param_second: '', number: 1, cost: 0, date_input: null }] }],
      tableListParams: [],
      tags: [],
      typeInput: [
        { id: 1, name: 'Nhập kho' },
        { id: 2, name: 'Không qua kho' }
      ],
      type: 1,
      typeOption: [
        { id: 1, name: 'Hàng hóa' },
        { id: 2, name: 'Dịch vụ' }
      ],
      type_input: 1,
      pickDays: [
        { key: 0, name: 'Không' },
        { key: 1, name: 'Có' }
      ],
      day_pickup: 0,
      objectProductOrigin: {} // object san phẩm gốc
    }
  },
  computed: {
    priceInternalComValue() {
      return this.priceInternal > 0
        ? (
          Math.round(
            this.objectProduct.price - (this.priceInternal * this.objectProduct.price) / 100
          )
        )
        : (this.objectProduct.price)
    },
    priceAgencyComValue() {
      return this.priceAgency > 0
        ? (
          Math.round(
            this.objectProduct.price - (this.priceAgency * this.objectProduct.price) / 100
          )
        )
        : (this.objectProduct.price)
    }
  },
  watch: {
    // objectProduct(val) {
    //   if (val.name_param_first) {
    //     if (this.$refs.refListParams) {
    //       this.$refs.refListParams.setNameParamsFisrt(val.name_param_first)
    //     }
    //   }
    // },
    productId(newID) {
      if (newID > 0) {
        this.onGetProductDetail(newID)
      }
    },
    isAdd(value) {
      if (value) {
        this.objectProduct = {}
        this.objectProductOrigin = {}
        this.listProperties = null
        this.dialog = Object.assign(
          {},
          { title: 'Thêm sản phẩm', buttonName: 'Thêm' }
        )
      } else {
        this.dialog = Object.assign(
          {},
          { title: 'Cập nhật sản phẩm', buttonName: 'Cập nhật' }
        )
      }
      this.product_tags = this.objectProduct.tag_ids
    }
    // type(newVal) {
    //   // Sử dụng watcher để theo dõi sự thay đổi của trường "Loại sản phẩm"
    //   if (newVal === 2) { // Kiểm tra nếu loại sản phẩm là "Dịch vụ" (giả sử giá trị 2 là "Dịch vụ")
    //     // Tắt validate rules ở trường "Trọng lượng" bằng cách xóa nó khỏi biến rules
    //     this.$delete(this.rules, 'weight')
    //   } else {
    //     // Nếu loại sản phẩm không phải là "Dịch vụ"
    //     // Thêm lại validate rules cho trường "Trọng lượng" bằng cách gán lại giá trị cho biến rules
    //     this.$set(this.rules, 'weight', [
    //       { required: true, message: 'Trọng lượng không được để trống', trigger: 'blur' }
    //       // Thêm các quy tắc validate khác nếu cần
    //     ])
    //   }
    // }product_tags
  },

  methods: {
    formatVND(value) {
      if (isNaN(value) || value === undefined || value === null) {
        return '0đ'
      }
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      })
      return formatter.format(value)
    },
    changeCategory(id) {
      console.log('check tag')
      this.tags = []
      this.product_tags = []
      this.onGetTag(id)
    },
    onGetTag(categoryId) {
      productResource
        .tagListOption({ category_id: categoryId })
        .then((response) => {
          this.tags = [...response.list]
        })
    },
    onGetProductDetail(id) {
      productResource.DetailProduct(id).then((response) => {
        const result = response.info
        console.log(
          '........................ chi tiet san pham : ',
          JSON.stringify(result)
        )
        this.objectProduct = Object.assign({}, result)
        // this.objectProduct = result
        this.objectProductOrigin = Object.assign({}, result)
        // this. = result.tags ? result.tag_ids : []
        // console.log('.................list tags : ', tags)
        const category_id = result.category_id
        if (category_id) {
          this.onGetTag(category_id)
        }
        this.product_tags = result.tags.map((d) => d.id)
        this.priceSale = result.sale
        this.priceAgency = Math.round(((result.price - result.agency_price) / result.price) * 100)
        this.priceInternal = Math.round(((result.price - result.internal_price) / result.price) * 100)
        this.productAvatar = result.thumb
        // console.log('................................123', result)
        this.day_pickup = result.day_pickup
        this.type_input = result.type_input
        this.type = result.type

        if (result.images && result.images.length > 0) {
          const arrayImage = []
          result.images.map((image) => {
            arrayImage.push({ url: image })
          })
          this.listImage = [...arrayImage]
        }
        // this.objectProduct.tag_ids = JSON.parse(result.tag_ids)
      })
    },
    onSubmitForm(formName) {
      if (this.listImage.length > 0) {
        const array = []
        this.listImage.map((image) => {
          array.push(image.url)
        })
        this.objectProduct.images = [...array]
      } else {
        this.objectProduct.images = []
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.handleCreateProduct()
          } else {
            this.handleUpdateProduct()
          }
        } else {
          return false
        }
      })
    },
    handleCreateProduct() {
      // const modifiedEntries = this.inputEntries.map(entry => {
      //   // eslint-disable-next-line no-unused-vars
      //   const { date_input, date, ...rest } = entry
      //   return { ...rest, date_input: date_input ? String(date_input) : null }
      // })

      console.log(this.newListProperties, 111111111111111)
      // console.log(modifiedEntries, 33333333333333333333)

      // Ghép modifiedEntries vào newListProperties
      // const combinedList = this.newListProperties.map((propertiesList, index) => {
      //   const entry = modifiedEntries[index]
      //   return propertiesList.map(property => ({
      //     ...property,
      //     ...entry
      //   }))
      // })

      // const flattenedList = combinedList.flat()

      this.objectProduct.map_params = this.listProperties
        ? JSON.stringify(this.listProperties)
        : undefined
      this.objectProduct.day_pickup = this.day_pickup
      this.objectProduct.type_input = this.type_input

      this.objectProduct.tag_ids = this.formatTags(this.product_tags)
      this.objectProduct.sale = this.priceSale
      this.objectProduct.agency_price = this.priceAgencyComValue
      this.objectProduct.internal_price = this.priceInternalComValue
      this.objectProduct.type = this.type
      console.log(
        '-----------------------',
        JSON.stringify(this.objectProduct)
      )
      this.loadingSubmit = true
      productResource
        .storeProduct(this.objectProduct)
        .then((response) => {
          this.loadingSubmit = false
          if (response.error === 0) {
            this.$message.success(response.msg)
            this.$emit('onClickButtonForm', { dialog: false, reload: true })
            this.handleClearData()
          } else {
            this.$message.error(response.msg)
          }
        })
        .catch((err) => {
          this.loadingSubmit = false
          this.$message.error('Có lỗi xảy ra ' + err)
        })
    },
    formatTags(array) {
      const tags = []
      for (const tag of array) {
        if (typeof tag === 'object') {
          tags.push(tag.id)
        } else {
          tags.push(tag)
        }
      }
      return tags
    },
    getBodyUpdate() {
      // this.objectProduct.map_params = this.listProperties ? JSON.stringify(this.listProperties) : undefined
      this.objectProduct.tag_ids = this.formatTags(this.product_tags).join(',') // JSON.stringify(this.product_tags)
      this.objectProduct.day_pickup = this.day_pickup
      this.objectProduct.type_input = this.type_input

      console.log(this.objectProduct.day_pickup)
      this.objectProduct.sale = this.priceSale
      this.objectProduct.agency_price = this.priceAgencyComValue
      this.objectProduct.internal_price = this.priceInternalComValue
      this.objectProduct.type = this.type
      const keys = Object.keys(this.objectProduct)
      const body = {}
      for (const key of keys) {
        if (key === 'images') {
          // iamge la doi tuong nen phai so sanh cac phan tu torng mang image vs nhau
          const images = this.objectProduct[key] || []
          const image_origin = this.objectProductOrigin[key] || []
          if (images.length !== image_origin.length) {
            // mang co chieu dai khac nhau thi se lay du lieu tu giao dien day len sever
            body[key] = this.objectProduct[key]
            continue // thoat khoi vong for hien tai
          }
          for (let i = 0; i < images.length; i++) {
            // neu 2 mang co cung chieu dai thi so sanh cac phan tu tuong ung trong 2 mang vs nhau
            if (images[i] !== image_origin[i]) {
              // chi can 1 phan tu khac phan tu tuong ung o mang kia chung to mang da bi thay doi
              body[key] = this.objectProduct[key] // luu lai mang image tu giao dien dong thoi thoat khoi vong for con
              break
            }
          }
          continue // bo qua cau lenh dang sau vong for hien tai
        }
        if (this.objectProduct[key] !== this.objectProductOrigin[key]) {
          body[key] = this.objectProduct[key]
        }
      }
      body.id = this.objectProduct.id
      console.log('............body update : ', JSON.stringify(body))
      return body
    },
    handleUpdateProduct() {
      // this.objectProduct.map_params = JSON.stringify(this.listProperties)
      // this.objectProduct.tag_ids = this.formatTags(this.product_tags)// JSON.stringify(this.product_tags)
      // this.objectProduct.sale = this.priceSale
      const body = this.getBodyUpdate()
      if (Object.keys(body).length <= 1) {
        this.$emit('onClickButtonForm', { dialog: false, reload: false })
        return
      }
      this.loadingSubmit = true
      productResource
        .updateProduct(body)
        .then((response) => {
          this.loadingSubmit = false
          if (response.error === 0) {
            this.$message.success(response.msg)
            this.$emit('onClickButtonForm', { dialog: false, reload: true })
            this.handleClearData()
          } else {
            this.$message.error(response.msg)
          }
        })
        .catch((error) => {
          this.loadingSubmit = false
          console.log('.....................loi, ', error)
        })
    },
    handleSetData(data) {
      console.log('..................xoa thuoc tinh ', data)
      this.listProperties = [...data]
      // if (this.newListProperties[data.index]) {
      //   this.newListProperties[data.index] = [...this.listProperties]
      // } else {
      //   this.newListProperties.push([...this.listProperties])
      // }
      // this.newListProperties[data.index]([...this.listProperties]) // Thêm bản sao mới vào newListProperties
      // console.log(this.newListProperties, 'LISST')
    },
    handleCalculatorPriceSale(sale) {
      if (this.priceSale === 0) {
        this.numberSalePrice = this.objectProduct.price
      } else {
        this.numberSalePrice = calculatorPriceSale(
          this.objectProduct.price,
          sale
        )
      }
    },
    handleChangeUploadImage(images) {
      console.log('........list image update ', JSON.stringify(images))
      this.listImage = [...images]
    },
    handleSetImageProduct(object) {
      if (Object.keys(object).length > 0) {
        this.objectProduct.thumb = object.name
      }
    },
    handleclickUploadImage(object) {
      if (Object.keys(object).length > 0) {
        this.objectProduct.thumb = object.name
      }
    },
    handleClearData() {
      this.listImage = []
      this.productAvatar = ''
      this.priceSale = 0
      this.priceAgency = 0
      this.priceInternal = 0
      this.day_pickup = 0
      this.type_input = null
      if (this.$refs.refListParams) {
        this.$refs.refListParams.refreshData()
      }
    },
    formatNumber,
    handleClose() {
      this.handleClearData()
      if (Object.keys(this.objectProduct).length > 0 && this.isAdd) {
        this.$confirm('Một số tác vụ chưa được lưu, bạn có chắc chắn muốn đóng cửa sổ?')
          .then((_) => {
            this.$emit('onClickButtonForm', { dialog: false, reload: false })
          })
          .catch((_) => {})
      } else {
        this.$emit('onClickButtonForm', { dialog: false, reload: false })
      }
    }
  }
}
</script>

<style lang="scss">
.el-dialog {
  margin-top: 20px !important;
}
</style>
<style scoped>
.custom-input .el-input__inner {
  width: auto;

}
.el-input--medium {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding:5px;

}
.append-percent-sign {
  padding-top: 7px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

/* google */
.custom-input_1 ::v-deep .el-input__inner::placeholder {
  color:  #000000;
}

</style>
