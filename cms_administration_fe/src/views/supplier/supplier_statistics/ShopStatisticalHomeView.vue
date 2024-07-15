<template>
  <el-row class="app-container list-shop">
    <!-- <el-row> -->
    <dialog-order-products-vue ref="refDialogOrderProducts" :offset-top="currentY" />
    <el-row class="list-shop__header">
      <!-- <el-col :sm="12">
          <h3>{{ ('home') }}</h3>
        </el-col> -->
      <!-- <el-row style="display: ruby;"> -->
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex;">
          <p style="margin-right: 15px;" @click="onBack"><i class="el-icon-back" /></p>
          <h3 style="color: #3C3D40; font-size: 20px;">{{ shop_name.length ? `Thống kê doanh thu nhà cung cấp - ${shop_name}` : 'Thống kê doanh thu' }}</h3>
        </div>
        <el-button style="margin-bottom: 10px;" :loading="loadingHome" icon="el-icon-refresh" @click="onRefreshHomePress">{{ ('Refresh') }}</el-button>
      </div>

      <!-- </el-row> -->
      <!-- <el-col :sm="12">
              <div class="text-right">
                <el-button v-if="is_write" type="primary" @click="onShowDialogCreate">{{ ('add') }}</el-button>
              </div>
            </el-col> -->
    </el-row>
    <!-- </el-row> -->
    <el-row>
      <div style="border-radius: 10px; border-width: 1px; background-color: #5F6368; min-height: 100px; padding-left: 10px; padding-right: 10px; padding-top: 10px; padding-bottom: 10px;">
        <span style="font-size: 16px; color: white;">{{ ('Tổng đơn hàng ước tính') }}</span>
        <el-row :sm="24">
          <el-col :sm="6">
            <span class="label_text">{{ ('Đầu ngày tới giờ') }}</span>
            <span class="value_text">{{ ` ${doashboard.today_count_delivery ? doashboard.today_count_delivery : 0} đơn : ${formatNumber(doashboard.today_total_price ? doashboard.today_total_price : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng giá nhập: ${formatNumber(doashboard.today_total_cost ? doashboard.today_total_cost : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Lợi nhuận: ${formatNumber(doashboard.today_gross_profit ? doashboard.today_gross_profit : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng point hoàn: ${formatNumber(doashboard.today_point_refund ? doashboard.today_point_refund : 0)} đ` }}</span>
            <!-- <el-col>
              <el-row>
                <span class="value_text">Số đơn</span>
                <span class="value_text">{{ doashboard.today_count_delivery ? doashboard.today_count_delivery : 0 }}</span>
              </el-row>
              <el-row>
                <span class="value_text">Tổng tiền</span>
                <span class="value_text">{{ doashboard.today_total_price ? doashboard.today_total_price : 0 }}</span>
              </el-row> -->
            <!-- </el-col> -->
          </el-col>
          <el-col :sm="6">
            <span class="label_text">{{ ('Hôm qua') }}</span>
            <span class="value_text">{{ ` ${doashboard.yesterday_count_delivery ? doashboard.yesterday_count_delivery : 0} đơn : ${formatNumber(doashboard.yesterday_total_price ? doashboard.yesterday_total_price : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng giá nhập: ${formatNumber(doashboard.yesterday_total_cost ? doashboard.yesterday_total_cost : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Lợi nhuận: ${formatNumber(doashboard.yesterday_gross_profit ? doashboard.yesterday_gross_profit : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng point hoàn: ${formatNumber(doashboard.yesterday_point_refund ? doashboard.yesterday_point_refund : 0)} đ` }}</span>
            <!-- <span class="value_text">20 đơn: 2.000.0000đ</span> -->
          </el-col>
          <el-col :sm="6">
            <span class="label_text">{{ ('Đầu tháng tới giờ') }}</span>
            <span class="value_text">{{ ` ${doashboard.month_count_delivery ? doashboard.month_count_delivery : 0} đơn : ${formatNumber(doashboard.month_total_price ? doashboard.month_total_price : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng giá nhập: ${formatNumber(doashboard.month_total_cost ? doashboard.month_total_cost : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Lợi nhuận: ${formatNumber(doashboard.month_gross_profit ? doashboard.month_gross_profit : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng point hoàn: ${formatNumber(doashboard.month_point_refund ? doashboard.month_point_refund : 0)} đ` }}</span>
            <!-- <span class="value_text">20 đơn: 2.000.0000đ</span> -->
          </el-col>
          <el-col :sm="6">
            <span class="label_text">{{ ('Tháng trước') }}</span>
            <span class="value_text">{{ `${doashboard.last_month_count_delivery ? doashboard.last_month_count_delivery : 0} đơn: ${formatNumber(doashboard.last_month_total_price ? doashboard.last_month_total_price : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng giá nhập: ${formatNumber(doashboard.last_month_total_cost ? doashboard.last_month_total_cost : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Lợi nhuận: ${formatNumber(doashboard.last_month_gross_profit ? doashboard.last_month_gross_profit : 0)} đ` }}</span>
            <span class="value_text_2">{{ `Tổng point hoàn: ${formatNumber(doashboard.last_month_point_refund ? doashboard.last_month_point_refund : 0)} đ` }}</span>
            <!-- <span class="value_text">20 đơn: 2.000.0000đ</span> -->
          </el-col>
        </el-row>
      </div>
    </el-row>
    <el-row>
      <el-col :sm="24" style="margin-top: 30px; display: flex; justify-content: space-between;">
        <span>{{ dateRangeText }}</span>
        <div style="display: flex; flex-direction: row;">
          <!-- <div style="margin-right: 10px;">
            <el-button v-if="is_export" type="primary" icon="el-icon-download" @click="handleExportExcel">Xuất Excel</el-button>
          </div> -->
          <div style="margin-right: 10px;">
            <el-button type="primary" icon="el-icon-document" @click="$router.push({ path: '/statistic-supplier-all' })">{{ ('Xem thêm') }}</el-button>
          </div>
          <div>
            <el-button :loading="loadingTable" icon="el-icon-refresh" @click="onResetSearch">{{ ('Refresh') }}</el-button>
          </div>
        </div>
      </el-col>

    </el-row>
    <!-- <div style="display: flex; justify-content: space-between; margin-top: 10px">
      <div style="margin-right: 10px; width: 100%;">
        <el-input v-model="listQuery.q" :placeholder="('Nhập để tìm kiếm')" icon="search" @keyup.enter.native="onSearchPress">
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
      </div>
      <div style="display: flex;">
        <div style="width: 180px; margin-right: 10px;">
          <el-select
            v-model="filter_id"
          >
            <el-option
              v-for="filter in filters"
              :key="filter.id"
              :label="filter.name"
              :value="filter.id"
            />
          </el-select>
        </div>
        <div style="width: 120px; margin-right: 10px;">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @keyup.enter="onSearchPress"
            @click="onSearchPress"
          >
            Tìm kiếm
          </el-button>
        </div>
        <el-date-picker
          v-model="dateRangeDebt"
          style="width: 300px; margin-right: 10px;"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="Đến"
          start-placeholder="Ngày tính doanh thu"
          end-placeholder="Ngày tính doanh thu"
          @change="handleChangeDateRange"
        />
        <div style="width: 200px;">
          <el-select
            v-model="source_id"
          >
            <el-option
              v-for="source in sources"
              :key="source.id"
              :label="source.name"
              :value="source.id"
              style="width: 100%;"
            />
          </el-select>
        </div>
      </div>
    </div> -->
    <el-row style="margin-top: 10px;">
      <el-row class="list-shop__data" style="margin-top: 10px;">
        <el-table
          v-loading="loadingTable"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            v-if="source_id === 1"
            :label="('Mã NCC')"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ ` NCC ${scope.row.shop_info.id ? scope.row.shop_info.id : scope.row.source}` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="source_id === 1"
            prop="shop_info.name"
            :label="('Tên NCC')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.shop_info.name }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            v-if="source_id === 2"
            prop="chanel_name"
            :label="('Kênh bán hàng')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.shop_info.name }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_delivery"
            :label="('Tổng đơn tính doanh thu')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.total_delivery }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare > 0" class="text_add">{{ `${('Tăng')}: +${scope.row.count_delivered_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare > 0" class="text_add">{{ `${('Tỷ lệ')}: +${scope.row.count_delivered_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare < 0" class="text_sub">{{ `${('Giảm')}: ${scope.row.count_delivered_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_delivered_compare < 0" class="text_sub">{{ `${('Tỷ lệ')}: -${scope.row.count_delivered_percen}%` }}</span>
              </el-row>
              <!-- <span class="text_nomal">{{ scope.row.count_delivered }}</span>
              <span v-if="scope.row.count_delivered_compare === 0" class="text_nomal">{{ ` (${scope.row.count_delivered_compare})` }}</span>
              <span v-if="scope.row.count_delivered_compare < 0" class="text_sub">{{ ` (${scope.row.count_delivered_compare}) (-${scope.row.count_delivered_percen}%)` }}</span>
              <span v-if="scope.row.count_delivered_compare > 0" class="text_add">{{ ` (+${scope.row.count_delivered_compare}) (+${scope.row.count_delivered_percen}%)` }}</span> -->
            </template>
          </el-table-column>>
          <!-- <el-table-column
            prop="count_cancel"
            :label="('total_order_cancel')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ scope.row.count_cancel }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_cancel_compare < 0" class="text_sub">{{ `${('giam')}: ${scope.row.count_cancel_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_cancel_compare < 0" class="text_sub">{{ `${('ty_le')}: ${scope.row.count_cancel_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_cancel_compare > 0" class="text_add">{{ `${('tang')}: ${scope.row.count_cancel_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.count_cancel_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.count_cancel_percen}%` }}</span>
              </el-row>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
            prop="count_return"
            :label="('total_order_return')"
            align="center"
          >
            <template slot-scope="scope">
              <span class="text_nomal">{{ scope.row.count_return }}</span>
              <span v-if="scope.row.count_return_compare === 0" class="text_nomal">{{ ` (${scope.row.count_return_compare})` }}</span>
              <span v-if="scope.row.count_return_compare < 0" class="text_sub">{{ ` (${scope.row.count_return_compare}) (-${scope.row.count_return_percen}%)` }}</span>
              <span v-if="scope.row.count_return_compare > 0" class="text_add">{{ ` (+${scope.row.count_return_compare}) (+${scope.row.count_return_percen}%)` }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="all_products"
            :label="('Tổng sản phẩm')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <!-- <span class="text_nomal">{{ scope.row.all_products }}</span> -->
                <el-link type="primary" @click="onShowAllProductPress(scope.row)">{{
                  scope.row.all_products
                }}</el-link>
              </el-row>
              <!-- <el-row>
                <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
              </el-row> -->
              <el-row>
                <span v-if="scope.row.total_product_compare < 0" class="text_sub">{{ `${('giam')}: ${scope.row.total_product_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.total_product_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare > 0" class="text_add">{{ `${('tang')}: +${scope.row.total_product_compare}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_product_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.total_product_percen}%` }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="all_revenue"
            :label="('Doanh thu')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ formatNumber(scope.row.all_revenue) }} đ</span>
              </el-row>
              <!-- <el-row>
                <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
              </el-row> -->
              <el-row>
                <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ `giam: ${formatNumber(scope.row.total_price_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.total_price_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ `tang: +${formatNumber(scope.row.total_price_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.total_price_percen}%` }}</span>
              </el-row>
              <!-- <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.total_price)) }}</span>
              <span v-if="scope.row.total_price_compare === 0" class="text_nomal">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))})` }}</span>
              <span v-if="scope.row.total_price_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))}) (-${scope.row.total_price_percen}%)` }}</span>
              <span v-if="scope.row.total_price_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.total_price_compare))}) (+${scope.row.total_price_percen}%)` }}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="all_cost"
            :label="('Tổng giá nhập')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ formatNumber(scope.row.all_cost) }} đ</span>
              </el-row>
              <!-- <el-row>
                <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
              </el-row> -->
              <!-- <el-row>
                <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ `${('giam')}: ${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.total_cost_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ `${('tang')}: +${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.total_cost_percen}%` }}</span>
              </el-row> -->
              <!-- <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.total_cost)) }}</span>
              <span v-if="scope.row.total_cost_compare === 0" class="text_nomal">{{ ` (${ ('price_vnd_2').format(formatNumber(scope.row.total_cost_compare)) })` }}</span>
              <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}) (-${scope.row.total_cost_percen}%)` }}</span>
              <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}) (+${scope.row.total_cost_percen}%)` }}</span> -->
            </template>
          </el-table-column>

          <el-table-column
            prop="all_refund_point"
            :label="('Tổng hoàn point')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ (scope.row.all_refund_point) }}</span>
              </el-row>
              <!-- <el-row>
                <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
              </el-row> -->
              <!-- <el-row>
                <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ `${('giam')}: ${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.total_cost_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ `${('tang')}: +${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.total_cost_percen}%` }}</span>
              </el-row> -->
              <!-- <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.total_cost)) }}</span>
              <span v-if="scope.row.total_cost_compare === 0" class="text_nomal">{{ ` (${ ('price_vnd_2').format(formatNumber(scope.row.total_cost_compare)) })` }}</span>
              <span v-if="scope.row.total_cost_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}) (-${scope.row.total_cost_percen}%)` }}</span>
              <span v-if="scope.row.total_cost_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.total_cost_compare))}) (+${scope.row.total_cost_percen}%)` }}</span> -->
            </template>
          </el-table-column>

          <el-table-column
            prop="all_profit"
            :label="('Lợi nhuận gộp')"
            align="center"
          >
            <template slot-scope="scope">
              <el-row>
                <span class="text_nomal">{{ formatNumber(scope.row.all_profit) }} đ</span>
              </el-row>
              <!-- <el-row>
                <span v-if="scope.row.total_product_compare === 0" class="text_nomal">{{ ` (${scope.row.total_product_compare})` }}</span>
              </el-row> -->
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare < 0" class="text_sub">{{ `giam: ${formatNumber(scope.row.loi_nhuan_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare < 0" class="text_sub">{{ `${('ty_le')}: -${scope.row.loi_nhuan_percen}%` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare > 0" class="text_add">{{ `tang: +${formatNumber(scope.row.loi_nhuan_compare)}` }}</span>
              </el-row>
              <el-row>
                <span v-if="scope.row.loi_nhuan_compare > 0" class="text_add">{{ `${('ty_le')}: +${scope.row.loi_nhuan_percen}%` }}</span>
              </el-row>
              <!-- <span class="text_nomal">{{ ('price_vnd_2').format(formatNumber(scope.row.loi_nhuan)) }}</span>
              <span v-if="scope.row.loi_nhuan_compare === 0" class="text_nomal">{{ ` (${ ('price_vnd_2').format(formatNumber(scope.row.loi_nhuan_compare))})` }}</span>
              <span v-if="scope.row.loi_nhuan_compare < 0" class="text_sub">{{ ` (${('price_vnd_2').format(formatNumber(scope.row.loi_nhuan_compare))}) (-${scope.row.loi_nhuan_percen}%)` }}</span>
              <span v-if="scope.row.loi_nhuan_compare > 0" class="text_add">{{ ` (+${('price_vnd_2').format(formatNumber(scope.row.loi_nhuan_compare))}) (+${scope.row.loi_nhuan_percen}%)` }}</span> -->
            </template>
          </el-table-column>
          <!-- <el-table-column
              :label="('logo_menu')"
              align="center"
            >
              <template slot-scope="scope">
                <span class="demonstration">{{ scope.row.contain }}</span>
                <el-image
                  v-if="scope.row.logo_menu"
                  :src="scope.row.logo_menu"
                  :fit="contain"
                />
              </template>
            </el-table-column> -->
          <!-- <el-table-column
              prop="name"
              :label="('shop_name')"
              align="center"
            /> -->
        </el-table>
      </el-row>
    </el-row>

    <el-row>
      <el-col :sm="24" style="margin-top: 50px; display: flex; justify-content: space-between;">
        <span>Top sản phẩm bán chạy nhất từ đầu tháng đến giờ</span>
        <div style="display: flex; flex-direction: row;">
          <div style="margin-right: 10px;">
            <el-button type="primary" icon="el-icon-document" @click="$router.push({ path: '/top-sale-info' })">{{ ('Xem thêm') }}</el-button>
          </div>
          <div>
            <el-button :loading="loadingTableProduct" icon="el-icon-refresh" @click="onRefreshTopSale">{{ ('Refresh') }}</el-button>
          </div>
        </div>
      </el-col>

    </el-row>
    <el-row style="margin-top: 10px;">
      <el-row class="list-shop__data" style="margin-top: 10px;">
        <el-table
          v-loading="loadingTableProduct"
          :data="tableDataProduct"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="product_code"
            :label="('Mã sản phẩm')"
            align="center"
          />
          <el-table-column
            prop="name"
            :label="('Tên sản phẩm')"
            align="center"
          />

          <el-table-column
            label="Logo"
            align="center"
            width="130"
          >
            <template slot-scope="scope">
              <el-link type="primary">
                <el-image
                  v-if="scope.row.thumb"
                  :src="scope.row.thumb ? scope.row.thumb : ''"
                  :fit="contain"
                />
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            prop="category.name"
            :label="('Hạng mục')"
            align="center"
          />

          <el-table-column
            prop="number"
            :label="('Số lượng đã bán')"
            align="center"
          />

          <el-table-column
            :label="('Doanh thu')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.total_price) }} đ</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="('Tổng giá nhập')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.total_cost) }} đ</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="('Lợi nhuận')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.total_profit) }} đ</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="shop.name"
            :label="('Nhà cung cấp')"
            align="center"
          />

          <!-- <el-table-column
            :label="('Giá niêm yết')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.price) }} đ</span>
            </template>
          </el-table-column> -->

          <!-- <el-table-column
            :label="('Giá bán')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.price_sale) }} đ</span>
            </template>
          </el-table-column> -->

          <!-- <el-table-column
            :label="('Giá nhập')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.cost) }} đ</span>
            </template>
          </el-table-column> -->
        </el-table>
      </el-row>
    </el-row>
    <!-- <el-row>
      <pagination :total="totalProduct" :limit.sync="listQueryProduct.limit" :page.sync="listQueryProduct.page" @pagination="getListTopProduct" />
    </el-row> -->
  </el-row>
