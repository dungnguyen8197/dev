<template>
  <el-dialog :title="dialog.titleName" :visible.sync="showDialog" width="95%" :before-close="handleClose">
    <div
      v-loading="loadingDialog"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-row class="p-10 border-1 pb-10 mb-10">
        <!--        <el-row>-->
        <!--          <el-col :xs="24" :sm="16" :md="12" :lg="10" :xl="10">-->
        <!--            <el-radio-group v-model="typeChooseBillSelect">-->
        <!--              <el-radio :label="0"> Đơn bảo hiểm lẻ</el-radio>-->
        <!--              <el-radio :label="1"> Đơn booking</el-radio>-->
        <!--            </el-radio-group>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!-- BK -->
        <el-row>
          <el-row class="dialog-add-golfer pb-10">
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Loại đơn:</label>
              <br>
              <el-select
                v-model="postForm.order_type"
                class="w-100"
                :disabled="!isAdd"
                label="Loại đơn"
                placeholder="Loại Đơn"
                @change="changeOrderType"
              >
                <el-option v-for="item in order_type" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Người nhận hoàn tiền</label>
              <!-- <br> -->
              <el-select
                v-show="+postForm.order_type === 1"
                v-model="postForm.type_refund"
                class="w-100"
                label="Loại hoàn tiền"
                placeholder="Loại hoàn tiền"
              >
                <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <div v-show="+postForm.order_type === 2">
                <search-user
                  :data-model="postForm.host_user_id > 0 ? {_id: postForm?.host_user_id, fullname: postForm?.host_user?.fullname} : {}"
                  @selection-changed-user="handleSelectionChangedUser"
                />
              </div>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Loại hố</label>
              <br>
              <el-select v-model="postForm.type_hole" class="w-100" :disabled="!isAdd" placeholder="Loại hố">
                <el-option v-for="item in typeHole" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Sân</label>
              <br>
              <el-select
                ref="selectFacility"
                v-model="facilityModel"
                :disabled="!isAdd"
                class="w-100"
                filterable
                remote
                reserve-keyword
                placeholder="Tìm kiếm sân golf"
                :remote-method="onSearchFacility"
                :loading="loadingSearchFacility"
                @hook:mounted="(value) => cancalReadOnly(value, 'selectFacility')"
                @visible-change="(value) => cancalReadOnly(value, 'selectFacility')"
              >
                <el-option
                  v-for="facility in facilities"
                  :key="facility.value"
                  :label="facility.label"
                  :value="facility"
                />
              </el-select>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Đường</label>
              <br>
              <el-select
                v-model="postForm.path_id"
                class="w-100"
                :disabled="Object.keys(facilityModel).length === 0 || !isAdd"
                placeholder="Chọn đường"
              >
                <el-option v-for="item in paths" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Ngày chơi/Ngày sử dụng dịch vụ</label>
              <br>
              <el-date-picker
                v-model="dayPlayedModel"
                class="w-100"
                :disabled="Object.keys(facilityModel).length === 0 || !isAdd"
                :picker-options="pickerOption"
                type="date"
                format="dd/MM/yyyy"
                value-format="dd-MM-yyyy"
                placeholder="Chọn ngày"
              />
            </el-col>
            <el-col v-if="isShowHIO" :disabled="+postForm.order_type === 1" class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Bảo hiểm giải đấu</label>
              <br>
              <el-select v-model="postForm.insurance_pax" clearable placeholder="Chọn bảo hiểm">
                <el-option
                  v-for="item in listInsurrance"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
                <!-- <el-option v-for="item in listHIO" :key="item.value" :label="item.label" :value="item.value" /> -->

              </el-select>
            </el-col>
            <el-col class="p-10">
              <el-button :disabled="!isAdd" type="primary" size="mini" @click="searchTeeTime">Tìm Tee Time</el-button>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Teetime</label>
              <br>
              <el-select
                ref="selectPax"
                v-model="postForm.pax_id"
                :disabled="!isAdd"
                style="width: 100%"
                clearable
                filterable
                placeholder="Chọn Teetime"
                @change="changePax"
              >
                <el-option
                  v-for="item in listPax"
                  :key="item.id"
                  :disabled="item.booked.length > 0"
                  :class="[item.is_lock == 1 ? 'is-lock' : '']"
                  :label="convertTimestampToDateTime(item.date_played, 'HH:mm') + ' - ' + formatNumber(convertPriceHole(item, postForm.type_hole)) + ' đ/pax'"
                  :value="item.id"
                >
                  <span style="float: left">{{
                    convertTimestampToDateTime(item.date_played, 'HH:mm') + ' - ' +
                      formatNumber(convertPriceHole(item, postForm.type_hole)) + ' đ/pax'
                  }}</span>
                  <i v-if="item.is_lock == 1 && item.booked.length < 1" class="el-icon-lock" />
                  <span v-if="item.booked.length > 0" style="margin-left: 20px"> Đã booked</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col v-if="postForm.pax_id" class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
              <label>Đổi giá Teetime</label>
              <br>
              <el-popover
                ref="popoverRef"
                placement="top"
                width="250"
                trigger="click"
              >
                <el-form ref="form" v-loading="loadingDialog" :model="postForm" label-position="right">
                  <el-form-item label="Giá 9 hố :">
                    <el-input-number
                      v-model="salePaxForm.price_9_hole"
                      :min="0"
                      :step="50000"
                    />
                  </el-form-item>
                  <el-form-item label="Giá 18 hố : ">
                    <el-input-number
                      v-model="salePaxForm.price_18_hole"
                      :min="0"
                      :step="50000"
                    />
                  </el-form-item>
                  <el-form-item label="Giá 27 hố :">
                    <el-input-number
                      v-model="salePaxForm.price_27_hole"
                      :min="0"
                      :step="50000"
                    />
                  </el-form-item>
                  <el-button v-loading="loadingUpdatePricePax" type="primary" size="mini" @click="updatePricePax">Xác
                    nhận
                  </el-button>

                </el-form>

                <el-button slot="reference" :disabled="!isAdd">Click để đổi giá</el-button>
              </el-popover>
            </el-col>
            <!-- <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Bảo hiểm tặng</label>
              <br>
              <el-select
                v-model="postForm.insurance_pax_d20"
                class="w-100"
                :disabled="!postForm.pax_id"
                label="Bảo hiểm được tặng"
                placeholder="Bảo hiểm được tặng"
              >
                <el-option label="Không tặng" :value="0" />
                <el-option label="D20" :value="1" />
              </el-select>
            </el-col> -->
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Đơn bill tổng cha</label>
              <br>
              <el-select
                ref="selectParent"
                v-model="postForm.parent_id"
                class="w-100"
                filterable
                remote
                reserve-keyword
                placeholder="Tìm kiếm mã Bill"
                :remote-method="onSearchBill"
                :loading="loadingSearchUser"
                @hook:mounted="(value) => cancalReadOnly(value, 'selectParent')"
                @visible-change="(value) => cancalReadOnly(value, 'selectParent')"
              >
                <el-option v-for="item in billSearch" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Tên Outing</label>
              <br>
              <el-input
                v-model="postForm.bill_name"
                :disabled="postForm.order_type === 1"
                clearable
                placeholder="Nhập tên outing"
              />

            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Code Booking liên quan</label>
              <br>
              <el-input
                v-model="postForm.code_booking_relate"
                clearable
                placeholder="Nhập code booking liên quan"
              />

            </el-col>
            <el-col class="p-10" :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <label>Source Bank</label>
              <br>
              <el-select
                v-model="postForm.bank_id"
                clearable
                placeholder="Source Bank"
              >
                <el-option
                  v-for="(item, keyB) in SOURCE_BANK"
                  :key="item"
                  :label="keyB"
                  :value="+item"
                />
              </el-select>

            </el-col>
          </el-row>
        </el-row>
      </el-row>

      <!-- BK -->
      <span slot="footer" class="dialog-footer">
        <el-row class="p-10 border-1 mb-10">
          <el-row class="dialog-add-golfer">
            <el-col :xs="24" :sm="16" :md="12" :lg="10" :xl="10">
              <el-radio-group v-model="isInsideVhandicap">
                <el-radio :label="1"> Người chơi có mã VID</el-radio>
                <el-radio :label="0"> Người chơi ngoài hệ thống</el-radio>
              </el-radio-group>
            </el-col>
            <el-col
              class="mb-10"
              :xs="24"
              :sm="{ span: 2, offset: 4 }"
              :md="{ span: 2, offset: 6 }"
              :lg="{ span: 2, offset: 10 }"
              :xl="{ span: 2, offset: 14 }"
            >
              <el-button type="primary" @click="downloadTemplate">Tải file mẫu<i
                class="el-icon-download el-icon-right"
              /></el-button>
            </el-col>
            <el-col
              :xs="24"
              :sm="2"
            >
              <el-upload ref="upload" action="uploadURL" :on-change="onChangeFileExcel" :auto-upload="false" :limit="1">
                <el-button type="primary">Import Golfer</el-button>
              </el-upload>
            </el-col>

            <div class="clearfix-10" />
            <el-col v-show="listGolfers.length > 0">
              <el-col>
                <label>Danh sách người chơi: </label>
              </el-col>
              <el-col>
                <el-tag
                  v-for="(golfer, key) in listGolfers"
                  :key="key"
                  closable
                  :disable-transitions="false"
                  @close=" `${+golfer?.booked?.type_purchase > 0 ? () => {} : handleCloseTag(golfer)}`"
                >
                  {{
                    golfer.user_id === -1 ? `(OUT) ` + golfer.name_out_system : `VID${golfer.user_id} - ` + golfer.name_out_system
                  }}
                </el-tag>
              </el-col>
            </el-col>
            <div class="mb-10" />
            <el-col>
              <el-row>
                <el-col v-if="isInsideVhandicap === 0">
                  <label>Họ và tên:</label>
                  <el-col>
                    <el-input
                      v-if="inputVisible"
                      ref="saveTagInput"
                      v-model="inputValue"
                      placeholder="Tên người chơi"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    />
                    <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">Thêm
                      người
                    </el-button>
                  </el-col>
                </el-col>
                <el-col v-else>
                  <el-select
                    ref="selectGolfer"
                    v-model="golferModel"
                    class="w-100"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="Tìm kiếm mã VID"
                    :remote-method="onSearchGolfer"
                    :loading="loadingSearchUser"
                    @hook:mounted="(value) => cancalReadOnly(value, 'selectGolfer')"
                    @visible-change="(value) => cancalReadOnly(value, 'selectGolfer')"
                  >
                    <el-option
                      v-for="user in users"
                      :key="user.value"
                      :label="`VID${user.value} - ${user.label}`"
                      :value="user"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
            <div class="clearfix-10" />
            <div class="clearfix-10" />
            <el-col v-show="isBooking === 0">
              <el-col class="text-center">
                <el-tag type="warning">
                  <i>Sân này hiện tại chưa mở bán gói tee time nào, vui lòng chọn sân khác</i>
                </el-tag>
              </el-col>
            </el-col>
          </el-row>

          <el-row v-if="listGolfers.length > 0" class="data-table-content table-responsive">
            <span class="mb-20"><b>Danh sách Golfer: </b></span>
            <table class="table table-bordered" style="vertical-align: center">
              <thead>
                <tr>
                  <th class="text-center col-3 vertical-middle" style="min-width: 180px">Tên</th>
                  <th scope="col" class="text-center" style="min-width: 180px">SĐT</th>
                  <th scope="col" class="text-center" style="min-width: 180px">CCCD / Tên Trên CCCD</th>
                  <th scope="col" class="text-center" style="min-width: 180px">BH / BH giải</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Đối tượng khách hàng</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Khách lẻ/đại lý</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Loại thẻ SCB / Tặng bạn</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Phụ phí</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Thành tiền</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(golfer, key) in listGolfers" :key="key">
                  <th style="text-align: left" class="col-3">
                    {{
                      `${golfer.user_id == -1 ? `(OUT) ` + golfer.name_out_system : `VID${golfer.user_id} - ` + golfer.name_out_system}`
                    }}
                    <p v-if="Boolean(golfer.is_deleted)" style="color: red;">(Đã xóa - BH đã gửi PVI)</p>
                    <p v-else style="color: red;">{{ golfer.is_cancel === 1 ? '(Đã hủy)' : '' }}</p>
                  </th>
                  <td>
                    <el-input
                      v-model="listGolfers[key].phone"
                      size="mini"
                      :disabled="Boolean(golfer.is_deleted) || golfer.user_id != -1 || postForm.pax_id == null || checkDisabled(golfer) "
                    />
                  </td>
                  <td>
                    <div class="mb-1">
                      <el-input
                        v-model="listGolfers[key].cccd"
                        placeholder="Nhập CCCD"
                        size="mini"
                        :disabled="Boolean(golfer.is_deleted) || !postForm.pax_id || checkDisabled(golfer)"
                      />
                    </div>
                    <div>
                      <el-input
                        v-model="listGolfers[key].name_cccd"
                        placeholder="Tên trên CCCD"
                        size="mini"
                        :disabled=" Boolean(golfer.is_deleted) || !postForm.pax_id || checkDisabled(golfer)"
                      />
                    </div>
                  </td>
                  <td>
                    <el-select
                      v-model="listGolfers[key].insurance_pax"
                      :disabled=" Boolean(golfer.is_deleted) || !postForm.pax_id || golfer.user_id == -1 || checkInsuranceSendPVI(listGolfers[key].insurance_pax) || checkDisabled(golfer) || checkDatePlayed"
                      clearable
                      multiple
                      filterable
                      class="mb-1"
                      placeholder="Chọn Bảo hiểm"
                      size="mini"
                    >
                      <el-option
                        v-for="item in listInsurrance"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select
                      v-model="postForm.insurance_pax"
                      :disabled=" Boolean(golfer.is_deleted) || checkDisabled(golfer) || checkDatePlayed || +postForm.order_type === 1"
                      placeholder="Bảo hiểm giải"
                      size="mini"
                    >
                      <el-option
                        v-for="item in listInsurrance"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </td>
                  <td>
                    <el-select
                      v-model="listGolfers[key].customer_type"
                      placeholder="Đối tượng khách hàng"
                      size="mini"
                    >
                      <el-option
                        v-for="(item, keyC) in CUSTOMER_TYPE"
                        :key="keyC"
                        :label="item"
                        :value="+keyC"
                      />
                    </el-select>
                  </td>
                  <td class="col-3">
                    <el-select
                      v-model="listGolfers[key].agency_id"
                      size="mini"
                      :disabled="Boolean(golfer.is_deleted) || !postForm.pax_id || checkDisabled(golfer) "
                      filterable
                      placeholder="Chọn Khách lẻ/đại lý"
                      @change="handleAgency(key)"
                    >
                      <el-option
                        v-for="item in listAgency"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-row v-if="listGolfers[key].agency_id == 20 && golfer.card_stb.length > 0">
                      <el-col>
                        <!-- || listGolfers.filter(item => item.puid_use_stb && item.puid_use_stb.user_id === listGolfers[key].user_id).length > 0 -->
                        <el-select
                          v-model="listGolfers[key].code_card_stb"
                          size="mini"
                          :disabled="(!postForm.pax_id || golfer.user_id == -1 || checkDisabled(golfer)) "
                          clearable
                          filterable
                          placeholder="Chọn lượt chơi Sacombank"
                          @change="handleSelectCardStbByUser(key)"
                        >
                          <el-option
                            v-for="(item, index) in golfer.card_stb"
                            :key="index"
                            :label="`Tổng lượt : ${item.remainNoOfUse}  - Khuyến mại: ${item.offerRate}% `"
                            :value="item.offerRate"
                          />
                        </el-select>
                      </el-col>
                      <el-col v-if="golfer.use_card_stb">
                        <dialog-gift-card-stb
                          :card-disable="!postForm.pax_id || golfer.user_id == -1 || checkDisabled(golfer)"
                          :current-golfer="golfer"
                          :list-golfers="listGolfers.filter(item => item.user_id !== golfer.user_id && !item.code_card_stb )"
                        />
                      </el-col>

                    </el-row>
                    <el-row v-if="listGolfers[key].agency_id == 5 && golfer.happy_golf_card.length > 0">
                      <el-col>
                        <el-select
                          v-model="listGolfers[key].code_card"
                          size="mini"
                          :disabled="!postForm.pax_id || golfer.user_id == -1 || checkDisabled(golfer) "
                          clearable
                          filterable
                          placeholder="Chọn lượt chơi Nam Á"
                          @change="handleSelectCardByUser(key)"
                        >
                          <el-option
                            v-for="item in golfer.happy_golf_card"
                            :key="item.Code"
                            :disabled="checkCardGift(item) || item.Status === 'PROCESS'"
                            :label="`Code : ${item.Code} - Ngày hết hạn : ${item.ExDate}`"
                            :value="item.Code"
                          />
                        </el-select>
                      </el-col>
                      <el-col>
                        <dialog-gift-card
                          :current-golfer="golfer"
                          :list-golfers="listGolfers.filter(item => item.user_id !== golfer.user_id && ((golfer.use_card_puid && golfer.use_card_puid.code === item.code_card) || !item.code_card))"
                        />
                      </el-col>
                    </el-row>
                    <!-- <div v-if="golfer.code_card && ( golfer.use_card && golfer.user_id !== golfer.use_card.user_id)">
                      Thẻ tặng bởi {{ golfer.use_card.user_name }} <el-tag>Code: {{ golfer.use_card.code }}</el-tag>
                    </div> -->
                    <div v-if="golfer.puid_use_stb">
                      Thẻ tặng cho {{ golfer.puid_use_stb.nameOutSystem }}
                    </div>
                    <div v-if="golfer.use_card_puid">
                      Thẻ tặng cho {{ golfer.use_card_puid.nameOutSystem }}
                      <el-tag>Code: {{ golfer.use_card_puid.code }}</el-tag>
                    </div>
                    <div
                      v-if="listGolfers[key].price_angency"
                      class="mt-1 word-break"
                      style="font-style: italic; font-size: 12px;"
                    >
                      Giá sân theo đại lý: {{ formatNumber(listGolfers[key].price_angency) }} VND
                    </div>
                    <div
                      v-if="listGolfers[key].price_angency_discount"
                      class="mt-1 word-break"
                      style="font-style: italic; font-size: 12px;"
                    >
                      Giảm giá sân theo đại lý: {{ formatNumber(listGolfers[key].price_angency_discount) }} VND
                    </div>
                  </td>
                  <td class="col-3">
                    <div class="mb-1">
                      <el-select
                        v-model="listGolfers[key].type_card"
                        size="mini"
                        :disabled="Boolean(golfer.is_deleted) || checkDisabled(golfer)"
                        clearable
                        filterable
                        placeholder="Chọn loại thẻ"
                      >
                        <el-option
                          v-for="item in listTypeCardSCB"
                          :key="item.value + '-' + key + '-' + item.label"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="mb-1">
                      <el-input
                        v-model="listGolfers[key].partner_number"
                        :disabled="Boolean(golfer.is_deleted) || !postForm.pax_id || checkDisabled(golfer)"
                        size="mini"
                        placeholder="Tặng bạn SCB"
                      />
                    </div>
                    <div>
                      <el-input
                        v-model="listGolfers[key].note"
                        :disabled="Boolean(golfer.is_deleted) || !postForm.pax_id || checkDisabled(golfer)"
                        size="mini"
                        placeholder="Tên người đi cùng"
                      />
                    </div>
                  </td>
                  <td>
                    <el-select
                      v-model="listGolfers[key].surcharge_facility_id"
                      size="mini"
                      :disabled="Boolean(golfer.is_deleted) || !postForm.pax_id || checkDisabled(golfer)"
                      clearable
                      multiple
                      filterable
                      placeholder="Chọn Phụ phí"
                    >
                      <el-option v-for="item in listSurcharge" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>

                  </td>
                  <td style="text-align: center" class="vertical-middle">
                    <span>{{ handlePriceByGolfer(key) }} đ</span>
                  </td>
                  <td style="text-align: center" class="vertical-middle">
                    <el-button
                      v-if="golfer.user_id === -1"
                      :disabled="Boolean(golfer.is_deleted)"
                      type="primary"
                      size="mini"
                      @click="mapUserByPhone(golfer,key)"
                    >
                      Tạo VID
                    </el-button>
                    <el-button
                      :disabled="Boolean(golfer.is_deleted) || checkInsuranceSendPVI(listGolfers[key].insurance_pax) || checkDisabled(golfer) "
                      type="danger"
                      size="mini"
                      @click="handleCloseTag(golfer, key)"
                    >Xóa</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-row>
        </el-row>
        <el-row v-if="listGolfers.length > 0" class="p-10 border-1 mb-10">
          <el-row class="data-table-content table-responsive">
            <label>Danh sách Dịch vụ đi kèm</label>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="text-center col-2 vertical-middle" style="min-width: 180px">Tên dịch vụ</th>
                  <th scope="col" class="text-center col-2" style="min-width: 180px">Mã hàng</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Đơn giá</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Số lượng</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Thành tiền</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Khách lẻ/đại lý</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Note</th>
                  <th scope="col" class="text-center" style="min-width: 180px">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="postForm.service.length > 0">
                  <template v-for="(service, key_service) in postForm.service">
                    <tr v-if="service.type !== 'booking_new'" :key="key_service">
                      <th style="vertical-align: center" class="col-2">
                        <el-select
                          v-model="postForm.service[key_service].id"
                          class="w-100"
                          placeholder="Chọn dịch vụ"
                          clearable
                          :disabled="checkPaymentOtherService(postForm.service[key_service])"

                          @change="changeService(key_service)"
                        >
                          <el-option
                            v-for="item in listService"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </th>
                      <td class="col-2">
                        <el-select
                          v-if="postForm.service[key_service].id !== -1 && postForm.service[key_service].id !== 2"
                          ref="otherService"
                          v-model="postForm.service[key_service].commodity_code_id"
                          class="w-100"
                          :disabled="postForm.service[key_service].id == null || checkPaymentOtherService(postForm.service[key_service])"
                          filterable
                          remote
                          reserve-keyword
                          placeholder="Tìm kiếm sản phẩm..."
                          :remote-method="onSearchOtherService"
                          :loading="loadingSearchProduct"
                          @hook:mounted="(value) => cancalReadOnly(value, 'otherService')"
                          @visible-change="(value) => cancalReadOnly(value, 'otherService')"
                          @change="changeProduct(key_service)"
                        >
                          <el-option
                            v-for="item in listOtherService"
                            :key="item.id"
                            :label="item.name + ' - ' + formatNumber(item.price_sale) + 'đ'"
                            :value="item.id"
                          />
                        </el-select>
                        <el-select
                          v-if="postForm.service[key_service].id == 2"
                          ref="hioService"
                          v-model="postForm.service[key_service].hio_id"
                          class="w-100"
                          :disabled="postForm.service[key_service].id == null || checkPaymentOtherService(postForm.service[key_service])"
                          filterable
                          remote
                          reserve-keyword
                          placeholder="Nhập mã HIO..."
                          :remote-method="onSearchInsurrance"
                          :loading="loadingSearchInsurrance"
                          @hook:mounted="(value) => cancalReadOnly(value, 'hioService')"
                          @visible-change="(value) => cancalReadOnly(value, 'hioService')"
                          @change="changeHoleInOne(key_service)"
                        >
                          <el-option
                            v-for="item in listHoleInOne"
                            :key="item.id"
                            :label="'BH'+item.id + ' - ' + formatNumber(item.total_pay) + 'đ'"
                            :value="item.id"
                          />
                        </el-select>
                        <el-input
                          v-if="postForm.service[key_service].id == -1"
                          v-model="postForm.service[key_service].name_other_service"
                          :disabled="checkPaymentOtherService(postForm.service[key_service])"
                          placeholder="Nhập tên dịch vụ"
                          clearable
                        />
                      </td>
                      <td class="text-center">
                        <el-input-number
                          v-model="postForm.service[key_service].price"
                          :disabled="postForm.service[key_service].id == null || [1,2].includes(postForm.service[key_service].id) || checkPaymentOtherService(postForm.service[key_service])"
                          :min="0"
                          :step="50000"
                        />
                      </td>
                      <td class="text-center">
                        <el-input-number
                          v-model="postForm.service[key_service].quantity"
                          :disabled="postForm.service[key_service].id == null || postForm.service[key_service].id == 2 || checkPaymentOtherService(postForm.service[key_service])"
                          :min="1"
                          :max="1000"
                          :step="1"
                        />
                      </td>
                      <td class="vertical-middle text-center">
                        <span>{{ handlePriceService(key_service) }} đ</span>
                      </td>
                      <td class="text-center">
                        <el-select
                          v-if="postForm.service[key_service].id !== 2"
                          v-model="postForm.service[key_service].agent_id"
                          size="mini"
                          :disabled="checkPaymentOtherService(postForm.service[key_service])"
                          filterable
                          placeholder="Chọn Khách lẻ/đại lý"
                        >
                          <el-option
                            v-for="item in listAgency"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </td>
                      <td class="vertical-middle text-center">
                        <el-input
                          v-model="postForm.service[key_service].note"
                          :disabled="postForm.service[key_service].id == null || postForm.service[key_service].id == 2"
                          type="text"
                          placeholder="Note sản phẩm ngoài ."
                          maxlength="100"
                          show-word-limit
                        />
                      </td>
                      <td class="vertical-middle text-center">
                        <el-button
                          v-if="+postForm.service[key_service].is_cancel !== 1"
                          :disabled="checkPaymentOtherService(postForm.service[key_service])"
                          type="danger"
                          size="mini"
                          @click="handleCloseService(service)"
                        >Xóa</el-button>
                        <p v-else style="color: red;">Đã hủy</p>
                      </td>
                    </tr>
                  </template>
                </template>
                <tr v-else>
                  <td colspan="7" class="text-center">Chưa có dịch vụ đi kèm</td>
                </tr>
              </tbody>
            </table>
            <el-row class="text-center">
              <el-button class="text-center" @click="addService">Thêm dịch vụ</el-button>
            </el-row>
          </el-row>
        </el-row>
        <el-row v-if="listGolfers.length > 0" :gutter="20" class="p-10 mb-10">
          <el-col :xs="24" :sm="12" class="pr-10">
            <label>Note nội bộ:</label>
            <el-input
              v-model="postForm.note"
              class="w-100"
              type="textarea"
              placeholder="Note Hiển thị nội bộ"
            />
          </el-col>
          <el-col :xs="24" :sm="12">
            <label>Note Hiển thị cho khách:</label>
            <el-input
              v-model="postForm.note_app"
              class="w-100"
              type="textarea"
              placeholder="Note Hiển thị cho khách"
            />
          </el-col>
        </el-row>
        <el-dialog
          append-to-body
          class="v-modal-list-vid-not-exits"
          title="Danh sách VID không tồn tại"
          width="20%"
          :visible.sync="isShowGolferNotExist"
          :before-close="() => {isShowGolferNotExist=false}"
        >
          <el-table :data="dataVIDNotExist">
            <el-table-column property="vid" label="VID" width="100" />
          </el-table>
          <el-button @click="() => {isShowGolferNotExist=false}">Hủy bỏ</el-button>
        </el-dialog>

        <el-dialog append-to-body :visible.sync="dialogShowOTP" :before-close="handleClose" width="350px" center :title="`Nhập OTP đã gửi về SĐT bạn`">
          <section class="main-pd-wrapper">
            <el-input v-model="otp" />
          </section>
          <span slot="footer" class="dialog-footer">
            <el-button :loading="loadingSubmitOTP" type="primary" @click="verifyOtp">xác nhận</el-button>
          </span>
        </el-dialog>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">Hủy bỏ</el-button>
          <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm">{{
            dialog.buttonName
          }}</el-button>
        </span>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { convertTimestampToDateTime, formatNumber } from '@/utils/convert'
