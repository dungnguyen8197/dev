<template>
  <div>
    <el-dialog :visible.sync="showDialogEdit" :before-close="handleClose" width="95%">
      <el-row>
        <h3 style="text-align: center; color: #000000">Hóa đơn chi tiết</h3>
        <p style="text-align: center">{{ convertDateTime(detailStatistic.date_played) }}</p>
        <el-form ref="ruleForm" :model="dataRequest" :rules="rules">
          <el-col class="price-col-8" :span="8">
            <div class="grid-content bg-purple">
              <p>
                <span class="title-name title-name-bold">Số lượng hố: </span>
                <span>{{ detailStatistic.number_hole }}</span>
              </p>
            </div>
          </el-col>
          <el-col class="price-col-8" :span="8">
            <div class="grid-content bg-purple-light">
              <p>
                <span class="title-name title-name-bold">Bảng giá thường: </span>
              </p>
              <p v-if="detailStatistic.source_price_9">
                <span class="title-name title-name-bold">9 hố: </span>
                <span>{{ formatNumber(detailStatistic.source_price_9) }}đ</span>
              </p>
              <p v-if="detailStatistic.source_price_18">
                <span class="title-name title-name-bold">18 hố: </span>
                <span>{{ formatNumber(detailStatistic.source_price_18) }}đ</span>
              </p>
              <p v-if="detailStatistic.source_price_27">
                <span class="title-name title-name-bold">27 hố: </span>
                <span>{{ formatNumber(detailStatistic.source_price_27) }}đ</span>
              </p>
            </div>
          </el-col>
          <el-col class="price-col-8" :span="8">
            <div class="grid-content bg-purple">
              <p>
                <span class="title-name title-name-bold">Bảng giá HIO: </span>
              </p>
              <p>
                <span class="title-name title-name-bold red">HIO 100tr: </span>
                <span class="title-name red">{{ formatNumber(detailStatistic.hio_100) }}đ</span>
              </p>
              <p>
                <span class="title-name title-name-bold red">HIO 200tr: </span>
                <span class="title-name red">{{ formatNumber(detailStatistic.hio_200) }}đ</span>
              </p>
            </div>
          </el-col>
          <el-row class="row-price-statistic">
            <el-col class="col-top-statistic" :span="5">
              <div class="grid-content bg-purple-dark">
                <el-form-item prop="supplier" required label="NCC">
                  <el-select
                    v-model="dataRequest.supplier"
                    size="small"
                    style="width: 100%"
                    filterable
                    required
                    remote
                    reserve-keyword
                    clearable
                    placeholder="Tìm kiếm NCC"
                    :remote-method="onSearchSupplier"
                    :loading="loadingSearchSupplier"
                  >
                    <el-option
                      v-for="Supplier in suppliers"
                      :key="Supplier.id"
                      :label="Supplier.name"
                      :value="Supplier.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :span="5">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Giá gốc" required prop="source_price">
                  <el-input
                    v-model="dataRequest.source_price"
                    required
                    pattern="\d*"
                    size="small"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :span="5">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Giá doanh thu" required prop="revenue_price">
                  <el-input
                    v-model="dataRequest.revenue_price"
                    size="small"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :span="4">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Phần trăm Refund ( nhỏ hơn 10 % )">
                  <el-input v-model="dataRequest.refund" size="small" />
                </el-form-item>
              </div>
            </el-col>
            <el-col class="col-top-statistic" :span="5">
              <div class="grid-content bg-purple-dark">
                <el-form-item label="Hạng mục" required prop="categories">
                  <el-select v-model="dataRequest.categories" size="small" style="width: 100%" placeholder="Hạng mục">
                    <el-option v-for="cate in categories" :key="cate.id" :label="cate.name" :value="cate.name" />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <table class="table-golfer border table-bordered w-100">
            <thead>
              <tr>
                <th class="p-10 text-center" style="width: 320px;">Golfer</th>
                <th class="p-10 text-center">Số lượng khách</th>
                <th class="p-10 text-center">Khách lẻ / Đại lý</th>
                <th class="p-10 text-center">Ngày thanh toán</th>
                <th class="p-10 text-center">Ngày đại lý thanh toán</th>
                <th class="p-10 text-center">Người thanh toán</th>
                <th class="p-10 text-center">Phụ phí</th>
                <th class="p-10 text-center">Doanh thu phụ phí</th>
                <th class="p-10 text-center">Mã giảm giá</th>
                <th class="p-10 text-center">Refund cho Golfer</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(booked, index) in detailStatistic.booked" :key="index">
                <td class="p-10">
                  <div class="info-custom">
                    <div style="width: 90px">
                      <p style="font-weight: bold">{{ booked.user_id !== -1 ? booked.name_out_system : `(OUT) ${booked.name_out_system}` }}</p>
                      <p class="id-golfer-booking">
                        {{ booked.user_id !== -1 ? `VID${booked.user_id}` : '' }}</p>
                    </div>
                    <p>{{ formatNumber(booked.price_booking) }}đ</p>
                    <div style="width: 150px">
                      <el-select v-model="dataRequest.listUser[index].type_purchase" class="w-100" size="small">
                        <el-option
                          v-for="(arr, i) in arrayTypePurchase"
                          :key="i"
                          :label="arr.label"
                          :value="arr.value"
                        />
                      </el-select>
                    </div>
                  </div>
                </td>
                <td class="p-10">
                  <el-input v-model="dataRequest.listUser[index].quantity_guest" size="small" type="number" />
                </td>
                <td class="p-10">
                  <el-select
                    v-model="dataRequest.listUser[index].agency"
                    size="small"
                    style="width: 100%"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder="Đại lý"
                    :remote-method="onSearchAgency"
                    :loading="loadingSearchAgency"
                  >
                    <el-option
                      v-for="agency in agencies"
                      :key="agency.id"
                      :label="agency.name"
                      :value="agency.name"
                    />
                  </el-select>
                </td>
                <td class="p-10">
                  <el-date-picker
                    v-model="dataRequest.listUser[index].date_payment"
                    size="small"
                    type="date"
                    placeholder="Ngày thanh toán"
                  />
                </td>
                <td class="p-10">
                  <el-date-picker
                    v-model="dataRequest.listUser[index].date_agent_payment"
                    size="small"
                    type="date"
                    placeholder="Ngày đại lý thanh toán"
                  />
                </td>
                <td class="p-10">
                  <el-select
                    v-model="dataRequest.listUser[index].user_id_pay"
                    clearable
                    size="small"
                    placeholder="Người thanh toán"
                  >
                    <el-option :value="0" label="Không" />
                    <el-option v-for="(user, i) in detailStatistic.booked" :key="i" :value="user.user_id" :label="user.name_out_system" />
                  </el-select>
                </td>
                <td class="p-10 text-center">
                  <el-tag v-for="(surcharge, i) in booked.surcharge_facility" :key="i" style="margin: 2px">
                    {{ surcharge.booking_code_surcharge_facility.code }}
                  </el-tag>
                </td>
                <td class="p-10">
                  <el-input
                    v-model="dataRequest.listUser[index].surcharge_revenue"
                    size="small"
                    placeholder="Giá doanh thu của phụ phí"
                  />
                </td>
                <td class="p-10">
                  <div v-if="booked.promotion_code_id">
                    <el-tag v-if="booked.promotional">{{ booked.promotional?.code }}</el-tag>
                  </div>
                </td>
                <td class="p-10">
                  <el-select v-model="dataRequest.listUser[index].is_refund" size="small">
                    <el-option v-for="refund in refunds" :key="refund.id" :label="refund.name" :value="refund.id" />
                  </el-select>
                </td>
              </tr>
            </tbody>
          </table>
          <el-form-item>
            <label>Lưu ý của khách hàng (nếu có)</label>
            <el-input
              v-model="dataRequest.note"
              size="small"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item>
            <label>Thông tin khách hàng xuất hóa đơn (nếu có)</label>
            <el-input
              v-model="dataRequest.customer_invoice"
              size="small"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="handleClose">Hủy</el-button>
            <el-button type="success" :loading="loadingSubmit" @click="handleUpdate">Xác nhận thanh toán refund (kế toán)</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { convertDateTime, formatNumber, convertDatedString } from '@/utils/convert'
