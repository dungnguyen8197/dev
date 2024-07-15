<template>
  <div class="flex items-center">
    <input
      class="code__field"
      @input="handleFieldInput($event)"
      :ref="inputRefs[0]"
      data-id="0"
      v-model="codeFields[0].value"
    />
    <span class="mx-7">-</span>
    <input
      class="code__field"
      @input="handleFieldInput($event)"
      :ref="inputRefs[1]"
      data-id="1"
      v-model="codeFields[1].value"
    />
  </div>
</template>

<script lang="ts">
import {ref, computed, reactive, toRefs} from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';
import { watch } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const codeFields = reactive([
      {value: '', maxLength: 3},
      {value: '', maxLength: 4},
    ]);
    const inputRefs = ref([
      ref<HTMLInputElement>(),
      ref<HTMLInputElement>(),
    ]);
    const { value: code } = toRefs(props);

    watch(code, () => {
      if (!code.value) return;
      codeFields[0].value = props.value.split('-')[0];
      codeFields[1].value = props.value.split('-')[1];
    }, { immediate: true });

    const handleChange = () => {
      context.emit('update:modelValue', computedValue.value);
    };

    const numberFilter = (index: number) => {
      codeFields[index].value = codeFields[index].value.replace(/[^0-9]/g, '');
    }

    const handleFieldInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      let value = input.value;
      let index = parseInt(input.dataset.id as string);

      numberFilter(index);

      const field = codeFields[index];
      if (!field) return;

      if (field.value.length >= field.maxLength) {
        e.preventDefault();
        field.value = value.slice(0, field.maxLength);
        focusNextInput(index);
      }

      handleChange();
    }

    const focusNextInput = (currentIndex: number) => {
      try {
        const nextField = codeFields[currentIndex + 1];
        if (nextField) {
          (inputRefs.value[currentIndex + 1].value as HTMLInputElement).focus();
        }
      } catch (error) {
      }
    }

    const computedValue = computed(() => {
      return codeFields.map((field) => field.value).join("-");
    });
    
    return {
      codeFields,
      inputRefs,
      handleChange,
      handleFieldInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.code__field {
  width: 80px;
  height: 4.2rem;
  font-size: 1.4rem;
  border: none;
  background-color: var(--white-color);
  padding: 0;
  text-indent: 1.2rem;
  border-radius: 4px;
  &::placeholder {
    color: var(--dark-gray-color);
  }
  @media screen and (min-width: 768px) {
    border: 1px solid #E3E3E3;
  }
}
</style>