import FacilityResource from '@/api/facility/facility'
import GolferResource from '@/api/golfer/golfer'
// import AgencyResource from '@/api/agency/agency'
import BookingPaxResource from '@/api/BookingPax'
import CodeSurchargeFacility from '@/api/CodeSurchargeFacility'
import DialogGiftCard from '@/views/booking/bill/components/DialogGiftCard'
import DialogGiftCardStb from '@/views/booking/bill/components/DialogGiftCardSTB'

import { getOTP, login } from '@/api/user'
import { isEmpty } from '@/utils/validate'
import { getAcountInfo } from '@/utils/auth'
import { listOrderType, listHIO, listService, listTypeHole, LIST_TYPE_CARD_SCB, CUSTOMER_TYPE, SOURCE_BANK } from '@/utils/defaultOptions'
import { Message } from 'element-ui'
import * as XLSX from 'xlsx'
import moment from 'moment'
// import ElAvatarCustom from '@/components/Avatar/index.vue'
import SearchUser from '@/views/component/SearchUser.vue'
// import UploadExcelInsurancePassport from '@/views/booking/bill/components/UploadExcelInsurancePassport.vue'
// import UploadExcelInsurance from '@/views/booking/bill/components/UploadExcelInsurance.vue'
// import Pagination from '@/components/Pagination'
import pako from 'pako'

