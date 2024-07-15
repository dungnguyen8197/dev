<template>
  <el-dialog
    :title="`Chi tiết Golfer: ${objData.fullname} (vID${objData.id})`"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="80%"
  >
    <div style="padding: 20px">
      <el-row class="row">
        <el-col :span="5">
          <el-row class="padding-style">
            <el-col :span="10"><b>Tên hội viên:</b></el-col>
            <el-col :span="14">
              <span>{{ tableData.fullname }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Ngày sinh:</b></el-col>
            <el-col :span="14" :offset="0">
              <span>{{ convertDate(tableData.birthday) }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Giới tính:</b></el-col>
            <el-col :span="14" :offset="0">
              <span v-if="tableData.gender === 0">Nam </span>
              <span v-if="tableData.gender === 1">Nữ </span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Số điện thoại:</b></el-col>
            <el-col :span="14" :offset="0">
              <span>{{ tableData.phone }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10"><b>Số CCCD/Passport:</b></el-col>
            <el-col :span="14">
              <template v-if="tableData.passport">
                <span>{{ tableData.passport.number_passport }}</span>
              </template>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Ngày Cấp:</b></el-col>
            <el-col v-if="tableData.passport" :span="14" :offset="0">
              <span>{{ convertDate(tableData.passport.date_of_issue) }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Ngày hết hạn:</b></el-col>
            <el-col v-if="tableData.passport" :span="14" :offset="0">
              <span>{{ convertDate(tableData.passport.date_of_expiry) }}</span>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="5">
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Tay thuận:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span v-if=" tableData.extraFields.preferred_hand === 0"> Tay Phải </span>
              <span v-else> Tay Trái </span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Size găng tay:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span>{{ tableData.extraFields.size_span }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Size áo:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span>{{ tableData.extraFields.size_coat }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Size quần:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span>{{ tableData.extraFields.size_pants }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Size giầy:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span>{{ tableData.extraFields.size_shoes }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Size mũ:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span>{{ tableData.extraFields.size_hat }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Size tất:</b></el-col>
            <el-col v-if="tableData.extraFields" :span="14" :offset="0">
              <span>{{ tableData.extraFields.size_socks }}</span>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="5">
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Gậy Driver:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.stick_driver">{{ tableData.equipment.stick_driver.name }} </span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Gậy gỗ:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.wood">{{ tableData.equipment.wood.name }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Gậy kỹ thuật:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.technical">{{ tableData.equipment.technical.name }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Gậy Hybrid:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.stick_hybird">{{ tableData.equipment.stick_hybird.name }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Gậy bộ đánh sắt:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.stick_iron">{{ tableData.equipment.stick_iron.name }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Plutter:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.stick_putter">{{ tableData.equipment.stick_putter.name }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-col :span="10" :offset="0"><b>Hãng bóng:</b></el-col>
            <el-col v-if="tableData.equipment" :span="14" :offset="0">
              <span v-if="tableData.equipment.ball">{{ tableData.equipment.ball.name }}</span>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="8">
          <el-row>
            <el-col :span="10"><b>Ảnh CCCD/Passport mặt trước</b></el-col>
            <el-col :span="14">
              <template v-if="tableData.passport">
                <img
                  width="200"
                  height="200"
                  style="margin-left: 10px;"
                  :src="tableData.passport.img_passport_front"
                  class="image"
                >
              </template>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10"><b>Ảnh CCCD/Passport mặt sau</b></el-col>
            <el-col :span="14">
              <template v-if="tableData.passport">
                <img
                  width="200"
                  height="200"
                  style="margin-left: 10px;"
                  :src="tableData.passport.img_passport_back"
                  class="image"
                >
              </template>
            </el-col>
          </el-row>
          <!--        <el-col>-->
          <!--          <el-col :span="10"><b>Ảnh chân dung</b></el-col>-->
          <!--          <el-col :span="14">-->
          <!--            <template v-if="tableData.system_avatar_path">-->
          <!--              <img :src="tableData.system_avatar_path" alt="" style="width: 100%; height: auto">-->
          <!--            </template>-->
          <!--          </el-col>-->
          <!--        </el-col>-->
        </el-col>
      </el-row>
    </div>

  </el-dialog>
</template>

<script>
// import Vue from 'vue'
import ListGolferResource from '@/api/membership/golfer'
import { convertTypeAccount } from '@/utils/convertNumberToString'
import { convertDateTimeSecond1, convertDate } from '@/utils/convert'
// Vue.use(Viewer)
const listGolferResources = new ListGolferResource()
export default {
  name: 'DialogDetailGolfer',
  components: {},
  props: {
    objDetail: {
      type: Object,
      default: () => {
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      from: 1,
      total: 1,
      objData: {},
      options: {
        inline: true,
        button: true,
        navbar: true,
        title: true,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        url: 'data-source'
      },
      dateC: '',
      images: []
    }
  },
  watch: {
    objDetail(value) {
      if (value) {
        this.listQuery = { id: value.id }
        this.onGetHistoryUpgradeAccount()
        this.objData = Object.assign({}, value)
      }
    },
    showDialog(value) {
      this.dialogVisible = value
    }
  },
  methods: {
    onGetHistoryUpgradeAccount() {
      listGolferResources.detailGolfer(this.listBody, this.listQuery).then(response => {
        if (response.error_code === 0) {
          // const result = response.data
          this.tableData = response.data
          console.log('aaaaaaa', this.tableData.passport)
        }
        const date = new Date()
        this.dateC = convertDateTimeSecond1(date)
      })
    },
    handleConvertType(type) {
      switch (type) {
        case 0:
          return 'Tài khoản thường'
        case 1:
          return 'Tài khoản VIP'
        case 2:
          return 'Tài khoản Member'
        default:
          return 'Tài khoản Premium'
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$emit('clickButton', false)
      done()
    },
    indexMethod(index) {
      return index + this.from
    },
    inited(viewer) {
      this.$viewer = viewer
    },
    convertTypeAccount,
    convertDateTimeSecond1,
    convertDate
  }
}
</script>

<style scoped>
.w-100 {
  width: 80%;
}

.padding-style {
  padding-bottom: 15px;
}
</style>
