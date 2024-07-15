<template>
  <div class="id">
    <el-row class="search-wrapper">
      <el-row :sm="12">
        <!-- <h3>VI. {{ ('person_contact') }}</h3> -->
        <el-row :sm="24" style="display: flex; justify-content: space-between;">
          <el-col :sm="12" style="justify-content: flex-start; display: flex; align-items: center;">
            <h5>{{ stt }}. {{ ('Thông tin liên hệ lấy hàng (Dùng cho đơn vị vận chuyển)') }}</h5>
          </el-col>
          <el-col :sm="12" style="padding-right: 20px;justify-content: flex-end;margin-top:25px; display: flex; align-items: center;">
            <el-button v-if="!isNew" type="primary" style=" font-size: 16px;font-weight: 400; " @click="onCreatePress">{{ ('Thêm mới') }}</el-button>
            <el-button v-if="!isNew && is_load_data" type="primary" style="margin-left: 10px; font-size: 16px;font-weight: 400; " @click="onEditPress">{{ ('Chỉnh sửa') }}</el-button>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="display: flex; justify-content: right;">
        <el-col :sm="24">
          <div style="display: flex; justify-content: right; flex-wrap: wrap;">

            <div class="div-wrap-info">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Họ và tên') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="name" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập họ tên')" />
              </el-row>
            </div>
            <div class="div-wrap-info">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Số điện thoại') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-input v-model="phone" :disabled="disable" style="margin-top: 10px;" :placeholder="('Nhập số điện thoại')" />
              </el-row>
            </div>
            <!-- <el-col class="mb-10">
            <el-row class="row-item-2">
              <label class="item-label">{{ ('detail_address') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
              <el-input v-model="address" :disabled="disable" style="margin-top: 10px;" :placeholder="('detail_address')" />
            </el-row>
            </el-col> -->
            <div class="div-wrap-info">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('Tỉnh/thành phố') }}<span v-if="isUpdate || isCreate" style="color: red;">*</span></label>
                <el-select
                  v-model="provinceModel"
                  class="select-item-2"
                  filterable
                  remote
                  :disabled="disable"
                  reserve-keyword
                  :placeholder="('Chọn Tỉnh/thành phố')"
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
                  :placeholder="('Nhập Quận/huyện')"
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
            <!-- <el-col class="mb-10">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('email_contact') }}</label>
                <el-input v-model="email" :disabled="disable" style="margin-top: 10px;" :placeholder="('email_input')" />
              </el-row>
            </el-col>
            <el-col class="mb-10">
              <el-row class="row-item-2">
                <label class="item-label">{{ ('position_') }}</label>
                <el-input v-model="position" style="margin-top: 10px;" :disabled="disable" :placeholder="('position_input')" />
              </el-row>
            </el-col> -->
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
  name: 'PickupAddress',
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
    data: {
      type: Object,
      default() { return null }
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
      pickup_detail: this.data,
      loadingTable: false,
      isCreate: false,
      isUpdate: false,
      onShowDialog: false,
      name: '',
      phone: '',
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
      stt: this.isNew ? 'IV' : 'V',
      is_load_data: false
    }
  },
  watch: {
    show(val) {
      // if (val) {
      //   this.requestDetailContact()
      // }
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
    this.setInfo(this.pickup_detail)
  },
  methods: {
    setData(data) {
      console.log('............... abc xyz : ', JSON.stringify(data))
      this.pickup_detail = data
      this.setInfo(this.pickup_detail)
    },
    /**
    * Xác nhận cấp nhật/ tạo mới người liên hệ
    */
    onConfirmPress() {
      if (this.isCreate) {
        this.requestCreatePickupAddress()
      } else if (this.isUpdate) {
        this.requestUpdateContact()
      }
    },
    requestUpdateContact() {
      const body = this.checkBodyUpdate()
      if (!body) return this.$msgbox(('Các trường có dấu (*) không được để trống'))
      if (Object.keys(body).length) {
        this.$confirm(('Bạn có chắc muốn cập nhật thông tin người liên hệ này không?')).then(_ => {
          supplierResource.update_pickup_address(body).then(res => {
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
    requestCreatePickupAddress() {
      this.$confirm(('Bạn có chắc muốn tạo địa chỉ này là địa chỉ lấy hàng không?')).then(_ => {
        const body = this.getPickupInfo()
        if (!body) {
          return this.$msgbox(('Có lỗi xảy ra, vui lòng quay lại sau!'))
        }
        body.shop_id = this.shopId
        supplierResource.create_pickup_address(body).then(res => {
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
      this.setInfo(this.pickup_detail)
    },
    resetData() {
      this.isCreate = false
      this.isUpdate = false
      this.name = ''
      this.phone = ''
      this.address = ''
      // provinces: [],
      this.provinceModel = ''
      this.districtModel = ''
      this.wardModel = ''
    },
    resetAllInfo() {
      if (this.isCreate) {
        this.name = ''
        this.phone = ''
        this.address = ''
        // provinces: [],
        this.provinceModel = ''
        this.districtModel = ''
        this.wardModel = ''
      } else if (this.isUpdate) {
        this.setInfo(this.pickup_detail)
      }
    },
    setInfo(data) {
      if (!data) {
        this.is_load_data = false
        return
      }
      this.is_load_data = true
      const { address, district, township, city, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = data
      this.name = data.name
      this.phone = data.phone
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
    getPickupInfo() {
      if (!this.name.length || !this.phone.length || !this.provinceModel || !this.districtModel || !this.wardModel || !this.address.trim().length) {
        return null
      }
      return {
        name: this.name,
        phone: this.phone,
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
    //   const { address_info } = this.contact_detail
      const obj_update = {}
      //   const addres_update = {}
      const { name, phone, address, city_viettel_post_id, district_viettel_post_id, township_viettel_post_id } = this.pickup_detail
      if (this.name.trim().length) {
        if (this.name.trim() !== name) {
          obj_update.name = this.name.trim()
        }
      } else {
        return null
      }
      if (this.phone.trim().length) {
        if (this.phone.trim() !== phone) {
          obj_update.phone = this.phone.trim()
        }
      } else {
        return null
      }
      if (this.address.trim().length) {
        if (this.address.trim() !== address) {
          obj_update.address = this.address
        }
      } else {
        return null
      }
      if (this.provinceModel !== city_viettel_post_id) {
        const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
        if (province) {
          obj_update.city = province.viettel_name
          obj_update.city_viettel_post_code = province.viettel_code
          obj_update.city_viettel_post_id = province.viettel_id
        } else {
          return null
        }
      }
      if (this.districtModel !== district_viettel_post_id) {
        const district = this.districts.find(d => d.viettel_id === this.districtModel)
        if (district) {
          obj_update.district = district.viettel_name
          obj_update.district_viettel_post_code = district.viettel_code
          obj_update.district_viettel_post_id = district.viettel_id
        }
      }
      if (this.wardModel !== township_viettel_post_id) {
        const wardModel = this.wards.find(d => d.viettel_id === this.wardModel)
        if (wardModel) {
          obj_update.township = wardModel.viettel_name
          obj_update.township_viettel_post_id = wardModel.viettel_id
        }
      }
      if (Object.keys(obj_update).length) {
        obj_update.id = this.pickup_detail.id
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
          this.pickup_detail = data
          this.setInfo(data)
        }
      }).catch(err => {
        console.log('.................. co loi ', err)
        this.loadingTable = false
      })
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogShopDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
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
