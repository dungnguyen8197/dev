<template>
  <section>
    <el-select
      ref="searchFacility"
      v-model="facilityModel"
      class="w-100"
      clearable
      filterable
      :size="size"
      remote
      reserve-keyword
      placeholder="Tìm kiếm sân golf"
      :remote-method="onSearchFacility"
      :loading="loadingSearchFacility"
      @change="handleSelectionChange"
      @hook:mounted="(value) => cancelReadOnly(value, 'searchFacility')"
      @visible-change="(value) => cancelReadOnly(value, 'searchFacility')"
    >
      <el-option v-for="facility in facilities" :key="facility.value" :label="facility.label" :value="facility" />
    </el-select>
  </section>
</template>

<script>
import FacilityResource from '@/api/facility/facility'
import { isEmpty } from '@/utils/validate'

const facilityResource = new FacilityResource()

export default {
  name: 'SearchFacility',
  props: {
    clearData: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      facilityModel: null,
      facilities: [],
      loadingSearchFacility: false
    }
  },
  watch: {
    clearData(val) {
      console.log('val.........', val)
      if (val) {
        this.facilityModel = {}
        this.facilities = []
      }
      console.log(this.facilityModel, this.facilities)
    },
    dataModel(val) {
      console.log('val.............editttttttttttttttttttttt........dataModel', isEmpty(val), val)
      if (!isEmpty(val)) {
        console.log('tại sao lại vào đây..............................', !isEmpty(val))
        this.facilityModel = {
          value: val.id,
          label: val.label
        }
        this.facilities = [this.facilityModel]
        console.log('this.facilityModel cos data ..........................', this.facilityModel)
      } else {
        console.log('vào đây..............................', isEmpty(val))
        this.facilityModel = {}
        this.facilities = []
        console.log('this.facilityModel', this.facilityModel)
        console.log('this.facilities', this.facilities)
      }
    }
  },
  methods: {
    onSearchFacility(keyword) {
      console.log('keyword......................', keyword)
      facilityResource.listFacility({ title: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.facilities = result.map(value => {
              return { value: value.id, label: value.sub_title, booking: value.booking, path: value.paths }
            })
          } else {
            this.facilities = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleSelectionChange(val) {
      this.$emit('selection-changed-facility', this.facilityModel)
    },
    cancelReadOnly(onOff, ref) {
      this.$nextTick(() => {
        if (!onOff) {
          const select = this.$refs[ref]
          const input = select.$el.querySelector('.el-input__inner')
          input.removeAttribute('readonly')
        }
      })
    }
  }
}

</script>
