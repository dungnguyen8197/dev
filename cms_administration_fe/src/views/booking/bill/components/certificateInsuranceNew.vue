<template>
  <div>
    <el-row
      v-if="certificateInsurance.money.id === 16 ||certificateInsurance.money.id ===17 "
      id="table-vue-translation"
      ref="elementPDF"
      class="container"
    >
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :sm="16">
          <img class="logo" src="@/assets/img/W_Booking.png" width="40%">
        </el-col>
        <el-col :sm="8">
          <img class="logo" src="@/assets/img/logo-pvi-new.png" width="70%">
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :sm="24" class="text-center">
          <h1 class="title-new text-uppercase">HIO Insurance Certificate</h1>
          <h1 class="title-new text-uppercase">HIO보험증서</h1>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">

        <el-col :span="6" :offset="0">Address:</el-col>
        <el-col :span="18" :offset="0"><b>No. 20 Vo Chi Cong, Nghia Do ward, Cau Giay district, Hanoi city</b>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">

        <el-col :span="6" :offset="0">주소:</el-col>
        <el-col :span="18" :offset="0"><b>하노이 시 Cau Giay 구 Nghia Do 동 20 Vo Chi Cong</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Telephone:</el-col>
        <el-col :span="18" :offset="0"><b>03325.11111</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">전화 번호:</el-col>
        <el-col :span="18" :offset="0"><b>03325.11111</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Insurance ID:</el-col>
        <el-col :span="18" :offset="0"><b>BH{{ certificateInsurance.id }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">보험 코드:</el-col>
        <el-col :span="18" :offset="0"><b>BH{{ certificateInsurance.id }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Tournament Name:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.name_tour }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">토너먼트명:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.name_tour }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Venue:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.course_name }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">장소:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.course_name }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Competion time:</el-col>
        <el-col :span="18" :offset="0"><b>{{ convertDateTime(certificateInsurance.date_played) }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">토너먼트 시간:</el-col>
        <el-col :span="18" :offset="0"><b>{{ convertDateTime(certificateInsurance.date_played) }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Reward value:</el-col>
        <el-col v-if="certificateInsurance.money" :span="18" :offset="0"><b>{{
          `VND ${formatNumber(certificateInsurance.money.reward_value)}`
        }}<span
          v-if="certificateInsurance.money.reward_value === 92000000"
          class="package-name"
        >(F20)</span><span
          v-else-if="certificateInsurance.money.reward_value === 46000000"
          class="package-name"
        >(F10)</span></b>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">수상 금액:</el-col>
        <el-col v-if="certificateInsurance.money" :span="18" :offset="0"><b>{{
          `${formatNumber(certificateInsurance.money.reward_value)} VND`
        }}<span
          v-if="certificateInsurance.money.reward_value === 92000000"
          class="package-name"
        >(F20)</span><span
          v-else-if="certificateInsurance.money.reward_value === 46000000"
          class="package-name"
        >(F10)</span></b>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Total number of participants:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.member_insurance.length }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">총 참가자 수:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.member_insurance.length }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Total payment :</el-col>
        <el-col :span="18" :offset="0"><b>{{ `VND ${formatNumber(certificateInsurance.total_pay)}` }}</b>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">총 지불액 :</el-col>
        <el-col :span="18" :offset="0"><b>{{ `${formatNumber(certificateInsurance.total_pay)} VND` }}</b>
        </el-col>
      </el-row>
      <el-row class="table-history">
        <div>
          <h4 class="text-center">LIST OF PARTICIPANTS IN THE TOURNAMENT</h4>
          <h4 class="text-center">토너먼트 참가자 목록</h4>
        </div>
        <el-col>
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              :index="handleIndexMethod"
              label="No."
              width="50"
            />
            <el-table-column
              label="Full name/ 성명"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.golfer">{{ scope.row.golfer.fullname }}</p>
                <p v-else>{{ scope.row.name_user }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="vID Code/ 코드"
            >
              <template slot-scope="scope">
                <p>vID{{ scope.row.user_id }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Package/패키지"
            >
              <template>
                <template v-if="certificateInsurance.money.reward_value === 100000000 ">
                  <p>D100</p>
                </template>
                <template v-else-if="certificateInsurance.money.reward_value === 200000000">
                  <p>D200</p>
                </template>
                <template v-else-if="certificateInsurance.money.reward_value === 50000000 ">
                  <p>D50</p>
                </template>
                <template v-else-if="certificateInsurance.money.reward_value === 20000000 ">
                  <p>D20</p>
                </template>
                <template v-else-if="certificateInsurance.money.reward_value === 46000000 ">
                  <p>F10</p>
                </template>
                <template v-else-if="certificateInsurance.money.reward_value === 92000000">
                  <p>F20</p>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="Price /가격"
            >
              <template>
                <p>{{ `${formatNumber(certificateInsurance.money.price)} VNĐ` }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Passport/Birthday 여권/생년월일"
            >
              <template slot-scope="scope">
                <p>{{ scope.row.passport }}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <span style="background: yellow">Note:</span><br>
        <el-col class="text-note">- WBooking pays a maximum of VND 500 million for a standard 18-hole golf course.
        </el-col>
        <el-col class="text-note">- Customers who won HIO, please contact the Hotline within 12 hours for
          instructions on how to receive the prize.
        </el-col>
        <el-col class="text-note">- Non-PGA Participant, Golf Course Employee Where Tournament Participant.
        </el-col>
        <el-col class="text-note">- There are at least 3 players at the time of teeing off.</el-col>
        <el-col class="text-note">- Customers commit when using the HIO service that they have read and
          understood all of the HIO terms of service which are publicly listed on the WGHN app.
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <el-link @click="exportToPDFNEW()">Download to PDF new</el-link>
      </div>

    </el-row>
    <el-row v-else id="table-vue" ref="elementPDF" class="container">
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :sm="16">
          <img class="logo" src="@/assets/img/W_Booking.png" width="50%" style="margin-top: 25px">
        </el-col>
        <el-col :sm="8">
          <img class="logo" src="@/assets/img/logo-pvi-new.png" width="70%">
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :sm="24" class="text-center">
          <h1 class="title text-uppercase">Giấy chứng nhận bảo hiểm HIO</h1>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">

        <el-col :span="6" :offset="0">Địa chỉ:</el-col>
        <el-col :span="18" :offset="0"><b>Số 20 Võ Chí Công, phường Nghĩa Đô, Quận Cầu giấy, TP. Hà Nội</b>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Số điện thoại:</el-col>
        <el-col :span="18" :offset="0"><b>03325.11111</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Mã bảo hiểm:</el-col>
        <el-col :span="18" :offset="0"><b>BH{{ certificateInsurance.id }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Tên giải đấu:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.name_tour }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Địa điểm thi đấu:</el-col>
        <el-col v-if="certificateInsurance.is_campaign === 0" :span="18" :offset="0">
          <b>{{ certificateInsurance.facility.title }}</b></el-col>
        <el-col v-if="certificateInsurance.is_campaign === 1" :span="18" :offset="0">
          <!--                    <b>{{ certificateInsurance.course_name }}</b></el-col>-->
          <b>{{ certificateInsurance.facility.title }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Thời gian thi đấu:</el-col>
        <el-col :span="18" :offset="0"><b>{{ convertDateTime(certificateInsurance.date_played) }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Giá trị giải thưởng:</el-col>
        <el-col
          v-if="certificateInsurance.facility.id === 8 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 9 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 11 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 12 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 14 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 21 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 22 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 27 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 29 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 10360 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 13452 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 28423 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 28456 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 28467 && certificateInsurance.money.reward_value === 100000000"
          :span="18"
        >
          <b>{{ convertPriceInsurance100(certificateInsurance.facility.id).price }} VND (
            {{ convertPriceInsurance100(certificateInsurance.facility.id).text }} )</b>
        </el-col>
        <el-col
          v-else-if="certificateInsurance.facility.id === 28426 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 25 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 28481 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 11366 && certificateInsurance.money.reward_value === 100000000
            || certificateInsurance.facility.id === 28561 && certificateInsurance.money.reward_value === 100000000"
          :span="18"
        >
          <b>85.000.000 VND ( Tám lăm triệu đồng )</b>
        </el-col>
        <el-col
          v-else-if="certificateInsurance.facility.id === 28426 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 25 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 28481 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 11366 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 28561 && certificateInsurance.money.reward_value === 200000000"
          :span="18"
        >
          <b>170.000.000 VND ( Một trăm bảy mươi triệu đồng )</b>
        </el-col>
        <el-col
          v-else-if="certificateInsurance.facility.id === 8 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 9 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 11 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 12 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 14 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 21 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 22 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 27 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 29 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 10360 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 13452 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 28423 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 28456 && certificateInsurance.money.reward_value === 200000000
            || certificateInsurance.facility.id === 28467 && certificateInsurance.money.reward_value === 200000000"
          :span="18"
        >
          <b>{{ convertPriceInsurance200(certificateInsurance.facility.id).price }} VND (
            {{ convertPriceInsurance200(certificateInsurance.facility.id).text }} )</b>
        </el-col>
        <el-col
          v-else-if="certificateInsurance.facility.id === 8 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 9 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 11 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 12 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 14 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 21 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 22 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 27 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 29 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 10360 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 28423 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 13452 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 28456 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 28467 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 11366 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 28481 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 25 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 28426 && certificateInsurance.money.reward_value === 300000000
            || certificateInsurance.facility.id === 28561 && certificateInsurance.money.reward_value === 300000000"
          :span="18"
        >
          <b>{{ convertPriceInsurance300(certificateInsurance.facility.id).price }} VND (
            {{ convertPriceInsurance300(certificateInsurance.facility.id).text }} )</b>
        </el-col>
        <el-col
          v-else-if="certificateInsurance.facility.id === 8 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 9 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 11 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 12 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 14 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 21 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 22 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 27 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 29 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 10360 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 28423 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 13452 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 28456 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 28467 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 11366 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 28481 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 25 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 28426 && certificateInsurance.money.reward_value === 400000000
            || certificateInsurance.facility.id === 28561 && certificateInsurance.money.reward_value === 400000000"
          :span="18"
        >
          <b>{{ convertPriceInsurance400(certificateInsurance.facility.id).price }} VND (
            {{ convertPriceInsurance400(certificateInsurance.facility.id).text }} )</b>
        </el-col>
        <el-col
          v-else-if="certificateInsurance.facility.id === 8 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 9 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 11 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 12 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 14 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 21 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 22 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 27 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 29 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 10360 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 28423 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 13452 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 28456 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 28467 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 11366 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 28481 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 25 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 28426 && certificateInsurance.money.reward_value === 500000000
            || certificateInsurance.facility.id === 28561 && certificateInsurance.money.reward_value === 500000000"
          :span="18"
        >
          <b>{{ convertPriceInsurance500(certificateInsurance.facility.id).price }} VND (
            {{ convertPriceInsurance500(certificateInsurance.facility.id).text }} )</b>
        </el-col>
        <el-col v-else :span="18" :offset="0"><b>{{
          `${formatNumber(certificateInsurance.money.reward_value)} VNĐ ( ${certificateInsurance.money.text_display} )`
        }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Lỗ golf số:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.hole_select }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Tổng số người tham gia:</el-col>
        <el-col :span="18" :offset="0"><b>{{ certificateInsurance.member_insurance.length }}</b></el-col>
      </el-row>
      <el-row :gutter="20" class="form-group">
        <el-col :span="6" :offset="0">Tổng số tiền thanh toán :</el-col>
        <el-col :span="18" :offset="0"><b>{{ `${formatNumber(certificateInsurance.total_pay)} VNĐ` }}</b>
        </el-col>
      </el-row>
      <el-row class="table-history">
        <div>
          <h4 class="text-center">DANH SÁCH NGƯỜI CHƠI THAM GIA GIẢI ĐẤU</h4>
        </div>
        <el-col>
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              :index="handleIndexMethod"
              label="STT"
              width="50"
            />
            <el-table-column
              label="Họ Tên"
              width="180"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.golfer">{{ scope.row.golfer.fullname }}</p>
                <p v-else>{{ scope.row.name_user }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Mã vID"
              width="180"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.golfer">vID{{ (scope.row.golfer.id_display) }}</p>
                <p v-if="scope.row.golfer" style="">Mã mặc định: vID{{ scope.row.golfer.id }}</p>
                <p v-else>Mã mặc định: vID{{ scope.row.user_id }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Gói Mua"
            >
              <template>
                <p>{{ certificateInsurance.money.name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Giá"
            >
              <template>
                <p>{{ `${formatNumber(certificateInsurance.money.price)} VNĐ` }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Passport/Birthday"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.certificate">{{ scope.row.certificate.birthday }}</p>
                <p v-else-if="scope.row.certificate === null && scope.row.golfer">
                  {{ scope.row.golfer.birthday }}</p>
                <p v-else>{{ scope.row.passport }}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <span style="background: yellow">Lưu ý:</span><br>
        <el-col class="text-note">- WBooking chi trả tối đa 500 triệu đồng cho 01 vòng chơi golf tiêu chuẩn 18 hố.
        </el-col>
        <el-col class="text-note">- Khách hàng trúng HIO vui lòng liên hệ qua Hotline trong vòng 12h để được
          hướng dẫn làm thủ tục nhận thưởng.
        </el-col>
        <el-col class="text-note">- Người tham gia không phải PGA, nhân viên sân Golf nơi người tham gia giải
          đấu.
        </el-col>
        <el-col class="text-note">- Có tối thiều 03 người chơi tại thời điểm phát bóng.</el-col>
        <el-col class="text-note">- Khách hàng cam kết khi sử dụng dịch vụ HIO đã đọc và hiểu toàn bộ điều khoản
          dịch vụ HIO được niêm yết công khai trên app WGHN.
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <el-link @click="exportToPDF()">Download to PDF</el-link>
      </div>
    </el-row>
  </div>
</template>
<script>
import { formatNumber, convertDateTime } from '@/utils/convert'
import html2pdf from 'html2pdf.js'
import {
  convertPriceInsurance300,
  convertPriceInsurance400,
  convertPriceInsurance500,
  convertPriceInsurance100,
  convertPriceInsurance200
} from '@/utils/insurance/optionPriceInsuranceNew'
import BookingPaxResource from '@/api/BookingPax'
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'CertificateInsurance',
  data() {
    return {
      certificateInsurance: {},
      loading: false,
      tableData: [],
      from: 1
    }
  },
  watch: {},
  mounted() {
    this.getCertificateInsurance()
  },
  methods: {
    getCertificateInsurance() {
      const currentUrl = window.location.href
      const params = { id: currentUrl.substring(currentUrl.lastIndexOf('/') + 1) }
      bookingPaxResource.viewCertificateInsurance(params).then(response => {
        if (response.data.error_code === 0) {
          this.loading = false
          console.log('data', response)
          this.certificateInsurance = response.data.data
          this.tableData = response.data.data.member_insurance
        } else {
          this.$message.warning(response.data.message)
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
    convertPriceInsurance100,
    convertDateTime,
    convertPriceInsurance200,
    convertPriceInsurance300,
    convertPriceInsurance400,
    convertPriceInsurance500

  }
}
</script>

<style scoped lang="scss">
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

.package-name {
  padding-left: 10px;
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
  margin-top: 60px;
  height: 11in;
  width: 8.5in;
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
</style>
