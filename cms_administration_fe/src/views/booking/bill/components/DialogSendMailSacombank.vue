<template>
  <el-dialog title="Xác nhận Gửi Mail Sacombank" :before-close="onCloseDialog" :visible.sync="dialogSendMail">
    <p>Chọn người để gửi mail Sacombank</p>
    <el-select v-model="golferSendMail" style="width: 100% !important; margin-bottom: 20px" clearable placeholder="Chọn người gửi mail">
      <el-option
        v-for="item in listGolferSacomBank"
        :key="item.id"
        :label="item.name"
        :value="item.id"
        :disabled="item.disabled"
      />
    </el-select>
    <el-form v-if="golferSendMail" ref="ruleForm" v-loading="loadingDialog" :rules="rules" :model="form" label-position="right">
      <template>
        <p>Xác nhận gửi mail xác nhận tee time đến Sacombank</p>
      </template>
      <el-form-item required label="Tiêu đề mail">
        <el-form-item prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
      </el-form-item>
      <el-form-item required label="Họ tên">
        <el-form-item prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="CMND/passport" required>
        <el-form-item prop="passport">
          <el-input v-model="form.passport" />
        </el-form-item>
      </el-form-item>
      <el-form-item required label="Sân">
        <el-form-item prop="facility_name">
          <el-input v-model="form.facility_name" />
        </el-form-item>
      </el-form-item>
      <el-form-item required label="Round">
        <el-form-item prop="number_hole">
          <el-select v-model="form.number_hole" placeholder="Chọn số hố">
            <el-option
              v-for="item in listNumberHole"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form-item>
      <el-form-item required label="Teetime">
        <el-date-picker
          v-model="form.date_played"
          style="width: 100%;"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="Chọn teetime"
        />
      </el-form-item>

      <el-form-item required label="Mã Booking">
        <el-form-item prop="code_booking">
          <el-input v-model="form.code_booking" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="Loại thẻ" required>
        <el-form-item prop="type_card">
          <el-select v-model="form.type_card" clearable placeholder="Loại thẻ">
            <el-option
              v-for="type_card in typeCardList"
              :key="type_card.value"
              :label="type_card.label"
              :value="type_card.value"
            />
          </el-select>        </el-form-item>
      </el-form-item>
      <el-form-item required label="Người đi cùng">
        <el-input v-model="form.partner_name" />
      </el-form-item>
      <el-form-item label="Note">
        <el-input v-model="form.note" />
      </el-form-item>
      <el-form-item label="Admin">
        <el-input v-model="form.admin" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">Hủy bỏ</el-button>
      <el-button type="primary" :loading="btnLoading" @click="onSubmitForm('ruleForm')">Xác nhận</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import axios from 'axios'
import BookingPaxResource from '@/api/BookingPax'
import { getAllAdmin } from '@/utils/auth'
import moment from 'moment'
import { isEmpty } from '@/utils/validate'
import { validateText } from '@/utils/validate'

// const VUE_APP_URL_API_BOOKING_VCALL = process.env.VUE_APP_URL_API_BOOKING_VCALL
const bookingPaxResource = new BookingPaxResource()

const formDefault = {
  title: '',
  facility_name: '',
  number_hole: '',
  date_played: '',
  code_booking: '',
  name: '',
  childrent: '',
  fee: '',
  admin: ''
}

