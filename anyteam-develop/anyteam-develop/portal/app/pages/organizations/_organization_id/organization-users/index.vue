<template>
  <div>
    <Header title="アカウント管理" />
    <div class="flex justify-end">
      <nuxt-link
        v-bind:to="{
          name: 'organizations-organization_id-organization-users-create',
          params: {organization_id: organizationId}
        }"
      >
        <Button>
          <span class="mr-1 icon icon-plus icon-white"></span>
          <span>新規追加</span>
        </Button>
      </nuxt-link>
    </div>
    <Table>
      <thead>
        <tr>
          <th width="15%">名前</th>
          <th width="40%">メール</th>
          <th width="35%" class="text-left pr-1.5">
            権限
            <TipsDropdown />
          </th>
          <th width="10%" class="center">アクション</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" v-bind:key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role_label }}</td>
          <td class="center">
            <div class="flex justify-around">
              <nuxt-link
                v-if="loginRole === adminRole || user.id === userId"
                v-bind:to="{
                  name: 'organizations-organization_id-organization-users-organization_user_id-edit',
                  params: {organization_id: organizationId, organization_user_id: user.id}
                }"
              >
                <Button size="sm" outline style="color: var(--dark-blue); background-color: var(--light-gray); border: none;">
                  編集
                </Button>
              </nuxt-link>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '~/components/Header.vue';
import Button from '~/components/common/Button.vue';
import Table from '~/components/common/Table.vue';
import { OrganizationUser } from '~/interfaces/response/organization-users';
import { getOrganizationUsers } from '~/api/organization-user';
import TipsDropdown from "~/components/organization/organization-users/TipsDropdown.vue";
import { ADMIN_ROLE } from '~/constants/organization_user';

export default Vue.extend({
  head() {
    return {
      title: 'アカウント管理',
    };
  },
  middleware: ['forbidden'],
  components: {Table, Button, Header, TipsDropdown},

  data() {
    return {
      userId: this.$auth.user!.id as number,
      loginRole: this.$auth.user!.role as number,
      organizationId: this.$auth.user!.organization_id as number,
      users: [] as OrganizationUser[],
      adminRole: ADMIN_ROLE
    };
  },
  methods: {
    async fetchUsers() {
      try {
      const res = await getOrganizationUsers(this.organizationId);
      this.users = res.list;
    } catch (e) {}
    },
  },
  async created(): Promise<void> {
    await this.fetchUsers();
  }
})
</script>
