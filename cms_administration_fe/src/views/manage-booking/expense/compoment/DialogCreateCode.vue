<template>
  <el-dialog :title="showPopup === false ? 'Tạo code chi' : 'Mã thanh toán'" class="dialog-code-create" :visible.sync="showDialog" :before-close="handleClose" width="500px">
    <el-row>
      <el-col>
        <el-form v-if="!showPopup">
          <el-form-item label="Thời gian đánh">
            <el-date-picker
              v-model="date_select"
              type="datetimerange"
              align="right"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              format="dd-MM-yyyy HH:mm:ss"
              style="width: 100%;"
              :default-time="['00:00:00', '23:59:00']"
            />
          </el-form-item>
          <el-form-item label="NCC">
            <el-select
              ref="SearchSupplier"
              v-model="supplierModel"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="Tìm kiếm NCC"
              :remote-method="onSearchSupplier"
              :loading="loadingSearchSupplier"
              @hook:mounted="(value) => cancelReadOnly(value, 'SearchSupplier')"
              @visible-change="(value) => cancelReadOnly(value, 'SearchSupplier')"
            >
              <el-option
                v-for="Supplier in suppliers"
                :key="Supplier.id"
                :label="Supplier.name"
                :value="Supplier.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 14px !important; font-weight: 550;" contenteditable="true">Tổng tiền: {{ formatNumber(bodyCreateCodePayment.amount_money) }} VNĐ</span>
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                Check all
              </el-checkbox>
            </div>
          </el-form-item>
          <div v-if="loadingTable">Đang load dữ liệu ...</div>
          <div v-else class="booked_list">
            <el-checkbox-group v-model="check_list" style="display: flex; flex-wrap: wrap;">
              <template
                v-for="expense in expenses"
              >
                <el-checkbox
                  :key="expense.id"
                  style="width: 50%;"
                  :label="expense.id"
                  checked
                  @change="checkBooked($event, expense)"
                >{{ expense.booked[0].code_booking }} - {{ formatNumber(totalMoney(expense)) }} VNĐ
                </el-checkbox>
              </template>
              <!--            </el-row>-->
            </el-checkbox-group>
          </div>
          <el-form-item style="text-align: right">
            <el-button @click="handleClose">Hủy bỏ</el-button>
            <el-button type="primary" :loading="loadingSubmit" @click="handleCreate()">Lưu</el-button>
          </el-form-item>
        </el-form>
        <el-row v-if="showPopup" class="popup-row">
          <el-col>
            <h3>Đây là mã thanh toán của bạn</h3>
            <p>
              <span>Code thanh toán:</span>
              <span style="color: red; padding-left: 10px">{{ code_payment }}</span>
            </p>
            <el-button @click="handleClose">Đóng</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { formatNumber } from '@/utils/convert'
import SearchResource from '@/api/search-api'
import ExpenseResource from '@/api/manage-booking/expense'

