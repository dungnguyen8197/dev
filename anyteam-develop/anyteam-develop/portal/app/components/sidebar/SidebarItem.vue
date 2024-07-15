<template>
    <nuxt-link v-bind:to="{ name: routeName, params: routeParams, }">
        <div 
          class="side-container__list-item flex align-items-center justify-between" 
          v-bind:class="{'active': isActive()}"
        >
          {{ title }}
          <span class="icon icon-arrow-right" v-bind:class="{'icon-white': isActive()}">
          </span>
        </div>
    </nuxt-link>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
  @Prop(String) readonly title!: string;
  @Prop(String) readonly routeName: string | undefined;
  @Prop(Object) readonly routeParams: Object | undefined;
  @Prop(Array) readonly activeNames: string[] | undefined;

  isActive(): boolean {
    if (typeof this.$route.name !== 'string' || !this.activeNames) return false;
    return this.activeNames.includes(this.$route.name);
  }
}
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
 .side-container__list {
    &-item {
      background-color: var(--light-gray);
      border-bottom: 1px solid #eff3f8;
      font-size: 1.6rem;
      color: var(--dark-blue);
      line-height: 5.6rem;
      height: 5.6rem;
      padding-left: 2.4rem;
      padding-right: 2.4rem;
      cursor: pointer;
      transition-duration: 200ms;

      &.active {
        background-color: var(--dark-blue);
        color: var(--white);
        padding-left: 4rem;
        padding-right: 0.8rem;
      }
    }
  }
</style>
