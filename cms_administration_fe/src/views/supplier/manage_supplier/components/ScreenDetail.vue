<template>
  <div class="template">

    <el-row class="app-container list-shop" :loading="loadingTable">
      <el-row class="list-shop__header">
        <el-col :sm="12">
          <el-row style="display: ruby;">
            <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
            <h3 style="font-size: 26px; display: inherit;">{{ ('Thông tin nhà cung cấp') }}</h3>
          </el-row>
        </el-col>
        <el-col :sm="12" style="justify-content: flex-end; display: flex; align-items: center;">
          <!-- <div class="text-right"> -->
          <el-button v-if="is_write && !isNew" type="primary" @click="onStatisticalPress">{{ ('supplier_statistical') }}</el-button>
        <!-- </div> -->
        </el-col>
      </el-row>
      <supplier-info-vue ref="refSupplierInfo" stt="I" :shop-id="shopId" :is-new="isNew" />
      <contract-info v-if="!isNew" ref="refContractInfo" stt="II" :shop-id="shopId" :is-new="isNew" />
      <person-representative ref="refRepresnetative" :show="show" :list-provinces="provinces" :shop-id="shopId" :is-new="isNew" />
      <person-contact-vue ref="refContact" :show="show" :list-provinces="provinces" :shop-id="shopId" :is-new="isNew" />
      <pickup-address ref="refPickup" :data="shopDetail.pickup_address" :show="show" :list-provinces="provinces" :shop-id="shopId" :is-new="isNew" />
      <el-row class="list-shop__data">
      <!--    <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" :province-data="provinces" @onClickDialogShop="handleClickDialogShop" />-->
      <!-- <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" @onClickDialogShop="handleClickDialogShop" /> -->
      <!-- <detail-shop :dialog-visible="showDialogShopDetail" :url="url_image" @onClickButtonDialogDetail="handleClickButtonDialogDetail" /> -->
      <!-- <detail :dialog-visible="showDialogDetail" :shop-id="shopID" @onClickButtonDialogDetail="handClickButtonDetail" /> -->
      </el-row>
      <el-row v-if="isNew" class="list-shop__header">
        <el-col :sm="24" style="justify-content: flex-end; display: flex; align-items: center;">
          <!-- <div class="text-right"> -->
          <el-button type="warning" @click="onCancelPress">{{ ('Hủy bỏ ') }}</el-button>
          <el-button type="primary" @click="onConfirmPress">{{ ('Xác Nhận') }}</el-button>
        <!-- </div> -->
        </el-col>
      </el-row>
    </el-row>
  </div>

</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
// import PersonContact from '@/views/shop/components/PersonContact.vue'
// import DialogFormShop from '@/views/shop/components/DialogFormShop'
// import DetailShop from '@/views/shop/components/DetailShop'
// import Detail from '@/views/products/components/Detail'
// import Detail from '@/views/shop/components/Detail'
import { getAcountInfo } from '@/utils/auth'
import PersonContactVue from './PersonContact.vue'
import PickupAddress from './PickupAddress.vue'
import PersonRepresentative from './PersonRepresentative.vue'
import ContractInfo from './ContractInfo.vue'
import SupplierInfoVue from './SupplierInfo.vue'
// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()

