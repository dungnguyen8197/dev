<template>
  <div class="card region">
    <h3 class="card__title text-sm">
      地域を選択してください。
    </h3>
    <div class="card__body">
      <div class="form-select">
        <select name="region_group_id" @change="updateValue">
          <option :value="0">未選択</option>
          <option v-for="region in states.regions" :value="region.region_group_id" :key="region.region_group_id">
            {{ region.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/runtime-core';
import axios from 'axios';

interface Region {
  region_group_id: number, name: string, list: []
}

interface States {
  regions: Region[]
}

export default defineComponent({
  setup(props, context) {
    const states = reactive<States>({
      regions: []
    });

    const updateValue = (event: any) => {
      context.emit('updateValue', {
        regionName:  states.regions[event.target.value - 1] ? states.regions[event.target.value - 1].name : '',
        region: parseInt(event.target.value),
        prefectures: states.regions[event.target.value - 1] ? states.regions[event.target.value - 1].list : []
      })
    }
    
    const getRegions = async () => {
      axios.defaults.baseURL = process.env.VUE_API_ROOT;
      let regions = await axios.get(`/api/v1/regions`);
      if (regions.data.groups) {
        states.regions = regions.data.groups
      }
    }
    
    onMounted(() => {
      getRegions();
    })
    
    return {
      states,
      updateValue,
    }
  }
})
</script>

<style lang="scss" scoped>
</style>