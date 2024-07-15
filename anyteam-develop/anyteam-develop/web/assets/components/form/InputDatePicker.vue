<template>
  <div :id="inputId" :class="className">
    <div class="form-group__select-wrap mr-30">
      <select
        class="form-group__base form-group__select"
        v-model="year"
        @change="handleChange"
      >
        <option 
          v-for="yearOption in years" :key="yearOption" :value="yearOption" 
        >
          {{ yearOption }}
        </option>
      </select>
    </div>
    <div class="form-group__select-wrap mr-30">
      <select
        class="form-group__base form-group__select"
        v-model="month"
        @change="handleChange"
      >
        <option 
          v-for="monthOption in 12" :key="monthOption" :value="monthOption"
        >
          {{ monthOption }}
        </option>
      </select>
    </div>
    <div class="form-group__select-wrap">
      <select
        class="form-group__base form-group__select"
        v-model="day"
        @change="handleChange"
      >
        <option 
          v-for="dayOption in days" :key="dayOption" :value="dayOption"
        >
          {{ dayOption }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { computed, ref, toRefs } from '@vue/reactivity';
import { watch } from 'vue';
import { toJapaneseDateString } from '../../helpers/datetime';

export default defineComponent({
  props: {
    inputId: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const date = new Date();

    const { value: dateString } = toRefs(props);
    const year = ref<number>(date.getFullYear());
    const month = ref<number>(date.getMonth() + 1);
    const day = ref<number>(date.getDate());

    const dateResult = computed<string>(() => {
      return toJapaneseDateString(new Date(year.value, month.value - 1, day.value));
    });

    const days = computed<number>(() => {
      if (month.value === 2) {
        return isLeap(year.value) ? 29 : 28;
      }

      if (month.value === 4 || month.value === 6 || month.value === 9 || month.value === 11) {
        return 30;
      }

      return 31;
    })

    const getYears = () => {
      const year = new Date().getFullYear();
      return Array.from(
          { length: year - 1900 },
          (value, index) => 1901 + index
      ).reverse();
    };

    const years = getYears();

    const isLeap = (year: number): boolean => new Date(year, 1, 29).getDate() === 29;

    const handleChange = () => {
      context.emit('update:modelValue', dateResult.value);
    };

    watch(dateString, () => {
      if (!dateString) return;
      year.value = Number(dateString.value.split('-')[0]) || date.getFullYear();
      month.value = Number(dateString.value.split('-')[1]) || date.getMonth() + 1;
      day.value = Number(dateString.value.split('-')[2]) || date.getDate();
    }, { immediate: true });

    return {
      years,
      days,
      year,
      month,
      day,
      handleChange,
    };
  },
});
</script>

<style lang="scss" scoped>
  select.form-group__base.form-group__select {
    @media screen and (min-width: 768px) {
      border: 1px solid #E3E3E3;
    }
  }
</style>