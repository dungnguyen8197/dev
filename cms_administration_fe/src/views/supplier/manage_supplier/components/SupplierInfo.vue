<template>
  <div class="id">

    <el-row class="search-wrapper">
      <el-row :sm="24" style="display: flex; justify-content: space-between">
        <el-col
          :sm="12"
          style="justify-content: flex-start; display: flex; align-items: center"
        >
          <h5>{{ stt }}. {{ "Thông tin chung" }}</h5>
        </el-col>
        <el-col
          :sm="12"
          style="justify-content: flex-end; display: flex; align-items: center"
        >
          <el-button
            v-if="!isNew"
            type="primary"
            style="margin-left: 10px; font-size: 14px; font-weight: 400"
            @click="onEditPress"
          >{{ "Chỉnh sửa" }}</el-button>
        </el-col>
      </el-row>
      <el-row style="display: flex; justify-content: left;">
        <el-col :sm="5">
          <img :src="user_avatar" style="width:170;height: 170px;">
          <my-upload
            ref="refCrop"
            :model-value="is_show_crop"
            field="image"
            :width="300"
            :height="300"
            img-format="jpg/png"
            lang-type="en"
            type="file"
            accept="image/*"
            :url="urlBaseApi"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
            @update:modelValue="offDialogUpload"
          />
          <el-row style="margin-top: 10px">
            <el-button :disabled="disable" @click="onUploadAvatar">{{
              "Tải lên ảnh đại diện"
            }}</el-button>
          </el-row>
          <el-row style="margin-top: 10px">
            <label class="text-lable">{{ "Trạng thái" }}</label>
            <el-switch
              v-model="state"
              :disabled="disable"
              style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            />
            <label style="margin-left: 10px; font-size: 16px; font-weight: 400">{{
              state ? "Kích hoạt" : "Tạm dừng"
            }}</label>
          </el-row>
        </el-col>
        <el-col :sm="19">
          <div style="display: flex; justify-content: right; flex-wrap: wrap;">
            <div class="div-wrap-info">
              <el-row class="row-item">

                <label class="item-label">{{ "Mã nhà cung cấp" }}<span style="color: red">*</span></label>
                <el-input
                  v-model="supplier_code"
                  :disabled="disable || isUpdate"
                  style="margin-top: 10px"
                  :placeholder="'Nhập mã nhà cung cấp'"
                />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Tên nhà cung cấp"
                }}<span style="color: red">*</span></label>
                <el-input
                  v-model="name"
                  :disabled="disable"
                  style="margin-top: 10px"
                  :placeholder="'Nhập tên nhà cung cấp'"
                />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Số điện thoại" }}<span style="color: red">*</span></label>
                <el-input
                  v-model="phone"
                  :disabled="disable"
                  style="margin-top: 10px"
                  :placeholder="'Nhập số điện thoại'"
                />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ "Fax" }}</label>
                <el-input
                  v-model="business_fax"
                  :disabled="disable"
                  style="margin-top: 10px"
                  :placeholder="'Nhập số Fax'"
                />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "MST/CCCD" }}<span style="color: red">*</span></label>
                <el-input
                  v-model="ma_so_thue"
                  :disabled="disable"
                  style="margin-top: 10px"
                  :placeholder="'Nhập MST/CCCD'"
                />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Thành phố" }}<span style="color: red">*</span></label>
                <el-select
                  v-model="provinceModel"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="'Tìm kiếm thành phố'"
                  :remote-method="onSearchProvince"
                  :loading="provice_loading"
                  @focus="provicesFocus"
                >
                  <el-option
                    v-for="province in provinces"
                    :key="province.viettel_id"
                    :label="province.viettel_name"
                    :value="province.viettel_id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Quận/huyện" }}<span style="color: red">*</span></label>
                <el-select
                  v-model="districtModel"
                  class="select-item"
                  filterable
                  :disabled="disable"
                  remote
                  reserve-keyword
                  :placeholder="'Tìm kiếm Quận/huyện'"
                  :remote-method="onSearchProvince"
                  :loading="provice_loading"
                  @focus="provicesFocus"
                >
                  <el-option
                    v-for="district in districts"
                    :key="district.viettel_id"
                    :label="district.viettel_name"
                    :value="district.viettel_id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Phường/xã" }}<span style="color: red">*</span></label>
                <el-select
                  v-model="wardModel"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="'Tìm kiếm Phường/xã'"
                  :remote-method="onSearchProvince"
                  :loading="provice_loading"
                  @focus="provicesFocus"
                >
                  <el-option
                    v-for="ward in wards"
                    :key="ward.viettel_id"
                    :label="ward.viettel_name"
                    :value="ward.viettel_id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Địa chỉ cụ thể( Số nhà...)"
                }}<span style="color: red">*</span></label>
                <el-input
                  v-model="address"
                  :disabled="disable"
                  style="margin-top: 10px"
                  :placeholder="'Nhập địa chỉ cụ thể'"
                />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Loại nhà cung cấp"
                }}<span style="color: red">*</span></label>
                <el-select
                  v-model="supplier_type"
                  class="select-item"
                  :disabled="disable"
                >
                  <el-option
                    v-for="supplier in supplier_types"
                    :key="supplier.id"
                    :label="supplier.name"
                    :value="supplier.id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Hình thức kinh doanh"
                }}<span style="color: red">*</span></label>
                <el-select
                  v-model="business_type"
                  class="select-item"
                  :disabled="disable"
                  :placeholder="'Chọn hình thức kinh doanh'"
                >
                  <el-option
                    v-for="_bussiness_type in supplier_bussiness"
                    :key="_bussiness_type.id"
                    :label="_bussiness_type.name"
                    :value="_bussiness_type.id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Loại dịch vụ"
                }}<span style="color: red">*</span></label>
                <el-select
                  v-model="service_type"
                  class="select-item"
                  :disabled="disable"
                >
                  <el-option
                    v-for="service in service_types"
                    :key="service.id"
                    :label="service.name"
                    :value="service.id"
                  />
                </el-select>
              </el-row>
            </div>
          </div>
          <el-container v-if="!isUpdate">
            <el-row :span="24">
              <el-col
                v-for="item of property_extend"
                :key="item[0].id"
                :span="24"
              >
                <el-row class="row-row">
                  <el-col class="mb-10">
                    <el-row v-if="item[0]" class="row-item">
                      <label class="item-label">{{ item[0].lable }}</label>
                      <el-input
                        v-model="item[0].value"
                        :disabled="disable"
                        style="margin-top: 10px"
                      />
                    </el-row>
                  </el-col>
                  <el-col class="mb-10">
                    <el-row v-if="item[1]" class="row-item">
                      <label class="item-label">{{ item[1].lable }}</label>
                      <el-input
                        v-model="item[1].value"
                        :disabled="disable"
                        style="margin-top: 10px"
                      />
                    </el-row>
                  </el-col>
                  <el-col class="mb-10">
                    <el-row v-if="item[2]" class="row-item">
                      <label class="item-label">{{ item[2].lable }}</label>
                      <el-input
                        v-model="item[2].value"
                        :disabled="disable"
                        style="margin-top: 10px"
                      />
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-container>
          <el-container>
            <el-row>
              <el-col v-for="item of properties_other" :key="item.id" :span="24">
                <el-row class="row-row">
                  <el-col class="mb-10" :span="12">
                    <el-row class="row-item">
                      <label class="item-label">{{ "Tên thuộc tính" }}</label>
                      <el-input
                        v-model="item.lable"
                        :disabled="disable"
                        style="margin-top: 10px"
                        :placeholder="'Nhập tên thuộc tính'"
                      />
                    </el-row>
                  </el-col>
                  <el-col class="mb-10" :span="12" style="padding-left: 20px">
                    <el-row class="row-item">
                      <label class="item-label">{{ "Giá trị thuộc tính" }}</label>
                      <el-input
                        v-model="item.value"
                        :disabled="disable"
                        style="margin-top: 10px"
                        :placeholder="'Nhập giá trị thuộc tính'"
                      />
                    </el-row>
                  </el-col>
                  <el-col class="mb-10">
                    <el-row class="row-item">
                      <!-- <label class="item-label">{{ ('supplier_bussiness_label') }}</label>
                      <el-select
                        v-model="business_type"
                        class="select-item"
                        :disabled="disable"
                        :placeholder="('input_supplier_bussiness_type')"
                      >
                        <el-option
                          v-for="_bussiness_type in supplier_bussiness"
                          :key="_bussiness_type.id"
                          :label="_bussiness_type.name"
                          :value="_bussiness_type.id"
                        />
                      </el-select> -->
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-container>
          <el-row class="list-shop__header">
            <el-col
              :sm="24"
              style="
              justify-content: flex-end;
              display: flex;
              align-items: center;
              padding-top: 50px;
            "
            >
              <!-- <div class="text-right"> -->
              <el-button type="primary" @click="addMoreProperty">{{
                "Thêm thuộc tính"
              }}</el-button>
              <!-- </div> -->
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row
        v-if="(isCreate || isUpdate) && shopId"
        class="list-shop__header"
        style="margin-top: 20px"
      >
        <el-col
          :sm="24"
          style="
          justify-content: flex-start;
          margin-top: 25px;
          display: flex;
          align-items: center;
        "
        >
          <!-- <div class="text-right"> -->
          <el-button type="warning" @click="onCancelPress">{{
            "Hủy bỏ"
          }}</el-button>
          <el-button type="primary" @click="onConfirmPress">{{
            "Xác nhận"
          }}</el-button>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
