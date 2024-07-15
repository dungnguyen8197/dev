<template>
  <el-dialog
    :visible.sync="showDialog"
    :before-close="handleClose"
    fullscreen
  >
    <h4 slot="title" style="text-align: center;">Quản lý giá nhập</h4>
    <el-row class="data-table-content table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col" class="text-center" style="min-width: 180px">STT</th>
            <th scope="col" class="text-center" style="min-width: 180px">Loại tee</th>
            <th scope="col" class="text-center" style="min-width: 180px">Giá bán</th>
            <th scope="col" class="text-center" style="min-width: 180px">Giá nhập</th>
            <th scope="col" class="text-center" style="min-width: 180px">NCC Miền Băc</th>
            <th scope="col" class="text-center" style="min-width: 180px">NCC Miền Trung</th>
            <th scope="col" class="text-center" style="min-width: 180px">NCC Miền Nam</th>
            <th scope="col" class="text-center" style="min-width: 180px">NCC</th>
            <th scope="col" class="text-center" style="min-width: 180px">Hình thức thanh toán</th>
          </tr>
        </thead>
        <tbody>
          <template>
            <template v-for="(item, index) in dataTable">
              <tr :key="index">
                <td class="text-center">
                  {{ index + 1 }}
                </td>
                <td class="text-center ">
                  {{ item.type_tee == 1 ? "Tee sáng" : item.type_tee == 2 ? "Tee chiều" : "Tee tối" }}
                </td>
                <td>
                  <template v-for="(tee, i) in formRequest.tee[index]">
                    <section :key="i">
                      <td class="text-center">
                        {{ `${tee.type_tee_hole} hố: ${tee.normal_price}` }}
                      </td>
                    </section>
                  </template>
                </td>
                <td>
                  <template v-for="(item1, i) in formRequest.tee[index]">
                    <section :key="i + 1000">
                      <td class="text-center">
                        <label>{{ `${item1.type_tee_hole} hố:` }}</label>
                        <el-input
                          v-model="formRequest.price[item1.id]"
                          placeholder="Giá"
                        />
                      </td>
                    </section>
                  </template>
                </td>

                <td class="text-center">
                  <el-select
                    v-if="formRequest.supplier[index]"
                    v-model="formRequest.supplier[index].supplier_north_id"
                    class="w-100 mb-10"
                    filterable
                    remote
                    clearable
                    placeholder="Chọn nhà cung cấp"
                  >
                    <el-option
                      v-for="supplier in supplies"
                      :key="supplier.value"
                      :label="supplier.label"
                      :value="supplier.value"
                    />
                  </el-select>
                  <template v-for="(item1, i) in formRequest.tee[index]">
                    <section :key="i + 1000">
                      <td class="text-center">
                        <label>{{ `${item1.type_tee_hole} hố:` }}</label>
                        <el-input
                          v-model="formRequest.priceNorth[item1.id]"
                          placeholder="Giá"
                        />
                      </td>
                    </section>
                  </template>
                </td>
                <td class="text-center">
                  <el-select
                    v-if="formRequest.supplier[index]"
                    v-model="formRequest.supplier[index].supplier_central_id"
                    class="w-100 mb-10"
                    filterable
                    remote
                    clearable
                    placeholder="Chọn nhà cung cấp"
                  >
                    <el-option
                      v-for="supplier in supplies"
                      :key="supplier.value"
                      :label="supplier.label"
                      :value="supplier.value"
                    />
                  </el-select>
                  <template v-for="(item1, i) in formRequest.tee[index]" class="mt-10">
                    <section :key="i + 1000">
                      <td class="text-center">
                        <label>{{ `${item1.type_tee_hole} hố:` }}</label>
                        <el-input
                          v-model="formRequest.priceCentral[item1.id]"
                          placeholder="Giá"
                        />
                      </td>
                    </section>
                  </template>
                </td>
                <td class="text-center">
                  <el-select
                    v-if="formRequest.supplier[index]"
                    v-model="formRequest.supplier[index].supplier_south_id"
                    class="w-100 mb-10"
                    filterable
                    remote
                    clearable
                    placeholder="Chọn nhà cung cấp"
                  >
                    <el-option
                      v-for="(supplier, indexSupplier) in supplies"
                      :key="indexSupplier"
                      :label="supplier.label"
                      :value="supplier.value"
                    />
                  </el-select>
                  <template v-for="(item1, i) in formRequest.tee[index]">
                    <section :key="i + 1000">
                      <td class="text-center">
                        <label>{{ `${item1.type_tee_hole} hố:` }}</label>
                        <el-input
                          v-model="formRequest.priceSouth[item1.id]"
                          placeholder="Giá"
                        />
                      </td>
                    </section>
                  </template>
                </td>
                <td class="text-center">
                  <el-select
                    v-if="formRequest.supplier[index]"
                    v-model="formRequest.supplier[index].value"
                    class="w-100"
                    filterable
                    remote
                    clearable
                    placeholder="Chọn nhà cung cấp"
                  >
                    <el-option
                      v-for="supplier in supplies"
                      :key="supplier.value"
                      :label="supplier.label"
                      :value="supplier.value"
                    />
                  </el-select>
                </td>
                <td v-if="index === 0" :rowspan="index == 0 ? dataTable.length : ''" class="text-center">
                  <el-select
                    v-model="formRequest.type_payments"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Chọn hình thức thanh toán"
                  >
                    <el-option
                      v-for="payment in typePaymentList"
                      :key="payment.value"
                      :label="payment.label"
                      :value="payment.value"
                    />
                  </el-select>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { formatNumber } from '@/utils/convert'
