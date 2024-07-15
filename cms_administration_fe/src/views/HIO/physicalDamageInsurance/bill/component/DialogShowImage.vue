<template>
  <el-dialog
    title="Thông tin chi tiết"
    :visible.sync="dialogVisible"
    :show-close="false"
    :before-close="closeDialog"
    class="update-passport"
    width="75%"
    top="5vh"
  >
    <div style="height: 100%;">
      <el-tabs v-if="imageUrl.length > 0" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(images, index) in imageUrl" :key="index" :label="'Hố ' + images[0].name_hole" :name="images[0].name_hole">
          <el-row class="border p-10 mb-10 br-10">
            <label>Ảnh vị trí cắm cờ đỉnh hoặc sườn dốc</label>
            <el-row class="p-10">
              <el-col :span="12" class="p-10">
                <el-image
                  style="width: 100%; height: 100%;"
                  :src="images[0].img_position"
                  fit="contain"
                />
                <p>Ảnh vị trí đỉnh <span v-if="images[0].request_confirm !== 1" style="color: red">(Ảnh không đạt chuẩn)</span></p>
              </el-col>
              <el-col :span="12" class="p-10">
                <el-image
                  style="width: 100%; height: 100%;"
                  :src="images[1].img_position"
                  fit="contain"
                />
                <p>Ảnh vị trí sườn dốc <span v-if="images[1].request_confirm !== 1" style="color: red">(Ảnh không đạt chuẩn)</span></p>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="border p-10 br-10">
            <label>Khoảng cách</label>
            <el-row class="p-10">
              <el-col :span="12" class="p-10">
                <el-image
                  style="width: 100%; height: 100%;"
                  :src="images[2].img_position"
                  fit="contain"
                />
                <p>Khu vực tee box <span v-if="images[2].request_confirm !== 1" style="color: red">(Ảnh không đạt chuẩn)</span></p>
              </el-col>
              <el-col :span="12" class="p-10">
                <el-image
                  style="width: 100%; height: 100%;"
                  :src="images[3].img_position"
                  fit="contain"
                />
                <p>Bảng info <span v-if="images[3].request_confirm !== 1" style="color: red">(Ảnh không đạt chuẩn)</span></p>
              </el-col>
            </el-row>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>

import { isEmpty } from '@/utils/validate'

export default {
  name: 'DialogShowImage',
  props: {
    objectBill: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: [],
      activeName: ''
    }
  },
  watch: {
    objectBill(val) {
      console.log('val................DialogShowImage', val)
      if (isEmpty(val.ListHoleInspector)) return
      this.imageUrl = val.ListHoleInspector
      this.imageUrl = this.imageUrl.reduce((acc, cur) => {
        const index = acc.findIndex(item => item[0].name_hole === cur.name_hole)
        if (index === -1) {
          acc.push([cur])
        } else {
          acc[index].push(cur)
        }
        return acc
      }, [])
      this.activeName = this.imageUrl[0][0].name_hole

      console.log('this.imageUrl', this.imageUrl)
    }
  },
  methods: {
    showImage(url) {
      this.dialogVisible = true
      this.imageUrl = url
    },
    closeDialog() {
      this.imageUrl = []
      this.activeName = ''
      this.$emit('closeDialog')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
.br-10 {
  border-radius: 10px !important;
}
</style>
