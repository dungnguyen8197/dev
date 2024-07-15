<template>
  <el-button size="small" title="Đặt chế độ hàng chờ gửi thông tin cho giải" type="info" :loading="loadingSubmit" circle @click="onSendDataToPVI">
    <svg-icon v-if="!loadingSubmit" icon-class="guide" />
  </el-button>
</template>

<script>
import InsuranceApi from '@/api/HIO/insurance'
import { getAcountInfo } from '@/utils/auth'
const insuranceApi = new InsuranceApi()
export default {
  name: 'ButtonSendPvi',
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
    onSendDataToPVI() {
      this.$confirm(`Bạn có chắc chắn muốn gửi thông tin giải ${this.objectInsurance.name_tour} cho bên bảo hiểm PVI?`).then(_ => {
        this.loadingSubmit = true
        const data = { id: this.objectInsurance.id, admin_id: getAcountInfo().id }
        insuranceApi.sendRequestInsurancePvi(data).then(response => {
          console.log(response)
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
