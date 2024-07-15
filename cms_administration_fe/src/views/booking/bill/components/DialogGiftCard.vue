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
            <th class="text-center col-3 vertical-middle" style="min-width: 180px">Tên</th>
            <th scope="col" class="text-center" style="min-width: 180px">Chọn thẻ tặng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(golfer, key) in listGolfers" :key="key">
            <th style="text-align: left" class="col-4">
              {{ golfer.user_id == -1 ? `(OUT) ` + golfer.name_out_system : `VID${golfer.user_id} - ` + golfer.name_out_system }}
            </th>
            <td>
              <el-select
                v-model="listGolfers[key].code_card"
                class="w-100"
                clearable
                filterable
                placeholder="Chọn lượt chơi muốn tặng"
                @change="handleSelectCardByUser(key)"
              >
                <el-option
                  v-for="item in currentGolfer.happy_golf_card"
                  :key="item.Code"
                  :disabled="item.Code === currentGolfer.code_card || item.Status !== 'ACTIVE'"
                  :label="`Code : ${item.Code} - Ngày hết hạn : ${item.ExDate}`"
                  :value="item.Code"
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
    <el-button slot="reference" round type="primary" size="mini">Tặng bạn</el-button>
  </el-popover>
</template>

<script>

import { isEmpty } from '@/utils/validate'

export default {
  name: 'DialogGiftCard',
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
    }
  },
  data() {
    return {
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
    onCloseDialog() {
      this.golfer_receive = {}
      this.$refs.popoverRef.doClose()
    },
    handleSelectCardByUser(key) {
      const golfer = this.listGolfers[key]
      if (isEmpty(golfer.code_card)) {
        delete golfer.code_card
        delete this.currentGolfer.use_card_puid
        this.$message.success('Xóa tặng thành công .')
        console.log('this.currentGolfer____________________', this.currentGolfer)
        return
      }
      if (this.currentGolfer.use_card_puid) {
        this.$message.warning('Tặng tối đa được 1 người .')
        delete golfer.code_card
        return
      }
      const card = this.currentGolfer.happy_golf_card.find(item => item.Code.toString() === golfer.code_card.toString())
      if (!isEmpty(card)) {
        this.currentGolfer.use_card_puid = {
          user_id: golfer.user_id,
          code: card.Code,
          // id: card.id,
          user_name: this.currentGolfer.name_out_system,
          TimesReg: card.ExDate,
          CustomerName: this.currentGolfer.info_card.CustomerName,
          Phone: this.currentGolfer?.phone,
          nameOutSystem: golfer.name_out_system
        }
        this.$message.success('Tặng thành công .')
      }
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
