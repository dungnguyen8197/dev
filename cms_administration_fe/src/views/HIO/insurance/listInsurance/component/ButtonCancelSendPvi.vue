<template>
  <el-button size="small" title="Hủy hàng chờ gửi thông tin" type="danger" :loading="loadingSubmit" circle @click="onCancelSendPvi">
    <svg-icon v-if="!loadingSubmit" icon-class="booking-cancel" />
  </el-button>
</template>

<script>
import InsuranceApi from '@/api/HIO/insurance'
import { getAcountInfo } from '@/utils/auth'
const insuranceApi = new InsuranceApi()
export default {
  name: 'ButtonCancelSendPvi',
  props: {
    objectInsurance: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loadingSubmit: false
    }
  },
  methods: {
    onCancelSendPvi() {
      this.$confirm(`Bạn có chắc chắn muốn hủy hàng chờ gửi thông tin cho bảo hiểm PVI của giải: ${this.objectInsurance.name_tour}?`).then(_ => {
        this.loadingSubmit = true
        const data = { id: this.objectInsurance.id, action: 1, admin_id: getAcountInfo().id }
        insuranceApi.sendRequestInsurancePvi(data).then(response => {
          console.log('sadqweqweqw', response)
          this.loadingSubmit = false
          if (response.data.error_code === 0) {
            this.$message.success(response.data.message)
            this.$emit('onReloadData')
          } else {
            this.$message.error(response.data.message)
          }
        })
      }).catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