const golferResource = new GolferResource()
const facilityResource = new FacilityResource()
const bookingPaxResource = new BookingPaxResource()
const codeSurchargeFacility = new CodeSurchargeFacility()
// const agencyResource = new AgencyResource()

const defaultOptionPay = [
  { value: 0, label: 'Chưa xác nhận gửi PVI' },
  { value: 1, label: 'Xác nhận gửi PVI' }
]
export default {
  name: 'DialogAddGolfer',
  components: {
    // ElAvatarCustom,
    // UploadExcelInsurance,
    // UploadExcelInsurancePassport,
    SearchUser,
    DialogGiftCard,
    // Pagination,
    DialogGiftCardStb
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
      value: false
    },
    objectDataProduct: {
      type: Object,
      default() {
        return {}
      }
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    bill: {
      type: Object,
      default() {
        return {}
      }
    },
    listInsurrance: {
      type: Array,
      default() {
        return []
      }
    },
    listAgency: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      SOURCE_BANK: SOURCE_BANK,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      isShowGolferNotExist: false,
      dataVIDNotExist: [],
      inputVisible: false,
      inputVisibleHIO: false,
      isShowChangePricePax: false,
      isShowCard: false,
      isInsideVhandicap: 1,
      isShowHIO: false,
      listGolfers: [],
      postForm: {
        dayPlayed: '',
        timePlayed: '',
        is_d20: 0,
        pax: null,
        service: [],
        order_type: 1,
        type_refund: '',
        host_user_id: null,
        host_user: {},
        path_id: null,
        total_price: 0,
        type_hole: 18,
        insurance_pax: 0,
        insurance_pax_d20: 0, // 0: không tặng, 1: có d20
        note: '',
        code_booking_relate: ''

      },
      loadingSearchUser: false,
      loadingSearchFacility: false,
      inputValue: '',
      inputValueHIO: '',
      golferModel: {},
      users: [],
      facilities: [],
      facilitiesHIO: [],
      facilityModel: {},
      dayPlayedModel: null,
      isBooking: -1,
      loadingSubmit: false,
      tableData: [],
      listPax: [],
      baseUrl: '/',
      // listAgency: [],
      listHIO: listHIO,
      listHoleInOne: [],
      listSurcharge: [],
      dataCardByUser: [],
      infoCardUser: {},
      listService: listService,
      order_type: listOrderType,
      paths: [],
      typeHole: listTypeHole,
      dataPax: {},
      salePaxForm: {},
      loadingDialog: false,
      fileExcel: null,
      listOtherService: [],
      loadingSearchProduct: false,
      loadingSearchInsurrance: false,
      showDialogDetailService: false,
      loadingUpdatePricePax: false,
      keyService: null,
      dialog: { titleName: 'Tạo Bill', buttonName: 'Thêm mới' },
      bill_id: null,
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() < moment().subtract(2, 'day')
        }
      },
      billSearch: [],
      listTypeCardSCB: LIST_TYPE_CARD_SCB,
      listGolferBefore: [],
      list_hio: [],
      typeChooseBillSelect: 1,
      datePlayed: new Date(),
      timePickerOptions: {
        start: '04:00',
        step: '00:01',
        end: '21:00'
      },
      typeChoosePay: '',
      optionsPay: [...defaultOptionPay],
      agent: '',
      agentInsurance: [],
      loadingSearchAgent: false,
      optionPricePackage: {},
      prices: [],
      facilityModelHIO: {},
      listsGolfers: [],
      listsGolferError: [],
      passports: [],
      listsPassports: [],
      number_user: 0,
      golferByInsurances: [],
      objectGolfer: {},
      dataPassport: [],
      dataGolfers: [],
      dataGolfersError: [],
      listQuery: {
        page: 1,
        limit: 200
      },
      total: 0,
      checked: false,
      types: [
        // { value: 'Người nhận hoàn tiền', label: 'Người nhận hoàn tiền' },
        { value: 'Miền bắc', label: 'Miền bắc' },
        { value: 'Miền trung', label: 'Miền trung' },
        { value: 'Miền nam', label: 'Miền nam' }
      ],
      dialogShowOTP: false,
      otp: '',
      type_hio_outing: null,
      loadingSubmitOTP: false
    }
  },
  computed: {
    checkDatePlayed() {
      if (this.postForm.pax_id && this.postForm.dayPlayed) {
        const pax_select = this.listPax.find(t => t.id === this.postForm.pax_id)?.date_played
        console.log(' this.postForm.dayPlayed', this.postForm.dayPlayed)
        const dayPlayed = moment(this.convertTimestampToDateTime(pax_select, 'yyyy-MM-DD HH:mm:ss')).unix()
        const now = moment().unix()
        console.log('dayPlayed...............', dayPlayed, now)
        if (dayPlayed < now) {
          console.log(' ok đã vào đây')
          return true
        }
      }
      return false
    }
  },
  watch: {
    async golferModel(value) {
      const checkExist = this.listGolfers.filter(item => item.user_id === value.value)
      if (checkExist.length > 0) {
        this.$message.warning('VID đã được chọn.')
        return
      }

      if (!isEmpty(value)) {
        const golfer = {
          user_id: value.value,
          name_out_system: value.label,
          phone: value.phone,
          agency_id: null,
          surcharge_facility_id: [],
          cccd: '',
          customer_type: 1
        }
        const listCardData = await Promise.all(
          [this.getListHappyGolfCard(value.value), this.onGetCarByUserSTB(value.value)]
        )
        console.log('listCardData_________________', listCardData)
        const res = listCardData[0]
        console.log('............................res', res)
        // res?.dataCardByUser.filter(item => item.is_use !== 1 && item.status_select === 'ACTIVE') || []
        golfer.happy_golf_card = res?.dataCardByUser || []
        golfer.info_card = res?.infoCardUser || {}
        const cardStb = listCardData[1]
        golfer.card_stb = cardStb?.dataCardByUser?.map((i, index) => { return { ...i, id: index + 1 } }) || []
        golfer.info_card_stb = cardStb?.infoCardUser || {}
        this.listGolfers.push(golfer)
        console.log('this.listGolfers_________', this.listGolfers)
      }
    },
    facilityModel(value) {
      if (this.paths.length > 0) {
        console.log('facilityModel..........1', this.paths)
        this.paths = []
        this.postForm.path_id = null
      }
      if (this.listPax.length > 0) {
        console.log('facilityModel..........2', this.listPax)
        this.listPax = []
        this.postForm.pax = null
        this.postForm.pax_id = null
      }
      if (!isEmpty(value)) {
        console.log('facilityModel..........3')
        this.paths = value.path
        console.log('paths', this.paths)
        if (!isEmpty(value.is_no_booked) && +value.is_no_booked === 1) {
          this.postForm.facility_id = value.value
          this.postForm.facility_name = value.label
          console.log('this.postForm.facility_id........', this.postForm.facility_id)
        } else {
          console.log('vao day')
          this.isBooking = value.booking
          this.postForm.facility_id = value.value
          this.postForm.facility_name = value.label
          this.getListSurchargeFacility(value.value)
        }
      }
    },
    dayPlayedModel(value) {
      if (this.listPax.length > 0) {
        this.listPax = []
        this.postForm.pax = null
        this.postForm.pax_id = null
      }
      if (!isEmpty(value)) {
        this.postForm.dayPlayed = value
      }
    },
    objectDataProduct(value) {
      const service = this.postForm.service[this.keyService]
      if (value.remove_product) {
        this.handleCloseService(service)
        return
      }
      service.quantity = value.quantity
      service.price = value.price
      service.size = value.size || null
      service.color = value.color || null
      service.name_product = value.name_product
      service.product = value.product
    },
    bill(value) {
      if (!isEmpty(value)) {
        this.bill_id = value.general_bill_id
        this.onGetDetail(value.general_bill_id)
      }
    },
    isAdd(value) {
      console.log('isAdd', value)
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Tạo Booking Tee Time', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật Booking Tee Time', buttonName: 'Cập nhật' })
      }
    },
    objectGolfer(value) {
      if (Object.keys(value).length > 0) {
        const check = this.dataGolfers.filter(item => item.value === value.value)
        if (check.length === 0) {
          if (this.dataGolfers.length < this.maxGolfer) {
            this.dataGolfers.push(value)
            this.onGetList()
          } else {
            this.$message.warning('Đã đủ số người khai báo!')
          }
        } else {
          this.$message.warning('Người chơi đã tồn tại trong danh sách!')
        }
      }
    }
  },

  created() {

    // this.getListAgent()
  },
  methods: {
    async onSubmitForm() {
      // Map default đại lý khách lẻ outting đối với đơn outting
      if (this.postForm.order_type === 2) {
        await this.mapAgencyByBkOutting()
      }
      const error_msg = await this.validateFrom()
      if (error_msg) {
        this.$message.warning(error_msg)
        return
      }
      this.postForm.path_name = this.paths.find(item => item.id === this.postForm.path_id)?.name
      // const checkUseCardSTB = this.listGolfers.find(item => item.use_card_stb)
      // if (!isEmpty(checkUseCardSTB) && this.postForm.facility_name) {
      //   const bodyRequest = {
      //     name: 'Vung Tau Paradise Resort Golf Club (Vũng Tàu)' || this.postForm.facility_name
      //   }
      //   const resFacility = await bookingPaxResource.getFacilitySTB(bodyRequest)
      //   if (resFacility.error_code === 0) {
      //     this.postForm.location_id_by_stb = resFacility.data.location_id
      //   }
      // }'

      if (this.isAdd) {
        if (isEmpty(this.listGolfers.find(item => +item.user_id !== -1))) {
          this.$confirm(`Bạn có muốn xác nhận bill không có vID này không ?`).then((_) => {
            getOTP({ phone: getAcountInfo()?.phone }).then(res => {
              if (res.error_code === 0) {
                this.dialogShowOTP = true
              }
            })
          })
        } else {
          this.onSubmitAddGolfer()
        }
      } else {
        if (isEmpty(this.listGolfers.filter(item => item.is_cancel !== 1 && !item.is_deleted).find(item => +item.user_id !== -1))) {
          this.$confirm(`Bạn có muốn xác nhận bill không có vID này không ?`).then((_) => {
            getOTP({ phone: getAcountInfo()?.phone }).then(res => {
              if (res.error_code === 0) {
                this.dialogShowOTP = true
              }
            })
          })
        } else {
          this.onSubmitUpdate()
        }
      }
    },
    async mapAgencyByBkOutting() {
      if (this.postForm.order_type === 2) {
        // agency_id: 71 khách lẻ outting
        for (let i = 0; i < this.listGolfers.length; i++) {
          const item = this.listGolfers[i]
          if (isEmpty(item.agency_id)) {
            this.listGolfers[i].agency_id = 71
          }
        }
        for (let i = 0; i < this.postForm.service.length; i++) {
          const item = this.postForm.service[i]
          if (item.type === 'other_service' && isEmpty(item.agent_id)) {
            this.postForm.service[i].agent_id = 71
          }
        }
      }
      this.postForm = { ...this.postForm }
      return true
    },
    verifyOtp() {
      this.loadingSubmitOTP = true
      login({ phone: getAcountInfo()?.phone, code: this.otp }).then(res => {
        if (res.error_code === 0) {
          if (this.isAdd) {
            this.onSubmitAddGolfer()
          } else {
            this.onSubmitUpdate()
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    async onSubmitAddGolfer() {
      this.loadingSubmit = true
      if (this.postForm.pax_id) {
        this.postForm.path_name = this.pa
        const res = await this.checkTimeMoneyInsurance()
        if (res && res.error_code !== 0) {
          this.$message.error(res.message)
          this.loadingSubmit = false
          return
        }
      }
      if (this.postForm.path_id) {
        this.postForm.path_name = this.paths.find(item => item.id === this.postForm.path_id).name
      }

      // const resCard = await this.checkUseCardBank(this.listGolfers)
      // console.log('resCard________', resCard)
      // if (resCard.error_code !== 0) {
      //   this.$message.error(resCard.error_msg)
      //   this.loadingSubmit = false
      //   return
      // }
      const data = {
        ...this.postForm,
        golfers: this.listGolfers,
        cms_id: getAcountInfo().id ? getAcountInfo().id : 62
      }
      console.log('onSubmitAddGolfer_____________________', data)
      if (this.postForm.pax_id) {
        // eslint-disable-next-line no-unused-vars
        const { service, ...rest } = this.postForm
        const ser = service.filter(item => item?.type !== 'booking_new')
        const addService = {
          type: 'booking_new',
          ...rest
        }
        data.service = [...ser, addService]
      } else {
        data.insurance_pax_d20 = 0
      }

      bookingPaxResource.createBooking(data).then(res => {
        if (res.error_code === 0) {
          if (res.error_msg.error_code === 0) {
            this.$message.success('Tạo mới thành công')
          } else {
            this.$message.error(res.error_msg.error_msg)
          }
          this.$emit('clickButtonDialogAddGolfer', true)
          this.resetDataModal()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
        this.loadingSubmitOTP = false
        this.dialogShowOTP = false
      })
      // this.dialogShowOTP = false
    },
    async checkUseCardBank(golfers) {
      // check đại lý NAB nhưng kh sử dụng thẻ
      if (golfers.some(i => i.agency_id === 5 && isEmpty(i.code_card))) {
        return { error_code: 1, error_msg: 'Golfer đại lý NAB không sử dụng lượt chơi' }
      }
      return { error_code: 0, error_msg: null }
    },

    async onSubmitUpdate() {
      // this.loadingSubmitOTP = false
      this.loadingSubmit = true
      if (!isEmpty(this.dayPlayedModel)) {
        this.postForm.dayPlayed = this.dayPlayedModel
      }
      if (this.postForm.path_id) {
        this.postForm.path_name = this.paths.find(item => item.id === this.postForm.path_id).name
      }
      const golfers = this.listGolfers.filter(item => item?.is_cancel !== 1 && !item.is_deleted).map(item => {
        if (item.booked) {
          for (const key in item.booked) {
            if (key !== 'id' && key !== 'user_id' && key !== 'code_booking' && key !== 'pax_id' && key !== 'cms_admin_id' && key !== 'source' && key !== 'price_booking' &&
            key !== 'date_played' && key !== 'type_purchase' && key !== 'code_card_free' && key !== 'type_bank' && key !== 'code_card_free_puid' &&
            key !== 'card_puid' && key !== 'code_card_free_puid_name' && key !== 'date_payment' && key !== 'date_agent_payment' && key !== 'booking_user_passport') {
              // console.log('...........key', key)
              // Xóa key không mong muốn
              delete item.booked[key]
            }
          }
        }
        return { ...item, id: item.user_id }
      })
      if (this.postForm.service && this.postForm.service.length > 0) {
        this.postForm.service = this.postForm.service.filter(item => +item.is_cancel !== 1)
      }

      const data = {
        ...this.postForm,
        bill_id: this.bill_id,
        golfers,
        cms_id: getAcountInfo().id ? getAcountInfo().id : 62
      }

      if (this.postForm.pax_id) {
        const res = await this.checkTimeMoneyInsuranceUpdate()
        if (res && res.error_code !== 0) {
          this.$message.error(res.message)
          this.loadingSubmit = false
          return
        }
        delete data.pax.booked
        // eslint-disable-next-line no-unused-vars
        const { service, ...rest } = this.postForm
        const ser = service.filter(item => item?.type !== 'booking_new')
        const addService = {
          type: 'booking_new',
          ...rest
        }
        data.service = [...ser, addService]
      } else {
        data.insurance_pax_d20 = 0
      }

      const compressedData = pako.deflate(JSON.stringify(data), { to: 'string' })
      const compressedString = btoa(encodeURIComponent(compressedData))
      // const compressedData = btoa(encodeURIComponent(JSON.stringify(data)))

      bookingPaxResource.updateBooking({ data_zip: compressedString }).then(res => {
        if (res.error_code === 0) {
          if (res.data.response?.buy_hio && res.data.response?.buy_hio.length > 0) {
            for (const detail of res.data.response?.buy_hio) {
              if (+detail?.result?.error_code === 0) {
                this.$notify.success({
                  title: 'Success',
                  message: 'Lấy thông tin bảo hiểm thành công !!!'
                })
              } else {
                this.$notify.error({
                  title: 'Error',
                  message: detail?.result?.error_msg
                })
              }
            }
          }
          if (res.data.response?.shop && res.data.response?.shop.length > 0) {
            for (const detail of res.data.response?.shop) {
              if (+detail?.result?.[0]?.id > 0) {
                setTimeout(() => {
                  this.$notify.success({
                    title: 'Success',
                    message: 'Lấy thông tin đơn hàng shop thành công !!!'
                  })
                }, 500)
              } else {
                setTimeout(() => {
                  this.$notify.error({
                    title: 'Error',
                    message: 'Lấy thông tin đơn hàng shop thất bại !!!'
                  })
                }, 500)
              }
            }
          }
          if (res.data.responsePayment?.error_code === 0) {
            setTimeout(() => {
              this.$notify.success({
                title: 'Success',
                message: 'Update thành công !!!'
              })
            }, 500)
          } else {
            setTimeout(() => {
              this.$notify.error({
                title: 'Error',
                message: res.data.responsePayment?.error_msg
              })
            }, 500)
          }
          // this.$message.success('Cập nhập thành công.')
          this.$emit('clickButtonDialogAddGolfer', true)
          this.resetDataModal()
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSubmit = false
        this.loadingSubmitOTP = false
        this.dialogShowOTP = false
      })
      // this.dialogShowOTP = false
    },
    async checkTimeMoneyInsurance() {
      const pax = this.listPax.find(item => item.id === this.postForm.pax_id)
      const arr = []
      for (let i = 0; i < this.listGolfers.length; i++) {
        const golfer = this.listGolfers[i]
        const insurance = golfer.insurance_pax
        if (golfer.user_id !== -1 && (insurance.length > 0 || !isEmpty(this.postForm.insurance_pax))) {
          const arrInsurance = [...insurance, this.postForm.insurance_pax].filter(item => !isEmpty(item))
          arr.push({
            date_played: moment(pax.date_played).format('YYYY-MM-DD HH:mm:ss'),
            user_id: golfer.user_id,
            options_money_id: arrInsurance
          })
        }
      }
      if (arr.length > 0) {
        const body = {
          dataGolfer: arr,
          is_d20: this.postForm.insurance_pax_d20 // 0: không tặng, 1: có d20
        }
        const res = await bookingPaxResource.checkTimeMoneyInsurance(body)
        return res.data
      } else {
        return null
      }
    },
    async checkTimeMoneyInsuranceUpdate() {
      // const pax = this.listPax.find(item => item.id === this.postForm.pax_id)
      const arr = []
      const arrRemove = []
      for (let i = 0; i < this.listGolfers.length; i++) {
        const golfer = this.listGolfers[i]
        const insurance = golfer.insurance_pax
        if (golfer.user_id !== -1 && (insurance.length > 0 || !isEmpty(this.postForm.insurance_pax))) {
          let arrInsurance = [...insurance, this.postForm.insurance_pax].filter(item => !isEmpty(item))
          console.log('arrInsurance ________________1', arrInsurance)
          const GolferBefore = this.listGolferBefore.find(item => +item.id === golfer.user_id)
          console.log('GolferBefore ________________1', GolferBefore)

          if (!isEmpty(GolferBefore)) {
            arrInsurance = insurance.filter(item => !GolferBefore?.insurance_pax.includes(item))
            console.log('arrInsurance ________________2', arrInsurance)

            const checkRemove = GolferBefore?.insurance_pax.filter(item => !insurance?.includes(item))
            console.log('checkRemove ________________2', checkRemove)
            const arrIdHIO = this.list_hio.filter(item => GolferBefore?.insurance_pax.includes(item?.OptionsMoney.id))?.map(item => item?.id)
            arrRemove.push({ user_id: golfer.user_id, ids: arrIdHIO })
            // if (checkRemove && checkRemove.length > 0) {
            //   const arrIdHIO = this.list_hio.filter(item => GolferBefore?.insurance_pax.includes(item?.OptionsMoney.id))?.map(item => item?.id)
            //   arrRemove.push({ user_id: golfer.user_id, ids: arrIdHIO })
            // }
          }
          arr.push({
            date_played: moment(this.postForm?.pax?.date_played).format('YYYY-MM-DD HH:mm:ss'),
            user_id: golfer.user_id,
            options_money_id: arrInsurance
          })
        }
      }

      if (arr.length > 0) {
        const body = {
          dataGolfer: arr,

          is_d20: this.postForm.insurance_pax_d20 // 0: không tặng, 1: có d20
        }
        if (arrRemove.length > 0) {
          body.dataRemove = arrRemove
        }
        console.log('bodybodybodybodybody', body)
        const res = await bookingPaxResource.checkTimeMoneyInsurance(body)
        return res.data
      } else {
        return null
      }
    },
    async validateFrom() {
      console.log('vao day............', this.postForm, this.facilityModel, this.postForm.path_id, this.dayPlayedModel)
      let message = null
      const service = this.postForm.service
      if (!isEmpty(this.facilityModel)) {
        console.log('ok.....')
        this.postForm.facility_id = this.facilityModel.value
        if (this.postForm.facility_id) {
          this.postForm.facility_name = this.facilities.find(item => item.value === this.postForm.facility_id).label
        }
        console.log('postForm.1..', this.postForm)
      }
      console.log('postForm...', this.postForm)
      if (this.isAdd && (isEmpty(this.postForm.facility_id) || isEmpty(this.postForm.path_id) || isEmpty(this.postForm.dayPlayed)) && !isEmpty(service.find(item => item.type === 'other_service' || item.type === 'shop'))) {
        return 'Bạn cần phải chọn sân, đường và ngày chơi!'
      }
      if (service.length < 1 && !this.postForm.pax_id) {
        return 'Bạn cần phải chọn ít nhất 1 dịch vụ!'
      }
      if (this.listGolfers.length === 0) {
        return 'Bạn cần phải chọn người chơi!'
      }
      if (this.postForm.pax_id && this.listGolfers.some(i => isEmpty(i.agency_id))) {
        return 'Có khách hàng đang để trống đại lý!'
      }
      // if (this.isBooking === -1) {
      //   return 'Bạn cần phải chọn sân đánh!'
      // }
      if (+this.postForm.order_type === 2) {
        // const golferOut = this.listGolfers.filter(item => item.user_id === -1)
        // if (golferOut.length === this.listGolfers.length) {
        //   return 'Cần có mã VID để thanh toán. Vui lòng tạo mã VID!'
        // }
        if (isEmpty(this.postForm.bill_name)) {
          return 'Tên Outing không được bỏ trống!'
        }
        if (isEmpty(this.postForm.host_user_id)) {
          return 'Bạn cần phải chọn người thanh toán!'
        }
      }
      if (isEmpty(this.postForm.host_user_id)) {
        this.postForm.host_user_id = -1
      }

      console.log('service___________', service)
      if (service.length > 0) {
        for (let i = 0; i < service.length; i++) {
          const item = service[i]
          if (item.type === 'booking_new') {
            continue
          }
          if ((item.type === 'shop' && isEmpty(item.commodity_code_id)) || (item.type === 'other_service' && isEmpty(item.name_other_service))) {
            message = 'Mã hàng không được bỏ trống'
            break
          }
          if (item.type === 'other_service' && isEmpty(item.agent_id)) {
            message = 'Có đại lý đang để trống với loại dịch vụ khác!'
            break
          }
          if (isEmpty(item.price) || isEmpty(item.quantity)) {
            message = 'Giá hoặc số lượng phải là số và lớn hơn 0'
            break
          }
        }
      }
      return message
    },
    async onGetDetail(id) {
      this.loadingDialog = true
      const res = await bookingPaxResource.detailBill({ bill_id: id, all_service: true })
      console.log('res', res)
      if (res.error_code === 0) {
        const data = res.data
        console.log('data.golfers___________', data.golfers)
        this.listGolferBefore = data.golfers
        this.list_hio = data?.list_hio
        if (data.pax) {
          this.facilities = [data.pax.facility].map(value => {
            return { value: value.id, label: value.sub_title, path: value.paths }
          })
          this.facilityModel = this.facilities[0]
          this.dayPlayedModel = moment(data.pax?.date_played).format('DD-MM-YYYY')
          this.postForm.path_id = data?.pax?.path_id
          this.salePaxForm = {
            price_9_hole: data?.pax?.price_9_hole,
            price_18_hole: data?.pax?.price_18_hole,
            price_27_hole: data?.pax?.price_27_hole
          }
          bookingPaxResource.searchTeeTime({
            facility_id: data.pax.facility_id,
            path_id: data.pax.path_id,
            date_played: moment(data.pax.date_played).format('DD-MM-YYYY')
          }).then(res => {
            if (res.error_code === 0) {
              this.listPax = res.data
            }
          })
        } else {
          const other_service = data.service.find(item => item.type === 'other_service')
          console.log('other_service..........', other_service, other_service?.bookingOutside?.facility_id)
          if (!isEmpty(other_service)) {
            this.facilities =
            [{
              value: other_service?.bookingOutside?.facility_id,
              label: other_service?.bookingOutside?.facility_name,
              path: [{
                id: other_service?.bookingOutside?.path_id,
                facility_id: other_service?.bookingOutside?.facility_id,
                name: other_service?.bookingOutside?.path_name
              }],
              is_no_booked: 1
              // path_id: other_service?.bookingOutside?.path_id
            }]
            this.facilityModel = this.facilities[0]
            this.dayPlayedModel = moment(other_service?.bookingOutside?.date_played, 'yyyy-MM-DD')?.format('DD-MM-yyyy')
          } else {
            const shop_service = data.service.find(item => item.type === 'shop')
            console.log('shop_service..........', shop_service)
            if (shop_service?.date_played) {
              this.dayPlayedModel = moment(shop_service?.date_played, 'yyyy-MM-DD HH:mm:ss').format('DD-MM-yyyy')
            }
          }
        }
        // const fnAsync = async(golfer) => {
        //   return this.getListHappyGolfCard(golfer.id)
        // }
        const process = []
        data.golfers.filter(item => item.id !== -1).map(item => {
          process.push({
            name: 'card_nab',
            process: this.getListHappyGolfCard(item.id)
          })
          process.push({
            name: 'card_stb',
            process: this.onGetCarByUserSTB(item.id)
          })
        })
        const listDataCardAll = await Promise.all(process.map(item => item.process)).then(res => {
          const resultMap = []
          res.forEach((result, index) => {
            resultMap.push({
              name: process[index].name,
              result
            })
          })
          console.log(JSON.stringify(resultMap))
          return resultMap
        })
        console.log('listDataCardAll_______________', listDataCardAll)
        const listCardStb = listDataCardAll.filter(item => item.name === 'card_stb').map(item => item.result)
        const listCardNab = listDataCardAll.filter(item => item.name === 'card_nab').map(item => item.result)

        // const listCardData = await Promise.all(
        //   data.golfers.filter(item => item.id !== -1).map(fnAsync)
        // )
        // console.log('listCardData________________', listCardStb)
        const listVID = data.golfers.filter(item => item.id !== -1)

        console.log('listCardStb_____________', listCardStb)
        console.log('listCardNab_____________', listCardNab)

        for (let i = 0; i < data.golfers.length; i++) {
          const golfer = data.golfers[i]
          const booked = golfer.booked
          console.log('booked..............................', booked)
          let res = null
          let cardStb = null
          if (+golfer.id !== -1) {
            const index = listVID.findIndex(item => item.id === golfer.id)
            res = listCardNab[index]
            cardStb = listCardStb[index]
          }
          console.log('res....................getListHappyGolfCard', res)
          console.log('res....................getListCardSTB', cardStb)

          const addGolfer = {
            ...golfer,
            user_id: golfer.id,
            name_out_system: golfer.name,
            cccd: (booked && booked.booking_user_passport) ? booked.booking_user_passport.passport : '',
            surcharge_facility_id: golfer.surcharge_facility_id.map(item => item.code_surcharge_facility_id),
            // res?.dataCardByUser.filter(item => item.is_use !== 1 && item.status_select === 'ACTIVE') || []
            happy_golf_card: res?.dataCardByUser.filter(item =>
              (item.Status === 'PROCESS' || item.Status === 'ACTIVE') ||
              item.code === booked?.code_card_free ||
            item.code === booked?.card_puid) || [],
            info_card: res?.infoCardUser || {},
            name_cccd: (booked && booked.booking_user_passport) ? booked.booking_user_passport.real_name : '',
            type_card: (booked && booked.booking_user_passport) ? booked.booking_user_passport.type_card : '',
            partner_number: (booked && booked.booking_user_passport) ? booked.booking_user_passport.partner_number : '',
            note: (booked && booked.booking_user_passport) ? booked.booking_user_passport.note : '',
            card_stb: cardStb?.dataCardByUser.map((i, index) => { return { ...i, id: index + 1 } }) || [],
            info_card_stb: cardStb?.infoCardUser || {}
          }

          console.log('addGolfer____________________', addGolfer)
          if (res) {
            if (booked?.code_card_free) {
              addGolfer.code_card = booked.code_card_free
              console.log(' addGolfer.happy_golf_card____________________', booked.code_card_free)
              console.log(' addGolfer.happy_golf_card____________________', addGolfer.happy_golf_card)
              // tìm kiếm card trong danh sách ứng với code_card_free

              const card = addGolfer.happy_golf_card.find(item => item.Code.toString() === booked.code_card_free.toString())
              console.log('card______________________!', card)
              console.log('addGolfer____________________', addGolfer)
              console.log('golfer____________________', golfer)
              addGolfer.use_card = {
                user_id: card?.user_id || addGolfer.user_id,
                code: card?.Code || booked.code_card_free,
                // id: card.id,
                TimesReg: card?.ExDate,
                CustomerName: addGolfer.info_card.CustomerName
                // Phone: addGolfer?.info_card?.fullphone
              }
            }
            if (booked?.card_puid) {
              const card = addGolfer?.happy_golf_card?.find(item => item.Code.toString() === booked.card_puid.toString())
              const puid = data.golfers.find(item => item.name === booked.code_card_free_puid_name)
              let indexPuid = null
              indexPuid = this.listGolfers?.findIndex(item => item.name_out_system.toString() === booked.code_card_free_puid_name.toString())
              console.log('indexPuid_______________', indexPuid)

              if (indexPuid !== null && +indexPuid !== -1) {
                this.listGolfers[indexPuid].code_card = card?.Code || booked?.card_puid
                console.log('this.listGolfers________________', this.listGolfers)
              } else {
                indexPuid = data.golfers.findIndex(item => item.name === booked.code_card_free_puid_name)
                if (indexPuid !== -1) data.golfers[indexPuid].code_card = card?.Code || booked?.card_puid
              }
              console.log('indexPuid_______________', indexPuid)
              console.log('card_______________________', card)
              console.log('puid_______________________', puid)
              addGolfer.use_card_puid = {
                user_id: puid?.id,
                code: card?.Code || booked?.card_puid,
                // id: card.id,
                user_name: puid?.name,
                TimesReg: card?.ExDate,
                CustomerName: card?.BookingInfo?.fullname,
                nameOutSystem: puid?.name
                // Phone: addGolfer.info_card.fullphone
              }
            }
          }
          if (cardStb) {
            if (booked?.code_card_stb) {
              addGolfer.code_card_free_stb = booked.code_card_stb
              addGolfer.code_card_stb = booked.card_stb_offer_rate

              // tìm kiếm card trong danh sách ứng với code_card_free
              console.log('addGolfer____________________', addGolfer)
              console.log('golfer____________________', golfer)
              addGolfer.use_card_stb = {
                user_id: golfer.id,
                sale_name: getAcountInfo()?.user_name || getAcountInfo()?.name,
                offer_rate: booked.card_stb_offer_rate,
                puid_use: booked.card_stb_puid
              }
            }
            if (booked?.card_stb_puid) {
              let indexPuid = null
              indexPuid = this.listGolfers?.findIndex(item => item.user_id === booked.card_stb_puid)
              console.log('indexPuid_______________', indexPuid)

              if (indexPuid !== null && +indexPuid !== -1) {
                this.listGolfers[indexPuid].code_card = booked.card_stb_offer_rate
                console.log('this.listGolfers________________', this.listGolfers)
              } else {
                indexPuid = data.golfers.findIndex(item => item.id === booked.card_stb_puid)
                data.golfers[indexPuid].code_card = booked.card_stb_offer_rate
              }
              addGolfer.puid_use_stb = {
                user_id: booked?.card_stb_puid,
                nameOutSystem: booked.card_stb_puid_name
              }
            }
          }
          this.listGolfers.push(addGolfer)
          if (!isEmpty(golfer.agency_id)) {
            this.handleAgency(i)
          }
        }
        // map lại những HIO đã send PVI nhưng golfer đã bị sale xóa
        console.log('this.listGolfers________________', this.listGolfers)

        const arrayOfLists = this.listGolfers.map(obj => obj.insurance_id_pax)

        const list_hio_has_user = [].concat(...arrayOfLists)
        console.log('..........list_hio_has_user', list_hio_has_user)
        const list_hio_service = data.service.filter(item => item.type === 'hio').map(item => item.hio_id)
        const list_hio_all = data.list_hio.map(item => item.id)
        console.log('..........list_hio_all', list_hio_all)
        const list_hio_dif = list_hio_all.filter(item => !list_hio_has_user.includes(item) && !list_hio_service.includes(item))
        console.log('..........list_hio_dif', list_hio_dif)
        const list_hio_send_pvi_user_delete =
        data.list_hio.filter(item => list_hio_dif.includes(item.id) && +item.is_outing === 0 && +item.is_send_pvi === 1 && +item.options_money_id !== 9)
          .map(item1 => ({
            User: item1.User,
            options_money_id: item1.options_money_id,
            can_payment: item1.can_payment,
            id: item1.id,
            id_general_bill_detail: item1.id_general_bill_detail,
            is_outing: item1.is_outing,
            user_id: item1.user_id,
            total_pay: item1.total_pay,
            is_send_pvi: item1.is_send_pvi,
            status: item1.status,
            is_customer_pay: item1.is_customer_pay,
            is_pay: item1.is_pay
          }))
        console.log('..........list_hio_send_pvi_user_delete', list_hio_send_pvi_user_delete)
        const list_golfer_delete_hio_send_pvi = this.listUserDEteleHioSendPVI(list_hio_send_pvi_user_delete)
        console.log('..........list_golfer_delete_hio_send_pvi', list_golfer_delete_hio_send_pvi)
        this.listGolfers = [...this.listGolfers, ...list_golfer_delete_hio_send_pvi]
        // map done

        this.listOtherService = data.service.filter(item => item.type === 'shop').map(item => item.product)
        this.postForm = {
          dayPlayed: moment(data.pax?.date_played).format('DD-MM-YYYY'),
          timePlayed: '',
          is_d20: 0,
          pax: data.pax,
          service: this.mapDataService(data.service, data.order_type),
          order_type: data.order_type,
          type_refund: data?.pax && data?.pax?.agency_name ? data?.pax?.agency_name : '',
          host_user: data.host_user,
          host_user_id: data.host_user_id,
          path_id: data.pax?.path_id || data.service.find(item => item.type === 'other_service')?.bookingOutside?.path_id,
          total_price: 0,
          type_hole: data.type_hole,
          pax_id: data.pax?.id,
          insurance_pax: data.insurance_pax,
          insurance_pax_d20: data.insurance_pax_d20,
          note: data.note,
          bill_name: data?.bill_name,
          code_booking_relate: data?.code_booking_relate
          // host_user_no_pax: data?.host_user_no_pax ? {_id: data?.host_user_no_pax?.id, fullname: data?.host_user_no_pax?.fullname} : {}
        }
        if (data.order_type === 1) {
          this.isShowHIO = false
        } else {
          this.isShowHIO = true
        }

        console.log('data..................................', data)
        if (!isEmpty(data.parent_id) && data.parent_id !== 0) {
          await bookingPaxResource.detailBill({ bill_id: data.parent_id }).then(response => {
            if (res.error_code === 0) {
              this.postForm.parent_id = response.data.general_bill_id
              this.billSearch.push({ value: response.data.general_bill_id, label: response.data.bill_code })
            }
          })
        }
      } else {
        this.$message.error(res.error_msg)
      }
      this.loadingDialog = false
      console.log('this.listGolfers-------------------------------', this.listGolfers)
    },
    mapDataService(data, order_type = 1) {
      const newData = data?.map(i => {
        if (isEmpty(i.agent_id)) {
          i.agent_id = order_type === 1 ? 70 : 71
        }
        return i
      }) || []
      return newData
    },
    handleCloseTag(golfer) {
      if (golfer.code_card && golfer.agency_id === 20) { // STB
        const index = this.listGolfers.findIndex(item => item.puid_use_stb && item.puid_use_stb.nameOutSystem === golfer.name_out_system)
        console.log('index________', index)
        if (index !== -1) delete this.listGolfers[index].puid_use_stb
      }
      this.listGolfers.splice(this.listGolfers.indexOf(golfer), 1)
    },
    handleCloseService(service) {
      this.postForm.service.splice(this.postForm.service.indexOf(service), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      // if (isEmpty(this.postForm.pax_id)) {
      //   this.$message.warning('Bạn chưa chọn Tee Time')
      //   return
      // }
      const inputValue = this.inputValue
      if (inputValue) {
        const golfer = {
          user_id: -1,
          name_out_system: inputValue,
          phone: '',
          agency_id: null,
          surcharge_facility_id: [],
          cccd: '',
          happy_golf_card: [],
          info_card: {},
          card_stb: [],
          info_card_stb: {},
          type_purchase: 0,
          customer_type: 1
        }
        this.listGolfers.push(golfer)
        console.log('this.listGolfers', this.listGolfers)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    resetDataModal() {
      this.isBooking = -1
      this.facilityModel = {}
      this.golferModel = {}
      this.dayPlayedModel = null
      this.listGolfers = []
      this.billSearch = []
      this.isShowHIO = false
      this.postForm = {
        dayPlayed: '',
        timePlayed: '',
        is_d20: 0,
        pax: null,
        service: [],
        order_type: 1,
        type_refund: '',
        host_user_id: null,
        path_id: null,
        total_price: 0,
        type_hole: 18,
        insurance_pax: 0,
        insurance_pax_d20: 0
      }
      this.listHoleInOne = []
      this.dialogShowOTP = false
      this.otp = ''
    },
    resetDataModalHIO() {
      this.facilityModelHIO = {}
      this.golferModel = {}
      this.datePlayed = null
      this.listsGolfers = []
      this.listsPassports = []
      this.typeChoosePay = ''
      this.agent = ''
      this.typeChooseBillSelect = 1
    },
    handleClose() {
      this.$emit('clickButtonDialogAddGolfer', false)
      this.resetDataModal()
    },
    onSearchFacility(keyword) {
      this.postForm.path_id = null
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, booking: value.booking, path: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSearchGolfer(keyword) {
      const params = { keyword: keyword }
      this.loadingSearchUser = true
      golferResource.searchGolfer(params).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              return { value: value.id, label: value.fullname, phone: value.phone || '' }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    onSearchInsurrance(id) {
      const query = {
        page: 1,
        limit: 10,
        id: id
      }
      bookingPaxResource.searchInsurance(query).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.error_code === 0) {
            this.listHoleInOne = result?.data
            console.log(' this.listHoleInOne.............................', this.listHoleInOne)
          }
        }
      })
    },
    addService() {
      this.postForm.service.push({ id: null, commodity_code_id: null, price: null, quantity: null, amount: null, agent_id: this.postForm.order_type === 1 ? 70 : 71 })
    },
    searchTeeTime() {
      this.listPax = []
      this.loadingDialog = true
      this.postForm.pax = null
      bookingPaxResource.searchTeeTime({
        facility_id: this.facilityModel.value,
        path_id: this.postForm.path_id,
        date_played: this.postForm.dayPlayed
      }).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.$message.success('Tìm Tee Time Thành công. Vui lòng chọn Tee Time')
            this.listPax = res.data
          } else {
            this.$message.warning('Không tìm thấy Tee Time.')
          }
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    getListSurchargeFacility(facility_id) {
      codeSurchargeFacility.lists({ facility_id: facility_id }).then(res => {
        this.listSurcharge = []
        if (res.error_code === 0) {
          this.listSurcharge = res.data
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    changePax(value) {
      console.log('value______________', value)
      const paxLock = this.listPax.find((item) => item.id === value && item.is_lock === 1)
      const pax = this.listPax.find((item) => item.id === value)
      if (!isEmpty(paxLock)) {
        if (confirm('Tee đang khóa. Bạn có muốn mở Tee ?')) {
          bookingPaxResource.updateLockPax({ id: this.postForm.pax_id, is_lock: 0 }).then(res => {
            if (res.error_code === 0) {
              this.$message.success(res.error_msg)
              this.listPax = this.listPax.map(item => {
                if (item.id === value) item.is_lock = 0
                return item
              })
              this.salePaxForm = {
                price_9_hole: paxLock?.price_9_hole || 0,
                price_18_hole: paxLock?.price_18_hole || 0,
                price_27_hole: paxLock?.price_27_hole || 0
              }
            } else {
              this.$message.error(res.error_msg)
              delete this.postForm.pax_id
            }
          })
        } else {
          delete this.postForm.pax_id
          this.salePaxForm = {}
        }
      } else {
        this.salePaxForm = {
          price_9_hole: pax?.price_9_hole || 0,
          price_18_hole: pax?.price_18_hole || 0,
          price_27_hole: pax?.price_27_hole || 0
        }
      }
    },
    changeOrderType(value) {
      if (value === 2) {
        this.isShowHIO = true
      } else {
        this.isShowHIO = false
        this.postForm.insurance_pax = 0
      }
    },
    convertPriceHole(pax, type) {
      if (pax) {
        let price = null
        switch (type) {
          case 9:
            price = pax.price_9_hole
            break
          case 18:
            price = pax.price_18_hole
            break
          case 27:
            price = pax.price_27_hole
            break
          default:
            price = pax.price_18_hole
            break
        }
        return +price
      }
    },
    async onChangeFileExcel(value, array) {
      // if (isEmpty(this.postForm.pax_id)) {
      //   this.$message.warning('Bạn chưa chọn Tee Time')
      //   array.pop()
      //   return
      // }
      if (value?.name.includes('%') || value?.name.includes('#') || value?.name.includes('/')) {
        Message({
          message: `Tên file khồng được chứa ký tự %, # và /`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else if (value?.raw?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && value.status !== 'success') {
        Message({
          message: `Yêu cầu định dạng file là XLSX`,
          type: 'warning',
          duration: 5 * 1000
        })
        array.pop()
      } else {
        console.log(value.raw)
        this.fileExcel = value.raw
        const reader = new FileReader()
        reader.onload = async(e) => {
          var data = e.target.result
          var workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const rowObject = XLSX.utils.sheet_to_json(worksheet, { header: ['user_id', 'name_out_system', 'phone', 'cccd'] })
          rowObject.shift()
          let isOk = true
          if (rowObject.length > 0) {
            const arrUserId = rowObject.filter(item => item.user_id).map(item => +item.user_id)
            const res = await golferResource.getInGolfer({ users_id: arrUserId })
            const result = res.data
            const existingUserIds = result.map(user => {
              return { id: user.id, id_display: user.id_display }
            })
            const nonExistingUserIds = arrUserId.filter(id => existingUserIds.filter(item => item.id === id || item.id_display === id).length < 1)
            console.log('nonExistingUserIds________', nonExistingUserIds)
            if (nonExistingUserIds.length > 0) {
              this.dataVIDNotExist = nonExistingUserIds.map(i => {
                return { vid: i }
              })
              this.isShowGolferNotExist = true

              // Message({
              //   message: `không tồn tại mã VID ${nonExistingUserIds}`,
              //   type: 'warning',
              //   duration: 8 * 1000
              // })
              isOk = false
              return
            } else {
              for (let i = 0; i < rowObject.length; i++) {
                const row = rowObject[i]
                row.happy_golf_card = []
                row.info_card = {}
                row.card_stb = []
                row.info_card_stb = {}
                if (isEmpty(row['user_id'])) row['user_id'] = -1
                if (row['user_id'] === -1 && isEmpty(row['name_out_system'])) {
                  this.$message.warning(`Hàng thứ ${i + 1} yêu cầu có mã VID hoặc Tên KH ngoài hệ thống  !`)
                  isOk = false
                  break
                } else {
                  isOk = true
                }

                if (row['user_id'] !== -1) {
                  const user = result.find(item => item.id === row['user_id'] || item.id_display === row['user_id'])
                  row['name_out_system'] = user.fullname
                }
                delete row['fullName']
              }
              if (isOk) {
                // const fnAsync = async(golfer) => {
                //   return this.getListHappyGolfCard(golfer.user_id)
                // }
                if (this.isAdd) {
                  this.listGolfers = rowObject.filter((obj, index, self) =>
                    obj.user_id === -1 ||
                        index === self.findIndex((o) => (
                          o.user_id === obj.user_id

                        ))
                  )
                  this.$message.success('Import thành công , Các User trùng lặp sẽ xóa.')
                } else {
                  if (!this.postForm.pax_id) {
                    this.listGolfers = rowObject.filter((obj, index, self) =>
                      obj.user_id === -1 ||
                          index === self.findIndex((o) => (
                            o.user_id === obj.user_id

                          ))
                    )
                    this.$message.success('Import thành công , Các User trùng lặp sẽ xóa.')
                  } else {
                    const golfersNew = this.listGolfers.filter(item => this.checkDisabled(item) || this.checkInsuranceSendPVI(item.insurance_pax))
                    console.log('golfersNew___________', golfersNew)
                    this.listGolfers = [...golfersNew, ...rowObject].filter((obj, index, self) =>
                      obj.user_id === -1 ||
                          index === self.findIndex((o) => (
                            o.user_id === obj.user_id
                          ))
                    )
                    this.$message.success('Import thành công , Các User đã thanh toán hoặc đã gửi bảo hiểm không thể xóa, các User trùng sẽ tự động xóa.')
                  }
                }
                const process = []
                this.listGolfers.filter(item => item.user_id !== -1).map(item => {
                  process.push({
                    name: 'card_nab',
                    process: this.getListHappyGolfCard(item.user_id)
                  })
                  process.push({
                    name: 'card_stb',
                    process: this.onGetCarByUserSTB(item.user_id)
                  })
                })
                const listDataCardAll = await Promise.all(process.map(item => item.process)).then(res => {
                  const resultMap = []
                  res.forEach((result, index) => {
                    resultMap.push({
                      name: process[index].name,
                      result
                    })
                  })
                  console.log(JSON.stringify(resultMap))
                  return resultMap
                })
                console.log('listDataCardAll_______________', listDataCardAll)
                const listCardStb = listDataCardAll.filter(item => item.name === 'card_stb').map(item => item.result)
                const listCardNab = listDataCardAll.filter(item => item.name === 'card_nab').map(item => item.result)
                // const listCardData = await Promise.all(
                //   this.listGolfers.filter(item => item.user_id !== -1).map(fnAsync)
                // )
                // console.log('listCardData________________', listCardData)
                const listVID = this.listGolfers.filter(item => item.user_id !== -1)
                for (let i = 0; i < listVID.length; i++) {
                  // const res = listCardData[i]
                  const index = this.listGolfers.findIndex(item => item.user_id === listVID[i].user_id)
                  console.log('index______________', index)
                  const res = listCardNab[index]
                  const cardStb = listCardStb[index]
                  this.listGolfers[index].happy_golf_card = res?.dataCardByUser || []
                  this.listGolfers[index].info_card = res?.infoCardUser || []
                  this.listGolfers[index].card_stb = cardStb?.dataCardByUser.map((i, index) => { return { ...i, id: index + 1 } }) || []
                  this.listGolfers[index].info_card_stb = cardStb?.infoCardUser || {}
                }
              }
            }
          } else {
            this.$message.warning('Không có bản ghi.')
            return
          }
        }
        reader.readAsBinaryString(value.raw)
        array.pop()
        // this.$refs.upload.clearFiles()
      }
    },
    handlePriceByGolfer(key) {
      const golfer = this.listGolfers[key]
      golfer.price = 0
      const pax = this.listPax.find(item => item.id === this.postForm.pax_id)
      let pricePax = this.convertPriceHole(pax, this.postForm.type_hole)
      if (golfer.is_deleted) {
        pricePax = 0
      }
      golfer.price += pricePax
      if (!isEmpty(golfer['price_angency'])) {
        golfer.price = golfer.price_angency
      }
      if (!isEmpty(golfer['price_angency_discount'])) {
        golfer.price -= golfer.price_angency_discount
      }
      if (golfer['surcharge_facility_id'] && golfer['surcharge_facility_id'].length > 0) {
        this.listSurcharge.filter(item => golfer['surcharge_facility_id'].includes(item.id))
          .map(item => {
            if (item.last_price != null) {
              golfer.price = item.last_price
            } else {
              const priceCompare = Math.min(item.amount, item.max_discount)
              const surchargePrice = item.discount_by === 1 ? priceCompare * (golfer.price / 100) : priceCompare
              if (item.type_method === 1) {
                golfer.price += surchargePrice
              } else {
                golfer.price -= surchargePrice
              }
            }
          })
      }
      if (golfer.insurance_pax && golfer.insurance_pax.length > 0) {
        const insurance = this.listInsurrance.filter(item => golfer.insurance_pax.includes(item.value))
          .map(item => item.price)
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue
          }, 0)
        // console.log('........................insurance price', insurance)
        golfer.price += insurance || 0
      }
      if (this.postForm.insurance_pax) {
        const insurance = this.listInsurrance.find(item => item.value === this.postForm.insurance_pax)
        golfer.price += insurance ? insurance.price : 0
      }
      golfer.price = Math.max(golfer.price, 0)
      return this.formatNumber(golfer.price)
    },
    onSearchOtherService(value) {
      const query = {
        page: 1,
        limit: 20,
        q: value
      }
      this.loadingSearchProduct = true
      bookingPaxResource.searchOtherService(query).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.error === 0) {
            this.listOtherService = result?.list
          }
        } else {
          this.$message.error('Đã có lỗi xảy ra. Vui lòng liên hệ bộ phận kỹ thuật.')
        }
      }).finally(() => {
        this.loadingSearchProduct = false
      })
    },
    changeProduct(key) {
      this.keyService = null
      const data = this.postForm.service[key]
      this.$emit('openDialogDetailProduct', { service_id: +data.commodity_code_id })
      this.keyService = key
    },
    changeService(key) {
      const service = this.postForm.service[key]
      switch (service.id) {
        case 1:
          service.type = 'shop'
          break
        case 2:
          service.type = 'hio'
          break
        case -1:
          service.type = 'other_service'
          break
        default:
          break
      }
    },
    changeHoleInOne(key) {
      const service = this.postForm.service[key]
      const hio = this.listHoleInOne.find(item => item.id === service.hio_id)
      service.price = hio.total_pay
      service.quantity = 1
      service.hio_info = hio
    },
    handlePriceService(key) {
      const service = this.postForm.service[key]
      service.amount = service.price * service.quantity
      return formatNumber(service.amount)
    },
    async mapUserByPhone(golfer, key) {
      if (isEmpty(golfer.phone)) {
        this.$message.warning('SDT không được bỏ trống.')
        return
      }
      const checkExist = this.listGolfers.find(item => item.phone === golfer.phone && item.user_id !== -1)
      if (!isEmpty(checkExist)) {
        this.$message.warning(`SDT ${checkExist.phone} tương ứng mã VID${checkExist.user_id} đã được chọn .`)
        return
      }
      const bodyRequest = {
        phone: golfer.phone,
        fullname: golfer.name_out_system
      }
      const user = this.listGolfers[key]
      const res = await bookingPaxResource.mapUserByPhone(bodyRequest)
      console.log('res.....................................data map user phone', res.data)
      if (res.error_code === 0) {
        const result = res.data
        user.user_id = result.id
        user.name_out_system = result.fullname
        user.phone = result.phone
        const resCard = await this.getListHappyGolfCard(result.id)
        user.happy_golf_card = resCard?.dataCardByUser?.filter(item => item.is_use !== 1 && item.status_select === 'ACTIVE') || []
        user.info_card = resCard?.infoCardUser || {}
        this.$message.success('Tạo mã VID thành công.')
      }
    },
    updatePricePax() {
      if (!this.postForm.pax_id) {
        this.$message.warning('Bạn chưa chọn teetime')
        return
      }
      const body = {
        ...this.salePaxForm,
        pax_id: this.postForm.pax_id
      }
      this.loadingUpdatePricePax = true
      bookingPaxResource.updatePricePax(body).then(res => {
        if (res.error_code === 0) {
          this.$message.success(res.error_msg)
          this.listPax = this.listPax.map(item => {
            if (item.id === body.pax_id) {
              item.price_9_hole = body.price_9_hole
              item.price_18_hole = body.price_18_hole
              item.price_27_hole = body.price_27_hole
            }
            return item
          })
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingUpdatePricePax = false
        this.$refs.popoverRef.doClose()
      })
    },
    downloadTemplate() {
      // Tạo một đối tượng URL từ đường dẫn đến file mẫu
      const fileURL = '/list_golfer_example.xlsx'

      // Tạo một thẻ a ẩn
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.download = 'list-golfer-example.xlsx'

      // Kích hoạt sự kiện click để tải file
      link.click()
    },

    downloadTemplateHIOnoVID() {
      // Tạo một đối tượng URL từ đường dẫn đến file mẫu
      const fileURL = '/File_import_list_golfer_no_vga.xlsx'

      // Tạo một thẻ a ẩn
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.download = 'File_import_list_golfer_no_vga.xlsx'

      // Kích hoạt sự kiện click để tải file
      link.click()
    },
    downloadTemplateHIOVID() {
      // Tạo một đối tượng URL từ đường dẫn đến file mẫu
      const fileURL = '/File_import_list_golfer.xlsx'

      // Tạo một thẻ a ẩn
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.download = 'File_import_list_golfer.xlsx'

      // Kích hoạt sự kiện click để tải file
      link.click()
    },
    async getListHappyGolfCard(vID) {
      try {
        const res = await bookingPaxResource.getCardByUser({ user_id: vID })
        console.log('res.....................................data card by user', res.data)
        if (res.error_code === 0) {
          console.log('res.....................................data card by user', res.data)
          const result = res.data
          if (result.responsecode === '00') {
            // const data = result.data
            const dataCardByUser = []

            if (!isEmpty(result.ListCardFree) && result.ListCardFree.Details.length > 0) {
              result.ListCardFree.Details.forEach(item => {
                if (item.Status === 'ACTIVE' || item.Status === 'PROCESS') {
                  dataCardByUser.push(item)
                }
              })
            }

            // const dataCardByUser = res.data
            console.log('...................dataCardByUser', dataCardByUser)
            return {
              dataCardByUser,
              infoCardUser: { ...result?.InfoCardUser, provider: 'nab' }
            }
          }
        } else {
          return null
        }
      } catch (ex) {
        console.log(ex)
      }
    },
    async onGetCarByUserSTB(vID = '105581') {
      return null
      // const params = {
      //   user_id: vID,
      //   page: 1,
      //   limit: 100,
      //   is_info: 1,
      //   is_group: 1
      // }

      // const res = await bookingPaxResource.getCardByUserSTB(params)
      // if (res.error_code === 0) {
      //   console.log(' res?.data?.data card stb__________', res?.data?.data)
      //   const { benefit, ...rest } = res?.data?.data
      //   return {
      //     dataCardByUser: benefit,
      //     infoCardUser: { ...rest, provider: 'stb' }
      //   }
      // } else {
      //   return null
      // }
    },
    handleAgency(key) {
      const golfer = this.listGolfers[key]
      console.log('golfer agency........................', golfer)
      console.log('list agency........................', this.listAgency)

      const agency = this.listAgency.find(item => item.value === this.listGolfers[key].agency_id)
      if (isEmpty(agency)) {
        delete this.listGolfers[key].price_angency
        delete this.listGolfers[key].price_angency_discount
        return
      }
      console.log('agency........................search======================', agency)
      // if (agency.value === this.facilityModel.value) {
      // lấy giá của sân ứng với đại lý
      console.log('this.postForm.path_id ____________', this.postForm.path_id)
      let price = agency.data.price_agency_facility.find(item => (item.path_id === this.postForm.path_id && item.facility_id === this.facilityModel.value))
      if (isEmpty(price)) {
        price = agency.data.price_agency_facility.find(item => item.facility_id === this.facilityModel.value && isEmpty(item.path_id))
      }
      console.log('price........................', price)
      console.log('paths........................', this.paths)

      if (!isEmpty(price)) {
        console.log('vao đây price........................', price)
        if (!isEmpty(price.discount_amount)) {
          if (price.type_discount === 0) {
            this.listGolfers[key].price_angency_discount = price.discount_amount
          } else {
            const pax = this.listPax.find(item => item.id === this.postForm.pax_id)
            const pricePax = this.convertPriceHole(pax, this.postForm.type_hole)
            this.listGolfers[key].price_angency_discount = pricePax * (price.discount_amount / 100)
          }
        } else {
          console.log('this.postForm.dayPlayed________', this.postForm.dayPlayed)
          const date = moment(this.postForm.dayPlayed, 'DD-MM-YYYY').format('YYYY-MM-DD')
          const today = new Date(date)
          console.log('holiday_price_____________', today.getDay(), price)
          if ([6, 0].includes(today.getDay())) {
            this.listGolfers[key].price_angency = price.holiday_price
          } else {
            this.listGolfers[key].price_angency = price.normal_price
          }
        }
      } else {
        delete this.listGolfers[key].price_angency
        delete this.listGolfers[key].price_angency_discount
      }
      if (golfer.agency_id !== 20 && !isEmpty(golfer.code_card_stb)) { // Sacombank
        delete golfer.code_card_stb
        this.handleSelectCardStbByUser(key)
      }
      // }
    },
    handleSelectCardByUser(key) {
      const golfer = this.listGolfers[key]
      if (isEmpty(golfer.code_card)) {
        delete golfer.code_card
        delete golfer.use_card
        return
      }
      if (golfer.use_card && (golfer.use_card.user_id !== golfer.user_id)) {
        this.$message.warning(`vID${golfer.user_id} đã được tặng thẻ bởi vID${golfer.use_card.user_id}`)
        return
      }
      if (!isEmpty(golfer.code_card)) {
        const card = golfer.happy_golf_card.find(item => item.Code.toString() === golfer.code_card.toString())
        golfer.use_card = {
          user_id: card.user_id,
          code: card.Code,
          // id: card.id,
          TimesReg: card.ExDate,
          CustomerName: golfer.info_card.CustomerName,
          Phone: golfer.phone
        }
      }
    },
    handleSelectCardStbByUser(key) {
      const golfer = this.listGolfers[key]
      if (isEmpty(golfer.code_card_stb)) {
        delete golfer.code_card_stb
        delete golfer.use_card_stb
        if (golfer.puid_use_stb) {
          const golferUseIndex = this.listGolfers.findIndex(item => item.name_out_system === golfer.puid_use_stb.nameOutSystem)
          delete this.listGolfers[golferUseIndex].code_card
          delete this.listGolfers[golferUseIndex].agency_id
          delete golfer.puid_use_stb
        }
        return
      }
      console.log('golfer_______', golfer)
      console.log('golfer.use_card_stb_________', golfer.use_card_stb)
      console.log('moment().unix()______', moment().unix())
      if (golfer.use_card_stb && (golfer.use_card_stb.user_id !== golfer.user_id)) {
        this.$message.warning(`vID${golfer.user_id} đã được tặng thẻ bởi vID${golfer.use_card_stb.user_id}`)
        return
      }
      if (!isEmpty(golfer.code_card_stb)) {
        const card = golfer.card_stb.find(item => +item.offerRate === +golfer.code_card_stb)
        console.log('card___________', card)
        console.log('getAcountInfo__________', getAcountInfo())

        golfer.use_card_stb = {
          user_id: golfer.user_id,
          sale_name: getAcountInfo()?.user_name || getAcountInfo()?.name,
          offer_rate: card.offerRate,
          note: 'test'
          // date_booked: moment().unix()
        }
      }
    },
    checkCardGift(card) {
      const golfer = this.listGolfers.filter(item => item.code_card)
        .map(item => item.code_card)
      return golfer.includes(card.code)
    },
    // filter(item => !listGolfers.map(item => item.code_card).includes(item.code)
    onSearchBill(keyword) {
      this.loadingSearchUser = true
      this.billSearch = []
      bookingPaxResource.listBill({ limit: 10, page: 1, code_key: keyword }).then(res => {
        console.log('res.............................bookingPaxResource', res)
        if (res.error_code === 0) {
          this.billSearch = res?.data?.bill?.bill_list.map(item => {
            return {
              value: item.general_bill_id,
              label: item.bill_code
            }
          })

          console.log('this.bills.............................', this.billSearch)
        } else {
          this.$message.error(res.error_msg)
        }
      }).finally(() => {
        this.loadingSearchUser = false
      })

      // golferResource.searchGolfer(params).then(res => {
      //   const result = res.data
      //   if (res.error_code === 0) {
      //     if (result.length > 0) {
      //       this.users = result.map(value => {
      //         return { value: value.id, label: value.fullname, phone: value.phone || '' }
      //       })
      //     } else {
      //       this.users = []
      //     }
      //     this.loadingSearchUser = false
      //   } else {
      //     this.$message.error(res.error_msg)
      //   }
      // })
    },
    handleSelectionChangedUser(value) {
      console.log('value', value)
      if (isEmpty(value)) {
        delete this.postForm.host_user_id
        return
      }
      this.postForm.host_user_id = value.value
    },
    checkPaymentOtherService(val) {
      if (val.bookingOutside && val.bookingOutside.status === 1) { // Đã thanh toán
        return true
      } else if (val.hio_info && (val.hio_info.is_send_pvi === 2 || val.hio_info.is_customer_pay === 1)) { // đẩy vào hàng chờ
        return true
      } else if (val.product && val.status_payment === 1) { // status_payment === 1 đã thanh toán
        return true
      } else {
        return false
      }
    },
    checkInsuranceSendPVI(val) {
      if (val && val.length > 0) {
        const is_send_pvi = this.list_hio.filter(item => val.includes(item?.OptionsMoney.id))?.map(item => item.is_send_pvi)?.includes(2) // 2 là đang trờ
        if (is_send_pvi) return true
        return false
      } else {
        return false
      }
    },
    checkDisabled(val) {
      if (val.booked && val.booked.type_purchase !== null && +val.booked.type_purchase !== 0 && +val.booked.price_booking !== 0) { // && +val.booked.price_booking !== 0
        return true
      } else {
        return false
      }
    },
    async onSearchAgent(keyword) {
      const params = { keyword: keyword }
      this.loadingSearchAgent = true
      const { data } = await bookingPaxResource.searchAgentNew(params)
      const array = []
      if (data.length > 0) {
        this.loadingSearchAgent = false
        data.map(value => {
          const item = { label: `${value.name} - ${value.code_agent}`, value: value.id }
          array.push(item)
        })
        this.agentInsurance = [...array]
        console.log(this.agentInsurance)
      } else {
        this.agentInsurance = []
      }
    },
    onGetListPrices(params) {
      const query = { action: 1, facility_id: params.facility_id }
      bookingPaxResource.getListsPriceByHoleInsurance(query).then(response => {
        const results = response.data.data
        console.log(results)
        const filteredArr = results.reduce((acc, current) => {
          const x = acc.find(item => item.reward_value === current.reward_value)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        }, [])
        if (filteredArr.length > 0) {
          const array = []
          filteredArr.map(result => {
            const item = {
              label: `${result.text_display} - ${result.reward_value.toLocaleString()}`,
              value: result.id
            }
            array.push(item)
          })
          this.prices = [...array]
          this.optionPricePackage = array[0]
        }
      })
    },
    onGetListFacilities(keyword) {
      const params = { title: keyword }
      this.loadingSearchFacility = true
      bookingPaxResource.getFacilityCanBuyInsurance(params).then(response => {
        this.loadingSearchFacility = false
        console.log('asdasdasd', response)
        const results = response.data.data
        if (results.length > 0) {
          const array = []
          results.map(result => {
            const item = { label: result.sub_title, value: result.id, paths: result.paths }
            array.push(item)
          })
          this.facilitiesHIO = [...array]
        } else {
          this.facilitiesHIO = []
        }
      })
    },
    handleConvertDatePlayed(time) {
      function pad(s) {
        return (s < 10) ? '0' + s : s
      }

      return [pad(time.getFullYear()), pad(time.getMonth() + 1), pad(time.getDate())].join('-')
    },

    onGetPassport() {
      if (this.dataPassport.length > 0) {
        const arrayDataPassport = this.dataPassport
        this.listsPassports = [...arrayDataPassport]
        console.log('qqqqqqqqqqq', this.listsPassports)
        this.total_passport = this.listsPassports.length
        this.number_user = this.dataGolfers.length + this.listsPassports.length
      } else {
        this.listsPassports = []
        this.number_user = this.dataGolfers.length + this.listsPassports.length
      }
    },
    handleSetDataPassport(data) {
      this.dataPassport = [...data]
      this.onGetPassport()
    },

    onGetList() {
      if (this.dataGolfers.length > 0) {
        console.log('this,dataaaaaa', this.dataGolfers)
        console.log('this,qqqq', this.listQuery)

        const arrayData = this.dataGolfers.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
        this.listsGolfers = [...arrayData]
        const arrayGolferError = this.dataGolfersError
        this.listsGolferError = [...arrayGolferError]
        this.total_user = this.listsGolfers.length
        this.total = this.dataGolfers.length
        this.number_user = this.dataGolfers.length + this.listsPassports.length
      } else {
        this.listsGolfers = []
        this.total = 0
        this.number_user = this.dataGolfers.length + this.listsPassports.length
      }
    },
    onKeydownEnter() {
      if (this.golferByInsurances.length === 1) {
        const objectGolfer = this.golferByInsurances[0]
        this.postForm.user_id = objectGolfer.value
        if (this.dataGolfers.find(value => value.value === objectGolfer.value)) {
          this.$message.warning('Người chơi đã tồn tại trong danh sách!')
        } else {
          this.dataGolfers.push(objectGolfer)
          this.onGetList()
        }
      }
      this.$nextTick(() => {
        this.$refs.golfer.focus()
        this.golfers = []
      })
    },
    onChangeGolferCreate(event) {
      console.log('qưqqqqqqqqqq', event)
      if (event) {
        const objectGolfer = this.golferByInsurances.find(value => value.value === event)
        if (this.dataGolfers.find(value => value.value === event)) {
          this.$message.warning('Người chơi đã tồn tại trong danh sách!')
        } else {
          this.dataGolfers.push(objectGolfer)
          this.onGetList()
        }
      }
    },

    handleSearchGolfers(keyword, isHot = true) {
      const params = { keyword: keyword }
      bookingPaxResource.getGolferByIdInsurance(params).then(response => {
        if (response.data.error_code === 0) {
          const result = response.data.data
          // if (result.data.length > 0) {
          const array = []
          result.map(value => {
            let name = ''
            if (value.id_display) {
              name = `vID${value.id_display} - ${value.fullname} - ${value.nickname}`
            } else {
              name = `vID${value.id} - ${value.fullname} - ${value.nickname}`
            }
            const item = { value: value.id, label: name, golfer: value }
            array.push(item)
          })
          if (isHot) {
            this.golferByInsurances = [...array]
          } else {
            this.golfers = [...array]
          }
        }
        // }
      })
    },
    onRemoveGofer(golfer) {
      const indexRemove = this.dataGolfers.findIndex(item => item.value === golfer.value)
      this.dataGolfers.splice(indexRemove, 1)
      this.onGetList()
    },
    onRemovePassport(user) {
      const indexRemove = this.dataPassport.findIndex(item => item.passport === user.passport)
      this.dataPassport.splice(indexRemove, 1)
      this.onGetPassport()
    },
    listUserDEteleHioSendPVI(data) {
      const resultArray = []

      // Đối tượng dùng để theo dõi các user_id đã xử lý
      const processedUserIds = {}

      // Hàm để tìm kiếm đối tượng theo user_id trong mảng kết quả

      // Lặp qua mảng ban đầu
      data.forEach(item => {
        const userId = item.user_id

        // Nếu user_id đã được xử lý, thêm options_money_id và id vào các mảng tương ứng
        if (processedUserIds[userId]) {
          const existingUser = resultArray.find(user => user.id === userId)
          existingUser.insurance_pax.push(item.options_money_id)
          existingUser.insurance_id_pax.push(item.id)
        } else {
          // Nếu user_id chưa được xử lý, tạo đối tượng mới và thêm vào mảng kết quả
          const newUser = {
            user_id: userId,
            name_out_system: item?.User?.fullname,
            insurance_pax: [item.options_money_id],
            insurance_id_pax: [item.id],
            is_deleted: 1
          }
          resultArray.push(newUser)

          // Đánh dấu user_id đã được xử lý
          processedUserIds[userId] = true
        }
      })

      return resultArray
    },
    cancalReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    convertTimestampToDateTime, formatNumber
  }
}
</script>

<style lang="scss" scoped>
.is-lock {
  background: #bfc0c2;
}

.el-icon-lock {
  float: right;
  color: #ffff;
  margin-top: 10px
}

.dialog-add-golfer {
  .mb-10 {
    margin-bottom: 10px;
  }

  .clearfix-10 {
    height: 10px;
    clear: both;
  }

  .w-100 {
    width: 100%;
  }
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 10px;
}

.border-1 {
  border: 1px solid #ccc;
  border-radius: 15px;
}

.pb-10 {
  padding-bottom: 10px;
}

.p-10 {
  padding: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.table > tbody > tr > th {
  vertical-align: middle !important;
}

.vertical-middle {
  vertical-align: middle !important;
}
</style>
