<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row>
        <el-col :sm="24" :md="11">
          <el-form-item label="Provider">
            <el-form-item prop="provider_id">
              <el-select
                v-model="formRequest.provider_id"
                class="w-100"
                filterable
                remote
                clearable
                prop="provider_id"
                placeholder="Provider"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="provider in providerList"
                  :key="provider.id"
                  :label="provider.name"
                  :value="provider.id"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Tên voucher">
            <el-form-item prop="title">
              <el-input
                v-model="formRequest.title"
                prop="title"
                placeholder="Tên voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian bắt đầu có hiệu lực">
            <el-form-item prop="start_at">
              <el-date-picker
                v-model="formRequest.start_at"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                placeholder="Thời gian bắt đầu có hiệu lực"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Thời gian hết hiệu lực">
            <el-form-item prop="end_at">
              <el-date-picker
                v-model="formRequest.end_at"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                placeholder="Thời gian hết hiệu lực"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Loại hình khuyến mãi">
            <el-form-item prop="discount_type">
              <el-select
                v-model="formRequest.discount_type"
                class="w-100"
                filterable
                remote
                clearable
                prop="discount_type"
                placeholder="Loại hình khuyến mãi"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="discount_type in discountTypeList"
                  :key="discount_type.value"
                  :label="discount_type.label"
                  :value="discount_type.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.discount_type" :label="formRequest.discount_type == 2 ? 'Tỉ lệ khuyến mãi' : 'Số tiền'">
            <el-form-item prop="discount_amount">
              <el-input
                v-model="formRequest.discount_amount"
                prop="discount_amount"
                :placeholder="formRequest.discount_type == 2 ? 'Tỉ lệ khuyến mãi' : 'Số tiền'"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Giá bán của voucher">
            <el-form-item prop="price">
              <el-input
                v-model="formRequest.price"
                prop="price"
                placeholder="Giá bán của voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Hình thức phân phối">
            <el-form-item prop="allocation_type">
              <el-select
                v-model="formRequest.allocation_type"
                class="w-100"
                filterable
                remote
                clearable
                prop="allocation_type"
                placeholder="Hình thức phân phối"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="allocation in allocationList"
                  :key="allocation.value"
                  :label="allocation.label"
                  :value="allocation.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Loại voucher">
            <el-form-item prop="voucher_type">
              <el-select
                v-model="formRequest.voucher_type"
                class="w-100"
                filterable
                remote
                clearable
                placeholder="Loại voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="voucher in voucherList"
                  :key="voucher.value"
                  :label="voucher.label"
                  :value="voucher.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.voucher_type == 4" label="Danh sách sản phẩm quà tặng" required>
            <el-row class="data-table-content table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col" class="text-center" style="min-width: 180px">Provider</th>
                    <th scope="col" class="text-center" style="min-width: 180px">Mã code sản phẩm</th>
                    <th scope="col" class="text-center" style="min-width: 180px">Loại sản phẩm</th>
                    <th scope="col" class="text-center" style="min-width: 180px">Mô tả</th>
                    <th scope="col" class="text-center" style="min-width: 180px">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  <template>
                    <template v-for="(gift, key_gift) in formRequest.product_gifts">
                      <tr :key="key_gift">
                        <td class="text-center">
                          <el-select
                            v-model="formRequest.product_gifts[key_gift].provider_id"
                            class="w-100"
                            filterable
                            remote
                            clearable
                            prop="provider_id"
                            placeholder="Provider"
                            @keyup.enter.native="onSubmitForm('ruleForm')"
                          >
                            <el-option
                              v-for="provider in providerList"
                              :key="provider.id"
                              :label="provider.name"
                              :value="provider.id"
                            />
                          </el-select>
                        </td>
                        <td class="text-center">
                          <el-input
                            v-model="formRequest.product_gifts[key_gift].product_code"
                            placeholder="Mã code sản phẩm"
                          />
                        </td>
                        <td class="text-center">
                          <el-input
                            v-model="formRequest.product_gifts[key_gift].product_type"
                            placeholder="Loại sản phẩm"
                          />
                        </td>
                        <td class="text-center">
                          <el-input
                            v-model="formRequest.product_gifts[key_gift].desc"
                            placeholder="Mô tả"
                          />
                        </td>
                        <td class="text-center">
                          <el-button
                            style="margin-right: 10px"
                            size="small"
                            :title="`Xóa`"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            @click="deleteProductGifts(key_gift)"
                          />
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
              <el-row class="text-center">
                <el-button class="text-center" @click="addProductGifts">Thêm quà tặng</el-button>
              </el-row>
            </el-row>
          </el-form-item>
          <el-form-item label="Mã voucher">
            <el-form-item prop="code">
              <el-input
                v-model="formRequest.code"
                prop="code"
                placeholder="Mã voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Màn hình sử dụng">
            <el-form-item prop="screen">
              <el-select
                v-model="formRequest.screen"
                class="w-100"
                filterable
                remote
                clearable
                prop="screen"
                placeholder="Màn hình sử dụng"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="screen in screenList"
                  :key="screen.id"
                  :label="screen.screen"
                  :value="screen.screen"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Số lần sử dụng tối đa đối với một voucher">
            <el-form-item prop="max_use">
              <el-input
                v-model="formRequest.max_use"
                prop="max_use"
                placeholder="Số lần sử dụng tối đa đối với một voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Số lượng voucher phát hành">
            <el-form-item prop="quantity_releases">
              <el-input
                v-model="formRequest.quantity_releases"
                prop="quantity_releases"
                placeholder="Số lượng voucher phát hành"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Số tiền giới hạn khuyến mãi">
            <el-form-item prop="max_discount">
              <el-input
                v-model="formRequest.max_discount"
                prop="max_discount"
                placeholder="Số tiền giới hạn khuyến mãi"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label=" Danh sách user được tặng voucher">
            <el-form-item prop="max_discount">
              <el-col>
                <el-col v-if="listGolfers.length > 0">
                  <el-tag
                    v-for="(golfer, key) in listGolfers"
                    :key="key"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseTag(golfer)"
                  >
                    {{ `vID${golfer.user_id} - ` + golfer.name_out_system }}
                  </el-tag>
                </el-col>
              </el-col>
              <div class="mb-10" />
              <el-col>
                <el-row>
                  <el-select
                    v-model="golferModel"
                    class="w-100"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="Tìm kiếm mã vID"
                    :remote-method="onSearchGolfer"
                    :loading="loadingSearchUser"
                  >
                    <el-option v-for="user in users" :key="user.value" :label="`vID${user.value} - ${user.label}`" :value="user" />
                  </el-select>
                </el-row>
              </el-col>
            </el-form-item>
          </el-form-item>
          <el-form-item label="Danh sách điều kiện sử dụng voucher">
            <el-form-item prop="condition_list_select">
              <el-select
                v-model="condition_list_select"
                class="w-100 mb-10"
                filterable
                remote
                clearable
                multiple
                collapse-tags
                placeholder="Danh sách điều kiện sử dụng voucher"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="condition in conditionList"
                  :key="condition.value"
                  :label="condition.label"
                  :value="condition.value"
                />
              </el-select>
            </el-form-item>
            <hr>
            <div v-for="(condition, condition_key) in condition_list_select" :key="condition_key">
              <template v-if="condition == 1">
                <el-form-item class="mb-10">
                  <el-input
                    v-model="formRequest.condition_list[condition_key].max"
                    placeholder="Số điểm tối đa"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
                <el-form-item prop="Số điểm tối thiểu" class="mb-10">
                  <el-input
                    v-model="formRequest.condition_list[condition_key].min"
                    placeholder="Số điểm tối thiểu"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 2">
                <el-form-item class="mb-10">
                  <el-input
                    v-model="formRequest.condition_list[condition_key].min"
                    placeholder="Số tiền thanh toán tối thiểu"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 4">
                <el-row class="data-table-content table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" class="text-center" style="min-width: 180px">Provider</th>
                        <th scope="col" class="text-center" style="min-width: 180px">Mã code sản phẩm</th>
                        <th scope="col" class="text-center" style="min-width: 180px">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template>
                        <template v-for="(product, key_product) in formRequest.condition_list[condition_key].product_list">
                          <tr :key="key_product">
                            <td class="text-center">
                              <el-select
                                v-model="formRequest.condition_list[condition_key].product_list[key_product].provider_id"
                                class="w-100"
                                filterable
                                remote
                                clearable
                                placeholder="ID nhà cung cấp"
                                @keyup.enter.native="onSubmitForm('ruleForm')"
                              >
                                <el-option
                                  v-for="provider in providerList"
                                  :key="provider.id"
                                  :label="provider.name"
                                  :value="provider.id"
                                />
                              </el-select>
                            </td>
                            <td class="text-center">
                              <el-input
                                v-model="formRequest.condition_list[condition_key].product_list[key_product].product_code"
                                placeholder="Mã sản phẩm "
                              />
                            </td>
                            <td class="text-center">
                              <el-button
                                style="margin-right: 10px"
                                size="small"
                                :title="`Xóa`"
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                @click="deleteProductList(condition_key, key_product)"
                              />
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                  </table>
                  <el-row class="text-center">
                    <el-button class="text-center" @click="addProductList(condition_key)">Thêm sản phẩm</el-button>
                  </el-row>
                </el-row>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 5">
                <el-form-item class="mb-10">
                  <el-input
                    v-model="formRequest.condition_list[condition_key].min"
                    placeholder="Số người chơi tối thiểu"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 6">
                <el-select
                  v-model="formRequest.condition_list[condition_key].provider_list"
                  class="w-100"
                  filterable
                  multiple
                  remote
                  clearable
                  placeholder="Danh sách ID các nhà cung cấp được sử dụng voucher"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                >
                  <el-option
                    v-for="provider in providerList"
                    :key="provider.id"
                    :label="provider.name"
                    :value="provider.id"
                  />
                </el-select>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 7">
                <el-select
                  v-model="formRequest.condition_list[condition_key].rank_list"
                  class="w-100"
                  filterable
                  multiple
                  remote
                  clearable
                  placeholder="Danh sách ID các nhà cung cấp được sử dụng voucher"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                >
                  <el-option
                    v-for="rank in memberRankList"
                    :key="rank.value"
                    :label="rank.label"
                    :value="rank.value"
                  />
                </el-select>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 8">
                <el-form-item
                  label=" Giờ - phút bắt đầu"
                  class="mb-10"
                >
                  <el-form-item prop="start">
                    <el-time-picker
                      v-model="formRequest.condition_list[condition_key].start"
                      style="width: 100%;"
                      type="time"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder=" Giờ - phút bắt đầu"
                    />
                  </el-form-item>
                </el-form-item>
                <el-form-item label="Giờ - phút kết thúc" class="mb-10">
                  <el-form-item prop="end">
                    <el-time-picker
                      v-model="formRequest.condition_list[condition_key].end"
                      style="width: 100%;"
                      type="time"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="Giờ - phút kết thúc"
                    />
                  </el-form-item>
                </el-form-item>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 9">
                <el-select
                  v-model="formRequest.condition_list[condition_key].payment_method_list"
                  class="w-100"
                  filterable
                  multiple
                  remote
                  clearable
                  placeholder="Danh sách phương thức thanh toán"
                  @keyup.enter.native="onSubmitForm('ruleForm')"
                >
                  <el-option
                    v-for="payment_method in paymentMethodList"
                    :key="payment_method.value"
                    :label="payment_method.label"
                    :value="payment_method.label"
                  />
                </el-select>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
              <template v-if="condition == 10" class="mb-10">
                <el-form-item prop="bank_bin">
                  <el-select
                    v-model="formRequest.condition_list[condition_key].bank_bin"
                    class="w-100"
                    filterable
                    remote
                    clearable
                    placeholder="Mã bin của ngân hàng thanh toán"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  >
                    <el-option
                      v-for="bank_bin in listBankBin"
                      :key="bank_bin.value"
                      :label="bank_bin.label"
                      :value="bank_bin.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Điều kiện bắt buộc ?">
                  <el-radio-group v-model="formRequest.condition_list[condition_key].is_optional">
                    <el-radio border value="0" :label="0">Không</el-radio>
                    <el-radio border value="1" :label="1">Có </el-radio>
                  </el-radio-group>
                </el-form-item>
                <hr>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="Loại tự động thêm">
            <el-form-item prop="condition_add_voucher_auto_add_type">
              <el-select
                v-model="formRequest.condition_add_voucher.auto_add_type"
                class="w-100"
                filterable
                remote
                clearable
                placeholder="Loại tự động thêm"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="auto_add_type in autoAddTypeList"
                  :key="auto_add_type.value"
                  :label="auto_add_type.label"
                  :value="auto_add_type.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher && formRequest.condition_add_voucher.auto_add_type == 3 || formRequest.condition_add_voucher.auto_add_type == 4" required label="Thời gian bắt đầu của điều kiện">
            <el-form-item prop="condition_add_voucher_start_at">
              <el-date-picker
                v-model="formRequest.condition_add_voucher.start_at"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                placeholder="Thời gian bắt đầu của điều kiện"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher.auto_add_type == 3 || formRequest.condition_add_voucher.auto_add_type == 4" required label="Thời gian kết thúc của điều kiện">
            <el-form-item prop="condition_add_voucher_end_at">
              <el-date-picker
                v-model="formRequest.condition_add_voucher.end_at"
                style="width: 100%;"
                type="datetime"
                format="dd-MM-yyyy HH:mm:ss"
                placeholder="Thời gian kết thúc của điều kiện"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher.auto_add_type == 5" required label="Danh sách hạng hội viên được tặng">
            <el-form-item prop="condition_add_voucher_member_rank">
              <el-select
                v-model="formRequest.condition_add_voucher.member_rank"
                class="w-100"
                filterable
                remote
                clearable
                multiple
                collapse-tags
                placeholder="Danh sách hạng hội viên được tặng"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="member_rank in memberRankList"
                  :key="member_rank.value"
                  :label="member_rank.label"
                  :value="member_rank.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher.auto_add_type == 1" required label="Số tiền đơn hàng tối thiểu">
            <el-form-item prop="condition_add_voucher_min_bill">
              <el-input
                v-model="formRequest.condition_add_voucher.min_bill"
                prop="min_bill"
                placeholder="Số tiền đơn hàng tối thiểu"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher.auto_add_type == 3" required label="Số tiền chi tiêu tối thiểu">
            <el-form-item prop="condition_add_voucher_min_spent">
              <el-input
                v-model="formRequest.condition_add_voucher.min_spent"
                prop="min_spent"
                placeholder="Số tiền chi tiêu tối thiểu"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher.auto_add_type == 2" required label="Danh sách mã sản phẩm">
            <el-form-item prop="condition_add_voucher_products">
              <el-select
                v-model="formRequest.condition_add_voucher.products"
                class="w-100"
                filterable
                remote
                clearable
                multiple
                collapse-tags
                placeholder="Danh sách mã sản phẩm"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              >
                <el-option
                  v-for="product in productList"
                  :key="product.value"
                  :label="product.label"
                  :value="product.value"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="formRequest.condition_add_voucher.auto_add_type" label="Provider" required>
            <el-form-item prop="condition_add_voucher_provider_id">
              <el-select
                v-model="formRequest.condition_add_voucher.provider_id"
                class="w-100"
                filterable
                remote
                clearable
                placeholder="Provider"
              >
                <el-option
                  v-for="provider in providerList"
                  :key="provider.id"
                  :label="provider.name"
                  :value="provider.id"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="11" style="float: right;">
          <el-form-item label="Mô tả điều kiện sử dụng (Tiếng việt)">
            <el-form-item prop="condition_desc_vi">
              <el-input
                v-model="formRequest.condition_desc_vi"
                :rows="2"
                type="textarea"
                prop="condition_desc_vi"
                placeholder="Mô tả điều kiện sử dụng (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả điều kiện sử dụng (Tiếng anh)">
            <el-form-item prop="condition_desc_en">
              <el-input
                v-model="formRequest.condition_desc_en"
                :rows="2"
                type="textarea"
                prop="condition_desc_en"
                placeholder="Mô tả điều kiện sử dụng (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả phương thức thanh toán (Tiếng việt)">
            <el-form-item prop="payment_desc_vi">
              <el-input
                v-model="formRequest.payment_desc_vi"
                :rows="2"
                type="textarea"
                prop="payment_desc_vi"
                placeholder="Mô tả phương thức thanh toán (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả phương thức thanh toán (Tiếng anh)">
            <el-form-item prop="payment_desc_en">
              <el-input
                v-model="formRequest.payment_desc_en"
                :rows="2"
                type="textarea"
                prop="payment_desc_en"
                placeholder="Mô tả phương thức thanh toán (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chung (Tiếng việt)">
            <el-form-item prop="general_desc_vi">
              <el-input
                v-model="formRequest.general_desc_vi"
                :rows="2"
                type="textarea"
                prop="general_desc_vi"
                placeholder="Mô tả chung (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chung (Tiếng anh)">
            <el-form-item prop="general_desc_en">
              <el-input
                v-model="formRequest.general_desc_en"
                :rows="2"
                type="textarea"
                prop="general_desc_en"
                placeholder="Mô tả chung (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng việt)">
            <el-form-item prop="discount_desc_vi">
              <el-input
                v-model="formRequest.discount_desc_vi"
                :rows="2"
                type="textarea"
                prop="discount_desc_vi"
                placeholder="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng việt)"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng anh)">
            <el-form-item prop="discount_desc_en">
              <el-input
                v-model="formRequest.discount_desc_en"
                :rows="2"
                type="textarea"
                prop="discount_desc_en"
                placeholder="Mô tả chi tiết về chiết khấu, quà tặng (Tiếng anh)"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row></el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { validateDate, validateText, validateVoucherType, validateAllocationType, validateEndAt, validateConditionAddVoucher, validateCodeVoucher, validateTextArea } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import VoucherResource from '@/api/voucher/voucher'
