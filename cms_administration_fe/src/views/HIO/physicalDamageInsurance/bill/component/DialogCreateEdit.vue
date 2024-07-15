<template>
  <el-dialog
    style="margin-top: 30px !important;"
    :title="!isEmptyObject(dataEdit) ? 'Cập nhật đơn hàng' : 'Thêm mới đơn hàng'"
    :visible.sync="dialogFormVisible"
    width="95%"
    :before-close="handleClose"
  >
    <el-row class="dialog-insurance">
      <el-col :sm="6" class="pr-lg-5" :disabled="!isEmptyObject(dataEdit)">
        <el-row>
          <el-col class="mb-2">
            <label>Tên giải đấu: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-input v-model="postForm.name_tour" :disabled="!isEmptyObject(dataEdit)" class="w-100" placeholder="Nhập tên giải đấu" />
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col class="mb-2">-->
        <!--            <label>Xác nhận giải outing:</label>-->
        <!--            <div class="clearfix-5" />-->
        <!--            <el-checkbox v-model="postForm.is_outing" :disabled="!isEmptyObject(dataEdit)">Outing</el-checkbox>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row>
          <el-col class="mb-2">
            <label>Tìm kiếm người đại diện mua BH: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <div class="search-golfer">
              <search-user :data-model="dataEdit.User" :object="dataEdit" :clear-data="clearUser" :disabled="!isEmptyObject(dataEdit)" @selection-changed-user="handleSelectionChangedUser" />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="mb-2">
            <label>Phần trăm hoàn cho user mua: <span class="required" /></label>
            <div class="clearfix-5" />
            <el-input
              v-model="postForm.percent_refund"
              :disabled="!isEmptyObject(dataEdit)"
              class="w-100"
              placeholder="Nhập số phần trăm"
              @input="handleInputReGex('percent_refund', '[^0-9.]')"
            />
          </el-col>
          <!--          <el-col :span="12" class="mb-2">-->
          <!--            <label>Telesale: <span class="required" /></label>-->
          <!--            <div class="clearfix-5" />-->
          <!--            <el-input v-model="postForm.percent_refund" class="w-100" placeholder="Chọn telesale" />-->
          <!--          </el-col>-->
        </el-row>
        <el-row>
          <el-col class="mb-2">
            <label>Chọn sản phẩm: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-select
              v-model="materialModel"
              :disabled="!isEmptyObject(dataEdit)"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm sản phẩm"
              :remote-method="onSearchProductMaterial"
              @change="handleSelectionChangeMaterial"
            >
              <el-option
                v-for="material in materials"
                :key="material.id"
                :label="material.label"
                :value="material"
              />
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb-2">
            <label>Chọn số người chơi: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-select
              v-model="postForm.option_material_covered"
              :disabled="!isEmptyObject(dataEdit)"
              class="w-100"
              clearable
              filterable
              remote
              placeholder="Chọn số người chơi"
            >
              <el-option
                v-for="option in optionMaterialCovered"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb-2" :span="12">
            <label>Chọn sân đánh: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-select
              v-model="facilityModel"
              :disabled="!isEmptyObject(dataEdit)"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Tìm kiếm sân golf"
              :remote-method="onSearchFacility"
              @change="handleSelectionChangeFacility"
            >
              <el-option
                v-for="facility in facilities"
                :key="facility.id"
                :label="facility.label"
                :value="facility"
              />
            </el-select>
          </el-col>

          <el-col :span="12" class="mb-2">
            <label>Chọn hố: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-select
              v-model="holeModel"
              :disabled="!isEmptyObject(dataEdit)"
              class="w-100"
              filterable
              multiple
              remote
              clearable
              reserve-keyword
              placeholder="Nhập hố đánh"
              @change="handleSelectionHole"
            >
              <el-option
                v-for="hole in list_hole"
                :key="hole.id"
                :label="hole.label"
                :value="hole.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <label>Chọn golfer: </label>
          <el-row>
            <template>
              <el-radio v-model="chooseOptionGolfer" label="1">Người chơi trong hệ thống</el-radio>
              <el-radio v-model="chooseOptionGolfer" label="0">Người chơi ngoài hệ thống</el-radio>
            </template>
          </el-row>
          <el-row v-if="chooseOptionGolfer == '1'">
            <search-user @selection-changed-user="handleSelectionChangedUserBuyInsurance" />
          </el-row>
          <el-col v-else class="text-center">
            <el-input v-model="userOutSystem.user_name" placeholder="Nhập tên người chơi" class="w-100 mb-1" />
            <el-input v-model="userOutSystem.passport" placeholder="Nhập CCCD/Passport hoặc ngày sinh" class="w-100 mb-1" />
            <el-button size="mini" type="primary" @click="addUserOutSystem">Xác nhận thông tin</el-button>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :span="24" class="mb-2">-->
        <!--            <label>Người chơi ngoài hệ thống:</label>-->
        <!--            <div class="clearfix-5" />-->
        <!--            <el-input-->
        <!--              v-model="inputValue"-->
        <!--              placeholder="Tên người chơi"-->
        <!--              @keyup.enter.native="handleInputConfirm"-->
        <!--              @blur="handleInputConfirm"-->
        <!--            />-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-col class="mb-2">
          <label>Giá trị vật phẩm: <span class="required">*</span></label>
          <div class="clearfix-5" />
          <el-input v-model="postForm.price" :disabled="!isEmptyObject(dataEdit)" class="w-100" placeholder="Nhập giá trị vật phẩm" readonly />
        </el-col>
        <el-row>
          <el-col :span="24">
            <label>Chọn teetime: <span class="required">*</span></label>
          </el-col>
          <el-col class="mb-2" :span="24">
            <div class="clearfix-5" />
            <el-date-picker
              v-model="postForm.date_played"
              :disabled="!isEmptyObject(dataEdit)"
              type="datetime"
              value-format="timestamp"
              :picker-options="pickerOption"
              placeholder="Chọn ngày chơi"
              class="w-100"
              @change="handleChangeDatePlayed"
            />
          </el-col>
        </el-row>
        <el-row>
          <!--          <el-col class="mb-2" :span="12">-->
          <!--            <label>Trạng thái gửi đơn PVI : <span class="required">*</span></label>-->
          <!--            <div class="clearfix-5" />-->
          <!--            <el-select v-model="postForm.type_pay" class="w-100" placeholder="Chọn trạng thái gửi đơn PVi">-->
          <!--              <el-option-->
          <!--                v-for="item in optionsPay"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-col>-->
          <el-col class="mb-2" :span="24">
            <label>Chọn đại lý bán BH: <span class="required">*</span></label>
            <div class="clearfix-5" />
            <el-select
              v-model="postForm.agent_id"
              :disabled="!isEmptyObject(dataEdit)"
              filterable
              remote
              class="w-100"
              placeholder="Chọn đại lý"
              :remote-method="onSearchAgent"
              :loading="loadingSearchAgent"
            >
              <el-option
                v-for="agent in listAgency"
                :key="agent.id"
                :label="agent.name + ' - ' + agent.code_agent"
                :value="agent.id"
              />
            </el-select>
          </el-col>
          <el-col class="mb-2">
            <label>Ghi chú:</label>
            <div class="clearfix-5" />
            <el-input
              v-model="postForm.note"
              type="textarea"
              :rows="2"
              placeholder="Nội dung ghi chú"
            />
          </el-col>

        </el-row>
        <!--        <el-col class="mb-2">-->
        <!--          <label>Ghi chú:</label>-->
        <!--          <div class="clearfix-5" />-->
        <!--          <el-input-->
        <!--            v-model="postForm.note"-->
        <!--            :disabled="!isEmptyObject(dataEdit)"-->
        <!--            type="textarea"-->
        <!--            :rows="2"-->
        <!--            placeholder="Nội dung ghi chú"-->
        <!--          />-->
        <!--        </el-col>-->
      </el-col>
      <el-col :sm="18">
        <el-row class="box-search-golfer">
          <el-col :span="24">
            <label>Import File:</label>
          </el-col>
          <el-col :span="12">
            <upload-excel-insurance-physical-damage @onSetData="handleSetData" />
          </el-col>
          <el-col :span="12" class="text-center">
            <el-button type="primary" size="mini" icon="el-icon-download" @click="onDownloadExcelExample">
              Tải file mẫu
            </el-button>
          </el-col>
        </el-row>
        <el-row class="lists-data-passport" style="padding-top: 20px; padding-left: 10px; padding-bottom: 20px">
          <el-col :span="12">
            <label>Danh sách passport tham gia giải: </label>
          </el-col>
          <el-col :span="24" class="text-right">
            <div>
              <label>Số lượng golfer tham gia giải: {{ dataImport.length }}</label>
            </div>
            <div>
              <label>Danh sách golfer import lỗi: {{ listsGolferError.length }}</label>
            </div>
          </el-col>
          <div class="clearfix-5" style="padding-top: 20px" />
        </el-row>
        <el-row class="lists-data-golfer mb-5">
          <el-table border :data="listsGolfers" width="100%">
            <el-table-column label="STT" width="50">
              <template slot-scope="{row}">
                <strong>{{ row.index }}</strong>
              </template>
            </el-table-column>
            <el-table-column label="vID">
              <template slot-scope="{row}">
                <strong>{{ row.user_id }}</strong>
              </template>
            </el-table-column>
            <el-table-column label="Họ và tên">
              <template slot-scope="{row}">
                <strong>{{ row.user_name }}</strong>
              </template>
            </el-table-column>
            <el-table-column label="passport">
              <template slot-scope="{row}">
                <strong>{{ row.passport }}</strong>
              </template>
            </el-table-column>
            <el-table-column label="Hành động">
              <template slot-scope="{row}">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="onRemoveGofer(row)"
                >
                  Xóa
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="onGetList"
        />
        <el-row v-if="listsGolferError.length > 0">
          <el-col
            :span="24"
            class="pr-lg-5"
          >
            <label class="text-center">Danh sách golfer import lỗi</label>
            <el-col class="mb-1">
              <strong>STT:</strong>
              <template v-for="(golferError, index) in listsGolferError">
                {{ golferError.index }}{{ index < listsGolferError.length - 1 ? ', ' : '' }}
              </template>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy bỏ</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitPostForm">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SearchUser from '@/views/component/SearchUser.vue'
