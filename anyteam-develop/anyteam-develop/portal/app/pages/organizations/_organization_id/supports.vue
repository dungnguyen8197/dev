<template>
  <div>
    <Header title="売上確認" />
    <SearchInput v-if="is_group" placeholder="学校名で検索" buttonText="学校を探す" />
    <div class="flex justify-between align-items-center">
      <div class="flex align-items-center">
        <MonthSelect />
        <div v-if="is_group" class="support__sort">
          <RegionSelect />
        </div>
      </div>
      <Button>
        <span class="mr-1 icon icon-download icon-white icon-xl"></span>
        CSVダウンロード
      </Button>
    </div>
    <Statistics
      v-if="!is_group" v-bind:profit="6242190" v-bind:supporters="1190"
      v-bind:supportersListRoute="{
        name: 'organizations-organization_id-supporters',
        params: { organization_id: $route.params.organization_id }
      }"
    />
    <Table>
      <thead>
        <tr>
          <th width="50%">{{ !is_group ? 'チーム名' : '学校名' }}</th>
          <th width="10%">通常支援</th>
          <th width="10%">定額支援</th>
          <th width="15%">合計支援金額</th>
          <th width="15%"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in 20" v-bind:key="team">
          <td v-if="!is_group">運動高校サッカー部</td>
          <td v-else class="flex align-items-center">
            <img src="/school-avatar.png" alt="" class="support__school-avatar">
            <div>運動高校</div>
          </td>
          <td>201,000円</td>
          <td>201,000円</td>
          <td>201,000円</td>
          <td>
            <nuxt-link v-if="!is_group" v-bind:to="{
              name: 'organizations-organization_id-teams-team_id-supporters',
              params: {organization_id: $route.params.organization_id, team_id: 1}
            }">
              <div class="support__link">
                支援者リストを見る
              </div>
            </nuxt-link>
            <nuxt-link v-else v-bind:to="{
              name: 'organizations-organization_id-supporters',
              params: {organization_id: $route.params.organization_id}
            }">
              <div class="support__link">
                支援者一覧を見る
              </div>
            </nuxt-link>
          </td>
        </tr>
      </tbody>
    </Table>
    <Pagination
      v-if="is_group"
      v-bind:totalItems="100"
      v-bind:itemsPerPage="10"
      v-bind:activePage="activePage"
      v-on:updateActivePage="updateActivePage"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from "~/components/Header.vue";
import Button from "~/components/common/Button.vue";
import MonthSelect from "~/components/support/MonthSelect.vue";
import Statistics from "~/components/support/Statistics.vue";
import Table from "~/components/common/Table.vue";
import SearchInput from "~/components/form/SearchInput.vue";
import Pagination from "~/components/common/Pagination.vue";
import RegionSelect from "../../../components/common/RegionSelect.vue";

export default Vue.extend({
  head() {
    return {
      title: '売上確認'
    }
  },
  components: { Pagination, SearchInput, Table, Statistics, MonthSelect, Button, Header, RegionSelect },
  data() {
    return {
      is_group: this.$auth.user?.is_group_user,
      activePage: 1,
    }
  },
  methods: {
    updateActivePage(page: number) {
      this.activePage = page;
    }
  }
})
</script>

<style lang="scss" scoped>
.support {
  &__link {
    color: var(--primary);
    text-decoration: underline;
    text-decoration-color: var(--primary);
  }
  &__sort {
    font-size: 1.6rem;
    margin-left: 2rem;
  }
  &__school-avatar {
    width: 3.2rem;
    height: 3.2rem;
    object-fit: cover;
    margin-right: 1rem;
  }
}
</style>
