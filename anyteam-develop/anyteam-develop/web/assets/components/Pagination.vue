<template>
  <div class="flex items-center justify-center">
    <div 
      class="flex items-center justify-center pagination__arrow"
      v-if="activePage > 1"
      @click="() => { changePage(activePage - 1) }"
    >
      <img src="/public/images/common/icon-arrow-left.svg" alt="arrow left" />
    </div>
    <div v-for="page in displayPages" :key="page" class="flex">
      <span 
        v-if="page === totalPages && displayPages[displayPages.length - 2] !== totalPages - 1"
        class="pagination__ellipsis"
      >
        ...
      </span>
      <div 
        class="pagination__button" 
        :class="{ 'active': activePage === page }"
        @click="() => { changePage(page) }"
      >{{ page }}</div>
      <span v-if="page === 1 && displayPages[1] !== 2" class="pagination__ellipsis">...</span>
    </div>
    <div 
      class="flex items-center justify-center pagination__arrow"
      v-if="activePage < totalPages"
      @click="() => { changePage(activePage + 1) }"
    >
      <img src="/public/images/common/icon-arrow-right.svg" alt="arrow right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";

export default defineComponent({
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    activePage: {
      type: Number,
      required: true
    }
  },
  emits: [
    'update:active-page',
  ],
  setup(props, context) {
    const totalPages = computed<number>(() => Math.ceil(props.totalItems / props.itemsPerPage));
    const displayPages = computed<number[]>(() => {
      if (totalPages.value <= 7) {
        return Array.from(Array(totalPages.value).keys()).map((i: number) => i + 1);
      }

      if (totalPages.value > 7 && props.activePage <= 4) {
        return [1, 2, 3, 4, 5, totalPages.value];
      }

      if (totalPages.value > 7 && props.activePage >= totalPages.value - 3) {
        return [
          1,
          totalPages.value - 4,
          totalPages.value - 3,
          totalPages.value - 2,
          totalPages.value - 1,
          totalPages.value
        ];
      }

      return [1, props.activePage - 1, props.activePage, props.activePage + 1, totalPages.value];
    })

    const changePage = (page: number) => {
      context.emit('update:active-page', page);
    }

    return { 
      displayPages,
      totalPages,
      changePage,
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination {
  &__arrow {
    width: 3rem;
    height: 3.4rem;
    cursor: pointer;
    & > img {
      width: 1.4rem;
      height: 1.4rem;
    }
  }

  &__ellipsis {
    margin-top: 6px;
    color: var(--dark-gray-color);
  }

  &__button {
    width: 30px;
    height: 34px;
    margin: 0 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    cursor: pointer;
    border: 1px solid var(--border-gray);
    background-color: var(--white-color);
    color: var(--dark-gray-color);
    font-size: 1.4rem;
    line-height: 2rem;

    &.active {
      border: 1px solid var(--secondary-color);
      background-color: var(--secondary-color);
      color: var(--white-color);
    }
  }
}
</style>