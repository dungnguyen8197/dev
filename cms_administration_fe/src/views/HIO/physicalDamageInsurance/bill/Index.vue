<template>
  <div class="p-10">
    <el-row class="mb-10">
      <el-col :span="12">
        <h4>Danh sách đơn hàng</h4>
      </el-col>
    </el-row>
    <el-row class="p-10">
      <el-col :span="4" class="mr-1 mb-1">
        <el-input
          v-model="listQuery.id_material_covered"
          size="small"
          placeholder="Mã đơn hàng"
          clearable
          @change="changeSearch"
        />
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <search-admin size="small" @selection-changed-admin="handleSelectionChangedAdmin" />
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <search-user size="small" @selection-changed-user="handleSelectionChangedUser" />
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <search-facility size="small" @selection-changed-facility="handleSelectionChangedFacility" />
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <search-agency-h-i-o size="small" @selection-changed-agency-hio="handleSelectionChangedAgency" />
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <el-select
          v-model="listQuery.status"
          size="small"
          clearable
          placeholder="Trạng thái"
          class="filter-item mr-10 w-100"
          @change="changeSearch"
        >
          <el-option v-for="(item, key) in status" :key="key" :label="item" :value="key" />
        </el-select>
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <el-select
          v-model="listQuery.is_pay"
          size="small"
          clearable
          placeholder="Trạng thái thanh toán"
          class="filter-item mr-10 w-100"
          @change="changeSearch"
        >
          <el-option value="1" label="Đã thanh toán" />
          <el-option value="0" label="Chưa thanh toán" />
        </el-select>
      </el-col>
      <el-col :span="4" class="mr-1 mb-1">
        <el-select
          v-model="listQuery.is_send_pvi"
          size="small"
          clearable
          placeholder="Trạng thái gửi PVI"
          class="filter-item mr-10 w-100"
          @change="changeSearch"
        >
          <el-option v-for="(item, key) in statusSendPVI" :key="key" :value="key" :label="item" />
        </el-select>
      </el-col>
      <el-col :sm="6">
        <el-date-picker
          v-model="dateRange"
          size="small"
          class="date-rang-history"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
        />
      </el-col>
    </el-row>
    <el-row style="padding-bottom: 10px">
      <el-button round icon="el-icon-refresh" @click="onResetQuery">Tải lại</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onGetList">
        Tìm kiếm
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="onExportExcel">
        Export Excel
      </el-button>
      <el-button type="success" @click="dialogBillFormVisible = true">Tạo đơn +</el-button>
    </el-row>
    <el-row>
      <el-table
        v-loading="loadingTable"
        :data="dataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="STT"
          :index="handleIndexMethod"
          width="50"
          align="center"
        />
        <el-table-column
          prop="id"
          label="Mã BH"
          align="center"
        />
        <el-table-column
          label="Đại lý"
          align="center"
        >
          <template slot-scope="{row}">
            <span style="margin-left: 10px">{{ row.agent ? row.agent.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name_tour"
          label="Tên giải đấu"
          align="center"
        />
        <el-table-column
          prop="course_name"
          label="Tên sân"
          align="center"
        />
        <el-table-column
          prop="hole_select"
          label="Hố"
          align="center"
        >
          <template slot-scope="{row}">
            <span style="margin-left: 10px">{{ row.hole_select.replace(/,$/, '') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="Mã ID"
          align="center"
        />
        <el-table-column
          label="Tên sản phẩm"
          align="center"
        >
          <template slot-scope="{row}">
            <div style="display: block">
              <span>{{ row.product ? row.product.name : '' }}</span>
            </div>
            <div>
              <span>{{ row.product ? formatNumber(row.product.price) : '' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Số người chơi"
          align="center"
        >
          <template slot-scope="{row}">
            {{ row.ListUserMaterialCovered ? row.ListUserMaterialCovered.length : '' }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          prop="name"-->
        <!--          label="Dòng"-->
        <!--          align="center"-->
        <!--        />-->
        <!--        <el-table-column-->
        <!--          prop="name"-->
        <!--          label="Model"-->
        <!--          align="center"-->
        <!--        />-->
        <el-table-column
          prop="total_pay"
          label="Giá"
          align="center"
        >
          <template slot-scope="{row}">
            <span style="margin-left: 10px">{{ formatNumber(row.total_pay) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày chơi"
          align="center"
        >
          <template slot-scope="{row}">
            <span style="margin-left: 10px">{{ convertDateTime(row.date_played) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày tạo"
          align="center"
        >
          <template slot-scope="{row}">
            <span style="margin-left: 10px">{{ convertDateTime(row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Trạng thái đơn hàng"
          align="center"
          width="160px"
        >
          <template slot-scope="{row}">
            <p>{{ renderStatus(row) }}</p>
            <el-tag v-if="row.is_send_pvi === -1" type="danger">
              Gửi PVI lỗi
            </el-tag>
            <el-tag v-else>
              {{ statusSendPVI[row.is_send_pvi] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Trạng thái gạch nợ"
          align="center"
          width="150px"
        >
          <template slot-scope="{row}">
            <template v-if="row.is_pay === 1">
              <el-tag type="success">Đã gạch nợ</el-tag>
            </template>
            <template v-else>
              <el-tag type="danger">Chưa gạch nợ</el-tag>
              <div
                v-if="row.is_pay === 0 &&
                  row.is_send_email === 0 &&
                  row.status === statusCMSConfirm && !isEmpty(roles.find(role => role.name === 'role_statistic'))"
                class="m-1"
              >
                <el-button type="primary" size="mini" @click="confirmPayment(row)">
                  Gạch nợ bằng tay
                </el-button>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_name"
          label=" Người xử lý"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag type="primary" style="margin-left: 10px">{{ row.sale_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="Ghi chú"
          align="center"
        />
        <el-table-column
          prop="name"
          label="Hành động"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              :disabled="row.is_send_email > 0"
              class="mg-5"
              type="primary"
              size="mini"
              @click="onEdit(row)"
            >
              <i class="el-icon-edit" />
            </el-button>
            <!--            <el-button-->
            <!--              disabled-->
            <!--              class="mg-5"-->
            <!--              type="danger"-->
            <!--              size="mini"-->
            <!--              @click="onDelete(row)"-->
            <!--            >-->
            <!--              <i class="el-icon-delete" />-->
            <!--            </el-button>-->
            <el-button
              class="mg-5"
              circle
              icon="el-icon-view"
              :title="`Xem thông tin ảnh giám sát`"
              @click="onShowDialogImage(row)"
            />
            <el-button
              v-if="row.status === statusInit"
              class="mg-5"
              type="primary"
              size="mini"
              :title="`Xác nhận bán`"
              @click="confirmSale(row)"
            >
              Xác nhận bán
            </el-button>
            <el-button
              v-if="row.is_confirm_supervisor &&
                row.is_pay === 1 &&
                row.is_send_email === 0 &&
                row.status === statusCMSConfirm &&
                !isEmpty(roles.find(role => role.name === 'role_statistic'))"
              v-loading="loadingSendMail"
              class="mg-5"
              type="primary"
              size="mini"
              :title="`Gửi Mail PVI`"
              @click="sendMailPVI(row)"
            >
              Gửi mail PVI
            </el-button>
            <el-col v-if="row.is_pay === 1">
              <el-link :href="`/#/certificate-item/${row.id}`" target="_blank">
                <el-button :title="`Xem giấy chứng nhận`">GCN</el-button>
              </el-link>
            </el-col>
            <template>
              <!--              <el-button-->
              <!--                v-if="row.is_send_email === 0 && row.status === statusCMSConfirm"-->
              <!--                v-loading="loadingSendMail"-->
              <!--                class="mg-5"-->
              <!--                circle-->
              <!--                icon="el-icon-message"-->
              <!--                :title="`Gửi mail PVI`"-->
              <!--                @click="sendMailPVI(row)"-->
              <!--              />-->
              <el-button
                v-if="row.is_send_email === 1 && row.is_send_pvi === 0 && row.is_pay === 1"
                v-loading="loadingSendMail"
                class="mg-5"
                circle
                icon="el-icon-upload2"
                :title="`Xác nhận gửi đơn sang PVI`"
                @click="sendConfirmPVI(row)"
              />
            </template>
            <el-button
              v-if="!isEmpty(row.PaymentInfo)"
              size="mini"
              title="Xem thông tin thanh toán"
              @click="onShowPayment(row)"
            >
              <i class="el-icon-money" />
            </el-button>
            <el-button
              v-if="!isEmpty(row.array_img_request)"
              size="mini"
              title="Xem thông tin ảnh yêu cầu"
              @click="onShowImageRequest(row)"
            >
              <i class="el-icon-picture" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination
      v-show="total >= listQuery.number"
      :total="total"
      :limit.sync="listQuery.number"
      :page.sync="listQuery.page"
      @pagination="onGetList"
    />
    <dialog-insurance-bill-form
      :data-edit="objectBill"
      :dialog-form-visible="dialogBillFormVisible"
      @closeDialog="closeDialogBillForm"
    />
    <dialog-show-image
      :object-bill="objectBill"
      :dialog-visible="dialogShowImageVisible"
      @closeDialog="closeDialogShowImage"
    />
    <el-dialog title="Danh sách code thanh toán" :visible.sync="dialogCodePaymentVisible">
      <el-table v-loading="loadingDetail" :data="dataDialogCodePayment" stripe>
        <el-table-column label="Code" align="center">
          <template slot-scope="{row}">
            {{ JSON.parse(row.request_data) ? JSON.parse(row.request_data).bank_verified_code : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Ngày tạo" align="center" />
        <el-table-column prop="user_id" label="User" align="center" />
        <el-table-column prop="status" label="Trạng thái" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.status === 1" type="success">Đã thanh toán</el-tag>
            <el-tag v-else type="danger">Chưa thanh toán</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="QR code"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 150px; height: auto"
              :src="row.qr_code"
            />
            <el-button
              class="ml-15"
              size="mini"
              type="primary"
              icon="el-icon-download"
              @click="handleDownloadQR(row.qr_code)"
            >Download
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="Tổng tiền"
          align="center"
        >
          <template slot-scope="{row}">
            {{
              JSON.parse(row.request_data) && JSON.parse(row.request_data).total_pay ? `${formatNumber(JSON.parse(row.request_data).total_pay)} VNĐ` : ''
            }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import DialogInsuranceBillForm from '@/views/HIO/physicalDamageInsurance/bill/component/DialogCreateEdit.vue'
import PhysicalDamegeInsurance from '@/api/HIO/physicalDamegeInsurance'
import DialogShowImage from '@/views/HIO/physicalDamageInsurance/bill/component/DialogShowImage.vue'
import {
  TYPE_STATUS_HIO_PHYSICAL,
  TYPE_STATUS_HIO_PHYSICAL_INIT,
  TYPE_STATUS_HIO_PHYSICAL_SUCCESS,
  TYPE_STATUS_HIO_PHYSICAL_CMS_CONFIRM,
  TYPE_STATUS_HIO_PHYSICAL_PVI,
  STATUS_SEND_PVI
} from '@/utils/status'
import { getAdmin } from '@/utils/auth'
import SearchAdmin from '@/views/component/SearchAdmin.vue'
import SearchUser from '@/views/component/SearchUser.vue'
import SearchFacility from '@/views/component/SearchFacility.vue'
// import SearchAgency from '@/views/component/SearchAgency.vue'
import SearchAgencyHIO from '@/views/component/SearchAgencyHIO.vue'
import { isEmpty } from '@/utils/validate'
import { convertDateTime, formatNumber, convertDate } from '@/utils/convert'
import InsuranceApi from '@/api/HIO/insurance'
import { pickerOptions } from '@/utils/dateRangOptions'
import moment from 'moment'
import { baseURL } from '@/constant/config'

const insuranceApi = new InsuranceApi()

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()
console.log('getAdmin()...................................', getAdmin())

const roles = getAdmin().role_admin

// kiểm tra trong mảng role có role "role_statistic" không
const roleStatistic = roles.find(role => role.name === 'role_statistic')
console.log('roleStatistic...................................', roleStatistic)

export default {
  name: 'InsuranceBillIndex',
  components: {
    SearchAgencyHIO,
    // SearchAgency,
    SearchFacility,
    SearchUser,
    SearchAdmin,
    DialogShowImage,
    DialogInsuranceBillForm,
    Pagination
  },
  data() {
    console.log('roles...................................', getAdmin())
    return {
      dateRange: [],
      pickerOptions: {
        shortcuts: pickerOptions
      },
      listQuery: {
        page: 1,
        number: 10
      },
      total: 2000,
      dataTable: [],
      loadingTable: false,
      dialogBillFormVisible: false,
      listCategory: [],
      listImage: [],
      dialogShowImageVisible: false,
      objectBill: {},
      loadingSendMail: false,
      statusSendPVI: STATUS_SEND_PVI,
      status: TYPE_STATUS_HIO_PHYSICAL,
      statusInit: TYPE_STATUS_HIO_PHYSICAL_INIT,
      statusSuccess: TYPE_STATUS_HIO_PHYSICAL_SUCCESS,
      statusCMSConfirm: TYPE_STATUS_HIO_PHYSICAL_CMS_CONFIRM,
      statusPVI: TYPE_STATUS_HIO_PHYSICAL_PVI,
      dialogCodePaymentVisible: false,
      dataDialogCodePayment: [],
      dataDialogImageRequest: [],
      roles: roles,
      loadingDetail: false
    }
  },
  watch: {
    dateRange(value) {
      if (value !== null) {
        this.listQuery.date_start = moment(value[0]).format('YYYY-MM-DD 00:00:00')
        this.listQuery.date_end = moment(value[1]).format('YYYY-MM-DD 23:59:59')
      } else {
        this.listQuery.date_start = null
        this.listQuery.date_end = null
      }
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onResetQuery() {
      this.listQuery = Object.assign({ page: 1,
        number: 10 })
      this.dateRange = null
      this.onGetList()
    },
    convertDate,
    convertDateTime,
    onGetList() {
      this.loadingTable = true
      // if (!isEmpty(this.listQuery.agency_id) ||
      //   !isEmpty(this.listQuery.facility_id) ||
      //   !isEmpty(this.listQuery.user_id) ||
      //   !isEmpty(this.listQuery.admin_id) ||
      //   !isEmpty(this.listQuery.status) ||
      //   !isEmpty(this.listQuery.is_pay) ||
      //   !isEmpty(this.listQuery.is_send_pvi) ||
      //   !isEmpty(this.listQuery.id_material_covered)
      // ) {
      //   console.log('vao day............................', this.listQuery)
      //   physicalDamageInsuranceProductResource.searchBill(this.listQuery).then(response => {
      //     console.log('response................', response)
      //     this.dataTable = response.data
      //     console.log('this.total................', this.total)
      //     console.log('vao day                this.dataTable................', this.dataTable)
      //     // lặp qua tất cả các phần tử trong mảng table. nếu trong danh sách của mỗi phần tử chưa confirm request thì set key is_confirm = false nếu đã confirm request thì set key is_confirm = true
      //     this.dataTable.forEach(item => {
      //       item.is_confirm_supervisor = true
      //       if (item.ListHoleInspector.length === 0) {
      //         item.is_confirm_supervisor = false
      //       }
      //       item.ListHoleInspector.forEach(image => {
      //         if (image.request_confirm !== 1) {
      //           item.is_confirm_supervisor = false
      //         }
      //       })
      //     })
      //     this.loadingTable = false
      //   })
      //   return
      // }
      insuranceApi.cms_list_masterial_coverd(this.listQuery).then(response => {
        console.log('response................', response)
        this.dataTable = response.data
        console.log('this.total................', this.total)
        // lặp qua tất cả các phần tử trong mảng table. nếu trong danh sách của mỗi phần tử chưa confirm request thì set key is_confirm = false nếu đã confirm request thì set key is_confirm = true
        this.dataTable.forEach(item => {
          item.is_confirm_supervisor = true
          if (item.ListHoleInspector.length === 0) {
            item.is_confirm_supervisor = false
          }
          item.ListHoleInspector.forEach(image => {
            if (image.request_confirm !== 1) {
              item.is_confirm_supervisor = false
            }
          })
        })
        console.log('this.dataTable................', this.dataTable)

        this.loadingTable = false
      })
    },
    // onExportExcel() {
    //   physicalDamageInsuranceProductResource.exportExcelBill(this.listQuery).then(res => {
    //     console.log('res................', res)
    //     const link = document.createElement('a')
    //     // nếu trong link trả về không có http hoặc https thì thêm vào
    //     link.href = res.data.link.includes('http') ? res.data.link : 'http://' + res.data.link
    //     link.download = 'statistic.xlsx'
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //   }).catch(err => {
    //     this.$message.error(err?.error_code || 'Có lỗi xảy ra')
    //   }).finally(() => {
    //     this.loadingExportExcel = false
    //   })
    // },
    onExportExcel() {
      this.loadingExportExcel = true
      physicalDamageInsuranceProductResource.exportExcelBill(this.listQuery).then(response => {
        var fileLink = document.createElement('a')
        const params = new URLSearchParams(this.listQuery).toString()
        fileLink.href = `${baseURL}insurance-hio/export-excel-material?${params}`
        fileLink.setAttribute('download', 'proposed_file_name')

        document.body.appendChild(fileLink)

        fileLink.click()
        this.$message({
          message: 'Export thành công',
          type: 'success',
          duration: 5 * 1000
        })
      })
        .finally(() => {
          this.loadingExportExcel = false
        })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.number + index + 1
    },
    closeDialogBillForm(data) {
      if (data.reload === true) {
        this.onGetList()
      }
      this.dialogBillFormVisible = false
      this.objectBill = {}
    },
    onShowDialogImage(row) {
      this.dialogShowImageVisible = true
      this.objectBill = row
      console.log('this.objectBill................', this.objectBill)
    },
    closeDialogShowImage() {
      console.log('closeDialogShowImage................')
      this.dialogShowImageVisible = false
      this.objectBill = {}
    },
    async sendMailPVI(row) {
      this.$confirm('Đã xác nhận bán. Bạn muốn tiếp tục gửi mail xác nhận bán đơn bảo hiểm sang PVI?', 'Cảnh báo', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.loadingSendMail = true
        console.log('sendMailPVI................', row)
        const dataRequest = { ...row }
        dataRequest.total_member = dataRequest.ListUserMaterialCovered.length

        console.log('dataRequest................', dataRequest)

        const url = process.env.VUE_APP_URL_API_BOOKING_VCALL + '/api/v1/send-mail-pvi'
        physicalDamageInsuranceProductResource.sendMailConfirmSaleToPVI(dataRequest, url).then(response => {
          console.log('response.....................', response)
          if (response.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Gửi mail thành công'
            })
            console.log('vào đây.....................')
            const data = {
              id_material_covered: row.id,
              status: this.statusPVI,
              is_send_email: 2
            }
            console.log('data.....................', data)
            physicalDamageInsuranceProductResource.confirmSaleHIO(data).then(response => {
              console.log('response.....................', response)
              if (response.error_code === 0) {
                this.$message({
                  type: 'success',
                  message: 'Xác nhận bán thành công'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: 'Xác nhận bán thất bại'
                })
              }
              this.onGetList()
            }).catch(error => {
              console.log('error.....................', error)
              this.$message({
                type: 'error',
                message: 'Xác nhận bán thất bại'
              })
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Gửi mail thất bại'
            })
            return false
          }
          this.loadingSendMail = false
        }).catch(error => {
          console.log('error.....................', error)
          this.$message({
            type: 'error',
            message: 'Gửi mail thất bại'
          })
          this.loadingSendMail = false
          return false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Send mail canceled'
        })
        return false
      })
    },
    sendConfirmPVI(row) {
      console.log(row)
      this.$confirm('Đã xác nhận được tiền. Bạn muốn tiếp tục gửi xác nhận bán đơn bảo hiểm sang PVI?', 'Cảnh báo', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // call api xác nhận sang PVI
        const data = {
          cms_id: getAdmin().id,
          masterial_coverd_id: row.id
        }
        this.loadingSendMail = true
        physicalDamageInsuranceProductResource.pushOrderToPVI(data).then(res => {
          if (res.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Gửi xác nhận bán sang PVI thành công'
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Gửi xác nhận bán sang PVI thất bại'
            })
          }
          this.loadingSendMail = false
        }).catch(error => {
          console.log('error.....................', error)
          this.$message({
            type: 'error',
            message: 'Gửi xác nhận bán sang PVI thất bại'
          })
          this.loadingSendMail = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Push Order canceled'
        })
      })
    },
    confirmSale(row) {
      console.log('confirmSale................', row)
      this.$confirm('Bạn muốn xác nhận bán đơn bảo hiểm này?', 'Cảnh báo', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        console.log('confirmSale................', row)

        const data = {
          id_material_covered: row.id,
          status: this.statusCMSConfirm,
          sale_name: getAdmin().name,
          cms_id: getAdmin().id
        }
        physicalDamageInsuranceProductResource.confirmSaleHIO(data).then(response => {
          console.log('response.....................', response)
          if (response.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Xác nhận bán thành công'
            })
            let dataCreateCodePayment = { ...row }
            delete dataCreateCodePayment.ListUserMaterialCovered

            dataCreateCodePayment = {
              body_create: [{
                body_payment: {
                  data_provider: { ...dataCreateCodePayment, ...{ screenSuccess: 'ResultPaymentInsurance', type_hio: 3 }},
                  provider: 'buy_masterial_coverd',
                  type: 'bank',
                  money: row.total_pay
                },
                user_id: row.user_id
              }]
            }

            physicalDamageInsuranceProductResource.createCodePayment(dataCreateCodePayment).then(response => {
              console.log('response.....................', response)
              if (response.error_code === 0) {
                this.$message({
                  type: 'success',
                  message: 'Tạo mã thanh toán thành công'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: 'Tạo mã thanh toán thất bại'
                })
              }
            }).catch(error => {
              console.log('error.....................', error)
              this.$message({
                type: 'error',
                message: 'Tạo mã thanh toán thất bại'
              })
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Xác nhận bán thất bại'
            })
          }
          this.onGetList()
        }).catch(error => {
          console.log('error.....................', error)
          this.$message({
            type: 'error',
            message: 'Xác nhận bán thất bại'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Xác nhận bán canceled'
        })
      })
    },
    onEdit(row) {
      console.log('onEdit................', row)
      physicalDamageInsuranceProductResource.detailBillInsurance({
        cms_id: getAdmin().id,
        masterial_coverd_id: row.id
      }).then(res => {
        console.log('res........................', res)
        if (res.error_code === 0) {
          this.objectBill = res.data
        }
      })
      this.dialogBillFormVisible = true
    },
    handleSelectionChangedAdmin(data) {
      console.log('data................', data)
      this.listQuery.admin_id = data
      this.onGetList()
    },
    handleSelectionChangedUser(data) {
      console.log('data................', data)
      this.listQuery.user_id = data.value
      this.onGetList()
    },
    handleSelectionChangedFacility(data) {
      console.log('data................', data)
      this.listQuery.facility_id = data.value
      this.onGetList()
    },
    handleSelectionChangedAgency(data) {
      console.log('data................', data)
      this.listQuery.agent_id = data.id
      this.onGetList()
    },
    onShowPayment(row) {
      console.log('onShowPayment................', row)
      this.loadingDetail = true
      physicalDamageInsuranceProductResource.getInfoPayment({
        cms_id: getAdmin().id,
        id_material_covered: row.id
      }).then(response => {
        console.log('getInfoPayment................', response)
        if (+response.error_code === 0) {
          this.dataDialogCodePayment = response.data
          this.loadingDetail = false
        } else {
          this.loadingDetail = false
        }
      })
      this.dialogCodePaymentVisible = true
    },
    onShowImageRequest(row) {
      console.log('onShowImageRequest................', row.array_img_request)

      this.dataDialogImageRequest = row.array_img_request.split(',')
      this.$viewerApi({
        images: this.dataDialogImageRequest
      })
    },
    changeSearch() {
      this.onGetList()
    },
    renderStatus(row) {
      console.log('renderStatus................', row)
      let text = ''

      if (row.status === 2 && row.is_send_email === 0) {
        text = 'CMS đã xác nhận, chưa gửi mail'
      } else if (row.status === 3 && row.is_send_email === 2) {
        text = 'Đã gửi mail, PVI chưa xác nhận'
      } else if (row.status === 3 && row.is_send_email === 1) {
        text = 'Đã gửi mail, PVI đã xác nhận mail'
      }

      return text
    },
    handleDownloadQR(ImageBase64) {
      // Create a link element
      const downloadLink = document.createElement('a')

      // Set the download attribute and href with the base64 image data
      downloadLink.setAttribute('download', 'image.jpg')
      downloadLink.setAttribute('href', ImageBase64)

      // Trigger the download programmatically
      downloadLink.click()
    },
    confirmPayment(row) {
      console.log('confirmPayment................', row)
      this.$confirm('Bạn có muốn xác nhận đơn bảo hiểm ID' + row.id + ' này đã được thanh toán?', 'Xác nhận thanh toán', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        console.log('confirmSale................', row)

        const data = {
          id_material_covered: row.id,
          is_pay: 1,
          sale_name: getAdmin().name,
          cms_id: getAdmin().id
        }
        physicalDamageInsuranceProductResource.confirmSaleHIO(data).then(response => {
          console.log('response.....................', response)
          if (response.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Xác nhận thanh toán thành thành công'
            })

            this.onGetList()
          } else {
            this.$message({
              type: 'error',
              message: 'Xác nhận thanh toán thất bại'
            })
          }
        }).catch(error => {
          console.log('error.....................', error)
          this.$message({
            type: 'error',
            message: 'Xác nhận bán thất bại'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Xác nhận bán canceled'
        })
      })
    },
    isEmpty, formatNumber
  }
}
</script>

<style lang="scss" scoped>
.ml-15 {
  margin-left: 15px;
}

.update-passport {
  .el-dialog {
    width: 90% !important;
  }

  .w-100 {
    width: 100%;
  }
}

.lable-image {
  line-height: 36px;
  margin-bottom: 10px;
}

.pr-2 {
  padding-right: 10px;
}

.viewer {
  height: 400px;

  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;

    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;

      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>
