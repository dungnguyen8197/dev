<template>
  <div>
    <el-row id="table-vue" ref="elementPDF" class="container">
      <el-row :gutter="20" style="display: flex">
        <el-col :sm="16">
          <img class="logo-pvi" src="@/assets/img/LogowHIO.png" alt="">
        </el-col>
        <el-col :sm="8">
          <img class="logo" src="@/assets/img/logo-pvi-new.png" alt="">
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :sm="24" class="text-center">
          <h1 class="text-h1">GIẤY CHỨNG NHẬN</h1>
          <h1 class="text-h1">BẢO HIỂM BỒI THƯỜNG GIẢI THƯỞNG (GOLF)</h1>
        </el-col>
      </el-row>
      <div class="form-bill">
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Người mua:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">CÔNG TY CỔ PHẦN DỊCH VỤ ĐẶT SÂN GOLF WGHN</b>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Địa chỉ:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">20 Đường Võ Chí Công, Phường Nghĩa Đô, Quận Cầu Giấy, Hà Nội, Việt Nam</b>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Số điện thoại:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">0855 846 568</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Giải thi đấu:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">{{ certificateInsurance.name_tour }}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Mã bảo hiểm:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">BH{{ certificateInsurance.id }}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Địa điểm:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">{{ certificateInsurance.facility.title }}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Phạm vi bảo hiểm:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">Bồi thường cho Người được bảo hiểm trách nhiệm
            phải trả cho giải
            thưởng {{ certificateInsurance.price.name }} trị giá {{ formatNumber(certificateInsurance.price.price) }}VNĐ
            cho người thi đấu thắng giải {{ certificateInsurance.name_tour }}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Thời gian thi đấu:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">
            Từ ngày {{ convertDate(certificateInsurance.date_played) }} đến ngày {{ convertDate(certificateInsurance.date_played) }}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Số lượng người::</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail"> {{ certificateInsurance.money.title }}
            / ngày thi đấu</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Lỗ golf hố:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">Hố golf số {{ certificateInsurance.hole_select }}</b>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Khoảng cách lỗ golf:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">Nam: Tối thiểu 150 Yards, Nữ: Tối thiểu 135
            Yards</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Thời hạn bảo hiểm:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">Từ {{ convertDateTime(certificateInsurance.date_played) }}
            đến
            23:59 {{ convertDate(certificateInsurance.date_played) }}</b></el-col>
        </el-row>
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Giá trị giải thưởng:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">Trị giá
            {{ formatNumber(certificateInsurance.price.price) }}đ/PAX</b></el-col>
        </el-row>
        <!--                <el-row :gutter="20" class="form-group">-->
        <!--                    <el-col class="text-name" :span="9" :offset="0">Số tiền bảo hiểm:</el-col>-->
        <!--                    <el-col :span="15" :offset="0"><b class="text-detail">{{ `${formatNumber(certificateInsurance.total_pay)} VNĐ` }}</b></el-col>-->
        <!--                </el-row>-->
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Tỷ lệ phí:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">{{ certificateInsurance.money.fee }} % (chưa bao gồm
            thuế GTGT)</b></el-col>
        </el-row>
        <!--                <el-row :gutter="20" class="form-group">-->
        <!--                    <el-col class="text-name" :span="9" :offset="0">Phí bảo hiểm:</el-col>-->
        <!--                    <el-col :span="15" :offset="0"><b class="text-detail">{{ `${formatNumber(certificateInsurance.money.fee)} VNĐ` }}</b></el-col>-->
        <!--                </el-row>-->
        <!--                <el-row :gutter="20" class="form-group">-->
        <!--                    <el-col class="text-name" :span="9" :offset="0">Thuế GTGT:</el-col>-->
        <!--                    <el-col :span="15" :offset="0"><b class="text-detail">612.500 VND</b></el-col>-->
        <!--                </el-row>-->
        <el-row :gutter="20" class="form-group">
          <el-col class="text-name" :span="9" :offset="0">Tổng phí bảo hiểm:</el-col>
          <el-col :span="15" :offset="0"><b class="text-detail">{{
            `${formatNumber(certificateInsurance.total_pay)} VNĐ`
          }}</b></el-col>
        </el-row>
      </div>
      <div style="padding-top: 20px">
        <el-row class="table-history">
          <el-col>
            <el-table
              :data="tableData"
              border
              class="table-golfer"
            >
              <el-table-column
                type="index"
                :index="handleIndexMethod"
                label="STT"
                class="text-table"
                width="50"
              />
              <el-table-column
                class="text-table"
                label="Họ Tên/vID"
              >
                <template slot-scope="scope">
                  <p v-if="scope.row.user_id !== -1">
                    {{ scope.row.fullname }} - vID{{ scope.row.user_id }}
                  </p>
                  <p v-else>
                    {{ scope.row.name_user }} - vID{{ scope.row.user_id }}
                  </p>

                </template>
              </el-table-column>
              <el-table-column
                prop="passport"
                class="text-table"
                label="Ngày sinh/Passport"
              />
            </el-table>
          </el-col>
        </el-row>
      </div>

      <el-row style="margin-top: 20px">
        <el-col class="text-note"><b class="text-rule">. Điều khoản bảo hiểm:</b> Theo Quy tắc bảo hiểm bồi
          thường giải thưởng gôn
          "Hole
          in one" ban hành kèm theo Quyết định số 1269 /QĐ PVIBH ngày 31 tháng 12 năm 2013 của Tổng giám đốc
          Tổng công ty Bảo hiểm PVI
        </el-col>
        <el-col class="text-note"><b class="text-rule">. Quyền tài phán:</b> Việt Nam
        </el-col>
        <el-col class="text-note"><b class="text-rule">. Giới hạn lãnh thổ:</b> Việt Nam
        </el-col>
        <el-col class="text-note"><b class="text-rule">. Điều khoản thanh toán:</b> Thanh toán một (01) lần phí
          bảo hiểm bằng tiền
          mặt hoặc chuyển khoản trước ngày {{ convertDate(certificateInsurance.date_played) }}.
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <el-link @click="exportToPDF()">Download to PDF</el-link>
      </div>
    </el-row>
  </div>
