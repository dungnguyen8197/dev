<template>
  <el-row class="data-table-content table-responsive">
    <table v-loading="loading" class="table table-bordered">
      <thead>
        <tr>
          <th scope="col" class="text-center">Mã cuộc gọi</th>
          <th scope="col" class="text-center">Mã Booking</th>
          <th scope="col" class="text-center">Golfer</th>
          <th v-if="phoneAdmin == '0372397025' || phoneAdmin == '0352810651' || phoneAdmin == '0913399433'" scope="col" class="text-center">Số điện thoại</th>
          <th scope="col" class="text-center" width="150">Sân</th>
          <th scope="col" class="text-center">Giờ teetime</th>
          <th scope="col" class="text-center">HIO</th>
          <th scope="col" class="text-center">Thời gian liên lạc</th>
          <th scope="col" class="text-center">Ngày mong muốn chơi</th>
          <th scope="col" class="text-center">Thời gian mong muốn chơi</th>
          <th scope="col" class="text-center">Số người muốn chơi</th>
          <th scope="col" class="text-center">Trạng thái Thanh toán</th>
          <th scope="col" class="text-center">Người xử lý</th>
          <th scope="col" class="text-center">Người giới thiệu</th>
          <th scope="col" class="text-center">Trạng thái booking</th>
          <th scope="col" class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody v-if="tableData.length > 0">
        <template v-for="(value, index) in tableData">
          <template>
            <tr :key="index" :class="[value.date_played_request ? 'order-request' : '', value.booked && value.booked.source == 4 ? 'change-bg' : '']">
              <template v-if="value.booked && value.booked.pax.surcharge_facility">
                <th
                  class="text-center position-relative"
                  :rowspan="value.children.length + 2"
                  colspan="1"
                  scope="col"
                >
                  <el-col>{{ value.code }}</el-col>
                  <div class="clearfix-10" />
                  <el-link
                    v-if="value.pax_booked && value.pax_booked.type_purchase === 0 && value.admin_id === value.adminLoggin && checkUpdate(value)"
                    type="primary"
                    class="el-icon-plus cursor"
                    @click="showDialogAddSurcharge(value)"
                  >
                    Thêm phụ phí
                  </el-link>
                </th>
              </template>
              <template v-else>
                <th
                  class="text-center position-relative"
                  :rowspan="value.children.length + 1"
                  colspan="1"
                  scope="col"
                >
                  <el-col>{{ value.code }}</el-col>
                  <div class="clearfix-10" />
                  <el-link
                    v-if="value.pax_booked && value.pax_booked.type_purchase === 0 && value.admin_id === value.adminLoggin && checkUpdate(value)"
                    type="primary"
                    class="el-icon-plus cursor"
                    @click="showDialogAddSurcharge(value)"
                  >
                    Thêm phụ phí
                  </el-link>
                </th>
              </template>
              <td class="text-center">
                <template v-if="value.pax_booked">
                  {{ value.pax_booked.code_booking }}
                </template>
              </td>
              <td class="text-center">
                <el-col>
                  <template v-if="value.golfer">
                    <template v-if=" value.golfer.id_display == null">
                      {{ `VID${value.golfer.id}-${value.golfer.fullname}` }}
                    </template>
                    <template v-else-if="value.golfer && value.golfer.id_display != null">
                      {{ `VID${value.golfer.id_display}-${value.golfer.fullname}` }}
                    </template>
                  </template>
                  <template v-else-if="value.pax_booked">
                    (OUT) {{ value.pax_booked.name_out_system }}
                  </template>
                  <template v-else>
                    (OUT) {{ value.name_out_system }}
                  </template>
                  <template
                    v-if="(!checkShowButton(value) && value.booked != null && value.booked.passport != null && value.booked.is_send_mail_sacombank === 0)"
                  >
                    <div class="clearfix-10" />
                    <el-link
                      type="primary"
                      class="el-icon-plus cursor"
                      @click="onShowDialogSendEmailSacomBank(value)"
                    >
                      Gửi mail Sacombank
                    </el-link>
                  </template>
                </el-col>
                <el-col v-show="value.pax_booked_id" class="cursor">
                  <template
                    v-if="value.pax_booked && value.pax_booked.promotion_code_id && value.type === 0"
                  >
                    <el-row class="promotion-ticket">
                      <el-tag
                        type="success"
                        closable
                        :disable-transitions="false"
                        @close="handleRemoveTicket(value.pax_booked)"
                      >
                        {{ value.pax_booked.promotional.code }}
                      </el-tag>
                    </el-row>
                  </template>
                  <template v-else-if="value.user_id !== -1 && value.type === 0 && checkUpdate(value)">
                    <el-popover
                      placement="bottom"
                      title="Thêm mã giảm giá"
                      width="400"
                      trigger="click"
                    >
                      <popover-add-promotion
                        @onReloadPage="handleAddPromotion"
                      />
                      <el-link
                        slot="reference"
                        type="primary"
                        title="Thêm mã giảm giá"
                        class="el-icon-plus"
                        @click="handleSetDataToPopover(value)"
                      > Add mã giảm giá
                      </el-link>
                    </el-popover>
                  </template>
                </el-col>
              </td>
              <td v-if="phoneAdmin == '0372397025' || phoneAdmin == '0352810651' || phoneAdmin == '0913399433'" class="text-center">
                <template v-if="value.golfer">
                  {{ value.golfer.phone }}
                </template>
              </td>
              <td class="text-center">
                {{ value.facility.sub_title }} <br>
                <template v-if="value.pax_booked">
                  {{ value.pax_booked.pax.path_name }}
                </template>
              </td>
              <td class="text-center">
                <!--                            <template v-if="value.status !== 4 || value.status !== 5">-->
                <!-- <action-add-tee-time-component
                  :data-object="value"
                  :check-update="checkUpdate(value)"
                  @handleClickActionAddTeeTime="handleActionAddTeeTime"
                /> -->
                <!--                                                        </template>-->
                <!--                            <template v-else>-->
                <!--                                <el-tag :type="renderClassStatus(value.status)">{{-->
                <!--                                        convertStatusString(value.status)-->
                <!--                                    }}-->
                <!--                                </el-tag>-->
                <!--                            </template>-->
              </td>
              <td class="text-center hio">
                <template
                  v-if="value.pax_booked && value.pax_booked.pax && value.pax_booked.pax.insurance20 && value.pax_booked.user_id > 0"
                >
                  <el-tag type="primary">{{ `D20 - BH${value.pax_booked.pax.insurance20.id}` }}</el-tag>
                </template>
                <br>
                <template
                  v-if="value.pax_booked && value.pax_booked.pax && value.pax_booked.pax.insurance && value.pax_booked.user_id > 0"
                >
                  <el-tag type="primary">
                    {{ (value.pax_booked.pax.insurance.options_money_id === 1) ? 'D100' : 'D200' }}
                    {{ `- BH${value.pax_booked.pax.insurance.id}` }}
                  </el-tag>
                </template>
              </td>
              <td class="text-center created_at">{{ convertDateTime(value.created_at) }}</td>

              <td class="text-center created_at">
                <template v-if="value.date_played_request">{{
                  convertDateTime(value.date_played_request)
                }}
                </template>
              </td>
              <td class="text-center created_at">{{ renderTimeFrameSelect(value.time_frame_select) }}</td>
              <td class="text-center created_at">
                <template v-if="value.total_user != 0">{{ (value.total_user) }}</template>
              </td>

              <td class="text-center position-relative">
                <template v-if="value.pax_booked">
                  <el-tag :type="renderClassType(value.pax_booked.type_purchase)">
                    {{ convertTypeString(value.pax_booked.type_purchase) }}
                  </el-tag>
                  <el-col>Giá: {{ convertNumberToPrice(value.pax_booked.price_booking) }} VNĐ</el-col>
                  <el-col v-if="value.pax_booked.pax.surcharge_price">Phụ phí:
                    {{ convertNumberToPrice(value.pax_booked.pax.surcharge_price) }} VNĐ
                  </el-col>
                  <!--                                <span class="btn-change-type-purchase cursor">-->
                  <!--                                        <i @click="onShowDialogEditTypePurchase(value)" class="el-icon-edit"></i>-->
                  <!--                                    </span>-->
                </template>
                <template v-else>
                  <el-tag :type="renderClassStatus(0)">Chưa chọn Tee Time</el-tag>
                </template>
              </td>
              <td>
                <!-- <button-add-admin :object-model="value" @onReloadPage="handleReloadData" /> -->
              </td>
              <td>
                <el-tag v-if="value.booked && value.booked.pax && value.booked.pax.admin">{{ value.booked.pax.admin.name }}</el-tag>
              </td>
              <td class="text-center">
                <template
                  v-if="value.pax_booked != null && (value.pax_booked.pax.status === 5 || (value.pax_booked.is_verify_booking != null && value.pax_booked.is_verify_booking == 0))"
                >
                  <el-tag :type="renderClassStatus(0)">Chờ xác nhận
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag :type="renderClassStatus(value.status)">{{
                    convertStatusString(value.status)
                  }}
                  </el-tag>
                </template>
              </td>
              <td
                class="text-center position-relative"
                :rowspan="value.booked && value.booked.pax.surcharge_facility ? value.children.length + 2 : value.children.length + 1"
                colspan="1"
                scope="col"
              >
                <template v-if="checkAdminBooked(value)">
                  <template
                    v-if="value.pax_booked != null && (value.pax_booked.pax.status === 5 || (value.pax_booked.is_verify_booking != null && value.pax_booked.is_verify_booking == 0))"
                    class="mb-10"
                  >
                    <el-button
                      class="mb-10"
                      type="primary"
                      round
                      @click="onShowDialogConfirm(value)"
                    >Xác nhận bán
                      booking
                    </el-button>
                  </template>
                  <template v-else class="mb-10">
                    <el-button
                      class="mb-10"
                      type="primary"
                      :loading="loadingButtonSendNotiConfirm"
                      @click="sendNotiConfiemBooking(value)"
                    >
                      Gửi thông báo xác nhận bán
                    </el-button>
                  </template>
                  <template
                    v-if="(!checkShowButton(value) && value.pax_booked != null && (value.pax_booked.pax.is_send_mail_facility == 0 || value.pax_booked.pax.is_send_mail_facility == null)) "
                    class="mb-10"
                  >
                    <el-button class="mb-10" type="primary" @click="onShowDialogSendEmail(value)">
                      Gửi mail sân
                    </el-button>
                  </template>
                  <template
                    v-if="(!checkShowButton(value) && value.pax_booked != null) || admin.phone == '0352810651'"
                    class="mb-10"
                  >
                    <el-button
                      class="mb-10"
                      type="primary"
                      @click="onShowDialogCreateCodePayment(value)"
                    >
                      Tạo đơn thanh toán
                    </el-button>
                  </template>
                  <!--                                    <template class="mb-10"-->
                  <!--                                              v-else-if="value.pax_booked != null && (value.pax_booked.pax.is_send_mail_facility == 0 || value.pax_booked.pax.is_send_mail_facility == null) ">-->
                  <!--                                        -->

                  <!--                                        <el-button class="mb-10" type="primary" @click="sendNotiConfiemBooking(value)" :loading="loadingButtonSendNotiConfirm">-->
                  <!--                                            Gửi thông báo xác nhận bán-->
                  <!--                                        </el-button>-->

                  <!--                                    <el-button class="mb-10" :disabled="(value.pax_booked && value.pax_booked.type_purchase !== 0) || value.booked == null" type="primary" round-->
                  <!--                                               @click="onShowDialogConfirmResendMessage(value)">-->
                  <!--                                        Gửi tin nhắn thanh toán-->
                  <!--                                    </el-button>-->
                  <!--                                    </template>-->
                </template>
              </td>
            </tr>
            <!--child-->
            <tr v-for="(child, i) in value.children" :key="i+1000" :class="[value.date_played_request ? 'order-request' : '', value.booked && value.booked.source == 4 ? 'change-bg' : '']">
              <td class="text-center">
                <template v-if="child.pax_booked">
                  {{ child.pax_booked.code_booking }}
                </template>
              </td>
              <td class="text-center">
                <el-col>
                  <template v-if="child.golfer && child.golfer.id_display == null">
                    {{ `VID${child.golfer.id}-${child.golfer.fullname}` }}
                  </template>
                  <template v-else-if="child.golfer && child.golfer.id_display != null">
                    {{ `VID${child.golfer.id_display}-${child.golfer.fullname}` }}
                  </template>
                  <template v-else-if="child.pax_booked">
                    (OUT) {{ child.pax_booked.name_out_system }}
                  </template>
                  <template v-else>
                    (OUT) {{ child.name_out_system }}
                  </template>
                  <template
                    v-if="(!checkShowButton(child) && child.booked != null && child.booked.passport != null && child.booked.is_send_mail_sacombank === 0)"
                  >
                    <div class="clearfix-10" />
                    <el-link
                      type="primary"
                      class="el-icon-plus cursor"
                      @click="onShowDialogSendEmailSacomBank(child)"
                    >
                      Gửi mail Sacombank
                    </el-link>
                  </template>
                </el-col>
                <el-col v-show="child.pax_booked_id" class="cursor">
                  <template v-if="child.pax_booked && child.pax_booked.promotion_code_id">
                    <el-row v-show="child.type === 0" class="promotion-ticket">
                      <el-tag
                        type="success"
                        closable
                        :disable-transitions="false"
                        @close="handleRemoveTicket(child.pax_booked)"
                      >
                        {{ child.pax_booked.promotional.code }}
                      </el-tag>
                    </el-row>
                  </template>
                  <template v-else-if="child.user_id !== -1 && child.type === 0 && checkUpdate(child)">
                    <el-popover
                      placement="bottom"
                      title="Thêm mã giảm giá"
                      width="400"
                      trigger="click"
                    >
                      <popover-add-promotion
                        @onReloadPage="handleAddPromotion"
                      />
                      <el-link
                        slot="reference"
                        type="primary"
                        title="Thêm mã giảm giá"
                        class="el-icon-plus"
                        @click="handleSetDataToPopover(child)"
                      > Add mã giảm giá
                      </el-link>
                    </el-popover>
                  </template>
                </el-col>
              </td>
              <td v-if="phoneAdmin == '0372397025' || phoneAdmin == '0352810651' || phoneAdmin == '0913399433'" class="text-center">
                <template v-if="child.golfer">
                  {{ child.golfer.phone }}
                </template>
              </td>
              <td class="text-center">
                {{ child.facility.sub_title }} <br>
                <template v-if="child.pax_booked">
                  {{ child.pax_booked.pax.path_name }}
                </template>
              </td>
              <td class="text-center">
                <!--                            <template v-if="child.status !== 4 || child.status !== 5">-->
                <!-- <action-add-tee-time-component
                  :data-object="child"
                  :check-update="checkUpdate(child)"
                  @handleClickActionAddTeeTime="handleActionAddTeeTime"
                /> -->
                <!--                            </template>-->
                <!--                            <template v-else>-->
                <!--                                <el-tag :type="renderClassStatus(child.status)">{{-->
                <!--                                        convertStatusString(child.status)-->
                <!--                                    }}-->
                <!--                                </el-tag>-->
                <!--                            </template>-->
              </td>
              <td class="text-center hio">
                <template
                  v-if="child.pax_booked && child.pax_booked.pax && child.pax_booked.pax.insurance20 && child.pax_booked.user_id > 0"
                >
                  <el-tag type="primary">{{ `D20 - BH${child.pax_booked.pax.insurance20.id}` }}</el-tag>
                </template>
                <br>
                <template
                  v-if="child.pax_booked && child.pax_booked.pax && child.pax_booked.pax.insurance && child.pax_booked.user_id > 0"
                >
                  <el-tag type="primary">
                    {{ (child.pax_booked.pax.insurance.options_money_id === 1) ? 'D100' : 'D200' }}
                    {{ `- BH${child.pax_booked.pax.insurance.id}` }}
                  </el-tag>
                </template>
              </td>
              <td class="text-center">{{ convertDateTime(child.created_at) }}</td>

              <td class="text-center created_at" />
              <td class="text-center created_at" />
              <td class="text-center created_at" />

              <td class="text-center position-relative">
                <template v-if="child.pax_booked">
                  <el-tag :type="renderClassType(child.pax_booked.type_purchase)">
                    {{ convertTypeString(child.pax_booked.type_purchase) }}
                  </el-tag>
                  <el-col>Giá: {{ convertNumberToPrice(child.pax_booked.price_booking) }} VNĐ</el-col>
                  <el-col v-if="child.pax_booked.pax.surcharge_price">Phụ phí:
                    {{ convertNumberToPrice(child.pax_booked.pax.surcharge_price) }} VNĐ
                  </el-col>
                  <!--                                                                <span class="btn-change-type-purchase cursor">-->
                  <!--                                                                        <i @click="onShowDialogEditTypePurchase(child)" class="el-icon-edit"></i>-->
                  <!--                                                                    </span>-->
                </template>
                <template v-else>
                  <el-tag :type="renderClassStatus(0)">Chưa chọn Tee Time</el-tag>
                </template>
              </td>
              <td>
                <!-- <button-add-admin :object-model="child" /> -->
              </td>
              <td>
                <el-tag v-if="value.booked && value.booked.pax && value.booked.pax.admin">{{ value.booked.pax.admin.name }}</el-tag>
              </td>
              <td class="text-center">
                <template
                  v-if="child.pax_booked != null && (child.pax_booked.pax.status === 5 || (child.pax_booked.is_verify_booking != null && child.pax_booked.is_verify_booking == 0))"
                >
                  <el-tag :type="renderClassStatus(0)">Chờ xác nhận
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag :type="renderClassStatus(child.status)">{{
                    convertStatusString(child.status)
                  }}
                  </el-tag>
                </template>
              </td>
            </tr>
            <tr v-if="value.booked && value.booked.pax.surcharge_facility" :key="value.booked">
              <td class="text-center">Phụ phí tổng</td>
              <td colspan="9">
                {{ convertNumberToPrice(value.booked.pax.surcharge_facility.price_surcharge_facility) }} VNĐ
              </td>
            </tr>
          </template>
        </template>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="15" class="text-center">
            <i>Không tìm thấy dữ liệu</i> <i class="el-icon-warning" />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <dialog-add-tee-time
      :data-model="reservationModel"
      :dialog-add-tee-time="showDialogAddTeeTime"
      @clickButtonAddTeeTime="handleAddTeeTime"
    /> -->
    <!--        <dialog-change-tee-time-component :data-model="reservationModel"-->
    <!--                                          :visible-change-tee-time="showDialogChangeTeeTime"-->
    <!--                                          @clickButtonChangeTeeTime="handleChangeTeeTime"></dialog-change-tee-time-component>-->
    <!-- <dialog-change-time-played-component
      :data-model="reservationModel"
      :dialog-add-change-tee-time="showDialogChangeTimePlayed"
      @clickButtonChangePlayedTeeTime="handleChangePlayedTeeTime"
    /> -->
    <!--        <dialog-test :data-model="reservationModel" :dialog-add-change-tee-time="showDialogChangeTimePlayed"-->
    <!--                     @clickButtongChangePlayedTeeTime="handleChangePlayedTeeTime"></dialog-test>-->
    <!-- <dialog-cancel-booking
      :data-model="reservationModel"
      :show-dialog="showDialogCancel"
      @onReloadPage="handleCancelBooking"
    />
    <dialog-view-detail
      :data-model="reservationModel"
      :show-dialog="showDialogViewDetail"
      @clickButtonView="handleClickDialogDetail"
    />
    <dialog-edit-type-purchase
      :model-booked="objectBooked"
      :show-dialog="showDialogViewEditTypePurchase"
      @clickButtonView="handleClickDialogEditTypePurchase"
    />
    <dialog-surcharge
      :data-model="dataSurcharge"
      :show-dialog="dialogAddSurcharge"
      @clickButtonAddSurcharge="handleAddSurcharge"
    />
    <dialog-confirm-user-booked
      :object-data="objectDataBooked"
      :dialog-confirm-tee="showDialogConfirmBooked"
      @clickCloseDialog="handleCloseDialog"
    />
    <dialog-confirm-resend-message
      :center-dialog-visible="showDialogConfirmResendMessage"
      :data-model="objectDataBooked"
      @clickCloseDialog="handleCloseDialog"
    />
    <dialog-send-mail
      :admin="admin"
      :dialog-send-mail="showDialogSendMail"
      :close="handleCloseDialog"
      :object-data="objectDataBooked"
    />
    <dialog-send-mail-sacombank
      :admin="admin"
      :dialog-send-mail-sacombank="showDialogSendMailSacombank"
      :close="handleCloseDialog"
      :object-data="objectDataMailSacombank"
      @closeDialogSendMailSacombank="handleCloseDialogSendMailSacombank"
    />
    <dialog-create-code-payment
      :close="handleCloseDialog"
      :bank="bank"
      :admin="admin"
      :dialog-create-code-payment="showDialogCreateCodePayment"
      :object-data="objectDataBookedCodePayment"
      @closeDialogCreateCodePayment="handleCloseDialogCreateCodePayment"
      @reloadTableData="onReloadTableData"
    /> -->
  </el-row>
