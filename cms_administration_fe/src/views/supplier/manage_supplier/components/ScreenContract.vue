<template>
  <div class="template">

    <el-row class="app-container list-shop" :loading="loadingTable">
      <el-row class="list-shop__header">
        <el-col :sm="12">
          <el-row style="display: ruby;">
            <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
            <h3 style="font-size: 26px; display: inherit;">{{ ('Thông tin hợp đồng') }}</h3>
            <span v-if="approve===1" style="color: green;">{{ `(${('Đã duyệt')})` }}</span>
            <span v-if="approve===2" style="color: red;">{{ `(${('Bị từ chối')})` }}</span>
          </el-row>
        </el-col>
        <el-col :sm="12" style="justify-content: flex-end; display: flex; align-items: center;">
          <el-button v-if="is_approve && is_load_data && approve < 2" type="warning" @click="onRejectPress">{{ ('Từ chối hợp đồng') }}</el-button>
          <el-button v-if="is_approve && approve === 0" type="primary" @click="onApprovePress">{{ ('Duyệt hợp đồng') }}</el-button>
        </el-col>
      </el-row>
      <contract-detail-info ref="refInfo" :shop-id="shopId" :is-new="isNew" />
      <contact-discount-info ref="refDiscount" :shop-id="shopId" :is-new="isNew" @discountHandler="discountHanlderEvent" />
      <contract-excerpts-info-vue ref="refExceprts" :shop-id="shopId" :is-new="isNew" />
      <el-row class="list-shop__data">
      <!--    <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" :province-data="provinces" @onClickDialogShop="handleClickDialogShop" />-->
      <!-- <dialog-form-shop :is-add="isAdd" :object-data="objectShop" :show-dialog="onShowDialog" @onClickDialogShop="handleClickDialogShop" /> -->
      <!-- <detail-shop :dialog-visible="showDialogShopDetail" :url="url_image" @onClickButtonDialogDetail="handleClickButtonDialogDetail" /> -->
      <!-- <detail :dialog-visible="showDialogDetail" :shop-id="shopID" @onClickButtonDialogDetail="handClickButtonDetail" /> -->
      </el-row>
      <el-row v-if="isNew" class="list-shop__header">
        <el-col :sm="24" style="justify-content: flex-end; display: flex; align-items: center;">
          <!-- <div class="text-right"> -->
          <el-button type="warning" @click="onCancelPress">{{ ('Hủy bỏ') }}</el-button>
          <el-button type="primary" @click="onConfirmPress">{{ ('Xác nhận') }}</el-button>
        <!-- </div> -->
        </el-col>
      </el-row>
    <!-- <dialog-create-discount-vue :show-dialog="onShowDialogCreateDiscount" /> -->
    </el-row>
  </div>
</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
// import DialogCreateDiscountVue from './contracts/DialogCreateDiscount.vue'
// import PersonContact from '@/views/shop/components/PersonContact.vue'
// import DialogFormShop from '@/views/shop/components/DialogFormShop'
// import DetailShop from '@/views/shop/components/DetailShop'
// import Detail from '@/views/products/components/Detail'
// import Detail from '@/views/shop/components/Detail'
import { getAcountInfo } from '@/utils/auth'
// import i18n from '@/lang/i18n'
// import PersonContactVue from './PersonContact.vue'
// import PickupAddress from './PickupAddress.vue'
// import PersonRepresentative from './PersonRepresentative.vue'
// import ContractInfo from './ContractInfo.vue'
// import SupplierInfoVue from './SupplierInfo.vue'
import ContractDetailInfo from './contracts/ContractDetailInfo.vue'
import ContactDiscountInfo from './contracts/ContactDiscountInfo.vue'
import ContractExcerptsInfoVue from './contracts/ContractExcerptsInfo.vue'

// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()

