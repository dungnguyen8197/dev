<template>
  <el-dialog width="90%" :v-loading="loadingTable" :title="dialog.titleName" :visible.sync="showDialog" :before-close="handleClose">
    <template>
      <el-row class="reservation_booking_content">
        <el-row class="mb-20">
          <el-col :sm="6" class="pr-10">
            <el-select
              ref="searchFacility"
              v-model="facility"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="Nhập tên sân"
              style="width: 100%"
              :remote-method="searchFacility"
              :loading="loadingSearchFacility"
              @hook:mounted="(value) => cancelReadOnly(value, 'searchFacility')"
              @visible-change="(value) => cancelReadOnly(value, 'searchFacility')"
            >
              <el-option
                v-for="item in optionsFacility"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-row>
      <!-- :disabled="item.disabled" -->

      <div class="clearfix-20" />

      <el-table
        :data="priceFacility"
        width="100%"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="name"
          label="Tên sân"
        />
        <el-table-column
          prop="path_id"
          label="Đường"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.path_id" placeholder="Chọn đường" @change="(val) => handleChangePath(val, scope.row)">
              <el-option v-for="item in scope.row.paths" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="normal_price"
          label="Giá ngày thường"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.normal_price" type="number" placeholder="Nhập giá" />
          </template>
        </el-table-column>
        <el-table-column
          prop="holiday_price"
          label="Giá ngày lễ"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.holiday_price" type="number" placeholder="Nhập giá" />
          </template>
        </el-table-column>
        <el-table-column
          prop="type_discount"
          label="Loại giảm giá"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.type_discount" placeholder="Chọn loại giảm giá">
              <el-option v-for="item in typeDiscount" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="discount_amount"
          label="Giảm giá"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.discount_amount" type="number" placeholder="Nhập giảm giá" />
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="Hành động"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteFacility(scope.$index, scope.row)"
            >
              Xoá
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 15px" class="mt-20">
        <el-button @click="handleClose">Huỷ</el-button>
        <el-button type="primary" :loading="loadingData" @click="submitChangeFacility">Xác nhận</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script>
import AgencyResource from '@/api/agency'
import FacilityResource from '@/api/facility'
const agencyResource = new AgencyResource()
const facilityResource = new FacilityResource()

export default {
  name: 'DialogAddAgency',
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
      typeDiscount: [{ value: 0, label: 'Tiền mặt' }, { value: 1, label: 'Phần trăm' }],
      loadingSearchFacility: false,
      optionsFacility: [],
      loadingData: false,
      loadingTable: false,
      priceFacility: [],
      agencyId: null,
      facility: [],
      loadingSubmit: false,
      dialogLoading: false,
      request: {},
      paths: [],
      dialog: { titleName: 'Chi tiết', buttonName: 'Thêm mới' }
    }
  },

  watch: {
    objectData(value) {
      if (value) {
        this.agencyId = value.id
        this.showListFacility(value.id)
      }
    },
    facility: function(val) {
      if (val) {
      // const checkExists = this.priceFacility.find((item) => item.id === val.id)
        this.priceFacility = [...this.priceFacility, { stt: this.priceFacility.length + 1, ...val }]
        this.optionsFacility = this.optionsFacility.map((item) => {
          if (item.id === val.id) {
            item.disabled = true
          }
          return item
        })
      }
    }

  },

  methods: {
    handleChangePath(val, row) {
      if (this.priceFacility.filter(i => i.path_id === val).length > 1) {
        this.$message.error('Đường đã tồn tại.')
        delete row.path_id
      }
    },
    addFacility(value) {
      console.log('value', value)
      this.priceFacility = [...value]
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
    },
    showListFacility(id) {
      this.loadingTable = true
      agencyResource.detail(id).then(res => {
        console.log('res.....................', res)
        if (res.error_code === 0) {
          const result = res?.data
          console.log('res...........', result)
          this.priceFacility = result?.map((value, i) => {
            console.log('value', value)
            return {
              stt: i + 1,
              id: value.facility_id,
              value: value.facility_id,
              label: value.facility_name,
              name: value.facility_name,
              normal_price: value.normal_price,
              holiday_price: value.holiday_price,
              discount_amount: value.discount_amount,
              type_discount: value.type_discount,
              path_id: value.path_id,
              paths: value?.facility?.paths || []
            }
          })
        }
        console.log(' this.priceFacility', this.priceFacility)
      }).finally(() => {
        this.loadingTable = false
      })
    },
    deleteFacility(index, row) {
      console.log(index, row)
      this.priceFacility.splice(index, 1)
      this.optionsFacility = this.optionsFacility.map((item) => {
        if (item.id === row.id) {
          item.disabled = false
        }
        return item
      })
    },
    submitChangeFacility() {
      const self = this
      if (this.priceFacility.length < 1) {
        this.$message.error('Chưa có bản ghi được thêm.')
        return
      }
      this.loadingData = true
      console.log('...................................', this.priceFacility)

      agencyResource.changePriceFacility({ 'facility': self.priceFacility }, this.agencyId).then(res => {
        console.log('res.....................', res)
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    async searchFacility(query) {
      this.loadingSearchFacility = true
      const request = { keyword: query }
      facilityResource.search(request).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            const array = []
            result.map((value) => {
              const checkExits = this.priceFacility.find((item) => item.id === value.id)
              const item = {
                value: value.id,
                id: value.id,
                name: value.sub_title,
                label: value.sub_title,
                normal_price: 0,
                holiday_price: 0,
                disabled: checkExits !== undefined,
                paths: value.paths || []
              }
              array.push(item)
            })
            this.optionsFacility = [...array]
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchFacility = false
      })
    },
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    }
  }
}
</script>

<style scoped>
.mb-20{
  margin-bottom: 20px;
}
.w-100{
  width: 100%;
}

.text-right {
  float: right;
}
</style>
