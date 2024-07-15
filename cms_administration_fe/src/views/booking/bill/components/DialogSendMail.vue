<template>
  <el-dialog
    title="Xác nhận Gửi Mail"
    :before-close="onCloseDialog"
    :visible.sync="dialogSendMail"
  >
    <el-form ref="form" v-loading="loadingDialog" :model="postForm" label-position="right">
      <template>
        <p>Xác nhận gửi mail xác nhận tee time đến sân </p>
      </template>
      <el-form-item label="Sân">
        <el-input v-model="postForm.facility_name" />
      </el-form-item>
      <el-form-item label="Round">
        <el-select v-model="postForm.number_hole" placeholder="Chọn số hố">
          <el-option
            v-for="item in listNumberHole"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Teetime">
        <el-date-picker
          v-model="postForm.date_played"
          style="width: 100%;"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="Chọn teetime"
        />
      </el-form-item>
      <el-form-item label="Tên Fight">
        <el-input v-model="postForm.host_name" />
      </el-form-item>
      <el-form-item label="Người chơi">
        <div v-for="(item, key) in postForm.childrent" :key="key">
          <el-input v-model="item.name_out_system" style="margin-top: 5px;" />
        </div>
      </el-form-item>
      <el-form-item label="Mã Booking">
        <el-input v-model="postForm.code_booking" />
      </el-form-item>
      <el-form-item label="Note">
        <el-input v-model="postForm.note" />
      </el-form-item>
      <el-form-item label="Đối tượng">
        <el-input v-model="postForm.typeSubject" placeholder="Đối tượng khách lẻ hay đại lý sacombank" />
      </el-form-item>
      <el-form-item label="Phí chơi">
        <el-input v-model="postForm.fee" />
      </el-form-item>
      <el-form-item label="Admin">
        <el-select v-model="postForm.admin" class="w-100" filterable placeholder="Chọn Admin">
          <el-option

            v-for="item in listAdmin"
            :key="item.id"
            class="qq"
            :label="`${item.name} - ${item.phone}`"
            :value="`${item.name} - ${item.phone}`"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">Hủy bỏ</el-button>
      <el-button type="primary" :loading="btnLoading" @click="sendMail">Xác nhận</el-button>
    </span>
  </el-dialog>

</template>

<script>
import BookingPaxResource from '@/api/BookingPax'
import { isEmpty } from '@/utils/validate'
import moment from 'moment'
import { getAllAdmin } from '@/utils/auth'

// const VUE_APP_URL_API_BOOKING_VCALL = process.env.VUE_APP_URL_API_BOOKING_VCALL
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogSendMail',
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
    },
    admin: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      listAdmin: getAllAdmin(),
      postForm: {
        email: '',
        subject: '',
        content: '',
        typeSubject: 'Khách Sacombank/Khách lẻ đặt sân'

      },
      btnLoading: false,
      listNumberHole: [
        { value: 9, label: '9 Hố' },
        { value: 18, label: '18 Hố' },
        { value: 27, label: '27 Hố' }
      ],
      teetime: '',
      loadingDialog: false
    }
  },
  watch: {
    dialogSendMail(value) {
      console.log('dialogSendMail...........', value)
    },
    objectData(value) {
      console.log('objectData..........', value)
      if (!isEmpty(value)) {
        this.onGetDetail(value.general_bill_id)
      }
    }
  },
  created() {
  },
  methods: {
    onCloseDialog() {
      this.$emit('clickCloseDialog', true)
    },
    async sendMail() {
      this.btnLoading = true
      console.log('postForm', this.postForm)
      bookingPaxResource.sendMailFacility(this.postForm).then(res => {
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
    },
    async onGetDetail(id) {
      this.loadingDialog = true
      bookingPaxResource.detailBill({ bill_id: id }).then(res => {
        if (res.error_code === 0) {
          const data = res.data
          console.log('data.golfers', data.golfers)
          let golferHost = {}
          let childrent = []
          if (data.host_user_id === -1) {
            const [curGolfer, ...rest] = data.golfers.sort((a, b) => a?.booked?.id - b?.booked?.id)
            console.log('curGolfer, ...rest________', curGolfer, ...rest)
            golferHost = curGolfer
            childrent = rest?.map(item => {
              return { name_out_system: item?.name }
            })
          } else {
            golferHost = data.golfers.find(item => +item.id === +data.host_user_id)
            childrent = data.golfers.filter(item => +item.id !== +data.host_user_id).map(item => {
              return { name_out_system: item?.name }
            })
          }
          const admin = getAllAdmin().find(item => +item.id === +data.cms_id)

          console.log('childrent.........................................................', childrent)
          this.postForm = {
            facility_name: data?.pax?.facility?.sub_title,
            number_hole: data.type_hole,
            date_played: moment(data.pax.date_played).format('YYYY-MM-DD HH:mm:ss'),
            code_booking: data.pax?.booked[0].code_booking,
            host_name: golferHost?.name,
            childrent: childrent,
            fee: 'Phí chơi: wBooking thanh toán phí chơi (Sân cỏ +1/2 xe điện) cho ' + data.golfers.length + ' khách này ạ.',
            admin: admin?.name ? `${admin?.name} - ${admin?.phone}` : '',
            cms_id: data.cms_id,
            email: admin?.email,
            host_user_id: data.host_user_id,
            facility_id: data.pax.facility_id,
            pax_id: data.pax_id,
            bill_id: id
          }
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
<style lang="scss" scoped>

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
