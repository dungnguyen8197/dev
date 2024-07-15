<template>
  <el-row class="redeem-promotional-code">
    <el-row class="redeem-promotional-code_form_search">
      <el-col :sm="4" class="mobile-mr-bottom" style="padding-right: 16px">
        <div class="search-golfer">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Nhập mã vID"
            clearable
            @input="onSearchGolfer"
          />
        </div>
      </el-col>
      <el-col :sm="4" class="mobile-mr-bottom">
        <el-select
          v-model="listQuery.type"
          class="select-status w-100 pr-10"
          placeholder="Loại tài khoản"
          @change="onFilterGolfer()"
        >
          <el-option
            v-for="(item, index) in arrayTypes"
            :key="index + 1"
            :label="item"
            :value="index + 1"
          />
        </el-select>
      </el-col>
      <el-col :sm="8" class="text-right">
        <el-button type="primary" icon="el-icon-refresh" @click="onRefreshSearch">Reset</el-button>
      </el-col>
    </el-row>
    <!--    <el-row class="mb-10">-->
    <!--      <el-button type="primary" @click="onShowDialog">Thêm mới</el-button>-->
    <!--    </el-row>-->
    <el-row class="table-data">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="handleIndexMethod"
          label="STT"
          width="50"
        />
        <el-table-column
          prop="name"
          label="VID"
        >
          <template slot-scope="scope">
            {{ `VID${scope.row.user_id}` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Golfer"
        >
          <template slot-scope="scope">
            {{ scope.row.fullname }}
          </template>
        </el-table-column>
        <!--                <el-table-column-->
        <!--                    prop="phone"-->
        <!--                    label="Số điện thoại">-->
        <!--                </el-table-column>-->
        <el-table-column
          label="Loại tài khoản"
        >
          <template slot-scope="scope">
            {{ arrayTypes[scope.row.type -1] }}
          </template>
        </el-table-column>
        <el-table-column
          label="Hạn loại tài khoản"
        >
          <template slot-scope="scope">
            {{ scope.row.expried_time }}
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày tạo"
        >
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > listQuery.limit"
        :total="total"
        :limit.sync="listQuery.limit"
        :page.sync="listQuery.page"
        @pagination="onGetListUpgrade"
      />

      <dialog-upgrade-type-account
        :object-edit="objectData"
        :show-dialog="showDialog"
        @handleClickCloseDialog="onCloseDialog"
      />
    </el-row>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import DialogUpgradeTypeAccount from './component/DialogUpgradeTypeAccount'
import ListGolferResource from '@/api/membership/golfer'
const listGolferResources = new ListGolferResource()

const arrayTypes = [
  'Member Profestional ',
  'Member Junior',
  'Member MGA',
  'Member MGA',
  'Member sân',
  'Member Reference',
  'Free trọn đời'
]
export default {
  name: 'UpgradeFreeVGA',
  components: { Pagination, DialogUpgradeTypeAccount },
  data() {
    return {
      objectData: {},
      golferID: '',
      loadingSearchUser: false,
      golfers: [],
      status: 0,
      arrayTypes: [...arrayTypes],
      tableData: [],
      showDialog: false,
      listQuery: {
        limit: 20, page: 1, keyword: null, type: null
      },
      from: 1,
      total: 0
    }
  },
  created() {
    this.onGetListUpgrade()
  },
  methods: {
    onGetListUpgrade() {
      listGolferResources.listUpgradeTypeAccount(this.listQuery).then(response => {
        console.log(response)
        const result = response.data.data
        this.tableData = [...result.data]
        this.total = result.total
        this.form = result.from
        this.loadingSearchUser = false
      })
    },
    onShowDialogEdit(row) {
      this.objectData = Object.assign({}, row)
      this.showDialog = true
    },
    onShowDialog() {
      this.showDialog = true
    },
    onCloseDialog(value) {
      this.showDialog = false
      if (value) {
        this.onGetListUpgrade()
      }
    },
    onSearchGolfer() {
      if (this.listQuery.keyword === '' || this.listQuery.keyword === undefined) {
        this.golfers = []
        return
      }
      this.loadingSearchUser = true
      this.onGetListUpgrade()
    },
    onFilterGolfer() {
      this.listQuery.keyword = null
      this.listQuery.page = 1
      this.onGetListUpgrade()
    },
    onDeleteUser(id, vga) {
      this.$confirm(`Bạn có chắc chẳn muốn xóa khuyến mãi cho vID${vga}?`)
        .then(_ => {
          this.$store.dispatch('deleteUpgradeVgaFree', id).then(response => {
            this.loadingForm = false
            if (response.error_code === 0) {
              this.onGetListUpgrade()
              this.$message.success(response.message)
            } else if (response.error_code === 2) {
              this.$message.error(response.message)
            } else {
              this.$message.error(response.message)
            }
          })
        })
        .catch(_ => {
        })
    },
    onRefreshSearch() {
      this.listQuery = Object.assign({}, { limit: 10, page: 1 })
      this.golferID = ''
      this.typeAccount = -1
      this.onGetListUpgrade()
    },
    handleIndexMethod(index) {
      return this.from + index
    }
  }
}
</script>

<style lang="scss" scoped>
.redeem-promotional-code {
  margin: 10px;

  .w-100 {
    width: 100%;
  }

  .pr-10 {
    padding-right: 10px;
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  .text-right {
    text-align: right;
  }

  .redeem-promotional-code_form_search {
    margin: 10px 0;
  }
}

@media only screen and (max-width: 580px) {
  .redeem-promotional-code {
    .pr-10 {
      padding: 0;
    }

    .mobile-mr-bottom {
      margin-bottom: 10px;
    }
  }
}
</style>