import GolferResource from '@/api/golfer/golfer'
import { ARRAY_STATUS_VOUCHER, ARRAY_DISCOUNT_TYPE, ARRAY_ALLOCATION_TYPE, ARRAY_VOUCHER_TYPE, ARRAY_AUTO_ADD_TYPE, ARRAY_CONDITION } from '@/utils/constant'
import moment from 'moment'
import { getAcountInfo } from '@/utils/auth'
import { create_signature_hub } from '@/utils/create-signnature'

const voucherResource = new VoucherResource()
const golferResource = new GolferResource()
export default {
  name: 'DialogVoucher',
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
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      admins: [],
      bookes: [],
      rules: {
        provider_id: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.provider_id, callback, 'Provider'),
          trigger: 'change'
        }],
        title: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.title, callback, 'Tên voucher'),
          trigger: 'change'
        }],
        start_at: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.start_at, callback, 'Thời gian bắt đầu có hiệu lực'),
          trigger: 'change'
        }],
        end_at: [{
          validator: (rule, _, callback) => validateEndAt(rule, this.formRequest.start_at, this.formRequest.end_at, callback, 'Thời gian hết hiệu lực'),
          trigger: 'change'
        }],
        discount_type: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.discount_type, callback, 'Loại hình khuyến mãi'),
          trigger: 'change'
        }],
        code: [{
          validator: (rule, _, callback) => validateCodeVoucher(rule, this.formRequest.code, callback, 'Mã voucher'),
          trigger: 'change'
        }],
        screen: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.screen, callback, 'Màn hình sử dụng'),
          trigger: 'change'
        }],
        voucher_type: [{
          validator: (rule, _, callback) => validateVoucherType(rule, this.formRequest.discount_type, this.formRequest.voucher_type, callback, 'Loại voucher'),
          trigger: 'change'
        }],
        condition_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.condition_desc_vi, callback, 'Mô tả điều kiện sử dụng (Tiếng việt)'),
          trigger: 'change'
        }],
        condition_desc_en: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.condition_desc_en, callback, 'Mô tả điều kiện sử dụng (Tiếng anh)'),
          trigger: 'change'
        }],
        payment_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.payment_desc_vi, callback, 'Mô tả phương thức thanh toán (Tiếng việt)'),
          trigger: 'change'
        }],
        payment_desc_en: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.payment_desc_en, callback, 'Mô tả phương thức thanh toán (Tiếng anh)'),
          trigger: 'change'
        }],
        general_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.general_desc_vi, callback, 'Mô tả chung (Tiếng việt)'),
          trigger: 'change'
        }],
        general_desc_en: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.general_desc_en, callback, 'Mô tả chung (Tiếng anh)'),
          trigger: 'change'
        }],
        discount_desc_vi: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.discount_desc_vi, callback, 'Mô tả chi tiết về chiết khấu, quà tặng (Tiếng việt)'),
          trigger: 'change'
        }],
        discount_desc_en: [{
          validator: (rule, _, callback) => validateTextArea(rule, this.formRequest.discount_desc_en, callback, 'Mô tả chi tiết về chiết khấu, quà tặng (Tiếng anh)'),
          trigger: 'change'
        }],
        allocation_type: [{
          validator: (rule, _, callback) => validateAllocationType(rule, this.formRequest.allocation_type, this.formRequest.price, callback, 'Hình thức phân phối', 1), trigger: 'change'
        }],
        price: [{
          validator: (rule, _, callback) => validateAllocationType(rule, this.formRequest.allocation_type, this.formRequest.price, callback, 'Giá bán'), trigger: 'change'
        }],
        condition_add_voucher_auto_add_type: [{
          validator: (rule, _, callback) => validateConditionAddVoucher(rule, this.formRequest.condition_add_voucher.auto_add_type, this.formRequest.allocation_type, callback, 'Loại tự động thêm'), trigger: 'change'
        }],
        condition_add_voucher_start_at: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.condition_add_voucher.start_at, callback, 'Thời gian bắt đầu'), trigger: 'change'
        }],
        condition_add_voucher_end_at: [{
          validator: (rule, _, callback) => validateDate(rule, this.formRequest.condition_add_voucher.end_at, callback, 'Thời gian kết thúc'), trigger: 'change'
        }],
        condition_add_voucher_member_rank: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.condition_add_voucher.member_rank, callback, 'Danh sách hạng hội viên được tặng'), trigger: 'change'
        }],
        condition_add_voucher_min_bill: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.condition_add_voucher.min_bill, callback, 'Số tiền đơn hàng tối thiểu'), trigger: 'change'
        }],
        condition_add_voucher_min_spent: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.condition_add_voucher.min_spent, callback, 'Số tiền chi tiêu tối thiểu'), trigger: 'change'
        }],
        condition_add_voucher_products: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.condition_add_voucher.products, callback, 'Danh sách mã sản phẩm'), trigger: 'change'
        }],
        condition_add_voucher_provider_id: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.condition_add_voucher.provider_id, callback, 'Nhà cung cấp'), trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        product_gifts: [],
        condition_add_voucher: {},
        condition_list: []
      },
      request: {},
      query: {
        limit: 10,
        page: 1
      },
      is_clear: 0,
      codeBookings: [],
      bookingListQuery: [],
      inputValue: '',
      loadingSearchCodeBooking: false,
      dialog: { titleName: 'Thêm mới voucher', buttonName: 'Thêm mới' },
      adminData: [],
      loadingSearchAdmin: false,
      check_list: [],
      isEmpty: false,
      checkAll: false,
      providerList: [],
      discountTypeList: ARRAY_DISCOUNT_TYPE,
      statusList: ARRAY_STATUS_VOUCHER,
      allocationList: ARRAY_ALLOCATION_TYPE,
      voucherList: ARRAY_VOUCHER_TYPE,
      autoAddTypeList: ARRAY_AUTO_ADD_TYPE,
      memberRankList: [
        { value: 1, label: 'Hạng hội viên 1' },
        { value: 2, label: 'Hạng hội viên 2' },
        { value: 3, label: 'Hạng hội viên 3' }
      ],
      paymentMethodList: [
        { value: 1, label: 'bank' },
        { value: 2, label: 'Thanh toán trực tiếp' },
        { value: 3, label: 'Thanh toán qua App' }
      ],
      productList: [{ value: 1, label: 'product 1' }],
      screenList: [],
      listBankBin: [],
      listGolfers: [],
      users: [],
      golferModel: {},
      loadingSearchUser: false,
      isIndeterminate: true,
      conditionList: ARRAY_CONDITION,
      condition_list_select: []
    }
  },
  watch: {
    objectData(value) {
      if (value) {
        console.log('value', value)
        this.providerList = value.providerList
        console.log('this.providerList', this.providerList)
      }
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'Thêm mới voucher', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'Cập nhật voucher', buttonName: 'Cập nhật' })
      }
    },
    async golferModel(value) {
      if (value && Object.keys(this.golferModel).length !== 0) {
        const checkExist = this.listGolfers.filter(item => item.user_id === value.value)
        if (checkExist.length > 0) {
          this.$message.warning('vID đã được chọn.')
          return
        }
        const golfer = {
          user_id: value.value,
          name_out_system: value.label,
          phone: value.phone,
          agency_id: null,
          surcharge_facility_id: [],
          cccd: ''
        }
        this.listGolfers.push(golfer)
      }
    },
    condition_list_select(value) {
      if (value) {
        console.log('value.........................', value)
        this.formRequest.condition_list = []
        for (let i = 0; i < value.length; i++) {
          if (value[i] === (1)) {
            this.formRequest.condition_list.push({ condition_type: 1, max: '', min: '', is_optional: 0 })
          }
          if (value[i] === (2)) {
            this.formRequest.condition_list.push({ condition_type: 2, min: '', is_optional: 0 })
          }
          if (value[i] === (4)) {
            this.formRequest.condition_list.push({ condition_type: 4, product_list: [], is_optional: 1 })
          }
          if (value[i] === (5)) {
            this.formRequest.condition_list.push({ condition_type: 5, min: '', is_optional: 1 })
          }
          if (value[i] === (6)) {
            this.formRequest.condition_list.push({ condition_type: 6, provider_list: [], is_optional: 0 })
          }
          if (value[i] === (7)) {
            this.formRequest.condition_list.push({ condition_type: 7, rank_list: [], is_optional: 1 })
          }
          if (value[i] === (8)) {
            this.formRequest.condition_list.push({ condition_type: 8, end: '', start: '', is_optional: 1 })
          }
          if (value[i] === (9)) {
            this.formRequest.condition_list.push({ condition_type: 9, payment_method_list: [], is_optional: 0 })
          }
          if (value[i] === (10)) {
            this.formRequest.condition_list.push({ condition_type: 10, bank_bin: '', is_optional: 0 })
            if (this.listBankBin.length === 0) {
              this.onGetListBankPin()
              console.log('onGetListBankPin.........', this.listBankBin)
            }
          }
        }
      }
    }
  },
  created() {
    this.onGetListScreen()
  },
  methods: {
    handleCloseTag(golfer) {
      this.listGolfers.splice(this.listGolfers.indexOf(golfer), 1)
    },
    onGetListScreen() {
      voucherResource.get_screen_using().then(res => {
        const { error_code, data } = res
        console.log('get_screen_using.......', data)
        if (error_code === 0) {
          this.screenList = data
        } else {
          this.$message.error('Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật')
        }
      }).catch(_ => {
      })
    },
    onGetListBankPin() {
      voucherResource.get_list_bank().then(res => {
        const { code, data } = res
        console.log('get_screen_using.......', data)
        if (code === '00') {
          this.listBankBin = data.map((item) => ({ value: item.bin, label: item.shortName }))
        } else {
          this.$message.error('Không lấy được dánh sách mã bin')
        }
      }).catch(_ => {
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
    onSubmitForm(formName) {
      this.$refs[formName].validate((validate) => {
        if (validate) {
          this.appendForm()
          if (this.isAdd) this.handleSubmitAdd()
        }
      })
    },
    async handleSubmitAdd() {
      console.log('this.request.................................', this.request)
      console.log('product_gifts.................................', this.request.product_gifts)
      this.formRequest.admin_id = getAcountInfo().id
      this.formRequest.signature = '123'
      if (this.listGolfers.length > 0) {
        if (this.formRequest.allocation_type !== 2) {
          this.$message.error('Thêm voucher cho người khác chỉ áp dụng cho voucher hình thức phân phối CMS')
          return
        }
        this.formRequest.user_list = this.listGolfers.map((item) => item.user_id)
      }
      this.formRequest.start_at = moment(this.formRequest.start_at).unix() * 1000
      this.formRequest.end_at = moment(this.formRequest.end_at).unix() * 1000

      const signature = await this.create_signature_hub(this.formRequest)
      this.formRequest = { ...this.formRequest, signature }

      voucherResource.create_new_voucher(this.formRequest).then(res => {
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Thêm mới thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      }).finally(() => {
        this.loadingSubmit = false
      })
    },
    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {
          product_gifts: [],
          condition_add_voucher: {}
        },
        this.condition_list_select = [],
        this.users = [],
        this.golferModel = {},
        this.listGolfers = []
      )
      this.$refs['ruleForm'].clearValidate()
    },
    handleClose() {
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
    },
    appendForm() {
      const formData = new FormData()
      const formRequest = this.formRequest
      Object.keys(formRequest).forEach(function(key) {
        formData.append(key, formRequest[key])
      })
      this.request = formData
    },
    addProductGifts() {
      this.formRequest.product_gifts.push({ provider_id: '', product_code: '', product_type: null, desc: '' })
    },
    deleteProductGifts(index) {
      console.log('index', index)
      this.formRequest.product_gifts.splice(index, 1)
    },
    addProductList(condition_index) {
      this.formRequest.condition_list[condition_index].product_list.push({ provider_id: '', product_code: '' })
    },
    deleteProductList(condition_index, product_index) {
      console.log('product_index', product_index)
      this.formRequest.condition_list[condition_index].product_list.splice(product_index, 1)
    },
    formatNumber,
    create_signature_hub
    // onInputPrice(value) {
    //   if (value) {
    //     this.formRequest['amount_money'] = value.toString().replaceAll('.', '')
    //     this.price = this.formatNumber(value)
    //   }
    // },
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.input-amount{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  padding: 0 10px;
}
.input-amount::placeholder{
  color: #606266;
}
.input-amount:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