import { getAcountInfo } from '@/utils/auth'
import { get_list_permission } from '@/utils/utils'

import MyUpload from 'vue-image-crop-upload'
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER
// const MAX_SIZE = 10000
// const MAX_WIDTH = 500
// const MAX_HEIGHT = 300
// import { ref } from 'vue'

export default {
  name: 'PersonRepresentative',
  components: { MyUpload },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: Number,
      default() {
        return 0
      }
    },
    listProvinces: {
      type: Array,
      default() {
        return []
      }
    },
    isNew: {
      type: Boolean,
      default: false
    },
    stt: {
      type: String,
      default: 'I'
    }
  },
  data() {
    const account = getAcountInfo()
    return {
      urlBaseApi: `${urlBaseApi}/post_cdn`,
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      edit_id: null,
      view_id: null,
      data: [],
      shopDetail: '',
      loadingTable: false,
      isCreate: false,
      isUpdate: false,
      onShowDialog: false,
      name: '',
      // email: '',
      phone: '',
      ma_so_thue: '',
      address: '',
      state: true,
      selectedNumber: '',
      supplier_code: '',
      business_fax: '',
      supplier_type: 0,
      supplier_types: [
        {
          id: 0,
          name: 'Doanh nghiệp'
        },
        {
          id: 1,
          name: 'Cá nhân'
        }
      ],
      business_type: 1,
      supplier_bussiness: [],
      disable: !this.isNew,
      provinceModel: '',
      provice_loading: false,
      logo: '',
      districtModel: '',
      districts: [],
      wardModel: '',
      wards: [],
      fileList: [],
      provinces: [...this.listProvinces],
      provinces_search: [...this.listProvinces],
      district_loading: false,
      districts_search: [],
      wards_search: [],
      ward_loading: false,
      id: 0,
      list_sex: [
        {
          id: 0,
          name: 'nam'
        },
        {
          id: 1,
          name: 'nu'
        }
      ],
      service_type: 1,
      service_types: [
        {
          id: 1,
          name: 'Hàng Hóa'
        },
        {
          id: 2,
          name: 'Sự kiện - giải đấu'
        }
      ],
      properties_other: [
        // { name: '', value: '' }
      ],
      property_extend: [],
      is_show_crop: false,
      contain: 'contain',
      user_avatar: null
    }
  },
  watch: {
    // show(val) {
    //   if (val) {
    //     this.requestDetailContact()
    //   }
    // },
    provinceModel(val) {
      if (val) {
        if (this.isCreate || this.isUpdate || this.isNew) {
          this.districts = []
          this.districts_search = []
          // this.wards = []
          this.wards_search = []
          this.districtModel = ''
          this.wardModel = ''
          console.log('........... load list district ', this.provinceModel)
          this.requestDistricts()
        }
      }
    },
    districtModel(val) {
      if (val) {
        // this.wards = []
        if (this.isCreate || this.isUpdate || this.isNew) {
          this.wards_search = []
          this.wardModel = ''
          this.requestListWard()
        }
      }
    }
  },
  created() {
    console.log('............. shop id ', this.shopId)
    this.requestDetail()
    this.requestBussinessType()
  },
  methods: {
    offDialogUpload(value) {
      console.log('........................off popup', value)
      this.is_show_crop = value
    },
    onUploadAvatar() {
      this.is_show_crop = !this.is_show_crop
      // this.createStartup()
      console.log('.......................vao day', this.user_avatar)
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
        }
      })
    },
    // createStartup() {
    //   const formData = new FormData()
    //   const file = this.$refs.refCrop.files.pop()
    //   formData.append('file', file) // this.$refs.refCrop.files.pop())
    //   console.log('........url upload', file)
    //   fetch(this.urlBaseApi, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
    //     },
    //     body: formData
    //   }).then(res => res.json())
    //     .then(res => {
    //       console.log('............upload file thanh cong ', res)
    //     })
    //     .catch(err => console.log(err))
    // },
    // selectedFile() {
    //   this.imageError = ''

    //   const file = this.user_avatar // this.$refs.refCrop.files.pop()

    //   console.log('..............chon file la : ', file)

    //   if (!file || file.indexOf('image/') !== 0) return
    //   this.image.size = file.size
    //   if (this.image.size > MAX_SIZE) {
    //     this.imageError = `The image size (${this.image.size}) is too much (max is ${MAX_SIZE}).`
    //     return
    //   }

    //   const reader = new FileReader()

    //   reader.readAsDataURL(file)
    //   reader.onload = evt => {
    //     const img = new Image()
    //     img.onload = () => {
    //       this.image.width = img.width
    //       this.image.height = img.height
    //       console.log(this.image)
    //       if (this.image.width > MAX_WIDTH) {
    //         this.imageError = `The image width (${this.image.width}) is too much (max is ${MAX_WIDTH}).`
    //         return
    //       }
    //       if (this.image.height > MAX_HEIGHT) {
    //         this.imageError = `The image height (${this.image.height}) is too much (max is ${MAX_HEIGHT}).`
    //         return
    //       }
    //     }
    //     img.src = evt.target.result
    //   }

    //   reader.onerror = evt => {
    //     console.error(evt)
    //   }
    // },
    cropSuccess(user_avatar, field) {
      console.log('-------- crop success --------', field, user_avatar)
      // this.is_show_crop = false
      // this.user_avatar = user_avatar
      // this.createStartup()
      // this.fileList.push({ url: user_avatar })
      // console.log('.......... handleUploadImageSuccess : ', response.name, file, files)
      // this.$emit('onChangeUploadImage', this.fileList)
    },
    addMoreProperty() {
      this.properties_other.push({
        lable: '',
        value: '',
        is_new: 1
      })
    },
    /**
     * upload success
     *
     * [param] jsonData  server api return data, already json encode
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      console.log('upload' + JSON.stringify(jsonData))
      console.log('field: ' + field)
      const { error, name, msg } = jsonData
      if (error === 0) {
        this.is_show_crop = false
        // this.user_avatar = user_avatar
        // this.createStartup()
        // this.fileList.push({ url: name })
        this.user_avatar = name
        // console.log('.......... handleUploadImageSuccess : ', response.name, file, files)
        // this.$emit('onChangeUploadImage', this.fileList)
      } else {
        this.$message.error(msg)
      }
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    },
    requestBussinessType() {
      supplierResource
        .get_bussiness_type()
        .then((res) => {
          const { error, data } = res
          console.log(
            '.........list bussiness type: ',
            JSON.stringify(res),
            this.business_type
          )
          if (error === 0) {
            this.supplier_bussiness = data
          }
        })
        .catch((err) => {
          console.log('................ abc ', err)
        })
    },
    handleUploadImageSuccess(response, file, files) {
      this.fileList.push({ url: response.name })
      console.log(
        '.......... handleUploadImageSuccess : ',
        response.name,
        file,
        files
      )
      // this.$emit('onChangeUploadImage', this.fileList)
    },
    handleRemoveImage(file, files) {
      // this.$emit('onChangeUploadImage', files, file)
      this.fileList = []
    },
    setId(id) {
      this.id = parseInt(id) || 0
      this.requestDetailPersonRepresnetative()
    },
    handleSetUrlLogo(object) {
      if (Object.keys(object).length > 0) {
        this.shopDetail.logo_menu = object.name
      }
    },
    handleSetUrlImage(object) {
      if (Object.keys(object).length > 0) {
        this.shopDetail.logo = object.name
      }
    },
    /**
     * Xác nhận cấp nhật/ tạo mới người liên hệ
     */
    onConfirmPress() {
      console.log(
        '............ list thuoc tinh them la ',
        JSON.stringify(this.properties_other)
      )
      if (this.isCreate) {
        this.requestCreatePersonReprensentative()
      } else if (this.isUpdate) {
        this.requestUpdateSupplierInfo()
      }
    },
    checkPhoneNumber(phone) {
      const reg = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})\b/
      return reg.test(phone)
    },
    validateCreate() {},
    requestUpdateSupplierInfo() {
      const body = this.checkBodyUpdate()
      console.log('............. body update ', JSON.stringify(body))
      if (!body) return this.$msgbox(('Các trường có dấu (*) không được để trống'))
      console.log('.......... phone number ', body)
      if (body.phone && !this.checkPhoneNumber(body.phone)) {
        return this.$msgbox('Số điện thoại không hợp lệ')
      }
      if (Object.keys(body).length) {
        this.$confirm(('Bạn có chắc muốn cập nhật thông tin nhà cung cấp?')).then(_ => {
          supplierResource.update_supplier_info(body).then(res => {
            const { error, msg } = res
            if (error === 0) {
              this.$msgbox(msg).then(_ => {
                this.disable = true
                this.isUpdate = false
                for (const other of this.properties_other) {
                  delete other.is_new
                }
                this.shopDetail.others = [...this.properties_other]
                this.properties_other = []
                // this.setInfo(this.shopDetail)
              })
            } else {
              this.$msgbox(msg)
              this.setInfo(this.shopDetail)
              // this.resetAllInfo()
            }
          }).catch(err => {
            console.log('.......... tao don co loi ', err)
            this.loadingTable = false
            this.$msgbox(('Có lỗi xảy ra, vui lòng quay lại sau!'))
          })
        }).catch(_ => {})
      } else {
        this.disable = true
        this.isUpdate = false
      }
    },
    requestCreatePersonReprensentative() {
      // this.$confirm(i18n.t('create_person_representative_confirm')).then(_ => {
      //   const body = this.getPersonInfo()
      //   body.shop_id = this.shopId
      //   supplierResource.create_person_representative(body).then(res => {
      //     const { error, msg, data } = res
      //     if (error === 0) {
      //       this.$msgbox(msg)
      //       this.disable = true
      //       this.isCreate = false
      //       this.id = data.person_id
      //     } else {
      //       this.$msgbox(msg)
      //       // this.resetAllInfo()
      //     }
      //   }).catch(err => {
      //     console.log('.......... tao don co loi ', err)
      //     this.loadingTable = false
      //     this.$msgbox(i18n.t('time_out'))
      //   })
      // }).catch(_ => {})
    },
    onCancelPress() {
      this.resetAllInfo()
      this.disable = true
      this.isUpdate = false
      this.isCreate = false
      // this.setInfo(this.shopDetail)
    },
    resetData() {
      this.isCreate = false
      this.isUpdate = false
      this.fullname = ''
      this.email = ''
      this.phone = ''
      this.position = ''
      this.supplier_code = ''
      this.passport = ''
      this.sex = 0
      this.time_start = ''
      this.address = ''
      // provinces: [],
      this.provinceModel = ''
      this.districtModel = ''
      this.wardModel = ''
      this.shopDetail = ''
    },
    resetAllInfo() {
      if (this.isCreate) {
        this.fullname = ''
        this.email = ''
        this.phone = ''
        this.position = ''
        this.supplier_code = ''
        this.passport = ''
        this.sex = 0
        this.time_start = ''
        this.address = ''
        // provinces: [],
        this.provinceModel = ''
        this.districtModel = ''
        this.wardModel = ''
      } else if (this.isUpdate) {
        this.properties_other = []
        this.isUpdate = false
        this.setInfo(this.shopDetail)
      }
    },
    setInfo(data) {
      console.log('..........detail supplier : ', JSON.stringify(data))
      if (!data) return
      this.shopDetail = Object.assign({}, data)
      const { address_info, others } = data
      // const { address, district, township, city, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = address_info
      // this.fullname = data.fullname
      //   this.email = data.email
      this.phone = data.phone
      this.name = data.name
      this.ma_so_thue = data.ma_so_thue
      this.business_fax = data.business_fax
      this.supplier_code = data.supplier_code
      this.business_type = parseInt(data.business_type) || 1
      this.supplier_type = parseInt(data.type) || 0
      this.service_type = parseInt(data.service_type) || 1

      this.type = data.type
      this.state = data.active === 1
      if (data.logo) {
        // this.fileList.push({
        //   url: data.logo
        // })
        this.user_avatar = data.logo
      }

      if (address_info) {
        const {
          address,
          district,
          township,
          city,
          city_viettel_post_id,
          district_viettel_post_id,
          township_viettel_post_id
        } = address_info
        // provinces: [],
        this.address = address
        this.provinceModel = city_viettel_post_id
        this.districtModel = district_viettel_post_id
        this.wardModel = township_viettel_post_id
        this.provinces = [
          {
            viettel_id: city_viettel_post_id,
            viettel_name: city
          }
        ]
        this.provinces_search = [...this.provinces]
        this.districts = [
          {
            viettel_id: district_viettel_post_id,
            viettel_name: district
          }
        ]
        this.districts_search = [...this.districts]
        this.wards = [
          {
            viettel_id: township_viettel_post_id,
            viettel_name: township
          }
        ]
        this.wards_search = [...this.wards]
      }
      if (others && others.length) {
        let ars = []
        this.property_extend = []
        for (const other of others) {
          if (ars.length < 3) {
            ars.push(Object.assign({}, other))
          } else {
            this.property_extend.push([...ars])
            ars = [other]
          }
        }
        if (ars.length) {
          this.property_extend.push([...ars])
        }
        console.log(
          '.........property extend : ',
          JSON.stringify(this.property_extend)
        )
        // this.property_extend = [...others]
      }
    },
    /**
     * tra ra thong tin nguoi lien he
     */
    getInfo() {
      if (
        !this.name.length ||
        !this.phone.length ||
        !this.supplier_code.length ||
        !this.ma_so_thue.length ||
        !this.provinceModel ||
        !this.districtModel ||
        !this.wardModel ||
        !this.address.trim().length
      ) {
        return null
      }
      return {
        name: this.name,
        // email: this.email,
        phone: this.phone,
        ma_so_thue: this.ma_so_thue,
        active: this.state ? 1 : 0,
        business_fax: this.business_fax,
        business_type: parseInt(this.business_type) || 1,
        service_type: parseInt(this.service_type) || 1,

        type: parseInt(this.type) || 0,
        supplier_code: this.supplier_code,
        address: this.address,
        logo: this.user_avatar,
        province: this.provinces.find(
          (d) => d.viettel_id === this.provinceModel
        ),
        district: this.districts.find(
          (d) => d.viettel_id === this.districtModel
        ),
        ward: this.wards.find((d) => d.viettel_id === this.wardModel),
        others: this.properties_other
      }
    },
    /**
     * lay nhung truong update thoi
     */
    checkBodyUpdate() {
      const { address_info, others } = this.shopDetail
      const obj_update = {}
      const addres_update = {}
      const properties_other_update = []
      const properties_other_new = []
      console.log('...........check update ', JSON.stringify(this.property_extend), others)
      for (const other of this.properties_other) {
        let { is_new } = other
        is_new = parseInt(is_new) || 0
        if (is_new) {
          properties_other_new.push(other)
        } else {
          const obj = others.find(d => d.id === other.id)
          console.log('......... tim thay san pham : ', JSON.stringify(obj))
          if (obj) { // tim thay gox
            console.log('.........so sanh ket qua ', JSON.stringify(obj), JSON.stringify(other))
            if (other.lable !== obj.lable || other.value !== obj.value) {
              properties_other_update.push(other)
            }
          }
        }
      }
      if (properties_other_update.length) {
        obj_update.properties_other_update = properties_other_update
      }
      if (properties_other_new.length) {
        obj_update.others = properties_other_new
      }
      if (this.name.trim().length) {
        if (this.name.trim() !== this.shopDetail.name) {
          obj_update.name = this.name.trim()
        }
      } else {
        return null
      }
      if (this.user_avatar?.length) {
        if (this.user_avatar.trim() !== this.shopDetail.logo) {
          obj_update.logo = this.user_avatar.trim()
        }
      }
      //   if (this.email.trim() !== this.detail.email) {
      //     obj_update.email = this.email.trim()
      //   }
      if (this.phone.trim().length) {
        if (this.phone.trim() !== this.shopDetail.phone) {
          obj_update.phone = this.phone.trim()
        }
      } else {
        return null
      }
      if (!this.shopDetail.business_fax || (this.business_fax.trim().length && this.business_fax.trim() !== this.shopDetail.business_fax)) {
        obj_update.business_fax = this.business_fax.trim()
      }
      if (!this.shopDetail.supplier_code || (this.supplier_code.trim().length && this.supplier_code.trim() !== this.shopDetail.supplier_code)) {
        obj_update.supplier_code = this.supplier_code.trim()
      }
      if (!this.shopDetail.business_type || (this.business_type !== this.shopDetail.business_type)) {
        obj_update.business_type = this.business_type
      }
      if (this.shopDetail.type || (this.supplier_type !== this.shopDetail.type)) {
        obj_update.type = this.supplier_type
      }
      // if (this.shopDetail.ma_so_thue || (this.ma_so_thue.length && this.ma_so_thue !== this.shopDetail.ma_so_thue)) {
      //   obj_update.ma_so_thue = this.ma_so_thue
      // }
      if (this.ma_so_thue.trim().length) {
        // obj_update.ma_so_thue = this.ma_so_thue
        if (this.ma_so_thue.trim() !== this.shopDetail.ma_so_thue) {
          obj_update.ma_so_thue = this.ma_so_thue
        }
      } else {
        return null
      }
      if (this.fileList.length && this.fileList[0].url !== this.shopDetail.logo) {
        obj_update.logo = this.fileList[0].url
      }
      // if (this.address.trim() !== address) {
      //   addres_update.address = address
      // }
      if (address_info) {
        const { address, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = address_info
        if (this.address.trim() !== address) {
          addres_update.address = this.address
        }
        console.log('.................... thong tin tinh/tp ', this.provinceModel, city_viettel_post_id, JSON.stringify(this.provinces))
        if (this.provinceModel !== city_viettel_post_id) {
          const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
          if (province) {
            addres_update.city = province.viettel_name
            addres_update.city_viettel_post_code = province.viettel_code
            addres_update.city_viettel_post_id = province.viettel_id
          } else {
            return null
          }
        }
        if (this.districtModel !== district_viettel_post_id) {
          const district = this.districts.find(d => d.viettel_id === this.districtModel)
          if (district) {
            addres_update.district = district.viettel_name
            addres_update.district_viettel_post_code = district.viettel_code
            addres_update.district_viettel_post_id = district.viettel_id
          } else {
            return null
          }
        }
        if (this.wardModel !== township_viettel_post_id) {
          const wardModel = this.wards.find(d => d.viettel_id === this.wardModel)
          if (wardModel) {
            addres_update.township = wardModel.viettel_name
            addres_update.township_viettel_post_id = wardModel.viettel_id
          } else {
            return null
          }
        }
      } else {
        addres_update.address = this.address
        const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
        if (province) {
          addres_update.city = province.viettel_name
          addres_update.city_viettel_post_code = province.viettel_code
          addres_update.city_viettel_post_id = province.viettel_id
        } else {
          return null
        }
        const district = this.districts.find(d => d.viettel_id === this.districtModel)
        if (district) {
          addres_update.district = district.viettel_name
          addres_update.district_viettel_post_code = district.viettel_code
          addres_update.district_viettel_post_id = district.viettel_id
        } else {
          return null
        }
        const wardModel = this.wards.find(d => d.viettel_id === this.wardModel)
        if (wardModel) {
          addres_update.township = wardModel.viettel_name
          addres_update.township_viettel_post_id = wardModel.viettel_id
        } else {
          return null
        }
      }
      if (Object.keys(addres_update).length) {
        addres_update.id = address_info ? address_info.id : 0
        obj_update.address_update = addres_update
      }
      const active = this.state ? 1 : 0
      if (active !== this.shopDetail.active) {
        obj_update.active = active
      }
      if (Object.keys(obj_update).length) {
        obj_update.id = this.shopDetail.id
      }
      return obj_update
    },
    provicesFocus() {
      console.log(
        '............ list tinh/thanh pho ',
        this.provinces,
        this.listProvinces
      )
      if (!this.provinces.length) {
        this.requestListProvinces()
      }
      if (this.provinces.length < 5) {
        this.provinces = [...this.listProvinces]
        this.provinces_search = [...this.listProvinces]
      }
    },
    requestListProvinces() {
      this.provice_loading = true
      supplierResource
        .getProvinceList()
        .then((res) => {
          // console.log('......... list provinces: ', JSON.stringify(res))
          this.provice_loading = false
          const { error, data } = res
          if (error === 0) {
            this.provinces = data
            this.provinces_search = [...data]
          }
        })
        .catch((err) => {
          console.log('............ list tinh thanh: ', err)
          this.provice_loading = false
        })
    },
    districtFocus() {
      if (!this.districts.length) {
        this.requestDistricts()
      }
    },
    requestDistricts() {
      this.district_loading = true
      supplierResource
        .getDistrictList({ viettel_province_id: this.provinceModel })
        .then((res) => {
          this.district_loading = false
          const { error, data } = res
          if (error === 0) {
            this.districts = [...data]
            this.districts_search = [...data]
            console.log(res, 'HUỵen')
          }
        })
        .catch((err) => {
          console.log('......... list huyen co loi ', err)
          this.district_loading = false
        })
    },
    wardFocus() {
      if (!this.wards.length) {
        this.requestListWard()
      }
    },
    requestListWard() {
      this.ward_loading = true
      supplierResource
        .getWardsList({ viettel_district_id: this.districtModel })
        .then((res) => {
          const { error, data } = res
          this.ward_loading = false
          if (error === 0) {
            this.wards = [...data]
            this.wards_search = [...data]
          }
        })
        .catch((err) => {
          console.log('........... list ward err ', err)
          this.ward_loading = false
        })
    },
    onEditPress() {
      this.disable = false
      this.isUpdate = true
      this.isCreate = false
      this.show_btn = (this.isCreate || this.isUpdate) && this.shopId
      this.provinces_search = [...this.listProvinces]
      this.provinces = [...this.listProvinces]
      const others = this.shopDetail.others
      if (others && others.length) {
        this.properties_other = []
        for (const other of others) {
          this.properties_other.push(Object.assign({}, other))
        }
      }
      // this.properties_other = [...this.shopDetail.others]
    },
    onCreatePress() {
      this.disable = false
      this.isUpdate = false
      this.isCreate = true
      this.show_btn = (this.isCreate || this.isUpdate) && this.shopId
      this.resetAllInfo()
    },
    onSearchProvince(keyword) {
      console.log('........... tim kiem thanh pho : ', keyword)
      if (keyword !== '') {
        this.provinces_search = this.provinces.filter((item) => {
          // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.provinces_search.length) {
          this.provice_loading = false
        }
      }
    },
    onSearchDistrict(keyword) {
      if (keyword !== '') {
        this.districts_search = this.districts.filter((item) => {
          // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.districts_search.length) {
          this.district_loading = false
        }
      }
    },
    onSearchWard(keyword) {
      if (keyword !== '') {
        this.wards_search = this.wards.filter((item) => {
          // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.wards_search.length) {
          this.ward_loading = false
        }
      }
    },
    requestDetail() {
      if (!this.id) return
      this.loadingTable = true
      supplierResource
        .get_supplier_info(this.shopId)
        .then((response) => {
          const { error, data } = response
          console.log(
            '............. chi tiet nha cung cap : ',
            JSON.stringify(response)
          )
          this.loadingTable = false
          if (error === 0) {
            this.detail = data
            this.setInfo(data)
          }
        })
        .catch((err) => {
          console.log('.................. co loi ', err)
          this.loadingTable = false
        })
    },
    onShowDialogShopDetail(url) {
      this.url_image = url
      this.showDialogShopDetail = true
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogShopDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
      }
    },
    handleClickDialogShop(object) {
      console.log('--------------------------------dialog', object)
      this.onShowDialog = object.dialog
      if (object.reload) {
        // this.onGetListShop()
      }
    },
    onResetSearch() {
      // this.onGetListShop()
    }
  }
}
</script>

<style lang="scss" scoped>
.id{
  background-color: #ffffff ;
}
.search-wrapper {
  margin-bottom: 40px;
  padding: 25px;
  border: 1px solid #ebeef5;
}
.app-container {
  padding: 15px;
}
.row-item {
  display: table;
  background-color: blue($color: #000000);
  width: 270px;
}
.row-item-left {
  display: table;
  background-color: blue($color: #000000);
  width: 270px;
  margin-left: 1em;
}
.row-item-2 {
  display: table;
  width: 260px;
}
.select-item {
  margin-top: 10px;
  width: 270px;
}
.select-item-2 {
  margin-top: 10px;
  width: 260px;
}
.text-lable {
  margin-right: 10px;
  font-size: 16px;
  font-weight: 400;
}
.item-label {
  font-size: 16px;
  font-weight: 400;
}
.row-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.row-row-first {
  display: flex;
  justify-content: flex-end;
  // margin-top: 10px;
}
.el-col-24 {
  // width: 100%;
}
.div-wrap-info {
  margin: 10px 15px;
}
.mb-10 {
  margin-left: 2em;
}
// .custom-date-picker ::v-deep .el-input__prefix {
//   display: none;
// }
// .custom-date-picker ::v-deep .el-input__inner {
//   border: 0 !important;
// }

</style>

