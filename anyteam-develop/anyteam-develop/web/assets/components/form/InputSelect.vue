<template>
  <div :id="inputId" class="form-group__select-wrap" :class="className">
    <select
      class="form-group__base form-group__select"
      @change="handleChange($event)"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :selected="option.value === value"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from '@vue/runtime-core';
import { OptionInterface } from '../../types/select-option';

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
    placeholder: {
      type: String,
      default: "",
    },
    value: {},
    options: {
      type: Array as PropType<OptionInterface[]>,
      required: true,
      default: [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      context.emit("update:modelValue", target.value);
    };

    return {
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