import { arrayTypePurchase } from '@/utils/status'
import StatisticResource from '@/api/manage-booking/statistic'
import SearchResource from '@/api/search-api'
import { validateText } from '@/utils/validate'

const statisticResource = new StatisticResource()
const searchResource = new SearchResource()
export default {
  name: 'DialogEditStatistic',
  props: {
    showDialogEdit: {
      type: Boolean,
      default: false
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    statisticId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      detailStatistic: {},
      loadingSubmit: false,
      supplierModel: null,
      loadingSearchSupplier: false,
      suppliers: [],
      postForm: {},
      checkbox_purchase: [],
      numberCustom: 1,
      agencyModel: [],
      agencies: [],
      categories: [],
      cateId: null,
      datePayment: [],
      dateAgentPayment: [],
      loadingSearchAgency: false,
      arrayTypePurchase: Object.keys(arrayTypePurchase()).map(key => ({
        value: parseInt(key),
        label: arrayTypePurchase()[key]
      })),
      refunds: [
        { id: 0, name: 'Không' },
        { id: 1, name: 'Có' }
      ],
      dataRequest: {
        listUser: [],
        supplier: '',
        source_price: '',
        revenue_price: '',
        refund: '',
        categories: '',
        pax_id: '',
        note: '',
        customer_invoice: '',
        type_post: ''
      },
      rules: {
        supplier: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.supplier, callback, 'Nhà cung cấp'), trigger: 'change' }],
        source_price: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        revenue_price: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        categories: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.categories, callback, 'Hạng mục'), trigger: 'change' }]
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
      }
    }
  },
  watch: {
    statisticId(id) {
      if (id > 0) {
        console.log('vào đây.................................', id)
        this.requestDetailStatistic(id)
      }
    },
    objectData(val) {
      console.log('objectData', val)
    }
  },
  methods: {
    handleUpdate() {
      console.log(this.dataRequest)

      const body = {
        supplier: this.dataRequest.supplier,
        source_price: this.dataRequest.source_price,
        revenue_price: this.dataRequest.revenue_price,
        refund: parseInt(this.dataRequest.refund),
        categories: this.dataRequest.categories,
        pax_id: this.dataRequest.pax_id,
        vga: this.dataRequest.listUser.map(d => d.vga),
        pax_booked_id: this.dataRequest.listUser.map(d => d.pax_booked_id),
        type_purchase: this.dataRequest.listUser.map(d => d.type_purchase),
        quantity_guest: this.dataRequest.listUser.map(d => d.quantity_guest),
        agency: this.dataRequest.listUser.map(d => d.agency),
        date_payment: this.dataRequest.listUser.map(d => {
          if (d.date_payment) {
            return convertDatedString(d.date_payment)
          }
          return null
        }),
        date_agent_payment: this.dataRequest.listUser.map(d => {
          if (d.date_agent_payment) {
            return convertDatedString(d.date_agent_payment)
          }
          return null
        }),
        user_id_pay: this.dataRequest.listUser.map(d => d.user_id_pay),
        surcharge_revenue: this.dataRequest.listUser.map(d => parseInt(d.surcharge_revenue)),
        is_refund: this.dataRequest.listUser.map(d => d.is_refund),
        note: this.dataRequest.note,
        customer_invoice: this.dataRequest.customer_invoice,
        type_post: 0
      }
      this.loadingSubmit = true
      statisticResource.updateStatistic(body).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.$message.success(error_msg)
          this.$emit('onClickDialogEdit', { dialog: false, reload: true })
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    onSearchAgency(keyword) {
      this.loadingSearchAgency = true
      searchResource.searchAgency({ keyword_agency: keyword.trim() }).then(res => {
        this.loadingSearchAgency = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.agencies = data
        }
      })
    },
    onSearchSupplier(keyword) {
      this.loadingSearchSupplier = true
      searchResource.searchSupplier({ keyword_supplier: keyword.trim() }).then(res => {
        this.loadingSearchSupplier = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.suppliers = data
        }
      })
    },
    async requestDetailStatistic(id) {
      statisticResource.detailStatistic(id).then(res => {
        const { error_code, data } = res
        if (error_code === 0) {
          this.detailStatistic = data.pax
          const user = []
          this.detailStatistic.booked.map(function(booked) {
            const dataUser = {
              pax_booked_id: booked.id,
              vga: booked.user_id,
              agency: booked.agency_name,
              type_purchase: booked.type_purchase,
              quantity_guest: booked.quantity_guest,
              date_payment: booked.date_payment,
              date_agent_payment: booked.date_agent_payment,
              user_id_pay: booked.user_id_pay,
              surcharge_revenue: booked.surcharge_revenue,
              is_refund: booked.is_refund
            }
            user.push(dataUser)
          })
          this.dataRequest.listUser = user
          if (this.detailStatistic.number_hole === 9) {
            this.source_price_ = this.detailStatistic.source_price_9
          } else if (this.detailStatistic.number_hole === 18) {
            this.source_price_ = this.detailStatistic.source_price_18
          } else if (this.detailStatistic.number_hole === 27) {
            this.source_price_ = this.detailStatistic.source_price_27
          }
          this.dataRequest.supplier = this.detailStatistic.supplier_id
          this.dataRequest.source_price = this.source_price_
          this.dataRequest.revenue_price = this.detailStatistic.revenue_price
          this.dataRequest.refund = this.detailStatistic.is_refund
          this.dataRequest.categories = this.detailStatistic.category_name
          this.dataRequest.note = this.detailStatistic.note
          this.dataRequest.customer_invoice = this.detailStatistic.customer_invoice
          this.dataRequest.pax_id = this.detailStatistic.id
          this.categories = data.list_category
        }
      })
    },
    handleClose() {
      this.$emit('onClickDialogEdit', { dialog: false, reload: false })
    },
    convertDateTime,
    formatNumber
  }
}
</script>

