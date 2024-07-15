<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>Điều lệ CLB</span>
        </span>
      </template>
      <section class="tab_content">
        <rule-club
          :object-data="objectDetail"
        />
      </section>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>Danh sách thành viên</span>
        </span>
      </template>
      <section class="tab_content">
        <list-member />
      </section>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>Quỹ</span>
        </span>
      </template>
      <section class="tab_content">
        <club-fund />
      </section>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>Phòng truyền thống</span>
        </span>
      </template>
      <section class="tab_content">
        <list-image />
      </section>
    </el-tab-pane>
  </el-tabs>
</template>
<script>

import RuleClub from '@/views/club/detail/RuleClub'
import ListMember from '@/views/club/detail/ListMember'
import ClubFund from '@/views/club/detail/ClubFund'
import ListImage from '@/views/club/detail/ListImage'

import { formatNumber, convertDateTime } from '@/utils/convert'
import { trim_string_object } from '@/utils/trim-string-object'
import AdminClubResource from '@/api/club/admin-club'

const adminClubResource = new AdminClubResource()

export default {
  name: 'Detail',
  components: {
    RuleClub,
    ListMember,
    ClubFund,
    ListImage
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
    }
  },
  data() {
    return {
      loadingTable: false,
      query: { page: 1, limit: 10 },
      total: 10,
      tableData: [],
      objectDetail: {}
    }
  },
  watch: {
    objectData(value) {
      console.log('...................', value)
      if (value) {
        this.objectDetail = value
        this.onGetList()
      }
    }
  },
  created() {
    this.onGetDetail()
  },
  methods: {
    async onGetDetail() {
      this.loadingTable = true
      await this.trim_string_object(this.query)
      console.log('..........', this.query)
      adminClubResource.detail(this.$route.params.id).then(res => {
        const { error_code, data, error_msg } = res
        if (error_code === 0) {
          this.objectDetail = data
        } else {
          this.$message.error(error_msg)
        }
      }).catch(_ => {
      }).finally(() => {
        this.loadingTable = false
      })
    },
    formatNumber,
    convertDateTime,
    trim_string_object
  }
}
</script>

<style scoped>
.tab_content {
  height: 86vh;
  margin-bottom: 7px;
  overflow:auto;
}
</style>

