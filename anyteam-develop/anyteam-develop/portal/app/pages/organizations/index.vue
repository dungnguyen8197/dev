<template>
  <div>
    <Header title="学校一覧" />
    <SearchInput placeholder="学校名で検索" buttonText="学校を探す" v-on:updateInput="updateSearchName"/>
    <Table>
      <thead>
        <tr>
          <th class="school__name-col">学校名</th>
          <th><RegionSelect v-on:updateRegion="updateSearchRegion"/></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="organization in organizationsPaginate.list" v-bind:key="organization.id">
          <td>
            <nuxt-link v-bind:to="{ name: 'organizations-organization_id', params: {organization_id: organization.id}}">
              <div class="flex align-items-center">
                <img 
                  v-bind:src="organization.icon || '/school-avatar.png'" alt="" class="mr-1 school__avatar"
                  onerror="this.onerror=null; this.src='/school-avatar.png'"
                />
                <span class="school__name">{{ organization.name }}</span>
              </div>
            </nuxt-link>
          </td>
          <td>
            {{ organization.region_name }}
          </td>
        </tr>
      </tbody>
    </Table>
    <Pagination
      v-bind:totalItems="organizationsPaginate.total"
      v-bind:itemsPerPage="itemsPerPage"
      v-bind:activePage="activePage"
      v-on:updateActivePage="updateActivePage"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "~/components/Header.vue";
import InputText from "~/components/form/InputText.vue";
import Button from "~/components/common/Button.vue";
import Table from "~/components/common/Table.vue";
import Pagination from "~/components/common/Pagination.vue";
import SearchInput from "~/components/form/SearchInput.vue";
import RegionSelect from "../../components/common/RegionSelect.vue";
import { ORGANIZATIONS_PER_PAGE } from "~/constants/pagination";
import { OrganizationsPaginate } from "~/interfaces/response/organization";
import { OrganizationsSearchTerm } from "~/interfaces/searchTerm";
import { getOrganizations } from "~/api/organizations";

export default Vue.extend({
  components: { SearchInput, Pagination, Table, Button, InputText, Header, RegionSelect },
  head() {
    return {
      title: "学校一覧"
    };
  },
  data() {
    return {
      itemsPerPage: ORGANIZATIONS_PER_PAGE,
      activePage: 1,
      organizationsPaginate: {
        list: [],
        total: 0,
      } as OrganizationsPaginate,
      searchTerm: {} as OrganizationsSearchTerm,
    }
  },
  methods: {
    async updateActivePage(page: number): Promise<void> {
      this.activePage = page;
      await this.getOrganizationsPaginate();
    },
    async getOrganizationsPaginate(): Promise<void> {
      try {
        this.organizationsPaginate = await getOrganizations(this.activePage, this.searchTerm);
      } catch (e) {}
    },
    async updateSearchName(searchName: string): Promise<void> {
      this.searchTerm.name = searchName;
      this.activePage = 1;
      await this.getOrganizationsPaginate();
    },
    async updateSearchRegion(searchRegion: string): Promise<void> {
      this.searchTerm.region_id = searchRegion;
      this.activePage = 1;
      await this.getOrganizationsPaginate();
    },
  },
  async created(): Promise<void> {
    await this.getOrganizationsPaginate();
  },
})
</script>

<style lang="scss" scoped>
.school {
  &__name {
    text-decoration: underline;
    color: var(--dark-blue);
    text-decoration-color: var(--dark-blue);

    &-col {
      width: 20rem;
    }
  }

  &__avatar {
    width: 3.2rem;
    height: 3.2rem;
    margin: 1.4rem 1.4rem 1.4rem 0;
    object-fit: cover;
  }
}
</style>
