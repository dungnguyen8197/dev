<template>
  <div class="container">
    <Header v-bind:title="organization.name" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '~/components/Header.vue'
import { getOrganizationById } from '~/api/organizations';
import { OrganizationResponse } from '~/interfaces/response/organization';

export default Vue.extend({
  name: 'Index',
  data() {
    return {
      organization: {} as OrganizationResponse,
    }
  },
  components: {
    Header,
  },
  async created(): Promise<void> {
    try {
      const organizationId = this.$auth.user!.organization_id as number;
      this.organization = await getOrganizationById(organizationId);
    } catch (e) {}
  }
})
</script>

<style>
</style>

