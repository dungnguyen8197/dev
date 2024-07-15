<template>
  <div>
    <el-row class="p-10">
      <el-col :span="12">
        <h4>Danh sách sân bán bảo hiểm</h4>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" @click="dialogCreateHoleSaleVisible = true">Thêm mới hố</el-button>
      </el-col>
    </el-row>
    <el-row v-if="!isShowHoleSale">
      <el-col :span="8" class="p-10">
        <search-facility @selection-changed-facility="handleSelectionChanged" />
      </el-col>
      <el-col :span="16" class="p-10">
        <el-button type="primary" @click="onGetList">Tìm kiếm</el-button>
        <el-button type="primary" @click="activeFacility">Kích hoạt sân</el-button>
      </el-col>
    </el-row>

    <div class="p-10">
      <template v-if="!isShowHoleSale">
        <el-table v-loading="loadingFacility" :data="list" border style="width: 100%">
          <el-table-column prop="sub_title" label="Tên sân" />
          <el-table-column label="Kích hoạt">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_show_material_covered"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                @change="changeFacility(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="Hành động">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="onShowHoleSale(row)">Danh sách hố</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > listQuery.number"
          :total="total"
          :number.sync="listQuery.number"
          :page.sync="listQuery.page"
          @pagination="onGetList"
        />

      </template>
      <template v-else>
        <el-button icon="el-icon-arrow-left" class="mb-2" @click="back">
          Quay lại
        </el-button>
        <el-table v-loading="loadingHole" :data="listHole" border style="width: 100%">
          <el-table-column label="Tên hố">
            <template slot-scope="{row}">
              <p>Hố {{ row.stt }} - Đường {{ row.path_name }}</p>
            </template>
            ádasd
          </el-table-column>
          <el-table-column label="Kích hoạt">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_public"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                @change="changeHole(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <el-dialog title="Thêm mới hố" :visible.sync="dialogCreateHoleSaleVisible">
      <el-form v-model="formCreateHoleSale" label-width="80px">
        <el-form-item label="Tên sân" prop="facility_id">
          <search-facility :clear-data="clearFacility" @selection-changed-facility="handleSelectionChangedForm" />
        </el-form-item>
        <el-form-item label="Đường" prop="path_id">
          <el-select v-model="formCreateHoleSale.path_id" @change="selectPath">
            <el-option
              v-for="item in pathsCreate"
              :key="item.id + '-' + item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Hố" prop="hole_id">
          <el-select v-model="formCreateHoleSale.hole_id">
            <el-option v-for="item in holesCreate" :key="item.id + '-' + item.stt" :label="'Hố ' + item.stt + ' - Par ' + item.par" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateHoleSaleVisible = false">Hủy</el-button>
        <el-button v-loading="btnSubmitHoleSale" type="primary" @click="onSubmit">Lưu</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SearchFacility from '@/views/component/SearchFacility.vue'
import { isEmpty } from '@/utils/validate'
import PhysicalDamegeInsurance from '@/api/HIO/physicalDamegeInsurance'
import { getAdmin } from '@/utils/auth'
import axios from 'axios'

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()

export default {
  name: 'InsuranceFacilityIndex',
  components: {
    SearchFacility,
    Pagination
  },
  data() {
    console.log('getAdmin', getAdmin())
    return {
      listQuery: {
        page: 1,
        number: 10
      },
      total: 2000,
      list: [],
      listHole: [],
      loadingHole: false,
      loadingFacility: false,
      isShowHoleSale: false,
      formCreateHoleSale: {
        facility_id: '',
        path_id: '',
        hole_id: '',
        cms_id: getAdmin().id
      },
      pathsCreate: [],
      holesCreate: [],
      dialogCreateHoleSaleVisible: false,
      facilityForm: {},
      btnSubmitHoleSale: false,
      facilityShow: {},
      clearFacility: false,
      facilityModel: {}
    }
  },
  watch: {
    dialogCreateHoleSaleVisible(val) {
      console.log('val', val)
      this.formCreateHoleSale = {
        facility_id: '',
        path_id: '',
        hole_id: '',
        cms_id: getAdmin().id
      }
      this.clearFacility = !val
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingFacility = true
      physicalDamageInsuranceProductResource.listFacilitySale(this.listQuery).then(response => {
        console.log('response', response)
        this.list = response.data
        console.log('this.list', this.list.length)
        console.log('this.listQuery.number', this.listQuery.number)
        this.loadingFacility = false
      })
      console.log('this.list', this.list)
      this.loadingFacility = false
    },
    handleSelectionChanged(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.listQuery.q
        this.onGetList()
        return
      }
      this.facilityModel = value
      this.listQuery.q = value.label
      console.log('this.listQuery.facility_id', this.listQuery)
      this.onGetList()
    },
    handleSelectionChangedForm(value) {
      console.log('value', value)
      this.facilityForm = value
      if (isEmpty(value)) {
        delete this.formCreateHoleSale.facility_id
        return
      }
      this.formCreateHoleSale.facility_id = value.value
      this.pathsCreate = value.path
      console.log('this.pathsCreate', this.pathsCreate)
      console.log('this.formCreateHoleSale.facility_id', this.formCreateHoleSale)
    },
    changeFacility(row) {
      console.log('row', row)
      const dataRequest = {
        facility_id: row.id,
        is_public: row.is_show_material_covered ? 1 : 0,
        cms_id: getAdmin().id
      }
      console.log('dataRequest', dataRequest)
      physicalDamageInsuranceProductResource.activeFacilitySale(dataRequest).then(response => {
        console.log('response', response)
        if (response.error_code === 0) {
          this.$message({
            message: 'Kích hoạt thành công',
            type: 'success'
          })
          this.listQuery = {
            page: 1,
            number: 10
          }
          this.onGetList()
        } else {
          this.$message({
            message: response.error_msg,
            type: 'error'
          })
        }
      })
    },
    async changeHole(row) {
      console.log('row', row)
      console.log('this.facilityShow', this.facilityShow)
      const url = 'https://prod-wap-wghn.vcallid.com/hole/get-by-id'
      let data = ''
      await axios.post(url, { hole_id: row.hole_id }).then(res => {
        console.log('res', res)
        data = res.data.data
        // data = res.json()
      })
      console.log('data', data)

      console.log('data', data)
      const dataRequest = {
        hole_id: row.hole_id,
        path_id: data.path_id,
        facility_id: this.facilityShow.id,
        cms_id: this.formCreateHoleSale.cms_id,
        is_public: row.is_public ? 1 : 0
      }

      physicalDamageInsuranceProductResource.activeHoleSale(dataRequest).then(response => {
        console.log('response', response)
        if (response.error_code === 0) {
          this.$message({
            message: 'Cập nhật thành công',
            type: 'success'
          })
        } else {
          row.is_public = !row.is_public
          this.$message({
            message: response.error_msg,
            type: 'error'
          })
        }
      })
    },
    onShowHoleSale(row) {
      this.loadingHole = true
      this.isShowHoleSale = true
      console.log('row', row)
      this.facilityShow = row
      this.listHole = row.ListHoleInsurrance
      // loại bỏ các giá trị null và nếu phần tử nào không có key is_public thì thêm key disabled = true
      this.listHole = this.listHole.filter(item => item !== null)
      console.log('this.listHole', this.listHole)
      this.loadingHole = false
    },
    selectPath(value) {
      console.log('value', value)
      this.facilityForm.hole_id = ''
      this.holesCreate = this.facilityForm.path.find(item => item.id === value).hole
      console.log('this.holesCreate', this.holesCreate)
    },
    onSubmit() {
      this.btnSubmitHoleSale = true
      console.log('this.formCreateHoleSale', this.formCreateHoleSale)
      physicalDamageInsuranceProductResource.createHoleSale(this.formCreateHoleSale).then(response => {
        console.log('response', response)
        if (response.error_code === 0) {
          this.$message({
            message: 'Lưu thành công',
            type: 'success'
          })
          this.formCreateHoleSale = {
            facility_id: '',
            path_id: '',
            hole_id: '',
            cms_id: getAdmin().id
          }
        } else {
          this.$message({
            message: response.error_msg,
            type: 'error'
          })
        }
        this.btnSubmitHoleSale = false
        this.dialogCreateHoleSaleVisible = false
        this.onGetList()
      }).catch(error => {
        console.log('error', error)
        this.btnSubmitHoleSale = false
      })
    },
    back() {
      this.isShowHoleSale = false
    },
    activeFacility() {
      console.log(this.listQuery)
      console.log('this.facilityModel........................', this.facilityModel)
      if (isEmpty(this.listQuery.q) || this.listQuery.q === '') {
        this.$message({
          message: 'Vui lòng chọn trạm',
          type: 'error'
        })
        return
      }
      const dataActiveFacility = {
        facility_id: this.facilityModel.value,
        is_public: 1,
        cms_id: getAdmin().id
      }
      console.log('dataActiveFacility', dataActiveFacility)
      physicalDamageInsuranceProductResource.activeFacilitySale(dataActiveFacility).then(response => {
        console.log('response', response)
        if (response.error_code === 0) {
          this.$message({
            message: 'Kích hoạt thành công',
            type: 'success'
          })
          this.listQuery = {
            page: 1,
            number: 10
          }
          this.onGetList()
        } else {
          this.$message({
            message: response.error_msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
