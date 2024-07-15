<template>
  <el-dialog
    :title="dialog.titleName"
    :visible.sync="showDialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
    fullscreen
  >
    <el-form ref="ruleForm" v-loading="dialogLoading" :rules="rules" :model="objectData" class="demo-ruleForm">
      <el-row
        style="display: flex; align-items: center; justify-content: space-around;"
      >
        <el-col :sm="8">
          <el-form-item label="Thời gian kích hoạt">
            <el-form-item prop="time_active">
              <el-date-picker
                v-model="dateRange"
                class="w-100"
                style="width: 100%;"
                format="dd-MM-yyyy HH:mm:ss"
                type="datetimerange"
                range-separator="To"
                start-placeholder="BĐ ngày kích hoạt"
                end-placeholder="KT ngày kích hoạt"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col v-if="isAdd" :sm="4">
          <el-form-item label="Tên gói">
            <el-form-item prop="name_pack">
              <el-input
                v-model="formRequest.name_pack"
                placeholder="Tên gói"
                @keyup.enter.native="onSubmitForm('ruleForm')"
              />
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col v-if="isAdd" :sm="4">
          <el-form-item label="Chọn sân">
            <el-form-item prop="facility_id">
              <search-facility :clear-data="clearFacility" @selection-changed-facility="handleSelectionChanged" />
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex; justify-content: space-between;">

        <!-- Buổi sáng -->

        <el-col v-if="isAdd" :sm="24" :offset="1" :md="7" class="px-10">
          <div class="card-header" style="text-align: center;">
            <el-select
              v-model="formRequest.is_sell_morning"
              filterable
              remote
            >
              <el-option value="" label="Không bán">Không bán</el-option>
              <el-option value="1" label="Buổi sáng">Buổi sáng</el-option>
            </el-select>
          </div>
          <div class="p-10">
            <el-form-item label="Thời gian bắt đầu ">
              <el-form-item prop="start_morning">
                <el-time-picker
                  v-model="formRequest.start_morning"
                  style="width: 100%;"
                  type="time"
                  format="HH:mm:ss"
                  placeholder="Thời gian bắt đầu"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Thời gian kết thúc">
              <el-form-item prop="end_morning">
                <el-time-picker
                  v-model="formRequest.end_morning"
                  style="width: 100%;"
                  type="time"
                  format="HH:mm:ss"
                  placeholder="Thời gian kết thúc"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Thời gian chênh lệch giữa các teetime">
              <el-form-item prop="diff_morning">
                <el-select
                  v-model="formRequest.diff_morning"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Thời gian chênh lệch giữa các teetime"
                >
                  <el-option
                    v-for="diff in diffTimeList"
                    :key="diff.value"
                    :label="diff.label"
                    :value="diff.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Số lượng golfer tối đa">
              <el-form-item prop="max_golfer_morning">
                <el-select
                  v-model="formRequest.max_golfer_morning"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Số lượng golfer tối đa"
                >
                  <el-option
                    v-for="max in maxGolferList"
                    :key="max.value"
                    :label="max.label"
                    :value="max.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <!-- 9 hố -->
            <el-form-item label="Bán lẻ 9 hố">
              <el-form-item prop="type_child_pack_morning_9">
                <el-select
                  v-model="formRequest.type_child_pack_morning.number_hole_9"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Bán lẻ 9 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="9" label="9 Hố">9 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_morning.number_hole_9" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_morning_9">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_morning.number_hole_9"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_morning_9">
                  <el-select
                    v-model="formRequest.eat_child_pack_morning.number_hole_9"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_morning_9">
                  <el-select
                    v-model="formRequest.car_child_pack_morning.number_hole_9"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
            <!-- 18 hố -->
            <el-form-item label="Bán lẻ 18 hố">
              <el-form-item prop="type_child_pack_morning_18">
                <el-select
                  v-model="formRequest.type_child_pack_morning.number_hole_18"
                  class="w-100"
                  filterable
                  remote
                  placeholder="Bán lẻ 18 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="18" label="18 Hố">18 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_morning.number_hole_18" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_morning_18">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_morning.number_hole_18"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_morning_18">
                  <el-select
                    v-model="formRequest.eat_child_pack_morning.number_hole_18"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_morning_18">
                  <el-select
                    v-model="formRequest.car_child_pack_morning.number_hole_18"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Giá bán Hio 100(nếu có)">
                <el-form-item prop="hio_100_child_pack_morning">
                  <el-input
                    v-model="formRequest.hio_100_child_pack_morning"
                    placeholder="Giá bán Hio 100(nếu có)"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Giá bán Hio 200(nếu có)">
                <el-form-item prop="hio_200_child_pack_morning">
                  <el-input
                    v-model="formRequest.hio_200_child_pack_morning"
                    placeholder="Giá bán Hio 200(nếu có)"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
            </div>
            <!-- 27 hố -->
            <el-form-item label="Bán lẻ 27 hố">
              <el-form-item prop="type_child_pack_morning_27">
                <el-select
                  v-model="formRequest.type_child_pack_morning.number_hole_27"
                  class="w-100"
                  filterable
                  remote
                  placeholder="Bán lẻ 27 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="27" label="27 Hố">27 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_morning.number_hole_27" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_morning_27">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_morning.number_hole_27"
                    prop="quantity_release"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_morning_27">
                  <el-select
                    v-model="formRequest.eat_child_pack_morning.number_hole_27"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_morning_27">
                  <el-select
                    v-model="formRequest.car_child_pack_morning.number_hole_27"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </el-col>

        <!-- Buổi chiều -->

        <el-col v-if="isAdd" :sm="24" :md="7" class="px-10">
          <div class="card-header" style="text-align: center;">
            <el-select
              v-model="formRequest.is_sell_afternoon"
              filterable
              remote
            >
              <el-option value="" label="Không bán">Không bán</el-option>
              <el-option value="1" label="Buổi chiều">Buổi chiều</el-option>
            </el-select>
          </div>
          <div class="p-10">
            <el-form-item label="Thời gian bắt đầu ">
              <el-form-item prop="start_afternoon">
                <el-time-picker
                  v-model="formRequest.start_afternoon"
                  style="width: 100%;"
                  type="time"
                  format="HH:mm:ss"
                  placeholder="Thời gian bắt đầu"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Thời gian kết thúc">
              <el-form-item prop="end_afternoon">
                <el-time-picker
                  v-model="formRequest.end_afternoon"
                  style="width: 100%;"
                  type="time"
                  format="HH:mm:ss"
                  placeholder="Thời gian kết thúc"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Thời gian chênh lệch giữa các teetime">
              <el-form-item prop="diff_afternoon">
                <el-select
                  v-model="formRequest.diff_afternoon"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Thời gian chênh lệch giữa các teetime"
                >
                  <el-option
                    v-for="diff in diffTimeList"
                    :key="diff.value"
                    :label="diff.label"
                    :value="diff.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Số lượng golfer tối đa">
              <el-form-item prop="max_golfer_afternoon">
                <el-select
                  v-model="formRequest.max_golfer_afternoon"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Số lượng golfer tối đa"
                >
                  <el-option
                    v-for="max in maxGolferList"
                    :key="max.value"
                    :label="max.label"
                    :value="max.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <!-- 9 hố -->
            <el-form-item label="Bán lẻ 9 hố">
              <el-form-item prop="type_child_pack_afternoon_9">
                <el-select
                  v-model="formRequest.type_child_pack_afternoon.number_hole_9"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Bán lẻ 9 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="9" label="9 Hố">9 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_afternoon.number_hole_9" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_afternoon_9">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_afternoon.number_hole_9"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_afternoon_9">
                  <el-select
                    v-model="formRequest.eat_child_pack_afternoon.number_hole_9"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_afternoon_9">
                  <el-select
                    v-model="formRequest.car_child_pack_afternoon.number_hole_9"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
            <!-- 18 hố -->
            <el-form-item label="Bán lẻ 18 hố">
              <el-form-item prop="type_child_pack_afternoon_18">
                <el-select
                  v-model="formRequest.type_child_pack_afternoon.number_hole_18"
                  class="w-100"
                  filterable
                  remote
                  placeholder="Bán lẻ 18 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="18" label="18 Hố">18 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_afternoon.number_hole_18" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_afternoon_18">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_afternoon.number_hole_18"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_afternoon_18">
                  <el-select
                    v-model="formRequest.eat_child_pack_afternoon.number_hole_18"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_afternoon_18">
                  <el-select
                    v-model="formRequest.car_child_pack_afternoon.number_hole_18"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Giá bán Hio 100(nếu có)">
                <el-form-item prop="hio_100_child_pack_afternoon">
                  <el-input
                    v-model="formRequest.hio_100_child_pack_afternoon"
                    placeholder="Giá bán Hio 100(nếu có)"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Giá bán Hio 200(nếu có)">
                <el-form-item prop="hio_200_child_pack_afternoon">
                  <el-input
                    v-model="formRequest.hio_200_child_pack_afternoon"
                    placeholder="Giá bán Hio 200(nếu có)"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
            </div>
            <!-- 27 hố -->
            <el-form-item label="Bán lẻ 27 hố">
              <el-form-item prop="type_child_pack_afternoon_27">
                <el-select
                  v-model="formRequest.type_child_pack_afternoon.number_hole_27"
                  class="w-100"
                  filterable
                  remote
                  placeholder="Bán lẻ 27 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="27" label="27 Hố">27 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_afternoon.number_hole_27" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_afternoon_27">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_afternoon.number_hole_27"
                    prop="quantity_release"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_afternoon_27">
                  <el-select
                    v-model="formRequest.eat_child_pack_afternoon.number_hole_27"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_afternoon_27">
                  <el-select
                    v-model="formRequest.car_child_pack_afternoon.number_hole_27"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </el-col>

        <!-- Buổi tối -->

        <el-col v-if="isAdd" :sm="24" :md="7" class="px-10">
          <div class="card-header" style="text-align: center;">
            <el-select
              v-model="formRequest.is_sell_evening"
              filterable
              remote
            >
              <el-option value="" label="Không bán">Không bán</el-option>
              <el-option value="1" label="Buổi tối">Buổi tối</el-option>
            </el-select>
          </div>
          <div class="p-10">
            <el-form-item label="Thời gian bắt đầu ">
              <el-form-item prop="start_evening">
                <el-time-picker
                  v-model="formRequest.start_evening"
                  style="width: 100%;"
                  type="time"
                  format="HH:mm:ss"
                  placeholder="Thời gian bắt đầu"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Thời gian kết thúc">
              <el-form-item prop="end_evening">
                <el-time-picker
                  v-model="formRequest.end_evening"
                  style="width: 100%;"
                  type="time"
                  format="HH:mm:ss"
                  placeholder="Thời gian kết thúc"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="Thời gian chênh lệch giữa các teetime">
              <el-form-item prop="diff_evening">
                <el-select
                  v-model="formRequest.diff_evening"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Thời gian chênh lệch giữa các teetime"
                >
                  <el-option
                    v-for="diff in diffTimeList"
                    :key="diff.value"
                    :label="diff.label"
                    :value="diff.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Số lượng golfer tối đa">
              <el-form-item prop="max_golfer_evening">
                <el-select
                  v-model="formRequest.max_golfer_evening"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Số lượng golfer tối đa"
                >
                  <el-option
                    v-for="max in maxGolferList"
                    :key="max.value"
                    :label="max.label"
                    :value="max.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <!-- 9 hố -->
            <el-form-item label="Bán lẻ 9 hố">
              <el-form-item prop="type_child_pack_evening_9">
                <el-select
                  v-model="formRequest.type_child_pack_evening.number_hole_9"
                  class="w-100"
                  filterable
                  remote

                  placeholder="Bán lẻ 9 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="9" label="9 Hố">9 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_evening.number_hole_9" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_evening_9">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_evening.number_hole_9"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_evening_9">
                  <el-select
                    v-model="formRequest.eat_child_pack_evening.number_hole_9"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_evening_9">
                  <el-select
                    v-model="formRequest.car_child_pack_evening.number_hole_9"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
            <!-- 18 hố -->
            <el-form-item label="Bán lẻ 18 hố">
              <el-form-item prop="type_child_pack_evening_18">
                <el-select
                  v-model="formRequest.type_child_pack_evening.number_hole_18"
                  class="w-100"
                  filterable
                  remote
                  placeholder="Bán lẻ 18 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="18" label="18 Hố">18 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_evening.number_hole_18" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_evening_18">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_evening.number_hole_18"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_evening_18">
                  <el-select
                    v-model="formRequest.eat_child_pack_evening.number_hole_18"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_evening_18">
                  <el-select
                    v-model="formRequest.car_child_pack_evening.number_hole_18"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Giá bán Hio 100(nếu có)">
                <el-form-item prop="hio_100_child_pack_evening">
                  <el-input
                    v-model="formRequest.hio_100_child_pack_evening"
                    placeholder="Giá bán Hio 100(nếu có)"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Giá bán Hio 200(nếu có)">
                <el-form-item prop="hio_200_child_pack_evening">
                  <el-input
                    v-model="formRequest.hio_200_child_pack_evening"
                    placeholder="Giá bán Hio 200(nếu có)"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
            </div>
            <!-- 27 hố -->
            <el-form-item label="Bán lẻ 27 hố">
              <el-form-item prop="type_child_pack_evening_27">
                <el-select
                  v-model="formRequest.type_child_pack_evening.number_hole_27"
                  class="w-100"
                  filterable
                  remote
                  placeholder="Bán lẻ 27 hố"
                >
                  <el-option value="" label="Không bán">Không bán</el-option>
                  <el-option value="27" label="27 Hố">27 Hố</el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <div v-if="formRequest.type_child_pack_evening.number_hole_27" style="padding: 0 20px;">
              <el-form-item label="Giá bán ngày thường">
                <el-form-item prop="normal_cost_child_pack_evening_27">
                  <el-input
                    v-model="formRequest.normal_cost_child_pack_evening.number_hole_27"
                    prop="quantity_release"
                    placeholder="Giá bán ngày thường"
                    @keyup.enter.native="onSubmitForm('ruleForm')"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item label="Ăn nhẹ">
                <el-form-item prop="eat_child_pack_evening_27">
                  <el-select
                    v-model="formRequest.eat_child_pack_evening.number_hole_27"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Ăn nhẹ"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item label="Xe điện">
                <el-form-item prop="car_child_pack_evening_27">
                  <el-select
                    v-model="formRequest.car_child_pack_evening.number_hole_27"
                    class="w-100"
                    filterable
                    remote
                    placeholder="Xe điện"
                  >
                    <el-option
                      v-for="op in optionList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>

      <div style="display: flex;">
        <el-button type="primary" class="mt-10 mb-20 mr-10" @click="handleAddPrice">+ Thêm giá theo đại lý</el-button>
        <el-upload ref="upload" class="mt-10 mb-20 mr-10" action="uploadURL" :on-change="handleImportPrice" :auto-upload="false" :limit="1">
          <el-button type="info">Import</el-button>
        </el-upload>
        <el-button type="warning" class="mt-10 mb-20" @click="DownLoadFileEx">File mẫu</el-button>
        <el-button :loading="loadingFileAgency" type="warning" class="mt-10 mb-20" @click="DownloadFileAgency">File đại lý</el-button>

      </div>
      <el-row style="display: flex; justify-content: space-between;">
        <el-row v-if="listPriceByAgent.length > 0" class="data-table-content table-responsive">
          <el-table
            :data="listPriceByAgent"
            width="100%"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
              prop="type_tee"
              label="Tee"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.type_tee" class="w-100" placeholder="Chọn Tee">
                  <el-option
                    v-for="item in listTee"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="Đại lý"
            >
              <template slot-scope="{row}">
                <el-select
                  v-model="row.agency_id"
                  class="w-100"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Tìm kiếm đại lý"
                >
                  <el-option v-for="agency in agencies" :key="agency.value" :label="agency.label" :value="agency.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="normal_price"
              label="Giá"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.normal_price" placeholder="Nhập giá" />
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
                  @click="deleteAgent(scope.$index, scope.row)"
                >
                  Xoá
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="onSubmitForm('ruleForm')">{{
        dialog.buttonName
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { isEmpty, validateDate, validateText, validateTextAndCondition, validateEndAtAndCondition } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import PackageTeeResource from '@/api/package-tee/index'
import { trim_string_object } from '@/utils/trim-string-object'
import moment from 'moment'
import SearchFacility from '@/views/component/SearchFacility.vue'
import AgencyResource from '@/api/agency/agency'
import * as XLSX from 'xlsx'
import { Message } from 'element-ui'

const agencyResource = new AgencyResource()
// const searchResource = new SearchResource()
const packageTeeResource = new PackageTeeResource()

export default {
  name: 'DialogPackageTeetime',
  components: {
    SearchFacility
  },
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
      loadingFileAgency: false,
      rules: {
        time_active: [{
          validator: (rule, _, callback) => validateDate(rule, this.dateRange, callback, 'Thời gian kích hoạt'),
          trigger: 'change'
        }],
        name_pack: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.name_pack, callback, 'Tên gói'),
          trigger: 'change'
        }],
        facility_id: [{
          validator: (rule, _, callback) => validateText(rule, this.formRequest.facility_id, callback, 'Sân'),
          trigger: 'change'
        }],
        start_morning: [{
          validator: (rule, _, callback) => validateEndAtAndCondition(rule, this.formRequest.start_morning, this.formRequest.end_morning, callback, 'Thời gian bắt đầu buổi sáng', this.formRequest.is_sell_morning),
          trigger: 'change'
        }],
        end_morning: [{
          validator: (rule, _, callback) => validateEndAtAndCondition(rule, this.formRequest.end_morning, this.formRequest.end_morning, callback, 'Thời gian kết thúc buổi sáng', this.formRequest.is_sell_morning),
          trigger: 'change'
        }],
        diff_morning: [{
          validator: (rule, _, callback) => validateTextAndCondition(rule, this.formRequest.diff_morning, callback, 'Thời gian chênh lệch giữa các teetime buổi sáng', this.formRequest.is_sell_morning),
          trigger: 'change'
        }],
        start_afternoon: [{
          validator: (rule, _, callback) => validateEndAtAndCondition(rule, this.formRequest.start_afternoon, this.formRequest.end_afternoon, callback, 'Thời gian bắt đầu buổi chiều', this.formRequest.is_sell_afternoon),
          trigger: 'change'
        }],
        end_afternoon: [{
          validator: (rule, _, callback) => validateEndAtAndCondition(rule, this.formRequest.start_afternoon, this.formRequest.end_afternoon, callback, 'Thời gian kết thúc buổi chiều', this.formRequest.is_sell_afternoon),
          trigger: 'change'
        }],
        diff_afternoon: [{
          validator: (rule, _, callback) => validateTextAndCondition(rule, this.formRequest.diff_afternoon, callback, 'Thời gian chênh lệch giữa các teetime buổi chiều', this.formRequest.is_sell_afternoon),
          trigger: 'change'
        }],
        start_evening: [{
          validator: (rule, _, callback) => validateEndAtAndCondition(rule, this.formRequest.start_evening, this.formRequest.end_evening, callback, 'Thời gian bắt đầu buổi tối', this.formRequest.is_sell_evening),
          trigger: 'change'
        }],
        end_evening: [{
          validator: (rule, _, callback) => validateEndAtAndCondition(rule, this.formRequest.end_evening, this.formRequest.end_evening, callback, 'Thời gian kết thúc buổi tối', this.formRequest.is_sell_evening),
          trigger: 'change'
        }],
        diff_evening: [{
          validator: (rule, _, callback) => validateTextAndCondition(rule, this.formRequest.diff_evening, callback, 'Thời gian chênh lệch giữa các teetime buổi tối', this.formRequest.is_sell_evening),
          trigger: 'change'
        }]
      },
      loadingSubmit: false,
      dialogLoading: false,
      formRequest: {
        max_golfer_morning: 20,
        type_child_pack_morning: {
          number_hole_9: '',
          number_hole_18: '',
          number_hole_27: ''
        },
        normal_cost_child_pack_morning: {
          number_hole_9: '',
          number_hole_18: '',
          number_hole_27: ''
        },
        eat_child_pack_morning: {
          number_hole_9: '1',
          number_hole_18: '1',
          number_hole_27: '1'
        },
        car_child_pack_morning: {
          number_hole_9: '1',
          number_hole_18: '1',
          number_hole_27: '1'
        },

        max_golfer_afternoon: 20,
        type_child_pack_afternoon: {
          number_hole_9: '',
          number_hole_18: '',
          number_hole_27: ''
        },
        normal_cost_child_pack_afternoon: {
          number_hole_9: '',
          number_hole_18: '',
          number_hole_27: ''
        },
        eat_child_pack_afternoon: {
          number_hole_9: '1',
          number_hole_18: '1',
          number_hole_27: '1'
        },
        car_child_pack_afternoon: {
          number_hole_9: '1',
          number_hole_18: '1',
          number_hole_27: '1'
        },

        max_golfer_evening: 20,
        type_child_pack_evening: {
          number_hole_9: '',
          number_hole_18: '',
          number_hole_27: ''
        },
        normal_cost_child_pack_evening: {
          number_hole_9: '',
          number_hole_18: '',
          number_hole_27: ''
        },
        eat_child_pack_evening: {
          number_hole_9: '1',
          number_hole_18: '1',
          number_hole_27: '1'
        },
        car_child_pack_evening: {
          number_hole_9: '1',
          number_hole_18: '1',
          number_hole_27: '1'
        }
      },
      request: {},
      dialog: { titleName: 'THIẾT LẬP GIỜ VÀ GIÁ TEETIME', buttonName: 'Thêm mới' },
      diffTimeList: [
        { value: 7, label: '7 phút' },
        { value: 8, label: '8 phút' },
        { value: 9, label: '9 phút' },
        { value: 10, label: '10 phút' },
        { value: 11, label: '11 phút' },
        { value: 12, label: '12 phút' },
        { value: 13, label: '13 phút' },
        { value: 14, label: '14 phút' },
        { value: 15, label: '15 phút' }
      ],
      maxGolferList: [{ value: 20, label: '20 người' }],
      optionList: [
        { value: '0', label: 'Không' },
        { value: '1', label: 'Có' }
      ],
      dateRange: '',
      clearFacility: false,
      listPriceByAgent: [],
      listTee: [
        { value: 1, label: 'Buổi sáng' },
        { value: 2, label: 'Buổi Chiều' },
        { value: 3, label: 'Buổi tối' },
        { value: 4, label: 'Cả ngày' }
      ],
      isClearAgency: false,
      agencies: []
    }
  },
  computed: {
    datePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date(this.formRequest.time_active_start)
          yesterday.setDate(yesterday.getDate() + 1)
          return time.getTime() < yesterday.getTime()
        }
      }
    }
  },
  watch: {
    dateRange(value) {
      if (value) {
        this.formRequest.time_active_start = moment(value[0]).unix() * 1000
        this.formRequest.time_active_end = moment(value[1]).unix() * 1000
      } else {
        this.formRequest.time_active_start = ''
        this.formRequest.time_active_end = ''
      }
    },
    objectData(value) {
      console.log('value', value)
      if (value && !this.isAdd) {
        this.formRequest.id = value.id
        this.dateRange = [new Date(value.time_active_start), new Date(value.time_active_end)]
        this.onGetDetailPriceTeeByAgency(value.id)
      }
    },
    isAdd(value) {
      if (value) {
        this.dialog = Object.assign({}, { titleName: 'THIẾT LẬP GIỜ VÀ GIÁ TEETIME', buttonName: 'Thêm mới' })
      } else {
        this.dialog = Object.assign({}, { titleName: 'CẬP NHẬT GÓI BÁN', buttonName: 'Cập nhật' })
      }
    }
  },
  created() {
    this.onSearchAgency()
  },
  methods: {
    DownLoadFileEx() {
      // Tạo một đối tượng URL từ đường dẫn đến file mẫu
      const fileURL = '/list_price_by_agency.xlsx'

      // Tạo một thẻ a ẩn
      const link = document.createElement('a')
      link.href = fileURL
      link.target = '_blank'
      link.download = 'list_price_by_agency.xlsx'

      // Kích hoạt sự kiện click để tải file
      link.click()
    },
    handleImportPrice(value, array) {
      if (value?.raw?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && value.status !== 'success') {
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
          const rowObject = XLSX.utils.sheet_to_json(worksheet, { header: ['Tee', 'ID Đại lý', 'Giá'] })
          rowObject.shift()
          if (rowObject.length > 0) {
            console.log('rowObject___________', rowObject)

            const listTee = this.listTee.reduce((acc, curr) => {
              acc[curr.label.toString().toLocaleLowerCase()] = curr.value
              return acc
            }, {})
            console.log('listTee__________', listTee)
            const listPrice = rowObject.map(row => ({
              type_tee: +listTee[row['Tee']?.trim()?.toLowerCase()] || null,
              agency_id: row['ID Đại lý'],
              normal_price: row['Giá']
            }))
            console.log('rowObject___________', listPrice)
            this.listPriceByAgent = [...this.listPriceByAgent, ...listPrice]
            this.$message.success('Import thành công.')
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
    handleExportExcel(lists = [], headers = [], fileName = '') {
      // Dữ liệu mẫu
      const exportData = [headers, ...lists]

      // Tạo một workbook và thêm một worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.aoa_to_sheet(exportData)

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      const dateTime = moment().format('YYYYMMDD_HHmmss')

      // Lưu workbook thành một tệp Excel
      XLSX.writeFile(workbook, `${fileName}_${dateTime}.xlsx`)
    },
    DownloadFileAgency() {
      if (this.agencies.length === 0) return
      console.log('this.agencies______', this.agencies)

      const dataAgency = this.agencies.map(item => [item.value, item.label])
      console.log('dataAgency_____________', dataAgency)
      const headers = ['ID', 'Đại lý']
      this.handleExportExcel(dataAgency, headers, 'list_agency')
    },
    onSearchAgency() {
      agencyResource.searchAgency().then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.agencies = result.map(value => {
              return { value: value.id, label: value.name }
            })

            this.agencies.unshift({ value: -1, label: 'Khách lẻ' })
          } else {
            this.agencies = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    async onGetDetailPriceTeeByAgency(val) {
      this.dialogLoading = true
      const body = { pack_tee_time_id: val }
      this.listPriceByAgent = []
      packageTeeResource.detail_price_tee_by_agency(body).then(res => {
        if (res.error_code === 0) {
          const { list_tee, list_price_tee } = res.data
          const typeTee = list_tee?.map(tee => +tee.type_tee)
          console.log('this.listTee__________', this.listTee)

          this.listTee = this.listTee.filter(i => typeTee.includes(+i.value) || i.value === 4)
          console.log('this.listTee__________', this.listTee)
          if (list_price_tee.length > 0) {
            const data = list_price_tee.map(i => ({
              type_tee: +i.type_tee,
              agency_id: i.agency_id,
              normal_price: i.normal_price,
              tee_time_id: i.tee_time_id
            }))
            const checkAgency = []
            for (let i = 0; i < data.length; i++) {
              const item = data[i]
              if (checkAgency.includes(item.agency_id)) {
                continue
              }
              const priceAgency = data.filter(a => a.agency_id === item.agency_id).map(i => i.normal_price)
              const areAllValuesEqual = priceAgency.every(value => value === priceAgency[0])
              console.log('priceAgency____________', priceAgency)
              console.log('areAllValuesEqual____________', areAllValuesEqual)
              if (priceAgency.length === typeTee.length && areAllValuesEqual) {
                this.listPriceByAgent.push({
                  ...item,
                  type_tee: 4
                })
                checkAgency.push(item.agency_id)
              } else {
                this.listPriceByAgent.push(item)
              }
            }
          } else {
            this.listPriceByAgent = []
          }
          console.log(' this.listPriceByAgen____________', this.listPriceByAgent)
        } else {
          this.$message.error('Có lỗi xảy ra, vui lòng thử lại.')
        }
      }).finally(() => {
        this.dialogLoading = false
      })
    },
    async onSubmitForm(formName) {
      this.$refs[formName].validate(async(validate) => {
        if (validate) {
          let listPrice = []
          let postFormPrice = []
          if (this.listPriceByAgent.length > 0) {
            listPrice = [...this.listPriceByAgent]
            console.log('listPrice____________', listPrice)
            const tees = this.listTee.filter(t => t.value !== 4)
            const listAll = listPrice.filter(i => +i.type_tee === 4)
            if (listAll && listAll.length > 0) {
              for (let i = 0; i < listAll.length; i++) {
                const data = listAll[i]
                for (let t = 0; t < tees.length; t++) {
                  const tee = tees[t]
                  listPrice.push({
                    type_tee: tee?.value,
                    agency_id: data?.agency_id,
                    normal_price: data.normal_price || 0
                  })
                }
              }
            }
            console.log('listPrice________________', listPrice)
            postFormPrice = listPrice.filter(i => i.type_tee !== 4)
            for (let i = 0; i < postFormPrice.length; i++) {
              const item = postFormPrice[i]
              if (isEmpty(item.agency_id) || isEmpty(item.type_tee)) {
                this.$message.warning('Có bản ghi chưa nhập đủ các trường.')
                return
              }

              const checkLimit = postFormPrice.filter(price => price.agency_id === item.agency_id && price.type_tee === item.type_tee)
              if (checkLimit.length > 1) {
                this.$message.warning('Có bản ghi giá theo đại lý bị trùng lặp.')
                return
              }
            }
          }
          console.log('listPrice_______________', postFormPrice)

          if (this.isAdd) this.handleSubmitAdd(postFormPrice)
          else this.handleSubmitUpdate(postFormPrice)
        }
      })
    },
    async handleSubmitAdd(listPrice = []) {
      if (!this.formRequest.is_sell_morning && !this.formRequest.is_sell_afternoon && !this.formRequest.is_sell_evening) {
        this.$message.error('Bạn chưa chọn thời gian. Hãy chọn 1 trong các buổi (Sáng, chiều, tối)')
      } else {
        await this.trim_string_object(this.formRequest)
        const postFrom = {
          ...this.formRequest,
          listPriceByAgent: listPrice
        }
        packageTeeResource.store(postFrom).then(res => {
          this.loadingSubmit = false
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
        })
      }
    },
    async handleSubmitUpdate(listPrice = []) {
      await this.trim_string_object(this.formRequest)
      packageTeeResource.update({
        time_active_start: this.formRequest.time_active_start,
        time_active_end: this.formRequest.time_active_end,
        id: this.formRequest.id,
        listPriceByAgent: listPrice || []
      }).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        console.log('res.................................', res)
        if (error_code === 0) {
          this.$message.success('Cập nhật thành công')
          this.resetformRequest()
          this.handleClose()
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
    },

    handleSelectionChanged(value) {
      this.clearFacility = false
      this.formRequest.facility_id = value.value
    },

    async resetformRequest() {
      await Promise.resolve(
        this.formRequest = {
          max_golfer_morning: 20,
          type_child_pack_morning: {
            number_hole_9: '',
            number_hole_18: '',
            number_hole_27: ''
          },
          normal_cost_child_pack_morning: {
            number_hole_9: '',
            number_hole_18: '',
            number_hole_27: ''
          },
          eat_child_pack_morning: {
            number_hole_9: '1',
            number_hole_18: '1',
            number_hole_27: '1'
          },
          car_child_pack_morning: {
            number_hole_9: '1',
            number_hole_18: '1',
            number_hole_27: '1'
          },

          max_golfer_afternoon: 20,
          type_child_pack_afternoon: {
            number_hole_9: '',
            number_hole_18: '',
            number_hole_27: ''
          },
          normal_cost_child_pack_afternoon: {
            number_hole_9: '',
            number_hole_18: '',
            number_hole_27: ''
          },
          eat_child_pack_afternoon: {
            number_hole_9: '1',
            number_hole_18: '1',
            number_hole_27: '1'
          },
          car_child_pack_afternoon: {
            number_hole_9: '1',
            number_hole_18: '1',
            number_hole_27: '1'
          },

          max_golfer_evening: 20,
          type_child_pack_evening: {
            number_hole_9: '',
            number_hole_18: '',
            number_hole_27: ''
          },
          normal_cost_child_pack_evening: {
            number_hole_9: '',
            number_hole_18: '',
            number_hole_27: ''
          },
          eat_child_pack_evening: {
            number_hole_9: '1',
            number_hole_18: '1',
            number_hole_27: '1'
          },
          car_child_pack_evening: {
            number_hole_9: '1',
            number_hole_18: '1',
            number_hole_27: '1'
          }
        },
        this.clearFacility = true,
        this.dateRange = '',
        this.listPriceByAgent = [],
        this.listTee = [
          { value: 1, label: 'Buổi sáng' },
          { value: 2, label: 'Buổi Chiều' },
          { value: 3, label: 'Buổi tối' },
          { value: 4, label: 'Cả ngày' }

        ]
      )
      this.$refs['ruleForm'].clearValidate()
    },

    handleClose() {
      this.formRequest = {}
      this.$emit('onCloseDialog', { dialog: true, reload: false })
      this.resetformRequest()
    },
    handleAddPrice() {
      const data = {
        type_tee: '',
        agency_id: '',
        normal_price: 0
      }
      this.listPriceByAgent.push(data)
    },
    deleteAgent(index, row) {
      this.listPriceByAgent.splice(index, 1)
    },
    formatNumber,
    trim_string_object
  }
}
</script>

<style scoped>
.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}
.px-10 {
  border: 1px solid #c6bcbc;
  border-radius: 7px;
  min-height: 500px;
}

.card-header {
    background: #ddd;
    text-align: center;
    padding: 10px;
}

.p-10 {
  padding: 10px;
}
</style>

