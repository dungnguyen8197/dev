<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination__wrap">
      <span 
        v-if="activePage !== 1" 
        class="pagination__arrow flex justify-center align-items-center icon icon-arrow-left icon-lg"
        v-on:click="internalActivePage--"  
      >
      </span>
      <div class="flex" v-for="page in displayedPages" v-bind:key="page">
        <p 
          v-if="page === totalPages && displayedPages[displayedPages.length - 2] !== totalPages - 1" 
          class="pagination__ellipsis">
          ...
        </p>
        <button
          class="pagination__item"
          v-bind:data-value="page"
          v-bind:class="{active: activePage === page}"
          v-on:click="() => { internalActivePage = page; }"
        >
          {{ page }}
        </button>
        <p v-if="page === 1 && displayedPages[1] !== 2" class="pagination__ellipsis">...</p>
      </div>
      <span 
        v-if="activePage !== totalPages && totalPages > 0" 
        class="pagination__arrow flex justify-center align-items-center icon icon-arrow-right icon-lg"
        v-on:click="internalActivePage++"
      >
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Pagination extends Vue {
  @Prop(Number) totalItems!: number;
  @Prop(Number) itemsPerPage!: number;
  @Prop(Number) activePage!: number;

  internalActivePage = this.activePage;

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get displayedPages(): number[] {
    if (this.totalPages <= 7) {
      return [...Array(this.totalPages).keys()].map(i => i + 1);
    }

    if (this.totalPages > 7 && this.activePage <= 4) {
      return [1, 2, 3, 4, 5, this.totalPages];
    }

    if (this.totalPages > 7 && this.activePage >= this.totalPages - 3) {
      return [1, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
    }

    return [1, this.activePage - 1, this.activePage, this.activePage + 1, this.totalPages];
  }

  @Emit("updateActivePage")
  updateActivePage(): number {
    return this.internalActivePage;
  }

  @Watch('internalActivePage')
  onPageChange() {
    this.updateActivePage();
  }
}
</script>

<style lang="scss" scoped>
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 4rem;

    &__wrap { 
      display: flex;
      justify-content: center;
      min-width: 35rem;
      color: var(--gray);
    }

    &__item {
      width: 3.4rem;
      height: 3.8rem;
      padding: 0.1rem 0.3rem;
      margin: 0 0.8rem;
      font-size: 1.4rem;
      color: var(--gray);
      background-color: var(--white);
      border-radius: 0.2rem;
      border: 1px solid var(--gray);
      cursor: pointer;
      transition-duration: 200ms;
      &.active {
        border: var(--dark-blue);
        background-color: var(--dark-blue);
        color: var(--white);
      }
    }

    &__ellipsis {
      height: 3.8rem;
      font-size: 1.6rem;
      letter-spacing: 0.2rem;
      margin: 0.8rem 0.8rem 0;
      font-weight: bold;
    }

    &__arrow {
      cursor: pointer;
      width: 3.8rem;
      height: 3.8rem;
    }
  }
</style>
