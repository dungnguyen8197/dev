<template>
  <el-dialog
    title=""
    :visible.sync="showDialog"
    fullscreen
    :before-close="handleClose"
  >
    <div id="view-pdf">
      <img class="logo-pvi" src="@/assets/img/W_Booking.png" alt="">
      <el-row style="display: flex; margin-bottom: 10px;">
        <el-col :span="5" />
        <el-col class="mt-10" :span="14">
          <el-input
            v-if="!showElementPDF"
            v-model="formRequest.title"
            class="mt-10"
            placeholder="Nhập tên bảng dự trù < Bảng dự trù kinh phí - tên Outing >"
          />
          <el-input
            v-if="!showElementPDF"
            v-model="formRequest.sub_title"
            class="mt-10"
            placeholder="Nhập tên sân và ngày tháng năm"
          />
          <div v-if="showElementPDF" style="text-align: center; margin-bottom: 10px; font-size: 16px;">
            <h4 style="margin-bottom: 0 !important;">{{ formRequest.title }}</h4>
            <p><i>{{ formRequest.sub_title }}</i></p>
          </div>
        </el-col>
        <el-col :span="5" />
      </el-row>
      <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" class="demo-ruleForm">
        <el-form-item label="" required>
          <el-row class="data-table-content table-responsive">
            <table class="table table-bordered table_custom">
              <thead style="background-color: #000; color: #fff; height: 20px !important;">
                <tr>
                  <th scope="col" class="text-center" style="min-width: 40px">STT</th>
                  <th scope="col" class="text-center">Hạng mục</th>
                  <th scope="col" class="text-center">Đơn vị tính</th>
                  <th scope="col" class="text-center">Số lượng</th>
                  <th scope="col" class="text-center">Đơn giá</th>
                  <th scope="col" class="text-center">Thành tiền</th>
                  <th scope="col" class="text-center">Ghi chú</th>
                  <th v-if="!showElementPDF" scope="col" class="text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                <template>
                  <template v-for="(item, index) in formRequest.dataRender">
                    <tr :key="index" :class="formRequest.dataRender[index].type== 1 ? 'category' : ''">
                      <td class="text-center"> {{ romanNumeral(index + 1) }}</td>
                      <td>
                        <div v-if="formRequest.dataRender[index].type== 1" style="display: flex;">
                          <el-input
                            v-model="formRequest.dataRender[index].category_name"
                            class="category-title"
                            placeholder="Tên hạng mục"
                          />
                          <el-popover
                            ref="popoverRef"
                            placement="bottom"
                            width="250"
                            trigger="click"
                          >
                            <div style=" background-color: rgb(239 236 233 / 30%); border-radius: 10px; display: flex; flex-direction: column; align-items: start; justify-content: center;">
                              <el-checkbox
                                v-model="checkAll"
                                :indeterminate="isIndeterminate"
                                @change="handleCheckAllChange"
                              >
                                Check all
                              </el-checkbox>
                              <el-checkbox-group
                                v-model="check_list"
                                style="max-height: 400px; overflow: auto;"
                                @change="handleCheckedGolferChange"
                              >
                                <div v-for="(item, index) in listService" :key="index">
                                  <el-checkbox
                                    :label="item.id"
                                    :checked="item.checked"
                                  >
                                    {{ `${(item.id || item.service_name) ? item.service_name : 'không có dữ liệu'}` }}
                                  </el-checkbox>
                                </div>
                              </el-checkbox-group>
                              <el-button
                                slot="reference"
                                type="primary"
                                @click="confirmSelect(index)"
                              >Xác nhận</el-button>
                            </div>
                            <el-button
                              slot="reference"
                              icon="el-icon-arrow-down"
                              style="background-color: transparent; border: transparent;"
                            />
                          </el-popover>
                        </div>
                        <template v-else>
                          <span class="service-title">{{ formRequest.dataRender[index].service_name }}</span>
                        </template>
                      </td>
                      <td class="text-center">
                        <el-input
                          v-if="formRequest.dataRender[index].type== 2"
                          v-model="formRequest.dataRender[index].type_unit"
                          placeholder=""
                          @blur="showInput = false"
                        />
                      </td>
                      <td class="text-center">
                        <el-input-number
                          v-if="formRequest.dataRender[index].type== 2"
                          v-model="formRequest.dataRender[index].quantity"
                          placeholder=""
                        />
                      </td>
                      <td class="text-center">
                        <el-input-number
                          v-if="formRequest.dataRender[index].type== 2"
                          v-model="formRequest.dataRender[index].money"
                          placeholder=""
                        />
                      </td>
                      <td class="text-center" style="font-weight: 700;">
                        {{ calculatorMoney(index + 1) ? formatNumber(calculatorMoney(index + 1)) : '' }}
                      </td>
                      <td class="text-center">
                        <el-input
                          v-if="formRequest.dataRender[index].type== 2"
                          v-model="formRequest.dataRender[index].note"
                          placeholder=""
                        />
                      </td>
                      <td v-if="!showElementPDF" class="text-center">
                        <el-button
                          style="margin-right: 10px"
                          size="small"
                          :title="`Xóa`"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click="deleteProductGifts(index)"
                        />
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
              <tr class="total-row">
                <td class="text-center" colspan="5" style="font-weight: 700; font-size: 18px;">Tổng số tiền: </td>
                <td class="text-center" colspan="1" style="font-weight: 700;">{{ sumaryMoney() ? formatNumber(sumaryMoney()) : '' }}</td>
                <td class="text-center" colspan="2" style="font-weight: 600;" />
              </tr>
            </table>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="text-center" @click="addProductGifts">Thêm mới</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="exportToPDF()">Export PDF</el-button>
      <el-button @click="handleClose">Hủy</el-button>
    </span>
    <!-- <div style="margin-top: 20px">
      <el-link @click="exportToPDF()">Download to PDF</el-link>
    </div> -->
  </el-dialog>