export default {
  name: 'ScreenContract',
  components: { ContractDetailInfo, ContactDiscountInfo, ContractExcerptsInfoVue },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    stt: {
      type: String,
      default: 'I'
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
    console.log('......... account ', JSON.stringify(account))
    return {
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      is_approve: account.is_approve,
      data: [],
      loadingTable: false,
      objectShop: {},
      isAdd: true,
      onShowDialog: false,
      // provinces: [],
      url_image: '',
      contain: 'contain',
      showDialogShopDetail: false,
      showDialogDetail: false,
      shopDetail: {},
      onShowDialogCreateDiscount: false,
      approve: -1,
      is_load_data: false
    }
  },
  // watch: {
  //   show(val) {
  //     if (val && !this.isNew) {
  //       this.getRequestDetail()
  //     }
  //   }
  // },
  created() {
    // this.onGetListShop()
    // this.onGetProvinceList()
    const query = this.$route.query
    if (query) {
      this.shopId = parseInt(query.shop_id) || 0
      this.is_create = parseInt(query.create) || 0
      this.isNew = this.is_create === 1
      this.id = parseInt(query.id) || 0
      if (this.id) {
        this.getRequestDetail()
      }
    }
  },
  methods: {
    onRejectPress() {
      this.requestReject()
    },
    onApprovePress() {
      this.requestApprove()
    },
    requestApprove() {
      this.$confirm(('Bạn có chắc muốn phê duyệt bản hợp đồng này ?')).then(_ => {
        supplierResource.approve_contract({ id: this.shopDetail.id }).then(res => {
          const { error, msg } = res
          console.log('........... tao moi nha cung cap ', JSON.stringify(res))
          if (error === 0) {
            this.$msgbox(msg).then(_ => {
              this.shopDetail.approve = 1
              this.approve = 1
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
    },
    requestReject() {
      this.$confirm(('Bạn có chắc muốn từ chối hợp đồng này ?')).then(_ => {
        supplierResource.reject_contract({ id: this.shopDetail.id }).then(res => {
          const { error, msg } = res
          console.log('........... tao moi nha cung cap ', JSON.stringify(res))
          if (error === 0) {
            this.$msgbox(msg).then(_ => {
              this.shopDetail.approve = 2
              this.approve = 2
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
    },
    discountHanlderEvent(obj) {
      const { createDiscount } = obj
      if (createDiscount) {
        this.onShowDialogCreateDiscount = true
      }
    },
    onBack(reload = false) {
      // if (this.$refs.refSupplierInfo) {
      //   this.$refs.refSupplierInfo.resetData()
      // }
      // if (this.$refs.refPickup) {
      //   this.$refs.refPickup.resetData()
      // }
      // if (this.$refs.refContact) {
      //   this.$refs.refContact.resetData()
      // }
      // if (this.$refs.refRepresnetative) {
      //   this.$refs.refRepresnetative.resetData()
      // }
      //   this.$emit('onBackHandler', { dialog: false, reload: reload })
      // this.$router.back()
      window.history.back()
    },
    onConfirmPress() {
      const obj_create = {
      }
      if (this.$refs.refInfo) {
        const info = this.$refs.refInfo.getInfo()
        console.log('............ info tao hop dong', JSON.stringify(info))
        if (!info) {
          return this.$msgbox(('Các trường có dấu (*) không được để trống'))
        }
        let { error } = info
        error = parseInt(error) || 0
        if (error === 1) {
          return this.$msgbox(info.msg)
        }
        obj_create.info = info
      }
      if (this.$refs.refDiscount) {
        const discount = this.$refs.refDiscount.getInfo()
        if (discount) {
          obj_create.list_discount = discount
        }
      }
      if (this.$refs.refExceprts) {
        const list_exceprts = this.$refs.refExceprts.getInfo()
        console.log('.......... list trich luc: ', list_exceprts)
        if (list_exceprts) {
          obj_create.list_exceprts = list_exceprts
        }
      }
      console.log('...........tao hop dong body : ', JSON.stringify(obj_create))
      if (Object.keys(obj_create).length) {
        obj_create.shop_id = this.shopId
        this.$confirm(('Xác nhận tạo hợp đồng')).then(_ => {
          supplierResource.create_contract(obj_create).then(res => {
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
    getRequestDetail() {
      if (!this.shopId) {
        this.is_load_data = false
        return
      }
      this.loadingTable = true
      supplierResource.detail_contract(this.id).then(response => {
        const { error, data } = response
        console.log('............. chi tiet nha cung cap : ', JSON.stringify(response))
        this.loadingTable = false
        if (error === 0) {
          this.is_load_data = true
          this.shopDetail = data
          this.approve = data.approve
          const { discounts, exerpts } = data
          if (this.$refs.refInfo) {
            this.$refs.refInfo.setInfo(data)
            this.$refs.refInfo.setApprove(this.approve)
          }
          if (this.$refs.refDiscount) {
            this.$refs.refDiscount.setData(discounts, this.id)
            this.$refs.refDiscount.setApprove(this.approve)
          }
          if (this.$refs.refExceprts) {
            this.$refs.refExceprts.setData(exerpts, this.id)
            this.$refs.refExceprts.setApprove(this.approve)
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
    padding-right: 30px;
    padding-left: 30px;
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
