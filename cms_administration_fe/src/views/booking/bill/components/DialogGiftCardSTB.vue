<template>
  <el-popover
    ref="popoverRef"
    placement="top"
    width="1050"
    trigger="click"
  >
    <el-row v-if="listGolfers.length > 0" class="data-table-content table-responsive">
      <span class="mb-20"><b>Danh sách Golfer : </b></span>
      <table class="table table-bordered" style="vertical-align: center">
        <thead>
          <tr>
            <th class="text-center col-3 vertical-middle" style="min-width: 280px">Họ tên</th>
            <th class="text-center col-1 vertical-middle" style="min-width: 280px">Tặng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(golfer, key) in listGolfers" :key="key">
            <th class="col-4 text-center">
              {{ golfer.user_id == -1 ? `(OUT) ` + golfer.name_out_system : `VID${golfer.user_id} - ` + golfer.name_out_system }}
            </th>
            <td class="text-center">
              <el-select
                v-model="listGolfers[key].code_card"
                :disabled="checkDisabled(golfer)"
                class="w-100"
                clearable
                filterable
                placeholder="Tặng lượt chơi cho bạn"
                @change="handleSelectCardByUser(key)"
              >
                <el-option
                  v-for="(item, index) of currentGolfer.card_stb.filter(item => item.offerRate === currentGolfer.code_card_stb)"
                  :key="index"
                  :label="`Tổng lượt : ${item.remainNoOfUse}  - Khuyến mại: ${item.offerRate}%`"
                  :value="item.offerRate"
                />
              </el-select>

            </td>

          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <el-button type="primary" @click="onCloseDialog">Đóng</el-button>
      </div>

    </el-row>
    <div v-else class="text-center">
      Người chơi đã có thẻ
    </div>
    <el-button slot="reference" :disabled="cardDisable" round type="primary" size="mini">Tặng bạn</el-button>
  </el-popover>
</template>

<script>

import { isEmpty } from '@/utils/validate'

export default {
  name: 'DialogGiftCardSTB',
  props: {
    currentGolfer: {
      type: Object,
      default() {
        return {}
      }
    },
    listGolfers: {
      type: Array,
      default() {
        return []
      }
    },
    cardDisable: {
      type: Boolean,
      default: false

    }
  },
  data() {
    return {
      arrayYesNo: ['Có', 'Không'],
      golfer_receive: {}
    }
  },
  watch: {
    listGolfers(value) {
    }
  },
  created() {
  },
  methods: {
    checkDisabled(golfer) {
      return false
      // const names = this.listGolfers.map(item => item)
    },
    checkGolfer(item) {
      const vids_use = this.listGolfers.filter(v => v.use_card_stb).map(v => [v.user_id, v.puid_use])
      console.log('vids_use____________', vids_use)
      if (vids_use && [].concat(...vids_use).includes(item.user_id)) {
        return false
      }
      return true
    },
    onCloseDialog() {
      this.golfer_receive = {}
      this.$refs.popoverRef.doClose()
    },

    handleSelectCardByUser(key) {
      const golfer = this.listGolfers[key]
      if (isEmpty(this.currentGolfer.use_card_stb)) {
        this.$message.warning('Bạn cần sử cho mình trước khi tặng.')
        delete golfer.code_card
        return
      }
      if (this.currentGolfer.card_stb?.find(item => item.offerRate === golfer.code_card)?.remainNoOfUse < 2) {
        this.$message.warning('Yêu cầu tối thiểu 2 lượt chơi trở lên để tặng bạn.')
        delete golfer.code_card
        return
      }
      if (isEmpty(golfer.code_card)) {
        delete golfer.code_card
        golfer.agency_id = '' // xóa đại lý STB cho người được tặng
        delete this.currentGolfer.use_card_stb.puid_use
        delete this.currentGolfer.puid_use_stb
        this.$message.success('Xóa tặng thành công .')
        console.log('this.currentGolfer____________________', this.currentGolfer)
        return
      }
      if (!isEmpty(this.currentGolfer.puid_use_stb)) {
        this.$message.warning('Tặng tối đa được 1 người .')
        delete golfer.code_card
        return
      }
      this.currentGolfer.puid_use_stb = {
        user_id: golfer.user_id,
        nameOutSystem: golfer.name_out_system
      }

      golfer.agency_id = 20 // add đại lý STB cho người được tặng
      this.currentGolfer.use_card_stb.puid_use = golfer.user_id
      console.log('this.currentGolfer____________________', this.currentGolfer)
      this.$message.success('Tặng thành công .')
    }

  }
}
</script>
<style lang="scss" scoped>

.border-1 {
  border: 1px solid #ccc;
  border-radius: 15px;
}

.pb-10 {
  padding-bottom: 10px;
}

.p-10 {
  padding: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.table>tbody>tr>th {
  vertical-align: middle !important;
}

.vertical-middle {
  vertical-align: middle !important;
}
.w-100 {
  width:100%
}
</style>
