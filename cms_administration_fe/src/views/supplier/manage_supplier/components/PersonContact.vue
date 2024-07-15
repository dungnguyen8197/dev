<template>
  <div class="id">
    <el-row class="search-wrapper">
      <el-row :sm="12">
        <!-- <h3>VI. {{ ('person_contact') }}</h3> -->
        <el-row :sm="24" style="display: flex; justify-content: space-between;">
          <el-col :sm="12" style="justify-content: flex-start; display: flex; align-items: center;">
            <h5>{{ stt }}. {{ ('Thông tin người liên hệ') }}</h5>
          </el-col>
          <el-col :sm="12" style="justify-content: flex-end;margin-top:25px; display: flex; align-items: center;">
            <el-button v-if="!isNew" type="primary" style="margin-left: 10px; font-size: 16px;font-weight: 400; " @click="onCreatePress">{{ ('Thêm mới') }}</el-button>
            <el-button v-if="!isNew && is_load_data" type="primary" style="margin-left: 10px; font-size: 16px;font-weight: 400; " @click="onEditPress">{{ ('Chỉnh sửa') }}</el-button>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="display: flex; justify-content: right;">
        <el-col :sm="19" :md="24">
          <div style="display: flex; justify-content: right; flex-wrap: wrap;">

            <div class="div-wrap-info">

              <el-row class="row-item-2">
                <label class="item-label">{{ ('Họ và tên') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="fullname" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập họ tên')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item-2">
                <label class="item-label">{{ ('Số điện thoại') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="phone" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập số điện thoại')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item-2">
                <label class="item-label">{{ ('Email liên hệ') }}</label>
                <el-input v-model="email" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập email')" />
              </el-row>
            </div>
            <div class="div-wrap-info">

              <el-row class="row-item-2">
                <label class="item-label">{{ ('Chức danh') }}</label>
                <el-input v-model="position" style="margin-top: 10px;" :disabled="disable" :placeholder="('Nhập chức danh')" />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Căn cước công dân') }}</label>
                <el-input v-model="passport" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập CCCD')" />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Giới tính') }}</label>
                <el-select
                  v-model="sex"
                  class="select-item-2"
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
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Ngày bắt đầu') }}</label>
                <div class="demo-date-picker">
                  <el-date-picker
                    v-model="date_start"
                    style="width: 260px; margin-top: 10px;"
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
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Tỉnh/Thành phố') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="provinceModel"
                  class="select-item-2"
                  filterable
                  remote
                  :disabled="disable"
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
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Quận/huyện') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="districtModel"
                  class="select-item-2"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="('Chọn Quận/huyện')"
                  :remote-method="onSearchDistrict"
                  :loading="district_loading"
                  @focus="districtFocus"
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
            <div class="div-wrap-info">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Phường/xã') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="wardModel"
                  class="select-item-2"
                  filterable
                  :disabled="disable"
                  remote
                  reserve-keyword
                  :placeholder="('Chọn Phường/xã')"
                  :remote-method="onSearchWard"
                  :loading="ward_loading"
                  @focus="wardFocus"
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
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Địa chỉ cụ thể( Số nhà... )') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="address" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập địa chỉ cụ thể')" />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2" />
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2" />
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2" />
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2" />
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2" />
            </div>
          </div>

        </el-col>
      </el-row>
      <el-row v-if="(isCreate || isUpdate) && shopId" class="list-shop__header">
        <el-col :sm="24" style="justify-content: flex-start; display: flex; align-items: center;">
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
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()

