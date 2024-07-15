<template>
  <div id="brand-table-id">
    <el-table v-loading="loading" :data="tableData" align="center" border style="width: 100%">
      <el-table-column prop="code" label="Mã thương hiệu" width="180" align="center" />
      <el-table-column prop="logo" label="Logo" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.image ? scope.row.image : ''"
            style="width: 100px;"
            @error="handleImageError(scope.row)"
          >
          <!-- <img
            v-else
            :src="defaultLogo"
            style="width: 100px"
          > -->
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Tên thương hiệu" align="center" />
      <el-table-column prop="state" label="Trạng thái" align="center" sortable>
        <template slot-scope="scope">
          <el-tag :type="(scope.row.active === 1) ? 'success' : 'danger'">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="Hành động" width="180" align="center">
        <template v-if="is_edit" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
    </el-row>
    <DialogEditBrand v-if="showDialog" :object-data="objectRow" :show-dialog="showDialog" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ManageBrandResource from '@/api/manage_supplier/brand'
import DialogEditBrand from './DialogEditBrand.vue'

const manageBrandResource = new ManageBrandResource()
export default {
  name: 'BrandTable',
  components: { Pagination, DialogEditBrand },
  props: {
    dataSearch: {
      type: String,
      default: ''
    },
    refreshTimes: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      defaultLogo: 'https://vcallid.s3.ap-southeast-1.amazonaws.com/defaul.png', // require('@/assets/defaul.png'),
      loading: false,
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        q: ''
      },
      tableData: [],
      showDialog: false,
      objectRow: {},
      contain: 'contain',
      is_edit: 0,
      is_view: 0
    }
  },
  watch: {
    dataSearch: {
      handler(data) {
        console.log(data, 'okkkkk')
        this.listQuery = {
          page: 1,
          limit: 10,
          type_filter: data.searchType,
          active: data.state,
          q: data.searchText.trim()
        }
        this.getList()
      },
      deep: true,
      immediate: true
    },
    refreshTimes() {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.$parent.$emit('loading-table', true)
      this.getList()
    }
  },
  created() {
    this.$on('hide-edit-brand-dialog', () => {
      this.showDialog = false
    })
    this.$root.$on('update-brand-and-refresh-table', () => {
      this.getList()
    })
  },
  mounted() {
    // this.getList()
  },
  beforeDestroy() {
    this.$root.$off('update-brand-and-refresh-table')
  },
  methods: {
    loadData(is_view, is_edit) {
      this.is_view = is_view
      this.is_edit = is_edit
      console.log('.........load data ', is_view, is_edit)
      this.getList()
    },
    getList() {
      if (!this.is_view) return
      this.loading = true
      manageBrandResource
        .listBrand(this.listQuery)
        .then((res) => {
          const { error, list } = res
          if (error === 0) {
            if (this.listQuery.page === 1) {
              this.total = res.total
            }
            this.tableData = list.map((item) => {
              return {
                id: item.id,
                showImage: item.image,
                code: 'TH' + item.id,
                image: item.image,
                name: item.name,
                active: item.active,
                state: item.active ? 'Hoạt động' : 'Tạm ngừng'
              }
            })
          }
        })
        .catch((err) => {
          this.$message.error(err)
        }).finally(() => {
          this.loading = false
          this.$parent.$emit('loading-table', false)
        })
    },
    handleImageError(event) {
      event.showImage = false
    },
    handleEdit(data) {
      this.showDialog = true
      this.objectRow = data
      // console.log(data)
    }
  }
}
</script>

<style scoped></style>
