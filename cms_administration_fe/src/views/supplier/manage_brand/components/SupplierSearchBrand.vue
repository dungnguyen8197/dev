<template>
  <div style="width: 100%; right: 0ex;">
    <div style="display: flex; flex-direction: row;">
      <el-input v-model="filterOject.searchText" style="width: 500px" type="text" :rows="2" placeholder="Nhập để tìm kiếm">
        <i slot="suffix" class="el-icon-search el-input__icon" />
      </el-input>
      <el-select v-model="filterOject.searchType" style="margin-left: 10px; width: 500px" placeholder="Tìm kiếm" @change="searchBrand()">
        <el-option
          v-for="item in searchOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="searchBrand">Tìm kiếm</el-button>
      <el-select v-model="filterOject.state" style="margin-left: 10px; width: 400px" placeholder="Trạng thái" @change="searchBrand()">
        <el-option
          v-for="item in stateOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <!-- <p style="color: #909399; font-size: small">Ex: Tên thương hiệu</p> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'SearchBrand',
      filterOject: {
        state: 0,
        searchType: 2,
        searchText: ''
      },
      stateOption: [
        { id: 0, name: 'Trạng thái(Tất cả)' },
        { id: 2, name: 'Hoạt động' },
        { id: 1, name: 'Tạm dừng' }
      ],
      searchOption: [
        { id: 2, name: 'Tìm theo tên thương hiệu' },
        { id: 1, name: 'Tìm theo mã thương hiệu' }
      ]
    }
  },
  methods: {
    searchBrand() {
      this.$parent.$emit('on-search-brand', this.filterOject)
    },
    resetFilter() {
      this.filterOject = {
        state: 0,
        searchType: 2,
        searchText: ''
      }
      this.$parent.$emit('on-search-brand', this.filterOject)
    }
  }
}
</script>

<style scoped></style>