<style>
.info-custom {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.info-custom p {
  margin: 0;
}

.info-custom .el-image {
  border: 1px solid #00A0A0;
  border-radius: 50%;
  width: 35px;
  height: 35px;
}

.table-golfer .el-input-number--medium {
  width: 109px;
}

.table-golfer .el-date-editor.el-input, .table-golfer .el-date-editor.el-input__inner {
  width: 136px;
}

.table-golfer td {
  padding-right: 10px;
}

.table-golfer td:last-child {
  padding-right: 0;
}

.surcharge-revenue {
  height: 36px;
  line-height: 36px;
  background-color: #FFFFFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
}

.surcharge-revenue:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
}
.col-top-statistic{
  padding-right: 10px;
}
.col-top-statistic:last-child{
  padding-right: 0;
}
.row-price-statistic{
  display: flex;
  width: 100%;
}
.title-name-bold{
  font-weight: bold;
}
.price-col-8 p{
  font-size: 20px;
}
.title-name.red{
  color: red;
}
.el-dialog__body, .el-form-item__content{
  font-size: 16px;
  font-family: sans-serif;
}
.table-golfer th{
  font-weight: bold;
  padding-right: 10px
}
.table-golfer th:last-child{
  padding-right: 0;
}
</style>

<style scoped>
p, p span {
  font-size: 12px !important;
}

span, label, th, td {
  font-size: 12px !important;
}
</style>
