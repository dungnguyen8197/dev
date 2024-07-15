<template>
  <div class="id">

    <el-row class="search-wrapper">
      <el-row :sm="24" style="display: flex; justify-content: space-between;">
        <el-col :sm="12" style="justify-content: flex-start; display: flex; align-items: center;">
          <h5>{{ stt }}. {{ ('Thông tin người đại diện') }}</h5>
        </el-col>
        <el-col :sm="12" style="justify-content: flex-end; margin-top:15px; display: flex; align-items: center;">
          <el-button v-if="!isNew" type="primary" style="margin-left: 10px; font-size: 16px;font-weight: 400;  " @click="onCreatePress">{{ ('Thêm mới') }}</el-button>
          <el-button v-if="!isNew && is_load_data" type="primary" style="margin-left: 10px; font-size: 16px;font-weight: 400;  " @click="onEditPress">{{ ('Chỉnh sửa') }}</el-button>
        </el-col>
      </el-row>
      <el-row style="display: flex; justify-content: left;">
        <el-col :sm="5">
          <el-row style="margin-top: 10px; margin-bottom: 10px;">
            <label class="text-lable">{{ ('Ảnh đại diện(Không bắt buộc)') }}</label>
          </el-row>
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
          <el-row style="margin-top: 10px;">
            <el-button :disabled="disable" @click="onUploadAvatar">{{ ('Tải lên ảnh đại diện') }}</el-button>
          </el-row>
        </el-col>
        <el-col :sm="19">
          <div style="display: flex; justify-content: right; flex-wrap: wrap;">
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ ('Họ và tên') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="fullname" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập họ tên')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item">
                <label class="item-label">{{ ('Số điện thoại') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="phone" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập số điện thoại')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item">
                <label class="item-label">{{ ('Chức danh') }}</label>
                <el-input v-model="position" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập chức danh')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item">
                <label class="item-label">{{ ('Giới tính') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="sex"
                  class="select-item"
                  :placeholder="('Chọn giới tính')"
                  :disabled="disable"
                >
                  <el-option
                    v-for="gt in list_sex"
                    :key="gt.id"
                    :label="gt.name"
                    :value="gt.id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ ('Căn cước công dân') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="passport" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập CCCD')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item">
                <label class="item-label">{{ ('Ngày bắt đầu') }}</label>
                <div class="demo-date-picker">
                  <!-- <div class="block">
                    <span class="demonstration">Default</span>
                    <el-date-picker
                      v-model="value1"
                      type="date"
                      placeholder="Pick a day"
                      :size="size"
                    />
                  </div> -->
                  <!-- <div class="block"> -->
                  <!-- <span class="demonstration">Picker with quick options</span> -->
                  <el-date-picker
                    v-model="time_start"
                    style="width: 270px; margin-top: 10px;"
                    type="date"
                    format="dd/MM/yyyy"
                    :placeholder="('Chọn ngày bắt đầu')"
                    :disabled="disable"
                  />
                <!-- </div> -->
                </div>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ ('Tỉnh/Thành phố') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="provinceModel"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="('Chọn Tỉnh/Thành phố')"
                  :remote-method="onSearchProvince"
                  :loading="provice_loading"
                  @focus="provicesFocus"
                >
                  <el-option
                    v-for="province in provinces_search"
                    :key="province.viettel_id"
                    :label="province.viettel_name"
                    :value="province.viettel_id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ ('Quận/huyện') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="districtModel"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="('Chọn Quận/huyện')"
                  :remote-method="onSearchProvince"
                  :loading="provice_loading"
                  @focus="provicesFocus"
                >
                  <el-option
                    v-for="district in districts_search"
                    :key="district.viettel_id"
                    :label="district.viettel_name"
                    :value="district.viettel_id"
                  />
                </el-select>
              </el-row>
            </div>

            <!-- <el-col class="mb-10">
            <el-row class="row-item">
              <label class="item-label">{{ ('detail_address') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
              <el-input v-model="address" :disabled="disable" style="margin-top: 10px;" :placeholder="('detail_address')" />
            </el-row>
          </el-col> -->
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ (' Phường/xã') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="wardModel"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="('Chọn Phường/xã')"
                  :remote-method="onSearchProvince"
                  :loading="provice_loading"
                  @focus="provicesFocus"
                >
                  <el-option
                    v-for="ward in wards_search"
                    :key="ward.viettel_id"
                    :label="ward.viettel_name"
                    :value="ward.viettel_id"
                  />
                </el-select>
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <label class="item-label">{{ ('Địa chỉ cụ thể( Số nhà...)') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="address" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập địa chỉ cụ thể')" />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <!-- <label class="item-label">{{ ('Địa chỉ cụ thể( Số nhà...)') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="address" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập địa chỉ cụ thể')" /> -->
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item">
                <!-- <label class="item-label">{{ ('Địa chỉ cụ thể( Số nhà...)') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="address" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập địa chỉ cụ thể')" /> -->
              </el-row>
            </div>
          </div>

        </el-col>
      </el-row>
      <el-row v-if="(isCreate || isUpdate) && shopId" class="list-shop__header">
        <el-col :sm="24" style="justify-content: flex-start; margin-top:25px; display: flex; align-items: center;">
          <!-- <div class="text-right"> -->
          <el-button type="warning" @click="onCancelPress">{{ ('Hủy bỏ') }}</el-button>
          <el-button type="primary" @click="onConfirmPress">{{ ('Xác nhận') }}</el-button>
        <!-- </div> -->
        </el-col>
      </el-row>
    </el-row>
  </div>

</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
import { getAcountInfo } from '@/utils/auth'
import MyUpload from 'vue-image-crop-upload'
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()
const _urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER

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
      default() { return 0 }
    },
    listProvinces: {
      type: Array,
      default() { return [] }
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      data: [],
      detail: '',
      loadingTable: false,
      isCreate: false,
      isUpdate: false,
      onShowDialog: false,
      fullname: '',
      email: '',
      phone: '',
      position: '',
      passport: '',
      sex: 0,
      time_start: '',
      address: '',
      state: 0,
      // provinces: [],
      disable: !this.isNew,
      provinceModel: null,
      provinces: [...this.listProvinces],
      provinces_search: [...this.listProvinces],
      provice_loading: false,
      districtModel: null,
      district_loading: false,
      districts: [],
      districts_search: [],
      wardModel: null,
      wards: [],
      wards_search: [],
      ward_loading: false,
      id: 0,
      list_sex: [
        {
          id: 0,
          name: ('Nam')
        },
        {
          id: 1,
          name: ('Nữ')
        }
      ],
      stt: this.isNew ? 'II' : 'III',
      is_show_crop: false,
      contain: 'contain',
      user_avatar: null,
      urlBaseApi: `${_urlBaseApi}/post_cdn`,
      avatar: '',
      is_load_data: false
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
    cropSuccess(user_avatar, field) {
      console.log('-------- crop success --------', field, user_avatar)
      // this.is_show_crop = false
      this.user_avatar = user_avatar
      // this.createStartup()
      // this.fileList.push({ url: user_avatar })
      // console.log('.......... handleUploadImageSuccess : ', response.name, file, files)
      // this.$emit('onChangeUploadImage', this.fileList)
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
        this.avatar = name
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
    setId(id) {
      this.id = parseInt(id) || 0
      this.requestDetailPersonRepresnetative()
    },
    /**
    * Xác nhận cấp nhật/ tạo mới người liên hệ
    */
    onConfirmPress() {
      if (this.isCreate) {
        this.requestCreatePersonReprensentative()
      } else if (this.isUpdate) {
        this.requestUpdatePersionRepresentative()
      }
    },
    requestUpdatePersionRepresentative() {
      const body = this.checkBodyUpdate()
      if (!body) return this.$msgbox(('Các trường có dấu (*) không được để trống'))
      if (Object.keys(body).length) {
        this.$confirm(('Bạn có chắc muốn cập nhật thông tin người đại diện này không?')).then(_ => {
          supplierResource.update_representative_person(body).then(res => {
            const { error, msg } = res
            if (error === 0) {
              this.$msgbox(msg)
              this.disable = true
              this.isUpdate = false
            } else {
              this.$msgbox(msg)
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
      this.$confirm(('Bạn có chắc muốn tạo thông tin người đại diện này không?')).then(_ => {
        const body = this.getPersonInfo()
        if (!body) {
          return this.$msgbox(('Các trường có dấu (*) không được để trống'))
        }
        body.shop_id = this.shopId
        supplierResource.create_person_representative(body).then(res => {
          const { error, msg, data } = res
          if (error === 0) {
            this.$msgbox(msg)
            this.disable = true
            this.isCreate = false
            this.id = data.person_id
          } else {
            this.$msgbox(msg)
            // this.resetAllInfo()
          }
        }).catch(err => {
          console.log('.......... tao don co loi ', err)
          this.loadingTable = false
          this.$msgbox(('Có lỗi xảy ra, vui lòng quay lại sau!'))
        })
      }).catch(_ => {})
    },
    onCancelPress() {
      this.resetAllInfo()
      this.disable = true
      this.isUpdate = false
      this.isCreate = false
      this.setInfo(this.detail)
    },
    resetData() {
      this.isCreate = false
      this.isUpdate = false
      this.fullname = ''
      this.email = ''
      this.phone = ''
      this.position = ''
      this.passport = ''
      this.sex = 0
      this.time_start = ''
      this.address = ''
      // provinces: [],
      this.provinceModel = ''
      this.districtModel = ''
      this.wardModel = ''
      this.avatar = ''
    },
    resetAllInfo() {
      if (this.isCreate) {
        this.fullname = ''
        this.email = ''
        this.phone = ''
        this.position = ''
        this.passport = ''
        this.sex = 0
        this.time_start = ''
        this.address = ''
        // provinces: [],
        this.provinceModel = ''
        this.districtModel = ''
        this.wardModel = ''
      } else if (this.isUpdate) {
        this.setInfo(this.detail)
      }
    },
    setInfo(data) {
      if (!data) {
        this.is_load_data = false
        return
      }
      this.is_load_data = true
      const { address_info } = data
      const { address, district, township, city, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = address_info
      this.fullname = data.fullname
      this.user_avatar = data.avatar
      //   this.email = data.email
      this.phone = data.phone
      this.position = data.position
      this.passport = data.passport
      this.sex = data.sex
      this.time_start = data.time_start
      this.address = address
      // provinces: [],
      this.provinceModel = city_viettel_post_id
      this.districtModel = district_viettel_post_id
      this.wardModel = township_viettel_post_id
      this.provinces = [{
        viettel_id: city_viettel_post_id,
        viettel_name: city
      }]
      this.provinces_search = [...this.provinces]
      this.districts = [{
        viettel_id: district_viettel_post_id,
        viettel_name: district
      }]
      this.districts_search = [...this.districts]
      this.wards = [{
        viettel_id: township_viettel_post_id,
        viettel_name: township
      }]
      this.wards_search = [...this.wards]
    },
    /**
     * tra ra thong tin nguoi lien he
    */
    getPersonInfo() {
      if (!this.fullname.length || !this.phone.length || !this.passport.length || !this.provinceModel || !this.districtModel || !this.address.trim().length) {
        return null
      }
      return {
        fullname: this.fullname,
        // email: this.email,
        avatar: this.avatar,
        phone: this.phone,
        position: this.position,
        passport: this.passport,
        sex: this.sex,
        time_start: this.time_start,
        address: this.address,
        province: this.provinces.find(d => d.viettel_id === this.provinceModel),
        district: this.districts.find(d => d.viettel_id === this.districtModel),
        wardModel: this.wards.find(d => d.viettel_id === this.wardModel)
      }
    },
    /**
    * lay nhung truong update thoi
    */
    checkBodyUpdate() {
      const { address_info, id } = this.detail
      const obj_update = {}
      const addres_update = {}
      if (this.fullname.trim().length) {
        if (this.fullname.trim() !== this.detail.fullname) {
          obj_update.fullname = this.fullname.trim()
        }
      } else {
        return null
      }
      //   if (this.email.trim() !== this.detail.email) {
      //     obj_update.email = this.email.trim()
      //   }
      if (this.phone.trim().length) {
        if (this.phone.trim() !== this.detail.phone) {
          obj_update.phone = this.phone.trim()
        }
      } else {
        return null
      }
      if (this.avatar.length && this.avatar !== this.detail.avatar) {
        obj_update.avatar = this.avatar
      }
      if (this.position.trim() !== this.detail.position) {
        obj_update.position = this.position.trim()
      }
      if (this.passport.trim().length) {
        if (this.passport.trim() !== this.detail.passport) {
          obj_update.passport = this.passport.trim()
        }
      } else {
        return null
      }
      if (this.sex !== this.detail.sex) {
        obj_update.sex = this.sex
      }
      if (this.time_start !== this.detail.time_start) {
        obj_update.time_start = this.time_start
      }
      if (address_info && id) {
        const { address, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = address_info
        if (this.address.trim() !== address) {
          addres_update.address = this.address
        }
        if (this.provinceModel !== city_viettel_post_id) {
          const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
          if (province) {
            addres_update.city = province.viettel_name
            addres_update.city_viettel_post_code = province.viettel_code
            addres_update.city_viettel_post_id = province.viettel_id
          }
        }
        if (this.districtModel !== district_viettel_post_id) {
          const district = this.districts.find(d => d.viettel_id === this.districtModel)
          if (district) {
            addres_update.district = district.viettel_name
            addres_update.district_viettel_post_code = district.viettel_code
            addres_update.district_viettel_post_id = district.viettel_id
          }
        }
        if (this.wardModel !== township_viettel_post_id) {
          const wardModel = this.wards.find(d => d.viettel_id === this.wardModel)
          if (wardModel) {
            addres_update.township = wardModel.viettel_name
            addres_update.township_viettel_post_id = wardModel.viettel_id
          }
        }
        if (Object.keys(addres_update).length) {
          addres_update.id = address_info.id
          obj_update.address_update = addres_update
        }
      } else {
        // {shop_id,fullname,phone,sex,position,province,district,wardModel,address,time_start,passport,avatar}
        // addres_update.address = this.address
        const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
        // if (province) {
        //   addres_update.city = province.viettel_name
        //   addres_update.city_viettel_post_code = province.viettel_code
        //   addres_update.city_viettel_post_id = province.viettel_id
        // }
        const district = this.districts.find(d => d.viettel_id === this.districtModel)
        // if (district) {
        //   addres_update.district = district.viettel_name
        //   addres_update.district_viettel_post_code = district.viettel_code
        //   addres_update.district_viettel_post_id = district.viettel_id
        // }
        const wardModel = this.wards.find(d => d.viettel_id === this.wardModel)
        // if (wardModel) {
        //   addres_update.township = wardModel.viettel_name
        //   addres_update.township_viettel_post_id = wardModel.viettel_id
        // }
        // if (Object.keys(addres_update).length) {
        //   obj_update.address_update = addres_update
        //   obj_update.shop_id = this.shopId
        // }
        return {
          shop_id: this.shopId,
          fullname: this.fullname.trim(),
          phone: this.phone.trim(),
          sex: this.sex,
          position: this.position,
          province: province,
          district: district,
          wardModel: wardModel,
          address: this.address.trim(),
          time_start: this.time_start,
          passport: this.passport,
          avatar: this.avatar
        }
      }

      // if (Object.keys(addres_update).length) {
      //   addres_update.id = address_info.id
      //   obj_update.address_update = addres_update
      // }
      if (Object.keys(obj_update).length) {
        obj_update.id = this.detail.id
      }
      return obj_update
    },
    provicesFocus() {
      console.log('............ list tinh/thanh pho ', this.provinces, this.listProvinces)
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
      supplierResource.getProvinceList().then(res => {
        console.log('......... list provinces: ', JSON.stringify(res))
        this.provice_loading = false
        const { error, data } = res
        if (error === 0) {
          this.provinces = data
          this.provinces_search = [...data]
        }
      }).catch(err => {
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
      supplierResource.getDistrictList({ viettel_province_id: this.provinceModel }).then(res => {
        this.district_loading = false
        const { error, data } = res
        if (error === 0) {
          this.districts = [...data]
          this.districts_search = [...data]
        }
      }).catch(err => {
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
      supplierResource.getWardsList({ viettel_district_id: this.districtModel }).then(res => {
        const { error, data } = res
        this.ward_loading = false
        if (error === 0) {
          this.wards = [...data]
          this.wards_search = [...data]
        }
      }).catch(err => {
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
        this.provinces_search = this.provinces.filter(item => {
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
        this.districts_search = this.districts.filter(item => {
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
        this.wards_search = this.wards.filter(item => {
        // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.wards_search.length) {
          this.ward_loading = false
        }
      }
    },
    requestDetailPersonRepresnetative() {
      if (!this.id) return
      this.loadingTable = true
      supplierResource.get_person_representative(this.id).then(response => {
        const { error, data } = response
        console.log('............. chi tiet nha cung cap : ', JSON.stringify(response))
        this.loadingTable = false
        if (error === 0) {
          this.detail = data
          this.setInfo(data)
        }
      }).catch(err => {
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
  background-color: #ffffff
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
    .row-item-2{
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
    .row-row{
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .row-row-first{
      display: flex;
      justify-content: flex-end;
      // margin-top: 10px;
    }
    .div-wrap-info {
      margin: 10px 15px;
    }
    .el-col-24 {
      // width: 100%;
    }
    .mb-10 {
      margin-left: 2em;
    }
  </style>
