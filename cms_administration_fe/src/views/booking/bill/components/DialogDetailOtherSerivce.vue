<template>
  <el-dialog title="Chi tiết sản phẩm" :visible.sync="showDialog" width="40%" :before-close="handleClose">
    <div
      v-loading="loadingDialog"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-row class="p-10 border-1 pb-10 mb-10 other-service">
        <el-row v-if="isData" class="dialog-add-golfer pb-10">
          <el-col class="p-10 " :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-image class="w-100" :src="objectData.thumb" :preview-src-list="objectData.images" />
          </el-col>
          <el-col class="p-10" :xs="24" :sm="24" :md="24" :lg="12" :xl="11">
            <div>
              <h3 class="name_product">{{ objectData.name }}</h3>
            </div>
            <div>
              <span>Mã đơn hàng : <el-tag>{{ objectData.product_code }}</el-tag></span>
            </div>
            <div>
              <span class="price_sale">{{ formatNumber( objectData.price_sale) }} đ</span>
              <span v-if="objectData.price_sale < objectData.price" class="price">{{ formatNumber( objectData.price) }} đ</span>
            </div>
            <!-- <div v-if="objectData['color_new'] && objectData['color_new'].length > 0 " class="mt-10"> -->
            <div v-if="objectData.name_param_first" class="mt-10">
              <span> {{ objectData.name_param_first }} :
                <el-tag
                  v-for="item in objectData.sizes"
                  :key="item"
                  style="cursor: default;"
                  :type="bodyRequest.size == item ? 'success' : 'info'"
                  effect="plain"
                  @click="addSize(item)"
                >
                  {{ item }}
                </el-tag>
              </span>

            </div>
            <!-- <div v-if="objectData['color_new'] && objectData['size_new'].length > 0" class="mt-10"> -->
            <div v-if="objectData.name_param_second" class="mt-10">
              <span> {{ objectData.name_param_second }} :
                <el-tag
                  v-for="item in objectData.colors"
                  :key="item"
                  style="cursor: default;"
                  :type="bodyRequest.color == item ? 'success' : 'info'"
                  effect="plain"
                  @click="addColor(item)"
                >
                  {{ item }}
                </el-tag>
              </span>

            </div>
            <div class="mt-10">
              <span>Số lượng  </span>
              <el-input-number
                v-model="bodyRequest.quantity"
                :min="1"
                :step="1"
              />
            </div>
          </el-col>

        </el-row>

      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingSubmit" @click="onSubmitAddProduct">Thêm mới</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { formatNumber } from '@/utils/convert'
import BookingPaxResource from '@/api/BookingPax'
import { isEmpty } from '@/utils/validate'

const bookingPaxResource = new BookingPaxResource()

export default {
  name: 'DialogDetailOtherService',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
      value: false
    },
    serviceId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      isData: false,
      objectData: {},
      bodyRequest: {
        quantity: 1
      },
      loadingSubmit: false,
      loadingDialog: false
    }
  },
  watch: {
    serviceId(value) {
      if (value > 0) {
        this.bodyRequest = {
          quantity: 1
        }
        this.onGetDetail(value)
      }
    }
  },
  created() {
  },
  methods: {
    formatNumber,
    onGetDetail(id) {
      this.loadingDialog = true
      bookingPaxResource.detailProduct({ id: id }).then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.error === 0) {
            const data = result.info
            console.log('............................ info san pham: ', JSON.stringify(data))
            // data.name_param_second =
            if (data.name_param_first) {
              data.sizes = data.size.split(',')
              data.sizes = data.sizes.map(d => d.trim())
              // const size = ['Size', 'size', 'kích thước', 'Kích thước', 'Kích cỡ']
              // const dataSize = size.includes(data.name_param_first) ? data['size'].split(',') : data['color'].split(',')
              // data.size_new = dataSize?.filter(item => !isEmpty(item))
            }
            if (data.name_param_second) {
              data.colors = data.color.split(',') || []
              data.colors = data.colors.map(d => d.trim())
              // const color = ['Color', 'Màu', 'Màu sắc', 'color']
              // const dataColor = color.includes(data.name_param_second) ? data['color'].split(',') : data['size'].split(',')
              // data.color_new = dataColor?.filter(item => !isEmpty(item))
            }
            // data.size_new = !isEmpty(data['color']) ? data['color'].split(',') : []
            // data.color_new = !isEmpty(data['size']) ? data['size'].split(',') : []
            // console.log('data.size_new ', data.size_new)
            // console.log('data.color_new ', data.color_new)

            this.objectData = data
            this.bodyRequest = {
              ...this.bodyRequest,
              price: data.price_sale,
              name_product: data.name,
              product: data
            }
          }
        }

        this.isData = true
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    addColor(value) {
      console.log(value)
      this.bodyRequest = { ...this.bodyRequest, color: value }
    },
    addSize(value) {
      console.log(value)
      this.bodyRequest = { ...this.bodyRequest, size: value }
    },

    async onSubmitAddProduct() {
      const validate = await this.validateFrom()
      if (validate) {
        this.$message.warning(validate)
        return
      }
      this.$emit('clickButtonDialogDetailService', this.bodyRequest)
      this.resetDataModal()
    },
    async validateFrom() {
      if ((this.objectData?.colors?.length > 0 && isEmpty(this.bodyRequest.color)) || (this.objectData?.sizes?.length > 0 && isEmpty(this.bodyRequest.size))) {
        return 'Bạn cần chọn đủ thuộc tính sản phẩm'
      }
      return null
    },
    resetDataModal() {
      this.objectData = {}
      this.bodyRequest = {
        quantity: 1
      }
    },
    async handleClose() {
      const text = `Sản phẩm sẽ bị xóa sau khi thoát. Bạn có chắc chắn muốn thoát!`
      if (confirm(text) === true) {
        this.$emit('clickButtonDialogDetailService', { remove_product: true })
        this.resetDataModal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.name_product {
  font-size: 20px;
  font-weight: 700px;

}
.price {
  color: #727171;

  font-size: 20px;
  font-weight: 700px;
  margin-left: 20px;

  text-decoration-line:line-through
}
.price_sale{
  color: black;
  font-size: 20px;
  font-weight: 700px;
}
.dialog-add-golfer {
  .mb-10 {
    margin-bottom: 10px;
  }

  .mt-10{
    margin-top: 10px;
  }
  .clearfix-10 {
    height: 10px;
    clear: both;
  }

  .w-100 {
    width: 100%;
  }
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 10px;
}

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
.el-dialog{
  border: 1px solid #535353 !important;
  border-radius: 10px !important;
}
</style>
