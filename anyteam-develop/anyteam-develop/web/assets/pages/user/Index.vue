<template>
  <div>
    <PageTitle title="マイページ" class="px-16" />
    <Menu></Menu>
    <Footer class="mt-90"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
} from '@vue/runtime-core';
import PageTitle from '../../components/common/page/PageTitle.vue';
import Menu from '../../components/common/sidebar/Menu.vue';
import { UserProfileRO } from '../../types/user/profile';
import Footer from '../../components/Footer.vue';

interface UserInterface {
  name: string;
  defaultAvatar: string;
  avatar: string;
}

export default defineComponent({
  components: { PageTitle, Menu, Footer },
  setup() {
    const user = reactive<UserInterface>({
      name: '山田太郎',
      defaultAvatar: '/public/images/common/icon-avatar-default.svg',
      avatar: '',
    });

    onMounted(async () => {
      // get user info
      const $appData = inject('$appData') as UserProfileRO;
      if ($appData.firstname) {
        user.name = $appData.lastname + $appData.firstname;
        user.avatar = $appData.thumbnail_url;
      }
    });

    return { user };
  },
});
</script>
<style lang="scss" scoped>
.com-user-profile {
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin: 32px 0 24px;
  &__avatar {
    width: 48px;
    height: 48px;
    overflow: hidden;
    border-radius: 100%;
    margin-right: 12px;
    flex: 0 0 48px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
  &__name {
    font-size: 18px;
  }
}
</style>
