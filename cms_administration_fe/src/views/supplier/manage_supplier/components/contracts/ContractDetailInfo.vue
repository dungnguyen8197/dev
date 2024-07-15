<template>
  <div class="id">

    <el-row class="search-wrapper">
      <el-row :sm="24" style="display: flex; justify-content: space-between">
        <el-col
          :sm="12"
          style="justify-content: flex-start; display: flex; align-items: center"
        >
          <h3>I. {{ "Thông tin chi tiết" }}</h3>
        </el-col>
        <el-col
          style="justify-content: flex-end; display: flex; align-items: center"
        >
          <el-button
            v-if="!isNew && approve < 1"
            type="primary"
            style="margin-left: 10px; font-size: 16px; font-weight: 400"
            @click="onEditPress"
          >{{ "Chỉnh sửa" }}</el-button>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-col :sm="24">
          <el-row :sm="24" class="row-row-first">
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Tên hợp đồng" }}<span style="color: red">*</span></label>
                <el-input
                  v-model="name"
                  :disabled="disable"
                  style="margin-top: 10px"
                  :placeholder="'Nhập tên hợp đồng'"
                />
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Người ký hợp đồng"
                }}<span style="color: red">*</span></label>
                <el-select
                  v-model="signer_id"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="'Chọn người ký hợp đồng'"
                >
                  <el-option
                    v-for="signer in list_signer"
                    :key="signer.id"
                    :label="signer.name"
                    :value="signer.id"
                  />
                </el-select>
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Loại hợp đồng" }}<span style="color: red">*</span></label>
                <el-select
                  v-model="type"
                  class="select-item"
                  :disabled="disable"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="'Chọn loại hợp đồng'"
                >
                  <el-option
                    v-for="contract_type in contract_types"
                    :key="contract_type.id"
                    :label="contract_type.name"
                    :value="contract_type.id"
                  />
                </el-select>
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label class="item-label">{{ "File hợp đồng" }}</label>
                <el-upload
                  :file-list="fileList"
                  class="upload-demo"
                  :action="urlBaseApi"
                  multiple
                  name="image"
                  :on-preview="handlePreview"
                  :on-success="handleUploadImageSuccess"
                  :on-remove="handleRemoveImage"
                  :limit="3"
                  :on-exceed="handleExceed"
                  style="margin-top: 10px"
                  :disabled="disable"
                >
                  <!-- <el-input v-model="input" placeholder="Please input" /> -->
                  <el-button
                    :disabled="disable"
                    type="primary"
                  >Click to upload</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      jpg/png/pdf files with a size less than 5MB.
                    </div>
                  </template>
                </el-upload>
              </el-row>
            </el-col>
          </el-row>
          <el-row :sm="24" class="row-row">
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Ngày kí hợp đồng"
                }}<span style="color: red">*</span></label>
                <div class="demo-date-picker" style="width: 95%">
                  <el-date-picker
                    v-model="date_sign"
                    style="width: 95%; margin-top: 10px"
                    type="date"
                    :placeholder="'Chọn ngày ký hợp đồng'"
                    :disabled="disable"
                    format="dd/MM/yyyy"
                    @change="updateDateActivePickerOptions"
                  />
                <!-- </div> -->
                </div>
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label
                  class="item-label"
                >{{ "Ngày hợp đồng có hiệu lực"
                }}<span style="color: red">*</span></label>
                <div class="demo-date-picker">
                  <el-date-picker
                    v-model="date_active"
                    style="width: 95%; margin-top: 10px"
                    type="date"
                    :placeholder="'Chọn ngày hợp đồng có hiệu lực'"
                    :disabled="disable"
                    format="dd/MM/yyyy"
                    :picker-options="dateActivePickerOptions"
                  />
                <!-- </div> -->
                </div>
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label class="item-label">{{ "Ngày hết hạn" }}</label>
                <div class="demo-date-picker">
                  <el-date-picker
                    v-model="date_inactive"
                    style="width: 95%; margin-top: 10px"
                    type="date"
                    :placeholder="'Chọn ngày hết hạn'"
                    :disabled="disable"
                    format="dd/MM/yyyy"
                    :picker-options="dateActivePickerOptions"
                  />
                <!-- </div> -->
                </div>
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <div class="demo-date-picker">
                  <label class="item-label">{{ "Hạn thanh toán" }}</label>
                  <el-select
                    v-model="datePayment"
                    class="select-item"
                    :disabled="disable"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="Chọn ngày hạn thanh toán"
                  >
                    <el-option
                      :label="handle_display_1()"
                      :value="handle_display_1_value()"
                      :placeholder="'Nhập ngày'"
                      @click.native="handleDialogOptionClick1"
                    />
                    <el-option
                      :label="handle_display()"
                      :value="handle_display()"
                      :placeholder="'Nhập ngày'"
                      @click.native="handleDialogOptionClick"
                    />
                  </el-select>
                  <el-dialog
                    title="Nhập khoảng ngày đến hạn thanh toán:"
                    :visible.sync="outerVisible"
                    class="custom-dialog"
                  >
                    <div style="padding:15px">
                      <div>
                        <el-input-number
                          v-model="ranger_canculation_debt"
                          controls-position="right"
                          :min="1"
                          :max="31"
                          class="custom-input-number"
                          @change="handleChangenumber"
                        />
                      </div>
                      <div style="padding-left: 15px; padding-top:15px">
                        <el-checkbox v-model="checked7" @change="handleChangeCheckbox(7)">7 ngày</el-checkbox>
                      </div>
                      <div style="border-bottom: 1px solid #ccc;" />
                      <div style="padding-left: 15px;padding-top:15px">
                        <el-checkbox v-model="checked15 " @change="handleChangeCheckbox(15)">15 ngày</el-checkbox>
                      </div>
                      <div style="border-bottom: 1px solid #ccc;" />
                    </div>
                    <div style="text-align: right;">
                      <el-button type="primary" @click="handleSubmitDatePayment">
                        OK
                      </el-button>
                    </div>
                  </el-dialog>
                  <el-dialog
                    :visible.sync="outerVisible1"
                    class="custom-dialog"
                  >
                    <div style="padding:15px">
                      <div style="padding-bottom:20px">
                        <el-input
                          v-model="date_canculation_debts_input"
                          placeholder="Please input"
                          clearable
                          @change="handleChange"
                        />
                      </div>
                      <div style="padding-left: 15px; padding-top:15px; height: 250px; overflow-y: auto">
                        <div v-for="i in 31" :key="i">
                          <el-checkbox v-model="date_canculation_debts" :label="i" @change="handleChangeCheckbox1(value)"> Ngày {{ i }}</el-checkbox>
                        </div>
                      </div>

                    </div>
                    <div style="text-align: right;">
                      <el-button type="primary" @click="handleSubmitDatePayment1">
                        OK
                      </el-button>
                    </div>
                  </el-dialog>
                </div>
              </el-row>
            </el-col>
          </el-row>
          <!-- <el-row :sm="24" class="row-row">
            <el-col :sm="24">
              <el-row :sm="24" class="row-row-first">

                <el-col :sm="8" class="mb-10">
                  <el-row class="row-item"> -->
          <!-- <label class="item-label">{{ ('account_bank') }}</label>
                  <el-input v-model="bank_name" :disabled="disable" style="margin-top: 10px;" :placeholder="('input_bank_name')" /> -->
          <!-- </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row> -->
        </el-col>
      </el-row>
      <el-row :sm="24" style="display: flex; justify-content: space-between;padding-top:40px">
        <el-col
          :sm="12"
          style="justify-content: flex-start; display: flex; align-items: center"
        >
          <h3>
            II. {{ "Thông tin tài khoản quyết toán"
            }}<span style="color: red">*</span>
          </h3>
        </el-col>
        <el-col
          :sm="12"
          style="justify-content: flex-end; display: flex; align-items: center"
        >
          <el-button
            v-if="approve < 1"
            type="primary"
            style="margin-left: 10px; font-size: 16px; font-weight: 400"
            @click="onCreateBankAccount"
          >{{ "Thêm tài khoản ngân hàng mới" }}</el-button>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-col :sm="24">
          <el-row :sm="24" class="row-row-first">
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label class="item-label">{{ "Số tài khoản" }}</label>
                <el-input
                  v-model="account_id"
                  disabled
                  style="margin-top: 10px"
                  :placeholder="'Nhập số tài khoản'"
                />
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label class="item-label">{{ "Chủ tài khoản" }}</label>
                <el-input
                  v-model="account_name"
                  disabled
                  style="margin-top: 10px"
                  :placeholder="'Nhập tên chủ tài khoản'"
                />
              </el-row>
            </el-col>
            <el-col :sm="8" class="mb-10">
              <el-row class="row-item">
                <label class="item-label">{{ "Tên ngân hàng" }}</label>
                <el-input
                  v-model="bank_name"
                  disabled
                  style="margin-top: 10px"
                  :placeholder="'Nhập tên ngân hàng'"
                />
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row
        v-if="(isCreate || isUpdate) && shopId"
        class="list-shop__header"
        style="margin-top: 20px"
      >
        <el-col
          :sm="24"
          style="justify-content: flex-end; display: flex; align-items: center"
        >
          <!-- <div class="text-right"> -->
          <el-button type="warning" @click="onCancelPress">{{
            "Hủy bỏ"
          }}</el-button>
          <el-button type="primary" @click="onConfirmPress">{{
            "Xác nhận"
          }}</el-button>
        <!-- </div> -->
        </el-col>
      </el-row>
      <dialog-create-bank-account
        :show-dialog="onShowDialogCreate"
        @onClickButtonDialog="onHandlerEvent"
      />
    </el-row>
  </div>

