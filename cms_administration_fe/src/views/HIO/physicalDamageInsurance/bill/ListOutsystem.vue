<template>
  <div class="p-10">
    <el-row class="mb-10">
      <el-col :span="12">
        <h4>DS ORDER GIẢI THƯỞNG NGOÀI HỆ THỐNG NHÉ</h4>
        <el-button round icon="el-icon-refresh" size="mini" @click="onGetList">Tải lại</el-button>
      </el-col>
      <!-- <el-col :span="12" class="text-right">
        <el-button type="primary" size="mini" @click="dialogBillFormVisible = true">Tạo đơn +</el-button>
      </el-col> -->
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
          prop="agent_id"
          label="Đại lý"
          align="center"
        />
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
        />
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
            <span style="margin-left: 10px">{{ row.ProductInfo ? row.ProductInfo.name : "" }}</span>
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
          label="Order giải thưởng "
          align="center"
        >
          <template slot-scope="{row}">
            {{ row.total_pay }} (VND)
          </template>
        </el-table-column>
        <el-table-column
          prop="date_played"
          label="Ngày chơi"
          align="center"
        />
        <el-table-column
          prop="created_at"
          label="Ngày tạo"
          align="center"
        />
        <el-table-column
          label="Trạng thái đơn hàng"
          align="center"
        >
          <template slot-scope="{row}">
            <p>{{ status[row.status] }}</p>
            <el-tag>
              {{ statusSendPVI[row.is_send_pvi] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Trạng thái gạch nợ"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.is_pay == 1" type="success">Đã gạch nợ</el-tag>
            <el-tag v-else type="danger">Chưa gạch nợ</el-tag>
          </template></el-table-column>
        <el-table-column
          prop="sale_name"
          label=" Người xử lý"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag type="primary" style="margin-left: 10px">{{ row.sale_name }}</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          prop="name"-->
        <!--          label="Ghi chú"-->
        <!--          align="center"-->
        <!--        />-->
        <el-table-column
          prop="name"
          label="Hành động"
          align="center"
        >
          <template slot-scope="{row}">
            <template v-if="row.is_done === 0">
              <el-button
                class="mg-5"
                type="primary"
                size="mini"
                @click="confirmSale(row)"
              >
                Xác nhận bán
              </el-button>
            </template>
            <template v-else>
              <el-tag type="success">Đã nhận xử lý</el-tag>
            </template>

            <!--            <el-button-->
            <!--              disabled-->
            <!--              class="mg-5 text-center"-->
            <!--              type="danger"-->
            <!--              size="mini"-->
            <!--              @click="onDelete(row)"-->
            <!--            >-->
            <!--              <i class="el-icon-delete" />-->
            <!--            </el-button>-->
            <!-- <el-button
              class="mg-5"
              circle
              icon="el-icon-view"
              :title="`Xem thông tin ảnh giám sát`"
              @click="onShowDialogImage(row)"
            /> -->
            <!-- <el-button
              v-if="row.status === statusInit"
              class="mg-5"
              type="primary"
              size="mini"
              :title="`Xem thông tin ảnh giám sát`"
              @click="confirmSale(row)"
            >
              Xác nhận bán
            </el-button> -->
            <!-- <el-button
              v-if="row.is_confirm_supervisor && row.is_pay === 1 && row.is_send_email === 0 && row.status === statusCMSConfirm"
              class="mg-5"
              type="primary"
              size="mini"
              :title="`Xem thông tin ảnh giám sát`"
              @click="sendMailPVI(row)"
            >
              Gửi mail PVI
            </el-button> -->
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
              <!-- <el-button
                v-if="row.is_send_email === 1 && row.is_send_pvi === 0 && row.is_pay === 1"
                v-loading="loadingSendMail"
                class="mg-5"
                circle
                icon="el-icon-upload2"
                :title="`Xác nhận gửi đơn sang PVI`"
                @click="sendConfirmPVI(row)"
              /> -->
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination
      v-show="total >= listQuery.limit"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="onGetList"
    />
    <dialog-insurance-bill-form :dialog-form-visible="dialogBillFormVisible" @closeDialog="closeDialogBillForm" />
    <dialog-show-image :object-bill="objectBill" :dialog-visible="dialogShowImageVisible" @closeDialog="closeDialogShowImage" />
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

const physicalDamageInsuranceProductResource = new PhysicalDamegeInsurance()

export default {
  name: 'InsuranceBillIndex',
  components: {
    DialogShowImage,
    DialogInsuranceBillForm,
    Pagination
  },
  data() {
    console.log('getAdmin()...................................', getAdmin())
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 10,
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
      statusPVI: TYPE_STATUS_HIO_PHYSICAL_PVI
    }
  },
  created() {
    this.onGetList()
  },
  methods: {
    onGetList() {
      this.loadingTable = true
      physicalDamageInsuranceProductResource.listMaterialOutsystem(this.listQuery).then(response => {
        console.log('response................', response)
        if (response.error_code === 0) {
          this.dataTable = response.data.data
          this.total = response.data.total
          // lặp qua tất cả các phần tử trong mảng table. nếu trong danh sách của mỗi phần tử chưa confirm request thì set key is_confirm = false nếu đã confirm request thì set key is_confirm = true
          this.dataTable.forEach(item => {
            item.is_confirm_supervisor = true
            // lặp qua tất cả ảnh trong danh sách của mỗi phần tử. nếu tất cả ảnh được xác nhận thì is_confirm_supervisor = true ngược lại thì is_confirm_supervisor = false
            item?.ListHoleInspector?.forEach(image => {
              if (image.request_confirm !== 1) {
                item.is_confirm_supervisor = false
              }
            })
          })
          console.log('this.dataTable................', this.dataTable)
        }
        this.loadingTable = false
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    closeDialogBillForm() {
      this.dialogBillFormVisible = false
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
        const data = {
          id_material_covered: row.id,
          status: this.statusPVI,
          is_send_email: 2
        }
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

        const url = process.env.VUE_APP_URL_API_BOOKING_VCALL + '/api/v1/send-mail-pvi'
        physicalDamageInsuranceProductResource.sendMailConfirmSaleToPVI(row, url).then(response => {
          console.log('response.....................', response)
          if (response.error_code === 0) {
            this.$message({
              type: 'success',
              message: 'Gửi mail thành công'
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Gửi mail thất bại'
            })
          }
          this.loadingSendMail = false
        }).catch(error => {
          console.log('error.....................', error)
          this.$message({
            type: 'error',
            message: 'Gửi mail thất bại'
          })
          this.loadingSendMail = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Send mail canceled'
        })
      })
    },
    sendConfirmPVI() {
      this.$confirm('Đã xác nhận được tiền. Bạn muốn tiếp tục gửi xác nhận bán đơn bảo hiểm sang PVI?', 'Cảnh báo', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // call api xác nhận sang PVI

        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    confirmSale(row) {
      this.$confirm('Bạn muốn xác nhận bán đơn bảo hiểm này?', 'Cảnh báo', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        console.log('confirmSale................', row)
        const data = {
          id_outsystem: row.id,
          is_done: 1,
          cms_id: getAdmin().id
        }
        physicalDamageInsuranceProductResource.confirmSaleHIOOutSystem(data).then(response => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Xác nhận bán canceled'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
