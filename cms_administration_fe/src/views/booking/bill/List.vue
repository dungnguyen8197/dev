<template>
  <div class="reservation_booking app-container">
    <div class="col-md-12">
      <el-row class="list-account__header">
        <el-col :sm="24">
          <h3 class="title">Quản lý Bill</h3>
        </el-col>
        <el-button :disabled="isLockDayDebt" style="float:right;" type="primary" icon="el-icon-plus" @click="handleAddBill">
          Thêm mới
        </el-button>
      </el-row>
      <div class="filter-container">
        <el-row>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="listQuery.code_key"
              class="w-100"
              clearable
              placeholder="Nhập mã bill hoặc mã thanh toán"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="listQuery.bill_id"
              class="w-100"
              clearable
              placeholder="Nhập ID bill"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="listQuery.code_by_booking"
              class="w-100"
              clearable
              placeholder="Nhập Code Booking hoặc mã OUT"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="listQuery.uid"
              class="w-100"
              clearable
              placeholder="Nhập mã vID"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="12" :md="4" :lg="4" class="mr-10">
            <el-select
              v-model="listQuery.status"
              class="w-100"
              clearable
              placeholder="Trạng thái thanh toán"
              @keyup.enter.native="handleFilter"
            >
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :sm="22" :md="5" :lg="5" class="mr-10">
            <el-date-picker
              v-model="listQuery.date_played"
              type="daterange"
              range-separator="To"
              format="dd-MM-yyyy"
              value-format="dd/MM/yyyy"
              start-placeholder="BĐ Ngày chơi"
              end-placeholder="KT Ngày chơi"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10">
            <el-input
              v-model="listQuery.id_insurance"
              class="w-100"
              clearable
              placeholder="Nhập mã bảo hiểm"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :sm="22" :md="6" :lg="6" class="mr-10">
            <el-date-picker
              v-model="DateRangeCreated"
              class="daterange"
              format="dd/MM/yyyy HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="BĐ Ngày tạo"
              end-placeholder="KT Ngày tạo"
            />
          </el-col>
          <el-col :sm="24" :md="4" :lg="4" class="mr-10 mt-10">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              Tìm kiếm
            </el-button>
            <el-button class="filter-item" type="primary" @click="showDialogCreateQr = true">
              Tạo QR
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="clearfix-20" />
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="Tất cả" name="all">
          <el-row class="list-account__data">
            <el-table
              v-loading="loadingTable"
              :data="tableData"
              border
              style="width: 100%"
            >
              <el-table-column
                label="STT"
                width="50"
                align="center"
                type="index"
                :index="handleIndexMethod"
              />
              <el-table-column
                width="100"
                prop="bill_code"
                label="Mã bill / Mã thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  <div>
                    <span>{{ row.bill_code }}</span>
                  </div>
                  <div v-if="checkIsOuting(row) && row.number_of_payment == 0">
                    <span>{{ row.code }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="general_bill_id"
                label="ID Bill"
                align="center"
              />
              <el-table-column
                width="100"
                label="ID Bill Cha"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.parent_id ? row.parent_id : '' }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Code Booking"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.key ? row.key.codeBooking : '' }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Mã OUT"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-tag v-for="(out, key) in row.outSide" :key="key" class="m-1">
                    {{ out }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="HIO"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-tag v-if="row.provider_receive_money === 'buy_hio'">
                    {{ row.data_provider[0].product_name }} - {{ row.data_provider[0].data_transaction.id }}
                  </el-tag>
                  <template v-else>
                    <el-tag v-for="(hio, key) in row.hio" :key="key">
                      {{ hio }}
                    </el-tag>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Sân"
                align="center"
              >
                <template slot-scope="{row}">
                  <span
                    v-if="row.provider_receive_money === 'buy_hio'"
                  >
                    {{ row.data_provider ? row.data_provider[0].data_transaction.course_name : '' }}
                  </span>
                  <span v-else>
                    {{ row.key ? row.key.facility_name : '' }}

                  </span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Teetime"
                align="center"
              >

                <template slot-scope="{row}">
                  <span
                    v-if="row.provider_receive_money === 'buy_hio'"
                  >
                    {{ row.data_provider ? row.data_provider[0].data_transaction.date_played : '' }}
                  </span>
                  <span v-else-if="row.data_json && row.data_json.pax">
                    {{ formatDate( row.data_json.pax.date_played, 'HH:mm:ss, DD-MM-YYYY') }}
                  </span>
                  <span v-else-if="row.data_json && (row.data_json.other_services[0]?.date_played || row.data_json.shop?.flat()[0]?.date_played)">
                    {{ formatDate( row.data_json.other_services[0]?.date_played || row.data_json.shop?.flat()[0]?.date_played, 'DD-MM-YYYY') }}
                  </span>
                  <span v-else-if="row.data_json && (row.data_json.hio[0]?.date_played)">
                    {{ row.data_json.hio[0]?.date_played?.split(',')[1] }}
                  </span>
                  <span v-else>
                    {{ row.update_expiration_time ? formatDateAdd30m(row.update_expiration_time) : '' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Tổng tiền"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ formatNumber(row.payment_amount) }} đ
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="VID Thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.user_id > 0 ? `VID${row.user_id}` : '' }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Admin tạo"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ handleAdmin(row.admin_id) }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="created_at"
                label="Ngày tạo"
                align="center"
              />
              <!-- <el-table-column
                width="150"
                prop="status"
                label="Trạng thái thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  <template v-if="row.status === 1">
                    <el-tag :type="color_status[row.status]">
                      {{ payment_method[row.payment_method] }}
                    </el-tag>
                  </template>
                  <template v-else-if="row.status !== 1 && row.is_cancel !== 1">
                    <el-tag :type="color_status[row.status]">
                      {{ status_bill[row.status] }}
                    </el-tag>
                  </template>
                  <template v-else-if="row.is_cancel === 1">
                    <el-tag type="danger">
                      Đã hủy
                    </el-tag>
                  </template>
                </template>
              </el-table-column> -->
              <el-table-column
                width="150"
                prop="status"
                label="Trạng thái thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  <template>
                    <el-tag v-if="row.is_cancel === 1" type="danger">
                      Đã hủy
                    </el-tag>
                    <el-tag v-else-if=" row.is_cancel !== 1" :type="color_status[row.status]">
                      {{ status_bill[row.status] }}
                    </el-tag>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="Hành động" align="center">
                <template slot-scope="{row}">
                  <template v-if="row.admin_id === currentAdmin.id || currentAdmin.phone === '0352810651' || currentAdmin.phone === '0989531411' || currentAdmin.phone === '0392105865' || currentAdmin.phone === '0348048435'">
                    <el-button
                      v-if="row.status === 0 && row?.is_cancel !== 1"
                      class="mb-10"

                      type="success"
                      icon="el-icon-edit"
                      round
                      size="mini"
                      @click="handleConfirmBill(row)"
                    >Xác nhận
                    </el-button>
                    <el-button
                      v-if="row?.is_cancel !== 1 && row.provider_receive_money !== 'buy_hio'"
                      type="success"
                      icon="el-icon-plus"
                      round
                      size="mini"
                      class="mb-10"
                      @click="handleCreateQuote(row)"
                    >Tạo báo giá
                    </el-button>
                    <el-button
                      v-if=" row.provider_receive_money !== 'buy_hio'"
                      class=" mb-10"
                      type="primary"
                      icon="el-icon-edit"
                      round
                      size="mini"
                      @click="onShowDetail(row)"
                    >Chi tiết
                    </el-button>
                    <el-button
                      v-if="(row.status !==1 || row?.payment_amount == 0) && row?.is_cancel !== 1 && row.provider_receive_money !== 'buy_hio' && check12hTeeTimeUpdateBill(row)"
                      :disabled="isLockDayDebt"
                      class=" mb-10"
                      type="warning"
                      icon="el-icon-edit"
                      size="mini"
                      round
                      @click="handleEdit(row)"
                    >
                      Sửa
                    </el-button>
                    <!-- v-if="handleCheckDelete(row) && !checkPaymentAllService(row) && row?.is_cancel !== 1" -->
                    <el-button
                      v-if="row?.is_cancel !== 1"
                      class=" mb-10"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      round
                      @click="handleDelete(row.general_bill_id, row)"
                    >
                      Xóa
                    </el-button>
                    <el-button
                      v-if="row.bill_code && checkSendEmail(row.data_provider) && row.data_json != null && row.data_json.pax?.is_send_mail_facility !== 1 && row?.is_cancel !== 1"
                      :disabled="isLockDayDebt"
                      size="mini"
                      round
                      class="mb-10 "
                      type="primary"
                      @click="handleSendEmail(row)"
                    >
                      Gửi mail sân
                    </el-button>
                    <el-button
                      v-if="row.bill_code && checkSendEmail(row.data_provider) && row.data_json && checkSendEmailSacombank(row.data_json) && row?.is_cancel !== 1"
                      :disabled="isLockDayDebt"
                      size="mini"
                      round
                      class="mb-10 "
                      type="primary"
                      @click="handleSendEmailSTB(row)"
                    >
                      Gửi mail STB
                    </el-button>
                    <!-- :disabled="isLockDayDebt" -->
                    <el-button
                      v-if="row.status !== 0 && row?.is_cancel !== 1 && checkIsOuting(row) && row.number_of_payment == 0"
                      type="info"
                      size="mini"
                      round
                      class="mb-10 "
                      @click="createQRCode(row)"
                    > Mã QR
                    </el-button>
                    <!-- :disabled="isLockDayDebt" -->
                    <el-button
                      v-if="row.status !== 0 && row?.is_cancel !== 1 && !checkIsOuting(row)"
                      type="info"
                      size="mini"
                      round
                      class="mb-10"
                      @click="createCodePaymentBooking(row)"
                    > Code thanh toán lẻ
                    </el-button>
                    <el-button
                      v-if="row.provider_receive_money === 'buy_hio'"
                      size="small"
                      type="primary"
                      icon="el-icon-edit"
                      round
                      class="mb-10"
                      @click="onShowDialogDetail(row)"
                    >
                      Sửa đơn bh lẻ
                    </el-button>
                    <el-button
                      v-if="row.status !== 0 && row?.is_cancel !== 1 && checkIsOuting(row)"

                      type="info"
                      icon="el-icon-edit"
                      round
                      class="mb-10"
                      size="mini"
                      @click="onShowDialogCodePaymentOuting(row)"
                    >Code thanh toán Outing
                    </el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Cá nhân" name="current">
          <el-row class="list-account__data">
            <el-table
              v-loading="loadingTable"
              :data="tableData"
              border
              style="width: 100%"
            >
              <el-table-column
                label="STT"
                width="50"
                align="center"
                type="index"
                :index="handleIndexMethod"
              />
              <el-table-column
                width="100"
                prop="bill_code"
                label="Mã bill / Mã thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  <div>
                    <span>{{ row.bill_code }}</span>
                  </div>
                  <div v-if="checkIsOuting(row) && row.number_of_payment == 0">
                    <span>{{ row.code }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="general_bill_id"
                label="ID Bill"
                align="center"
              />
              <el-table-column
                width="100"
                label="ID Bill Cha"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.parent_id ? row.parent_id : '' }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Code Booking"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.key ? row.key.codeBooking : '' }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Mã OUT"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-tag v-for="(out, key) in row.outSide" :key="key" class="m-1">
                    {{ out }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="HIO"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-tag v-for="(hio, key) in row.hio" :key="key">
                    {{ hio }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Sân"
                align="center"
              >
                <template slot-scope="{row}">
                  <span
                    v-if="row.provider_receive_money === 'buy_hio'"
                  >
                    {{ row.data_provider ? row.data_provider[0].data_transaction.course_name : '' }}
                  </span>
                  <span v-else>
                    {{ row.key ? row.key.facility_name : '' }}

                  </span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Teetime"
                align="center"
              >
                <template slot-scope="{row}">
                  <span
                    v-if="row.provider_receive_money === 'buy_hio'"
                  >
                    {{ row.data_provider ? row.data_provider[0].data_transaction.date_played : '' }}
                  </span>
                  <span v-else-if="row.data_json && row.data_json.pax">
                    {{ formatDate( row.data_json.pax.date_played, 'HH:mm:ss, DD-MM-YYYY') }}
                  </span>
                  <span v-else-if="row.data_json && (row.data_json.other_services[0]?.date_played || row.data_json.shop?.flat()[0]?.date_played)">
                    {{ formatDate( row.data_json.other_services[0]?.date_played || row.data_json.shop?.flat()[0]?.date_played, 'DD-MM-YYYY') }}
                  </span>
                  <span v-else-if="row.data_json && (row.data_json.hio[0]?.date_played)">
                    {{ row.data_json.hio[0]?.date_played?.split(',')[1] }}
                  </span>
                  <span v-else>
                    {{ row.update_expiration_time ? formatDateAdd30m(row.update_expiration_time) : '' }}
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                width="100"
                prop="code"
                label="Mã thanh toán"
                align="center"
              /> -->
              <el-table-column
                width="100"

                label="Tổng tiền"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ formatNumber(row.payment_amount) }} đ
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="VID Thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.user_id > 0 ? `VID${row.user_id}` : '' }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                label="Admin tạo"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ handleAdmin(row.admin_id) }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="created_at"
                label="Ngày tạo"
                align="center"
              />
              <!-- <el-table-column
                width="150"
                prop="status"
                label="Trạng thái thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  <template v-if="row.status === 1">
                    <el-tag :type="color_status[row.status]">
                      {{ payment_method[row.payment_method] }}
                    </el-tag>
                  </template>
                  <template v-else-if="row.status !== 1 && row.is_cancel !== 1">
                    <el-tag :type="color_status[row.status]">
                      {{ status_bill[row.status] }}
                    </el-tag>
                  </template>
                  <template v-else-if="row.is_cancel === 1">
                    <el-tag type="danger">
                      Đã hủy
                    </el-tag>
                  </template>
                </template>
              </el-table-column> -->
              <el-table-column
                width="150"
                prop="status"
                label="Trạng thái thanh toán"
                align="center"
              >
                <template slot-scope="{row}">
                  <template>
                    <el-tag v-if="row.is_cancel === 1" type="danger">
                      Đã hủy
                    </el-tag>
                    <el-tag v-else-if=" row.is_cancel !== 1" :type="color_status[row.status]">
                      {{ status_bill[row.status] }}
                    </el-tag>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="Hành động" align="center">
                <template slot-scope="{row}">
                  <template v-if="row.admin_id === currentAdmin.id">

                    <el-button
                      v-if="row.status === 0 && row?.is_cancel !== 1"
                      type="success"
                      icon="el-icon-edit"
                      round
                      size="mini"
                      @click="handleConfirmBill(row)"
                    >Xác nhận
                    </el-button>
                    <el-button
                      v-if="row?.is_cancel !== 1 && row.provider_receive_money !== 'buy_hio'"
                      type="success"
                      icon="el-icon-plus"
                      round
                      size="mini"
                      @click="handleCreateQuote(row)"
                    >Tạo báo giá
                    </el-button>
                    <el-button
                      v-if=" row.provider_receive_money !== 'buy_hio'"
                      type="primary"
                      icon="el-icon-edit"
                      round
                      size="mini"
                      @click="onShowDetail(row)"
                    >Chi tiết
                    </el-button>
                    <!-- && row.provider_receive_money === 'booking_new' -->
                    <el-button
                      v-if="(row.status !==1 || row?.payment_amount == 0) && row?.is_cancel !== 1 && row.provider_receive_money !== 'buy_hio' && check12hTeeTimeUpdateBill(row)"
                      :disabled="isLockDayDebt"
                      type="warning"
                      icon="el-icon-edit"
                      size="mini"
                      round
                      @click="handleEdit(row)"
                    >
                      Sửa
                    </el-button>
                    <!-- v-if="handleCheckDelete(row) && !checkPaymentAllService(row) && row?.is_cancel !== 1"
                    :disabled="isLockDayDebt" -->
                    <el-button
                      v-if="row?.is_cancel !== 1"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      round
                      @click="handleDelete(row.general_bill_id, row)"
                    >
                      Xóa
                    </el-button>
                    <el-button
                      v-if="row.bill_code && checkSendEmail(row.data_provider) && row.data_json != null && row.data_json.pax?.is_send_mail_facility !== 1 && row?.is_cancel !== 1"
                      :disabled="isLockDayDebt"
                      size="mini"
                      round
                      class="mb-10"
                      type="primary"
                      @click="handleSendEmail(row)"
                    >
                      Gửi mail sân
                    </el-button>
                    <el-button
                      v-if="row.bill_code && checkSendEmail(row.data_provider) && row.data_json && checkSendEmailSacombank(row.data_json) && row?.is_cancel !== 1"
                      size="mini"
                      :disabled="isLockDayDebt"
                      round
                      class="mb-10"
                      type="primary"
                      @click="handleSendEmailSTB(row)"
                    >
                      Gửi mail STB
                    </el-button>
                    <el-button
                      v-if="row.status !== 0 && checkIsOuting(row) && row.number_of_payment == 0"
                      type="info"
                      size="mini"
                      round
                      class="mb-10"
                      @click="createQRCode(row)"
                    > Mã QR
                    </el-button>
                    <el-button
                      v-if="row.status !== 0 && row?.is_cancel !== 1 && !checkIsOuting(row)"
                      type="info"
                      size="mini"
                      round
                      class="mb-10 "
                      @click="createCodePaymentBooking(row)"
                    > Code thanh toán lẻ
                    </el-button>
                    <el-button
                      v-if=" row.provider_receive_money === 'buy_hio'"
                      size="small"
                      type="primary"
                      icon="el-icon-edit"
                      round
                      @click="onShowDialogDetail(row)"
                    >
                      Sửa đơn bh lẻ
                    </el-button>
                    <el-button
                      v-if="row.status !== 0 && row?.is_cancel !== 1 && checkIsOuting(row)"
                      type="info"
                      icon="el-icon-edit"
                      round
                      size="mini"
                      @click="onShowDialogCodePaymentOuting(row)"
                    >Code thanh toán Outing
                    </el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-row class="list-shop__footer">
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onGetLists"
        />
        <dialog-add-bill
          :show-dialog="showDialogAddGolfer"
          :object-data-product="objectDataProduct"
          :bill="bill"
          :list-agency="listAgency"
          :list-insurrance="listInsurrance"
          :is-add="isAdd"
          @clickButtonDialogAddGolfer="handleClickDialogAddGolfer"
          @openDialogDetailProduct="handleOpenDialogDetailProduct"
        />
        <dialog-detail-bill
          :list-agency="listAgency"
          :show-dialog="showDialogDetail"
          :list-insurrance="listInsurrance"
          :object-data="objectData"
          @clickButtonDialogDetail="handleClickDialogDetail"
        />
        <dialog-detail-other-service
          :show-dialog="showDialogDetailService"
          :service-id="serviceId"
          @clickButtonDialogDetailService="handleClickDialogDetailService"
        />
        <dialog-send-mail
          :dialog-send-mail="showDialogSendMail"
          :object-data="objectDataBooked"
          @clickCloseDialog="handleCloseDialog"
        />
        <dialog-send-mail-sacombank
          :dialog-send-mail="showDialogSendMailSTB"
          :object-data="objectDataBookedSTB"
          @closeDialogSendMailSacombank="handleCloseDialogMailSTB"
        />
        <dialog-create-q-r
          :show-dialog="showDialogCreateQr"
          @clickCloseDialog="handleCloseDialogCreateQR"
        />
        <el-dialog :visible.sync="dialogShowQRCode" width="30%" center>
          <section ref="screenshotInvoice" class="main-pd-wrapper">
            <el-image :src="urlQRcode" style="height: 100%; width: 100%;" />
          </section>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCloseDownQr">Hủy</el-button>
            <el-button type="primary" icon="el-icon-upload" :loading="loadingSubmitDownQr" @click="downloadImage">
              Download
            </el-button>
          </span>
        </el-dialog>
        <dialog-code-payment-service-booking :dialog-code-payment-service-booking="dialogShowCodePayment" :object-data="objectDataCodePayment" @closeDialogCodePaymentServiceBooking="handleCloseDialogCodePayment" />
        <dialog-view-insurance
          :show-dialog="showDialogDetailInsurance"
          :object-insurance="objectInsurance"
          @onCloseDialog="handleCloseDialogViewDetail"
        />
        <dialog-create-quote
          :show-dialog="showDialogCreateQuote"
          :object-data="objectDataCreateQuote"
          @handleClose="handleCloseDialog"
        />
        <DialogWarningDayDebt
          :show-dialog="showDialogWarningDayDebt"
          :list-data="listWarningDayDebt"
          @clickCloseDialog="handleCloseDialogWarningDayDebt"
        />
        <DialogWarningTeeTimeUnConfirm
          :show-dialog="showDialogWarningTeeTime"
          :list-data="listWarningTeeTime"
          @clickCloseDialog="handleCloseDialogWarningTeeTimeUnConfirm"
        />
        <DialogCodePaymentOuting
          :is-create="true"
          :region-info="region_info"
          :show-dialog="showDialogCodePaymentOuting"
          :object-data="objectDataCodePaymentOuting"
          :current-admin="currentAdmin"
          @clickCloseDialog="handleCloseDialogCodePaymentOuting"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import DialogAddBill from './components/dialogCreateBill'
import DialogDetailBill from './components/DialogDetailBill'
import DialogDetailOtherService from './components/DialogDetailOtherSerivce.vue'
import DialogSendMail from './components/DialogSendMail.vue'
import DialogCodePaymentOuting from './components/DialogCodePaymentOuting.vue'
import DialogSendMailSacombank
from './components/DialogSendMailSacombank.vue'
import DialogCreateQR from './components/DialongCreateQR.vue'
import AgencyResource from '@/api/agency/agency'
import { formatNumber, formatDate } from '@/utils/convert'
import { getAcountInfo, getAdmin, getAllAdmin } from '@/utils/auth'
import BookingPaxResource from '@/api/BookingPax'
import { create_signature } from '@/utils/create-signnature'
import { STATUS_BILL, COLOR_STATUS, PAYMENT_METHOD, ARRAY_STATUS_BILL_SEARCH } from '@/utils/status'
import V11PriceByHoleInsurrance from '@/api/V11PriceByHoleInsurrance'
import { genQrCode } from '@/utils/vietqr'
import html2canvas from 'html2canvas'
import { TYPE_REGION, REGION_INFO } from '@/utils/constant'
import moment from 'moment'
import DialogCodePaymentServiceBooking from '@/views/booking/bill/components/DialogCodePaymentServiceBooking.vue'
import { isEmpty } from '@/utils/validate'
import DialogViewInsurance from '@/views/booking/bill/components/DialogViewInsurance.vue'
import DialogCreateQuote from '@/views/booking/bill/components/DialogCreateQuote.vue'
import DialogWarningDayDebt from '@/views/booking/bill/components/DialogWarningDayDebt.vue'
import DialogWarningTeeTimeUnConfirm from '@/views/booking/bill/components/DialogWarningTeeTimeUnConfirm.vue'
import PaymentHubResource from '@/api/paymentHub'

const agencyResource = new AgencyResource()
const priceByHoleInsurrance = new V11PriceByHoleInsurrance()
const bookingPaxResource = new BookingPaxResource()
const paymentHubResource = new PaymentHubResource()

export default {
  name: 'Lists',
  components: {
    DialogCreateQuote,
    DialogViewInsurance,
    DialogCodePaymentServiceBooking,
    DialogAddBill,
    Pagination,
    DialogDetailOtherService,
    DialogDetailBill,
    DialogSendMail,
    DialogSendMailSacombank,
    DialogCreateQR,
    DialogWarningDayDebt,
    DialogWarningTeeTimeUnConfirm,
    DialogCodePaymentOuting
  },
  props: {
    admin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bank: {
      type: Object,
      default: () => {
        return {}
      }
    }

  },
  data() {
    return {
      showDialogCodePaymentOuting: false,
      showDialogWarningTeeTime: false,
      showDialogWarningDayDebt: false,
      showDialogAddGolfer: false,
      showDialogDetailService: false,
      showDialogDetail: false,
      loadingTable: false,
      loadingData: false,
      showDialogSendMail: false,
      loadingDeleteBill: false,
      isAdd: true,
      loadingSubmitDownQr: false,
      showDialogSendMailSTB: false,
      showDialogCreateQr: false,
      isLockDayDebt: true,
      dialogShowCodePayment: false,
      loadingConfirmBill: false,
      showDialogDetailInsurance: false,
      showDialogCreateQuote: false,
      dialogShowOTP: false,
      dialogShowQRCode: false,
      objectDataCreateQuote: {},
      objectInsurance: {},
      objectDataCodePayment: {},
      objectDataCodePaymentOuting: {},

      objectDataBookedSTB: {},
      bill: {},
      objectDataProduct: {},
      objectDataBooked: {},
      objectData: {},
      listWarningDayDebt: [],
      listWarningTeeTime: [],
      listAgency: [],
      is_delete: getAcountInfo().is_delete,
      is_write: getAcountInfo().is_write,
      is_edit: getAcountInfo().is_edit,
      dataAllAdmin: getAllAdmin() || [],
      listQuery: {
        limit: 10,
        page: 1
      },
      tableData: [],
      total: 0,
      from: 0,
      serviceId: 0,
      status_bill: STATUS_BILL,
      payment_method: PAYMENT_METHOD,
      color_status: COLOR_STATUS,
      listInsurrance: [],
      currentAdmin: getAcountInfo(),
      activeTab: 'all',
      urlQRcode: '',
      region: TYPE_REGION,
      region_info: REGION_INFO,
      otp: '',
      bill_id_confirm: '',
      DateRangeCreated: [],

      statusList: ARRAY_STATUS_BILL_SEARCH
    }
  },
  watch: {
    DateRangeCreated(value) {
      if (value) {
        this.listQuery.start_time = moment(value[0]).unix() * 1000
        this.listQuery.end_time = moment(value[1]).unix() * 1000
        const Max30Day = new Date(this.listQuery.start_time)
        Max30Day.setDate(Max30Day.getDate() + 30)
        if (new Date(this.listQuery.end_time).getTime() > Max30Day.getTime()) {
          this.$message.warning('Chọn tối đa 30 ngày thôi !!!')
          this.DateRangeCreated = undefined // Gán undefined thay vì []
          this.listQuery.start_time = undefined
          this.listQuery.end_time = undefined
          console.log('this.listQuery.......', this.listQuery)
        }
      }
    }
  },
  created() {
    this.getListInsurrance()
    this.getWarningBookingDayDebt()
    this.getBookingDayDebt()
    this.getListAgent()
    // this.getWarningTeeTimeUnConfirm()
    console.log('getAcountInfo()_______________________________________', this.currentAdmin)
  },
  mounted() {
    console.log('navigator.userAgent_______', navigator.userAgent)
    this.onGetLists()
  },
  beforeDestroy() {
  },
  methods: {

    onShowDialogDetail(row) {
      const params = { id: row.data_provider[0].data_transaction.id }
      bookingPaxResource.getDetailInsurance(params).then(response => {
        if (response.data.error_code === 0) {
          const result = response.data.data[0]
          this.showDialogDetailInsurance = true
          const bill_id = row.general_bill_id
          this.objectInsurance = { ...result, bill_id }
          console.log('tssssssssss', this.objectInsurance)
        }
      })
    },
    onShowDialogCodePaymentOuting(row) {
      this.showDialogCodePaymentOuting = true
      this.objectDataCodePaymentOuting = { ...row }
    },
    handleCloseDialogViewDetail(value) {
      if (value.dialog) {
        this.showDialogDetailInsurance = false
      }
      if (value.load) {
        this.onGetLists()
      }
    },
    isEmpty,
    handleClickDialogAddGolfer(value) {
      this.showDialogAddGolfer = false
      if (value) {
        // window.location.reload()
        this.onGetLists()
      }
    },
    onSearchForm(value) {
      this.listQuery = value
      this.onGetLists()
    },
    onReloadTableData(value) {
      if (value) {
        this.listQuery = Object.assign({}, { limit: 10, page: 1 })
        this.onGetLists()
      }
    },
    onGetLists() {
      this.loadingTable = true
      bookingPaxResource.listBill(this.listQuery).then(res => {
        console.log(res)
        if (res.error_code === 0) {
          this.tableData = res?.data?.bill?.bill_list

          this.tableData.map(item => {
            // console.log('item', JSON.parse(item.data_json))
            item.data_json = item.data_json ? JSON.parse(item.data_json) : null
            item.hio = []
            item.outSide = []
            item.data_provider.forEach(element => {
              if (element.name === 'buy_hio') {
                const nameHIO = element.data_transaction.name_tour.split('-')[1] + ' - ' + element.data_transaction.id
                item.hio.push(nameHIO)
              }
              if (element.name === 'booking_outside_new') {
                const nameOutSide = 'OUT' + element.data_transaction.payment_id
                item.outSide.push(nameOutSide)
              }
            })
          })
          console.log('this.tableData', this.tableData)

          this.total = res?.data?.total
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingTable = false
      })
    },
    onShowDetail(value) {
      this.showDialogDetail = true
      this.objectData = { ...value }
    },
    handleEdit(row) {
      this.showDialogAddGolfer = true
      this.isAdd = false
      this.bill = { ...row }
    },
    async handleDelete(id, row) {
      if (this.checkIsOuting(row)) {
        const dataListCode = await this.get_list_by_code(row.bill_code)
        const data = dataListCode?.filter(i => i.status === 1)
        if (data.length > 0) {
          this.$message.warning('Đơn đã thanh toán đặt cọc không thể xóa.')
          return
        }
      }

      this.$confirm(`Bạn có chắc chắn xóa Bill này ?`).then((_) => {
        let bodyRequest = { general_bill_id: id }
        this.loadingTable = true
        this.tableData = this.tableData.map(item => item)
        const signature = this.create_signature(bodyRequest)
        bodyRequest = { ...bodyRequest, signature }
        bookingPaxResource.removeBooking(bodyRequest).then(res => {
          if (res.error_code === 0) {
            this.$message.success('Xóa thành công')
            this.onGetLists()
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingTable = false
        })
      })
    },
    handleConfirmBill(row) {
      this.$confirm(`Bạn có muốn xác nhận bill này ?`).then((_) => {
        this.loadingTable = true
        let bodyRequest = {
          general_bill_id: row.general_bill_id,
          admin_id: getAcountInfo().id
        }
        const signature = this.create_signature(bodyRequest)
        bodyRequest = { ...bodyRequest, signature }
        bookingPaxResource.billConfirm(bodyRequest).then(res => {
          if (res.error_code === 0) {
            this.$message.success('Xác nhận thành công.')
            this.onGetLists()
          } else {
            this.$message.error(res.error_msg)
          }
        }).finally(() => {
          this.loadingTable = false
        })
      })
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : this.listQuery.page * 10 + index
    },
    handleOpenDialogDetailProduct(value) {
      this.showDialogDetailService = true
      if (value) {
        this.serviceId = value.service_id
      }
    },
    handleClickDialogDetailService(value) {
      this.showDialogDetailService = false
      if (value) {
        this.objectDataProduct = value
      }
    },
    handleClickDialogDetail(value) {
      this.showDialogDetail = false
    },
    handleAddBill() {
      this.showDialogAddGolfer = true
      this.isAdd = true
    },
    getListInsurrance() {
      priceByHoleInsurrance.listAllPackage().then(res => {
        if (res.error_code === 0) {
          const result = res?.data
          if (result.length > 0) {
            this.listInsurrance = result.filter(item => item.name && item.name.includes('D') && ((item.is_public === 1 && item.number_hole === 4) || (item.number_hole === 4 && item.name === 'D20'))).map(value => {
              return { value: value.id, label: value.name, price: value.price }
            })
            this.listInsurrance = [...this.listInsurrance, { value: 0, label: 'Không mua', price: 0 }]
          } else {
            this.listInsurrance = [{ value: 0, label: 'Không mua', price: 0 }]
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleAdmin(admin_id) {
      const admin = this.dataAllAdmin.find(item => item.id === admin_id)
      if (admin) return admin.name
      else return admin_id
    },
    handleFilter() {
      this.listQuery.page = 1
      this.onGetLists()
    },
    handleClick(tab, event) {
      console.log(tab.name, event)
      if (tab.name === 'all') {
        this.listQuery.admin_id = null
      } else {
        this.listQuery.admin_id = [this.currentAdmin.id]
      }
      this.onGetLists()
    },
    handleSendEmail(row) {
      this.showDialogSendMail = true
      this.objectDataBooked = Object.assign({}, row)
    },
    handleSendEmailSTB(row) {
      this.showDialogSendMailSTB = true
      this.objectDataBookedSTB = Object.assign({}, row)
    },
    handleCloseDialog(object) {
      console.log('object', object)
      this.showDialogSendMail = false
      this.showDialogCreateQuote = false

      if (object.reload) {
        // this.onGetLists()
      }
    },
    handleCloseDialogMailSTB(object) {
      console.log('object', object)
      this.showDialogSendMailSTB = false
      if (object.reload) {
        // this.onGetLists()
      }
    },
    checkSendEmail(value) {
      let resultCheck = true
      if (value.length > 0) {
        const check = value.filter(item => item.name === 'booking_new' || item.name === 'booking_mn_new' || item.name === 'booking_mt_new').length
        if (check > 0) resultCheck = true
        else resultCheck = false
      } else {
        resultCheck = false
      }
      return resultCheck
    },
    checkSendEmailSacombank(data_json) {
      // console.log('data_json............', data_json?.pax?.booked)
      let resultCheck = false
      const check = data_json?.pax?.booked?.filter(item => +item.is_send_mail_sacombank !== 1 && item.agency_name === 'Sacombank')
      // console.log('check.....', check)
      if (check && check.length > 0) {
        resultCheck = true
      }
      // console.log('resultCheck............', resultCheck)
      return resultCheck
    },
    checkIsOuting(row) {
      if (!row.data_json && row.user_id > 0) return true
      if (row.user_id > 0 && row.order_type === 1) return true
      if (!row.data_json) return false
      if (!row.data_json?.pax) return false
      if (row.data_json?.pax?.order_type === 1) return false
      return true
    },
    handleCloseDialogCreateQR() {
      this.showDialogCreateQr = false
    },
    async get_list_by_code(code_key) {
      const { error_code, data, error_msg } = await paymentHubResource.get_list_by_code({ code_key: [code_key] })
      if (error_code === 0) {
        return data[0].list_code_paymnet.length > 0 ? data[0].list_code_paymnet.filter(i => i.is_cancel === 0) : []
      } else {
        this.$message.error(error_msg)
        return []
      }
    },
    async createQRCode(row) {
      const region = this.region_info[this.currentAdmin.region]
      console.log('region_____________________', region)
      const dataListCode = await this.get_list_by_code(row.bill_code)
      const moneyPaid = dataListCode?.filter(i => i.status === 1)?.map(i => i.payment_amount)?.reduce((a, b) => a + b, 0) || 0
      const qr_info_data = genQrCode({
        bank: region.bank,
        accountName: region.bank_account_name,
        accountNumber: region.bank_account_number,
        amount: row.payment_amount - moneyPaid,
        memo: row.code,
        template: 'compact'
      })
      console.log('qr_info_data', qr_info_data)
      const res = await qr_info_data
      this.urlQRcode = res.result
      this.dialogShowQRCode = true
    },
    downloadImage() {
      this.loadingSubmitDownQr = true
      const fileName = `QRCode.jpg`
      html2canvas(this.$refs.screenshotInvoice)
        .then((canvas) => {
          const link = document.createElement('a')
          const uri = canvas.toDataURL('image/jpeg', 1.0)
          if (typeof link.download !== 'string') {
            window.open(uri)
          } else {
            link.href = uri
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
        .finally(() => {
          this.loadingSubmitDownQr = false
        })
    },
    getBookingDayDebt() {
      bookingPaxResource.getBookingDayDebt().then(res => {
        console.log(res)
        if (res.error_code === 0 && res.data.result.length > 0 && getAdmin().phone !== '0352810651' && getAdmin().phone !== '0392105865' && getAdmin().phone !== '0989531411' && getAdmin().phone !== '0348048435') {
          const stringListIdDebt = res.data.result.sort((a, b) => a - b)
          this.$alert(`Có ${res.data.result.length} đơn hàng đã quá hạn thanh toán. Bạn cần thu hồi nợ để thao tác trên CMS. Danh sách ID bill chưa thanh toán: ` + stringListIdDebt, 'Thông báo', {
            confirmButtonText: 'Đóng'
          })
        } else {
          this.isLockDayDebt = false
        }
      })
    },
    getWarningBookingDayDebt() {
      bookingPaxResource.getWarningBookingDayDebt().then(res => {
        console.log('res getWarningBookingDayDebt____________________________________', res.data)
        const { error_code, data } = res
        if (error_code !== 0) return

        if (res.data.length > 0) {
          this.showDialogWarningDayDebt = true
          this.listWarningDayDebt = data
        }
        // if (res.error_code === 0 && res.data.length > 0 && getAdmin().phone !== '0352810651' && getAdmin().phone !== '0989531411' && getAdmin().phone !== '0392105865' && getAdmin().phone !== '0348048435') {
        //   // const stringListIdDebt = res.data.map(item => item.id_general_bill_detail).join(', ')
        //   // this.$alert(`Có ${res.data.length} đơn hàng đã quá hạn thanh toán. Bạn cần thu hồi nợ để thao tác trên CMS. Danh sách ID bill chưa thanh toán: ` + stringListIdDebt, 'Thông báo', {
        //   //   confirmButtonText: 'Đóng'
        //   // })
        // } else {
        //   this.isLockDayDebt = false
        // }
      })
    },
    getWarningTeeTimeUnConfirm() {
      // Lấy thời gian hiện tại
      const currentDate = new Date()
      // Tính thời gian sau 1 ngày
      const oneDaysLater = moment(currentDate).subtract(1, 'days').toDate()
      const tenDaysLater = moment(currentDate).subtract(5, 'days').toDate()
      const oneDaysLaterFormatted = moment(oneDaysLater).format('DD/MM/YYYY')
      const tenDaysLaterFormatted = moment(tenDaysLater).format('DD/MM/YYYY')

      const body = {
        admin_id: [getAcountInfo().id],
        status: 0,
        page: 1,
        limit: 100,
        date_played: [tenDaysLaterFormatted, oneDaysLaterFormatted]
      }
      bookingPaxResource.listBill(body).then(res => {
        const { error_code, data } = res
        if (error_code !== 0) return
        if (data?.bill?.bill_list?.length > 0) {
          this.showDialogWarningTeeTime = true
          this.listWarningTeeTime = data?.bill?.bill_list?.map((item) => {
            const data_json = item.data_json ? JSON.parse(item.data_json) : null
            let date_played = item.data_provider ? item.data_provider[0]?.data_transaction?.date_played : ''
            if (data_json && data_json.pax) date_played = data_json.pax.date_played
            return {
              id_general_bill_detail: item.general_bill_id,
              date_played
            }
          })
        }
      })
    },
    formatDate,
    formatDateAdd30m(val) {
      const format = 'HH:mm:ss, DD-MM-YYYY'
      const day = moment(val, format)
      day.add(0, 'minutes')
      const newDate = day.format(format)
      return newDate
    },
    getListAgent() {
      agencyResource.listPriceFacilityAgency().then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.listAgency = result.map(value => {
              return { value: value.id, label: value.name, data: value }
            }).sort(function(a, b) {
              return b.value - a.value
            })
          } else {
            this.listAgency = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    createCodePaymentBooking(row) {
      this.objectDataCodePayment = Object.assign({}, row)
      this.dialogShowCodePayment = true
    },
    handleCloseDialogCodePayment() {
      this.dialogShowCodePayment = false
      this.objectDataCodePayment = {}
    },
    handleCloseDownQr() {
      this.dialogShowQRCode = false
    },
    handleCheckDelete(row) {
      const nameService = ['buy_hio', 'booking_outside_new', 'shop']
      let result = false
      const statusPaymentDone = row.status === 1
      if (row.status !== 1) {
        result = true
      }
      const checkAgencySTB = row?.data_json?.pax?.booked?.map(item => item.id_agency) // id=20 sacombank
      if (statusPaymentDone && checkAgencySTB) {
        const checkAgencyNotSTB = checkAgencySTB.filter(item => +item === 20) // id=20 sacombank
        if (+checkAgencySTB.length === +checkAgencyNotSTB.length) {
          result = true
        } else {
          result = false
        }
      }
      const data_provider_server = row.data_provider?.map(item => item.name)?.filter(item => nameService.includes(item))?.length
      if (statusPaymentDone && data_provider_server && data_provider_server > 0) { result = false }
      if (statusPaymentDone && row.outSide?.length > 0) { result = false }
      // if (statusPaymentDone && row.hio?.length > 0) { result = false }
      return result
    },
    checkPaymentAllService(row) {
      const data = row.data_json
      const check_exist_payment = (
          data?.hio?.some(item => item?.is_customer_pay === 1) ||
      data?.pax?.booked.some(item => item?.type_purchase > 0 && +item?.type_purchase !== 14 && +item?.type_purchase !== 11) ||
      data?.other_services?.some(item => item?.status === 1) ||
      data?.shop?.some(item => item.some(shopItem => shopItem?.paid > 0))
      )
      return check_exist_payment
    },
    check12hTeeTimeUpdateBill(row) {
      const data = row.data_json
      if (!isEmpty(data?.pax)) {
        // Lấy thời điểm hiện tại
        const now = moment()
        // Tạo một thời điểm với giờ 12:00 trong cùng một ngày
        const noonToday = moment().set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
        // So sánh xem giờ hiện tại có nhỏ hơn 12:00 không
        const isBeforeNoon = now.isBefore(noonToday)
        const specificTime = moment(data.pax.date_played)
        if (isBeforeNoon) {
          console.log('Chưa qua 12h')
          // Cộng thêm 1 ngày vào thời điểm cụ thể
          const oneDayLater = specificTime.clone().add(1, 'day')
          if (oneDayLater.isBefore(now, 'day')) {
            return false
          }
        } else {
          console.log('QUa 12h rồi')
          if (specificTime.isBefore(now, 'day')) {
            return false
          }
        }
        // const teeTime = moment(data.pax.date_played)
        // const teeAdd12h = teeTime.add(12, 'hours')

        // if (teeAdd12h.isBefore(now)) {
        //   return false
        // } else {
        //   return true
        // }
      }
      return true
    },
    handleCreateQuote(row) {
      this.showDialogCreateQuote = true
      this.objectDataCreateQuote = Object.assign({}, row)
    },
    handleClose() {
      this.dialogShowOTP = false
      this.bill_id_confirm = ''
      this.otp = ''
    },
    handleCloseDialogWarningDayDebt(val) {
      this.showDialogWarningDayDebt = val.dialog
    },
    handleCloseDialogCodePaymentOuting(val) {
      this.showDialogCodePaymentOuting = val.dialog
    },
    handleCloseDialogWarningTeeTimeUnConfirm(val) {
      this.showDialogWarningTeeTime = val.dialog
    },
    formatNumber, create_signature
  }
}
</script>
<style scoped>
.pd-2 {
  padding: 5px;
}

.pr-5 {
  padding-right: 15px;
}

.mr-10 {
  margin-right: 10px;
}

.w-100 {
  width: 100%;
}

.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
