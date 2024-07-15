<template>
  <div class="card school-categories">
    <h3 class="card__title text-sm text-center">
      学校区分を選択してください。
    </h3>
    <div class="card__body flex justify-center flex-wrap">
      <button v-for="button in states.buttons" 
        class="btn btn-small" :class="[states.active == button.id ? 'btn-secondary' : '']"  @click="updateValue($event, button.id)" :key="button.id"
      >
        {{ button.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/runtime-core';
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_API_ROOT;

export default defineComponent({
  setup(props, context) {

    const states = reactive({
      buttons: [
        { name: 'すべて', id: 0},
      ],
      active: -1
    })
    
    const updateValue = (event: any, value: any) => {
      states.active = value;
      context.emit('updateValue', {
        schoolType: parseInt(value)
      })
    }

    const getSchoolTypes = async () => {
      let schoolTypes = await axios.get(`api/v1/organization/type/1/divisions`);
      if (schoolTypes.data.divisions) {
        states.buttons = [...states.buttons, ...schoolTypes.data.divisions];
      }
    }
    
    onMounted(() => {
      getSchoolTypes();
    })
    
    return {
      states,
      updateValue
    }
  }
})
</script>

<style lang="scss" scoped>
button {
  margin: 6px;
}
</style>