<template>
  <section>
    <el-select
      ref="searchAgency"
      v-model="agencyModel"
      class="w-100"
      clearable
      :size="size"
      filterable
      remote
      reserve-keyword
      placeholder="Tìm kiếm đại lý"
      @change="handleSelectionChange"
      @hook:mounted="(value) => cancelReadOnly(value, 'searchAgency')"
      @visible-change="(value) => cancelReadOnly(value, 'searchAgency')"
    >
      <el-option v-for="agency in agencies" :key="agency.value" :label="agency.label" :value="agency" />
    </el-select>
  </section>
</template>

<script>
import AgencyResource from '@/api/agency/agency'

const agencyResource = new AgencyResource()

export default {
  name: 'SearchAgency',
  props: {
    clearData: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      agencyModel: null,
      agencies: [],
      loadingSearchAgency: false
    }
  },
  watch: {
    clearData(val) {
      console.log('val.........', val)
      if (val) {
        this.agencyModel = {}
        this.agencies = []
      }
      console.log(this.agencyModel, this.agencies)
    }

  },
  created() {
    this.onSearchAgency()
  },
  methods: {

    onSearchAgency() {
      agencyResource.searchAgency().then(res => {
        if (res.error_code === 0) {
          const result = res.data
          if (result.length > 0) {
            this.agencies = result.map(value => {
              return { value: value.id, label: value.name }
            })

            this.agencies.unshift({ value: -1, label: 'Khách lẻ' })
          } else {
            this.agencies = []
          }
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleSelectionChange(val) {
      this.$emit('selection-changed-agency', this.agencyModel)
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
