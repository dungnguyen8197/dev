<template>
  <section>
    <el-select
      ref="searchGolfer"
      v-model="golferModel"
      class="w-100"
      filterable
      remote
      :size="size"
      clearable
      reserve-keyword
      placeholder="Tìm kiếm mã VID"
      :remote-method="onSearchGolfer"
      :loading="loadingSearchUser"
      @change="handleSelectionChange"
      @hook:mounted="(value) => cancalReadOnly(value, 'searchGolfer')"
      @visible-change="(value) => cancalReadOnly(value, 'searchGolfer')"
    >
      <el-option v-for="user in users" :key="user.value" :label="user.label" :value="user" />
    </el-select>
  </section>
</template>

<script>
import GolferResource from '@/api/golfer/golfer'
import { isEmpty } from '@/utils/validate'

const golferResource = new GolferResource()

export default {
  name: 'SearchUser',
  props: {
    clearData: {
      type: Boolean,
      default: false
    },
    object: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: String,
      default: 'medium'
    },
    dataModel: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataDefault: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      golferModel: {},
      users: [],
      loadingSearchUser: false
    }
  },
  watch: {
    clearData(val) {
      console.log('val.....................clear                vào đây', val)
      if (val) {
        this.golferModel = {}
        this.users = []
      }
    },

    dataModel(val) {
      console.log('val.....................dataModel', isEmpty(val), val)
      if (!isEmpty(val)) {
        console.log('tại sao lại vào đây..............................', !isEmpty(val))
        this.golferModel = {
          value: val._id,
          label: `VID${val._id} - ${val.fullname}`
        }
        this.users = [this.golferModel]
        console.log('this.golferModel', this.golferModel)
      } else {
        this.golferModel = {}
        this.users = []
      }
    },
    dataDefault(val) {
      if (!isEmpty(val)) {
        this.users = [...val]
        console.log('this.users........', this.users)
      }
    }
  },
  methods: {
    cancalReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    },
    onSearchGolfer(keyword) {
      golferResource.searchGolfer({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.users = result.map(value => {
              const label = `VID${value.id} - ${value.fullname}`
              return { value: value.id, label: label }
            })
          } else {
            this.users = []
          }
          this.loadingSearchUser = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleSelectionChange(val) {
      console.log(this.golferModel)
      this.$emit('selection-changed-user', this.golferModel)
    }
  }
}

</script>