</template>

<script>
import ShopResource from '@/api/manage_supplier/statistical'
// import Pagination from '@/components/Pagination'
import { getAcountInfo } from '@/utils/auth'
// import icon_datetime from '@/icons/svg/icon_datetime.svg'
import { formatNumber } from '@/utils/convert'
import { get_ranger_time_today, get_ranger_time_yesterday, get_ranger_time_week, get_ranger_time_month, get_ranger_time_same_date_last_week, get_list_permission } from '@/utils/utils'
import moment from 'moment'
import DialogOrderProductsVue from './DialogOrderProducts.vue'
// import PieChart from '@/views/dashboard/chart/PieChart.vue'

// import moment from 'moment'
const shopResource = new ShopResource()

// function getStartDate(start) {
//   const hour = start.getHours()
//   const minutes = start.getMinutes()
//   const second = start.getSeconds()
//   const timestamp = hour * 60 * 60 * 1000 + minutes * 60 * 1000 + second * 1000
//   let start_date = start.getTime() - timestamp
//   start_date = new Date(start_date)
//   return start_date
// }

// function getEndDate(end) {
//   const hour = end.getHours()
//   const minutes = end.getMinutes()
//   const second = end.getSeconds()
//   const timestamp = hour * 60 * 60 * 1000 + minutes * 60 * 1000 + second * 1000
//   let end_date =
//     end.getTime() -
//         timestamp +
//         23 * 60 * 60 * 1000 +
//         59 * 60 * 1000 +
//         59 * 1000
//   end_date = new Date(end_date)
//   return end_date
// }

