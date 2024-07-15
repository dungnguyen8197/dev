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
        <el-col :sm="4">
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
      </el-row>
      <el-row style="display: flex; justify-content: space-between;">

        <!-- Buổi sáng -->

        <el-col :sm="24" :offset="1" :md="7" class="px-10">
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
                  value-format="HH:mm:ss"
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
                  value-format="HH:mm:ss"
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

        <el-col :sm="24" :md="7" class="px-10">
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
                  value-format="HH:mm:ss"
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
                  value-format="HH:mm:ss"
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

        <el-col :sm="24" :md="7" class="px-10">
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
                  value-format="HH:mm:ss"
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
                  value-format="HH:mm:ss"
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Hủy</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { validateDate, validateText, validateTextAndCondition, validateEndAtAndCondition } from '@/utils/validate'
import { formatNumber } from '@/utils/convert'
import PackageTeeResource from '@/api/package-tee/index'
import { trim_string_object } from '@/utils/trim-string-object'
import moment from 'moment'
// const searchResource = new SearchResource()
const packageTeeResource = new PackageTeeResource()

export default {
  name: 'DialogDetailPackage',
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
    }
  },
  data() {
    return {
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
      dialog: { titleName: 'CHI TIẾT GÓI BÁN', buttonName: 'Xác nhận' },
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
        Date: (time) => {
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
        this.formRequest.name_pack = value.name
        this.onGetDetail()
      }
    }
  },
  created() {
  },
  methods: {
    onGetDetail() {
      packageTeeResource.detail_manager_source_price({ id: this.formRequest.id }).then(res => {
        this.loadingSubmit = false
        const { error_code, error_msg } = res
        if (error_code === 0) {
          this.dataTable = res.data
          if (res.data.length > 0) {
            for (const item of res.data) {
              const findTee_9 = item?.tee?.find(t => +t.type_tee_hole === 9)
              const findTee_18 = item?.tee?.find(t => +t.type_tee_hole === 18)
              const findTee_27 = item?.tee?.find(t => +t.type_tee_hole === 27)
              if (+item.type_tee === 1) {
                this.formRequest = {
                  ...this.formRequest,
                  is_sell_morning: '1',
                  max_golfer_morning: 20,
                  type_child_pack_morning: {
                    number_hole_9: findTee_9 ? '9' : '',
                    number_hole_18: findTee_18 ? '18' : '',
                    number_hole_27: findTee_27 ? '27' : ''
                  },
                  normal_cost_child_pack_morning: {
                    number_hole_9: findTee_9 ? findTee_9?.normal_price : '',
                    number_hole_18: findTee_18 ? findTee_18?.normal_price : '',
                    number_hole_27: findTee_27 ? findTee_27?.normal_price : ''
                  },
                  eat_child_pack_morning: {
                    number_hole_9: findTee_9?.is_food ? '1' : '',
                    number_hole_18: findTee_18?.is_food ? '1' : '',
                    number_hole_27: findTee_27?.is_food ? '1' : ''
                  },
                  car_child_pack_morning: {
                    number_hole_9: findTee_9?.is_golf_cart ? '1' : '',
                    number_hole_18: findTee_18?.is_golf_cart ? '1' : '',
                    number_hole_27: findTee_27?.is_golf_cart ? '1' : ''
                  },
                  start_morning: item.start_time_tee,
                  end_morning: item.end_time_tee,
                  diff_morning: item.diff_tee,
                  hio_100_child_pack_morning: findTee_18?.hio_100_price > 0 ? findTee_18?.hio_100_price : '',
                  hio_200_child_pack_morning: findTee_18?.hio_200_price > 0 ? findTee_18?.hio_200_price : ''
                }
              }
              if (+item.type_tee === 2) {
                this.formRequest = {
                  ...this.formRequest,
                  is_sell_afternoon: '1',
                  max_golfer_afternoon: 20,
                  type_child_pack_afternoon: {
                    number_hole_9: findTee_9 ? '9' : '',
                    number_hole_18: findTee_18 ? '18' : '',
                    number_hole_27: findTee_27 ? '27' : ''
                  },
                  normal_cost_child_pack_afternoon: {
                    number_hole_9: findTee_9 ? findTee_9?.normal_price : '',
                    number_hole_18: findTee_18 ? findTee_18?.normal_price : '',
                    number_hole_27: findTee_27 ? findTee_27?.normal_price : ''
                  },
                  eat_child_pack_afternoon: {
                    number_hole_9: findTee_9?.is_food ? '1' : '',
                    number_hole_18: findTee_18?.is_food ? '1' : '',
                    number_hole_27: findTee_27?.is_food ? '1' : ''
                  },
                  car_child_pack_afternoon: {
                    number_hole_9: findTee_9?.is_golf_cart ? '1' : '',
                    number_hole_18: findTee_18?.is_golf_cart ? '1' : '',
                    number_hole_27: findTee_27?.is_golf_cart ? '1' : ''
                  },
                  start_afternoon: item.start_time_tee,
                  end_afternoon: item.end_time_tee,
                  diff_afternoon: item.diff_tee,
                  hio_100_child_pack_afternoon: findTee_18?.hio_100_price > 0 ? findTee_18?.hio_100_price : '',
                  hio_200_child_pack_afternoon: findTee_18?.hio_200_price > 0 ? findTee_18?.hio_200_price : ''
                }
              }
              if (+item.type_tee === 3) {
                this.formRequest = {
                  ...this.formRequest,
                  is_sell_evening: '1',
                  max_golfer_evening: 20,
                  type_child_pack_evening: {
                    number_hole_9: findTee_9 ? '9' : '',
                    number_hole_18: findTee_18 ? '18' : '',
                    number_hole_27: findTee_27 ? '27' : ''
                  },
                  normal_cost_child_pack_evening: {
                    number_hole_9: findTee_9 ? findTee_9?.normal_price : '',
                    number_hole_18: findTee_18 ? findTee_18?.normal_price : '',
                    number_hole_27: findTee_27 ? findTee_27?.normal_price : ''
                  },
                  eat_child_pack_evening: {
                    number_hole_9: findTee_9?.is_food ? '1' : '',
                    number_hole_18: findTee_18?.is_food ? '1' : '',
                    number_hole_27: findTee_27?.is_food ? '1' : ''
                  },
                  car_child_pack_eveningn: {
                    number_hole_9: findTee_9?.is_golf_cart ? '1' : '',
                    number_hole_18: findTee_18?.is_golf_cart ? '1' : '',
                    number_hole_27: findTee_27?.is_golf_cart ? '1' : ''
                  },
                  start_evening: item.start_time_tee,
                  end_evening: item.end_time_tee,
                  diff_evening: item.diff_tee,
                  hio_100_child_pack_evening: findTee_18?.hio_100_price > 0 ? findTee_18?.hio_100_price : '',
                  hio_200_child_pack_evening: findTee_18?.hio_200_price > 0 ? findTee_18?.hio_200_price : ''
                }
              }
            }
            // this.formRequest.tee = res.data.map(item => {
            //   item.tee.map(tee => {
            //     this.formRequest.price[tee.id] = tee.source_price
            //   })
            //   return item.tee
            // })
            console.log('......', this.typePaymentList.find(item => item.value === 1).label)
            this.formRequest.type_payments = res.data?.[0]?.packageTee?.type_purchase_supplier
            console.log('this.formRequest.........', this.formRequest)
          }
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
        this.loadingSubmit = false
      })
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

