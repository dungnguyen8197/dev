<template>
  <div class="activity-step">
    <div class="activity-step__image">
      <img :src="image" alt="image" />
    </div>
    <h4 class="activity-step__title">{{ name }}</h4>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
      default: '',
    },
    image: {
      type: String,
      required: true,
      default: '',
    }
  },
});
</script>
<style lang="scss" scope>
.activity-step {
  display: flex;
  min-width: 150px;
  margin: 0.3rem;
  padding: 5px 10px;
  align-items: center;
  background-color: var(--white-color);
  &__image{
      margin-right: 15px;
  }
  &__title{
    font-size: 12px;
  }
}
</style>