export default {
  name: 'PersonContact',
  components: { },
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
      contact_detail: '',
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
      date_start: '',
      address: '',
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
      stt: this.isNew ? 'III' : 'IV',
      is_load_data: false
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.requestDetailContact()
      }
    },
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
    /**
     * Xác nhận cấp nhật/ tạo mới người liên hệ
     */
    onConfirmPress() {
      if (this.isCreate) {
        this.requestCreateContact()
      } else if (this.isUpdate) {
        this.requestUpdateContact()
      }
    },
    requestUpdateContact() {
      const body = this.checkBodyUpdate()
      if (!body) return this.$msgbox(('Các trường có dấu (*) không được để trống'))
      if (Object.keys(body).length) {
        this.$confirm(('Bạn có chắc muốn cập nhật thông tin người liên hệ này không?')).then(_ => {
          supplierResource.update_contact_person(body).then(res => {
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
    requestCreateContact() {
      this.$confirm(('Bạn có chắc muốn tạo người liên hệ này?')).then(_ => {
        const body = this.getContactInfo()
        if (!body) {
          return this.$msgbox(('Các trường có dấu (*) không được để trống'))
        }
        body.shop_id = this.shopId
        supplierResource.create_person_contact(body).then(res => {
          const { error, msg } = res
          if (error === 0) {
            this.$msgbox(msg)
            this.disable = true
            this.isCreate = false
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
      this.setInfo(this.contact_detail)
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
      this.date_start = ''
      this.address = ''
      // provinces: [],
      this.provinceModel = ''
      this.districtModel = ''
      this.wardModel = ''
      this.contact_detail = ''
    },
    resetAllInfo() {
      if (this.isCreate) {
        this.fullname = ''
        this.email = ''
        this.phone = ''
        this.position = ''
        this.passport = ''
        this.sex = 0
        this.date_start = ''
        this.address = ''
        // provinces: [],
        this.provinceModel = ''
        this.districtModel = ''
        this.wardModel = ''
      } else if (this.isUpdate) {
        this.setInfo(this.contact_detail)
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
      console.log('.......... map dia chir', JSON.stringify(address_info))
      this.fullname = data.fullname
      this.email = data.email
      this.phone = data.phone
      this.position = data.position
      this.passport = data.passport
      this.sex = data.sex
      this.date_start = data.date_start
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
    getContactInfo() {
      if (!this.fullname.length || !this.phone.length || !this.provinceModel || !this.districtModel || !this.wardModel || !this.address.trim().length) {
        return null
      }
      return {
        fullname: this.fullname,
        email: this.email,
        phone: this.phone,
        position: this.position,
        passport: this.passport,
        sex: this.sex,
        date_start: this.date_start,
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
      const { address_info, id } = this.contact_detail
      const obj_update = {}
      const addres_update = {}
      if (id) {
        const { address, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = address_info
        if (this.fullname.trim().length) {
          if (this.fullname.trim() !== this.contact_detail.fullname) {
            obj_update.fullname = this.fullname.trim()
          }
        } else {
          return null
        }
        if (this.email.trim() !== this.contact_detail.email) {
          obj_update.email = this.email.trim()
        }
        if (this.phone.trim().length) {
          if (this.phone.trim() !== this.contact_detail.phone) {
            obj_update.phone = this.phone.trim()
          }
        } else {
          return null
        }
        if (this.position.trim() !== this.contact_detail.position) {
          obj_update.position = this.position.trim()
        }
        if (this.passport.trim() !== this.contact_detail.passport) {
          obj_update.passport = this.passport.trim()
        }
        if (this.sex !== this.contact_detail.sex) {
          obj_update.sex = this.sex
        }
        if (this.date_start !== this.contact_detail.date_start) {
          obj_update.date_start = this.date_start
        }
        if (this.address.trim().length) {
          if (this.address.trim() !== address) {
            addres_update.address = this.address
          }
        } else {
          return null
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
        const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
        const district = this.districts.find(d => d.viettel_id === this.districtModel)
        const wardModel = this.wards.find(d => d.viettel_id === this.wardModel)
        return {
          fullname: this.fullname.trim(),
          phone: this.fullname.trim(),
          email: this.email.trim(),
          sex: this.sex,
          shop_id: this.shopId,
          province,
          district,
          wardModel,
          address: this.address.trim(),
          date_start: this.date_start,
          passport: this.passport.trim(),
          position: this.position
        }
      }
      if (Object.keys(obj_update).length) {
        obj_update.id = this.contact_detail.id
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
    requestDetailContact() {
      this.loadingTable = true
      supplierResource.get_person_contact(this.shopId).then(response => {
        const { error, data } = response
        console.log('............. chi tiet nha cung cap : ', JSON.stringify(response))
        this.loadingTable = false
        if (error === 0) {
          this.contact_detail = data
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
  background-color: #ffffff;
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
  .el-col-24 {
    // width: 100%;
  }
  .mb-10 {
    margin-left: 2em;
  }
  .div-wrap-info {
  margin: 10px 15px;
}
</style>
