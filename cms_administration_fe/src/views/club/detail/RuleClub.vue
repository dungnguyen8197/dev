<template>
  <el-row style="margin:20px; font-family:Sans-serif">
    <el-row>
      <el-col style="display: flex; justify-content: center;" class="mb-20" :sm="24">
        <el-image
          style="width: 400px; height: auto; min-height: 250px; max-height: 250px; border-radius: 15px;"
          :src="objectData.logo_url_path ? objectData.logo_url_path : 'https://cdn.vcallid.com/bg5.jpg'"
          onerror="this.onerror=null;this.src='https://cdn.vcallid.com/bg5.jpg';"
        />
      </el-col>
      <el-row class="title" style="font-weight: 600;">
        {{ objectData.name }}
      </el-row>
    </el-row>
    <H3>Điều lệ CLB:</H3>
    <div class="mt-30" @keydown.enter.prevent="handleEditNote">
      <!-- <el-button class="cursor">
        <i style="color: #409EFF" class="el-icon-edit" @click="handleEditNote" />
      </el-button> -->
      {{ objectData.about }}
    </div>
    <!-- <el-row>
      <el-input
        v-model="formRequest.note"
        prop="note"
        :rows="20"
        type="textarea"
        placeholder="Điều lệ"
      />
    </el-row> -->
  </el-row>
</template>

<script>
// import Pagination from '@/components/Pagination/index'
// import { formatDate, formatNumber } from '@/utils/convert'
// import AdminClubResource from '@/api/club/admin-club'

// const adminClubResource = new AdminClubResource()

export default {
  name: 'ListPartner',
  components: {
    // Pagination
  },
  props: {
    objectData: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      formRequest: {}
    }
  },
  methods: {
    handleEditNote(event) {
      console.log('event..', event)
      // if (event && event.key === 'Enter' && !event.nativeEvent.shiftKey) {
      //   event.preventDefault()
      //   alert('1')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0;
  text-align: center;
  width: 100%;
  margin: 10px 0 20px 0;
  font-weight: 700px;
  text-transform: uppercase;
}
.mb-20 {
  margin-bottom: 20px;
}
.mt-30 {
  margin-top: 30px;
}
.cursor {
  cursor: pointer;
  border: none;
}
</style>

