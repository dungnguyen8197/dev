<template>
  <div class="flex justify-between align-items-center">
    <div class="month__arrow" @click="decreaseMonth">
      <span class="icon icon-arrow-left"></span>
    </div>
    <div class="month__label">{{ year }}年{{ month }}月</div>
    <div class="month__arrow" @click="increaseMonth">
      <span class="icon icon-arrow-right"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";

@Component
export default class MonthSelect extends Vue {
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;

  @Emit('updateMonth')
  updateMonth() {
    return {
      year: this.year,
      month: this.month,
    }
  }

  decreaseMonth() {
    if (this.month === 1) {
      this.month = 12;
      this.year--;
      return;
    }
    this.month--;
    this.updateMonth();
  }

  increaseMonth() {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
      return;
    }
    this.month++;
    this.updateMonth();
  }
}
</script>

<style lang="scss" scoped>
.month {
  &__arrow {
    cursor: pointer;
    font-size: 1.6rem;
    padding: 0.6rem;
  }

  &__label {
    font-size: 1.6rem;
    width: 12rem;
    padding: 0.6rem;
  }
}
</style>
