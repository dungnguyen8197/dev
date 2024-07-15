<template>
  <el-dialog :title="('detail_shop')" :visible.sync="dialogVisible" :before-close="handleCloseDialog" width="99%">
    <el-row v-loading="loadingData" class="shop-detail-header">
      <el-card class="box-card left mb-10" shadow="hover">
        <el-row>
          <el-col class="mb-10">
            <label>{{ ('id') }}:</label> <template>#{{ shopDetail ? shopDetail.id: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Tên NCC') }}:</label> <template>{{ shopDetail ? shopDetail.name: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Địa chỉ') }}:</label> <template>{{ shopDetail ? shopDetail.address_full: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Số điện thoại') }}:</label> <template>{{ shopDetail ? shopDetail.phone: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Ngày tạo') }}:</label> <template>{{ shopDetail ? shopDetail.createdAt: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Ngày cập nhật') }}:</label> <template>{{ shopDetail ? shopDetail.updatedAt: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Ngày hiển thị ra màn hình') }}:</label> <template>{{ shopDetail ? shopDetail.date_active: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Ngày kết thúc') }}:</label> <template>{{ shopDetail ? shopDetail.date_finish: '' }}</template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Trạng thái ẩn / hiện') }}: </label>
            <template><el-tag :type="(shopDetail.active_show_menu === 1) ? 'success' : 'danger'">{{ (shopDetail.active_show_menu === 1) ? ('yes') : ('no') }}</el-tag></template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('Trạng thái') }}: </label>
            <template>
              <el-tag :type="(shopDetail.active === 1) ? 'success' : 'danger'">{{ (shopDetail.active === 1) ? ('Hoạt động') : ('tạm dừng') }}</el-tag>
            </template>
          </el-col>
          <el-col class="mb-10">
            <label>{{ ('manage_shop') }}:</label> <template>{{ shopDetail ? shopDetail.account_name: '' }}</template>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card right mb-10" shadow="hover">
        <el-col class="mb-10 image-ava">
          <label class="ava">{{ ('Logo') }}:</label> <el-image style="height: 200px; width: 200px" :src="shopDetail.logo" fit="contain" />
        </el-col>
        <el-col class="mb-10 image-ava">
          <label class="ava">{{ ('Logo Menu') }}:</label> <el-image style="height: 200px; width: 200px" :src="shopDetail.logo_menu" fit="contain" />
        </el-col>
      </el-card>
    </el-row>
  </el-dialog>
</template>
<script>

import ShopResource from '@/api/shop/shop'
// import I18n from '../../../lang/i18n'
const shopResource = new ShopResource()

export default {
  name: 'Detail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: Number,
      default() { return 0 }
    }
  },
  data() {
    return {
      loadingData: false,
      shopDetail: {},
      contain: 'contain'
      // shop: []
    }
  },
  watch: {
    shopId(id) {
      if (id > 0) {
        this.getDetailShop(id)
      }
    }
  },
  methods: {
    getDetailShop(id) {
      this.loadingData = true
      shopResource.detailShop(id).then(response => {
        console.log(response)
        this.loadingData = false
        if (response.error === 0) {
          const result = response.data
          this.shopDetail = Object.assign({}, result)
          console.log('.....................shop detail: ', JSON.stringify(result))
          // this.shop = [...result.shop]
        }
      }).catch(error => {
        this.loadingData = false
        this.$message.error(`${('Có lỗi')}, ${error}`)
      })
    },
    handleCloseDialog() {
      this.$emit('onClickButtonDialogDetail', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>
.shop-detail-header{
  display: flex;
  justify-content: space-between;
}
.mb-10{
  margin: 10px;
}
.ava{
  width: 100%;
  display: block;
  padding-bottom: 10px;
}
</style>
