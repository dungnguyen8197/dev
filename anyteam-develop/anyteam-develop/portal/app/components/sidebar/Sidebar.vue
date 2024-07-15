<template>
  <div class="side-container">
    <header class="side-container__header">
      <nuxt-link v-bind:to="{ name: 'index'}">
        <h1 class="side-container__title">
          <span>ANYTEAM</span>
        </h1>
      </nuxt-link>
      <span @click="toggleMenu" class="side-container__menu-icon">
        <font-awesome-icon icon="bars"/>
      </span>
    </header>
    <transition name="slide">
      <nav v-bind:class="['side-container__list', {'open': isOpenSidebar}]" @click="closeMenu">
        <SidebarItem
          v-if="is_group"
          title="学校一覧"
          routeName="organizations"
          v-bind:activeNames="[
              'organizations',
            ]"
        />
        <SidebarItem
          v-if="is_group"
          title="アカウント管理"
          routeName="organizations-organization_id-organization-users"
          v-bind:routeParams="{organization_id}"
          v-bind:activeNames="[
              'organizations-organization_id-organization-users',
              'organizations-organization_id-organization-users-organization_user_id-edit',
              'organizations-organization_id-organization-users-create',
            ]"
        />
        <SidebarItem
          v-if="!is_group"
          title="学校情報"
          routeName="organizations-organization_id"
          v-bind:routeParams="{organization_id}"
          v-bind:activeNames="[
              'organizations-organization_id',
              'organizations-organization_id-edit',
            ]"
        />
        <SidebarItem
          v-if="!is_group"
          title="部活登録"
          routeName="organizations-organization_id-teams"
          v-bind:routeParams="{organization_id}"
          v-bind:activeNames="['organizations-organization_id-teams']"
        />
        <SidebarItem
          v-if="!is_group"
          title="支援金確認"
          routeName="organizations-organization_id-supports"
          v-bind:routeParams="{organization_id}"
          v-bind:activeNames="[
              'organizations-organization_id-supports',
            ]"
        />
        <SidebarItem
          v-if="!is_group"
          title="支援者一覧"
          routeName="organizations-organization_id-supporters"
          v-bind:routeParams="{organization_id}"
          v-bind:activeNames="[
              'organizations-organization_id-supporters',
              'organizations-organization_id-teams-team_id-supporters',
            ]"
        />
        <SidebarItem
          v-if="!is_group"
          title="アカウント管理"
          routeName="organizations-organization_id-organization-users"
          v-bind:routeParams="{organization_id}"
          v-bind:activeNames="[
              'organizations-organization_id-organization-users',
              'organizations-organization_id-organization-users-organization_user_id-edit',
              'organizations-organization_id-organization-users-create',
            ]"
        />
        <SidebarItem
          title="お知らせ"
          routeName="notices"
          v-bind:activeNames="['notices']"
        />
        <SidebarItem
          title="お問い合わせ"
          routeName="contact"
          v-bind:activeNames="['contact']"
        />
        <SidebarItem
          title="ログアウト"
          v-on:click.native="openLogoutModal"
        />
      </nav>
    </transition>
    <Modal
      v-if="isLogoutModalOpen"
      cancel
      closeButton
      buttonText="ログアウト"
      title="ログアウトしますか？"
      v-on:close="closeLogoutModal"
      v-on:confirm="doLogout"
    />
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import Modal from "~/components/common/Modal.vue";
import SidebarItem from "~/components/sidebar/SidebarItem.vue";

@Component({
  components: {SidebarItem, Modal}
})
export default class Sidebar extends Vue {
  isLogoutModalOpen: boolean = false;
  isOpenSidebar: boolean = false;
  organization_id: number = this.$auth.user!.organization_id as number;
  is_group: boolean = this.$auth.user!.is_group_user as boolean;

  async doLogout() {
    await this.$auth.logout();
  }

  closeLogoutModal() {
    this.isLogoutModalOpen = false;
  }

  openLogoutModal() {
    this.isLogoutModalOpen = true;
  }

  toggleMenu() {
    this.isOpenSidebar = !this.isOpenSidebar;
  }

  closeMenu() {
    this.isOpenSidebar = false;
  }
}
</script>

<style lang="scss" scoped>
.side-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: var(--light-gray);
  width: 24rem;

  &__header > a {
    text-decoration: none;
  }

  &__title {
    margin: 0;
    padding: 4.8rem 3.6rem;
    font-size: 3.2rem;
    font-weight: 600;
    color: var(--primary);
  }

  &__menu-icon {
    display: none;
  }

  @media screen and (max-width: 1008px) {
    width: 100vw;
    position: fixed;
    height: 8.5rem;

    &__header {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      padding: 2.4rem;
    }

    &__menu-icon {
      display: block;
      font-size: 3.6rem;
      padding: 2.4rem 3rem 2.4rem;
      cursor: pointer;
    }

    &__list {
      display: none;
      animation: growDown 200ms ease-in-out;
      transform-origin: top center;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      &.open {
        display: block;
      }
    }
  }
}

@keyframes growDown {
  0% {
    transform: scaleY(0)
  }
  100% {
    transform: scaleY(1)
  }
}
</style>
