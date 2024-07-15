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
      <el-form ref="ruleForm" v-loading="dialogLoading" class="demo-ruleForm">
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
                        <div v-if="formRequest.dataRender[index].type== 1" style="display: flex; justify-content: space-between;">
                          <el-input
                            v-if="!showElementPDF"
                            v-model="formRequest.dataRender[index].category_name"
                            class="category-title"
                            placeholder="Tên hạng mục"
                          />
                          <span v-else class="category-title">{{ formRequest.dataRender[index].category_name }}</span>
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
                                <div v-for="(service, i) in listServiceRender" :key="i">

                                  <el-checkbox
                                    :label="service.id"
                                    :checked="service.checked"
                                  >
                                    {{ `${(service.id || service.service_name) ? service.service_name : 'không có dữ liệu'}` }}
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
                              @click="showDropDown(formRequest.dataRender[index].category_id)"
                            />
                          </el-popover>
                        </div>
                        <template v-else>
                          <span class="service-title">{{ formRequest.dataRender[index].service_name }}</span>
                        </template>
                      </td>
                      <td class="text-center">
                        <el-input
                          v-if="formRequest.dataRender[index].type== 2 && !showElementPDF"
                          v-model="formRequest.dataRender[index].type_unit"
                          placeholder=""
                        />
                        <p v-else>{{ formRequest.dataRender[index].type_unit }}</p>
                      </td>
                      <td class="text-center">
                        <el-input-number
                          v-if="formRequest.dataRender[index].type== 2 && !showElementPDF"
                          v-model="formRequest.dataRender[index].quantity"
                          placeholder=""
                        />
                        <p v-else>{{ formRequest.dataRender[index].quantity ? formatNumber(formRequest.dataRender[index].quantity, ',') : '' }}</p>
                      </td>
                      <td class="text-center">
                        <el-input-number
                          v-if="formRequest.dataRender[index].type== 2 && !showElementPDF"
                          v-model="formRequest.dataRender[index].money"
                          placeholder=""
                        />
                        <p v-else>{{ formRequest.dataRender[index].money ? formatNumber(formRequest.dataRender[index].money, ',') : '' }}</p>
                      </td>
                      <td class="text-center" style="font-weight: 700; color: orange;">
                        {{ calculatorMoney(index + 1) ? formatNumber(calculatorMoney(index + 1), ',') : '' }}
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
                          @click="deleteRow(index)"
                        />
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
              <tr class="total-row">
                <td class="text-center" colspan="5" style="font-weight: 700; font-size: 18px;">Tổng số tiền: </td>
                <td class="text-center" colspan="1" style="font-weight: 700;  color: orange;">{{ sumaryMoney() ? formatNumber(sumaryMoney(), ',') : '' }}</td>
                <td class="text-center" colspan="2" style="font-weight: 600;" />
              </tr>
            </table>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="text-center" @click="addRow">Thêm mới</el-button>
      <el-button type="primary" :loading="showElementPDF" @click="exportToPDF()">Export PDF</el-button>
      <el-button @click="handleClose">Hủy</el-button>
    </span>
    <!-- <div style="margin-top: 20px">
        <el-link @click="exportToPDF()">Download to PDF</el-link>
      </div> -->
  </el-dialog>
</template>
<script>

import { formatNumber } from '@/utils/convert'
import { trim_string_object } from '@/utils/trim-string-object'
import html2pdf from 'html2pdf.js'

