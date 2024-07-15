<template>
  <div class="control">
    <input
      type="radio"
      :id="option.id"
      :value="option.valueOption"
      :name="inputName"
      :checked="option.valueOption === value"
      @input="$parent.$emit('input', option.valueOption)"
    />
    <label :for="option.key" class="label-radio">{{ option.label }}</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class InputRadio extends Vue {
  @Prop({ type: Object, default: () => {} }) option!: {};
  @Prop() inputName: string | undefined;
  @Prop([String, Number, Boolean]) value!: string | number | boolean;
}
</script>

<style lang="scss" scoped>
.control {
  flex: 1;
  margin-top: 1.6rem;
}
.label-radio {
  vertical-align: top;
  padding-right: 15px;
}
</style>
