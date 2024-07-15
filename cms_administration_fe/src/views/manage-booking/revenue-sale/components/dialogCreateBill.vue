<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="95%" :before-close="handleClose">
    <div
      v-loading="loadingDialog"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-row class="p-10 border-1 pb-10 mb-10">
        <el-row class="dialog-add-golfer pb-10">
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Loại đơn</label>
            <br>
            <el-select v-model="postForm.order_type" label="Loại đơn" placeholder="Loại Đơn" @change="changeOrderType">
              <el-option v-for="item in order_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Người nhân hoàn tiền</label>
            <br>
            <el-select v-model="postForm.host_user_id" clearable placeholder="Người thanh toán và nhận hoàn tiền">
              <el-option
                v-for="item in listGolfers.filter(value =>value.user_id != -1)"
                :key="item.user_id"
                :label="`VID${item.user_id} - ${item.name_out_system}`"
                :value="item.user_id"
              />
            </el-select>
          </el-col>
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Loại hố</label>
            <br>
            <el-select v-model="postForm.type_hole" :disabled="!isAdd" placeholder="Loại hố">
              <el-option v-for="item in typeHole" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Sân</label>
            <br>
            <el-select
              v-model="facilityModel"
              :disabled="!isAdd"
              class="w-100"
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm sân golf"
              :remote-method="onSearchFacility"
              :loading="loadingSearchFacility"
            >
              <el-option v-for="facility in facilities" :key="facility.value" :label="facility.label" :value="facility" />
            </el-select>
          </el-col>
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Đường</label>
            <br>
            <el-select
              v-model="postForm.path_id"
              :disabled="Object.keys(facilityModel).length === 0 || !isAdd"
              clearable
              placeholder="Chọn đường"
            >
              <el-option v-for="item in paths" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Ngày</label>
            <br>
            <el-date-picker
              v-model="postForm.dayPlayed"
              :disabled="Object.keys(facilityModel).length === 0 || !isAdd"
              :picker-options="pickerOption"
              type="date"
              format="dd/MM/yyyy"
              value-format="dd-MM-yyyy"
              placeholder="Chọn ngày"
            />
          </el-col>
          <el-col v-if="isShowHIO" class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Bảo hiểm giải đấu</label>
            <br>
            <el-select v-model="postForm.insurance_pax" clearable placeholder="Chọn bảo hiểm">
              <el-option v-for="item in listInsurrance" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col class="p-10">
            <el-button :disabled="!isAdd" type="primary" size="mini" @click="searchTeeTime">Tìm Tee Time</el-button>
          </el-col>
          <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <label>Teetime</label>
            <br>
            <el-select
              ref="selectPax"
              v-model="postForm.pax_id"
              :disabled="!isAdd"
              style="width: 100%"
              clearable
              filterable
              placeholder="Chọn Teetime"
              @change="changePax"
            >
              <el-option
                v-for="item in listPax"
                :key="item.id"
                :disabled="item.booked.length > 0"
                :class="[item.is_lock == 1 ? 'is-lock' : '']"
                :label="convertTimestampToDateTime(item.date_played, 'HH:mm') + ' - ' + formatNumber(convertPriceHole(item, postForm.type_hole)) + ' đ/pax'"
                :value="item.id"
              >
                <span style="float: left">{{ convertTimestampToDateTime(item.date_played, 'HH:mm') + ' - ' +
                  formatNumber(convertPriceHole(item, postForm.type_hole)) + ' đ/pax' }}</span>
                <i v-if="item.is_lock == 1 && item.booked.length < 1" class="el-icon-lock" />
                <span v-if="item.booked.length > 0" style="margin-left: 20px"> Đã booked</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>

      </el-row>

      <el-row class="p-10 border-1 mb-10">
        <el-row class="dialog-add-golfer">
          <el-col :xs="24" :sm="16" :md="12" :lg="10" :xl="6">
            <el-radio-group v-model="isInsideVhandicap">
              <el-radio :label="1"> Người chơi có mã VID</el-radio>
              <el-radio :label="0"> Người chơi ngoài hệ thống</el-radio>
            </el-radio-group>
          </el-col>

          <el-col
            :xs="24"
            :sm="{ span: 2, offset: 4 }"
            :md="{ span: 2, offset: 9 }"
            :lg="{ span: 2, offset: 12 }"
            :xl="{ span: 2, offset: 16 }"
          >
            <el-upload ref="upload" action="uploadURL" :on-change="onChangeFileExcel" :auto-upload="false" :limit="1">
              <el-button type="primary">Import Golfer</el-button>
            </el-upload>
          </el-col>
          <div class="clearfix-10" />
          <el-col v-show="listGolfers.length > 0">
            <el-col>
              <label>Danh sách người chơi: </label>
            </el-col>
            <el-col>
              <el-tag
                v-for="(golfer, key) in listGolfers"
                :key="key"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(golfer)"
              >
                {{ golfer.user_id == -1 ? `(OUT) ` + golfer.name_out_system : `VID${golfer.user_id} - ` + golfer.name_out_system }}
              </el-tag>
            </el-col>
          </el-col>
          <div class="mb-10" />
          <el-col>
            <el-row>
              <el-col v-if="isInsideVhandicap === 0">
                <label>Họ và tên:</label>
                <el-col>
                  <el-input
                    v-if="inputVisible"
                    ref="saveTagInput"
                    v-model="inputValue"
                    placeholder="Tên người chơi"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  />
                  <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">Thêm người
                  </el-button>
                </el-col>
              </el-col>
              <el-col v-else>
                <el-select
                  v-model="golferModel"
                  class="w-100"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Tìm kiếm mã VID"
                  :remote-method="onSearchGolfer"
                  :loading="loadingSearchUser"
                >
                  <el-option v-for="user in users" :key="user.value" :label="`VID${user.value} - ${user.label}`" :value="user" />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
          <div class="clearfix-10" />
          <div class="clearfix-10" />
          <el-col v-show="isBooking === 0">
            <el-col class="text-center">
              <el-tag type="warning"><i>Sân này hiện tại chưa mở bán gói tee time nào, vui lòng chọn sân
                khác</i>
              </el-tag>
            </el-col>
          </el-col>
        </el-row>

        <el-row v-if="listGolfers.length > 0" class="data-table-content table-responsive">
          <span class="mb-20"><b>Danh sách Golfer: </b></span>
          <table class="table table-bordered" style="vertical-align: center">
            <thead>
              <tr>
                <th class="text-center col-3 vertical-middle" style="min-width: 180px">Tên</th>
                <th scope="col" class="text-center" style="min-width: 180px">SĐT</th>
                <th scope="col" class="text-center" style="min-width: 180px">CCCD</th>
                <th scope="col" class="text-center" style="min-width: 180px">Bảo hiểm</th>
                <th scope="col" class="text-center" style="min-width: 180px">Bảo hiểm giải</th>
                <th scope="col" class="text-center" style="min-width: 180px">Đại lý</th>
                <!-- <th scope="col" class="text-center" style="min-width: 180px">Phụ phí</th> -->
                <th scope="col" class="text-center" style="min-width: 180px">Thành tiền</th>
                <th scope="col" class="text-center" style="min-width: 180px">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(golfer, key) in listGolfers" :key="key">
                <th style="text-align: left" class="col-3">
                  {{ golfer.user_id == -1 ? `(OUT) ` + golfer.name_out_system : `VID${golfer.user_id} - ` + golfer.name_out_system }}
                </th>
                <td>
                  <el-input v-model="listGolfers[key].phone" :disabled="golfer.user_id != -1" />
                </td>
                <td>
                  <el-input v-model="listGolfers[key].cccd" />
                </td>
                <td>
                  <el-select v-model="listGolfers[key].insurance_pax" clearable filterable placeholder="Chọn Bảo hiểm">
                    <el-option v-for="item in listInsurrance" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </td>
                <td>
                  <el-select v-model="postForm.insurance_pax" placeholder="Bảo hiểm giải" disabled>
                    <el-option v-for="item in listInsurrance" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </td>
                <td>
                  <el-select v-model="listGolfers[key].agency_id" clearable filterable placeholder="Chọn Đại lý">
                    <el-option v-for="item in listAgency" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </td>
                <!-- <td>
                  <el-select
                    v-model="listGolfers[key].surcharge_facility_id"
                    clearable
                    multiple
                    filterable
                    placeholder="Chọn Phụ phí"
                  >
                    <el-option v-for="item in listSurcharge" :key="item.id" :label="item.title" :value="item.id" />
                  </el-select>
                </td> -->
                <td style="text-align: center" class="vertical-middle">
                  <span>{{ handlePriceByGolfer(key) }} đ</span>
                </td>
                <td style="text-align: center" class="vertical-middle">
                  <el-button v-if="golfer.user_id === -1" type="primary" size="mini" @click="mapUserByPhone(golfer,key)">Tạo VID</el-button>
                  <el-button type="danger" size="mini" @click="handleCloseTag(golfer)">Xóa</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>
      </el-row>

      <el-row v-if="listGolfers.length > 0" class="p-10 border-1 mb-10">
        <el-row class="data-table-content table-responsive">
          <label>Danh sách Dịch vụ đi kèm</label>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center col-2 vertical-middle" style="min-width: 180px">Tên dịch vụ</th>
                <th scope="col" class="text-center col-2" style="min-width: 180px">Mã hàng</th>
                <th scope="col" class="text-center" style="min-width: 180px">Đơn giá</th>
                <th scope="col" class="text-center" style="min-width: 180px">Số lượng</th>
                <th scope="col" class="text-center" style="min-width: 180px">Thành tiền</th>
                <th scope="col" class="text-center" style="min-width: 180px">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="postForm.service.length > 0">
                <template v-for="(service, key_service) in postForm.service">
                  <tr :key="key_service">
                    <th style="vertical-align: center" class="col-2">
                      <el-select
                        v-model="postForm.service[key_service].id"
                        class="w-100"
                        placeholder="Chọn dịch  vụ"
                        clearable
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
                      <el-select
                        v-if="postForm.service[key_service].id !== -1 && postForm.service[key_service].id !== 2"
                        ref="otherService"
                        v-model="postForm.service[key_service].commodity_code_id"
                        class="w-100"
                        :disabled="postForm.service[key_service].id == null"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="Tìm kiếm sản phẩm..."
                        :remote-method="onSearchOtherService"
                        :loading="loadingSearchProduct"
                        @change="changeProduct(key_service)"
                      >
                        <el-option v-for="item in listOtherService" :key="item.id" :label="item.name + ' - ' + formatNumber(item.price_sale) + 'đ'" :value="item.id" />
                      </el-select>
                      <el-select
                        v-if="postForm.service[key_service].id == 2"
                        v-model="postForm.service[key_service].hio_id"
                        class="w-100"
                        :disabled="postForm.service[key_service].id == null"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="Nhập mã HIO..."
                        :remote-method="onSearchInsurrance"
                        :loading="loadingSearchInsurrance"
                        @change="changeHoleInOne(key_service)"
                      >
                        <el-option v-for="item in listHoleInOne" :key="item.id" :label="'BH'+item.id + ' - ' + formatNumber(item.total_pay) + 'đ'" :value="item.id" />
                      </el-select>
                      <el-input
                        v-if="postForm.service[key_service].id == -1"
                        v-model="postForm.service[key_service].name_other_service"
                        placeholder="Nhập tên dịch vụ"
                        clearable
                      />
                    </td>
                    <td class="text-center">
                      <el-input-number
                        v-model="postForm.service[key_service].price"
                        :disabled="postForm.service[key_service].id == null"
                        :min="0"
                        :step="50000"
                      />
                    </td>
                    <td class="text-center">
                      <el-input-number
                        v-model="postForm.service[key_service].quantity"
                        :disabled="postForm.service[key_service].id == null"
                        :min="1"
                        :max="1000"
                        :step="1"
                      />
                    </td>
                    <td class="vertical-middle text-center">
                      <span>{{ handlePriceService(key_service) }} đ</span>
                    </td>
                    <td class="vertical-middle text-center">
                      <el-button type="danger" size="mini" @click="handleCloseService(service)">Xóa</el-button>
                    </td>
                  </tr>
                </template>
              </template>

              <tr v-else>
                <td colspan="6" class="text-center">Chưa có dịch vụ đi kèm</td>
              </tr>
            </tbody>
          </table>
          <el-row class="text-center">
            <el-button class="text-center" @click="addService">Thêm dịch vụ</el-button>
          </el-row>

        </el-row>

      </el-row>
      <el-row v-if="listGolfers.length > 0" class="p-10 mb-10">
        <el-input
          v-model="postForm.note"
          type="textarea"
          placeholder="Note"
        />
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Hủy bỏ</el-button>
        <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm">{{
          dialog.buttonName
        }}</el-button>
      </span>

    </div>
  </el-dialog>