export default {
  name: 'ScreenDetail',
  components: { PersonContactVue, PickupAddress, PersonRepresentative, ContractInfo, SupplierInfoVue },
  props: {
    show: {
      type: Boolean,
      default: false
    }
    // shopId: {
    //   type: Number,
    //   default() { return 0 }
    // },
    // isNew: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    const account = getAcountInfo()
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      data: [],
      loadingTable: false,
      objectShop: {},
      isAdd: true,
      onShowDialog: false,
      provinces: [],
      url_image: '',
      contain: 'contain',
      showDialogShopDetail: false,
      showDialogDetail: false,
      shopDetail: {},
      isNew: false,
      shopId: 0
    }
  },
  // watch: {
  //   show(val) {
  //     if (val && !this.isNew) {
  //       this.getRequestDetail()
  //       if (!this.provinces.length) {
  //         this.requestListProvinces()
  //       }
  //     }
  //   }
  // },
  created() {
    // console.log(this.$route.query.test) // outputs 'yay'
    const { query } = this.$route
    if (query && query.shop_id) {
      this.shopId = parseInt(query.shop_id)
      this.getRequestDetail()
      if (!this.provinces.length) {
        this.requestListProvinces()
      }
    } else {
      this.isNew = true
    }
    // this.onGetListShop()
    // this.onGetProvinceList()
  },
  methods: {
    onStatisticalPress() {
      this.$router.push({ path: `/detail_statistical?shop_id=${this.shopId}` })
    },
    onBack(reload = false) {
      if (this.$refs.refSupplierInfo) {
        this.$refs.refSupplierInfo.resetData()
      }
      if (this.$refs.refPickup) {
        this.$refs.refPickup.resetData()
      }
      if (this.$refs.refContact) {
        this.$refs.refContact.resetData()
      }
      if (this.$refs.refRepresnetative) {
        this.$refs.refRepresnetative.resetData()
      }
      // this.$emit('onBackHandler', { dialog: false, reload: reload })
      this.$router.back()
    },
    checkPhoneNumber(phone) {
      const reg = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})\b/
      return reg.test(phone)
    },
    onConfirmPress() {
      const obj_create = {

      }
      if (this.$refs.refSupplierInfo) {
        const supplier_info = this.$refs.refSupplierInfo.getInfo()
        if (!supplier_info) {
          return this.$msgbox('Bạn phải nhập đầy đủ thông tin nhà cung cấp')
        }
        if (!this.checkPhoneNumber(supplier_info.phone)) {
          return this.$msgbox('Số điện thoại không hợp lệ')
        }
        obj_create.supplier_info = supplier_info
      }
      if (this.$refs.refPickup) {
        const pickup_info = this.$refs.refPickup.getPickupInfo()
        if (pickup_info) {
          obj_create.pickup_info = pickup_info
        }
      }
      if (this.$refs.refContact) {
        const contact_info = this.$refs.refContact.getContactInfo()
        if (contact_info) {
          obj_create.contact_info = contact_info
        }
      }
      if (this.$refs.refRepresnetative) {
        const representative_info = this.$refs.refRepresnetative.getPersonInfo()
        if (representative_info) {
          obj_create.representative_info = representative_info
        }
      }
      if (Object.keys(obj_create).length) {
        this.$confirm('Bạn có chắc muốn tạo mới nhà cung cấp này?').then(_ => {
          supplierResource.create_general_supplier(obj_create).then(res => {
            const { error, msg } = res
            console.log('........... tao moi nha cung cap ', JSON.stringify(res))
            if (error === 0) {
              this.$msgbox(msg).then(_ => {
                this.onBack(true)
              })
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
      }
    },
    onCancelPress() {
      this.onBack()
    },
    requestListProvinces() {
      this.loadingTable = true
      console.log('.........list tinh/thanh pho')
      supplierResource.getProvinceList().then(res => {
        // console.log('......... list provinces: ', JSON.stringify(res))
        this.loadingTable = false
        const { error, data } = res
        if (error === 0) {
          this.provinces = data
        }
      }).catch(err => {
        console.log('............ list tinh thanh: ', err)
        this.loadingTable = false
      })
    },
    getRequestDetail() {
      if (!this.shopId) return
      this.loadingTable = true
      supplierResource.detail(this.shopId).then(response => {
        const { error, info } = response
        console.log('............. chi tiet nha cung cap : ', JSON.stringify(response))
        this.loadingTable = false
        if (error === 0) {
          this.shopDetail = info
          if (this.$refs.refSupplierInfo) {
            this.$refs.refSupplierInfo.setInfo(info)
          }
          if (this.$refs.refPickup) {
            this.$refs.refPickup.setData(info.pickup_address)
          }
          if (this.$refs.refContact) {
            this.$refs.refContact.requestDetailContact()
          }
          if (this.$refs.refRepresnetative) {
            this.$refs.refRepresnetative.setId(info.representative_person_id)
          }
          if (this.$refs.refContractInfo) {
            this.$refs.refContractInfo.requestListContractActive()
          }
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
    onShowDialogCreate() {
      this.isAdd = true
      this.onShowDialog = true
      this.objectShop = {}
    },
    onResetSearch() {
      // this.onGetListShop()
    }
  }
}
</script>

    <style lang="scss" scoped>
    .template{
      background-color: #F7F8F9;
    }
    .search-wrapper{
      margin-bottom: 10px;
      padding-left: 20px;
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
    </style>
