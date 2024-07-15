<template>
  <el-row class="documentation-container">
    <el-row class="header-passport">
      <el-col :xs="24" :sm="24">
        <h3> Biên tập khách hàng thân thiết </h3>
      </el-col>
      <el-col :xs="24" :sm="3" class="mr-10">
        <el-select
          v-model="golferID"
          filterable
          remote
          placeholder="Nhập vID"
          :remote-method="onSearchGolfer"
          style="width: 100%"
        >
          <el-option
            v-for="item in listGolfer"
            :key="item._id"
            :label="item.fullname + ' - ' + 'mã gốc ' + (item.id) + '-' + 'mã hiển thị ' + (item.id_display)"
            :value="item._id"
          />
        </el-select>
      </el-col>

      <el-col :xs="24" :sm="3" class="mr-10">
        <div class="header-shop_input_search">
          <div class="search-golfer">
            <el-select v-model="listQuery.gender" placeholder="Giới tính">
              <el-option
                v-for="item in optionsFilter"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="3" class="mr-10">
        <div class="header-shop_input_search">
          <div class="search-golfer">
            <el-select v-model="actionObject" placeholder="Trạng thái">
              <el-option
                v-for="item in actions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-col>
      <!--      <el-col :xs="24" :sm="5" class="pr-lg-5 hidden-xs">-->
      <!--        <div class="block">-->
      <!--          <el-date-picker-->
      <!--            v-model="dateRange"-->
      <!--            class="date-rang-history"-->
      <!--            type="daterange"-->
      <!--            align="right"-->
      <!--            unlink-panels-->
      <!--            range-separator="đến"-->
      <!--            start-placeholder="Ngày bắt đầu"-->
      <!--            end-placeholder="Ngày kết thúc"-->
      <!--            :picker-options="pickerOptions"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </el-col>-->
      <el-col :xs="24" :sm="4" class="text-right">
        <el-button type="primary" @click="onSearchLists(1)">Tìm kiếm</el-button>
        <el-button type="primary" @click="showDialogCreatePassport = true">Tạo mới</el-button>
      </el-col>
    </el-row>
    <el-row class="table-history">
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
          />
          <el-table-column
            label="Mã vID"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row">
                {{ `vID${scope.row.id}` }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="Nickname"
            align="center"
          />
          <el-table-column
            label="Tên hội viên"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.certificate">
                {{ scope.row.certificate.fullname }}
              </template>
            </template>
          </el-table-column>
          <el-table-column width="150" label="Hành động">
            <template slot-scope="scope">
              <el-button
                :title="`Chi tiết Golfer ${scope.row.fullname}`"
                type="warning"
                icon="el-icon-view"
                circle
                @click="onShowDialogDetailGolfer(scope.row)"
              />
              <el-button
                :title="`Xem thông tin của hội viên`"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="onShowDialogEdit(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > listQuery.limit"
          :total="total"
          :limit.sync="listQuery.limit"
          :page.sync="listQuery.page"
          @pagination="onSearchLists"
        />
      </el-col>
    </el-row>
    <dialog-detail-golfer
      :show-dialog="showDialogDetailGolfer"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseDialogDetailGolfer"
    />
    <dialog-edit-golfer
      :show-dialog="showDialogEdit"
      :obj-detail="objDetail"
      @clickButton="handleClickCloseDialogEdit"
    />
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pickerOptions, selectOptions } from '@/utils/dateRangOptions'
import { actionIsConfirm, optionsFilter, optionsSex } from '@/utils/optionsMembership'
import { convertDate } from '@/utils/convert'
import ListGolferResource from '@/api/membership/golfer'
import DialogDetailGolfer from '@/views/membership/editGolfer/components/DialogDetailGolfer.vue'
import DialogEditGolfer from '@/views/membership/editGolfer/components/DialogEditGolfer.vue'

const listGolferResources = new ListGolferResource()

export default {
  name: 'Lists',
  components: { DialogEditGolfer, DialogDetailGolfer, Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions
      },
      options: selectOptions,
      listQuery: {
        limit: 10,
        page: 1
      },
      total: 0,
      from: 0,
      tableData: [],
      loading: false,
      loadingSearchUser: false,
      golfModel: {},
      listGolfer: [],
      actions: [...actionIsConfirm],
      optionsFilter: [...optionsFilter],
      actionObject: Object.assign({}, actionIsConfirm[0]),
      dateRange: [],
      showDialog: false,
      showDialogCreatePassport: false,
      isEdit: true,
      objDetail: {},
      visiblePopoverImage: false,
      optionsSex: [...optionsSex],
      golferID: null,
      showDialogDetailGolfer: false,
      showDialogEdit: false
    }
  },
  watch: {
    dateRange(value) {
      this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD')
      this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD')
    },
    golferID(value) {
      if (value === null || value === undefined) {
        this.listQuery.id = null
      } else {
        this.listQuery.id = value
      }
      this.onSearchLists()
    },
    actionObject(value) {
      this.listQuery = Object.assign(this.listQuery, { is_confirm: value })
    }
  },
  mounted() {
    this.onSearchLists()
  },
  methods: {
    onSearchLists() {
      this.loading = true
      listGolferResources.ListGolferInfinite(this.listQuery).then(response => {
        if (response.error_code === 0) {
          this.loading = false
          const result = response.data
          if (result.data.length > 0) {
            result.data.map(row => {
              const array = []
              if (row.img_passport_front) {
                array.push(row.img_passport_front)
              }
              if (row.img_passport_back) {
                array.push(row.img_passport_front)
              }
              row.images = [...array]
            })
          }
          this.tableData = [...result.data]
          console.log('assssssss', this.tableData)

          this.total = result.total
          this.from = result.from
        }
      })
    },
    onShowDialogDetailGolfer(row) {
      this.showDialogDetailGolfer = true
      this.objDetail = Object.assign({}, row)
    },
    handleClickCloseDialogDetailGolfer(value) {
      this.showDialogDetailGolfer = false
      if (value) {
        this.onSearchLists()
      }
    },
    onShowDialogEdit(row) {
      this.objDetail = Object.assign({}, row)
      this.showDialogEdit = true
    },
    handleClickCloseDialogEdit(value) {
      this.showDialogEdit = false
      if (value) {
        this.onSearchLists()
      }
    },
    onSearchGolfer(query) {
      if (query !== '') {
        this.loadingSearch = true
        listGolferResources.searchGolfer({ q: query }).then((response) => {
          if (response.error_code === 0) {
            this.loadingSearch = true
            this.listGolfer = response.data
          }
        })
      } else {
        this.listGolfer = []
      }
    },

    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    convertDate,
    handleClickCreatePassport(value) {
      this.showDialogCreatePassport = false
      if (value) {
        this.onSearchLists()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//    @import "Styles-v6/Style-lists.scss";
.documentation-container {
  margin: 20px 20px;

  .header-passport {
    margin-bottom: 10px;

    h3 {
      margin: 0;
      padding: 7px 0;
    }

    .block {
      .date-rang-history {
        width: 100%;
      }
    }

    .text-right {
      text-align: right;

    }
  }

  .header-shop_input_search {
    .search-golfer {
      .el-select--medium {
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }

  .image-passport {
    .mt-20 {
      margin-top: 20px;
    }
  }

  .button-fix {
    margin-top: 20px;
  }
}

@media only screen and(min-width: 991px) {
  .pr-lg-5 {
    padding-right: 5px;
  }
}

@media only screen and(max-width: 768px) {
  .hidden-xs {
    display: none;
  }
}

</style>
