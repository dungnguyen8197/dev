<template>
  <div class="form-group px-2 px-md-6 flex align-items-start">
    <label class="form-group__label">
      {{ label }}
      <TipsDropdown />
    </label>
    <div v-for="(option, index) in options" v-bind:key="index">
      <InputRadio :option="option" :inputName="inputName" :value="value" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import TipsDropdown from './TipsDropdown.vue';
import InputRadio from '~/components/form/InputRadio.vue';

@Component({ components: { TipsDropdown, InputRadio } })
export default class RoleInput extends Vue {
  @Prop() label: string | undefined;
  @Prop({ type: Array, default: () => [] }) options!: [];
  @Prop() inputName: string | undefined;
  @Prop([String, Number, Boolean]) value!: string | number | boolean;
}
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin: 1rem 0;

  &__label {
    display: block;
    font-size: 1.2rem;
    line-height: 1.4rem;
    color: var(--dark-blue);
    margin-top: 1.6rem;
    min-width: 18rem;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;

    &__label {
      width: 100%;
      margin-bottom: 0.8rem;
    }
  }
}
</style>
