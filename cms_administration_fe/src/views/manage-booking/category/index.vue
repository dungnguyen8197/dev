<template>
  <el-row class="documentation-container">
    <el-row class="header-passport">
      <el-col :xs="24" :sm="24" class="text-center">
        <h3> Hạng Mục </h3>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button type="primary" @click="showDialogCreate">Tạo mới</el-button>
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
            align="center"
          />
          <el-table-column
            prop="name"
            label="Tên"
            align="center"
          />
          <el-table-column width="150" label="Hành động">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showDialogEdit(scope.row)"
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
    <dialog-category
      :dialog-visible="showDialog"
      :is-add="isAdd"
      :object-data="objectData"
      @onClickCloseDialog="handleCloseDialog"
    />

  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pickerOptions, selectOptions } from '@/utils/dateRangOptions'
import { actionIsConfirm, optionsFilter } from '@/utils/optionsMembership'
import { convertDate } from '@/utils/convert'
import DialogCategory from '@/views/manage-booking/category/DialogCategory.vue'
import BookingPaxResource from '@/api/BookingPax'
const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'Lists',
  components: { DialogCategory, Pagination },
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
      actions: [...actionIsConfirm],
      optionsFilter: [...optionsFilter],
      actionObject: Object.assign({}, actionIsConfirm[0]),
      showDialog: false,
      objectData: {},
      isAdd: true
    }
  },
  watch: {

  },
  mounted() {
    this.onSearchLists()
  },
  methods: {
    onSearchLists() {
      this.loading = true
      bookingPaxResource.listCategory(this.listQuery).then(response => {
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
    handleCloseDialog(object) {
      if (object.dialog) {
        this.showDialog = false
      }
      if (object.reload) {
        this.onSearchLists()
      }
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    showDialogCreate() {
      this.isAdd = true
      this.showDialog = true
      this.objectData = {}
    },
    showDialogEdit(row) {
      this.isAdd = false
      this.showDialog = true
      this.objectData = Object.assign({}, row)
      console.log(this.objectData)
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
