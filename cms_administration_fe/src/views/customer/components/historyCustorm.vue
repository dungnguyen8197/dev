<template>
  <el-dialog class="detail-custom" title="Chi tiết khách hàng" :visible.sync="showDialog" :before-close="handleClose" width="30%">
    <el-row v-loading="loading">
      <el-col>
        <p class="item-custom">
          <span class="title bold">mã khách hàng: </span>
          <span class="title">VID{{ detail.user_id }}</span>
        </p>
        <p class="item-custom">
          <span class="title bold">Ngày tạo: </span>
          <span class="title">{{ detail.created_at }}</span>
        </p>
        <p class="item-custom">
          <span class="title bold">Ngày đề xuất: </span>
          <span class="title">{{ detail.start_date }}</span>
        </p>
        <p class="item-custom">
          <span class="title bold">Ngày hết hạn: </span>
          <!--          <span class="title">{{ moment(detail.end_date).format("HH:SS DD-MM-YYYY") }}</span>-->
          <span class="title">{{ detail.end_date }}</span>
        </p>
        <p class="item-custom">
          <span class="title bold">Người đề xuất: </span>
          <span class="title">VID{{ detail.user_id_request }}</span>
        </p>
        <p class="item-custom">
          <span class="title bold">Người phê duyệt: </span>
          <span class="title">VID{{ detail.user_id_approve }}</span>
        </p>
        <p class="item-custom">
          <span class="title bold">Trạng thái duyệt: </span>
          <el-tag :type="(detail.is_approve === 1) ? 'success' : 'danger'">{{ (detail.is_approve === 1) ? 'Đã duyệt' : 'Chưa duyệt' }}</el-tag>
        </p>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import CustomResource from '@/api/custorm'
// import moment from 'moment'
const customResource = new CustomResource()
export default {
  name: 'HistoryCustorm',
  props: {
    objectHistory: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detail: {},
      loading: false
    }
  },
  // computed: {
  //   moment() {
  //     return moment
  //   }
  // },
  watch: {
    objectHistory(val) {
      if (val) {
        this.detailCustom(val.id)
      }
    }
  },
  methods: {
    detailCustom(id) {
      this.loading = true
      customResource.customDetail(id).then(res => {
        this.loading = false
        const { error, info } = res
        if (error === 0) {
          this.detail = info
        }
      }).catch(_ => {
        this.loading = false
      })
    },
    handleClose() {
      this.$emit('onClickButtonHistory', { dialog: false, reload: false })
    }
  }
}
</script>

<style>
.detail-custom .title.bold, .detail-custom .el-dialog__title{
  font-weight: bolder;
}
</style>