import PackageTeeResource from '@/api/package-tee/index'
import SearchResource from '@/api/search-api'
import { isEmpty } from '@/utils/validate'

const searchResource = new SearchResource()
const packageTeeResource = new PackageTeeResource()

export default {
  name: 'DialogSellPackage',
  components: {
    // SearchSupplier
  },
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
    }
  },
  data() {
    return {
      rules: {},
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        supplier: [],
        supplierNorth: [],
        supplierSouth: [],
        supplierCentral: [],
        priceCentral: [{ tee: [] }],
        priceSouth: [{ tee: [] }],
        priceNorth: [{ tee: [] }],
        price: [
          { tee: [] }
        ],
        tee: [],
        type_payments: ''
      },
      request: {},
      dataTable: [],
      objectDetail: {},
      clearSupplier: false,
      loadingSearchSupplier: false,
      supplies: [],
      typePaymentList: [
        { value: 1, label: 'Thanh toán ngay' },
        { value: 2, label: 'Thanh toán theo tuần' },
        { value: 3, label: 'Thanh toán theo tháng' }
      ]
    }
  },

  watch: {
    objectData(value) {
      if (value) {
        this.objectDetail = value
        this.onGetDetail()
      }
    }
  },
  created() {
    this.onSearchSupplier()
  },
  methods: {
    onSearchSupplier(keyword) {
      searchResource.listSupplier().then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            const data = result.map(value => {
              return { value: value.id, label: value.name }
            })
            console.log('data__________________', data)
            this.supplies = [...this.supplies, ...data].filter((obj, index, self) => {
              const firstIndex = self.findIndex((item) => item?.value === obj.value)
              return index === firstIndex
            })
          } else {
            this.supplies = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },

    // const priceArray = teeArray.map(tee => ({
    //   [tee.id]: tee.normal_price
    // }));

    // const result = priceArray.reduce((acc, price) => {
    //   return {...acc, ...price};
    // }, {});
    onGetDetail() {
      packageTeeResource.detail_manager_source_price({ id: this.objectDetail.id }).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.dataTable = res.data
          if (res.data.length > 0) {
            this.formRequest.supplier = res.data.map(item => ({
              value: item?.supplier?.id,
              name: item?.supplier?.name,
              id_tee: item.id,
              supplier_north_id: item?.supplier_north?.id,
              supplier_central_id: item?.supplier_central?.id,
              supplier_south_id: item?.supplier_south?.id
            }))
            // const supplier_north = res.data.map(i => i.supplier_north).filter(i => !isEmpty(i))
            // const supplier_central = res.data.map(i => i.supplier_central).filter(i => !isEmpty(i))
            // const supplier_south = res.data.map(i => i.supplier_south).filter(i => !isEmpty(i))
            // const supplier = res.data.map(i => i.supplier).filter(i => !isEmpty(i))
            // this.supplies = [...supplier_north, ...supplier_central, ...supplier_south, ...supplier].filter((obj, index, self) => {
            //   const firstIndex = self.findIndex((item) => item?.id === obj?.id)
            //   return index === firstIndex
            // }).map(item => ({ value: item?.id, label: item?.name }))

            this.formRequest.tee = res.data.map(item => {
              item.tee.map(tee => {
                this.formRequest.price[tee.id] = tee.source_price
                this.formRequest.priceCentral[tee.id] = tee?.price_region?.price_central || null
                this.formRequest.priceNorth[tee.id] = tee?.price_region?.price_north || null
                this.formRequest.priceSouth[tee.id] = tee?.price_region?.price_south || null
              })
              return item.tee
            })
            console.log('......', this.typePaymentList.find(item => item.value === 1).label)
            this.formRequest.type_payments = res.data?.[0]?.packageTee?.type_purchase_supplier
            console.log('this.formRequest.........', this.formRequest)
          }
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    async onSubmitForm(formName) {
      const res = await this.validateFrom(this.formRequest)
      if (res.error_code !== 0) {
        this.$message.error(res.error_msg)
        return
      }
      this.handleSubmitUpdate()
    },
    async handleSubmitUpdate() {
      const list_supplier = this.formRequest.supplier.map(item => {
        return {
          value: item.value,
          id_tee: item.id_tee,
          north_supplier_id: item.supplier_north_id || null,
          central_supplier_id: item.supplier_central_id || null,
          south_supplier_id: item.supplier_south_id || null

        }
      })
      const price = this.formRequest.price.splice(1).map((item, key) => ({ key: key + 1, value: item })).filter(item => item != null)
      const tees = this.formRequest.tee?.flat()?.map(i => ({ id: i.id, type_tee_hole: i.type_tee_hole }))
      const priceNorth = this.formRequest.priceNorth.splice(1).map((item, key) => ({ key: key + 1, value: item })).filter(item => item != null)
      const priceCentral = this.formRequest.priceCentral.splice(1).map((item, key) => ({ key: key + 1, value: item })).filter(item => item != null)
      const priceSouth = this.formRequest.priceSouth.splice(1).map((item, key) => ({ key: key + 1, value: item })).filter(item => item != null)
      const listData = []
      for (let i = 0; i < tees.length; i++) {
        const tee = tees[i]
        const data = {
          tee_id: tee.id,
          type_tee_hole: tee.type_tee_hole,
          price_north: priceNorth.find(i => tee.id === i.key)?.value || null,
          price_central: priceCentral.find(i => tee.id === i.key)?.value || null,
          price_south: priceSouth.find(i => tee.id === i.key)?.value || null
        }
        listData.push(data)
      }
      console.log('this.formRequest......', this.formRequest)
      console.log('listData___________', listData)
      const body = {
        price: price,
        listPriceByRegion: listData,
        supplier: list_supplier,
        type_payments: this.formRequest.type_payments,
        id_pack: this.objectDetail.id
      }

      console.log('body_______________', body)
      packageTeeResource.update_manager_source_price(body).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Cập nhật thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    async validateFrom(formRequest) {
      const supplier = formRequest.supplier.some(i => isEmpty(i.value))
      if (supplier) return { error_code: 1, error_msg: 'Nhà cung cấp không được để trống' }
      return { error_code: 0, error_msg: null }
    },
    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {
          supplier: [],
          supplierNorth: [],
          supplierSouth: [],
          supplierCentral: [],
          price: [
            { tee: [] }
          ],
          priceCentral: [{ tee: [] }],
          priceSouth: [{ tee: [] }],
          priceNorth: [{ tee: [] }],
          tee: [],
          type_payments: ''
        },
        this.clearSupplier = true
      )
    },

    handleIndexMethod(index) {
      return index + 1
    },
    handleSelectionChange(value) {
      if (value) {
        this.supplies = []
      }
    },
    handleClose() {
      this.resetformRequest()
      this.$emit('onCloseDialog', { dialog: true, reload: false })
    },

    formatNumber
  }
}
</script>

    <style scoped>
    .mb-10 {
      margin-bottom: 10px;
    }
    </style>

