<template>
  <div class="card prefecture">
    <h3 class="card__title text-sm">
      都道府県を選択してください。
    </h3>
    <div class="card__body">
      <div class="form-select">
        <select name="prefecture_id" @change="updateValue">
          <option>未選択</option>
          <option v-for="prefecture in prefectures" :value="prefecture.id" :key="prefecture.id" :selected="value === prefecture.id">
            {{ prefecture.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
  props: {
    prefectures: [Object],
    value: Number,
  },
  setup(props, context) {
    const updateValue = (event: any) => {
      context.emit('updateValue', {
        prefecture: parseInt(event.target.value)
      })
    }
    return {
      updateValue
    }
  }
})
</script>

<style lang="scss" scoped>
</style>