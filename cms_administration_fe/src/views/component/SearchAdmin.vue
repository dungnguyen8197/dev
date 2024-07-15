<template>
  <section>
    <el-select
      ref="searchAdmin"
      v-model="adminModel"
      class="w-100"
      clearable
      filterable
      :size="size"
      remote
      reserve-keyword
      placeholder="Tìm kiếm Admin"
      :remote-method="onSearchAdmin"
      :loading="loadingSearchAdmin"
      @change="handleSelectionChange"
      @hook:mounted="(value) => cancalReadOnly(value, 'searchAdmin')"
      @visible-change="(value) => cancalReadOnly(value, 'searchAdmin')"
    >
      <el-option v-for="admin in admins" :key="admin.id" :label="admin.name" :value="admin.id" />
    </el-select>
  </section>
</template>

<script>
import AccountResource from '@/api/account'

const adminResource = new AccountResource()

export default {
  name: 'SearchAdmin',
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
      adminModel: null,
      admins: [],
      loadingSearchAdmin: false
    }
  },
  methods: {
    onSearchAdmin(keyword) {
      adminResource.Lists({ name: keyword }).then(res => {
        console.log('res...............', res)
        this.admins = res?.data?.data || []
        console.log('this.admins...............', this.admins)
      }).finally(() => {
        this.loadingSearchAdmin = false
      })
    },
    handleSelectionChange(val) {
      this.$emit('selection-changed-admin', this.adminModel)
    },
    cancalReadOnly(onOff, ref) {
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