</template>

<script>
import { convertTimestampToDateTime, formatNumber } from '@/utils/convert'
import FacilityResource from '@/api/facility/facility'
import GolferResource from '@/api/golfer/golfer'
import AgencyResource from '@/api/agency/agency'
import BookingPaxResource from '@/api/BookingPax'
import CodeSurchargeFacility from '@/api/CodeSurchargeFacility'
import { listOrderType, listHIO, listService, listTypeHole } from '@/utils/defaultOptions'
import { isEmpty } from '@/utils/validate'
import { getAcountInfo } from '@/utils/auth'
import { Message } from 'element-ui'
import * as XLSX from 'xlsx'
import moment from 'moment'

const golferResource = new GolferResource()
const facilityResource = new FacilityResource()
const bookingPaxResource = new BookingPaxResource()
const agencyResource = new AgencyResource()
const codeSurchargeFacility = new CodeSurchargeFacility()

export default {
  name: 'DialogAddGolfer',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
      value: false
    },
    objectDataProduct: {
      type: Object,
      default() {
        return {}
      }
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    bill: {
      type: Object,
      default() {
        return {}
      }
    },
    listInsurrance: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      inputVisible: false,
      dialogVisible: false,
      isInsideVhandicap: 1,
      isShowHIO: false,
      listGolfers: [],
      postForm: {
        dayPlayed: '',
        timePlayed: '',
        is_d20: 0,
        pax: null,
        service: [],
        order_type: 1,
        host_user_id: null,
        path_id: null,
        total_price: 0,
        type_hole: 18,
        insurance_pax: 0
      },
      loadingSearchUser: false,
      loadingSearchFacility: false,
      inputValue: '',
      golferModel: {},
      users: [],
      facilities: [],
      facilityModel: {},
      isBooking: -1,
      loadingSubmit: false,
      tableData: [],
      listPax: [],
      baseUrl: '/',
      listAgency: [],
      listHIO: listHIO,
      listHoleInOne: [],
      listSurcharge: [],
      listService: listService,
      order_type: listOrderType,
      paths: [],
      typeHole: listTypeHole,
      dataPax: {},
      loadingDialog: false,
      fileExcel: null,
      listOtherService: [],
      loadingSearchProduct: false,
      loadingSearchInsurrance: false,
      showDialogDetailService: false,
      keyService: null,
      dialog: { titleName: 'Tạo Booking Tee Time', buttonName: 'Thêm mới' },
      bill_id: null,
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() < moment().subtract(3, 'day')
        }
      }
    }
  },
  computed: {

  },
  watch: {
    golferModel(value) {
      const checkExist = this.listGolfers.filter(item => item.user_id === value.value)
      if (checkExist.length > 0) {
        this.$message.warning('VID đã được chọn.')
        return
      }
      console.log(checkExist)
      if (!isEmpty(value)) {
        const golfer = {
          user_id: value.value,
          name_out_system: value.label,
          phone: value.phone,
          agency_id: null,
          surcharge_facility_id: [],
          cccd: ''
        }
        this.listGolfers.push(golfer)
        console.log(this.listGolfers)
      }
    },
    facilityModel(value) {
      if (!isEmpty(value)) {
        this.paths = value.path
        console.log('paths', this.paths)
        this.isBooking = value.booking
        this.postForm.facility_id = value.value
        this.getListSurchargeFacility(value.value)
      }
    },
    objectDataProduct(value) {
      console.log('objectDataProduct.......................', value)
      const service = this.postForm.service[this.keyService]
      console.log('service......................', service)
      service.quantity = value.quantity
      service.price = value.price
      service.size = value.size
      service.color = value.color
      service.name_product = value.name_product
      service.product = value.product
      console.log('  this.postForm.service[this.key_service]................', this.postForm.service[this.keyService])
    },
    bill(value) {
      console.log('..................value', value)
      if (!isEmpty(value)) {
        this.bill_id = value.general_bill_id
        this.onGetDetail(value.general_bill_id)
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Tạo Booking Tee Time', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật Booking Tee Time', buttonName: 'Cập nhật' })
      }
    }
  },
  created() {
    this.getListAgent()
  },
  methods: {
    async onSubmitForm() {
      const error_msg = await this.validateFrom()
      if (error_msg) {
        this.$message.warning(error_msg)
        return
      }
      if (this.isAdd) {
        this.onSubmitAddGolfer()
      } else {
        this.onSubmitUpdate()
      }
    },
    async onSubmitAddGolfer() {
      this.loadingSubmit = true

      const res = await this.checkTimeMoneyInsurance()
      if (res && res.error_code === 2) {
        this.$message.error(res.message)
        return
      }
      const data = {
        ...this.postForm,
        golfers: this.listGolfers,
        cms_id: getAcountInfo().id ? getAcountInfo().id : 62
      }

      console.log('body request.........', data)
      bookingPaxResource.createBooking(data).then(res => {
        if (res.error_code === 0) {
          if (res.error_msg.error_code === 0) {
            this.$message.success('Tạo mới thành công')
          } else {
            this.$message.error(res.error_msg.error_msg)
          }
          this.$emit('clickButtonDialogAddGolfer', true)
          this.resetDataModal()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    onSubmitUpdate() {
      this.loadingSubmit = true
      const data = {
        ...this.postForm,
        bill_id: this.bill_id,
        golfers: this.listGolfers,
        cms_id: getAcountInfo().id ? getAcountInfo().id : 62
      }
      bookingPaxResource.updateBooking(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('Cập nhập thành công.')
          this.$emit('clickButtonDialogAddGolfer', true)
          this.resetDataModal()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async checkTimeMoneyInsurance() {
      const pax = this.listPax.find(item => item.id === this.postForm.pax_id)
      const arr = []
      for (let i = 0; i < this.listGolfers.length; i++) {
        const golfer = this.listGolfers[i]
        if (golfer.user_id !== -1 && (!isEmpty(golfer.insurance_pax) || !isEmpty(this.postForm.insurance_pax))) {
          const arrInsurance = [golfer.insurance_pax, this.postForm.insurance_pax].filter(item => !isEmpty(item))
          arr.push({
            date_played: moment(pax.date_played).format('YYYY-MM-DD HH:mm:ss'),
            user_id: golfer.user_id,
            options_money_id: arrInsurance
          })
        }
      }
      if (arr.length > 0) {
        const res = await bookingPaxResource.checkTimeMoneyInsurance({ dataGolfer: arr })
        return res.data
      } else {
        return null
      }
    },
    async validateFrom() {
      const message = null
      if (this.listGolfers.length === 0) {
        return 'Bạn cần phải chọn người chơi!'
      }
      const golferOut = this.listGolfers.filter(item => item.user_id === -1)
      if (golferOut.length === this.listGolfers.length) {
        return 'Cần có mã VID để thanh toán. Vui lòng tạo mã VID!'
      }
      // if (this.isBooking === -1) {
      //   return 'Bạn cần phải chọn sân đánh!'
      // }
      if (this.postForm.host_user_id == null) {
        return 'Bạn cần phải chọn người thanh toán!'
      }
      return message
    },
    async onGetDetail(id) {
      this.loadingDialog = true
      await bookingPaxResource.detailBill({ bill_id: id }).then(res => {
        if (res.error_code === 0) {
          const data = res.data
          console.log(data)
          this.listGolfers = data.golfers.map(value => {
            return {
              ...value,
              user_id: value.id,
              name_out_system: value.name,
              surcharge_facility_id: value.surcharge_facility_id.map(item => item.code_surcharge_facility_id)
            }
          })

          this.facilities = [data.pax.facility].map(value => {
            return { value: value.id, label: value.sub_title, path: value.paths }
          })
          this.facilityModel = this.facilities[0]
          this.listOtherService = data.service.filter(item => item.type === 'shop').map(item => item.product)
          this.postForm = {
            dayPlayed: moment(data.pax.date_played).format('DD-MM-YYYY'),
            timePlayed: '',
            is_d20: 0,
            pax: data.pax,
            service: data.service,
            order_type: data.order_type,
            host_user_id: data.host_user_id,
            path_id: data.pax.path_id,
            total_price: 0,
            type_hole: data.type_hole,
            pax_id: data.pax.id,
            insurance_pax: data.insurance_pax,
            note: data.note
          }
          if (data.order_type === 1) {
            this.isShowHIO = false
          } else {
            this.isShowHIO = true
          }
          bookingPaxResource.searchTeeTime({
            facility_id: data.pax.facility_id,
            path_id: data.pax.path_id,
            date_played: moment(data.pax.date_played).format('DD-MM-YYYY')
          }).then(res => {
            if (res.error_code === 0) {
              this.listPax = res.data
            }
          })
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    handleCloseTag(golfer) {
      this.listGolfers.splice(this.listGolfers.indexOf(golfer), 1)
    },
    handleCloseService(service) {
      this.postForm.service.splice(this.postForm.service.indexOf(service), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      // if (isEmpty(this.postForm.pax_id)) {
      //   this.$message.warning('Bạn chưa chọn Tee Time')
      //   return
      // }
      const inputValue = this.inputValue
      if (inputValue) {
        const golfer = {
          user_id: -1,
          name_out_system: inputValue,
          phone: '',
          agency_id: null,
          surcharge_facility_id: [],
          cccd: ''
        }
        this.listGolfers.push(golfer)
        console.log('this.listGolfers', this.listGolfers)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    resetDataModal() {
      this.isBooking = -1
      this.facilityModel = {}
      this.golferModel = {}
      this.listGolfers = []
      this.postForm = {
        dayPlayed: '',
        timePlayed: '',
        is_d20: 0,
        pax: null,
        service: [],
        order_type: 1,
        host_user_id: null,
        path_id: null,
        total_price: 0,
        type_hole: 18,
        insurance_pax: 0
      }
    },
    handleClose() {
      this.$emit('clickButtonDialogAddGolfer', false)
      this.resetDataModal()
    },
    onSearchFacility(keyword) {
      this.postForm.path_id = null
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, booking: value.booking, path: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSearchGolfer(keyword) {
      // if (isEmpty(this.postForm.pax_id)) {
      //   this.$message.warning('Bạn chưa chọn Tee Time')
      //   return
      // }
      const params = { keyword: keyword }
      this.loadingSearchUser = true
      golferResource.searchGolfer(params).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              return { value: value.id, label: value.fullname, phone: value.phone || '' }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSearchInsurrance(id) {
      const query = {
        page: 1,
        limit: 10,
        id: id
      }
      bookingPaxResource.searchInsurance(query).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.error_code === 0) {
            this.listHoleInOne = result?.data
            console.log(' this.listHoleInOne.............................', this.listHoleInOne)
          }
        }
      })
    },
    getListAgent() {
      agencyResource.searchAgency().then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.listAgency = result.map(value => {
              return { value: value.id, label: value.name }
            })
          } else {
            this.listAgency = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    addService() {
      this.postForm.service.push({ id: null, commodity_code_id: null, price: null, quantity: null, amount: null })
    },
    searchTeeTime() {
      this.listPax = []
      this.loadingDialog = true
      this.postForm.pax = null
      bookingPaxResource.searchTeeTime({
        facility_id: this.facilityModel.value,
        path_id: this.postForm.path_id,
        date_played: this.postForm.dayPlayed
      }).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.$message.success('Tìm Tee Time Thành công. Vui lòng chọn Tee Time')
            this.listPax = res.data
          } else {
            this.$message.warning('Không tìm thấy Tee Time.')
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    getListSurchargeFacility(facility_id) {
      codeSurchargeFacility.lists({ facility_id: facility_id }).then(res => {
        if (res.error_code === 0) {
          this.listSurcharge = res.data
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    changePax(value) {
      const paxLock = this.listPax.find((item) => item.id === value && item.is_lock === 1)
      if (!isEmpty(paxLock)) {
        if (confirm('Tee đang khóa. Bạn có muốn mở Tee ?')) {
          bookingPaxResource.updateLockPax({ id: this.postForm.pax_id, is_lock: 0 }).then(res => {
            if (res.error_code === 0) {
              this.$message.success(res.error_msg)
              this.listPax = this.listPax.map(item => {
                if (item.id === value) item.is_lock = 0
                return item
              })
            } else {
              this.$message.error(res.error_msg)
              delete this.postForm.pax_id
            }
          })
        } else {
          delete this.postForm.pax_id
        }
      }
    },
    changeOrderType(value) {
      if (value === 2) {
        this.isShowHIO = true
      } else {
        this.isShowHIO = false
        this.postForm.insurance_pax = 0
      }
    },
    convertPriceHole(pax, type) {
      if (pax) {
        let price = null
        switch (type) {
          case 9:
            price = pax.price_9_hole
            break
          case 18:
            price = pax.price_18_hole
            break
          case 27:
            price = pax.price_27_hole
            break
          default:
            price = pax.price_18_hole
            break
        }
        return +price
      }
    },
    async onChangeFileExcel(value, array) {
      // if (isEmpty(this.postForm.pax_id)) {
      //   this.$message.warning('Bạn chưa chọn Tee Time')
      //   array.pop()
      //   return
      // }
      if (value?.name.includes('%') || value?.name.includes('#') || value?.name.includes('/')) {
        Message({
          message: `Tên file khồng được chứa ký tự %, # và /`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else if (value?.raw?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng file là XLSX`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else {
        console.log(value.raw)
        this.fileExcel = value.raw
        const reader = new FileReader()
        reader.onload = (e) => {
          var data = e.target.result
          var workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const rowObject = XLSX.utils.sheet_to_json(worksheet, { header: ['user_id', 'name_out_system', 'phone', 'cccd'] })
          rowObject.shift()
          let isOk = true
          if (rowObject.length > 0) {
            const arrUserId = rowObject.filter(item => item.user_id).map(item => +item.user_id)
            golferResource.getInGolfer({ users_id: arrUserId }).then(res => {
              const result = res.data
              const existingUserIds = result.map(user => user.id)
              const nonExistingUserIds = arrUserId.filter(id => !existingUserIds.includes(id))
              if (nonExistingUserIds.length > 0) {
                Message({
                  message: `không tồn tại mã VID ${nonExistingUserIds}`,
                  type: 'warning',
                  duration: 8 * 1000
                })
                isOk = false
                return
              } else {
                for (let i = 0; i < rowObject.length; i++) {
                  const row = rowObject[i]
                  if (isEmpty(row['user_id'])) row['user_id'] = -1
                  if (row['user_id'] === -1 && isEmpty(row['name_out_system'])) {
                    this.$message.warning(`Hàng thứ ${i + 1} yêu cầu có mã VID hoặc Tên KH ngoài hệ thống  !`)
                    isOk = false
                    break
                  } else {
                    isOk = true
                  }

                  if (row['user_id'] !== -1) {
                    const user = result.find(item => item.id === row['user_id'])
                    row['name_out_system'] = user.fullname
                  }
                  delete row['fullName']
                }
                if (isOk) {
                  console.log('................rowObject', rowObject)
                  this.$message.success('Import Golfer success.')
                  this.listGolfers = [...this.listGolfers, ...rowObject]
                }
              }
            })
          } else {
            this.$message.warning('Không có bản ghi.')
            return
          }
        }
        reader.readAsBinaryString(value.raw)
        array.pop()
        // this.$refs.upload.clearFiles()
      }
    },
    handlePriceByGolfer(key) {
      const golfer = this.listGolfers[key]
      golfer.price = 0
      const pax = this.listPax.find(item => item.id === this.postForm.pax_id)
      const pricePax = this.convertPriceHole(pax, this.postForm.type_hole)
      golfer.price += pricePax
      if (golfer.insurance_pax) {
        const insurance = this.listInsurrance.find(item => item.value === golfer.insurance_pax)
        golfer.price += insurance ? insurance.price : 0
      }
      if (this.postForm.insurance_pax) {
        const insurance = this.listInsurrance.find(item => item.value === this.postForm.insurance_pax)
        golfer.price += insurance ? insurance.price : 0
      }
      if (golfer['surcharge_facility_id'] && golfer['surcharge_facility_id'].length > 0) {
        this.listSurcharge.filter(item => golfer['surcharge_facility_id'].includes(item.id))
          .map(item => {
            if (item.discount_by === 1) {
              const discount = pricePax * (pricePax / 100)
              if (item.type_method === 1) {
                if (+discount > item.max_discount) {
                  golfer.price += item.last_price ? item.last_price : +item.max_discount
                } else {
                  golfer.price += item.last_price ? item.last_price : +discount
                }
              } else {
                if (+discount > item.max_discount) {
                  golfer.price -= item.last_price ? item.last_price : +item.max_discount
                } else {
                  golfer.price -= item.last_price ? item.last_price : +discount
                }
              }
            } else {
              if (item.type_method === 1) {
                golfer.price += item.last_price ? item.last_price : item.amount
              } else {
                golfer.price -= item.last_price ? item.last_price : item.amount
              }
            }
          })
      }

      return this.formatNumber(golfer.price)
    },
    onSearchOtherService(value) {
      const query = {
        page: 1,
        limit: 20,
        q: value
      }
      this.loadingSearchProduct = true
      bookingPaxResource.searchOtherService(query).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.error === 0) {
            this.listOtherService = result?.list
          }
        } else {
          this.$message.error('Đã có lỗi xảy ra. Vui lòng liên hệ bộ phận kỹ thuật.')
        }
      }).finally(() => {
        this.loadingSearchProduct = false
      })
    },
    changeProduct(key) {
      this.keyService = null
      const data = this.postForm.service[key]
      this.$emit('openDialogDetailProduct', { service_id: +data.commodity_code_id })
      this.keyService = key
    },
    changeService(key) {
      const service = this.postForm.service[key]
      switch (service.id) {
        case 1:
          service.type = 'shop'
          break
        case 2:
          service.type = 'hio'
          break
        case -1:
          service.type = 'other_service'
          break
        default:
          break
      }
    },
    changeHoleInOne(key) {
      const service = this.postForm.service[key]
      const hio = this.listHoleInOne.find(item => item.id === service.hio_id)
      service.price = hio.total_pay
      service.quantity = 1
      service.hio_info = hio
    },
    handlePriceService(key) {
      const service = this.postForm.service[key]
      service.amount = service.price * service.quantity
      return formatNumber(service.amount)
    },
    mapUserByPhone(golfer, key) {
      if (isEmpty(golfer.phone)) {
        this.$message.warning('SDT không được bỏ trống.')
        return
      }
      const checkExist = this.listGolfers.find(item => item.phone === golfer.phone && item.user_id !== -1)
      if (!isEmpty(checkExist)) {
        this.$message.warning(`SDT ${checkExist.phone} tương ứng mã VID${checkExist.user_id} đã được chọn .`)
        return
      }
      const bodyRequest = {
        phone: golfer.phone,
        fullname: golfer.name_out_system
      }
      bookingPaxResource.mapUserByPhone(bodyRequest).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          const user = this.listGolfers[key]
          user.user_id = result.id
          user.name_out_system = result.fullname
          user.phone = result.phone
          this.$message.success('Tạo mã VID thành công.')

          console.log(res)
        }
      })
    },
    convertTimestampToDateTime, formatNumber

  }
}
</script>

<style lang="scss" scoped>
.is-lock {
  background: #bfc0c2;
}

.el-icon-lock {
  float: right;
  color: #ffff;
  margin-top: 10px
}

.dialog-add-golfer {
  .mb-10 {
    margin-bottom: 10px;
  }

  .clearfix-10 {
    height: 10px;
    clear: both;
  }

  .w-100 {
    width: 100%;
  }
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 10px;
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

.table>tbody>tr>th {
  vertical-align: middle !important;
}

.vertical-middle {
  vertical-align: middle !important;
}
</style>
