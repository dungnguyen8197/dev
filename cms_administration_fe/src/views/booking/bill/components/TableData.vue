<template>
  <div>
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
        width="150"
        prop="bill_code"
        label="Mã bill"
        align="center"
      />
      <el-table-column
        width="150"
        prop="general_bill_id"
        label="ID Bill"
        align="center"
      />
      <el-table-column
        width="150"
        prop="code"
        label="Mã thanh toán"
        align="center"
      />
      <el-table-column
        width="200"

        label="Tổng tiền"
        align="center"
      >
        <template slot-scope="{row}">
          {{ formatNumber(row.payment_amount) }} đ
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="VID Thanh toán"
        align="center"
      >
        <template slot-scope="{row}">
          VID{{ row.user_id }}
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="Admin tạo"
        align="center"
      >
        <template slot-scope="{row}">
          {{ handleAdmin(row.admin_id) }}
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="created_at"
        label="Ngày tạo"
        align="center"
      />
      <el-table-column
        width="200"
        prop="status"
        label="Trạng thái "
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag :type="color_status[row.status]"> {{ status_bill[row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Hành động" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.admin_id === currentAdmin.id">
            <el-button
              v-if="scope.row.status == 0"
              type="success"
              icon="el-icon-edit"
              round
              size="mini"
              @click="handleConfirmBill(scope.row.general_bill_id)"
            >Xác nhận
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              round
              size="mini"
              @click="onShowDetail(scope.row)"
            >Chi tiết
            </el-button>
            <el-button
              v-if="scope.row.status !==1"
              type="warning"
              icon="el-icon-edit"
              size="mini"
              round
              @click="handleEdit(scope.row)"
            >
              Sửa
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="handleDelete(scope.row.general_bill_id)"
            >
              Xóa
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
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
        :list-insurrance="listInsurrance"
        :is-add="isAdd"
        @clickButtonDialogAddGolfer="handleClickDialogAddGolfer"
        @openDialogDetailProduct="handleOpenDialogDetailProduct"
      />
      <dialog-detail-bill
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
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TableData'
}
</script>
