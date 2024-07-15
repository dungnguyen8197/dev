<template>
  <CDropdown in-nav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0">
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem>Setting</CDropdownItem>
    <CDropdownItem @click.prevent="logOut">Logout</CDropdownItem>
  </CDropdown>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class HeaderDropdown extends Vue {
  itemsCount: number = 42

  logOut(): void {
    this.$auth.logout();
  }
}

</script>
