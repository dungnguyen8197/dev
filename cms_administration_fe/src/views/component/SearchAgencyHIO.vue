<template>
  <section>
    <el-select
      ref="searchAgencyHio"
      v-model="agencyModel"
      filterable
      clearable
      :size="size"
      remote
      class="w-100"
      placeholder="Chọn đại lý HIO"
      :remote-method="onSearchAgent"
      :loading="loadingSearchAgency"
      @change="handleSelectionChange"
      @hook:mounted="(value) => cancelReadOnly(value, 'searchAgencyHio')"
      @visible-change="(value) => cancelReadOnly(value, 'searchAgencyHio')"
    >
      <el-option
        v-for="agent in agencies"
        :key="agent.id"
        :label="agent.name + ' - ' + agent.code_agent"
        :value="agent"
      />
    </el-select>
  </section>
</template>

<script>
import AgentHIOResource from '@/api/HIO/agentHIO'
const agentHIOResource = new AgentHIOResource()

export default {
  name: 'SearchAgencyHIO',
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
  created() {
    this.onSearchAgent()
  },
  methods: {
    onSearchAgent(keywords) {
      console.log('keywords', keywords)
      this.loadingSearchAgent = true
      agentHIOResource.searchAgentNew({ keyword: keywords }).then(res => {
        console.log('res', res)
        res = res.data
        if (res.error_code === 0) {
          res.data = res.data.map(value => {
            return { id: value.id, name: value.name, code_agent: value.code_agent, label: value.name + ' - ' + value.code_agent, value: value }
          })

          this.agencies = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        console.log('this.agencies', this.agencies)
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.loadingSearchAgent = false
    },
    handleSelectionChange(val) {
      this.$emit('selection-changed-agency-hio', this.agencyModel)
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
