<template>
  <el-row class="documentation-container">
    <el-row class="header-passport">
      <el-col :xs="24" :sm="24">
        <h3>Danh sách Passport</h3>
      </el-col>
      <el-col :xs="24" :sm="5" class="pr-lg-5">
        <div class="header-shop_input_search">
          <div class="search-golfer">
            <el-select
              v-model="golfModel"
              v-loading="loadingSearchUser"
              filterable
              remote
              class="w-100"
              placeholder="Nhập mã vID"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="golfer in golfers"
                :key="golfer.value"
                :label="golfer.label"
                :value="golfer"
              />
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="5" class="pr-lg-5">
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
      <el-col :xs="24" :sm="5" class="pr-lg-5">
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
      <el-col :xs="24" :sm="5" class="pr-lg-5 hidden-xs">
        <div class="block">
          <el-date-picker
            v-model="dateRange"
            class="date-rang-history"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            :picker-options="pickerOptions"
          />
        </div>
      </el-col>
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
          >
            <template slot-scope="scope">
              <template v-if="scope.row.golfer">
                {{ `VID${scope.row.golfer.id}` }}
              </template>
              <!--                            <template v-if="scope.row.certificate">-->
              <!--                                {{ `VID${scope.row.certificate.user_id}` }}-->
              <!--                            </template>-->
            </template>
          </el-table-column>
          <!--                    <el-table-column-->
          <!--                        width="150"-->
          <!--                        prop="golfer.phone"-->
          <!--                        label="Số điện thoại">-->
          <!--                    </el-table-column>-->
          <el-table-column
            prop="golfer.nickname"
            label="Nickname"
          />
          <el-table-column
            label="Tên hội viên"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.certificate">
                {{ scope.row.certificate.fullname }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="Giới tính"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.gender === 0">
                <el-tag>Nam</el-tag>
              </template>
              <template v-else-if="scope.row.gender === 1">
                <el-tag>Nữ</el-tag>
              </template>
              <template v-else>
                <el-tag>Không xác định</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="Trạng thái"
          >
            <template slot-scope="scope">
              <el-tag :type="handleConvertStatusToString(scope.row.is_confirm, true)">{{ handleConvertStatusToString(scope.row.is_confirm) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="Ngày tạo"
          />
          <el-table-column width="150" label="Hành động">
            <template slot-scope="scope">
              <el-popover
                placement="left"
                :title="(scope.row.tpye === 1) ? 'CMND' : 'Passport'"
                trigger="click"
              >
                <el-row>
                  <el-col class="passport-image">
                    <div class="images clearfix">
                      <template v-for="(image, index) in scope.row.images">
                        <img :key="index + Math.random()" width="200" height="200" style="margin-left: 10px;" :src="image" class="image">
                      </template>
                    </div>
                  </el-col>
                  <el-col style="margin-top: 20px">
                    <label>Cập nhật giới tính: </label>
                    <el-select v-model="scope.row.gender" placeholder="Giới tính" @change="onUpdateGender(scope.row)">
                      <el-option
                        v-for="item in optionsSex"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                </el-row>
                <el-button slot="reference" title="Xem ảnh" circle icon="el-icon-view" />
              </el-popover>
              <el-button :title="`Xem thông tin của hội viên`" type="primary" icon="el-icon-edit" circle @click="onShowDialogEdit(scope.row)" />
              <el-button v-show="scope.row.is_confirm !== 1" type="danger" icon="el-icon-delete" circle @click="onDeleteUserPassport(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > listQuery.limit" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="onSearchLists" />
      </el-col>
    </el-row>
    <edit :is-edit="isEdit" :obj-data="objDetail" :show-dialog="showDialog" @clickButton="handleClickButton" />
    <dialog-create-passport :show-dialog="showDialogCreatePassport" @onClickDialogCreate="handleClickCreatePassport" />
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pickerOptions, selectOptions } from '@/utils/dateRangOptions'
import { actionIsConfirm, optionsFilter, optionsSex } from '@/utils/optionsMembership'
import { convertDate } from '@/utils/convert'
import Edit from './components/Edit'
import DialogCreatePassport from './components/DialogCreatePassport'
import { setArraySelect } from '@/utils/convertArray'
import ListPassportResource from '@/api/membership/passport'
const listPassportResources = new ListPassportResource()

export default {
  name: 'Lists',
  components: { DialogCreatePassport, Edit, Pagination },
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
      golfers: [],
      actions: [...actionIsConfirm],
      optionsFilter: [...optionsFilter],
      actionObject: Object.assign({}, actionIsConfirm[0]),
      dateRange: [],
      showDialog: false,
      showDialogCreatePassport: false,
      isEdit: true,
      objDetail: {},
      visiblePopoverImage: false,
      optionsSex: [...optionsSex]
    }
  },
  watch: {
    dateRange(value) {
      this.listQuery.date_start = this.convertDate(value[0], 'YYYY-MM-DD')
      this.listQuery.date_end = this.convertDate(value[1], 'YYYY-MM-DD')
    },
    golfModel(value) {
      this.listQuery = Object.assign(this.listQuery, { user_id: value.value })
    },
    actionObject(value) {
      this.listQuery = Object.assign(this.listQuery, { is_confirm: value })
    }
  },
  mounted() {
    this.onSearchLists()
  },
  methods: {
    onDeleteUserPassport(row) {
      const fullname = (row.certificate) ? row.certificate.fullname : ''
      const id = row.id
      this.$confirm(`Bạn có chắc chắn muốn xóa Hội viên ${fullname}`)
        .then(_ => {
          this.$store.dispatch('deleteUsersPassport', id).then(response => {
            if (response.error_code === 0) {
              this.onSearchLists()
              this.$message.success(response.message)
            } else {
              this.$message.error(response.message)
            }
          })
        })
        .catch(_ => {})
    },
    onUpdateGender(row) {
      const data = { id: row.id, gender: row.gender }
      this.$store.dispatch('updateUsersPassport', data).then(response => {
        if (response.error_code === 0) {
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    onSearchLists(e) {
      if (e === 1) {
        this.listQuery.page = 1
      }
      this.loading = true
      listPassportResources.list(this.listBody, this.listQuery).then(response => {
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
          this.total = result.total
          this.from = result.from
        }
      })
    },
    onShowDialogEdit(row) {
      this.objDetail = Object.assign({}, row)
      this.showDialog = true
    },
    handleClickButton(value) {
      this.showDialog = false
      if (value) {
        this.onSearchLists()
      }
    },
    remoteMethod(keyword) {
      this.loadingSearchUser = true
      if (keyword === '' || keyword === undefined) {
        this.golfers = []
        return
      }
      const params = { keyword: keyword }
      this.$store.dispatch('searchGolferInsurance', params).then(response => {
        if (response.error_code === 0) {
          this.loadingSearchUser = false
          const result = response.data
          const array = []
          result.map(value => {
            let name = ''
            if (value.id_display) {
              name = `VID${value.id_display} - ${value.fullname} - ${value.nickname}`
            } else {
              name = `VID${value.id} - ${value.fullname} - ${value.nickname}`
            }
            const item = { value: value.id, label: name, golfer: value }
            array.push(item)
            this.golfers = [...array]
          })
        }
      })
    },
    handleConvertStatusToString(isConfirm, type = false) {
      switch (isConfirm) {
        case 1:
          return (type) ? 'success' : 'Đã xác nhận'
        case 2:
          return (type) ? 'info' : 'Chờ xác nhận'
        default:
          return (type) ? 'danger' : 'Đã từ chối'
      }
    },
    handleIndexMethod(index) {
      return this.listQuery.page === 1 ? this.listQuery.page + index : (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    convertDate,
    setArraySelect,
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
    margin:20px 20px;
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
    .header-shop_input_search
    {
        .search-golfer
        {
            .el-select--medium
            {
                width: 100%;
                margin-bottom: 20px;
            }
        }
    }
    .image-passport{
        .mt-20 {
            margin-top: 20px;
        }
    }
   .button-fix
   {
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
