<template>
  <div class="card school-categories">
    <h3 class="card__title text-sm">
      学校名を選択してください。
    </h3>
    <div class="card__body">
      <div class="form-select">
        <select name="line_id" @change=" event => getSchools(event.target.value)">
          <option v-for="line in lines" :value="line.value" :key="line.value">{{ line.name }}</option>
        </select>
      </div>
      <div class="form-select mt-12">
        <select name="school_id" @change="updateValue">
          <option>未選択</option>
          <option v-for="school in states.schools" :value="school.id" :key="school.id">{{ school.name }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from '@vue/runtime-core';
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_API_ROOT;

interface Line {
  name: string,
  value: number
}

interface School {
  id: number;
  name: string;
}

const lines: Line[] = [
  { name: 'すべて', value: 0 },
  { name: 'ア行', value: 1 },
  { name: 'カ行', value: 2 },
  { name: 'サ行', value: 3 },
  { name: 'タ行', value: 4 },
  { name: 'ナ行', value: 5 },
  { name: 'ナ行', value: 6 },
  { name: 'マ行', value: 7 },
  { name: 'ヤ行', value: 8 },
  { name: 'ラ行', value: 9 },
  { name: 'ワ行', value: 10 }
];

export default defineComponent({
  props: {
    region_id: {
      type: Number,
      default: 0
    },
    school_type: {
      type: Number,
      default: 0
    },
    prefecture: {
      type: Number,
      default: 0
    },
  },
  setup(props, context) {
    
    const states = reactive({
      active: 0,
      line_id: 0,
      school_id: 0,
      schools: [] as School[],
    });

    const updateValue = (event: any) => {
      
      states.school_id = event.target.value;

      context.emit('updateValue', {
        line_id: states.line_id,
        school_id: states.school_id
      })
    };

    const getSchools = async (line_id: number) => {
      states.line_id = line_id;
      let queryParams: any = {
        region_id: props.region_id,
      }

      if (props.school_type) {
        queryParams['organization_division_type_id'] = props.school_type;
      }

      if (states.line_id !== 0) {
        queryParams['name_line_id'] = states.line_id;
      }

      let schools = await axios.get(`/api/v1/organizations`, { params: queryParams });

      if (schools.data.list) {
        states.schools = schools.data.list
      }
    }

    onMounted(() => {
      getSchools(0);
    })

    return {
      lines,
      states,
      updateValue,
      getSchools
    }
  }
})
</script>

<style lang="scss" scoped>
</style>