</template>

<script>
import {
  convertDate,
  convertDateTime,
  convertDateTimeUTC,
  convertNumberToPrice,
  convertTeeTimeToDateTime
} from '@/utils/convert'
import {
  convertStatusString,
  convertTypeString,
  renderClassStatus,
  renderClassType,
  renderTimeFrameSelect
} from '@/utils/v10/convertNumberToString'
// import DialogAddTeeTime from './DialogAddTeeTime'
// import DialogChangeTimePlayedComponent from './components/DialogChangeTimePlayedComponent'
// import PopoverAddPromotion from './PopoverAddPromotion'
// import ButtonAddUserTable from './components/ButtonAddUserTable'
// import TdVgaTable from './components/TdVgaTable'
// import ViewFullname from './components/ViewFullname'
// import DialogCancelBooking from './components/DialogCancelBooking'
// import ActionComponents from './components/ActionComponents'
// import ActionAddTeeTimeComponent from './components/ActionAddTeeTimeComponent'
// import DialogChangeTeeTimeComponent from './components/DialogChangeTeeTimeComponent';
// import DialogViewDetail from './components/DialogViewDetail'
// import ButtonAddAdmin from './components/ButtonAddAdmin'
// import DialogEditTypePurchase from './components/DialogEditTypePurchase'
// import DialogSurcharge from './components/DialogSurcharge'
// import DialogConfirmUserBooked from './components/DialogConfirmUserBooked'
// import DialogConfirmResendMessage from './components/DialogConfirmResendMessage'
// import axios from 'axios'
// import DialogSendMail from './components/DialogSendMail'
// import DialogCreateCodePayment from './components/DialogCreateCodePayment'
// import DialogSendMailSacombank from './components/DialogSendMailSacombank.vue'
import moment from 'moment'
// import DialogCancelConfirmUserBooked from "./components/DialogCancelConfirmUserBooked";

