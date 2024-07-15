<template>
  <div class="flex align-items-center supporter">
    <img class="supporter__avatar" v-bind:src="image" alt="">
    <div>
      <h4 class="supporter__name">{{ name }}</h4>
      <p class="supporter__description">{{ region }}/{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from "vue-property-decorator";

@Component
export default class SupporterInfo extends Vue {
  @Prop(String) name!: string;
  @Prop(String) region!: string;
  @Prop(String) description!: string;
  @Prop({ type: String, default: '/user-avatar.png' }) image!: string;
}
</script>

<style lang="scss" scoped>
.supporter {
  margin: 0.4rem 0;
  &__avatar {
    width: 3.6rem;
    height: 3.6rem;
    object-fit: cover;
  }

  &__name,
  &__description {
    font-weight: normal;
    margin: 0 0 0 1rem;
  }

  &__description {
    font-size: 1.2rem;
  }
}
</style>
