<template>
  <div>
    <div class="com-menu">
      <ul class="com-menu__items">
        <li class="com-menu__item" v-for="(menu, index) in menus" :key="index" v-bind:class="{'active': checkActive(menu.active)}">
          <a :href="menu.link" class="com-menu__link" @click="menu.click">
            <span class="com-menu__icon"><img :src="menu.icon" /></span>
            <span class="com-menu__name">{{ menu.name }}</span>
            <span class="com-menu__arrow"
              ><img src="/public/images/common/icon-arrow-right.svg"
            /></span>
          </a>
        </li>
      </ul>
    </div>
    <Modal v-show="states.showConfirmLogout">
      <div class="text-center font-15">ログアウトしますか？</div>
      <div class="text-center mt-22">
        <button class="btn btn-secondary btn-wide" @click="logout">はい</button>
      </div>
      <div class="text-center">
        <a
          href="#"
          @click="() => (states.showConfirmLogout = false)"
          class="text-sm text-deco-none text-dark-gray mt-15 d-inline-block"
          >キャンセル</a
        >
      </div>
    </Modal>
    <Modal v-show="states.logoutError">
      <div class="text-center font-15">{{ logoutFailureMessage }}</div>
      <div class="text-center mt-22">
        <button
          class="btn btn-secondary btn-wide"
          @click="
            () => {
              states.logoutError = false;
            }
          "
        >
          はい
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { reactive } from '@vue/reactivity';
import Modal from '../../Modal.vue';
import { userLogout } from '../../../api/users';
import { logoutFailureMessage } from '../../../constants/messages';

export default defineComponent({
  components: { Modal },
  setup() {
    const states = reactive({
      showConfirmLogout: false,
      logoutError: false,
    });
    const menus = [
      {
        icon: '/public/images/sidebar/icon-menu-user.svg',
        name: '会員情報',
        link: '/user/profile',
        active: ['/user/profile', '/user/withdrawal'],
      },
      {
        icon: '/public/images/sidebar/icon-menu-email.svg',
        name: 'メールアドレス変更',
        link: '/user/email',
        active: ['/user/email', '/user/email/verify'],
      },
      {
        icon: '/public/images/sidebar/icon-menu-unlock.svg',
        name: 'パスワード変更',
        link: '/user/password',
        active: ['/user/password'],
      },
      {
        icon: '/public/images/sidebar/icon-menu-support.svg',
        name: '支援履歴',
        link: '/user/supports',
        active: ['/user/supports'],
      },
      {
        icon: '/public/images/sidebar/icon-menu-payment.svg',
        name: '決済情報',
        link: '/user/wallet',
        active: ['/user/wallet', '/user/wallet/edit'],
      },
      {
        icon: '/public/images/sidebar/icon-menu-logout.svg',
        name: 'ログアウト',
        link: '#',
        active: [],
        click: () => {
          states.showConfirmLogout = true;
        },
      },
    ];

    const checkActive = (activePaths: string[]): boolean => {
      const path = window.location.pathname;
      return activePaths.includes(path);
    } 

    const logout = async (): Promise<void> => {
      try {
        states.logoutError = false;
        await userLogout();
        window.location.href = '/user/login';
      } catch (e) {
        states.logoutError = true;
      } finally {
        states.showConfirmLogout = false;
      }
    };


    return {
      states,
      menus,
      logoutFailureMessage,
      checkActive,
      logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.com-menu {
  &__items {
    list-style: none;
    margin: auto;
    padding: 0;
    border-top: 1px solid var(--light-color);
  }
  &__link {
    text-decoration: none;
    color: var(--primary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__item {
    padding: 18px 16px;
    border-bottom: 1px solid var(--light-color);
    &.active {
      background-color: var(--light-color);
    }
  }
  &__icon {
    margin-right: 8px;
    flex: 0 0 20px;
    img {
      display: block;
    }
  }
  &__name {
    font-size: 15px;
    width: 100%;
    margin-left: 0;
  }
  &__arrow {
    flex: 0 0 20px;
    display: flex;
    justify-content: end;
  }
}
</style>
