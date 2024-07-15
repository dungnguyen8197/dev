<template>
  <div>
    <PageHeader
      background="/public/images/organizations/img-header-school.png"
      :title="organization.name"
    >
      <template v-slot:icons>
        <PageHeaderIcon
          :region="organization.region_name"
          :type="organization.division_type_name"
        ></PageHeaderIcon>
      </template>
    </PageHeader>
    <BreadcrumbMenu :paths="breadcrumb"></BreadcrumbMenu>
    <div class="container organization__container">
      <div class="organization__section">
        <Alert class="mb-30">
          {{ organization.name }}の運動部へのご支援を受け付けています。一覧からご支援先の運動部をお選びください。
        </Alert>
      </div>
      <div class="mb-30">
        <h3 class="organization__section text-normal">部活一覧</h3>
        <div class="bg-light">
          <div class="organization__teams">
            <ClubActivities :list="clubActivities" :organization-id="organization.id"></ClubActivities>
          </div>
        </div>
      </div>
      <div class="organization__section">
        <h3 class="m-0 text-normal">支援者一覧</h3>
        <div>
          <div v-if="isAuthen" class="organization__supporters">
            <TeamActivitySupporters
              :supporters="supporters"
              :supporters-url="`/organizations/${organization.id}/supporters`"
            />
          </div>
          <Alert v-else>
            部活を支援すると、{{ organization.name }}の支援者一覧を見ることができます。閲覧するにはログインが必要です。
          </Alert>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import PageHeader from '../../components/common/page/PageHeader.vue';
import ClubActivities from '../../components/common/organizations/ClubActivities.vue';
import { defineComponent, inject } from '@vue/runtime-core';
import PageHeaderIcon from './PageHeaderIcon.vue';
import { OrganizationObject, OrganizationActivitiesObject } from '../../types/organization';
import BreadcrumbMenu from '../../components/breadcrumb/BreadcrumbMenu.vue';
import Alert from '../../components/alerts/Alert.vue';
import Footer from "../../components/Footer.vue";
import { Supporter } from '../../types/support/supporter';
import SupporterList from '../../components/common/supporter/SupporterList.vue';
import TeamActivitySupporters from '../../components/common/organizations/TeamActivitySupporters.vue';

export default defineComponent({
  components: {
    PageHeader,
    ClubActivities,
    PageHeaderIcon,
    BreadcrumbMenu,
    Alert,
    Footer,
    SupporterList,
    TeamActivitySupporters
},
  setup() {
    const appData = inject('$appData') as {
      organization: OrganizationObject;
      organizationActivities: OrganizationActivitiesObject;
      isAuthen: boolean;  
    };
    const isAuthen = appData.isAuthen;
    const organization = appData.organization;
    const breadcrumb = [
      { url: '/', text: 'トップ' },
      { url: '', text: organization.name },
    ];
    const clubActivities = appData.organizationActivities.list;
    const supporters: Supporter[] = [
      {
        id: 1,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 10797000,
      },
      {
        id: 2,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 3,
        icon: "",
        name: "長い名前の場合は改行を入れて対応します長い名前の場合",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 4,
        icon: "",
        name: "遠藤啓太",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
      {
        id: 5,
        icon: "",
        name: "長い名前の場合は改行を入れて対応します長い名前の場合",
        regionName: "東京",
        active: '30代',
        createdAt: '2021/11/30',
        amount: 100000,
      },
    ];

    return {
      isAuthen,
      organization,
      breadcrumb,
      clubActivities,
      supporters,
    };
  },
});
</script>

<style lang="scss" scoped>
.organization {
  &__section,
  &__teams {
    width: 100%;
    margin: 0 auto;
    max-width: 720px;
  }
  &__link {
    text-decoration-color: var(--secondary-color);
  }
  &__supporters {
    margin-left: -16px;
    margin-right: -16px;
  }
}
@media screen and (min-width: 768px) {
  .container {
    padding-left: 0;
    padding-right: 0;
  }
  .organization {
    &__container {
      margin-bottom: 40px;
    }
  }
}
</style>
