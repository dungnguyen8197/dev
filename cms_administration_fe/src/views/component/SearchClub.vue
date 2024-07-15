<template>
  <section>
    <el-select
      ref="searchClub"
      v-model="clubModel"
      class="w-100"
      filterable
      remote
      clearable
      reserve-keyword
      placeholder="Tìm kiếm câu lạc bộ/Doanh nghiệp  "
      :remote-method="onSearchClub"
      :loading="loadingSearchClub"
      @change="handleSelectionChange"
      @hook:mounted="(value) => cancelReadOnly(value, 'searchClub')"
      @visible-change="(value) => cancelReadOnly(value, 'searchClub')"
    >
      <el-option v-for="club in clubs" :key="club.value" :label="club.label" :value="club" />
    </el-select>
  </section>
</template>

<script>
import ClubResource from '@/api/club/admin-club'

const clubResource = new ClubResource()

export default {
  name: 'SearchUser',
  data() {
    return {
      clubModel: null,
      clubs: [],
      loadingSearchClub: false
    }
  },
  methods: {
    onSearchClub(keyword) {
      clubResource.search({ keyword: keyword }).then(res => {
        const result = res.data
        if (res.error_code === 0) {
          if (result.length > 0) {
            this.clubs = result.map(value => {
              return { value: value.id, label: value.name }
            })
            console.log('this.clubs_______________________', this.clubs)
          } else {
            this.clubs = []
          }
          this.loadingSearchClub = false
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },
    handleSelectionChange(val) {
      this.$emit('selection-changed-club', this.clubModel)
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
