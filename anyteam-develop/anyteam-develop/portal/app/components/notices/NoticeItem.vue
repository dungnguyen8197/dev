<template>
  <div>
    <div class="notice">
      <p class="notice__date">{{ date }}</p>
      <router-link to="#" class="notice__link">{{ title }}</router-link>
    </div>
    <Divider />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Divider from "~/components/common/Divider.vue";
@Component({
  components: {
    Divider
  }
})
export default class NoticeItem extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly date: string | undefined;
}
</script>

<style lang="scss" scoped>
  .notice {
    padding: 1.5rem 2rem;

    @media screen and (min-width: 768px) {
      padding: 1.5rem 6rem;
    }

    &__date {
      font-size: 1.4rem;
      margin: 0.5rem 0;
      color: #333;
    }

    &__link {
      color: var(--dark-blue);
      font-size: 1.6rem;
    }
  }
</style>