</template>
<script>
import { formatNumber, convertDateTime, convertDate } from '@/utils/convert'
// import { convertPriceInsurance100, convertPriceInsurance200 } from '@/utils/insurance/optionPriceInsuranceNew'
import html2pdf from 'html2pdf.js'
import AgentHIOResource from '@/api/HIO/agentHIO'
import moment from 'moment'

const agentHIOResource = new AgentHIOResource()

export default {
  name: 'CertificateInsuranceItem',
  data() {
    return {
      certificateInsurance: {},
      loading: false,
      tableData: [],
      from: 1,
      dateEnd: '',
      date: ''
    }
  },
  watch: {},
  mounted() {
    this.getCertificateInsurance()
  },
  methods: {
    getCertificateInsurance() {
      const currentUrl = window.location.href
      console.log(currentUrl)
      const params = { id: currentUrl.substring(currentUrl.lastIndexOf('/') + 1) }
      agentHIOResource.certificateItem(params).then(response => {
        console.log('ssssssssss', response)
        if (response.data.error_code === 0) {
          this.loading = false
          console.log('data', response)
          this.certificateInsurance = response.data.data
          this.tableData = response.data.data.member_insurance
          this.date = moment(response.data.data.date_played).add(2, 'days').calendar()
          this.dateEnd = moment(this.date).format('DD/MM/yyyy')
          console.log(this.dateEnd)
        } else {
          this.$message.warning(response.message)
        }
      })
    },
    handleIndexMethod(index) {
      return this.from + index
    },
    exportToPDF() {
      var element = document.getElementById('table-vue')
      var opt = {
        margin: 1,
        filename: 'certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(element).save()
      html2pdf(element, opt)
    },
    exportToPDFNEW() {
      var element = document.getElementById('table-vue-translation')
      var optop = {
        margin: 1,
        filename: 'certificate-insurance.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' }
      }
      html2pdf().set(optop).from(element).save()
      html2pdf(element, optop)
    },
    formatNumber,
    // convertPriceInsurance100,
    convertDateTime,
    // convertPriceInsurance200,
    convertDate
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 1140px;
  margin: 0px auto;

  .title {
    line-height: 80px;
  }

  .title-new {
    line-height: 40px;
  }

  .form-group {
    margin-top: 10px;
  }
}

.text-detail {
  font-family: SF Pro Display;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: -0.0241em;
  text-align: right;
  color: #090710;
}

.text-name {
  font-family: SF Pro Display;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  color: #898B8F;
}

.text-rule {

}

.logo-pvi {
  width: 40%;
  margin-top: 15px;
}

.logo {
  width: 70%;
}

.form-bill {
  //background-color: #00e600;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.table-golfer {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.text-note {
  margin-bottom: 8px;
  margin-top: 8px;
  font-family: SF Pro Display;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  color: #5B5B5B;
}

#table-vue {
  font-family: Avenir, Helvetica, Arial, sans-serif, "Times New Roman";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  height: 11in;
  width: 9.5in;
}

#table-vue-translation {
  font-family: Avenir, Helvetica, Arial, sans-serif, "Times New Roman";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  height: 11in;
  width: 8.5in;
}

@media (max-width: 500px) {
  .text-h1 {
    font-size: 16px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 0;
    text-align: center;

  }
  .container {
    //width: 1140px;
    margin: 0px auto;

    .title {
      line-height: 80px;
    }

    .title-new {
      line-height: 40px;
    }

    .form-group {
      margin-top: 10px;
    }
  }
  .logo-pvi {
    width: 55%;
    margin-top: 5px;
  }

  .logo {
    width: 55%;
    float: right;
  }

  .form-bill {
    //background-color: #00e600;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);;
  }

  .text-note {
    margin-bottom: 8px;
    margin-top: 8px;
  }

  #table-vue {
    font-family: Avenir, Helvetica, Arial, sans-serif, "Times New Roman";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 10px;
    height: 100%;
    width: 3.8in;
  }

  #table-vue-translation {
    font-family: Avenir, Helvetica, Arial, sans-serif, "Times New Roman";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
    height: 11in;
    width: 8.5in;
  }
}
</style>
