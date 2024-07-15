<template>
  <div>
    <el-dialog class="dialog-statistic-bill" :visible.sync="showDialog" :before-close="handleClose" fullscreen>
      <div
        v-loading="loadingDialog"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-row>
          <h3 style="text-align: center; color: #000000">Hóa đơn chi tiết</h3>
          <p v-if="dataRequest.pax_id != 0" style="text-align: center">{{ convertDateTime(dataRequest?.pax?.date_played) }}</p>
          <el-form ref="ruleForm" :model="dataRequest" :rules="rules">
            <el-col v-if="dataRequest.pax_id != 0" class="price-col-8" :span="8">
              <div class="grid-content bg-purple">
                <p>
                  <span class="title-name title-name-bold">Số lượng hố: </span>
                  <span>{{ dataRequest?.pax?.number_hole }}</span>
                </p>
              </div>
            </el-col>
            <el-col v-if="dataRequest.pax_id != 0" class="price-col-8" :span="8">
              <div class="grid-content bg-purple-light">
                <p>
                  <span class="title-name title-name-bold">Bảng giá thường: </span>
                </p>
                <p v-if="dataRequest?.pax?.source_price_9">
                  <span class="title-name title-name-bold">9 hố: </span>
                  <span>{{ formatNumber(dataRequest?.pax?.source_price_9) }}đ</span>
                </p>
                <p v-if="dataRequest?.pax?.source_price_18">
                  <span class="title-name title-name-bold">18 hố: </span>
                  <span>{{ formatNumber(dataRequest?.pax?.source_price_18) }}đ</span>
                </p>
                <p v-if="dataRequest?.pax?.source_price_27">
                  <span class="title-name title-name-bold">27 hố: </span>
                  <span>{{ formatNumber(dataRequest?.pax?.source_price_27) }}đ</span>
                </p>
              </div>
            </el-col>
            <el-col v-if="dataRequest.pax_id != 0" class="price-col-8" :span="8">
              <div class="grid-content bg-purple">
                <p>
                  <span class="title-name title-name-bold">Bảng giá HIO: </span>
                </p>
                <p>
                  <span class="title-name title-name-bold red">HIO 100tr: </span>
                  <span class="title-name red">{{ formatNumber(dataRequest?.pax?.hio_100) }}đ</span>
                </p>
                <p>
                  <span class="title-name title-name-bold red">HIO 200tr: </span>
                  <span class="title-name red">{{ formatNumber(dataRequest?.pax?.hio_200) }}đ</span>
                </p>
              </div>
            </el-col>
            <el-row class="row-price-statistic">
              <el-col class="col-top-statistic" :span="14" />
              <el-col class="col-top-statistic" :span="6">
                <div class="grid-content bg-purple-dark">
                  <el-form-item label="Tên Outing">
                    <el-input v-model="dataRequest.bill_name" disabled size="small" />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="listGolfers?.length > 0 && dataRequest.pax_id != 0" class="data-table-content table-responsive p-10 border-1 mb-10">
              <h6 class="mb-20"><b>Danh sách Golfer: </b></h6>
              <el-row class="row-price-statistic">
                <el-col class="col-top-statistic" :sm="6" :md="6">
                  <div class="grid-content bg-purple-dark">
                    <el-form-item label="Giá doanh thu" prop="revenue_price">
                      <el-input
                        v-model="dataRequest.revenue_price"
                        disabled
                        size="small"
                      />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col class="col-top-statistic" :sm="6" :md="6">
                  <div class="grid-content bg-purple-dark">
                    <el-form-item label="Phần trăm Refund ( nhỏ hơn 10 % )">
                      <el-input v-model="dataRequest.refund" disabled size="small" />
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <p v-if="hio_outing" style="font-size: 16px !important; color: red;">Bảo hiểm Outing: {{ hio_outing }}</p>
              <table class="table-golfer border table-bordered w-100">
                <thead>
                  <tr>
                    <th class="p-10 text-center word-break" style="min-width: 320px;">Golfer</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Số lượng khách</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Khách lẻ / Đại lý</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Ngày thanh toán</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Ngày đại lý thanh toán</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Người thanh toán</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Phụ phí</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Doanh thu phụ phí</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Mã giảm giá</th>
                    <th class="p-10 text-center word-break" style="min-width: 150px">Refund cho Golfer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(booked, index) in listGolfers" :key="index">
                    <td class="p-10">
                      <div class="mb-10">
                        <div class="info-custom">
                          <div style="width: 110px">
                            <div style="display: flex; flex-direction: column;">
                              <p style="font-weight: bold">{{ booked.user_id !== -1 ? booked.name : `(OUT) ${booked.name}` }}</p>
                              <p class="id-golfer-booking">
                                {{ booked.user_id !== -1 ? `VID${booked.user_id}` : '' }}
                              </p>
                              <p v-if="Boolean(booked.is_deleted)" style="color: red;">(Đã xóa - BH đã gửi PVI)</p>
                              <el-input v-model="booked.name" hidden="hidden">
                                {{ booked.name }}
                              </el-input>
                            </div>
                          </div>
                          <div style="width: 170px">
                            <el-select v-model="booked.type_purchase" disabled class="w-100" size="small" @change="checkType(index)">
                              <el-option
                                v-for="(arr, i) in arrayTypePurchase"
                                :key="i"
                                :label="arr.label"
                                :value="arr.value"
                              />
                            </el-select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="info-custom">
                          <div style="width: 110px">
                            <p style="font-weight: bold">Booking: </p>
                          </div>
                          <div style="width: 170px">
                            <p>{{ booked.is_deleted ? 0 : formatNumber(booked.price_booking) }}đ</p>
                          </div>
                        </div>
                      </div>
                      <div v-if="booked.insurance_pax.length > 0">
                        <div class="info-custom">
                          <div style="width: 110px">
                            <p style="font-weight: bold">Bảo hiểm tiền mặt: </p>
                          </div>
                          <div style="width: 170px">
                            <p>{{ convertHio(booked.insurance_pax, booked.insurance_provider, booked.user_id) }}</p>
                          </div>
                        </div>
                      </div>
                      <div v-if="booked.type_refund">
                        <div class="info-custom">
                          <div style="width: 110px">
                            <p style="font-weight: bold">Loại hoàn: </p>
                          </div>
                          <div style="width: 170px">
                            <p>{{ +booked.type_refund === 1 ? 'Tiền mặt' : 'Hoàn point' }}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="p-10">
                      <div class="mb-1">
                        <el-input v-model=" booked.quantity_guest" :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)" placeholder="Số lượng khách" size="small" type="number" />
                      </div>
                      <div>
                        <el-input v-model="booked.passport" :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)" placeholder="Passport/CCCD" size="small" />
                      </div>
                    </td>
                    <td class="p-10">
                      <el-select
                        v-model="booked.agency_id"
                        :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)"
                        size="small"
                        style="width: 100%"
                        filterable
                        remote
                        reserve-keyword
                        clearable
                        placeholder="Đại lý"
                      >
                        <el-option
                          v-for="item in listAgency"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </td>
                    <td class="p-10">
                      <el-date-picker
                        v-model="booked.date_payment"
                        :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)"
                        size="small"
                        type="date"
                        format="dd-MM-yyyy"
                        placeholder="Ngày thanh toán"
                      />
                    </td>
                    <td class="p-10">
                      <el-date-picker
                        v-model="booked.date_agent_payment"
                        :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)"
                        size="small"
                        type="date"
                        format="dd-MM-yyyy"
                        placeholder="Ngày đại lý thanh toán"
                      />
                    </td>
                    <td class="p-10">
                      <el-select
                        v-model="booked.user_id_pay"
                        :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)"
                        clearable
                        size="small"
                        placeholder="Người thanh toán"
                      >
                        <el-option :value="0" label="Không" />
                        <el-option v-for="(user, i) in listGolfers.filter(item => item.user_id != -1)" :key="i" :value="user.user_id" :label="`vID${user.user_id} - ${user.name}`" />
                      </el-select>
                    </td>
                    <td class="p-10 text-center">
                      <el-tag v-for="(surcharge, i) in booked.surcharge_facility" :key="i" style="margin: 2px">
                        {{ surcharge.booking_code_surcharge_facility.code }}
                      </el-tag>
                    </td>
                    <td class="p-10">
                      <el-input
                        v-model="booked.surcharge_revenue"
                        :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)"
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
                      <el-select v-model="booked.is_refund" :disabled="booked.is_cancel > 0 || Boolean(booked.is_deleted)" size="small">
                        <el-option v-for="refund in refunds" :key="refund.id" :label="refund.name" :value="refund.id" />
                      </el-select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-row>
            <el-row v-if="dataRequest?.pax" class="row-price-statistic mb-20">
              <el-col v-if="dataRequest?.pax?.note" class="col-top-statistic" :span="11">
                <label>Lưu ý của khách hàng (nếu có)</label>
                <el-input
                  v-model="dataRequest.note"
                  disabled
                  size="small"
                  type="textarea"
                  :rows="5"
                />
              </el-col>
              <el-col class="col-top-statistic" :span="2" />
              <el-col v-if="dataRequest?.pax?.customer_invoice" class="col-top-statistic" :span="11">
                <label>Thông tin khách hàng xuất hóa đơn (nếu có)</label>
                <el-input
                  v-model="dataRequest.customer_invoice"
                  disabled
                  size="small"
                  type="textarea"
                  :rows="5"
                />
              </el-col>

            </el-row>
            <el-row v-if="listGolfers.length > 0" class="p-10 border-1 mb-10">
              <el-row class="data-table-content table-responsive">
                <h6 class="mb-20"><b>Danh sách Dịch vụ đi kèm: </b></h6>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-center col-2 vertical-middle" style="min-width: 180px">Tên dịch vụ</th>
                      <th scope="col" class="text-center col-2" style="min-width: 180px">Mã hàng</th>
                      <th scope="col" class="text-center col-2" style="min-width: 180px">Hình thức thanh toán</th>
                      <th scope="col" class="text-center col-2" style="min-width: 180px">Ngày thanh toán</th>
                      <th scope="col" class="text-center col-2" style="min-width: 180px">Ngày đại lý thanh toán</th>
                      <th scope="col" class="text-center col-2" style="min-width: 180px">Người thanh toán</th>
                      <th scope="col" class="text-center" style="min-width: 180px">Đơn giá</th>
                      <th scope="col" class="text-center" style="min-width: 180px">Số lượng</th>
                      <th scope="col" class="text-center" style="min-width: 180px">Thành tiền</th>
                      <th scope="col" class="text-center" style="min-width: 180px">Đại lý</th>

                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="postForm?.service?.length > 0">
                      <template v-for="(service, key_service) in postForm.service">
                        <tr :key="key_service">
                          <th style="vertical-align: center" class="col-2">
                            <el-select
                              v-model="postForm.service[key_service].id"
                              class="w-100"
                              placeholder="Chọn dịch vụ"
                              clearable
                              disabled
                              @change="changeService(key_service)"
                            >
                              <el-option
                                v-for="item in listService"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </th>
                          <td class="col-2">
                            <el-input v-if="postForm.service[key_service].id !== -1 && postForm.service[key_service].id !== 2" v-model="postForm.service[key_service].name_product" disabled />
                            <el-select
                              v-if="postForm.service[key_service].id == 2"
                              v-model="postForm.service[key_service].hio_id"
                              class="w-100"
                              disabled
                              filterable
                              remote
                              reserve-keyword
                              placeholder="Nhập mã HIO..."
                              @change="changeHoldInOne(key_service)"
                            >
                              <el-option v-for="item in listHoldInOne" :key="item.id" :label="'BH'+item.id + ' - ' + formatNumber(item.total_pay) + 'đ'" :value="item.id" />
                            </el-select>
                            <el-input
                              v-if="postForm.service[key_service].id == -1"
                              v-model="postForm.service[key_service].name_other_service"
                              placeholder="Nhập tên dịch vụ"
                              disabled
                              clearable
                            />
                          </td>
                          <td class="text-center">
                            <el-select v-model="postForm.service[key_service].type_purchase" disabled size="small" style="width: 100%" clearable placeholder="Hình thức thanh toán" @change="checkTypeServiceChild(key_service)">
                              <el-option
                                v-for="(arr, i) in convertListTypePurchaseChild(postForm.service[key_service])"
                                :key="i"
                                :label="arr.label"
                                :value="arr.value"
                              />
                            </el-select>
                            <div v-if="postForm.service[key_service].type_refund" style="margin-top: 10px; text-align: left;">
                              <span>Loại hoàn: {{ +postForm.service[key_service].type_refund === 1 ? 'Tiền mặt' : 'Hoàn point' }}</span>
                            </div>
                          </td>
                          <td class="text-center">
                            <el-date-picker
                              v-model="postForm.service[key_service].date_payment"
                              :disabled="postForm.service[key_service].id == 2 || postForm.service[key_service].is_cancel > 0"
                              size="small"
                              style="width: 100%;"
                              type="date"
                              format="dd-MM-yyyy"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="Ngày thanh toán"
                            />
                          </td>
                          <td class="text-center">
                            <el-date-picker
                              v-model="postForm.service[key_service].date_agent_payment"
                              :disabled="postForm.service[key_service].id !== -1 || postForm.service[key_service].is_cancel > 0"
                              size="small"
                              style="width: 100%;"
                              type="date"
                              format="dd-MM-yyyy"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="Ngày đại lý thanh toán"
                            />
                          </td>
                          <td class="text-center">
                            <el-select v-model="postForm.service[key_service].host_user_id" :disabled="postForm.service[key_service].is_cancel > 0" size="small" style="width: 100%" clearable placeholder="Người thanh toán">
                              <el-option v-for="(user, i) in listGolfers.filter(item => item.user_id != -1)" :key="i" :value="user.user_id" :label="`vID${user.user_id} - ${user.name}`" />
                            </el-select>
                          </td>
                          <td class="text-center">
                            <el-input-number
                              v-model="postForm.service[key_service].price"
                              disabled
                              :min="0"
                              :step="50000"
                            />
                          </td>
                          <td class="text-center">
                            <el-input-number
                              v-model="postForm.service[key_service].quantity"
                              disabled
                              :min="1"
                              :max="1000"
                              :step="1"
                            />
                          </td>
                          <td class="vertical-middle text-center">
                            <span>{{ handlePriceService(key_service) }} đ</span>
                          </td>
                          <td class="text-center">
                            <el-select
                              v-if="postForm.service[key_service].id == -1"
                              v-model="postForm.service[key_service].agent_id"
                              :disabled="postForm.service[key_service].is_cancel > 0"
                              size="mini"
                              clearable
                              filterable
                              placeholder="Chọn Đại lý"
                            >
                              <el-option
                                v-for="item in listAgency"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </td>
                        </tr>
                      </template>
                    </template>

                    <tr v-else>
                      <td colspan="6" class="text-center">Chưa có dịch vụ đi kèm</td>
                    </tr>
                  </tbody>
                </table>
              </el-row>
            </el-row>
            <el-row v-if="listGolfers.length > 0" class="p-10 mb-10">
              <el-input
                v-model="postForm.note"
                disabled
                type="textarea"
                placeholder="Note"
              />
            </el-row>
            <el-form-item>
              <el-button size="mini" type="warning" @click="handleClose">Hủy</el-button>
              <!-- <el-button size="mini" type="success" :loading="loadingSubmit" @click="onSubmitForm">Xác nhận thanh toán refund (kế toán)</el-button> -->
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </el-dialog>
    <template v-if="indexGolfer && indexGolfer >= 0">
      <el-dialog
        title="Chọn phương thức refund"
        width="400px"
        :visible.sync="isShowDialogRefund"
        :before-close="handleCloseDialogRefund"
      >
        <el-form>
          <el-form-item>
            <el-select v-model="listGolfers[indexGolfer-1].type_refund" size="small">
              <el-option v-for="refund in typeRefund" :key="refund.value" :label="refund.label" :value="refund.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button @click="handleCloseDialogRefund">Xác nhận</el-button>
        <!-- <el-button @click="() => {isShowDialogRefund=false}">Hủy bỏ</el-button> -->
      </el-dialog>
    </template>
    <template v-if="indexService && indexService >= 0">
      <el-dialog
        title="Chọn phương thức refund"
        width="400px"
        :visible.sync="isShowDialogRefundService"
        :before-close="handleCloseDialogRefundService"
      >
        <el-form>
          <el-form-item>
            <el-select v-model="postForm.service[indexService-1].type_refund" size="small">
              <el-option v-for="refund in typeRefund" :key="refund.value" :label="refund.label" :value="refund.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button @click="handleCloseDialogRefundService">Xác nhận</el-button>
        <!-- <el-button @click="() => {isShowDialogRefund=false}">Hủy bỏ</el-button> -->
      </el-dialog>
    </template>
    <!-- <el-dialog append-to-body :visible.sync="dialogShowOTP" :before-close="handleClose" width="350px" center :title="`Nhập OTP đã gửi về SĐT bạn`">
      <section class="main-pd-wrapper">
        <el-input v-model="otp" />
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="verifyOtp">xác nhận</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { convertDateTime, formatNumber } from '@/utils/convert'
import { arrayTypePurchase } from '@/utils/status'
import SearchResource from '@/api/search-api'

