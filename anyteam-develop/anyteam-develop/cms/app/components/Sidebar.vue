<template>
  <CSidebar fixed :minimize="minimized" :show="display" @update:show="(value) => (display = value)">
    <CSidebarBrand class="d-md-down-none" to="/"></CSidebarBrand>
    <CRenderFunction flat :content-to-render="nav" />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="minimized = !minimized"
    />
  </CSidebar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import nav from './_nav'
import { store } from '../store/'

@Component
export default class Sidebar extends Vue {
  nav = nav
  get display() {
    return store.sidebar.display
  }
  set display(value: boolean | string) {
    store.sidebar.setDisplay(value)
  }
  get minimized() {
    return store.sidebar.minimized
  }
  set minimized(value: boolean) {
    store.sidebar.setMinimized(value)
  }
}
</script>