import { isEmpty } from '@/utils/validate'
import UploadExcelInsurancePhysicalDamage
from '@/views/HIO/physicalDamageInsurance/bill/component/UploadExcelListGolferInsurance.vue'
import Pagination from '@/components/Pagination/index.vue'
import PhysicalDamegeInsurance from '@/api/HIO/physicalDamegeInsurance'
import AgentHIOResource from '@/api/HIO/agentHIO'
import { isEmptyObject } from 'jquery'
import { getAdmin } from '@/utils/auth'
import moment from 'moment'
// import { getAdmin } from '@/utils/auth'

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()
const agentHIOResource = new AgentHIOResource()

const defaultOptionPay = [
  { value: 0, label: 'Chưa xác nhận gửi PVI' },
  { value: 1, label: 'Xác nhận gửi PVI' }
]

const optionMaterialCovered = [
  { value: 1, label: 'Từ 0 - 200 người' },
  { value: 2, label: 'Từ 201 - 250 người' },
  { value: 3, label: 'Từ 250 - 350 người' },
  { value: 4, label: 'Trên 350 người' }
]

export default {
  name: 'DialogInsuranceBillForm',
  components: {
    Pagination,
    UploadExcelInsurancePhysicalDamage,
    SearchUser
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    dataEdit: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loadingDialog: false,
      inputValue: '',
      postForm: {},
      loadingSubmit: false,
      facilityModel: {},
      materialModel: {},
      holeModel: [],
      loadingSearchFacility: false,
      facilities: [],
      materials: [],
      holes: [],
      optionsPay: [...defaultOptionPay],
      listAgency: [],
      loadingSearchAgent: false,
      listsGolfers: [],
      listsGolferError: [],
      golferByInsurances: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      dataImport: [],
      pickerOption: {
        disabledDate: (time) => {
          // disable thời gian trước ngày hiện tại
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      list_hole: [],
      optionMaterialCovered: optionMaterialCovered,
      chooseOptionGolfer: '1', // 0: user ngoài hệ thống, 1: user trong hệ thống
      userOutSystem: {
        user_id: -1,
        user_name: '',
        passport: ''
      },
      clearUser: false,
      initListGolfer: []
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.handleClose()
      }
    },
    dataEdit(val) {
      if (!isEmpty(val)) {
        this.loadingDialog = true
        console.log('dataEdit.....................................', val)
        this.setDataDialog(val)
      }
    }
  },
  methods: {
    isEmptyObject,
    handleClose(isReload = false) {
      this.clearUser = true
      this.postForm = {}
      this.listsGolfers = []
      this.listsGolferError = []
      this.facilities = []
      this.facilityModel = {}
      this.materialModel = {}
      this.holeModel = []
      this.materials = []
      this.holes = []
      this.dataImport = []
      this.total = 0
      this.list_hole = []
      this.listQuery = {
        page: 1,
        limit: 10
      }
      console.log(this.facilities, this.facilityModel)
      console.log(this.list_hole, this.holeModel)
      this.$emit('closeDialog', { reload: isReload })
    },
    onSubmitPostForm() {
      console.log('ịdhsfíadhfaióhfáihf', getAdmin())
      this.loadingSubmit = true
      this.postForm.list_member = []
      if (!isEmptyObject(this.dataEdit)) {
        this.updateListGolfer()
        return
      }
      if (isEmpty(this.postForm.user_id)) {
        this.$message({
          message: 'Vui lòng chọn người đại diện',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }
      if (isEmpty(this.postForm.item_select)) {
        this.$message({
          message: 'Vui lòng chọn sản phẩm',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }
      if (isEmpty(this.postForm.facility_id)) {
        this.$message({
          message: 'Vui lòng chọn sân đánh',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }
      if (isEmpty(this.postForm.list_hole)) {
        this.$message({
          message: 'Vui lòng chọn hố đánh',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }
      if (this.postForm.date_played) {
        const selectedDate = moment(this.postForm.date_played)
        const today = moment()
        if (selectedDate.isBefore(today)) {
          this.$message({
            message: 'Vui lòng chọn teetime lớn hơn thời gian hiện tại ',
            type: 'error'
          })
          this.loadingSubmit = false
          return
        }
      }
      if (isEmpty(this.postForm.date_played)) {
        this.$message({
          message: 'Vui lòng chọn ngày đánh',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }
      if (parseInt(this.postForm.price) < 10000000) {
        this.$message({
          message: 'Vui lòng nhập giá trị sản phẩm lớn hơn 10.000.000 VNĐ',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }
      if (!this.validateNumberUser(this.listsGolfers.length, parseInt(this.postForm.option_material_covered))) {
        this.$message({
          message: 'Số lượng người tham gia không hợp lệ',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }

      this.postForm.date_played = this.postForm.date_played / 1000
      // loại những user không có user_id và trả về dạng mảng chỉ có key user_id
      this.dataImport.forEach((golfer) => {
        console.log('golfer', golfer)
        if (golfer.user_id && parseInt(golfer.user_id) > 0) {
          this.postForm.list_member.push({ user_id: golfer.user_id, user_name: golfer.user_name })
        } else {
          this.postForm.list_member.push({ user_id: -1, user_name: golfer.user_name, identity_number: parseInt(golfer.passport) })
        }
      })
      this.postForm.sale_id = getAdmin().id
      this.postForm.sale_name = getAdmin().name

      console.log('this.postForm', this.postForm)

      physicalDamageInsuranceProductResource.createMaterialCovered(this.postForm).then(res => {
        if (res.error_code === 0) {
          this.$message({
            message: 'Tạo mới thành công',
            type: 'success'
          })
          this.$emit('onGetList')
          this.handleClose(true)
        } else {
          this.$message({
            message: res.error_msg,
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    handleSelectionChangedUser(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.postForm.user_id
        return
      }
      this.postForm.user_id = value.value
    },
    onGetListFacilities() {
      this.$emit('onGetListFacilities')
    },
    onSearchAgent(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchAgent = true
      agentHIOResource.searchAgentNew({ keyword: keywords }).then(res => {
        console.log('res', res)
        res = res.data
        if (res.error_code === 0) {
          this.listAgency = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        console.log('this.listAgency', this.listAgency)
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchAgent = false
    },
    onDownloadExcelExample() {
      const urlFile = `/import-golfer-hio-physical-example.xlsx`
      console.log('urlFile', urlFile)
      const link = document.createElement('a')
      link.href = urlFile
      link.setAttribute('download', 'File_import_list_golfer')
      document.body.appendChild(link)
      link.click()
    },
    paginateData() {
      // phân trang với danh sách user
      this.total = this.dataImport.length
      const start = (this.listQuery.page - 1) * this.listQuery.limit
      const end = this.listQuery.page * this.listQuery.limit
      this.listsGolfers = [...this.dataImport.slice(start, end)]
    },
    handleSetData(data, dataError) {
      if ((this.dataImport.length >= 200 && this.postForm.option_material_covered === 1) || (this.dataImport.length >= 250 && this.postForm.option_material_covered === 2) || (this.dataImport.length >= 350 && this.postForm.option_material_covered === 3)) {
        this.$message({
          message: 'Số lượng golfer vượt quá giới hạn',
          type: 'warning'
        })
        return
      }

      this.listsGolferError = [...dataError]

      // lặp qua mảng data. nếu phần tử tồn tại trong mảng dataImport thì cảnh báo, nếu chưa thì thêm vào mảng dataImport
      data.forEach((item) => {
        let index = -1
        if (!isEmpty(item.user_id) && item.user_id !== -1) {
          index = this.dataImport.findIndex(itemGolfer => itemGolfer.user_id === item.user_id)
        } else {
          index = this.dataImport.findIndex(itemGolfer => itemGolfer.passport === item.passport)
        }
        if (index !== -1) {
          this.$message({
            message: `Golfer ${item.user_name} đã tồn tại trong danh sách`,
            type: 'warning'
          })
        } else {
          this.dataImport.push(item)
        }
      })

      // this.dataImport = this.dataImport.concat(data)
      console.log('this.dataImport', this.dataImport)
      // phân trang với danh sách user
      this.total = this.dataImport.length
      this.resetIndexListGolfer()
      this.paginateData()
      console.log('this.initListGolfer---------------------------------------', this.initListGolfer)
    },
    onRemoveGofer(item) {
      const index = this.listsGolfers.findIndex(itemGolfer => itemGolfer.index === item.index)
      console.log('index', index)
      if (index !== -1) {
        this.listsGolfers.splice(index, 1)
      }

      // xóa golfer trong mảng import
      const indexImport = this.dataImport.findIndex(itemGolfer => itemGolfer.index === item.index)
      console.log('indexImport', indexImport)
      if (indexImport !== -1) {
        this.dataImport.splice(indexImport, 1)
      }

      this.resetIndexListGolfer()
      this.paginateData()
    },
    handleInputReGex(model, regexText) {
      console.log('model', model)
      console.log('regex', regexText)
      console.log('this.postForm[model]', this.postForm[model])
      const regex = new RegExp(regexText, 'g')
      this.postForm[model] = this.postForm[model].replace(regex, '')
      // if (!regex.test(value)) {
      //   this.postForm.uid_buy = ''
      // }
    },
    handleSelectionChanged(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.postForm.facility_id
        return
      }
      this.postForm.facility_id = value.value
      console.log('this.listQuery.facility_id', this.postForm)
    },
    onGetList() {
      this.total = this.dataImport.length
      const start = (this.listQuery.page - 1) * this.listQuery.limit
      const end = this.listQuery.page * this.listQuery.limit
      this.listsGolfers = [...this.dataImport.slice(start, end)]
    },
    async onSearchFacility(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchFacility = true
      const request = {
        q: keywords
      }
      physicalDamageInsuranceProductResource.listFacilitySale(request).then(res => {
        this.loadingSearchFacility = false
        const arr = []
        res.data.forEach(item => {
          arr.push({
            id: item.id,
            label: item.sub_title,
            value: item
          })
        })
        this.facilities = arr
        console.log('res', this.facilities)
      }).catch(err => {
        this.loadingSearchFacility = false
        console.log('err', err)
      })
    },
    handleSelectionChangeFacility(value) {
      console.log('value', value)
      console.log('this.facilityModel.............', this.facilityModel)
      this.holeModel = []
      this.list_hole = []
      if (isEmpty(value)) {
        delete this.postForm.facility_id
        this.holes = []
        this.postForm.list_hole = []
        return
      }
      console.log('holes', this.list_hole)

      this.postForm.facility_id = value.id
      console.log('this.listQuery.facility_id', this.postForm)

      // bỏ các giá trị null trong danh sahcs hố
      this.holes = value.value.ListHoleInsurrance.filter(item => item !== null)
      const arr = []
      this.holes.forEach((item) => {
        arr.push({
          id: item.id,
          label: 'Hố ' + item.stt + ' - Đường ' + item.path_name,
          value: item
        })
      })
      this.list_hole = arr

      console.log('holes', this.list_hole)
    },
    handleSelectionChangedUserBuyInsurance(value) {
      console.log('value', value, isEmpty(value))
      if (isEmpty(value)) {
        return
      }

      if ((this.dataImport.length >= 200 && this.postForm.option_material_covered === 1) || (this.dataImport.length >= 250 && this.postForm.option_material_covered === 2) || (this.dataImport.length >= 350 && this.postForm.option_material_covered === 3)) {
        this.$message({
          message: 'Số lượng golfer vượt quá giới hạn',
          type: 'warning'
        })
        return
      }

      const dataUser = {
        index: 0,
        user_id: value.value,
        indexImport: 1,
        system_avatar_path: 'https://livenet.vhandicap.com/images/av.png',
        user_name: value.label,
        is_not_found: false
      }

      // ktra xem user đã tồn tại trong danh sách chưa dataImport nếu tồn tại caảnh báo đã tồn tại, nếu chưa tồn tại thì thêm vào
      const index = this.dataImport.findIndex(item => item.user_id === dataUser.user_id)
      if (index !== -1) {
        this.$message({
          message: 'Người dùng đã tồn tại trong danh sách',
          type: 'warning'
        })
        return
      } else {
        this.dataImport.push(dataUser)
      }
      console.log('this.dataImport', this.dataImport)
      this.resetIndexListGolfer()
      this.onGetList()
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        const dataUser = {
          index: 0,
          user_id: -1,
          indexImport: 1,
          system_avatar_path: 'https://livenet.vhandicap.com/images/av.png',
          user_name: inputValue,
          is_not_found: false
        }
        this.dataImport.push(dataUser)
        this.resetIndexListGolfer()
        this.onGetList()
      }
      this.inputValue = ''
    },
    resetIndexListGolfer() {
      this.dataImport.forEach((item, index) => {
        item.index = index + 1
        item.user_id = item.user_id ? item.user_id : -1
      })
      this.total = this.dataImport.length
    },
    onSearchProductMaterial(keywords) {
      const request = {
        q: keywords,
        is_public: 1
      }
      physicalDamageInsuranceProductResource.listMaterialCovered(request).then(res => {
        console.log('res', res)
        if (res.error_code === 0) {
          const arr = []
          res.data.forEach(item => {
            arr.push({
              id: item.id,
              label: item.name,
              value: item
            })
          })
          this.materials = arr
        }
        console.log('materials', this.materials)
      }).catch(err => {
        console.log('err', err)
      })
    },
    handleSelectionChangeMaterial(value) {
      console.log('value............handleSelectionChangeMaterial', value)
      if (isEmpty(value)) {
        delete this.postForm.item_select
        delete this.postForm.price
        return
      }
      this.postForm.item_select = value.value
      this.postForm.price = value.value.price
      console.log('this.postForm.item_select', this.postForm)
    },
    handleSelectionHole(value) {
      console.log('value', value)
      console.log(this.holes)
      const arr = []
      value.forEach(item => {
        console.log('item', item)
        // lấy thông tin hố với id
        const hole = this.holes.find(hole => hole.id === item)
        console.log('hole', hole)
        if (hole) {
          hole.is_selected = 1
          arr.push(hole)
        }
      })
      this.postForm.list_hole = arr
      console.log('this.postForm.list_hole', this.postForm)
      console.log('this.holeModel', this.holeModel)
    },
    addUserOutSystem() {
      console.log(this.userOutSystem)
      // if (isEmpty(this.userOutSystem.passport) || isEmpty(this.userOutSystem.user_name)) {
      //   this.$message({
      //     message: 'Vui lòng nhập đầy đủ thông tin',
      //     type: 'warning'
      //   })
      //   return
      // }

      if ((this.dataImport.length >= 200 && this.postForm.option_material_covered === 1) || (this.dataImport.length >= 250 && this.postForm.option_material_covered === 2) || (this.dataImport.length >= 350 && this.postForm.option_material_covered === 3)) {
        this.$message({
          message: 'Số lượng golfer vượt quá giới hạn',
          type: 'warning'
        })
        return
      }

      this.dataImport.push(this.userOutSystem)
      this.resetIndexListGolfer()
      this.paginateData()
      this.userOutSystem = {
        user_id: -1,
        user_name: '',
        passport: ''
      }
      console.log(this.dataImport)
    },
    async setDataDialog(data) {
      console.log('this.dataDialog...........1111111111111111111111111', data)
      this.postForm.name_tour = data.name_tour
      this.materialModel = {
        id: data.ProductInfo.id,
        label: data.ProductInfo.name,
        value: data.ProductInfo
      }
      this.materials = [this.materialModel]
      this.postForm.option_material_covered = data.option_material_covered
      console.log('this.postForm.option_material_covered', typeof this.postForm.option_material_covered, this.postForm.option_material_covered)

      this.facilityModel = {
        id: data.facility_id,
        label: data.course_name,
        value: { id: data.facility_id, name: data.course_name }
      }
      this.facilities = [this.facilityModel]

      // lấy danh sách id hole trong mảng data.ListHoleInspector
      this.holeModel = data.ListHoleInspector.map(item => item.list_position[0].id_hole)
      this.list_hole = data.ListHoleInspector.map(item => {
        return {
          id: item.list_position[0].id_hole,
          label: item.name_hole
        }
      })

      this.postForm.date_played = data.date_played_timestamp

      this.postForm.price = data.ProductInfo.price

      this.dataImport = await data.ListUserMaterialCovered.map((item, index) => {
        console.log('item', item)
        return {
          user_id: item.user_id,
          user_name: isEmpty(item.Users) ? item.name_user : item.Users.fullname,
          passport: item.passport,
          index: index
        }
      })

      this.initListGolfer = await data.ListUserMaterialCovered.map((item, index) => {
        console.log('item', item)
        return {
          user_id: item.user_id,
          user_name: isEmpty(item.Users) ? item.name_user : item.Users.fullname,
          passport: item.passport,
          index: index,
          id: item.id
        }
      })

      // this.dataImport = this.initListGolfer

      this.resetIndexListGolfer()
      this.paginateData()
      console.log('this.listsGolfers,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', this.listsGolfers)
      console.log('this.facilities.................', this.facilities)
      console.log('this.initListGolfer.............................', this.initListGolfer)
    },
    async updateListGolfer() {
      if (!this.validateNumberUser(this.listsGolfers.length, parseInt(this.postForm.option_material_covered))) {
        this.$message({
          message: 'Số lượng người tham gia không hợp lệ',
          type: 'error'
        })
        this.loadingSubmit = false
        return
      }

      const dataAdd = {
        id_material_covered: this.dataEdit.id,
        cms_id: getAdmin().id,
        list_user_add: []
      }

      const dataRemove = {
        id_material_covered: this.dataEdit.id,
        cms_id: getAdmin().id,
        list_user_add: [],
        list_member: []
      }

      console.log('this.initListGolfer.............................', this.initListGolfer)

      // lặp qua mảng initListGolfer kiểm tra phần tử đó có còn trong mảng dataImport hay không
      this.initListGolfer.forEach((golfer) => {
        console.log('golfer', golfer)
        const index = this.dataImport.findIndex(item => {
          console.log('item', item)
          if (item.user_id === golfer.user_id && item.user_id !== -1) {
            return true
          } else if (item.user_id === -1 && parseInt(item.passport) === parseInt(golfer.passport)) {
            return true
          }
          return false
        })
        if (index === -1) {
          dataRemove.list_member.push({ user_id: golfer.user_id, user_name: golfer.user_name, id: golfer.id, passport: golfer.passport })
        }
      })

      // lặp qua mảng dataImport lấy những phần tử không có trong mảng initListGolfer
      this.dataImport.forEach((golfer) => {
        console.log('golfer', golfer)
        const index = this.initListGolfer.findIndex(item => {
          console.log('item', item)
          if (item.user_id === golfer.user_id && item.user_id !== -1) {
            return true
          } else if (item.user_id === -1 && parseInt(item.passport) === parseInt(golfer.passport)) {
            return true
          }
          return false
        })
        if (index === -1) {
          if (golfer.user_id && parseInt(golfer.user_id) > 0) {
            dataAdd.list_user_add.push({ user_id: golfer.user_id, user_name: golfer.user_name })
          } else {
            dataAdd.list_user_add.push({ user_id: -1, user_name: golfer.user_name, identity_number: parseInt(golfer.passport) })
          }
        }
      })

      console.log('data', dataAdd)

      if (dataAdd.list_user_add.length > 0) {
        await physicalDamageInsuranceProductResource.addUserMaterial(dataAdd).then(res => {
          if (res.error_code === 0) {
            this.$message({
              message: 'Cập nhật thành công',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.error_msg,
              type: 'error'
            })
          }
          this.loadingSubmit = false
        }).catch(err => {
          console.log('err', err)
          this.$message({
            message: err,
            type: 'error'
          })
          this.loadingSubmit = false
        })
      }

      if (dataRemove.list_member.length > 0) {
        await physicalDamageInsuranceProductResource.removeUserFromOrder(dataRemove).then(res => {
          if (res.error_code === 0) {
            this.$message({
              message: 'Cập nhật thành công',
              type: 'success'
            })
          } else {
            this.$message({
              message: 'Cập nhật thất bại',
              type: 'error'
            })
          }
          this.loadingSubmit = false
        }).catch(err => {
          console.log('err', err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }

      this.loadingSubmit = false
      this.handleClose(true)
      this.onGetList()
    },
    handleChangeDatePlayed(date) {
      console.log('date--------------------change', date)

      // kiểm tra thời gian chọn so với thời gian 10h sáng ngày hiện tại format định dạng timestamp
      const timeDay10h = moment(moment().format('YYYY-MM-DD 10:00:00')).unix()
      console.log('now', timeDay10h)

      // kiểm tra thời gian giờ của date có nằm trong khoảng từ 6h đến 18h không
      const hour = moment(date).format('HH')
      console.log('hour', hour)
      if (hour < 6 || hour > 18) {
        // this.$message({
        //   message: 'Thời gian chọn phải nằm trong khoảng từ 6h đến 18h',
        //   type: 'error'
        // })
        // this.postForm.date_played = ''
        return
      }

      if (date / 1000 <= timeDay10h) {
        // this.$message({
        //   message: 'Thời gian chọn phải lớn hơn thời gian hiện tại cộng thêm 4 tiếng',
        //   type: 'error'
        // })
        // this.postForm.date_played = ''
        return
      }

      // kiểm tra thời gian chọn có lớn hơn thời gian hiện tại cộng thêm 4 tiếng hay không
      const timeNow = moment().unix()
      console.log('timeNow', timeNow)
      if (date / 1000 <= timeNow + 14400) {
        // this.$message({
        //   message: 'Thời gian chọn phải lớn hơn thời gian hiện tại cộng thêm 4 tiếng',
        //   type: 'error'
        // })
        // this.postForm.date_played = ''
        return
      }

      const timeDay18hCurrent = moment(moment().format('YYYY-MM-DD 18:00:00')).unix()
      const timeDay6hCurrent = moment(moment().format('YYYY-MM-DD 06:00:00')).unix()
      const timeDay14hCurrent = moment(moment().format('YYYY-MM-DD 14:00:00')).unix()

      // lấy thời gian 6h sáng ngày hôm sau so với thời gian hiện tại
      const timeDayBefore6h = moment(moment().add(1, 'days').format('YYYY-MM-DD 06:00:00')).unix()
      const timeDayBefore10h = moment(moment().add(1, 'days').format('YYYY-MM-DD 10:00:00')).unix()

      console.log('timeDayBefore6h', timeDayBefore6h)
      console.log('timeDay18h', timeDay18hCurrent)

      if (timeNow > timeDay18hCurrent && date / 1000 < timeDayBefore10h) {
        // this.$message({
        //   message: 'Thời gian chọn phải lớn hơn 4h so với 6h sáng ngày hôm sau',
        //   type: 'error'
        // })
        // this.postForm.date_played = ''
        return
      }
      console.log(date / 1000, timeDayBefore10h, timeDayBefore6h, timeNow, timeDayBefore6h - timeNow)

      if (timeNow < timeDay18hCurrent && timeNow > timeDay14hCurrent && (date / 1000) < timeDayBefore6h + (timeNow - timeDay14hCurrent)) {
        // console.log('avvvvvvvvvvvvvvvvv')
        // this.$message({
        //   message: 'Thời gian chọn không đúng',
        //   type: 'error'
        // })
        // this.postForm.date_played = ''
        return
      }

      if (timeNow < timeDay6hCurrent && date / 1000 < timeDay6hCurrent + 14400) {
        // console.log('vao day.................')
        // this.$message({
        //   message: 'Thời gian chọn không đúng',
        //   type: 'error'
        // })
        // this.postForm.date_played = ''
        return
      }
    },
    validateNumberUser(numberUser, optionListUser) {
      console.log('numberUser', numberUser)
      console.log('optionListUser', optionListUser)

      return !((optionListUser === 1 && numberUser > 200) || (optionListUser === 2 && numberUser > 250 && numberUser < 201) || (optionListUser === 3 && numberUser > 350 && numberUser < 250) || (optionListUser === 4 && numberUser < 350))
    }
  }
}
</script>

<style>
.required {
  color: red;
}
</style>