export default {
  name: 'SupplierContractList',
  components: { DialogOrderProductsVue },
  data() {
    // const account = getAcountInfo()
    return {
      totalProduct: 0,
      loadingTableProduct: false,
      showInfoDetail: false,
      is_delete: 0,
      is_write: 0,
      is_edit: 0,
      is_view: 0,
      is_export: 0,
      dateRangeDebt: '',
      dateRangeText: 'Thống kê từ đầu tháng tới giờ',
      searchSupplier: '',
      filters: [
        {
          id: 1,
          name: ('Tìm theo mã NCC')
        },
        {
          id: 2,
          name: ('Tìm theo tên NCC')
        }
      ],
      filter_id: 1,
      value1: '',
      sources: [
        {
          id: 1,
          name: ('Theo nhà cung cấp')
        },
        {
          id: 2,
          name: ('Theo kênh bán hàng')
        }
      ],
      source_id: 1,
      tableData: [],
      exportData: '',
      listQuery: {},
      listQueryProduct: {
        page: 1,
        limit: 5
      },
      doashboard: '',
      chart_data: [],
      shop_id: 0,
      shop_name: '',
      loadingTable: false,
      loadingHome: false,
      currentY: 0
    }
  },
  watch: {
    value1(value) {
      let start = value[0]
      let end = value[1]
      start = new Date(start).getTime()
      end = new Date(end).getTime()
      this.listQuery.date_create_from = start
      this.listQuery.date_create_to = end
      this.onGetListShop()
    },
    source_id(val) {
      this.listQuery.type_statistical = val
      console.log('.............. goi vao day lan ', val)
      this.requestStatisticalSupplierList()
    },
    getCurrentY() {
      this.currentY = window.scrollY
    },
    filter_id(newVal) {
      if (newVal === 1) {
        console.log('hehehehe`')
        // Khi filter_id bằng 1, cập nhật listQuery.q thành listQuery.shop_id
        this.listQuery.q = this.listQuery.shop_id
      } else {
        console.log('22222`')

        // Khi filter_id không bằng 1, bạn có thể xử lý tùy ý hoặc để trống
        // Ví dụ: reset listQuery.q
        this.listQuery.q = ''
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.getCurrentY)
  },
  created() {
    const query = this.$route.query
    if (query) {
      this.shop_id = parseInt(query.shop_id) || 0
      if (this.shop_id) {
        this.requestShopDetail()
      }
    }
    //   this.onGetListShop()
    // this.onGetProvinceList()
    const ranger = get_ranger_time_month() // mac dinh dau ngay toi gio
    const date_from = ranger[0]
    const date_to = ranger[1]
    this.listQuery.date_from = ranger[0] // start.getTime()
    this.listQuery.date_to = ranger[1]
    this.dateRangeDebt = [moment(date_from).format('YYYY-MM-DD'), moment(date_to).format('YYYY-MM-DD')]

    this.listQueryProduct.date_from = ranger[0] // start.getTime()
    this.listQueryProduct.date_to = ranger[1]
    // this.listQuery.shop_id = this.shop_id
    // this.requestStatisticalSupplierList()
    // this.requestStatisticalHome()
    this.requestListPermissionMenu()
    this.getListTopProduct()
  },
  mounted() {
    window.addEventListener('scroll', this.getCurrentY)
  },
  methods: {
    onBack() {
      window.history.back()
    },
    getCurrentY() {
      this.currentY = window.scrollY
    },
    onShowAllProductPress(row) {
      if (this.$refs.refDialogOrderProducts) {
        this.$refs.refDialogOrderProducts.show(true, this.currentY, row.shop_info, this.listQuery, this.source_id)
      }
    },
    requestListPermissionMenu() {
      const roles = this.$router.history.current.meta.roles
      let menu_id = roles && roles.length ? roles[0] : 0
      menu_id = parseInt(menu_id.replace('NCC', ''))
      const account = getAcountInfo()
      const email = account.email
      get_list_permission(email, menu_id, (data) => {
        console.log('............list data 1', JSON.stringify(data))
        if (data) {
          let { is_supper_admin, is_add, is_view, is_edit, is_delete, is_export } = data
          is_supper_admin = parseInt(is_supper_admin) || 0
          is_add = parseInt(is_add) || 1
          is_view = parseInt(is_view) || 1
          is_edit = parseInt(is_edit) || 1
          is_delete = parseInt(is_delete) || 1
          is_export = parseInt(is_export) || 1
          this.is_delete = is_supper_admin ? 1 : is_delete - 1
          this.is_write = is_supper_admin ? 1 : is_add - 1
          this.is_edit = is_supper_admin ? 1 : is_edit - 1
          this.is_export = is_supper_admin ? 1 : is_export - 1
          this.is_view = is_supper_admin ? 1 : is_view - 1
          this.requestStatisticalSupplierList()
          this.requestStatisticalHome()
        }
      })
    },
    onRefreshHomePress() {
      this.requestStatisticalHome()
    },
    /**
     * Xem thống kê doanh thu theo kênh bán hàng
     */
    onRevenuePress() {
      this.$router.push({ path: `/statistical_revenue` })
    },
    onSearchPress() {
      this.loadingTable = true
      // // let { q } = this.listQuery
      // // q = q ? q.trim() : ''
      // // if (!q.length) {
      // //   this.loadingTable = false
      // //   this.tableData = [...this.data]
      // // } else {
      this.listQuery.type_search = this.filter_id
      this.requestStatisticalSupplierList()
      // }
    },
    onResetSearch() {
      const ranger = get_ranger_time_month() // mac dinh dau ngay toi gio
      const date_from = ranger[0]
      const date_to = ranger[1]
      this.listQuery = {
        date_from: ranger[0],
        date_to: ranger[1],
        q: '',
        type_search: 1
      }
      this.dateRangeText = 'Thống kê từ đầu tháng tới giờ'
      // this.listQuery.date_from = ranger[0] // start.getTime()
      // this.listQuery.date_to = ranger[1]
      this.dateRangeDebt = [moment(date_from).format('YYYY-MM-DD'), moment(date_to).format('YYYY-MM-DD')]
      this.requestStatisticalSupplierList()
      // this.requestStatisticalHome()
    },
    onRefreshTopSale() {
      const ranger = get_ranger_time_month() // mac dinh dau ngay toi gio
      const date_from = ranger[0]
      const date_to = ranger[1]
      this.listQuery = {
        date_from: ranger[0],
        date_to: ranger[1],
        q: '',
        type_search: 1
      }
      this.dateRangeText = 'Thống kê từ đầu tháng tới giờ'
      // this.listQuery.date_from = ranger[0] // start.getTime()
      // this.listQuery.date_to = ranger[1]
      this.dateRangeDebt = [moment(date_from).format('YYYY-MM-DD'), moment(date_to).format('YYYY-MM-DD')]
      this.getListTopProduct()
      // this.requestStatisticalHome()
    },
    requestShopDetail() {
      shopResource.get_name_shop(this.shop_id).then(res => {
        console.log('........... detail shop ', JSON.stringify(res))
        const { error, data } = res
        if (error === 0) {
          this.shop_name = data.name
        }
      })
    },
    /**
     * xem thong ke 1 shop
     */
    onDetailPress(row) {
      if (!row.shop_id) return
      this.$router.push({ path: `/detail_statistical?shop_id=${row.shop_id}` })
    },
    drawChart(data) {
      console.log('........... draw chart ', JSON.stringify(data))
      // if (this.$refs.chartPie) {
      //   this.$refs.chartPie.drawChart(data.map(d => d.percent), data.map(d => d.user_name))
      // }
      // this.chart_data = [...data]
    },
    requestStatisticalHome() {
      if (!this.is_view) return
      this.loadingHome = true
      shopResource.statistical_home(this.shop_id).then(res => {
        const { error, data } = res
        this.loadingHome = false
        if (error === 0) {
          this.doashboard = data
          console.log('.......... doash board ', JSON.stringify(data))
        }
      }).catch(_err => {
        this.loadingHome = false
      })
    },
    requestStatisticalSupplierList() {
      if (!this.is_view) return
      this.loadingTable = true
      this.listQuery.type_statistical = this.source_id
      shopResource.list_statistical_supplier(this.listQuery).then(res => {
        const { error, data, msg } = res
        this.loadingTable = false
        console.log('.................. thong ke ', JSON.stringify(res))
        if (error === 0) {
          this.tableData = data
          const total_count_delivered = data.map(d => d.count_delivered).reduce((a, b) => a + b, 0)
          const statistical = []
          for (const shop of data) {
            const user = {}
            if (shop.count_delivered) {
              user.total = shop.count_delivered
              user.percent = Math.round((shop.count_delivered / total_count_delivered) * 100)
              user.user_name = shop.shop_name ? shop.shop_name : shop.chanel_name
              statistical.push(user)
            }
          }
          this.drawChart(statistical)
        } else {
          this.$message.error(msg)
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('........... error', err)
      })
    },
    confirmDowload(url) {
      this.getFileFromServer(url)
    },
    async getFileFromServer(url) {
      const fileName = url.substring(url.lastIndexOf('/') + 1)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        this.$message.success('Xuất file thành công, vui lòng vào thư mục donwload để xem')
      }, 250)
    },
    requestStatisticalSupplierListExport() {
      this.listQuery.type_statistical = this.source_id
      shopResource.export_statistical(this.listQuery).then(res => {
        const { error, link } = res
        console.log('.................. thong ke ', JSON.stringify(res), this.loadingTable)
        if (error === 0) {
          this.confirmDowload(link)
        } else {
          this.$message.error('Lỗi khi xuất file excel')
        }
      }).catch(err => {
        this.loadingTable = false
        console.log('........... error', err)
      })
    },
    handleExportExcel() {
      this.requestStatisticalSupplierListExport()
      console.log('xuaast execel')
    },
    handleChangeDateRange(val) {
      if (val && val.length === 2) {
        const startDate = val[0]
        const endDate = val[1]
        this.dateRangeText = `Thống kê từ ${moment(startDate).format('DD/MM/YYYY')} đến ${moment(endDate).format('DD/MM/YYYY')}`
      }
      const startDate = new Date(val[0])
      const endDate = new Date(val[1])
      this.listQuery.page = 1
      this.listQuery.date_from = startDate.getTime()
      this.listQuery.date_to = endDate.getTime()
      this.requestStatisticalSupplierList()
    },
    getListTopProduct() {
      this.loadingTableProduct = true
      shopResource.list_product_order(this.listQueryProduct).then(res => {
        const { error, data } = res
        if (this.listQueryProduct.page === 1) {
          this.totalProduct = res.total
        }
        if (error !== 0) throw new Error('Lỗi lấy danh sách sản phẩm')
        this.tableDataProduct = data
      }).catch(err => {
        console.log('........... error', err)
        this.$message.error(err.message)
      }).finally(() => {
        this.loadingTableProduct = false
      })
    },

    formatNumber,
    get_ranger_time_today,
    get_ranger_time_yesterday,
    get_ranger_time_week,
    get_ranger_time_month,
    get_ranger_time_same_date_last_week
  }
}
</script>
  <style lang="scss" scoped>
    .search-wrapper{
      margin-bottom: 10px;
    }
    .row_item{
      margin-right: 3px;
    }
    .el-col-sm-6 {
      width: 25%;
      display: grid;
      margin-top: 20px;
    }
    .value_text {
        font-size: 20px;
        color: white;
        margin-top: 5px;
        font-weight: 500;
    }
    .value_text_2 {
        font-size: 18px;
        color: white;
        margin-top: 3px;
        font-weight: 500;
    }
    .label_text {
        font-size: 16px;
        color: #CFD0D2;
    }
    .statistical {
        border: solid;
        border-radius: 10px;
        border-width: 1px;
        border-color: gray;
        background-color: white;
        min-height: 100px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-top: 20px;
    }
    .text_add {
      color: #1F7F3B;
      font-size: 16px;
    }
    .text_nomal {
      color: #000;
      font-size: 16px;
    }
    .text_sub {
      color: #D76E6D;
      font-size: 16px;
    }
    ::v-deep .el-range-editor--medium .el-range-separator {
      line-height: 28px;
      font-size: 14px;
      width: 30px;
    }
    </style>