</template>
<script>

// import { validateText, validateImage, validateTextArea } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import EventResource from '@/api/event'
import { trim_string_object } from '@/utils/trim-string-object'
import GolferResource from '@/api/golfer/golfer'
import AdminClubResource from '@/api/club/admin-club'
import html2pdf from 'html2pdf.js'

const golferResource = new GolferResource()
const eventResource = new EventResource()
const adminClubResource = new AdminClubResource()

export default {
  name: 'DialogPartner',
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    },
    showDialog: {
      type: Boolean,
      default: true
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {},
      loadingSubmit: false,
      dialogLoading: false,
      listService: [
        { id: 1, service_name: 'Dịch vụ đặt sân' },
        { id: 2, service_name: 'Backdrop' },
        { id: 3, service_name: 'Tiệc' },
        { id: 4, service_name: 'Dịch vụ đặt sân' },
        { id: 5, service_name: 'Bò húc' }
      ],
      formRequest: {
        data: [],
        dataRender: []
      },
      request: {},
      achievementList: [],
      users: [],
      clubs: [],
      objectAchievement: {},
      typeList: [{ value: 1, label: 'CLB' }, { value: 2, label: 'Cá nhân' }],
      showInput: false,
      showElementPDF: false,
      check_list: [],
      isEmpty: false,
      checkAll: false,
      isIndeterminate: true
    }
  },
  watch: {
    '$store.getters.isShowDialogAddAchievement'(value) {
      console.log('v-if="$store.getters.event_object.is_global == 1"', this.$store.getters.event_object.is_global)
    },
    'formRequest.data'(val) {
      console.log('.....change.........', val)
      this.formRequest.dataRender = []
      this.formRequest.data.forEach(category => {
        // if (category.category_name) {
        // Category row
        this.formRequest.dataRender.push({
          type: 1,
          category_name: category.category_name,
          service_name: '',
          type_unit: '',
          quantity: 1,
          money: 100000, // You need to adjust this based on your logic for calculating category money
          total_money: '',
          note: ''
        })
        // }

        // Services rows
        category.list_service.forEach(serviceId => {
          const service = this.listService.find(s => +s.id === +serviceId)

          if (service) {
            this.formRequest.dataRender.push({
              type: 2,
              category_name: '',
              service_name: service.service_name,
              type_unit: '',
              quantity: '',
              money: '',
              total_money: '',
              note: ''
            })
          }
        })
      })
      console.log('dataRender.........', this.formRequest.dataRender)
    }
  },

  created() {},
  methods: {
    onGetList() {
      this.loadingTable = true
      eventResource.list_option_achievement({ get_all: 1 }).then(res => {
        if (res.error_code === 0) {
          this.achievementList = res?.data?.data || []
          if (this.achievementList.length > 0) {
            this.objectAchievement = this.achievementList.reduce((a, v) => ({ ...a, [v.id]: v }), {})
            console.log('this.achievementList...........', this.achievementList)
            console.log('this.objectAchievement...........', this.objectAchievement)
          }
          console.log('this.tableData___________', this.tableData)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    async exportToPDF() {
      this.showElementPDF = true
      var element = document.getElementById('view-pdf')
      var opt = {
        margin: 1,
        filename: 'bao-gia-booking.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' } // landscape, portrait
      }
      // opt.jsPDF.format[1] = 300
      await html2pdf().set(opt).from(element).save()
      await html2pdf(element, opt)
      this.showElementPDF = false
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          if (!this.formRequest.achievement_lists.length > 0 || (+this.$store.getters.event_object.is_global === 1 && this.formRequest.achievement_lists.find(item => +item.type === 1 && !item.club_id))) {
            this.$message.error('Bạn chưa nhập đủ thông tin !!!')
            return
          } else {
            this.handleSubmit()
          }
        }
      })
    },
    async handleSubmit() {
      await this.trim_string_object(this.formRequest)
      const list = this.formRequest.achievement_lists
        .filter(item => item.achievement_type)
        .map((item) => (
          {
            achievement_type: item.achievement_type,
            achievement_name: item?.achievement_name ? item?.achievement_name : this.objectAchievement?.[item.achievement_type]?.achievement_name,
            user_id: item.user_id,
            club_id: item.club_id,
            type: item.type
          }
        ))
      const body = { event_id: this.$store.getters.event_id, achievement_lists: list }
      console.log('body....................', body)
      eventResource.store_achievement(body).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Thêm mới thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },

    async resetformRequest() {
      await Promise.resolve(
        this.keyImage = [],
        this.formRequest = {
          achievement_lists: []
        }
      )
      this.$refs['ruleForm'].clearValidate()
    },
    romanNumeral(number) {
      // Hàm chuyển số thành số La Mã
      const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XVI', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX']
      if (this.formRequest.dataRender[number - 1].type === 1) {
        const stt = this.formRequest.dataRender.slice(0, number - 1).filter(item => item.type === 1)
        return numerals[stt.length]
      } else {
        for (let i = number - 1; i >= 0; i--) {
          if (this.formRequest.dataRender[i].type === 1) {
            return number - 1 - i
          }
        }
      }
    },
    calculatorMoney(number) {
      if (this.formRequest.dataRender[number - 1].type === 2) {
        return this.formRequest.dataRender[number - 1].quantity * this.formRequest.dataRender[number - 1].money
      } else {
        console.log('.........this.formRequest.dataRender', this.formRequest.dataRender)
        if (this.formRequest.dataRender.slice(number).filter(item => item.type === 1).length === 0) {
          const total = this.formRequest.dataRender.slice(number).reduce(
            (accumulator, currentValue) => accumulator + (currentValue.money * currentValue.quantity),
            0
          )
          this.formRequest.dataRender[number - 1].total_money = total
          return total
        } else {
          for (let i = number; i <= this.formRequest.dataRender.length; i++) {
            if (this.formRequest.dataRender[i].type === 1) {
              console.log('number..........', number, this.formRequest.dataRender.slice(number, i), i)
              const total = this.formRequest.dataRender.slice(number, i).reduce(
                (accumulator, currentValue) => accumulator + (currentValue.money * currentValue.quantity),
                0
              )
              this.formRequest.dataRender[number - 1].total_money = total
              return total
            }
          }
        }
      }
    },
    sumaryMoney() {
      return this.formRequest.dataRender.filter(item => +item.type === 1).reduce(
        (accumulator, currentValue) => accumulator + (currentValue.total_money),
        0
      )
    },
    handleClose() {
      this.$store.dispatch('hideDialogAddAchievement')
      this.resetformRequest()
    },
    onSearchGolfer(keyword) {
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
    onSearchClub(keyword) {
      this.loadingSearchClub = true
      adminClubResource.search({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.clubs = result
          } else {
            this.clubs = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchClub = false
      })
    },
    addProductGifts() {
      this.formRequest.data.push({ category_name: '', list_service: [] })
    },
    deleteProductGifts(index) {
      console.log('index', index)
      this.formRequest.dataRender.splice(index, 1)
    },
    confirmSelect(index) {
      console.log('this.check_list............', this.check_list, index)
      if (index > 0) {
        const stt = this.formRequest.dataRender.slice(0, index).filter(item => item.type === 1)

        const cp_data = [...this.formRequest.data]
        cp_data[stt.length].category_name = this.formRequest.dataRender[index].category_name
        cp_data[stt.length].list_service = [...this.check_list]
        this.formRequest.data = [...cp_data]
        console.log('............cp_data', cp_data, index)
      } else {
        const cp_data = [...this.formRequest.data]
        cp_data[index].category_name = this.formRequest.dataRender[index].category_name
        cp_data[index].list_service = [...this.check_list]
        this.formRequest.data = [...cp_data]
        console.log('............cp_data', cp_data, index)
      }
    },
    handleCheckAllChange(value) {
      const array = []
      if (value) {
        // const list = this.listService.filter(element => !element.disabled)
        this.listService.map(item => {
          array.push(item.id)
        })
      }
      this.check_list = [...array]
      this.isIndeterminate = false
    },
    handleCheckedGolferChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listService.length
      this.check_list = [...value]
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listService.length
    },
    formatNumber,
    trim_string_object
  }
}
</script>

<style scoped>
.mb-10 {
margin-bottom: 10px;
}
.logo-pvi {
  width: 15%;
  margin: 0 0 20px;
}
table {
    border-collapse: collapse;
    width: 100%;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    overflow: hidden; /* Để tránh hiện tượng border-radius không áp dụng đúng trên một số trình duyệt */
}

th {
    /* text-align: left; */
    padding: 0 12px !important;
}
td {
    /* text-align: left; */
    padding: 6px 12px !important;
}
.category {
    background: bisque;
}
.category-title {
  font-weight: 600;
  text-transform: uppercase;
}
.service-title {
  font-weight: 600;
  color: blue !important;
}
</style>
