<template>
  <div class="com-accordion">
    <div v-for="item in items">
      <AccordionItem :item="item"></AccordionItem>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';
import AccordionItem from './AccordionItem.vue';
interface ItemInterface {
  title: String;
  content: String;
}
export default defineComponent({
  props: {
    items: {
      type: Array as () => ItemInterface[],
      default: [],
    },
  },
  setup() {
    const states = reactive({
      isShow: true,
    });
    const hide = () => {
      states.isShow = false;
    };
    return {
      states,
      hide,
    };
  },
  components: { AccordionItem },
});
</script>

<style lang="scss" scoped>
.com-accordion {
  font-size: 12px;
  &__title {
    padding: 14px 32px;
  }
}
</style>