const searchResource = new SearchResource()
const expenseResource = new ExpenseResource()
export default {
  name: 'DialogCreateCode',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date_select: [new Date(), new Date()],
      loadingSearchSupplier: false,
      suppliers: [],
      listQuery: Object.assign({}),
      expenses: [],
      supplierModel: '',
      loadingTable: false,
      checked: false,
      booked: [],
      ids: [],
      total_money: 0,
      loadingSubmit: false,
      showEditPrice: false,
      showPopup: false,
      code_payment: '',
      bodyCreateCodePayment: {
        list_pax_id: [],
        supplier_id: 0,
        amount_money: 0
      },
      checkAll: true,
      check_list: [],
      isIndeterminate: false
    }
  },
  watch: {
    supplierModel(val) {
      if (val) {
        this.listQuery.supplier_id = val
        this.bodyCreateCodePayment.supplier_id = val
        this.requestExpenseList()
      }
    },
    date_select(val) {
      let start = val[0]
      let end = val[1]
      start = (new Date(start)).getTime()
      end = (new Date(end)).getTime()
      this.from_date = start
      this.to_date = end
      this.listQuery.start_date = this.from_date / 1000
      this.listQuery.end_date = this.to_date / 1000
    }
  },
  methods: {
    EditPrice() {
      this.showEditPrice = true
    },
    handleCreate() {
      expenseResource.createCodePayment(this.bodyCreateCodePayment).then(res => {
        // this.loadingSubmit = false
        const { error_code, error_msg, data } = res
        if (error_code === 0) {
          // this.$message.success(error_msg)
          this.code_payment = data
          this.showPopup = true
          this.supplierModel = ''
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },
    totalMoney(expense) {
      if (expense) {
        let gia_nhap_pax = 0
        // if (expense.booked > 0) {
        //   for (let i = 0; i < expense.booked.length; i++) {
        //     gia_nhap_pax += expense.booked[i].surcharge_entry_price
        //   }
        // }
        expense.booked.map(item => {
          const price = expense[`source_price_${expense.number_hole}`] ? expense[`source_price_${expense.number_hole}`] : 0
          gia_nhap_pax += (+price) + +item.surcharge_entry_price
        })
        if (expense.billOutsidePayment.length > 0) {
          expense.billOutsidePayment.map(item => {
            gia_nhap_pax += +item.original_amount
          })
        }
        // if (expense.billOutsidePayment > 0) {
        //   for (let i = 0; i < expense.billOutsidePayment.length; i++) {
        //     gia_nhap_pax += expense.billOutsidePayment[i].original_amount
        //   }
        // }
        // console.log('gia_nhap_pax..............', gia_nhap_pax)
        return gia_nhap_pax
      }
    },
    checkBooked($event, expense) {
      console.log($event, expense)
      if (!$event) {
        for (let i = 0; i < this.bodyCreateCodePayment.list_pax_id.length; i++) {
          if (this.bodyCreateCodePayment.list_pax_id[i] === expense.id) {
            this.bodyCreateCodePayment.list_pax_id.splice(i, 1)
            this.bodyCreateCodePayment.amount_money -= parseInt(this.totalMoney(expense))
          }
        }
      } else {
        this.check_list.push(expense.id)
        this.bodyCreateCodePayment.list_pax_id.push(expense.id)
        this.bodyCreateCodePayment.amount_money += parseInt(this.totalMoney(expense))
      }
      this.checkAll = this.check_list.length === this.expenses.length
      this.isIndeterminate = this.check_list.length === this.expenses.length
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
    requestExpenseList() {
      this.loadingTable = true
      expenseResource.get_list_booking_create_code(this.listQuery).then(res => {
        this.loadingTable = false
        const { error_code, data } = res
        if (error_code === 0) {
          this.expenses = data.data

          this.expenses.map((item) => {
            this.bodyCreateCodePayment.amount_money += this.totalMoney(item)
          })

          // this.bodyCreateCodePayment.amount_money = this.total
          this.bodyCreateCodePayment.list_pax_id = this.expenses.map(d => d.id)
        }
      })
    },

    handleCheckAllChange(value) {
      console.log('value..........', value)
      const array = []
      if (value) {
        this.expenses.map(item => {
          array.push(item.id)
        })
        this.expenses.map((item) => {
          this.bodyCreateCodePayment.amount_money += this.totalMoney(item)
        })
        this.bodyCreateCodePayment.list_pax_id = this.expenses.map(d => d.id)
      } else {
        this.bodyCreateCodePayment.amount_money = 0
        this.bodyCreateCodePayment.list_pax_id = []
      }
      this.check_list = [...array]
      console.log('...........check_list', this.check_list)

      this.isIndeterminate = false
    },

    handleClose() {
      this.showPopup = false
      this.supplierModel = ''
      this.bodyCreateCodePayment = {
        list_pax_id: [],
        supplier_id: 0,
        amount_money: 0
      }
      this.checkAll = true
      this.check_list = []
      this.isIndeterminate = false
      this.expenses = []
      // this.date_select = ''
      this.$emit('clickButtonDialog', { dialog: false, reload: false })
    },

    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    formatNumber
  }
}
</script>

<style lang="scss" scoped>
p, p span {
  font-size: 12px !important;
}

span, label, th, td {
  font-size: 12px !important;
}

.booked_list {
  display: flex;
  justify-content: space-between;
  // flex-direction: column;
  flex-wrap: wrap;
  max-height: 300px;
  overflow: auto;
  &> div {
    margin: 0  !important;
    width: 50%;
  }
}
</style>