// import { getOTP, login } from '@/api/user'
// import { validateText } from '@/utils/validate'
import BookingPaxResource from '@/api/BookingPax'
import moment from 'moment'
import { isEmpty } from '@/utils/validate'
import { listOrderType, listHIO, listService, listTypeHole } from '@/utils/defaultOptions'
import AgencyResource from '@/api/agency/agency'
import { ARRAY_STATUS_CHILD_SERVICE } from '@/utils/constant'
const agencyResource = new AgencyResource()
const bookingPaxResource = new BookingPaxResource()
const searchResource = new SearchResource()

export default {
  name: 'DialogStatistic',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    listInsurrance: {
      type: Array,
      default() {
        return []
      }
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
      listService: listService,
      listOrderType: listOrderType,
      listHIO: listHIO,
      listTypeHole: listTypeHole,
      listHoldInOne: [],
      loadingSearchProduct: false,
      listAgency: [],
      loadingDialog: false,
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
        type_post: '',
        type_purchase: ''
        // date_payment: ''
      },
      check_exist_not_payment: true,
      rules: {
        // type_refund: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.supplier, callback, 'Nhà cung cấp'), trigger: 'change' }]
        // source_price: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }]
        // categories: [{ validator: (rule, _, callback) => validateText(rule, this.dataRequest.categories, callback, 'Hạng mục'), trigger: 'change' }]
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
        // revenue_price: [{ validator: (rule, _, callback) => validateNumber(rule, this.dataRequest.source_price, callback, 'Giá gốc'), trigger: 'change' }],
      },
      listGolfers: [],
      clone_listGolfers: [],
      data_hio: [],
      listTypePurchaseChildService: ARRAY_STATUS_CHILD_SERVICE,
      status_bill: '',
      isSTB: false,
      isShowDialogRefund: false,
      typeRefund: [
        { value: 1, label: 'Tiền mặt' },
        { value: 2, label: 'Hoàn point' }
      ],
      indexGolfer: null,
      indexService: null,
      isShowDialogRefundService: false,
      clone_convert_service: [],
      hio_outing: null,
      dialogShowOTP: false,
      otp: ''
    }
  },
  watch: {
    objectData(value) {
      if (!isEmpty(value)) {
        this.status_bill = value.status
        this.updateDataJson(value.general_bill_id, value.pax_id)
      }
    }
  },
  created() {
    // this.onGetDetail()
  },
  methods: {
    async onSubmitForm() {
      //
    },
    checkType(index) {
      if (+this.listGolfers[index].type_purchase === 14 && this.clone_listGolfers[index].type_purchase > 0) {
        this.$confirm(`Bạn có chắc chắn hủy golfer này, sau khi hủy đơn sẽ hoàn point và không thể thao tác golfer này ?`).then((_) => {
          this.indexGolfer = index + 1
          console.log('indexGolfer...........', this.indexGolfer)
          console.log('.........isShowDialogRefund', this.isShowDialogRefund)
          this.isShowDialogRefund = true
        })
          .catch(() => {
            console.log('cancel..............')
            this.listGolfers[index].type_purchase = this.clone_listGolfers[index].type_purchase
          })
      }
    },
    checkTypeServiceChild(index) {
      if (+this.postForm.service[index].type_purchase === 14) {
        if (+this.postForm.service[index].id === 1 && +this.postForm.service[index]?.state > 1) {
          this.$message.warning('Đơn Shop này đang đóng gói không thể hủy !!!')
          this.postForm.service[index].type_purchase = this.clone_convert_service[index].type_purchase
        } else {
          if (this.clone_convert_service[index].type_purchase > 0) {
            this.$confirm(`Bạn có chắc chắn hủy golfer này, sau khi hủy đơn sẽ hoàn point và không thể thao tác golfer này ?`).then((_) => {
              this.indexService = index + 1
              console.log('indexService...........', this.indexService)
              console.log('.........isShowDialogRefundService', this.isShowDialogRefundService)
              this.isShowDialogRefundService = true
            })
              .catch(() => {
                console.log('cancel..............')
                this.postForm.service[index].type_purchase = this.clone_convert_service[index].type_purchase
              })
          }
        }
      }
    },
    handleCloseDialogRefund() {
      if (!this.listGolfers[this.indexGolfer - 1].type_refund) {
        this.$message.warning('Bạn cần chọn loại hoàn tiền')
        return
      } else {
        this.isShowDialogRefund = false
      }
    },
    handleCloseDialogRefundService() {
      if (!this.postForm.service[this.indexService - 1].type_refund) {
        this.$message.warning('Bạn cần chọn loại hoàn tiền')
        return
      } else {
        this.isShowDialogRefundService = false
      }
    },
    updateDataJson(general_bill_id, pax_id) {
      // bookingPaxResource.updateDataJson({ general_bill_id, pax_id }).then(async(res) => {
      //   if (+res.error_code === 0) {
      this.onGetListAgency()
      this.onGetDetail(general_bill_id)
      //   } else {
      //     this.$message.error(res.error_msg)
      //   }
      // })
    },

    onGetListAgency() {
      agencyResource.searchAgency().then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.listAgency = result.map(value => {
              return { value: value.id, label: value.name, data: value }
            })
          } else {
            this.listAgency = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },

    async onGetDetail(id) {
      console.log('_________', this.listTypePurchaseChildService)
      this.loadingDialog = true
      bookingPaxResource.detailBill({ bill_id: id, all_service: true }).then(async(res) => {
        if (res.error_code === 0) {
          const data = res.data
          if (!isEmpty(data.insurance_id_pax)) {
            const find_hio_outing = data?.list_hio?.find(item => +item.id === data?.insurance_id_pax)
            this.hio_outing = `${find_hio_outing?.OptionsMoney?.name} - BH${find_hio_outing?.id}`
          }
          if (data.pax) {
            const checkAllPaymentSTB = data?.pax?.booked.filter(item => item.agency_name !== 'Sacombank' || +item.price_booking !== 0)?.length === 0
            if (checkAllPaymentSTB) {
              this.isSTB = true
            }
          }

          this.dataRequest = { ...data, customer_invoice: data?.pax?.customer_invoice, note: data?.pax?.note, revenue_price: data?.pax?.revenue_price }

          for (let i = 0; i < data?.golfers?.length; i++) {
            const golfer = data.golfers[i]
            // format booked golfer
            const addGolfer = {
              ...golfer,
              user_id: golfer.id,
              name_out_system: golfer?.name,
              price_booking: golfer?.booked?.price_booking,
              surcharge_facility_id: golfer?.surcharge_facility_id?.map(item => item.code_surcharge_facility_id),
              pax_booked_id: golfer?.booked?.id,
              vga: golfer?.user_id,
              agency: golfer?.agency_id,
              type_purchase: golfer?.booked?.type_purchase,
              quantity_guest: golfer?.booked?.quantity_guest,
              date_payment: golfer?.booked?.date_payment,
              date_agent_payment: golfer?.booked?.date_agent_payment,
              user_id_pay: golfer?.booked?.user_id_pay,
              surcharge_revenue: golfer?.booked?.surcharge_revenue,
              is_refund: golfer?.booked?.is_refund,
              passport: golfer?.booked?.booking_user_passport?.passport,
              is_cancel: golfer?.booked?.type_purchase === 14 ? 1 : 0,
              type_refund: golfer?.booked?.type_purchase === 14 ? -1 : null
            }
            this.listGolfers.push(addGolfer)
          }
          this.clone_listGolfers = JSON.parse(JSON.stringify(this.listGolfers))
          const arrayOfLists = this.listGolfers.map(obj => obj.insurance_id_pax)

          const list_hio_has_user = [].concat(...arrayOfLists)
          console.log('..........list_hio_has_user', list_hio_has_user)
          const list_hio_service = data.service.filter(item => item.type === 'hio').map(item => item.hio_id)
          const list_hio_all = data.list_hio.map(item => item.id)
          console.log('..........list_hio_all', list_hio_all)
          const list_hio_dif = list_hio_all.filter(item => !list_hio_has_user.includes(item) && !list_hio_service.includes(item))
          console.log('..........list_hio_dif', list_hio_dif)
          const list_hio_send_pvi_user_delete =
        data.list_hio.filter(item => list_hio_dif.includes(item.id) && +item.is_outing === 0 && +item.is_send_pvi === 1 && +item.options_money_id !== 9)
          .map(item1 => ({
            User: item1.User,
            options_money_id: item1.options_money_id,
            can_payment: item1.can_payment,
            id: item1.id,
            id_general_bill_detail: item1.id_general_bill_detail,
            is_outing: item1.is_outing,
            user_id: item1.user_id,
            total_pay: item1.total_pay,
            is_send_pvi: item1.is_send_pvi,
            status: item1.status,
            is_customer_pay: item1.is_customer_pay,
            is_pay: item1.is_pay
          }))
          console.log('..........list_hio_send_pvi_user_delete', list_hio_send_pvi_user_delete)
          const list_golfer_delete_hio_send_pvi = this.listUserDEteleHioSendPVI(list_hio_send_pvi_user_delete)
          console.log('..........list_golfer_delete_hio_send_pvi', list_golfer_delete_hio_send_pvi)
          this.listGolfers = [...this.listGolfers, ...list_golfer_delete_hio_send_pvi]
          if (data.pax) {
            this.listPax = [data.pax]

            this.facilities = [data.pax.facility].map(value => {
              return { value: value.id, label: value.sub_title, path: value.paths }
            })
            this.facilityModel = this.facilities[0]
          }

          this.listOtherService = data.service.filter(item => item.type === 'shop').map(item => item.product)
          // this.listAgency = data.golfers.filter(item => item.agency_id != null).map(item => {
          //   return { value: item.agency_id, label: item.agency_name }
          // })
          const surcharge = data.golfers.map(item => item.surcharge_facility_id).flat().map(item => item.booking_code_surcharge_facility)
          this.listSurcharge = surcharge.filter((obj, index) => {
            return index === surcharge.findIndex(o => obj.id === o.id)
          })
          if (data.order_type === 1) {
            this.isShowHIO = false
          } else {
            this.isShowHIO = true
          }
          console.log('...........data.service..', data.service)
          // data_service_shop = data.service.filter(service => service.type === 'shop')
          const resultMap = new Map()

          data.service.forEach(item => {
            const key = item.transaction_provider_id

            if (!resultMap.has(key)) {
              resultMap.set(key, { ...item })
            } else {
              resultMap.get(key).name_product += ` + ${item.name_product}`
              resultMap.get(key).price += item.price * item.quantity
              resultMap.get(key).quantity = 1
            }
          })

          // Chuyển kết quả từ Map thành mảng
          const resultArray = Array.from(resultMap.values())

          const convert_service_data = resultArray.map(item => ({
            ...item,
            type_purchase: item.type === 'other_service' ? (+item.bookingOutside?.status === 1 && !item.bookingOutside?.type_purchase ? 12 : item.bookingOutside?.type_purchase) : (item.type === 'shop' ? (+item.status_payment === 1 && !item?.type_purchase ? 12 : item.type_purchase) : (item.type === 'hio' ? item.is_cancel > 0 ? 14 : item?.hio_info?.is_customer_pay : 0)),
            date_payment: item.type === 'other_service' ? item.bookingOutside.date_payment : item.type === 'shop' ? item.date_payment : '',
            date_agent_payment: item.type === 'other_service' ? item.bookingOutside.date_agent_payment : '',
            host_user_id: item.type === 'other_service' ? item.bookingOutside.user_id : (item.type === 'shop' ? item?.user_id ? item?.user_id : data.host_user_id : data.host_user_id)
          }))

          const convert_service = convert_service_data.map(item => ({
            ...item,
            type_refund: item.type_purchase === 14 ? -1 : null

          }))

          this.clone_convert_service = JSON.parse(JSON.stringify(convert_service))
          this.postForm = {
            ...data,
            dayPlayed: moment(data.pax?.date_played).format('DD-MM-YYYY'),
            timePlayed: '',
            pax: data.pax,
            service: convert_service,
            order_type: data.order_type,
            host_user_id: data.host_user_id,
            path_id: data.pax?.path_id,
            total_price: 0,
            type_hole: data.type_hole,
            pax_id: data.pax?.id,
            insurance_pax: data.insurance_pax,
            insurance_pax_d20: data.insurance_pax_d20,
            note: data.note
          }
          const data_service_hio = data.service.filter(item => +item.id === 2)
          if (data_service_hio?.length > 0) {
            this.listHoldInOne = data_service_hio.map((hio) => ({ id: hio.hio_info.id, total_pay: hio.hio_info.total_pay }))
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    listUserDEteleHioSendPVI(data) {
      const resultArray = []

      // Đối tượng dùng để theo dõi các user_id đã xử lý
      const processedUserIds = {}

      // Hàm để tìm kiếm đối tượng theo user_id trong mảng kết quả

      // Lặp qua mảng ban đầu
      data.forEach(item => {
        const userId = item.user_id

        // Nếu user_id đã được xử lý, thêm options_money_id và id vào các mảng tương ứng
        if (processedUserIds[userId]) {
          const existingUser = resultArray.find(user => user.id === userId)
          existingUser.insurance_pax.push(item.options_money_id)
          existingUser.insurance_id_pax.push(item.id)
        } else {
          // Nếu user_id chưa được xử lý, tạo đối tượng mới và thêm vào mảng kết quả
          const newUser = {
            user_id: userId,
            name: item?.User?.fullname,
            insurance_pax: [item.options_money_id],
            insurance_id_pax: [item.id],
            is_deleted: 1
          }
          resultArray.push(newUser)

          // Đánh dấu user_id đã được xử lý
          processedUserIds[userId] = true
        }
      })

      return resultArray
    },
    handleUpdate() {
      const format = this.listGolfers.map(item => ({
        ...item,
        date_payment: item.date_payment ? moment(item.date_payment).format('yyyy-MM-DD HH:mm:ss') : '',
        date_agent_payment: item.date_agent_payment ? moment(item.date_agent_payment).format('yyyy-MM-DD HH:mm:ss') : ''
      }))
      const data = {
        insurance_pax_d20: this.dataRequest.insurance_pax_d20,
        list_hio: this.dataRequest.list_hio,
        refund: this.postForm.refund,
        service: this.postForm.service,
        general_bill_id: this.postForm.general_bill_id,
        pax_id: this.postForm.pax_id,
        note: this.dataRequest?.note,
        customer_invoice: this.dataRequest?.customer_invoice,
        revenue_price: this.dataRequest?.revenue_price
      }
      console.log('...............{ data: this.dataRequest, list_golfer}..........', {
        status_bill: this.status_bill, isSTB: this.isSTB, data: data, list_golfer_booking: format, check_exist_not_payment: this.check_exist_not_payment, listGolfers_old: this.clone_listGolfers,
        convert_service_old: this.clone_convert_service })
      // return
      this.loadingSubmit = true
      bookingPaxResource.updateStatisticBill({
        status_bill: this.status_bill,
        isSTB: this.isSTB,
        data: data,
        list_golfer_booking: format,
        check_exist_not_payment: this.check_exist_not_payment,
        listGolfers_old: this.clone_listGolfers.map(item => ({ booked: { id: item?.booked?.id, type_purchase: item?.booked?.type_purchase }}))
        // convert_service_old: this.clone_convert_service
      }).then(async(res) => {
        this.handleClose()
      }).finally(() => {
        this.loadingSubmit = false
      })
    },

    onSearchAgency(keyword) {
      this.loadingSearchAgency = true
      searchResource.searchAgency({ keyword_agency: keyword.trim() }).then(res => {
        this.loadingSearchAgency = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.listAgency = data
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
    handlePriceService(key) {
      const service = this.postForm.service[key]
      // service.amount = service.price * service.quantity
      return formatNumber(service.price)
    },
    convertHio(arr, insurance_provider, user_id) {
      console.log('data_hio.........', this.data_hio)
      console.log('insurance_provider.........', insurance_provider)
      return this.listInsurrance.filter(
        item => arr.includes(+item.value))
        .map((item, i) => `${item.label} - BH${insurance_provider?.find(item2 => +item2.options_money_id === +item.value)?.id} - 
        ${formatNumber(item.price)}đ 
        ${insurance_provider?.find(item2 => +item2.options_money_id === +item.value)?.is_cancel > 0 ? '(Đã hủy)'
  : insurance_provider?.find(item2 => +item2.options_money_id === +item.value)?.is_customer_pay === 1 ? '(Đã thanh toán)' : '(Chưa thanh toán)'}`)
        .join(', ')
    },
    convertListTypePurchaseChild(service) {
      if (+service.id === -1) {
        return this.listTypePurchaseChildService
      } else if (+service.id === 2) {
        if (+service.type_purchase === 1) {
          return [
            { value: 1, label: 'Đã thanh toán' },
            { value: 14, label: 'Đã hủy' }
          ]
        } else {
          return [
            { value: 0, label: 'Chưa thanh toán' },
            { value: 1, label: 'Đã thanh toán' },
            { value: 14, label: 'Đã hủy' }
          ]
        }
      } else if (+service.id === 1) {
        const clone_array = [...this.listTypePurchaseChildService]
        if (+service.status_payment === 1) {
          return clone_array.slice(1)
        } else {
          return clone_array
        }
      }
      return []
    },
    handleClose() {
      this.listGolfers = []
      this.clone_listGolfers = []
      this.postForm = {}
      this.check_exist_not_payment = true
      this.dataRequest = {
        type_purchase: ''
        // date_payment: ''
      }
      this.indexGolfer = null
      this.indexService = null
      this.clone_convert_service = []
      this.dialogShowOTP = false
      this.otp = ''
      this.$emit('closeDialog', { dialog: false, reload: false })
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
.border-1 {
  border: 1px solid #ccc;
  border-radius: 15px;
}

.pb-10 {
  padding-bottom: 10px;
}

.p-10 {
  padding: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-20 {
  margin-bottom: 20px;
}
</style>