export default {
  name: 'DialogCreateQuote',
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
      dialogLoading: false,
      listService: [],
      formRequest: {
        title: '',
        data: [],
        dataRender: []
      },
      request: {},
      showElementPDF: false,
      check_list: [],
      isEmpty: false,
      checkAll: false,
      isIndeterminate: true,
      listServiceRender: []
    }
  },
  watch: {
    objectData(value) {
      this.formRequest.title = value?.bill_name
      const service = value.data_json
      console.log('.........service........', service)
      if (service.hio.length > 0) {
        this.listService = [
          ...this.listService,
          ...service.hio.map((item, index) => ({
            id: index + this.listService.length + 1,
            service_name: `BH${item.id}`,
            money: item.total_pay
          }
          ))]
      }
      if (service.other_services.length > 0) {
        this.listService = [
          ...this.listService,
          ...service.other_services.map((item, index) => (
            {
              id: index + this.listService.length + 1,
              service_name: JSON.parse(item.product_info).product_name,
              money: item.real_payment
            }
          ))]
      }
      if (service.pax) {
        this.listService = [
          ...this.listService,

          {
            id: this.listService.length + 1,
            service_name: 'Đặt sân golf',
            money: service.pax.booked.reduce(
              (accumulator, currentValue) => accumulator + currentValue.price_booking,
              0
            )
          }
        ]
      }
      if (service.shop.length > 0) {
        this.listService = [
          ...this.listService,
          ...service.shop[0].map((item, index) => (
            {
              id: index + this.listService.length + 1,
              service_name: item.name,
              money: item.total_price
            }
          ))]
      }
      console.log('this.listService.........', this.listService)
    }
    // 'formRequest.data'(val) {
    //   console.log('.....change.........', val)
    //   if (this.formRequest.dataRender.length === 0) {
    //     this.formRequest.data?.forEach(category => {
    //       // if (category.category_name) {
    //       // Category row
    //       this.formRequest.dataRender.push({
    //         category_id: category.id,
    //         type: 1,
    //         category_name: category.category_name,
    //         service_name: '',
    //         type_unit: '',
    //         quantity: '',
    //         money: '',
    //         total_money: '',
    //         note: ''
    //       })
    //       // }

    //       // Services rows
    //       category.list_service.forEach(serviceId => {
    //         const service = this.listService.find(s => +s.id === +serviceId)

    //         if (service) {
    //           this.formRequest.dataRender.push({
    //             category_id: category.id,
    //             type: 2,
    //             category_name: '',
    //             service_id: service.id,
    //             service_name: service.service_name,
    //             type_unit: '',
    //             quantity: '',
    //             money: service.money,
    //             total_money: '',
    //             note: ''
    //           })
    //         }
    //       })
    //     })
    //     console.log('data.........', this.formRequest.data)
    //     console.log('dataRender.........', this.formRequest.dataRender)
    //   }
    // }
  },

  created() {},
  methods: {
    addRow() {
      // this.formRequest.data.push({ id: this.formRequest.data.length + 1, category_name: '', list_service: [] })
      console.log('this.formRequest.dataRender.filter(item => +item.type === 1) ........', this.formRequest.dataRender.filter(item => +item.type === 1))
      this.formRequest.dataRender.push({
        category_id: +this.formRequest.dataRender.filter(item => +item.type === 1).length + 1,
        type: 1,
        category_name: '',
        service_id: '',
        service_name: '',
        type_unit: '',
        quantity: '',
        money: '',
        total_money: '',
        note: ''
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

    async resetformRequest() {
      await Promise.resolve(
        this.dialogLoading = false,
        this.listService = [],
        this.formRequest = {
          title: '',
          data: [],
          dataRender: []
        },
        this.request = {},
        this.showElementPDF = false,
        this.check_list = [],
        this.isEmpty = false,
        this.checkAll = false,
        this.isIndeterminate = true
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
        // console.log('.........this.formRequest.dataRender', this.formRequest.dataRender)
        // console.log('.........this.formRequest.data', this.formRequest.data)
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
      this.$emit('handleClose', false)
      this.resetformRequest()
    },
    deleteRow(index) {
      const service = this.formRequest.dataRender[index]
      if (service?.type === 1) {
        this.formRequest.dataRender = this.formRequest.dataRender?.filter(item => !(+item.category_id === +this.formRequest.dataRender[index].category_id))
      } else {
        this.formRequest.dataRender.splice(index, 1)
      }
    },
    confirmSelect(index) {
      this.formRequest.dataRender = this.formRequest.dataRender.filter(item => !(item.type === 2 && +item.category_id === +this.formRequest.dataRender[index].category_id))
      this.check_list.forEach(serviceId => {
        const service = this.listService.find(s => +s.id === +serviceId)

        if (service) {
          this.formRequest.dataRender.push({
            category_id: this.formRequest.dataRender[index].category_id,
            type: 2,
            category_name: '',
            service_id: service.id,
            service_name: service.service_name,
            type_unit: '',
            quantity: '',
            money: service.money,
            total_money: '',
            note: ''
          })
        }
      })
      this.formRequest.dataRender = this.formRequest.dataRender.sort((a, b) => {
        // Sắp xếp theo category_id tăng dần
        if (a.category_id !== b.category_id) {
          return a.category_id - b.category_id
        }

        // Nếu category_id giống nhau, sắp xếp theo type
        return a.type - b.type
      })
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
    showDropDown(id) {
      this.getListServiceEmpty(id)
      // console.log('id.........', id, this.formRequest.data.map(item => +item.id))
      console.log('vao day....6.....')
      this.check_list = [...this.formRequest.dataRender?.filter(item => +item.category_id === +id && +item.type === 2)?.map(item => item.service_id)] || []
    },
    getListServiceEmpty(id) {
      console.log('this.formRequest.dataRender.....', this.formRequest.dataRender)
      console.log('vao day.........', id, this.formRequest.dataRender.filter(item => +item.category_id === +id && +item.type === 2))
      const data_service_inCate_id = [...this.formRequest.dataRender.filter(item => +item.category_id === +id && +item.type === 2)?.map(item => item.service_id)]
      console.log('vao day....2.....', data_service_inCate_id)
      const data_service_inCate = this.listService.filter(item => data_service_inCate_id.includes(item.id))
      console.log('vao day....3.....', data_service_inCate)
      const serviceSelected = this.formRequest.dataRender.filter(item => +item.type === 2).map(item => item.service_id
      )
      console.log('vao day....4.....', serviceSelected)
      const serviceNotSelected = this.listService.filter(item => !serviceSelected.includes(item.id))
      console.log('vao day....5.....', serviceNotSelected)
      this.listServiceRender = [...data_service_inCate, ...serviceNotSelected]
      // .map(item => ({ id: item, service_name: this.listService.find(item => +item.id === +item) }))
      console.log('.........listServiceRender', this.listServiceRender)
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
      background: rgb(236, 235, 233);
  }
  .category-title {
    font-weight: 600;
    text-transform: uppercase;
  }
  .service-title {
    font-weight: 600;
    color: blue !important;
  }
  p {
    margin-bottom: 0 !important;
  }
  </style>