export default {
  name: 'DialogSendMailSacombank',
  props: {
    dialogSendMail: {
      type: Boolean,
      default: false,
      value: false
    },
    objectData: {
      type: Object,
      default() {
        return {}
      }
    }

  },
  data() {
    return {
      dialogVisible: false,
      rules: {
        passport: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.passport, callback, 'CMND/passport'),
            trigger: 'change'
          }
        ],
        type_card: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.type_card, callback, 'Loại thẻ'),
            trigger: 'change'
          }
        ],
        title: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.title, callback, 'Tiêu đề'),
            trigger: 'change'
          }
        ],
        name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.name, callback, 'Tên'),
            trigger: 'change'
          }
        ],
        code_booking: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.code_booking, callback, 'Code Booking'),
            trigger: 'change'
          }
        ],
        facility_name: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.facility_name, callback, 'Sân'),
            trigger: 'change'
          }
        ],
        number_hole: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.number_hole, callback, 'Số hố'),
            trigger: 'change'
          }
        ]
      },
      form: {
        email: '',
        subject: '',
        content: ''
      },
      btnLoading: false,
      loadingDialog: false,
      listNumberHole: [
        { value: 9, label: '9 Hố' },
        { value: 18, label: '18 Hố' },
        { value: 27, label: '27 Hố' }
      ],
      typeCardList: [
        { value: 1, label: 'Thẻ Infinite - Miễn Phí' },
        { value: 2, label: 'Thẻ World MC - Giảm Phí' },
        { value: 3, label: 'Thẻ World MC - Miễn Phí' },
        { value: 4, label: 'Thẻ VIP - Miễn Phí' },
        { value: 5, label: 'Thẻ Infinite FLC - Miễn phí' }
      ],
      teetime: '',
      title: '',
      golferSendMail: '',
      listGolferSacomBank: [],
      detailPax: {},
      general_bill_id: '',
      detailBooked: []
      // bookedSelect: {}
    }
  },
  watch: {
    objectData(value) {
      console.log('objectData..........', value)
      if (!isEmpty(value)) {
        this.general_bill_id = value.general_bill_id
        this.onGetDetail(this.general_bill_id)
      }
    },
    golferSendMail(value) {
      const booked = this.detailBooked.find(item => item.id === value)
      const golferName = booked?.booking_user_passport?.real_name ?? booked?.fullname ?? booked?.name_out_system
      const data = this.detailPax
      console.log('................data..', booked)
      const now = moment().format('D-M-YYYY')
      const admin = getAllAdmin().find(item => +item.id === +data.cms_id)
      const path = data?.pax?.facility?.paths.find(item => +item.id === +data.pax.path_id)
      this.form = {
        bill_id: this.general_bill_id,
        title:
                      'GOLF - ' +
                      now + ' - ' +
                      golferName +
                      ' - ' + booked?.booking_user_passport?.passport +
                      ' - (Sale ' +
                      admin?.name +
                      ')',
        facility_name:
                      data?.pax?.facility?.sub_title + ' - ' + path?.name,
        passport: booked?.booking_user_passport?.passport,
        number_hole: data?.type_hole,
        date_played: moment(data.pax.date_played).format('YYYY-MM-DD HH:mm:ss'),
        code_booking: booked?.code_booking,
        name: golferName,
        note: '',
        admin: `${admin.name} - ${admin.phone}`,
        type_card: booked?.booking_user_passport?.type_card,
        partner_number: booked?.booking_user_passport?.partner_number,
        partner_name: booked?.booking_user_passport?.note,
        user_id: data.host_user_id,
        facility_id: data?.pax?.facility_id,
        pax_id: data?.pax_id,
        name_out_system: booked?.name_out_system,
        cms_id: data.cms_id,
        email: admin?.email,
        booked_id: booked?.id
      }
      console.log('this.form_____________________________________', this.form)
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          this.sendMail()
        }
      })
    },
    onCloseDialog() {
      this.form = formDefault
      this.golferSendMail = ''
      this.listGolferSacomBank = []
      this.detailPax = {}
      this.general_bill_id = ''
      this.detailBooked = []
      this.$emit('closeDialogSendMailSacombank', true)
    },
    async sendMail() {
      console.log('objectData', this.objectData)
      this.btnLoading = true
      bookingPaxResource.sendMailSacombank(this.form).then(res => {
        console.log('res', res)
        if (res.error_code === 0) {
          this.$message({
            message: 'Gửi mail thành công',
            type: 'success'
          })
          this.onCloseDialog()
        } else {
          this.$message({
            message: 'Gửi mail thất bại',
            type: 'error'
          })
        }
      }).catch(error => {
        console.log('error', error)
      }).finally(() => {
        this.btnLoading = false
      })

      this.onCloseDialog()
    },
    async onGetDetail(id) {
      this.loadingDialog = true
      bookingPaxResource.detailBill({ bill_id: id }).then(res => {
        if (res.error_code === 0) {
          const data = res.data
          console.log('data...............................................', data)
          this.detailPax = data
          this.detailBooked = data.pax?.booked
          this.listGolferSacomBank = data.pax?.booked?.filter(item => item.agency_name === 'Sacombank').map(item => ({ id: item.id, name: item.name_out_system, disabled: +item.is_send_mail_sacombank === 1 }))
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    }
  }
}
</script>