export default {
  name: 'TableData',
  components: {
    // DialogCreateCodePayment,
    // DialogCancelConfirmUserBooked,
    // DialogConfirmUserBooked,
    // DialogSurcharge,
    // DialogEditTypePurchase,
    // ButtonAddAdmin,
    // DialogViewDetail,
    // DialogChangeTeeTimeComponent,
    // ActionAddTeeTimeComponent,
    // ActionComponents,
    // DialogCancelBooking,
    // ViewFullname,
    // TdVgaTable,
    // ButtonAddUserTable,
    // PopoverAddPromotion
    // DialogAddTeeTime,
    // DialogChangeTimePlayedComponent,
    // DialogConfirmResendMessage,
    // DialogSendMail,
    // DialogSendMailSacombank
  },
  props: {
    dataBooking: {
      type: Array,
      default() {
        return []
      }
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Object,
      default() {
        return {}
      }
    },
    bank: {
      type: Object,
      default: function() {
        return {} // Giá trị mặc định hợp lệ
      }
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      reservationModel: {},
      showDialogAddTeeTime: false,
      showDialogCancel: false,
      showDialogChangeTeeTime: false,
      showDialogChangeTimePlayed: false,
      showDialogViewDetail: false,
      showDialogViewEdit: false,
      showDialogViewEditTypePurchase: false,
      showDialogConfirmBooked: false,
      dialogAddSurcharge: false,
      objectData: {},
      objectDataBooked: {},
      objectBooked: {},
      dataSurcharge: {},
      handleHide: true,
      channel: null,
      showDialogConfirmResendMessage: false,
      showDialogSendMail: false,
      timeNow: new Date(),
      sendMailTimeout: true,
      // phoneAdmin: `${phoneAdmin}`,
      phoneAdmin: '0352810651',
      loadingButtonSendNotiConfirm: false,
      showDialogCreateCodePayment: false,
      objectDataBookedCodePayment: {},
      showDialogSendMailSacombank: false,
      objectDataMailSacombank: {},
      code_booking: null
    }
  },
  watch: {
    dataBooking(value) {
      console.log('dataBooking', value)
      console.log('admin', (this.admin))
      console.log('bank----------------', (this.bank))
      console.log('phoneAdmin', this.phoneAdmin)
      // console.log('dataBooking', value[0].booked.pax.surcharge_facility);
      // console.log('dataBooking', value[1].booked.pax.surcharge_facility);
      // console.log('dataBooking', value[2].booked.pax.surcharge_facility);
      // console.log('dataBooking', value[3].booked.pax.surcharge_facility);
      // console.log('dataBooking', value[4].booked.pax.surcharge_facility);
      // console.log('dataBooking', value[5].booked.pax.surcharge_facility);
      this.tableData = [...value]
      if (this.code_booking) {
        const objectDetail = this.tableData.find(item => item.pax_booked.code_booking === this.code_booking)
        this.onShowDialogCreateCodePayment(objectDetail)
        this.code_booking = null
      }
    },
    loadingData(value) {
      this.loading = value
    }
  },
  methods: {
    onShowDialogConfirmResendMessage(dataBooking) {
      this.showDialogConfirmResendMessage = true
      this.objectDataBooked = Object.assign({}, dataBooking)
    },
    onShowDialogConfirm(row) {
      this.showDialogConfirmBooked = true
      this.objectDataBooked = Object.assign({}, row)
    },
    onShowDialogSendEmail(row) {
      this.showDialogSendMail = true
      this.objectDataBooked = Object.assign({}, row)
    },
    onShowDialogCreateCodePayment(row) {
      this.showDialogCreateCodePayment = true
      this.objectDataBookedCodePayment = Object.assign({}, row)
    },
    showDialogAddSurcharge(row) {
      this.dialogAddSurcharge = true
      this.dataSurcharge = Object.assign({}, row)
    },
    onShowDialogEditTypePurchase(row) {
      this.objectBooked = { ...row }
      this.showDialogViewEditTypePurchase = true
    },
    handleActionAddTeeTime(value) {
      /* 1: show dialog add tee time, 2: onCancelTeeTime*/
      const action = value.action
      this.reservationModel = Object.assign({}, value.data)
      switch (action) {
        case 1: {
          this.showDialogAddTeeTime = true
          break
        }
        case 2: {
          this.showDialogCancel = true
          break
        }
        case 3: {
          this.showDialogChangeTeeTime = true
          break
        }
        case 4: {
          this.showDialogChangeTimePlayed = true
          break
        }
        default: {
          break
        }
      }
    },
    handleCloseDialog(object) {
      console.log('object', object)
      this.showDialogConfirmResendMessage = false
      this.showDialogSendMail = false
      this.showDialogCreateCodePayment = false
      this.showDialogSendMailSacombank = false

      if (object.dialog) {
        this.showDialogConfirmBooked = false
      }
      if (object.reload) {
        this.$emit('reloadTableData', true)
      }
    },
    handleRemoveTicket(ticket) {
      console.log('ticket', ticket)
      // axios.post(`${baseUrl}/api/v1/cancel-promotion`, ticket).then(res => {
      //   console.log('res............', res)
      //   if (res.data.error_code === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: 'Xóa thành công'
      //     })
      //     this.$emit('reloadTableData', true)
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: 'Xóa thất bại'
      //     })
      //   }
      // })
      console.log(ticket)
    },
    handleChangeTeeTime(value) {
      this.showDialogChangeTeeTime = value.dialog
      if (value.reload) {
        this.$emit('reloadTableData', true)
      }
    },
    handleChangePlayedTeeTime(value) {
      this.showDialogChangeTimePlayed = value.dialog
      if (value.reload) {
        this.$emit('reloadTableData', true)
      }
    },
    handleAddSurcharge(value) {
      this.dialogAddSurcharge = false
      if (value) {
        this.$emit('reloadTableData', true)
      }
    },
    handleCloseDialogCreateCodePayment(value) {
      this.showDialogCreateCodePayment = false
      if (value) {
        this.$emit('reloadTableData', true)
      }
    },
    handleCloseDialogSendMailSacombank(value) {
      this.showDialogSendMailSacombank = false
      if (value) {
        this.$emit('reloadTableData', true)
      }
    },
    handleAddPromotion(value) {
      if (value) {
        this.$emit('reloadTableData', true)
      }
    },
    handleSetDataToPopover(row) {
      this.$store.dispatch('setObjectData', row)
    },
    handleAddTeeTime(value) {
      const self = this
      this.showDialogAddTeeTime = value.dialog
      if (value.reload) {
        self.$emit('reloadTableData', true)
      }
    },
    handleCancelBooking(value) {
      this.showDialogCancel = value.dialog
      if (value.reload) {
        this.$emit('reloadTableData', true)
      }
    },
    handleActionComponent(value) {
      const action = value.action
      switch (action) {
        case 1:
          this.showDialogViewDetail = true
          this.reservationModel = Object.assign({}, value.data)
          break
        case 3:
          this.$emit('reloadTableData', true)
          break
        default:
          this.showDialogViewEdit = true
          this.reservationModel = Object.assign({}, value.data)
          break
      }
    },
    handleReloadData() {
      this.$emit('reloadTableData', true)
    },
    handleClickDialogDetail(value) {
      this.showDialogViewDetail = value
    },
    handleClickDialogEditTypePurchase(value) {
      this.showDialogViewEditTypePurchase = false
      if (value) {
        this.$emit('reloadTableData', true)
      }
    },
    checkAdmin() {
      console.log('this.phoneAdmin------------------------------------------------', this.phoneAdmin)
      if (this.phoneAdmin === '0372397025' || this.phoneAdmin === '0352810651' || this.phoneAdmin === '0913399433') {
        console.log('phone true', true)
        return true
      } else {
        console.log('phone false', false)
        return false
      }
    },
    checkUpdate(value) {
      const now = moment()
      const FIFTEEN_MINUTE = 24 * 60
      const date_play = (value.booked?.date_played)
      const date = moment(date_play).subtract(FIFTEEN_MINUTE, 'minutes')
      const diff = date.diff(now)
      return diff > 0
    },
    checkShowButton(value) {
      // const isAdmin = value.adminLoggin === value.admin.id
      return (value.pax_booked != null && (value.pax_booked.pax.status === 5 || (value.pax_booked.is_verify_booking != null && value.pax_booked.is_verify_booking === 0)))
    },
    checkAdminBooked(booked) {
      return booked.admin?.id === this.admin.id || this.admin.phone === '0352810651'
    },
    sendNotiConfiemBooking(value) {
      console.log('value........', value)
      if (value?.pax_booked?.pax?.is_send_noti === 1) {
        this.$confirm(`Yêu cầu đã được thực hiện trước đó. Có muốn thực hiện lại không ?`).then(_ => {
          this.callApiSendNotiConfiemBooking(value)
        })
      } else {
        this.callApiSendNotiConfiemBooking(value)
      }
    },
    async callApiSendNotiConfiemBooking(value) {
      console.log('value........', value)
      // const paxId = value.pax_booked.pax_id
      this.loadingButtonSendNotiConfirm = true

      // await axios.post(`${baseUrl}/api/v1/send-noti-confirm-booking/${paxId}`, { data: { pax_id: paxId }}).then(res => {
      //   console.log(res)
      //   if (res.data.error_code === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: res.data.message
      //     })
      //     this.$emit('reloadTableData', true)
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: 'Gửi thông báo thất bại'
      //     })
      //   }
      // })

      this.loadingButtonSendNotiConfirm = false
    },
    onReloadTableData(value) {
      this.$emit('reloadTableData', true)
      this.code_booking = value.code_booking
    },
    // handleCompareTimeSendSmsWithNow(row) {
    //     console.log(row);
    // },
    convertDate,
    convertDateTime,
    convertTypeString,
    convertStatusString,
    renderClassStatus,
    renderTimeFrameSelect,
    renderClassType,
    convertTeeTimeToDateTime,
    convertNumberToPrice,
    convertDateTimeUTC,
    onShowDialogSendEmailSacomBank(value) {
      console.log('value........----------------', value)
      this.showDialogSendMailSacombank = true
      this.objectDataMailSacombank = Object.assign({}, value)
    }
  }
}
</script>

<style lang="scss" scoped>
.data-table-content {
  .clearfix-10 {
      height: 10px;
      clear: both;
  }

  .position-relative {
      position: relative;

      .button-add-golf {
          position: absolute;
          bottom: 20px;
      }

      .btn-change-type-purchase {
          position: absolute;
          top: 0;
          right: 10px;
      }
  }

  .cursor {
      cursor: pointer;
  }
}

.order-request {
  background: #a9a2a24a;
}
.change-bg{
  background: #F0E68C;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
