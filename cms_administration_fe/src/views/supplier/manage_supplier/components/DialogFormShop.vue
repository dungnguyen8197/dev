<template>
  <el-dialog
    v-loading="loadingDetail"
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="90%"
  >
    <el-form ref="ruleForm" :model="postForm" :rules="rules" class="demo-ruleForm">
      <el-row>
        <el-col :sm="18" class="pr-lg-5">
          <el-form-item :label="('Tên Shop')" prop="name">
            <el-input v-model="postForm.name" :placeholder="('Nhập tên shop')" />
          </el-form-item>
          <el-form-item :label="('Số điện thoại')" prop="phone">
            <el-input v-model="postForm.phone" :placeholder="('Nhập số điện thoại')" />
          </el-form-item>
          <el-row>
            <el-col :sm="8" class="pr-lg-5">
              <el-form-item :label="('Thành phố')" :required="true">
                <el-select
                  v-model="provinceModel"
                  class="w-100"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="('Tìm kiếm thành phố')"
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
              </el-form-item>
            </el-col>
            <el-col :sm="8" class="pr-lg-5">
              <el-form-item :label="('Tìm kiếm Quận/Huyện')" :required="true">
                <el-select
                  v-model="districtModel"
                  class="w-100"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="onSearchDistrict"
                  :placeholder="('Chọn Quận/Huyện')"
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
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item :label="('Tìm kiếm phường/xã')" :required="true">
                <el-select
                  v-model="wardsModel"
                  class="w-100"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="onWardsSearch"
                  :placeholder="('Chọn Phường/Xã')"
                  :loading="wards_loading"
                  @focus="wardsFocus"
                >
                  <el-option
                    v-for="ward in wards_search"
                    :key="ward.viettel_id"
                    :label="ward.viettel_name"
                    :value="ward.viettel_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="('Địa chỉ')" prop="address">
            <el-input v-model="postForm.address" :placeholder="('Ghi dõ số hẻm, số nhà, tên đường')" />
          </el-form-item>
          <el-row>
            <el-col :sm="8" class="pr-lg-5">
              <el-form-item class="date" :label="('Ngày kích hoạt')" prop="date_active">
                <el-date-picker
                  v-model="postForm.date_active"
                  type="datetime"
                  :placeholder="('Ngày kích hoạt')"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="8" class="pr-lg-5">
              <el-form-item class="date" :label="('Ngày hết hạn')" prop="date_finish">
                <el-date-picker
                  v-model="postForm.date_finish"
                  type="datetime"
                  :placeholder="('Ngày hết hạn')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="('status')">
            <el-switch
              v-model="activeShop"
              :active-text="activeTitle"
            />
          </el-form-item>
          <el-form-item :label="('Hiển thị lên màn hình home shop')">
            <el-switch
              v-model="activeLogo"
              :active-text="activeName"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item :label="('LOGO')" prop="logo">
            <div class="clearfix" />
            <upload-image v-model="postForm.logo" :url-current="postForm.logo" @onSetUrlImage="handleSetUrlImage" />
          </el-form-item>
          <el-form-item :label="('Logo menu')" prop="logo_menu">
            <div class="clearfix" />
            <upload-image v-model="postForm.logo_menu" :url-current="postForm.logo_menu" @onSetUrlImage="handleSetUrlLogo" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ ('Cancel') }}</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{ dialog.buttonName }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import ShopResource from '@/api/shop/shop'
import { setRules } from '@/utils/shop/validateShop'
// import { removeVietnameseTones } from '@/utils/shop/convertToString'
// import { convertDataSelect, convertDataDistrict, convertWards } from '@/utils/shop/convertShop'
import UploadImage from '@/components/UploadImage'
const shopResource = new ShopResource()