</template>

<script>
// import ShopResource from '@/api/shop'
import ManageSupplierResource from '@/api/manage_supplier/index'
import { getAcountInfo } from '@/utils/auth'
import DialogCreateBankAccount from './DialogCreateBankAccount.vue'
import { isValidDate } from '@/utils/utils'

// const shopResource = new ShopResource()
const supplierResource = new ManageSupplierResource()
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER

export default {
  name: 'ContractDetailInfo',
  components: { DialogCreateBankAccount },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: Number,
      default() {
        return 0
      }
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const account = getAcountInfo()
    return {
      urlBaseApi: `${urlBaseApi}/post_cdn`,
      is_delete: account.is_delete,
      is_write: account.is_write,
      is_edit: account.is_edit,
      contract_detail: '',
      loadingTable: false,
      isCreate: false,
      isUpdate: false,
      onShowDialog: false,
      name: '',
      state: false,
      date_sign: null,
      date_active: null,
      date_inactive: null,
      dateActivePickerOptions: {
        disabledDate(time) {
          return false
        }
      },
      type: '',
      contract_types: [
        {
          id: 1,
          name: 'Đại lý'
        },
        {
          id: 2,
          name: 'Sàn thương mại điện tử'
        }
      ],
      datePayment_types: [
        {
          id: 1,
          name: 'Khoảng ngày'
        },
        {
          id: 2,
          name: 'Ngày cụ thể'
        }
      ],
      disable: !this.isNew,
      fileList: [],
      id: 0,
      list_signer: [],
      signer_id: null,
      account_id: '',
      account_name: '',
      bank_name: '',
      datePayment: null,
      onShowDialogCreate: false,
      bank_data: {},
      approve: 0,
      outerVisible: false,
      outerVisible1: false,
      ranger_canculation_debt: null,
      date_canculation_debts: [],
      date_canculation_debts_input: '',
      checked15: false,
      checked7: false,
      value: null
    }
  },
  watch: {
    date_inactive(val) {
      console.log('........ngay het han ', val, JSON.stringify(val))
    },
    outerVisible(val) {
      console.log(val, '11111')
    }
  },
  created() {
    console.log('............. shop id ', this.shopId)
    this.requestListSigner()
  },
  methods: {
    handleChangeCheckbox(value) {
      if (value === 7) {
        this.ranger_canculation_debt = 7
        this.checked15 = false
        this.datePayment = value + ' ngày sau ngày nhập'
      }
      if (value === 15) {
        this.ranger_canculation_debt = 15
        this.checked7 = false
        this.datePayment = value + ' ngày sau ngày nhập'
      }
      if (this.checked15 && this.checked7 === null) {
        this.datePayment = 'Khoảng ngày'
      }
    },
    handleChangeCheckbox1(value) {
      if (this.date_canculation_debts.includes(value)) {
        this.date_canculation_debts = this.date_canculation_debts.filter(item => item !== value)
        this.datePayment = 'Các ngày ' + this.date_canculation_debts.join(', ').replace(/, $/, '') + ' hàng tháng'
      } else {
        this.date_canculation_debts.push(value)
        this.datePayment = 'Các ngày ' + this.date_canculation_debts.join(', ').replace(/, $/, '') + ' hàng tháng'
      }
      // Cập nhật giá trị cho input
      this.date_canculation_debts_input = this.date_canculation_debts.join(', ').replace(/, $/, '')
    },
    handle_display_1() {
      return `Ngày cụ thể`
    },
    handle_display_1_value() {
      this.date_canculation_debts_input
      this.date_canculation_debts.join(', ').replace(/, $/, '')
    },
    handleSubmitDatePayment() {
      this.date_canculation_debts = []
      this.date_canculation_debts_input = ''
      this.outerVisible = false
    },
    handleSubmitDatePayment1() {
      this.outerVisible1 = false
      this.ranger_canculation_debt = null
      this.checked15 = false
      this.checked7 = false
    },
    handleChange(value) {
      this.datePayment = this.date_canculation_debts_input
      console.log(this.date_canculation_debts_input, '11111')
      console.log(value)
    },
    handleChangenumber(value) {
      this.datePayment = this.ranger_canculation_debt + ' ngày sau ngày nhập'
    },
    handleDialogOptionClick() {
      if (!this.outerVisible) {
        this.outerVisible = true
      }
    },
    handleDialogOptionClick1() {
      if (!this.outerVisible1) {
        this.outerVisible1 = true
      }
    },
    // handle_display_month_select() {
    //   if (this.date_canculation_debts && Array.isArray(this.date_canculation_debts)) {
    //     return this.date_canculation_debts
    //       .map((date) => {
    //         const parts = date.split('-')
    //         return `(${parts[0]}/${parts[1]}/${parts[2]})`
    //       })
    //       .join('-')
    //   } else {
    //     return 'Ngày cụ thể'
    //   }
    // },
    handle_display() {
      if (this.checked7 && Array.isArray(this.checked7)) {
        return this.checked7
      } else if (this.checked15 && Array.isArray(this.checked15)) {
        return this.checked15
      } else {
        return 'Khoảng ngày'
      }
    },

    // handleDateChange(value) {
    //   console.log(value, ' dạng chưa chuyển đổi')
    //   if (value && Array.isArray(value)) {
    //     this.date_canculation_debts = value
    //     this.datePayment = value
    //       .map((date) => {
    //         const parts = date.split('-')
    //         return `(${parts[0]}/${parts[1]}/${parts[2]})`
    //       })
    //       .join('-')
    //     console.log(value, '1111')
    //   } else {
    //     // Xử lý trường hợp giá trị không tồn tại
    //     this.date_canculation_debts = null
    //     this.datePayment = 'Ngày cụ thể'
    //   }
    // },

    updateDateActivePickerOptions() {
      const minDate = this.date_sign
      this.dateActivePickerOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(minDate).getTime()
        }
      }
    },
    setApprove(approve) {
      this.approve = approve
    },
    onHandlerEvent(obj) {
      const { data } = obj
      if (data) {
        console.log('............. is new ', this.isNew)
        if (!this.isNew) {
          // them sau
          const body = {
            account_id: data.account_id,
            account_name: data.account_name,
            bank_name: data.bank_name,
            contract_id: this.contract_detail.id
          }
          this.requestAddBankAccount(body, () => {
            this.account_id = data.account_id
            this.account_name = data.account_name
            this.bank_name = data.bank_name
            this.bank_data = data
          })
        } else {
          this.account_id = data.account_id
          this.account_name = data.account_name
          this.bank_name = data.bank_name
          this.bank_data = data
        }
      }
      this.onShowDialogCreate = false
    },
    requestAddBankAccount(body, callback = null) {
      this.loadingTable = true
      supplierResource
        .add_new_bank_account(body)
        .then((res) => {
          const { error, msg } = res
          this.loadingTable = false
          if (error === 0) {
            this.$message.success(msg)
            if (callback) {
              callback()
            }
          } else {
            this.$message.error(msg)
          }
        })
        .catch((_err) => {
          this.loadingTable = false
          this.$message.error('Có lỗi xảy ra, vui lòng quay lại sau!')
        })
    },
    onCreateBankAccount() {
      this.onShowDialogCreate = true
    },
    handlePreview(uploadFile) {
      console.log(' file upload preview', JSON.stringify(uploadFile))
      const { link } = uploadFile
      this.confirmDowload(link)
    },
    confirmDowload(url) {
      // this.getFileFromServer(url)
      window.open(url, '_blank')
    },
    async getFileFromServer(url) {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success(
          'Đã export thành công, vui lòng vào thư mục download để lấy'
        )
      }, 250)
      // const fileName = url.substring(url.lastIndexOf('/') + 1)
      // const response = await fetch(url)
      // const blob = await response.blob()
      // const newBlob = new Blob([blob])
      // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //   window.navigator.msSaveOrOpenBlob(newBlob)
      // } else {
      //   const objUrl = window.URL.createObjectURL(newBlob)
      //   const link = document.createElement('a')
      //   link.href = objUrl
      //   link.download = fileName
      //   link.click()
      //   setTimeout(() => {
      //     window.URL.revokeObjectURL(objUrl)
      //     this.$message.success(('export_success'))
      //   }, 250)
      // }
    },
    handleExceed(files, uploadFiles) {
      // ElMessage.warning(
      //   `The limit is 3, you selected ${files.length} files this time, add up to ${
      //     files.length + uploadFiles.length
      //   } totally`
      // )
    },
    handleUploadImageSuccess(response, file, files) {
      this.fileList.push({ url: response.name, name: file.name })
      console.log(
        '.......... handleUploadImageSuccess : ',
        response.name,
        JSON.stringify(file)
      )
      this.$emit('onChangeUploadImage', this.fileList)
    },
    handleRemoveImage(file, files) {
      this.$emit('onChangeUploadImage', files, file)
      this.fileList = []
    },
    requestListSigner() {
      supplierResource.list_signer().then((res) => {
        const { error, data } = res
        if (error === 0) {
          this.list_signer = [...data]
        }
      })
    },
    /**
     * Xác nhận cấp nhật/ tạo mới người liên hệ
     */
    onConfirmPress() {
      console.log('.......... check confirm ', this.isCreate, this.isUpdate)
      if (this.isCreate) {
        this.requestCreatePersonReprensentative()
      } else if (this.isUpdate) {
        const body = this.checkBodyUpdate()
        if (body && Object.keys(body).length) {
          this.requestUpdate(body)
        }
      }
    },
    onCancelPress() {
      this.resetAllInfo()
      this.disable = true
      this.isUpdate = false
      this.isCreate = false
    },
    requestUpdate(body) {
      this.loadingTable = true
      supplierResource
        .update_contract(body)
        .then((res) => {
          const { error, msg } = res
          this.loadingTable = false
          if (error === 0) {
            this.$message.success(msg)
            this.disable = true
            this.isUpdate = false
            this.isCreate = false
          } else {
            this.$message.error(msg)
          }
        })
        .catch((_err) => {
          this.loadingTable = false
          this.$message.error('Có lỗi xảy ra, vui lòng quay lại sau!')
        })
    },
    resetData() {
      this.isCreate = false
      this.isUpdate = false
      this.fullname = ''
      this.email = ''
      this.position = ''
      this.passport = ''
      this.sex = 0
      this.contract_detail = ''
    },
    resetAllInfo() {
      if (this.isCreate) {
        this.fullname = ''
        this.email = ''
        this.position = ''
        this.passport = ''
        this.sex = 0
      } else if (this.isUpdate) {
        this.isUpdate = false
        this.setInfo(this.contract_detail)
      }
    },
    setInfo(data) {
      console.log('..........detail supplier : ', JSON.stringify(data))
      if (!data) return
      this.contract_detail = Object.assign({}, data)
      this.name = data.name
      this.type = data.contract_type
      this.state = data.active === 1
      console.log(
        '..........check ngay thang ',
        isValidDate(data.time_end),
        data.time_end
      )
      this.date_sign = data.date_sign // ? moment(data.date_sign).format('DD/MM/YYYY') : ''
      this.date_active = data.time_start // ? moment(data.time_start).format('DD/MM/YYYY') : ''
      this.date_inactive = isValidDate(data.time_end) ? data.time_end : null // ? moment(data.time_end).format('DD/MM/YYYY') : ''
      if (data.date_canculation_debts) {
        this.datePayment = 'Các ngày ' + data.date_canculation_debts + ' hàng tháng'
      } else if (data.ranger_canculation_debt) {
        this.datePayment = data.ranger_canculation_debt + ' ngày sau ngày nhập'
      } else {
        this.datePayment = null
      }
      this.fileList = data.fileList ? data.fileList : []
      // this.list_signer = [data.signer]
      this.signer_id = data.signer_id
      this.account_id = data.bank_info ? data.bank_info.account_id : ''
      this.account_name = data.bank_info ? data.bank_info.account_name : ''
      this.bank_name = data.bank_info ? data.bank_info.bank_name : ''
      this.bank_data = data.bank_info
    },

    /**
     * tra ra thong tin nguoi lien he
     */
    getInfo() {
      console.log(
        '............ check info ',
        this.name,
        this.date_sign,
        this.date_active
      )
      if (
        !this.name.length ||
        !this.date_sign ||
        !this.date_active ||
        !this.datePayment ||
        !this.signer_id ||
        !this.account_id.trim().length ||
        !this.account_name.trim().length ||
        !this.bank_name.trim().length
      ) {
        return null
      }
      const time_sign = new Date(this.date_sign).getTime()
      const time_active = new Date(this.date_active).getTime()
      if (time_active < time_sign) {
        return {
          error: 1,
          msg: 'Ngày có hiệu lực không được nhỏ hơn ngày ký'
        }
      }
      if (this.date_inactive) {
        const time_inactive = new Date(this.date_inactive).getTime()
        if (time_inactive < time_sign) {
          return {
            error: 1,
            msg: 'Ngày hết hiệu lực không được nhỏ hơn ngày kích hoạt'
          }
        }
      }
      const date_canculation_debts_string = this.date_canculation_debts.join(',')

      return {
        name: this.name,
        date_sign: this.date_sign,
        date_active: this.date_active,
        date_inactive: this.date_inactive,
        ranger_canculation_debt: this.ranger_canculation_debt,
        date_canculation_debts: this.date_canculation_debts_input || date_canculation_debts_string,
        signer: this.list_signer.find((d) => d.id === this.signer_id),
        type: this.type,
        fileList: this.fileList,
        account_id: this.account_id,
        account_name: this.account_name,
        bank_name: this.bank_name
      }
    },
    /**
     * lay nhung truong update thoi
     */
    checkBodyUpdate() {
      const obj_update = {}
      if (this.name.trim() !== this.contract_detail.name) {
        obj_update.name = this.name.trim()
      }
      const date_canculation_debts_string = this.date_canculation_debts.join(',')

      const time_sign = new Date(this.date_sign).getTime()
      // const time_ranger_canculation_debt = this.ranger_canculation_debt
      const time_stamp = this.date_canculation_debts
      console.log(time_stamp, '.......... check time stamp')

      const time_active = new Date(this.date_active).getTime()
      const timezone = new Date(this.date_sign).getTimezoneOffset()
      console.log(
        '......... check update ',
        this.date_sign,
        time_sign,
        timezone
      )
      if (time_active < time_sign) {
        this.date_sign = this.contract_detail.date_sign
        this.date_active = this.contract_detail.time_start // ? moment(data.time_start).format('DD/MM/YYYY') : ''
        this.$message.error('Ngày có hiệu lực không được nhỏ hơn ngày ký')
        return null
      }
      if (this.date_inactive) {
        const time_inactive = new Date(this.date_inactive).getTime()
        if (time_inactive < time_active) {
          this.date_sign = this.contract_detail.date_sign
          this.date_active = this.contract_detail.time_start
          this.date_inactive = isValidDate(this.contract_detail.time_end)
            ? this.contract_detail.time_end
            : null //
          this.$message.error(
            'Ngày hết hiệu lực không được nhỏ hơn ngày kích hoạt'
          )
          return null
        }
      }
      // if (time_sign !== (new Date(this.contract_detail.date_sign)).getTime()) {
      obj_update.date_sign = time_sign
      // obj_update.ranger_canculation_debt = time_ranger_canculation_debt
      // obj_update.date_canculation_debts = date_canculation_debts_input_array || time_stamp

      // }
      // if (time_active !== (new Date(this.date_active)).getTime() this.contract_detail.time_start) {
      obj_update.time_start = new Date(this.date_active).getTime()
      // }
      // if (this.date_inactivfe !== this.contract_detail.time_end) {
      obj_update.time_end = new Date(this.date_inactive).getTime()
      // }

      if (Array.isArray(this.date_canculation_debts) && this.date_canculation_debts.length) {
        obj_update.date_canculation_debts = this.date_canculation_debts_input || date_canculation_debts_string
      } else if (this.ranger_canculation_debt !== this.contract_detail.ranger_canculation_debt) {
        obj_update.ranger_canculation_debt = this.ranger_canculation_debt
      }

      if (obj_update.ranger_canculation_debt === undefined || obj_update.ranger_canculation_debt === null) {
        delete obj_update.ranger_canculation_debt
      }
      if (obj_update.date_canculation_debts === '' || obj_update.date_canculation_debts === undefined) {
        delete obj_update.date_canculation_debts
      }

      if (this.type !== this.contract_detail.contract_type) {
        obj_update.contract_type = this.type
      }
      if (this.signer_id !== this.contract_detail.signer_id) {
        obj_update.signer_id = this.signer_id
      }
      //   if (this.email.trim() !== this.detail.email) {
      //     obj_update.email = this.email.trim()
      //   }
      if (Object.keys(obj_update).length) {
        obj_update.id = this.contract_detail.id
      }
      return obj_update
    },
    onEditPress() {
      this.disable = false
      this.isUpdate = true
      this.isCreate = false
      this.show_btn = (this.isCreate || this.isUpdate) && this.shopId
    },
    onCreatePress() {
      this.disable = false
      this.isUpdate = false
      this.isCreate = true
      this.show_btn = (this.isCreate || this.isUpdate) && this.shopId
      this.resetAllInfo()
    },
    requestDetail() {
      if (!this.id) return
      this.loadingTable = true
      supplierResource
        .get_supplier_info(this.id)
        .then((response) => {
          const { error, data } = response
          console.log(
            '............. chi tiet nha cung cap : ',
            JSON.stringify(response)
          )
          this.loadingTable = false
          if (error === 0) {
            // this.detail = Object.assign({}, data)
            this.setInfo(data)
          }
        })
        .catch((err) => {
          console.log('.................. co loi ', err)
          this.loadingTable = false
        })
    },
    onShowDialogShopDetail(url) {
      this.url_image = url
      this.showDialogShopDetail = true
    },
    handleClickButtonDialogDetail(object) {
      this.showDialogShopDetail = object.dialog
      if (object.reload) {
        this.$emit('onClickButtonReload')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.id{
  background-color: #ffffff
}
.search-wrapper {
  margin-bottom: 40px;
  padding: 25px;
  border: 1px solid #ebeef5;
}
.app-container {
  padding: 15px;
}
.row-item {
  display: table;
  background-color: blue($color: #000000);
  width: 95%;
}
.row-item-left {
  display: table;
  background-color: blue($color: #000000);
  width: 270px;
  margin-left: 1em;
}
.row-item-2 {
  display: table;
  width: 260px;
}
.select-item {
  margin-top: 10px;
  width: 95%;
}
.select-item-2 {
  margin-top: 10px;
  width: 260px;
}
.text-lable {
  margin-right: 10px;
  font-size: 16px;
  font-weight: 400;
}
.item-label {
  font-size: 16px;
  font-weight: 400;
}
.row-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.row-row-first {
  display: flex;
  justify-content: flex-end;
  // margin-top: 10px;
}
.el-col-24 {
  // width: 100%;
}
.mb-10 {
  margin-left: 2em;
  //   width: 95%;
}
.demo-date-picker {
  width: 95%;
}
.custom-date-picker ::v-deep .el-input__prefix {
  display: none;
}
.custom-date-picker ::v-deep .el-input__inner {
  border: 0 !important;
  width: 350px;
  padding-left: 0
}
.el-input__inner::placeholder {
  color: #ffffff; /* Change this to the desired color */
}

.custom-date-picker ::v-deep .el-input__suffix {
  left: 300px;
}
.custom-dialog ::v-deep .el-dialog{
  width:450px
}
.custom-input-number ::v-deep .el-input__inner{
  text-align: left ;
  background-color: #ffffff
}
</style>
<style>
.hover input {
  background-color: #f5f7fa;
}
.el-input-number{
 width: 380px !important;
}
.el-select-dropdown__item .el-input__inner::placeholder {
  color: #414141;
}
</style>
