<template>
  <div class="p-10">
    <div>
      <h6>Danh sách phụ phí</h6>
      <el-col class="mb-10 mr-10" :span="6">
        <div class="grid-content bg-purple-light">
          <el-input
            v-model="listQuery.code"
            placeholder="Nhập mã code"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </div>
      </el-col>
      <el-button icon="el-icon-refresh" round @click="onReset">Reset</el-button>
      <el-button type="primary" icon="el-icon-search" @click="getList">Tìm kiếm</el-button>
      <el-button type="primary" @click="handleCreate">Thêm phụ phí</el-button>
    </div>
    <div>
      <el-table :data="dataTable" border>
        <el-table-column type="index" label="STT" width="50" align="center" />
        <el-table-column prop="code" label="Code" align="center" />
        <el-table-column prop="title" label="Tên phụ phí" align="center" />
        <el-table-column label="Giá trị" align="center">
          <template slot-scope="{row}">
            <span>{{ formatNumberOrNull(row.amount) }}{{ row.discount_by === 1 ? '%' : 'đ' }} {{ row.max_discount !== 0 ? '- tối đa ' + formatNumberOrNull(row.max_discount) + ( row.discount_by === 1 ? '%' : 'đ') : '' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="Sân" align="center">
          <template slot-scope="{row}">
            <span>{{ row.facility?.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại" align="center">
          <template slot-scope="{row}">
            <span>{{ typeFee[row.type_code] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Phương thức" align="center">
          <template slot-scope="{row}">
            <span>{{ typeMethodFee[row.type_method] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thời gian" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ convertDateTimeSecond(row.date_start) }} - {{ convertDateTimeSecond(row.date_end) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tối đa số lần nhập mỗi golfer	" align="center">
          <template slot-scope="{row}">
            <span>{{ formatNumberOrNull(row.count_per_user) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Số mã đã sử dụng" />
        <el-table-column label="Public" align="center">
          <template slot-scope="{row}">
            <el-tag :type="+row.is_active === 1 ? 'success' : 'danger'">{{ +row.is_active === 1 ? 'Đã kích hoạt' : 'Không kích hoạt' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Giá cuối cùng	" align="center">
          <template slot-scope="{row}">
            <span>{{ formatNumberOrNull(row.last_price) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleEdit(row)">Sửa</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total >= listQuery.limit"
        :total="total"
        :limit.sync="listQuery.limit"
        :page.sync="listQuery.page"
        @pagination="getList"
      />
    </div>

    <el-dialog :title="dialog.titleName" :visible.sync="dialogFormVisible" width="50%" :before-close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Tên phụ phí">
              <el-form-item prop="title">
                <el-input v-model="form.title" class="w-100" placeholder="Tên phụ phí" />
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Mã phụ phí">
              <el-form-item prop="code">
                <el-input v-model="form.code" class="w-100" placeholder="Mã phụ phí" />
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Sân" prop="facility_id">
              <search-facility :clear-data="isClear" :data-model="facilityModel" @selection-changed-facility="selectFacility" />
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Loại phụ phí">
              <el-form-item prop="type_code">
                <el-select v-model="form.type_code" class="w-100" placeholder="Chọn loại phụ phí">
                  <el-option v-for="(item, index) in typeFee" :key="index" :label="item" :value="index" />
                </el-select>
              </el-form-item>
            </el-form-item>

          </el-col> -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Phương thức">
              <el-form-item prop="type_method">
                <el-select v-model="form.type_method" class="w-100" placeholder="Chọn phương thức">
                  <el-option v-for="(item, index) in typeMethodFee" :key="index" :label="item" :value="index" />
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item
              prop="discount_by"
              label="Loại phương thức"
            >
              <el-select v-model="form.discount_by" class="w-100" @change="handleByDiscount">
                <el-option v-for="item in typeDiscount" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required :label="`Giá trị (${form.discount_by === 1 ? '%' : 'đ'})`">
              <el-form-item prop="amount">
                <el-input v-model="form.amount" type="number" class="w-100" placeholder="Giá trị" />
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required :label="`Tối đa giảm (${form.discount_by === 1 ? '%' : 'đ'})`">
              <el-form-item prop="max_discount">
                <el-input v-model="form.max_discount" type="number" class="w-100" placeholder="Tối đa giảm" />
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Tối đa số lần nhập mỗi golfer">

              <el-form-item prop="count_per_user">
                <el-input v-model="form.count_per_user" type="number" min="1" class="w-100" placeholder="Tối đa số lần nhập mỗi golfer" />
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Giá cuối cùng" prop="last_price">
              <el-input v-model=" form.last_price" class="w-100" placeholder="Giá cuối cùng" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Thời gian bắt đầu">
              <el-form-item prop="date_start">
                <el-date-picker
                  v-model="form.date_start"
                  class="w-100"
                  type="date"
                  format="dd-MM-yyyy"
                  placeholder="Chọn thời gian bắt đầu"
                  value-format="timestamp"
                />
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item required label="Thời gian kết thúc">
              <el-form-item prop="date_end">
                <el-date-picker
                  v-model="form.date_end"
                  class="w-100"
                  type="date"
                  format="dd-MM-yyyy"
                  placeholder="Chọn thời gian kết thúc"
                  value-format="timestamp"
                />
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Public" prop="is_active">
              <el-switch v-model="form.is_active" class="w-100" active-value="1" inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Hủy</el-button>
        <el-button type="primary" @click="handleSubmit">{{ dialog.buttonName }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CodeSurchargeFacility from '@/api/CodeSurchargeFacility'
import Pagination from '@/components/Pagination/index.vue'
import { formatNumberOrNull, convertDateTimeSecond, convertDate } from '@/utils/convert'
import { TYPE_FEE, TYPE_FEE_PRIVATE, TYPE_FEE_PUBLIC, TYPE_METHOD_FEE, TYPE_METHOD_FEE_ADD, TYPE_METHOD_FEE_SUB } from '@/utils/status'
import SearchFacility from '@/views/component/SearchFacility.vue'
import moment from 'moment'
import { isEmpty, validateNumber, validateText } from '@/utils/validate'

const codeSurchargeFacility = new CodeSurchargeFacility()

export default {
  name: 'Surcharge',
  components: { SearchFacility, Pagination },
  data() {
    return {
      rules: {
        title: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.title, callback, 'Tên phụ phí'),
            trigger: 'change'
          }
        ],
        code: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.code, callback, 'Mã phụ phí'),
            trigger: 'change'
          }
        ],
        // type_code: [
        //   {
        //     validator: (rule, _, callback) =>
        //       validateText(rule, this.form.type_code, callback, 'Loại phụ phí'),
        //     trigger: 'change'
        //   }
        // ],
        type_method: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.type_method, callback, 'Phương thức'),
            trigger: 'change'
          }
        ],
        amount: [
          {
            validator: (rule, _, callback) =>
              validateNumber(rule, this.form.amount, callback, 'Giá trị', 0, this.form.discount_by === 1 ? 100 : 0),
            trigger: 'change'
          }
        ],
        max_discount: [
          {
            validator: (rule, _, callback) =>
              validateNumber(rule, this.form.max_discount, callback, 'Tối đa giảm', 0, this.form.discount_by === 1 ? 100 : 0),
            trigger: 'change'
          }
        ],
        date_start: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.date_start, callback, 'Thời gian bắt đầu'),
            trigger: 'change'
          }
        ],
        date_end: [
          {
            validator: (rule, _, callback) =>
              validateText(rule, this.form.date_end, callback, 'Thời gian kết thúc'),
            trigger: 'change'
          }
        ],
        count_per_user: [
          {
            validator: (rule, _, callback) =>
              validateNumber(rule, this.form.count_per_user, callback, 'Tối đa số lần nhập mỗi golfer'),
            trigger: 'change'
          }
        ]
      },
      dataTable: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      typeFee: TYPE_FEE,
      typeFeePrivate: TYPE_FEE_PRIVATE,
      typeFeePublic: TYPE_FEE_PUBLIC,
      typeMethodFee: TYPE_METHOD_FEE,
      typeMethodFeeAdd: TYPE_METHOD_FEE_ADD,
      typeMethodFeeSub: TYPE_METHOD_FEE_SUB,
      dialogFormVisible: false,
      form: {
        title: '',
        facility_id: '',
        type_code: 1,
        type_method: '',
        amount: '',
        max_discount: '',
        count_per_user: '',
        date_start: '',
        date_end: '',
        is_active: '',
        discount_by: 0
      },
      typeDiscount: [{ value: 0, label: 'Tiền mặt' }, { value: 1, label: 'Phần trăm' }],
      lastPrice: null,
      facilityModel: {},
      isClear: false,
      isAdd: true,
      dialog: { titleName: 'Thêm mới phụ phí', buttonName: 'Thêm' }
    }
  },
  watch: {
    dialogFormVisible(val) {
      this.isClear = !val
    },
    lastPrice(value) {
      if (isEmpty(value)) {
        this.form.last_price = null
      }
    },
    isAdd(value) {
      if (value) {
        this.dialog = { titleName: 'Thêm mới phụ phí', buttonName: 'Thêm' }
      } else {
        this.dialog = { titleName: 'Cập nhật phụ phí', buttonName: 'Cập nhập' }
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      codeSurchargeFacility.search(this.listQuery).then(res => {
        console.log(res)
        this.dataTable = res.data.rows
        this.total = res.data.count
        console.log('this.dataTable.................................', this.dataTable)
      })
    },
    async handleByDiscount(val) {
      await Promise.resolve(
        delete this.form.amount,
        delete this.form.max_discount
      )

      this.$refs['form'].clearValidate(['amount', 'max_discount'])
    },
    onReset() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.getList()
    },
    async handleSubmit() {
      this.$refs['form'].validate(async(validate) => {
        if (validate) {
          this.form.type_code = 1
          console.log(this.form)
          if (this.isAdd) {
            await codeSurchargeFacility.created(this.form).then(res => {
              if (res.error_code === 0) {
                this.$message.success(res.data)
                this.closeDialog()
                this.getList()
              } else {
                this.$message.error(res.error_msg)
              }
            })
          } else {
            console.log('thissssss', this.form)
            if (this.form.last_price === '') {
              this.form.last_price = null
            }
            await codeSurchargeFacility.update(this.form, this.form.id).then(res => {
              if (res.error_code === 0) {
                this.$message.success(res.data)
                this.closeDialog()
                this.getList()
              } else {
                this.$message.error(res.error_msg)
              }
            })
          }
        }
      })
    },
    handleEdit(row) {
      console.log('row___________', row)
      this.form = row
      this.isAdd = false
      this.form.is_active = this.form.is_active.toString()
      this.form.type_method = this.form.type_method.toString()
      this.form.type_code = this.form.type_code.toString() || 1
      this.form.date_start = moment(this.form.date_start).unix() * 1000
      this.form.date_end = moment(this.form.date_end).unix() * 1000
      this.form.discount_by = row.discount_by || 0
      console.log('this.form', this.form)
      this.facilityModel = {
        value: row.facility_id,
        label: row.facility?.title,
        booking: undefined,
        path: []
      }
      console.log('this.facilityModel', this.facilityModel)
      this.dialogFormVisible = true
    },
    handleCreate() {
      console.log('handleCreate')
      this.form = {
        discount_by: 0
      }
      this.isAdd = true
      this.facilityModel = {}
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('Bạn có chắc chắn muốn xóa phụ phí này?', 'Cảnh báo', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
        type: 'warning'
      })
        .then(() => {
          codeSurchargeFacility.deleted({ id: row.id }).then(res => {
            this.$message({
              type: 'success',
              message: 'Xóa phụ phí thành công!'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    selectFacility(val) {
      console.log('selectFacility', val)
      this.form.facility_id = val.value
    },
    async closeDialog() {
      await Promise.resolve(
        this.dialogFormVisible = false,
        this.isClear = true,
        this.isAdd = true,
        this.facilityModel = {}
      )
      this.$refs['form'].clearValidate()
    },
    formatNumberOrNull, convertDateTimeSecond, convertDate
  }
}
</script>
