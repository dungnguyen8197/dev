<template>
  <el-dialog title="Xuất chứng từ" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form :model="postForm">
      <label>Nhập mã số thuế khách hàng</label>
      <el-select
        v-model="paxCode"
        style="width: 100%"
        filterable
        remote
        reserve-keyword
        clearable
        placeholder="Nhập mã số thuế của khách"
        :remote-method="onSearchPaxCode"
        :loading="loadingSearchPaxCode"
      >
        <el-option
          v-for="(pax, index) in listpax"
          :key="index"
          :label="pax.companyName"
          :value="index"
        />
      </el-select>
      <el-form-item>
        <el-radio v-model="radio" :label="1">Khách lẻ</el-radio>
        <el-radio v-model="radio" :label="2">Khách có MST</el-radio>
      </el-form-item>
      <el-form-item label="Họ tên người mua">
        <el-input v-model="postForm.fullname" placeholder="Họ tên người mua" />
      </el-form-item>
      <el-form-item label="Tên đơn vị">
        <el-input v-model="postForm.name_company" disabled placeholder="Tên đơn vị" />
      </el-form-item>
      <el-form-item label="Mã số thuê">
        <el-input v-model="postForm.tax_code" disabled placeholder="Mã số thuê" />
      </el-form-item>
      <el-form-item label="Địa chỉ">
        <el-input v-model="postForm.address" placeholder="Địa chỉ" />
      </el-form-item>
      <el-form-item label="Số tài khoản">
        <el-input v-model="postForm.account_number" placeholder="Số tài khoản" />
      </el-form-item>
      <el-form-item label="Hình thức thanh toán">
        <el-select v-model="postForm.method_payment" placeholder="Hình thức thanh toán">
          <el-option v-for="pay in payments" :key="pay.id" :label="pay.name" :value="pay.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Ngân hàng">
        <el-input v-model="postForm.name_bank" placeholder="Ngân hàng" />
      </el-form-item>
      <el-form-item label="VAT">
        <el-input v-model="postForm.vat" placeholder="VAT" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// import StatisticResource from '@/api/manage-booking/statistic'
import axios from 'axios'
// const statisticResource = new StatisticResource()
export default {
  name: 'ExportVoucher',
  props: {
    objectVoucher: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: {},
      radio: 1,
      payments: [
        { id: 0, name: 'Chuyển khoản' },
        { id: 1, name: 'Tiền mặt' },
        { id: 2, name: 'Chuyển khoản / tiền mặt' }
      ],
      paxCode: '',
      loadingSearchPaxCode: false,
      listpax: []
    }
  },
  methods: {
    async onSearchPaxCode(keyword) {
      this.loadingSearchPaxCode = true
      const configHeader = {
        project: 'VGS',
        apikey: '6PTi057KDbwDrNXAuvQCF5D2RIyOW4Cv'
      }
      const data = { input: keyword }
      await axios.get('https://test-org.misa.com.vn/ms-org/v1/search', { headers: configHeader, params: data }).then(res => {
        this.loadingSearchPaxCode = false
        const { data } = res
        this.listpax = data.data
        console.log(this.listpax, 'this.listpax')
      })
      // statisticResource.searchPaxCode(keyword.trim()).then(res => {
      //   this.loadingSearchPaxCode = false
      //   const { error_code, data } = res
      //   if (error_code === 0) {
      //     this.listpax = data
      //   }
      // })
    },
    handleClose() {
      this.$emit('onClickButtonExportVoucher', { dialog: false, reload: false })
    }
  }
}
</script>

<style scoped>

</style>