export default {
  name: 'DialogFormShop',
  components: { UploadImage },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
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
    // provinceData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      dialog: { titleName: ('Thêm mới shop'), buttonName: ('Thêm') },
      loadingDetail: false,
      loadingSubmit: false,
      loadingTable: false,
      rules: setRules(),
      activeShop: false,
      activeLogo: false,
      activeTitle: ('stop'),
      activeName: ('no'),
      provinces: [],
      provinceModel: null,
      districts: [],
      districtModel: {},
      wards: [],
      wardsModel: {},
      postForm: {},
      objectShopOrigin: {},
      // date_active: '',
      // date_finish: '',
      districts_search: [],
      district_loading: true,
      provinces_search: [],
      provice_loading: true,
      wards_search: [],
      wards_loading: true,
      province_id_old: null,
      district_id_old: null,
      pauseWatcher: false
    }
  },
  watch: {
    objectData(object) {
      if (Object.keys(object).length > 0) {
        this.activeShop = (object.active === 1)
        this.activeLogo = (object.active_show_menu === 1)
        this.onGetShopDetail(object.id)
      } else {
        this.loadingDetail = false
      }
    },
    activeShop(value) {
      this.activeTitle = value ? ('Hoạt động') : ('Tạm dừng')
      this.postForm.active = value ? 1 : 0
    },
    activeLogo(value) {
      this.activeName = value ? ('yes') : ('no')
      this.postForm.active_show_menu = value ? 1 : 0
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: ('Tạo mới shop'), buttonName: ('Thêm') })
        this.postForm = {}
        this.objectShopOrigin = {}
      } else {
        this.dialog = Object.assign({}, { titleName: ('Cập nhật thông tin shop'), buttonName: ('Cập nhật') })
      }
    },
    showDialog(show) {
      if (show && !this.provinces.length) {
        this.onGetProvinceList()
      }
    },
    provinceModel(province_id) {
      if (!this.pauseWatcher) {
        if (this.province_id_old !== province_id) {
          this.resetDistrict()
          this.resetWards()
          this.province_id_old = province_id
        }
        if (province_id) {
          this.onGetDistrict(province_id)
        }
      }
    },
    districtModel(district_id) {
      if (!this.pauseWatcher) {
        if (!district_id) return
        if (this.district_id_old !== district_id) {
          this.resetWards()
          this.district_id_old = district_id
        }
        if (district_id) {
          this.onGetWards(district_id)
        }
      }
    }
  },
  methods: {
    resetDistrict() {
      this.districtModel = null
      this.districts = []
    },
    resetWards() {
      this.wardsModel = null
      this.wards = []
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (!this.provinceModel) {
            return this.$message.warning(('Tìm kiếm thành phố'))
          }
          if (!this.districtModel) {
            return this.$message.warning(('Tìm kiếm Quận/Huyện'))
          }
          if (!this.wardsModel) {
            return this.$message.warning(('Tìm kiếm Phường/Xã'))
          }
          // if (this.postForm.logo === '' || this.postForm.logo === undefined) {
          //   this.$message.warning('Vui lòng đăng tải ảnh đại diện Shop.')
          //   return
          // }
          // if (!this.postForm.logo_menu || this.postForm.logo_menu === '' || this.postForm.logo_menu === undefined) {
          //   if (this.postForm.active_show_menu === 1) {
          //     this.$message.warning('Vui lòng đăng tải ảnh.')
          //     return
          //   }
          // }
          this.handleSetInfoAddress()
          if (this.isAdd) {
            this.handleCreateShop()
          } else {
            this.handleUpdateShop()
          }
        }
      })
    },
    provicesFocus() {
      console.log('..........focus vao day: ')
      // if (!this.provinces.length) {
      this.onGetProvinceList()
      // }
    },
    districtFocus() {
      if (!this.districts.length) {
        this.onGetDistrict(this.provinceModel)
      }
    },
    wardsFocus() {

    },
    handleCreateShop() {
      this.loadingSubmit = true
      console.log('.............handleCreateShop from : ', JSON.stringify(this.postForm))
      this.postForm.active = this.activeShop ? 1 : 0
      shopResource.storeShop(this.postForm).then(response => {
        this.loadingSubmit = false
        if (response.error === 0) {
          this.$message.success(response.msg)
          this.$emit('onClickDialogShop', { dialog: false, reload: true })
          this.handleClearDataDialog()
        } else {
          this.$message.error(response.msg)
        }
      }).catch(error => {
        this.loadingSubmit = false
        console.log('.....................loi, ', error)
      })
    },
    getBodyUpdate() {
      const keys = Object.keys(this.postForm)
      const body = {}
      if (this.postForm.date_active) {
        this.postForm.date_active = new Date(this.postForm.date_active).getTime()
      }
      if (this.postForm.date_finish) {
        this.postForm.date_finish = new Date(this.postForm.date_finish).getTime()
      }
      for (const key of keys) {
        const form_obj = this.postForm[key]
        if (form_obj === null || form_obj === undefined) continue
        console.log('................ form obj ', key, form_obj, typeof form_obj, this.objectShopOrigin[key])
        if (typeof form_obj !== 'object') {
          if (this.objectShopOrigin[key] !== null && this.objectShopOrigin[key] !== undefined) {
            if (this.postForm[key] !== this.objectShopOrigin[key]) {
              body[key] = this.postForm[key]
            }
          } else {
            body[key] = this.postForm[key]
          }
        } else {
          const obj_temp = {}
          const keys_child = Object.keys(form_obj)
          const child_origin = this.objectShopOrigin[key]
          for (const _key of keys_child) {
            if (form_obj[_key] !== child_origin[_key]) {
              obj_temp[key] = form_obj[key]
            }
          }
          if (Object.keys(obj_temp).length) {
            body[key] = obj_temp
          }
        }
      }
      // console.log('-----------------------------------------objectShopOrigin', JSON.stringify(this.objectShopOrigin))
      body.id = this.postForm.id
      body.shop_address_id = this.objectShopOrigin.shop_address_id
      // body.logo_menu = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' // fake sau bo di
      console.log('............body update : ', JSON.stringify(body))
      return body
    },
    handleUpdateShop() {
      const body = this.getBodyUpdate()
      this.loadingSubmit = true
      console.log('.............update from : ', JSON.stringify(body))
      shopResource.updateShop(body).then(response => {
        console.log('==================================update', JSON.stringify(response))
        this.loadingSubmit = false
        if (response.error === 0) {
          this.$message.success(response.msg)
          this.$emit('onClickDialogShop', { dialog: false, reload: true })
          this.handleClearDataDialog()
        } else {
          this.$message.error(response.msg)
        }
      }).catch(error => {
        this.loadingSubmit = false
        console.log('.....................loi, ', error)
      })
    },
    handleSetInfoAddress() {
      const province = this.provinces.find(d => d.viettel_id === this.provinceModel)
      const district = this.districts.find(d => d.viettel_id === this.districtModel)
      const wards = this.wards.find(d => d.viettel_id === this.wardsModel)
      if (!province) {
        return this.$msgbox(('Bạn chưa chọn tỉnh/thành phố!'))
      }
      if (!district) {
        return this.$msgbox(('Bạn chưa chọn quận/huyện!'))
      }
      if (!wards) {
        return this.$msgbox(('Bạn chưa chọn xã/phường'))
      }
      this.postForm.province_id = this.provinceModel
      this.postForm.province_name = province.viettel_name
      this.postForm.province_code = province.viettel_code
      this.postForm.district_id = this.districtModel
      this.postForm.district_name = district.viettel_name
      this.postForm.district_code = district.viettel_value
      this.postForm.wards_id = this.wardsModel
      this.district_id_old = wards.viettel_id
      this.postForm.wards_name = wards.viettel_name
    },
    handleSetUrlLogo(object) {
      if (Object.keys(object).length > 0) {
        this.postForm.logo_menu = object.name
      }
    },
    handleSetUrlImage(object) {
      if (Object.keys(object).length > 0) {
        this.postForm.logo = object.name
      }
    },
    onGetShopDetail(id) {
      this.loadingDetail = true
      shopResource.shopDetail(id).then(async response => {
        console.log('---------------------------------------------------detail shop', JSON.stringify(response))
        this.loadingDetail = false
        const { error, info } = response
        if (error === 0) {
          // const golferAddress = result.golfer_address
          this.postForm = Object.assign({}, info)
          this.objectShopOrigin = Object.assign({}, info)
          const { golfer_address } = info
          if (golfer_address) {
            const { province, district, wards } = golfer_address
            this.provinceModel = province.viettel_id
            this.province_id_old = province.viettel_id
            this.provinces_search = [province]
            this.provinces = !this.provinces.length ? [province] : this.provinces
            this.districtModel = district.viettel_id
            this.districts_search = [district]
            this.districts = [district]
            this.district_id_old = district.viettel_id
            this.wardsModel = wards.viettel_id
            this.wards_search = [wards]
            this.wards = [wards]
            this.postForm.address = golfer_address.address
          }
          this.activeShop = (info.active === 1)
          this.activeLogo = (info.active_show_menu === 1)
        }
      })
    },
    onSearchProvince(keyword) {
      console.log('.........tim kiem', keyword)
      if (keyword !== '') {
        this.provinces_search = this.provinces.filter(item => {
          // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          // console.log('............. tim tu', _string)
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.provinces_search.length) {
          this.provice_loading = false
        }
        console.log('........... tim kiem dia chi: ', this.provinces_search.length)
      }
    },
    onSearchDistrict(keyword) {
      if (keyword !== '') {
        this.districts_search = this.districts.filter(item => {
          // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          // console.log('............. tim tu', _string)
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.districts_search.length) {
          this.district_loading = false
        }
        console.log('........... tim kiem dia chi: ', this.districts_search.length)
      }
    },
    onGetProvinceList() {
      console.log('.............vao day nay')
      shopResource.getProvinceList().then(response => {
        const { error, data } = response
        if (error === 0) {
          console.log('........... list data provices ', JSON.stringify(data))
          this.provinces = [...data]
          this.provinces_search = [...data]
          this.provice_loading = false
        }
      })
    },
    onGetDistrict(viettel_province_id) {
      const params = { viettel_province_id }
      shopResource.getDistrictList(params).then(response => {
        const { error, data } = response
        console.log('........ list district ', JSON.stringify(response))
        if (error === 0) {
          this.districts = [...data]
          this.districts_search = [...data]
          this.district_loading = false
        }
      }).catch(er => {
        this.loadingTable = false
      })
    },
    onWardsSearch(keyword) {
      if (keyword !== '') {
        this.wards_search = this.wards.filter(item => {
          // const string = removeVietnameseTones(item.label.toLowerCase())
          const _string = item.viettel_name.toLowerCase()
          // console.log('............. tim tu', _string)
          return _string.indexOf(keyword.toLowerCase()) > -1
        })
        if (this.wards_search.length) {
          this.wards_loading = false
        }
        console.log('........... tim kiem dia chi: ', this.wards_search.length)
      }
    },
    onGetWards(viettel_district_id) {
      const params = { viettel_district_id }
      shopResource.getWardsList(params).then(response => {
        const { error, data } = response
        console.log('............. list wards: ', JSON.stringify(response))
        if (error === 0) {
          this.wards = [...data]
          this.wards_search = [...data]
          this.wards_loading = false
        }
      }).catch(er => {
        this.loadingTable = false
      })
    },
    handleClose() {
      this.$emit('onClickDialogShop', { dialog: false, reload: false })
      this.handleClearDataDialog()
    },
    handleClearDataDialog() {
      this.provinceModel = null
      this.provinces = []
      this.provinces_search = []
      this.wardsModel = null
      this.wards = []
      this.wards_search = []
      this.districtModel = null
      this.districts = []
      this.districts_search = []
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-form-item__label{
    float: unset;
  }
  .pr-lg-5 {
    padding-right: 20px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>
